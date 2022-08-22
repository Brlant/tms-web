<style lang="scss" scoped>
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

.order-list-status-right {
  justify-content: flex-end;
}

.order-list .order-list-header {
  background: #dfebf8;
  line-height: 15px;
  padding: 10px 5px 10px 15px;
  margin: 10px 0 5px 0;
}
</style>
<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <perm label="tms-order-add">
          <el-button plain size="small" @click="showOrderNoDialog">
            <f-a class="icon-small" name="plus"></f-a>
            新增
          </el-button>
        </perm>
      </template>
    </search-part>
    <el-row>
      <el-col :span="16">
        <div class="order-list-status " style="margin-bottom:20px;">
          <div class="status-item" v-show="item.status !== '-1'"
               :class="{'active':key==activeStatus}"
               v-for="(item,key) in transferOutType"
               :key="key"
               @click="changeStatus(item,key)">
            <div class="status-bg" :class="['b_color_'+key]"></div>
            <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{ item.title }}<span
              class="status-num">{{ item.num }}</span></div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="order-list-status  order-list-status-right" style="margin-bottom:20px">
          <div class="status-item" v-show="item.status === '-1'"
               :class="{'active':key==activeStatus }"
               v-for="(item,key) in transferOutType"
               :key="key"
               @click="changeStatus(item,key)">
            <div class="status-bg" :class="['b_color_'+7]"></div>
            <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{ item.title }}<span
              class="status-num">{{ item.num }}</span></div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="order-list" style="margin-top: 20px">
      <div class="flex-list-dom">
        <el-row class="order-list-header">
          <el-col :span="2">
            <!--            <el-checkbox @change="checkAll" v-model="isCheckAll"></el-checkbox>-->
            中转出库单号
          </el-col>
          <el-col :span="2">订单编号</el-col>
          <el-col :span="2">运单编号</el-col>
          <el-col :span="2">新建时间</el-col>
          <el-col :span="2">类型</el-col>
          <el-col :span="4">发货单位</el-col>
          <el-col :span="4">收货单位</el-col>
          <el-col :span="2">承运类型</el-col>
          <el-col :span="2">状态</el-col>
          <el-col :span="2">操作</el-col>
        </el-row>
      </div>
      <el-row v-if="loadingData">
        <el-col :span="24">
          <oms-loading :loading="loadingData"></oms-loading>
        </el-col>
      </el-row>
      <el-row v-else-if="dataList.length == 0">
        <el-col :span="24">
          <div class="empty-info">
            暂无信息
          </div>
        </el-col>
      </el-row>
      <div v-else class="order-list-body flex-list-dom">
        <div class="order-list-item" v-for="(item,index) in dataList" :key="index" @click="showDetailsForm(item)"
             :class="[formatRowClass(item.status, transferOutType) ,{'active':currentItemId===item.id}]">
          <el-row>
            <el-col :span="2" class="special-col R">
              <!--              <div @click.stop.prevent="checkItem(item)" class="el-checkbox-warp">-->
              <!--                <el-checkbox v-model="item.isChecked"></el-checkbox>-->
              <!--              </div>-->
              <div>
                {{ item.transferOutOrderNo }}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{ item.orderNo }}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{ item.waybillNo }}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{ item.createTime|time }}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div v-show="item.waybillType">
                <dict :dict-group="'bizType'" :dict-key="item.waybillType"></dict>
              </div>
              <div v-show="item.shipmentWay">
                <dict :dict-group="'transportationCondition'" :dict-key="item.shipmentWay"></dict>
              </div>
              <div v-show="item.deliveryWay">
                <dict :dict-group="'deliveryWay'" :dict-key="item.deliveryWay"></dict>
              </div>
            </el-col>
            <el-col :span="4" class="R">
              <div>
                {{ item.senderName }}
              </div>
              <div>
                {{ item.senderAddress }}
              </div>
            </el-col>
            <el-col :span="4" class="R">
              <div>
                {{ item.receiverName }}
              </div>
              <div>
                {{ item.receiverAddress }}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div :title="item.butt?'第三方承运-已对接':item.carryType?'第三方承运-未对接':'自行承运'">
                {{ item.carryType ? '第三方承运' : '自行承运' }}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>{{ item.transferOutStatusName }}</div>
            </el-col>
            <el-col :span="2" class="opera-btn">
              <div v-show="item.transferOutStatus === '0'">
                <perm label="tms-waybill-edit">
                    <span @click.stop="cancelTransferOutOrder(item)">
                      <a class="btn-circle btn-opera">
                        <i class="el-icon-t-forbidden"></i>
                      </a>取消
                    </span>
                </perm>
              </div>
              <div v-show="item.transferOutStatus === '1'">
                <perm label="tms-waybill-edit">
                            <span @click.stop="onePerson(item)">
                            <a class="btn-circle btn-opera">
                                <i class="el-icon-user"></i>
                            </a>指派操作人
                            </span>
                </perm>
              </div>
              <div
                v-show="item.operatorStatus !== '1' && (item.transferOutStatus === '1' || item.transferOutStatus === '2')">
                <perm label="tms-waybill-edit">
                            <span @click.stop="claimTask(item)">
                            <a class="btn-circle btn-opera">
                                <i class="el-icon-t-verifyPass"></i>
                            </a>认领任务
                            </span>
                </perm>
              </div>
              <div v-show="item.transferOutStatus === '2'">
                <perm label="tms-waybill-edit">
                        <span @click.stop="unshelve(item)">
                            <a class="btn-circle btn-opera">
                                <i class="el-icon-full-screen"></i>
                            </a>下架
                        </span>
                </perm>
              </div>
              <div v-show="item.transferOutStatus === '3'">
                <perm label="tms-waybill-edit">
                        <span @click.stop="outbound(item)">
                            <a class="btn-circle btn-opera">
                                <i class="el-icon-sold-out"></i>
                            </a>出库
                        </span>
                </perm>
              </div>
            </el-col>
          </el-row>
          <div class="order-list-item-bg"></div>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="dataList.length && !loadingData">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pager.currentPage"
                     :page-sizes="[10,20,50,100]" :page-size="pager.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="pager.count">
      </el-pagination>
    </div>
    <page-right :show="showIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="taskFormComp" :formItem="form" @right-close="resetRightBox" @change="rightChangeHandle"/>
    </page-right>
    <page-right :show="showIndex === 1" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="unshelveFormComp" :formItem="form" @right-close="resetRightBox" @change="rightChangeHandle"/>
    </page-right>
    <page-right :show="showIndex === 2" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="detailsFormComp" :formItem="form" @right-close="resetRightBox" @change="rightChangeHandle"/>
    </page-right>
    <page-right :show="showIndex === 3" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="addFormComp" :formItem="form" action="add" @change="rightChangeHandle"/>
    </page-right>

    <!-- 校验订单号的对话框 -->
    <el-dialog :visible.sync="increaseVisible" center width="700px" :show-close="false" :before-close="cancelNewAdd">
      <el-form ref="increaseForm" :model="increaseForm">
        <el-form-item label="订单号" label-width="100px" prop="orderNo"
                      :rules="{required:true,message:'订单号不能为空',trigger:'blur'}">
          <el-input v-model="increaseForm.orderNo" placeholder="请输入订单号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isExistOrder" :disabled="doing">下一步</el-button>
        <el-button @click="cancelNewAdd">取消</el-button>
      </div>
    </el-dialog>

    <!-- 指派操作人的对话框 -->
    <el-dialog :visible.sync="operatorFormVisible" center width="700px"
               :show-close="false"
               :before-close="assignedShelvesCancel">
      <el-form ref="operatorForm" :model="operatorForm">
        <el-form-item label="操作人" label-width="100px" prop="operatorId"
                      :rules="{required:true,message:'操作人不能为空',trigger:'change'}">
          <el-select v-model="operatorForm.operatorId" placeholder="请选择操作人"
                     remote :remote-method="queryOperator"
                     filterable>
            <el-option
              v-for="item in operators"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="assignedShelvesConfirm" :disabled="doing">确定</el-button>
        <el-button @click="assignedShelvesCancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import utils from '@/tools/utils';
