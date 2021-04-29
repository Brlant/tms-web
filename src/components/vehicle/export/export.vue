<style lang="scss">
  .advanced-query-form {
    background: #fff;
    padding: 24px;
  }
</style>
<template>
  <el-form class="advanced-query-form" onsubmit="return false">
    <el-row>
      <el-col :span="8">
        <oms-form-row :span="5" label="派车单号">
          <oms-input placeholder="请输入任务编码" v-model="searchCondition.transportTaskNo"
          ></oms-input>
        </oms-form-row>
      </el-col>
      <el-col :span="8">
        <oms-form-row :span="5" label="车牌号">
          <oms-input placeholder="请输入车牌号" v-model="searchCondition.carPlateNumber"
          ></oms-input>
        </oms-form-row>
      </el-col>
      <el-col :span="8">
        <oms-form-row :required="true" :span="5" label="司机">
          <oms-input placeholder="请输入司机"
                     v-model="searchCondition.driverName"></oms-input>
        </oms-form-row>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="8">
        <oms-form-row :span="5" label="运单号">
          <oms-input placeholder="请输入运单号" v-model="searchCondition.waybillNo"
          ></oms-input>
        </oms-form-row>
      </el-col>
      <el-col :span="8">
        <oms-form-row :required="true" :span="5" label="启运时间">
          <el-date-picker :default-time="['00:00:00', '23:59:59']"
                          type="datetimerange" v-model="startTimes"/>
        </oms-form-row>
      </el-col>
      <el-col :span="8">
        <oms-form-row :required="true" :span="5" label="结束时间">
          <el-date-picker :default-time="['00:00:00', '23:59:59']"
                          type="datetimerange" v-model="endTimes"/>
        </oms-form-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <oms-form-row :span="5" label="TMS订单号">
          <oms-input placeholder="请输入TMS订单号" v-model="searchCondition.orderNumber"
          ></oms-input>
        </oms-form-row>
      </el-col>
      <el-col :span="8">
        <oms-form-row :span="5" label="货主">
          <el-select :clearable="true" :remote-method="filterSenderOrg" filterable placeholder="名称/拼音/系统代码搜索货主"
                     popperClass="good-selects"
                     remote v-model="searchCondition.ownerId">
            <el-option :key="org.id" :label="org.name" :value="org.id" v-for="org in senderOrgList">
              <div style="overflow: hidden">
                <span class="pull-left" style="clear: right">{{org.name}}</span>
              </div>
              <div style="overflow: hidden">
                  <span class="select-other-info pull-left">
                    <span>系统代码:</span>{{org.manufacturerCode}}
                  </span>
              </div>
            </el-option>
          </el-select>
        </oms-form-row>
      </el-col>
      <el-col :span="8">
        <oms-form-row :span="5" label="收货单位">
          <el-select :clearable="true" :remote-method="filterReceiverOrg" filterable placeholder="名称/拼音/系统代码搜索发货单位"
                     popperClass="good-selects"
                     remote v-model="searchCondition.receiverId">
            <el-option :key="org.id" :label="org.name" :value="org.id" v-for="org in receiverOrgList">
              <div style="overflow: hidden">
                <span class="pull-left" style="clear: right">{{org.name}}</span>
              </div>
              <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                      <span>系统代码:</span>{{org.manufacturerCode}}
                    </span>
              </div>
            </el-option>
          </el-select>
        </oms-form-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <oms-form-row :span="5" label="货主订单号">
          <oms-input placeholder="请输入货主订单号" v-model="searchCondition.orderNo"
          ></oms-input>
        </oms-form-row>
      </el-col>
      <el-col :span="8">
        <oms-form-row :span="5" label="订单状态">
          <el-select v-model="searchCondition.orderStatus">
            <el-option :key="item.status" :label="item.title" :value="item.status"
                       v-for="item in orderType"></el-option>
          </el-select>
        </oms-form-row>
      </el-col>
      <el-col :span="8">
        <oms-form-row :span="5" label="运单状态">
          <el-select v-model="searchCondition.waybillStatus">
            <el-option :key="item.status" :label="item.title" :value="item.status"
                       v-for="item in wayBillType"></el-option>
          </el-select>
        </oms-form-row>
      </el-col>
    </el-row>
    <el-row>

    </el-row>
    <el-row>
      <el-col :span="8">
        <oms-form-row :required="true" :span="5" label="">
          <el-button @click="exportOrderFile" size="small" type="primary">
            导出运单统计明细
          </el-button>
          <el-button @click="reset" plain size="small">
            重置
          </el-button>
        </oms-form-row>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import {BaseInfo} from '@/resources.js';
  import utils from '@/tools/utils';

  export default {
    data: function () {
      return {
        searchCondition: {
          transportTaskNo: '',
          carPlateNumber: '',
          waybillNo: '',
          driverName: '',
          orderNumber: '',
          orderNo: '',
          orderStatus: '',
          ownerId: '',
          receiverId: '',
          waybillStatus:''
        },
        orderType: utils.orderType,
        wayBillType: utils.wayBillType,
        showSearch: false,
        list: [],
        times: [],
        senderOrgList: [],
        receiverOrgList: [],
        startTimes: null,
        endTimes: null,
        isLoading: false,
      };
    },
    watch: {
      'searchCondition.type': function () {
        this.search();
      }
    },
    computed: {
      deliveryTaskTypeList() {
        return this.$getDict('deliveryTaskType');
      }
    },
    methods: {
      formatTimeAry(times, index) {
        if (!times) return;
        return this.formatTime(times[index]);
      },
      formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
        return time ? this.$moment(time).format(str) : '';
      },
      reset() {
        this.searchCondition = {
          transportTaskNo: '',
          carPlateNumber: '',
          waybillNo: '',
          driverName: '',
          orderNumber: '',
          orderNo: '',
          orderStatus: '',
          ownerId: '',
          receiverId: '',
          waybillStatus:''
        };
        this.createTimes = [];
        this.startTimes = null;
        this.endTimes = null;
      },
      isShow(val) {
        this.showSearch = val;
      },
      filterSenderOrg: function (query) {// 过滤发货单位
        BaseInfo.query({keyWord: query}).then(res => {
          this.senderOrgList = res.data.list;
        });
      },
      filterReceiverOrg: function (query) {// 过滤收货单位
        BaseInfo.query({keyWord: query}).then(res => {
          this.receiverOrgList = res.data.list;
        });
      },
      exportOrderFile() {
        this.searchCondition.startTime = this.startTimes ? this.$moment(this.startTimes[0]).valueOf() : '';
        this.searchCondition.endTime = this.startTimes ? this.$moment(this.startTimes[1]).valueOf() : '';
        this.searchCondition.weStartTime = this.endTimes ? this.$moment(this.endTimes[0]).valueOf() : '';
        this.searchCondition.weEndTime = this.endTimes ? this.$moment(this.endTimes[1]).valueOf() : '';
        let params = Object.assign({}, this.searchCondition);
        if (!Object.keys(params).some(k => params[k])) return this.$notify.info('请选择查询条件');
        this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path, text: '正在导出'});
        this.$http.post('transport-task/export/list', params).then(res => {
          utils.download(res.data.path, '运单统计明细');
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
        }).catch(error => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
          this.$notify.error({
            message: error.response&&error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
    }
  };
</script>
