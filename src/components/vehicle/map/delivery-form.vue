<style lang="scss">

  @import '../../../assets/scss/mixins';

  .content-part {
    .content-right {
      > h3 {
        left: 0;
      }
      left: 0;
    }
  }
  .section-part {
    padding: 0 10px;
    .header {
      line-height: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      .sign {
        width: 4px;
        background: $primary-color;
        height: 100%;
      }
      .tit {
        margin: 0 0 0 10px;
      }
    }
  }
  .info-part {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .hr {
    margin-bottom: 10px;
  }
</style>
<template>
  <div class="content-part">
    <div class="content-right content-padding">
      <h3>生成派送</h3>
      <el-form class="clearfix" label-width="100px" onsubmit="return false">
        <div class="section-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib">车辆选择</h3>
          </div>
          <div class="content">
            <div class="info-part">
              <el-form-item label="当前节点">
                <el-select filterable remote placeholder="请选择当前节点" :clearable="true">
                  <el-option :value="center.id" :key="center.id" :label="center.name"
                             v-for="center in list"></el-option>
                </el-select>
              </el-form-item>
              <two-column>
                <el-form-item slot="left" label="车型"></el-form-item>
                <el-form-item slot="right" label="司机电话"></el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="载重"></el-form-item>
                <el-form-item slot="right" label="件数"></el-form-item>
              </two-column>
            </div>
            <two-column>
              <el-form-item slot="left" label="司机">
                <oms-input  placeholder="请输入"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="司机电话">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="司机3">
                <oms-input  placeholder="请输入"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="司机电话3">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
            </two-column>
          </div>
          <div class="hr"></div>
        </div>
        <div class="section-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib">车辆选择</h3>
          </div>
          <div class="content">
            <two-column>
              <el-form-item slot="left" label="派送单号">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="承运商">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="任务名称">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="派送日期">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="理货员">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="理货员电话">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="理货员3">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="理货员电话3">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
            </two-column>
            <div class="info-part">
              <two-column>
                <el-form-item slot="left" label="票数"></el-form-item>
                <el-form-item slot="right" label="重量"></el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="体积"></el-form-item>
                <el-form-item slot="right" label="件数"></el-form-item>
              </two-column>
            </div>
            <el-form-item label="派送要求">
              <oms-input placeholder="请输入"></oms-input>
            </el-form-item>
          </div>
        </div>
        <div class="hr"></div>
        <el-row class="text-right">
          <el-form-item>
            <el-button type="primary">保存</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
  import TwoColumn from '@/components/common/two-column';
  export default {
    components: {TwoColumn},
    data () {
      return {
        list: [],
        times: []
      };
    }
  };
</script>
