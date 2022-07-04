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
  margin-bottom: 0px;
}
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">上架</template>
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
                <oms-col label="中转入库单号" :rowSpan="span" :value="form.waybillNumber"/>
                <div class=" clearfix"></div>
                <oms-col label="订单号" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="运单号" :rowSpan="span" :value="form.waybillNumber"/>

                <oms-col label="运单类型" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="运输条件" :rowSpan="span" :value="form.waybillNumber"/>

                <oms-col label="发货方式" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="货品名称" :rowSpan="span" :value="form.waybillNumber"/>

                <oms-col label="货主" :rowSpan="span" :value="form.waybillNumber"/>
                <div class=" clearfix"></div>
                <oms-col label="发货单位" :rowSpan="span" :value="form.waybillNumber"/>
                <div class=" clearfix"></div>
                <oms-col label="收货单位" :rowSpan="span" :value="form.waybillNumber"/>
                <div class="clearfix"></div>
                <oms-col label="整装箱数" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="散装箱数" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="实收整装箱数" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="实收散装箱数" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="实收散装箱数" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="实收散装箱数" :rowSpan="span" :value="form.waybillNumber"/>
                <div class="mb-10 clearfix"></div>
                <el-row>
                    <el-col :span="24">
                        <div>
                            <oms-row label="备注" :span="4">
                                <slot>{{ form.goodsTotalName }}</slot>
                            </oms-row>
                        </div>
                    </el-col>
                </el-row>
                <div class="hr mb-10 clearfix"></div>
                <!-- <oms-col label="运单状态" :rowSpan="span" :value="form.status">
                {{ formatStatusTitle(form.status, orderType) }}
                </oms-col> -->
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
                        <el-form-item label="库位码" prop="integer">
                            <oms-input v-model="form.integer" type="text" placeholder="请输入实收整装箱数"></oms-input>
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
                            <el-form-item label="入库整装箱数" prop="bulk">
                                <oms-input v-model="form.bulk" type="interge" placeholder="请输入入库整装箱数"></oms-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="入库散装箱数" prop="bulk">
                                <oms-input v-model="form.bulk" type="interge" placeholder="请输入入库散装箱数"></oms-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="mb-15">
                        <el-form-item label="扫描整装箱码" >
                            <oms-input v-model="form.note" type="textarea" ></oms-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="扫描散装箱码" >
                            <oms-input v-model="form.note" type="textarea" ></oms-input>
                        </el-form-item>
                    </el-row>
            </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
import {OmsAttachment, TmsWayBill} from '@/resources';

export default {
    data() {
      return {
        span: 8,
        // list: [],
        // times: [],
        pageSets: [
            {name: '任务详情', key: 0},
            {name: '库位信息', key: 1},
            {name: '上架详情', key: 2}
        ],
        currentTab: {},
        form: {
          id: '',
          // attachmentIdList: [],
          qualityInspection: '',
          wholeBoxCount:'',
          bulkBoxCount:'',
          broken:'2',
          note:''
        },
        doing: false,
        rules: {
          wholeBoxCount: [
            {required: true, type: "integer", message: '请输入实收整装箱数', trigger: 'blur'}
          ],
          bulkBoxCount: [
            {required: true, type: "integer", message: '请输入实收散装箱数', trigger: 'blur'}
          ],
          broken: [
            {required: true, message: '请选择是否合格', trigger: 'blur'}
          ]
        },
        // customerList: [],
        // senderOrgList: [],
        // receiverOrgList: [],
        attachmentList: []
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
      // changeFiles: function (fileList) {
      //   let ids = [];
      //   fileList.forEach(file => {
      //     ids.push(file.attachmentId);
      //   });
      //   this.form.attachmentIdList = ids;
      // },
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
