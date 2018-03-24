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
               :zoom="10" :center="item.center" class="map-path">
      </el-amap>
    </div>
  </div>
</template>
<script>
  import { AMapManager } from 'vue-amap';
  import CarImg from '@/assets/img/car.png';

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
              waybillNo: res.data.waybillNo,
              center: [121.5273285, 31.21515044],
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
        this.center = i.points;
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
          window.AMapUI.loadUI(['overlay/SvgMarker'], SvgMarker => {
            const shape = new SvgMarker.Shape.TriangleFlagPin({
              height: 60, //高度
              //width: **, //不指定时会维持默认的宽高比
              fillColor: '#24ff0b', //填充色
              strokeWidth: 1, //描边宽度
              strokeColor: '#00ff00' //描边颜色
            });
            let position = [geoCodes[0].location.getLng(), geoCodes[0].location.getLat()];
            this.center = [(i.points[0] + position[0]) / 2, (i.points[1] + position[1]) / 2];
            //利用该shape构建SvgMarker
            const marker = new SvgMarker(
              //第一个参数传入shape实例
              shape,
              //第二个参数为SimpleMarker的构造参数（iconStyle除外）
              {
                showPositionPoint: false, //显示定位点
                map: i.amapManager._map,
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
