<style lang="scss" scoped>

  @import "../../../assets/scss/mixins.scss";

  .margin-left {
    margin-left: 15px;
  }

  .margin-left-right {
    margin-left: 38px;
    margin-right: 38px;
  }

  .power-style-part {
    margin: 12px 0;
    background-color: rgb(238, 238, 238);
    padding: 12px 10px 10px 10px;
  }

  .el-form .el-checkbox__label {
    font-size: 12px;
    padding-left: 5px;
  }

  .el-form .el-checkbox__inner {
    width: 14px;
    height: 14px;
  }

  .d-table-col-wrap {
    overflow: auto;
  }

  .lh20 {
    line-height: 20px;
  }

  .form-header-part {
    padding: 0 10px;

    &.part-bg {
      background: #eee;
      padding-bottom: 10px;
    }

    .header {
      line-height: 30px;
      height: 30px;
      display: flex;
      align-items: center;

      .sign {
        width: 4px;
        background: $activeColor;
        height: 100%;
      }

      .tit {
        margin: 0 0 0 10px;

        &.active {
          color: $activeColor
        }
      }
    }

    .content-sp {
      overflow: hidden;
      font-size: 14px;
    }
  }

</style>
<template>
  <div>
    <div class="d-table-flex">
      <div class="d-table-left">
        <div>
          <h2 class="header">
                <span class="pull-right">
                  <perm label="tms-equipment-consumables-add">
                    <a href="#" class="btn-circle" @click.stop.prevent="addType">
                      <i class="el-icon-t-plus"></i>
                    </a>
                  </perm>
                      <a href="#" class="btn-circle" @click.prevent="searchType">
                        <i class="el-icon-t-search"></i>
                      </a>
                </span>
            包装耗材
          </h2>
          <div class="search-left-box" v-if="showTypeSearch">
            <oms-input v-model='typeTxt' placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>
          </div>
          <div v-if="loadingData">
            <oms-loading :loading="loadingData"></oms-loading>
          </div>
          <div v-else-if="showTypeList.length===0" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <el-scrollbar tag="div" class="d-table-left_scroll" :style="'height:'+bodyHeight"
                          @scroll="scrollLoadingData">
              <ul class="show-list">
                <li v-for="(item,index) in showTypeList" class="list-item" @click="showType(item)"
                    :class="{'active':item.id==currentItem.id}">
                  <div>
                    <span class="hover-show">
                      <perm label="tms-equipment-consumables-delete">
                        <a href="#" class="pull-right "
                           @click.prevent="removeType(item)">
                          <i class="el-icon-t-delete"></i>
                        </a>
                      </perm>
                      <perm label="tms-equipment-consumables-update">
                        <a href="#" class="pull-right "
                           @click.prevent="editType(currentItem)">
                          <i class="el-icon-t-edit"></i>
                        </a>
                      </perm>
                    </span>
                    {{item.name}}
                  </div>
                </li>
              </ul>
            </el-scrollbar>
            <div class="btn-left-list-more">
              <bottom-loading></bottom-loading>
              <div @click.stop="getMore" v-show="!$store.state.bottomLoading">
                <el-button v-show="pager.currentPage<pager.totalPage">加载更多</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-table-right">
        <div class="empty-info" v-if="!currentItem.id">暂无信息</div>
        <div v-else>
          <div class="content-right">
            <div class="form-header-part part-bg p-r-20">
              <div class="header">
                <div class="sign f-dib"></div>
                <h3 class="tit f-dib index-tit">包装信息</h3>
              </div>
              <div class="content content-sp">
                <el-row>
                  <el-col :span="6">
                    <oms-row :span="5" label="名称" v-show="currentItem.name">{{currentItem.name }}</oms-row>
                    <oms-row :span="5" label="型号" v-show="currentItem.model">{{ currentItem.model}}</oms-row>
                    <oms-row :span="5" label="规格" v-show="currentItem.specification">{{currentItem.specification }}
                    </oms-row>
                  </el-col>
                  <el-col :span="6">
                    <oms-row label="类型" v-show="currentItem.type">
                      <dict :dict-group="'equipmentType'" :dict-key="currentItem.type"/>
                    </oms-row>
                    <oms-row label="品牌" v-show="currentItem.brand">{{currentItem.brand }}</oms-row>
                    <oms-row label="单次计费价格" v-show="currentItem.rentPrice">
                      <span v-show="currentItem.rentPrice">¥</span>{{currentItem.rentPrice}}
                    </oms-row>
                  </el-col>
                  <el-col :span="6">
                    <oms-row :span="5" label="体积" v-show="currentItem.volume">{{currentItem.volume }} <span>m³</span>
                    </oms-row>
                    <oms-row :span="5" label="重量" v-show="currentItem.weight">{{currentItem.weight }} <span>kg</span>
                    </oms-row>
                    <oms-row label="租赁计费价格" v-show="currentItem.singlePrice"><span
                      v-show="currentItem.singlePrice">¥</span>{{currentItem.singlePrice}}
                    </oms-row>
                  </el-col>
                  <el-col :span="6">
                    <!--<oms-row label="库存数" v-show="currentItem.count">{{ currentItem.count}}</oms-row>-->
                    <!--<oms-row label="序列号管理">{{currentItem.devIsSerialNumber | formatStatus}}</oms-row>-->
                    <oms-row label="采购价格" v-show="currentItem.purchasePrice"><span
                      v-show="currentItem.purchasePrice">¥</span>{{currentItem.purchasePrice}}
                    </oms-row>
                    <oms-row label="销售价格" v-show="currentItem.salePrice">
                      <span v-show="currentItem.salePrice">¥</span>{{currentItem.salePrice}}
                    </oms-row>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="form-header-part mt-10 p-r-20">
              <el-row>
                <el-col :span="6">
                  <div class="header">
                    <div class="sign f-dib"></div>
                    <h3 class="tit f-dib index-tit">包装详情列表</h3>
                  </div>
                </el-col>
                <el-col :span="18" class="text-right ">
                  <el-button-group>
                    <el-button :plain="true" @click="searchInOrder" native-type="rightChangeHandle">查询</el-button>
                    <el-button @click="resetSearchForm" native-type="reset">重置</el-button>
                    <el-button @click="batchUpdateStatus" native-type="reset">批量修改状态</el-button>
                    <el-button :disabled="isLoading" :plain="true" @click="exportFile">
                      导出Excel
                    </el-button>
                    <perm label="tms-equipment-consumables-detail-add">
                      <el-button :plain="true" @click="add">添加</el-button>
                    </perm>
                  </el-button-group>
                </el-col>
                <el-dialog
                  :visible.sync="centerDialogVisible"
                  title="请选择需要改成的状态:"
                  width="30%">
                  <el-radio-group v-model="radioStatus">
                    <template v-for="item of typeList">
                      <el-radio :label="item.key">{{item.label}}</el-radio>
                    </template>
                  </el-radio-group>
                  <span class="dialog-footer" slot="footer">
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button @click="submitStatusChange" type="primary">确 定</el-button>
            </span>
                </el-dialog>
              </el-row>
              <div class="content">
                <el-form class="advanced-query-form clearfix" onsubmit="return false" style="padding-top: 10px">
                  <el-row>
                    <el-col :span="6">
                      <oms-form-row :span="4" label="编号">
                        <oms-input @keyup.native.enter="searchInOrder" placeholder="包装编号" type="text"
                                   v-model="searchCondition.devNo"></oms-input>
                      </oms-form-row>
                    </el-col>
                    <el-col :span="10">
                      <oms-form-row :span="3" label="状态">
                        <el-radio-group @change="changeStatus" size="small" v-model="currentStatus">
                          <el-radio-button :key="item.statusKey" :label="item.statusType + item.count"
                                           :value="item.statusKey"
                                           v-for="item in devDetailCount"></el-radio-button>
                        </el-radio-group>
                      </oms-form-row>
                    </el-col>
                    <el-col :span="8">
                      <!--<oms-form-row label="包装状态" :span="4">-->
                      <!--<el-select placeholder="请选择包装状态" v-model="searchCondition.status">-->
                      <!--<el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in typeList">-->
                      <!--</el-option>-->
                      <!--</el-select>-->
                      <!--</oms-form-row>-->
                      <oms-form-row :span="4" label="有效期">
                        <el-date-picker type="daterange" v-model="validityTimes"></el-date-picker>
                      </oms-form-row>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </div>
          </div>
          <div class="p-r-20 mt-10">
            <div v-if="loadingDetailData">
              <oms-loading :loading="loadingDetailData"></oms-loading>
            </div>
            <div v-else-if="devDetailList.length===0">
              <div class="empty-info">暂无信息</div>
            </div>
            <el-table :data="devDetailList" :header-row-class-name="'headerClass'" :maxHeight="tableHeight"
                      @selection-change="handleSelectionChange" border
                      class="header-list" style="margin-right:-15px;width: 100%;"
                      v-else>
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column :sortable="true" label="包装编号" min-width="150" prop="devNo"></el-table-column>
              <el-table-column :sortable="true" label="状态" min-width="80" prop="status">
                <template slot-scope="scope">
                  <dict :dict-group="currentItem.type+'Status'" :dict-key="scope.row.status"></dict>
                </template>
              </el-table-column>
              <el-table-column :sortable="true" label="有效期" min-width="100" prop="validityDate">
                <template slot-scope="scope">
                  {{scope.row.validityDate|date}}
                </template>
              </el-table-column>
              <el-table-column label="备注" min-width="180" prop="remark">
                <template slot-scope="scope">
                  {{scope.row.remark}}
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" min-width="200">
                <template slot-scope="scope">
                  <div class="opera-btn">
                    <perm class="btn-line-block" label="tms-equipment-consumables-detail-edit">
                    <span @click.stop="editDetailType(scope.row)">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-edit"></i>
                      </a>编辑
                    </span>
                    </perm>
                    <span @click.stop="showDetailStatusLog(scope.row)" style="margin-left: 10px">
                    <a @click.pervent="" class="btn-circle btn-opera">
                      <i class="el-icon-t-search"></i>
                    </a>状态变更日志
                  </span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="text-center clearfix" v-if="devDetailList.length">
            <el-pagination :current-page="detailPager.currentPage" :page-size="detailPager.pageSize"
                           :page-sizes="[10,20,50,100]"
                           :total="detailPager.count" @current-change="handleCurrentChange"
                           @size-change="handleSizeChange"
                           layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{width:'600px'}">
      <dev-form :formItem="form" @change="onSubmit" @right-close="resetRightBox"></dev-form>
    </page-right>
    <page-right :show="showDetailRight" @right-close="resetRightBox" :css="{width:'600px'}">
      <dev-detail-form :formItem="detailFrom" :devType="currentItem.type" @change="detailSubmit"
                       @right-close="resetRightBox"></dev-detail-form>
    </page-right>
    <page-right :show="showDetailLogRight" @right-close="resetRightBox" :css="{width:'900px'}">
      <dev-detail-status-log :formItem="detailFrom" :devType="currentItem.type"
                             @right-close="resetRightBox"></dev-detail-status-log>
    </page-right>
    <page-right :show="showStoreRight" @right-close="resetRightBox" :css="{width:'600px'}">
      <dev-store-form :formItem="storeForm" @change="orderSubmit" @right-close="resetRightBox"></dev-store-form>
    </page-right>
  </div>

