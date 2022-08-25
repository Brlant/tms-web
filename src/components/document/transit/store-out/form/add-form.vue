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
    <template slot="title">{{ showTitle }}中转出库单</template>
    <template slot="btn">
      <el-button plain @click="save('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="120px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
              {{ pageSets[0].name }}</h3>
          </div>
          <div class="content">
            <!--            <two-column>-->
            <!--              <el-form-item slot="left" label="中转出库单号">-->
            <!--                <oms-input v-model="form.transferOutOrderNo" :disabled="true" placeholder=""></oms-input>-->
            <!--              </el-form-item>-->
            <!--            </two-column>-->
            <two-column>
              <el-form-item slot="left" label="订单号">
                <oms-input v-model="form.orderNo" :disabled="true" placeholder=""></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="中转入库单">
                <oms-input v-model="form.transferInOrderNo" :disabled="true" placeholder=""></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="运单类型" prop="waybillType">
                <el-select v-model="form.waybillType" placeholder="请选择运单类型" :clearable="true">
                  <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in typeList"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item slot="right" label="运输条件" prop="shipmentWay">
                <el-select v-model="form.shipmentWay" placeholder="请选择运输条件" disabled :clearable="true">
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
              <el-form-item slot="left" label="承运类型" prop="carryType">
                <el-radio v-model="form.carryType" :label="0">自行承运</el-radio>
                <el-radio v-model="form.carryType" :label="1">第三方承运</el-radio>
              </el-form-item>
              <el-form-item slot="right" label="承运商名称" prop="carrierId" v-show="form.carryType == 1">
                <el-select v-model="form.carrierId" placeholder="请选择承运商" filterable
                           size="mini">
                  <el-option v-for="item in carrierList"
                             :key="item.carrierId"
                             :label="item.carrierName"
                             :value="item.carrierId">
                    <span style="float: left" title="承运商名称">{{ item.carrierName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px" title="承运条件">
                      {{ item.transportationConditions|transName }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="是否投保" prop="insure">
                <el-radio-group v-model="form.insure" size="mini">
                  <el-radio :label="false">否</el-radio>
                  <el-radio :label="true">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item slot="right" label="投保金额（元）" prop="insureAmount" v-show="form.insure">
                <oms-input model="text" v-model="form.insureAmount" min="0" placeholder="请输入投保金额,最多保留两位小数"
                           @blur="insureAmountFormat">
                  <template slot="prepend">¥</template>
                </oms-input>
              </el-form-item>
            </two-column>
            <div class="hr"></div>
          </div>
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
                         :clearable="true" disabled
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
              <el-form-item slot="left" label="发货联系人" prop="senderContact">
                <oms-input v-model="form.senderContact" placeholder="请输入发货联系人"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="发货联系电话" prop="senderContactPhone">
                <oms-input v-model="form.senderContactPhone" placeholder="请输入发货联系电话"></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="发货地区" prop="waybillType">
                <el-cascader ref="senderCascader"
                             v-model="senderOptions"
                             placeholder="试试搜索：合肥"
                             :options="address"
                             filterable clearable></el-cascader>
              </el-form-item>
            </two-column>
            <el-form-item label="具体地址" prop="senderDetailAddr">
              <oms-input v-model="form.senderDetailAddr" placeholder="请输入具体的发货地址"></oms-input>
            </el-form-item>
            <div class="hr"></div>
          </div>
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
                         @clear="addressList = []"
                         @change="receiverChange"
                         v-model="form.receiverId" popperClass="good-selects">
                <el-option :value="org.receiverId" :key="org.receiverId" :label="org.receiverName"
                           v-for="org in receiverOrgList">
                </el-option>
              </el-select>
            </el-form-item>
            <two-column>
              <el-form-item slot="left" label="收货联系人" prop="receiverContact">
                <oms-input v-model="form.receiverContact" placeholder="请输入收货联系人"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="收货联系电话" prop="receiverContractPhone">
                <oms-input v-model="form.receiverContractPhone" placeholder="请输入收货联系电话"></oms-input>
              </el-form-item>
            </two-column>

            <el-form-item label="收货地区" prop="receiverRegionCode">
              <el-cascader ref="receiverCascader"
                           v-model="receiverOptions"
                           placeholder="试试搜索：合肥"
                           :options="address"
                           filterable clearable></el-cascader>
            </el-form-item>
            <el-form-item label="具体地址" prop="receiverDetailAddr">
              <el-select filterable placeholder="请选择/输入具体的收货地址"
                         :clearable="true" allow-create default-first-option
                         @change="receiverDetailAddrChange"
                         v-model="form.receiverDetailAddr">
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
              <el-form-item slot="left" label="整箱箱数">
                <oms-input v-model="form.wholeBoxCount" :disabled="true" placeholder=""></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="散件箱数">
                <oms-input v-model="form.bulkBoxCount" :disabled="true" placeholder=""></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="重量kg">
                <oms-input v-model="form.goodsWeight" :disabled="true" placeholder=""></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="体积m³">
                <oms-input v-model="form.goodsVolume" :disabled="true" placeholder=""></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="货品名称">
                <oms-input v-model="form.tmsGoodsTotalName" :disabled="true" placeholder=""></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="总价">
                <oms-input v-model="form.goodsPrice" :disabled="true" placeholder=""></oms-input>
              </el-form-item>
            </two-column>
            <div class="hr"></div>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[4].key === currentTab.key}">
              {{ pageSets[4].name }}</h3>
          </div>
          <div class="content">
            <two-column>
              <el-form-item slot="left" label="出库整箱箱数">
                <oms-input v-model="form.outboundWholeBoxCount" placeholder=""></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="出库散件箱数">
                <oms-input v-model="form.outboundBulkBoxCount" placeholder=""></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="重量kg">
                <oms-input v-model="form.outboundGoodsWeight" :disabled="true" placeholder=""></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="体积m³">
                <oms-input v-model="form.outboundGoodsVolume" :disabled="true" placeholder=""></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="货品名称">
                <oms-input v-model="form.tmsGoodsTotalName" :disabled="true" placeholder=""></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="总价">
                <oms-input v-model="form.outboundGoodsPrice" :disabled="true" placeholder=""></oms-input>
              </el-form-item>
            </two-column>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
import {BaseInfo, TransferOutOrder} from '@/resources';
import TwoColumn from '@dtop/dtop-web-common/packages/two-column';
import utils from '@/tools/utils'

export default {
  components: {TwoColumn},
  data() {
    return {
      address: utils.address,
      addressList: [],
      pageSets: [
        {name: '基础信息', key: 0},
        {name: '发货信息', key: 1},
        {name: '收货信息', key: 2},
        {name: '订单货品信息', key: 3},
        {name: '出库货品信息', key: 4}
      ],
      currentTab: {},
      carrierList: [],
      form: {
        senderAddress: '',
        goodsWeight: '',
        goodsVolume: '',
        goodsPrice: '',
        wholeBoxCount: '',
        bulkBoxCount: '',
        outboundWholeBoxCount: '',
        outboundBulkBoxCount: '',
        // 出库的重量和体积，需要动态计算
        outboundGoodsWeight: '',
        outboundGoodsVolume: '',
        outboundGoodsPrice: '',

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
        receiverDetailAddr: '', //收货单位地址
        receiverProvinceCode: '', //收货单位省编码
        receiverCityCode: '', //收货单位市编码
        receiverRegionCode: '' //收货单位区编码
      },
      doing: false,
      rules: {
        senderRegionCode: [
          {
            required: true,
            validator: (rules, value, cb) => {
              if (!value && this.senderOptions.length === 0) {
                return cb(new Error('请选择发货地区'));
              }

              return cb();
            },
            trigger: 'change'
          },
        ],
        receiverRegionCode: [
          {
            required: true,
            validator: (rules, value, cb) => {
              if (!value && this.receiverOptions.length === 0) {
                return cb(new Error('请选择收货地区'));
              }

              return cb();
            },
            trigger: 'change'
          },
        ],
        waybillType: [
          {required: true, message: '请选择运单类型', trigger: 'change'}
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
        senderDetailAddr: [
          {required: true, message: '请输入具体的发货地址', trigger: 'blur'}
        ],
        receiverDetailAddr: [
          {required: true, message: '请输入具体的收货地址', trigger: 'blur'}
        ],
        outboundWholeBoxCount: [
          {required: true, type: 'integer', message: '请输入出库整箱箱数', trigger: 'blur'}
        ],
        outboundBulkBoxCount: [
          {required: true, type: 'integer', message: '请输入出库散件箱数', trigger: 'blur'}
        ],
      },
      customerList: [],
      senderOrgList: [],
      receiverOrgList: [],
      senderOptions: [],
      receiverOptions: [],
    };
  },
  computed: {
    // 发货地址：省市区+详细地址
    senderAddress() {
      if (this.senderOptions.length === 0) {
        return '';
      }

      if (!this.form.senderDetailAddr) {
        return '';
      }

      // 根据所选择的地区信息获取省市区的名字
      const nodes = this.$refs.senderCascader.getCheckedNodes();
      if (nodes.length == 0) {
        return '';
      }

      const pathLabels = nodes[0] && nodes[0].pathLabels;
      if (!pathLabels) return "";

      return pathLabels.join('') + this.form.senderDetailAddr;
    },
    // 收货地址：省市区+详细地址
    receiverAddress() {
      if (this.receiverOptions.length === 0) {
        return '';
      }

      if (!this.form.receiverDetailAddr) {
        return '';
      }

      // 根据所选择的地区信息获取省市区的名字
      const nodes = this.$refs.receiverCascader.getCheckedNodes();
      if (nodes.length == 0) {
        return '';
      }

      const pathLabels = nodes[0] ? nodes[0].pathLabels : [];
      return pathLabels.join('') + this.form.receiverDetailAddr;
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
    },
    boxCount() {
      return parseInt(this.form.wholeBoxCount) + parseInt(this.form.bulkBoxCount);
    },
    outboundBoxCount() {
      return parseInt(this.form.outboundWholeBoxCount) + parseInt(this.form.outboundBulkBoxCount);
    },
  },
  props: ['formItem', 'action'],
  watch: {
    formItem(val) {
      this.form = val;

      this.filterCustomer(this.form.orgName);
      this.filterSenderOrg(this.form.senderName);
      this.filterReceiverOrg(this.form.receiverName);

      this.$nextTick(() => {
        this.senderOptions = [];
        this.receiverOptions = [];
        this.addrHandel();
        this.$refs.form && this.$refs.form.clearValidate();
      });
    },
    senderOptions(val) {
      let senderProvinceCode = '', senderCityCode = '', senderRegionCode = '';
      if (val.length === 3) {
        // 额外处理地区和地址的信息
        senderProvinceCode = val[0];
        senderCityCode = val[1];
        senderRegionCode = val[2];
      }

      this.form = Object.assign({}, this.form, {
        senderProvinceCode,
        senderCityCode,
        senderRegionCode,
      });
    },
    receiverOptions(val) {
      if (val.length == 0) {
        this.form.receiverProvinceCode = '';
        this.form.receiverCityCode = '';
        this.form.receiverRegionCode = '';
        return;
      }

      this.form.receiverProvinceCode = val[0];
      this.form.receiverCityCode = val[1];
      this.form.receiverRegionCode = val[2];
    },
    senderAddress(val) {
      this.form.senderAddress = val;
    },
    receiverAddress(val) {
      this.form.receiverAddress = val;
    },
    // 当出库的整件箱数或散件箱数发生变化时，对应的重量、体积、价格需要按比例重新计算
    "form.outboundWholeBoxCount": function () {
      this.recalculateOut();
    },
    "form.outboundBulkBoxCount": function () {
      this.recalculateOut();
    }
  },
  methods: {
    addrHandel() {
      // 历史订单中detailAddr没有数据，就把原来的地址赋值给详细地址,方便编辑
      const {senderAddress, senderDetailAddr, receiverDetailAddr, receiverAddress} = this.form;
      if (!senderDetailAddr) {
        this.form.senderDetailAddr = senderAddress;
      }

      if (!receiverDetailAddr) {
        this.form.receiverDetailAddr = receiverAddress;
      }

      if (this.form.senderRegionCode){
        this.senderOptions = [
          this.form.senderProvinceCode,
          this.form.senderCityCode,
          this.form.senderRegionCode
        ];
      }

      if (this.form.receiverRegionCode){
        this.receiverOptions = [
          this.form.receiverProvinceCode,
          this.form.receiverCityCode,
          this.form.receiverRegionCode
        ];
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
    filterReceiverOrg(receiverName, pageNo = 1, pageSize = 100) {
      this.$http.get('/receiver', {params: {receiverName, pageNo, pageSize}})
        .then(res => {
          const {totalPage, list} = res.data;
          if (pageNo == 1) {
            this.receiverOrgList = list;
          } else {
            this.receiverOrgList = this.receiverOrgList.concat(list);
          }

          if (totalPage > pageNo) {
            this.filterReceiverOrg(receiverName, pageNo++);
            return;
          }

          const none = this.receiverOrgList.findIndex(org=>org.receiverId == this.form.receiverId) == -1;
          if (none){
            this.receiverOrgList.push({
              receiverId:this.form.receiverId,
              receiverName:this.form.receiverName,
            })
          }
        })
    },
    selectTab(item) {
      this.currentTab = item;
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid || this.doing === true) {
          return;
        }

        if (this.form.receiverName === this.form.receiverId) {
          // 如果id和名字是一样的说明是新增的单位，需要把id置空
          this.form.receiverId = 'new';
        }

        if (this.action === 'add') {
          this.addHandle();
        } else {
          console.error('未知的action=', this.action);
        }
      });
    },
    addHandle() {
      this.doing = true;
      TransferOutOrder.save(this.form).then(res => {
        this.doing = false;
        this.$notify.success('新增【中转出库单】成功');
        this.$emit('change', res.data);
      }).catch(error => {
        this.doing = false;
        this.$notify.error({
          duration: 2000,
          message: error.response && error.response.data && error.response.data.msg || '新增订单失败'
        });
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
        this.form.receiverProvinceCode = '';
        this.form.receiverCityCode = '';
        this.form.receiverRegionCode = '';
        this.form.receiverDetailAddr = '';
        this.receiverOptions = [];
        this.addressList = [];
        return;
      }

      const item = this.receiverOrgList.find(item => item.receiverId == value);
      if (!item) {
        this.form.receiverName = value;
        this.form.receiverProvinceCode = '';
        this.form.receiverCityCode = '';
        this.form.receiverRegionCode = '';
        this.form.receiverDetailAddr = '';
        this.receiverOptions = [];
        this.addressList = [];
        return;
      }

      this.addressList = item.addressList;
      if (this.addressList.length == 0) {
        this.form.receiverDetailAddr = '';
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
      this.form.receiverDetailAddr = receiverAddress;

      this.receiverOptions = [
        this.form.receiverProvinceCode,
        this.form.receiverCityCode,
        this.form.receiverRegionCode
      ];
    },
    receiverDetailAddrChange(value) {
      if (!value) {
        return;
      }

      const addr = this.addressList.find(item => item.receiverAddress == value);
      if (!addr) {
        this.form.receiverDetailAddr = value;
        return;
      }

      this.receiverOptions = [addr.receiverProvinceCode, addr.receiverCityCode, addr.receiverRegionCode];
    },
    getCarrierList(pageNo, keyWord = '') {
      const pageSize = 20;
      this.$http.get('/carrier/findCarrierByPage', {params: {status: 2, keyWord, pageNo, pageSize}})
        .then(res => {
          const {list, totalPage} = res.data;
          this.carrierList = list;
          if (totalPage > pageNo) {
            this.getCarrierList(++pageNo);
          }
        })
        .catch(err => {
          this.carrierList = [];
        })
    },
    insureAmountFormat() {// 格式化单价，保留两位小数
      this.form.insureAmount = utils.autoformatDecimalPoint(this.form.insureAmount);
    },
    // 当出库的整件箱数或散件箱数发生变化时，对应的重量、体积、价格需要按比例重新计算
    recalculateOut() {
      if (this.boxCount == 0) {
        // 避免出现除0异常
        return;
      }

      // 再根据比例和新的数量计算新的重量、体积、价格
      const outboundGoodsWeight = this.form.goodsWeight / this.boxCount * this.outboundBoxCount;
      const outboundGoodsVolume = this.form.goodsVolume / this.boxCount * this.outboundBoxCount;
      const outboundGoodsPrice = this.form.goodsPrice / this.boxCount * this.outboundBoxCount;

      this.form.outboundGoodsWeight = outboundGoodsWeight.toFixed(6);
      this.form.outboundGoodsVolume = outboundGoodsVolume.toFixed(6);
      this.form.outboundGoodsPrice = outboundGoodsPrice.toFixed(6);
    }
  },
  filters: {
    transName(val) {
      if (val === 'A') {
        return '全部';
      } else if (val === 'B') {
        return '冷链运输';
      } else if (val === 'C') {
        return '常温运输';
      } else {
        return '';
      }
    }
  },
  mounted() {
    // this.filterReceiverOrg('');
    this.getCarrierList(1);
  }
}
</script>
