<style lang="scss" scoped>
  @import "../../../assets/scss/mixins";

  $leftWidth: 200px;
  .min-gutter {
    .el-form-item {
      margin-bottom: 20px;
    }
  }

  .content-part {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;

    .content-left {
      width: $leftWidth;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      text-align: left;
      background-color: #eef2f3;

      > ul {
        margin: 0;
      }

      > h2 {
        padding: 0;
        margin: 0;
        font-size: 18px;
        font-weight: bold;
        line-height: 55px;
        border-bottom: 1px solid #ddd;
      }

      .list-style {
        cursor: pointer;
        padding: 10px;
        text-align: center;

        span {
          display: inline-block;
          padding: 8px 35px;
        }

        &.active {
          span {
            background-color: $activeColor;
            border-radius: 20px;
            color: $activeColorFont
          }
        }

        &:hover {
          background: #dee9eb
        }

      }

    }

    .content-right {
      > h3 {
        padding: 0;
        margin: 0 0 20px;
        font-size: 18px;
        font-weight: normal;
        line-height: 55px;
        height: 55px;
        border-bottom: 1px solid #ddd;
        text-align: center;
        position: fixed;
        top: 0;
        right: 0;
        left: $leftWidth;
        background: #fff;
        z-index: 2;
      }

      position: absolute;
      top: 0;
      left: $leftWidth;
      right: 0;
      bottom: 0;
      overflow: auto;
      padding-top: 75px;

      .hide-content {
        display: none;
      }

      .show-content {
        padding: 0 20px;
        display: block;
      }
    }

    .min-gutter {
      .el-form-item {
        margin-bottom: 20px;
      }

      .el-form-item__label {
        font-size: 12px
      }
    }
  }

  .el-form .el-select {
    display: block;
  }

  .el-form .el-cascader {
    display: block;
  }
</style>
<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">司机档案</h2>
        <ul>
         <li class="list-style active">
            <span>基本信息</span>
        </li>
          <li align="center" style="margin-top:40px;position:absolute;bottom:80px;left:0;right:0;text-align: center">
            <el-button type="primary" @click="onSubmit('baseform')" :disabled="doing">保存</el-button>
          </li>
          <li align="center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;text-align: center">
            <el-button  @click="doClose">取消</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3>{{title}}</h3>
        <el-form ref="baseform" :rules="rules" :model="form" label-width="140px" class="min-gutter"
                 @submit.prevent="onSubmit('baseform')" onsubmit="return false" style="padding-right: 20px">
          <el-form-item label="司机姓名:" prop="driverName">
            <oms-input type="text" v-model="form.driverName" placeholder="请输入司机姓名"></oms-input>
          </el-form-item>
          <el-form-item label="所属单位:" prop="carrierId">
            <el-select placeholder="请选择单位" v-model="form.carrierId">
              <el-option :label="item.label" :value="item.key" :key="item.key"
                         v-for="item in orgLevel"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分  类:" prop="driverType">
            <el-select placeholder="请选择分类" v-model="form.driverType">
              <el-option :label="item.label" :value="item.key" :key="item.key"
                         v-for="item in driverType"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号码:" prop="driverPhone">
            <oms-input type="number"  v-model="form.driverPhone" placeholder="请输入手机号码"  maxlength="11"></oms-input>
          </el-form-item>
          <el-form-item label="身份证号码:" prop="driverIdentity">
            <oms-input type="text" v-model="form.driverIdentity" placeholder="请输入身份证号码"></oms-input>
          </el-form-item>
          <el-form-item label="驾驶证到期日:" prop="licenceEndDate">
            <el-date-picker type="date" placeholder="请选择日期" v-model="form.licenceEndDate" ></el-date-picker>
          </el-form-item>
          <el-form-item label="从业资格证到期日:"  prop="professionEndDate"
           :rules="form.driverType == '1'? rules.professionEndDate:[{ type: 'date', required: false, message: '请选择日期', trigger: 'change' }]">
            <el-date-picker type="date" placeholder="请选择日期" v-model="form.professionEndDate" ></el-date-picker>
          </el-form-item>
          <el-form-item label="健康证到期日:"  prop="healthEndDate"
            :rules="form.driverType == '1'? rules.healthEndDate:[{ type: 'date', required: false, message: '请选择日期', trigger: 'change' }]">
            <el-date-picker type="date" placeholder="请选择日期" v-model="form.healthEndDate" ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable object-shorthand */
