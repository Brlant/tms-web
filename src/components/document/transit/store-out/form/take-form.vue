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
.el-form-item {
  margin-bottom: 0px;
}
::v-deep .hide .el-input__inner{
		border: 0;
	}
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">出库</template>
    <template slot="btn">
      <el-button plain @click="save('form')" :disabled="doing">出库</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="120px" onsubmit="return false">
        <div class="form-header-part">
            <div class="header">
                <div class="sign f-dib"></div>
                <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
                {{pageSets[0].name}}</h3>
            </div>
            <div class="content">
               <oms-row label="中转入库单号" >tob220427008</oms-row>
               <oms-row label="订单号" >PO9330922538</oms-row>
               <oms-row label="运单号" >preT220586008</oms-row>
               <oms-row label="运单类型" >销售出库</oms-row>
               <oms-row label="运输条件" >冷藏运输</oms-row>
               <oms-row label="发货方式" >上门取件</oms-row>
               <oms-row label="货主" >疾控中心XXX</oms-row>
               <oms-row label="收货单位" >疾控中心2XXX</oms-row>
               <oms-row class="mb-10" label="备注" ></oms-row>
                <div class="hr mb-10 clearfix"></div>
                <!-- <oms-col label="运单状态" :rowSpan="span" :value="form.status">
                {{ formatStatusTitle(form.status, orderType) }}
                </oms-col> -->
            </div>
        </div>
        <div class="form-header-part">
            <div class="header">
                <div class="sign f-dib"></div>
                <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">
                {{pageSets[1].name}}</h3>
            </div>
            <div class="content">

                <oms-col label="货品名称" :rowSpan="span" :value="form.waybillNumber"/>
                <div class="clearfix"></div>
                <oms-col label="出库整装箱数" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="出库散装箱数" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="重量kg" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="体积m³" :rowSpan="span" :value="form.waybillNumber"/>
                <div class="mb-10 clearfix"></div>
            </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
import {OmsAttachment, TmsWayBill} from '@/resources';

export default {
    data() {
      return {
        span:8,
        pageSets: [
            {name: '任务详情', key: 0},
            {name: '货品详情', key: 1},
        ],
        currentTab: {},
        form: {
          id: '',
          attachmentIdList: [],
          qualityInspection: '',
          broken:'2',
          note:''
        },
        doing: false,
        rules: {
          integer: [
            {required: true, message: '请输入实收整装箱数', trigger: 'blur'}
          ],
          bulk: [
            {required: true, message: '请输入实收散装箱数', trigger: 'blur'}
          ],
          broken: [
            {required: true, message: '请选择是否合格', trigger: 'blur'}
          ]
        },
        // customerList: [],
        // senderOrgList: [],
        // receiverOrgList: [],
        attachmentList: []
      };
    },
    // computed: {
    //   shipmentWayList() {
    //     return this.$getDict('shipmentWayType');
    //   },
    //   typeList() {
    //     return this.$getDict('transportationCondition');
    //   },
    //   serviceTypeList() {
    //     return this.$getDict('serviceType');
    //   }
    // },
    props: ['formItem', 'action'],
    watch: {
      formItem: function (val) {
        if (val.id) {
          this.form = val;
          this.getFileList();
        }
      }
    },
    methods: {
      setDoing(val) {
        this.doing = val;
      },
    // 详情
      getFileList: function () {
        if (!this.form.id) return;
        OmsAttachment.queryOneAttachmentList(this.form.id, 'waybill-check').then(res => {
          this.attachmentList = res.data;
          let ids = [];
          this.attachmentList.forEach(file => {
            ids.push(file.attachmentId);
          });
          this.form.attachmentIdList = ids;
        });
      },
    //   切换
      selectTab(item) {
        this.currentTab = item;
      },
    //   保存
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
              this.$confirm('是否确认出库?', '', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              }).then(() => {
                  // 确认出库

              }).catch(() => {

              });
          }
        })
        
        // this.$refs[formName].validate((valid) => {
        //   if (valid && this.doing === false) {
        //     this.$confirm('确认保存运单"' + this.form.waybillNumber + '"的评估结果?', '', {
        //       confirmButtonText: '确定',
        //       cancelButtonText: '取消',
        //       type: 'warning'
        //     }).then(() => {
        //       let tempForm = {
        //         flag: this.form.qualityFlag === null ? false : this.form.qualityFlag,
        //         qualityInspection: this.form.qualityInspection,
        //         attachmentIdList: this.form.attachmentIdList
        //       };
        //       this.doing = true;
        //       TmsWayBill.assessmentTmsWayBill(this.form.id, tempForm).then(res => {
        //         this.$notify.success({
        //           name: '成功',
        //           message: '保存运单"' + this.form.waybillNumber + '"评估结果成功'
        //         });
        //         this.doing = false;
        //         this.$emit('change', this.form);
        //         this.$emit('right-close');
        //       }).catch(error => {
        //         this.$notify.error({
        //           duration: 2000,
        //           message: error.response && error.response.data && error.response.data.msg || '保存运单评估结果失败'
        //         });
        //         this.doing = false;
        //       });
        //     });
        //   }
        // });

      }
    }
  }
  ;
</script>
