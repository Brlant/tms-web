<style lang="scss" scoped>
  $labelWidth: 180px;
  .content-part {
    .content-left {
      width: $labelWidth;
    }
    .content-right {
      > h3 {
        left: $labelWidth;
      }
      left: $labelWidth;
    }
  }

  .part-hj-box {
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .el-icon-zoom-in {
    font-size: 16px;
  }

  .f-14 {
    font-size: 14px;
  }
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">任务详情</template>
    <template slot="btn">
      <el-button plain @click="close()">关闭</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content">
            <oms-col label="任务编码" :rowSpan="span" :value="form.transportTaskNo"/>
            <oms-col label="任务状态" :rowSpan="span" :value="form.status">
              {{formatStatusTitle(form.status, orderType)}}
            </oms-col>
            <oms-col label="任务名称" :rowSpan="span" :value="form.taskName"/>
            <oms-col label="任务名称" :rowSpan="span" :value="form.type">
              <dict :dict-group="'deliveryTaskType'" :dict-key="form.type"></dict>
            </oms-col>
            <oms-col label="承运商" :rowSpan="span" :value="form.taskCarriersName"/>
            <oms-col label="车牌号" :rowSpan="span" :value="form.carPlateNumber"/>
            <oms-col label="负责人" :rowSpan="span" :value="form.headName"/>
            <oms-col label="司机" :rowSpan="span" :value="form.driverName"/>
            <oms-col label="司机电话" :rowSpan="span" :value="form.driverPhone"/>
            <span v-for="tallyClerk in form.tallyClerkDtoList">
               <oms-col :label="'理货员'+tallyClerk.index+''" :rowSpan="span" :value="tallyClerk.userName"/>
               <oms-col :label="'理货员'+tallyClerk.index+'电话'" :rowSpan="span" :value="tallyClerk.userPhone"/>
            </span>
            <oms-col label="件数" :rowSpan="span" :value="form.incubatorCount" isShow="true"/>
            <oms-col label="载重" :rowSpan="span" :value="form.carLoadBearing" isShow="true">
              {{form.carLoadBearing}} <span v-if="form.carLoadBearing">千克</span>
            </oms-col>
            <oms-col label="容积" :rowSpan="span" :value="form.carLoadBearing" isShow="true">
              {{form.carVolume}} <span v-if="form.carLoadBearing">立方米</span>
            </oms-col>
            <oms-col label="创建人" :rowSpan="span" :value="form.creatorName" isShow="true"/>
            <oms-col label="创建时间" :rowSpan="span" :value="form.createTime" isShow="true">
              {{form.createTime|time}}
            </oms-col>
            <oms-col label="修改人" :rowSpan="span" :value="form.updateName" isShow="true"/>
            <oms-col label="修改时间" :rowSpan="span" :value="form.updateTime" isShow="true">
              {{form.updateTime|time}}
            </oms-col>
            <oms-col label="开始时间" :rowSpan="span" :value="form.taskStartTime" isShow="true">
              {{form.taskStartTime|time}}
            </oms-col>
            <oms-col label="结束时间" :rowSpan="span" :value="form.taskEndTime" isShow="true">
              {{form.taskEndTime|time}}
            </oms-col>
            <el-col :span="24">
              <div>
                <oms-row label="集货区" :span="3">
                  <span v-for="area in form.areaDtoList">
                      <slot>{{area.name}}<span
                        v-if="form.areaDtoList.indexOf(area)!==form.areaDtoList.length-1">，</span></slot>
                  </span>
                </oms-row>
              </div>
            </el-col>
          </div>
          <div class="hr mb-10 clearfix"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">
              {{pageSets[1].name}}
            </h3>
            <span @click="showAdd" class="btn-circle" v-show="form.status==='0'"><i
              class="el-icon-t-plus"></i> </span>
          </div>
          <div>
            <el-form ref="detailForm" :model="detailForm" class="clearfix" label-width="100px" v-show="showAddFlag">
              <el-row>
                <el-col :span="20">
                  <el-form-item label="运单" style="margin-top: 20px;margin-bottom: 20px">
                    <el-select filterable remote placeholder="请输入运单号搜索运单" :remote-method="getTmsOrderList"
                               :clearable="true" @click.native="getTmsOrderList('')"
                               v-model="detailForm.list" popperClass="good-selects" multiple>
                      <el-option :value="bill.id" :key="bill.id" :label="bill.waybillNumber"
                                 v-for="bill in wayBillList">
                        <div style="overflow: hidden">
                          <span class="pull-left" style="clear: right">{{bill.waybillNumber}}</span>
                        </div>
                        <div style="overflow: hidden">
                          <span class="select-other-info pull-left">
                            <span>收货单位:</span>{{bill.receiverName}}
                          </span>
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="margin-top: 20px;margin-bottom: 20px;padding-left: 40px">
                  <el-button type="primary" @click="onSubmit('detailForm')" :disabled="doing">保存</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="content">
            <el-table :data="form.waybillList" border style="width: 100%">
              <el-table-column prop="waybillNumber" label="运单号" width="140">
                <template slot-scope=" scope">
                  <span class="f-14">
                     {{scope.row.waybillNumber}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="receiverName" label="发货单位" mix-width="190">
                <template slot-scope=" scope">
                  <div class="f-14">
                     {{scope.row.senderName}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="receiverName" label="收货单位" mix-width="190">
                <template slot-scope=" scope">
                  <div class="f-14">
                     {{scope.row.receiverName}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="receiverName" label="收货地址" mix-width="200">
                <template slot-scope=" scope">
                  <div class="f-14">
                    {{scope.row.receiverAddress}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="incubatorCount" label="包件" width="50">
                <template slot-scope=" scope">
                  <span class="f-14">
                     {{scope.row.incubatorCount}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="80">
                <template slot-scope=" scope">
                  <span class="f-14">
                    {{formatStatusTitle(scope.row.status, wayBillType)}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="" label="操作" width="80" v-if="form.status==='0'||form.status==='1'||form.status==='2'">
                <template slot-scope=" scope">
                  <perm label="tms-waybill-edit" class="opera-btn btn-line-block f-12">
                    <span @click.stop="deleteDetail(scope.row)">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-delete"></i>
                      </a>删除
                    </span>
                  </perm>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[2].key === currentTab.key}">
              {{pageSets[2].name}}
            </h3>
            <span @click="showBigMap(form.waybillList, curPosition)" class="des-btn">
               <a href="#" class="btn-circle" @click.prevent="">
                 <i class="el-icon-zoom-in"></i></a>查看大图
            </span>
          </div>
          <div class="content">
            <task-map :waybillList="form.waybillList" :position="curPosition"></task-map>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[3].key === currentTab.key}">
              {{pageSets[3].name}}</h3>
          </div>
          <div class="content">
            <div v-if="loadingLog">
              <oms-loading :loading="loadingLog"></oms-loading>
            </div>
            <div v-else>
              <div class="order-cost-part">
                <i class="el-icon-time"></i> 出车任务消耗时间:
                <oms-cost-time :fDate="form.createTime" :tDate="form.taskEndTime"></oms-cost-time>
                <el-tag v-if="form.taskEndTime" type="success">已结束</el-tag>
                <el-tag v-if="!form.taskEndTime" type="success">进行中</el-tag>
              </div>
              <Timeline>
                <template v-for="(log,index) in orderLogList">
                  <TimelineItem color="green" v-if="log.showDate">
                    <i class="iconfont icon-home" slot="dot"></i>
                    <h3><span>{{log.dateWeek}}</span></h3>
                  </TimelineItem>
                  <TimelineItem color="grey">
                    <el-row class="tiny-timeline-content">
                      <el-col :span="4">
                        <div>{{log.time}}</div>
                      </el-col>
                      <el-col :span="18"><strong>{{log.title}}</strong>
                        <el-tooltip class="item" effect="dark"
                                    :content="log.operatorOrgName ? log.operatorOrgName : '平台用户' "
                                    placement="right" v-show="log.operatorName">
                          <span class="font-gray">[{{log.operatorName}}]</span>
                        </el-tooltip>
                      </el-col>
                    </el-row>
                  </TimelineItem>
                </template>
              </Timeline>
              <div class="order-cost-part" v-if="orderLogList.length>0">
                <i class="el-icon-time"></i> 出车任务消耗时间:
                <oms-cost-time :fDate="form.createTime" :tDate="form.taskEndTime"></oms-cost-time>
              </div>
            </div>
          </div>
        </div>

      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import { TmsLog, TransportTask } from '@/resources';
  import TaskMap from './map-new-next';
  import utils from '@/tools/utils';
  import OmsCostTime from '@/components/common/timeCost.vue';

  export default {
    components: {TaskMap, OmsCostTime},
    data () {
      return {
        span: 7,
        list: [],
        times: [],
        pageSets: [
          {name: '任务信息', key: 0},
          {name: '运单明细', key: 1},
          {name: '派送地图', key: 2},
          {name: '操作日志', key: 3}
        ],
        currentTab: {},
        form: {
          goodsList: [
            {
              goodsName: '',
              specifications: '',
              weight: '',
              volume: '',
              code: ''
            }
          ]
        },
        orderLogList: [],
        loadingLog: false,
        orderType: utils.carTaskType,
        rules: {},
        showAddFlag: false,
        detailForm: {
          id: '',
          list: []
        },
        wayBillList: [],
        doing: false,
        curPosition: null,
        wayBillType: utils.wayBillType
      };
    },
    computed: {},
    props: ['formItem', 'showBigMap', 'isOverTime'],
    watch: {
      formItem: function (val) {
        this.curPosition = null;
        this.selectTab(this.pageSets[0]);
        if (val.id) {
          TransportTask.getOneTransportTask(val.id).then(res => {
            this.form = res.data;
            // 设置当前车辆的经纬度
            this.setCurPosition();
            // 查询日志信息
            this.queryLog(val.id);
            this.form.tallyClerkDtoList.forEach(val => {
              val.index = this.form.tallyClerkDtoList.indexOf(val) + 1;
            });
          });
        }
      },
      'detailForm.list': function () {
        this.doing = false;
      }
    },
    methods: {
      setCurPosition () {
        if (this.formItem.status !== '2') {
          this.curPosition = null;
          return;
        }
        this.curPosition = [this.form.latestCarLongitude, this.form.latestCarLatitude];
      },
      queryLog: function (id) {
        if (!id) return;
        this.loadingLog = true;
        let params = Object.assign({}, {
          pageNo: 1,
          pageSize: 100,
          objId: id,
          objType: 'tms-task'
        });
        TmsLog.queryLog(params).then(res => {
          let dateArr = [];
          res.data.list.forEach(item => {
            let time = this.$moment(item.time);// .format('YYYY年MM月DD日/dddd');
            item.dateWeek = time.format('YYYY年MM月DD日 dddd');
            item.time = time.format('HH:mm:ss');
            if (dateArr.includes(item.dateWeek)) {
              item.showDate = false;
            } else {
              dateArr.push(item.dateWeek);
              item.showDate = true;
            }
          });
          this.orderLogList = res.data.list;
          this.loadingLog = false;
        }).catch(error => {
          this.loadingLog = false;
        });
      },
      formatStatusTitle(status, statusType) {
        let title = '';
        Object.keys(statusType).forEach(k => {
          if (status === null) {
            if (statusType[k].status === status) {
              title = statusType[k].title;
            }
          } else {
            let s1 = Number(statusType[k].status);
            let s2 = Number(status);
            if (s1 === s2) {
              title = statusType[k].title;
            }
          }
        });
        return title;
      },
      onSubmit: function () {
        if (!this.detailForm.list.length) {
          this.$notify.warning({
            duration: 2000,
            message: '请选择需要添加的运单'
          });
          return;
        }
        this.detailForm.id = this.form.id;
        this.doing = true;
        TransportTask.batchAddDetail(this.form.id, this.detailForm).then(() => {
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '已成功新增运单详情'
          });
          TransportTask.getOneTransportTask(this.form.id).then(res => {
            this.$nextTick(() => {
              this.form = res.data;
            });
          });
          this.doing = false;
          this.detailForm.list = [];
          this.wayBillList = [];
          this.showAddFlag = !this.showAddFlag;
        }).catch(error => {
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '新增运单失败'
          });
        });
      },
      getTmsOrderList: function (query) {
        TransportTask.validWayBill({waybillNumber: query}).then(res => {
          this.wayBillList = res.data.list;
        });
      },
      showAdd: function () {
        this.showAddFlag = !this.showAddFlag;
      },
      deleteDetail: function (item) {
        this.$confirm('确认删除运单"' + item.waybillNumber + '"的信息?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TransportTask.deleteDetail(item.id).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功删除运单"' + item.waybillNumber + '"的信息'
            });
            this.detailForm.list = [];
            this.showAddFlag = false;
            TransportTask.getOneTransportTask(this.form.id).then(res => {
              this.form = res.data;
            });
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.data.msg || '删除运单失败'
            });
          });
        }).catch(() => {

        });
      },
      selectTab (item) {
        this.currentTab = item;
      },
      close () {
        this.$emit('right-close');
      }
    }
  };
</script>
