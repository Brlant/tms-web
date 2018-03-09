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
    <template slot="title">查看任务详情</template>
    <template slot="btn">
      <el-button plain @click="close()">关闭</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content">
            <two-column>
              <el-form-item slot="left" label="任务编码">
                {{form.transportTaskNo}}
              </el-form-item>
              <el-form-item slot="right" label="任务名称">
                {{form.taskName}}
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="任务类型">
                <dict :dict-group="'deliveryTaskType'" :dict-key="form.type"></dict>
              </el-form-item>
              <el-form-item slot="right" label="承运商">
                {{form.taskCarriers}}
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="车牌号">
                {{form.carPlateNumber}}
              </el-form-item>
              <el-form-item slot="right" label="司机">
                {{form.driverName}}
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="理货员">
                {{form.tallyClerk}}
              </el-form-item>
              <el-form-item slot="right" label="件数">
                {{form.incubatorCount}}
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="载重">
                {{form.carLoadBearing}} <span v-if="form.carLoadBearing">千克</span>
              </el-form-item>
              <el-form-item slot="right" label="容积">
                {{form.carVolume}} <span v-if="form.carVolume">立方米</span>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="创建人">
                {{form.creatorName}}
              </el-form-item>
              <el-form-item slot="right" label="创建时间">
                {{form.createTime|time}}
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="修改人">
                {{form.updateName}}
              </el-form-item>
              <el-form-item slot="right" label="修改时间">
                {{form.updateTime|time}}
              </el-form-item>
            </two-column>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">
              {{pageSets[1].name}}</h3>
          </div>
          <div class="content">
            <div class="part-hj-box" v-for="order in form.waybillList" v-show="form.waybillList">
              <two-column>
                <el-form-item slot="left" label="运单号">
                  {{order.waybillNumber}}
                </el-form-item>
                <el-form-item slot="right" label="运单状态">
                  {{getTaskStatus(order.status)}}
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="发货单位">
                  {{order.senderId}}
                </el-form-item>
                <el-form-item slot="right" label="收货单位">
                  {{order.receiverId}}
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="收货地址">
                  {{order.receiverAddress}}
                </el-form-item>
                <el-form-item slot="right" label="整件">
                  {{order.wholeBoxCount}}
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="散件">
                  {{order.bulkBoxCount}}
                </el-form-item>
                <el-form-item slot="right" label="包件">
                  {{order.wholeBoxCount}}
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="提货时间">
                  {{order.pickUpTime|date}}
                </el-form-item>
                <el-form-item slot="right" label="送达时间">
                  {{order.deliveryTime|date}}
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="体积">
                  {{order.goodsVolume}} <span v-if="order.goodsVolume">立方米</span>
                </el-form-item>
                <el-form-item slot="right" label="重量">
                  {{order.goodsWeight}} <span v-if="order.goodsWeight">千克</span>
                </el-form-item>
              </two-column>
            </div>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import TwoColumn from '@dtop/dtop-web-common/packages/two-column';
  import {TransportTask} from '../../../../resources';

  export default {
    components: {TwoColumn},
    data() {
      return {
        list: [],
        times: [],
        pageSets: [
          {name: '任务信息', key: 0},
          {name: '运单明细', key: 1}
        ],
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
        rules: {}
      };
    },
    computed: {},
    props: ['formItem'],
    watch: {
      formItem: function (val) {
        if (val.id) {
          TransportTask.getOneTransportTask(val.id).then(res => {
            this.form = res.data;
          });
        }
      }
    },
    methods: {
      getTaskStatus: function (item) {
        let title = '';
        if (item.status === '0') {
          title = '待生成运单';
        }
        if (item.status === '1') {
          title = '待派车';
        }
        if (item.status === '2') {
          title = '待启运';
        }
        if (item.status === '3') {
          title = '待签收';
        }
        if (item.status === '4') {
          title = '已完成';
        }
        return title;
      },
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('right-close');
      }
    }
  };
</script>
