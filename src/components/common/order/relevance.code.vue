<style lang="scss" scoped>
@import '../../../assets/scss/mixins';

.product-code-list {
  margin-top: 20px;
  text-align: center;
  border-collapse: collapse;
  font-size: 12px;

  td {
    height: 24px;
    border: 1px solid #dfe6ec;
  }

}

.t-head {
  background: #eef1f6;
  color: #1f2d3d;
  font-weight: bold;
}

.btn-group {
  margin-bottom: 30px;
  overflow: hidden;

  .download-icon {
    margin-top: 10px;
    cursor: pointer;

    &:hover a {
      color: $activeColor;
    }
  }
}

.empty-info {
  &.mini-empty-info {
    height: 60px;
  }
}

.qp-box {
  &.accessory {
    margin-bottom: 20px;
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 0 20px 10px 20px;

    h2 {
      line-height: 20px;
      margin: 10px 0;
      padding: 0;
    }

    .accessory-item {
      margin-top: 10px;
    }
  }

  .accessory-list {
    .show-list {
      .list-item {
        .attachment-delete, .download-link {
          float: right;
          padding: 0 10px;
          color: #fff;
          font-size: 16px;
        }

        &:hover .attachment-delete {
          color: red;
        }

        &:hover .download-link {
          color: #1c8de0;
        }
      }
    }
  }
}

</style>
<template>
  <div>
    <div v-loading="loadingData">
      <div class="order-list clearfix">
        <h2>合计信息</h2>
        <el-row class="order-list-header t-head" style="margin:0">
          <el-col :span="8">货品名称</el-col>
          <el-col :span="4">批号</el-col>
          <el-col :span="6">生产单位</el-col>
          <el-col :span="3">生产日期</el-col>
          <el-col :span="3">数量</el-col>
        </el-row>
        <el-row v-if="!totalInfoList.length">
          <el-col :span="24">
            <div class="empty-type-info mini">暂无信息</div>
          </el-col>
        </el-row>
        <div v-else class="order-list-body">
          <div class="order-list-item order-list-item-bg" v-for="item in totalInfoList"
               style="margin-left: 0;margin-right: 0">
            <el-row>
              <el-col :span="8" class="R pt10">
                <span>{{ item.goodsName }}</span>
              </el-col>
              <el-col :span="4" class="pt">
                <span>{{ item.batchNumber }}</span>
              </el-col>
              <el-col :span="6" class="pt">
                <span>{{ item.factoryName }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ item.productionDate | date }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ item.count }}</span>
              </el-col>
            </el-row>
          </div>
          <div class="order-list-item order-list-item-bg"
               style="margin-left: 0;margin-right: 0">
            <el-row>
              <el-col :span="21">
                <span>合计</span>
              </el-col>
              <el-col :span="3">
                <span>{{ totalCount }}</span>
              </el-col>
            </el-row>
          </div>
        </div>

      </div>
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
          <el-col :span="8">追溯码</el-col>
          <el-col :span="8">货品名称</el-col>
          <el-col :span="5">批号</el-col>
          <el-col :span="3">包装类型</el-col>
        </el-row>
        <el-row v-if="!currentTraceCodes.length">
          <el-col :span="24">
            <div class="empty-type-info mini">暂无信息</div>
          </el-col>
        </el-row>
        <div v-else class="order-list-body">
          <div class="order-list-item order-list-item-bg" v-for="item in currentTraceCodes"
               style="margin-left: 0;margin-right: 0">
            <el-row>
              <el-col :span="8" class="R pt10">
                <span>{{ item.code }}</span>
              </el-col>
              <el-col :span="8" class="pt">
                <span>{{ item.goodsName }}</span>
              </el-col>
              <el-col :span="5" class="pt">
                <span>{{ item.batchNumber }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ packageType[item.packageScheme - 1] }}</span>
              </el-col>
            </el-row>
          </div>
        </div>

      </div>
      <!--<div class="text-center" v-show="(traceCodes.length || pager.currentPage !== 1) && !loadingData">-->
      <!--<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"-->
      <!--:current-page="pager.currentPage"-->
      <!--:page-sizes="[10,50,100]" :page-size="10" layout="sizes, prev, pager, next, jumper"-->
      <!--:total="pager.count">-->
      <!--</el-pagination>-->
      <!--</div>-->
    </div>
  </div>
</template>
<script>
import {http} from '@/resources';
import utils from '@/tools/utils';

export default {
  props: {
    currentOrder: {
      required: true,
      type: Object,
      default: function () {
        return {};
      }
    },
    index: {
      type: Number,
      default: -1
    },
    type: String
  },
  data() {
    return {
      loadingData: false,
      showSearch: true,
      traceCodes: [],
      filters: {
        code: ''
      },
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 10
      },
      packageType: utils.packageType,
      doing: false,
      totalInfoList: []
    };
  },
  computed: {
    currentTraceCodes() {
      let code = this.filters.code;
      return this.traceCodes.filter(f => !code || code && f.code.includes(code));
    },
    totalCount() {
      let total = 0;
      this.totalInfoList.forEach(i => {
        total += i.count;
      });
      return total;
    }
  },
  watch: {
    index(val) {
      this.filters.code = '';
      if (val !== 8) return;
      this.getTraceCodes(1);
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pager.pageSize = val;
      this.getTraceCodes(1);
    },
    handleCurrentChange(val) {
      this.getTraceCodes(val);
    },
    getTraceCodes(pageNo) {
      if (pageNo === 1) {
        this.pager.count = 0;
      }
      this.pager.currentPage = pageNo;
      let params = Object.assign({
        pageNo: pageNo,
        pageSize: this.pager.pageSize,
        type: this.type,
        orderNo: encodeURIComponent(this.currentOrder.orderNo),
        sourceOrgId: this.currentOrder.type === '0' ? this.currentOrder.supplierId : this.currentOrder.orgId,
        directOrgId: this.currentOrder.type === '0' ? this.currentOrder.orgId : this.currentOrder.customerId
      }, this.filters);
      this.loadingData = true;
      // this.currentOrder.orderNo = '201805250001'; // 201805250001
      http.get(`/3pl-code/trace-code/list`, {params}).then(res => {
        this.traceCodes = res.data.list;
        // this.pager.count = res.data.list.length;
        this.totalInfoList = res.data.statisticsList;
        this.loadingData = false;
      });
    }
  }
};
</script>
