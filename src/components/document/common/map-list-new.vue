<style scoped>
  .map-path {
    height: 300px;
    margin: 10px 0;
  }
</style>
<template>
  <div>
    <div v-if="!waybills.length" class="empty-info mini">暂无轨迹信息</div>
    <div v-else v-for="(item, index) in waybills" :key="index">
      <h2>运单号:{{item.waybillNo}}</h2>
      <el-amap :ref="`pathMap${index}`" :vid="`pathMap${index}`" :amap-manager="item.amapManager"
               :zoom="10" class="map-path">
      </el-amap>
    </div>
  </div>
</template>
<script>
import {AMapManager} from 'vue-amap';

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
        this.$http(`/track-transportation/order/${this.formItem.id}/latest`).then(res => {
          this.waybills = res.data.map(m => {
            return {
              waybillNo: m.waybillNo,
              amapManager: new AMapManager(),
              points: [m.longitude, m.latitude]
            };
          }) || [];
          this.$nextTick(() => {
            this.waybills.forEach(i => {
              this.drawPath(i);
            });
          });
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
      drawPath (i) {
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
        i.amapManager._map.setCenter(i.points);
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
              map: i.amapManager._map,
              position: i.points,
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
            i.amapManager._map.setCenter([(i.points[0] + position[0]) / 2, (i.points[1] + position[1]) / 2]);
            const m = new SimpleMarker({
              //前景文字
              iconLabel: '终',
              //图标主题
              iconTheme: 'default',
              //背景图标样式
              iconStyle: 'lightgreen',
              //...其他Marker选项...，不包括content
              map: i.amapManager._map,
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
