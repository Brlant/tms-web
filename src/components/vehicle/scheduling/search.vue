<template>
  <search-template :isShow="showSearch" @search="search" @reset="reset" @isShow="isShow">
    <template slot="title">排单查询</template>
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
                         v-model="searchCondition.createdBy" popperClass="good-selects">
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
            <oms-form-row label="创建时间" :span="4">
              <el-date-picker v-model="createdTime" :default-time="['00:00:00', '23:59:59']" type="datetimerange"
                              placeholder="请选择">
              </el-date-picker>
            </oms-form-row>
          </el-col>
          <el-col :span="10">
            <oms-form-row label="结束时间" :span="4">
              <el-date-picker v-model="expectedTime" :default-time="['00:00:00', '23:59:59']" type="datetimerange"
                              placeholder="请选择">
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
  import {User} from '@/resources';

  export default {
    data: function () {
      return {
        searchCondition: {
          createdBy: '',
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
          createdBy: '',
          createStartTime: '',
          createEndTime: '',
          completeStartTime: '',
          completeEndTime: ''
        };
        this.createdTime = '';
        this.expectedTime = '';
        this.$emit('search', this.searchCondition);
      },
      search() {
        this.searchCondition.createStartTime = this.$formatAryTime(this.createdTime, 0, 'YYYY-MM-DD HH:mm:ss');
        this.searchCondition.createEndTime = this.$formatAryTime(this.createdTime, 1, 'YYYY-MM-DD HH:mm:ss');
        this.searchCondition.completeStartTime = this.$formatAryTime(this.expectedTime, 0, 'YYYY-MM-DD HH:mm:ss');
        this.searchCondition.completeEndTime = this.$formatAryTime(this.expectedTime, 1, 'YYYY-MM-DD HH:mm:ss');
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
