<style lang="scss" scoped>
$labelWidth: 180px;
.content-part {
  .content-left {
    width: $labelWidth;
  }

  .content-right {
    > h3 {
      left: $labelWidth;
    }

    left: $labelWidth;
  }
}

.part-hj-box {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 0;
}
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">运输详情</template>
    <template slot="btn">
      <el-button plain @click="save" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :model="form" class="clearfix" label-width="120px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
              {{ pageSets[0].name }}</h3>
          </div>
          <div class="content">
            <oms-col label="车牌号" :rowSpan="span" :value="form.plateNumber"/>
            <oms-col label="车辆归属公司" :rowSpan="span" :value="form.ascriptionCompanyName"/>
            <div class=" clearfix"></div>
            <oms-col label="车辆当前司机" :rowSpan="span" :value="form.currentDriverName"/>
            <oms-col label="车型" :rowSpan="span" :value="form.type">
              <dict :dict-group="'carType'" :dict-key="form.type"></dict>
            </oms-col>
            <oms-col label="车辆承重kg" :rowSpan="span" :value="form.loadBearing">
            </oms-col>
            <oms-col label="车辆长度m" :rowSpan="span" :value="form.carriageLength">
            </oms-col>
            <oms-col label="车辆宽度m" :rowSpan="span" :value="form.carriageWidth">
            </oms-col>
            <oms-col label="车辆高度m" :rowSpan="span" :value="form.carriageHeight"/>

            <oms-col label="状态" :rowSpan="span" :value="true">
              <el-select v-model="form.carState" placeholder="请选择车辆状态" :clearable="true">
                <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in carStates"></el-option>
              </el-select>
            </oms-col>
            <div class="hr mb-15 clearfix"></div>
          </div>
        </div>

        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">
              {{ pageSets[1].name }}</h3>
          </div>
          <div class="content">
            <el-table :data="transRecords" style="width: 100%">
              <!--              <el-table-column type="index" label="序号" width="50"/>-->
              <!--        <el-table-column-->
              <!--          type="selection"-->
              <!--          width="55">-->
              <!--        </el-table-column>-->
              <el-table-column label="变更前状态">
                <template v-slot="{row}">
                  {{ statusList[row.previousStatus].title }}
                </template>
              </el-table-column>
              <el-table-column label="变更后状态">
                <template v-slot="{row}">
                  {{ statusList[row.afterStatus].title }}
                </template>
              </el-table-column>
              <el-table-column prop="createBy" label="更新人"/>
              <el-table-column label="更新时间">
                <template v-slot="{row,$index}">
                  {{ row.createTime|time }}
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 分页 -->
          <div class="text-center" v-show="transRecords.length">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="page.pageNo"
                           :page-sizes="[10,20,50,100]"
                           :page-size="page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="page.count">
            </el-pagination>
          </div>

        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>

import {VehicleArchives} from '@/resources';

export default {
  props: {
    carState: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      span: 8,
      pageSets: [
        {name: '车辆基础信息', key: 0},
        {name: '运输记录详情', key: 1},
      ],
      carStates: [
        {label: '运输', value: 1},
        {label: '空闲', value: 2},
        {label: '维修', value: 3},
        {label: '停用', value: 4},
        {label: '报废', value: 5},
      ],
      // 车辆状态 1，运输、2：空闲、 3：维修 4：停用  5：报废
      statusList: [
        {title: '全部', num: 0, status: ''},
        {title: '运输', num: 0, status: 1},
        {title: '空闲', num: 0, status: 2},
        {title: '维修', num: 0, status: 3},
        {title: '停用', num: 0, status: 4},
        {title: '报废', num: 0, status: 5},
      ],
      currentTab: {},
      form: {
        plateNumber:'',
        ascriptionCompanyName:'',
        currentDriverName:'',
        id:'',
        carState:'',
        loadBearing:'',
        carriageLength:'',
        carriageWidth:'',
        carriageHeight:'',
      },
      transRecords:[],
      doing: false,
      // 分页信息单独存放
      page: {
        pageNo: 1,
        pageSize: 10,
        count: 0,
      },
    };
  },
  watch: {
    carState(val) {
      if (val.id) {
        this.form = val;
        this.getDetails(val.id);
      }
    }
  },
  methods: {
    // 详情的运输记录
    getDetails(carId) {
      const {pageNo, pageSize} = this.page;
      VehicleArchives.details({carId, pageNo, pageSize}).then(res => {
        this.transRecords = res.data.list;
        this.page.count = res.data.count;
      })
    },
    // 分页处理
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getList(this.page.pageNo);
    },
    handleCurrentChange(val) {
      this.getList(val);
    },
    // 切换
    selectTab(item) {
      this.currentTab = item;
    },
    save(){
      if (this.doing) {
        return;
      }

      this.doing = true;
      const {id,carState} = this.form;
      VehicleArchives.saveTransRecord(id,carState)
      .then(res=>{
        this.$notify.success("保存成功");

        this.doing = false;
        this.$emit('change');
      })
      .catch(err=>{
        this.doing = false;
      })
    }
  }
}
</script>
