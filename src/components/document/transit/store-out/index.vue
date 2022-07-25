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
                <el-button plain size="small" @click="addNo">
                    <f-a class="icon-small" name="plus"></f-a>
                    新增
                </el-button>
            </perm>
        </template>
    </search-part>
    <el-row>
      <el-col :span="16">
        <div class="order-list-status " style="margin-bottom:20px">
          <div class="status-item" v-show="key < 5"
               :class="{'active':key==activeStatus}"
               v-for="(item,key) in orderType"
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
               v-for="(item,key) in orderType"
               :key="key"
               @click="changeStatus(item,key)">
            <div class="status-bg" :class="['b_color_'+key]"></div>
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
            <el-checkbox @change="checkAll" v-model="isCheckAll"></el-checkbox>
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
        <div class="order-list-item" v-for="(item,index) in dataList" :key="index" @click="showInfo(item)"
             :class="[formatRowClass(item.status, orderType) ,{'active':currentItemId===item.id}]">
          <el-row>
            <el-col :span="2" class="special-col R">
              <div @click.stop.prevent="checkItem(item)" class="el-checkbox-warp">
                <el-checkbox v-model="item.isChecked"></el-checkbox>
              </div>
              <div>
                {{ item.waybillNumber }}
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
            <el-col :span="2" class="R">
              <div>
                {{ item.senderName }}
              </div>
              <div>
                {{ item.senderAddress }}
              </div>
            </el-col>
            <el-col :span="2" class="R">
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
            <!--<el-col :span="5" class="R">-->
            <!--<div>-->
            <!--{{item.receiverAddress}}-->
            <!--</div>-->
            <!--</el-col>-->
            <el-col :span="4" class="R">
              <div>
                {{ item.wholeBoxCount }}
              </div>
            </el-col>
            <el-col :span="4" class="R">
              <div>
                {{ item.bulkBoxCount }}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{ item.incubatorCount }}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{ item.preIncubatorCount }}
              </div>
            </el-col>
            <el-col :span="2" class="opera-btn">
                <div>
                    <perm label="tms-waybill-edit">
                    <span @click.stop="abolish(item)">
                      <a class="btn-circle btn-opera">
                        <i class="el-icon-t-forbidden"></i>
                      </a>取消
                    </span>
                  </perm>
                </div>
                <!-- <div>
                    <perm label="tms-waybill-edit">
                    <span @click.stop="deliveryGoods(item)">
                      <a class="btn-circle btn-opera">
                        <i class="el-icon-truck"></i>
                      </a>收货
                    </span>
                  </perm>
                </div> -->
                <div>
                    <div>
                       <perm label="tms-waybill-edit">
                            <span @click.stop="onePerson(item)" >
                            <a class="btn-circle btn-opera">
                                <i class="el-icon-user"></i>
                            </a>指派操作人
                            </span>
                        </perm>
                    </div>
                    <div>
                        <perm label="tms-waybill-edit">
                            <span @click.stop="claimTask(item)">
                            <a  class="btn-circle btn-opera">
                                <i class="el-icon-t-verifyPass"></i>
                            </a>认领任务
                            </span>
                        </perm>
                    </div>
                </div>
                <div>
                    <perm label="tms-waybill-edit">
                        <span @click.stop="outShelves(item)">
                            <a  class="btn-circle btn-opera">
                                <i class="el-icon-full-screen"></i>
                            </a>下架
                        </span>
                    </perm>
                </div>
                <div>
                    <perm label="tms-waybill-edit">
                        <span @click.stop="outbound(item)">
                            <a  class="btn-circle btn-opera">
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
      <component :is="currentPart" :formItem="form"  @right-close="resetRightBox" @change="submit"/>
    </page-right>
    <page-right :show="showInfoIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentInfoPart" :formItem="form"  @right-close="resetRightBox" @change="submit"/>
    </page-right>
    <!-- 详情 -->
    <!-- <page-right :show="showSignIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentSignPart" :formItem="form"  @right-close="resetRightBox" @change="submit"/>
    </page-right> -->
    <page-right :show="showDeliverIndex === 0" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <component :is="currentDeliverPart" :formItem="form"  @right-close="resetRightBox" @change="submit"/>
    </page-right>

    <!-- 新增订单号查询 -->
    <el-dialog :visible.sync="increaseVisible" center width="700px" :show-close="false" :before-close="cancel">
      <el-form ref="increaseForm" :model="increaseForm">
        <el-form-item label="订单号" label-width="100px" prop="id"
                      :rules="{required:true,message:'订单号不能为空',trigger:'blur'}">
                      <el-input v-model="increaseForm.id" placeholder="请输入订单号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nextStep" :disabled="doing">下一步</el-button>
        <el-button @click="noIncrease">取消</el-button>
      </div>
    </el-dialog>
    <!-- 操作人 -->
    <el-dialog :visible.sync="dialogFormVisible" center width="700px" :show-close="false" :before-close="cancel">
      <el-form ref="dialogForm" :model="dialogForm">
        <el-form-item label="操作人" label-width="100px" prop="thirdNo"
                      :rules="{required:true,message:'操作人不能为空',trigger:'change'}">
                    <el-select v-model="dialogForm.thirdNo" placeholder="请选择操作人">
                        <el-option
                        v-for="item in operateList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shipmentThirdWayBill" :disabled="doing">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import utils from '@/tools/utils';
