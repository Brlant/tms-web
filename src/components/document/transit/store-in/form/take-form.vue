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
// .el-form-item {
//   margin-bottom: 0px;
// }
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
              :value="form.waybillNumber"
            />
            <oms-col
              label="订单号"
              :rowSpan="span"
              :value="form.waybillNumber"
            />
            <oms-col
              label="运单号"
              :rowSpan="span"
              :value="form.waybillNumber"
            />
            <oms-col
              label="运单类型"
              :rowSpan="span"
              :value="form.waybillNumber"
            />
            <oms-col
              label="运输条件"
              :rowSpan="span"
              :value="form.waybillNumber"
            />
            <oms-col
              label="发货方式"
              :rowSpan="span"
              :value="form.waybillNumber"
            />
            <oms-col label="货主" :rowSpan="span" :value="form.waybillNumber" />
            <oms-col
              label="收货单位"
              :rowSpan="span"
              :value="form.waybillNumber"
            />
            <div class="hr mb-10 clearfix"></div>
            <!-- <oms-col label="运单状态" :rowSpan="span" :value="form.status">
                {{ formatStatusTitle(form.status, orderType) }}
                </oms-col> -->
          </div>
        </div>
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
              :value="form.waybillNumber"
            />
            <oms-col label="总价" :rowSpan="span" :value="form.waybillNumber" />
            <oms-col
              label="整装箱数"
              :rowSpan="span"
              :value="form.waybillNumber"
            />
            <oms-col
              label="散装箱数"
              :rowSpan="span"
              :value="form.waybillNumber"
            />
            <oms-col
              label="重量kg"
              :rowSpan="span"
              :value="form.waybillNumber"
            />
            <oms-col
              label="体积m³"
              :rowSpan="span"
              :value="form.waybillNumber"
            />
            <div class="hr mb-10 clearfix"></div>
          </div>
        </div>
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
              :value="form.waybillNumber"
            />
            <oms-col label="总价" :rowSpan="span" :value="form.waybillNumber" />
            <div class="mb-10 clearfix"></div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="实收整装箱数" prop="wholeBoxCount">
                  <oms-input
                    v-model="form.wholeBoxCount"
                    type="interge"
                    :min="0"
                    placeholder="请输入实收整装箱数"
                    @blur="setWholeBoxCount(form.wholeBoxCount)"
                  ></oms-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实收散装箱数" prop="bulkBoxCount">
                  <oms-input
                    v-model="form.bulkBoxCount"
                    type="interge"
                    :min="0"
                    placeholder="请输入实收散装箱数"
                    @blur="setBulkBoxCount(form.bulkBoxCount)"
                  ></oms-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="hide">
              <el-col :span="12">
                <el-form-item label="重量kg">
                  <oms-input
                    v-model="form.weight"
                    :readonly="true"
                    type="text"
                  ></oms-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="体积m³">
                  <oms-input
                    v-model="form.volume"
                    :readonly="true"
                    type="text"
                  ></oms-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="是否合格" prop="broken">
                  <!-- <el-radio v-model="form.broken" label="2">否</el-radio>
                  <el-radio v-model="form.broken" label="1">是</el-radio> -->
                  <el-radio-group v-model="form.broken">
                    <el-radio  label="0">否</el-radio>
                    <el-radio  label="1">是</el-radio>
                  </el-radio-group>
                </el-form-item>
                
              </el-col>
            </el-row>
            <el-row v-if="form.broken == 1">
              <el-col :span="12">
                <el-form-item label="破损整装箱数" prop="unWholeBoxCount">
                  <oms-input
                    v-model="form.unWholeBoxCount"
                    type="interge"
                    :min="0"
                    placeholder="请输入破损整装箱数"
                    @blur="setUnWholeBoxCount(form.unWholeBoxCount)"
                  ></oms-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="破损散装箱数" prop="unBulkBoxCount">
                  <oms-input
                    v-model="form.unBulkBoxCount"
                    type="interge"
                    :min="0"
                    placeholder="请输入破损散装箱数"
                    @blur="setUnWholeBoxCount(form.unBulkBoxCount)"
                  ></oms-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="备注">
                <oms-input
                  v-model="form.note"
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
import { OmsAttachment, TmsWayBill } from "@/resources";

