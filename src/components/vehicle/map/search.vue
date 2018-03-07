<template>
    <search-template :isShow="showSearch"  @search="search" @isShow="isShow">
      <template slot="title">派送查询</template>
      <template slot="content">
        <el-form class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="当前节点" :span="5">
                <el-select filterable remote placeholder="请选择当前节点" :clearable="true" v-model="searchCondition.piont">
                  <el-option :value="center.id" :key="center.id" :label="center.name"
                             v-for="center in list"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="要求到达" :span="5">
                <el-date-picker
                  v-model="times"
                  type="daterange"
                  placeholder="请选择日期">
                </el-date-picker>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="运单号" :span="5">
                <oms-input placeholder="请输入运单号"></oms-input>
              </oms-form-row>
            </el-col>
            <div v-show="showSearch">
              <el-col :span="8">
                <oms-form-row label="始发地" :span="5">
                  <oms-input placeholder="请输入运单号"></oms-input>
                </oms-form-row>
              </el-col>
              <el-col :span="8">
                <oms-form-row label="目的地" :span="5">
                  <oms-input placeholder="请输入运单号"></oms-input>
                </oms-form-row>
              </el-col>
              <el-col :span="8">
                <oms-form-row label="运单类型" :span="5">
                  <el-select filterable remote placeholder="请选择运单类型" :clearable="true" v-model="searchCondition.piont">
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
              <el-col :span="8">
                <oms-form-row label="收货地址" :span="5">
                  <oms-input placeholder="请输入收货地址"></oms-input>
                </oms-form-row>
              </el-col>
              <el-col :span="8">
                <oms-form-row label="运单状态" :span="5">
                  <el-select filterable remote placeholder="请选择运单状态" :clearable="true" v-model="searchCondition.piont">
                    <el-option :value="center.id" :key="center.id" :label="center.name"
                               v-for="center in list"></el-option>
                  </el-select>
                </oms-form-row>
              </el-col>
              <el-col :span="8">
                <oms-form-row label="发货人" :span="5">
                  <oms-input placeholder="请输入发货人"></oms-input>
                </oms-form-row>
              </el-col>
              <el-col :span="8">
                <oms-form-row label="发运方式" :span="5">
                  <el-select filterable remote placeholder="请选择发运方式" :clearable="true" v-model="searchCondition.piont">
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
