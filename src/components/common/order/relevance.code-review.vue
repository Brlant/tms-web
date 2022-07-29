<style lang="scss" scoped>
@import '../../../assets/scss/mixins';

.product-code-list {
  margin-top: 20px;
  text-align: center;
  border-collapse: collapse;
  font-size: 12px;

  td {
    height: 24px;
    border: 1px solid #dfe6ec;
  }

}

.t-head {
  background: #eef1f6;
  color: #1f2d3d;
  font-weight: bold;
}

.btn-group {
  margin-bottom: 30px;
  overflow: hidden;

  .download-icon {
    margin-top: 10px;
    cursor: pointer;

    &:hover a {
      color: $activeColor;
    }
  }
}

.empty-info {
  &.mini-empty-info {
    height: 60px;
  }
}

.qp-box {
  &.accessory {
    margin-bottom: 20px;
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 0 20px 10px 20px;

    h2 {
      line-height: 20px;
      margin: 10px 0;
      padding: 0;
    }

    .accessory-item {
      margin-top: 10px;
    }
  }

  .accessory-list {
    .show-list {
      .list-item {
        .attachment-delete, .download-link {
          float: right;
          padding: 0 10px;
          color: #fff;
          font-size: 16px;
        }

        &:hover .attachment-delete {
          color: red;
        }

        &:hover .download-link {
          color: #1c8de0;
        }
      }
    }
  }
}

</style>
<template>
  <div>
    <div>
      <div style="margin-bottom: 10px; margin-top: 20px;overflow: hidden">
       <span class="pull-right">
           <span class="btn-search-toggle open" v-show="showSearch">
              <single-input v-model="filters.code" placeholder="请输入追溯码搜索" :showFocus="showSearch"></single-input>
              <i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>
           </span>
           <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
              <i class="el-icon-t-search"></i>
           </a>
      </span>
      </div>
      <div class="order-list clearfix" v-loading="loadingData">

        <el-row class="order-list-header t-head" style="margin:0">
          <el-col :span="8">追溯码</el-col>
          <el-col :span="8">货品名称</el-col>
          <el-col :span="5">批号</el-col>
          <el-col :span="3">包装类型</el-col>
        </el-row>
        <el-row v-if="!traceCodes.length">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else class="order-list-body">
          <div class="order-list-item order-list-item-bg" v-for="item in traceCodes"
               style="margin-left: 0;margin-right: 0">
            <el-row>
              <el-col :span="8" class="R">
                <span>{{ item.code }}</span>
              </el-col>
              <el-col :span="8" class="pt">
                <span>{{ item.goodsName }}</span>
              </el-col>
              <el-col :span="5" class="pt">
                <span>{{ item.batchNumber }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ packageType[item.packageScheme - 1] }}</span>
              </el-col>
            </el-row>
          </div>
        </div>

      </div>
      <div class="text-center" v-show="(traceCodes.length || pager.currentPage !== 1) && !loadingData">
        <el-cu-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                          :current-page="pager.currentPage"
                          :page-sizes="[10,20,50,100]" :page-size="pager.pageSize"
                          layout="sizes, prev, pager, next, jumper"
                          :total="pager.count">
        </el-cu-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {http, OmsAttachment} from '@/resources';
import utils from '@/tools/utils';

export default {
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
    },
    type: String
  },
  data() {
    return {
      loadingData: false,
      loadingDetailData: false,
      showSearch: false,
      codes: [],
      isCheck: false,
      downloadData: {},
      orderAttachment: [],
      files: [],
      traceCodes: [],
      filters: {
        code: ''
      },
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
      },
      packageType: utils.packageType,
      doing: false
    };
  },
  watch: {
    index(val) {
      this.filters.code = '';
      if (val !== 9) return;
      this.files = [];
      this.getTraceCodes(1);
//        this.queryAttachment();
    },
    filters: {
      handler: function () {
        this.getTraceCodes(1);
      },
      deep: true
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pager.pageSize = val;
      window.localStorage.setItem('currentPageSize', val);
      this.getTraceCodes(1);
    },
    handleCurrentChange(val) {
      this.getTraceCodes(val);
    },
    changeFiles(files) {
      this.files = files;
    },
    showAttachment: function (item) {// 显示预览
      this.$store.commit('changeAttachment', item.attachmentId);
    },
    deleteAttachMentManageItem: function (item) {// 删除附件管理附件
      OmsAttachment.delete(item.attachmentId).then(() => {
        this.$notify.success({
          duration: 2000,
          title: '成功',
          message: '已成功删除附件'
        });
        this.queryAttachment();
      });
    },
    onSubmit() {
      if (!this.orderAttachment.length) {
        this.$notify.info({
          message: '请选择文件'
        });
        return;
      }
      this.doing = true;
      http.post(`/code/${this.currentOrder.id}/parse/trace-code`).then(() => {
        this.$notify.info({
          message: '解析成功'
        });
        this.doing = false;
        this.queryCodes();
        this.getTraceCodes(1);
      }).catch(error => {
        this.doing = false;
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '解析失败'
        });
        this.queryCodes();
        this.getTraceCodes(1);
      });
    },
    queryCodes() {
      this.loadingDetailData = true;
      http.get(`/code/${this.currentOrder.id}/trace-code/result`).then(res => {
        this.isCheck = res.data.result;
        this.codes = res.data.list;
        this.loadingDetailData = false;
      });
    },
    queryAttachment() {
      OmsAttachment.queryOneAttachmentList(this.currentOrder.id, 'traceCode').then(res => {
        this.orderAttachment = res.data;
      });
    },
    getTraceCodes(pageNo) {
      // if (pageNo === 1) {
      //   this.pager.count = 0;
      // }
      this.pager.currentPage = pageNo;
      let params = Object.assign({
        pageNo: pageNo,
        pageSize: this.pager.pageSize,
        type: this.type,
        orderNo: encodeURIComponent(this.currentOrder.orderNo),
        sourceOrgId: this.currentOrder.type === '0' ? this.currentOrder.supplierId : this.currentOrder.orgId,
        directOrgId: this.currentOrder.type === '0' ? this.currentOrder.orgId : this.currentOrder.customerId
      }, this.filters);
      this.loadingData = true;
      // this.currentOrder.orderNo = '201805250001'; // 201805250001
      http.get(`/3pl-code/trace-code`, {params}).then(res => {
        this.traceCodes = res.data.list;
        // 设置分页数
        this.pager.count = this.pager.currentPage * this.pager.pageSize + (this.traceCodes.length === this.pager.pageSize ? 1 : 0);
        this.loadingData = false;
      });
    }
  }
};
</script>
