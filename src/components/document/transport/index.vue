<template>
  <div class="order-page">
    <search-part @search="searchResult"></search-part>

    <status-list :activeStatus="activeStatus" :statusList="orderType" :checkStatus="checkStatus">
      <span class="btn-group-right">
        <!--<des-btn icon="plus" @click="showPart(0)">添加</des-btn>-->
        <!--<el-button size="small" plain @click="showPart(0)">添加</el-button>-->
      </span>
    </status-list>

    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="3">订单号</el-col>
        <el-col :span="3">委托单号</el-col>
        <el-col :span="2">订单类型</el-col>
        <el-col :span="2">发运方式</el-col>
        <el-col :span="2">服务方式</el-col>
        <el-col :span="6">发货单位</el-col>
        <el-col :span="6">收货单位</el-col>
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

    <page-right :show="showIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentPart"/>
    </page-right>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  export default {
    components: {
      SearchPart
    },
    data () {
      return {
        loadingData: false,
        activeStatus: 0,
        orderType: utils.orderType,
        dataList: [],
        showIndex: -1,
        currentPart: null,
        dialogComponents: {
          0: () => import('./form/add-form')
        }
      };
    },
    methods: {
      searchResult () {

      },
      checkStatus () {

      },
      resetRightBox () {
        this.showIndex = -1;
      },
      showPart (index) {
        this.showIndex = index;
        this.currentPart = this.dialogComponents[index];
      },
      add () {

      }
    }
  };
</script>
