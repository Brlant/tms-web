<style lang="scss" scoped>
  @import '~@/assets/scss/mixins';

  $leftWidth: 0;
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

  .el-icon {
    font-size: 18px;
    cursor: pointer;
    margin: 0 5px;

    &.plus {
      color: $activeColor;
    }

    &.remove {
      color: $error-color;
    }
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-right content-padding">
        <h3>整件任务拆分</h3>
        <div>
          <oms-row label="任务号" :span="5">{{currentItem.id}}</oms-row>
          <oms-row label="订单号" :span="5">{{currentItem.orderNo}}</oms-row>
          <oms-row label="货主" :span="5">{{currentItem.orgName}}</oms-row>
          <oms-row label="货品" :span="5">{{currentItem.goodsName}}</oms-row>
          <oms-row label="规格" :span="5">{{currentItem.specification}}</oms-row>
          <oms-row label="生产单位" :span="5">{{currentItem.factoryName}}</oms-row>
          <oms-row label="批号" :span="5">{{currentItem.batchNumber}}</oms-row>
          <oms-row label="原整件任务整件数" :span="6">{{currentItem.count}}</oms-row>

          <div class="flex-list-dom mt-10">
            <el-row>
              <el-col :span="18">
                <oms-form-row label="原任务保留件数" :span="7" style="margin-bottom: 0">
                  <oms-input type="number" v-model.number="count" @blur="validCount(count)"></oms-input>
                </oms-form-row>
              </el-col>
            </el-row>
            <el-row v-for="(item, index) in taskList" :key="index" class="mt-10">
              <el-col :span="18">
                <oms-form-row :label="`新任务${index+1}整件数`" :span="7" style="margin-bottom: 0">
                  <oms-input type="number" v-model.number="item.count" @blur="validCount(item)"></oms-input>
                </oms-form-row>
              </el-col>
              <el-col :span="6" style="padding-left: 20px">
                <i class="el-icon plus el-icon-circle-plus-outline" @click="add"></i>
                <i class="el-icon remove el-icon-remove-outline" @click="remove(item)" v-show="taskList.length > 1"></i>
              </el-col>
            </el-row>
          </div>
        </div>
        <oms-row label="" :span="5" style="margin-top: 20px">
          <el-button type="primary" :disabled="doing" @click="onSubmit">保存
          </el-button>
        </oms-row>
      </div>
    </div>
  </div>
</template>
<script>

  export default {
    props: {
      currentItem: Object,
      showPartIndex: String
    },
    data() {
      return {
        count: '',
        taskList: [],
        doing: false
      };
    },
    watch: {
      keyWord() {
        this.queryOperator();
      },
      showPartIndex(val) {
        this.taskList = [{count: ''}];
      }
    },
    methods: {
      add() {
        this.taskList.push({count: ''});
      },
      remove(item) {
        this.taskList = this.taskList.filter(f => f !== item);
      },
      validCount(item) {
        if (typeof item === 'object') {
          if (item.count && !/^\d+$/.test(item.count + '')) return this.$notify.info('请输入正整数');
        } else {
          if (this.count && !/^\d+$/.test(this.count + '')) return this.$notify.info('请输入正整数');
        }
      },
      onSubmit() {
        if (this.doing) return;
        if (!this.count) {
          return this.$notify.info('原任务保留件数必须大于0');
        }
        let totalCount = this.count || 0;
        this.taskList.forEach(i => {
          totalCount += (i.count || 0);
        });
        if (totalCount !== this.currentItem.count) {
          return this.$notify.info('原任务保留件数与新任务合计数量与原任务整件数不符');
        }
        let valid = true;
        if (this.count && !/^\d+$/.test(this.count + '')) {
          valid = false;
        }
        this.taskList.forEach(item => {
          if (item.count && !/^\d+$/.test(item.count + '')) {
            valid = false;
          }
        });
        if (!valid) return this.$notify.info('请输入正整数');
        let list = this.taskList.filter(f => f.count).map(m => m.count);
        if (!list.length) {
          return this.$notify.info('请输入新任务整件数');
        }
        let obj = {
          count: this.count || 0,
          list: list,
          taskId: this.currentItem.id
        };
        this.doing = true;
        this.$http.put('/order-stock-task/dismantling', obj).then(() => {
          this.$notify.success({
            message: '拆分完成'
          });
          this.doing = false;
          this.$emit('right-close');
        }).catch(error => {
          this.doing = false;
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '拆分失败'
          });
        });
      }
    }
  };
</script>
