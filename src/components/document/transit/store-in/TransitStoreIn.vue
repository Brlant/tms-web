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
    </search-part>
    <el-row>
      <el-col :span="16">
        <div class="order-list-status " style="margin-bottom:20px;">
          <div class="status-item" v-show="key < 5"
               :class="{'active':key==activeStatus}"
               v-for="(item,key) in transferInType"
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
          <div class="status-item" v-show="key > 4"
               :class="{'active':key==activeStatus }"
               v-for="(item,key) in transferInType"
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
            中转入库单号
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
        <div class="order-list-item" v-for="(item,index) in dataList" :key="index" @click="showInfo(item)"
             :class="[formatRowClass(item.status, transferInType) ,{'active':currentItemId===item.id}]">
          <el-row>
            <el-col :span="2" class="R">
              <!--              <div @click.stop.prevent="checkItem(item)" class="el-checkbox-warp">-->
              <!--                <el-checkbox v-model="item.isChecked"></el-checkbox>-->
              <!--              </div>-->
              <div>
                {{ item.transferInOrderNo }}
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
<!--              <el-tag v-if="item.transferInStatus === '0'">待收货</el-tag>-->
<!--              <el-tag type="warning" v-else-if="item.transferInStatus === '1'">待配上架人</el-tag>-->
<!--              <el-tag type="info" v-else-if="item.transferInStatus === '2'">待上架</el-tag>-->
<!--              <el-tag type="success" v-else-if="item.transferInStatus === '4'">已完成</el-tag>-->
<!--              <el-tag type="danger" v-else-if="item.transferInStatus === '-1'">已取消</el-tag>-->
<!--              <el-tag v-else>-</el-tag>-->
              <div>{{item.transferInStatusName}}</div>
            </el-col>
            <el-col :span="2" class="opera-btn">
              <div v-show="item.transferInStatus === '0'">
                <perm label="tms-waybill-edit">
                    <span @click.stop="deliveryGoods(item)">
                      <a class="btn-circle btn-opera">
                        <i class="el-icon-truck"></i>
                      </a>收货
                    </span>
                </perm>
              </div>
              <div v-show="item.transferInStatus === '1'">
                <perm label="tms-waybill-edit">
                            <span @click.stop="assignPerson(item)">
                            <a class="btn-circle btn-opera">
                                <i class="el-icon-user"></i>
                            </a>指派上架人
                            </span>
                </perm>
              </div>
              <div v-show="item.operatorStatus !== '1' && (item.transferInStatus === '1' || item.transferInStatus === '2')">
                <perm label="tms-waybill-edit">
                            <span @click.stop="claimTask(item)">
                            <a class="btn-circle btn-opera">
                                <i class="el-icon-t-verifyPass"></i>
                            </a>认领任务
                            </span>
                </perm>
              </div>
              <div v-show="item.transferInStatus === '2'">
                <perm label="tms-waybill-edit">
                        <span @click.stop="shelves(item)">
                            <a class="btn-circle btn-opera">
                                <i class="el-icon-sell"></i>
                            </a>上架
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
      <component :is="currentPart" :formItem="form" @right-close="resetRightBox" @change="submit"/>
    </page-right>
    <page-right :show="showInfoIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentInfoPart" :formItem="form" @right-close="resetRightBox" @change="submit"/>
    </page-right>
    <page-right :show="showSignIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentSignPart" :formItem="form" @right-close="resetRightBox" @change="submit"/>
    </page-right>

    <!-- 指派上架人 -->
    <el-dialog :visible.sync="operatorFormVisible" center width="700px"
               :show-close="false"
               :before-close="assignedOnPeopleCancel">
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="assignedOnPeopleConfirm" :disabled="doing">确定</el-button>
        <el-button @click="assignedOnPeopleCancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import utils from '@/tools/utils';
