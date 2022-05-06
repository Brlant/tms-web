<style lang="scss" scoped>
.el-form .el-select {
  display: block;
}

</style>
<template>
  <div>
    <div class="opera-btn-group" :class="{up: showSearch}">
      <div class="opera-icon">
        <el-col :span="2">
          <h2 class="header f-dib">
            仓库信息
          </h2>
        </el-col>
        <el-col :span="22" class="text-right">
          <el-button plain size="small" icon="el-icon-edit-outline" @click="editStorageBin">
            编辑仓库
          </el-button>
          <el-button plain size="small" icon="el-icon-plus" @click="addStorageBin">
            新增仓库
          </el-button>
        </el-col>
      </div>
    </div>
    <div class="d-table">
      <div class="d-table-left">
        <div class="empty-info" v-show="!list.length">暂无信息</div>
        <div style="padding-left: 10px">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item v-for="(item,index) in list" :title="'  '+item.name" :name="index">
              <ul class="show-list">
                <li v-for="item1 in item.list" class="list-item">
                  {{ item1.name }}
                  <template v-if="item1.status1 == '0'">
                    <el-tag type="success" class="pull-right ml-10">正常</el-tag>
                  </template>
                  <template v-else-if="item1.status1 == '1'">
                    <el-tag type="danger" class="pull-right ml-10">禁用</el-tag>
                  </template>
                  <template v-if="item1.status0 == '0'">
                    <el-tag type="success" class="pull-right ml-10">整件</el-tag>
                  </template>
                  <template v-else-if="item1.status0 == '1'">
                    <el-tag type="danger" class="pull-right ml-10">散件</el-tag>
                  </template>
                  <template v-else>
                    <el-tag type="danger" class="pull-right ml-10">不合格</el-tag>
                  </template>
                </li>
              </ul>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="btn-left-list-more">
          <bottom-loading></bottom-loading>
          <div @click.stop="getMore" v-show="!$store.state.bottomLoading">
            <el-button v-show="StorageBinPage.currentPage<StorageBinPage.totalPage">加载更多</el-button>
          </div>
        </div>
      </div>
      <div class="d-table-right">
        <el-scrollbar tag="div" class="d-table-left_scroll" :style="'height:'+bodyHeight">
          <div class="scrollbar-content">
            <span class="pull-right" v-show="list.length !== 0">
              <perm label="tms-goods-area-detail-add">
                <a href="#" class="btn-circle" @click.stop.prevent="add" v-show="!showAll">
                  <i class="el-icon-t-plus"></i>
                </a>
              </perm>
            </span>
            <div v-if="dataRows.length === 0" class="empty-info clearfix">
              暂无信息
            </div>
            <div v-else>
              <table class="table table-hover">
                <thead>
                <tr>
                  <th width="50%">仓位名称</th>
                  <th width="30%">仓库名称</th>
                  <th width="20%">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="row in dataRows">
                  <td width="50%">
                    {{ row.orgName }}
                  </td>
                  <td width="30%">
                    {{ row.areaName }}
                  </td>
                  <td class="list-op" width="20%">
                    <perm label="tms-goods-area-detail-delete">
                      <a href="#" @click.stop.prevent="deleteStorageBinDetail(row)"><i
                        class="el-icon-t-delete"></i>删除</a>
                    </perm>
                  </td>
                </tr>
                </tbody>
              </table>
              <div class="text-center" v-show="dataRows.length">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pager.currentPage"
                               :page-sizes="[10,20,50,100]" :page-size="pager.pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="pager.count">
                </el-pagination>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'1100px','padding':0}">
      <edit-form :formItem="form" :title="formTitle" :action="action" :actionType="showRight" @close="showRight=false"
                 @change="itemChange"></edit-form>
    </page-right>
    <page-right :show="showDepartmentRight" @right-close="resetRightBox">
      <department-form :formItem="departmentForm" :title="formTitle" :action="action" :actionType="showRight"
                       @close="showDepartmentRight=false"
                       @change="StorageBinChange"></department-form>
    </page-right>
  </div>

