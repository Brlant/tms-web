<template>
  <search-template :isShow="showSearch" @search="search" @reset="reset" @isShow="isShow">
    <template slot="title">运单查询</template>
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
            <oms-form-row label="运单号" :span="omsRowSpan">
              <oms-input v-model="searchCondition.waybillNumber" placeholder="请输入运单号"
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
            <oms-form-row label="委托单号" :span="omsRowSpan">
              <oms-input v-model="searchCondition.tmsOrderNumber" placeholder="请输入委托单号"
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
<!--          <el-col :span="elColSpan">-->
<!--            <oms-form-row label="收货单位" :span="omsRowSpan">-->
<!--              <el-select filterable remote placeholder="名称/拼音" :remote-method="filterReceiverOrg"-->
<!--                         :clearable="true"-->
<!--                         v-model="searchCondition.receiverId" popperClass="good-selects">-->
<!--                <el-option :value="org.receiverId" :key="org.receiverId" :label="org.receiverName"-->
<!--                           v-for="org in receiverOrgList">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </oms-form-row>-->
<!--          </el-col>-->
          <el-col :span="elColSpan">
            <oms-form-row label="承运类型" :span="omsRowSpan">
              <el-select v-model="searchCondition.carryType" placeholder="请选择承运类型" clearable>
                <el-option :value="0" label="自行承运"></el-option>
                <el-option :value="1" label="第三方承运"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="elColSpan">
            <oms-form-row label="状态" :span="omsRowSpan">
              <el-radio-group v-model="searchCondition.packFlag" size="small">
                <el-radio-button label="true">已打包</el-radio-button>
                <el-radio-button label="false">未打包</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="elColSpan5">
            <oms-form-row label="目的地区域代码" :span="8">
              <oms-input v-model="searchCondition.destinationAreaCode" placeholder="请输入目的地区域代码"
                         @keyup.native.enter="search"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="elColSpan5">
            <oms-form-row label="货品名称(模糊)" :span="8">
              <oms-input v-model="searchCondition.goodsTotalName" placeholder="请输入货品名称模糊查询"
                         @keyup.native.enter="search"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="elColSpan">
            <oms-form-row label="送达时限" :span="omsRowSpan">
              <el-date-picker v-model="deliveryDate" type="daterange" placeholder="请选择">
              </el-date-picker>
            </oms-form-row>
          </el-col>
          <el-col :span="elColSpan4">
            <oms-form-row label="面单号" :span="4">
              <oms-input v-model="searchCondition.faceSheetNo" placeholder="请输入面单号"
                         @keyup.native.enter="search"></oms-input>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row v-show="showSearch">
          <el-col :span="elColSpan">
            <oms-form-row label="运单类型" :span="omsRowSpan">
              <el-select v-model="searchCondition.waybillType" placeholder="订单类型" :clearable="true">
                <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in typeList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="elColSpan">
            <oms-form-row label="运输条件" :span="omsRowSpan">
              <el-select v-model="searchCondition.shipmentWay" placeholder="请选择运输条件" :clearable="true">
                <el-option :label="item.label" :value="item.key" :key="item.key"
                           v-for="item in shipmentWayList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="elColSpan">
            <oms-form-row label="发运方式" :span="omsRowSpan">
              <el-select v-model="searchCondition.deliveryWay" placeholder="请选择发运方式" :clearable="true">
                <el-option :label="item.label" :value="item.key" :key="item.key"
                           v-for="item in deliveryWayList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <!--<el-col :span="elColSpan">-->
          <!--<oms-form-row label="服务方式" :span="omsRowSpan">-->
          <!--<el-select v-model="searchCondition.serviceType" placeholder="请选择服务方式" :clearable="true">-->
          <!--<el-option :label="item.label" :value="item.key" :key="item.key"-->
          <!--v-for="item in serviceTypeList"></el-option>-->
          <!--</el-select>-->
          <!--</oms-form-row>-->
          <!--</el-col>-->
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
      elColSpan5: 5,
      elColSpan4: 4,
      omsRowSpan: 8,
      searchCondition: {
        waybillNumber: '',
        orderNo: '',
        tmsOrderNumber: '',
        faceSheetNo:'',
        waybillType: '',
        shipmentWay: '',
        deliveryWay: '',
        serviceType: '',
        senderId: '',
        receiverId: '',
        startTime: '',
        endTime: '',
        packFlag: '',
        goodsTotalName: '',
        destinationAreaCode: '',
        carryType: ''
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
      return this.$getDict('bizType');
    },
    deliveryWayList() {
      return this.$getDict('deliveryWay');
    },
    shipmentWayList() {
      return this.$getDict('transportationCondition');
    },
    serviceTypeList() {
      return this.$getDict('serviceType');
    }
  },
  watch: {
    'searchCondition.waybillNumber': function () {
        this.search();
      },
    'searchCondition.carryType': function () {
      this.search();
    },
    'searchCondition.packFlag': function () {
      this.search();
    },
    'searchCondition.orderNo': function () {
        this.search();
      },
      'searchCondition.tmsOrderNumber': function () {
        this.search();
      },
      'searchCondition.faceSheetNo': function () {
        this.search();
      },
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
    'searchCondition.deliveryWay': function () {
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
      reset () {
        this.searchCondition = {
          waybillNumber: '',
          orderNo: '',
          tmsOrderNumber:'',
          waybillType: '',
          shipmentWay: '',
          deliveryWay:'',
          serviceType: '',
          senderId: '',
          receiverId: '',
          carryType: '',
          faceSheetNo:'',
          startTime: '',
          endTime: '',
          goodsTotalName: '',
          packFlag: '',
          destinationAreaCode:''
        };
        this.deliveryDate = '';
        this.$emit('search', this.searchCondition);
      },
      search () {
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
