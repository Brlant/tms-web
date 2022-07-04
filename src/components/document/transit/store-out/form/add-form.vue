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
    <template slot="title">新增中转出库单</template>
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
                <two-column>
                    <el-form-item slot="left" label="中转出库单号">
                        <oms-input v-model="form.orderNo" :disabled="true" placeholder=""></oms-input>
                    </el-form-item>
                </two-column>
                <two-column>
                    <el-form-item slot="left" label="订单号">
                        <oms-input v-model="form.orderNo" :disabled="true" placeholder=""></oms-input>
                    </el-form-item>
                    <el-form-item slot="right" label="中转入库单">
                        <oms-input v-model="form.tmsOrderNumber" :disabled="true" placeholder=""></oms-input>
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
                    <!-- <el-form-item label="是否对接" prop="butt" required>
                        <el-radio v-model="formData.butt" :label="true">是</el-radio>
                        <el-radio v-model="formData.butt" :label="false">否</el-radio>
                    </el-form-item> -->
                    <el-form-item slot="left" label="承运类型" prop="butt" required>
                        <el-radio v-model="form.butt" :label="false">自行承运</el-radio>
                        <el-radio v-model="form.butt" :label="true">第三方承运</el-radio>
                    </el-form-item>
                    <el-form-item slot="right" label="承运商名称" prop="shipmentWay">
                        <el-select v-model="form.shipmentWay" placeholder="请选择承运商名称" :clearable="true">
                            <el-option :label="item.label" :value="item.key" :key="item.key"
                                    v-for="item in shipmentWayList"></el-option>
                        </el-select>
                    </el-form-item>
                </two-column>
                <two-column>
                    <!-- <el-form-item label="是否对接" prop="butt" required>
                        <el-radio v-model="formData.butt" :label="true">是</el-radio>
                        <el-radio v-model="formData.butt" :label="false">否</el-radio>
                    </el-form-item> -->
                    <el-form-item slot="left" label="是否投保" prop="butt" required>
                        <el-radio v-model="form.butt" :label="false">否</el-radio>
                        <el-radio v-model="form.butt" :label="true">是</el-radio>
                    </el-form-item>
                    <el-form-item slot="right" label="保险金额(元)" prop="shipmentWay">
                        <oms-input v-model="form.orderNo"  placeholder="请输入保险金额"></oms-input>
                    </el-form-item>
                </two-column>
                <div class="hr"></div>
            </div>
        </div>
        <div class="form-header-part">
            <div class="header">
                <div class="sign f-dib"></div>
                <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">
                {{pageSets[1].name}}</h3>
            </div>
            <div class="content">
                <el-form-item label="货主">
                    <el-select placeholder="请选择货主" v-model="form.deliveryWay" disabled>
                        <el-option :label="item.label" :value="item.key" :key="item.key"
                                v-for="item in deliveryWayList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发货单位">
                    <oms-input v-model="form.orderNo"  placeholder="请输入发货单位"></oms-input>
                </el-form-item>
                <two-column>
                    <el-form-item slot="left" label="发货联系人" prop="waybillType">
                        <oms-input v-model="form.waybillType"  placeholder="请输入发货联系人"></oms-input>
                    </el-form-item>
                    <el-form-item slot="right" label="电话" prop="phone">
                        <oms-input v-model="form.phone"  placeholder="请输入电话"></oms-input>
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
                {{pageSets[2].name}}</h3>
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
                    <el-form-item slot="left" label="收货联系人" prop="waybillType">
                        <oms-input v-model="form.waybillType"  placeholder="请输入收货联系人"></oms-input>
                    </el-form-item>
                    <el-form-item slot="right" label="收货联系电话" prop="phone">
                        <oms-input v-model="form.phone"  placeholder="请输入收货联系电话"></oms-input>
                    </el-form-item>
                </two-column>
                <two-cloumn>
                    <el-form-item slot="left" label="收货地区" prop="receiverRegionCode">
                        <el-cascader ref="receiverCascader"
                           v-model="receiverOptions"
                           placeholder="试试搜索：合肥"
                           :options="address"
                           filterable clearable></el-cascader>
                    </el-form-item>
                </two-cloumn>
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
                <div class="hr"></div> 
            </div>
        </div>
        <div class="form-header-part">
            <div class="header">
                <div class="sign f-dib"></div>
                <h3 class="tit f-dib index-tit" :class="{active: pageSets[3].key === currentTab.key}">
                {{pageSets[3].name}}</h3>
            </div>
            <div class="content">
                <two-column>
                    <el-form-item slot="left" label="整箱箱数">
                        <oms-input v-model="form.orderNo" :disabled="true" placeholder=""></oms-input>
                    </el-form-item>
                    <el-form-item slot="right" label="散件箱数">
                        <oms-input v-model="form.tmsOrderNumber" :disabled="true" placeholder=""></oms-input>
                    </el-form-item>
                </two-column>
                <two-column>
                    <el-form-item slot="left" label="重量kg">
                        <oms-input v-model="form.orderNo" :disabled="true" placeholder=""></oms-input>
                    </el-form-item>
                    <el-form-item slot="right" label="体积m³">
                        <oms-input v-model="form.tmsOrderNumber" :disabled="true" placeholder=""></oms-input>
                    </el-form-item>
                </two-column>
                <two-column>
                    <el-form-item slot="left" label="货品名称">
                        <oms-input v-model="form.orderNo" :disabled="true" placeholder=""></oms-input>
                    </el-form-item>
                    <el-form-item slot="right" label="总价">
                        <oms-input v-model="form.tmsOrderNumber" :disabled="true" placeholder=""></oms-input>
                    </el-form-item>
                </two-column>
                <div class="hr"></div> 
            </div>
        </div>
        <div class="form-header-part">
            <div class="header">
                <div class="sign f-dib"></div>
                <h3 class="tit f-dib index-tit" :class="{active: pageSets[4].key === currentTab.key}">
                {{pageSets[4].name}}</h3>
            </div>
            <div class="content">
                <two-column>
                    <el-form-item slot="left" label="出库整箱箱数">
                        <oms-input v-model="form.orderNo"  placeholder=""></oms-input>
                    </el-form-item>
                    <el-form-item slot="right" label="出库散件箱数">
                        <oms-input v-model="form.tmsOrderNumber"  placeholder=""></oms-input>
                    </el-form-item>
                </two-column>
                <two-column>
                    <el-form-item slot="left" label="重量kg">
                        <oms-input v-model="form.orderNo" :disabled="true" placeholder=""></oms-input>
                    </el-form-item>
                    <el-form-item slot="right" label="体积m³">
                        <oms-input v-model="form.tmsOrderNumber" :disabled="true" placeholder=""></oms-input>
                    </el-form-item>
                </two-column>
                <two-column>
                    <el-form-item slot="left" label="货品名称">
                        <oms-input v-model="form.orderNo" :disabled="true" placeholder=""></oms-input>
                    </el-form-item>
                    <el-form-item slot="right" label="总价">
                        <oms-input v-model="form.tmsOrderNumber" :disabled="true" placeholder=""></oms-input>
                    </el-form-item>
                </two-column>
            </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
