<style lang="scss" scoped>
  .part-hj-box {
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .el-select {
    display: block;
  }
</style>
<template>
  <div>
    <div class="content-part">
      <h2 class="clearfix" style="margin-left: 20px">当前包装编号：{{form.devNo}}</h2>
      <el-table :data="logList" border style="width: 90%;margin-top: 20px;margin-left: 20px">
        <el-table-column prop="oldStatus" label="旧状态" width="200">
          <template slot-scope="scope">
            <dict :dict-group="devTypeStatus" :dict-key="scope.row.oldStatus"></dict>
          </template>
        </el-table-column>
        <el-table-column prop="newStatus" label="新状态" width="200">
          <template slot-scope="scope">
            <dict :dict-group="devTypeStatus" :dict-key="scope.row.newStatus"></dict>
          </template>
        </el-table-column>
        <el-table-column prop="createName" label="修改人" width="180">
        </el-table-column>
        <el-table-column prop="createTime" label="修改时间" width="282">
          <template slot-scope="scope">
            {{scope.row.createTime|time}}
          </template>
        </el-table-column>
      </el-table>
      <div class="text-center clearfix" v-if="logList.length">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="storePager.currentPage"
                       :page-sizes="[20,50,100]" :page-size="20"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="storePager.count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import {DevDetail} from '@/resources';

  export default {
    data: function () {
      return {
        form: this.formItem,
        logList: [],
        storePager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        devTypeStatus: ''
      };
    },
    mounted () {
    },
    computed: {},
    props: ['formItem', 'devType'],
    watch: {
      formItem: function (val) {
        this.form = Object.assign({}, val);
        if (this.form.id) {
          this.getLogList(1);
        }
      },
      devType: function (val) {
        if (!val) return;
        this.devTypeStatus = val + 'Status';
      }
    },
    methods: {
      handleSizeChange (val) {
        this.storePager.pageSize = val;
        this.getLogList(1);
      },
      handleCurrentChange (val) {
        this.getLogList(val);
      },
      getLogList: function (pageNo) {
        this.storePager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.storePager.pageSize
        });
        DevDetail.getLogPageByDevDetailId(this.form.id, param).then(res => {
          this.logList = res.data.list;
          this.storePager.count = res.data.count;
          this.storePager.totalPage = res.data.totalPage;
        });
      }
    }
  };
</script>
