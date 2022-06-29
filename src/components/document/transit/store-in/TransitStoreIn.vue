<style lang="scss" scoped>

  .i-bg {
    display: inline-block;
    background: #eee;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    text-align: center;
    line-height: 35px;
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .order-list-item {
    cursor: pointer;
  }
</style>
<template>
  <div class="order-page">
    <div class="container">

      <el-form v-show="showSearch" class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row label="货主" :span="5">
              <org-select v-model="searchCondition.orgId" :list="orgList"
                          :remoteMethod="filterCustomer" @change="orgChange"
                          placeholder="请输入关键字搜索货主信息"></org-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="货主订单号" :span="6">
              <oms-input type="text" v-model="searchCondition.orderNo" placeholder="请输入货主订单号"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="业务类型" :span="6">
              <el-select type="text" v-model="searchCondition.bizType" placeholder="请选择业务类型">
                <el-option :value="item.key" :key="item.key" :label="item.label"
                           v-for="item in bizTypes">
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="物流方式" :span="5">
              <el-select type="text" v-model="searchCondition.transportationMeansId" placeholder="请选择物流方式">
                <el-option :value="item.key" :key="item.key" :label="item.label"
                           v-for="item in transportationMeansList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="来源单位" :span="6">
              <div @click="isOrgListExist">
                <org-select v-model="searchCondition.supplierId" :list="customerList"
                            :remoteMethod="filterOrg"
                            placeholder="请输入关键字搜索来源单位"></org-select>
              </div>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="来源订单号" :span="6">
              <oms-input type="text" v-model="searchCondition.thirdPartyNumber" placeholder="请输入来源订单号"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="9">
            <oms-form-row label="预计入库/拟退货时间" :span="8">
              <el-col :span="24">
                <el-date-picker
                  v-model="expectedTime"
                  type="daterange"
                  placeholder="请选择" format="yyyy-MM-dd">
                </el-date-picker>
              </el-col>
            </oms-form-row>
          </el-col>
          <el-col :span="9">
            <oms-form-row label="上架时间" :span="5">
              <el-col :span="24">
                <el-date-picker
                  v-model="completeTime"
                  type="datetimerange"
                  :default-time="['00:00:00', '23:59:59']"
                  placeholder="请选择">
                </el-date-picker>
              </el-col>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row label="" :span="3">
              <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
              <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>
      <status-list class="container" :activeStatus="activeStatus" :statusList="orgType" :checkStatus="checkStatus">
        <span class="btn-group-right">
          <goods-switch></goods-switch>
          <a href="#" class="btn-circle" @click.stop.prevent="showSearch = !showSearch">
              <i class="el-icon-t-search"></i>
          </a>
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
          <!--<el-col :span="3">操作</el-col>-->
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="orderList.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else class="order-list-body flex-list-dom">
          <div class="order-list-item" v-for="item in orderList"
               :class="['status-'+(parseInt(item.wmsStatus, 10)+1) ,{'active':currentOrderId==item.id}]"
               @click="showDetail(item)">
            <el-row>
              <el-col :span="4">
                <div class="f-grey">
                  {{item.orderNo }}
                </div>
                <div>
                  {{item.orgName }}
                </div>
              </el-col>
              <el-col :span="2">
                <div>
                  <dict :dict-group="'bizInType'" :dict-key="item.bizType"></dict>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="f-grey" v-show="item.bizType ==='1-0'||item.bizType ==='1-1'">{{item.thirdPartyNumber }}
                </div>
                <div v-show="item.bizType ==='1-0'||item.bizType ==='1-1'">{{item.supplierName }}</div>
              </el-col>
              <el-col :span="4">
                <div v-show="item.bizType !== '1-2'">
                  <div v-show="item.transportationMeansId">
                    物流方式：
                    <dict :dict-group="'transportationMeans'" :dict-key="item.transportationMeansId"></dict>
                  </div>
                </div>
                <div v-show="item.transportationMeansId === '1'||item.transportationMeansId === '3'  ">
                  <span v-show="item.logisticsProviderName"> 物流商：{{ item.logisticsProviderName}}</span>
                </div>
                <div v-show="item.transportationMeansId === '2'">
                  <span v-show="item.transportationAddress">
                      提货地址：{{ item.pickUpWarehouseAddress}}
                  </span>
                </div>
              </el-col>
              <el-col :span="3">
                <div>
                  {{getOrderStatus(item)}}
                  <el-tag type="warning" v-show="item.rushOrderFlag">急</el-tag>
                </div>
              </el-col>
              <el-col :span="5">

                <div v-show="item.bizType !== '1-2' ">
                  <span v-show="item.bizType === '1-1' && item.expectedTime"
                        style="letter-spacing:0.5em;margin-right: -0.5em">拟退货：</span>
                  <span v-show="item.bizType !== '1-1' && item.expectedTime">预计入库：</span>{{ item.expectedTime | date}}
                </div>
                <div>
                  <span v-show="item.completeTime">上架：</span>{{item.completeTime | minute }}
                </div>
              </el-col>
            </el-row>
            <order-goods-info :order-item="item"></order-goods-info>
            <div class="order-list-item-bg"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="(orderList.length || pager.currentPage !== 1) && !loadingData">

      <el-cu-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="pager.currentPage"
                        :page-sizes="[10,20,50,100]" :page-size="pager.pageSize"
                        layout="sizes, prev, pager, next, jumper"
                        :total="pager.count">
      </el-cu-pagination>
    </div>
    <page-right :show=" showPartIndex === '5'" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}"
                partClass="pr-no-animation">
      <detail @close="resetRightBox" :orderId="currentOrderId" :showPartIndex="showPartIndex"></detail>
    </page-right>
  </div>