import SearchPart from './search';
import {InWork, TransferOutOrder} from '@/resources';
import UnshelveForm from './form/unshelve-form.vue';
import DetailsForm from './form/details-form.vue';
import AddForm from './form/add-form.vue';
import StatusMixin from '@/mixins/statusMixin';

export default {
  components: {
    SearchPart
  },
  mixins: [StatusMixin],
  data() {
    return {
      doing: false,

      operatorFormVisible: false,
      //   操作人
      operatorForm: {
        id: '',
        // 操作人的id
        operatorId: '',
      },

      increaseVisible: false,
      increaseForm: {  //新增查询的订单号
        orderNo: ''
      },

      //   操作人下拉框
      operators: [],

      loadingData: false,
      activeStatus: 0,
      transferOutType: utils.transferOutType,
      dataList: [],
      // 0-认领任务，1-下架，2-详情，3-新增
      showIndex: -1,
      taskFormComp: null,
      unshelveFormComp: null,
      detailsFormComp: null,
      addFormComp: null,

      pager: {
        currentPage: 1,
        count: 0,
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10,
        totalPage: 1
      },
      // action: '',
      form: {},
      // 筛选条件
      filters: {
        transferOutStatus: '',
        createTime1: '',
        createTime2: '',
        transferOutOrderNo: '',
        orderNo: '',
        waybillNo: '',
        senderId: '',
        receiverId: '',
        carryType: ''
      },
      isCheckAll: false,  // 全选
      checkList: [],   // 已勾选的列表
      //   checkListPara: [],
      waybillIdList: [],
      formItem: {}, // 组件传递的数据
    };
  },
  watch: {
    // 筛选条件更改刷新列表
    filters: {
      handler() {
        this.getTransferOutOrderPage(1);
      },
      deep: true
    }
  },
  mounted() {
    this.getTransferOutOrderPage(1);
    this.queryOperator('');
  },
  methods: {
    queryOperator(keyword) { // 查询操作人员列表
      InWork.queryOperator({
        keyWord: keyword,
        pageSize: 10
      })
        .then(res => {
          this.operators = res.data.list;

          if (!this.operators.length) {
            this.activeId = '';
            this.operatorName = '';
            return;
          }

          this.activeId = this.operators[0].id;
          this.operatorName = this.operators[0].name;
        })
        .catch((err) => {
          console.error(`查询操作人，接口异常：`, err);
        });
    },
    // 指定下架人
    onePerson(val) {
      this.operatorFormVisible = true;
      this.operatorForm.id = val.id;
    },
    // 认领任务
    claimTask(val) {
      this.$confirm('是否确认认领任务?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认认领
        TransferOutOrder.claimTask(val.id).then(res => {
          this.$notify.success("认领成功");
          this.getTransferOutOrderPage(1);
        }).catch(err => {
          this.$notify.error(err.response.data.msg || '认领失败');
        })
      }).catch(() => {
        console.log("认领任务已取消……");
      });
    },
    // 出库
    outbound(item) {
      this.$confirm('是否确认出库?', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认出库
        TransferOutOrder.outbound(item.id)
          .then(res => {
            this.$notify.success("出库成功");
            this.getTransferOutOrderPage(1);
          })
          .catch(err => {
            console.log(err);
            this.$notify.error(err.response.data.msg || '出库失败');
          })
      }).catch(() => {

      });
    },
    // 取消
    cancelTransferOutOrder(item) {
      this.$confirm('是否确认取消?', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认出库
        TransferOutOrder.cancel(item.id)
          .then(res => {
            this.$notify.success("取消成功");
            this.getTransferOutOrderPage(1);
          })
          .catch(err => {
            console.log(err);
            this.$notify.error(err.response.data.msg || '出库失败');
          })
      }).catch(() => {

      });
    },
    // 下架
    unshelve(item) {
      this.showIndex = 1;
      this.unshelveFormComp = UnshelveForm;
      this.$nextTick(() => {
        this.form = JSON.parse(JSON.stringify(item));
      });
    },
    // 详情
    showDetailsForm(item) {
      this.showIndex = 2;
      this.detailsFormComp = DetailsForm;
      this.$nextTick(() => {
        this.form = JSON.parse(JSON.stringify(item));
      });
    },
    checkItem(item) {
      // 单选
      item.isChecked = !item.isChecked;
      let index = this.checkList.indexOf(item);
      let idIndex = this.waybillIdList.indexOf(item.id);
      if (item.isChecked) {
        if (index === -1) {
          this.checkList.push(item);
        }
        if (idIndex === -1) {
          this.waybillIdList.push(item.id);
        }
      } else {
        this.checkList.splice(index, 1);
        this.waybillIdList.splice(idIndex, 1);
      }
    },
    checkAll() {
      // 全选反选
      if (this.isCheckAll) {
        this.dataList.forEach(item => {
          item.isChecked = true;
          let index = this.checkList.indexOf(item);
          if (index === -1) {
            this.checkList.push(item);
          }
          let idIndex = this.waybillIdList.indexOf(item.id);
          if (idIndex === -1) {
            this.waybillIdList.push(item.id);
          }
        });
      } else {
        this.dataList.forEach(item => {
          item.isChecked = false;
        });
        this.checkList = [];
        this.waybillIdList = [];
      }
    },
    // 指派下架人取消
    assignedShelvesCancel() {
      this.operatorFormVisible = false;
      // 取消时除了把对话框隐藏起来，还需要清空校验，以免再次打开时，校验还在，不好看
      this.$refs.operatorForm.clearValidate();
    },
    // 指派下架人确认
    assignedShelvesConfirm() {
      this.$refs.operatorForm.validate((valid) => {
        if (!valid || this.doing) {
          return;
        }
        this.doing = true;
        TransferOutOrder.assignedShelves(this.operatorForm)
          .then((res) => {
            this.$notify.success(res.data);
            this.getTransferOutOrderPage(1);
            this.assignedShelvesCancel();
          })
          .catch(error => {
            console.log(`TransferOutOrder.assignedShelves.catch: `, error);
            this.$notify.error({
              duration: 2000,
              message: error.response.data.msg || '指派失败'
            });
          })
          .finally(() => {
            this.doing = false;
          });
      })

    },
    // 分页
    handleSizeChange(val) {
      this.pager.pageSize = val;
      window.localStorage.setItem('currentPageSize', val);
      this.getTransferOutOrderPage(1);
    },
    handleCurrentChange(val) {
      this.getTransferOutOrderPage(val);
    },
    // 搜索
    searchResult(search) {
      Object.assign(this.filters, search);
    },
    changeStatus(item, key) {// 订单分类改变 (tab切换)
      this.activeStatus = key;
      this.filters.transferOutStatus = item.status;
    },
    // 右弹窗关闭（x）
    resetRightBox() {
      this.showIndex = -1;
    },
    // 页面列表
    getTransferOutOrderPage(pageNo, isContinue = false) {
      this.pager.currentPage = pageNo;
      let param = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      if (this.isCheckAll) {
        this.isCheckAll = false;
      }
      this.loadingData = true;
      // 列表接口
      TransferOutOrder.query(param).then(res => {
        if (isContinue) {
          this.dataList = this.dataList.concat(res.data.list);
        } else {
          this.dataList = res.data.list;
        }

        this.pager.count = res.data.count;
        this.loadingData = false;
      });

      this.queryStateNum(param);
    },
    // 查询状态数量
    queryStateNum(params) {
      TransferOutOrder.queryStateNum(params).then(res => {
        let data = res.data;
        this.transferOutType[0].num = data['all'];
        this.transferOutType[1].num = data['pend-confirm'] || 0;
        this.transferOutType[2].num = data['pend-shelves'] || 0;
        this.transferOutType[3].num = data['pend-down'] || 0;
        this.transferOutType[4].num = data['pend-out'] || 0;
        this.transferOutType[5].num = data['complete'] || 0;
        this.transferOutType[6].num = data['canceled'] || 0;
      });
    },
    // 右侧弹窗提交刷新列表
    rightChangeHandle() {
      this.resetRightBox();
      this.getTransferOutOrderPage(1);
    },
    // 新增时显示订单号的对话框
    showOrderNoDialog() {
      this.increaseVisible = true
    },
    // 新增取消
    cancelNewAdd() {
      this.increaseVisible = false;
      // 取消时除了把对话框隐藏起来，还需要清空校验，以免再次打开时，校验还在，不好看
      this.$refs.increaseForm.clearValidate();
    },
    /**
     * 点击【下一步】触发的动作：
     * <p>
     * 检查订单是否存在，存在返回订单信息，不存在返回错误提示
     */
    isExistOrder() {
      this.$refs.increaseForm.validate((valid) => {
        if (!valid || this.doing) {
          return;
        }



        this.doing = true;
        TransferOutOrder.isExistOrder(this.increaseForm.orderNo)
          .then((res) => {
            // 隐藏订单号的对话框,清空订单号
            this.increaseVisible = false;
            this.increaseForm.orderNo = '';

            // 显示新增的表单
            this.showIndex = 3;
            this.addFormComp = AddForm;
            this.$nextTick(()=>{
              // 设置表单数据，新增中转出库单时需要从订单里面代入一些初始化的数据，这些数据在订单校验成功后返回，即res.data
              this.form = res.data;
            })
          })
          .catch(error => {
            this.$notify.error(error.response.data.msg || "校验订单接口异常");
          })
          .finally(() => {
            this.doing = false;
          });
      })
    },
  }
}
</script>
