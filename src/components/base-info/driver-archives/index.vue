<style lang="scss" scoped>


  .d-table-right {
    padding: 10px 20px;

    .org-name-h2 {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .order-list-status-right {
    justify-content: flex-end;
    }
  .org-list {
    cursor: pointer
  }
</style>
<template>
  <div>
    <div>
        <el-row>
            <el-col :span="16">
                <div class="order-list-status">
                    <div :class="{'active':key===activeStatus} " class="status-item" v-show="key < 2"
                        v-for="(item,key) in orgStatus"  @click="changeType(key,item)">
                    <div class="status-bg" :class="['b_color_'+key]"></div>
                    <div><i class="el-icon-caret-right" v-if="key===activeStatus"></i>{{item.title}}<span
                        class="status-num">{{item.num}}</span></div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="order-list-status  order-list-status-right">
                    <div :class="{'active':key===activeStatus} " class="status-item" v-show="key >= 2"
                        v-for="(item,key) in orgStatus"  @click="changeType(key,item)">
                    <div class="status-bg" :class="['b_color_'+key]"></div>
                    <div><i class="el-icon-caret-right" v-if="key===activeStatus"></i>{{item.title}}<span
                        class="status-num">{{item.num}}</span></div>
                    </div>
                </div>
            </el-col>
        </el-row>
      
      <div class="container d-table">
        <div class="d-table-right">
          <h2>
            <span class="pull-right">
              <span class="btn-search-toggle open" v-show="showSearch">
                  <single-input v-model="filters.keyWord" placeholder="请输入关键字搜索" :showFocus="showSearch"></single-input>
                  <i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>
              </span>
              <des-btn @click="showSearch=(!showSearch)" icon="search" v-show="!showSearch"/>
              <perm label="tms-business-unit-add">
                <des-btn @click="add" icon="plus"/>
              </perm>
            </span>
            <h2 class="org-name-h2">
              {{menuTitle}}
              <el-dropdown @command="changeFinds" trigger="click" style="margin-right:5px">
                <span class="el-dropdown-link">
                  {{ kindsTitle }}<i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in kindsMenu" :command="item.key" :key="item.key">{{ item.title }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- 导入导出 -->
              <span>
                    <!-- <el-button type="primary" style="margin-right:8px" @click="importFile">导入</el-button> -->
                    <!-- <template slot="pre-btn"> -->
                        <el-dropdown type="primary" style="margin-right:8px">
                            <el-button plain size="small">
                                导入物流信息<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                <el-upload
                                    ref="upload-logistics"
                                    action="/api/logistics/import-logistics"
                                    :on-success="uploadLogisticsSuccess"
                                    :on-error="uploadLogisticsError"
                                    :show-file-list="false"
                                >导入物流（文字版）信息
                                </el-upload>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                <el-link href="/api/tms-waybill/download-tmslogistics" :underline="false">下载物流（文字版）模板</el-link>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    <!-- </template> -->
                    <el-button style="margin-right:8px" @click="exportFile">导出</el-button>
                </span>
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
                <th>司机名称</th>
                <th>所属单位</th>
                <!--<th>{{ orgTitle }}级别</th>-->
                <th>分类</th>
                <th>手机号码</th>
                <th>驾驶证有效期</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr :key="row.id" @click="showItem(row)" class="org-list" v-for="row in dataRows">
                <td>
                  {{row.driverName}}
                </td>
                <td>
                  {{row.carrierName}}
                </td>
                <td>
                  <dict :dict-group="'driverType'" :dict-key="driverType"></dict>
                </td>
                <td>
                  {{row.driverPhone}}
                </td>
                <td>
                  {{row.licenceEndDate | time}}
                </td>
                <td>
                  <span v-for="(item,index) in orgStatus">
                    <span v-if="row.driverStatus == item.status">{{item.title}}</span>
                  </span>
                </td>
                <td>
                  <perm label="tms-business-unit-edit">
                    <des-btn @click="edit(row)" icon="edit">编辑</des-btn>
                  </perm>
                  <perm label="tms-business-unit-edit">
                    <des-btn @click="forbid(row)" icon="forbidden"
                             v-show="!row.deleteFlag">停用
                    </des-btn>
                    <des-btn @click="enableGoods(row)" icon="start"
                             v-show="row.deleteFlag">启用
                    </des-btn>
                  </perm>
                </td>
              </tr>
              </tbody>
            </table>

            <div class="text-center" v-show="dataRows.length">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                             :current-page="pager.currentPage"
                             :page-size="20" :page-sizes="[20,50,100]" layout="sizes, prev, pager, next, jumper"
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
      <base-form :formItem="form"  @close="showRight=false" :action="action" @change="onSubmit">
      </base-form>
    </page-right>
    <page-right :css="{'width':'800px','padding':0}" :show="showDetailRight" @right-close="resetRightBox">
      <detail :data="form" :show="showDetailRight" @close="showDetailRight=false" @change="onSubmit"/>
    </page-right>
  </div>

</template>
<script>
import {BaseInfo} from '@/resources';
import baseForm from './form.vue';
import utils from '@/tools/utils';
import Detail from './detail';

export default {
    components: {
      baseForm,
      Detail
    },
    data: function () {
      return {
        loadingData: true,
        showRight: false,
        showDetailRight: false,
        showSearch: false,
        // data: {},
        dataRows: [],
        typeTxt: '',
        form: {
          driverId: '',
          driverName: '',
          carrierId: '',
          carrierName: '',
          driverType: '',
          driverPhone: '',
          driverIdentity: '',
          licenceEndDate: '',
          professionEndDate: '',
          healthEndDate: '',
          driverStatus: '',
        },
        action: '',
        filters: {
          orgAuditStatus: 1,
          keyWord: this.typeTxt,
          type: '',
          deleteFlag: false,
          orgRelationType: ''
        },
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        orgStatus: [
        //   {'title': '待审核', 'num': '', 'type': 1, deleteFlag: false, 'orgAuditStatus': 0},
          {'title': '正常', 'num': '',status:1,  deleteFlag: false, 'orgAuditStatus': 0},
          {'title': '停用', 'num': '',status:0,  deleteFlag: true,'orgAuditStatus': 1},
          {'title': '即将超期', 'num': '', status:3, deleteFlag: true},
          {'title': '异常', 'num': '', status:2, deleteFlag: true},
        ],
        title:'添加',
        kindsTitle: '全部',
        activeStatus: 0,
        menuTitle: '司机档案',
        // orgTitle: '单位'
      };
    },
    mounted() {
      this.getOrgPage(1);
    //   this.setMenuTitle(this.$route.meta.type);
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
      }
    },
    computed: {
      kindsMenu() {
        let typeList = this.$getDict('driverType');
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
        // 导入
        importFile(){

        },
      exportFile: function () {
        let params = Object.assign({}, this.filters);
        let moduleId = this.$route.meta.type === 0 ? '/supplier' : '/org';
        let fileName = this.$route.meta.type === 0 ? '货主表' : '业务单位表';
        this.$store.commit('initPrint', {
          isPrinting: true,
          moduleId: moduleId
        });
        // 如果是业务单位将类型字段置空
        if (this.$route.meta.type === 1) {
          params.type = '';
        }
        this.$http.get('/orgs/export', {params}).then(res => {
          utils.download(res.data.path, fileName);
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: moduleId
          });
        }).catch(error => {
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: moduleId
          });
          this.$notify.error({
            message: error.response&&error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
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
      queryStatusNum: function (params, nowTime) {
        BaseInfo.queryStateNum(params).then(res => {
          if (this.nowTime > nowTime) return;
          let data = res.data;
          this.orgStatus[0].num = data['auditing'];
          this.orgStatus[1].num = data['valid'];
          this.orgStatus[2].num = data['stop'];
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
        this.nowTime = Date.now();
        let nowTime = this.nowTime;
        this.$http.get('/orgs/pager', {params: param}).then(res => {
          if (this.nowTime > nowTime) return;
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
        this.queryStatusNum(param, nowTime);
      },
      resetRightBox: function () {
        this.showRight = false;
        this.showDetailRight = false;
      },
      add: function () {
        this.action = 'add';
        this.title = '添加'
        this.form = {
          driverId: '',
          driverName: '',
          carrierId: '',
          carrierName: '',
          driverType: '',
          driverPhone: '',
          driverIdentity: '',
          licenceEndDate: '',
          professionEndDate: '',
          healthEndDate: '',
          driverStatus: '',
        };
        this.showRight = true;
      },
      edit: function (item) {
        BaseInfo.queryBaseInfo(item.id).then(res => {
        //   res.data.orgDto.auditDto = item.auditDto;
          this.form = res.data.orgDto;
          this.action = 'edit';
          this.title = '编辑'
          this.showRight = true;
        });
      },
    //   详情
      showItem(item) {
        BaseInfo.queryBaseInfo(item.id).then(res => {
          res.data.orgDto.auditDto = item.auditDto;
          this.form = res.data.orgDto;
          this.showDetailRight = true;
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
        // this.activeStatus = key;
        // this.filters.status = item.status;
        this.activeStatus = key;
        this.filters.orgAuditStatus = item.orgAuditStatus !== null ? item.orgAuditStatus : null;
        this.filters.deleteFlag = item.deleteFlag;
        this.filters.otherAuditStatus = item.otherAuditStatus;
      },
      onSubmit() {
        this.getOrgPage(1);
        this.resetRightBox();
      },
      uploadLogisticsSuccess(response, file, fileList) {
        console.log(response, file, fileList);
        this.$message.success("导入成功！")
      },
      uploadLogisticsError(response, file, fileList) {
        console.error(response, file, fileList);
        this.$message.success("导入失败！")
      }
    }
  };
</script>
