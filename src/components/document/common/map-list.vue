<style scoped>
  .map-path {
    height: 300px;
    margin: 10px 0;
  }
</style>
<template>
  <div>
    <div v-show="!waybills.length" class="empty-info mini">暂无轨迹信息</div>
    <div v-show="waybills.length" v-for="(item, index) in waybills" :key="index">
      <h2>运单号:{{item.waybillNo}}</h2>
      <el-amap :ref="`pathMap${index}`" :vid="`pathMap${index}`" :amap-manager="item.amapManager"
               :zoom="10" :center="item.center" class="map-path">
      </el-amap>
    </div>
  </div>
</template>
<script>
  import { AMapManager } from 'vue-amap';

  export default {
    props: ['formItem'],
    data () {
      return {
        waybills: []
      };
    },
    watch: {
      formItem (val) {
        this.waybills = [];
        if (!val.id) return;
        this.queryPath();
      }
    },
    methods: {
      queryPath () {
        this.$http(`/track-transportation/order/${this.formItem.id}`).then(res => {
          this.waybills = res.data.map(m => {
            return {
              waybillNo: m.waybillNo,
              center: [121.5273285, 31.21515044],
              amapManager: new AMapManager(),
              points: m.list && m.list.filter(f => f.longitude && f.latitude).map(m => {
                return {
                  lnglat: [m.longitude, m.latitude]
                };
              })
            };
          }) || [];
          this.$nextTick(() => {
            this.waybills.forEach(i => {
              this.drawPath(i);
            });
          });
        });
      },
      // 画线
      drawPath (item) {
        window.AMapUI.loadUI(['misc/PathSimplifier'], PathSimplifier => {
          const pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            map: item.amapManager._map, //所属的地图实例
            getPath: function (pathData, pathIndex) {
              let points = pathData.points;
              let lnglatList = [];
              for (let i = 0, len = points.length; i < len; i++) {
                lnglatList.push(points[i].lnglat);
              }
              return lnglatList;
            },
            renderOptions: {
              startPointStyle: {
                radius: 8
              },
              endPointStyle: {
                radius: 8
              }
            }
          });
          pathSimplifierIns.setData([{points: item.points}]);
          pathSimplifierIns.setSelectedPathIndex(0);
          // const nav = pathSimplifierIns.createPathNavigator(0, {
          //   loop: false,
          //   speed: 5000,
          //   pathNavigatorStyle: {
          //     width: 16,
          //     height: 32,
          //     content: PathSimplifier.Render.Canvas.getImageContent(CarImg, onload, onerror),
          //     strokeStyle: null,
          //     fillStyle: null
          //   }
          // });
          // nav.start();
        });
      }
    }
  };
</script>