export default {
  data() {
    return {
      span: 8,
      pageSets: [
        { name: "任务详情", key: 0 },
        { name: "货品详情", key: 1 },
        { name: "收货信息", key: 2 },
      ],
      currentTab: {},
      form: {
        id: "",
        // attachmentIdList: [],
        qualityInspection: "",
        broken: 0,
        wholeBoxCount: "",
        bulkBoxCount: "",
        goodsWeight: "",
        goodsVolume: "",
        unWholeBoxCount: "",
        unBulkBoxCount: "",
        note: "",
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
        broken: [
          { required: true, message: "请选择是否合格", trigger: "blur" },
        ],
        unWholeBoxCount: [
          {
            required: true,
            type: "integer",
            message: "请输入破损整装箱数",
            trigger: "blur",
          },
        ],
        unBulkBoxCount: [
          {
            required: true,
            type: "integer",
            message: "请输入破损散装箱数",
            trigger: "blur",
          },
        ],
      },
      // customerList: [],
      // senderOrgList: [],
      // receiverOrgList: [],
      attachmentList: [],
    };
  },
  // computed: {
  //   shipmentWayList() {
  //     return this.$getDict('shipmentWayType');
  //   },
  //   typeList() {
  //     return this.$getDict('transportationCondition');
  //   },
  //   serviceTypeList() {
  //     return this.$getDict('serviceType');
  //   }
  // },
  props: ["formItem", "action"],
  watch: {
    formItem: function (val) {
      if (val.id) {
        this.form = val;
        this.getFileList();
      }
    },
  },
  methods: {
    setDoing(val) {
      this.doing = val;
    },
    // changeFiles: function (fileList) {
    //   let ids = [];
    //   fileList.forEach(file => {
    //     ids.push(file.attachmentId);
    //   });
    //   this.form.attachmentIdList = ids;
    // },
    setWholeBoxCount(value) {
      if (!value || isNaN(value)) return;
      this.form.wholeBoxCount = parseInt(value, 10);
    },
    setBulkBoxCount(value) {
      if (!value || isNaN(value)) return;
      this.form.bulkBoxCount = parseInt(value, 10);
    },
    setUnWholeBoxCount(value) {
      if (!value || isNaN(value)) return;
      this.form.unWholeBoxCount = parseInt(value, 10);
    },
    setUnBulkBoxCount(value) {
      if (!value || isNaN(value)) return;
      this.form.unBulkBoxCount = parseInt(value, 10);
    },
    // 表单详情
    getFileList: function () {
      if (!this.form.id) return;
      OmsAttachment.queryOneAttachmentList(this.form.id, "waybill-check").then(
        (res) => {
          this.attachmentList = res.data;
          let ids = [];
          this.attachmentList.forEach((file) => {
            ids.push(file.attachmentId);
          });
          this.form.attachmentIdList = ids;
        }
      );
    },
    //   切换
    selectTab(item) {
      this.currentTab = item;
    },
    //   保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("校验成功");
        } else {
          console.log("校验失败");
        }
        // if (valid && this.doing === false) {
        //   this.$confirm('确认保存运单"' + this.form.waybillNumber + '"的评估结果?', '', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   }).then(() => {
        //     let tempForm = {
        //       flag: this.form.qualityFlag === null ? false : this.form.qualityFlag,
        //       qualityInspection: this.form.qualityInspection,
        //       attachmentIdList: this.form.attachmentIdList
        //     };
        //     this.doing = true;
        //     TmsWayBill.assessmentTmsWayBill(this.form.id, tempForm).then(res => {
        //       this.$notify.success({
        //         name: '成功',
        //         message: '保存运单"' + this.form.waybillNumber + '"评估结果成功'
        //       });
        //       this.doing = false;
        //       this.$emit('change', this.form);
        //       this.$emit('right-close');
        //     }).catch(error => {
        //       this.$notify.error({
        //         duration: 2000,
        //         message: error.response && error.response.data && error.response.data.msg || '保存运单评估结果失败'
        //       });
        //       this.doing = false;
        //     });
        //   });
        // }
      });
    },
  },
};
</script>
