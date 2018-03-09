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
      </template>
    </search-part>

    <status-list :activeStatus="activeStatus" :statusList="orderType" :checkStatus="checkStatus"/>

    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="4">
          订单号
        </el-col>
        <el-col :span="2">运单类型</el-col>
        <el-col :span="2">运单号</el-col>
        <el-col :span="2">发货单位</el-col>
        <el-col :span="2">收货单位</el-col>
        <el-col :span="2">收货地址</el-col>
        <el-col :span="1">整件</el-col>
        <el-col :span="1">散件</el-col>
        <el-col :span="1">包件</el-col>
        <el-col :span="2">提货时间</el-col>
        <el-col :span="2">送达时限</el-col>
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
        <div class="order-list-item" v-for="item in dataList" @click="showInfo(item)"
             :class="[formatRowClass(item.status, orderType) ,{'active':currentItemId===item.id}]">
          <el-row>
            <el-col :span="4" class="special-col R">
              <div>
                {{item.orderNo}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                <dict :dict-group="'tmsOrderType'" :dict-key="item.waybillType"></dict>
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{item.waybillNumber}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{item.senderName}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{item.receiverName}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{item.receiverAddress}}
              </div>
            </el-col>
            <el-col :span="1" class="R">
              <div>
                {{item.wholeBoxCount}} <span v-if="item.wholeBoxCount">箱</span>
              </div>
            </el-col>
            <el-col :span="1" class="R">
              <div>
                {{item.bulkBoxCount}} <span v-if="item.bulkBoxCount">箱</span>
              </div>
            </el-col>
            <el-col :span="1" class="R">
              <div>
                {{item.incubatorCount}} <span v-if="item.incubatorCount">件</span>
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{item.pickUpTime|date}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{item.deliveryTime|date}}
              </div>
            </el-col>
            <el-col :span="1" class="R">
              <div>
                {{formatStatusTitle(item.status, orderType)}}
              </div>
            </el-col>
            <el-col :span="2" class="opera-btn">
              <div>
                <div>
                  <perm label="tms-waybill-edit">
                    <span @click.stop="edit(item)">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-edit"></i>
                      </a>编辑
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

    <page-right :show="showIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentPart" :action="action" :formItem="form" @right-close="resetRightBox" @change="submit"/>
    </page-right>
    <page-right :show="showInfoIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentInfoPart" :formItem="form" @right-close="resetRightBox"/>
    </page-right>

  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import {TmsWayBill} from '../../../resources';
  import addForm from './form/add-form.vue';
  import showForm from './form/show-form.vue';
  import StatusMixin from '@/mixins/statusMixin';

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
        currentPart: null,
        currentInfoPart: null,
        dialogComponents: {
          0: addForm
        },
        dialogInfoComponents: {
          0: showForm
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
          status: '0',
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
      getTmsWayBillPage: function (pageNo, isContinue = false) {
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        TmsWayBill.query(param).then(res => {
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
        TmsWayBill.queryStateNum(params).then(res => {
          let data = res.data;
          this.orderType[0].num = data['pend-choose-car'];
          this.orderType[1].num = data['pend-shipment'];
          this.orderType[2].num = data['pend-sign'];
          this.orderType[3].num = data['complete'];
        });
      },
      showPart (index) {
        this.action = 'add';
        this.showIndex = index;
        this.currentPart = this.dialogComponents[index];
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
