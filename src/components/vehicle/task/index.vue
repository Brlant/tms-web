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
    <search-part @search="searchResult" ref="search">
      <template slot="btn">
        <perm label="tms-task-car-task-cancel">
          <el-button plain size="small" @click="batchCancel" v-if="activeStatus==='0'">
            <f-a class="icon-small" name="forbidden"></f-a>
            批量取消
          </el-button>
        </perm>
        <!--<perm label="tms-task-prepare-export">-->
          <!--<el-button plain size="small" @click="exportPreFile" :disabled="isLoading" v-if="activeStatus==='0'">-->
            <!--<f-a class="icon-small" name="print"></f-a>-->
            <!--导出预派车任务-->
          <!--</el-button>-->
        <!--</perm>-->
        <perm label="tms-task-prepare-print">
          <el-button plain size="small" @click="printPreFile" :disabled="isLoading" v-if="activeStatus==='0'">
            <f-a class="icon-small" name="print"></f-a>
            打印预派车任务
          </el-button>
        </perm>
        <!--        <perm label="tms-task-car-task-export-detail">-->
        <!--          <el-button :disabled="isLoading" @click="exportOrderFile" plain size="small">-->
        <!--            <f-a class="icon-small" name="print"></f-a>-->
        <!--            导出运单统计明细-->
        <!--          </el-button>-->
        <!--        </perm>-->
        <perm label="tms-task-car-task-export">
          <el-button plain size="small" @click="exportFile" :disabled="isLoading">
            <f-a class="icon-small" name="print"></f-a>
            导出出车任务
          </el-button>
        </perm>
        <perm label="tms-task-car-task-print">
          <el-button plain size="small" @click="printFile" :disabled="isLoading">
            <f-a class="icon-small" name="print"></f-a>
            打印出车任务
          </el-button>
        </perm>
        <perm label="tms-task-car-task-query">
          <el-button plain size="small" @click="showMultipleMap" :disabled="isLoading">
            <f-a class="icon-small" name="search"></f-a>
            合并查看地图
          </el-button>
        </perm>
      </template>
    </search-part>

    <status-list :activeStatus="activeStatus" :statusList="orderType" :checkStatus="checkStatus">
      <span class="btn-group-right">
      </span>
    </status-list>

    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="4">
          <el-checkbox @change="checkAll" v-model="isCheckAll"></el-checkbox>
          任务号
        </el-col>
        <!--<el-col :span="2">任务类型</el-col>-->
        <el-col :span="2">任务状态</el-col>
        <el-col :span="2">负责人</el-col>
        <el-col :span="3">车牌号/司机</el-col>
        <el-col :span="1">包件数</el-col>
        <el-col :span="2">整散件总数</el-col>
        <el-col :span="3">载重/容积</el-col>
        <el-col :span="4">时间</el-col>
        <el-col :span="3">操作</el-col>
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
      <div v-else class="order-list-body flex-list-dom">
        <div class="order-list-item" v-for="item in dataList" @click="checkItem(item)"
             :class="[formatRowClass(item.status, orderType) ,{'active':currentItemId===item.id}]">
          <el-row>
            <el-col :span="4" class="special-col R">
              <div class="el-checkbox-warp" @click.stop.prevent="checkItem(item)">
                <el-checkbox v-model="item.isChecked"></el-checkbox>
              </div>
              <div>
                {{item.transportTaskNo}}
              </div>
            </el-col>
            <!--<el-col :span="2" class="R">-->
            <!--<div>-->
            <!--<dict :dict-group="'deliveryTaskType'" :dict-key="item.type"></dict>-->
            <!--</div>-->
            <!--</el-col>-->
            <el-col :span="2" class="R">
              <div>
                {{formatStatusTitle(item.status, orderType)}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{item.headName}}
              </div>
            </el-col>
            <el-col :span="3" class="R">
              <div>
                {{item.carPlateNumber}}
                <el-tooltip class="item" effect="dark"
                            :content="item.latestCarDataTime?formatTime(item.latestCarDataTime):'无时间数据'"
                            placement="right-start">
                  <el-tag v-if="item.status==='2'&&isOverTime(item.latestCarDataTime)" type="danger">离线</el-tag>
                  <el-tag v-if="item.status==='2'&&!isOverTime(item.latestCarDataTime)" type="success">在线</el-tag>
                </el-tooltip>
              </div>
              <div>
                {{item.driverName}}
              </div>
            </el-col>
            <el-col :span="1" class="R">
              <div>
                {{item.incubatorCount}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{item.totalCount}}
              </div>
            </el-col>
            <el-col :span="3" class="R">
              <div>{{item.carLoadBearing}} kg</div>
              <div>{{item.carVolume}} m³</div>
            </el-col>
            <el-col :span="4" class="R">
              <div>
                <span>[创建] </span>
                {{item.createTime|time}}
              </div>
              <div v-show="item.taskStartTime">
                <span>[始] </span>
                {{item.taskStartTime|time}}
              </div>
              <div v-show="item.taskEndTime">
                <span>[终] </span>
                {{item.taskEndTime|time}}
              </div>
            </el-col>
            <el-col :span="3" class="opera-btn">
              <div>
                <div>
                  <span @click.stop="showInfo(item)" v-if="item.status==='3'||item.status==='4'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-search"></i>
                      </a>查看
                    </span>
                </div>
                <div>
                  <perm label="tms-task-car-task-detail-sort" class="opera-btn btn-line-block">
                    <span @click.stop="showAdjustment(item)">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-sort"></i>
                      </a>调整明细顺序
                    </span>
                  </perm>
                </div>
                <div v-if="item.status==='1'||item.status==='2'">
                  <span @click.stop="showInfo(item)" class="btn-line-block" v-if="item.status==='1'||item.status==='2'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-search"></i>
                      </a>查看
                    </span>
                  <perm label="tms-task-car-task-cancel" class="opera-btn btn-line-block">
                    <span @click.stop="cancelTask(item)" v-if="item.status==='1'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-forbidden"></i>
                      </a>取消
                    </span>
                  </perm>
                  <perm label="tms-task-car-task-edit" class="btn-line-block">
                    <span @click.stop="editInfo(item)" v-if="item.status==='1'||item.status==='2'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-edit"></i>
                      </a>编辑
                    </span>
                  </perm>
                  <perm label="tms-task-car-task-start" class="btn-line-block">
                    <span @click.stop="startTransport(item)" v-if="item.status==='1'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-start"></i>
                      </a>启运
                    </span>
                  </perm>
                </div>
                <div v-if="item.status==='0'">
                  <perm label="tms-task-car-task-confirm" class="opera-btn btn-line-block">
                    <span @click.stop="confirmTask(item)" v-if="item.status==='0'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-delete"></i>
                      </a>确认派送
                    </span>
                  </perm>
                  <span @click.stop="showInfo(item)" v-if="item.status==='0'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-search"></i>
                      </a>查看
                    </span>
                </div>
                <div style="padding-top: 2px" v-if="item.status==='0'">
                  <perm label="tms-task-car-task-edit" class="btn-line-block">
                    <span @click.stop="editInfo(item)" v-if="item.status==='0'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-edit"></i>
                      </a>编辑
                    </span>
                  </perm>
                  <perm label="tms-task-car-task-cancel" class="opera-btn btn-line-block">
                    <span @click.stop="cancelTask(item)" v-if="item.status==='0'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-forbidden"></i>
                      </a>取消
                    </span>
                  </perm>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="order-list-item-bg"></div>
        </div>
      </div>
      <el-row class="order-list-header" v-show="dataList.length && !loadingData">
        <el-col :span="11" align="left">合计</el-col>
        <el-col :span="1">{{totalCount.incubatorCount}}</el-col>
        <el-col :span="1">{{totalCount.totalCount}}</el-col>
        <el-col :span="11"></el-col>
      </el-row>
    </div>
    <div class="text-center" v-show="dataList.length && !loadingData">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pager.currentPage"
                     :page-sizes="[10,20,50,100]" :page-size="pager.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="pager.count">
      </el-pagination>
    </div>

    <page-right :show="showAdjustmentIndex === 0" @right-close="resetRightBox" :css="{'width':'90%','padding':0}">
      <component :is="currentAdjustPart" :formItem="form" @right-close="resetRightBox"/>
    </page-right>
    <page-right :show="showIndex === 0" @right-close="resetRightBox" :css="{'width':'90%','padding':0}">
      <component :is="currentPart" :formItem="form" :isOverTime="isOverTime" :showBigMap="showBigMap" :showBigMapWaybill = showBigMapWaybill
                 @right-close="resetRightBox"/>
    </page-right>
    <page-right :show="showEditIndex === 0" @right-close="resetRightBox" :css="{'width':'90%','padding':0}">
      <component :is="currentEditPart" :formItem="form" @change="submit" @right-close="resetRightBox"/>
    </page-right>
    <el-dialog :title="'任务号: ' + mapBigFormItem.transportTaskNo" :visible.sync="isShowBigMap" width="100%"
               :fullscreen="true"
               custom-class="custom-dialog-map">
      <task-map mapRef="bigTaskMap" :formItem="mapBigFormItem" vid="mapTaskBigPath"
                :mapStyle="{height: bodyHeight}" showPoint></task-map>
    </el-dialog>
    <el-dialog :title="'运单号: ' + mapBigWaybillFormItem.waybillNumber" :visible.sync="isShowBigMapWaybill" width="100%"
               :fullscreen="true"
               custom-class="custom-dialog-map">
      <waybill-map mapRef="bigWaybillMap" :wayBillItem="mapBigWaybillFormItem"  vid="mapWaybillBigPath"
                :mapStyle="{height: bodyHeight}" showPoint ></waybill-map>
    </el-dialog>
    <el-dialog title="地图派送" :visible.sync="isShowMulBigMap" width="100%" :fullscreen="true"
               custom-class="custom-dialog-map">
      <map-multiple :waybillList="multipleWaybillList" :taskIdList="taskIdList"
                    :mapStyle="{height: bodyHeight}" :isShowBigMap="isShowMulBigMap"
                    v-show="isShowMulBigMap"></map-multiple>
    </el-dialog>
  </div>