import {BaseInfo, plateNumber, User} from '@/resources';
import utils from '@/tools/utils';
import axios from 'axios';

export default {
    props: {
      formItem: {
        type: Object,
        default: {},
        required: true
      },
      title: {
        type: String,
        default: '添加'
      },
      action: {
        type: String,
        default: ''
      },
    },
    data: function () {
      return {
        form: {},
        rules: {
          driverName:[{required: true, message: '请输入司机名称', trigger: 'blur'}],
          carrierId:[{required: true,  message: '请选择承运单位', trigger: 'change'}],
          driverType: [{required: true, message: '请选择司机类型', trigger: 'change'}],
          driverPhone:[{required: true, message: '请输入手机号', trigger: 'blur'}],
          driverIdentity:[{required: true, message: '请输入身份证号', trigger: 'blur'}],
          licenceEndDate:[{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
          professionEndDate:[{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
          healthEndDate:[{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
        },
        doing: false,
      };
    },
    mounted: function () {
    },
    computed: {
      driverType() {
        return this.$getDict('driverType');
      },
    },
    watch: {
      formItem: function (val) {
        if (val.id) {
          this.setDhsOrgInfo(val);
        } else {
          this.resetDhsOrgInfo(val);
        }
        this.$nextTick(() => {
          this.$refs.baseform && this.$refs.baseform.clearValidate();
        });
      },
    },
    methods: {
      setDhsOrgInfo: function (val) {
        this.form = Object.assign({}, val);
      },
      resetDhsOrgInfo: function (val) {
        this.form = {
          'driverId': '',
          'driverName': '',
          'carrierId': '',
          'carrierName': '',
          'driverType': '',
          'driverPhone': '',
          'driverIdentity': '',
          'licenceEndDate': '',
          'professionEndDate': '',
          'healthEndDate': '',
          'driverStatus': '',
        };
      },
      onSubmit: function (formName) {
        let self = this;
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          this.doing = true;
          if (this.action === 'add') {
            if (self.form.id) {
              self.form.id = '';
            }
            if (self.form.extDto && self.form.extDto.id) {
              self.form.extDto.id = '';
            }
            self.form.type = '1';
            BaseInfo.save(self.form).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '新增"' + this.orgTitle + self.form.name + '"成功'
              });
              self.$emit('change', Object.assign({}, self.form));
            }).catch(error => {
              this.doing = false;
              this.$notify.error({
                duration: 2000,
                name: '失败',
                message: error.response&&error.response.data && error.response.data.msg || '新增失败'
              });
            });
          } else {
            let plates = self.form.plateList.filter(f => f.orgPlateNumber).map(m => {
              return {
                orgPlateNumber: m.orgPlateNumber,
                orgId: self.form.id
              };
            });
            axios.all([BaseInfo.update(self.form.id, self.form), plateNumber.batchAddPlateNumber(plates)]).then(axios.spread(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '修改' + this.orgTitle + '基础信息"' + self.form.name + '"成功'
              });
              self.$emit('change', Object.assign({}, self.form));
            })).catch(error => {
              this.doing = false;
              this.$notify.error({
                duration: 2000,
                name: '失败',
                message: error.response&&error.response.data && error.response.data.msg || '修改' + this.orgTitle + '基础信息"' + self.form.name + '"失败'
              });
            });
          }
        });
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['baseform'].resetFields();
      }
    }
  };
</script>
