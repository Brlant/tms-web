<template>
  <search-template :isShow="showSearch" @search="search" @reset="reset" @isShow="isShow">
    <template slot="title">订单查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="4">
            <oms-form-row label="创建人" :span="6">
              <el-select filterable remote placeholder="名称/字母搜索" :remote-method="filterUser"
                         :clearable="true" @click.native.once="filterUser('')"
                         v-model="searchCondition.createBy" popperClass="good-selects">
                <el-option :value="user.id" :key="user.id" :label="user.name" v-for="user in userList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{user.name}}</span>
                    <span class="pull-right">
                        {{user.companyDepartmentName}}
                      </span>
                  </div>
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="10">
            <oms-form-row label="创建时间" :span="5">
              <el-col :span="24">
                <el-date-picker v-model="createdTime" type="datetimerange" placeholder="请选择">
                </el-date-picker>
              </el-col>
            </oms-form-row>
          </el-col>
          <el-col :span="10">
            <oms-form-row label="结束时间" :span="5">
              <el-date-picker v-model="expectedTime" type="datetimerange" placeholder="请选择">
              </el-date-picker>
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
  import {BaseInfo, User} from '@/resources';

  export default {
    data: function () {
      return {
        searchCondition: {
          createBy: '',
          createStartTime: '',
          createEndTime: '',
          completeStartTime: '',
          completeEndTime: ''
        },
        showSearch: false,
        list: [],
        times: [],
        senderOrgList: [],
        receiverOrgList: [],
        expectedTime: '',
        createdTime: '',
        userList: []
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
      filterUser: function (query) {
        let data = Object.assign({}, {
          pageNo: 1,
          pageSize: 20,
          objectId: 'tms-system',
          keyWord: query,
          status: 1
        });
        User.query(data).then(res => {
          this.userList = res.data.list;
        });
      },
      reset() {
        this.searchCondition = {
          createBy: '',
          createStartTime: '',
          createEndTime: '',
          completeStartTime: '',
          completeEndTime: ''
        };
        this.$emit('search', this.searchCondition);
      },
      search() {
        if (!this.createdTime[0]) {
          this.searchCondition.createStartTime = '';
        } else {
          this.searchCondition.createStartTime = this.$moment(this.createdTime[0]).format('YYYY-MM-DD HH:mm:ss');
        }
        if (!this.createdTime[1]) {
          this.searchCondition.createEndTime = '';
        } else {
          this.searchCondition.createEndTime = this.$moment(this.createdTime[1]).format('YYYY-MM-DD HH:mm:ss');
        }
        if (!this.expectedTime[0]) {
          this.searchCondition.completeStartTime = '';
        } else {
          this.searchCondition.completeStartTime = this.$moment(this.expectedTime[0]).format('YYYY-MM-DD HH:mm:ss');
        }
        if (!this.expectedTime[1]) {
          this.searchCondition.completeEndTime = '';
        } else {
          this.searchCondition.completeEndTime = this.$moment(this.expectedTime[1]).format('YYYY-MM-DD HH:mm:ss');
        }
        this.$emit('search', this.searchCondition);
      },
      formatTime(date) {
        return date ? this.$moment(date).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