import {OmsAttachment, TmsWayBill} from '@/resources';
import utils from '@/tools/utils'
export default {
    data() {
      return {
        address: utils.address,
        addressList: [],//具体地址数组
        // list: [],
        // times: [],
        pageSets: [
            {name: '基础信息', key: 0},
            {name: '发货信息', key: 1},
            {name: '收货信息', key: 2},
            {name: '订单货品信息', key: 3},
            {name: '出库货品信息', key: 4}
        ],
        currentTab: {},
        form: {
          id: '',
          attachmentIdList: [],
          qualityInspection: '',
          broken:'2',
          note:''
        },
        doing: false,
        rules: {
          integer: [
            {required: true, message: '请输入实收整装箱数', trigger: 'blur'}
          ],
          bulk: [
            {required: true, message: '请输入实收散装箱数', trigger: 'blur'}
          ],
          broken: [
            {required: true, message: '请选择是否合格', trigger: 'blur'}
          ]
        },
        senderOptions: [], // 发货地区
        receiverOptions: [], // 收货地区
        receiverOrgList: [], //收货单位
        attachmentList: []
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
    props: ['formItem', 'action'],
    watch: {
      formItem: function (val) {
        if (val.id) {
          this.form = val;
          this.getFileList();
        }
      }
    },
    methods: {
      setDoing(val) {
        this.doing = val;
      },
      changeFiles: function (fileList) {
        let ids = [];
        fileList.forEach(file => {
          ids.push(file.attachmentId);
        });
        this.form.attachmentIdList = ids;
      },
    // 详情
      getFileList: function () {
        if (!this.form.id) return;
        OmsAttachment.queryOneAttachmentList(this.form.id, 'waybill-check').then(res => {
          this.attachmentList = res.data;
          let ids = [];
          this.attachmentList.forEach(file => {
            ids.push(file.attachmentId);
          });
          this.form.attachmentIdList = ids;
        });
      },
    //   切换
      selectTab(item) {
        this.currentTab = item;
      },
    //   保存
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.$confirm('确认保存运单"' + this.form.waybillNumber + '"的评估结果?', '', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let tempForm = {
                flag: this.form.qualityFlag === null ? false : this.form.qualityFlag,
                qualityInspection: this.form.qualityInspection,
                attachmentIdList: this.form.attachmentIdList
              };
              this.doing = true;
              TmsWayBill.assessmentTmsWayBill(this.form.id, tempForm).then(res => {
                this.$notify.success({
                  name: '成功',
                  message: '保存运单"' + this.form.waybillNumber + '"评估结果成功'
                });
                this.doing = false;
                this.$emit('change', this.form);
                this.$emit('right-close');
              }).catch(error => {
                this.$notify.error({
                  duration: 2000,
                  message: error.response && error.response.data && error.response.data.msg || '保存运单评估结果失败'
                });
                this.doing = false;
              });
            });
          }
        });

      }
    }
  }
  ;
</script>
