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
          <el-col :span="6">
            <oms-form-row label="订单号" :span="6">
              <oms-input type="text" v-model="searchCondition.orderNo" placeholder="请输入订单号"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="货主" :span="4">
              <org-select v-model="searchCondition.orgId" :list="orgList"
                          :remoteMethod="filterCustomer"
                          placeholder="请输入关键字搜索货主信息"></org-select>
            </oms-form-row>
          </el-col>
          <el-col :span="10">
            <oms-form-row label="货品主档" :span="4">
              <goods-select placeholder="请输入名称搜索货品主档" :remote-method="filterGoods"
                            v-model="searchCondition.goodsId" :list="goodsList"></goods-select>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row label="批号" :span="6">
              <!--<oms-input type="text" v-model="searchCondition.batchNumberId" placeholder="请输入批号"></oms-input>-->
              <el-select v-model="searchCondition.batchNumberId" filterable clearable remote
                         :remoteMethod="filterBatchNumber" placeholder="请输入批号名称搜索批号">
                <el-option v-for="item in batchNumberList" :value="item.id" :key="item.id"
                           :label="item.batchNumber"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="5" style="padding-top: 5px">
            <el-col :span="3"></el-col>
            <el-col :span="21">
              <span style="margin-right: 10px">是否合格 </span>
              <el-radio v-model="searchCondition.qualifiedFlag" :label="true">是</el-radio>
              <el-radio v-model="searchCondition.qualifiedFlag" :label="false">否</el-radio>
            </el-col>
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
          <a href="#" class="btn-circle" @click.stop.prevent="showSearch = !showSearch">
              <i class="el-icon-t-search"></i>
          </a>
        </span>
      </status-list>
      <div class="order-list" style="margin-top: 20px">
        <el-row class="order-list-header">
          <el-col :span="5">任务/订单号/货主/来源单位</el-col>
          <el-col :span="5">货品名称</el-col>
          <el-col :span="2">批号</el-col>
          <el-col :span="2">数量</el-col>
          <el-col :span="3">创建时间</el-col>
          <el-col :span="2">操作人</el-col>
          <el-col :span="2">状态</el-col>
          <el-col :span="3">操作</el-col>
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
               :class="['status-'+filterListColor(item.status) ,{'active':currentOrderId==item.id}]"
               @click="showDetail(item)">
            <el-row>
              <el-col :span="5">
                <el-tooltip class="item" effect="dark" content="任务编号" placement="right">
                  <span class="f-grey">
                    {{item.id}}
                  </span>
                </el-tooltip>
                <div>
                  <el-tooltip class="item" effect="dark" content="订单号" placement="right">
                  <span class="f-grey">
                    {{item.orderNo}}
                  </span>
                  </el-tooltip>
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="货主" placement="right">
                    <span>{{item.orgName }}</span>
                  </el-tooltip>
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="来源单位" placement="right">
                    <span>{{item.supplierName }}</span>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :span="5">
                <div>{{item.goodsName }}</div>
                <div>
                  <el-tooltip class="item" effect="dark" content="规格" placement="right">
                    <span style="color: #999">{{item.specification }}</span>
                  </el-tooltip>
                </div>
                <el-tooltip class="item" effect="dark" content="生产单位" placement="right">
                  <span style="color: #999">{{item.factoryName }}</span>
                </el-tooltip>
              </el-col>
              <el-col :span="2" class="R">
                {{item.batchNumber }}
              </el-col>
              <el-col :span="2">
                {{item.count }}
                <el-tag type="success" v-show="item.qualifiedFlag">合格</el-tag>
                <el-tag type="danger" v-show="!item.qualifiedFlag">不合格</el-tag>
              </el-col>
              <el-col :span="3">
                {{item.createTime | minute }}
              </el-col>
              <el-col :span="2">
                <div v-show="item.reviewerName">复核:{{item.reviewerName }}</div>
                <div v-show="item.pickUpManName">上架:{{item.pickUpManName }}</div>
              </el-col>
              <el-col :span="2">
                {{ getOrderStatus(item) }}
              </el-col>
              <el-col :span="3" class="opera-btn">
                <div>
                  <perm label="stock-in-assign-reviewer">
                  <span v-show="item.status === '0'" @click.stop="showRightPart(item)">
                    <a href="#" class="btn-circle btn-opera" @click.prevent=""><i
                      class="el-icon-t-appoint"></i></a>
                    指派复核人
                   </span>
                  </perm>
                </div>
                <!--                <div style="margin-top: 5px">-->
                <!--                  <perm label="stock-in-edit">-->
                <!--                    <span v-show="item.status !== '5' && item.status !== '6'" @click.stop="showEditDetail(item)">-->
                <!--                    <a href="#" class="btn-circle btn-opera" @click.prevent=""><i-->
                <!--                      class="el-icon-t-edit"></i></a>-->
                <!--                    编辑-->
                <!--                   </span>-->
                <!--                  </perm>-->
                <!--                </div>-->
                <div style="margin-top: 5px">
                  <perm label="stock-in-assign-reviewer">
                  <span v-show="item.status === '0'" @click.stop="claimTack(item)">
                    <a href="#" class="btn-circle btn-opera" @click.prevent=""><i
                      class="el-icon-t-appoint"></i></a>
                    认领任务
                   </span>
                  </perm>
                </div>
                <div style="margin-top: 5px">
                  <perm label="stock-in-assign-reviewer">
                  <span v-show="item.status === '0'" @click.stop="claimAutoTack(item)">
                    <a href="#" class="btn-circle btn-opera" @click.prevent=""><i
                      class="el-icon-t-appoint"></i></a>
                    一键认领任务
                   </span>
                  </perm>
                </div>
                <perm label="stock-in-review-code">
                  <span v-show="item.status === '1'" @click.stop="showRightPart(item)">
                    <a href="#" class="btn-circle btn-opera" @click.prevent=""><i
                      class="el-icon-t-scan"></i></a>
                    复核扫码
                  </span>
                </perm>
                <perm label="stock-in-conversion">
                  <div>
                    <span v-show="item.status === '1' && type === 0" @click.stop="transformBuckTask(item)">
                    <a href="#" class="btn-circle btn-opera" @click.prevent=""><i
                      class="el-icon-t-allot"></i></a>
                    转成散件任务
                  </span>
                  </div>
                </perm>
                <perm label="stock-in-assign-store">
                  <span v-show="item.status === '2' " @click.stop="showRightPart(item)">
                    <a href="#" class="btn-circle btn-opera" @click.prevent=""><i
                      class="el-icon-t-affirm"></i></a>
                    分配货位
                  </span>
                </perm>
                <div>
                  <perm label="stock-in-assign-putaway">
                    <span v-show="item.status === '3' " @click.stop="showRightPart(item)">
                    <a href="#" class="btn-circle btn-opera" @click.prevent=""><i
                      class="el-icon-t-appoint"></i></a>
                    指派上架人
                    </span>
                  </perm>
                </div>
                <div style="margin-top: 5px">
                  <perm label="stock-in-assign-putaway">
                    <span v-show="item.status === '3' " @click.stop="claimShelfTack(item)">
                    <a href="#" class="btn-circle btn-opera" @click.prevent=""><i
                      class="el-icon-t-appoint"></i></a>
                    认领任务
                    </span>
                  </perm>
                </div>
                <perm label="stock-in-putaway">
                  <span v-show="item.status === '4' " @click.stop="onShelf(item)">
                    <a href="#" class="btn-circle btn-opera" @click.prevent=""><i
                      class="el-icon-t-shelf"></i></a>
                    上架
                  </span>
                </perm>
                <div>
                  <perm label="stock-in-assign-store">
                  <span v-show="item.status === '4'  " @click.stop="showRightPart(item)">
                    <a href="#" class="btn-circle btn-opera" @click.prevent=""><i
                      class="el-icon-t-affirm"></i></a>
                    编辑货位
                  </span>
                  </perm>
                </div>
                <div v-show="(item.status === '0'||item.status === '1') && type === 0">
                  <perm label="stock-in-whole-task-split">
                    <span @click.stop="splitItem(item)">
                      <a href="#" class="btn-circle btn-opera" @click.prevent=""><i
                        class="el-icon-t-allot"></i></a>拆分
                    </span>
                  </perm>
                </div>
                <!--                <div>-->
                <!--                  <perm label="stock-in-assign-store"> &lt;!&ndash;stock-in-receiptCancel&ndash;&gt;-->
                <!--                    <span v-show="item.status < 5  " @click.stop="closeTask(item)">-->
                <!--                    <a href="#" class="btn-circle btn-opera" @click.prevent=""><i-->
                <!--                      class="el-icon-circle-close"></i></a>-->
                <!--                    取消任务-->
                <!--                  </span>-->
                <!--                  </perm>-->
                <!--                </div>-->
                <!--<span v-show="item.wmsStatus === '5' " @click="showRightPart(item)">-->
                <!--<a href="#" class="btn-circle btn-opera" @click.prevent=""><i-->
                <!--class="el-icon-t-detail"></i></a>-->
                <!--查看详情-->
                <!--</span>-->
              </el-col>
            </el-row>
            <div class="order-list-item-bg"></div>
          </div>
          <el-row class="order-list-header mt-10">
            <el-col :span="2">合计</el-col>
            <el-col :span="4"></el-col>
            <el-col :span="4"></el-col>
            <el-col :span="2"></el-col>
            <el-col :span="2">
              <!--数量-->
              <total-count :list="orderList" property="count" title=""></total-count>
            </el-col>
            <el-col :span="3"></el-col>
            <el-col :span="2"></el-col>
            <el-col :span="2"></el-col>
            <el-col :span="3"></el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="orderList.length && !loadingData">

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pager.currentPage"
                     :page-sizes="[10,20,50,100]" :page-size="pager.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="pager.count">
      </el-pagination>
    </div>
    <page-right :show=" showPartIndex === '0'" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}"
                partClass="pr-no-animation">
      <review-man @close="resetRightBox" :orderId="currentOrderId" :showPartIndex="showPartIndex"
                  @changeStatus="transformStatus"></review-man>
    </page-right>
    <page-right :show=" showPartIndex === '1'" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}"
                partClass="pr-no-animation">
      <scan :bizType="currentItem.bizType" :orderId="currentOrderId" :showPartIndex="showPartIndex" :type="type" @close="resetRightBox"
            @changeStatus="transformStatus"></scan>
    </page-right>
    <page-right :show=" showPartIndex === '2' || showPartIndex === '4' " @right-close="resetRightBox"
                :css="{'width':'1200px','padding':0}"
                partClass="pr-no-animation">
      <allot-place @close="resetRightBox" :orderId="currentOrderId" :status="currentItem.status"
                   :showPartIndex="showPartIndex"
                   @changeStatus="transformStatus"></allot-place>
    </page-right>
    <!--<page-right :show=" showPartIndex === '4' " @right-close="resetRightBox" :css="{'width':'1200px','padding':0}"-->
    <!--partClass="pr-no-animation">-->
    <!--<allot-place @close="resetRightBox" :orderId="currentOrderId" :type="1" :showPartIndex="showPartIndex"-->
    <!--@changeStatus="transformStatus"></allot-place>-->
    <!--</page-right>-->

    <page-right :show=" showPartIndex === '3'" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}"
                partClass="pr-no-animation">
      <shelf-man @close="resetRightBox" :orderId="currentOrderId" :showPartIndex="showPartIndex"
                 @changeStatus="transformStatus"></shelf-man>
    </page-right>
    <!--<page-right :show=" showPartIndex === '4'" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}"-->
    <!--partClass="pr-no-animation">-->
    <!--<on-shelf @close="resetRightBox" :orderId="currentOrderId" :showPartIndex="showPartIndex"-->
    <!--@changeStatus="transformStatus"></on-shelf>-->
    <!--</page-right>-->
    <page-right :show=" showPartIndex === '5'" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}"
                partClass="pr-no-animation">
      <detail @close="resetRightBox" :taskId="currentOrderId" :orgType="orgType" :status="currentItem.status"
              :showPartIndex="showPartIndex"></detail>
    </page-right>
    <page-right :show=" showPartIndex === '6'" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}"
                partClass="pr-no-animation">
      <edit-detail @right-close="resetRightBox" :taskId="currentOrderId" :orgType="orgType" :status="currentItem.status"
                   :showPartIndex="showPartIndex"></edit-detail>
    </page-right>
    <page-right :show=" showPartIndex === '7'" @right-close="resetRightBox" :css="{'width':'600px','padding':0}"
                partClass="pr-no-animation">
      <split-task @right-close="resetRightBox" :currentItem="currentItem" :showPartIndex="showPartIndex"/>
    </page-right>
  </div>
