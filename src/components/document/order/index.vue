<template>
  <div class="order-page">
    <status-list :activeStatus="activeStatus" :statusList="orderType" :checkStatus="checkStatus">
      <span class="btn-group-right">
        <des-btn icon="plus" @click="add">添加</des-btn>
      </span>
    </status-list>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="4">货主/订单号</el-col>
        <el-col :span="2">业务类型</el-col>
        <el-col :span="6">来源/订单号</el-col>
        <el-col :span="4">物流</el-col>
        <el-col :span="3">状态</el-col>
        <el-col :span="5">时间</el-col>
      </el-row>
      <el-row v-if="loadingData">
        <el-col :span="24">
          <oms-loading :loading="loadingData"></oms-loading>
        </el-col>
      </el-row>
      <el-row v-else-if="dataList.length == 0">
        <el-col :span="24">
          <div class="empty-info">
            暂无信息
          </div>
        </el-col>
      </el-row>
      <div v-else="" class="order-list-body flex-list-dom">
        <div class="order-list-item" v-for="item in dataList">
          <el-row>

          </el-row>
          <div class="order-list-item-bg"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  export default {
    data () {
      return {
        loadingData: false,
        activeStatus: 0,
        orderType: utils.orderType,
        dataList: []
      };
    },
    methods: {
      checkStatus () {

      },
      add () {
        alert(1);
      }
    }
  };
</script>
