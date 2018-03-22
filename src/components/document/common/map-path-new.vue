<style scoped>
  .map-path {
    height: 300px;
    margin-bottom: 10px;
  }
</style>
<template>
  <div>
    <div v-if="!points.length" class="empty-info mini">暂无轨迹信息</div>
    <el-amap v-else ref="pathMap" vid="pathMap" :amap-manager="amapManager"
             :zoom="10" :center="center" class="map-path">
    </el-amap>
  </div>
</template>
<script>
  import { AMapManager } from 'vue-amap';

  export default {
    props: ['formItem'],
    data () {
      return {
        center: [121.5273285, 31.21515044],
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
        let id = '1234';
        this.$http(`/track-transportation/task/${this.formItem.id}/latest`).then(res => {
          if (res.data.longitude && res.data.latitude) {
            this.points = [res.data.longitude, res.data.latitude];
            this.drawPath(this.points);
          }
        });
      },
      getLgtAndLat (city, query, callBack) {
        const AMap = window.AMap;
        const myGeo = new AMap.Geocoder({
          city
        });
        myGeo.getLocation(query, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            callBack(result);
          }
        });
      },
      // 描点
      drawPath (points) {
        window.AMapUI.loadUI(['overlay/SimpleMarker'], SimpleMarker => {
          const point = new SimpleMarker({
            iconTheme: 'default',
            iconStyle: 'red',
            map: this.amapManager._map,
            position: points,
            label: {
              content: '当前位置',
              offset: new window.AMap.Pixel(32, 25)
            }
          });
        });
        this.getLgtAndLat(this.formItem.provenance, this.formItem.receiverAddress, res => {
          let geoCodes = res.geocodes;
          if (!geoCodes.length) return;
          window.AMapUI.loadUI(['overlay/SvgMarker'], SvgMarker => {
            const shape = new SvgMarker.Shape.TriangleFlagPin({
              height: 60, //高度
              //width: **, //不指定时会维持默认的宽高比
              fillColor: '#24ff0b', //填充色
              strokeWidth: 1, //描边宽度
              strokeColor: '#00ff00' //描边颜色
            });
            let position = [geoCodes[0].location.getLng(), geoCodes[0].location.getLat()];
            this.center = [(points[0] + position[0]) / 2, (points[1] + position[1]) / 2];
            //利用该shape构建SvgMarker
            const marker = new SvgMarker(
              //第一个参数传入shape实例
              shape,
              //第二个参数为SimpleMarker的构造参数（iconStyle除外）
              {
                showPositionPoint: true, //显示定位点
                map: this.amapManager._map,
                position: position,
                label: {
                  content: `目的地：${this.formItem.receiverAddress}`,
                  offset: new window.AMap.Pixel(20, 28)
                }
              }
            );
          });
        });


      }
    }
  };
</script>
