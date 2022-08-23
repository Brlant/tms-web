<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @search="search" @reset="reset" @isShow="isShow">
    <template slot="title">中转入库</template>
    <template slot="pre-btn">
      <slot name="pre-btn"></slot>
    </template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="elColSpan">
            <oms-form-row label="新建时间" :span="omsRowSpan">
              <el-date-picker v-model="createTime" type="daterange" placeholder="请选择">
              </el-date-picker>
            </oms-form-row>
          </el-col>
          <el-col :span="elColSpan">
            <oms-form-row label="中转入库单号" :span="omsRowSpan">
              <oms-input v-model="searchCondition.transferInOrderNo" placeholder="请输入中转入库单号"
                         @keyup.native.enter="search"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="elColSpan">
            <oms-form-row label="订单号" :span="omsRowSpan">
              <oms-input v-model="searchCondition.orderNo" placeholder="请输入订单号"
                         @keyup.native.enter="search"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="elColSpan">
            <oms-form-row label="运单号" :span="omsRowSpan">
              <oms-input v-model="searchCondition.waybillNo" placeholder="请输入运单号"
                         @keyup.native.enter="search"></oms-input>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="elColSpan">
            <oms-form-row label="发货单位" :span="omsRowSpan">
              <el-select filterable remote placeholder="名称/拼音/系统代码" :remote-method="filterSenderOrg"
                         :clearable="true"
                         v-model="searchCondition.senderId" popperClass="good-selects">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in senderOrgList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{ org.name }}</span>
                  </div>
                  <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                      <span>系统代码:</span>{{ org.manufacturerCode }}
                    </span>
                  </div>
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="elColSpan">
            <oms-form-row label="收货单位" :span="omsRowSpan">
              <el-select filterable remote placeholder="名称/拼音" :remote-method="filterReceiverOrg"
                         :clearable="true"
                         v-model="searchCondition.receiverId" popperClass="good-selects">
                <el-option :value="org.receiverId" :key="org.receiverId" :label="org.receiverName"
                           v-for="org in receiverOrgList">
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="elColSpan">
            <oms-form-row label="承运类型" :span="omsRowSpan">
              <el-select v-model="searchCondition.carryType" placeholder="请选择承运类型" clearable>
                <el-option :value="0" label="自行承运"></el-option>
                <el-option :value="1" label="第三方承运"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
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
      elColSpan: 6,
      omsRowSpan: 8,
      searchCondition: {
        createTime1: '',
        createTime2: '', // 新建时间
        transferInOrderNo: '',  // 中转入库单号
        orderNo: '',   // 订单号
        waybillNo: '',  // 运单号
        senderId: '',  // 发货单位
        receiverId: '', // 收货单位
        carryType: ''  // 承运类型
      },
      showSearch: false,
      list: [],
      senderOrgList: [],     // 发货单位数组
      receiverOrgList: [],   //收货单位数组
      createTime: []  // 新建时间
    };
  },

  watch: {
    'searchCondition.carryType': function () {
      this.search();
    },
    'searchCondition.tmsOrderNumber': function () {
      this.search();
    },
    'searchCondition.senderId': function () {
      this.search();
    },
    'searchCondition.receiverId': function () {
      this.search();
    },
    'searchCondition.orderNo': function () {
      this.search();
    },
    'searchCondition.waybillNumber': function () {
      this.search();
    },
    'createTime': function (val) {
      if (val) {
        this.search();
      } else {
        this.searchCondition.createTime1 = '';
        this.searchCondition.createTime2 = '';
        this.$emit('search', this.searchCondition);
      }
    }
  },
  methods: {
    reset() {
      this.searchCondition = {
        createTime1: '',
        createTime2: '',
        transferInOrderNo:'',
        waybillNumber: '',
        orderNo: '',
        tmsOrderNumber: '',
        waybillNo:'',
        senderId: '',
        receiverId: '',
        carryType: ''
      };

      this.createTime = '';
      this.$emit('search', this.searchCondition);
    },
    search() {
      this.searchCondition.createTime1 = this.$formatAryTime(this.createTime, 0, 'YYYY-MM-DD 00:00:00');
      this.searchCondition.createTime2 = this.$formatAryTime(this.createTime, 1, 'YYYY-MM-DD 23:59:59');
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
    // 过滤收货单位
    filterReceiverOrg: function (receiverName, pageNo = 1, pageSize = 100) {
      this.$http.get('/receiver', {params: {receiverName, pageNo, pageSize}})
        .then(res => {
          const {totalPage, list} = res.data;
          if (pageNo == 1) {
            this.receiverOrgList = list;
          } else {
            this.receiverOrgList = this.receiverOrgList.concat(list);
          }

          if (totalPage > pageNo) {
            this.filterReceiverOrg(receiverName, pageNo++);
          }
        });
    },
  }
};
</script>