</template>
<script>
import {Dev, DevDetail, DevStore} from '@/resources';
import devForm from './form/dev.vue';
import devDetailForm from './form/dev-detail.vue';
import devStoreForm from './form/dev-store.vue';
import devDetailStatusLog from './form/dev-detail-status-log.vue';
import utils from '@/tools/utils';

export default {
    components: {devForm, devDetailForm, devStoreForm, devDetailStatusLog},
    props: {
      index: {
        type: Number,
        default: -1
      }
    },
    data: function () {
      return {
        loadingData: true,
        loadingDetailData: true,
        centerDialogVisible: false,
        devDetailList: [],
        storeDetailList: [],
        devDetail: 'devIsSerialNumber',
        order: 'in',
        devIsSerialNumber: 'normal',
        status: '',
        storeStatus: '0',
        showRight: false,
        showDetailRight: false,
        showDetailLogRight: false,
        showStoreRight: false,
        showTypeSearch: false,
        showSearch: false,
        showDetailSearch: false,
        currentItem: {},
        showTypeList: [],
        typeTxt: '',
        keyWord: '',
        form: {},
        detailFrom: {},
        storeForm: {
          id: '',
          createTime: '',
          createBy: '',
          createName: '',
          orderId: '',
          count: null,
          type: null,
          detailList: [],
          devDetailIdList: []
        },
        action: '',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        detailPager: {
          currentPage: 1,
          count: 0,
          pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10,
          totalPage: 1
        },
        storePager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        searchCondition: {
          validityStartDate: '',
          validityEndDate: '',
          status: '',
          devNo: ''
        },
        detailFilter: {
          validityStartDate: '',
          validityEndDate: '',
          status: '',
          devNo: ''
        },
        validityTimes: '',
        isLoading: false,
        currentStatus: '',
        devDetailCount: [],
        radioStatus: '',
        multipleSelection: []
      };
    },
    mounted() {
      this.$emit('loaded');
      this.getPageList(1);
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = (height - 17) + 'px';
        return height;
      },
      tableHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return (height - 267);
      },
      equipmentType: function () {
        return this.$getDict('equipmentType');
      },
      typeList: function () {
        if (!this.currentItem.type) return;
        return this.$getDict(this.currentItem.type + 'Status');
      }
    },
    watch: {
      detailFilter: {
        handler: function () {
          this.getDevDetailList(1);
        },
        deep: true
      },
      'typeTxt': function () {
        this.getPageList(1);
      },
      index() {
        this.loadingData = true;
        this.showTypeList = [];
      },
      'searchCondition.status': function () {
        this.searchInOrder();
      },
      'validityTimes': function (val) {
        if (val) {
          this.searchInOrder();
        } else {
          this.searchCondition.validityStartDate = '';
          this.searchCondition.validityEndDate = '';
          this.resetSearchForm();
        }
      }
    },
    methods: {
      removeType: function (item) {
        this.$confirm('删除包装耗材"' + item.name + '"会一并删除该包装耗材下的设备信息,确认删除设备"' + item.name + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Dev.delete(item.id).then(() => {
            let index = this.showTypeList.indexOf(item);
            this.showTypeList.splice(index, 1);
            this.currentItem = {};
            this.devDetailList = [];
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功删除包装耗材"' + item.name + '"'
            });
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '删除包装耗材"' + item.name + '"失败'
            });
          });
        }).catch(() => {
        });
      },
      exportFile: function () {
        this.isLoading = true;
        this.$store.commit('initPrint', {
          isPrinting: true,
          moduleId: '/equipmentfiles'
        });
        let param = Object.assign({}, {
          devId: this.currentItem.id,
          keyWord: this.keyWord,
          deleteFlag: false
        }, this.detailFilter);
        this.$http.get('dev-detail/excel/export', {params: param}).then(res => {
          utils.download(res.data.path, '包装详情表');
          this.isLoading = false;
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/equipmentfiles'
          });
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/equipmentfiles'
          });
          this.$notify.error({
            message: error.response&&error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      scrollLoadingData(event) {
        this.$scrollLoadingData(event);
      },
      searchInOrder: function () {// 搜索
        this.searchCondition.validityStartDate = this.$formatAryTime(this.validityTimes, 0, 'YYYY-MM-DD');
        this.searchCondition.validityEndDate = this.$formatAryTime(this.validityTimes, 1, 'YYYY-MM-DD');
        Object.assign(this.detailFilter, this.searchCondition);
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          validityStartDate: '',
          validityEndDate: '',
          status: '',
          devNo: ''
        };
        this.currentStatus = '';
        this.validityTimes = '';
        Object.assign(this.searchCondition, temp);
        Object.assign(this.detailFilter, this.searchCondition);
      },
      handleSizeChange(val) {
        this.detailPager.pageSize = val;
        window.localStorage.setItem('currentPageSize', val);
        this.getDevDetailList(1);
      },
      handleCurrentChange(val) {
        this.getDevDetailList(val);
      },
      getStoreDetailList: function (pageNo) {
        this.storePager.currentPage = pageNo;
        let param = Object.assign({}, {
          type: this.storeStatus,
          pageNo: pageNo,
          pageSize: this.storePager.pageSize,
          keyWord: this.keyWord,
          deleteFlag: false
        });
        DevStore.queryDevPager(this.currentItem.id, param).then(res => {
          this.storeDetailList = res.data.list;
          // 处理时间
          this.storeDetailList.forEach(val => {
            val.createTime = this.$moment(val.createTime).format('YYYY-MM-DD');
          });
          this.storePager.count = res.data.count;
          this.storePager.totalPage = res.data.totalPage;
        });
      },
      getDevDetailList: function (pageNo) {
        if (!this.currentItem.id) {
          this.devDetailList = [];
          this.detailPager.count = 0;
          this.detailPager.totalPage = 0;
          return;
        }
        this.loadingDetailData = true;
        this.detailPager.currentPage = pageNo;
        let param = Object.assign({}, {
          devId: this.currentItem.id,
          keyWord: this.keyWord,
          deleteFlag: false,
          // status: this.status,
          pageNo: pageNo,
          pageSize: this.detailPager.pageSize
        }, this.detailFilter);
        DevDetail.query(param).then(res => {
          this.devDetailList = res.data.list;
          this.detailPager.count = res.data.count;
          this.detailPager.totalPage = res.data.totalPage;
          this.loadingDetailData = false;
        });
      },
      getPageList: function (pageNo, isContinue = false) {
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          keyWord: this.typeTxt,
          deleteFlag: false
        });
        let nowTime = Date.now();
        this.nowLeftTime = nowTime;
        Dev.query(param).then(res => {
          if (param.keyWord !== this.typeTxt) return;
          if (this.nowLeftTime > nowTime) return;
          if (isContinue) {
            this.showTypeList = this.showTypeList.concat(res.data.list);
          } else {
            this.showTypeList = res.data.list;
            this.currentItem = Object.assign({}, {'id': ''}, res.data.list[0]);
            // this.$store.commit('initDev', this.currentItem);
            this.getDevDetailList(1);
            this.getDevDetailStatusCount(this.currentItem);
          }
          this.pager.totalPage = res.data.totalPage;
          this.$store.commit('initBottomLoading', false);
        });
        this.loadingData = false;
      },
      getMore: function () {
        this.getPageList(this.pager.currentPage + 1, true);
      },
      resetRightBox: function () {
        this.showRight = false;
        this.showDetailRight = false;
        this.showDetailLogRight = false;
        this.showStoreRight = false;
      },
      add: function () {
        this.action = 'add';
        if (this.devDetail === 'devIsSerialNumber') {
          this.detailFrom = {
            id: '',
            devNo: '',
            devId: this.currentItem.id,
            brand: '',
            status: ''
          };
          this.showDetailRight = true;
        }
        if (this.devDetail === 'order') {
          this.storeForm = {
            id: '',
            createTime: '',
            createBy: '',
            createName: '',
            orderId: '',
            count: null,
            type: null,
            detailList: [],
            devDetailIdList: []
          };
          this.showStoreRight = true;
        }
      },
      edit: function (item) {
        this.action = 'edit';
        if (this.devDetail === 'devIsSerialNumber') {
          this.detailFrom = JSON.parse(JSON.stringify(item));
          if (this.detailFrom.status) {
            this.detailFrom.status = this.detailFrom.status.toString();
          }
          this.showDetailRight = true;
        }
        if (this.devDetail === 'order') {
          this.storeForm = JSON.parse(JSON.stringify(item));
          this.showStoreRight = true;
        }
      },
      showDetailStatusLog: function (item) {
        this.showDetailLogRight = true;
        this.detailFrom = JSON.parse(JSON.stringify(item));
      },
      addType: function () {
        this.action = 'add';
        this.form = {
          id: '',
          name: '',
          type: '',
          model: '',
          specification: '',
          brand: '',
          count: '',
          devIsSerialNumber: false,
          purchasePrice: '',
          rentPrice: '',
          singlePrice: '',
          salePrice: ''
        };
        this.showRight = true;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      editType: function (item) {
        this.action = 'edit';
        this.form = JSON.parse(JSON.stringify(item));
        if (this.form.purchasePrice) {
          this.form.purchasePrice = utils.autoformatDecimalPoint(this.form.purchasePrice.toString());
        }
        if (this.form.rentPrice) {
          this.form.rentPrice = utils.autoformatDecimalPoint(this.form.rentPrice.toString());
        }
        if (this.form.singlePrice) {
          this.form.singlePrice = utils.autoformatDecimalPoint(this.form.singlePrice.toString());
        }
        if (this.form.salePrice) {
          this.form.salePrice = utils.autoformatDecimalPoint(this.form.salePrice.toString());
        }
        this.showRight = true;
      },
      editDetailType: function (item) {
        this.action = 'edit';
        this.detailFrom = JSON.parse(JSON.stringify(item));
        this.showDetailRight = true;
      },
      remove: function (item) {
        Dev.delete(item.id).then(() => {
          this.getPageList(1);
        });
      },
      showType: function (type) {
        this.currentStatus = '';
        this.currentItem = type;
        this.getDevDetailList(1);
        this.resetSearchForm();
        this.getDevDetailStatusCount(this.currentItem);
      },
      onSubmit: function (item) {
        if (this.action === 'add') {
          this.showTypeList.splice(0, 0, item);
          this.currentItem = item;
        } else {
          this.showTypeList.splice(this.showTypeList.indexOf(this.currentItem), 1, item);
          this.currentItem = item;
        }
        this.getDevDetailList(1);
        // this.getStoreDetailList(1);
        this.getDevDetailStatusCount(this.currentItem);
      },
      detailSubmit: function (item) {
        this.status = parseInt(item.status, 10);
        this.getDevDetailList(1);
        this.getDevDetailStatusCount(this.currentItem);
      },
      orderSubmit: function (item) {
        this.storeStatus = item.type;
        this.getStoreDetailList(1);
        this.getDevDetailStatusCount(this.currentItem);
      },
      getDevDetailStatusCount(item) {
        DevDetail.devDetailStatusCount(item.id, item.type + 'Status').then(res => {
          this.devDetailCount = res.data;
        });
      },
      changeStatus(val) {
        let value = '';
        this.devDetailCount.forEach(item => {
          let label = item.statusType + item.count;
          if (label === val) {
            value = item.statusKey;
          }
        });
        this.searchCondition.status = value;
        this.detailFilter.status = value;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      batchUpdateStatus() {
        if (this.multipleSelection.length === 0) {
          this.$notify({
            title: '提示',
            message: '请选择需要更改状态的设备',
            type: 'info'
          });
          return;
        }
        this.centerDialogVisible = true;
      },
      submitStatusChange() {
        if (!this.radioStatus) {
          this.$notify({
            title: '提示',
            message: '请先选择状态',
            type: 'info'
          });
          return;
        }
        let devDetailIds = [];
        this.multipleSelection.forEach(value => {
          if (value.status !== this.radioStatus) {
            devDetailIds.push(value.id);
          }
        });
        if (devDetailIds.length === 0) {
          this.$notify({
            title: '提示',
            message: '设备状态一致',
            type: 'info'
          });
          return;
        }
        let formDate = Object.assign({}, {
          codeList: devDetailIds,
          newStatus: this.radioStatus,
          oldStatus: this.multipleSelection[0].status
        });
        DevDetail.batchUpdateDevDetailStatus(formDate).then(res => {
          this.$notify({
            type: 'success',
            title: '成功',
            message: res.data && res.data.msg || '批量修改状态成功'
          });
          this.resetStatusChange();
          let pattern = new RegExp('[0-9]+');
          let num = this.currentStatus.match(pattern);
          let temp = this.currentStatus.substring(0, this.currentStatus.indexOf('' + num));
          this.currentStatus = temp + (this.detailPager.count - devDetailIds.length);
          console.info(this.currentStatus);
        }).catch(error => {
          this.$notify({
            type: 'error',
            title: '错误',
            message: error.response&&error.response.data && error.response.data.msg || '批量修改状态失败'
          });
          this.resetStatusChange();
        });
      },
      resetStatusChange() {
        this.radioStatus = '';
        this.multipleSelection = [];
        this.centerDialogVisible = false;
        this.getDevDetailList(1);
        this.getDevDetailStatusCount(this.currentItem);
      }
    }
  };
</script>
