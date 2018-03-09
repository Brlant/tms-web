<template>
  <search-template :isShow="showSearch" @search="search" @reset="reset" @isShow="isShow">
    <template slot="title">订单查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row label="订单号" :span="8">
              <oms-input v-model="searchCondition.orderNo" placeholder="请输入运单号"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="发货单位" :span="7">
              <el-select filterable remote placeholder="请输入名称/拼音首字母缩写/系统代码搜索" :remote-method="filterSenderOrg"
                         :clearable="true" @click.native.once="filterSenderOrg('')"
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
          <el-col :span="8">
            <oms-form-row label="收货单位" :span="7">
              <el-select filterable remote placeholder="请输入名称/拼音首字母缩写/系统代码搜索" :remote-method="filterReceiverOrg"
                         :clearable="true" @click.native.once="filterReceiverOrg('')"
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
            <oms-form-row label="送达时限" :span="8">
              <el-date-picker v-model="deliveryDate" type="daterange" placeholder="请选择">
              </el-date-picker>
            </oms-form-row>
          </el-col>
          <div v-show="showSearch">
            <el-col :span="8">
              <oms-form-row label="运单类型" :span="7">
                <el-select v-model="searchCondition.waybillType" placeholder="请选择订单类型" :clearable="true">
                  <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in typeList"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="发运方式" :span="7">
                <el-select v-model="searchCondition.shipmentWay" placeholder="请选择发运方式" :clearable="true">
                  <el-option :label="item.label" :value="item.key" :key="item.key"
                             v-for="item in shipmentWayList"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="服务方式" :span="8">
                <el-select v-model="searchCondition.serviceType" placeholder="请选择服务方式" :clearable="true">
                  <el-option :label="item.label" :value="item.key" :key="item.key"
                             v-for="item in serviceTypeList"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
          </div>
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  import {BaseInfo} from '../../../resources';

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
          endTime: ''
        },
        showSearch: false,
        list: [],
        times: [],
        senderOrgList: [],
        receiverOrgList: [],
        deliveryDate: []
      };
    },
    computed: {
      typeList() {
        return this.$getDict('tmsOrderType');
      },
      shipmentWayList() {
        return this.$getDict('shipmentWayType');
      },
      serviceTypeList() {
        return this.$getDict('serviceType');
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
          endTime: ''
        };
        this.$emit('search', this.searchCondition);
      },
      search () {
        if (!this.deliveryDate[0]) {
          this.searchCondition.startTime = '';
        } else {
          this.searchCondition.startTime = this.$moment(this.deliveryDate[0]).format('YYYY-MM-DD');
        }
        if (!this.deliveryDate[1]) {
          this.searchCondition.endTime = '';
        } else {
          this.searchCondition.endTime = this.$moment(this.deliveryDate[1]).format('YYYY-MM-DD');
        }
        this.$emit('search', this.searchCondition);
      },
      isShow (val) {
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