</template>
<script>
import utils from '@/tools/utils';
import detail from './detail/index.vue';
import {BaseInfo, InWork} from '@/resources';

export default {
    components: {
      detail
    },
    data() {
      return {
        activeStatus: 0, // 当前状态
        loadingData: true,
        showPartIndex: '', // 是否显示确认
        showSearch: false,
        orgType: utils.inType,
        orderList: [],
        currentOrderId: '',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
        },
        filters: {
          searchType: 1,
          type: 0,
          state: 4,
          wmsStatus: null,
          deleteFlag: false,
          orgId: '',
          orderNo: '',
          bizType: '',
          logisticsProviderName: '',
          expectedStartTime: '',
          expectedEndTime: '',
          completeStartTime: '',
          completeEndTime: '',
          transportationMeansId: '',
          supplierId: '',
          thirdPartyNumber: ''
        },
        searchCondition: {
          orgId: '',
          orderNo: '',
          bizType: '',
          logisticsProviderName: '',
          expectedStartTime: '',
          expectedEndTime: '',
          completeStartTime: '',
          completeEndTime: '',
          transportationMeansId: '',
          supplierId: '',
          thirdPartyNumber: ''
        },
        expectedTime: '',
        completeTime: '',
        orgList: [], // 查询 货主列表
        customerList: [], // 来源单位列表
        logisticsList: [] // 物流商列表
      };
    },
    mounted() {
      this.getOrders(1);
    },
    computed: {
      transportationMeansList: function () {
        return this.$getDict('transportationMeans');
      },
      bizTypes: function () {
        return this.$getDict('bizInType');
      },
      isShowGoodsList() {
        return this.$store.state.isShowGoodsList;
      }
    },
    watch: {
      filters: {
        handler: function () {
          this.getOrders(1);
        },
        deep: true
      },
      isShowGoodsList() {
        this.getOrders(1);
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pager.pageSize = val;
        window.localStorage.setItem('currentPageSize', val);
        this.getOrders(1);
      },
      handleCurrentChange(val) {
        this.getOrders(val);
      },
      resetRightBox: function () { // 重置弹出窗
        // this.currentOrderId = '';
        if (this.showPartIndex !== '5') {
          this.getOrders(this.pager.currentPage);
        }
        this.showPartIndex = '';
      },
      transformStatus(orderId) {
        this.orderList.forEach(i => {
          if (i.id === orderId) {
            i.wmsStatus = (parseInt(i.wmsStatus, 10) + 1).toString();
          }
        });
        this.resetRightBox();
      },
      checkStatus(item, key) {
        this.activeStatus = key;
        this.filters.wmsStatus = item.state;
      },
      showDetail(item) {
        this.currentOrderId = item.id;
        this.showPartIndex = '5';
      },
      showRightPart: function (item) {
        this.currentOrderId = item.id;
        this.$nextTick(() => {
          this.showPartIndex = item.wmsStatus;
        });
      },
      claimTack(item) {
        this.currentOrderId = item.id;
        this.$confirm('是否认领任务', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          InWork.claimReviewTack(item.id).then(() => {
            this.$notify.success({
              message: '认领任务成功'
            });
            this.resetRightBox();
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '认领任务失败'
            });
          });
        });
      },
      claimShelfTack(item) {
        this.currentOrderId = item.id;
        this.$confirm('是否认领任务', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          InWork.claimShelfTack(item.id).then(() => {
            this.$notify.success({
              message: '认领任务成功'
            });
            this.resetRightBox();
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '认领任务失败'
            });
          });
        });
      },
      claimAutoTack(item) {
        this.currentOrderId = item.id;
        this.$confirm('是否一键认领任务', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          InWork.claimTack(item.id).then(() => {
            this.$notify.success({
              message: '一键认领任务成功'
            });
            this.resetRightBox();
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '一键认领任务失败'
            });
          });
        });
      },
      onShelf(item) {
        this.currentOrderId = item.id;
        this.$confirm('是否确认上架', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          InWork.onShelf(item.id).then(res => {
            this.$notify.success({
              message: '确认上架成功'
            });
            this.resetRightBox();
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '确认上架失败'
            });
          });
        });
      },
      getOrders(pageNo) { // 从oms中查询订单
        // if (pageNo === 1) {
        //   this.pager.count = 0;
        // }
        this.pager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          logisticsCentreId: window.localStorage.getItem('logisticsCentreId')
        }, this.filters);
        params.isShowDetail = !!JSON.parse(window.localStorage.getItem('isShowGoodsList'));
        this.loadingData = true;
        let nowTime = Date.now();
        this.nowTime = nowTime;
        InWork.queryOmsOrder(params).then(res => {
          if (this.nowTime > nowTime) return;
          res.data.list.forEach(item => {
            item.isChecked = false;
          });
          this.orderList = res.data.list;
          // 设置分页数
          this.pager.count = this.pager.currentPage * this.pager.pageSize + (this.orderList.length === this.pager.pageSize ? 1 : 0);
          this.loadingData = false;
        });
        this.queryOrderCount();
      },
      queryOrderCount() {
        let params = JSON.parse(JSON.stringify(this.filters));
        params.wmsStatus = null;
        params.logisticsCentreId = window.localStorage.getItem('logisticsCentreId');
        InWork.queryOrderCount(params).then(res => {
          this.orgType[0].num = res.data['all'];
          this.orgType[1].num = res.data['task-execute'];
          this.orgType[2].num = res.data['completed'];
        });
      },
      getOrderStatus: function (order) { // 获取订单状态
        let orgTypeItem = this.orgType[parseInt(order.wmsStatus, 10) + 1];
        return orgTypeItem && orgTypeItem.title || '';
      },
      filterCustomer: function (query) {// 过滤客户
        BaseInfo.query({keyWord: query, type: 0}).then(res => {
          this.orgList = res.data.list;
        });
      },
      filterOrg: function (query) {// 过滤供货商
        let orgId = this.searchCondition.orgId;
        if (!orgId) {
          this.searchCondition.supplierId = '';
          this.customerList = [];
          return;
        }
        BaseInfo.queryOrgByReation(orgId, {keyWord: query}).then(res => {
          this.customerList = res.data;
        });
      },
      filterLogistics: function (query) {// 过滤物流提供方
        let orgId = this.searchCondition.orgId;
        if (!orgId) {
          this.searchCondition.logisticsProviderName = '';
          this.logisticsList = [];
          return;
        }
        BaseInfo.queryOrgByValidReation(orgId, {keyWord: query, relation: '3'}).then(res => {
          this.logisticsList = res.data;
        });
      },
      orgChange: function () {
        this.searchCondition.supplierId = '';
        this.customerList = [];
        this.filterOrg();
        this.filterLogistics();
      },
      searchInOrder: function () {// 搜索
        this.searchCondition.expectedStartTime = this.$formatAryTime(this.expectedTime, 0, 'YYYY-MM-DD');
        this.searchCondition.expectedEndTime = this.$formatAryTime(this.expectedTime, 1, 'YYYY-MM-DD');
        this.searchCondition.completeStartTime = this.$formatAryTime(this.completeTime, 0);
        this.searchCondition.completeEndTime = this.$formatAryTime(this.completeTime, 1);
        Object.assign(this.filters, this.searchCondition);
      },
      formatTimeAry(times, index, str) {
        if (!times) return '';
        return this.formatTime(times[index], str);
      },
      formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
        return time ? this.$moment(time).format(str) : '';
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          orgId: '',
          orderNo: '',
          bizType: '',
          logisticsProviderName: '',
          expectedStartTime: '',
          expectedEndTime: '',
          completeStartTime: '',
          completeEndTime: '',
          transportationMeansId: '',
          supplierId: '',
          thirdPartyNumber: ''
        };
        this.expectedTime = '';
        this.completeTime = '';
        if (this.isSupplierOrOrg) {
          temp.orgId = this.$route.params.id;
        }
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
        this.orgChange();
      },
      isOrgListExist: function () {
        if (!this.searchCondition.orgId) {
          this.$notify.info({
            duration: 2000,
            message: '请先选择货主'
          });
          return;
        }
        if (this.customerList.length === 0) {
          this.$notify.info({
            duration: 2000,
            message: '货主无来源单位'
          });
        }
      }
    }
  };
</script>
