<style lang="scss" scoped>
  $leftWidth: 190px;
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

  .ui-right {
    height: 430px;
    overflow: auto;
    background: #eee;
    border-radius: 4px;
    padding-top: 4px;

    .show-item {
      padding: 3px 10px;
    }
  }

  .part-top {
    margin: 10px;

    .title {
      margin: 10px 0;
    }
  }

  .correct-color {
    color: #3DBE2E;
  }

  .error-color {
    color: #e00000;
  }

  .el-form {
    .el-col {
      padding-right: 20px;
    }
  }

  .ui-left {
    &.error {
      max-height: 200px;
    }

    &.normal {
      max-height: 200px;
    }
  }

</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">复核-扫码</h2>
        <div class="opera-btn">
          <perm label="stock-in-collection-error-code">
            <div type="primary" class="btn" @click="reWrite" :class="{'disable':doing3}" v-show="type===1">一键补录</div>
          </perm>
          <!--          <div type="primary" class="btn" @click="reviewErrorCode" :class="{'disable':doing2}">重新复核错误追溯码</div>-->
          <!--          <div type="primary" class="btn" @click="submit" :class="{'disable':doing}">提交追溯码</div>-->
          <div type="primary" class="btn" @click="reviewPass" :class="{'disable':doing1}">完成复核</div>
          <!--<el-button disabled="">通过复核</el-button>-->
        </div>
      </div>
      <div class="content-right">
        <h3>入库任务复核</h3>

        <el-form ref="form" :model="form" label-width="120px" style="height: calc(100% - 60px)">
          <el-row style="margin-bottom: 10px">
            <el-col :span="8">
              <span v-show="leftErrorList.length"><el-tag type="danger">异常追溯码</el-tag></span>
              <span v-show="leftNumberList.length && !leftErrorList.length"><el-tag type="success">正常</el-tag></span>
            </el-col>
            <el-col :span="8">
              <span>【添加追溯码】</span>
            </el-col>
            <el-col :span="8">
            </el-col>
          </el-row>
          <el-row style="height: calc(100% - 22px)">
            <el-col :span="8" style="height: 100%">
              <div v-if="leftErrorList.length" style="height:100%;">
                <ul class="show-list ui-left error" style="height: 100%">
                  <li v-if="loadingData" style="margin-top:5px;margin-left: 10px;font-size: 12px">加载中...</li>
                  <li class="show-item" v-for="s in leftErrorList">
                    <el-tooltip v-if="s.exceptionResult != null " class="item" effect="dark"
                                :content="s.exceptionResultTitle" placement="right">
                      <span>
                        <el-tag type="warning" v-if="s.codeType ===2">未知</el-tag>
                        <el-tag type="info" v-if="s.packageScheme!=null">{{s.packageScheme}}级</el-tag>
                      {{ s.code }}
                      </span>
                    </el-tooltip>
                    <span v-else>
                        <el-tag type="warning" v-if="s.codeType ===2">未知</el-tag>
                        <el-tag type="info" v-if="s.packageScheme!=null">{{s.packageScheme}}级</el-tag>
                      {{ s.code }}
                    </span>
                    <i class="el-icon-t-correct correct-color" v-if="s.status === 1"></i>
                    <i class="el-icon-t-error error-color" v-if="s.status === 2"></i>
                    <span class="delete-remove" @click="removeNumberItem(s)">X</span>
                  </li>
                </ul>
                <el-button :loading="doing2" @click="reviewErrorCode" style="margin-top: 10px" type="primary">重试异常追溯码
                </el-button>

                <div style="margin-top: 10px;margin-bottom: 10px">
                  <span v-show="leftNumberList.length"><el-tag type="success">正常追溯码</el-tag></span>
                </div>
                <ul class="show-list ui-left normal">
                  <li class="show-item" v-for="s in leftNumberList">
                    <el-tooltip v-if="s.exceptionResult != null " class="item" effect="dark"
                                :content="s.exceptionResultTitle" placement="right">
                      <span>
                        <el-tag type="warning" v-if="s.codeType ===2">未知</el-tag>
                        <el-tag type="info" v-if="s.packageScheme!=null">{{s.packageScheme}}级</el-tag>
                      {{ s.code }}
                      </span>
                    </el-tooltip>
                    <span v-else>
                        <el-tag type="warning" v-if="s.codeType ===2">未知</el-tag>
                        <el-tag type="info" v-if="s.packageScheme!=null">{{s.packageScheme}}级</el-tag>
                      {{ s.code }}
                    </span>

                    <i class="el-icon-t-correct correct-color" v-if="s.status === 1"></i>
                    <i class="el-icon-t-error error-color" v-if="s.status === 2"></i>
                    <span class="delete-remove" @click="removeNumberItem(s)">X</span>
                  </li>
                </ul>
                <GoodsCount :list="leftNumberList"></GoodsCount>
              </div>
              <div v-else style="height: 100%">
                <ul class="show-list ui-left" style="height: 100%">
                  <li class="show-item" v-for="s in leftNumberList">
                    <el-tooltip v-if="s.exceptionResult != null " class="item" effect="dark"
                                :content="s.exceptionResultTitle" placement="right">
                      <span>
                        <el-tag type="warning" v-if="s.codeType ===2">未知</el-tag>
                        <el-tag type="info" v-if="s.packageScheme!=null">{{s.packageScheme}}级</el-tag>
                      {{ s.code }}
                      </span>
                    </el-tooltip>
                    <span v-else>
                       <el-tag type="warning" v-if="s.codeType ===2">未知</el-tag>
                      <el-tag type="info" v-if="s.packageScheme!=null">{{s.packageScheme}}级</el-tag>
                      {{ s.code }}
                    </span>
                    <i class="el-icon-t-correct correct-color" v-if="s.status === 1"></i>
                    <i class="el-icon-t-error error-color" v-if="s.status === 2"></i>
                    <span class="delete-remove" @click="removeNumberItem(s)">X</span>
                  </li>
                </ul>
                <GoodsCount :list="leftNumberList"></GoodsCount>
              </div>
            </el-col>
            <el-col :span="8" style="height: 100%">
              <el-input type="textarea" v-model="form.number" class="input-width max-height-input" :rows="20"
                        @change="formatNumberToAry"></el-input>
              <el-button type="primary" @click="submit" :loading="doing" style="margin-top: 10px">校验追溯码</el-button>
            </el-col>
            <el-col :span="8" v-if="rightNumberList.length">
              <ul class="show-list ui-right" v-show="rightNumberList.length">
                <li class="show-item" v-for="i in rightNumberList">{{ i }}</li>
              </ul>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {http, InHouseWork, Wave} from '@/resources';
