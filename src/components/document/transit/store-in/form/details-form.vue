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
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">查看详情</template>
    <template slot="btn">
      <el-button plain @click="save('form')" :disabled="doing">关闭</el-button>
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
                <oms-col label="中转入库单号" :rowSpan="span" :value="form.waybillNumber"/>
                <div class=" clearfix"></div>
                <oms-col label="订单号" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="运单号" :rowSpan="span" :value="form.waybillNumber"/>

                <oms-col label="运单类型" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="运输条件" :rowSpan="span" :value="form.waybillNumber"/>

                <oms-col label="发货方式" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="货品名称" :rowSpan="span" :value="form.waybillNumber"/>

                <oms-col label="货主" :rowSpan="span" :value="form.waybillNumber"/>
                <div class=" clearfix"></div>
                <oms-col label="发货单位" :rowSpan="span" :value="form.waybillNumber"/>
                <div class=" clearfix"></div>
                <oms-col label="收货单位" :rowSpan="span" :value="form.waybillNumber"/>
                <div class="clearfix"></div>
                <oms-col label="整装箱数" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="散装箱数" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="实收整装箱数" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="实收散装箱数" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="实收散装箱数" :rowSpan="span" :value="form.waybillNumber"/>
                <oms-col label="实收散装箱数" :rowSpan="span" :value="form.waybillNumber"/>
                <div class="mb-10 clearfix"></div>
                <el-row>
                    <el-col :span="24">
                        <div>
                            <oms-row label="备注" :span="4">
                                <slot>{{ form.goodsTotalName }}</slot>
                            </oms-row>
                        </div>
                    </el-col>
                </el-row>
                <div class="hr mb-10 clearfix"></div>
            </div>
        </div>
        <div class="form-header-part">
            <div class="header">
                <div class="sign f-dib"></div>
                <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">
                {{pageSets[1].name}}</h3>
            </div>
            <div class="content">
                <oms-col label="库位码" :rowSpan="span" :value="form.waybillNumber"/>
                <div class="hr mb-10 clearfix"></div>
            </div>
        </div>
        <div class="form-header-part">
            <div class="header">
                <div class="sign f-dib"></div>
                <h3 class="tit f-dib index-tit" :class="{active: pageSets[2].key === currentTab.key}">
                {{pageSets[2].name}}</h3>
            </div>
            <div class="content">
                    <el-row :gutter="20" class="mb-15">
                        <oms-col label="入库整装箱数" :rowSpan="span" :value="form.waybillNumber"/>
                        <oms-col label="入库散装箱数" :rowSpan="span" :value="form.waybillNumber"/>
                        <div class="clearfix"></div>
                    </el-row>
                    <el-row class="mb-15">
                        <el-form-item label="扫描整装箱码" >
                            <oms-input v-model="form.note" type="textarea" :disabled="true"></oms-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="扫描散装箱码" >
                            <oms-input v-model="form.note" type="textarea" :disabled="true"></oms-input>
                        </el-form-item>
                    </el-row>
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
        // list: [],
        // times: [],
        pageSets: [
            {name: '任务详情', key: 0},
            {name: '库位信息', key: 1},
            {name: '上架详情', key: 2}
        ],
        currentTab: {},
        form: {
          id: '',
          // attachmentIdList: [],
          qualityInspection: '',
          broken:'2',
          note:''
        },
        doing: false,
        // rules: {
        //   integer: [
        //     {required: true, message: '请输入实收整装箱数', trigger: 'blur'}
        //   ],
        //   bulk: [
        //     {required: true, message: '请输入实收散装箱数', trigger: 'blur'}
        //   ],
        //   broken: [
        //     {required: true, message: '请选择是否合格', trigger: 'blur'}
        //   ]
        // },
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
    //   关闭
      save() {
        this.doing = false;
        this.$emit('right-close');
      }
    }
  }
  ;
</script>
