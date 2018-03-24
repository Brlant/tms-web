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
        <perm label="tms-waybill-add">
          <el-button plain size="small" @click="showPart(0)">
            <f-a class="icon-small" name="plus"></f-a>
            添加
          </el-button>
        </perm>
        <perm label="tms-waybill-verifyPass">
          <el-button plain size="small" @click="autoConfirmWayBill" v-if="activeStatus===0||activeStatus==='0'">
            <f-a class="icon-small" name="wave"></f-a>
            确认全部运单
          </el-button>
        </perm>
        <perm label="tms-waybill-confirm">
          <el-button plain size="small" @click="batchConfirmWayBill" v-if="activeStatus===0||activeStatus==='0'">
            <f-a class="icon-small" name="wave"></f-a>
            批量确认运单
          </el-button>
        </perm>
      </template>
    </search-part>

    <status-list :activeStatus="activeStatus" :statusList="orderType" :checkStatus="checkStatus"/>

    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="2">
          <el-checkbox @change="checkAll" v-model="isCheckAll"
                       v-if="activeStatus===0||activeStatus==='0'"></el-checkbox>
          运单号
        </el-col>
        <el-col :span="2">类型</el-col>
        <el-col :span="3">发货单位</el-col>
        <el-col :span="3">收货单位</el-col>
        <el-col :span="4">收货地址</el-col>
        <el-col :span="1">整件</el-col>
        <el-col :span="1">散件</el-col>
        <el-col :span="1">包件</el-col>
        <el-col :span="3">时间</el-col>
        <el-col :span="1">状态</el-col>
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
            <el-col :span="2" class="special-col R">
              <div class="el-checkbox-warp" @click.stop.prevent="checkItem(item)"
                   v-if="activeStatus===0||activeStatus==='0'">
                <el-checkbox v-model="item.isChecked"></el-checkbox>
              </div>
              <div>
                {{item.waybillNumber}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div v-show="item.waybillType">
                <dict :dict-group="'bizType'" :dict-key="item.waybillType"></dict>
              </div>
              <div v-show="item.shipmentWay">
                <dict :dict-group="'transportationCondition'" :dict-key="item.shipmentWay"></dict>
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
            <el-col :span="4" class="R">
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
            <el-col :span="3" class="R">
              <div v-show="item.deliveryTime&&!item.waybillCompleteTime">
                <span>送达时限:</span>
                {{item.deliveryTime|date}}
              </div>
              <div v-show="item.startTransportTime">
                <span>[始] </span>
                {{item.startTransportTime|time}}
              </div>
              <div v-show="item.waybillCompleteTime">
                <span>[终] </span>
                {{item.waybillCompleteTime|time}}
              </div>
            </el-col>
            <el-col :span="1" class="R">
              <div>
                {{formatStatusTitle(item.status, orderType)}}
              </div>
            </el-col>
            <el-col :span="3" class="opera-btn">
              <div>
                <div>
                  <perm label="tms-waybill-edit">
                    <span @click.stop="edit(item)" v-if="activeStatus===0||activeStatus==='0'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-edit"></i>
                      </a>编辑
                    </span>
                  </perm>
                  <perm label="tms-waybill-edit">
                    <span @click.stop="confirm(item)" v-if="activeStatus===0||activeStatus==='0'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-verifyPass"></i>
                      </a>确认
                    </span>
                  </perm>
                </div>
                <div style="padding-top: 2px">
                  <perm label="tms-waybill-cancel" class="opera-btn">
                    <span @click.stop="cancelWayBill(item)" v-if="activeStatus===0||activeStatus==='0'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-forbidden"></i>
                      </a>取消
                    </span>
                  </perm>
                </div>
                  <perm label="tms-waybill-cancel" class="opera-btn">
                    <span @click.stop="signWayBill(item)" v-if="activeStatus===3||activeStatus==='3'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-edit"></i>
                      </a>签收
                    </span>
                  </perm>
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
    <page-right :show="showSignIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentSignPart" :formItem="form" @right-close="resetRightBox" @change="submit"/>
    </page-right>
    <page-right :show="showConfirmIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentConfirmPart" :checkList="checkListPara" @right-close="resetRightBox" @change="submit"/>
    </page-right>

  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import {TmsWayBill} from '@/resources';
  import addForm from './form/add-form.vue';
  import showForm from './form/show-form.vue';
  import signForm from './form/sign-form';
  import StatusMixin from '@/mixins/statusMixin';
  import confirmForm from './form/confirm-form';

  export default {
    components: {
      SearchPart, addForm
    },
    mixins: [StatusMixin],
    data () {
      return {
        loadingData: false,
        activeStatus: 0,
        orderType: utils.wayBillType,
        dataList: [],
        showIndex: -1,
        showInfoIndex: -1,
        showSignIndex: -1,
        showConfirmIndex: -1,
        currentPart: null,
        currentInfoPart: null,
        currentSignPart: null,
        currentConfirmPart: null,
        dialogComponents: {
          0: addForm
        },
        dialogInfoComponents: {
          0: showForm
        },
        dialogSignComponents: {
          0: signForm
        },
        dialogConfirmComponents: {
          0: confirmForm
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
          status: '-1',
          waybillNumber: '',
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
        shoWayBillPart: false
      };
    },
    watch: {
      filters: {
        handler: function () {
          this.getTmsWayBillPage(1);
        },
        deep: true
      }
    },
    mounted() {
      this.getTmsWayBillPage(1);
    },
    methods: {
      batchConfirmWayBill: function () {
        if (!this.checkList.length) {
          this.$notify.warning({
            duration: 2000,
            message: '请勾选需要确认的运单'
          });
          return;
        }
        this.showConfirmIndex = 0;
        this.currentConfirmPart = this.dialogConfirmComponents[0];
        this.$nextTick(() => {
          this.checkListPara = this.checkList.slice();
        });
      },
      autoConfirmWayBill: function () {
        this.$confirm('是否对状态为待确认的运单进行批量确认操作?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = Object.assign({}, this.filters);
          TmsWayBill.autoConfirmWayBill(param).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功生成运单'
            });
            this.filters = {
              status: '0',
              waybillNumber: '',
              waybillType: '',
              shipmentWay: '',
              serviceType: '',
              senderId: '',
              receiverId: '',
              startTime: '',
              endTime: ''
            };
            this.getTmsWayBillPage(1);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.msg || '批量确认运单失败'
            });
          });
        }).catch(() => {

        });
      },
      confirm: function (item) {
        this.$confirm('确认运单"' + item.waybillNumber + '信息"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TmsWayBill.confirmWayBill(item.id).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功确认运单"' + item.waybillNumber + '"'
            });
            this.getTmsWayBillPage(1);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.msg || '确认运单失败'
            });
          });
        }).catch(() => {

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
      signWayBill: function (item) {
        this.showSignIndex = 0;
        this.currentSignPart = this.dialogSignComponents[0];
        this.$nextTick(() => {
          this.form = JSON.parse(JSON.stringify(item));
        });
      },
      cancelWayBill: function (item) {
        this.$confirm('确认取消运单"' + item.waybillNumber + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TmsWayBill.cancelOrder(item.id).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功取消运单"' + item.waybillNumber + '"'
            });
            this.getTmsWayBillPage(1);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.msg || '取消运单失败'
            });
          });
        }).catch(() => {

        });
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        this.getTmsWayBillPage(1);
      },
      handleCurrentChange(val) {
        this.getTmsWayBillPage(val);
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
        this.showSignIndex = -1;
        this.showConfirmIndex = -1;
      },
      getTmsWayBillPage: function (pageNo, isContinue = false) {
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.loadingData = true;
        TmsWayBill.query(param).then(res => {
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
        TmsWayBill.queryStateNum(params).then(res => {
          let data = res.data;
          this.orderType[0].num = data['pend-confirm'];
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
        this.getTmsWayBillPage(1);
      }
    }
  };
</script>
