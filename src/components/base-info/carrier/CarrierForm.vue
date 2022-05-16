<!-- 承运商表单：用于新增或编辑承运商信息 -->
<template>
  <el-form ref="form" :rules="rules" :model="formData" label-width="120px">
    <h2 class="clearfix">{{ title }}</h2>
    <el-form-item label="承运商编码" required>
      <el-input type="text" v-model="formData.carrierCode" placeholder="保存后自动生成" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="承运商名称" prop="carrierName">
      <el-input type="text" v-model="formData.carrierName" placeholder="请输入承运商名称"></el-input>
    </el-form-item>
    <el-form-item label="是否对接" prop="butt" required>
      <el-radio v-model="formData.butt" :label="true">是</el-radio>
      <el-radio v-model="formData.butt" :label="false">否</el-radio>
    </el-form-item>
    <el-form-item label="联系人" prop="carrierContact">
      <el-input type="text" v-model="formData.carrierContact" placeholder="请输入联系人"></el-input>
    </el-form-item>
    <el-form-item label="联系电话" prop="carrierTelephone">
      <el-input type="text" v-model="formData.carrierTelephone" placeholder="请输入联系电话"></el-input>
    </el-form-item>
    <el-form-item label="联系地址" prop="carrierAddress">
      <el-input type="text" v-model="formData.carrierAddress" placeholder="请输入联系地址"></el-input>
    </el-form-item>
    <el-form-item label="承运条件" prop="transportationConditions">
      <el-select v-model="formData.transportationConditions" placeholder="请选择承运条件">
        <el-option v-for="item in transCondOptions" :key="item.value" :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="备注" prop="remarks">
      <el-input type="textarea" v-model="formData.remarks" placeholder="请输入备注"></el-input>
    </el-form-item>
    <el-form-item label-width="120px">
      <el-button type="primary" @click="validate" :disabled="doing">保存</el-button>
      <el-button @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {Carrier} from '@/resources'

export default {
  name: "CarrierForm",
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
        carrierName: [
          {required: true, message: '承运商名称不能为空', trigger: 'blur'},
          {max: 40, message: '最大长度4个字符', trigger: 'change'},
        ],
        butt: [
          {required: true, message: '请选择是否对接', trigger: 'blur'},
        ],
        carrierContact: [
          {required: true, message: '联系人不能为空', trigger: 'blur'},
          {max: 25, message: '最大长度25个字符', trigger: 'change'},
        ],
        transportationConditions: [
          {required: true, message: '承运条件不能为空', trigger: 'blur'},
        ],
        remarks: [
          {max: 100, message: '最大长度100个字符', trigger: 'change'},
        ],
        carrierTelephone: [
          {required: true, message: '联系电话不能为空', trigger: 'blur'},
          {
            trigger: 'blur',
            validator: (rules, value, cb) => {
              const zz = /^((\+?86)|(\(\+86\)))?1\d{10}$|^(0\d{2,3}-?|0\d2,3)?[1-9]\d{4,7}(-\d{1,8})?$/;
              if (!zz.test(value)) {
                return cb(new Error('请输入正确的电话或者手机号'));
              }

              return cb();
            },
          },
        ],
        carrierAddress: [
          {required: true, message: '联系人地址不能为空', trigger: 'blur'},
          {max: 75, message: '最大长度75个字符', trigger: 'change'},
        ],
      },
      doing: false,
      // 承运条件的下拉选择的数据
      transCondOptions: [
        {value: 'A', label: '全部'},
        {value: 'B', label: '冷链运输'},
        {value: 'C', label: '常温运输'},
      ],
      formData: {
        carrierCode: '',
        carrierName: '',
        carrierContact: '',
        carrierTelephone: '',
        carrierAddress: '',
        transportationConditions: '',
        status: '0',
        remarks: '',
        // 是否对接默认不选中，需要用户手动选择是或否
        butt: true,
        ...this.form
      },
    }
  },
  watch: {
    form(val) {
      this.formData = Object.assign({}, this.form);
    }
  },
  methods: {
    // 保存前需要先校验表单数据
    validate() {
      this.$refs.form.validate((valid) => {
        if (!valid || this.doing) {
          return;
        }

        // 根据action来决定是新增保存还是编辑保存
        this.action == 'add' ? this.addSave() : this.editSave();
      });
    },
    addSave() {
      this.$confirm('是否确认保存', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 校验通过设置doing为true防止重复操作
        this.doing = true;
        Carrier.addSave(this.formData).then(res => {
          this.$notify.success('新增成功');
          // 告诉父页面,库区更新了
          this.$emit('save');
          this.resetForm();
        }).catch((error) => {
          console.log(error)
          const msg = error.response.data.msg;
          this.$notify.error(msg || '新增失败');
        }).finally(() => {
          this.doing = false;
        });
      }).catch(() => {
      });
    },
    editSave() {
      this.$confirm('是否确认保存', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 校验通过设置doing为true防止重复操作
        this.doing = true;
        Carrier.editSave(this.formData).then(res => {
          this.$notify.success('编辑成功');
          this.$emit('save');
          // this.resetForm();
        }).catch(error => {
          const msg = error.response.data.msg;
          this.$notify.error(msg || '编辑失败');
        }).finally(() => {
          this.doing = false;
        });
      }).catch(() => {
      });
    },
    close() {
      // this.resetForm();
      this.$emit('close');
    },
    resetForm() {
      this.$refs.form.resetFields();
    }
  }
}
</script>

<style scoped>
/*控制宽度,以便多个input显示在一行*/
/*noinspection CssUnusedSymbol*/
.inline .el-input {
  width: 193px;
}
</style>
