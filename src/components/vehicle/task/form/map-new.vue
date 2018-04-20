<template>
  <div>
    <el-amap v-show="waybillList.length" vid="taskMap" ref="taskMap"
             :zoom="10" :center="center" style="height:700px">
      <el-amap-marker v-for="(marker, index) in markers" :key="index" :vid="index" :position="marker.position"
                      :label="marker.label"></el-amap-marker>
    </el-amap>
    <div v-show="!waybillList.length" class="empty-info mini">暂无信息</div>
  </div>
</template>
<script>
  export default {
    props: {
      waybillList: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    data: function () {
      return {
        center: [121.5273285, 31.21515044],
        pathSimplifierIns: null
      };
    },
    computed: {
      markers () {
        let {waybillList} = this;
        if (!waybillList.length) return [];
        let startPoint = {
          position: [waybillList[0].senderAddressLongitude, waybillList[0].senderAddressDimension],
          label: {
            content: '起点',
            offset: [20, 20]
          }
        };
        return [startPoint].concat(this.waybillList.filter(f => f.receiverAddressLongitude).map(m => ({
          position: [m.receiverAddressLongitude, m.receiverAddressDimension],
          label: {
            content: m.receiverName,
            offset: [20, 20]
          }
        })));
      }
    },
    watch: {
      waybillList (val) {
        this.pathSimplifierIns && this.pathSimplifierIns.setData([{points: []}]);
        if (!val || val && !val.length) {
          return;
        }
        let points = val.filter(f => f.receiverAddressLongitude).map(m => ([m.receiverAddressLongitude, m.receiverAddressDimension]));
        let ary = [];
        points.forEach(i => {
          let isHas = ary.some(s => s[0] === i[0] && s[1] && s[1]);
          !isHas && ary.push(i);
        });
        ary.splice(0, 0, [val[0].senderAddressLongitude, val[0].senderAddressDimension]);
        ary.push([val[0].senderAddressLongitude, val[0].senderAddressDimension]);
        this.drawPath(ary.map(m => ({lnglat: m})));
      }
    },
    methods: {
      // 画出轨迹
      drawPath (points) {
        window.AMapUI.loadUI(['misc/PathSimplifier'], PathSimplifier => {
          const pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            map: this.$refs.taskMap.$$getInstance(), //所属的地图实例
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
