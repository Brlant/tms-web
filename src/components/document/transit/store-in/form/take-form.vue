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

::v-deep .hide .el-input__inner {
  border: 0;
}
</style>

<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">收货</template>
    <template slot="btn">
      <el-button plain @click="save('form')" :disabled="doing">收货</el-button>
    </template>
    <template slot="content">
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        class="clearfix"
        label-width="120px"
        onsubmit="return false"
      >
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3
              class="tit f-dib index-tit"
              :class="{ active: pageSets[0].key === currentTab.key }"
            >
              {{ pageSets[0].name }}
            </h3>
          </div>
          <div class="content">
            <oms-col
              label="中转入库单号"
              :rowSpan="span"
              :value="form.transferInOrderNo"
            />
            <oms-col
              label="订单号"
              :rowSpan="span"
              :value="form.orderNo"
            />
            <oms-col
              label="运单号"
              :rowSpan="span"
              :value="form.waybillNo"
            />
            <oms-col label="运单类型" :rowSpan="span" :value="form.waybillType">
              <dict :dict-group="'bizType'" :dict-key="form.waybillType"></dict>
            </oms-col>
            <oms-col label="运输条件" :rowSpan="span" :value="form.shipmentWay">
              <dict :dict-group="'transportationCondition'" :dict-key="form.shipmentWay"></dict>
            </oms-col>
            <oms-col label="发运方式" :rowSpan="span" :value="form.deliveryWay">
              <dict :dict-group="'deliveryWay'" :dict-key="form.deliveryWay"></dict>
            </oms-col>
            <oms-col label="货主" :rowSpan="span" :value="form.orgName"/>
            <oms-col
              label="收货单位"
              :rowSpan="span"
              :value="form.receiverName"
            />
          </div>
        </div>
        <div class="hr mb-10 clearfix"></div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3
              class="tit f-dib index-tit"
              :class="{ active: pageSets[1].key === currentTab.key }"
            >
              {{ pageSets[1].name }}
            </h3>
          </div>
          <div class="content">
            <oms-col
              label="货品名称"
              :rowSpan="span"
              :value="form.tmsGoodsTotalName"
            />
            <oms-col label="总价" :rowSpan="span" :value="form.goodsPrice"/>
            <oms-col
              label="整装箱数"
              :rowSpan="span"
              :value="form.wholeBoxCount"
            />
            <oms-col
              label="散装箱数"
              :rowSpan="span"
              :value="form.bulkBoxCount"
            />
            <oms-col
              label="重量kg"
              :rowSpan="span"
              :value="form.goodsWeight"
            />
            <oms-col
              label="体积m³"
              :rowSpan="span"
              :value="form.goodsVolume"
            />
          </div>
        </div>
        <div class="hr mb-10 clearfix"></div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3
              class="tit f-dib index-tit"
              :class="{ active: pageSets[2].key === currentTab.key }"
            >
              {{ pageSets[2].name }}
            </h3>
          </div>
          <div class="content">
            <oms-col
              label="货品名称"
              :rowSpan="span"
              :value="form.tmsGoodsTotalName"
            />
            <oms-col label="总价" :rowSpan="span" :value="form.goodsPrice"/>
            <div class="mb-10 clearfix"></div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="实收整装箱数" prop="wholeBoxCount">
                  <oms-input
                    v-model="form.actualWholeNum"
                    type="integer"
                    :min="0"
                    placeholder="请输入实收整装箱数"
                    @blur="setWholeBoxCount(form.actualWholeNum)"
                  ></oms-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实收散装箱数" prop="bulkBoxCount">
                  <oms-input
                    v-model="form.actualBulkNum"
                    type="integer"
                    :min="0"
                    placeholder="请输入实收散装箱数"
                    @blur="setBulkBoxCount(form.actualBulkNum)"
                  ></oms-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="hide">
              <el-col :span="12">
                <el-form-item label="重量kg">
                  <oms-input
                    v-model="form.goodsVolume"
                    :readonly="true"
                    type="text"
                  ></oms-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="体积m³">
                  <oms-input
                    v-model="form.goodsWeight"
                    :readonly="true"
                    type="text"
                  ></oms-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="是否破损" prop="damaged">
                  <el-radio-group v-model="form.damaged">
                    <el-radio :label="false">否</el-radio>
                    <el-radio :label="true">是</el-radio>
                  </el-radio-group>
                </el-form-item>

              </el-col>
            </el-row>
            <el-row v-if="form.damaged == 1">
              <el-col :span="12">
                <el-form-item label="破损整装箱数" prop="damagedWholeNum">
                  <oms-input
                    v-model="form.damagedWholeNum"
                    type="integer"
                    :min="0"
                    placeholder="请输入破损整装箱数"
                    @blur="setDamagedWholeBoxCount(form.damagedWholeNum)"
                  ></oms-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="破损散装箱数" prop="damagedBulkNum">
                  <oms-input
                    v-model="form.damagedBulkNum"
                    type="integer"
                    :min="0"
                    placeholder="请输入破损散装箱数"
                    @blur="setDamagedWholeBoxCount(form.damagedBulkNum)"
                  ></oms-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="备注">
                <oms-input
                  v-model="form.remarks"
                  type="textarea"
                  placeholder="请输入备注"
                ></oms-input>
              </el-form-item>
            </el-row>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
