<template>
  <el-amap ref="taskMap" v-if="waybillList.length" vid="taskMap" :zoom="10" :center="center" :style="'height:700px'">
    <!--<el-amap-marker v-for="(marker, index) in markers" :key="index" :vid="index" :position="marker.position"-->
    <!--:label="marker.label"></el-amap-marker>-->
  </el-amap>
  <div v-else class="empty-info mini">暂无信息</div>
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
        center: [121.5273285, 31.21515044]
      };
    },
    computed: {
      markers () {
        let {waybillList} = this;
        if (!waybillList.length) return [];
        let start = [
          {
            position: [waybillList[0].senderAddressLongitude, waybillList[0].senderAddressDimension],
            label: '起点'
          }
        ];
        let set = new Set();
        waybillList.filter(f => f.receiverAddressLongitude).forEach(i => {
          set.add(i.receiverAddressLongitude + ',' + i.receiverAddressDimension);
        });
        return [...start, ...[...set].map((m, index) => {
          let v = m.split(',');
          let title = '';
          waybillList.forEach(i => {
            if (i.receiverAddressLongitude === v[0] * 1 && i.receiverAddressDimension === v[1] * 1) title = i.receiverName;
          });
          return {
            position: [v[0], v[1]],
            label: title
          };
        })];
      }
    },
    watch: {
      markers (val) {
        let map = this.$refs.taskMap.$$getInstance();
        map.setFeatures(['bg', 'road', 'building']);
        map.clearMap();
        val.forEach((i, index) => {
          window.AMapUI.loadUI(['overlay/SimpleMarker'], SimpleMarker => {
            const m = new SimpleMarker({
              //前景文字
              iconLabel: !index ? '起' : index,
              //图标主题
              iconTheme: 'default',
              //背景图标样式
              iconStyle: 'lightgreen',
              map: map,
              showPositionPoint: false, //显示定位点
              position: i.position,
              label: {
                content: i.label,
                offset: new window.AMap.Pixel(36, 10)
              }
            });
          });
        });
      }
    }
  };
</script>
