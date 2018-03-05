<template>
  <el-row>
     <el-col :span="span">
       <slot name="left"></slot>
     </el-col>
     <el-col :span="24-span">
       <slot name="right"></slot>
     </el-col>
  </el-row>
</template>
<script>
  export default {
    name: 'twoColumn',
    props: {
      span: {
        type: Boolean,
        default: 12
      }
    }
  };
</script>
