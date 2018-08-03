<style lang="scss" scoped>
  $labelWidth: 220px;
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
        <h2 class="clearfix right-title">自动排单</h2>
        <div class="dialog-left-list">
          <div class="dialog-left-item" v-for="(item, index) in dataList" :key="item.id"
               :class="{active:activeId === index}">
            运单 {{ item.waybillNumber }}
          </div>
        </div>
        <div class="opera-btn">
          <div style="padding-bottom: 10px">合计：{{dataList.length===0?0:dataList.length}} 张运单</div>
          <el-button plain @click="saveAutoWayBill" :disabled="doing">开始自动排单</el-button>
        </div>
      </div>
      <div class="content-right min-row">
        <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
          <div class="form-header-part">
            <el-form-item label="排单模式" prop="mode">
              <el-radio-group v-model="form.mode">
                <el-radio-button label="最低成本" value="0" key="0"></el-radio-button>
                <el-radio-button label="最短距离" value="1" key="1"></el-radio-button>
                <el-radio-button label="最短时间" value="2" key="2"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
                {{pageSets[0].name}}
                <span @click="resetCarList" class="btn-circle"><i class="el-icon-t-reset"></i> </span>
                <!--<div class="search-left-box pull-right" v-show="showTypeSearch">-->
                <!--<oms-input v-model='typeTxt' placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>-->
                <!--</div>-->
              </h3>
            </div>
            <div class="content">
              <el-row v-if="loadingData">
                <el-col :span="24">
                  <oms-loading :loading="loadingData"></oms-loading>
                </el-col>
              </el-row>
              <table class="table" style="margin-bottom: 0" v-if="!loadingData">
                <thead>
                <tr>
                  <th width="5%">
                    <el-checkbox @change="checkAll" v-model="isCheckAll"></el-checkbox>
                  </th>
                  <th width="14%">车牌号</th>
                  <th width="19%">运输范围</th>
                  <th width="14%">载重(kg)</th>
                  <th width="12%">容积(m³)</th>
                  <th width="18%">最大里程数(km)</th>
                  <th width="18%">最长运输时限(h)</th>
                </tr>
                </thead>
              </table>

              <div class="m-list" v-if="!loadingData">
                <table class="table table-hover">
                  <tbody v-if="carList.length === 0">
                  <div class="empty-info">
                    暂无信息
                  </div>
                  </tbody>
                  <tbody v-if="carList.length !== 0">
                  <tr>
                    <td width="5%">
                    </td>
                    <td width="14%"></td>
                    <td width="19%" class="R">快捷修改</td>
                    <td width="14%" class="R">
                      <oms-input v-model.number="quickLoadBearing" @change="quickSetCarInfo"
                                 placeholder="载重"></oms-input>
                    </td>
                    <td width="12%" class="R">
                      <oms-input v-model.number="quickVolume" @change="quickSetCarInfo" placeholder="容积"></oms-input>
                    </td>
                    <td width="18%" class="R">
                      <oms-input v-model.number="quickMaxMileage" @change="quickSetCarInfo"
                                 placeholder="里程数"></oms-input>
                    </td>
                    <td width="18%" class="R">
                      <oms-input v-model.number="quickMaxHour" @change="quickSetCarInfo" placeholder="时限"></oms-input>
                    </td>
                  </tr>
                  <tr v-for="item in carList" :class="{active: item.isChecked}">
                    <td width="5%">
                      <el-checkbox v-model="item.isChecked" @change="changeCheckStatus(item)"></el-checkbox>
                    </td>
                    <td width="14%">{{item.plateNumber}}</td>
                    <td width="19%" class="R">
                      <div>
                       <span v-for="(type,index) in item.scopeList">
                        <dict :dict-group="'transportationCondition'" :dict-key="type"></dict><span
                         v-if="(item.scopeList.length-1)!==index">/</span>
                        </span>
                      </div>
                    </td>
                    <td width="14%" class="R">
                      <oms-input v-model.number="item.loadBearing" @change="setCarInfo(item)"
                                 @blur="formatPrice(item,'loadBearing')"></oms-input>
                      <!--{{ item.loadBearing}} <span v-if="item.loadBearing">千克</span>-->
                    </td>
                    <td width="12%" class="R">
                      <oms-input v-model.number="item.volume" @change="setCarInfo(item)"
                                 @blur="formatPrice(item,'volume')"></oms-input>
                      <!--{{ item.volume}} <span v-if="item.volume">立方米</span>-->
                    </td>
                    <td width="18%" class="R">
                      <oms-input v-model.number="item.maxMileage" @change="setCarInfo(item)"
                                 @blur="formatPrice(item,'maxMileage')"></oms-input>
                      <!--{{ item.volume}} <span v-if="item.volume">立方米</span>-->
                    </td>
                    <td width="18%" class="R">
                      <oms-input v-model.number="item.maxHour" @change="setCarInfo(item)"
                                 @blur="formatPrice(item,'maxHour')"></oms-input>
                      <!--{{ item.volume}} <span v-if="item.volume">立方米</span>-->
                    </td>
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
  import {CarArchives, TransportTask} from '@/resources';
  import utils from '@/tools/utils';

  export default {
    components: {TwoColumn},
    data () {
      return {
        loadingData: true,
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
          mode: '',
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
        quickLoadBearing: '',
        quickVolume: '',
        quickMaxMileage: '',
        quickMaxHour: ''
      };
    },
    computed: {},
    props: ['checkList'],
    watch: {
      checkList: function (val) {
        this.dataList = val;
        this.orderIdList = [];
        if (this.form.mode) {
          this.form.mode = '';
        }
        if (val.length) {
          this.dataList.forEach(val => {
            this.orderIdList.push(val.id);
          });
          this.showOrder(val[0], 0);
        }
        // 查询车辆列表
        this.getCarList();
      },
      'typeTxt': function () {
        this.getCarList();
      }
    },
    methods: {
      formatPrice (item, pop) {// 格式化单价，保留两位小数
        item[pop] = utils.autoformatDecimalPoint(item[pop] + '');
      },
      quickSetCarInfo: function () {
        if (this.quickLoadBearing) {
          this.carList.forEach(val => {
            val.loadBearing = this.quickLoadBearing;
          });
        }
        if (this.quickVolume) {
          this.carList.forEach(val => {
            val.volume = this.quickVolume;
          });
        }
        if (this.quickMaxMileage) {
          this.carList.forEach(val => {
            val.maxMileage = this.quickMaxMileage;
          });
        }
        if (this.quickMaxHour) {
          this.carList.forEach(val => {
            val.maxHour = this.quickMaxHour;
          });
        }
      },
      resetCarList: function () {
        this.getCarList();
      },
      setCarInfo: function (item) {
        this.checkCarList.forEach(val => {
          if (val.id === item.id) {
            val = item;
          }
        });
      },
      checkAll () {
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
      rowClick (item) {
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
      changeCheckStatus (item) {
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
        this.loadingData = true;
        CarArchives.queryList(param).then(res => {
          res.data.forEach(val => {
            val.isChecked = true;
            val.maxMileage = '250';
            val.volume = val.volume * 0.7;
            val.maxHour = 8;
            val.volume = val.volume.toFixed(2);
            val.loadBearing = val.loadBearing.toFixed(2);
          });
          this.isCheckAll = true;
          this.carList = res.data;
          this.carList.forEach(val => {
            let index = this.checkCarList.indexOf(val);
            if (index === -1) {
              this.checkCarList.push(val);
            }
          });
          this.loadingData = false;
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
        if (!this.orderIdList.length) {
          this.$notify.warning({
            duration: 2000,
            message: '尚未选择需要进行自动排单的运单'
          });
          return;
        }
        if (!this.form.mode) {
          this.$notify.warning({
            duration: 2000,
            message: '请选择排单模式'
          });
          return;
        }
        this.$refs['form'].validate((valid) => {
          if (valid && this.doing === false) {
            let carList = [];
            this.checkCarList.forEach(val => {
              let index = carList.indexOf(val);
              if (index === -1) {
                let car = {
                  id: val.id,
                  loadBearing: val.loadBearing,
                  volume: val.volume,
                  maxMileage: val.maxMileage,
                  maxHour: val.maxHour
                };
                carList.push(car);
              }
            });
            let mode = '';
            if (this.form.mode === '最低成本') {
              mode = '0';
            }
            if (this.form.mode === '最短距离') {
              mode = '1';
            }
            if (this.form.mode === '最短时间') {
              mode = '2';
            }
            let param = Object.assign({}, {
              waybillList: this.orderIdList,
              carList: carList,
              mode: mode
            });
            this.doing = true;
            this.$store.commit('initPrint', {
              text: '自动排单中',
              isPrinting: true,
              moduleId: '/document/transport'
            });
            TransportTask.autoCreateWayBill(param).then(res => {
              this.$notify.success({
                duration: 2000,
                message: '自动排单成功'
              });
              this.$store.commit('initPrint', {
                isPrinting: false,
                moduleId: '/document/transport'
              });
              this.doing = false;
              this.$emit('change', res.data);
              this.$emit('right-close');
            }).catch(error => {
              this.$notify.error({
                duration: 2000,
                message: error.response && error.response.data && error.response.data.msg || '自动排单失败'
              });
              this.$store.commit('initPrint', {
                isPrinting: false,
                moduleId: '/document/transport'
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
      selectTab (item) {
        this.currentTab = item;
      },
      close () {
        this.$emit('right-close');
      }
    }
  };
</script>

