<!-- 承运商列表：用于查询并显示承运商信息，列表支持分页与检索，可添加、编辑承运商 -->
<template>
  <div>
    <!-- 搜索条件 -->
    <div class="search-form">
      <el-form :inline="true" :model="searchParams">
        <el-form-item label="承运商名称">
          <el-input v-model="searchParams.carrierName" placeholder="请输入承运商名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="承运条件">
          <el-select v-model="searchParams.transportationConditions" placeholder="请选择承运条件" clearable>
            <el-option v-for="item in transCondOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="query">查询
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
        <el-form-item class="pull-right">
          <!-- 需求给的是不带边框的按钮，这里用文字链接比较符合要求 -->
          <el-link icon="el-icon-circle-plus-outline" :underline="false" @click="add">添加</el-link>
        </el-form-item>
      </el-form>
    </div>

    <!-- 状态以及状态数量的展示，支持状态切换 -->
    <div class="order-list-status container">
      <div :class="{'active':item.status===activeStatus} " class="status-item"
           v-for="(item) in statusList" @click="changeStatus(item)"
           :key="item.status">
        <div class="status-bg" :class="['b_color_'+item.status]"></div>
        <div><i class="el-icon-caret-right" v-if="item.status===activeStatus"></i>{{ item.title }}<span
          class="status-num">{{ item.num }}</span></div>
      </div>
    </div>

    <div style="margin: 30px 0;">
      <el-table :data="list" border>
        <!--              <el-table-column type="index" label="序号" width="50"/>-->
        <!--        <el-table-column-->
        <!--          type="selection"-->
        <!--          width="55">-->
        <!--        </el-table-column>-->
        <el-table-column prop="carrierCode" label="承运商编码"/>
        <el-table-column prop="carrierName" label="承运商名称"/>
        <el-table-column prop="carrierContact" label="联系人"/>
        <el-table-column prop="carrierTelephone" label="联系电话"/>
        <el-table-column prop="carrierAddress" label="详细地址"/>
        <el-table-column label="承运条件">
          <template v-slot="{row,$index}">
            {{ transName(row.transportationConditions) }}
          </template>
        </el-table-column>
        <el-table-column label="最后更新时间">
          <template v-slot="{row,$index}">
            {{ row.modifyTime|time }}
          </template>
        </el-table-column>
        <el-table-column prop="modifyBy" label="更新人"/>
        <el-table-column label="状态">
          <template v-slot="{row}">
            <el-tag v-if="row.status == 0">
              待审核
            </el-tag>
            <el-tag type="danger" v-else-if="row.status == 1">
              禁用
            </el-tag>
            <el-tag type="success" v-else-if="row.status == 2">
              启用
            </el-tag>
            <el-tag type="warning" v-else>
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row,$index}">
            <el-link v-if="row.status == 2"
                     :underline="false"
                     @click="updateStatus(row,$index)">
              <i class="el-icon-t-forbidden"> 停用</i>
            </el-link>

            <el-link v-else-if="row.status == 1"
                     :underline="false"
                     @click="updateStatus(row,$index)">
              <i class="el-icon-success"> 启用</i>
            </el-link>
            <el-link v-else-if="row.status == 0"
                     :underline="false"
                     @click="updateStatus(row,$index)">
              <i class="el-icon-t-shenhe"> 审核</i>
            </el-link>
            <el-link class="ml-15"
                     :underline="false"
                     @click="edit(row,$index)">
              <i class="el-icon-edit-outline"> 编辑</i>
            </el-link>
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

    <page-right :show="showRight" @right-close="rightClose">
      <!-- 新增/编辑页面 -->
      <carrier-form :form="carrierForm.formData"
                    :title="carrierForm.title"
                    :action="carrierForm.action"
                    @close="rightClose"
                    @save="saveHandle">
      </carrier-form>
    </page-right>
  </div>
</template>

<script>
import CarrierForm from '@/components/base-info/carrier/CarrierForm';
import {Carrier} from '@/resources';

