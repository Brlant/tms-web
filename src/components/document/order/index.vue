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

.tips {
  color: #F56C6C;
  width: 100%;
  text-align: center;
}
</style>
<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <perm label="tms-order-generate">
          <el-button plain size="small" @click="createWayBill" v-if="activeStatus === 0 || activeStatus === '0'">
            <f-a class="icon-small" name="wave"></f-a>
            批量生成运单
          </el-button>
        </perm>
        <perm label="tms-order-generate-single">
          <el-button plain size="small" @click="singleCreateWayBill" v-if="activeStatus === 0 || activeStatus === '0'">
            <f-a class="icon-small" name="wave"></f-a>
            单独批量生成运单
          </el-button>
        </perm>
        <perm label="tms-order-generate">
          <el-button plain size="small" @click="autoCreateWayBill"
            v-if="(activeStatus === 0 || activeStatus === '0') && (!checkList || checkList.length == 0)">
            <f-a class="icon-small" name="wave"></f-a>
            自动生成运单
          </el-button>
        </perm>
        <perm label="tms-order-add">
          <el-button plain size="small" @click="showPart(0)">
            <f-a class="icon-small" name="plus"></f-a>
            添加
          </el-button>
        </perm>
        <perm label="tms-order-export">
          <el-button plain size="small" @click="exportOrder" :disabled="isLoading">
            <f-a class="icon-small" name="basic"></f-a>
            导出Excel
          </el-button>
        </perm>
      </template>
    </search-part>
    <status-list :activeStatus="activeStatus" :statusList="orderType" :checkStatus="checkStatus" />
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="3">
          <el-checkbox @change="checkAll" v-model="isCheckAll" v-if="activeStatus === 0 || activeStatus === '0'"></el-checkbox>
          订单号
        </el-col>
        <el-col :span="2">类型</el-col>
        <el-col :span="5">发货单位</el-col>
        <el-col :span="5">收货单位</el-col>
        <el-col :span="1">整件</el-col>
        <el-col :span="1">散件</el-col>
        <el-col :span="2">送达时限</el-col>
        <el-col :span="2">状态</el-col>
        <el-col :span="3">操作</el-col>
      </el-row>
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
        <div class="order-list-item" v-for="item in dataList" @click="showInfo(item)"
          :class="[formatRowClass(item.status, orderType), { 'active': currentItemId === item.id }]">
          <el-row>
            <el-col :span="3" class="special-col R">
              <div class="el-checkbox-warp" @click.stop.prevent="checkItem(item)"
                v-if="activeStatus === 0 || activeStatus === '0'">
                <el-checkbox v-model="item.isChecked"></el-checkbox>
              </div>
              <div>
                {{ item.orderNo }}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                <dict :dict-group="'bizType'" :dict-key="item.waybillType"></dict>
              </div>
              <div v-show="item.shipmentWay">
                <dict :dict-group="'transportationCondition'" :dict-key="item.shipmentWay"></dict>
              </div>
              <div v-show="item.deliveryWay">
                <dict :dict-group="'deliveryWay'" :dict-key="item.deliveryWay"></dict>
              </div>
            </el-col>
            <el-col :span="5" class="R">
              <div>
                {{ item.senderName }}
              </div>
              <div>
                {{ item.senderAddress }}
              </div>
            </el-col>
            <el-col :span="5" class="R">
              <div>
                {{ item.receiverName }}
              </div>
              <div>
                {{ item.receiverAddress }}
              </div>
            </el-col>
            <el-col :span="1" class="R">
              <div>
                {{ item.wholeBoxCount }}
              </div>
            </el-col>
            <el-col :span="1" class="R">
              <div>
                {{ item.bulkBoxCount }}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{ item.deliveryTime | date }}
              </div>
            </el-col>
            <el-col :span="2" class="R">
              <div>
                {{ formatStatusTitle(item.status, orderType) }}
              </div>
            </el-col>
            <el-col :span="3" class="opera-btn">
              <div v-if="activeStatus === '1'">
                <perm label="tms-order-edit" class="btn-line-block">
                  <span @click.stop="edit(item)" v-if="activeStatus === '1'">
                    <a @click.pervent="" class="btn-circle btn-opera">
                      <i class="el-icon-t-edit"></i>
                    </a>编辑
                  </span>
                </perm>
              </div>
              <div v-if="activeStatus !== '1'">
                <div>
                  <perm label="tms-order-edit" class="btn-line-block">
                    <span @click.stop="edit(item)" v-if="activeStatus === '0'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-edit"></i>
                      </a>编辑
                    </span>
                  </perm>
                  <perm label="tms-order-delete" class="btn-line-block">
                    <span @click.stop="deleteOrder(item)" v-if="activeStatus === '0'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-delete"></i>
                      </a>删除
                    </span>
                  </perm>
                </div>
                <div style="padding-top: 2px">
                  <perm label="tms-order-cancel" class="opera-btn btn-line-block">
                    <span @click.stop="cancelOrder(item)" v-if="activeStatus === '0'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-forbidden"></i>
                      </a>取消
                    </span>
                  </perm>
                  <perm label="tms-order-dismantling" class="opera-btn btn-line-block">
                    <span @click.stop="splitOrder(item)" v-if="activeStatus === '0'">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-t-basic"></i>
                      </a>拆分订单
                    </span>
                  </perm>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="order-list-item-bg"></div>
        </div>
      </div>
      <el-row class="order-list-header" v-show="dataList.length && !loadingData">
        <el-col :span="3"></el-col>
        <el-col :span="2"></el-col>
        <el-col :span="5"></el-col>
        <el-col :span="5">合计</el-col>
        <el-col :span="1">{{ totalCount.whole }}</el-col>
        <el-col :span="1">{{ totalCount.buck }}</el-col>
        <el-col :span="7"></el-col>
      </el-row>
    </div>
    <div class="text-center" v-show="dataList.length && !loadingData">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pager.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pager.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="pager.count">
      </el-pagination>
    </div>

    <page-right :show="showIndex === 0" @right-close="resetRightBox" :css="{ 'width': '900px', 'padding': 0 }">
      <component :is="currentPart" :action="action" :formItem="form" @right-close="resetRightBox" @change="submit" />
    </page-right>
    <page-right :show="showInfoIndex === 0" @right-close="resetRightBox" :css="{ 'width': '1200px', 'padding': 0 }">
      <component :is="currentInfoPart" :showBigMap="showBigMap" :formItem="form" @right-close="resetRightBox" />
    </page-right>
    <page-right :show="showWayBillPart" @right-close="resetRightBox" :css="{ 'width': '1000px', 'padding': 0 }">
      <component :is="currentWayBillPart" :carrierList="carrierList" @wayBillShow="wayBillShow" :checkList="checkListPara"
        @right-close="resetRightBox" @change="submit" />
    </page-right>
    <page-right :show="showSingleWayBillPart" @right-close="resetRightBox" :css="{ 'width': '1000px', 'padding': 0 }">
      <component :is="currentSingleWayBillPart" :checkList="checkListPara" :carrierList="carrierList"
        @right-close="resetRightBox" @change="submit" @wayBillShow="wayBillShow" />
    </page-right>
    <page-right :show="showSplitOrderPart" @right-close="resetRightBox" :css="{ 'width': '1200px', 'padding': 0 }">
      <component :is="currentSplitOrderPart" :formItem="form" @right-close="resetRightBox" @change="submit" />
    </page-right>
    <el-dialog :title="`运单:${activeNo} 派送信息`" :visible.sync="isShowMulBigMap" width="100%" :fullscreen="true"
      custom-class="custom-dialog-map">
      <map-path :activeNo="activeNo" :formItem="formItem" :mapStyle="{ height: bodyHeight }" vid="mapBigPath"
        v-show="isShowMulBigMap"></map-path>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormVisible" center width="25%">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogFormRules">
        <el-form-item label="承运类型" label-width="120px">
          <el-radio-group v-model="dialogForm.carryType" size="mini" @change="carryTypeChangeHandle">
            <el-radio :label="0">自行承运</el-radio>
            <el-radio :label="1">第三方承运</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="承运商名称" style="max-width: max-content" label-width="120px" prop="carrierId">
          <el-select v-model="dialogForm.carrierId" :disabled="dialogForm.carryType === 0" placeholder="请选择承运商" filterable
            size="mini" @change="chooseCarrier">
            <el-option v-for="item in carrierList" :key="item.carrierId" :label="item.carrierName"
              :value="item.carrierId">
              <span style="float: left" title="承运商名称">{{ item.carrierName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px" title="承运条件">{{
                item.transportationConditions | transName
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆信息" style="max-width: max-content" label-width="120px" prop="carId">
          <el-select v-model="dialogForm.carId" :disabled="dialogForm.carryType === 0" placeholder="请选择车辆" filterable
            size="mini">
            <el-option v-for="item in carList" :key="item.carDto.id" :label="item.carDto.plateNumber"
              :value="item.carDto.id"  :disabled="item.carDto.carState == 6">
              <span style="float: left">{{ item.carDto.plateNumber }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ carStatusList[item.carDto.carState || 0].title }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="司机名称" style="max-width: max-content" label-width="120px" prop="driverId">
          <el-select v-model="dialogForm.driverId" :disabled="dialogForm.carryType === 0" placeholder="请选择司机" filterable
            size="mini">
            <el-option v-for="item in driverList" :key="item.driverId" :label="item.driverName"
              :value="item.driverId"  :disabled="item.driverStatus == 2">
              <span style="float: left">{{ item.driverName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ driverStatusFn(item.driverStatus) }}</span> 
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmBeforeHandle">确认生成运单</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 面单号 -->
    <!-- <el-dialog :visible.sync="surfaceFormVisible" center width="700px" :show-close="false" >
          <el-form ref="surface" :model="surface">
              <el-form-item label="面单号" label-width="100px">
                          <oms-input v-model="surface.faceSheetNo" placeholder="请输入面单号"></oms-input>
              </el-form-item>
            <div class="tips">点击确认后，将自动生成运单</div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="receiptConfirm('surface')" :disabled="doing">确定</el-button>
            <el-button @click="receiptCancel('surface')">取消</el-button>
          </div>
      </el-dialog> -->
  </div>
</template>
<script>
import utils from '@/tools/utils';
import SearchPart from './search';
import { http, TmsOrder } from '@/resources';
import addForm from './form/add-form.vue';
import showForm from './form/show-form.vue';
import splitForm from './form/split-order.vue';
import wayBillForm from './form/create-way-bill.vue';
import singleWayBillForm from './form/create-single-way-bill.vue';
import StatusMixin from '@/mixins/statusMixin';
import Perm from '@/components/common/perm';
import MapPath from '../common/map-list';

export default {
  components: {
    Perm, SearchPart, addForm, wayBillForm, singleWayBillForm, MapPath
  },
  mixins: [StatusMixin],
  data() {
    let self = this
    let validateInput =(rule,value,callback)=>{
      if (self.dialogForm.carryType === 1 && !value) {
        return callback(new Error('请选择...'));
      }
        return callback()
    }
    return {
      doing: false, // 确定按钮loading
      surfaceFormVisible: false,  // 面单号弹窗
      carrierList: [],  // 承运商信息下拉
      carList:[],  //  车辆信息下拉
      driverList:[], // 司机信息下拉
      loadingData: false,
      activeStatus: '0',
      orderType: utils.orderType,
      dataList: [],
      showIndex: -1,
      showInfoIndex: -1,
      currentPart: null,
      currentInfoPart: null,
      currentWayBillPart: null,
      currentSingleWayBillPart: null,
      currentSplitOrderPart: null,
      dialogComponents: {
        0: addForm
      },
      dialogInfoComponents: {
        0: showForm
      },
      dialogWayBillComponents: {
        0: wayBillForm
      },
      dialogSingleWayBillComponents: {
        0: singleWayBillForm
      },
      dialogSplitFormComponents: {
        0: splitForm
      },
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10,
        totalPage: 1
      },
      action: '',
      form: {},
      filters: {
        status: 0,
        orderNo: '',
        waybillType: '',
        shipmentWay: '',
        deliveryWay: '',
        faceSheetNo: '',
        serviceType: '',
        senderId: '',
        receiverId: '',
        startTime: '',
        endTime: '',
        tmsOrderNumber: '',
        goodsTotalName: '',
        destinationAreaCode: ''
      },
      // 面单号
      surface: {
        faceSheetNo: '',
      },
      isCheckAll: false,
      isLoading: false,
      checkList: [],
      checkListPara: [],
      showWayBillPart: false,
      showSingleWayBillPart: false,
      showSplitOrderPart: false,
      formItem: {},
      activeNo: '',
      isShowMulBigMap: false,
      dialogFormVisible: false,
      auto: false,//如果为true，表示自动生成运单
      dialogForm: {
        carryType: 0,
        carrierId: '',
        carId:'',
        driverId:'',
      },
      dialogFormRules: {
        carrierId:[
          {validator:validateInput,trigger: 'change',}
        ],
        carId:[
          {validator:validateInput,trigger: 'change',}
        ],
        driverId:[
          {validator:validateInput,trigger: 'change',}
        ],
        // carrierId: {
        //   trigger: 'change',
        //   validator: (rules, value, cb) => {
        //     if (this.dialogForm.carryType === 1 && !value) {
        //       return cb(new Error('请选择第三方承运商'));
        //     }

        //     return cb();
        //   },
        // },
      },
      // 车辆状态 1，运输、2：空闲、 3：维修 4：停用  5：报废 6: 异常  7: 即将超期
      carStatusList: [
          {title: '', status: ''},
          {title: '运输', status: 1},
          {title: '空闲', status: 2},
          {title: '维修', status: 3},
          {title: '停用', status: 4},
          {title: '报废', status: 5},
          {title: '异常', status: 6},
          {title: '即将超期', status: 7}, 
        ],
        // 司机状态 // 0-停用；1-正常；2-异常；3-即将超期
        driverStatus:[
          { label:'停用',value:0,},
          { label:'正常',value:1,},
          { label:'异常',value:2,},
          { label:'即将超期',value:3,},
        ],
    };
  },
  computed: {
    bodyHeight() {
      let height = parseInt(this.$store.state.bodyHeight, 10);
      return (height + 116) + 'px';
    },
    totalCount() {
      let total = {
        whole: 0,
        buck: 0
      };
      this.dataList.forEach(i => {
        total.whole += i.wholeBoxCount;
        total.buck += i.bulkBoxCount;
      });
      return total;
    }
  },
  watch: {
    filters: {
      handler() {
        this.getTmsOrderPage(1);
      },
      deep: true
    }
  },
  filters: {
    transName(val) {
      if (val === 'A') {
        return '全部';
      } else if (val === 'B') {
        return '冷链运输';
      } else if (val === 'C') {
        return '常温运输';
      } else {
        return '';
      }
    }
  },
  mounted() {
    this.getTmsOrderPage(1);
    let id = this.$route.params.id;
    if (id !== 'list' && id !== ':id') {
      this.showInfo({ id });
    } else {
      this.$router.push('/document/order/list');
    }

    this.getCarrierList(1);
  },
  methods: {
    // 司机状态回显
    driverStatusFn(val){
         return this.driverStatus.find(item=> item.value == val).label
      },
    // 选择承运商
    chooseCarrier(val) {
      this.dialogForm.carId = ''
      this.dialogForm.driverId = ''
      if(val){
        // 获取车辆信息
        this.getCarInfo()
        // 获取司机信息
        this.getDriverInfo()
      }else{
        this.carList = []
        this.driverList = []
      }
    },
    // 获取车辆信息
    getCarInfo(query){
      let data = {
        plateNumber: query,
        ascriptionCompany: this.dialogForm.carrierId
      }
      this.$http.post('/car-archives/queryCarByCondition', data).then(res => {
        this.carList = res.data;
      })
    },
    // 获取司机信息
    getDriverInfo(query){
      let data = {
        keyWord: query,
        carrierId: this.dialogForm.carrierId
      }
      this.$http.post('/driver-info/queryDriversByCarrier', data).then(res => {
        this.driverList = res.data;
      })
    },
    wayBillShow(auto = false) {
      this.dialogFormVisible = true;
      this.auto = auto
    },
    searchCarriers(keyword) {
      this.getCarrierList(1, keyword)
    },
    getCarrierList(pageNo, keyWord = '') {
      const pageSize = 20;
      this.$http.get('/carrier/findCarrierByPage', { params: { status: 2, keyWord, pageNo, pageSize } })
        .then(res => {
          const { list, totalPage } = res.data;
          this.carrierList = list;
          if (totalPage > pageNo) {
            this.getCarrierList(++pageNo);
          }
        })
        .catch(err => {
          this.carrierList = [];
          // 清空车辆、司机
          // TODO
          this.carList = []
          this.driverList = []
        })
    },
    exportOrder() {
      this.isLoading = true;
      this.$store.commit('initPrint', {
        isPrinting: true,
        moduleId: '/document/order/list',
        text: '正在导出'
      });
      let params = Object.assign({}, this.filters);
      http.post('/tms-order/export', params).then(res => {
        utils.download(res.data.path, '订单信息表');
        this.isLoading = false;
        this.$store.commit('initPrint', {
          isPrinting: false,
          moduleId: '/document/order/list'
        });
      }).catch(error => {
        this.isLoading = false;
        this.$store.commit('initPrint', {
          isPrinting: false,
          moduleId: '/document/order/list'
        });
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    showBigMap(formItem, item) {
      this.formItem = {};
      this.activeNo = '';
      this.isShowMulBigMap = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.formItem = formItem;
          this.activeNo = item.waybillNo;
        }, 100);
      });
    },
    autoCreateWayBill() {
      this.$confirm('确认将状态为待生成运单的订单自动生成为运单?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.wayBillShow(true);
      }).catch(() => {

      });
    },
    confirmBeforeHandle() {
      this.$refs.dialogForm.validate((valid) => {
        if (!valid || this.doing) {
          return;
        }

        this.doing = true;
        if (this.auto) {
          this.autoHandle();
        } else {
          this.batchHandle();
        }
      })
    },
    autoHandle() {
      let param = Object.assign({}, this.filters, this.dialogForm);
      if (param.carryType == 0) {
        param.carrierId = ''
      }

      TmsOrder.autoCreateWayBill(param).then(() => {
        this.doing = false;
        this.$notify.success({
          duration: 2000,
          title: '成功',
          message: '已成功生成运单'
        });

        this.getTmsOrderPage(1);
        this.resetRightBox();
      }).catch(error => {
        this.doing = false;
        this.$notify.error({
          duration: 2000,
          message: error.response && error.response.data && error.response.data.msg || '自动生成运单失败'
        });
      });
    },
    batchHandle() {
      // 批量操作所有订单都是一样的,重新组装下参数
      let wayBillParams = this.checkListPara.map(item => {
        return {
          orderId: item.id,
          ...this.dialogForm
        }
      });

      wayBillParams.forEach(wb => {
        if (wb.carryType === 0) {
          wb.carrierId = '';
        }
      })

      TmsOrder.createWayBill({ wayBillParams }, this.auto)
        .then(() => {
          this.doing = false;
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '操作成功'
          });

          this.submit()
          this.resetRightBox();
        })
        .catch(error => {
          this.doing = false;
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '操作失败'
          });
        });
    },
    cancelOrder(item) {
      this.$confirm('确认取消订单"' + item.orderNo + '"?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        TmsOrder.cancelOrder(item.id).then(() => {
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '已成功取消订单"' + item.orderNo + '"'
          });
          this.getTmsOrderPage(1);
        }).catch(error => {
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '取消订单失败'
          });
        });
      }).catch(() => {

      });
    },
    splitOrder(item) {
      this.currentSplitOrderPart = this.dialogSplitFormComponents[0];
      this.showSplitOrderPart = true;
      this.$nextTick(() => {
        this.form = JSON.parse(JSON.stringify(item));
        this.form.goodsList = item.goodsList;
      });
    },
    handleSizeChange(val) {
      this.pager.pageSize = val;
      window.localStorage.setItem('currentPageSize', val);
      this.getTmsOrderPage(1);
    },
    handleCurrentChange(val) {
      this.getTmsOrderPage(val);
    },
    createWayBill() {
      if (!this.checkList.length) {
        this.$notify.warning({
          duration: 2000,
          message: '请选择订单'
        });
        return;
      }
      this.showWayBillPart = true;
      this.currentWayBillPart = this.dialogWayBillComponents[0];
      this.$nextTick(() => {
        this.checkListPara = this.checkList.slice();
      });
    },
    singleCreateWayBill() {
      if (!this.checkList.length) {
        this.$notify.warning({
          duration: 2000,
          message: '请选择订单'
        });
        return;
      }
      this.showSingleWayBillPart = true;
      this.currentSingleWayBillPart = this.dialogSingleWayBillComponents[0];
      this.$nextTick(() => {
        this.checkListPara = this.checkList.slice();
      });
    },
    checkItem(item) {
      // 单选
      // 单选
      item.isChecked = !item.isChecked;
      let index = this.checkList.indexOf(item);
      if (item.isChecked) {
        if (index === -1) {
          this.checkList.push(item);
        }
      } else {
        this.checkList.splice(index, 1);
      }
    },
    checkAll() {
      // 全选
      if (this.isCheckAll) {
        this.dataList.forEach(item => {
          item.isChecked = true;
          let index = this.checkList.indexOf(item);
          if (index === -1) {
            this.checkList.push(item);
          }
        });
      } else {
        this.dataList.forEach(item => {
          item.isChecked = false;
        });
        this.checkList = [];
      }
    },
    searchResult(search) {
      Object.assign(this.filters, search);
    },
    checkStatus(item, key) {
      this.checkList = [];
      this.checkListPara = [];
      this.filters.status = item.status;
      this.activeStatus = key;
    },
    resetRightBox() {
      this.showIndex = -1;
      this.showInfoIndex = -1;
      this.showWayBillPart = false;
      this.showSingleWayBillPart = false;
      this.showSplitOrderPart = false;
      this.dialogFormVisible = false;
      this.dialogForm = {
        carryType: 0,
        carrierId: '',
        carId:'',
        driverId:'',
      }

      this.$router.push('/document/order/list');
    },
    getTmsOrderPage(pageNo, isContinue = false) {
      this.pager.currentPage = pageNo;
      let param = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      this.loadingData = true;
      if (this.isCheckAll) {
        this.isCheckAll = false;
      }
      // 清空勾选列表
      this.checkList = [];
      this.checkListPara = [];
      let nowTime = Date.now();
      this.nowTime = nowTime;
      TmsOrder.query(param).then(res => {
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
    queryStateNum(params) {
      TmsOrder.queryStateNum(params).then(res => {
        let data = res.data;
        this.orderType[0].num = data['pend-generate-waybill'];
        this.orderType[1].num = data['pend-choose-car'];
        this.orderType[2].num = data['pend-shipment'];
        this.orderType[3].num = data['pend-sign'];
        this.orderType[4].num = data['pend-transfer'];
        this.orderType[5].num = data['complete'];
        this.orderType[6].num = data['canceled'];
      });
    },
    showPart(index) {
      this.action = 'add';
      this.showIndex = index;
      this.currentPart = this.dialogComponents[index];
      this.form = {
        goodsList: [
          {
            goodsName: '',
            specifications: '',
            weight: '',
            volume: '',
            code: ''
          }
        ]
      };
    },
    edit(item) {
      this.currentItem = item;
      this.currentItemId = item.id;
      this.action = 'edit';
      this.showIndex = 0;
      this.currentPart = this.dialogComponents[0];
      this.$nextTick(() => {
        this.form = JSON.parse(JSON.stringify(item));
      });
    },
    deleteOrder(item) {
      this.currentItem = item;
      this.currentItemId = item.id;
      this.$confirm('确认删除订单"' + item.orderNo + '"?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        TmsOrder.delete(item.id).then(() => {
          this.getTmsOrderPage(1);
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '已成功删除订单"' + item.orderNo + '"'
          });
        }).catch(error => {
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '删除运单失败'
          });
        });
      }).catch(() => {

      });
    },
    showInfo(item) {
      this.currentItem = item;
      this.currentItemId = item.id;
      this.showInfoIndex = 0;
      this.currentInfoPart = this.dialogInfoComponents[0];
      this.$nextTick(() => {
        this.form = JSON.parse(JSON.stringify(item));
        this.$router.push('/document/order/' + item.id);
      });
    },
    submit() {
      this.checkList = [];
      this.checkListPara = [];
      this.getTmsOrderPage(1);
    },
    carryTypeChangeHandle(val) {
      if (val === 0) {
        // 如果是自行承运，去掉校验
        this.$refs.dialogForm.clearValidate();
      }
    }
  }
};
</script>
