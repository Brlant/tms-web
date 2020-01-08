<style scoped>
  .map-path {
    margin: 10px 0;
  }
</style>
<template>
  <div>
    <div v-show="!waybills.length" class="empty-info mini">暂无轨迹信息</div>
    <div v-if="waybills.length || !activeNo || item.waybillNo === activeNo" v-for="(item, index) in waybills"
         :key="index">
      <h2 v-show="!activeNo">运单号:{{item.waybillNo}}
        <span @click="showBigMap(formItem, item)" class="des-btn">
               <a href="#" class="btn-circle" @click.prevent="">
                 <i class="el-icon-zoom-in"></i></a>查看大图
      </span>
      </h2>
      <el-amap :ref="`pathMap${index}`" :vid="activeNo ? `pathMap${index}activeNo`
      :`pathMap${index}`" :amap-manager="item.amapManager"
               :style="mapStyle" :zoom="10" class="map-path">
      </el-amap>
    </div>
  </div>
</template>
<script>
  import {AMapManager} from 'vue-amap';
  import MapMixin from '@/mixins/mapMixin';

  export default {
    props: {
      formItem: Object,
      mapStyle: {
        type: Object,
        default () {
          return {
            height: '300px'
          };
        }
      },
      activeNo: {
        type: String
      },
      showBigMap: Function
    },
    mixins: [MapMixin],
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
              amapManager: new AMapManager(),
              points: m.list && m.list.filter(f => f.longitude && f.latitude).map(m => {
                return {
                  lnglat: [m.longitude, m.latitude],
                  time: this.$moment(m.positioningTime).format('YYYY-MM-DD HH:mm:ss'),
                  name: this.formItem.receiverAddress
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
            getHoverTitle: function (pathData, pathIndex, pointIndex) {
              if (typeof pointIndex !== 'number') return pathData.points[0].name ? '收货地址：' + pathData.points[0].name : '';
              if (pointIndex === 0) return pathData.points[pointIndex].time + '出发';
              if (pointIndex === pathData.points.length - 1) return pathData.points[pointIndex].time + '到达目的地（' + pathData.points[0].name + '）';
              return pathData.points[pointIndex].time + '路过此地';
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
          item.points.length && pathSimplifierIns.setSelectedPathIndex(0);
          // 添加工具
          this.addMapTools(item.amapManager._map);
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
