<style lang="scss">
  .special-col {
    padding-left: 20px;
    position: relative;
    .el-checkbox {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
<template>
  <div class="order-page">
    <search-part @search="searchResult"></search-part>

    <div class="order-list" style="margin-top: 20px">
      <el-table :data="dataList" style="width: 100%;" border class="header-list" :header-row-class-name="'headerClass'"
                v-loading="loadingData">
        <el-table-column prop="id" label="任务id"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{formatStatusTitle(scope.row.status)}}
          </template>
        </el-table-column>
        <el-table-column prop="checkDate" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createTime | time}}
          </template>
        </el-table-column>
        <el-table-column prop="createdName" label="创建人"></el-table-column>
        <el-table-column prop="checkDate" label="结束时间">
          <template slot-scope="scope">
            {{ scope.row.completeTime | time}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="text-center" v-show="dataList.length && !loadingData">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pager.currentPage"
                     :page-sizes="[20,50,100]" :page-size="20" layout="total, sizes, prev, pager, next, jumper"
                     :total="pager.count">
      </el-pagination>
    </div>

  </div>
</template>
<script>
  import SearchPart from './search';
  import {TransportTask} from '@/resources';
  import StatusMixin from '@/mixins/statusMixin';

  export default {
    components: {
      SearchPart
    },
    mixins: [StatusMixin],
    data() {
      return {
        loadingData: false,
        activeStatus: 0,
        dataList: [],
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        form: {},
        filters: {
          createBy: '',
          createStartTime: '',
          createEndTime: '',
          completeStartTime: '',
          completeEndTime: ''
        },
        currentItem: {},
        currentItemId: ''
      };
    },
    watch: {
      filters: {
        handler: function () {
          this.getTransportTaskPage(1);
        },
        deep: true
      }
    },
    mounted() {
      this.getTransportTaskPage(1);
    },
    methods: {
      formatStatusTitle: function (val) {
        let title = '';
        if (val === '0') {
          title = '进行中';
        }
        if (val === '0') {
          title = '已完成';
        }
        return title;
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        this.getTransportTaskPage(1);
      },
      handleCurrentChange(val) {
        this.getTransportTaskPage(val);
      },
      searchResult: function (search) {
        Object.assign(this.filters, search);
      },
      getTransportTaskPage: function (pageNo, isContinue = false) {
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.loadingData = true;
        TransportTask.queryAutoTaskList(param).then(res => {
          if (isContinue) {
            this.dataList = this.showTypeList.concat(res.data.list);
          } else {
            this.dataList = res.data.list;
          }
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      }
    }
  };
</script>

