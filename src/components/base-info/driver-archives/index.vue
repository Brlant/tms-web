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
                        <div :class="{ 'active': key === activeStatus }" class="status-item" v-show="key < 2"
                            v-for="(item, key) in orgStatus" @click="changeType(key, item)">
                            <div class="status-bg" :class="['b_color_' + key]"></div>
                            <div><i class="el-icon-caret-right" v-if="key === activeStatus"></i>{{ item.title }}<span
                                    class="status-num">{{ item.num }}</span></div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="order-list-status  order-list-status-right">
                        <div :class="{ 'active': key === activeStatus }" class="status-item" v-show="key >= 2"
                            v-for="(item, key) in orgStatus" @click="changeType(key, item)">
                            <div class="status-bg" :class="['b_color_' + key]"></div>
                            <div><i class="el-icon-caret-right" v-if="key === activeStatus"></i>{{ item.title }}<span
                                    class="status-num">{{ item.num }}</span></div>
                        </div>
                    </div>
                </el-col>
            </el-row>

            <div class="container d-table">
                <div class="d-table-right">
                    <h2>
                        <span class="pull-right">
                            <span class="btn-search-toggle open" v-show="showSearch">
                                <single-input v-model="filters.keyWord" placeholder="请输入关键字搜索"
                                    :showFocus="showSearch"></single-input>
                                <i class="el-icon-t-search" @click.stop="showSearch = (!showSearch)"></i>
                            </span>
                            <des-btn @click="showSearch = (!showSearch)" icon="search" v-show="!showSearch" />
                            <perm label="driver-info-add">
                                <des-btn @click="add" icon="plus" />
                            </perm>
                        </span>
                        <h2 class="org-name-h2">
                            {{ menuTitle }}
                            <el-dropdown @command="changeFinds" trigger="click" style="margin-right:5px">
                                <span class="el-dropdown-link">
                                    {{ kindsTitle }}<i class="el-icon-caret-bottom el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-for="item in kindsMenu" :command="item.key" :key="item.key">{{
                                        item.title }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <!-- 导入导出 -->
                            <span>
                                <!-- <el-button type="primary" style="margin-right:8px" @click="importFile">导入</el-button> -->
                                <!-- <template slot="pre-btn"> -->
                                <perm label="driver-info-import">
                                    <el-dropdown type="primary" style="margin-right:8px">
                                        <el-button plain size="small">
                                            导入司机档案信息<i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item>
                                                <el-upload ref="driver-info" action="/api/driver-info/import"
                                                    :on-success="uploadLogisticsSuccess" :on-error="uploadLogisticsError"
                                                    :show-file-list="false">导入（司机档案）信息
                                                </el-upload>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <el-link href="/api/driver-info/download-driver"
                                                    :underline="false">下载（司机档案）模板</el-link>
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </perm>
                                <!-- </template> -->
                                <perm label="driver-info-export">
                                    <el-button type="primary" style="margin-right:8px" @click="exportFile">导出</el-button>
                                </perm>

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
                    <div v-show="!loadingData && dataRows.length !== 0">
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
                                        {{ row.driverName }}
                                    </td>
                                    <td>
                                        {{ row.carrierName }}
                                    </td>
                                    <td>
                                        <dict :dict-group="'driverType'" :dict-key="'' + row.driverType"></dict>
                                    </td>
                                    <td>
                                        {{ row.driverPhone }}
                                    </td>
                                    <td>
                                        {{ row.licenceEndDate | date }}
                                    </td>
                                    <td>
                                        <span v-for="(item, index) in orgStatus">
                                            <span v-if="row.driverStatus == item.status">{{ item.title }}</span>
                                        </span>
                                    </td>
                                    <td>
                                        <perm label="driver-info-edit">
                                            <des-btn @click="edit(row)" icon="edit">编辑</des-btn>
                                        </perm>
                                        <perm label="driver-info-stop">
                                            <des-btn @click="forbid(row)" icon="forbidden"
                                                v-show="row.driverStatus === 1 || row.driverStatus === 2 || row.driverStatus === 3">停用
                                            </des-btn>
                                            <des-btn @click="enableGoods(row)" icon="start"
                                                v-show="row.driverStatus === 0">启用
                                            </des-btn>
                                        </perm>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="text-center" v-show="dataRows.length">
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                :current-page="pager.currentPage" :page-size="20" :page-sizes="[20, 50, 100]"
                                layout="sizes, prev, pager, next, jumper" :total="pager.count">
                            </el-pagination>
                        </div>
                    </div>
                    <div v-show="!loadingData && dataRows.length === 0" class="empty-info">
                        暂无信息
                    </div>
                </div>
            </div>
        </div>
        <page-right :show="showRight" @right-close="resetRightBox" :css="{ 'width': '800px', 'padding': 0 }">
            <base-form :formItem="form" :title="title" @close="showRight = false" :action="action" @change="onSubmit">
            </base-form>
        </page-right>
        <page-right :css="{ 'width': '800px', 'padding': 0 }" :show="showDetailRight" @right-close="resetRightBox">
            <detail :data="form" :show="showDetailRight" @close="showDetailRight = false" @change="onSubmit" />
        </page-right>
    </div>
