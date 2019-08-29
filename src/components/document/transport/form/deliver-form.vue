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
    <template slot="title">编辑运单送达时间</template>
    <template slot="btn">
      <el-button plain @click="save('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <el-form-item label="送达时间" prop="deliveryTime">
          <el-date-picker v-model="form.deliveryTime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择运单送达时间"
                          value-format="timestamp" type="datetime">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {TmsWayBill} from '@/resources';

  export default {
    data () {
      return {
        pageSets: [],
        currentTab: {},
        form: {
          id: '',
          deliveryTime: ''
        },
        doing: false,
        rules: {
          deliveryTime: [
            {required: true, message: '选择运单送达时间', trigger: 'blur'}
          ]
        }
      };
    },
    computed: {},
    props: ['formItem', 'action'],
    watch: {
      formItem: function (val) {
        if (val) {
          this.form.id = val;
        }
      }
    },
    methods: {
      selectTab (item) {
        this.currentTab = item;
      },
      save (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.doing = true;
            TmsWayBill.deliverDate(this.form.id, this.form).then(res => {
              this.$notify.success({
                name: '成功',
                message: '编辑运单送达时间成功'
              });
              this.doing = false;
              this.$emit('change', this.form);
              this.$emit('right-close');
            }).catch(error => {
              this.$notify.error({
                duration: 2000,
                message: error.response && error.response.data && error.response.data.msg || '编辑运单送达时间'
              });
              this.doing = false;
            });
          }
        });

      }
    }
  };
</script>
