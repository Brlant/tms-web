<!--库区的新增和编辑-->
<style scoped>
/*控制宽度,以便多个input显示在一行*/
/*noinspection CssUnusedSymbol*/
.inline .el-input {
  width: 193px;
}

</style>
<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="120px">
    <h2 class="clearfix">{{ title }}</h2>
    <el-form-item label="仓库名称" :required="true">
      <el-input type="text" v-model="form.highestName" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="库区代码" prop="storeCode">
      <el-input type="text" v-model="form.storeCode" placeholder="请输入库区代码" ></el-input>
    </el-form-item>
    <el-form-item label="库区名称" prop="storeName">
      <el-input type="text" v-model="form.storeName" placeholder="请输入库区名称" ></el-input>
    </el-form-item>
    <el-form-item label="温度范围" prop="temperatureLowerLimit" class="inline">
      <el-input placeholder="请输入最低温度" v-model="form.temperatureLowerLimit">
        <template slot="append">°C</template>
      </el-input>
      &nbsp;~&nbsp;
      <el-input placeholder="请输入最高温度" v-model="form.temperatureUpperLimit">
        <template slot="append">°C</template>
      </el-input>
    </el-form-item>
    <el-form-item label="湿度范围" prop="humidityLowerLimit" class="inline">
      <el-input placeholder="请输入最低湿度" v-model="form.humidityLowerLimit">
        <template slot="append">%</template>
      </el-input>
      &nbsp;~&nbsp;
      <el-input placeholder="请输入最高湿度" v-model="form.humidityUpperLimit">
        <template slot="append">%</template>
      </el-input>
    </el-form-item>
    <el-form-item label="库区类型" prop="storeType">
      <el-select v-model="form.storeType" placeholder="请选择库区类型">
        <el-option
          v-for="item in storeTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否启用" prop="deleteFlag" v-if="action == 'edit'" required>
      <el-switch
        v-model="form.deleteFlag"
        active-color="#dcdfe6"
        inactive-color="#13ce66"
        active-text="否"
        inactive-text="是">
      </el-switch>
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
  name: 'StoreAreaForm',
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
        temperatureLowerLimit: [
          {required: true, message: '最低温度不能为空', trigger: 'blur'},
          {
            trigger: 'blur',
            validator: (rules, value, cb) => {
              if (!value){
                return ;
              }

              // 获取最高温度,校验最低温度的同时也校验最高温度
              let {temperatureUpperLimit} = this.form;
              if (!temperatureUpperLimit) {
                return cb(new Error("最高温度不能为空"));
              }

              if (isNaN(value) || isNaN(temperatureUpperLimit)){
                return cb(new Error("温度值只能是数字"));
              }

              value = parseInt(value);
              temperatureUpperLimit = parseInt(temperatureUpperLimit);
              if (value > temperatureUpperLimit) {
                return cb(new Error("最低温度不能超过最高温度"));
              }

              if (value < -273.15) {
                return cb(new Error("最低温度不能低于绝对零度(-273.15°C)"));
              }

              // 保留两位小数
              this.form.temperatureLowerLimit = utils.autoformatDecimalPoint(value);
              this.form.temperatureUpperLimit = utils.autoformatDecimalPoint(temperatureUpperLimit);

              return cb();
            },
          },
        ],
        humidityLowerLimit: [
          {required: true, message: '最低湿度不能为空', trigger: 'blur'},
          {
            trigger: 'blur',
            validator: (rules, value, cb) => {
              if (!value){
                return ;
              }

              // 获取最高湿度,校验最低湿度的同时也校验最高湿度
              let {humidityUpperLimit} = this.form;
              if (!humidityUpperLimit) {
                return cb(new Error("最高湿度不能为空"));
              }

              if (isNaN(value) || isNaN(humidityUpperLimit)){
                return cb(new Error("湿度值只能是数字"));
              }

              value = parseInt(value);
              humidityUpperLimit = parseInt(humidityUpperLimit);

              if (value > humidityUpperLimit) {
                return cb(new Error("最低湿度不能超过最高湿度"));
              }

              if (value > 100) {
                return cb(new Error("最低湿度不能超过100%"));
              }

              if (humidityUpperLimit > 100) {
                return cb(new Error("最高湿度不能超过100%"));
              }

              // 保留两位小数
              this.form.humidityLowerLimit = utils.autoformatDecimalPoint(value);
              this.form.humidityUpperLimit = utils.autoformatDecimalPoint(humidityUpperLimit);

              return cb();
            },
          },
        ],
        storeType: [
          {required: true, message: '请选择库区类型', trigger: 'change'},
        ],
      },
      doing: false,
      storeTypes: [
        {value: 'A', label: '整件'},
        {value: 'B', label: '散件'},
        {value: 'C', label: '不合格'},
      ]
    };
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
        StorageBin.addSave({storeLevel: 1, ...this.form}).then(res => {
          this.$notify.success('新增成功');
          // 告诉父页面,库区更新了
          this.$emit('storeAreaUpdate', res.data, false);
          this.$emit('right-close');
          this.$refs.form.resetFields();
        }).catch((error) => {
          console.log(error)
          const msg = error.response.data.msg;
          this.$notify.error(msg || '新增失败');
        }).finally(() => {
          this.doing = false;
        });
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
        StorageBin.editSave({storeLevel: 1, ...this.form}).then(res => {
            this.$notify.success('编辑成功');
            this.$emit('storeAreaUpdate', this.form, true);
          }).catch(error => {
            const msg = error.response.data.msg;
            this.$notify.error(msg || '编辑失败');
          }).finally(() => {
          this.doing = false;
        });
      });
    },
    cancel() {
      this.$emit('cancel');
    }
  }
}
;
</script>
