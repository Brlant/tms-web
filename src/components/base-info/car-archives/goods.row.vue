<style lang="scss" scoped>
  .mb2 {
    margin-bottom: 2px;
  }
</style>
<template>
  <el-row :class="rowClass" class="mb2">
    <el-col :span="span" class="text-right"><span style="padding-right:10px;" v-show="label">{{label}}:</span>
    </el-col>
    <el-col :span="24-span">
      <slot></slot>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'goodsRow',
    props: {
      label: {
        type: String,
        required: true,
        default: ''
      },
      span: {
        type: Number,
        default: 10
      },
      rowClass: {
        type: String,
        default: ''
      }
    }
  };
</script>
