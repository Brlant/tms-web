<!--suppress JSUnresolvedFunction -->
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

</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">{{ showTitle }}订单</template>
    <template slot="btn">
      <el-button plain @click="save('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
              {{ pageSets[0].name }}</h3>
          </div>
          <div class="content">
            <two-column>
              <el-form-item slot="left" label="订单号">
                <oms-input v-model="form.orderNo" placeholder="请输入订单号"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="委托单号">
                <oms-input v-model="form.tmsOrderNumber" placeholder="请输入委托单号"></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="订单类型" prop="waybillType">
                <el-select v-model="form.waybillType" placeholder="请选择订单类型" :clearable="true">
                  <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in typeList"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item slot="right" label="运输条件" prop="shipmentWay">
                <el-select v-model="form.shipmentWay" placeholder="请选择运输条件" :clearable="true">
                  <el-option :label="item.label" :value="item.key" :key="item.key"
                             v-for="item in shipmentWayList"></el-option>
                </el-select>
              </el-form-item>
            </two-column>
            <el-form-item label="发运方式">
              <el-select placeholder="请选择发运方式" v-model="form.deliveryWay">
                <el-option :label="item.label" :value="item.key" :key="item.key"
                           v-for="item in deliveryWayList"></el-option>
              </el-select>
            </el-form-item>
            <two-column>
              <el-form-item slot="left" label="提货时间">
                <el-date-picker
                  v-model="form.pickUpTime"
                  type="date"
                  placeholder="选择提货时间" format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
              <el-form-item slot="right" label="送达时限">
                <el-date-picker
                  v-model="form.deliveryTime"
                  type="date"
                  placeholder="选择送达时限" format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </two-column>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">
              {{ pageSets[1].name }}</h3>
          </div>
          <div class="content">
            <el-form-item label="货主">
              <el-select filterable remote placeholder="请输入名称/拼音首字母缩写/系统代码搜索货主" :remote-method="filterCustomer"
                         :clearable="true"
                         v-model="form.orgId" popperClass="good-selects">
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
            </el-form-item>
            <el-form-item label="发货单位" prop="senderId">
              <el-select filterable remote placeholder="请输入名称/拼音首字母缩写/系统代码搜索发货单位" :remote-method="filterSenderOrg"
                         :clearable="true" @change="senderChange"
                         v-model="form.senderId" popperClass="good-selects">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in senderOrgList">
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
            </el-form-item>
            <two-column>
              <el-form-item slot="left" label="发货联系人">
                <oms-input v-model="form.senderContact" placeholder="请输入发货联系人"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="电话">
                <oms-input v-model="form.senderContactPhone" placeholder="请输入电话"></oms-input>
              </el-form-item>
            </two-column>
            <el-form-item label="发货地区" prop="senderAddress">
              <el-cascader
                v-model="senderOptions"
                placeholder="试试搜索：合肥"
                :options="address"
                filterable clearable></el-cascader>
            </el-form-item>
            <el-form-item label="具体地址" prop="senderAddress">
              <oms-input v-model="form.senderAddress" placeholder="请输入具体的发货地址"></oms-input>
            </el-form-item>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[2].key === currentTab.key}">
              {{ pageSets[2].name }}</h3>
          </div>
          <div class="content">
            <el-form-item label="收货单位" prop="receiverId">
              <el-select filterable remote placeholder="请选择/输入收货单位" :remote-method="filterReceiverOrg"
                         :clearable="true" allow-create default-first-option
                         @change="receiverChange"
                         @clear="addressList = []"
                         v-model="form.receiverId" popperClass="good-selects">
                <el-option :value="org.receiverId" :key="org.receiverId" :label="org.receiverName"
                           v-for="org in receiverOrgList">
                </el-option>
              </el-select>
            </el-form-item>
            <two-column>
              <el-form-item slot="left" label="收货联系人">
                <oms-input v-model="form.receiverContact" placeholder="请输入收货联系人"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="电话">
                <oms-input v-model="form.receiverContractPhone" placeholder="请输入电话"></oms-input>
              </el-form-item>
            </two-column>

            <el-form-item label="收货地区" required>
              <el-cascader ref="receiverCascader"
                           v-model="receiverOptions"
                           placeholder="试试搜索：合肥"
                           :options="address"
                           filterable clearable></el-cascader>
              <!--              <div style="display: inline-flex">
                              <el-select class="mr-10" v-model="form.receiverProvinceCode" placeholder="请选择省" filterable
                                         @change="provinceChange">
                                <el-option-group
                                  v-for="group in provinceOptions"
                                  :key="group.label"
                                  :label="group.label">
                                  <el-option
                                    v-for="item in group.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                  </el-option>
                                </el-option-group>
                              </el-select>
                              <el-select class="mr-10" v-model="form.receiverCityCode" placeholder="请选择市" filterable
                                         @change="cityChange">
                                <el-option-group
                                  v-for="group in cityOptions"
                                  :key="group.label"
                                  :label="group.label">
                                  <el-option
                                    v-for="item in group.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                  </el-option>
                                </el-option-group>
                              </el-select>
                              <el-select v-model="form.receiverRegionCode" placeholder="请选择区" filterable @change="regionChange">
                                <el-option-group
                                  v-for="group in regionOptions"
                                  :key="group.label"
                                  :label="group.label">
                                  <el-option
                                    v-for="item in group.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                  </el-option>
                                </el-option-group>
                              </el-select>
                            </div>-->
            </el-form-item>
            <el-form-item label="具体地址" prop="receiverDetailAddress">
              <el-select filterable placeholder="请选择/输入具体的收货地址"
                         :clearable="true" allow-create default-first-option
                         @change="receiverDetailAddressChange"
                         v-model="form.receiverDetailAddress">
                <el-option :value="item.receiverAddress" :key="item.receiverAddressId" :label="item.receiverAddress"
                           v-for="item in addressList">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[3].key === currentTab.key}">
              {{ pageSets[3].name }}</h3>
          </div>
          <div class="content">
            <two-column>
              <el-form-item slot="left" label="整装箱数" prop="wholeBoxCount">
                <oms-input type="integer" :min="0" v-model="form.wholeBoxCount" placeholder="请输入整装箱数"
                           @blur="setWholeBoxCount(form.wholeBoxCount)"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="散装箱数" prop="bulkBoxCount">
                <oms-input type="number" :min="0" v-model="form.bulkBoxCount" placeholder="请输入散装箱数"
                           @blur="setBulkBoxCount(form.bulkBoxCount)"></oms-input>
              </el-form-item>
            </two-column>
            <!--<two-column>-->
            <!--<el-form-item slot="left" label="包件数" prop="incubatorCount">-->
            <!--<oms-input type="number" :min="0" v-model="form.incubatorCount" placeholder="请输入包件数"-->
            <!--@blur="setIncubatorCount(form.incubatorCount)"></oms-input>-->
            <!--</el-form-item>-->
            <!--</two-column>-->
            <two-column>
              <el-form-item slot="left" label="重量" prop="goodsWeight">
                <oms-input v-model="form.goodsWeight" placeholder="请输入货品重量"
                           @blur="setGoodsWeight(form.goodsWeight)">
                  <template slot="append">kg</template>
                </oms-input>
              </el-form-item>
              <el-form-item slot="right" label="体积" prop="goodsVolume">
                <oms-input v-model="form.goodsVolume" placeholder="请输入货品体积"
                           @blur="setGoodsVolume(form.goodsVolume)">
                  <template slot="append">m³</template>
                </oms-input>
              </el-form-item>
            </two-column>
            <el-form-item label="声明价格">
              <oms-input type="number" :min="0" v-model="form.goodsPrice" placeholder="请输入声明价格">
                <template slot="prepend">¥</template>
              </oms-input>
            </el-form-item>
            <el-form-item label="货品名称">
              <oms-input v-model="form.goodsTotalName" placeholder="如果填写货品清单，货品名称会根据货品清单自动生成。"></oms-input>
            </el-form-item>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[4].key === currentTab.key}">{{ pageSets[4].name }}
              <span @click="addGoods" class="btn-circle"><i class="el-icon-t-plus"></i> </span></h3>
          </div>
          <div class="content">
            <div class="part-hj-box" v-for="hj in form.goodsList" v-show="form.goodsList">
              <el-form-item label="货品名称">
                <oms-input v-model="hj.goodsName" placeholder="请输入货品名称"></oms-input>
              </el-form-item>
              <el-form-item label="批号">
                <oms-input v-model="hj.batchNumber" placeholder="请输入批号"></oms-input>
              </el-form-item>
              <two-column>
                <el-form-item slot="left" label="单价">
                  <oms-input v-model="hj.goodsUnitPrice" placeholder="请输入单价" type="number" :min="0"></oms-input>
                </el-form-item>
                <el-form-item slot="right" label="数量">
                  <oms-input v-model="hj.goodsCount" type="number" :min="0" placeholder="请输入数量"></oms-input>
                </el-form-item>
              </two-column>
              <el-form-item label="生产厂商">
                <oms-input v-model="hj.goodsFactory" placeholder="请输入生产厂商"></oms-input>
              </el-form-item>
              <el-form-item label="供货厂商">
                <oms-input v-model="hj.supplyManufacturers" placeholder="请输入供货厂商"></oms-input>
              </el-form-item>
              <two-column>
                <el-form-item slot="left" label="整件长">
                  <oms-input type="number" :min="0" v-model="hj.goodsLength" placeholder="请输入整件长">
                    <template slot="append">cm</template>
                  </oms-input>
                </el-form-item>
                <el-form-item slot="right" label="整件宽">
                  <oms-input type="number" :min="0" v-model="hj.goodsWidth" placeholder="请输入整件宽">
                    <template slot="append">cm</template>
                  </oms-input>
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="整件高">
                  <oms-input type="number" :min="0" v-model="hj.goodsHeight" placeholder="请输入整件高">
                    <template slot="append">cm</template>
                  </oms-input>
                </el-form-item>
                <el-form-item slot="right" label="整装箱数">
                  <oms-input type="number" :min="0" v-model="hj.wholeBoxCount" placeholder="请输入整装箱数">
                  </oms-input>
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="货品重量">
                  <oms-input type="number" :min="0" v-model="hj.weight" placeholder="请输入货品重量">
                    <template slot="append">kg</template>
                  </oms-input>
                </el-form-item>
                <el-form-item slot="right" label="货品体积">
                  <oms-input type="number" :min="0" v-model="hj.volume" placeholder="请输入货品体积">
                    <template slot="append">m³</template>
                  </oms-input>
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="货品规格">
                  <oms-input v-model="hj.specifications" placeholder="请输入货品规格"></oms-input>
                </el-form-item>
                <el-form-item slot="right" label="追溯码">
                  <oms-input v-model="hj.code" placeholder="请输入追溯码"></oms-input>
                </el-form-item>
              </two-column>
              <el-form-item label-width="120px">
                <el-button @click.prevent="remove(hj)" :plain="true" type="danger">删除货品详情</el-button>
              </el-form-item>
            </div>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[5].key === currentTab.key}">
              {{ pageSets[5].name }}</h3>
          </div>
          <div class="content">
            <el-form-item label="始发地">
              <oms-input v-model="form.provenance" placeholder="请输入始发地"></oms-input>
            </el-form-item>
            <el-form-item label="目的地">
              <oms-input v-model="form.destination" placeholder="请输入目的地"></oms-input>
            </el-form-item>
            <el-form-item slot="right" label="备注">
              <oms-input v-model="form.remark" type="textarea" placeholder="请输入备注"></oms-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