import SearchPart from './search';
import {InWork, TransferInOrder} from '@/resources';
import takeForm from './form/take-form.vue';
import shelvesForm from './form/shelves-form.vue';
import detailsForm from './form/details-form.vue';
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
      //   操作人下拉框
      operators: [],

      loadingData: false,
      activeStatus: 0,
      transferInType: utils.transferInType,
      dataList: [],
      showIndex: -1,
      showInfoIndex: -1,
      showSignIndex: -1,

      currentPart: null,
      currentInfoPart: null,
      currentSignPart: null,

      dialogComponents: {
        0: takeForm
      },
      dialogInfoComponents: {
        0: shelvesForm
      },
      dialogSignComponents: {
        0: detailsForm
      },
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10,
        totalPage: 1
      },
      //   action: '',
      form: {

      },
      // 筛选条件
      filters: {
        transferInStatus: '',
        createTime1: '',
        createTime2: '',
        transferInOrderNo: '',
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
        this.getTransferInOrderPage(1);
      },
      deep: true
    }
  },
  mounted() {
    this.getTransferInOrderPage(1);
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
    // 指定上架人
    assignPerson(val) {
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
        TransferInOrder.claimTask(val.id).then(res => {
          this.$notify.success("认领成功");
          this.getTransferInOrderPage(1);
        }).catch(err => {
          this.$notify.error(err.response.data.msg || '认领失败');
        })
      }).catch(() => {
        console.log("认领任务已取消……");
      });
    },
    // 出库
    deliveryGoods(val) {
      this.showIndex = 0;
      this.currentPart = this.dialogComponents[0];
      this.$nextTick(() => {
        this.form = JSON.parse(JSON.stringify(val));
      });
    },
    // 上架
    shelves(val) {
      this.showInfoIndex = 0;
      this.currentInfoPart = this.dialogInfoComponents[0];
      this.$nextTick(() => {
        this.form = JSON.parse(JSON.stringify(val));
      });
    },
    // 详情
    showInfo(val) {
      this.showSignIndex = 0;
      this.currentSignPart = this.dialogSignComponents[0];
      this.$nextTick(() => {
        this.form = JSON.parse(JSON.stringify(val));
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
      // 全选 反选
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
    // 指派上架人取消
    assignedOnPeopleCancel() {
      this.operatorFormVisible = false;
      // 取消时除了把对话框隐藏起来，还需要清空校验，以免再次打开时，校验还在，不好看
      this.$refs.operatorForm.clearValidate();
    },
    // 指派上架人确认
    assignedOnPeopleConfirm() {
      this.$refs.operatorForm.validate((valid) => {
        if (!valid || this.doing) {
          return;
        }

        this.doing = true;
        TransferInOrder.assignedOnPeople(this.operatorForm)
          .then((res) => {
            this.$notify.success(res.data);
            this.getTransferInOrderPage(1);
           this.assignedOnPeopleCancel();
          })
          .catch(error => {
            console.log(`TransferInOrder.assignedOnPeople.catch: `,error);
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
      this.getTransferInOrderPage(1);
    },
    handleCurrentChange(val) {
      this.getTransferInOrderPage(val);
    },
    // 搜索
    searchResult(search) {
      Object.assign(this.filters, search);
    },
    changeStatus(item, key) {// 订单分类改变 (tab切换)
      this.activeStatus = key;
      this.filters.transferInStatus = item.status;
    },
    // 右弹窗关闭（x）
    resetRightBox() {
      this.showIndex = -1;
      this.showInfoIndex = -1;
      this.showSignIndex = -1;
    },
    // 页面列表
    getTransferInOrderPage(pageNo, isContinue = false) {
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
      TransferInOrder.query(param).then(res => {
        if (isContinue) {
          this.dataList = this.showTypeList.concat(res.data.list);
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
      TransferInOrder.queryStateNum(params).then(res => {
        let data = res.data;
        this.transferInType[0].num = data['all'];
        this.transferInType[1].num = data['pend-receipt'] || 0;
        this.transferInType[2].num = data['pend-assigned'] || 0;
        this.transferInType[3].num = data['pend-up'] || 0;
        this.transferInType[4].num = data['complete'] || 0;
        this.transferInType[5].num = data['canceled'] || 0;
      });
    },
    // 右侧弹窗提交刷新列表
    submit() {
      this.getTransferInOrderPage(1);
    },
  }
};
</script>
