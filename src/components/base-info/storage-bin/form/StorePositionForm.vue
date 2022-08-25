<!--库位的新增和编辑-->
<style scoped>
/*控制宽度,以便多个input显示在一行*/
/*noinspection CssUnusedSymbol*/
.inline .el-input {
  width: 193px;
}
/*noinspection CssUnusedSymbol*/
::v-deep .el-input-group__append {
  width: 25px;
}

</style>
<template>
  <el-form ref="form" :rules="rules" :model="formData" label-width="120px">
    <h2 class="clearfix">{{ title }}</h2>
    <el-form-item label="仓库代码" :required="true">
      <el-input type="text" v-model="formData.highestCode" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="仓库名称" :required="true">
      <el-input type="text" v-model="formData.highestName" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="库区代码" :required="true">
      <el-input type="text" v-model="formData.parentCode" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="库区名称" :required="true">
      <el-input type="text" v-model="formData.parentName" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="库区类型" :required="true">
      <el-input type="text" v-model="storeTypeName" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="库位代码" prop="storeCode">
      <el-input type="text" v-model="formData.storeCode" placeholder="请输入库位代码"></el-input>
    </el-form-item>
    <el-form-item label="库位名称" prop="storeName">
      <el-input type="text" v-model="formData.storeName" placeholder="请输入库位名称"></el-input>
    </el-form-item>
    <el-form-item label="长" prop="storeLength">
      <el-input placeholder="请输入长度" v-model="formData.storeLength">
        <template slot="append">cm</template>
      </el-input>
    </el-form-item>
    <el-form-item label="宽" prop="storeWidth">
      <el-input placeholder="请输入长度" v-model="formData.storeWidth">
        <template slot="append">cm</template>
      </el-input>
    </el-form-item>
    <el-form-item label="高" prop="storeHeight">
      <el-input placeholder="请输入长度" v-model="formData.storeHeight">
        <template slot="append">cm</template>
      </el-input>
    </el-form-item>
    <el-form-item label="体积" :required="true">
      <el-input type="text" v-model="volume" :disabled="true">
        <template slot="append">cm³</template>
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
import utils from '@/tools/utils';

export default {
  name: 'StorePositionForm',
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
          {required: true, message: '库位代码不能为空', trigger: 'blur'},
          {max: 25, message: '最大长度25个字符', trigger: 'change'},
        ],
        storeName: [
          {required: true, message: '库位名称不能为空', trigger: 'blur'},
          {max: 25, message: '最大长度25个字符', trigger: 'change'},
        ],
        storeLength: [
          {required: true, message: '长度不能为空', trigger: 'blur'},
          {
            trigger: 'blur',
            validator: (rules, value, cb) => {
              if (isNaN(value)) {
                return cb(new Error('长度只能是数字'));
              }

              // 保留两位小数
              this.formData.storeLength = utils.format2DecimalPoint(value);
              return cb();
            },
          },
        ],
        storeWidth: [
          {required: true, message: '宽度不能为空', trigger: 'blur'},
          {
            trigger: 'blur',
            validator: (rules, value, cb) => {
              if (isNaN(value)) {
                return cb(new Error('宽度只能是数字'));
              }

              // 保留两位小数
              this.formData.storeWidth = utils.format2DecimalPoint(value);
              return cb();
            },
          },
        ],
        storeHeight: [
          {required: true, message: '高度不能为空', trigger: 'blur'},
          {
            trigger: 'blur',
            validator: (rules, value, cb) => {
              if (isNaN(value)) {
                return cb(new Error('高度只能是数字'));
              }

              // 保留两位小数
              this.formData.storeHeight = utils.format2DecimalPoint(value);
              return cb();
            },
          },
        ],
      },
      doing: false,
      formData: {...this.form}
    };
  },
  computed: {
    volume() {
      const {
        storeLength,
        storeWidth,
        storeHeight
      } = this.formData;


      if (!storeLength || !storeWidth || !storeHeight) {
        // 如果长宽高有一个没值,那就不计算体积
        return ''
      }

      const lwh = storeLength * storeWidth * storeHeight;
      return lwh.toFixed(2);
    },
    storeTypeName() {
      const storeType = this.formData.storeType;
      if ('A' == storeType) return '整件';
      if ('B' == storeType) return '散件';
      if ('C' == storeType) return '不合格';
    }
  },
  watch: {
    form(val) {
      this.formData = Object.assign({},this.form);
    }
  },
  methods: {
    // 保存前需要先校验表单数据
    validate() {
      this.$refs.form.validate((valid) => {
        if (!valid || this.doing) {
          return;
        }

        // 根据action的值来决定是新增保存还是编辑保存
        this.action == 'add' ? this.addSave() : this.editSave();
      });
    }
    ,
    addSave() {
      this.$confirm('是否确认保存', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 校验通过设置doing为true防止重复操作
        this.doing = true;
        StorageBin.addSave({storeLevel: 2, ...this.formData}).then(res => {
          this.$notify.success('新增成功');
          // 告诉父页面,库位更新了
          this.$emit('storePositionUpdate', res.data, false);
          this.$refs.form.resetFields();
        }).catch((error) => {
          console.log(error)
          const msg = error.response.data.msg;
          this.$notify.error(msg || '新增保存失败');
        }).finally(() => {
          this.doing = false;
        });
      }).catch(()=>{});
    },
    editSave() {
      this.$confirm('是否确认保存', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 校验通过设置doing为true防止重复操作
        this.doing = true;
        StorageBin.editSave({storeLevel: 2, ...this.formData}).then(res => {
          this.$notify.success('更新成功');
          this.$emit('storePositionUpdate', this.formData, true);
        }).catch(error => {
          const msg = error.response.data.msg;
          this.$notify.error(msg || '编辑保存失败');
        }).finally(() => {
          // 校验通过设置doing为true防止重复操作
          this.doing = true;
        });
      }).catch(()=>{});
    },
    cancel() {
      this.$emit('cancel');
    }
  }
}
;
</script>
