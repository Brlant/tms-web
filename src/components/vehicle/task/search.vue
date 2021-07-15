<template>
  <search-template :isShow="showSearch" @search="search" @reset="reset" @isShow="isShow">
    <template slot="title">任务查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="6">
            <oms-form-row label="任务号" :span="5">
              <oms-input v-model="searchCondition.transportTaskNo" placeholder="请输入任务编码"
                         @keyup.native.enter="search"></oms-input>
            </oms-form-row>
          </el-col>
          <!--<el-col :span="8">-->
          <!--<oms-form-row label="任务类型" :span="5">-->
          <!--<el-select placeholder="请选择车型" v-model="searchCondition.type">-->
          <!--<el-option :label="item.label" :value="item.key" :key="item.key"-->
          <!--v-for="item in deliveryTaskTypeList"></el-option>-->
          <!--</el-select>-->
          <!--</oms-form-row>-->
          <!--</el-col>-->
          <el-col :span="6">
            <oms-form-row label="车牌号" :span="5">
              <oms-input v-model="searchCondition.carPlateNumber" placeholder="请输入车牌号"
                         @keyup.native.enter="search"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row label="运单号" :span="5">
              <oms-input v-model="searchCondition.waybillNo" placeholder="请输入运单号"
                         @keyup.native.enter="search"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row label="委托单号" :span="5">
              <oms-input v-model="searchCondition.tmsOrderNumber" placeholder="请输入委托单号"
                         @keyup.native.enter="search"></oms-input>
            </oms-form-row>
          </el-col>
        </el-row>
        <div v-show="showSearch">
          <el-row>
            <el-col :span="8">
              <oms-form-row :required="true" :span="5" label="创建时间">
                <el-date-picker :default-time="['00:00:00', '23:59:59']" @change="search" placeholder="请选择创建时间"
                                type="datetimerange" v-model="createTimes"/>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :required="true" :span="5" label="开始时间">
                <el-date-picker :default-time="['00:00:00', '23:59:59']" @change="search" placeholder="请选择开始时间"
                                type="datetimerange" v-model="startTimes"/>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :required="true" :span="5" label="结束时间">
                <el-date-picker :default-time="['00:00:00', '23:59:59']" @change="search" placeholder="请选择结束时间"
                                type="datetimerange" v-model="endTimes"/>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <oms-form-row :required="true" :span="5" label="负责人">
                <oms-input @keyup.native.enter="search" placeholder="请输入负责人"
                           v-model="searchCondition.headName"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :required="true" :span="5" label="司机">
                <oms-input @keyup.native.enter="search" placeholder="请输入司机"
                           v-model="searchCondition.driverName"></oms-input>
              </oms-form-row>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </template>
  </search-template>
</template>
<script>

  export default {
    data: function () {
      return {
        searchCondition: {
          transportTaskNo: '',
          type: '',
          carPlateNumber: '',
          waybillNo: '',
          tmsOrderNumber:'',
          createStartTime: '',
          createEndTime: '',
          sStartTime: '',
          sEndTime: '',
          eStartTime: '',
          eEndTime: '',
          headName: '',
          driverName: ''
        },
        showSearch: false,
        list: [],
        times: [],
        senderOrgList: [],
        receiverOrgList: [],
        createTimes: [],
        startTimes: [],
        endTimes: []
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
          type: '',
          carPlateNumber: '',
          waybillNo: '',
          tmsOrderNumber:'',
          createStartTime: '',
          createEndTime: '',
          sStartTime: '',
          sEndTime: '',
          eStartTime: '',
          eEndTime: '',
          headName: '',
          driverName: ''
        };
        this.createTimes = [];
        this.startTimes = [];
        this.endTimes = [];
        this.$emit('search', this.searchCondition);
      },
      search() {
        this.searchCondition.createStartTime = this.$formatAryTime(this.createTimes, 0, 'YYYY-MM-DD HH:mm:ss');
        this.searchCondition.createEndTime = this.$formatAryTime(this.createTimes, 1, 'YYYY-MM-DD HH:mm:ss');
        this.searchCondition.sStartTime = this.$formatAryTime(this.startTimes, 0, 'YYYY-MM-DD HH:mm:ss');
        this.searchCondition.sEndTime = this.$formatAryTime(this.startTimes, 1, 'YYYY-MM-DD HH:mm:ss');
        this.searchCondition.eStartTime = this.$formatAryTime(this.endTimes, 0, 'YYYY-MM-DD HH:mm:ss');
        this.searchCondition.eEndTime = this.$formatAryTime(this.endTimes, 1, 'YYYY-MM-DD HH:mm:ss');
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