</template>
<script>
import { BaseInfo } from '@/resources';
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
                jobNumber: '',
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
                driverStatus: 1,
                driverType: '',
                keyWord: '',
            },
            pager: {
                currentPage: 1,
                count: 0,
                pageSize: 20
            },
            orgStatus: [
                //   {'title': '待审核', 'num': '', 'type': 1, deleteFlag: false, 'orgAuditStatus': 0},
                { 'title': '正常', 'num': '', status: 1, deleteFlag: false, },
                { 'title': '停用', 'num': '', status: 0, deleteFlag: true, },
                { 'title': '即将超期', 'num': '', status: 3, deleteFlag: true },
                { 'title': '异常', 'num': '', status: 2, deleteFlag: true },
            ],
            title: '添加',
            kindsTitle: '全部',
            activeStatus: 0,
            menuTitle: '司机档案',
        };
    },
    mounted() {
        this.getOrgPage(1);
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
            let kindsMenu = [{ title: '全部', key: '' }];
            if (typeList) {
                typeList.forEach(val => {
                    kindsMenu.push({ title: val.label, key: val.key });
                });
            }
            return kindsMenu;
        }
    },
    methods: {
        // 导入
        importFile() {

        },
        exportFile: function () {
            let params = Object.assign({}, this.filters);
            let moduleId = '/driver-info';
            let fileName = '司机档案';
            this.$store.commit('initPrint', {
                isPrinting: true,
                moduleId: moduleId
            });
            this.$http.post('/driver-info/export', params).then(res => {
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
                    message: error.response && error.response.data && error.response.data.msg || '导出失败'
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
            this.filters.driverType = val;
            this.kindsMenu.forEach(item => {
                if (val === item.key) {
                    this.kindsTitle = item.title;
                }
            });
        },
        queryStatusNum: function (param, nowTime) {
            this.$http.get('/driver-info/count', { params: param }).then(res => {
                if (this.nowTime > nowTime) return;
                let data = res.data;
                this.orgStatus[0].num = data['normal'];
                this.orgStatus[1].num = data['stop'];
                this.orgStatus[2].num = data['overdue'];
                this.orgStatus[3].num = data['abnormal'];
            });
        },
        getOrgPage: function (pageNo) {
            // 根据参数，获取单位信息
            this.pager.currentPage = pageNo;
            let param = Object.assign({}, {
                pageNo: pageNo,
                pageSize: this.pager.pageSize
            }, this.filters);
            this.loadingData = true;
            this.nowTime = Date.now();
            let nowTime = this.nowTime;
            this.$http.get('/driver-info', { params: param }).then(res => {
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
                jobNumber: '',
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
            this.action = 'edit';
            this.title = '编辑'
            this.showRight = true;
            this.form = Object.assign({}, item);
        },
        //   详情
        showItem(item) {
            this.form = Object.assign({}, item);
            this.showDetailRight = true;
        },
        forbid: function (item) {// 禁用
            this.$confirm('确认停用?', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let obj = {
                    ...item,
                    enable:0,
                }
                this.$http.post('/driver-info/startAndStop', obj).then(() => {
                    this.getOrgPage(1);
                    this.$notify.success({
                        title: '成功',
                        message: '停用成功'
                    });
                })
            });
        },
        enableGoods: function (item) {
            this.$confirm('确认启用?', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let obj = {
                    ...item,
                    enable: 1,
                }
                this.$http.post('/driver-info/startAndStop', obj).then(() => {
                    this.getOrgPage(1);
                    this.$notify.success({
                        title: '成功',
                        message: '启用成功'
                    });
                });
            });
        },
        changeType: function (key, item) {// 根据当前选中的标签，重置状态等相关参数。
            this.activeStatus = key;
            this.filters.driverStatus = item.status;
            // this.activeStatus = key;
            // this.filters.orgAuditStatus = item.orgAuditStatus !== null ? item.orgAuditStatus : null;
            // this.filters.deleteFlag = item.deleteFlag;
            // this.filters.otherAuditStatus = item.otherAuditStatus;
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
