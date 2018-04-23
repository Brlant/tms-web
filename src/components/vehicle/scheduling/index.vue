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
        <!--<el-table-column prop="id" label="任务id" width="100"></el-table-column>-->
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            {{formatStatusTitle(scope.row.status)}}
          </template>
        </el-table-column>
        <el-table-column prop="cost" label="成本(元)">
          <template slot-scope="scope">
            {{ scope.row.cost}}
          </template>
        </el-table-column>
        <el-table-column prop="distance" label="距离(千米)">
          <template slot-scope="scope">
            {{ scope.row.distance}}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="80">
          <template slot-scope="scope">
            {{ formatTypeTitle(scope.row.type)}}
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
        <el-table-column prop="planTime" label="运输总时长(小时)">
          <template slot-scope="scope">
            {{ scope.row.planTime/3600| formatMoney}}
          </template>
        </el-table-column>
        <el-table-column prop="maxTime" label="最长时长(小时)">
          <template slot-scope="scope">
            {{ scope.row.maxTime/3600| formatMoney}}
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
          createdBy: '',
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
      formatTypeTitle: function (val) {
        let title = '';
        if (val === -1) {
          title = '手动排单';
        }
        if (val === 0) {
          title = '最低成本';
        }
        if (val === 1) {
          title = '最短距离';
        }
        if (val === 2) {
          title = '最短时间';
        }
        return title;
      },
      formatStatusTitle: function (val) {
        let title = '';
        if (val === '0') {
          title = '进行中';
        }
        if (val === '1') {
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

