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
    <template slot="title">下架</template>
    <template slot="btn">
      <el-button plain @click="save('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="120px" onsubmit="return false">
        <div class="form-header-part">
            <div class="header">
                <div class="sign f-dib"></div>
                <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
                {{pageSets[0].name}}</h3>
            </div>
            <div class="content">
            <oms-col label="中转出库单号" :rowSpan="span" :value="form.transferOutOrderNo"/>
            <oms-col label="中转入库单号" :rowSpan="span" :value="form.transferInOrderNo"/>
            <div class=" clearfix"></div>
            <oms-col label="订单号" :rowSpan="span" :value="form.orderNo"/>
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
            <oms-col label="状态" :rowSpan="span" :value="form.transferOutStatusName"/>
            <div class=" clearfix"></div>
            <oms-col label="发货单位" :rowSpan="span" :value="form.senderName"/>
            <oms-col label="发货联系人" :rowSpan="span" :value="form.senderContact"/>
            <oms-col label="发货联系电话" :rowSpan="span" :value="form.senderContactPhone"/>
            <oms-col label="发货地址" :rowSpan="span" :value="form.senderAddress"/>
            <div class=" clearfix"></div>
            <oms-col label="收货单位" :rowSpan="span" :value="form.receiverName"/>
            <oms-col label="收货联系人" :rowSpan="span" :value="form.receiverContact"/>
            <oms-col label="收货联系电话" :rowSpan="span" :value="form.receiverContractPhone"/>
            <oms-col label="收货单位" :rowSpan="span" :value="form.receiverName"/>
            <oms-col label="收货地址" :rowSpan="span" :value="form.receiverAddress"/>
            <div class="clearfix"></div>
            <oms-col label="整装箱数" :rowSpan="span" :value="form.wholeBoxCount"/>
            <oms-col label="散装箱数" :rowSpan="span" :value="form.bulkBoxCount"/>
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
                {{pageSets[1].name}}</h3>
            </div>
            <div class="content">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="库位码" prop="storeCode">
                            <oms-input v-model="form.storeCode" type="text" placeholder="请输入库位码"></oms-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="form-header-part">
            <div class="header">
                <div class="sign f-dib"></div>
                <h3 class="tit f-dib index-tit" :class="{active: pageSets[2].key === currentTab.key}">
                {{pageSets[2].name}}</h3>
            </div>
            <div class="content">
                    <el-row :gutter="20" class="mb-15">
                        <el-col :span="12">
                            <el-form-item label="出库整装箱数" prop="outboundWholeBoxCount">
                                <oms-input v-model="form.outboundWholeBoxCount" type="text" placeholder="请输入入库整装箱数"></oms-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="出库散装箱数" prop="outboundBulkBoxCount">
                                <oms-input v-model="form.outboundBulkBoxCount" type="text" placeholder="请输入入库散装箱数"></oms-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="mb-15">
                        <el-form-item label="扫描整装箱码" >
                            <oms-input v-model="form.wholeTraceCodes" type="textarea" ></oms-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="扫描散装箱码" >
                            <oms-input v-model="form.bulkTraceCodes" type="textarea" ></oms-input>
                        </el-form-item>
                    </el-row>
            </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>

import {TransferOutOrder} from '@/resources';

export default {
    data() {
      return {
        span:8,
        pageSets: [
            {name: '任务详情', key: 0},
            {name: '库位码', key: 1},
            {name: '下架详情', key: 2}
        ],
        currentTab: {},
        form: {
        id: 0,
        transferOutOrderNo: '',
        transferOutStatus: '',
        transferOutStatusName: '',
        createTime: '',
        storeCode: '',
        damaged: false,
        actualWholeNum: '',
        actualBulkNum: '',
        damagedWholeNum: '',
        damagedBulkNum: '',
        warehousingWholeNum: '',
        warehousingBulkNum: '',
        wholeTraceCodes: '',
        bulkTraceCodes: '',
        orderNo: '',
        waybillNo: '',
        waybillType: '',
        shipmentWay: '',
        deliveryWay: '',
        carrierId: '',
        carrierName: '',
        carryType: '',
        orgId: '',
        orgName: '',
        senderId: '',
        senderName: '',
        senderAddress: '',
        senderContact: '',
        senderContactPhone: '',
        receiverId: '',
        receiverName: '',
        receiverContact: '',
        receiverContractPhone: '',
        receiverAddress: '',
        goodsWeight: '',
        goodsVolume: '',
        wholeBoxCount: '',
        bulkBoxCount: '',
        goodsPrice: '',
        tmsGoodsTotalName: '',
        senderProvinceCode: '',
        senderCityCode: '',
        senderRegionCode: '',
        senderDetailAddr: '',
        receiverProvinceCode: '',
        receiverCityCode: '',
        receiverRegionCode: '',
        receiverDetailAddr: '',
        enabledStockWholeBoxCount: '',
        enabledStockBulkBoxCount: '',
        operatorId: '',
        operatorName: '',
        operatorStatus: '',
        remarks: ''
        },
        doing: false,
        rules: {
        storeCode: [
          {required: true, message: '库位码不能为空', trigger: 'blur'}
        ]
        },
      };
    },
    props: ['formItem', 'action'],
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
      TransferOutOrder.getDetails(id).then(res => {
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

        TransferOutOrder.unshelve(this.form)
          .then(res => {
            this.$notify.success("下架成功");
                this.$emit('right-close');
            this.$emit('change');
          })
          .catch(err => {
            console.log(err);
            this.$notify.error(err.response.data.msg || '下架失败');
          })
              });
    },

  },
};
</script>
