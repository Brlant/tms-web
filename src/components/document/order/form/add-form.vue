<style lang="scss" scoped>
  $labelWidth: 180px;
  .content-part {
    .content-left {
      width: $labelWidth;
    }
    .content-right {
      > h3 {
        left: $labelWidth;
      }
      left: $labelWidth;
    }
  }
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">添加订单</template>
    <template slot="btn">
      <el-button  plain @click="save()">保存</el-button>
    </template>
    <template slot="content">
      <el-form class="clearfix" label-width="100px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">{{pageSets[0].name}}</h3>
          </div>
          <div class="content">
            <two-column>
              <el-form-item slot="left" label="订单号">
                <oms-input  placeholder="请输入"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="委托单号">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="订单类型">
                <el-select value="" filterable remote placeholder="请选择" :clearable="true">
                  <el-option :value="center.id" :key="center.id" :label="center.name"
                             v-for="center in list"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item slot="right" label="发运方式">
                <el-select value="" filterable remote placeholder="请选择" :clearable="true">
                  <el-option :value="center.id" :key="center.id" :label="center.name"
                             v-for="center in list"></el-option>
                </el-select>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="服务方式">
                <el-select value="" filterable remote placeholder="请选择" :clearable="true">
                  <el-option :value="center.id" :key="center.id" :label="center.name"
                             v-for="center in list"></el-option>
                </el-select>
              </el-form-item>
            </two-column>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">{{pageSets[1].name}}</h3>
          </div>
          <div class="content">
            <el-form-item  label="货主">
              <el-select value="" filterable remote placeholder="请选择" :clearable="true">
                <el-option :value="center.id" :key="center.id" :label="center.name"
                           v-for="center in list"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发货单位">
              <el-select value="" filterable remote placeholder="请选择" :clearable="true">
                <el-option :value="center.id" :key="center.id" :label="center.name"
                           v-for="center in list"></el-option>
              </el-select>
            </el-form-item>
            <two-column>
              <el-form-item slot="left" label="发货联系人">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="发货联系电话">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
            </two-column>
            <el-form-item slot="right" label="发货地址">
              <oms-input placeholder="请输入"></oms-input>
            </el-form-item>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[2].key === currentTab.key}">{{pageSets[2].name}}</h3>
          </div>
          <div class="content">
            <el-form-item  label="收货单位">
              <el-select value="" filterable remote placeholder="请选择" :clearable="true">
                <el-option :value="center.id" :key="center.id" :label="center.name"
                           v-for="center in list"></el-option>
              </el-select>
            </el-form-item>
            <two-column>
              <el-form-item slot="left" label="收货联系人">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="收货联系电话">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
            </two-column>
            <el-form-item slot="right" label="收货地址">
              <oms-input placeholder="请输入"></oms-input>
            </el-form-item>
            <two-column>
              <el-form-item slot="left" label="收货地址经度"></el-form-item>
              <el-form-item slot="right" label="收货地址纬度"></el-form-item>
            </two-column>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[3].key === currentTab.key}">{{pageSets[3].name}}</h3>
          </div>
          <div class="content">
            <el-form-item  label="货品">
              <el-select value="" filterable remote placeholder="请选择" :clearable="true">
                <el-option :value="center.id" :key="center.id" :label="center.name"
                           v-for="center in list"></el-option>
              </el-select>
            </el-form-item>
            <two-column>
              <el-form-item slot="left" label="整件数">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="散件数">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="包件数">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="价格">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="重量">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="体积">
                <oms-input placeholder="请输入"></oms-input>
              </el-form-item>
            </two-column>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[4].key === currentTab.key}">{{pageSets[4].name}}</h3>
          </div>
          <div class="content">
            <el-form-item slot="right" label="始发地">
              <oms-input placeholder="请输入"></oms-input>
            </el-form-item>
            <el-form-item slot="right" label="目的地">
              <oms-input placeholder="请输入"></oms-input>
            </el-form-item>
            <el-form-item slot="right" label="货品总称">
              <oms-input placeholder="请输入"></oms-input>
            </el-form-item>
            <el-form-item slot="right" label="备注">
              <oms-input type="textarea" placeholder="请输入"></oms-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  export default {
    data () {
      return {
        list: [],
        times: [],
        pageSets: [
          {name: '基本信息', key: 0},
          {name: '发货信息', key: 1},
          {name: '收货信息', key: 2},
          {name: '货品信息', key: 3},
          {name: '其他信息', key: 4}
        ],
        currentTab: {}
      };
    },
    methods: {
      selectTab (item) {
        this.currentTab = item;
      },
      save () {

      }
    }
  };
</script>
