<template>
  <div class="order-page">
    <search-part @search="searchResult"></search-part>

    <status-list :activeStatus="activeStatus" :statusList="statusType" :checkStatus="checkStatus">
      <span class="btn-group-right">
        <des-btn icon="plus" @click="showPart(0)">添加</des-btn>
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
        <el-col :span="5">发货单位</el-col>
        <el-col :span="4">收货单位</el-col>
        <el-col :span="3">创建时间</el-col>
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
        <div class="order-list-item" v-for="item in dataList"
             :class="[formatRowClass(item.status, statusType) ,{'active':currentItemId===item.id}]">
          <el-row>
            <el-col :span="3">{{item.orderNo}}</el-col>
            <el-col :span="3">{{item.tmsOrderNumber}}</el-col>
            <el-col :span="2">
              <dict :dict-group="'tmsOrderType'" :dict-key="item.type"></dict>
            </el-col>
            <el-col :span="2">
              <dict :dict-group="'shipmentWayType'" :dict-key="item.shipmentWay"></dict>
            </el-col>
            <el-col :span="2">
              {{item.serviceType}}
            </el-col>
            <el-col :span="5">{{item.senderName}}</el-col>
            <el-col :span="4">{{item.receiverName}}</el-col>
            <el-col :span="3">{{item.createTime | time}}</el-col>
          </el-row>
          <div class="order-list-item-bg"></div>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pager.currentPage"
                     :page-sizes="[20,50,100]" :page-size="20" layout="sizes, prev, pager, next, jumper"
                     :total="pager.count">
      </el-pagination>
    </div>

    <page-right :show="showIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentPart"/>
    </page-right>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import addForm from './form/add-form';
  import CommonMixin from '@/mixins/commonMixin';
  import {TmsOrder} from '@/resources';
  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data () {
      return {
        statusType: utils.orderType,
        currentPart: null,
        dialogComponents: {
          0: addForm
        },
        filters: {
          status: 0
        }
      };
    },
    watch: {
      filters: {
        handler: function () {
          this.queryList(1);
        },
        deep: true
      }
    },
    mounted() {
      this.queryList(1);
    },
    methods: {
      searchResult (search) {
        Object.assign(this.filters, search);
      },
      checkStatus (item, key) {
        this.activeStatus = key;
        this.filters.status = item.status;
      },
      resetRightBox () {
        this.showIndex = -1;
      },
      showPart (index) {
        this.showIndex = index;
        this.currentPart = this.dialogComponents[index];
      },
      queryList (pageNo) {
        const params = this.queryUtil(TmsOrder.query, pageNo);
        this.queryStatusNum(params);
      },
      queryStatusNum(params) {

      }
    }
  };
</script>
