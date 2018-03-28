<style lang="less" scoped="">


  .el-form .el-select {
    display: block;
  }

</style>
<template>
  <div>
    <div class="container d-table">
      <div class="d-table-left">
        <div class="d-table-col-wrap" :style="'height:'+bodyHeight" @scroll="scrollLoadingData">
          <h2 class="header">
            <span class="pull-right">
              <perm label="tms-goods-area-add">
                <a href="#" class="btn-circle" @click.stop.prevent="addGoodsArea">
                  <i class="el-icon-t-plus"></i>
                </a>
              </perm>
                <a href="#" class="btn-circle" @click.prevent="searchType">
                  <i class="el-icon-t-search"></i>
                </a>
            </span>
            集货区信息
          </h2>
          <div class="search-left-box" v-show="showTypeSearch">
            <oms-input v-model='typeTxt' placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>
          </div>
          <div>
            <ul class="show-list">
              <li v-for="item in showTypeList" class="list-item" @click="showType(item,1)"
                  :class="{'active':item.id==currentItem.id}">
                <perm label="tms-goods-area-delete">
                  <a href="#" @click.stop.prevent="deleteGoodsArea(item)" class="hover-show pull-right">
                    <i class="el-icon-t-delete"></i>
                  </a>
                </perm>
                {{item.name}}
              </li>
            </ul>
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
        <div class="d-table-col-wrap" :style="'height:'+bodyHeight">
          <span class="pull-right" v-show="showTypeList.length !== 0">
                <span class="btn-search-toggle open" v-show="showSearch">
                  <single-input v-model="filters.keyWord" placeholder="请输入关键字搜索"
                                :showFocus="showSearch"></single-input>
                  <i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>
                </span>
                <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
                  <i class="el-icon-t-search"></i>
                </a>
                    <perm label="tms-goods-area-detail-add">
                      <a href="#" class="btn-circle" @click.stop.prevent="add">
                        <i class="el-icon-t-plus"></i>
                      </a>
                    </perm>
                </span>
          <div v-if="dataRows.length === 0" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <table class="table table-hover">
              <thead>
              <tr>
                <th>单位名称</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="row in dataRows">
                <td>
                  {{row.orgName}}
                </td>
                <td class="list-op">
                  <perm label="tms-goods-area-detail-delete">
                    <a href="#" @click.stop.prevent="deleteGoodsAreaDetail(row)"><i class="el-icon-t-delete"></i>删除</a>
                  </perm>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="text-center" v-show="dataRows.length">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                             :current-page="pager.currentPage"
                             :page-sizes="[20,50,100]" :page-size="20" layout="total, sizes, prev, pager, next, jumper"
                             :total="pager.count">
              </el-pagination>
            </div>
          </div>

        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <edit-form :formItem="form" :title="formTitle" :action="action" :actionType="showRight" @close="showRight=false"
                 @change="itemChange"></edit-form>
    </page-right>
    <page-right :show="showDepartmentRight" @right-close="resetRightBox">
      <department-form :formItem="departmentForm" :title="formTitle" :action="action" :actionType="showRight"
                       @close="showDepartmentRight=false"
                       @change="goodsAreaChange"></department-form>
    </page-right>
  </div>

</template>
<script>
  import {GoodsArea} from '../../../resources';
  import editForm from './form/form.vue';
  import departmentForm from './form/department.vue';
  import bgBox from '../../common/bgbox.vue';

  export default {
    components: {
      editForm, bgBox, departmentForm
    },
    data: function () {
      return {
        showTypeRight: false,
        showRight: false,
        showDepartmentRight: false,
        showTypeSearch: false,
        showAll: true,
        showSearch: false,
        dataRows: [],
        filters: {
          keyWord: '',
          status: 1
        },
        orgType: {
//          0: {'title': '所有', 'num': '', 'status': null},
          0: {'title': '正常', 'num': '', 'status': 1},
          1: {'title': '未激活', 'num': '', 'status': 0},
          2: {'title': '停用', 'num': '', 'status': 2}
        },
        activeStatus: 0,
        changeStatus: 4,
        form: {},
        departmentForm: {},
        formTitle: '',
        oldItem: {},
        action: 'add',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        showTypeList: [],
        goodsAreaPage: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        typeTxt: '',
        currentItem: {}
      };
    },
    mounted() {
      this.getGoodsAreaPage();
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return (height - 70) + 'px';
      }
    },
    filters: {
      formatRole: function (list) {
        return list.map(m => m.title).join('，');
      }
    },
    watch: {
      'typeTxt': function () {
        this.getGoodsAreaPage(1);
      },
      filters: {
        handler: function () {
          this.showType(this.currentItem, 1);
        },
        deep: true
      }
    },
    methods: {
      showType: function (type, pageNo) {
        this.getDetailPage(type, pageNo);
        this.currentItem = type;
        this.showAll = false;
      },
      getDetailPage: function (type, pageNo) {
        let data = Object.assign({}, this.filters, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          id: type.id
        });
        GoodsArea.getDetailPage(data).then(res => {
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
        });
      },
      scrollLoadingData(event) {
        this.$scrollLoadingData(event);
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        this.showType(this.currentItem, 1);
      },
      handleCurrentChange(val) {
        this.showType(this.currentItem, val);
      },
      resetRightBox: function () {
        this.showRight = false;
        this.showDepartmentRight = false;
      },
      addType: function () {
        this.showTypeRight = true;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getGoodsAreaPage: function (pageNo, isContinue = false) {
        this.goodsAreaPage.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          keyWord: this.typeTxt
        });
        GoodsArea.getPage(param).then(res => {
          this.$store.commit('initBottomLoading', false);
          if (isContinue) {
            this.showTypeList = this.showTypeList.concat(res.data.list);
          } else {
            this.showTypeList = res.data.list;
            this.data = Object.assign({}, {'id': ''}, res.data.list[0]);
            this.showType(this.data, 1);
          }
          this.goodsAreaPage.totalPage = res.data.totalPage;
        });
        // this.queryStatusNum(param);
      },
      add: function () {
        this.action = 'add';
        this.form = Object.assign({}, this.currentItem);
        this.formTitle = '新增集货区单位';
        this.showRight = true;
      },
      addGoodsArea: function () {
        this.action = 'add';
        this.departmentForm = {};
        this.formTitle = '新增';
        this.showDepartmentRight = true;
      },
      deleteGoodsArea: function (item) {
        this.$confirm('删除集货区会一并删除集货区下的所有单位信息,确认删除集货区' + item.name + '?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          GoodsArea.delete(item.id).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '删除集货区成功'
            });
            this.getGoodsAreaPage(1);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.msg || '删除集货区失败'
            });
          });
        }).catch(() => {

        });
      },
      deleteGoodsAreaDetail: function (item) {
        this.$confirm('确认删除单位' + item.orgName + '?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          GoodsArea.deleteDetail(item.detailId).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '删除单位成功'
            });
            this.getDetailPage(item, this.pager.currentPage);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.msg || '删除单位失败'
            });
          });
        }).catch(() => {

        });
      },
      goodsAreaChange: function () {
        this.getGoodsAreaPage(1);
        this.showDepartmentRight = false;
      },
      itemChange: function () {
        this.showType(this.currentItem, this.pager.currentPage);
        this.showRight = false;
      }
    }
  };
</script>
