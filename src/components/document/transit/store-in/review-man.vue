<style lang="scss" scoped>
  @import '~@/assets/scss/mixins';

  $leftWidth: 260px;
  .content-part {
    .content-left {
      width: $leftWidth;
    }

    .content-right {
      > h3 {
        left: $leftWidth;
      }

      left: $leftWidth;
    }
  }

  .btn-bg-mr {
    margin-left: 10px;
    margin-right: 15px;
    background: #fff;
  }

  .content-padding {
    padding-left: 40px;
    padding-right: 40px;
  }

  .search-btn {
    width: 200px;
    margin: 10px 20px;
    background: #fff;

    input {
      width: 160px;
    }

    &:hover {
      background: #fff;
    }
  }

  .ul-position {
    height: 200px;
  }

  .show-list {
    .show-item {
      cursor: pointer;
      padding-left: 10px;
      margin-bottom: 8px;

      &:hover, &.active {
        color: $activeColor;

        .btn-circle {
          background: $activeColor;
          color: #fff;
        }
      }
    }
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left text-center">
        <h2 class="clearfix right-title">指派复核人员</h2>
        <span class="btn-search-toggle open search-btn clearfix">
                  <single-input placeholder="请输入复核员名字搜索" :showFocus="true" v-model="keyWord"></single-input>
                  <i class="el-icon-t-search"></i>
        </span>
        <ul class="show-list ul-position">
          <li class="show-item" v-for="item in operators" :key="item.id">
            <el-radio v-model="activeId" :label="item.id" @click.native="showTasks(item)">{{ item.name }}</el-radio>
          </li>
        </ul>
        <div class="opera-btn">
          <div type="primary" class="btn" @click="onSubmit">指派任务</div>
        </div>
      </div>
      <div class="content-right content-padding">
        <h3></h3>
        <div v-if="!activeId" class="empty-info">请选择复核员</div>
        <div v-else>
          <span v-show="operatorName">{{ operatorName }}的任务清单</span>
          <div class="order-list" style="margin-top: 20px">
            <el-row class="order-list-header">
              <el-col :span="5">ID</el-col>
              <el-col :span="6">操作类型</el-col>
              <el-col :span="3">指派人</el-col>
              <el-col :span="4">指派时间</el-col>
              <el-col :span="3">作业量</el-col>
              <el-col :span="3">状态</el-col>
            </el-row>
            <el-row v-if="loadingData">
              <el-col :span="24">
                <oms-loading :loading="loadingData"></oms-loading>
              </el-col>
            </el-row>
            <el-row v-else-if="tasks.length == 0">
              <el-col :span="24">
                <div class="empty-info">
                  暂无信息
                </div>
              </el-col>
            </el-row>
            <div v-else class="order-list-body flex-list-dom">
              <div class="order-list-item order-list-item-bg" v-for="item in tasks">
                <el-row>
                  <el-col :span="5">
                    <span v-show="item.objectType === 'order' ">订单ID：</span>
                    <span v-show="item.objectType === 'waveTask' ">波次号：</span>
                    {{ item.objectId }}
                  </el-col>
                  <el-col :span="6">
                    {{ item.actionTitle }}
                  </el-col>
                  <el-col :span="3">
                    {{ item.creatorName }}
                  </el-col>
                  <el-col :span="4">
                    {{ item.createTime | date }}
                  </el-col>
                  <el-col :span="3">
                    {{ item.count }}
                  </el-col>
                  <el-col :span="3">
                    {{ taskStatus[item.status] }}
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="text-center" v-show="tasks.length && !loadingData">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="pager.currentPage"
                           :page-sizes="[10,20,50,100]" :page-size="pager.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="pager.count">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {InHouseWork, InWork} from '@/resources';
import utils from '@/tools/utils';

export default {
    props: {
      orderId: {
        type: String
      },
      showPartIndex: String
    },
    data() {
      return {
        activeId: '',
        keyWord: '',
        operators: [],
        loadingData: false,
        tasks: [],
        taskType: utils.taskType,
        taskStatus: utils.taskStatus,
        operatorName: '',
        form: {
          userId: ''
        },
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
        }
      };
    },
    watch: {
      keyWord() {
        this.queryOperator();
      },
      showPartIndex(val) {
        this.operators = [];
        this.keyWord = '';
        this.tasks = [];
        this.operatorName = '';
        this.activeId = '';
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pager.pageSize = val;
        window.localStorage.setItem('currentPageSize', val);
        this.getOneTacks(1);
      },
      handleCurrentChange(val) {
        this.getOneTacks(val);
      },
      showTasks(item) {
        this.activeId = item.id;
        this.operatorName = item.name;
        this.getOneTacks(1);
      },
      queryOperator() { // 查询操作人员列表
        let params = {
          keyWord: this.keyWord,
          pageSize: 5
        };
        InWork.queryOperator(params).then(res => {
          this.operators = res.data.list;
          this.tasks = [];
          this.activeId = '';
          this.operatorName = '';
          if (!this.operators.length) return;
          this.activeId = this.operators[0].id;
          this.operatorName = this.operators[0].name;
          this.getOneTacks(1);
        });
      },
      getOneTacks(pageNo) { // 得到任务列表
        this.tasks = [];
        if (!this.activeId) return;
        this.pager.currentPage = pageNo;
        let params = {
          operator: this.activeId,
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          status: 0
        };
        this.loadingData = true;
        InWork.queryOperatorOrders(params).then(res => {
          this.tasks = res.data.list;
          this.loadingData = false;
          this.pager.count = res.data.count;
        });
      },
      onSubmit() {
        this.form.userId = this.activeId;
        if (!this.form.userId) {
          this.$notify.info({
            message: '请选择复核人员'
          });
          return;
        }
        InHouseWork.allotReviewer(this.orderId, this.form).then(() => {
          this.$notify.success({
            message: '指派复核人员成功'
          });
          this.$emit('changeStatus', this.orderId);
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '指派复核人员失败'
          });
        });
      }
    }
  };
</script>
