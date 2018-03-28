<style lang="scss" scoped="">
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
      <div class="hide-content show-content">
        <el-form ref="d-form" :rules="rules" :model="form"
                 label-width="100px" style="padding-right: 20px">
          <el-form-item label="单位">
            <el-transfer v-loading="loading"
                         v-model="form.orgIdList"
                         :props="{key: 'id',label: 'name'}"
                         filter-placeholder="请输入名称搜索单位"
                         :data="orgList"
                         filterable
                         :filter-method="filterMethod"
                         :titles="['未选单位', '已选单位']"
                         class="transfer-list-two"
                         :render-content="renderFunc">
            </el-transfer>
          </el-form-item>
        </el-form>
      </div>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit('accountform')" native-type="submit">保存</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/jsx">
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
        form: {orgId: '', orgIdList: []},
        rules: {
          orgList: {required: true, type: '请选择单位', message: '请选择接种点', trigger: 'change'}
        },
        loading: false,
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
          this.form.orgIdList = [];
          this.filterOrg();
        }
      },
      showRight: function (val) {
        if (!val) {
          this.$refs['accountform'].resetFields();
        }
      }
    },
    methods: {
      filterMethod(query, item) {
        if (!query) return true;
        BaseInfo.query({keyWord: query}).then(res => {
          this.orgList = res.data.list;
        });
        // return item.name && item.name.indexOf(query) > -1 ||
        //   item.nameAcronymy && item.nameAcronymy.indexOf(query) > -1 ||
        //   item.namePhonetic && item.namePhonetic.indexOf(query) > -1 ||
        //   item.manufacturerCode && item.manufacturerCode.indexOf(query) > -1;
      },
      renderFunc(h, option) {
        return (<span title={option.name}>{option.name}</span>);
      },
      filterOrg: function (query) {// 过滤收货单位
        this.loading = true;
        let param = Object.assign({}, {
          pageNo: 1,
          pageSize: 20,
          keyWord: query
        });
        BaseInfo.query(param).then(res => {
          this.orgList = res.data.list;
          this.loading = false;
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
                message: error.response && error.response.data && error.response.data.msg || '新增集货区单位失败'
              });
              this.doing = false;
            });
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
