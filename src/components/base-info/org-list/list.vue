<style lang="scss" scoped="">


  .d-table-right {
    padding: 10px 20px;
    .org-name-h2 {
      font-size: 16px;
      font-weight: bold;
    }
  }
</style>
<template>
  <div>
    <div>
      <div class="order-list-status container">
        <div class="status-item" :class="{'active':key==activeStatus,'item-right':item.type===0} "
             v-for="(item,key) in orgStatus" @click="changeType(key,item)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{item.title}}<span
            class="status-num">{{item.num}}</span></div>
        </div>
      </div>
      <div class=" d-table">
        <div class="d-table-right">
          <h2>
            <span class="pull-right">
              <span class="btn-search-toggle open" v-show="showSearch">
                  <single-input v-model="filters.keyWord" placeholder="请输入关键字搜索" :showFocus="showSearch"></single-input>
                  <i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>
              </span>
              <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
                  <i class="el-icon-t-search"></i>
              </a>
              <perm label="tms-business-unit-add">
                 <a href="#" class="btn-circle" @click.stop.prevent="add">
                    <i class="el-icon-t-plus"></i>
                </a>
              </perm>
            </span>
            <h2 class="org-name-h2">
              {{menuTitle}}
              <el-dropdown @command="changeFinds" trigger="click">
                <span class="el-dropdown-link">
                  {{ kindsTitle }}<i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in kindsMenu" :command="item.key" :key="item.key">{{ item.title }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </h2>
          </h2>

          <div v-show="loadingData">
            <el-row>
              <el-col :span="24">
                <oms-loading :loading="loadingData"></oms-loading>
              </el-col>
            </el-row>
          </div>
          <div v-show="!loadingData&&dataRows.length !== 0">
            <table class="table table-hover">
              <thead>
              <tr>
                <th>系统代码</th>
                <th>{{ orgTitle }}名称</th>
                <th>{{ orgTitle }}级别</th>
                <th>{{ orgTitle }}分类</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="row in dataRows" class="org-list">
                <td>
                  {{row.manufacturerCode}}
                  <el-tag type="success" v-show="row.type === '0' && filters.type===1 ">货主</el-tag>
                </td>
                <td>
                  {{row.name}}
                </td>
                <td>
                  <dict :dict-group="'orgLevel'" :dict-key="row.level"></dict>
                </td>
                <td>
                  <span v-for="(relationType,index) in row.orgRelationTypeList">
                    <dict :dict-group="'orgRelationType'" :dict-key="relationType"></dict><span
                    v-if="(row.orgRelationTypeList.length-1)!==index">/</span>
                  </span>
                </td>
                <td>
                  <span v-show="row.deleteFlag">停用</span>
                  <span v-show="!row.deleteFlag">
                    <span v-if="row.auditDto.baseInfoStatus === '0'">
                      基础信息待审核
                    </span>
                    <span v-if="row.auditDto.financeStatus === '0'">
                      <li>财务信息待审核</li>
                    </span>
                    <span v-if="row.auditDto.warehouseStatus === '0'">
                      <li>仓库地址待审核</li>
                    </span>
                    <span
                      v-if="row.auditDto.baseInfoStatus === '1' && row.auditDto.financeStatus === '1' && row.auditDto.warehouseStatus === '1'&&!row.showAuditButton">
                      正常
                    </span>
                    <span
                      v-else-if="row.auditedStatus==='0'&&row.auditDto.status==='3'&&row.auditDto.baseInfoStatus === '1'&&row.auditDto.baseInfoStatus === '1'&&row.auditDto.baseInfoStatus === '1'">未激活</span>
                  </span>
                </td>
                <td>
                  <perm label="tms-business-unit-edit">
                    <a href="#" @click.prevent.stop="edit(row)" class="margin-left" v-show="!row.deleteFlag"><i
                      class="el-icon-t-edit"></i>编辑</a>
                  </perm>
                  <perm label="tms-business-unit-delete">
                    <a href="#" @click.prevent.stop="forbid(row)" class="margin-left" v-show="!row.deleteFlag"><i
                      class="el-icon-t-forbidden"></i>停用</a>
                    <a href="#" @click.prevent.stop="enableGoods(row)" class="margin-left" v-show="row.deleteFlag"><i
                      class="el-icon-t-start"></i>启用</a>
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
          <div v-show="!loadingData&&dataRows.length === 0" class="empty-info">
            暂无信息
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'800px','padding':0}">
      <base-form :formItem="form" :orgTitle="orgTitle" @close="showRight=false" :action="action" @change="onSubmit">
      </base-form>
    </page-right>
  </div>

