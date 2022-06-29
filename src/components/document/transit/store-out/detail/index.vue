<style lang="scss" scoped>
$leftWidth: 180px;
.content-part {
  .content-left {
    width: $leftWidth;
  }

  .content-right {
    > h3 {
      left: $leftWidth;
    }

    left: $leftWidth;
  }
}

.order-btn {
  margin-top: 50px;

  .el-button {
    padding: 9px 9px;
    font-size: 12px;
    border-radius: 4px;
  }
}

.order-button {
  .perm {
    display: block;
    margin: 10px 0;
  }
}
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">订单详情</h2>
        <ul>
          <li class="list-style" v-for="item in pageSets" @click="index=item.key"
              :class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>
          </li>
          <li class="text-center order-btn">
            <div class="order-button" style="margin:20px 0 20px;text-align: center">
              <perm label="oms-out-push-batchNumer-attachment-info">
                  <span v-show="currentOrder.state === '5'
                    || currentOrder.state === '7'">
                    <el-button :disable="pushLoading" :loading="pushLoading"
                               @click="pushOrderInfo" style="width: 100px" type="primary">
                      {{ !pushLoading ? '同步批号附件' : '同步中' }}</el-button>
                  </span>
              </perm>
              <perm label="out-order-handover-data">
                <el-button v-show="currentOrder.wmsStatus === '11'" type="primary" @click.prevent.stop="handoverOrder">
                  交付
                </el-button>
              </perm>
              <perm label="out-order-handover-data-confirm">
                <el-button v-show="currentOrder.wmsStatus === '11'" type="primary"
                           @click.prevent.stop="confirmHandover"> 确认交付
                </el-button>
              </perm>
              <perm label="out-order-handover-data-suspend">
                <el-button v-show="currentOrder.wmsStatus === '11'" type="danger"
                           @click.prevent.stop="stopHandoverOrder">
                  中止交付
                </el-button>
              </perm>
            </div>
          </li>
        </ul>
      </div>
      <div class="content-right content-padding">
        <h3></h3>
        <basic-info :currentOrder="currentOrder" v-show="index === 0"></basic-info>
        <log :currentOrder="currentOrder" v-show="index === 1" :isShow="index==1"></log>
        <order-attachment v-show="index === 4" :currentOrder="currentOrder" :index="index"></order-attachment>
        <relevance-code :currentOrder="currentOrder" :index="index" type="1" v-show="index === 8"></relevance-code>
        <relevance-code-review :currentOrder="currentOrder" :index="index" type="1"
                               v-show="index === 9"></relevance-code-review>
        <customer-feed-back :orderId="currentOrder.id" :index="index" v-show="index === 12"/>
      </div>
    </div>
    <el-dialog
      :visible.sync="stopDialogVisible" append-to-body
      title="中止交付" width="40%">
      <oms-form-row :span="6" isRequire label="中止交付原因：">
        <oms-input v-model="stopSignReason" :maxlength="100" placeholder="请输入中止交付原因" type="text"></oms-input>
      </oms-form-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelStopHandoverOrder">取 消</el-button>
        <el-button :disabled="stopSignDoing" type="primary" @click="stopHandoverOrderSubmit">中止交付</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible" append-to-body
      title="交付" width="40%">
      <oms-form-row :span="6" isRequire label="交付时间：">
        <el-date-picker
          v-model="handoverTime" placeholder="请选择交付时间" type="datetime">
        </el-date-picker>
      </oms-form-row>
      <oms-form-row :span="6" label="本单位交接人员：">
        {{ this.$store.state.user.userName }}
      </oms-form-row>
      <oms-form-row :span="6" isRequire label="提货人：">
        <oms-input v-model="transactOrgHandlers" :maxlength="35" placeholder="请输入提货人" type="text"></oms-input>
      </oms-form-row>
      <oms-form-row :span="6" isRequire label="提货车辆：">
        <oms-input v-model="carNo" :maxlength="20" placeholder="请输入提货车辆" type="text"></oms-input>
      </oms-form-row>
      <oms-form-row :span="6" label="备注：" max>
        <oms-input v-model="handoverRemark" :maxlength="100" placeholder="请输入备注" type="textarea"></oms-input>
      </oms-form-row>
      <oms-form-row :span="6" label="附件：">
        <oms-upload :fileList="signFileList"
                    :formData="{objectId:currentOrder.id,objectType:'followDocument'}"/>
      </oms-form-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelHandoverOrder">取 消</el-button>
        <el-button :disabled="signDoing" type="primary" @click="handoverOrderSubmit">交付</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import basicInfo from './base-info.vue';
