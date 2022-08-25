<template>
  <div v-if="loadingData">
    <oms-loading :loading="loadingData"></oms-loading>
  </div>
  <div v-else>
    <attachment-show :attachmentRight="attachmentRight" :currentOrder="currentOrder" :orderAttachment="accessory.followDocuments"
                     label="随货同行单" objectType="followDocument"
                     @refreshAttachment="queryAttachmentList"></attachment-show>

<!--    <attachment-show label="运输单" :orderAttachment="accessory.wayBills" :currentOrder="currentOrder"
                     objectType="wayBill" :attachmentRight="attachmentRight"
                     @refreshAttachment="queryAttachmentList"></attachment-show>

    <attachment-show label="在途温度" :orderAttachment="accessory.transitTemperatureFroms"
                     :currentOrder="currentOrder"
                     objectType="transitTemperatureFrom"
                     :attachmentRight="attachmentRight"
                     @refreshAttachment="queryAttachmentList"></attachment-show>

    <attachment-show label="在库温度" :orderAttachment="accessory.warehouseTemperatureFroms"
                     :currentOrder="currentOrder"
                     objectType="warehouseTemperatureFrom"
                     :attachmentRight="attachmentRight"
                     @refreshAttachment="queryAttachmentList"></attachment-show>

    <div v-show="currentOrder.state === '7' ">
      <attachment-show label="取消订单" :orderAttachment="accessory.cancelDocuments"
                       :currentOrder="currentOrder"
                       :attachmentRight="attachmentRight"
                       @refreshAttachment="queryAttachmentList" :isShowUpload="false"></attachment-show>
    </div>

    <attachment-show label="其他" :orderAttachment="accessory.others"
                     :attachmentRight="attachmentRight"
                     :currentOrder="currentOrder"
                     objectType="other" @refreshAttachment="queryAttachmentList"></attachment-show>-->

    <div class="text-center" style="margin-bottom: 20px">
      <perm label="wms-out-order-batch-document-download">
        <el-button v-if="accessory.followDocuments.length>0||
                   accessory.wayBills.length>0||
                   accessory.transitTemperatureFroms.length>0||
                   accessory.warehouseTemperatureFroms.length>0||
                   accessory.others.length>0" :plain="true" type="success"
                   @click="exportZip">
          一键导出附件
        </el-button>
      </perm>
    </div>

  </div>
</template>
<script>
import {http} from '@/resources';
import attachmentShow from '../../attachmentShow.vue';
import utils from '@/tools/utils';

export default {
  components: {
    attachmentShow
  },
  props: {
    currentOrder: {
      required: true,
      type: Object,
      default: function () {
        return {};
      }
    },
    index: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      loadingData: true,
      accessory: {
        followDocuments: [], // 随货同行单
        wayBills: [], // 运输单
        drugControlReports: [], // 药检报告
        batchReleases: [], // 批签发
        importCertificates: [], // 进口注册证
        customsPass: [], // 通关单
        transitTemperatureFroms: [], // 在途温度
        warehouseTemperatureFroms: [], // 在库温度
        others: [], // 其他
        cancelDocuments: []// 取消订单
      },
      attachmentRight: {// 附件管理权限
        watch: 'wms-out-order-document-watch',
        download: 'wms-out-order-document-download',
        upload: 'wms-out-order-document-upload',
        remove: 'show'
      }
    };
  },
  watch: {
    index(val) {
      this.loadingData = true;
      this.accessory = {
        followDocuments: [], // 随货同行单
        wayBills: [], // 运输单
        drugControlReports: [], // 药检报告
        batchReleases: [], // 批签发
        importCertificates: [], // 进口注册证
        customsPass: [], // 通关单
        transitTemperatureFroms: [], // 在途温度
        warehouseTemperatureFroms: [], // 在库温度
        others: [], // 其他
        cancelDocuments: []// 取消订单
      };
      if (val === 4) this.queryAttachmentList();
    }
  },
  methods: {
    exportZip: function () {
      this.$store.commit('initPrint', {
        isPrinting: true,
        moduleId: '/order/in/' + this.currentOrder.id,
        text: '正在导出'
      });

      http.get('/order-attachment/order/' + this.currentOrder.id + '/zip', {}).then(res => {
        utils.download(res.data.path, '订单附件Zip');
        this.$store.commit('initPrint', {
          isPrinting: false,
          moduleId: '/order/in/' + this.currentOrder.id
        });

      }).catch(error => {
        this.$store.commit('initPrint', {
          isPrinting: false,
          moduleId: '/order/in/' + this.currentOrder.id
        });
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    queryAttachmentList: function () {// 附件管理
      if (!this.currentOrder.id) return;
      http.get('/order-attachment/order/' + this.currentOrder.id).then(res => {
        this.accessory = res.data;
        this.loadingData = false;
      });
    }
  }
};
</script>
