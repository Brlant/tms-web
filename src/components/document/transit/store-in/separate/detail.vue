<style lang="scss" scoped>
  .content-part {
    .content-right {
      > h3 {
        left: 0;
      }
      left: 0;
      padding-left: 25px;
      padding-right: 25px;
    }
  }

  .tr-bg {
    background: #eeeeee;
  }

  .table > tbody > tr:first-child > td {
    border-top: 0;
  }

  .batch-info {
    .oms-row {
      margin-bottom: 10px;
    }
  }

  .show-item {
    padding: 5px 10px;
    border: 1px solid #f1f1f1;
    margin-bottom: 10px;
    overflow: hidden;
    .store {
      float: left;
    }
    .count {
      float: right;
    }
  }

  .mb0 {
    margin-bottom: 0;
  }
</style>
<template>
  <div>
    <div class="content-part">
      <div class="content-right content-padding">
        <h3>{{ $route.meta.type === 0 ? '整件' : '散件' }}入库任务详情</h3>
        <div class="page-main-body padding">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="任务详情" name="0">
              <el-row class="mb0">
                <el-col :span="12">
                  <oms-row label="任务号">
                    {{info.id}}
                  </oms-row>
                  <oms-row label="创建时间">
                    {{ info.createTime | time }}
                  </oms-row>
                </el-col>
                <el-col :span="12">
                  <oms-row label="复核人">
                    {{info.reviewerName}}
                  </oms-row>
                  <oms-row label="上架人">
                    {{info.pickUpManName}}
                  </oms-row>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="订单详情" name="1">
              <el-row class="mb0">
                <el-col :span="12">
                  <oms-row label="订单号">
                    {{info.orderNo}}
                  </oms-row>
                  <oms-row label="货主">
                    {{info.orgName}}
                  </oms-row>
                  <oms-row label="备注">
                    {{info.orderRemark}}
                  </oms-row>
                </el-col>
                <el-col :span="12">
                  <oms-row label="业务类型">
                    <dict :dict-group="'bizInType'" :dict-key="info.bizType"></dict>
                  </oms-row>
                  <oms-row label="来源单位">
                    {{info.supplierName}}
                  </oms-row>
                  <oms-row label="状态" class="mb0">
                    {{ getWaveStatus(info) }}
                  </oms-row>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="货品详情" name="2">
              <el-row class="mb0">
                <el-col :span="12">
                  <oms-row label="货品主档名称">
                    {{info.goodsName}}
                  </oms-row>
                  <oms-row label="生产单位">
                    {{info.factoryName}}
                  </oms-row>
                  <oms-row label="货品规格">
                    {{info.specification}}
                  </oms-row>
                  <oms-row label="数量" class="mb0">
                    <span v-if="info.type == 0">
                       {{info.count}}{{ info.packageUnit }}({{ info.packageSize
                    }}{{ info.measurementUnit}}/{{ info.packageUnit }})
                    </span>
                    <span v-else>
                      {{info.count}}{{ info.measurementUnit}}
                    </span>
                  </oms-row>
                </el-col>
                <el-col :span="12">
                  <oms-row label="批号">
                    {{info.batchNumber}}
                  </oms-row>
                  <oms-row label="生产日期">
                    {{info.productionDate | date}}
                  </oms-row>
                  <oms-row label="有效期">
                    {{info.expirationDate | date}}
                  </oms-row>
                  <oms-row label="是否合格" class="mb0">
                    {{ info.qualifiedFlag | formatStatus }}
                  </oms-row>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="货位详情" name="3" v-if="storeList.length">
              <oms-row :span="5" label="分配货位" v-show="storeList.length && status !== '5'">
                <div v-if="storeList[0].length === 1">
                  <span>{{ storeList[0].centreName }}/</span>
                  <span>{{ storeList[0].warehouseName }}/</span>
                  <span>{{ storeList[0].areaName }}/</span>
                  <span>{{ storeList[0].storeName }}</span>
                </div>
                <div v-else>
                  <ul class="show-list">
                    <li v-for="item in storeList">
                      <span class="store">
                        <span>{{ item.centreName }}/</span>
                        <span>{{ item.warehouseName }}/</span>
                        <span>{{ item.areaName }}/</span>
                        <span>{{ item.storeName }}</span>
                      </span>
                      <span class="count" style="padding-left: 50px">
                        分配数量:{{ item.count }}
                      </span>
                    </li>
                  </ul>
                </div>
              </oms-row>
              <oms-row :span="5" label="分配货位" v-show="storeList.length && status === '5'" class="mb0">
                <div>
                  <ul class="show-list">
                    <template v-for="item in storeList">
                      <template v-for="b in item.batchNumberList">
                        <template v-for="p in b.packageList">
                          <li v-for="s in p.list">
                            <span class="store">
                              <span>{{ s.centreName }}/</span>
                              <span>{{ s.warehouseName }}/</span>
                              <span>{{ s.areaName }}/</span>
                              <span>{{ s.storeName }}（{{s.storeNo}}）</span>
                            </span>
                            <span class="count" style="padding-left: 50px">
                              分配数量:{{ s.storeQuantity }}
                            </span>
                          </li>
                        </template>
                      </template>
                    </template>
                  </ul>
                </div>
              </oms-row>
            </el-collapse-item>
            <el-collapse-item title="关联追溯码" name="4">
              <div v-loading="loadingData">
                <div style="margin-bottom: 10px; margin-top: 20px;overflow: hidden">
                  <h2 style="display: inline-block">追溯码信息</h2>
                  <span class="pull-right">
                  <span class="btn-search-toggle open" v-show="showSearch">
                    <single-input v-model="filters.code" placeholder="请输入追溯码搜索" :showFocus="showSearch"
                                  style="width: 180px;"></single-input>
                            <i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>
                  </span>
                  <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
                      <i class="el-icon-t-search"></i>
                  </a>
                </span>
                </div>
                <div class="order-list clearfix">

                  <el-row class="order-list-header t-head" style="margin:0">
                    <el-col :span="6">追溯码</el-col>
                    <el-col :span="8">货品名称</el-col>
                    <el-col :span="4">批号</el-col>
                    <el-col :span="3">包装类型</el-col>
                  </el-row>
                  <el-row v-if="!traceCodes.length">
                    <el-col :span="24">
                      <div class="empty-type-info mini">暂无信息</div>
                    </el-col>
                  </el-row>
                  <div v-else class="order-list-body">
                    <div class="order-list-item  order-list-item-bg" v-for="item in traceCodes"
                         style="margin-left: 0;margin-right: 0">
                      <el-row>
                        <el-col :span="6" class="R pt10">
                          <span>{{ item.code }}</span>
                        </el-col>
                        <el-col :span="8" class="pt">
                          <span>{{ item.goodsName }}</span>
                        </el-col>
                        <el-col :span="4" class="pt">
                          <span>{{ item.batchNumber }}</span>
                          <el-tag type="warning" v-if="item.codeType===2">未知追溯</el-tag>
                        </el-col>
                        <el-col :span="3" class="pt">
                          <span>{{ packageType[item.packageScheme-1] }}</span>
                        </el-col>
                      </el-row>
                    </div>
                  </div>

                </div>
                <div class="text-center" v-show="(traceCodes.length || pager.currentPage !== 1) && !loadingData">
                  <el-cu-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                    :current-page="pager.currentPage"
                                    :page-sizes="[10,20,50,100]" :page-size="pager.pageSize"
                                    layout=" sizes, prev, pager, next, jumper" :total="pager.count">
                  </el-cu-pagination>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {InHouseWork} from '@/resources';
