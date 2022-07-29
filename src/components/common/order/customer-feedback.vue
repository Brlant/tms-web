<style lang="scss" scoped>
.title {
  font-size: 24px;
  margin: 10px 0;

  .el-tag {
    font-size: 24px;
    line-height: 26px;
    height: 26px;
  }
}

.qp-box {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
}
</style>
<template>
  <div v-loading="loading">
    <div class="empty-info" v-if="!detail || detail.signFlag === null">暂无反馈信息</div>
    <div v-else>
      <h3 class="title">
        {{ detail.signFlag ? '已签收' : '未签收' }}
      </h3>
      <div v-show="!detail.list.length">
        <perm label="wms-out-order-upload-data-operate">
          <el-button type="primary" size="mini" @click="uploadData">上传数据</el-button>
        </perm>
      </div>
      <div class="qp-box" v-for="item in detail.list">
        <h3>
          {{ item.calltime }}
          <el-tag v-if="item.result === 0" type="success">正常</el-tag>
          <el-tag v-else type="danger">异常</el-tag>
        </h3>
        <div>
          {{ item.msg }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    orderId: String,
    index: Number
  },
  data() {
    return {
      detail: null,
      loading: false
    };
  },
  watch: {
    index(val) {
      this.detail = null;
      if (val !== 12) return;
      this.query();
    }
  },
  methods: {
    query() {
      if (!this.orderId) return;
      this.loading = true;
      this.$http.get(`upload-data/order/${this.orderId}`).then(res => {
        let list = [];
        res.data.list && res.data.list.forEach(i => {
          if (i.json) {
            list.push(JSON.parse(i.json));
          }
        });
        this.detail = {
          list,
          signFlag: res.data.signFlag
        };
        this.loading = false;
      });
    },
    uploadData() {
      if (this.loading) return;
      this.loading = true;
      this.$http.get(`/order/upload-data/${this.orderId}`).then(() => {
        this.query();
      }).catch(e => {
        this.loading = false;
        this.$notify.error({
          message: e.response && e.response.data.msg || '无法上传数据'
        });
      });
    }
  }
};
</script>