</template>
<script>
import {StorageBin} from '@/resources';
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
      storageBinSearch: false,
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
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
      },
      list: [
        {
          id: 1, name: 'A仓库',
          list: [
            {id: 1, name: 'A仓库A库区', status0: '0', status1: '0',},
            {id: 2, name: 'A仓库B库区', status0: '1', status1: '0',},
            {id: 3, name: 'A仓库C库区111', status0: '0', status1: '1',},
          ],
        },
        {
          id: 2, name: 'B仓库',
          list: [
            {id: 1, name: 'A仓库', status0: '0', status1: '0',},
            {id: 2, name: 'B仓库', status0: '0', status1: '0',},
          ],
        },
        {
          id: 3, name: 'C仓库',
          list: [
            {id: 1, name: 'A仓库', status0: '1', status1: '1',},
          ],
        },
      ],
      StorageBinPage: {
        currentPage: 1,
        count: 0,
        pageSize: 20
      },
      typeTxt: '',
      currentItem: {},
      activeName: 0
    };
  },
  mounted() {
    this.getStorageBinPage(1);
    this.showAllType(1);
  },
  computed: {
    bodyHeight: function () {
      let height = parseInt(this.$store.state.bodyHeight, 10);
      height = (height - 30) + 'px';
      return height;
    }
  },
  filters: {
    formatRole: function (list) {
      return list.map(m => m.title).join('，');
    }
  },
  watch: {
    'typeTxt': function () {
      this.getStorageBinPage(1);
    },
    filters: {
      handler: function () {
        this.showType(this.currentItem, 1);
      },
      deep: true
    }
  },
  methods: {
    getMore: function () {
      this.getStorageBinPage(this.StorageBinPage.currentPage + 1, true);
    },
    showAllType: function (pageNo) {
      this.currentItem = {};
      let data = {id: ''};
      this.getDetailPage(data, pageNo);
      this.showAll = true;
    },
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
      let nowTime = Date.now();
      this.nowTime = nowTime;
      StorageBin.getDetailPage(data).then(res => {
        if (this.nowTime > nowTime) return;
        this.dataRows = res.data.list;
        this.pager.count = res.data.count;
      });
    },
    scrollLoadingData(event) {
      this.$scrollLoadingData(event);
    },
    handleSizeChange(val) {
      window.localStorage.setItem('currentPageSize', val);
      if (this.showAll) {
        this.showAllType(1);
      } else if (!this.showAll && this.currentItem.id) {
        this.pager.pageSize = val;
        this.showType(this.currentItem, 1);
      }
    },
    handleCurrentChange(val) {
      if (this.showAll) {
        this.showAllType(val);
      } else if (!this.showAll && this.currentItem.id) {
        this.showType(this.currentItem, val);
      }
    },
    resetRightBox: function () {
      this.showRight = false;
      this.showDepartmentRight = false;
    },
    addType: function () {
      this.showTypeRight = true;
    },
    searchType: function () {
      this.storageBinSearch = !this.storageBinSearch;
    },
    getStorageBinPage: function (pageNo, isContinue = false) {
      this.StorageBinPage.currentPage = pageNo;
      let param = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize,
        keyWord: this.typeTxt
      });
      let nowTime = Date.now();
      this.nowLeftTime = nowTime;
      StorageBin.getPage(param).then(res => {
        if (param.keyWord !== this.typeTxt) return;
        if (this.nowLeftTime > nowTime) return;
        this.$store.commit('initBottomLoading', false);
        if (isContinue) {
          this.storageBinList = this.storageBinList.concat(res.data.list);
        } else {
          this.storageBinList = res.data.list;
          this.data = Object.assign({}, {'id': ''}, res.data.list[0]);
          this.dataRows = [];
          this.pager.count = 0;
          if (this.storageBinList.length) {
            this.showType(this.data, 1);
          }
        }
        this.StorageBinPage.totalPage = res.data.totalPage;
      });
      // this.queryStatusNum(param);
    },
    add: function () {
      this.action = 'add';
      this.form = Object.assign({}, this.currentItem);
      this.formTitle = '新增';
      this.showRight = true;
    },
    addStorageBin: function () {
      this.action = 'add';
      this.departmentForm = {};
      this.formTitle = '新增';
      this.showDepartmentRight = true;
    },
    editStorageBin: function (item) {
      this.action = 'edit';
      this.departmentForm = Object.assign({}, item);
      this.formTitle = '编辑';
      this.showDepartmentRight = true;
    },
    deleteStorageBin: function (item) {
      this.$confirm('删除仓库会一并删除仓库下的所有仓位信息,确认删除仓库"' + item.name + '"?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        StorageBin.delete(item.id).then(() => {
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '删除仓库成功'
          });
          this.getStorageBinPage(1);
        }).catch(error => {
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '删除仓库失败'
          });
        });
      }).catch(() => {

      });
    },
    deleteStorageBinDetail: function (item) {
      this.$confirm('确认删除仓位' + item.orgName + '?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        StorageBin.deleteDetail(item.detailId).then(() => {
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '删除仓位成功'
          });
          this.getDetailPage(item, this.pager.currentPage);
        }).catch(error => {
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '删除仓位失败'
          });
        });
      }).catch(() => {

      });
    },
    StorageBinChange: function () {
      this.getStorageBinPage(1);
      this.showDepartmentRight = false;
    },
    itemChange: function () {
      this.showType(this.currentItem, this.pager.currentPage);
      this.showRight = false;
    }
  }
};
</script>
