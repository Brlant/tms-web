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
  <el-form ref="form" :rules="rules" :model="form" label-width="160px" class="demo-ruleForm">
    <h2 class="clearfix">包装资料</h2>
    <el-form-item label="名称">
      <oms-input model="text" v-model="form.name" placeholder="请输入名称"></oms-input>
    </el-form-item>
    <el-form-item label="型号">
      <oms-input model="text" v-model="form.model" placeholder="请输入型号"></oms-input>
    </el-form-item>
    <el-form-item label="规格">
      <oms-input model="text" v-model="form.specification" placeholder="请输入型号"></oms-input>
    </el-form-item>
    <el-form-item label="体积">
      <oms-input type="number" v-model.number="form.volume" min="0" placeholder="请输入包装体积">
        <template slot="append">m³</template>
      </oms-input>
    </el-form-item>
    <el-form-item label="重量">
      <oms-input type="number" v-model.number="form.weight" min="0" placeholder="请输入包装重量">
        <template slot="append">kg</template>
      </oms-input>
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-select placeholder="请选择包装类型" v-model="form.type">
        <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in equipmentType"/>
      </el-select>
    </el-form-item>
    <el-form-item label="包装品牌">
      <oms-input model="text" v-model="form.brand" placeholder="请输入包装品牌"></oms-input>
    </el-form-item>
    <!--<el-form-item label="库存数量" prop="count">-->
    <!--<oms-input model="number" v-model.number="form.count" :min="0" placeholder="请输入库存数量"></oms-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="序列号管理">-->
    <!--<el-switch active-text="是" inactive-text="否" active-color="#13ce66" inactive-color="#ff4949"-->
    <!--v-model="form.devIsSerialNumber"></el-switch>-->
    <!--</el-form-item>-->
    <el-form-item label="采购价格">
      <oms-input model="text" v-model="form.purchasePrice" min="0" placeholder="请输入采购价格,最多保留两位小数"
                 @blur="formatPurchasePrice">
        <template slot="prepend">¥</template>
      </oms-input>
    </el-form-item>
    <el-form-item label="单次租赁价格">
      <oms-input model="text" v-model="form.rentPrice" min="0" placeholder="请输入单次租赁价格,最多保留两位小数" @blur="formatRentPrice">
        <template slot="prepend">¥</template>
      </oms-input>
    </el-form-item>
    <el-form-item label="单次计费价格">
      <oms-input model="text" v-model="form.singlePrice" min="0" placeholder="请输入单次计费价格,最多保留两位小数"
                 @blur="formatSinglePrice">
        <template slot="prepend">¥</template>
      </oms-input>
    </el-form-item>
    <el-form-item label="销售价格">
      <oms-input model="text" v-model="form.salePrice" min="0" placeholder="请输入销售价格,最多保留两位小数" @blur="formatSalePrice">
        <template slot="prepend">¥</template>
      </oms-input>
    </el-form-item>
    <el-form-item label-width="160px">
      <el-button model="primary" @click="onSubmit('form')">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {Dev} from '@/resources';
  import utils from '@/tools/utils';

  export default {
    data: function () {
      return {
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          model: [
            {required: true, message: '请输入型号', trigger: 'blur'}
          ],
          brand: [
            {required: true, message: '请输入包装品牌', trigger: 'blur'}
          ],
          specification: [
            {required: true, message: '请输入规格', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择包装类型', trigger: 'change'}
          ],
          purchasePrice: [
            {required: true, message: '请输入采购价格', trigger: 'blur'}
          ],
          rentPrice: [
            {required: true, message: '请输入单次租赁价格', trigger: 'blur'}
          ],
          singlePrice: [
            {required: true, message: '请输入单次计费价格', trigger: 'blur'}
          ],
          salePrice: [
            {required: true, message: '请输入销售价格', trigger: 'blur'}
          ]
        },
        form: this.formItem,
        doing: false
      };
    },
    computed: {
      showTitle: function () {
        let title = '新增';
        if (this.form.id) {
          title = '修改';
        }
        return title;
      },
      equipmentType: function () {
        return this.$getDict('equipmentType');
      }
    },
    props: ['formItem'],
    watch: {
      formItem: function (val) {
        this.form = Object.assign({}, val);
      }
    },
    methods: {
      formatPurchasePrice() {// 格式化单价，保留两位小数
        this.form.purchasePrice = utils.autoformatDecimalPoint(this.form.purchasePrice);
      },
      formatRentPrice() {// 格式化单价，保留两位小数
        this.form.rentPrice = utils.autoformatDecimalPoint(this.form.rentPrice);
      },
      formatSinglePrice() {// 格式化单价，保留两位小数
        this.form.singlePrice = utils.autoformatDecimalPoint(this.form.singlePrice);
      },
      formatSalePrice() {// 格式化单价，保留两位小数
        this.form.salePrice = utils.autoformatDecimalPoint(this.form.salePrice);
      },
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.doing = true;
            if (!this.form.id) {
              Dev.save(this.form).then(res => {
                this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '新增包装耗材成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '新增包装耗材失败'
                });
                this.doing = false;
              });
            } else {
              Dev.update(this.form.id, this.form).then(() => {
                this.$notify.success({
                  name: '成功',
                  message: '修改包装耗材"' + this.form.name + '"成功'
                });
                this.doing = false;
                this.$emit('change', this.form);
                this.$emit('right-close');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '修改包装耗材"' + this.form.name + '"失败'
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
