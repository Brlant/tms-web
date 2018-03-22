<template>
  <search-template :isShow="showSearch" @search="search" @reset="reset" @isShow="isShow">
    <template slot="title">订单查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row label="任务号" :span="5">
              <oms-input v-model="searchCondition.transportTaskNo" placeholder="请输入任务编码" @keyup.native.enter="search"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="任务类型" :span="5">
              <el-select placeholder="请选择车型" v-model="searchCondition.type">
                <el-option :label="item.label" :value="item.key" :key="item.key"
                           v-for="item in deliveryTaskTypeList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="车牌号" :span="5">
              <oms-input v-model="searchCondition.carPlateNumber" placeholder="请输入车牌号" @keyup.native.enter="search"></oms-input>
            </oms-form-row>
          </el-col>
          <div v-show="showSearch">
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
          carPlateNumber: ''
        },
        showSearch: false,
        list: [],
        times: [],
        senderOrgList: [],
        receiverOrgList: []
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
      reset() {
        this.searchCondition = {
          transportTaskNo: '',
          type: '',
          carPlateNumber: ''
        };
        this.$emit('search', this.searchCondition);
      },
      search () {
        this.$emit('search', this.searchCondition);
      },
      isShow (val) {
        this.showSearch = val;
      }
    }
  };
</script>