import utils from '@/tools/utils';

export default {
    props: {
      taskId: String,
      orgType: Object,
      showPartIndex: String,
      status: String
    },
    data() {
      return {
        info: {},
        storeList: [],
        activeNames: ['0', '1', '2', '3', '4'],
        filters: {
          code: ''
        },
        loadingData: false,
        traceCodes: [],
        showSearch: true,
        packageType: utils.packageType,
        statusType: ['未知', '流转中', '已使用', '异常'],
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
        }
      };
    },
    watch: {
      showPartIndex(val) {
        this.info = {};
        if (val !== '5') return;
        this.queryDetails();
        this.getStores();
        this.filters.code = '';
      },
      'filters.code'() {
        this.getTradeCode(1);
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pager.pageSize = val;
        window.localStorage.setItem('currentPageSize', val);
        this.getTradeCode(1);
      },
      handleCurrentChange(val) {
        this.getTradeCode(val);
      },
      queryDetails() {
        InHouseWork.get(this.taskId).then(res => {
          this.info = res.data;
          this.getTradeCode(1);
        });
      },
      getWaveStatus: function (order) { // 获取订单状态
        let state = '';
        for (let key in this.orgType) {
          if (order.status === this.orgType[key].status) {
            state = this.orgType[key].title;
          }
        }
        return state;
      },
      getStores: function () { // 根据类型，得到货位列表
        if (this.status !== '5') {
          InHouseWork.queryAssignStore(this.taskId).then(res => {
            this.storeList = res.data;
          });
        } else { //
          InHouseWork.queryShelfGoodsDetail(this.taskId).then(res => {
            this.storeList = res.data;
          });
        }
      },
      getTradeCode: function (pageNo) {
        if (!this.info.id) return;
        this.pager.currentPage = pageNo;
        let params = Object.assign({
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          sourceOrgId: this.info.supplierId,
          directOrgId: this.info.orgId,
          orderNo: this.info.orderNo
        }, this.filters);
        this.loadingData = true;
        this.$http.get('/3pl-code/task/' + this.info.id + '/local/pager', {params}).then(res => {
          this.traceCodes = res.data.list;
          this.loadingData = false;
          // 组装分页数
          this.pager.count = this.pager.currentPage * this.pager.pageSize + (this.traceCodes.length === this.pager.pageSize ? 1 : 0);
        });
      }
    }
  };
</script>
