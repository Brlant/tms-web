<style scoped>
  .vehicleMap {
    position: absolute;
    left: 0;
    right: 0;
  }
</style>
<template>
  <div>
    <div class="vehicleMap">
      <div v-show="!points.length" class="empty-info mini">暂无车辆信息</div>
      <el-amap v-show="points.length" ref="pathMap" vid="vehicleMap" :amap-manager="amapManager"
               :style="mapStyle" :zoom="10" class="map-path">
      </el-amap>
    </div>
  </div>
</template>
<script>
  import {AMapManager} from 'vue-amap';
  import iconFont from '@/../static/fonts/iconfont';
  import MapMixin from '@/mixins/mapMixin';

  export default {
    data () {
      return {
        amapManager: new AMapManager(),
        pathSimplifierIns: null,
        points: [],
        mapStyle: {
          height: '100%'
        },
        closeIconAry: []
      };
    },
    mixins: [MapMixin],
    computed: {
      bodyHeight: function () {
        return parseInt(this.$store.state.bodyHeight, 10);
      }
    },
    watch: {
      bodyHeight: {
        handler (val) {
          this.mapStyle.height = (val + 70) + 'px';
        },
        immediate: true
      }
    },
    mounted () {
      this.queryPath();
      this.addMapTools();
    },
    methods: {
      queryPath () {
        this.$http.get('/track-transportation/car').then(res => {
          this.points = res.data.filter(f => f.latitude && f.longitude);
          this.points.forEach(i => this.drawPoint(i));
          setTimeout(() => {
            this.amapManager._map.setFitView();
          }, 300);
          this.closeEvent();
        });
      },
      drawPoint (i) {
        window.AMapUI.loadUI(['overlay/SvgMarker'], SvgMarker => {
          const shape = new SvgMarker.Shape.IconFont({
            // 参见 symbol引用, http://www.iconfont.cn/plus/help/detail?helptype=code
            symbolJs: iconFont,
            icon: 'el-icon-t-lengcangche',
            size: 40,
            offset: [-20, -20],
            fillColor: 'black'
          });

          const marker = new SvgMarker(
            //第一个参数传入shape实例
            shape,
            //第二个参数为SimpleMarker的构造参数（iconStyle除外）
            {
              // showPositionPoint: true, //显示定位点
              map: this.amapManager._map,
              position: [i.longitude, i.latitude],
              label: {
                content: this.formatLabel(i),
                offset: new window.AMap.Pixel(45, -40)
              }
            }
          );
          window.AMap.event.addListener(marker, 'click', () => {
            let title = this.$el.querySelector('#' + i.carNumber);
            if (!title) return;
            title.parentNode.style.display = 'block';
            // marker.setAnimation('');
          });
        });
      },
      formatTempLevel (temp) {
        if (!temp) return '';
        if (temp > 8 || temp < 2) return 'front-icon--error';
        return 'front-icon--' + parseInt(temp, 10);
      },
      formatLabel (i) {
        let that = this;
        let carInfo = {
          carNo: {title: ''},
          positioningTime: {
            title: '最新时间：',
            format (val) {
              if (!val) return '';
              return that.$moment(val).format('YYYY-MM-DD HH:mm:ss');
            }
          }
        };
        let content = Object.keys(i).map(k => {
          if (!carInfo[k]) return '';
          return `<div class="item title">${carInfo[k].title}${carInfo[k].format ? carInfo[k].format(i[k]) : i[k]}</div>`;
        }).join('');
        return `<div class="arraw"></div>${content}`;
      },
      closeEvent () {
        this.closeIconAry = this.$el.querySelectorAll('.el-icon-close');
        if (this.closeIconAry.length !== this.points.length) {
          setTimeout(this.closeEvent, 100);
          return;
        }
        this.closeIconAry.forEach(i => {
          i.addEventListener('click', () => {
            i.parentNode.parentNode.style.display = 'none';
          });
        });
      }
    }
  };
</script>
