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
    <h2 class="clearfix">包装出入库记录</h2>
    <el-form-item label="出入库时间">
      <el-date-picker v-model="form.createTime" format="yyyy-MM-dd" placeholder="选择出入库时间" @change="changeCreateTime">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="关联订单">
      <oms-input type="text" v-model="form.orderId" placeholder="请输入关联订单"></oms-input>
    </el-form-item>
    <el-form-item label="出入库数量">
      <oms-input type="number" v-model.number="form.count" :min="0" placeholder="请输入出入库数量"></oms-input>
    </el-form-item>
    <el-form-item label="出入库类型">
      <el-select placeholder="请选择出入库类型" v-model="form.type">
        <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in type"/>
      </el-select>
    </el-form-item>
    <el-form-item label="出入库包装序列号">
      <el-select v-model="form.devDetailIdList" multiple filterable placeholder="请选择出入库包装详情id">
        <el-option :key="item.id" :label="item.devNo" :value="item.id" v-for="item in devDetailList"/>
      </el-select>
    </el-form-item>
    <el-form-item label-width="100px">
      <el-button type="primary" @click="onSubmit('form')" :disabled="doing">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {DevStore, DevDetail} from '@/resources';
//  import utils from '../../../tools/utils';

  export default {
    data: function () {
      return {
        rules: {
          devNo: [
            {required: true, message: '请输入包装序列号', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '请选择包装状态', trigger: 'change'}
          ]
        },
        form: this.formItem,
        doing: false,
        type: [],
        devDetailList: []
      };
    },
    mounted() {
      this.type = [
        {'label': '入库', 'key': '0'},
        {'label': '出库', 'key': '1'},
        {'label': '卖出', 'key': '2'},
        {'label': '租赁', 'key': '3'}];
      this.getDevDetailList();
    },
    computed: {
      showTitle: function () {
        let title = '新增';
        if (this.form.id) {
          title = '修改';
        }
        return title;
      }
//      equipmentStatus: function () {
//        return this.$getDict('equipmentStatus'];
//      }
    },
    props: ['formItem'],
    watch: {
      formItem: function (val) {
        this.form = Object.assign({}, val);
        if (this.form.createTime) {
          this.changeCreateTime(this.form.createTime);
        }
      }
    },
    methods: {
      getDevDetailList: function () {
        let param = Object.assign({}, {
          pageNo: 1,
          pageSize: 20,
          deleteFlag: false
        });
        DevDetail.query(param).then(res => {
          this.devDetailList = res.data.list;
        });
      },
      onSubmit: function (formName) {
        // 处理devDetailIdList
        this.form.devDetailIdList.forEach(val => {
          this.form.detailList.push({'devDetailId': val});
        });
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.doing = true;
            if (!this.form.id) {
              DevStore.save(this.form).then(res => {
                this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '新增包装出入库记录成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '新增包装出入库记录失败'
                });
                this.doing = false;
              });
            } else {
              DevStore.update(this.form.id, this.form).then(() => {
                this.$notify.success({
                  name: '成功',
                  message: '修改包装出入库记录"' + this.form.name + '"成功'
                });
                this.doing = false;
                this.$emit('change', this.form);
                this.$emit('right-close');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '修改包装出入库记录"' + this.form.name + '"失败'
                });
                this.doing = false;
              });
            }
          }
        });
      },
      cancel: function () {
        this.$emit('right-close');
      },
      changeCreateTime: function (date) {
        if (!date) {
          this.form.createTime = '';
        }
        this.form.createTime = this.$moment(date).format('YYYY-MM-DD');
      }
    }
  };
</script>
