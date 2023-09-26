<style lang="scss" scoped>
  @import "../../../assets/scss/mixins";

  .el-form .el-select {
    display: block;
  }

  .el-form .el-cascader {
    display: block;
  }

  .vaccine-list {
    margin-top: 20px;
  }

  .el-row {
    margin-bottom: 10px;
  }
  
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
  <div class="content-part">
    <div class="content-left">
        <h2 class="clearfix right-title">司机档案</h2>
        <ul>
         <li class="list-style active">
            <span>基本信息</span>
        </li>
          <li align="center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;text-align: center">
            <el-button  @click="doClose">关闭</el-button>
          </li>
        </ul>
      </div>
    <div class="content-right min-gutter">
      <h3>详情</h3>
      <el-row>
        <oms-row :span="8" label="司机姓名">{{ data.extDto && data.extDto.logisticsDealer }}</oms-row>
      </el-row>
      <el-row>
        <oms-row :span="8" label="所属公司">{{ data.extDto && data.extDto.logisticsDealer }}</oms-row>
      </el-row>
      <el-row>
        <oms-row :span="8" label="分   类">{{ data.extDto && data.extDto.transportTimeLimit }}</oms-row>
      </el-row>
      <el-row>
        <oms-row :span="8" label="手机号码">{{ data.extDto && data.extDto.licensePlateNumber }}</oms-row>
      </el-row>
      <el-row>
        <oms-row :span="8" label="身份证号码">{{ data.remarks }}</oms-row>
      </el-row>
      <el-row>
        <oms-row :span="8" label="驾驶证到期日">{{ data.remarks }}</oms-row>
      </el-row>
      <el-row>
        <oms-row :span="8" label="从业资格证到期日">{{ data.remarks }}</oms-row>
      </el-row>
      <el-row>
        <oms-row :span="8" label="健康证到期日">{{ data.remarks }}</oms-row>
      </el-row>
    </div>
  </div>
</template>
<script>
import utils from '@/tools/utils';
import {BaseInfo} from '@/resources';

export default {
    props: {
      data: {
        type: Object,
        required: true
      },
      show: Boolean
    },
    methods: {
      doClose: function () {
        this.$emit('close');
      }
    }
  };
</script>
