<style scoped>
  .map-path {
    height: 300px;
    margin-bottom: 10px;
  }
</style>
<template>
  <div>
    <div v-if="!points.length" class="empty-info mini">暂无派送信息</div>
    <el-amap v-else ref="pathMap" vid="pathMap" :amap-manager="amapManager"
             :zoom="10" class="map-path">
    </el-amap>
  </div>
</template>
<script>
  import {AMapManager} from 'vue-amap';

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
        this.$http(`/track-transportation/waybill/${this.formItem.id}/latest`).then(res => {
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
        // window.AMapUI.loadUI(['overlay/SimpleMarker'], SimpleMarker => {
        //   const point = new SimpleMarker({
        //     iconTheme: 'default',
        //     iconStyle: 'red',
        //     map: this.amapManager._map,
        //     position: points,
        //     label: {
        //       content: '当前位置',
        //       offset: new window.AMap.Pixel(32, 25)
        //     }
        //   });
        // });
        this.center = points;
        window.AMapUI.loadUI(['overlay/SvgMarker'], SvgMarker => {
          const marker1 = new SvgMarker(
            new SvgMarker.Shape.IconFont({
              // 参见 symbol引用, http://www.iconfont.cn/plus/help/detail?helptype=code
              symbolJs: '/static/fonts/iconfont.js',
              icon: 'el-icon-t-qiache',
              size: 30,
              offset: [-15, -15],
              fillColor: 'green'
            }), {
              map: this.amapManager._map,
              position: points,
              showPositionPoint: false,
              label: {
                content: '当前位置',
                offset: new window.AMap.Pixel(32, 0)
              }
            });
        });
        this.getLgtAndLat(this.formItem.provenance, this.formItem.receiverAddress, res => {
          let geoCodes = res.geocodes;
          if (!geoCodes.length) return;
          window.AMapUI.loadUI(['overlay/SimpleMarker'], SimpleMarker => {
            let position = [geoCodes[0].location.getLng(), geoCodes[0].location.getLat()];
            this.center = [(points[0] + position[0]) / 2, (points[1] + position[1]) / 2];
            const m = new SimpleMarker({
              //前景文字
              iconLabel: '终',
              //图标主题
              iconTheme: 'default',
              //背景图标样式
              iconStyle: 'lightgreen',
              //...其他Marker选项...，不包括content
              map: this.amapManager._map,
              showPositionPoint: false, //显示定位点
              position: position,
              label: {
                content: `目的地：${this.formItem.receiverAddress}`,
                offset: new window.AMap.Pixel(36, 10)
              }
            });
          });
        });
      }
    }
  };
</script>
