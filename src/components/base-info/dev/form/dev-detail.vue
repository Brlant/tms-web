<style lang="scss" scoped>
  .part-hj-box {
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .el-select {
    display: block;
  }
</style>
<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="100px" class="demo-ruleForm">
    <h2 class="clearfix">包装资料详情</h2>
    <el-form-item label="包装编号" prop="devNo">
      <oms-input type="text" v-model="form.devNo" placeholder="请输入包装序列号"></oms-input>
    </el-form-item>
    <!--<el-form-item label="包装主键">-->
    <!--<oms-input type="text" v-model="form.devId" :disabled="true"></oms-input>-->
    <!--</el-form-item>-->
    <el-form-item label="包装状态" prop="status">
      <el-select placeholder="请选择包装状态" v-model="form.status">
        <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in typeList"/>
      </el-select>
    </el-form-item>
    <el-form-item label="包装有效期">
      <el-date-picker v-model="form.validityDate" format="yyyy-MM-dd" placeholder="选择日期" value-format="timestamp">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="备注">
      <oms-input type="textarea" v-model="form.remark" placeholder="请输入备注"></oms-input>
    </el-form-item>
    <el-form-item label-width="100px">
      <el-button type="primary" @click="onSubmit('form')" :disabled="doing">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {DevDetail} from '@/resources';

  export default {
    data: function () {
      let checkDevNo = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入包装序列号'));
        } else {
          DevDetail.checkDevNo(value, this.form.id, this.form.devId).then(function (res) {
            if (res.data.valid) {
              callback();
            } else {
              callback(new Error('包装序列号已经存在'));
            }
          });
        }
      };
      return {
        rules: {
          devNo: [
            {required: true, message: '请输入包装序列号', trigger: 'blur'},
            {validator: checkDevNo, trigger: 'blur'}
          ],
          status: [
            {required: true, message: '请选择包装状态', trigger: 'change'}
          ]
        },
        form: this.formItem,
        doing: false,
        devTypeStatus: ''
      };
    },
    mounted () {
    },
    computed: {
      showTitle: function () {
        let title = '新增';
        if (this.form.id) {
          title = '修改';
        }
        return title;
      },
      typeList: function () {
        return this.$getDict(this.devTypeStatus);
      }
    },
    props: ['formItem', 'devType'],
    watch: {
      formItem: function (val) {
        this.form = Object.assign({}, val);
      },
      devType: function (val) {
        if (!val) return;
        this.devTypeStatus = val + 'Status';
      }
    },
    methods: {
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.doing = true;
            if (!this.form.id) {
              DevDetail.save(this.form).then(res => {
                this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '新增包装耗材详情成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '新增包装耗材详情失败'
                });
                this.doing = false;
              });
            } else {
              DevDetail.update(this.form.id, this.form).then(() => {
                this.$notify.success({
                  name: '成功',
                  message: '修改包装耗材详情"' + this.form.devNo + '"成功'
                });
                this.doing = false;
                this.$emit('change', this.form);
                this.$emit('right-close');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '修改包装耗材详情"' + this.form.devNo + '"失败'
                });
                this.doing = false;
              });
            }
          }
        });
      },
      cancel: function () {
        this.$emit('right-close');
      }
    }
  };
</script>
