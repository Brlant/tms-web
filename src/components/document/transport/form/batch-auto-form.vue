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
    margin-bottom: 0px;
  }
</style>
<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">批量自动排单</h2>
        <div class="opera-btn">
          <div type="primary" class="btn" @click="saveAutoWayBill" :disabled="doing">开始自动排单</div>
        </div>
      </div>
      <div class="content-right min-row">
        <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
          <div class="form-header-part">
            <el-form-item label="排单模式" prop="mode">
              <el-radio-group v-mode="form.mode">
                <el-radio-button label="最低成本" value="0" key="0"></el-radio-button>
                <el-radio-button label="最短距离" value="1" key="1"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
                {{pageSets[0].name}}
                <!--<div class="search-left-box pull-right" v-show="showTypeSearch">-->
                <!--<oms-input v-model='typeTxt' placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>-->
                <!--</div>-->
              </h3>
            </div>
            <div class="content">
              <table class="table" style="margin-bottom: 0">
                <thead>
                <tr>
                  <th width="8%">
                    <el-checkbox @change="checkAll" v-model="isCheckAll"></el-checkbox>
                  </th>
                  <th width="14%">车牌号</th>
                  <th width="30%">运输范围</th>
                  <th width="24%">载重</th>
                  <th width="24%">容积</th>
                </tr>
                </thead>
              </table>

              <div class="m-list">
                <table class="table table-hover">
                  <tbody v-if="carList.length === 0">
                  <div class="empty-info">
                    暂无信息
                  </div>
                  </tbody>
                  <tbody v-if="carList.length !== 0">
                  <tr v-for="item in carList" :class="{active: item.isChecked}" @click.stop.prevent="rowClick(item)">
                    <td width="8%">
                      <el-checkbox v-model="item.isChecked" @change="changeCheckStatus(item)"></el-checkbox>
                    </td>
                    <td width="14%">{{item.plateNumber}}</td>
                    <td width="30%" class="R">
                      <div>
                       <span v-for="(type,index) in item.scopeList">
                        <dict :dict-group="'transportationCondition'" :dict-key="type"></dict><span
                         v-if="(item.scopeList.length-1)!==index">/</span>
                        </span>
                      </div>
                    </td>
                    <td width="24%" class="R">
                      {{ item.loadBearing}} <span v-if="item.loadBearing">千克</span>
                    </td>
                    <td width="24%" class="R"> {{ item.volume}} <span v-if="item.volume">立方米</span></td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import TwoColumn from '@dtop/dtop-web-common/packages/two-column';
  import {CarArchives, TmsWayBill, TransportTask} from '@/resources';

  export default {
    components: {TwoColumn},
    data() {
      return {
        isCheckAll: false,
        showTypeSearch: false,
        typeTxt: '',
        span: 7,
        dataList: [],
        times: [],
        pageSets: [
          {name: '车辆列表', key: 0}
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
        orderIdList: [],
        rules: {
          mode: {required: true, message: '请选择排单模式', trigger: 'change'}
        },
        activeId: '',
        doing: false,
        carList: [],
        checkCarList: [],
        condition: {
          status: '-2',
          waybillNumber: '',
          waybillType: '',
          shipmentWay: '',
          serviceType: '',
          senderId: '',
          receiverId: '',
          startTime: '',
          endTime: ''
        }
      };
    },
    computed: {},
    props: ['filters'],
    watch: {
      filters: function (val) {
        if (this.form.mode) {
          this.form.mode = '';
        }
        this.condition = val;
        // 查询车辆列表
        this.getCarList();
      },
      'typeTxt': function () {
        this.getCarList();
      }
    },
    methods: {
      checkAll() {
        // 全选
        if (this.isCheckAll) {
          this.carList.forEach(item => {
            item.isChecked = true;
            let index = this.checkCarList.indexOf(item);
            if (index === -1) {
              this.checkCarList.push(item);
            }
          });
        } else {
          this.carList.forEach(item => {
            item.isChecked = false;
          });
          this.checkCarList = [];
        }
      },
      rowClick(item) {
        item.isChecked = !item.isChecked;
        // this.setChecked(item);
        this.changeCheckStatus(item);
      },
      setChecked: function (item) {
        if (item.isChecked) {
          // 勾选的数据置顶
          let itemIndex = this.carList.indexOf(item);
          this.carList.splice(itemIndex, 1);
          this.carList.splice(0, 0, item);
        } else {
          // 勾选的数据置顶
          let itemIndex = this.carList.indexOf(item);
          this.carList.splice(itemIndex, 1);
          this.carList.push(item);
        }
      },
      changeCheckStatus(item) {
        let index = this.checkCarList.indexOf(item);
        if (item.isChecked) {
          if (index === -1) {
            this.checkCarList.push(item);
          }
        } else {
          this.checkCarList.splice(index, 1);
        }
      },
      getCarList: function () {
        this.checkCarList = [];
        this.carList = [];
        let param = Object.assign({}, {
          keyword: this.typeTxt
        });
        CarArchives.queryList(param).then(res => {
          res.data.forEach(val => {
            val.isChecked = true;
          });
          this.isCheckAll = true;
          this.carList = res.data;
          this.carList.forEach(val => {
            let index = this.checkCarList.indexOf(val);
            if (index === -1) {
              this.checkCarList.push(val);
            }
          });

        });
      },
      saveAutoWayBill: function () {
        if (!this.checkCarList.length) {
          this.$notify.warning({
            duration: 2000,
            message: '请勾选车辆'
          });
          return;
        }
        this.$refs['form'].validate((valid) => {
          if (valid && this.doing === false) {
            let carIdList = [];
            this.checkCarList.forEach(val => {
              let index = carIdList.indexOf(val.id);
              if (index === -1) {
                carIdList.push(val.id);
              }
            });
            let param = Object.assign({}, {
              carList: carIdList
            }, this.condition);
            this.doing = true;
            TransportTask.batchAutoCreateWayBill(param).then(res => {
              this.$notify.success({
                duration: 2000,
                message: '批量自动排单成功'
              });
              this.doing = false;
              this.$emit('change', this.form);
              this.$emit('right-close');
            }).catch(error => {
              this.$notify.error({
                duration: 2000,
                message: error.response && error.response.data && error.response.data.msg || '批量自动排单成功'
              });
              this.doing = false;
            });
          }
        });
      },
      showOrder: function (item, index) {
        if (item.id) {
          this.activeId = index;
        }
      },
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('right-close');
      }
    }
  };
</script>

