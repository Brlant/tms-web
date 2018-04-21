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
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">查看任务详情</template>
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
            <oms-col label="任务名称" :rowSpan="span" :value="form.taskName"/>
            <oms-col label="任务名称" :rowSpan="span" :value="form.type">
              <dict :dict-group="'deliveryTaskType'" :dict-key="form.type"></dict>
            </oms-col>
            <oms-col label="承运商" :rowSpan="span" :value="form.taskCarriersName"/>
            <oms-col label="车牌号" :rowSpan="span" :value="form.carPlateNumber"/>
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
              <span @click="showAdd" class="btn-circle" v-show="form.status==='0'"><i
                class="el-icon-t-plus"></i> </span>
            </h3>
          </div>
          <div>
            <el-form ref="detailForm" :model="detailForm" class="clearfix" label-width="100px" v-show="showAddFlag">
              <el-row>
                <el-col :span="20">
                  <el-form-item label="运单" style="margin-top: 20px;margin-bottom: 20px">
                    <el-select filterable remote placeholder="请输入运单号搜索运单" :remote-method="getTmsOrderList"
                               :clearable="true"
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
              </el-table-column>
              <el-table-column prop="receiverName" label="收货单位" mix-width="240">
              </el-table-column>
              <el-table-column prop="receiverAddress" label="收货地址" mix-width="180">
              </el-table-column>
              <el-table-column prop="incubatorCount" label="包件" width="50">
              </el-table-column>
              <el-table-column prop="" label="操作" width="80" v-if="form.status==='0'">
                <template slot-scope=" scope">
                  <perm label="tms-waybill-edit" class="opera-btn btn-line-block">
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
              <des-btn icon="detail" @click="showBigMap(form.waybillList)">查看大图</des-btn>
            </h3>
          </div>
          <div class="content">
            <task-map :waybillList="form.waybillList"></task-map>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import { TransportTask } from '@/resources';
  import TaskMap from './map-new-next';

  export default {
    components: {TaskMap},
    data () {
      return {
        span: 7,
        list: [],
        times: [],
        pageSets: [
          {name: '任务信息', key: 0},
          {name: '运单明细', key: 1},
          {name: '派送地图', key: 2}
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
        rules: {},
        showAddFlag: false,
        detailForm: {
          id: '',
          list: []
        },
        wayBillList: [],
        doing: false
      };
    },
    computed: {},
    props: ['formItem', 'showBigMap'],
    watch: {
      formItem: function (val) {
        this.selectTab(this.pageSets[0]);
        if (val.id) {
          TransportTask.getOneTransportTask(val.id).then(res => {
            this.form = res.data;
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
