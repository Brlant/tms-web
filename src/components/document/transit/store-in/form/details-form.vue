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
  margin-bottom: 0;
}
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">查看详情</template>
    <template slot="btn">
      <el-button plain @click="close('form')" :disabled="doing">关闭</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :model="form" class="clearfix" label-width="120px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
              {{ pageSets[0].name }}</h3>
          </div>
          <div class="content">
            <oms-col label="中转入库单号" :rowSpan="span" :value="form.transferInOrderNo"/>
            <div class=" clearfix"></div>
            <oms-col
              label="订单号"
              :rowSpan="span"
              :value="form.orderNo"
            >
              <div style="word-break: break-all;">{{form.orderNo}}</div>
            </oms-col>
            <oms-col label="运单号" :rowSpan="span" :value="form.waybillNo"/>

            <oms-col label="运单类型" :rowSpan="span" :value="form.waybillType">
              <dict :dict-group="'bizType'" :dict-key="form.waybillType"></dict>
            </oms-col>
            <oms-col label="运输条件" :rowSpan="span" :value="form.shipmentWay">
              <dict :dict-group="'transportationCondition'" :dict-key="form.shipmentWay"></dict>
            </oms-col>
            <oms-col label="发运方式" :rowSpan="span" :value="form.deliveryWay">
              <dict :dict-group="'deliveryWay'" :dict-key="form.deliveryWay"></dict>
            </oms-col>
            <oms-col label="货品名称" :rowSpan="span" :value="form.tmsGoodsTotalName"/>

            <oms-col label="货主" :rowSpan="span" :value="form.orgName"/>
            <div class=" clearfix"></div>
            <oms-col label="发货单位" :rowSpan="span" :value="form.senderName"/>
            <div class=" clearfix"></div>
            <oms-col label="收货单位" :rowSpan="span" :value="form.receiverName"/>
            <div class="clearfix"></div>
            <oms-col label="整装箱数" :rowSpan="span" :value="form.wholeBoxCount"/>
            <oms-col label="散装箱数" :rowSpan="span" :value="form.bulkBoxCount"/>
            <oms-col label="实收整装箱数" :rowSpan="span" :value="form.actualWholeNum"/>
            <oms-col label="实收散装箱数" :rowSpan="span" :value="form.actualBulkNum"/>
            <oms-col label="破损散装箱数" :rowSpan="span" :value="form.damagedWholeNum"/>
            <oms-col label="破损散装箱数" :rowSpan="span" :value="form.damagedBulkNum"/>
            <div class="mb-10 clearfix"></div>
            <el-row>
              <el-col :span="24">
                <div>
                  <oms-row label="备注" :span="4">
                    <slot>{{ form.remarks }}</slot>
                  </oms-row>
                </div>
              </el-col>
            </el-row>
            <div class="hr mb-15 clearfix"></div>
          </div>
        </div>

        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">
              {{ pageSets[1].name }}</h3>
          </div>
          <div class="content">
            <oms-col label="库位码" :rowSpan="span" :value="form.storeCode"/>
            <div class="hr mb-10 clearfix"></div>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[2].key === currentTab.key}">
              {{ pageSets[2].name }}</h3>
          </div>
          <div class="content">
            <el-row :gutter="20" class="mb-15">
              <oms-col label="入库整装箱数" :rowSpan="span" :value="form.warehousingWholeNum"/>
              <oms-col label="入库散装箱数" :rowSpan="span" :value="form.warehousingBulkNum"/>
              <div class="clearfix"></div>
            </el-row>
            <el-row class="mb-15">
              <el-form-item label="扫描整装箱码">
                <oms-input v-model="form.wholeTraceCodes" type="textarea" :disabled="true"></oms-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="扫描散装箱码">
                <oms-input v-model="form.bulkTraceCodes" type="textarea" :disabled="true"></oms-input>
              </el-form-item>
            </el-row>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>

import {TransferInOrder} from '@/resources';

export default {
  props: ['formItem', 'action'],
  data() {
    return {
      span: 8,
      pageSets: [
        {name: '任务详情', key: 0},
        {name: '库位信息', key: 1},
        {name: '上架详情', key: 2}
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
    };
  },
  watch: {
    formItem: function (val) {
      if (val.id) {
        this.getDetails(val.id);
      }
    }
  },
  methods: {
    setDoing(val) {
      this.doing = val;
    },
    // 详情
    getDetails(id) {
      TransferInOrder.getDetails(id).then(res => {
        this.form = res.data;
      })
    },
    // 切换
    selectTab(item) {
      this.currentTab = item;
    },
    // 关闭
    close() {
      this.doing = false;
      this.$emit('right-close');
    }
  }
}
</script>
