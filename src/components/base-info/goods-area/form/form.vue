<style lang="less" scoped="">
  .el-form .el-select {
    display: block;
  }
</style>
<template>
  <div>
    <h2 class="clearfix">{{title}}</h2>
    <el-form ref="accountform" :model="form" label-width="100px" :rules="rules"
             @submit.prevent="onSubmit('accountform')" onsubmit="return false">
      <el-form-item label="所属集货区">
        {{form.name}}
      </el-form-item>
      <el-form-item label="收货单位" prop="orgId">
        <el-select filterable remote placeholder="请输入名称/拼音首字母缩写/系统代码搜索单位" :remote-method="filterOrg"
                   :clearable="true"
                   v-model="form.orgId" popperClass="good-selects">
          <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
            <div style="overflow: hidden">
              <span class="pull-left" style="clear: right">{{org.name}}</span>
            </div>
            <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                      <span>系统代码:</span>{{org.manufacturerCode}}
                    </span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit('accountform')" native-type="submit">保存</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {BaseInfo, GoodsArea} from '@/resources';

  export default {
    name: 'editForm',
    props: {
      formItem: {
        type: Object,
        default: {},
        required: true
      },
      title: {
        type: String,
        default: '增加'
      },
      action: {
        type: String,
        default: ''
      },
      actionType: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
    },
    data: function () {
      return {
        form: {orgId: ''},
        rules: {
          orgId: [
            {required: true, message: '请选择单位', trigger: 'change'}
          ]
        },
        roleSelect: [],
        doing: false,
        departmentList: [],
        orgList: []
      };
    },
    watch: {
      formItem: function (val) {
        if (val.id) {
          this.form = this.formItem;
        } else {
          this.form = {
            name: '',
            phone: '',
            email: '',
            list: []
          };
        }
      },
      showRight: function (val) {
        if (!val) {
          this.$refs['accountform'].resetFields();
        }
      }
    },
    methods: {
      filterOrg: function (query) {// 过滤收货单位
        BaseInfo.query({keyWord: query}).then(res => {
          this.orgList = res.data.list;
        });
      },
      onSubmit: function (formName) {
        let self = this;
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          let formData = JSON.parse(JSON.stringify(this.form));
          if (this.action === 'add') {
            GoodsArea.addGoodsAreaDetail(formData).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '新增集货区"' + self.form.name + '"单位成功'
              });
              self.$emit('change', formData);
            }).catch(error => {
              this.$notify.error({
                duration: 2000,
                message: error.response && error.response.data && error.response.msg || '新增集货区单位失败'
              });
              this.doing = false;
            });
          } else {
            // User.update(self.form.id, formData).then(() => {
            //   this.doing = false;
            //   this.$notify.success({
            //     duration: 2000,
            //     name: '成功',
            //     message: '修改平台用户"' + self.form.name + '"成功'
            //   });
            //   self.$emit('change', formData);
            // }).catch(() => {
            //   this.$notify.error({
            //     duration: 2000,
            //     message: '修改平台用户"' + self.form.name + '"失败'
            //   });
            //   this.doing = false;
            // });
          }
        });
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['accountform'].resetFields();
      }
    }
  };
</script>
