<style scoped>
  .map-path {
    height: 600px;
  }
</style>
<template>
  <div>
    <el-amap ref="pathMap" vid="pathMap" :amap-manager="amapManager"
             :plugin="plugins" :zoom="10" :center="center" class="map-path">
    </el-amap>
    <el-button @click="queryPath">显示轨迹</el-button>
  </div>
</template>
<script>
  import { AMapManager } from 'vue-amap';
  import CarImg from '@/assets/img/car.png';
  export default {
    data () {
      return {
        center: [121.5273285, 31.21515044],
        plugins: [
          {pName: 'ToolBar'},
          {pName: 'Scale'},
          {
            pName: 'MapType',
            defaultType: 0
          }
        ],
        amapManager: new AMapManager(),
        pathSimplifierIns: null
      };
    },
    mounted () {
      this.queryPath();
    },
    methods: {
      queryPath () {
        this.$http('/track-transportation/task/1234').then(res => {
          let points = res.data.filter(f => f.longitude && f.latitude).map(m => {
            return {
              lnglat: [m.longitude, m.latitude]
            };
          });
          this.drawPath(points);
        });
      },
      // 创建轨迹线对象
      createPathSimplifier (PathSimplifier) {
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
          loop: true,
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
          pathSimplifierIns.setData([{points}]);
          pathSimplifierIns.setSelectedPathIndex(0);
          this.createPathNavigator(PathSimplifier, pathSimplifierIns);
        });
      }
    }
  };
</script>
