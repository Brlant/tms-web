<style lang="scss" scoped>
.good-selects {
  .el-select-dropdown__item {
    height: auto;
  }
}
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">{{ showTitle }}车辆档案</template>
    <template slot="btn">
      <el-button plain @click="onSubmit('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{ active: pageSets[0].key === currentTab.key }">
              {{ pageSets[0].name }}</h3>
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
            <el-form-item slot="left" label="分类" prop="carDto.ascriptionType">
              <el-select placeholder="请选择分类" v-model="form.carDto.ascriptionType" popperClass="good-selects"
                style="width: 100%" @change="exchangeType">
                <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in driverType"></el-option>
              </el-select>
            </el-form-item>
            <!-- 自有司机 -->
            <!-- <el-form-item slot="left" label="归属公司" v-if="form.carDto.ascriptionType == 1">
              <el-select filterable remote placeholder="请输入名称/拼音首字母缩写/系统代码搜索归属公司" :remote-method="filterCustomer"
                :clearable="true" v-model="form.carDto.ascriptionCompany" popperClass="good-selects" style="width: 100%">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in customerList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{ org.name }}</span>
                  </div>
                  <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                      <span>系统代码:</span>{{ org.manufacturerCode }}
                    </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item> -->
            <!-- 委外司机 -->
            <el-form-item slot="left" label="归属公司"  prop="carDto.ascriptionCompany"  :rules="form.carDto.ascriptionType == 2?[{ required: true, message: '请选择...', trigger: 'change' }]
            :[{ required: false, message: '请选择...', trigger: 'change' }]">
              <el-select filterable remote placeholder="请输入名称搜索归属公司" v-model="form.carDto.ascriptionCompany"
                :remote-method="filterCarrierList" :clearable="true" popperClass="good-selects" style="width: 100%" @change="chooseCompany">
                <el-option :label="item.carrierName" :value="item.carrierId" :key="item.carrierId"
                  v-for="item in carrierList"></el-option>
              </el-select>
            </el-form-item>

            <!--默认司机  自有车辆 -->
            <el-form-item slot="right" label="默认司机" v-if="form.carDto.ascriptionType == 1">
              <el-select filterable remote placeholder="请输入名称/拼音首字母缩写搜索司机" :remote-method="filterUser" :clearable="true"
                v-model="form.carDto.defaultDriver" popperClass="good-selects">
                <el-option :value="user.driverId" :key="user.driverId" :label="user.driverName" v-for="user in userListSelf" :disabled="user.driverStatus == 2">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{ user.driverName }}</span>
                    <span class="pull-right">
                      {{ driverStatusFn(user.driverStatus) }}
                    </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <!--默认司机  委外车辆 -->
            <el-form-item slot="right" label="默认司机" v-else>
              <el-select filterable remote placeholder="请输入名称/拼音首字母缩写搜索司机" :remote-method="getDriverInfo" :clearable="true"
                v-model="form.carDto.defaultDriver" popperClass="good-selects">
                <el-option :value="user.driverId" :key="user.driverId" :label="user.driverName" v-for="user in userListOut" :disabled="user.driverStatus == 2">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{ user.driverName }}</span>
                    <span class="pull-right">
                      {{ driverStatusFn(user.driverStatus) }}
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
                <oms-input min="0" placeholder="请输入每公里运费" type="text" v-model="form.carDto.perFreight"
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
            <h3 class="tit f-dib index-tit" :class="{ active: pageSets[1].key === currentTab.key }">
              {{ pageSets[1].name }}</h3>
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
                <el-date-picker v-model="form.carDetailDto.createDate" type="date" placeholder="选择车辆注册日期"
                  format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="车辆发证日期">
                <el-date-picker v-model="form.carDetailDto.issuingDate" type="date" placeholder="选择车辆发证日期"
                  format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
              <el-form-item slot="right" label="检验有效期" prop="carDetailDto.checkValidityDate">
                <el-date-picker v-model="form.carDetailDto.checkValidityDate" type="date" placeholder="选择检验有效期"
                  format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="强制报废日" prop="carDetailDto.forciblyDiscardedDay">
                <el-date-picker v-model="form.carDetailDto.forciblyDiscardedDay" type="date" placeholder="选择强制报废日"
                  format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </two-column>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{ active: pageSets[2].key === currentTab.key }">
              {{ pageSets[2].name }}</h3>
          </div>
          <div class="content">
            <el-form-item label="保险公司">
              <oms-input type="text" v-model="form.carDetailDto.insuranceCompany" placeholder="请输入保险公司"></oms-input>
            </el-form-item>
            <two-column>
              <el-form-item slot="left" label="交强险保单号">
                <oms-input type="text" v-model="form.carDetailDto.ctaliNumber" placeholder="请输入车辆交强险保单号"></oms-input>
              </el-form-item>
              <el-form-item slot="right" class="acrony-my" label="交强险截止日期" prop="carDetailDto.ctaliEndDate">
                <el-date-picker v-model="form.carDetailDto.ctaliEndDate" type="date" placeholder="选择交强险截止日期"
                  format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" class="acrony-my" label="第三责任险保单号">
                <oms-input type="text" v-model="form.carDetailDto.thirdPartyInsuranceNumber"
                  placeholder="请输入车辆第三责任险保单号"></oms-input>
              </el-form-item>
              <el-form-item slot="right" class="acrony-my" label="第三责任险截止日期"
                prop="carDetailDto.thirdPartyInsuranceEndDate">
                <el-date-picker v-model="form.carDetailDto.thirdPartyInsuranceEndDate" type="date"
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
import { BaseInfo, CarArchives, User, Carrier } from '@/resources';
import TwoColumn from '@dtop/dtop-web-common/packages/two-column';
import utils from '@/tools/utils';

