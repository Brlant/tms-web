<style>
  .map-part {
    position: relative;
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
  .isDistance{
    position: absolute;
    left: 5px;
    top: 10px;
    /* width: 100px;
    height: 50px; */
    padding:5px 8px;
    background: rgba(255,255,255,0.7);
    border: 1px solid #ccc;
    border-radius: 5px;
    z-index: 9999;
    /* font-size: 12px; */
  }
</style>
<template>
  <div>
    <div class="map-part">
      <div class="map__checkbox" v-show="showPoint">
        <el-checkbox size="mini" v-model="isShowTemp">标题</el-checkbox>
      </div>
      <el-amap :style="mapStyle" :vid="mapRef" :zoom="10" ref="wayBillMap">
        <span class="isDistance" v-if="isDistance">
          <div>车&ensp;牌&ensp;号：{{wayBillItem.carPlateNumber}}</div>
          <div>启运时间：{{wayBillItem.deliverystartTime|minute}}</div>
          <div>完成时间：{{wayBillItem.waybillCompleteTime|minute}}</div>
          <div>总里程数：{{wayBillItem.totalMileage}}km</div>
        </span>
        <!--<el-amap-marker v-for="(marker, index) in markers" :key="index" :vid="index" :position="marker.position"-->
        <!--:label="marker.label"></el-amap-marker>-->
      </el-amap>
      <!--      <div class="empty-info mini">暂无信息</div>-->
    </div>
  </div>
</template>
<script>
import {AMapManager} from 'vue-amap';
import MapMixin from '@/mixins/mapMixin';

export default {
    props: {
        wayBillItem: {
        type: Object,
        default() {
          return {};
        }
      },
      mapStyle: {
        type: Object,
        default() {
          return {
            height: '350px'
          };
        }
      },
      mapRef: {
        type: String,
        default: 'wayBillMap'
      },
      position: Array,
      showPoint: Boolean
    },
    mixins: [MapMixin],
    data: function () {
      return {
        amapManager: new AMapManager(),
        pathSimplifierIns: null,
        isShowTemp: false,
        timers: [],
        simpleMarkers: [],
        isDistance:false,
        actualMileage:'',  // 地图计算的距离
      };
    },
    computed: {
      markers() {
        let waybillList =  [];
        waybillList.push(this.wayBillItem)
        if (!waybillList.length) return [];
        let set = new Set();
        waybillList.filter(f => f.receiverAddressLongitude).forEach(i => {
          set.add(i.receiverAddressLongitude + ',' + i.receiverAddressDimension);
        });
        return [...[...set].map((m, index) => {
          let v = m.split(',');
          let title = '';
          waybillList.forEach(i => {
            if (i.receiverAddressLongitude === v[0] * 1 && i.receiverAddressDimension === v[1] * 1) title = i.receiverName;
          });
          return {
            position: [v[0], v[1]],
            label: title
          };
        })].filter(f => f.position[0] && f.position[1]);
      }
    },
    watch: {
        wayBillItem: {
            handler(val){
                this.timers.forEach(i => {
                    window.clearTimeout(i);
                });
                // this.clearMap();
                this.isDistance = false
                this.actualMileage = ''
                this.pathSimplifierIns && this.pathSimplifierIns.setData([]);
                if (!val.id) return;
                this.$http.get(`/tms-waybill/getTrackTransportation/${val.id}`).then(res => {
                let point = res.data.map(m => [m.longitude, m.latitude]) || [];
                this.pointDetails = res.data.filter(f => f.longitude && f.latitude).map((m, index) => {
                    return {
                    lnglat: [m.longitude, m.latitude],
                    time: this.$moment(m.collectionTime).format('YYYY-MM-DD HH:mm:ss'),
                    m
                    };
                });
                // 起点
                if (point.length) {
                    this.drawPoint({
                    position: point[0],
                    label: ''
                    }, '起', 'orange');
                    this.drawPoint({
                    position: point[point.length - 1],
                    label: this.wayBillItem.status > 2 ? '' : '当前位置'
                    }, this.wayBillItem.status > 2 ? '终' : ' ', 'blue');
                }
                let map = this.$refs.wayBillMap.$$getInstance();
                if (!map) return;
                this.clearMap();
                // 添加工具
                this.addMapTools(map);
                this.markers.forEach((i, index) => {
                    // 画点
                    this.drawPoint(i, index);
                });
                // 轨迹
                this.drawPath(point);
                // 计算距离
                // if((val.status == 3) && res.data.length !=0){
                    // this.countKm(res.data)
                    this.isDistance = true
                // }
                });
            },
            immediate:true
      },
      isShowTemp(val) {
        this.removeSimpleMarkers(this.simpleMarkers);
        if (val) {
          this.simpleMarkers = [];
          // 画点
          this.drawPathPoint(this.pointDetails);
        }
      }
    },
    methods: {
      removeSimpleMarkers(list, limit = 20, index = 0) {
        let childList = list.slice(index * limit, limit * (index + 1));
        if (!childList.length) return;
        let map = this.$refs.wayBillMap.$$getInstance();
        map && map.remove(childList);
        index++;
        setTimeout(() => {
          this.removeSimpleMarkers(list, limit, index);
        }, 20);
      },
      clearMap() {
        let map = this.$refs.wayBillMap.$$getInstance();
        if (!map || !window.AMapUI) {
          setTimeout(() => this.clearMap());
        }
        map && map.clearMap();
      },
      // 画点
      drawPoint(i, index, iconStyle = 'green') {
        let map = this.$refs.wayBillMap.$$getInstance();
        if (!map || !window.AMapUI) {
          setTimeout(() => this.drawPoint(map, i, index), 200);
        }
        window.AMapUI.loadUI(['overlay/SimpleMarker'], SimpleMarker => {
          const m = new SimpleMarker({
            //前景文字
            iconLabel: typeof index === 'number' ? ' ' : index,
            //图标主题
            iconTheme: 'default',
            //背景图标样式
            iconStyle: iconStyle,
            map: map,
            showPositionPoint: false, //显示定位点
            position: i.position,
            label: i.label ? {
              content: `<div class="babel__container is-big"><div class="bg"></div><div class="title">${i.label}</div>
<div>${i.label}</div></div>`,
              offset: new window.AMap.Pixel(30, 10)
            } : null
          });
        });
      },
      // 画出轨迹
      drawPath(points) {
        if (!points.length) return;
        let map = this.$refs.wayBillMap.$$getInstance();
        if (!map || !window.AMapUI) {
          setTimeout(() => this.drawPath(points), 200);
        }
        window.AMapUI.loadUI(['misc/PathSimplifier'], PathSimplifier => {
          const pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            map: map, //所属的地图实例
            getPath: function (pathData, pathIndex) {
              return pathData.points;
            },
            getHoverTitle() {
              return '';
            },
            renderOptions: {
              hoverTitleStyle: {
                classNames: 'marker-hover-title'
              }
            }
          });
          this.pathSimplifierIns = pathSimplifierIns;
          pathSimplifierIns.setData([{
            name: '派车路线',
            points
          }]);
          pathSimplifierIns.setSelectedPathIndex(0);
        });
      },
      drawPathPoint(points, isNotFirst) {
        if (!this.isShowTemp) return;
        if (this.mapRef === 'wayBillMap') return;
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
          this.drawPathPoint(nextPoints, true);
        }, 20));
      },
      createSvgMarker(i) {
        let map = this.$refs.wayBillMap.$$getInstance();
        if (!map || !window.AMapUI) {
          setTimeout(() => this.createSvgMarker(i), 200);
        }
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
              map: map,
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
        let time = this.$moment(i.m.positioningTime).format('YYYY-MM-DD HH:mm:ss');
        let speed = i.m.speed && i.m.speed.toFixed(1) || '';
        let speedTitle = speed ? `<span class="title">车速:${speed} km/h</span>` : '';
        let angleTitle = i.m.angle ? `<span class="title">角度:${i.m.angle}</span>` : '';
        return `<div class="marker-title">
              <span>${time}</span>
              ${speedTitle}
              ${angleTitle}
          </div>`;
      },
      // 根据data中的轨迹（经纬度）计算实际距离
    countKm(data) {
        let list = data.filter(f => f.longitude && f.latitude).map((m, index) => {
          return [m.longitude, m.latitude];
        });
        // 返回轨迹的实际长度，单位：米
        let dis = window.AMap.GeometryUtil.distanceOfLine(list);
        if (dis > 0) {
          let actualMileage = dis / 1000;
          this.actualMileage = (actualMileage.toFixed(3)) || 0.000;
          // this.$emit("countActualMileage", actualMileage)
        }
      },
    }
  };
</script>
