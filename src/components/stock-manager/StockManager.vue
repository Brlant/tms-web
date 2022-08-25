<template>
  <div>
    <!--筛选-->
    <header>
      <el-form ref="searchForm" :model="searchForm" inline>
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="运单号" prop="waybillNo">
          <el-input v-model="searchForm.waybillNo" placeholder="请输入运单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="发货单位" prop="senderId">
          <el-select filterable remote placeholder="名称/拼音/系统代码" :remote-method="filterSenderOrg"
                     :clearable="true"
                     v-model="searchForm.senderId" popperClass="good-selects">
            <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in senderOrgList">
              <div style="overflow: hidden">
                <span class="pull-left" style="clear: right">{{ org.name }}</span>
              </div>
              <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                      <span>系统代码:</span>{{ org.manufacturerCode }}
                    </span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="收货单位" prop="receiverId">-->
<!--          <el-select filterable remote placeholder="名称/拼音" :remote-method="filterReceiverOrg"-->
<!--                     :clearable="true"-->
<!--                     v-model="searchForm.receiverId" popperClass="good-selects">-->
<!--            <el-option :value="org.receiverId" :key="org.receiverId" :label="org.receiverName"-->
<!--                       v-for="org in receiverOrgList">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="货品名称" prop="goodsTotalName">
          <el-input v-model="searchForm.goodsTotalName" placeholder="请输入货品名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </header>

    <!--  列表-->
    <main>
      <el-table :data="dataList" border
                show-summary
                :summary-method="getSummaries"
                style="width: 100%">
        <el-table-column label="订单号" align="center" prop="orderNo"></el-table-column>
        <el-table-column label="运单号" align="center" prop="waybillNo"></el-table-column>
        <el-table-column label="中转入库单号" align="center" prop="transferInOrderNo"></el-table-column>
        <el-table-column label="货主" align="center" prop="orgName"></el-table-column>
        <el-table-column label="发货单位" align="center" prop="senderName"></el-table-column>
        <el-table-column label="收货单位" align="center" prop="receiverName"></el-table-column>
        <el-table-column label="货品名称" align="center" prop="goodsTotalName"></el-table-column>
        <el-table-column label="收货时间" align="center" width="180">
          <template v-slot="{row}">
            {{ row.receiptGoodsTime|time }}
          </template>
        </el-table-column>
        <el-table-column label="上架时间" align="center" width="180">
          <template v-slot="{row}">
            {{ row.shelvesTime|time }}
          </template>
        </el-table-column>
        <el-table-column label="可用" align="center">
          <el-table-column label="整装箱数" align="center" prop="enabledWholeBoxCount"></el-table-column>
          <el-table-column label="散装箱数" align="center" prop="enabledBulkBoxCount"></el-table-column>
        </el-table-column>
        <el-table-column label="锁定" align="center">
          <el-table-column label="整装箱数" align="center" prop="lockWholeBoxCount"></el-table-column>
          <el-table-column label="整装箱数" align="center" prop="lockBulkBoxCount"></el-table-column>
        </el-table-column>
        <el-table-column label="重量" align="center" prop="weight">
          <template v-slot="{row}">
            {{ !row.weight ? '' : row.weight.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="体积" align="center" prop="volume">
          <template v-slot="{row}">
            {{ !row.volume ? '' : row.volume.toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
    </main>

    <!--分页-->
    <footer class="text-center">
      <el-pagination :current-page="page.pageNo" :page-size="page.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="page.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="sizes, prev, pager, next, jumper">
      </el-pagination>
    </footer>
  </div>
</template>

<script>
import {BaseInfo} from '@/resources'

export default {
  name: "stock-manager",
  data() {
    return {
      searchForm: {
        orderNo: '',
        waybillNo: '',
        senderId: '',
        receiverId: '',
        goodsTotalName: '',
      },
      page: {
        pageNo: 1,
        pageSize: 20,
        count: 0,
      },
      dataList: [],
      senderOrgList: [],
      receiverOrgList: [],
    }
  },
  methods: {
    search() {
      this.page.pageNo = 1;
      this.page.pageSize = 20;

      this.queryList();
    },
    reset() {
      this.$refs.searchForm.resetFields();

      this.page.pageNo = 1;
      this.page.pageSize = 20;

      this.queryList();
    },
    queryList() {
      let params = Object.assign(this.searchForm, this.page);
      this.$http.get('/transfer-store-stock', {params})
        .then(res => {
          this.dataList = res.data.list;
          this.page.count = res.data.count;
        })
        .catch(err => {
          console.error(`查询异常：`, ...err);
        })
    },
    filterSenderOrg: function (query) {// 过滤发货单位
      BaseInfo.query({keyWord: query}).then(res => {
        this.senderOrgList = res.data.list;
      });
    },
    // 过滤收货单位
    filterReceiverOrg: function (receiverName, pageNo = 1, pageSize = 100) {
      this.$http.get('/receiver', {params: {receiverName, pageNo, pageSize}})
        .then(res => {
          const {totalPage, list} = res.data;
          if (pageNo == 1) {
            this.receiverOrgList = list;
          } else {
            this.receiverOrgList = this.receiverOrgList.concat(list);
          }

          if (totalPage > pageNo) {
            this.filterReceiverOrg(receiverName, pageNo++);
          }
        });
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.page.pageNo = val;
      this.queryList();
    },
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }

        if (index < 9) {
          sums[index] = '--';
          return;
        }

        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          let val = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          if (index > 12) {
            val = val.toFixed(2);
          }
          sums[index] = val;
        } else {
          sums[index] = 'N/A';
        }
      });

      return sums;
    }
  },
  mounted() {
    this.queryList();
  }
}
</script>

<style scoped>
header {
  background-color: #fff;
  padding-left: 22px;
  padding-top: 22px;
  margin: 15px 0;
}

</style>
