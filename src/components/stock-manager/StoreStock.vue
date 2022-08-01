<template>
  <div>
    <!--筛选-->
    <header>
      <el-form ref="searchForm" v-model="searchForm" inline>
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="运单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入运单号"></el-input>
        </el-form-item>
        <el-form-item label="发货单位">
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
        <el-form-item label="收货单位">
          <el-select filterable remote placeholder="名称/拼音/系统代码" :remote-method="filterReceiverOrg"
                     :clearable="true"
                     v-model="searchForm.receiverId" popperClass="good-selects">
            <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in receiverOrgList">
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
        <el-form-item label="货品名称">
          <el-input v-model="searchForm.goodsName" placeholder="请输入货品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </header>
    <!--  列表-->
    <main>
      <el-table :data="dataList" border>
        <el-table-column label="订单号" prop="orderNo"></el-table-column>
        <el-table-column label="运单号" prop="waybillNo"></el-table-column>
        <el-table-column label="中转入库单号" prop="transferInOrderNo"></el-table-column>
        <el-table-column label="货主" prop="orgName"></el-table-column>
        <el-table-column label="发货单位" prop="senderName"></el-table-column>
        <el-table-column label="收货单位" prop="receiverName"></el-table-column>
        <el-table-column label="货品名称" prop="goodsName"></el-table-column>
        <el-table-column label="上架时间" prop="shelvesTime"></el-table-column>
        <el-table-column label="库位名称" prop="storePointName"></el-table-column>
        <el-table-column label="可用">
          <el-table-column label="整装箱数" prop="enabledWholeBoxCount"></el-table-column>
          <el-table-column label="散装箱数" prop="enabledBulkBoxCount"></el-table-column>
        </el-table-column>
        <el-table-column label="锁定">
        <el-table-column label="整装箱数" prop="lockWholeBoxCount"></el-table-column>
        <el-table-column label="整装箱数" prop="lockBulkBoxCount"></el-table-column>
        </el-table-column>
        <el-table-column label="重量" prop="weight"></el-table-column>
        <el-table-column label="体积" prop="volume"></el-table-column>
      </el-table>
    </main>
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
        goodsName: '',
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
    search(){
      this.page.pageNo = 1;
      this.page.pageSize = 20;

      this.queryList();
    },
    reset(){
      this.$refs.searchForm.resetFields();

      this.page.pageNo = 1;
      this.page.pageSize = 20;

      this.queryList();
    },
    queryList() {
      let params = Object.assign(this.searchForm, this.page)
      this.$http.get('/transfer-store-stock')
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
    filterReceiverOrg: function (query) {// 过滤收货单位
      BaseInfo.query({keyWord: query}).then(res => {
        this.receiverOrgList = res.data.list;
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
  },
  mounted() {
    this.queryList();
  }
}
</script>

<style scoped>

</style>
