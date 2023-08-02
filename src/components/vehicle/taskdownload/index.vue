<template>
    <div class="order-page">
      <div class="container">
          <el-form class="advanced-query-form " >
            <el-row>
              <el-col :span="8">
                <oms-form-row :span="6" label="创建人">
                  <oms-input v-model="params.creator" placeholder="请输入创建人"
                         @keyup.native.enter="search"></oms-input>
                </oms-form-row>
                
              </el-col>
              <el-col :span="8">
                <oms-form-row :span="6" label="创建时间">
                  <el-date-picker v-model="createTimes"
                                  type="daterange"
                                  unlink-panels
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期"
                                  format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd" 
                                  :picker-options="pickerOptions">
                  </el-date-picker>
                </oms-form-row>
              </el-col>
              <el-col :span="8">
                <oms-form-row :span="6" label="完成时间">
                  <el-date-picker v-model="completeTimes"
                                  type="daterange"
                                  unlink-panels
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期"
                                  format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd" 
                                  :picker-options="pickerOptions">
                  </el-date-picker>
                </oms-form-row>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" >
                <oms-form-row :span="6" label="任务类型">
                    <el-select v-model="params.taskType" :clearable="true" filterable
                              placeholder="支持搜索区域名称">
                      <el-option v-for="item in taskTypes" :key="item.value"
                                :label="item.label"
                                :value="item.value">
                      </el-option>
                    </el-select>
                  </oms-form-row>
              </el-col>
              <el-col :span="8">
                <oms-form-row :span="6" label="状态">
                  <el-select v-model="params.taskStatus" :clearable="true" filterable
                             placeholder="支持搜索区域名称">
                    <el-option v-for="item in taskStatusList" :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </oms-form-row>
              </el-col>
              <el-col :span="8" >
                <oms-form-row :span="8" label="">
                  <el-button :disabled="loadingData" type="primary" @click="query">
                    查询
                  </el-button>
                  <el-button @click="resetSearchForm">重置</el-button>
                </oms-form-row>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div style="padding: 20px;">
        <el-table ref="reportTable" v-loading="loadingData"
                  :data="list" border class="header-list"
                  max-height="800">
          <el-table-column label="序号" type="index" :index="serialGen" fixed width="80"></el-table-column>
          <el-table-column label="任务类型" min-width="100" prop="taskType" :formatter="formatTaskStyle"></el-table-column>
  
          <el-table-column :sortable="true" prop="createTime" label="创建时间" width="180">
            <template v-slot="{row}">
              {{ row.createTime | time }}
            </template>
          </el-table-column>
  
          <el-table-column :sortable="true" prop="completeTime" label="完成时间" width="180">
            <template v-slot="{row}">
              {{ row.completeTime | time }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100" align="center">
            <template v-slot="{row}">
              <el-tag type="info" v-if="row.taskStatus == 0">待处理</el-tag>
              <el-tag type="warn" v-else-if="row.taskStatus == 1">处理中</el-tag>
              <el-tag type="success" v-else-if="row.taskStatus == 2">已完成</el-tag>
              <el-tag type="danger" v-else-if="row.taskStatus == 3">已失败</el-tag>
              <el-tag v-else>未知</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="失败原因" min-width="100" prop="failReason" ></el-table-column>
          <el-table-column label="创建人" prop="creator" width="100"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template v-slot="{row}">
              <el-row :gutter="15">
                <el-col :span="6" :offset="3">
                  <perm label="transport-download-download">
                    <el-button v-if="row.taskStatus == 2" type="success" plain
                               @click="download(row.id)" :disabled="isLoading">下载
                    </el-button>
                  </perm>
                </el-col>
                <el-col :span="6" :offset="3">
                  <perm label="transport-download-download">
                    <el-button  v-if="row.taskStatus == 2"  type="primary" plain @click="print(row.id,row.fileName)" :disabled="isLoading">打印</el-button>
                  </perm>
                </el-col>
              </el-row>
  
            </template>
          </el-table-column>
        </el-table>
        </div>
        <div v-show="list.length" class="text-center">
          <el-pagination
            :current-page="params.pageNo" :page-sizes="[10,20,50,100]"
            :pageSize="params.pageSize"
            :total="totalCount" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>
  </template>
  
  <script>
  import ReportMixin from '@/mixins/reportMixin'
  import utils from '@/tools/utils'
  import Perm from '@/components/common/perm'
  
  export default {
    components: {Perm},
    mixins: [ReportMixin],
    data() {
      return {
        showSearch: true,
        // 列表和导出的查询参数
        params: {
           // 创建人
           creator: '',
          // 任务类型
          taskType: '',
          // 状态：全部/待处理/处理中/已完成   默认：全部，即''
          taskStatus: '',
          // 创建时间与完成时间的范围筛选
          createTime1: '',
          createTime2: '',
          completeTime1: '',
          completeTime2: '',
          pageNo: 1,
          pageSize: 20,
        },
        detailList: [], // 货主
        createTimes: [],
        completeTimes: [],
        list: [],
        minDate: '',
        pickerOptions: {
          onPick: ({maxDate, minDate}) => {
            this.minDate = minDate;
          },
          disabledDate: (date) => {
            // 只能选择一年内的日期，不可超过一年，也不能选择未来的日期
            const max = Date.now();
            const time = date.getTime();
            return time > max;
          },
        },
        taskTypes: [
          {value: '', label: '全部'},
          {value: '0', label: '出车任务'},
        ],
        taskStatusList: [
          {value: '', label: '全部'},
          {value: '0', label: '待处理'},
          {value: '1', label: '处理中'},
          {value: '2', label: '已完成'},
          {value: '3', label: '已失败'},
        ],
        orgGoods: [],
        isLoading: false,
        loadingData: false,
        totalCount: 0,
        orgAreas: []
      }
    },
    computed: {
      // taskTypeList() {
      //   return this.$getDict('taskType');
      // },
    },
    watch: {
    },
    methods: {
      // 序号从1开始，翻页不重置
      serialGen(index) {
        const {pageNo, pageSize} = this.params;
        return index + 1 + (pageNo - 1) * pageSize;
      },
      timesHandle() {
        if (this.createTimes && this.createTimes.length == 2){
          this.params.createTime1 =  this.$formatAryTime(this.createTimes, 0, 'YYYY-MM-DD 00:00:00');
          this.params.createTime2 =  this.$formatAryTime(this.createTimes, 1, 'YYYY-MM-DD 23:59:59');
        }else {
          this.params.createTime1 = '';
          this.params.createTime2 = '';
        }
  
        if (this.completeTimes && this.completeTimes.length == 2){
          this.params.completeTime1 =  this.$formatAryTime(this.completeTimes, 0, 'YYYY-MM-DD 00:00:00');
          this.params.completeTime2 =  this.$formatAryTime(this.completeTimes, 1, 'YYYY-MM-DD 23:59:59');
        }else {
          this.params.completeTime1 = '';
          this.params.completeTime2 = '';
        }
      },
      query(){
        debugger
        this.params.pageNo = 1;
        this.search();
      },
      search() {
        this.timesHandle();
        this.loadingData = true;
        this.$http.get('/transport-download', {params: this.params})
          .then(res => {
            this.list = res.data.list;
            this.totalCount = res.data.count;
            this.loadingData = false;
            this.setFixedHeight();
          })
          .catch(err => {
            this.list = [];
            this.totalCount = 0;
            this.loadingData = false;
          })
      },
      handleCurrentChange(pageNo) {
        this.params.pageNo = pageNo;
        this.search()
      },
      handleSizeChange(pageSize) {
        this.params.pageSize = pageSize;
        window.localStorage.setItem('currentPageSize', pageSize);
        this.search();
      },
      resetSearchForm() {
        this.params = {
          // 任务类型
          taskType: '',
          // 状态：全部/待处理/处理中/已完成   默认：全部，即''
          taskStatus: '',
          // 创建时间与完成时间的范围筛选
          createTime1: '',
          createTime2: '',
          completeTime1: '',
          completeTime2: '',
          pageNo: 1,
          pageSize: 20,
        };
        this.createTimes = [];
        this.completeTimes = [];
        this.totalCount = 0;
        this.search();
      },
      // 下载
      download(id) {
        debugger
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true});
        this.$http.put(`/transport-download/download/${id}`)
          .then(res => {
            const {fileUrl} = res.data;
            utils.download(fileUrl);
            this.isLoading = false;
            this.$store.commit('initPrint', {isPrinting: false});
          })
          .catch(err => {
            console.error({...err});
          });
      },
      // 打印
      print(id, fileName) {
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true});
        this.$http.put(`/transport-download/download/${id}`)
          .then(res => {;
            this.isLoading = false;
            this.$store.commit('initPrint', {isPrinting: false});
            utils.printLocation(this, {'type': 'transport_task', 'path': res.data.fileUrl});
          })
          .catch(err => {
            console.error({...err});
          });
      },
      formatTaskStyle(row,column){
        if(row.taskType == 0){
          return '出车任务'
        } else {
          return '其他'
        }
      }
    },
    mounted() {
        this.search();
    }
  }
  </script>
  
  <style scoped>
  </style>
  