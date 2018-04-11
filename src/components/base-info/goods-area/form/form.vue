<style lang="scss" scoped="">
  .el-form .el-select {
    display: block;
  }

</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">{{title}}集货区单位</template>
    <template slot="btn">
      <el-button plain @click="onSubmit('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit">基本信息</h3>
          </div>
          <div class="content">
            <el-form-item label="所属集货区">
              {{form.name}}
            </el-form-item>
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
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
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
        orgList: [],
        pageSets: [
          {name: '基本信息', key: 0}
        ],
        currentTab: {}
      };
    },
    watch: {
      formItem: function (val) {
        if (val.id) {
          this.form = this.formItem;
          this.form = Object.assign({}, {objectId: []}, this.form);
          this.filterOrg();
        }
      },
      showRight: function (val) {
        if (!val) {
          this.$refs['form'].resetFields();
        }
      }
    },
    methods: {
      selectTab(item) {
        this.currentTab = item;
      },
      filterMethod(query, item) {
        if (!query) return true;
        return item.name && item.name.indexOf(query) > -1 ||
          item.nameAcronymy && item.nameAcronymy.indexOf(query) > -1 ||
          item.namePhonetic && item.namePhonetic.indexOf(query) > -1 ||
          item.manufacturerCode && item.manufacturerCode.indexOf(query) > -1;
      },
      renderFunc(h, option) {
        return (<span title={option.name}>{option.name}</span>);
      },
      filterOrg: function () {
        this.loading = true;
        GoodsArea.queryGoodsAreaOrgList(this.form.id).then(res => {
          this.orgList = res.data;
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
            this.doing = true;
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
              self.$emit('change', error);
              this.doing = false;
            });
          }
        });
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['form'].resetFields();
      }
    }
  };
</script>
