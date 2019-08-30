<style lang="scss" scoped>
  .good-selects {
    .el-select-dropdown__item {
      height: auto;
    }
  }
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">{{showTitle}}车辆档案</template>
    <template slot="btn">
      <el-button plain @click="onSubmit('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content">
            <two-column>
              <el-form-item slot="left" label="车牌号" prop="carDto.plateNumber">
                <oms-input type="text" v-model="form.carDto.plateNumber" placeholder="请输入车牌号"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="车型">
                <el-select placeholder="请选择车型" v-model="form.carDto.type">
                  <el-option :label="item.label" :value="item.key" :key="item.key"
                             v-for="item in carTypeList"></el-option>
                </el-select>
              </el-form-item>
            </two-column>
            <el-form-item slot="left" label="归属公司">
              <el-select filterable remote placeholder="请输入名称/拼音首字母缩写/系统代码搜索归属公司" :remote-method="filterCustomer"
                         :clearable="true"
                         v-model="form.carDto.ascriptionCompany" popperClass="good-selects" style="width: 100%">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in customerList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.name}}</span>
                  </div>
                  <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                      <span>系统代码:</span>{{org.manufacturerCode}}
                    </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item slot="right" label="默认司机">
              <el-select filterable remote placeholder="请输入名称/拼音首字母缩写搜索司机" :remote-method="filterUser"
                         :clearable="true"
                         v-model="form.carDto.defaultDriver" popperClass="good-selects">
                <el-option :value="user.id" :key="user.id" :label="user.name" v-for="user in userList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{user.name}}</span>
                    <span class="pull-right">
                        {{user.companyDepartmentName}}
                      </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <two-column>
              <el-form-item slot="left" label="车辆承重" prop="carDto.loadBearing">
                <oms-input type="number" v-model.number="form.carDto.loadBearing" min="0" placeholder="请输入车辆承重">
                  <template slot="append">千克</template>
                </oms-input>
              </el-form-item>
              <el-form-item slot="right" label="核定载人数">
                <oms-input type="number" v-model="form.carDto.authorizedNumber" :min="0" placeholder="请输入核定载人数">
                  <template slot="append">人</template>
                </oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="车厢长度" prop="carDto.carriageLength">
                <oms-input type="number" v-model.number="form.carDto.carriageLength" min="0" placeholder="请输入车厢长度"
                           @blur="calculateVolume(form.carDto)">
                  <template slot="append">米</template>
                </oms-input>
              </el-form-item>
              <el-form-item slot="right" label="车厢宽度" prop="carDto.carriageWidth">
                <oms-input type="number" v-model.number="form.carDto.carriageWidth" min="0" placeholder="请输入车厢宽度"
                           @blur="calculateVolume(form.carDto)">
                  <template slot="append">米</template>
                </oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="车厢高度" prop="carDto.carriageHeight">
                <oms-input type="number" v-model.number="form.carDto.carriageHeight" min="0" placeholder="请输入车厢高度"
                           @blur="calculateVolume(form.carDto)">
                  <template slot="append">米</template>
                </oms-input>
              </el-form-item>
              <el-form-item slot="right" label="车厢容积">
                <oms-input type="number" v-model="form.carDto.volume" :disabled="true">
                  <template slot="append">立方米</template>
                </oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="每公里运费" prop="carDto.perFreight">
                <oms-input type="text" v-model="form.carDto.perFreight" min="0" placeholder="请输入车厢高度"
                           @blur="formatPrice">
                  <template slot="prepend">¥</template>
                </oms-input>
              </el-form-item>
              <el-form-item slot="right" label="起步运费" prop="carDto.freight">
                <oms-input type="text" v-model="form.carDto.freight" @blur="formatPrice">
                  <template slot="prepend">¥</template>
                </oms-input>
              </el-form-item>
            </two-column>
            <el-form-item label="运输范围">
              <el-select placeholder="请选择运输范围" v-model="form.carDto.scopeList" multiple>
                <el-option :label="item.label" :value="item.key" :key="item.key"
                           v-for="item in transportScope"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">
              {{pageSets[1].name}}</h3>
          </div>
          <div class="content">
            <two-column>
              <el-form-item slot="left" label="车辆品牌">
                <oms-input type="text" v-model="form.carDetailDto.brand" placeholder="请输入车辆品牌"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="车辆发动机号">
                <oms-input type="text" v-model="form.carDetailDto.engineNumber" placeholder="请输入车辆发动机号"></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="车辆识别代码">
                <oms-input type="text" v-model="form.carDetailDto.identificationNumber"
                           placeholder="请输入车辆识别代码"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="车辆注册日期">
                <el-date-picker
                  v-model="form.carDetailDto.createDate"
                  type="date"
                  placeholder="选择车辆注册日期" format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="车辆发证日期">
                <el-date-picker
                  v-model="form.carDetailDto.issuingDate"
                  type="date"
                  placeholder="选择车辆发证日期" format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
              <el-form-item slot="right" label="检验有效期">
                <el-date-picker
                  v-model="form.carDetailDto.checkValidityDate"
                  type="date"
                  placeholder="选择检验有效期" format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="强制报废日">
                <el-date-picker
                  v-model="form.carDetailDto.forciblyDiscardedDay"
                  type="date"
                  placeholder="选择强制报废日" format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </two-column>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[2].key === currentTab.key}">
              {{pageSets[2].name}}</h3>
          </div>
          <div class="content">
            <el-form-item label="保险公司">
              <oms-input type="text" v-model="form.carDetailDto.insuranceCompany" placeholder="请输入保险公司"></oms-input>
            </el-form-item>
            <two-column>
              <el-form-item slot="left" label="交强险保单号">
                <oms-input type="text" v-model="form.carDetailDto.ctaliNumber" placeholder="请输入车辆交强险保单号"></oms-input>
              </el-form-item>
              <el-form-item slot="right" class="acrony-my" label="交强险截止日期">
                <el-date-picker
                  v-model="form.carDetailDto.ctaliEndDate"
                  type="date"
                  placeholder="选择交强险截止日期" format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" class="acrony-my" label="第三责任险保单号">
                <oms-input type="text" v-model="form.carDetailDto.thirdPartyInsuranceNumber"
                           placeholder="请输入车辆第三责任险保单号"></oms-input>
              </el-form-item>
              <el-form-item slot="right" class="acrony-my" label="第三责任险截止日期">
                <el-date-picker
                  v-model="form.carDetailDto.thirdPartyInsuranceEndDate"
                  type="date"
                  placeholder="选择第三责任险截止日期" format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </two-column>
          </div>
          <div class="hr mb-10"></div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {BaseInfo, CarArchives, User} from '@/resources';
  import TwoColumn from '@dtop/dtop-web-common/packages/two-column';
  import utils from '@/tools/utils';

  export default {
    components: {TwoColumn},
    data: function () {
      let checkPlateNumber = (rule, value, callback) => {
        if (value !== '' && value !== null) {
          CarArchives.checkPlateNumber({plateNumber: value, id: this.form.carDto.id}).then(val => {
            if (!val.data['validatePlateNumber']) {
              callback(new Error('输入的车牌号已存在,请重新输入'));
            } else {
              callback();
            }
          });
        } else {
          callback();
        }
      };
      return {
        rules: {
          'carDto.plateNumber': [
            {required: true, message: '请输入车牌号', trigger: 'blur'},
            {validator: checkPlateNumber, trigger: 'blur'}
          ],
          'carDto.carriageLength': [
            {required: true, type: 'number', message: '请输入车厢长度', trigger: 'blur'}
          ],
          'carDto.carriageWidth': [
            {required: true, type: 'number', message: '请输入车厢宽度', trigger: 'blur'}
          ],
          'carDto.carriageHeight': [
            {required: true, type: 'number', message: '请输入车厢高度', trigger: 'blur'}
          ],
          'carDto.loadBearing': [
            {required: true, type: 'number', message: '请输入车辆承重', trigger: 'blur'}
          ],
          'carDto.perFreight': [
            {required: true, message: '请输入每公里运费', trigger: 'blur'}
          ],
          'carDto.freight': [
            {required: true, message: '请输入起步运费', trigger: 'blur'}
          ]

        },
        pageSets: [
          {name: '主档信息', key: 0},
          {name: '行驶证信息', key: 1},
          {name: '保险信息', key: 2}
        ],
        form: {
          carDto: {
            id: '',
            plateNumber: '',
            ascriptionCompany: '',
            defaultDriver: '',
            loadBearing: '',
            volume: '',
            authorizedNumber: '',
            type: '',
            carriageLength: '',
            carriageWidth: '',
            carriageHeight: ''
          },
          carDetailDto: {
            id: '',
            brand: '',
            engineNumber: '',
            identificationNumber: '',
            createDate: '',
            issuingDate: '',
            checkValidityDate: '',
            forciblyDiscardedDay: '',
            insuranceCompany: '',
            ctaliNumber: '',
            ctaliEndDate: '',
            thirdPartyInsuranceNumber: '',
            thirdPartyInsuranceEndDate: ''
          }
        },
        doing: false,
        x: '',
        customerList: [],
        userList: [],
        currentTab: {}
      };
    },
    computed: {
      showTitle: function () {
        let title = '新增';
        if (this.action === 'edit') {
          title = '修改';
        }
        return title;
      },
      carTypeList () {
        return this.$getDict('carType');
      },
      transportScope () {
        return this.$getDict('transportationCondition');
      }
    },
    props: ['formItem', 'action'],
    watch: {
      formItem: function (val) {
        this.form = Object.assign({}, val);
        if (this.action === 'add') {
          this.form.carDto =
            {
              plateNumber: '',
              ascriptionCompany: '',
              defaultDriver: '',
              loadBearing: '',
              volume: '',
              authorizedNumber: '',
              type: '',
              carriageLength: '',
              carriageWidth: '',
              carriageHeight: '',
              scopeList: []
            };
          this.form.carDetailDto = {
            plateNumber: '',
            brand: '',
            engineNumber: '',
            identificationNumber: '',
            createDate: '',
            issuingDate: '',
            checkValidityDate: '',
            forciblyDiscardedDay: '',
            insuranceCompany: '',
            ctaliNumber: '',
            ctaliEndDate: '',
            thirdPartyInsuranceNumber: '',
            thirdPartyInsuranceEndDate: ''
          };
          this.$nextTick(() => {
            this.$refs.form && this.$refs.form.clearValidate();
          });
        }
        if (this.action === 'edit') {
          this.form.carDto = Object.assign({}, {
            id: '',
            plateNumber: '',
            ascriptionCompany: '',
            defaultDriver: '',
            loadBearing: '',
            volume: '',
            authorizedNumber: '',
            type: '',
            carriageLength: '',
            carriageWidth: '',
            carriageHeight: ''
          }, val.carDto);
          if (val.carDto.scopeList) {
            this.form.carDto.scopeList = val.carDto.scopeList;
          } else {
            this.form.carDto.scopeList = [];
          }
          this.form.carDetailDto = Object.assign({}, {
            id: '',
            ascriptionCompany: '',
            defaultDriver: '',
            loadBearing: '',
            volume: '',
            authorizedNumber: '',
            type: '',
            carriageLength: '',
            carriageWidth: '',
            carriageHeight: ''
          }, val.carDetailDto);
          if (this.form.carDto.ascriptionCompanyName) {
            this.filterCustomer(this.form.carDto.ascriptionCompanyName);
          }
          if (this.form.carDto.defaultDriverName) {
            this.filterUser(this.form.carDto.defaultDriverName);
          }
          this.form.carDto.perFreight = utils.autoformatDecimalPoint(this.form.carDto.perFreight ? this.form.carDto.perFreight.toString() : '');
          this.form.carDto.freight = utils.autoformatDecimalPoint(this.form.carDto.freight ? this.form.carDto.freight.toString() : '');

          this.$nextTick(() => {
            this.$refs.form && this.$refs.form.clearValidate();
          });
        }
      }
    },
    methods: {
      formatPrice () {// 格式化单价，保留两位小数
        this.form.carDto.perFreight = utils.autoformatDecimalPoint(this.form.carDto.perFreight);
        this.form.carDto.freight = utils.autoformatDecimalPoint(this.form.carDto.freight);
      },
      selectTab (item) {
        this.currentTab = item;
      },
      calculateVolume: function (item) {
        if (item.carriageLength && item.carriageWidth && item.carriageHeight) {
          let sq = this.accMul(item.carriageLength, item.carriageWidth);
          item.volume = this.accMul(sq, item.carriageHeight);
        }
      },
      accMul: function (arg1, arg2) {
        let m = 0;
        let s1 = null;
        let s2 = null;
        if (arg1) {
          s1 = arg1.toString();
        }
        if (arg2) {
          s2 = arg2.toString();
        }
        try {
          m += s1.split('.')[1].length;
        } catch (e) {
        }
        try {
          m += s2.split('.')[1].length;
        } catch (e) {
        }
        return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
      },
      filterCustomer: function (query) {// 过滤客户
        BaseInfo.query({keyWord: query}).then(res => {
          this.customerList = res.data.list;
        });
      },
      filterUser: function (query) {
        let data = Object.assign({}, {
          objectId: 'oms-system',
          keyWord: query,
          status: 1
        });
        User.query(data).then(res => {
          this.userList = res.data.list;
        });
      },
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            if (this.action === 'add') {
              this.doing = true;
              CarArchives.save(this.form).then(res => {
                this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '新增车辆档案成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '新增车辆档案失败'
                });
                this.doing = false;
              });
            } else {
              this.doing = true;
              CarArchives.update(this.form).then(res => {
                this.$notify.success({
                  name: '成功',
                  message: '修改车辆档案"' + this.form.carDto.plateNumber + '"成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '修改车辆档案' + this.form.carDto.plateNumber + '"失败'
                });
                this.doing = false;
              });
            }
          } else {

          }
        });
      },
      cancel: function () {
        this.$emit('right-close');
      }
    }
  };
</script>
