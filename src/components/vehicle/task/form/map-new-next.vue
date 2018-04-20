<template>
  <el-amap v-if="waybillList.length" vid="aMap" :zoom="10" :center="center" :style="'height:700px'">
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
        let {waybillList} = this;
        if (!waybillList.length) return [];
        let start = [
          {
            position: [waybillList[0].senderAddressLongitude, waybillList[0].senderAddressDimension],
            label: {
              content: '起点',
              offset: [20, 20]
            }
          }
        ];
        return start.concat(waybillList.filter(f => f.receiverAddressLongitude).map((m, index) => ({
          position: [m.receiverAddressLongitude, m.receiverAddressDimension],
          label: {
            content: `途径地点${index + 1}:${m.receiverName}`,
            offset: [20, 20]
          }
        })));
      }
    }
  };
</script>
