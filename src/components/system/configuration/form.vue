<style lang="scss" scoped="">
  .el-form .el-select {
    display: block;
  }
</style>
<template>
  <div>
    <h2 class="clearfix">编辑</h2>
    <el-form ref="accountform" :model="form" label-width="100px"
             @submit.prevent="onSubmit('accountform')" onsubmit="return false">
      <el-form-item label="标题">
        <oms-input type="text" v-model="form.label" placeholder="请输入"></oms-input>
      </el-form-item>
      <el-form-item label="内容">
        <oms-input type="text" v-model="form.value" placeholder="请输入"></oms-input>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit()" native-type="submit">保存</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { User, Access } from '../../../resources';

  export default {
    name: 'editForm',
    props: {
      formItem: {
        type: Object,
        default: {},
        required: true
      }
    },
    data: function () {
      return {
        form: {
          label: '',
          key: '',
          value: ''
        },
        doing: false
      };
    },
    watch: {
      formItem: function (val) {
        this.form = JSON.parse(JSON.stringify(this.formItem));
      }
    },
    methods: {
      onSubmit: function () {
        let ary = JSON.parse(window.localStorage.getItem('localConfiguration')) || [];
        let d = -1;
       ary.forEach((i, index) => {
          if (i.key === this.form.key) {
            d = index;
          }
        });
        if (d !== -1) {
          ary.splice(d, 1, this.form);
          window.localStorage.setItem('localConfiguration', JSON.stringify(ary));
          this.$notify.success({
            duration: 2000,
            message: '修改本地配置"' + this.form.label + '"成功'
          });
          this.$emit('change', this.form);
        } else {
          this.$notify.error({
            duration: 2000,
            message: '修改本地配置"' + this.form.label + '"失败'
          });
        }
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['accountform'].resetFields();
      }
    }
  };
</script>