import SearchPart from './search';
import {http, TmsWayBill} from '@/resources';
import takeForm from './form/take-form.vue';
import outShelvesForm from './form/outShelves-form.vue';
import detailsForm from './form/details-form.vue';
import addForm from './form/add-form.vue';
import StatusMixin from '@/mixins/statusMixin';

export default {
  components: {
    SearchPart,
  },
  mixins: [StatusMixin],
  data() {
    return {
      doing: false,
      dialogFormVisible: false,
      increaseVisible:false,
      increaseForm: {  //新增查询的订单号
        id: '',
      },
      dialogForm: { // 操作人
        id: '',
        // 第三方承运单号
        thirdNo: '',
      },
      // 操作人下拉列表
      operateList:[
        {label:'A',value:'A'},
        {label:'B',value:'B'}
      ],

      loadingData: false,
      activeStatus: 0,
      orderType: utils.transferOutType,
      dataList: [],
      showIndex: -1,
      showInfoIndex: -1,
      showSignIndex: -1,
      showDeliverIndex: -1,

      currentPart: null,
      currentInfoPart: null,
      // currentSignPart: null,
      currentDeliverPart: null,
      dialogComponents: {
        0: takeForm
      },
      dialogInfoComponents: {
        0: outShelvesForm
      },
      // dialogSignComponents: {
      //   0: detailsForm
      // },
      dialogDeliverComponents: {
        0: addForm
      },
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10,
        totalPage: 1
      },
      // action: '',
      form: {},
      filters: {
        status: null,
        waybillNumber: '',
        tmsOrderNumber: '',
        orderNo: '',
        waybillType: '',
        shipmentWay: '',
        deliveryWay: '',
        serviceType: '',
        senderId: '',
        receiverId: '',
        startTime: '',
        endTime: '',
        packFlag: '',
        destinationAreaCode: '',
        goodsTotalName: '',
        carryType: '',
      },
      isCheckAll: false,
      checkList: [],
      waybillIdList: [], // 勾选数组
      // condition: {},
      formItem: {},  // 子组件传递数据
    };
  },
  // computed: {
  //   bodyHeight() {
  //     let height = parseInt(this.$store.state.bodyHeight, 10);
  //     return (height + 136) + 'px';
  //   },
  //   totalCount() {
  //     let total = {
  //       whole: 0,
  //       buck: 0,
  //       incubatorCount: 0,
  //       preIncubatorCount: 0
  //     };
  //     this.dataList.forEach(i => {
  //       total.whole += i.wholeBoxCount;
  //       total.buck += i.bulkBoxCount;
  //       total.incubatorCount += i.incubatorCount;
  //       total.preIncubatorCount += i.preIncubatorCount;
  //     });
  //     return total;
  //   }
  // },
  watch: {
    filters: {
      handler() {
        this.getTmsWayBillPage(1);
      },
      deep: true
    }
  },
  mounted() {
    console.log('中转出库')
    this.getTmsWayBillPage(1);
  },
  methods: {
    // 新增
    addNo(){
        this.increaseVisible = true
    },
    // 新增取消
    noIncrease() {
      this.increaseVisible = false;
      // 取消时除了把对话框隐藏起来，还需要清空校验，以免再次打开时，校验还在，不好看
      this.$refs.increaseForm.clearValidate();
    },
    // 新增确定
    nextStep(){
        this.increaseVisible = false
        this.showDeliverIndex = 0;
        this.currentDeliverPart = this.dialogDeliverComponents[0];

    //     this.$refs.increaseForm.validate((valid) => {
    //     if (!valid || this.doing) {
    //       return;
    //     }
    //     this.doing = true;
    //     TmsWayBill.shipmentThirdWayBill(this.increaseForm)
    //       .then(() => {
    //         // this.$notify.success('启运成功');
    //         // this.getTmsWayBillPage(1);
    //         // 打开新增详情

    //       })
    //       .catch(error => {
    //         this.$notify.error({
    //           duration: 2000,
    //           message: error.response.data.msg
    //         });
    //       })
    //       .finally(() => {
    //         this.doing = false;
    //       });
    //   })
    },
    // 取消
    abolish(val){
        this.$confirm('是否确认取消?', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            // 确认取消

        }).catch(() => {

        });
    },
    // 指定上架人
    onePerson(val){
        this.dialogFormVisible = true
        // id
    },
    // 认领任务
    claimTask(val){
        this.$confirm('是否确认认领任务?', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            // 确认认领

        }).catch(() => {

        });
    },
    // 出库
    outbound(val){
        this.showIndex = 0;
        this.currentPart = this.dialogComponents[0];
        this.$nextTick(() => {
            this.form = JSON.parse(JSON.stringify(val));
        });
    },
    // 下架
    outShelves(val){
        this.showInfoIndex = 0;
        this.currentInfoPart = this.dialogInfoComponents[0];
        this.$nextTick(() => {
            this.form = JSON.parse(JSON.stringify(val));
        });
    },
    // 详情
    // showInfo(val){
    //     this.showSignIndex = 0;
    //     this.currentSignPart = this.dialogSignComponents[0];
    //     this.$nextTick(() => {
    //         this.form = JSON.parse(JSON.stringify(val));
    //     });
    // },
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
    // 收货取消
    cancel() {
      this.dialogFormVisible = false;
      // 取消时除了把对话框隐藏起来，还需要清空校验，以免再次打开时，校验还在，不好看
      this.$refs.dialogForm.clearValidate();
    },
    // 收货确认
    shipmentThirdWayBill() {
      this.$refs.dialogForm.validate((valid) => {
        if (!valid || this.doing) {
          return;
        }
        this.doing = true;
        TmsWayBill.shipmentThirdWayBill(this.dialogForm)
          .then(() => {
            this.$notify.success('启运成功');
            this.getTmsWayBillPage(1);
          })
          .catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response.data.msg || '启运失败'
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
      this.getTmsWayBillPage(1);
    },
    handleCurrentChange(val) {
      this.getTmsWayBillPage(val);
    },
    // 搜索
    searchResult(search) {
      Object.assign(this.filters, search);
    },
    changeStatus(item, key) {// 订单分类改变 (tab切换)
      this.activeStatus = key;
      this.filters.status = item.status;
    },
    // 右弹窗关闭（x）
    resetRightBox() {
      this.showIndex = -1;
      this.showInfoIndex = -1;
      // this.shoWayBillPart = false;
      this.showSignIndex = -1;
      this.showDeliverIndex = -1;
    },
    // 列表
    getTmsWayBillPage(pageNo, isContinue = false) {
      this.pager.currentPage = pageNo;
      let param = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      if (this.isCheckAll) {
        this.isCheckAll = false;
      }
      this.loadingData = true;
      // 清空勾选列表
      this.checkList = [];
      // this.checkListPara = [];
      let nowTime = Date.now();
      this.nowTime = nowTime;
      TmsWayBill.query(param).then(res => {
        if (this.nowTime > nowTime) return;
        res.data.list.forEach(val => {
          val.isChecked = false;
        });
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
    // tab下面的数量
    queryStateNum(params) {
      TmsWayBill.queryStateNum(params).then(res => {
        let data = res.data;
        let count = 0;
        Object.keys(data).map(k => (count += data[k]));
        this.orderType[0].num = count;
        this.orderType[1].num = data['pend-confirm'];
        this.orderType[2].num = data['pend-package'];
        this.orderType[3].num = data['pend-choose-car'];
        this.orderType[4].num = data['pend-shipment'];
        this.orderType[5].num = data['pend-delivery'];
        this.orderType[6].num = data['pend-sign'];
        this.orderType[7].num = data['complete'];
        this.orderType[8].num = data['canceled'];
        this.orderType[9].num = data['pend-check'];
        this.orderType[10].num = data['suspend'];
      });
    },
  }
};
</script>
