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

  .order-list-status-right {
    justify-content: flex-end;
  }

  .order-list .order-list-header {
    background: #dfebf8;
    line-height: 15px;
    padding: 10px 5px 10px 15px;
    margin: 10px 0 5px 0;
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
        <perm label="tms-waybill-verifyPass">
          <el-button plain size="small" @click="autoConfirmWayBill" v-if="filters.status==='-2'">
            <f-a class="icon-small" name="wave"></f-a>
            确认全部运单
          </el-button>
        </perm>
        <perm label="tms-waybill-confirm">
          <el-button plain size="small" @click="batchConfirmWayBill" v-if="filters.status==='-2'">
            <f-a class="icon-small" name="wave"></f-a>
            批量确认运单
          </el-button>
        </perm>
        <perm label="tms-task-add">
          <el-button plain size="small" @click="autoWayBillList"
                     v-if="filters.status==='0'&&checkList.length">
            <f-a class="icon-small" name="wave"></f-a>
            自动排单
          </el-button>
        </perm>
        <perm label="tms-task-add">
          <el-button plain size

            ="small" @click="batchAutoWayBillList"
                     v-if="filters.status==='0'&&!checkList.length">
            <f-a class="icon-small" name="wave"></f-a>
            批量自动排单
          </el-button>
        </perm>
        <perm label="tms-waybill-export">
          <el-button plain size="small" @click="exportFile" :disabled="isLoading">
            <f-a class="icon-small" name="print"></f-a>
            打印运单
          </el-button>
        </perm>
        <perm label="tms-waybill-list-export">
          <el-button plain size="small" @click="exportSearchFile" :disabled="isLoading">
            <f-a class="icon-small" name="export"></f-a>
            导出Excel
          </el-button>
        </perm>
      </template>
    </search-part>

    <!--<status-list :activeStatus="activeStatus" :statusList="orderType" :checkStatus="checkStatus"/>-->
    <el-row>
      <el-col :span="16">
        <div class="order-list-status " style="margin-bottom:20px">
          <div class="status-item" v-show="key < 8"
               :class="{'active':key==activeStatus}"
               v-for="(item,key) in orderType"
               @click="changeStatus(item,key)">
            <div class="status-bg" :class="['b_color_'+key]"></div>
            <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{item.title}}<span
              class="status-num">{{item.num}}</span></div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="order-list-status  order-list-status-right" style="margin-bottom:20px">
          <div class="status-item" v-show="key > 7"
               :class="{'active':key==activeStatus }"
               v-for="(item,key) in orderType"
               @click="changeStatus(item,key)">
            <div class="status-bg" :class="['b_color_'+key]"></div>
            <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{item.title}}<span
              class="status-num">{{item.num}}</span></div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="order-list" style="margin-top: 20px">
      <div class="flex-list-dom">
        <el-row class="order-list-header">
          <el-col :span="2">
            <el-checkbox @change="checkAll" v-model="isCheckAll" v-if="filters.status"></el-checkbox>
            运单号
          </el-col>
          <el-col :span="2">类型</el-col>
          <el-col :span="4">发货单位</el-col>
          <el-col :span="4">收货单位</el-col>
          <el-col :span="1">整件</el-col>
          <el-col :span="1">散件</el-col>
          <el-col :span="1">实际包件</el-col>
          <el-col :span="1">预估包件</el-col>
          <!--<el-col :span="2">预估包件</el-col>-->
          <el-col :span="4">时间</el-col>
          <el-col :span="1">状态</el-col>
          <el-col :span="3">操作</el-col>
        </el-row>
      </div>
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
            <el-col :span="2" class="special-col R">
              <div class="el-checkbox-warp" @click.stop.prevent="checkItem(item)" v-if="filters.status">
                <el-checkbox v-model="item.isChecked"></el-checkbox>
              </div>
              <div>
                {{item.waybillNumber}}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div v-show="item.waybillType">
                <dict :dict-group="'bizType'" :dict-key="item.waybillType"></dict>
              </div>
              <div v-show="item.shipmentWay">
                <dict :dict-group="'transportationCondition'" :dict-key="item.shipmentWay"></dict>
              </div>
            </el-col>
            <el-col :span="4" class="R">
              <div>
                {{item.senderName}}
              </div>
              <div>
                {{item.senderAddress}}
              </div>
            </el-col>
            <el-col :span="4" class="R">
              <div>
                {{item.receiverName}}
              </div>
              <div>
                {{item.receiverAddress}}
              </div>
            </el-col>
            <!--<el-col :span="5" class="R">-->
            <!--<div>-->
            <!--{{item.receiverAddress}}-->
            <!--</div>-->
            <!--</el-col>-->
            <el-col :span="1" class="R">
              <div>
                {{item.wholeBoxCount}}
              </div>
            </el-col>
            <el-col :span="1" class="R">
              <div>
                {{item.bulkBoxCount}}
              </div>
            </el-col>
            <el-col :span="1" class="R">
              <div>
                {{item.incubatorCount}}
              </div>
            </el-col>
            <el-col :span="1" class="R">
              <div>
                {{item.preIncubatorCount}}
              </div>
            </el-col>
            <!--<el-col :span="2" class="R">-->
            <!--<div>-->
            <!--{{item.preIncubatorCount}}-->
            <!--</div>-->
            <!--</el-col>-->
            <el-col :span="4" class="R">
              <div v-show="item.deliveryTime&&!item.waybillCompleteTime">
                <span>送达时限:</span>
                {{item.deliveryTime|date}}
              </div>
              <div v-show="item.startTransportTime">
                <span>[启运] </span>
                {{item.startTransportTime|time}}
              </div>
              <div v-show="item.deliveryCompleteTime">
                <span>[送达] </span>
                {{item.deliveryCompleteTime|time}}
              </div>
              <div v-show="item.waybillCompleteTime">
                <span>[结束] </span>
                {{item.waybillCompleteTime|time}}
              </div>
            </el-col>
            <el-col :span="1" class="R">
              <div>
                {{formatStatusTitle(item.status, orderType)}}
                <el-tag v-if="!form.pageFlag" type="warning">未打包</el-tag>
                <el-tag v-if="form.pageFlag" type="success">已打包</el-tag>
              </div>
            </el-col>
            <el-col :span="3" class="opera-btn">
              <div>
                <div>
                  <perm label="tms-waybill-edit">
                    <span @click.stop="edit(item)" v-if="item.status === '-2'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-edit"></i>
                      </a>编辑
                    </span>
                  </perm>
                  <perm label="tms-waybill-edit">
                    <span @click.stop="confirm(item)"
                          v-if="item.status === '-2'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-verifyPass"></i>
                      </a>确认
                    </span>
                  </perm>
                </div>
                <div style="padding-top: 2px">
                  <perm label="tms-waybill-cancel" class="opera-btn">
                    <span @click.stop="cancelWayBill(item)"
                          v-if="item.status === '-2'||item.status === '-1'||item.status === '0'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-forbidden"></i>
                      </a>取消
                    </span>
                  </perm>
                  <perm label="tms-waybill-pack" class="opera-btn">
                    <span @click.stop="packageWayBill(item)" v-if="item.status === '-1'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-basic"></i>
                      </a>打包
                    </span>
                  </perm>
                </div>
                <perm label="tms-waybill-sign" class="opera-btn">
                    <span @click.stop="signWayBill(item)" v-if="item.status === '7'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-edit"></i>
                      </a>签收
                    </span>
                </perm>
                <perm label="tms-waybill-quality-inspection" class="opera-btn">
                    <span @click.stop="assessmentWayBill(item)" v-if="item.status === '5'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-search"></i>
                      </a>评估
                    </span>
                </perm>
                <perm label="tms-waybill-suspend" class="opera-btn">
                    <span @click.stop="untieWayBill(item)" v-if="item.status === '7'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-delete"></i>
                      </a>中止
                    </span>
                </perm>
              </div>
              <div>
                <!--<perm label="tms-waybill-sign" class="opera-btn">-->
                <span @click.stop="deliveryWayBill(item)" v-if="item.status === '2'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-basic"></i>
                      </a>运单送达
                    </span>
                <!--</perm>-->
                <!--<perm label="tms-waybill-sign" class="opera-btn">-->
                <span @click.stop="deliverDate(item)" v-if="item.status === '7'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-edit"></i>
                      </a>编辑送达时间
                    </span>
                <!--</perm>-->
              </div>
            </el-col>
          </el-row>
          <div class="order-list-item-bg"></div>
        </div>
      </div>
      <el-row class="order-list-header" v-show="dataList.length && !loadingData">
        <el-col :span="12" align="left">合计</el-col>
        <el-col :span="1">{{totalCount.whole}}</el-col>
        <el-col :span="1">{{totalCount.buck}}</el-col>
        <el-col :span="1">{{totalCount.incubatorCount}}</el-col>
        <el-col :span="1">{{totalCount.preIncubatorCount}}</el-col>
        <el-col :span="8"></el-col>
      </el-row>
    </div>
    <div class="text-center" v-show="dataList.length && !loadingData">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pager.currentPage"
                     :page-sizes="[20,50,100]" :page-size="20" layout="total, sizes, prev, pager, next, jumper"
                     :total="pager.count">
      </el-pagination>
    </div>

    <page-right :show="showIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentPart" :action="action" :formItem="form" @right-close="resetRightBox" @change="submit"/>
    </page-right>
    <page-right :show="showInfoIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentInfoPart" :formItem="form" :showBigMap="showBigMap" @right-close="resetRightBox"/>
    </page-right>
    <page-right :show="showSignIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentSignPart" :formItem="form" @right-close="resetRightBox" @change="submit"/>
    </page-right>
    <page-right :show="showDeliverIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentDeliverPart" :formItem="form.id" @right-close="resetRightBox" @change="submit"/>
    </page-right>
    <page-right :show="showAssessmentIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentAssessmentPart" :formItem="form" @right-close="resetRightBox" @change="submit"/>
    </page-right>
    <page-right :show="showUntieIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentUntiePart" :formItem="form" @right-close="resetRightBox" @change="submit"/>
    </page-right>
    <page-right :show="showConfirmIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentConfirmPart" :checkList="checkListPara" @right-close="resetRightBox" @change="submit"/>
    </page-right>
    <page-right :show="showAutoIndex === 0" @right-close="resetRightBox" :css="{'width':'80%','padding':0}">
      <component :is="currentAutoPart" :checkList="checkListPara" @right-close="resetRightBox" @change="autoSubmit"/>
    </page-right>
    <page-right :show="showBatchAutoIndex === 0" @right-close="resetRightBox" :css="{'width':'80%','padding':0}">
      <component :is="currentBatchAutoPart" :filters="condition" @right-close="resetRightBox" @change="autoSubmit"/>
    </page-right>
    <el-dialog :title="'运单号: ' + formItem.waybillNumber" :visible.sync="isShowMulBigMap" width="100%" :fullscreen="true"
               custom-class="custom-dialog-map">
      <map-path :formItem="formItem" :mapStyle="{height: bodyHeight}" vid="mapBigPath"
                v-show="isShowMulBigMap"></map-path>
    </el-dialog>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import {http, TmsWayBill} from '@/resources';
  import addForm from './form/add-form.vue';
  import showForm from './form/show-form.vue';
  import signForm from './form/sign-form';
  import deliverForm from './form/deliver-form';
  import untieForm from './form/untie-form';
  import assessmentForm from './form/assessment-form';
  import StatusMixin from '@/mixins/statusMixin';
  import confirmForm from './form/confirm-form';
  import autoForm from './form/auto-form';
  import batchAutoForm from './form/batch-auto-form';
  import MapPath from '../common/map-path';

  export default {
    components: {
      SearchPart, addForm, MapPath
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
        showSignIndex: -1,
        showDeliverIndex: -1,
        showAssessmentIndex: -1,
        showConfirmIndex: -1,
        showAutoIndex: -1,
        showBatchAutoIndex: -1,
        showUntieIndex: -1,
        currentPart: null,
        currentInfoPart: null,
        currentSignPart: null,
        currentDeliverPart: null,
        currentConfirmPart: null,
        currentAutoPart: null,
        currentUntiePart: null,
        currentBatchAutoPart: null,
        currentAssessmentPart: null,
        dialogComponents: {
          0: addForm
        },
        dialogInfoComponents: {
          0: showForm
        },
        dialogSignComponents: {
          0: signForm
        },
        dialogDeliverComponents: {
          0: deliverForm
        },
        dialogAssessmentComponents: {
          0: assessmentForm
        },
        dialogUntieComponents: {
          0: untieForm
        },
        dialogConfirmComponents: {
          0: confirmForm
        },
        dialogAutoComponents: {
          0: autoForm
        },
        dialogBatchAutoComponents: {
          0: batchAutoForm
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
          status: null,
          waybillNumber: '',
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
        shoWayBillPart: false,
        isLoading: false,
        waybillIdList: [],
        condition: {},
        formItem: {},
        isShowMulBigMap: false
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return (height + 136) + 'px';
      },
      totalCount () {
        let total = {
          whole: 0,
          buck: 0,
          incubatorCount: 0,
          preIncubatorCount: 0
        };
        this.dataList.forEach(i => {
          total.whole += i.wholeBoxCount;
          total.buck += i.bulkBoxCount;
          total.incubatorCount += i.incubatorCount;
          total.preIncubatorCount += i.preIncubatorCount;
        });
        return total;
      }
    },
    watch: {
      filters: {
        handler: function () {
          this.getTmsWayBillPage(1);
        },
        deep: true
      }
    },
    mounted () {
      this.getTmsWayBillPage(1);
      let id = this.$route.params.id;
      if (id !== 'list' && id !== ':id') {
        this.showInfo({id});
      } else {
        this.$router.push('/document/transport/list');
      }
    },
    methods: {
      showBigMap (formItem) {
        this.formItem = {};
        this.isShowMulBigMap = true;
        this.$nextTick(() => {
          setTimeout(() => {
            this.formItem = formItem;
          }, 300);
        });
      },
      exportSearchFile: function () {
        this.isLoading = true;
        this.$store.commit('initPrint', {
          isPrinting: true,
          moduleId: '/document/transport',
          text: '正在导出'
        });
        let params = Object.assign({}, this.filters);
        http.get('/tms-waybill/list/export/excel', {params}).then(res => {
          utils.download(res.data.path, '运单表');
          this.isLoading = false;
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/document/transport'
          });
          // 清空勾选
          this.dataList.forEach(val => {
            val.isChecked = false;
          });
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/document/transport'
          });
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },

      exportFile: function () {
        if (!this.checkList.length) {
          this.$notify.warning({
            duration: 2000,
            message: '请勾选需要导出的运单'
          });
          return;
        }
        this.isLoading = true;
        this.$store.commit('initPrint', {
          isPrinting: true,
          moduleId: '/document/transport'
        });
        let params = Object.assign({}, {waybillIdList: this.waybillIdList});
        http.post('tms-waybill/export', params).then(res => {
          utils.download(res.data.url, '运单表');
          this.isLoading = false;
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/document/transport'
          });
          // 清空勾选
          this.dataList.forEach(val => {
            val.isChecked = false;
          });
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/document/transport'
          });
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      packageWayBill: function (item) {
        this.$confirm('确认对运单"' + item.waybillNumber + '进行打包操作"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TmsWayBill.packageWayBill(item.id).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '运单"' + item.waybillNumber + '已成功打包"'
            });
            this.getTmsWayBillPage(1);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.data.msg || '运单打包失败'
            });
          });
        }).catch(() => {

        });
      },
      autoWayBillList: function () {
        if (!this.checkList.length) {
          this.$notify.warning({
            duration: 2000,
            message: '请勾选需要自动排单的运单'
          });
          return;
        }
        this.showAutoIndex = 0;
        this.currentAutoPart = this.dialogAutoComponents[0];
        this.$nextTick(() => {
          this.checkListPara = this.checkList.slice();
        });
      },
      batchAutoWayBillList: function () {
        this.showBatchAutoIndex = 0;
        this.currentBatchAutoPart = this.dialogBatchAutoComponents[0];
        this.$nextTick(() => {
          this.condition = Object.assign({}, this.filters);
        });
      },
      batchConfirmWayBill: function () {
        if (!this.checkList.length) {
          this.$notify.warning({
            duration: 2000,
            message: '请勾选需要确认的运单'
          });
          return;
        }
        this.showConfirmIndex = 0;
        this.currentConfirmPart = this.dialogConfirmComponents[0];
        this.$nextTick(() => {
          this.checkListPara = this.checkList.slice();
        });
      },
      autoConfirmWayBill: function () {
        this.$confirm('是否对状态为待确认的运单进行批量确认操作?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = Object.assign({}, this.filters);
          TmsWayBill.autoConfirmWayBill(param).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功生成运单'
            });
            this.filters = {
              status: '0',
              waybillNumber: '',
              waybillType: '',
              shipmentWay: '',
              serviceType: '',
              senderId: '',
              receiverId: '',
              startTime: '',
              endTime: ''
            };
            this.getTmsWayBillPage(1);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.data.msg || '批量确认运单失败'
            });
          });
        }).catch(() => {

        });
      },
      confirm: function (item) {
        this.$confirm('确认运单"' + item.waybillNumber + '信息"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TmsWayBill.confirmWayBill(item.id).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功确认运单"' + item.waybillNumber + '"'
            });
            this.getTmsWayBillPage(1);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.data.msg || '确认运单失败'
            });
          });
        }).catch(() => {

        });
      },
      deliveryWayBill: function (item) {
        this.$confirm('确认运单"' + item.waybillNumber + '"已送达?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TmsWayBill.deliveryWayBill(item.id).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功送达运单"' + item.waybillNumber + '"'
            });
            this.getTmsWayBillPage(1);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.data.msg || '运单送达失败'
            });
          });
        }).catch(() => {

        });
      },
      checkItem: function (item) {
        // 单选
        item.isChecked = !item.isChecked;
        let index = this.checkList.indexOf(item);
        let idIndex = this.waybillIdList.indexOf(item.id);
        if (item.isChecked) {
          if (index === -1) {
            this.checkList.push(item);
          }
          if (idIndex === -1) {
            this.waybillIdList.push(item.id);
          }
        } else {
          this.checkList.splice(index, 1);
          this.waybillIdList.splice(idIndex, 1);
        }
      },
      checkAll () {
        // 全选
        if (this.isCheckAll) {
          this.dataList.forEach(item => {
            item.isChecked = true;
            let index = this.checkList.indexOf(item);
            if (index === -1) {
              this.checkList.push(item);
            }
            let idIndex = this.waybillIdList.indexOf(item.id);
            if (idIndex === -1) {
              this.waybillIdList.push(item.id);
            }
          });
        } else {
          this.dataList.forEach(item => {
            item.isChecked = false;
          });
          this.checkList = [];
          this.waybillIdList = [];
        }
      },
      signWayBill: function (item) {
        this.showSignIndex = 0;
        this.currentSignPart = this.dialogSignComponents[0];
        this.$nextTick(() => {
          this.form = JSON.parse(JSON.stringify(item));
        });
      },
      deliverDate: function (item) {
        this.showDeliverIndex = 0;
        this.currentDeliverPart = this.dialogDeliverComponents[0];
        this.$nextTick(() => {
          this.form = JSON.parse(JSON.stringify(item));
        });
      },
      assessmentWayBill: function (item) {
        this.showAssessmentIndex = 0;
        this.currentAssessmentPart = this.dialogAssessmentComponents[0];
        this.$nextTick(() => {
          this.form = JSON.parse(JSON.stringify(item));
        });
      },
      untieWayBill: function (item) {
        this.showUntieIndex = 0;
        this.currentUntiePart = this.dialogUntieComponents[0];
        this.$nextTick(() => {
          this.form = JSON.parse(JSON.stringify(item));
        });
      },
      cancelWayBill: function (item) {
        this.$confirm('确认取消运单"' + item.waybillNumber + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TmsWayBill.cancelWayBill(item.id).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功取消运单"' + item.waybillNumber + '"'
            });
            this.getTmsWayBillPage(1);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.data.msg || '取消运单失败'
            });
          });
        }).catch(() => {

        });
      },
      handleSizeChange (val) {
        this.pager.pageSize = val;
        this.getTmsWayBillPage(1);
      },
      handleCurrentChange (val) {
        this.getTmsWayBillPage(val);
      },
      searchResult: function (search) {
        Object.assign(this.filters, search);
      },
      checkStatus (item, key) {
        this.filters.status = item.status;
        this.activeStatus = key;
        this.checkList = [];
        this.checkListPara = [];
      },
      changeStatus: function (item, key) {// 订单分类改变
        this.activeStatus = key;
        this.filters.status = item.status;
      },
      resetRightBox () {
        this.showIndex = -1;
        this.showInfoIndex = -1;
        this.shoWayBillPart = false;
        this.showSignIndex = -1;
        this.showDeliverIndex = -1;
        this.showAssessmentIndex = -1;
        this.showConfirmIndex = -1;
        this.showAutoIndex = -1;
        this.showBatchAutoIndex = -1;
        this.showUntieIndex = -1;
        this.$router.push('/document/transport/list');
      },
      getTmsWayBillPage: function (pageNo, isContinue = false) {
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        if (this.isCheckAll) {
          this.isCheckAll = false;
        }
        this.loadingData = true;
        // 清空勾选列表
        this.checkList = [];
        this.checkListPara = [];
        TmsWayBill.query(param).then(res => {
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
        TmsWayBill.queryStateNum(params).then(res => {
          let data = res.data;
          let count = 0;
          Object.keys(data).map(k => (count += data[k]));
          this.orderType[0].num = count;
          this.orderType[1].num = data['pend-confirm'];
          this.orderType[2].num = data['pend-package'];
          this.orderType[3].num = data['pend-choose-car'];
          this.orderType[4].num = data['pend-shipment'];
          this.orderType[5].num = data['pend-delivery'];
          this.orderType[6].num = data['pend-sign'];
          this.orderType[7].num = data['complete'];
          this.orderType[8].num = data['canceled'];
          this.orderType[9].num = data['pend-check'];
          this.orderType[10].num = data['suspend'];
        });
      },
      showPart (index) {
        this.action = 'add';
        this.showIndex = index;
        this.currentPart = this.dialogComponents[index];
        this.form = {
          goodsList: [
            {
              goodsName: '',
              specifications: '',
              weight: '',
              volume: '',
              code: ''
            }
          ]
        };
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
          this.$router.push('/document/transport/' + item.id);
        });
      },
      submit () {
        this.checkList = [];
        this.checkListPara = [];
        this.getTmsWayBillPage(1);
      },
      autoSubmit () {
        this.checkList = [];
        this.checkListPara = [];
      }
    }
  };
</script>
