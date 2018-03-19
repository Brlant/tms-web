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
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">签收运单</template>
    <template slot="btn">
      <el-button plain @click="save('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <el-form-item label="签收人" prop="senderContact">
          <oms-input v-model="form.senderContact" placeholder="请输入签收人"></oms-input>
        </el-form-item>
        <el-form-item label="附件">
          <oms-upload :fileList="attachmentList" @change="changeFiles"
                      :formData="{ objectId: 'dev', objectType: form.id}"></oms-upload>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {BaseInfo, OmsAttachment, TmsWayBill} from '@/resources';

  export default {
    data() {
      return {
        list: [],
        times: [],
        pageSets: [],
        currentTab: {},
        form: {
          goodsList: [
            {
              goodsName: '',
              specifications: '',
              weight: '',
              volume: '',
              code: ''
            }
          ]
        },
        doing: false,
        rules: {
          senderContact: [
            {required: true, message: '请输入签收人', trigger: 'blur'}
          ]
        },
        customerList: [],
        senderOrgList: [],
        receiverOrgList: []
      };
    },
    computed: {
      shipmentWayList() {
        return this.$getDict('shipmentWayType');
      },
      typeList() {
        return this.$getDict('transportationCondition');
      },
      serviceTypeList() {
        return this.$getDict('serviceType');
      }
    },
    props: ['formItem', 'action'],
    watch: {
      formItem: function (val) {
        if (this.action === 'add') {
          this.form = Object.assign({}, val);
        }
        if (this.action === 'edit') {
          if (val.id) {
            TmsWayBill.getOneTmsWayBill(val.id).then(res => {
              this.form = res.data;
              this.filterCustomer(this.form.orgName);
              this.filterSenderOrg(this.form.senderName);
              this.filterReceiverOrg(this.form.receiverName);
            });
          }
        }
      }
    },
    methods: {
      changeFiles: function (fileList) {
        let ids = [];
        fileList.forEach(file => {
          ids.push(file.attachmentId);
        });
        this.form.attachmentIdList = ids;
      },
      getFileList: function () {
        if (!this.form.id) return;
        OmsAttachment.queryOneAttachmentList(this.form.id, 'dev').then(res => {
          this.attachmentList = res.data;
          let ids = [];
          this.attachmentList.forEach(file => {
            ids.push(file.attachmentId);
          });
          this.form.attachmentIdList = ids;
        });
      },
      remove: function (item) {
        let index = this.form.goodsList.indexOf(item);
        // 移除删除项
        this.form.goodsList.splice(index, 1);
        // // 重新计算排序值
        // let delDtoList = this.form.goodsList;
        // let delList = [];
        // for (let i = 0; i < delDtoList.length ; i++) {
        //   let value = delDtoList[i];
        //   let no = value.index;
        //   // 比删除项大的排序值-1
        //   if (no > item.index) {
        //     value = Object.assign(value, {'index': no - 1});
        //   }
        //   delList.push(value);
        // }
        // this.form = {
        //   goodsList: delList
        // };
      },
      formatDeliveryTime: function (date) {
        if (!date) return '';
        this.form.deliveryTime = this.$moment(date).format('YYYY-MM-DD');
      },
      formatPickUpTime: function (date) {
        if (!date) return '';
        this.form.pickUpTime = this.$moment(date).format('YYYY-MM-DD');
      },
      setWholeBoxCount: function (value) {
        if (!value || isNaN(value)) return;
        this.form.wholeBoxCount = parseInt(value, 10);
      },
      setBulkBoxCount: function (value) {
        if (!value || isNaN(value)) return;
        this.form.bulkBoxCount = parseInt(value, 10);
      },
      setIncubatorCount: function (value) {
        if (!value || isNaN(value)) return;
        this.form.incubatorCount = parseInt(value, 10);
      },
      setGoodsWeight: function (value) {
        if (!value || isNaN(value)) return;
        this.form.goodsWeight = parseFloat(value);
      },
      setGoodsVolume: function (value) {
        if (!value || isNaN(value)) return;
        this.form.goodsVolume = parseFloat(value);
      },
      addGoods: function () {
        let tpl = {};
        // 计算排序值
        tpl = Object.assign(tpl, {goodsName: '', specifications: '', weight: '', volume: '', code: ''});
        this.form.goodsList.splice(0, 0, tpl);
      },
      filterCustomer: function (query) {// 过滤货主
        BaseInfo.query({keyWord: query}).then(res => {
          this.customerList = res.data.list;
        });
      },
      filterSenderOrg: function (query) {// 过滤发货单位
        BaseInfo.query({keyWord: query}).then(res => {
          this.senderOrgList = res.data.list;
        });
      },
      filterReceiverOrg: function (query) {// 过滤收货单位
        BaseInfo.query({keyWord: query}).then(res => {
          this.receiverOrgList = res.data.list;
        });
      },
      selectTab(item) {
        this.currentTab = item;
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            // 处理货品列表
            if (this.form.goodsList) {
              let goodsList = [];
              this.form.goodsList.forEach(val => {
                if (val.goodsName !== '' || val.specifications !== '' || val.weight !== '' || val.volume !== '' || val.code !== '') {
                  goodsList.push(val);
                }
              });
              this.form.goodsList = goodsList;
            }
            TmsWayBill.update(this.form.id, this.form).then(res => {
              this.$notify.success({
                name: '成功',
                message: '签收运单"' + this.form.orderNo + '"成功'
              });
              this.doing = false;
              this.$emit('change', res.data);
              this.$emit('right-close');
            }).catch(error => {
              this.$notify.error({
                duration: 2000,
                message: error.response && error.response.data && error.response.msg || '签收运单失败'
              });
              this.doing = false;
            });
          }
        });

      }
    }
  };
</script>
