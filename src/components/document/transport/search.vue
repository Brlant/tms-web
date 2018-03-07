<template>
  <search-template :isShow="showSearch"  @search="search" @isShow="isShow">
    <template slot="title">运单查询</template>
    <template slot="content">
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
    </template>
  </search-template>
</template>
<script>
  export default {
    data: function () {
      return {
        searchCondition: {},
        showSearch: false,
        list: [],
        times: []
      };
    },
    methods: {
      search () {
        this.$emit('search', this.searchCondition);
      },
      isShow (val) {
        this.showSearch = val;
      }
    }
  };
</script>