import log from './log.vue';
import {http, InWork, OmsAttachment} from '@/resources';
import relevanceCode from '@/components/common/order/relevance.code.vue';
import relevanceCodeReview from '@/components/common/order/relevance.code-review';
import CustomerFeedBack from '@/components/common/order/customer-feedback';
import orderAttachment from './order.attachment';

export default {
  components: {basicInfo, log, relevanceCode, relevanceCodeReview, CustomerFeedBack, orderAttachment},
  props: {
    orderId: {
      type: String
    }
  },
  data() {
    return {
      currentOrder: {},
      index: 0,
      pushLoading: false,
      dialogVisible: false,
      stopDialogVisible: false,
      stopSignDoing: false,
      signDoing: false,
      confirming: false,
      handoverTime: '',
      transactOrgHandlers: '',
      carNo: '',
      handoverRemark: '',
      signFileList: [],
      stopSignReason: ''
    };
  },
  computed: {
    pageSets() {
      let menu = [];
      let perms = this.$store.state.permissions || [];
      menu.push({name: '订单详情', key: 0});
      if (perms.includes('wms-out-order-document-manager') && (this.currentOrder.wmsStatus === '11' || this.currentOrder.wmsStatus === '12')) {
        menu.push({name: '附件管理', key: 4});
      }
      menu.push({name: '操作日志', key: 1});
      if (perms.includes('stock-out-trace-code-watch')) {
        menu.push({name: '关联追溯码', key: 8});
      }
      if (perms.includes('stock-out-review-code-watch')) {
        menu.push({name: '复核追溯码', key: 9});
      }
      // if (perms.includes('wms-out-order-upload-data')) {
      //   menu.push({name: '反馈信息', key: 12});
      // }
      return menu;
    }
  },
  watch: {
    orderId() {
      this.index = 0;
      this.queryOrderDetail();
    }
  },
  methods: {
    modifyOrderState: function (state) {// 设置订单状态
      if (!state) return;
      this.currentOrder.wmsStatus = state;
      this.$emit('refresh');
    },
    querySignFileList: function () {
      this.signFileList = [];
      // 查询随货同行单
      OmsAttachment.queryOneAttachmentList(this.orderId, 'followDocument').then(res => {
        this.signFileList = res.data;
      });
    },
    confirmHandover() {
      if (!this.currentOrder.handoverTime) {
        return this.$notify({
          duration: 2000,
          message: '请先填写交付信息',
          type: 'info'
        });
      }
      this.$confirm('是否确认交付订单', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirming = true;
        this.$http.put(`/order-status/${this.currentOrder.id}/handover/confirm`).then(res => {
          this.$notify({
            duration: 2000,
            message: '确认交付订单完成',
            type: 'success'
          });
          this.confirming = false;
          this.modifyOrderState('12');
          this.$emit('close');
        }).catch(error => {
          this.confirming = false;
          this.$notify({
            duration: 2000,
            title: '无法操作',
            message: error.response && error.response.data && error.response.data.msg || '网络异常',
            type: 'error'
          });
        });
      }).catch(error => {
      });
    },
    stopHandoverOrderSubmit: function () {// 交付
      if (!this.stopSignReason) {
        return this.$notify({
          duration: 2000,
          message: '请填写中止交付原因',
          type: 'info'
        });
      }
      if (this.stopSignDoing || !this.orderId) return;
      this.stopSignDoing = true;
      let param = {
        remark: this.stopSignReason
      };
      http.put(`/order-status/${this.orderId}/handover/suspend`, param).then(res => {
        this.stopSignDoing = false;
        this.$notify({
          duration: 2000,
          message: '中止交付完成',
          type: 'success'
        });
        this.stopDialogVisible = false;
        this.cancelStopHandoverOrder();
        this.modifyOrderState('12');
        this.$emit('close');
      }).catch(error => {
        this.stopSignDoing = false;
        this.$notify({
          duration: 2000,
          title: '无法操作',
          message: error.response && error.response.data && error.response.data.msg || '网络异常',
          type: 'error'
        });
      });
    },
    handoverOrderSubmit: function () {// 交付
      if (!this.handoverTime) {
        return this.$notify({
          duration: 2000,
          message: '请选择交付时间',
          type: 'info'
        });
      }
      if (!this.transactOrgHandlers) {
        return this.$notify({
          duration: 2000,
          message: '请输入提货人',
          type: 'info'
        });
      }
      if (!this.carNo) {
        return this.$notify({
          duration: 2000,
          message: '请输入提货车辆',
          type: 'info'
        });
      }
      if (this.signDoing || !this.orderId) return;
      this.signDoing = true;
      let param = {
        orderId: this.orderId,
        handoverFlag: false,
        handoverTime: this.handoverTime,
        transactOrgHandlers: this.transactOrgHandlers,
        carNo: this.carNo,
        remark: this.handoverRemark
      };
      http.post('/order-status/handover/data', param).then(res => {
        this.signDoing = false;
        this.$notify({
          duration: 2000,
          message: '交付完成',
          type: 'success'
        });
        this.dialogVisible = false;
        this.queryOrderDetail();
      }).catch(error => {
        this.signDoing = false;
        this.$notify({
          duration: 2000,
          title: '无法操作',
          message: error.response && error.response.data && error.response.data.msg || '网络异常',
          type: 'error'
        });
      });
    },
    handoverOrder() {
      this.dialogVisible = true;
      this.handoverTime = this.handoverTime ? this.handoverTime : new Date();
      this.querySignFileList();
    },
    stopHandoverOrder() {
      this.stopDialogVisible = true;
      this.stopSignReason = '';
    },
    cancelHandoverOrder() {
      this.dialogVisible = false;
      this.setHandoverInfo();
    },
    cancelStopHandoverOrder() {
      this.stopDialogVisible = false;
      this.stopSignReason = '';
    },
    queryOrderDetail() {
      this.currentOrder = {};
      if (!this.orderId) return false;
      InWork.queryOrderDetail(this.orderId).then(res => {
        this.currentOrder = res.data;
        // 查询交付数据
        this.setHandoverInfo();
      });
    },
    setHandoverInfo() {
      this.handoverTime = this.currentOrder.handoverTime ? this.currentOrder.handoverTime : '';
      this.transactOrgHandlers = this.currentOrder.transactOrgHandlers ? this.currentOrder.transactOrgHandlers : '';
      this.carNo = this.currentOrder.carNo ? this.currentOrder.carNo : '';
      this.handoverRemark = this.currentOrder.handoverRemark ? this.currentOrder.handoverRemark : '';
    },
    pushOrderInfo() {
      if (this.pushLoading) return;
      this.pushLoading = true;
      this.$http.get(`/order-attachment/order/${this.orderId}/push`).then(res => {
        this.$notify({
          duration: 2000,
          message: '同步完成',
          type: 'success'
        });
        this.pushLoading = false;
      }).catch(error => {
        this.pushLoading = false;
        this.$notify({
          duration: 2000,
          title: '无法同步',
          message: error.response && error.response.data && error.response.data.msg || '网络异常',
          type: 'error'
        });
      });
    }
  }
};
</script>

