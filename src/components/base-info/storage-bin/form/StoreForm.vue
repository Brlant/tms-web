<!--仓库的新增和编辑-->
<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="120px">
    <h2 class="clearfix">{{ title }}</h2>
    <el-form-item label="仓库代码" prop="storeCode">
      <el-input type="text" v-model="form.storeCode" placeholder="请输入仓库代码"></el-input>
    </el-form-item>
    <el-form-item label="仓库名称" prop="storeName">
      <el-input type="text" v-model="form.storeName" placeholder="请输入仓库名称"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="storeRemarks">
      <el-input
        type="textarea"
        :rows="5"
        placeholder="请输入备注"
        v-model="form.storeRemarks">
      </el-input>
    </el-form-item>
    <el-form-item label-width="120px">
      <el-button type="primary" @click="validate" :disabled="doing">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import {StorageBin} from '@/resources';

export default {
  name: 'StoreForm',
  props: {
    title: {
      type: String,
      required: true
    },
    form: {
      type: Object,
      default: {},
    },
    action: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      rules: {
        storeCode: [
          {required: true, message: '库区代码不能为空', trigger: 'blur'},
          {max: 25, message: '最大长度25个字符', trigger: 'change'},
        ],
        storeName: [
          {required: true, message: '库区名称不能为空', trigger: 'blur'},
          {max: 25, message: '最大长度25个字符', trigger: 'change'},
        ],
        storeRemarks: [
          {max: 100, message: '最大长度100个字符', trigger: 'change'},
        ],
      },
      doing: false,
    };
  },
  methods: {
    // 保存前需要先校验表单数据
    validate() {
      this.$refs.form.validate((valid) => {
        if (!valid || this.doing) {
          return;
        }

        // 校验通过设置doing为true防止重复操作
        this.doing = true;
        // 根据action的值来决定是新增保存还是编辑保存
        this.action == 'add' ? this.addSave() : this.editSave();
      });
    }
    ,
    addSave() {
      StorageBin.addSave({storeLevel: 0, ...this.form}).then(res => {
        this.$notify.success('新增成功');
        // 告诉父页面,仓库更新了
        this.$emit('storeUpdate', res.data, false);
        this.$emit('right-close');
        this.$refs.form.resetFields();
      }).catch((error) => {
        console.log(error)
        const msg = error.response.data.msg;
        this.$notify.error(msg || '新增保存失败');
      }).finally(() => {
        this.doing = false;
      });
    },
    editSave() {
      StorageBin.editSave({storeLevel: 0, ...this.form})
        .then(res => {
          this.$notify.success('更新成功');
          this.doing = false;
          this.$emit('storeUpdate', this.form, true);
        })
        .catch(error => {
          const msg = error.response.data.msg;
          this.$notify.error(msg || '编辑保存失败');
          this.doing = false;
        });
    },
    cancel() {
      this.$emit('cancel');
    }
  }
}
;
</script>
