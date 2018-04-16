<template>
  <el-amap v-if="waybillList.length" vid="aMap"  :zoom="10" :center="center" :style="'height:700px'">
    <el-amap-marker v-for="(marker, index) in markers" :key="index" :vid="index" :position="marker.position"
                    :label="marker.label"></el-amap-marker>
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
        if (!this.waybillList.length) return [];
        return  this.waybillList.map(m => ({
          position: [m.receiverAddressLongitude, m.receiverAddressDimension],
          label: {
            content: m.receiverName,
            offset: [20, 20]
          }
        }));
      }
    }
  };
</script>