import {BaseInfo, TmsOrder} from '@/resources';
import TwoColumn from '@dtop/dtop-web-common/packages/two-column';
import utils from '@/tools/utils'

export default {
  components: {TwoColumn},
  data() {
    return {
      address: utils.address,
      hisOrgs: [
        {
          "receiverId": "Q6gT4fHT2Ls1rytMZAt",
          "receiverName": "国控生物",
          "addressList": [
            {
              "receiverAddressId": "SgtbPxmBqgzosZtFLbJ",
              "receiverId": "Q6gT4fHT2Ls1rytMZAt",
              "receiverProvinceCode": "340000",
              "receiverCityCode": "340100",
              "receiverRegionCode": "340104",
              "receiverAddress": "科大先研院11楼"
            },
            {
              "receiverAddressId": "vIP8Rv6smC71fBgsP4A",
              "receiverId": "Q6gT4fHT2Ls1rytMZAt",
              "receiverProvinceCode": "310000",
              "receiverCityCode": "310100",
              "receiverRegionCode": "310101",
              "receiverAddress": "公司总部"
            }
          ]
        }
      ],
      provinces: utils.address,
      cities: [],
      regions: [],
      addressList: [],
      list: [],
      times: [],
      pageSets: [
        {name: '基本信息', key: 0},
        {name: '发货信息', key: 1},
        {name: '收货信息', key: 2},
        {name: '货品信息', key: 3},
        {name: '货品列表', key: 4},
        {name: '其他信息', key: 5}
      ],
      currentTab: {},
      form: {
        goodsList: [
          {
            goodsName: '',
            specifications: '',
            weight: '',
            volume: '',
            code: '',
            batchNumber: '',
            goodsUnitPrice: '',
            goodsCount: '',
            goodsFactory: '',
            supplyManufacturers: '',
            goodsLength: '',
            goodsWidth: '',
            goodsHeight: '',
            wholeBoxCount: ''
          }
        ],
        senderAddress: '',
        orgName: '',
        senderName: '',
        pickUpTime: '',
        senderContact: '',
        senderContactPhone: '',
        receiverContact: '',
        receiverContractPhone: '',
        senderId: '',
        senderProvinceCode: '',
        senderCityCode: '',
        senderRegionCode: '',
        receiverId: '', //收货单位主键id
        receiverName: '', //收货单位主键id
        receiverAddress: '', //收货单位地址
        receiverDetailAddress: '', //收货单位地址
        receiverProvinceCode: '', //收货单位省编码
        receiverCityCode: '', //收货单位市编码
        receiverRegionCode: '' //收货单位区编码
      },
      doing: false,
      rules: {
        waybillType: [
          {required: true, message: '请选择订单类型', trigger: 'change'}
        ],
        shipmentWay: [
          {required: true, message: '请选择运输条件', trigger: 'change'}
        ],
        deliveryWay: [
          {required: true, message: '请选择发运方式', trigger: 'change'}
        ],
        senderId: [
          {required: true, message: '请选择发货单位', trigger: 'change'}
        ],
        receiverId: [
          {required: true, message: '请选择收货单位', trigger: 'change'}
        ],
        receiverDetailAddress: [
          {required: true, message: '请输入收货地址', trigger: 'blur'}
        ],
        wholeBoxCount: [
          {required: true, type: 'integer', message: '请输入整装箱数', trigger: 'blur'}
        ],
        bulkBoxCount: [
          {required: true, type: 'integer', message: '请输入散装箱数', trigger: 'blur'}
        ],
        incubatorCount: [
          {required: true, type: 'integer', message: '请输入包件数', trigger: 'blur'}
        ],
        goodsWeight: [
          {required: true, type: 'number', message: '请输入货品重量', trigger: 'blur'}
        ],
        goodsVolume: [
          {required: true, type: 'number', message: '请输入货品体积', trigger: 'blur'}
        ]
      },
      customerList: [],
      senderOrgList: [],
      receiverOrgList: [],
      senderOptions: [],
      receiverOptions: [],
    };
  },
  computed: {
    // 收货地址：省市区+详细地址
    receiverAddress() {
      if (this.receiverOptions.length === 0) {
        return '';
      }

      if (!this.form.receiverDetailAddress) {
        return '';
      }

      // 根据所选择的地区信息获取省市区的名字
      const pathLabels = this.$refs.receiverCascader.getCheckedNodes()[0].pathLabels;
      return pathLabels.join('') + this.form.receiverDetailAddress;
    },
    provinceOptions() {
      return [{
        label: '常用省份',
        options: []
      }, {
        label: '全部省份',
        options: this.provinces
      }]
    },
    cityOptions() {
      return [{
        label: '常用城市',
        options: []
      }, {
        label: '全部城市',
        options: this.cities
      }]
    },
    regionOptions() {
      return [{
        label: '常用区/县',
        options: []
      }, {
        label: '全部区/县',
        options: this.regions
      }]
    },
    deliveryWayList() {
      return this.$getDict('deliveryWay');
    },
    shipmentWayList() {
      return this.$getDict('transportationCondition');
    },
    typeList() {
      return this.$getDict('bizType');
    },
    serviceTypeList() {
      return this.$getDict('serviceType');
    },
    showTitle() {
      let title = '新增';
      if (this.action === 'edit') {
        title = '修改';
      }
      return title;
    }
  },
  props: ['formItem', 'action'],
  watch: {
    formItem(val) {
      if (this.action === 'add') {
        this.form = Object.assign({}, val);
        this.$nextTick(() => {
          this.$refs.form && this.$refs.form.clearValidate();
        });
      }
      if (this.action === 'edit') {
        if (val.id) {
          TmsOrder.getOneTmsOrder(val.id).then(res => {
            this.form = res.data;
            this.filterCustomer(this.form.orgName);
            this.filterSenderOrg(this.form.senderName);
            this.filterReceiverOrg(this.form.receiverName);
            this.$nextTick(() => {
              this.$refs.form && this.$refs.form.clearValidate();
            });
          });
        }
      }
    },
  },
  methods: {
    provinceChange(val) {
      for (const item of this.provinces) {
        if (item.value === val) {
          this.cities = item.children;
          break;
        }
      }
    },
    cityChange(val) {
      for (const item of this.cities) {
        if (item.value === val) {
          this.regions = item.children;
          break;
        }
      }
    },
    regionChange(val) {
      for (const item of this.regions) {
        if (item.value === val) {
          break;
        }
      }
    },
    remove(item) {
      let index = this.form.goodsList.indexOf(item);
      // 移除删除项
      this.form.goodsList.splice(index, 1);
    },
    setWholeBoxCount(value) {
      if (!value || isNaN(value)) return;
      this.form.wholeBoxCount = parseInt(value, 10);
    },
    setBulkBoxCount(value) {
      if (!value || isNaN(value)) return;
      this.form.bulkBoxCount = parseInt(value, 10);
    },
    setIncubatorCount(value) {
      if (!value || isNaN(value)) return;
      this.form.incubatorCount = parseInt(value, 10);
    },
    setGoodsWeight(value) {
      if (!value || isNaN(value)) return;
      this.form.goodsWeight = parseFloat(value);
    },
    setGoodsVolume(value) {
      if (!value || isNaN(value)) return;
      this.form.goodsVolume = parseFloat(value);
    },
    addGoods() {
      let tpl = {};
      // 计算排序值
      tpl = Object.assign(tpl, {goodsName: '', specifications: '', weight: '', volume: '', code: ''});
      this.form.goodsList.splice(0, 0, tpl);
    },
    // 过滤货主
    filterCustomer(query) {
      BaseInfo.query({keyWord: query}).then(res => {
        this.customerList = res.data.list;
      });
    },
    // 过滤发货单位
    filterSenderOrg(query) {
      BaseInfo.query({keyWord: query}).then(res => {
        this.senderOrgList = res.data.list;
      });
    },
    // 过滤收货单位
    filterReceiverOrg(keyword) {
      this.receiverOrgList = this.hisOrgs.filter(item => item.receiverName.includes(keyword));
    },
    selectTab(item) {
      this.currentTab = item;
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.doing === false) {
          // 处理货品列表
          if (this.form.goodsList) {
            let goodsList = [];
            this.form.goodsList.forEach(val => {
              if (val.goodsName !== '' || val.specifications !== '' || val.weight !== '' || val.volume !== '' || val.code !== '') {
                goodsList.push(val);
              }
            });
            this.form.goodsList = goodsList;
          }

          // 额外处理地区和地址的信息
          this.form.receiverProvinceCode = this.receiverOptions[0];
          this.form.receiverCityCode = this.receiverOptions[1];
          this.form.receiverRegionCode = this.receiverOptions[2];
          this.form.receiverId = this.receiverOptions[2];
          this.form.receiverAddress = this.receiverAddress;

          if (this.action === 'add') {
            this.doing = true;
            TmsOrder.save(this.form).then(res => {
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '新增订单成功'
              });
              this.doing = false;
              this.$emit('change', res.data);
              this.$emit('right-close');
            }).catch(error => {
              this.$notify.error({
                duration: 2000,
                message: error.response && error.response.data && error.response.data.msg || '新增订单失败'
              });
              this.doing = false;
            });
          } else {
            this.doing = true;
            TmsOrder.update(this.form.id, this.form).then(res => {
              this.$notify.success({
                name: '成功',
                message: '修改订单"' + this.form.orderNo + '"成功'
              });
              this.doing = false;
              this.$emit('change', res.data);
              this.$emit('right-close');
            }).catch(error => {
              this.$notify.error({
                duration: 2000,
                message: error.response && error.response.data && error.response.data.msg || '修改订单失败'
              });
              this.doing = false;
            });
          }
        } else {

        }
      });

    },
    // 发货单位变更时的处理
    senderChange(value) {
      if (value === '') {
        this.form.senderProvinceCode = '';
        this.form.senderCityCode = '';
        this.form.senderRegionCode = '';
        this.form.senderAddress = '';
        return;
      }

      const item = this.senderOrgList.find(item => item.id == value);
      const areaCode = item.orgAreaCode;
      if (areaCode.length !== 6) {
        this.form.senderProvinceCode = '';
        this.form.senderCityCode = '';
        this.form.senderRegionCode = '';
        this.form.senderAddress = '';
        return
      }

      this.form.senderProvinceCode = areaCode.substring(0, 2) + '0000';
      this.form.senderCityCode = areaCode.substring(0, 4) + '00';
      this.form.senderRegionCode = areaCode;
      this.form.senderAddress = item.address;
      this.senderOptions = [
        this.form.senderProvinceCode,
        this.form.senderCityCode,
        this.form.senderRegionCode
      ];
    },
    // 收货单位变更时的处理
    receiverChange(value) {
      if (value === '') {
        this.form.receiverId = '';
        this.form.receiverName = '';
        this.form.receiN = '';
        this.form.receiverProvinceCode = '';
        this.form.receiverCityCode = '';
        this.form.receiverRegionCode = '';
        this.form.receiverDetailAddress = '';
        this.receiverOptions = [];
        this.addressList = [];
        return;
      }

      const item = this.receiverOrgList.find(item => item.receiverId == value);
      if (!item) {
        this.form.receiverId = '';
        this.form.receiverName = '';
        this.form.receiN = '';
        this.form.receiverProvinceCode = '';
        this.form.receiverCityCode = '';
        this.form.receiverRegionCode = '';
        this.form.receiverDetailAddress = '';
        this.receiverOptions = [];
        this.addressList = [];
        return;
      }

      this.addressList = item.addressList;
      if (this.addressList.length == 0) {
        this.receiverOptions = [];
        return;
      }

      // 如果收货单位有多个地址，这里只回显第一个
      const {
        receiverProvinceCode,
        receiverCityCode,
        receiverRegionCode,
        receiverAddress,
      } = this.addressList[0];

      // this.provinceChange(receiverProvinceCode);
      // this.cityChange(receiverCityCode);

      this.form.receiverId = item.receiverId;
      this.form.receiverName = item.receiverName;
      this.form.receiverProvinceCode = receiverProvinceCode;
      this.form.receiverCityCode = receiverCityCode;
      this.form.receiverRegionCode = receiverRegionCode;
      this.form.receiverDetailAddress = receiverAddress;

      this.receiverOptions = [
        this.form.receiverProvinceCode,
        this.form.receiverCityCode,
        this.form.receiverRegionCode
      ];
    },
    receiverDetailAddressChange(value) {
      if (!value) {
        return;
      }

      const addr = this.addressList.find(item => item.receiverAddress == value);
      if (!addr) {
        this.form.receiverDetailAddress = value;
        return;
      }

      this.receiverOptions = [addr.receiverProvinceCode, addr.receiverCityCode, addr.receiverRegionCode];
    }
  }
};
</script>
