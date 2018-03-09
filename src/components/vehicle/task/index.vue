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
      </span>
    </status-list>

    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="2">任务编码</el-col>
        <el-col :span="2">任务类型</el-col>
        <el-col :span="2">任务状态</el-col>
        <el-col :span="4">承运商</el-col>
        <el-col :span="2">车牌号</el-col>
        <el-col :span="2">司机</el-col>
        <el-col :span="2">理货员</el-col>
        <el-col :span="2">件数</el-col>
        <el-col :span="2">载重</el-col>
        <el-col :span="2">容积</el-col>
        <el-col :span="2">派车时间</el-col>
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
            <el-col :span="2" class="R">
              <div>
                {{item.transportTaskNo}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                <dict :dict-group="'deliveryTaskType'" :dict-key="item.type"></dict>
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{formatStatusTitle(item.status, orderType)}}
              </div>
            </el-col>
            <el-col :span="4" class="R">
              <div>
                {{item.taskCarriers}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{item.carPlateNumber}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{item.driverName}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{item.tallyClerk}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{item.incubatorCount}} <span v-if="item.incubatorCount">件</span>
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{item.carLoadBearing}} <span v-if="item.carLoadBearing">千克</span>
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{item.carVolume}} <span v-if="item.carVolume">立方米</span>
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{item.updateTime|time}}
              </div>
            </el-col>
          </el-row>
          <div class="order-list-item-bg"></div>
        </div>
      </div>
    </div>

    <page-right :show="showIndex === 0" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <component :is="currentPart" :formItem="form"/>
    </page-right>

  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import {TmsWayBill, TransportTask} from '../../../resources';
  import showForm from './form/show-form';
  import StatusMixin from '@/mixins/statusMixin';

  export default {
    components: {
      SearchPart
    },
    mixins: [StatusMixin],
    data() {
      return {
        loadingData: false,
        activeStatus: 0,
        orderType: utils.carTaskType,
        dataList: [],
        showIndex: -1,
        dialogComponents: {
          0: showForm
        },
        currentPart: null,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        action: '',
        form: {},
        filters: {
          status: '',
          transportTaskNo: '',
          type: '',
          carPlateNumber: ''
        },
        isCheckAll: false,
        checkList: [],
        checkListPara: [],
        shoWayBillPart: false,
        currentItem: {},
        currentItemId: ''
      };
    },
    watch: {
      filters: {
        handler: function () {
          this.getTransportTaskPage(1);
        },
        deep: true
      }
    },
    mounted() {
      this.getTransportTaskPage(1);
    },
    methods: {
      searchResult: function (search) {
        Object.assign(this.filters, search);
      },
      checkStatus(item, key) {
        this.filters.status = item.status;
        this.activeStatus = key;
      },
      resetRightBox() {
        this.showIndex = -1;
      },
      getTransportTaskPage: function (pageNo, isContinue = false) {
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        TransportTask.query(param).then(res => {
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
          this.orderType[0].num = data['pend-generate-waybill'];
          this.orderType[1].num = data['pend-choose-car'];
          this.orderType[2].num = data['pend-shipment'];
          this.orderType[3].num = data['pend-sign'];
          this.orderType[4].num = data['complete'];
        });
      },
      showInfo: function (item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.showIndex = 0;
        this.currentPart = this.dialogComponents[0];
        this.$nextTick(() => {
          this.form = JSON.parse(JSON.stringify(item));
        });
      }
    }
  };
</script>