export default {
  name: "CarrierList",
  components: {CarrierForm},
  data() {
    return {
      // 默认展示启用的数据
      activeStatus: 2,
      // 分页信息单独存放
      page: {
        pageNo: 1,
        pageSize: 10,
        count: 0,
      },
      // 搜索表单绑定的值
      searchParams: {
        carrierName: '', // 承运商名称（模糊查询）
        transportationConditions: '', // 承运条件 A 全部 B 冷链运输 C 常温运输
      },
      doing: false,//控制搜索请求
      // 承运条件的下拉选择的数据
      transCondOptions: [
        {value: 'A', label: '全部'},
        {value: 'B', label: '冷链运输'},
        {value: 'C', label: '常温运输'},
      ],
      // 承运商状态集合
      statusList: [
        {title: '启用', num: 0, status: 2},
        {title: '待审核', num: 0, status: 0},
        {title: '禁用', num: 0, status: 1},
      ],
      // 承运商新增或编辑时的表单相关的属性
      carrierForm: {
        action: '',//记录新增、编辑等操作，空表示没有进行任何操作
        title: '',//记录新增、编辑等操作，空表示没有进行任何操作
        formData: {},//表单数据，只有编辑的时候有
      },
      showRight: false,//控制右侧的表单是否显示
      list: [],//承运商列表的数据
      editIndex: -1
    }
  },
  computed: {
    listParams() {
      const {pageNo, pageSize} = this.page;
      const status = this.activeStatus;
      return {
        ...this.searchParams,
        pageNo, pageSize, status
      };
    }
  },
  methods: {
    // 查询需要重置分页，从第一页开始查，所以不能直接调用getCarrierList，这里我们和保存的操作是一样的
    query() {
      this.getCarrierList(1);
      this.getCount();
    },
    resetForm() {
      this.searchParams = {
        carrierName: '', // 承运商名称（模糊查询）
        transportationConditions: '', // 承运条件 A 全部 B 冷链运输 C 常温运输
      };

      this.query();
    },
    add() {
      // 新增的话，重置carrierForm属性
      this.showRight = true;
      this.carrierForm = {
        action: 'add',
        title: '新增承运商',
        formData: {},
      };
    },
    edit(row, index) {
      this.editIndex = index;
      // 新增的话，重置carrierForm属性
      this.showRight = true;
      this.carrierForm = {
        action: 'edit',
        title: '编辑承运商',
        formData: row,
      };
    },
    updateStatus(row, index) {
      let msg = '', confirmButtonText = '确认', cancelButtonText = '取消', status = -1;
      if (row.status == 0) {
        msg = '请选择审核结果';
        confirmButtonText = '通过';
        cancelButtonText = '不通过';
        status = 2;
      } else if (row.status == 1) {
        status = 0;
        msg = '是否确认启用';
      } else {
        status = 1;
        msg = '是否确认禁用';
      }

      this.$confirm(msg, '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText, cancelButtonText,
        type: 'warning'
      })
        .then(() => {
          Carrier.editSave({carrierId: row.carrierId, status})
            .then(res => {
              this.$notify.success(res.msg || '操作成功');
              // 更新后刷新状态
              // this.activeStatus = status;
              this.getCarrierList(1);
              this.getCount();
            })
            .catch((error) => {
              const msg = error.response.data.msg;
              this.$notify.error(msg || '操作失败');
            });
        })
        .catch(action => {
          if (action === 'cancel' && status == 2) {
            // 审核不通过需要改成禁用状态
            status = 1;
            // 审核不通过，状态需要改成禁用
            Carrier.editSave({carrierId: row.carrierId, status})
              .then(res => {
                this.$notify.success(res.msg || '审核成功');
                // 更新后刷新状态
                // this.activeStatus = status;
                this.getCarrierList(1);
                this.getCount();
              })
              .catch((error) => {
                const msg = error.response.data.msg;
                this.$notify.error(msg || '审核失败');
              });
          }
        });
    },
    // 新增或编辑保存后的处理
    saveHandle() {
      this.showRight = false;
      // 保存后查询的表单重置
      this.resetForm();
      this.getCarrierList(1);
    },
    // 切换状态需要根据状态刷新数据
    changeStatus(item) {
      this.activeStatus = item.status;
      this.getCarrierList(1);
    },
    getCarrierList(pageNo = 1) {
      if (this.doing) {
        return;
      }

      this.page.pageNo = pageNo
      this.doing = true;
      Carrier.query(this.listParams).then(res => {
        const {list, count, totalPage} = res.data;
        this.list = list;
        this.page.count = count;
        this.updateCount(count)

      }).catch((error) => {
        // 接口异常时打印错误信息，方便排查问题
        // console.error('/carrier/findCarrierByPage：', {...error});

        // 接口异常需要重置数据
        this.page.count = 0;
        this.list = [];
      }).finally(() => {
        this.doing = false;
      });
    },
    rightClose() {
      // 右侧关闭时，不显示
      this.showRight = false;
      this.carrierForm.formData = {};
    },
    // 分页处理
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getCarrierList(this.page.pageNo);
    },
    handleCurrentChange(val) {
      this.getCarrierList(val);
    },
    getCount() {
      Carrier.count(this.searchParams)
        .then(res => {
          this.statusList[0].num = res.data['carrier-on']
          this.statusList[2].num = res.data['carrier-off']
          this.statusList[1].num = res.data['carrier-approve']
        })
        .catch(err => {
          // console.log(err)
        })
    },
    updateCount(count) {
      const index = this.statusList.findIndex(item => item.status == this.activeStatus);
      this.statusList[index].num = count;
    },
    transName(val) {
      for (const item of this.transCondOptions) {
        if (item.value == val) {
          return item.label
        }
      }

      return val
    }
  },
  mounted() {
    this.getCarrierList(1);
    this.getCount();
  }
}
</script>

<style scoped>
.search-form {
  background-color: #eeeeee;
  height: 40px;
  line-height: 40px;
  padding: 5px 20px;
  margin: 10px 0;
}

</style>
