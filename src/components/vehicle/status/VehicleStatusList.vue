<style scoped>
.search-form {
  background-color: #eeeeee;
  padding: 20px 10px 0;
  margin: 10px 0;
}

.order-list-status-right {
  justify-content: flex-end;
}

</style>

<template>
  <div>
    <!-- 搜索条件 -->
    <div class="search-form">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="searchParams">
            <el-form-item label="最后更新时间">
              <el-date-picker v-model="lastUpdateTime" type="datetimerange"
                              placeholder="请选择最后更新时间" clearable>
              </el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="车辆归属公司">
              <el-select filterable remote placeholder="请输入名称/拼音首字母缩写/系统代码搜索归属公司" :remote-method="filterCustomer"
                         :clearable="true"
                         v-model="searchParams.ascriptionCompany" popperClass="good-selects" style="width: 100%">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in customerList">
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
            </el-form-item> -->
            <el-form-item label="车牌号码">
              <el-input v-model="searchParams.plateNumber" placeholder="请输入车牌号码" clearable></el-input>
            </el-form-item>
            <el-form-item label="车辆当前司机">
              <el-select filterable remote placeholder="请输入名称/拼音首字母缩写搜索司机" :remote-method="filterUser"
                         :clearable="true"
                         v-model="searchParams.currentDriver" popperClass="good-selects">
                <el-option :value="user.id" :key="user.id" :label="user.name" v-for="user in userList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{ user.name }}</span>
                    <span class="pull-right">
                        {{ user.companyDepartmentName }}
                      </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="pull-right">
              <el-button type="primary" @click="query" :disabled="doing">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
              <el-button @click="exportExcel">导出</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <!-- 状态以及状态数量的展示，支持状态切换 -->
    <el-row>
      <el-col :span="16">
        <div class="order-list-status container">
          <div :class="{'active':item.status===activeStatus} " class="status-item"
               v-for="(item,index) in statusList" @click="changeStatus(item)"
               :key="index" v-if="index < 4">
            <div class="status-bg" :class="['b_color_'+index]"></div>
            <div>
              <i class="el-icon-caret-right" v-if="item.status===activeStatus"></i>{{ item.title }}
              <span class="status-num">{{ item.num }}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="order-list-status  order-list-status-right">
          <div :class="{'active':item.status===activeStatus} " class="status-item"
               v-for="(item,index) in statusList" @click="changeStatus(item)"
               :key="index" v-if="index > 3">
            <div class="status-bg" :class="['b_color_'+index]"></div>
            <div>
              <i class="el-icon-caret-right" v-if="item.status===activeStatus"></i>{{ item.title }}
              <span class="status-num">{{ item.num }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div style="margin: 30px 0;">
      <el-table :data="list" style="width: 100%">
        <el-table-column type="index" label="" width="50"/>
        <!--        <el-table-column-->
        <!--          type="selection"-->
        <!--          width="55">-->
        <!--        </el-table-column>-->
        <el-table-column prop="plateNumber" label="车牌号"/>
        <el-table-column prop="ascriptionCompanyName" label="车辆归属公司"/>
        <el-table-column prop="currentDriverName" label="司机"/>
        <el-table-column prop="type" label="车型">
          <template v-slot="{row,$index}">
            <dict :dict-group="'carType'" :dict-key="row.type"></dict>
          </template>

        </el-table-column>
        <el-table-column prop="loadBearing" label="车辆承重kg"/>
        <el-table-column prop="carriageLength" label="车辆长度m"/>
        <el-table-column prop="carriageWidth" label="车辆宽度m"/>
        <el-table-column prop="carriageHeight" label="车辆高度m"/>
        <el-table-column label="最后更新时间" width="160">
          <template v-slot="{row,$index}">
            {{ row.lastUpdateTime|time }}
          </template>
        </el-table-column>
        <el-table-column prop="lastUpdateBy" label="最后更新人"/>
        <el-table-column label="状态">
          <template v-slot="{row}">
            {{ statusList[row.carState].title }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row,$index}">
            <el-button type="text"
              @click="viewTransDetails(row)">
              <i class="el-icon-t-detail">运输记录详情</i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="text-center" v-show="list.length">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="page.pageNo"
                     :page-sizes="[10,20,50,100]"
                     :page-size="page.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="page.count">
      </el-pagination>
    </div>

    <page-right :show="showRight" @right-close="rightClose" :css="{'width':'1200px','padding':0}">
      <vehicle-archives-details :carState="carState" @change="rightChange">
      </vehicle-archives-details>
    </page-right>
  </div>
</template>

<script>
import VehicleArchivesDetails from '@/components/vehicle/status/VehicleStatusDetails';
import {BaseInfo, User, VehicleArchives} from '@/resources';
import utils from '@/tools/utils'

export default {
  name: "VehicleArchivesList",
  components: {VehicleArchivesDetails},
  data() {
    return {
      // 默认展示启用的数据
      activeStatus: '',
      carState: {},
      // 分页信息单独存放
      page: {
        pageNo: 1,
        pageSize: 10,
        count: 0,
      },
      lastUpdateTime: [],//最后更新时间
      // 搜索表单绑定的值
      searchParams: {
        startDate: '',//最后更新时间的开始时间
        endDate: '',//最后更新时间的结束时间
        ascriptionCompany: '',//车辆归属公司
        plateNumber: '',//车牌号
        currentDriver: '',//车辆当前司机
      },
      doing: false,//控制搜索请求
      // 车辆状态 1，运输、2：空闲、 3：维修 4：停用  5：报废 6：异常  7：即将超期
      statusList: [
        {title: '全部', num: 0, status: ''},
        {title: '运输', num: 0, status: 1},
        {title: '空闲', num: 0, status: 2},
        {title: '维修', num: 0, status: 3},
        {title: '即将超期', num: 0, status: 7},
        {title: '异常', num: 0, status: 6},
        {title: '停用', num: 0, status: 4},
        {title: '报废', num: 0, status: 5},
      ],
      showRight: false,
      list: [],
      customerList: [],
      userList: [],
    }
  },
  computed: {
    listParams() {
      const {pageNo, pageSize} = this.page;
      const carState = this.activeStatus || '';
      if (this.lastUpdateTime.length === 2) {
        this.searchParams.startDate = utils.formatTime(this.lastUpdateTime[0]);
        this.searchParams.endDate = utils.formatTime(this.lastUpdateTime[1]);
      }

      return {
        ...this.searchParams,
        pageNo, pageSize, carState
      };
    }
  },
  methods: {
    // 查询需要重置分页，从第一页开始查，所以不能直接调用getCarrierList，这里我们和保存的操作是一样的
    query() {
      this.getList(1);
    },
    resetForm() {
      // 清空查询表单
      this.searchParams = {
        startDate: '',//最后更新时间的开始时间
        endDate: '',//最后更新时间的结束时间
        ascriptionCompany: '',//车辆归属公司
        plateNumber: '',//车牌号
        currentDriver: '',//车辆当前司机
      };

      // 清空最后更新时间
      this.lastUpdateTime = [];
      this.query();
    },
    // 查看运输详情
    viewTransDetails(row) {
      this.showRight = true;
      this.carState = row;
    },
    // 新增或编辑保存后的处理
    exportExcel() {
      this.$store.commit('initPrint', {
        isPrinting: true,
        text: '正在导出中……'
      });

      VehicleArchives.exportExcel({...this.searchParams, carState: this.activeStatus})
        .then(res => {
          utils.download(res.data.path, '车辆状态');
          this.$store.commit('initPrint', {
            isPrinting: false,
            text: '导出成功'
          });
        })
        .catch((error) => {
          const msg = error.response.data.msg;
          this.$store.commit('initPrint', {
            isPrinting: false,
            text: msg || '导出失败'
          });
        });
    },
    // 切换状态需要根据状态刷新数据
    changeStatus(item) {
      this.activeStatus = item.status;
      this.getList(1);
    },
    getList(pageNo = 1) {
      if (this.doing) {
        return;
      }

      this.page.pageNo = pageNo
      this.doing = true;
      VehicleArchives.query(this.listParams)
        .then(res => {
          const {list, count, totalPage} = res.data;
          this.list = list.map(item => item.carDto);
          this.page.count = count;
          this.updateCount(count);
          this.getCount();
        })
        .catch((error) => {
          this.$notify.error("接口异常");
          // 接口异常时打印错误信息，方便排查问题
          console.error('/carrier/findCarrierByPage：', {...error});
        })
        .finally(() => {
          this.doing = false;
        });
    },
    rightClose() {
      // 右侧关闭时，不显示
      this.showRight = false;
      this.carState = {};

    },
    rightChange() {
      this.getList(1);
      this.rightClose();
    },
    // 分页处理
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getList(1);
    },
    handleCurrentChange(val) {
      this.getList(val);
    },
    getCount() {
      VehicleArchives.count(this.searchParams)
        .then(res => {
          const {
            transporting,
            free,
            maintain,
            abnormal,
            overdue,
            disable,
            useless
          } = res.data;

          this.statusList[0].num = transporting + free + maintain + disable + useless + overdue + abnormal;
          this.statusList[1].num = transporting;
          this.statusList[2].num = free;
          this.statusList[3].num = maintain;
          this.statusList[4].num = overdue;
          this.statusList[5].num = abnormal;
          this.statusList[6].num = disable;
          this.statusList[7].num = useless;
        })
        .catch(err => {
          console.log(err)
        })
    },
    updateCount(count) {
      const index = this.statusList.findIndex(item => item.status == this.activeStatus);
      this.statusList[index].num = count;
    },
    filterCustomer: function (query) {// 过滤客户
      BaseInfo.query({keyWord: query}).then(res => {
        this.customerList = res.data.list;
      });
    },
    filterUser: function (query) {
      let data = Object.assign({}, {
        objectId: 'oms-system',
        keyWord: query,
        status: 1
      });
      User.query(data).then(res => {
        this.userList = res.data.list;
      });
    },
  },
  mounted() {
    this.getList(1);
  }
}
</script>
