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
    <search-part @search="searchResult"></search-part>

    <status-list :activeStatus="activeStatus" :statusList="orderType" :checkStatus="checkStatus">
      <span class="btn-group-right">
        <des-btn icon="wave" @click="createWayBill" v-if="activeStatus===0||activeStatus==='0'">生成运单</des-btn>
        <des-btn icon="plus" @click="showPart(0)">添加</des-btn>
        <!--<el-button size="small" plain @click="showPart(0)">添加</el-button>-->
      </span>
    </status-list>

    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="4">
          <el-checkbox @change="checkAll" v-model="isCheckAll" v-if="activeStatus===0"></el-checkbox>
          订单号
        </el-col>
        <el-col :span="2">订单类型</el-col>
        <el-col :span="2">运单号</el-col>
        <el-col :span="2">发货单位</el-col>
        <el-col :span="2">收货单位</el-col>
        <el-col :span="2">收货地址</el-col>
        <el-col :span="1">整件</el-col>
        <el-col :span="1">散件</el-col>
        <el-col :span="1">包件</el-col>
        <el-col :span="2">提货</el-col>
        <el-col :span="2">送达</el-col>
        <el-col :span="1">状态</el-col>
        <el-col :span="2">操作</el-col>
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
        <div class="order-list-item" v-for="item in dataList" @click="showInfo(item)">
          <el-row>
            <el-col :span="4" class="special-col">
              <div class="el-checkbox-warp" @click.stop.prevent="checkItem(item)"
                   v-if="activeStatus===0||activeStatus==='0'">
                <el-checkbox v-model="item.isChecked"></el-checkbox>
              </div>
              <div>
                {{item.orderNo}}
              </div>
            </el-col>
            <el-col :span="2">
              <div>
                <dict :dict-group="'tmsOrderType'" :dict-key="item.waybillType"></dict>
              </div>
            </el-col>
            <el-col :span="2">
              <div>
                {{item.waybillNumber}}
              </div>
            </el-col>
            <el-col :span="2">
              <div>
                {{item.senderId}}
              </div>
            </el-col>
            <el-col :span="2">
              <div>
                {{item.receiverId}}
              </div>
            </el-col>
            <el-col :span="2">
              <div>
                {{item.receiverAddress}}
              </div>
            </el-col>
            <el-col :span="1">
              <div>
                {{item.wholeBoxCount}} <span v-if="item.wholeBoxCount">箱</span>
              </div>
            </el-col>
            <el-col :span="1">
              <div>
                {{item.bulkBoxCount}} <span v-if="item.bulkBoxCount">箱</span>
              </div>
            </el-col>
            <el-col :span="1">
              <div>
                {{item.incubatorCount}} <span v-if="item.incubatorCount">件</span>
              </div>
            </el-col>
            <el-col :span="2">
              <div>
                {{item.pickUpTime|date}}
              </div>
            </el-col>
            <el-col :span="2">
              <div>
                {{item.deliveryTime|date}}
              </div>
            </el-col>
            <el-col :span="1">
              <div>
                {{getStatus(item)}}
              </div>
            </el-col>
            <el-col :span="2" class="opera-btn">
              <div>
                <div>
                  <span @click.stop="edit(item)">
                    <a @click.pervent="" class="btn-circle btn-opera">
                      <i class="el-icon-t-edit"></i>
                    </a>编辑
                  </span>
                </div>
                <div style="padding-top: 2px">
                  <span @click.stop="deleteOrder(item)">
                    <a @click.pervent="" class="btn-circle btn-opera">
                      <i class="el-icon-t-delete"></i>
                    </a>删除
                  </span>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="order-list-item-bg"></div>
        </div>
      </div>
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

  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import {TmsOrder} from '../../../resources';
  import addForm from './form/add-form.vue';
  import showForm from './form/show-form.vue';
  import wayBillForm from './form/create-way-bill.vue';

  export default {
    components: {
      SearchPart, addForm, wayBillForm
    },
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
        dialogComponents: {
          0: addForm
        },
        dialogInfoComponents: {
          0: showForm
        },
        dialogWayBillComponents: {
          0: wayBillForm
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
          tmsOrderNumber: '',
          waybillType: '',
          shipmentWay: '',
          serviceType: '',
          senderId: '',
          receiverId: ''
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
          this.getTmsOrderPage(1);
        },
        deep: true
      }
    },
    mounted() {
      this.getTmsOrderPage(1);
    },
    methods: {
      getStatus: function (item) {
        let title = '';
        if (item.status === '0') {
          title = '待生成运单';
        }
        if (item.status === '1') {
          title = '待派车';
        }
        if (item.status === '2') {
          title = '待启运';
        }
        if (item.status === '3') {
          title = '待签收';
        }
        if (item.status === '4') {
          title = '已完成';
        }
        return title;
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
      },
      getTmsOrderPage: function (pageNo, isContinue = false) {
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        TmsOrder.query(param).then(res => {
          if (isContinue) {
            this.dataList = this.showTypeList.concat(res.data.list);
          } else {
            this.dataList = res.data.list;
          }
          this.pager.totalPage = res.data.totalPage;
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
        });
      },
      showPart (index) {
        this.action = 'add';
        this.showIndex = index;
        this.currentPart = this.dialogComponents[index];
      },
      edit: function (item) {
        this.action = 'edit';
        this.showIndex = 0;
        this.currentPart = this.dialogComponents[0];
        this.$nextTick(() => {
          this.form = JSON.parse(JSON.stringify(item));
        });
      },
      deleteOrder: function (item) {
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
