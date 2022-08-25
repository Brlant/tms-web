<style scoped>
  .map-path {
    height: 300px;
    margin-bottom: 10px;
  }
</style>
<template>
  <div>
    <div v-show="!points.length" class="empty-info mini">暂无轨迹信息</div>
    <el-amap v-show="points.length" ref="pathMap" vid="pathMap" :amap-manager="amapManager"
             :zoom="10" class="map-path">
    </el-amap>
  </div>
</template>
<script>
import {AMapManager} from 'vue-amap';
import CarImg from '@/assets/img/car.png';

export default {
    props: ['formItem'],
    data () {
      return {
        amapManager: new AMapManager(),
        pathSimplifierIns: null,
        points: []
      };
    },
    watch: {
      formItem (val) {
        this.points = [];
        if (!val.id) return;
        this.queryPath();
      }
    },
    methods: {
      queryPath () {
        this.$http(`/track-transportation/waybill/${this.formItem.id}`).then(res => {
          this.points = res.data.filter(f => f.longitude && f.latitude).map(m => {
            return [m.longitude, m.latitude];
          });
          this.points.length && this.drawPath(this.points);
        });
      },
      // 创建轨迹线对象
      createPathSimplifier (PathSimplifier) {
        const pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          map: this.amapManager._map, //所属的地图实例
          getPath: function (pathData, pathIndex) {
            return pathData.path;
          },
          getHoverTitle: function (pathData, pathIndex, pointIndex) {
            return pathData[pointIndex].time;
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
        this.pathSimplifierIns = pathSimplifierIns;
        return pathSimplifierIns;
      },
      // 创建巡航器对象
      createPathNavigator (PathSimplifier, pathSimplifierIns) {
        // 销毁现存的所有轨迹巡航器
        pathSimplifierIns.clearPathNavigators();
        // 重新创建新的导航器
        const nav = pathSimplifierIns.createPathNavigator(0, {
          loop: false,
          speed: 5000,
          pathNavigatorStyle: {
            width: 16,
            height: 32,
            content: PathSimplifier.Render.Canvas.getImageContent(CarImg, onload, onerror),
            strokeStyle: null,
            fillStyle: null
          }
        });
        nav.start();
      },
      // 画线
      drawPath (points) {
        window.AMapUI.loadUI(['misc/PathSimplifier'], PathSimplifier => {
          const pathSimplifierIns = this.pathSimplifierIns ? this.pathSimplifierIns : this.createPathSimplifier(PathSimplifier);
          pathSimplifierIns.setData([{
            path: points
          }]);
          pathSimplifierIns.setSelectedPathIndex(0);
          // this.createPathNavigator(PathSimplifier, pathSimplifierIns);
        });
      }
    }
  };
</script>