</template>
<script>
import utils from '@/tools/utils';
import allotPlace from './allot-place.vue';
import detail from './detail.vue';
import editDetail from './edit-detail.vue';
import reviewMan from '../review-man.vue';
import shelfMan from '../shelf-man.vue';
import scan from '../scan.vue';
import SplitTask from '../split-task';
import {BaseInfo, Goods, InHouseWork} from '@/resources';

export default {
    components: {
      allotPlace, detail, reviewMan, shelfMan, scan, editDetail, SplitTask
    },
    data() {
      return {
        activeStatus: 0, // 当前状态
        loadingData: true,
        showPartIndex: '', // 是否显示确认
        showSearch: false,
        orgType: utils.inHouseType,
        orderList: [],
        currentOrderId: '',
        currentItem: {},
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
        },
        filters: {
          type: 0,
          status: '0',
          orgId: '',
          orderNo: '',
          batchNumberId: '',
          qualifiedFlag: ''
        },
        searchCondition: {
          orgId: '',
          orderNo: '',
          goodsId: '',
          batchNumberId: '',
          qualifiedFlag: ''
        },
        expectedTime: '',
        orgList: [], // 查询 货主列表
        goodsList: [],
        customerList: [], // 来源单位列表
        logisticsList: [], // 物流商列表
        batchNumberList: []
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
      type() {
        return this.$route.meta.type;
      }
    },
    watch: {
      filters: {
        handler: function () {
          this.getOrders(1);
        },
        deep: true
      },
      type(val) {
        this.filters.type = val;
        this.resetSearchForm();
      }
    },
    methods: {
      splitItem(item) {
        this.currentItem = item;
        this.currentOrderId = item.id;
        this.showPartIndex = '7';
      },
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
        this.resetRightBox();
      },
      checkStatus(item, key) {
        this.activeStatus = key;
        this.filters.status = item.status;
      },
      showDetail(item) {
        this.currentItem = item;
        this.currentOrderId = item.id;
        this.showPartIndex = '5';
      },
      showEditDetail(item) {
        this.currentItem = item;
        this.currentOrderId = item.id;
        this.showPartIndex = '6';
      },
      showRightPart: function (item) {
        this.currentItem = item;
        this.currentOrderId = item.id;
        this.$nextTick(() => {
          this.showPartIndex = item.status;
        });
      },
      transformBuckTask(item) {
        this.currentItem = item;
        this.currentOrderId = item.id;
        this.$confirm('是否转成散件任务', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.put(`/order-stock-task/${item.id}/conversion`).then(() => {
            this.$notify.success({
              message: '操作成功'
            });
            this.deleteItem(item);
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '操作失败'
            });
          });
        });
      },
      deleteItem(item) {
        let index = this.orderList.indexOf(item);
        if (index !== -1) {
          this.orderList.splice(index, 1);
          // this.orgType[0].num--;
          // this.orgType[1].num++;
        }
      },
      claimTack(item) {
        this.currentItem = item;
        this.currentOrderId = item.id;
        this.$confirm('是否认领任务', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          InHouseWork.claimReviewTack(item.id).then(() => {
            this.$notify.success({
              message: '认领任务成功'
            });
            this.deleteItem(item);
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '认领任务失败'
            });
          });
        });
      },
      claimShelfTack(item) {
        this.currentItem = item;
        this.currentOrderId = item.id;
        this.$confirm('是否认领任务', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          InHouseWork.claimShelfTack(item.id).then(() => {
            this.$notify.success({
              message: '认领任务成功'
            });
            this.deleteItem(item);
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '认领任务失败'
            });
          });
        });
      },
      claimAutoTack(item) {
        this.currentItem = item;
        this.currentOrderId = item.id;
        this.$confirm('是否一键认领任务', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          InHouseWork.claimTack(item.id).then(() => {
            this.$notify.success({
              message: '一键认领任务成功'
            });
            this.deleteItem(item);
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '一键认领任务失败'
            });
          });
        });
      },
      onShelf(item) {
        this.currentItem = item;
        this.currentOrderId = item.id;
        this.$confirm('是否确认上架', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          InHouseWork.onShelf(item.id).then(res => {
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
      closeTask(item) {
        this.currentItem = item;
        this.currentOrderId = item.id;
        this.$confirm('是否取消任务', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          InHouseWork.cancelTask(item.id).then(res => {
            this.$notify.success({
              message: '取消完成'
            });
            this.resetRightBox();
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '取消失败'
            });
          });
        });
      },
      getOrders(pageNo) { // 从oms中查询订单
        if (pageNo === 1) {
          this.pager.count = 0;
        }
        this.filters.type = this.type;
        this.pager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          logisticsCentreId: window.localStorage.getItem('logisticsCentreId')
        }, this.filters);
        this.loadingData = true;
        InHouseWork.query(params).then(res => {
          res.data.list.forEach(item => {
            item.isChecked = false;
          });
          this.orderList = res.data.list;
          this.pager.count = res.data.count;
          // if (this.orderList.length === this.pager.pageSize) {
          //   this.pager.count = this.pager.currentPage * this.pager.pageSize + 1;
          // }
          this.loadingData = false;
        });
        this.queryOrderCount();
      },
      queryOrderCount() {
        let params = JSON.parse(JSON.stringify(this.filters));
        params.logisticsCentreId = window.localStorage.getItem('logisticsCentreId');
        params.status = '';
        InHouseWork.queryOrderCount(params).then(res => {
          this.orgType[0].num = res.data['assign-reviewer'];
          this.orgType[1].num = res.data['review-code'];
          this.orgType[2].num = res.data['assign-store'];
          this.orgType[3].num = res.data['assign-pick-operator'];
          this.orgType[4].num = res.data['pending-picking'];
          this.orgType[5].num = res.data['completed'];
          this.orgType[6].num = res.data['all'];
          this.orgType[9].num = res.data['canceled'];
        });
      },
      filterListColor: function (index) {// 过滤左边列表边角颜色
        let status = -1;
        for (let key in this.orgType) {
          if (this.orgType[key].status === index) {
            status = key;
          }
        }
        return status;
      },
      filterBatchNumber(query) {
        this.$http.get('/batch-number/pager', {params: {keyWord: query}}).then(res => {
          this.batchNumberList = res.data.list;
        });
      },
      getOrderStatus: function (order) { // 获取订单状态
        let status = '';
        for (let key in this.orgType) {
          if (order.status === this.orgType[key].status) {
            status = this.orgType[key].title;
          }
        }
        return status;
      },
      filterCustomer: function (query) {// 过滤客户
        BaseInfo.query({keyWord: query, type: 0}).then(res => {
          this.orgList = res.data.list;
        });
      },
      filterGoods(query) {
        Goods.query({keyWord: query, deleteFlag: false}).then(res => {
          this.goodsList = res.data.list;
        });
      },
      searchInOrder: function () {// 搜索
        this.filters = Object.assign({}, this.filters, this.searchCondition);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          orgId: '',
          orderNo: '',
          goodsId: '',
          batchNumberId: '',
          qualifiedFlag: ''
        };
        this.expectedTime = '';
        if (this.isSupplierOrOrg) {
          temp.orgId = this.$route.params.id;
        }
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
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
