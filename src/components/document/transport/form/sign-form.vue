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
    <template slot="title">签收运单</template>
    <template slot="btn">
      <el-button plain @click="save('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <el-form-item label="签收人" prop="signPerson">
          <oms-input v-model="form.signPerson" placeholder="请输入签收人"></oms-input>
        </el-form-item>
        <el-form-item label="附件">
          <oms-upload :fileList="attachmentList" @change="changeFiles"
                      :formData="{ objectId: form.id, objectType: 'waybill'}"></oms-upload>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {BaseInfo, OmsAttachment, TmsWayBill} from '@/resources';

  export default {
    data() {
      return {
        list: [],
        times: [],
        pageSets: [],
        currentTab: {},
        form: {
          id: '',
          attachmentIdList: [],
          signPerson: ''
        },
        doing: false,
        rules: {
          signPerson: [
            {required: true, message: '请输入签收人', trigger: 'blur'}
          ]
        },
        customerList: [],
        senderOrgList: [],
        receiverOrgList: [],
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
      changeFiles: function (fileList) {
        let ids = [];
        fileList.forEach(file => {
          ids.push(file.attachmentId);
        });
        this.form.attachmentIdList = ids;
      },
      getFileList: function () {
        if (!this.form.id) return;
        OmsAttachment.queryOneAttachmentList(this.form.id, 'waybill').then(res => {
          this.attachmentList = res.data;
          let ids = [];
          this.attachmentList.forEach(file => {
            ids.push(file.attachmentId);
          });
          this.form.attachmentIdList = ids;
        });
      },
      selectTab(item) {
        this.currentTab = item;
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            TmsWayBill.signTmsWayBill(this.form.id, this.form).then(res => {
              this.$notify.success({
                name: '成功',
                message: '签收运单"' + this.form.waybillNumber + '"成功'
              });
              this.doing = false;
              this.$emit('change', this.form);
              this.$emit('right-close');
            }).catch(error => {
              this.$notify.error({
                duration: 2000,
                message: error.response && error.response.data && error.response.msg || '签收运单失败'
              });
              this.doing = false;
            });
          }
        });

      }
    }
  };
</script>
