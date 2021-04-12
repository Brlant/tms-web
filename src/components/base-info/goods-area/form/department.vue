<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="120px">
    <h2 class="clearfix">{{showTitle}}集货区</h2>
    <el-form-item label="集货区名称" prop="name">
      <oms-input type="text" v-model="form.name" placeholder="请输入集货区名称"></oms-input>
    </el-form-item>
    <el-form-item label="集货区代码" prop="code">
      <oms-input type="text" v-model="form.code" placeholder="请输入集货区代码"></oms-input>
    </el-form-item>
    <el-form-item label="运输范围">
      <el-select placeholder="请选择运输范围" v-model="form.scope">
        <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in transportScope"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label-width="120px">
      <el-button type="primary" @click="onSubmit('form')" :disabled="doing">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {GoodsArea} from '@/resources';

  export default {
    data: function () {
      return {
        rules: {
          name: [
            {required: true, message: '请输入集货区名称', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入集货区代码', trigger: 'blur'}
          ]
        },
        form: {id: '', code:'',scope: ''},
        doing: false,
        attachmentList: [],
        x: ''
      };
    },
    computed: {
      showTitle: function () {
        let title = '新增';
        if (this.action === 'edit') {
          title = '修改';
        }
        return title;
      },
      transportScope () {
        return this.$getDict('transportationCondition');
      }
    },
    props: ['formItem', 'action', 'actionType'],
    watch: {
      formItem: function (val) {
        this.form = Object.assign({}, val);
        if (this.form.scope === null) {
          this.form.scope = '';
        }
        this.attachmentList = [];
        this.$nextTick(() => {
          this.$refs.form && this.$refs.form.clearValidate();
        });
      },
      actionType: function (val) {
        if (!val) {
          this.$refs['form'].resetFields();
        }
      }
    },
    methods: {
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
            if (valid && this.doing === false) {
              if (this.action === 'add') {
                this.doing = true;
                GoodsArea.save(this.form).then(res => {
                  this.$notify.success({
                    duration: 2000,
                    name: '成功',
                    message: '新增集货区成功'
                  });
                  this.doing = false;
                  this.$emit('change', res.data);
                  this.$emit('right-close');
                }).catch(error => {
                  this.$notify.error({
                    duration: 2000,
                    message: error.response && error.response.data && error.response.data.msg || '新增集货区失败'
                  });
                  this.doing = false;
                });
              } else {
                this.doing = true;
                GoodsArea.update(this.form).then(res => {
                  this.$notify.success({
                    name: '成功',
                    duration: 2000,
                    message: '修改集货区"' + this.form.name + '"成功'
                  });
                  this.doing = false;
                  this.$emit('change', this.form);
                  this.$emit('right-close');
                }).catch(() => {
                  this.$notify.error({
                    duration: 2000,
                    message: '修改集货区' + this.form.name + '"失败'
                  });
                  this.doing = false;
                });
              }
            } else {

            }
          }
        );
      },
      cancel: function () {
        this.$emit('close');
      }
    }
  };
</script>
