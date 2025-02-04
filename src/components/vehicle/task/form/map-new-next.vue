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
      <el-amap :style="mapStyle" :vid="mapRef" :zoom="10" ref="taskMap" v-show="waybillList.length">
        <!--<el-amap-marker v-for="(marker, index) in markers" :key="index" :vid="index" :position="marker.position"-->
        <!--:label="marker.label"></el-amap-marker>-->
      </el-amap>
      <div v-show class="empty-info mini">暂无信息</div>
      <el-checkbox class="map__checkbox" size="mini" v-show="waybillList.length" v-model="isShowPath">连线
      </el-checkbox>
    </div>
  </div>
</template>
<script>
import MapMixin from '@/mixins/mapMixin';

export default {
    props: {
      waybillList: {
        type: Array,
        default () {
          return [];
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
        isShowPath: false,
        pathSimplifierIns: null
      };
    },
    computed: {
      markers () {
        let {waybillList} = this;
        if (!waybillList.length) return [];
        let start = [
          {
            position: [waybillList[0].senderAddressLongitude, waybillList[0].senderAddressDimension],
            label: '起点'
          }
        ];
        let set = new Set();
        waybillList.filter(f => f.receiverAddressLongitude).forEach(i => {
          set.add(i.receiverAddressLongitude + ',' + i.receiverAddressDimension);
        });
        return [...start, ...[...set].map((m, index) => {
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
      },
      isShowLine () {
        return this.$store.state.isShowLine;
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
          this.drawPoint(map, i, index);
        });
        this.isShowPath = false;
        this.pathSimplifierIns && this.pathSimplifierIns.setData([]);
        let isShowLine = window.localStorage.getItem('isShowLine');
        this.$nextTick(() => {
          this.isShowPath = !!JSON.parse(isShowLine);
        });
        // this.isShowPath && this.drawPath(map, [...val, val[0]].map(m => ({lnglat: m.position})));
      },
      isShowPath (val) {
        this.$store.commit('initIsShowLine', val);
        this.switchPath(val);
      },
      isShowLine (val) {
        this.isShowPath = val;
      },
      position (val) {
        if (!val) return;
        this.drawCurPosition(val);
      }
    },
    methods: {
      drawCurPosition (position) {
        if (!position[0] || !position[1]) return;
        let map = this.$refs.taskMap.$$getInstance();
        if (!map) {
          setTimeout(() => {
            this.drawCurPosition(position);
          }, 100);
          return;
        }
        window.AMapUI.loadUI(['overlay/SimpleMarker'], SimpleMarker => {
          const m = new SimpleMarker({
            //图标主题
            iconTheme: 'fresh',
            //背景图标样式
            iconStyle: 'darkblue',
            map: map,
            showPositionPoint: false, //显示定位点
            position: position,
            label: {
              content: '<div class="babel__container"><div class="bg"></div><div class="title">当前位置</div><div>当前位置</div></div>',
              offset: new window.AMap.Pixel(36, 10)
            }
          });
        });
      },
      // 画点
      drawPoint (map, i, index) {
        window.AMapUI.loadUI(['overlay/SimpleMarker'], SimpleMarker => {
          const m = new SimpleMarker({
            //前景文字
            iconLabel: !index ? '起' : index,
            //图标主题
            iconTheme: 'default',
            //背景图标样式
            iconStyle: 'lightgreen',
            map: map,
            showPositionPoint: false, //显示定位点
            position: i.position,
            label: {
              content: `<div class="babel__container"><div class="bg"></div><div class="title">${i.label}</div><div>${i.label}</div></div>`,
              offset: new window.AMap.Pixel(36, 10)
            }
          });
        });
      },
      switchPath (val) {
        window.localStorage.setItem('isShowLine', val);
        let map = this.$refs.taskMap.$$getInstance();
        let {markers, pathSimplifierIns} = this;
        let points = [...markers, markers[0]].map(m => ({lnglat: m.position}));
        // 已经存在
        if (pathSimplifierIns) {
          pathSimplifierIns.setData([]);
          // 清除轨迹
          pathSimplifierIns.setData(val ? [{
            name: '派车路线',
            points
          }] : []);
          val && points.length && pathSimplifierIns.setSelectedPathIndex(0);
          return;
        }
        // 不存在, 调绘制方法
        val && this.drawPath(map, points);
      },
      // 画出轨迹
      drawPath (map, points) {
        window.AMapUI.loadUI(['misc/PathSimplifier'], PathSimplifier => {
          const pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            map: map, //所属的地图实例
            getPath: function (pathData, pathIndex) {
              let points = pathData.points;
              let lnglatList = [];
              for (let i = 0, len = points.length; i < len; i++) {
                lnglatList.push(points[i].lnglat);
              }
              return lnglatList;
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
