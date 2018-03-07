<template>
  <div class="opera-btn-group" :class="{up: showSearch}">
    <div class="opera-icon">
      <el-col :span="2">
        <h2 class="header f-dib">运单查询</h2>
      </el-col>
      <!--<el-col :span="18" class="text-right">-->
          <!--<span class="switching-icon" @click="showSearch = !showSearch">-->
            <!--<i class="el-icon-arrow-up"></i>-->
            <!--<span v-show="showSearch">收起筛选</span>-->
            <!--<span v-show="!showSearch">展开筛选</span>-->
          <!--</span>-->
      <!--</el-col>-->
      <el-col :span="22" class="text-right">
        <el-button-group>
          <el-button type="primary" plain size="small" @click="search">查询结果</el-button>
          <el-button type="primary" plain size="small" @click="showSearch = !showSearch">高级检索</el-button>
        </el-button-group>
      </el-col>
    </div>
    <el-form class="advanced-query-form" onsubmit="return false">
      <el-row>
        <el-col :span="8">
          <oms-form-row label="运单号" :span="5">
            <oms-input placeholder="请输入运单号"></oms-input>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="委托单号" :span="5">
            <oms-input placeholder="请输入委托单号"></oms-input>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="订单类型" :span="5">
            <el-select filterable remote placeholder="请选择订单类型" :clearable="true" v-model="searchCondition.piont">
              <el-option :value="center.id" :key="center.id" :label="center.name"
                         v-for="center in list"></el-option>
            </el-select>
          </oms-form-row>
        </el-col>
        <div v-show="showSearch">
          <el-col :span="8">
            <oms-form-row label="发运方式" :span="5">
              <el-select filterable remote placeholder="请选择发运方式" :clearable="true" v-model="searchCondition.piont">
                <el-option :value="center.id" :key="center.id" :label="center.name"
                           v-for="center in list"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="服务方式" :span="5">
              <el-select filterable remote placeholder="请选择服务方式" :clearable="true" v-model="searchCondition.piont">
                <el-option :value="center.id" :key="center.id" :label="center.name"
                           v-for="center in list"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="发货单位" :span="5">
              <el-select filterable remote placeholder="请选择发货单位" :clearable="true" v-model="searchCondition.piont">
                <el-option :value="center.id" :key="center.id" :label="center.name"
                           v-for="center in list"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="收货单位" :span="5">
              <el-select filterable remote placeholder="请选择收货单位" :clearable="true" v-model="searchCondition.piont">
                <el-option :value="center.id" :key="center.id" :label="center.name"
                           v-for="center in list"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
        </div>
      </el-row>
    </el-form>

  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        showSearch: false,
        searchCondition: {},
        list: [],
        times: []
      };
    },
    methods: {
      search () {
        this.$emit('search', this.searchCondition);
      },
      searchResult () {

      }
    }
  };
</script>
