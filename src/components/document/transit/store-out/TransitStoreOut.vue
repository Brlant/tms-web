<style lang="scss" scoped>

  .wave-title {
    margin-left: 5px;
    font-size: 14px;
    font-weight: normal;
  }

  .wms-btn-group {
    margin-bottom: 10px;
    overflow: hidden;
  }

  .danger-row {
    color: #ff3300;
  }

  .special-col {
    padding-left: 20px;
    position: relative;
    .el-checkbox {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
<template>
  <div class="order-page">
    <div class="container">

      <el-form v-show="showSearch" class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row label="货主订单编号" :span="6">
              <oms-input type="text" v-model="searchCondition.orderNo" placeholder="请输入货主订单编号"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="货主" :span="5">
              <org-select v-model="searchCondition.orgId" :list="orgList"
                          :remoteMethod="filterCustomer" @change="orgChange"
                          placeholder="请输入关键字搜索货主信息"></org-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="货主货品" :span="6">
              <el-select v-model="searchCondition.orgGoodsId" filterable remote placeholder="请输入名称搜索货主货品"
                         :remote-method="searchProduct" @click.native.once="searchProduct('')" :clearable="true"
                         popper-class="good-selects">
                <el-option v-for="item in orgGoodses" :key="item.orgGoodsDto.id"
                           :label="item.orgGoodsDto.name"
                           :value="item.orgGoodsDto.id">
                  <div style="overflow: hidden">
                    <span class="pull-left">{{item.orgGoodsDto.name}}</span>
                  </div>
                  <div style="overflow: hidden">
                     <span class="pull-left">
                         <el-tag class="el-tag-mini" type="danger" v-show="!item.orgGoodsDto.status">停用</el-tag>
                      </span>
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.goodsNo">货品编号:</span>{{item.orgGoodsDto.goodsNo}}
                        </span>
                    <span class="select-other-info pull-left"><span
                      v-show="item.orgGoodsDto.salesFirmName">供货单位:</span>{{ item.orgGoodsDto.salesFirmName }}
                        </span>
                  </div>
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="货品主档" :span="6">
              <goods-select placeholder="请输入名称搜索货品主档" :remote-method="filterGoods"
                            v-model="searchCondition.goodsId" :list="goodsList"></goods-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="6" label="货品主档(模糊)">
              <oms-input v-model="searchCondition.goodsName" placeholder="请输入货品主档(模糊)" type="text"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="业务类型" :span="6">
              <el-select type="text" v-model="searchCondition.bizType" placeholder="请选择业务类型">
                <el-option :value="item.key" :key="item.key" :label="item.label"
                           v-for="item in bizTypes"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="去向单位" :span="6">
              <div @click="isOrgListExist">
                <org-select v-model="searchCondition.customerId" :list="customerList"
                            :remoteMethod="filterOrg"
                            placeholder="请输入关键字搜索去向单位"></org-select>
              </div>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="去向订单号" :span="6">
              <oms-input type="text" v-model="searchCondition.thirdPartyNumber" placeholder="请输入去向订单号"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="8" label="去向单位区域代码">
              <oms-input v-model="searchCondition.areaCode" placeholder="请输入去向单位区域代码" type="text"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="6" label="物流方式">
              <el-select type="text" v-model="searchCondition.transportationMeansId" placeholder="请选择物流方式">
                <el-option :value="item.key" :key="item.key" :label="item.label"
                           v-for="item in transportationMeansList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="出库完成时间" :span="6">
              <el-date-picker
                v-model="completeTime"
                type="datetimerange"
                :default-time="['00:00:00', '23:59:59']"
                placeholder="请选择">
              </el-date-picker>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="4" label="下单时间">
              <el-date-picker
                v-model="createdTimes"
                :default-time="['00:00:00', '23:59:59']"
                placeholder="请选择下单时间"
                type="datetimerange">
              </el-date-picker>
            </oms-form-row>
          </el-col>
          <el-col :span="10">
            <oms-form-row label="预计出库/送货/提货/发货时间" :span="10">
              <el-col :span="24">
                <el-date-picker
                  v-model="expectedTime"
                  type="daterange"
                  placeholder="请选择日期" format="yyyy-MM-dd">
                </el-date-picker>
              </el-col>
            </oms-form-row>
          </el-col>
          <el-col :span="4">
            <oms-form-row label="" :span="1">
              <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
              <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>
      <status-list class="container" :activeStatus="activeStatus" :statusList="outType" :checkStatus="checkStatus">
       <span class="btn-group-right">
           <goods-switch></goods-switch>
          <a href="#" class="btn-circle" @click.prevent="showSearch = !showSearch">
              <i class="el-icon-t-search"></i>
          </a>
          <perm label="stock-out-wave-create" v-show="activeStatus === '1'" class="opera-btn">
             <el-tooltip content="选择订单后，指定发波方式" effect="dark" placement="bottom">
               <span @click="createWave" style="cursor:pointer"><a href="#" @click.prevent="" class="btn-circle"><i
                 class="el-icon-t-wave"></i></a><span class="wave-title">指定发波</span></span>
             </el-tooltip>
          </perm>
          <perm label="stock-out-wave-create" v-show="activeStatus === '1'" class="opera-btn">
             <el-tooltip effect="dark" placement="bottom" content="根据当前的查询条件，自动将查询结果的所有订单合并发波">
                <span @click="createLotWave" style="cursor:pointer"><a href="#" @click.prevent="" class="btn-circle"><i
                  class="el-icon-t-batch-create"></i></a><span class="wave-title">自动发波</span></span>
             </el-tooltip>
          </perm>
        </span>
      </status-list>
      <div class="order-list clearfix" style="margin-top: 20px">
        <el-row class="order-list-header">
          <el-col :span="5">
            <el-checkbox @change="checkAll" v-model="isCheckAll" v-show="activeStatus === '1'"></el-checkbox>
            货主/订单号
          </el-col>
          <el-col :span="2">业务类型</el-col>
          <el-col :span="4">去向/订单号</el-col>
          <el-col :span="6">物流</el-col>
          <el-col :span="1">状态</el-col>
          <el-col :span="4">时间</el-col>
          <el-col :span="2">操作</el-col>
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
               :class="['status-'+filterListColor(item.wmsStatus),{'active':currentOrderId==item.id}]"
               @click.prevent="currentOrderId = item.id;">
            <el-row :class="formatExpectedTimeRowClass(item)">
              <el-col :span="5" class="special-col">
                <div class="el-checkbox-warp " @click.stop.prevent="checkItem(item)" v-show="activeStatus === '1'">
                  <el-checkbox v-model="item.isChecked"></el-checkbox>
                </div>
                <div class="f-grey">
                  {{item.orderNo }}
                </div>
                <div>
                  {{item.orgName }}
                </div>
              </el-col>
              <el-col :span="2">
                <div>
                  <dict :dict-group="'bizOutType'" :dict-key="item.bizType"></dict>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="f-grey" v-show="item.bizType ==='2-0'||item.bizType ==='2-1'">{{item.thirdPartyNumber }}
                </div>
                <div v-show="item.bizType ==='2-0'||item.bizType ==='2-1'">{{ item.customerName }}</div>
              </el-col>
              <el-col :span="6">
                <div v-show="item.bizType !== '2-2' && item.bizType !== '2-4'">
                  <div v-show="item.transportationMeansId">
                    物流方式：
                    <dict :dict-group="'outTransportMeans'" :dict-key="item.transportationMeansId"></dict>
                  </div>
                </div>
                <div v-show="item.bizType !== '2-2' && item.bizType !== '2-4' ">仓库地址：{{ item.warehouseAddress}}</div>
              </el-col>
              <el-col :span="1" class="pt10">
                <div>
                  {{getOrderStatus(item)}}
                  <el-tag type="warning" v-show="item.rushOrderFlag">急</el-tag>
                </div>
              </el-col>
              <el-col :span="4">
                <div v-show="item.createTime">下单时间：{{item.createTime | time }}</div>
                <div v-show="item.bizType !== '2-2' && item.bizType !== '2-4' && item.expectedTime">{{
                  getTimeTitle(item)
                  }}：{{ item.expectedTime | date }}
                </div>
                <div v-show="item.completeTime">出库完成：{{item.completeTime | time }}</div>
              </el-col>
              <el-col :span="2" class="opera-btn">
                <div>
                  <perm label="stock-out-reviewer">
                    <span @click="showDetailPart=true" class="">
                      <a href="#" class="btn-circle btn-opera" @click.prevent=""><i
                        class="el-icon-t-detail"></i></a>查看详情
                    </span>
                  </perm>
                </div>
                <!--<div style="margin-top: 5px">-->
                <!--<perm label="stock-out-transport" style="margin-top: 8px">-->
                <!--<span @click="transportation(item)" class="" v-show="item.wmsStatus === '10'">-->
                <!--<a href="#" class="btn-circle btn-opera" @click.prevent=""><i-->
                <!--class="el-icon-t-affirm"></i></a>开始运输-->
                <!--</span>-->
                <!--</perm>-->
                <!--</div>-->
                <!--<div style="margin-top: 5px">-->
                <!--<perm label="stock-out-sign-in" style="margin-top: 8px">-->
                <!--<span @click="sign(item)" class="" v-show="item.wmsStatus === '11'">-->
                <!--<a href="#" class="btn-circle btn-opera" @click.prevent=""><i-->
                <!--class="el-icon-t-affirm"></i></a>签收-->
                <!--</span>-->
                <!--</perm>-->
                <!--</div>-->
              </el-col>
            </el-row>
            <order-goods-info :order-item="item"></order-goods-info>
            <div class="order-list-item-bg"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center"
         v-show="(orderList.length || pager.currentPage !== 1) && !loadingData && this.filters.wmsStatus !== '0' ">
      <el-cu-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="pager.currentPage"
                        :page-sizes="[10,20,50,100]" :page-size="pager.pageSize"
                        layout="sizes, prev, pager, next, jumper"
                        :total="pager.count">
      </el-cu-pagination>
    </div>
    <page-right :show="shoWavePart" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}"
                partClass="pr-no-animation">
      <wave-info :checkList="checkListPara" @close="resetRightBox"></wave-info>
    </page-right>
    <page-right :show="showDetailPart" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}"
                partClass="pr-no-animation">
      <detail :orderId="currentOrderId" @close="resetRightBox" @refresh="refreshInfo"></detail>
    </page-right>
  </div>
