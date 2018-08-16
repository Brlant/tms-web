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
      <el-amap ref="taskMap" v-show="markers.length" :vid="mapRef" :zoom="10" :center="center"
               :style="mapStyle">
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
        center: [121.5273285, 31.21515044],
        pathSimplifierIns: null
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
      markers (val) {
        if (!val.length || !this.$refs.taskMap) return;
        let map = this.$refs.taskMap.$$getInstance();
        if (!map) return;
        // 添加工具
        this.addMapTools(map);
        map.clearMap();
        val.forEach((i, index) => {
          // 画点
          this.drawPoint(i, index);
        });
      },
      formItem (val) {
        this.pathSimplifierIns && this.pathSimplifierIns.setData([]);
        if (!val.id) return;
        this.$http.get(`/track-transportation/task/${val.id}`).then(res => {
          let point = res.data.map(m => [m.longitude, m.latitude]);
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
          // 轨迹
          this.drawPath(point);
        });
      }
    },
    methods: {
      // 画点
      drawPoint (i, index, iconStyle = 'green') {
        let map = this.$refs.taskMap.$$getInstance();
        if (!map) {
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
            label: {
              content: `<div class="babel__container"><div class="bg"></div><div class="title">${i.label}</div><div>${i.label}</div></div>`,
              offset: new window.AMap.Pixel(30, 10)
            }
          });
        });
      },
      // 画出轨迹
      drawPath (points) {
        if (!points.length) return;
        let map = this.$refs.taskMap.$$getInstance();
        if (!map) {
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
            }
          });
          this.pathSimplifierIns = pathSimplifierIns;
          pathSimplifierIns.setData([{
            name: '派车路线',
            points
          }]);
          pathSimplifierIns.setSelectedPathIndex(0);
        });
      }
    }
  };
</script>