export default {
  components: { TwoColumn },
  data: function () {
    let checkPlateNumber = (rule, value, callback) => {
      if (value !== '' && value !== null) {
        CarArchives.checkPlateNumber({ plateNumber: value, id: this.form.carDto.id }).then(val => {
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
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          { validator: checkPlateNumber, trigger: 'blur' }
        ],
        'carDto.ascriptionType': [
          { required: true, message: '请选择...', trigger: 'change' }
        ],
        'carDto.carriageLength': [
          { required: true, type: 'number', message: '请输入车厢长度', trigger: 'blur' }
        ],
        'carDto.carriageWidth': [
          { required: true, type: 'number', message: '请输入车厢宽度', trigger: 'blur' }
        ],
        'carDto.carriageHeight': [
          { required: true, type: 'number', message: '请输入车厢高度', trigger: 'blur' }
        ],
        'carDto.loadBearing': [
          { required: true, type: 'number', message: '请输入车辆承重', trigger: 'blur' }
        ],
        'carDto.perFreight': [
          { required: true, message: '请输入每公里运费', trigger: 'blur' }
        ],
        'carDto.freight': [
          { required: true, message: '请输入起步运费', trigger: 'blur' }
        ],
        // 检验有效期
        'carDetailDto.checkValidityDate': [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        // 强制报废日
        'carDetailDto.forciblyDiscardedDay': [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        // 交强险截止日期
        'carDetailDto.ctaliEndDate': [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        // 第三责任险截止日期
        'carDetailDto.thirdPartyInsuranceEndDate': [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],

      },
      pageSets: [
        { name: '主档信息', key: 0 },
        { name: '行驶证信息', key: 1 },
        { name: '保险信息', key: 2 }
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
      customerList: [], // 自有司机的归属公司
      carrierList: [],   // 委外司机的归属公司
      userListSelf: [],  // 自有车辆的司机列表
      userListOut: [],  // 委外车辆的司机列表
      currentTab: {},
      // 司机状态 // 0-停用；1-正常；2-异常；3-即将超期
      driverStatus:[
          { label:'停用',value:0,},
          { label:'正常',value:1,},
          { label:'异常',value:2,},
          { label:'即将超期',value:3,},
        ],
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
    carTypeList() {
      return this.$getDict('carType');
    },
    transportScope() {
      return this.$getDict('transportationCondition');
    },
    driverType() {
      return this.$getDict('ascriptionType');
    },
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
          ascriptionType: '',
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
        if (val.carDto.ascriptionType) {
          val.carDto.ascriptionType = '' + val.carDto.ascriptionType
          if(val.carDto.ascriptionType == 1){
            let arr = [
              {
                carrierId:'GO1',
                carrierName:'国药控股上海生物医药有限公司'
              }
            ]
            this.carrierList = arr
            // 自有车辆司机
            this.filterUser('');
          }else{
            if (this.form.carDto.ascriptionCompanyName) {
              this.filterCarrierList(this.form.carDto.ascriptionCompanyName)
            }
            if (this.form.carDto.defaultDriverName) {
              // 委外车辆司机
              this.getDriverInfo(this.form.carDto.defaultDriverName)
            }
          }
        }
        this.form.carDto = Object.assign({}, {
          id: '',
          plateNumber: '',
          ascriptionType: '',
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
        // if (this.form.carDto.defaultDriverName) {
        //   // 自有车辆司机
        //   if(this.form.carDto.ascriptionType == 1){
        //     this.filterUser(this.form.carDto.defaultDriverName);
        //   }else{
        //     // 委外车辆司机
        //     this.getDriverInfo(this.form.carDto.defaultDriverName)
        //   }
        // }
        this.form.carDto.perFreight = utils.autoformatDecimalPoint(this.form.carDto.perFreight ? this.form.carDto.perFreight.toString() : '');
        this.form.carDto.freight = utils.autoformatDecimalPoint(this.form.carDto.freight ? this.form.carDto.freight.toString() : '');

        this.$nextTick(() => {
          this.$refs.form && this.$refs.form.clearValidate();
        });
      }
    }
  },
  methods: {
    // 分类事件  切换时需要清除掉选择的归属公司
    exchangeType() {
      // 只有公司 下拉显示国药，字段也要回显
      let arr = [
              {
                carrierId:'GO1',
                carrierName:'国药控股上海生物医药有限公司'
              }
            ]
        if(this.form.carDto.ascriptionType == 1){
          this.carrierList = arr
          this.form.carDto.ascriptionCompany = 'GO1'
          this.form.carDto.ascriptionCompanyName = '国药控股上海生物医药有限公司'
          // 默认司机 已查出默认司机
          this.filterUser('')
        }else{
          // 委外公司  下拉显示第三方承运商
          this.filterCarrierList('')
          this.form.carDto.ascriptionCompany = ''
          this.form.carDto.ascriptionCompanyName = ''
        }
        // 只要切换分类，默认司机的值就需要被清除
        this.form.carDto.defaultDriver = ''
        this.form.carDto.defaultDriverName = ''
    },
    // 归属公司事件 // 默认司机存在两个，所以改变归属公司加不加判断无所谓
    chooseCompany(){
      this.getDriverInfo('')
    },
    // 司机 自有车辆
    filterUser: function (query) {
        let data =Object.assign({},{
          keyWord:query,
          driverType:1,   
        })
        this.$http.post('/driver-info/queryOwnDriver',data).then(res=>{
          this.userListSelf = res.data
        })
      },
      // 司机  委外车辆
    getDriverInfo(query){
      if(!this.form.carDto.ascriptionCompany){
        return
      }
      let data = {
        keyWord: query,
        carrierId: this.form.carDto.ascriptionCompany
      }
      this.$http.post('/driver-info/queryDriversByCarrier', data).then(res => {
        this.userListOut = res.data;
      })
    },
    // 司机状态回显
    driverStatusFn(val){
         return this.driverStatus.find(item=> item.value == val).label
      },
    formatPrice() {// 格式化单价，保留两位小数
      this.form.carDto.perFreight = utils.autoformatDecimalPoint(this.form.carDto.perFreight);
      this.form.carDto.freight = utils.autoformatDecimalPoint(this.form.carDto.freight);
    },
    selectTab(item) {
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
    filterCustomer: function (query) {// 过滤客户  //自有司机
      BaseInfo.query({ keyWord: query }).then(res => {
        this.customerList = res.data.list;
      });
    },
    // 过滤归属公司 委外司机 
    filterCarrierList: function (query) {
      // 无分类车辆时
      if(!this.form.carDto.ascriptionType){   
        this.carrierList = []
        return
      }
      // 自有车辆时
      if(this.form.carDto.ascriptionType == 1){
        let arr = [{ carrierId:'GO1',carrierName:'国药控股上海生物医药有限公司'}]
        this.carrierList = arr
        return
      }
      // 委外车辆时
      let params = {
        status: '', // ''全部  0待审核 2启用 1禁用
        carrierName: query, // 承运商名称（模糊查询）
        transportationConditions: '', // 承运条件 A 全部 B 冷链运输 C 常温运输
        pageNo: 1,
        pageSize: 1000,
      }
      Carrier.query(params).then(res => {
        const { list } = res.data;
        this.carrierList = list;
      })
    },
    // filterUser: function (query) {
    //   let data = Object.assign({}, {
    //     objectId: 'oms-system',
    //     keyWord: query,
    //     status: 1
    //   });
    //   User.query(data).then(res => {
    //     this.userList = res.data.list;
    //   });
    // },
    // 比较当前时间与传入时间相比，是否超期，超期红色，未超期黑色
    isOverdue(periodValidity) {
      // 1,大于30天，2,0到30以内 3,小于0
      if (!periodValidity) {
        return 1
      } else {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        if (month < 10) month = `0${month}`
        if (day < 10) day = `0${day}`
        let nowTime = `${year}-${month}-${day}`
        let currentTime = this.$moment(nowTime);
        let endtime = this.$moment(periodValidity);
        let days = endtime.diff(currentTime, 'days', true);  // 第三个参数，是否取整，不加第三个参数，默认四色五入取整，加上true，为实际的有效时间(不取整)
        console.log(days, 'days');
        if (days > 30) {
          return 1
        } else if (days <= 30 && days >= 0) {
          return 2
        } else {
          return 3
        }
      }
    },
    onSubmit: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.doing === false) {
          // 强制报废日、检验有效期、交强险截止日期、第三方责任险截止日期 有一个在三十天内的，都要有弹窗提示
          let obj = {}
          let a = this.isOverdue(this.form.carDetailDto.forciblyDiscardedDay)
          let b = this.isOverdue(this.form.carDetailDto.checkValidityDate)
          let c = this.isOverdue(this.form.carDetailDto.ctaliEndDate)
          let d = this.isOverdue(this.form.carDetailDto.thirdPartyInsuranceEndDate)
          obj[a] = a
          obj[b] = b
          obj[c] = c
          obj[d] = d
          if (obj[3]) {
            // 超期
            this.$confirm('车辆已超期，是否确认保存?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.saveInfo()
            })
          } else if (obj[2]) {
            // 即将超期
            this.$confirm('车辆即将超期，是否确认保存?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.saveInfo()
            })
          } else {
            this.saveInfo()
          }
        } else {

        }
      });
    },
    saveInfo() {
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
    },
    cancel: function () {
      this.$emit('right-close');
    }
  }
};
</script>