import utils from '@/tools/utils';
import GoodsCount from '../scan-code/GoodsCount';

export default {
    components: {
      GoodsCount
    },
    props: {
      orderId: {
        'type': String,
        'default': ''
      },
      bizType: {
        'type': String,
        'default': ''
      },
      showPartIndex: String,
      type: Number
    },
    data() {
      return {
        form: {
          number: '',
          series: ''
        },
        rightNumberList: [],
        rightSeriesList: [],
        leftNumberList: [],
        leftSeriesList: [],
        leftErrorList: [],
        loadingData: false,
        doing: false,
        doing1: false,
        doing2: false,
        doing3: false,
        errorType: utils.errorType
      };
    },
    watch: {
      showPartIndex: function (val) {
        this.resetParam();
        if (val !== '1') return;
        this.queryCodes();
      }
    },
    mounted() {

    },
    methods: {
      resetParam() {
        this.rightNumberList = [];
        this.rightSeriesList = [];
        this.leftErrorList = [];
        this.form.number = '';
        this.form.series = '';
      },
      submit() {
        let ary1 = [];
        this.rightNumberList.slice().forEach(i => {
          ary1.push({
            code: i
          });
        });
        if (ary1.length === 0) {
          this.$notify.info({
            message: '请输入追溯码'
          });
          return;
        }
        if (this.doing) return;
        this.doing = true;
        InHouseWork.reviewScan(this.orderId, ary1).then(() => {
          this.$notify.success({
            message: '提交成功'
          });
          this.doing = false;
          this.queryCodes();
          this.resetParam();
        }).catch(error => {
          this.doing = false;
          this.queryCodes();
          this.resetParam();
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '提交失败'
          });
        });
      },
      queryCodes() { // 查询追溯码
        this.loadingData = true;
        InHouseWork.queryCodes(this.orderId).then(res => {
          this.leftNumberList = res.data.packageDtoList || [];
          this.leftErrorList = res.data.errorCodeList || [];
          this.loadingData = false;
        });
      },
      reviewPass: function () {
        if (this.doing1) return;
        this.doing1 = true;
        // 校验追溯码
        let flag = this.leftErrorList.some(v => v.exceptionResult === '9') && this.bizType === '1-0';
        if (flag) {
          this.$confirm(`业务追溯指向单位信息与订单不符合，是否继续操作？`, '', {
            confirmButtonText: '确认操作',
            cancelButtonText: '取消操作',
            type: 'warning'
          }).then(() => {
            let url = '/order-stock-task/' + this.orderId + '/review/operate?flag=true';
            http.put(url, {}).then(() => {
              this.$notify.success({
                message: '通过复核成功'
              });
              this.doing1 = false;
              this.$emit('close');
            }).catch(error => {
              this.doing1 = false;
              this.$notify.error({
                message: error.response && error.response.data && error.response.data.msg || '通过复核失败'
              });
            });
          }).catch(() => {
            this.doing1 = false;
          });
        } else {
          InHouseWork.assignPlace(this.orderId).then(res => {
            this.$notify.success({
              message: '通过复核成功'
            });
            this.doing1 = false;
            this.$emit('close');
          }).catch(error => {
            this.doing1 = false;
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '通过复核失败'
            });
          });
        }
      },
      reviewErrorCode() {
        this.doing2 = true;
        this.$http.put(`/order-stock-task/${this.orderId}/review/error`).then(res => {
          this.$notify.success({
            message: '复核错误追溯码已完成'
          });
          this.doing2 = false;
          this.queryCodes();
        }).catch(error => {
          this.doing2 = false;
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '复核错误追溯码失败'
          });
        });
      },
      reWrite() {
        this.doing3 = true;
        this.$http.put(`order-stock-task/${this.orderId}/collection/error`).then(res => {
          this.$notify.success({
            message: '补录完成'
          });
          this.doing3 = false;
          this.queryCodes();
        }).catch(error => {
          this.doing3 = false;
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '补录失败'
          });
        });
      },
      removeNumberItem(item) {
        Wave.deleteCode(item.logId).then(res => {
          this.leftNumberList = this.leftNumberList.filter(f => f.logId !== item.logId);
          this.leftErrorList = this.leftErrorList.filter(f => f.logId !== item.logId);
        });
      },
      removeSeriesItem(item) {
        Wave.deleteCode(item.logId).then(res => {
          let index = this.leftSeriesList.indexOf(item);
          this.leftSeriesList.splice(index, 1);
        });
      },
      formatNumberToAry(value) {
        this.rightNumberList = value.split(/[\n,\s，]/g).filter(i => i);
      },
      formatSeriesToAry(value) {
        this.rightSeriesList = value.split(/[\n,\s，]/g).filter(i => i);
      },
      countGoods(list) {
        let idObj = {};
        let countObj = {};
        list.forEach(v => {
          if (v.goodsName == null) {
            return;
          }
          if (countObj[v.goodsName]) {
            countObj[v.goodsName] = 1;
          } else {
            countObj[v.goodsName]++;
          }
        });
        console.log(countObj);
        return countObj;
      }
    }
  };

</script>
