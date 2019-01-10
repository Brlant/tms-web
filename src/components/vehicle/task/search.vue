<template>
  <search-template :isShow="showSearch" @search="search" @reset="reset" @isShow="isShow">
    <template slot="title">任务查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
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
          <el-col :span="8">
            <oms-form-row label="车牌号" :span="5">
              <oms-input v-model="searchCondition.carPlateNumber" placeholder="请输入车牌号"
                         @keyup.native.enter="search"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="运单号" :span="5">
              <oms-input v-model="searchCondition.waybillNo" placeholder="请输入运单号"
                         @keyup.native.enter="search"></oms-input>
            </oms-form-row>
          </el-col>
          <div v-show="showSearch">
            <el-row>
              <el-col :span="8">
                <oms-form-row label="创建时间" :span="5" :required="true">
                  <el-date-picker v-model="createTimes" type="datetimerange" :default-time="['00:00:00', '23:59:59']"
                                  placeholder="请选择创建时间" @change="search"/>
                </oms-form-row>
              </el-col>
              <el-col :span="8">
                <oms-form-row label="开始时间" :span="5" :required="true">
                  <el-date-picker v-model="startTimes" type="datetimerange" :default-time="['00:00:00', '23:59:59']"
                                  placeholder="请选择开始时间" @change="search"/>
                </oms-form-row>
              </el-col>
              <el-col :span="8">
                <oms-form-row label="结束时间" :span="5" :required="true">
                  <el-date-picker v-model="endTimes" type="datetimerange" :default-time="['00:00:00', '23:59:59']"
                                  placeholder="请选择结束时间" @change="search"/>
                </oms-form-row>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  import {BaseInfo} from '@/resources';

  export default {
    data: function () {
      return {
        searchCondition: {
          transportTaskNo: '',
          type: '',
          carPlateNumber: '',
          waybillNo: '',
          createStartTime: '',
          createEndTime: '',
          sStartTime: '',
          sEndTime: '',
          eStartTime: '',
          eEndTime: ''
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
          createStartTime: '',
          createEndTime: '',
          sStartTime: '',
          sEndTime: '',
          eStartTime: '',
          eEndTime: ''
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
