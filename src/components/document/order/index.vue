<template>
  <div class="order-page">
    <search-part @search="searchResult"></search-part>

    <status-list :activeStatus="activeStatus" :statusList="orderType" :checkStatus="checkStatus">
      <span class="btn-group-right">
        <des-btn icon="plus" @click="showPart(0)">添加</des-btn>
        <!--<el-button size="small" plain @click="showPart(0)">添加</el-button>-->
      </span>
    </status-list>

    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="3">订单号</el-col>
        <el-col :span="3">委托单号</el-col>
        <el-col :span="2">订单类型</el-col>
        <el-col :span="2">发运方式</el-col>
        <el-col :span="2">服务方式</el-col>
        <el-col :span="4">发货单位</el-col>
        <el-col :span="4">收货单位</el-col>
        <el-col :span="4">操作</el-col>
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
            <el-col :span="3">
              <div>
                {{item.orderNo}}
              </div>
            </el-col>
            <el-col :span="3">
              <div>
                {{item.tmsOrderNumber}}
              </div>
            </el-col>
            <el-col :span="2">
              <div>
                <dict :dict-group="'tmsOrderType'" :dict-key="item.waybillType"></dict>
              </div>
            </el-col>
            <el-col :span="2">
              <div>
                <dict :dict-group="'tmsOrderType'" :dict-key="item.waybillType"></dict>
              </div>
            </el-col>
            <el-col :span="2">
              <div>
                <dict :dict-group="'tmsOrderType'" :dict-key="item.waybillType"></dict>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                {{item.senderId}}
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                {{item.receiverId}}
              </div>
            </el-col>
            <el-col :span="4" class="opera-btn">
              <div>
                <span @click.stop="edit(item)">
                  <a @click.pervent="" class="btn-circle btn-opera">
                    <i class="el-icon-t-edit"></i>
                  </a>编辑
                </span>
                <span @click.stop="deleteOrder(item)">
                  <a @click.pervent="" class="btn-circle btn-opera">
                    <i class="el-icon-t-delete"></i>
                  </a>删除
                </span>
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
  import {TmsOrder} from '../../../resources';
  import addForm from './form/add-form.vue';
  import showForm from './form/show-form.vue';

  export default {
    components: {
      SearchPart, addForm
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
          status: ''
        }
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
