<template>
  <div class="opera-btn-group" :class="{up: showSearch}">
    <div class="opera-icon">
      <el-col :span="2">
        <h2 class="header f-dib">
          <slot name="title"></slot>
        </h2>
      </el-col>
      <!--<el-col :span="18" class="text-right">-->
      <!--<span class="switching-icon" @click="showSearch = !showSearch">-->
      <!--<i class="el-icon-arrow-up"></i>-->
      <!--<span v-show="showSearch">收起筛选</span>-->
      <!--<span v-show="!showSearch">展开筛选</span>-->
      <!--</span>-->
      <!--</el-col>-->
      <el-col :span="22" class="text-right">
        <el-button-group>
          <el-button type="primary" plain size="small" @click="search">查询</el-button>
          <el-button type="primary" plain size="small" @click="reset">重置</el-button>
          <el-button type="primary" plain size="small" @click="showSearch = !showSearch">高级检索</el-button>
          <slot name="btn"></slot>
        </el-button-group>
      </el-col>
    </div>
    <slot name="content"></slot>
  </div>
</template>
<script>
  export default {
    name: 'searchTemplate',
    props: {
      isShow: Boolean
    },
    data: function () {
      return {
        showSearch: false
      };
    },
    watch: {
      showSearch (val) {
        this.$emit('isShow', val);
      },
      isShow (val) {
        this.showSearch = val;
      }
    },
    methods: {
      search () {
        this.$emit('search');
      },
      reset() {
        this.$emit('reset');
      }
    }
  };
</script>