</template>
<script>
import utils from '@/tools/utils';
import SearchPart from './search';
import {http, TransportTask} from '@/resources';
import showForm from './form/show-form';
import adjustmentForm from './form/adjustment-form';
import StatusMixin from '@/mixins/statusMixin';
import editForm from './form/edit-form';
import Perm from '../../common/perm';
import TaskMap from './form/map-car-task';
import WaybillMap from './form/map-car-waybill';
import MapMultiple from './form/map-multiple';
import moment from 'moment';

export default {
    components: {
      Perm,
      SearchPart,
      TaskMap,
      MapMultiple,
      WaybillMap,
      adjustmentForm
    },
    mixins: [StatusMixin],
    data() {
      return {
        isLoading: false,
        loadingData: false,
        activeStatus: '0',
        orderType: utils.carTaskType,
        dataList: [],
        showIndex: -1,
        showAdjustmentIndex:-1,
        showEditIndex: -1,
        dialogComponents: {
          0: showForm
        },
        dialogAdjustmentComponents: {
          0: adjustmentForm
        },
        dialogEditComponents: {
          0: editForm
        },
        currentPart: null,
        currentAdjustPart:null,
        currentEditPart: null,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10,
          totalPage: 1
        },
        action: '',
        form: {},
        filters: {
          status: '0',
          transportTaskNo: '',
          type: '',
          carPlateNumber: '',
          waybillNo: '',
          tmsOrderNumber:'',
          faceSheetNo:'',
          createStartTime: '',
          createEndTime: '',
          sStartTime: '',
          sEndTime: '',
          eStartTime: '',
          eEndTime: '',
          headName: '',
          driverName: ''
        },
        isCheckAll: false,
        checkList: [],
        checkListPara: [],
        shoWayBillPart: false,
        currentItemId: '',
        taskIdList: [],
        isShowBigMap: false,
        isShowBigMapWaybill: false,
        isShowMulBigMap: false,
        mapBigFormItem: {},
        mapBigWaybillFormItem: {},
        multipleWaybillList: []
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return (height + 146) + 'px';
      },
      totalCount() {
        let total = {
          incubatorCount: 0,
          totalCount: 0
        };
        this.dataList.forEach(i => {
          total.incubatorCount += i.incubatorCount;
          total.totalCount += i.totalCount;
        });
        return total;
      }
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
      let id = this.$route.params.id;
      if (id !== 'list' && id !== ':id') {
        this.showInfo({id});
      } else {
        this.$router.push('/vehicle/delivery/task/list');
      }
    },
    methods: {
      startTransport: function (item) {
        this.$confirm('确认启运任务"' + item.transportTaskNo + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TransportTask.startTransport(item.id).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '启运任务"' + item.transportTaskNo + '成功"'
            });
            this.getTransportTaskPage(1);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.data.msg || '启运任务失败'
            });
          });
        }).catch(() => {

        });
      },
      formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
        return time ? moment(time).format(str) : '';
      },
      isOverTime: function (time) {
        if (time) {
          let now = new Date();
          let over = now.getTime() - time;
          if (over < 1000 * 60 * 10) {
            return false;
          }
        }
        return true;
      },
      batchCancel: function () {
        if (!this.taskIdList.length) {
          this.$notify.warning({
            duration: 2000,
            message: '请勾选需要取消的出车任务'
          });
          return;
        }
        this.$confirm('确认取消勾选的出车任务?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TransportTask.batchCancel({idList: this.taskIdList}).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '批量取消出车任务成功'
            });
            this.getTransportTaskPage(1);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.data.msg || '批量取消出车任务失败'
            });
          });
        }).catch(() => {

        });
      },
      showMultipleMap() {
        if (!this.taskIdList.length) {
          this.$notify.warning({
            duration: 2000,
            message: '请勾选需要导出的出车任务'
          });
          return;
        }
        this.multipleWaybillList = [];
        this.taskIdList.forEach(i => {
          TransportTask.getOneTransportTask(i).then(res => {
            this.multipleWaybillList.push({
              no: res.data.carPlateNumber,
              list: res.data.waybillList
            });
          });
        });
        this.isShowMulBigMap = true;
      },
      showBigMap(formItem) {
        this.mapBigFormItem = {};
        this.isShowBigMap = true;
        this.$nextTick(() => {
          setTimeout(() => {
            this.mapBigFormItem = formItem;
          }, 300);
        });
      }, 
      showBigMapWaybill(formItem){
        this.mapBigWaybillFormItem = {};
        this.isShowBigMapWaybill = true;
        this.$nextTick(() => {
          setTimeout(() => {
            this.mapBigWaybillFormItem = formItem;
          }, 300);
        });
      },     
      printPreFile() {
        if (!this.taskIdList.length) {
          this.$notify.warning({
            duration: 2000,
            message: '请勾选需要打印的出车任务'
          });
          return;
        }
        let obj = {
          taskList: this.taskIdList
        };
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true});
        http.post('transport-task/export/confirm-task', obj).then(res => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false});
          // 清空列表
          this.taskIdList = [];
          this.checkList = [];
          // 清空勾选
          this.dataList.forEach(val => {
            val.isChecked = false;
          });
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false});
          this.$notify.error({
            message: error.response&&error.response.data && error.response.data.msg || '打印预派车任务失败'
          });
        });
      },
      printFile() {
        if (!this.taskIdList.length) {
          this.$notify.warning({
            duration: 2000,
            message: '请勾选需要打印的出车任务'
          });
          return;
        }
        let obj = {
          taskList: this.taskIdList
        };
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true});
        http.post('transport-task/print/task-info', obj).then(res => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false});
          utils.printLocation(this, {'type': 'transport_task', 'path': res.data.url});
          // 清空列表
          this.taskIdList = [];
          this.checkList = [];
          // 清空勾选
          this.dataList.forEach(val => {
            val.isChecked = false;
          });
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false});
          this.$notify.error({
            message: error.response&&error.response.data && error.response.data.msg || '打印标签失败'
          });
        });
      },
      exportPreFile() {
        if (!this.taskIdList.length) {
          this.$notify.warning({
            duration: 2000,
            message: '请勾选需要导出的出车任务'
          });
          return;
        }
        this.isLoading = true;
        this.$store.commit('initPrint', {
          isPrinting: true,
          moduleId: '/vehicle/delivery/task'
        });
        let params = Object.assign({}, {taskList: this.taskIdList});
        http.post('transport-task/export/confirm-task', params).then(res => {
          utils.download(res.data.url, '预派车任务表');
          this.isLoading = false;
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/vehicle/delivery/task'
          });
          // 清空列表
          this.taskIdList = [];
          this.checkList = [];
          // 清空勾选
          this.dataList.forEach(val => {
            val.isChecked = false;
          });
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/vehicle/delivery/task'
          });
          this.$notify.error({
            message: error.response&&error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      exportOrderFile() {
        this.isLoading = true;
        this.$refs.search.search();
        this.$nextTick(() => {
          this.$store.commit('initPrint', {isPrinting: true, moduleId: '/vehicle/delivery/task', text: '正在导出'});
          let params = Object.assign({}, this.filters);
          params.createStartTime = params.createStartTime ? this.$moment(params.createStartTime).valueOf() : '';
          params.createEndTime = params.createEndTime ? this.$moment(params.createEndTime).valueOf() : '';
          params.sStartTime = params.sStartTime ? this.$moment(params.sStartTime).valueOf() : '';
          params.sEndTime = params.sEndTime ? this.$moment(params.sEndTime).valueOf() : '';
          params.eStartTime = params.eStartTime ? this.$moment(params.eStartTime).valueOf() : '';
          params.eEndTime = params.eEndTime ? this.$moment(params.eEndTime).valueOf() : '';
          http.post('transport-task/export/list', params).then(res => {
            utils.download(res.data.path, '运单统计明细');
            this.isLoading = false;
            this.$store.commit('initPrint', {isPrinting: false, moduleId: '/vehicle/delivery/task'});
            // 清空列表
            this.taskIdList = [];
            this.checkList = [];
            // 清空勾选
            this.dataList.forEach(val => {
              val.isChecked = false;
            });
          }).catch(error => {
            this.isLoading = false;
            this.$store.commit('initPrint', {isPrinting: false, moduleId: '/vehicle/delivery/task'});
            this.$notify.error({
              message: error.response&&error.response.data && error.response.data.msg || '导出失败'
            });
          });
        });
      },
      exportFile: function () {
        if (!this.taskIdList.length) {
          this.$notify.warning({
            duration: 2000,
            message: '请勾选需要导出的出车任务'
          });
          return;
        }
        this.isLoading = true;
        this.$store.commit('initPrint', {
          isPrinting: true,
          moduleId: '/vehicle/delivery/task'
        });
        let params = Object.assign({}, {taskList: this.taskIdList});
        http.post('/transport-task/export/task-info', params).then(res => {
          // utils.download(res.data.url, '派车任务表');
          this.isLoading = false;
          this.$notify({
            title: '提示',
            message: '请到我的下载页面导出',
            type: 'info'
          });

          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/vehicle/delivery/task'
          });
          // 清空列表
          this.taskIdList = [];
          this.checkList = [];
          // 清空勾选
          this.dataList.forEach(val => {
            val.isChecked = false;
          });
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/vehicle/delivery/task'
          });
          this.$notify.error({
            message: error.response&&error.response.data && error.response.data.msg || '导出失败'
          });
        });
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
            let idIndex = this.taskIdList.indexOf(item.id);
            if (idIndex === -1) {
              this.taskIdList.push(item.id);
            }
          });
        } else {
          this.dataList.forEach(item => {
            item.isChecked = false;
          });
          this.checkList = [];
          this.taskIdList = [];
        }
      },
      checkItem: function (item) {
        // 单选
        item.isChecked = !item.isChecked;
        let index = this.checkList.indexOf(item);
        let idIndex = this.taskIdList.indexOf(item.id);
        if (item.isChecked) {
          if (index === -1) {
            this.checkList.push(item);
          }
          if (idIndex === -1) {
            this.taskIdList.push(item.id);
          }
        } else {
          this.checkList.splice(index, 1);
          this.taskIdList.splice(idIndex, 1);
        }
      },
      cancelTask: function (item) {
        this.$confirm('确认取消出车任务"' + item.transportTaskNo + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TransportTask.cancelTask(item.id).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功取消出车任务"' + item.transportTaskNo + '"'
            });
            this.getTransportTaskPage(1);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.data.msg || '取消出车任务失败'
            });
          });
        }).catch(() => {

        });
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        window.localStorage.setItem('currentPageSize', val);
        this.getTransportTaskPage(1);
      },
      handleCurrentChange(val) {
        this.getTransportTaskPage(val);
      },
      confirmTask: function (item) {
        this.$confirm('确认派送任务"' + item.transportTaskNo + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TransportTask.confirmTask(item.id).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功确认派送任务"' + item.transportTaskNo + '"'
            });
            this.getTransportTaskPage(1);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.data.msg || '确认派送任务失败'
            });
          });
        }).catch(() => {

        });
      },
      searchResult: function (search) {
        Object.assign(this.filters, search);
      },
      checkStatus(item, key) {
        this.filters.status = item.status;
        this.activeStatus = key;
      },
      resetRightBox() {
        this.showIndex = -1;
        this.showAdjustmentIndex=-1;
        this.showEditIndex = -1;
        this.$router.push('/vehicle/delivery/task/list');
      },
      getTransportTaskPage: function (pageNo, isContinue = false) {
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.loadingData = true;
        // 清空勾选列表
        this.checkList = [];
        this.checkListPara = [];
        this.taskIdList = [];
        let nowTime = Date.now();
        this.nowTime = nowTime;
        TransportTask.query(param).then(res => {
          if (this.nowTime > nowTime) return;
          res.data.list.forEach(val => {
            val.isChecked = false;
          });
          if (isContinue) {
            this.dataList = this.showTypeList.concat(res.data.list);
          } else {
            this.dataList = res.data.list;
          }
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
        this.queryStateNum(param);
      },
      queryStateNum: function (params) {
        TransportTask.queryStateNum(params).then(res => {
          let data = res.data;
          this.orderType[0].num = data['pend-confirmed'];
          this.orderType[1].num = data['pend-start'];
          this.orderType[2].num = data['pend-end'];
          this.orderType[3].num = data['completed'];
          this.orderType[4].num = data['canceled'];
        });
      },
      showAdjustment: function (item) {
        this.currentItemId = item.id;
        this.showAdjustmentIndex = 0;
        this.currentAdjustPart = this.dialogAdjustmentComponents[0];
        this.$nextTick(() => {
          this.form = JSON.parse(JSON.stringify(item));
        });
      },
      showInfo: function (item) {
        this.currentItemId = item.id;
        this.showIndex = 0;
        this.currentPart = this.dialogComponents[0];
        this.$nextTick(() => {
          this.form = JSON.parse(JSON.stringify(item));
          this.$router.push('/vehicle/delivery/task/' + item.id);
        });
      },
      editInfo: function (item) {
        this.currentItemId = item.id;
        this.showEditIndex = 0;
        this.currentEditPart = this.dialogEditComponents[0];
        this.$nextTick(() => {
          this.form = JSON.parse(JSON.stringify(item));
        });
      },
      submit() {
        this.checkList = [];
        this.checkListPara = [];
        this.getTransportTaskPage(1);
      }
    }
  };
</script>
