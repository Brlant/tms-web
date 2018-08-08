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
    <template slot="title">质量评估</template>
    <template slot="btn">
      <el-button plain @click="save('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <el-form-item label="是否合格" prop="qualityFlag">
          <el-switch active-text="合格" inactive-text="不合格" active-color="#13ce66" inactive-color="#ff4949"
                     v-model="form.qualityFlag"></el-switch>
        </el-form-item>
        <el-form-item label="评估结论" prop="qualityInspection">
          <oms-input v-model="form.qualityInspection" type="textarea" placeholder="请输入评估结论"></oms-input>
        </el-form-item>
        <el-form-item label="附件">
          <oms-upload :fileList="attachmentList" @change="changeFiles"
                      :formData="{ objectId: form.id, objectType: 'waybill-check'}"></oms-upload>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {BaseInfo, OmsAttachment, TmsWayBill} from '@/resources';

  export default {
    data () {
      return {
        list: [],
        times: [],
        pageSets: [],
        currentTab: {},
        form: {
          id: '',
          attachmentIdList: [],
          qualityInspection: ''
        },
        doing: false,
        rules: {
          qualityInspection: [
            {required: true, message: '请输入评估结论', trigger: 'blur'}
          ],
          qualityFlag: [
            {required: true, message: '请选择是否合格', trigger: 'blur'}
          ]
        },
        customerList: [],
        senderOrgList: [],
        receiverOrgList: [],
        attachmentList: []
      };
    },
    computed: {
      shipmentWayList () {
        return this.$getDict('shipmentWayType');
      },
      typeList () {
        return this.$getDict('transportationCondition');
      },
      serviceTypeList () {
        return this.$getDict('serviceType');
      }
    },
    props: ['formItem', 'action'],
    watch: {
      formItem: function (val) {
        if (val.id) {
          this.form = val;
          if (!val.qualityFlag) {
            this.form.qualityFlag = false;
          }
          this.getFileList();
        }
      }
    },
    methods: {
      changeFiles: function (fileList) {
        let ids = [];
        fileList.forEach(file => {
          ids.push(file.attachmentId);
        });
        this.form.attachmentIdList = ids;
      },
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
      selectTab (item) {
        this.currentTab = item;
      },
      save (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.doing = true;
            this.$confirm('确认保存运单"' + this.form.waybillNumber + '"的评估结果?', '', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let tempForm = {
                flag: this.form.qualityFlag === null ? false : this.form.qualityFlag,
                remark: this.form.qualityInspection,
                attachmentIdList: this.form.attachmentIdList
              };
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
  };
</script>
