<style scoped>
  .map-path {
    margin-bottom: 10px;
  }

  h3 {
    padding-left: 10px;
  }

  .map__checkbox {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 4px 6px;
    background: #fff;
    border-radius: 2px;
    z-index: 2;
  }
</style>
<template>
  <div>
    <div v-show="!isHasPath" class="empty-info mini">暂无轨迹信息</div>
    <div v-show="isHasPath" style="position: relative">
      <div class="map__checkbox" v-show="showPoint">
        <el-checkbox size="mini" v-model="isShowTemp">标题</el-checkbox>
      </div>
      <el-amap ref="pathMap" :vid="vid" :amap-manager="amapManager"
               :style="mapStyle" :zoom="10" class="map-path">
      </el-amap>
      <!--<el-checkbox v-show="vid!=='waybillMap'" class="map-btn" size="mini" v-model="isShowTemp" label="1" border>温度-->
      <!--</el-checkbox>-->
    </div>
  </div>
</template>
<script>
  import {AMapManager} from 'vue-amap';
  import MapMixin from '@/mixins/mapMixin';

  const StartIndex = 'StartIndex';
  const CurrentIndex = 'CurrentIndex';
  const EndIndex = 'EndIndex';
  const markerIconLabel = {
    StartIndex: '',
    CurrentIndex: '',
    EndIndex: ''
  };
  const markerIconLabelColor = {
    StartIndex: 'lightgreen',
    CurrentIndex: 'darkblue',
    EndIndex: 'darkblue'
  };
  export default {
    props: {
      formItem: Object,
      showBigMap: Function,
      mapStyle: {
        type: Object,
        default() {
          return {
            height: '200px'
          };
        }
      },
      vid: {
        type: String,
        default: 'pathMap'
      },
      showPoint: Boolean
    },
    mixins: [MapMixin],
    data() {
      return {
        amapManager: new AMapManager(),
        pathSimplifierIns: null,
        isHasPath: false,
        points: [],
        isShowTemp: false,
        timers: [],
        simpleMarkers: []
      };
    },
    watch: {
      formItem(val) {
        this.timers.forEach(i => {
          window.clearTimeout(i);
        });
        this.points = [];
        this.amapManager._map && this.amapManager._map.clearMap();
        this.pathSimplifierIns && this.pathSimplifierIns.setData([]);
        if (!val || !val.id) return;
        this.queryPath();
      },
      isShowTemp(val) {
        this.removeSimpleMarkers(this.simpleMarkers);
        if (val) {
          this.simpleMarkers = [];
          // 画点
          this.drawPoint(this.points);
        }
      }
    },
    mounted() {
      this.addMapTools();
    },
    methods: {
      removeSimpleMarkers(list, limit = 20, index = 0) {
        let childList = list.slice(index * limit, limit * (index + 1));
        if (!childList.length) return;
        this.amapManager._map && this.amapManager._map.remove(childList);
        index++;
        setTimeout(() => {
          this.removeSimpleMarkers(list, limit, index);
        }, 20);
      },
      queryPath() {
        this.$http.get(`/track-transportation/waybill/${this.formItem.id}`).then(res => {
          const points = res.data.filter(f => f.longitude && f.latitude).map((m, index) => {
            return {
              lnglat: [m.longitude, m.latitude],
              time: this.$moment(m.collectionTime).format('YYYY-MM-DD HH:mm:ss'),
              name: this.formItem.arriveAddress,
              m
            };
          });
          this.drawHandler(points);
          // 转换坐标
          // this.convertForm(points, this.drawHandler, points);
        });
      },
      drawHandler(points) {
        this.points = points;
        this.isHasPath = !!points.length;
        this.amapManager._map.clearMap();
        // 轨迹
        this.drawPath(points);
      },
      // 转换坐标
      convertForm(prePoints, cb, totalPoints) {
        if (!prePoints.length) {
          cb(totalPoints);
          return;
        }
        let points = [];
        let nextPoints = [];
        const limit = 40;
        points = prePoints.slice(0, prePoints.length > limit ? limit : prePoints.length);
        nextPoints = prePoints.length > limit ? prePoints.slice(limit) : [];
        window.AMap.convertFrom(points.map(m => m.lnglat), 'baidu', (status, result) => {
          if (result.info === 'ok') {
            points.forEach((i, index) => {
              i.lnglat = [result.locations[index].lng, result.locations[index].lat];
            });
          }
          this.convertForm(nextPoints, cb, totalPoints);
        });
      },
      // 画线
      drawPath(points) {
        if (!points.length) return;
        window.AMapUI.loadUI(['misc/PathSimplifier'], PathSimplifier => {
          const pathSimplifierIns = this.pathSimplifierIns ? this.pathSimplifierIns : this.createPathSimplifier(PathSimplifier);
          pathSimplifierIns.setData([{points}]);
          pathSimplifierIns.setSelectedPathIndex(0);
          // 点自适应窗口
          this.amapManager._map.setFitView();
        });
      },
      // 创建轨迹线对象
      createPathSimplifier(PathSimplifier) {
        const that = this;
        const pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          map: this.amapManager._map, //所属的地图实例
          getPath: function (pathData, pathIndex) {
            let points = pathData.points;
            let lnglatList = [];
            for (let i = 0, len = points.length; i < len; i++) {
              lnglatList.push(points[i].lnglat);
            }
            return lnglatList;
          },
          getHoverTitle: function (pathData, pathIndex, pointIndex) {
            // 勾选温度标签
            if (that.stateIsShowTemp) return '';
            // 不在点上
            if (!pointIndex) return '';
            return that.getPointLabel(pathData.points[pathIndex]);
          },
          renderOptions: {
            hoverTitleStyle: {
              classNames: 'marker-hover-title'
            }
          }
        });
        this.pathSimplifierIns = pathSimplifierIns;
        return pathSimplifierIns;
      },
      getPointLabel(point) {
        return this.formatLabel(point);
      },
      drawPoint(points, isNotFirst) {
        if (this.vid === 'waybillMap') return;
        if (!points.length) return;
        let prePoints = [];
        let nextPoints = [];
        const limit = 10;
        prePoints = points.slice(0, points.length > limit ? limit : points.length);
        nextPoints = points.length > limit ? points.slice(limit) : [];
        const makers = prePoints.map(m => m);
        makers.forEach((i, index) => {
          this.createSvgMarker(i, false);
        });
        this.timers.push(setTimeout(() => {
          this.drawPoint(nextPoints, true);
        }, 30));
      },
      createSvgMarker(i) {
        window.AMapUI.loadUI(['overlay/SvgMarker'], SvgMarker => {
          //创建一个shape实例，比如水滴状
          const shape = new SvgMarker.Shape.Circle({
            radius: 5, //高度
            fillColor: 'orange', //填充色
            strokeWidth: 1, //描边宽度
            strokeColor: '#666' //描边颜色
          });
          //利用该shape构建SvgMarker
          this.simpleMarkers.push(new SvgMarker(
            //第一个参数传入shape实例
            shape,
            //第二个参数为SimpleMarker的构造参数（iconStyle除外）
            {
              // showPositionPoint: true, //显示定位点
              map: this.amapManager._map,
              position: i.lnglat,
              label: {
                content: this.formatLabel(i),
                offset: new window.AMap.Pixel(16, -12)
              }
            }
          ));
        });
      },
      formatTempLevel(temp) {
        if (temp === '无数据') return '';
        temp = parseFloat(temp);
        if (temp > 8 || temp < 2) return 'data_error';
        if (temp < 4) return 'data_0';
        else if (temp < 6) return 'data_1';
        else return 'data_2';
      },
      formatLabel(i) {
        // let time = `<div class="time">${i.time.slice(5, i.time.length - 3)}</div>`;
        // let content = i.devTempList.map((t, index) => {
        //   let tempData = t.pointTempDataAry.map(pt => pt.devActval).join('');
        //   tempData = tempData ? tempData + '℃' : '无数据';
        //   return `<div class="${tempData === '无数据' ? 'no-data' : ''} content">
        //             <div class="name">${t.name}</div><div class="data ${this.formatTempLevel(tempData)}">${tempData}</div></div>`;
        // }).join('');
        let time = this.$moment(i.m.positioningTime).format('YYYY-MM-DD HH:mm:ss');
        let speed = i.m.speed && i.m.speed.toFixed(1) || '';
        let speedTitle = speed ? `<span class="title">车速:${speed} km/h</span>` : '';
        let angleTitle = i.m.angle ? `<span class="title">角度:${i.m.angle}</span>` : '';
        return `<div class="marker-title">
              <span>${time}</span>
              ${speedTitle}
              ${angleTitle}
          </div>`;
      }
    }
  };
</script>
