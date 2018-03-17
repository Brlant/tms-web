<style lang="scss">
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
    <search-part @search="searchResult">
      <template slot="btn">
        <perm label="tms-order-generate">
          <el-button plain size="small" @click="createWayBill">
            <f-a class="icon-small" name="wave" v-if="activeStatus===0||activeStatus==='0'"></f-a>
            生成运单
          </el-button>
        </perm>
        <perm label="tms-order-add">
          <el-button plain size="small" @click="showPart(0)">
            <f-a class="icon-small" name="plus"></f-a>
            添加
          </el-button>
        </perm>
      </template>
    </search-part>
    <status-list :activeStatus="activeStatus" :statusList="orderType" :checkStatus="checkStatus"/>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="3">
          <el-checkbox @change="checkAll" v-model="isCheckAll"
                       v-if="activeStatus===0||activeStatus==='0'"></el-checkbox>
          订单号
        </el-col>
        <el-col :span="2">订单类型</el-col>
        <el-col :span="3">发货单位</el-col>
        <el-col :span="3">收货单位</el-col>
        <el-col :span="3">收货地址</el-col>
        <el-col :span="1">整件</el-col>
        <el-col :span="1">散件</el-col>
        <el-col :span="1">包件</el-col>
        <el-col :span="2">送达时限</el-col>
        <el-col :span="2">状态</el-col>
        <el-col :span="3">操作</el-col>
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
        <div class="order-list-item" v-for="item in dataList" @click="showInfo(item)"
             :class="[formatRowClass(item.status, orderType) ,{'active':currentItemId===item.id}]">
          <el-row>
            <el-col :span="3" class="special-col R">
              <div class="el-checkbox-warp" @click.stop.prevent="checkItem(item)"
                   v-if="activeStatus===0||activeStatus==='0'">
                <el-checkbox v-model="item.isChecked"></el-checkbox>
              </div>
              <div>
                {{item.orderNo}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                <dict :dict-group="'bizType'" :dict-key="item.waybillType"></dict>
              </div>
            </el-col>
            <el-col :span="3" class="R">
              <div>
                {{item.senderName}}
              </div>
            </el-col>
            <el-col :span="3" class="R">
              <div>
                {{item.receiverName}}
              </div>
            </el-col>
            <el-col :span="3" class="R">
              <div>
                {{item.receiverAddress}}
              </div>
            </el-col>
            <el-col :span="1" class="text-center">
              <div>
                {{item.wholeBoxCount}}
              </div>
            </el-col>
            <el-col :span="1" class="text-center">
              <div>
                {{item.bulkBoxCount}}
              </div>
            </el-col>
            <el-col :span="1" class="text-center">
              <div>
                {{item.incubatorCount}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{item.deliveryTime|date}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{formatStatusTitle(item.status, orderType)}}
              </div>
            </el-col>
            <el-col :span="3" class="opera-btn">
              <div>
                <div>
                  <perm label="tms-order-edit">
                    <span @click.stop="edit(item)">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-edit"></i>
                      </a>编辑
                    </span>
                  </perm>
                  <perm label="tms-order-delete">
                    <span @click.stop="deleteOrder(item)" v-if="activeStatus===0||activeStatus==='0'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-delete"></i>
                      </a>删除
                    </span>
                  </perm>
                </div>
                <div style="padding-top: 2px">
                  <perm label="tms-order-cancel" class="opera-btn">
                    <span @click.stop="cancelOrder(item)" v-if="activeStatus===0||activeStatus==='0'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-forbidden"></i>
                      </a>取消
                    </span>
                  </perm>
                  <perm label="tms-order-dismantling" class="opera-btn">
                    <span @click.stop="splitOrder(item)" v-if="activeStatus===0||activeStatus==='0'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-basic"></i>
                      </a>拆分订单
                    </span>
                  </perm>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="order-list-item-bg"></div>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="dataList.length && !loadingData">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pager.currentPage"
                     :page-sizes="[20,50,100]" :page-size="20" layout="total, sizes, prev, pager, next, jumper"
                     :total="pager.count">
      </el-pagination>
    </div>

    <page-right :show="showIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentPart" :action="action" :formItem="form" @right-close="resetRightBox" @change="submit"/>
    </page-right>
    <page-right :show="showInfoIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentInfoPart" :formItem="form" @right-close="resetRightBox"/>
    </page-right>
    <page-right :show="shoWayBillPart" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <component :is="currentWayBillPart" :checkList="checkListPara" @right-close="resetRightBox" @change="submit"/>
    </page-right>
    <page-right :show="showSplitOrderPart" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}">
      <component :is="currentSplitOrderPart" :formItem="form" @right-close="resetRightBox" @change="submit"/>
    </page-right>

  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import {TmsOrder} from '@/resources';
  import addForm from './form/add-form.vue';
  import showForm from './form/show-form.vue';
  import splitForm from './form/split-order.vue';
  import wayBillForm from './form/create-way-bill.vue';
  import StatusMixin from '@/mixins/statusMixin';
  import Perm from '@/components/common/perm';

  export default {
    components: {
      Perm, SearchPart, addForm, wayBillForm
    },
    mixins: [StatusMixin],
    data () {
      return {
        loadingData: false,
        activeStatus: 0,
        orderType: utils.orderType,
        dataList: [],
        showIndex: -1,
        showInfoIndex: -1,
        currentPart: null,
        currentInfoPart: null,
        currentWayBillPart: null,
        currentSplitOrderPart: null,
        dialogComponents: {
          0: addForm
        },
        dialogInfoComponents: {
          0: showForm
        },
        dialogWayBillComponents: {
          0: wayBillForm
        },
        dialogSplitFormComponents: {
          0: splitForm
        },
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        action: '',
        form: {},
        filters: {
          status: 0,
          orderNo: '',
          waybillType: '',
          shipmentWay: '',
          serviceType: '',
          senderId: '',
          receiverId: '',
          startTime: '',
          endTime: ''
        },
        isCheckAll: false,
        checkList: [],
        checkListPara: [],
        shoWayBillPart: false,
        showSplitOrderPart: false
      };
    },
    watch: {
      filters: {
        handler: function () {
          this.getTmsOrderPage(1);
        },
        deep: true
      }
    },
    mounted() {
      this.getTmsOrderPage(1);
    },
    methods: {
      cancelOrder: function (item) {
        this.$confirm('确认取消订单"' + item.orderNo + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TmsOrder.cancelOrder(item.id).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功取消订单"' + item.orderNo + '"'
            });
            this.getTmsOrderPage(1);
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '取消订单"' + item.orderNo + '"失败'
            });
          });
        }).catch(() => {

        });
      },
      splitOrder: function (item) {
        this.currentSplitOrderPart = this.dialogSplitFormComponents[0];
        this.showSplitOrderPart = true;
        this.$nextTick(() => {
          this.form = JSON.parse(JSON.stringify(item));
          this.form.goodsList = item.goodsList;
        });
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        this.getTmsOrderPage(1);
      },
      handleCurrentChange(val) {
        this.getTmsOrderPage(val);
      },
      createWayBill: function () {
        if (!this.checkList.length) {
          this.$notify.warning({
            duration: 2000,
            message: '请选择订单'
          });
          return;
        }
        this.shoWayBillPart = true;
        this.currentWayBillPart = this.dialogWayBillComponents[0];
        this.$nextTick(() => {
          this.checkListPara = this.checkList.slice();
        });
      },
      checkItem: function (item) {
        // 单选
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
      checkAll() {
        // 全选
        if (this.isCheckAll) {
          this.dataList.forEach(item => {
            item.isChecked = true;
            let index = this.checkList.indexOf(item);
            if (index === -1) {
              this.checkList.push(item);
            }
          });
        } else {
          this.dataList.forEach(item => {
            item.isChecked = false;
          });
          this.checkList = [];
        }
      },
      searchResult: function (search) {
        Object.assign(this.filters, search);
      },
      checkStatus (item, key) {
        this.filters.status = item.status;
        this.activeStatus = key;
      },
      resetRightBox () {
        this.showIndex = -1;
        this.showInfoIndex = -1;
        this.shoWayBillPart = false;
        this.showSplitOrderPart = false;
      },
      getTmsOrderPage: function (pageNo, isContinue = false) {
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.loadingData = true;
        TmsOrder.query(param).then(res => {
          res.data.list.forEach(val => {
            val.isChecked = false;
          });
          if (isContinue) {
            this.dataList = this.showTypeList.concat(res.data.list);
          } else {
            this.dataList = res.data.list;
          }
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
        this.queryStateNum(param);
      },
      queryStateNum: function (params) {
        TmsOrder.queryStateNum(params).then(res => {
          let data = res.data;
          this.orderType[0].num = data['pend-generate-waybill'];
          this.orderType[1].num = data['pend-choose-car'];
          this.orderType[2].num = data['pend-shipment'];
          this.orderType[3].num = data['pend-sign'];
          this.orderType[4].num = data['complete'];
          this.orderType[5].num = data['canceled'];
        });
      },
      showPart (index) {
        this.action = 'add';
        this.showIndex = index;
        this.currentPart = this.dialogComponents[index];
        this.form = {
          goodsList: [
            {
              goodsName: '',
              specifications: '',
              weight: '',
              volume: '',
              code: ''
            }
          ]
        };
      },
      edit: function (item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.action = 'edit';
        this.showIndex = 0;
        this.currentPart = this.dialogComponents[0];
        this.$nextTick(() => {
          this.form = JSON.parse(JSON.stringify(item));
        });
      },
      deleteOrder: function (item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.$confirm('确认删除订单"' + item.orderNo + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TmsOrder.delete(item.id).then(() => {
            this.getTmsOrderPage(1);
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功删除订单"' + item.orderNo + '"'
            });
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '删除订单"' + item.orderNo + '"失败'
            });
          });
        }).catch(() => {

        });
      },
      showInfo: function (item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.showInfoIndex = 0;
        this.currentInfoPart = this.dialogInfoComponents[0];
        this.$nextTick(() => {
          this.form = JSON.parse(JSON.stringify(item));
        });
      },
      submit() {
        this.getTmsOrderPage(1);
      }
    }
  };
</script>
