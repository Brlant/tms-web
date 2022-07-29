<template>
  <el-col :span="colSpan" v-if="value || isShow">
    <div>
      <oms-row :label="label" :span="rowSpan">
        <slot>{{ value }}</slot>
      </oms-row>
    </div>
  </el-col>
</template>
<script>
export default {
  props: {
    label: String,
    value: null,
    isShow: false,
    colSpan: {
      type: Number,
      default: 12
    },
    rowSpan: Number
  }
};
</script>
