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
    <template slot="title">中止运单</template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <el-form-item label="中止原因" prop="reason">
          <el-select v-model="form.reason" placeholder="请选择中止原因" :clearable="true">
            <el-option :label="item.label" :value="item.key" :key="item.key"
                       v-for="item in waybillEndReasonList"></el-option>
          </el-select>
          <el-form-item label-width="100px" style="padding-top: 30px">
            <el-button type="primary" @click="save('form')" native-type="submit" :disabled="doing">保存</el-button>
            <el-button @click="doClose">取消</el-button>
          </el-form-item>
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
          result: ''
        },
        doing: false,
        rules: {
          reason: [
            {required: true, message: '请选择运单中止原因', trigger: 'change'}
          ]
        },
        customerList: [],
        senderOrgList: [],
        receiverOrgList: [],
        attachmentList: []
      };
    },
    computed: {
      waybillEndReasonList() {
        return this.$getDict('waybillEndReason');
      }
    },
    props: ['formItem', 'action'],
    watch: {
      formItem: function (val) {
        if (val.id) {
          this.form = val;
        }
      }
    },
    methods: {
      doClose: function () {
        this.$emit('right-close');
      },
      selectTab(item) {
        this.currentTab = item;
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.doing = true;
            let tempForm = {
              reason: this.form.reason
            };
            TmsWayBill.untieWayBill(this.form.id, tempForm).then(() => {
              this.$notify.success({
                duration: 2000,
                title: '成功',
                message: '已成功中止运单"' + this.form.waybillNumber + '"'
              });
              this.$emit('change', this.form);
              this.$emit('right-close');
              this.doing = false;
            }).catch(error => {
              this.$notify.error({
                duration: 2000,
                message: error.response && error.response.data && error.response.data.msg || '中止运单失败'
              });
              this.doing = false;
            });
          }
        });

      }
    }
  };
</script>