</template>
<script>
import utils from '@/tools/utils';
import waveInfo from './wave-info.vue';
import detail from './detail/index.vue';
import {BaseInfo, Goods, http, LogisticsCenter, OrgGoods, outWork, Wave} from '@/resources';

export default {
    components: {
      waveInfo, detail
    },
    data() {
      return {
        activeStatus: '0', // 当前状态
        loadingData: true,
        shoWavePart: false, // 是否显示批次信息
        showDetailPart: false,
        showSearch: false,
        outType: utils.outType || {},
        orderList: [],
        currentOrderId: '',
        createdTimes:'',
        checkList: [], // 选中的订单列表
        checkListPara: [], // 传入波次的订单列表
        isCheckAll: false,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
        },
        filters: {
          type: 1,
          wmsStatus: null,
          deleteFlag: false,
          orgId: '',
          orderNo: '',
          bizType: '',
          goodsId: '',
          goodsName:'',
          orgGoodsId: '',
          transportationMeansId: '',
          customerId: '',
          thirdPartyNumber: '',
          logisticsProviderName: '',
          searchType: 1,
          expectedStartTime: '',
          expectedEndTime: '',
          completeStartTime: '',
          completeEndTime: '',
          areaCode:'',
          createStartTime: '',
          createEndTime: ''
        },
        searchCondition: {
          orgId: '',
          orderNo: '',
          goodsId: '',
          goodsName:'',
          orgGoodsId: '',
          bizType: '',
          logisticsProviderName: '',
          expectedStartTime: '',
          expectedEndTime: '',
          completeStartTime: '',
          completeEndTime: '',
          transportationMeansId: '',
          customerId: '',
          thirdPartyNumber: '',
          areaCode:'',
          createStartTime: '',
          createEndTime: ''
        },
        expectedTime: '',
        completeTime: '',
        LogisticsCenter: [], // 物流中心
        orgList: [], // 查询 货主列表
        customerList: [], // 来源单位列表
        logisticsList: [], // 物流商列表
        orgGoodses: [],
        goodsList: []
      };
    },
    computed: {
      transportationMeansList() {
        return this.$getDict('outTransportMeans');
      },
      bizTypes: function () {
        return this.$getDict('bizOutType');
      },
      isShowGoodsList() {
        return this.$store.state.isShowGoodsList;
      }
    },
    mounted() {
      this.getOrders(1);
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
      refreshInfo(){
        this.getOrders(this.pager.currentPage);
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        window.localStorage.setItem('currentPageSize', val);
        this.getOrders(1);
      },
      handleCurrentChange(val) {
        this.getOrders(val);
      },
      formatExpectedTimeRowClass(item) {
        let now = this.$moment(new Date()).format('YYYY-MM-DD');
        if (this.judgeExpectedTime(item.expectedTime, item.wmsStatus, now)) {
          return 'danger-row';
        }
      },
      judgeExpectedTime(date, state, now) {
        let expectedTime = this.$moment(new Date(date)).format('YYYY-MM-DD');
        if (expectedTime === now && (state === '6' || state === '7' || state === '10')) {
          return true;
        }
        return false;
      },
      restParams() {
        this.checkList = [];
        this.checkListPara = [];
        this.isCheckAll = false;
      },
      getOrders(pageNo) { // 从oms中查询订单
        // if (pageNo === 1) {
        //   this.pager.count = 0;
        // }
        this.pager.currentPage = pageNo;
        this.restParams();
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          logisticsCentreId: window.localStorage.getItem('logisticsCentreId')
        }, this.filters);
        params.isShowDetail = !!JSON.parse(window.localStorage.getItem('isShowGoodsList'));
        this.loadingData = true;
        let nowTime = Date.now();
        this.nowTime = nowTime;
        Wave.queryOmsOrder(params).then(res => {
          if (this.nowTime > nowTime) return;
          res.data.list.forEach(item => {
            item.isChecked = false;
          });
          this.orderList = res.data.list;

          let now = this.$moment(new Date()).format('YYYY-MM-DD');
          let me = this;
          let temp = this.orderList.filter(
            function (item) {
              return me.judgeExpectedTime(item.expectedTime, item.wmsStatus, now);
            }
          );
          if (temp && temp.length !== 0) {
            let temp2 = me.orderList.filter(
              function (item) {
                return !(me.judgeExpectedTime(item.expectedTime, item.wmsStatus, now));
              }
            );
            this.orderList = temp.concat(temp2);
          }
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
        outWork.queryOrderCount(params).then(res => {
          this.outType[0].num = res.data['all'];
          this.outType[1].num = res.data['create-wave'];
          this.outType[2].num = res.data['pending-pick'];
          // this.outType[3].num = res.data['pending-review'];
          // this.outType[4].num = res.data['pending-package'];
          this.outType[5].num = res.data['pending-transport'];
          this.outType[6].num = res.data['pending-sign'];
          this.outType[7].num = res.data['completed'];
          this.outType[9].num = res.data['canceled'];
        });
      },
      resetRightBox: function () { // 重置弹出窗
        if (this.shoWavePart) {
          this.getOrders(this.pager.currentPage);
          this.restParams();
        }
        this.shoWavePart = false;
        this.showDetailPart = false;
      },
      createWave() { // 创建波次
        if (!this.checkList.length) {
          this.$notify.warning({
            message: '请选择订单'
          });
          return;
        }
        this.shoWavePart = true;
        this.checkListPara = this.checkList.slice();
      },
      createLotWave() {
        this.$confirm('是否自动发波', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            logisticsCentreId: window.localStorage.getItem('logisticsCentreId') || ''
          };
          let object = Object.assign({}, obj, this.searchCondition);
          this.$store.commit('initPrint', {isPrinting: true, text: '正在处理中'});
          http.post('/wave-task', object).then(() => {
            this.$notify.success({
              message: '自动发波成功'
            });
            this.$store.commit('initPrint', {isPrinting: false, text: '正在处理中'});
            this.getOrders(this.pager.currentPage);
          }).catch(error => {
            this.$store.commit('initPrint', {isPrinting: false, text: '正在处理中'});
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '自动发波失败'
            });
          });
        });
      },
      getTimeTitle: function (item) {
        return item.transportationMeansId === '0'
          ? item.bizType === '2-1' ? '预计出库' : '预计送货'
          : item.transportationMeansId === '1' ? '预计提货'
            : item.transportationMeansId === '2' ? '预计发货'
              : item.transportationMeansId === '3' ? '预计完成' : '';
      },

      checkItem(item) { // 单选
        item.isChecked = !item.isChecked;
        let index = this.checkList.indexOf(item);
        if (item.isChecked) {
          if (index === -1) {
            this.checkList.push(item);
          }
        } else {
          this.checkList.splice(index, 1);
        }
      },
      checkAll() { // 全选
        if (this.isCheckAll) {
          this.orderList.forEach(item => {
            item.isChecked = true;
            let index = this.checkList.indexOf(item);
            if (index === -1) {
              this.checkList.push(item);
            }
          });
        } else {
          this.orderList.forEach(item => {
            item.isChecked = false;
          });
          this.checkList = [];
        }
      },
      checkStatus(item, key) {
        this.activeStatus = key;
        this.filters.wmsStatus = item.state ? item.state : null;
      },
      filterGoods(query) {
        Goods.query({keyWord: query, deleteFlag: false}).then(res => {
          this.goodsList = res.data.list;
        });
      },
      searchProduct(query) {
        this.orgGoodses = [];
        if (!this.searchCondition.orgId) {
          this.$notify.info({
            message: '请选择货主'
          });
          return;
        }
        let params = Object.assign({}, {
          orgId: this.searchCondition.orgId,
          keyWord: query
        });
        OrgGoods.query(params).then(res => {
          this.orgGoodses = res.data.list;
        });
      },
      filterLogisticsCenter: function () {// 过滤物流中心
        let param = {
          deleteFlag: false
        };
        LogisticsCenter.query(param).then(res => {
          this.LogisticsCenter = res.data;
        });
      },
      filterCustomer: function (query) {// 过滤客户
        BaseInfo.query({keyWord: query, type: 0}).then(res => {
          this.orgList = res.data.list;
        });
      },
      filterOrg: function (query) {// 过滤供货商
        let orgId = this.searchCondition.orgId;
        if (!orgId) {
          this.searchCondition.customerId = '';
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
      isOrgListExist() {
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
      },
      orgChange: function () {
        this.searchCondition.customerId = '';
        this.customerList = [];
        this.filterOrg();
        this.filterLogistics();
      },
      searchInOrder: function () {// 搜索
        this.searchCondition.expectedStartTime = this.$formatAryTime(this.expectedTime, 0, 'YYYY-MM-DD');
        this.searchCondition.expectedEndTime = this.$formatAryTime(this.expectedTime, 1, 'YYYY-MM-DD');
        this.searchCondition.completeStartTime = this.$formatAryTime(this.completeTime, 0);
        this.searchCondition.completeEndTime = this.$formatAryTime(this.completeTime, 1);
        this.searchCondition.createStartTime = this.$formatAryTime(this.createdTimes, 0, 'YYYY-MM-DD HH:mm:ss');
        this.searchCondition.createEndTime = this.$formatAryTime(this.createdTimes, 1, 'YYYY-MM-DD HH:mm:ss');
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
          goodsId: '',
          goodsName:'',
          orgGoodsId: '',
          orderNo: '',
          bizType: '',
          logisticsProviderName: '',
          expectedStartTime: '',
          expectedEndTime: '',
          completeStartTime: '',
          completeEndTime: '',
          transportationMeansId: '',
          customerId: '',
          thirdPartyNumber: '',
          areaCode:'',
          createStartTime: '',
          createEndTime: ''
        };
        this.expectedTime = '';
        this.completeTime = '';
        this.createdTimes='';
        if (this.isSupplierOrOrg) {
          temp.orgId = this.$route.params.id;
        }
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
        this.orgChange();
      },
      getOrderStatus: function (order) { // 获取订单状态
        let state = '';
        for (let key in this.outType) {
          if (order.wmsStatus === this.outType[key].state) {
            state = this.outType[key].title;
          }
        }
        return state;
      },
      filterListColor: function (index) {// 过滤左边列表边角颜色
        let status = -1;
        for (let key in this.outType) {
          if (this.outType[key].state === index) {
            status = key;
          }
        }
        return status;
      },
      transportation(item) {
        this.$confirm('是否确认运输', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          http.put(`/order-status/${item.id}/distribution`).then(() => {
            this.$notify.success({
              message: '确认运输成功'
            });
            this.resetRightBox();
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '确认运输失败'
            });
          });
        });
      },
      sign(item) {
        this.$confirm('是否确认签收', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          http.put(`/order-status/${item.id}/sign`).then(() => {
            this.$notify.success({
              message: '签收成功'
            });
            this.resetRightBox();
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '签收失败'
            });
          });
        });
      }
    }
  };
</script>