</template>
<script>
  import {BaseInfo} from '@/resources';
  import baseForm from './form/form.vue';

  export default {
    components: {
      baseForm
    },
    data: function () {
      return {
        loadingData: true,
        showRight: false,
        showTypeRight: false,
        showTypeSearch: false,
        showSearch: false,
        data: {},
        dataRows: [],
        typeList: [],
        showTypeList: [],
        typeTxt: '',
        form: {
          address: '',
          adminAccount: '',
          adminEmail: '',
          adminId: '',
          adminName: '',
          adminTelephone: '',
          auditedBy: '',
          auditedStatus: '',
          auditedTime: '',
          contact: '',
          createTime: '',
          createdBy: '',
          creditCode: '',
          defaultCenter: '',
          defaultCentreId: '',
          deleteFlag: false,
          id: '',
          legalRepresentative: '',
          level: '',
          manufacturerCode: '',
          name: '',
          nameJc: '',
          namePhonetic: '',
          orgAuditStatus: '',
          phone: '',
          postcode: '',
          province: '',
          city: '',
          region: '',
          relationList: [],
          remarks: '',
          type: '',
          updateTime: ''
        },
        action: '',
        filters: {
          orgAuditStatus: 1,
          keyWord: this.typeTxt,
          type: this.$route.meta.type,
          deleteFlag: false,
          orgRelationType: '',
          otherAuditStatus: '1'
        },
        typePage: this.$route.path.substring(1),
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        orgStatus: [
          {'title': '待审核', 'num': '', 'type': 1, deleteFlag: false, 'orgAuditStatus': 0, 'otherAuditStatus': null},
          {'title': '正常', 'num': '', 'type': 1, deleteFlag: false, 'orgAuditStatus': 1, 'otherAuditStatus': '1'},
          {'title': '停用', 'num': '', 'type': 1, deleteFlag: true, 'otherAuditStatus': null},
          {'title': '部分待审核', 'num': '', 'type': 1, deleteFlag: false, 'orgAuditStatus': 1, 'otherAuditStatus': '0'}
        ],
        kindsTitle: '全部',
        activeStatus: 1,
        menuTitle: '',
        orgTitle: ''
      };
    },
    mounted() {
      this.getOrgPage(1);
      this.setMenuTitle(this.$route.meta.type);
    },
    watch: {
      typeTxt: function () {
        this.getOrgPage(1);
      },
      filters: {
        handler: function () {
          this.getOrgPage(1);
        },
        deep: true
      },
      '$route': function (val) {// 监听路由变化，改变查询参数
        this.filters.type = val.meta.type;
        this.typePage = val.path.substring(1);
        this.setMenuTitle(this.$route.meta.type);
      }
    },
    computed: {
      kindsMenu() {
        let typeList = this.$getDict('orgRelationType');
        let kindsMenu = [{title: '全部', key: ''}];
        if (typeList) {
          typeList.forEach(val => {
            kindsMenu.push({title: val.label, key: val.key});
          });
        }
        return kindsMenu;
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pager.pageSize = val;
        this.getOrgPage(1);
      },
      handleCurrentChange(val) {
        this.getOrgPage(val);
      },
      changeFinds: function (val) {
        this.filters.orgRelationType = val;
        this.kindsMenu.forEach(item => {
          if (val === item.key) {
            this.kindsTitle = item.title;
          }
        });
      },
      queryStatusNum: function (params) {
        BaseInfo.queryStateNum(params).then(res => {
          let data = res.data;
          this.orgStatus[0].num = data['auditing'];
          this.orgStatus[1].num = data['valid'];
          this.orgStatus[2].num = data['stop'];
          this.orgStatus[3].num = data['otherAuditCount'];
        });
      },
      getOrgPage: function (pageNo) {
        // 根据参数，获取单位信息
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        if (param.type === 1) {
          param.type = '';
        }
        this.loadingData = true;
        this.$http.get('/orgs/pager', {params: param}).then(res => {
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
        this.queryStatusNum(param);
      },
      resetRightBox: function () {
        this.showTypeRight = false;
        this.showRight = false;
      },
      addType: function () {
        this.showTypeRight = true;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      add: function () {
        this.action = 'add';
        this.form = {
          address: '',
          adminAccount: '',
          adminEmail: '',
          adminId: '',
          adminName: '',
          adminTelephone: '',
          auditedBy: '',
          auditedStatus: '',
          auditedTime: '',
          contact: '',
          createTime: '',
          createdBy: '',
          creditCode: '',
          defaultCenter: '',
          defaultCentreId: '',
          deleteFlag: false,
          id: '',
          legalRepresentative: '',
          level: '',
          manufacturerCode: '',
          name: '',
          nameJc: '',
          namePhonetic: '',
          orgAuditStatus: '',
          phone: '',
          postcode: '',
          province: '',
          city: '',
          region: '',
          relationList: [],
          remarks: '',
          type: '',
          updateTime: ''
        };
        this.showRight = true;
      },
      edit: function (item) {
        this.action = 'edit';
        this.showRight = true;
        BaseInfo.queryBaseInfo(item.id).then(res => {
          this.form = res.data.orgDto;
        });
      },
      setMenuTitle(type) {// 设置表格的标题
        if (type === 0) {
          this.menuTitle = '货主/厂商管理';
          this.orgTitle = '货主';
        } else {
          this.menuTitle = '业务单位管理';
          this.orgTitle = '单位';
        }
      },
      remove: function (item) {
        this.$confirm('确认删除' + item.name + '?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BaseInfo.delete(item.id).then(() => {
            // TODO:更新页面，删除该条数据
            this.$notify.success({
              title: '成功',
              message: '已成功删除单位' + item.name
            });
          });
        });
      },
      forbid: function (item) {// 禁用
        this.$confirm('确认停用 ' + item.name + ' ?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          item.deleteFlag = true;
          BaseInfo.update(item.id, item).then(() => {
            this.getOrgPage();
            this.$notify.success({
              title: '成功',
              message: '已经停用' + item.name
            });
          });
        });
      },
      enableGoods: function (item) {
        this.$confirm('确认启用 ' + item.name + ' ?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          item.deleteFlag = false;
          BaseInfo.update(item.id, item).then(() => {
            this.getOrgPage();
            this.$notify.success({
              title: '成功',
              message: '已成功启用' + item.name
            });
          });
        });
      },
      changeType: function (key, item) {// 根据当前选中的标签，重置状态等相关参数。
        this.activeStatus = key;
        this.filters.orgAuditStatus = item.orgAuditStatus !== null ? item.orgAuditStatus : null;
        this.filters.deleteFlag = item.deleteFlag;
        this.filters.otherAuditStatus = item.otherAuditStatus;
      },
      onSubmit() {
          this.getOrgPage(1);
          this.showRight = false;
      }
    }
  };
</script>