import {OmsAttachment, TransferInOrder} from "@/resources";

export default {
  data() {
    return {
      span: 8,
      pageSets: [
        {name: "任务详情", key: 0},
        {name: "货品详情", key: 1},
        {name: "收货信息", key: 2},
      ],
      currentTab: {},
      form: {
        id: 0,
        transferInOrderNo: '',
        transferInStatus: '',
        createTime: '',
        storeCode: '',
        damaged: false,
        actualWholeNum: 0,
        actualBulkNum: 0,
        damagedWholeNum: 0,
        damagedBulkNum: 0,
        warehousingWholeNum: 0,
        warehousingBulkNum: 0,
        wholeTraceCodes: '',
        bulkTraceCodes: '',
        orderNo: '',
        waybillNo: '',
        waybillType: '',
        shipmentWay: '',
        deliveryWay: '',
        carrierId: '',
        carrierName: '',
        carryType: 0,
        orgId: '',
        orgName: '',
        senderId: '',
        senderName: '',
        senderContact: '',
        senderContactPhone: '',
        receiverId: '',
        receiverName: '',
        receiverContact: '',
        receiverContractPhone: '',
        goodsWeight: 0.00,
        goodsVolume: 0.00,
        wholeBoxCount: 0,
        bulkBoxCount: 0,
        goodsPrice: 0.00,
        tmsGoodsTotalName: '',
        senderProvinceCode: '',
        senderCityCode: '',
        senderRegionCode: '',
        senderDetailAddr: '',
        receiverProvinceCode: '',
        receiverCityCode: '',
        receiverRegionCode: '',
        receiverDetailAddr: '',
        enabledStockWholeBoxCount: 0,
        enabledStockBulkBoxCount: 0,
        operatorId: '',
        operatorName: '',
        operatorStatus: '',
        remarks: ''
      },
      doing: false,
      rules: {
        wholeBoxCount: [
          {
            required: true,
            type: "integer",
            message: "请输入实收整装箱数",
            trigger: "blur",
          },
        ],
        bulkBoxCount: [
          {
            required: true,
            type: "integer",
            message: "请输入实收散装箱数",
            trigger: "blur",
          },
        ],
        damaged: [
          {required: true, message: "请选择是否破损", trigger: "blur"},
        ],
        damagedWholeBoxCount: [
          {
            required: true,
            type: "integer",
            message: "请输入破损整装箱数",
            trigger: "blur",
          },
        ],
        damagedBulkBoxCount: [
          {
            required: true,
            type: "integer",
            message: "请输入破损散装箱数",
            trigger: "blur",
          },
        ],
      }
    };
  },
  computed: {
    shipmentWayList() {
      return this.$getDict('shipmentWayType');
    },
    typeList() {
      return this.$getDict('transportationCondition');
    },
    serviceTypeList() {
      return this.$getDict('serviceType');
    }
  },
  props: ["formItem", "action"],
  watch: {
    formItem: function (val) {
      if (val.id) {
        this.getDetails(val.id);
      }
    },
  },
  methods: {
    setWholeBoxCount(value) {
      if (!value || isNaN(value)) return;
      this.form.wholeBoxCount = parseInt(value, 10);
    },
    setBulkBoxCount(value) {
      if (!value || isNaN(value)) return;
      this.form.bulkBoxCount = parseInt(value, 10);
    },
    setDamagedWholeBoxCount(value) {
      if (!value || isNaN(value)) return;
      this.form.damagedWholeBoxCount = parseInt(value, 10);
    },
    setdamagedBulkBoxCount(value) {
      if (!value || isNaN(value)) return;
      this.form.damagedBulkNum = parseInt(value, 10);
    },
    // 表单详情
    getDetails(id) {
      TransferInOrder.getDetails(id).then(res => {
        this.form = res.data;
      })
    },
    //   切换
    selectTab(item) {
      this.currentTab = item;
    },
    //   保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return;
        }

        TransferInOrder.receivingGoods(this.form)
          .then(res => {
            this.$notify.success("收货成功");
            this.$emit('right-close');
            this.$emit('change');
          })
          .catch(err => {
            console.log(err);
            this.$notify.error(err.response.data.msg || '收货失败');
          })
      });
    },
  },
};
</script>
