<style>
  .el-date-editor .el-range__close-icon {
    font-size: 14px;
    color: #c0c4cc;
    width: 20px;
    display: inline-block;
    float: right;
    line-height: 32px;
  }
</style>
<template>
  <search-template :isShow="showSearch" @search="search" @reset="reset" @isShow="isShow">
    <template slot="title">运单查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="10">
            <oms-form-row label="集货区" :span="6">
              <el-select filterable remote placeholder="请选择集货区" :remote-method="filterGoodsArea"
                         :clearable="true" multiple
                         v-model="searchCondition.goodsAreaIdList" popperClass="good-selects">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in goodsAraeList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.name}}</span>
                  </div>
                  <div style="overflow: hidden" v-show="org.code">
                    <span class="select-other-info pull-left">
                      <span>集货区代码:</span>{{org.code}}
                    </span>
                  </div>
                </el-option>
              </el-select>
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
          <el-col :span="8">
            <oms-form-row label="送达时限" :span="4" style="width: 100%">
              <el-date-picker v-model="deliveryDate" type="daterange" format="yyyy-MM-dd" start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </oms-form-row>
          </el-col>
          <div v-show="showSearch">
            <el-col :span="4">
              <oms-form-row label="运单号" :span="8">
                <oms-input v-model="searchCondition.waybillNumber" placeholder="请输入运单号"
                           @keyup.native.enter="search"></oms-input>
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
            <el-col :span="4">
              <oms-form-row label="运单类型" :span="8">
                <el-select v-model="searchCondition.waybillType" placeholder="运单类型" :clearable="true">
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
            <!--<el-col :span="6">-->
            <!--<oms-form-row label="服务方式" :span="6">-->
            <!--<el-select v-model="searchCondition.serviceType" placeholder="请选择服务方式" :clearable="true">-->
            <!--<el-option :label="item.label" :value="item.key" :key="item.key"-->
            <!--v-for="item in serviceTypeList"></el-option>-->
            <!--</el-select>-->
            <!--</oms-form-row>-->
            <!--</el-col>-->
          </div>
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  import {BaseInfo,GoodsArea} from '@/resources';
  import utils from '@/tools/utils';

  export default {
    data: function () {
      return {
        searchCondition: {
          waybillNumber: '',
          waybillType: '',
          shipmentWay: '',
          serviceType: '',
          senderId: '',
          receiverId: '',
          startTime: '',
          endTime: '',
          goodsAreaIdList:[]
        },
        showSearch: false,
        list: [],
        times: [],
        senderOrgList: [],
        receiverOrgList: [],
        goodsAraeList:[],
        deliveryDate: []
      };
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
      'searchCondition.goodsAreaIdList': function () {
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
    computed: {
      typeList () {
        return this.$getDict('bizType');
      },
      shipmentWayList () {
        return this.$getDict('transportationCondition');
      },
      serviceTypeList () {
        return this.$getDict('serviceType');
      }
    },
    methods: {
      reset () {
        this.searchCondition = {
          waybillNumber: '',
          waybillType: '',
          shipmentWay: '',
          serviceType: '',
          senderId: '',
          receiverId: '',
          startTime: '',
          endTime: '',
          goodsAreaIdList:[]
        };
        this.deliveryDate = '';
        this.$emit('search', this.searchCondition);
      },
      search () {
        this.searchCondition.startTime = this.$formatAryTime(this.deliveryDate, 0, 'YYYY-MM-DD');
        this.searchCondition.endTime = this.$formatAryTime(this.deliveryDate, 1, 'YYYY-MM-DD');
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
      },
      filterGoodsArea: function (query) {// 过滤集货区
        let param = Object.assign({}, {
          pageNo: 1,
          pageSize: 20,
          keyWord: query
        });
        GoodsArea.getPage(param).then(res => {
          this.goodsAraeList = res.data.list;
        });
      }
    }
  };
</script>
