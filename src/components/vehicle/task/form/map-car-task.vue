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
  }
</style>
<template>
  <div>
    <div class="map-part">
      <el-amap :style="mapStyle" :vid="mapRef" :zoom="10" ref="taskMap">
        <!--<el-amap-marker v-for="(marker, index) in markers" :key="index" :vid="index" :position="marker.position"-->
        <!--:label="marker.label"></el-amap-marker>-->
      </el-amap>
      <div v-show class="empty-info mini">暂无信息</div>
    </div>
  </div>
</template>
<script>
  import MapMixin from '@/mixins/mapMixin';

  export default {
    props: {
      formItem: {
        type: Object,
        default () {
          return {};
        }
      },
      mapStyle: {
        type: Object,
        default () {
          return {
            height: '200px'
          };
        }
      },
      mapRef: {
        type: String,
        default: 'taskMap'
      },
      position: Array
    },
    mixins: [MapMixin],
    data: function () {
      return {
        pathSimplifierIns: null,
        isShowTemp: true,
        timers: []
      };
    },
    computed: {
      markers () {
        let waybillList = this.formItem.waybillList || [];
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
      formItem (val) {
        this.timers.forEach(i => {
          window.clearTimeout(i);
        });
        this.clearMap();
        this.pathSimplifierIns && this.pathSimplifierIns.setData([]);
        if (!val.id) return;
        this.$http.get(`/track-transportation/task/${val.id}`).then(res => {
          let point = res.data.map(m => [m.longitude, m.latitude]);
          const pointDetails = res.data.filter(f => f.longitude && f.latitude).map((m, index) => {
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
              label: this.formItem.status > 2 ? '' : '当前位置'
            }, this.formItem.status > 2 ? '终' : ' ', 'blue');
          }
          let map = this.$refs.taskMap.$$getInstance();
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
          // 画点
          this.drawPathPoint(pointDetails);
        });
      }
    },
    methods: {
      clearMap() {
        let map = this.$refs.taskMap.$$getInstance();
        if (!map || !window.AMapUI) {
          setTimeout(() => this.clearMap());
        }
        map && map.clearMap();
      },
      // 画点
      drawPoint (i, index, iconStyle = 'green') {
        let map = this.$refs.taskMap.$$getInstance();
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
      drawPath (points) {
        if (!points.length) return;
        let map = this.$refs.taskMap.$$getInstance();
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
            getHoverTitle () {
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
        if (this.mapRef === 'taskMap') return;
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
        }, 50));
      },
      createSvgMarker(i) {
        let map = this.$refs.taskMap.$$getInstance();
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
          const marker = new SvgMarker(
            //第一个参数传入shape实例
            shape,
            //第二个参数为SimpleMarker的构造参数（iconStyle除外）
            {
              // showPositionPoint: true, //显示定位点
              map: map,
              position: i.lnglat,
              label: this.isShowTemp ? {
                content: this.formatLabel(i),
                offset: new window.AMap.Pixel(16, -12)
              } : null
            }
          );
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
        let speed = i.m.speed && (i.m.speed * 3.6).toFixed(1) || '';
        let speedTitle = speed ? `<span class="title">车速:${speed} km/h</span>` : '';
        return `<div class="marker-title">
              <span>${time}</span>
              ${speedTitle}
          </div>`;
      }
    }
  };
</script>
