<template>
  <search-template :isShow="showSearch" @search="search" @reset="reset" @isShow="isShow">
    <template slot="title">订单查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="4">
            <oms-form-row label="订单号" :span="8">
              <oms-input v-model="searchCondition.orderNo" placeholder="请输入订单号"
                         @keyup.native.enter="search"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row label="发货单位" :span="6">
              <el-select filterable remote placeholder="名称/拼音/系统代码" :remote-method="filterSenderOrg"
                         :clearable="true"
                         v-model="searchCondition.senderId" popperClass="good-selects">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in senderOrgList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.name}}</span>
                  </div>
                  <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                      <span>系统代码:</span>{{org.manufacturerCode}}
                    </span>
                  </div>
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row label="收货单位" :span="6">
              <el-select filterable remote placeholder="名称/拼音/系统代码" :remote-method="filterReceiverOrg"
                         :clearable="true"
                         v-model="searchCondition.receiverId" popperClass="good-selects">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in receiverOrgList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.name}}</span>
                  </div>
                  <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                      <span>系统代码:</span>{{org.manufacturerCode}}
                    </span>
                  </div>
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="送达时限" :span="4">
              <el-date-picker v-model="deliveryDate" type="daterange" placeholder="请选择">
              </el-date-picker>
            </oms-form-row>
          </el-col>
          <div v-show="showSearch">
            <el-col :span="4">
              <oms-form-row label="委托单号" :span="8">
                <oms-input v-model="searchCondition.tmsOrderNumber" placeholder="请输入委托单号"
                           @keyup.native.enter="search"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row label="目的地区域代码" :span="8">
                <oms-input v-model="searchCondition.destinationAreaCode" placeholder="请输入目的地区域代码"
                           @keyup.native.enter="search"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="4">
              <oms-form-row label="订单类型" :span="9">
                <el-select v-model="searchCondition.waybillType" placeholder="订单类型" :clearable="true">
                  <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in typeList"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row label="发运方式" :span="6">
                <el-select v-model="searchCondition.shipmentWay" placeholder="请选择发运方式" :clearable="true">
                  <el-option :label="item.label" :value="item.key" :key="item.key"
                             v-for="item in shipmentWayList"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row label="货品名称(模糊)" :span="8">
                <oms-input v-model="searchCondition.goodsTotalName" placeholder="请输入货品名称模糊查询"
                           @keyup.native.enter="search"></oms-input>
              </oms-form-row>
            </el-col>
          </div>
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  import {BaseInfo} from '@/resources';

  export default {
    data: function () {
      return {
        searchCondition: {
          orderNo: '',
          waybillType: '',
          shipmentWay: '',
          serviceType: '',
          senderId: '',
          receiverId: '',
          startTime: '',
          endTime: '',
          goodsTotalName:'',
          tmsOrderNumber:'',
          destinationAreaCode:''
        },
        showSearch: false,
        list: [],
        times: [],
        senderOrgList: [],
        receiverOrgList: [],
        deliveryDate: ''
      };
    },
    computed: {
      typeList() {
        return this.$getDict('bizType');
      },
      shipmentWayList() {
        return this.$getDict('transportationCondition');
      },
      serviceTypeList() {
        return this.$getDict('serviceType');
      }
    },
    watch: {
      'searchCondition.senderId': function () {
        this.search();
      },
      'searchCondition.receiverId': function () {
        this.search();
      },
      'searchCondition.waybillType': function () {
        this.search();
      },
      'searchCondition.shipmentWay': function () {
        this.search();
      },
      'deliveryDate': function (val) {
        if (val) {
          this.search();
        } else {
          this.searchCondition.startTime = '';
          this.searchCondition.endTime = '';
          this.$emit('search', this.searchCondition);
        }
      }
    },
    methods: {
      reset() {
        this.searchCondition = {
          orderNo: '',
          waybillType: '',
          shipmentWay: '',
          serviceType: '',
          senderId: '',
          receiverId: '',
          startTime: '',
          endTime: '',
          tmsOrderNumber:'',
          goodsTotalName: '',
          destinationAreaCode:''
        };
        this.deliveryDate = '';
        this.$emit('search', this.searchCondition);
      },
      search() {
        this.searchCondition.startTime = this.$formatAryTime(this.deliveryDate, 0, 'YYYY-MM-DD');
        this.searchCondition.endTime = this.$formatAryTime(this.deliveryDate, 1, 'YYYY-MM-DD');
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      },
      filterSenderOrg: function (query) {// 过滤发货单位
        BaseInfo.query({keyWord: query}).then(res => {
          this.senderOrgList = res.data.list;
        });
      },
      filterReceiverOrg: function (query) {// 过滤收货单位
        BaseInfo.query({keyWord: query}).then(res => {
          this.receiverOrgList = res.data.list;
        });
      }
    }
  };
</script>
