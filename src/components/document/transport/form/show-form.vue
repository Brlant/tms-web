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
    <template slot="title">查看运单</template>
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
              <el-form-item slot="left" label="运单号">
                {{form.waybillNumber}}
              </el-form-item>
              <el-form-item slot="right" label="委托单号">
                {{form.tmsOrderNumber}}
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="运单类型">
                <dict :dict-group="'tmsOrderType'" :dict-key="form.waybillType"></dict>
              </el-form-item>
              <el-form-item slot="right" label="发运方式">
                <dict :dict-group="'shipmentWayType'" :dict-key="form.shipmentWay"></dict>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="服务方式">
                <dict :dict-group="'serviceType'" :dict-key="form.serviceType"></dict>
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
            <el-form-item label="货主">
              {{form.orgName}}
            </el-form-item>
            <el-form-item label="发货单位">
              {{form.senderName}}
            </el-form-item>
            <two-column>
              <el-form-item slot="left" label="发货联系人">
                {{form.senderContact}}
              </el-form-item>
              <el-form-item slot="right" label="发货联系电话">
                {{form.senderContactPhone}}
              </el-form-item>
            </two-column>
            <el-form-item slot="right" label="发货地址">
              {{form.senderAddress}}
            </el-form-item>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[2].key === currentTab.key}">
              {{pageSets[2].name}}</h3>
          </div>
          <div class="content">
            <el-form-item label="收货单位">
              {{form.receiverName}}
            </el-form-item>
            <two-column>
              <el-form-item slot="left" label="收货联系人">
                {{form.receiverContact}}
              </el-form-item>
              <el-form-item slot="right" label="收货联系电话">
                {{form.receiverContractPhone}}
              </el-form-item>
            </two-column>
            <el-form-item slot="right" label="收货地址">
              {{form.receiverAddress}}
            </el-form-item>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[3].key === currentTab.key}">
              {{pageSets[3].name}}</h3>
          </div>
          <div class="content">
            <two-column>
              <el-form-item slot="left" label="整装箱数">
                {{form.wholeBoxCount}}
              </el-form-item>
              <el-form-item slot="right" label="散装箱数">
                {{form.bulkBoxCount}}
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="包件数">
                {{form.incubatorCount}}
              </el-form-item>
              <el-form-item slot="right" label="声明价格">
                <span v-if="form.goodsPrice">¥</span> {{form.goodsPrice}}
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="重量" prop="goodsWeight">
                {{form.goodsWeight}} <span v-if="form.goodsWeight">kg</span>
              </el-form-item>
              <el-form-item slot="right" label="体积" prop="goodsVolume">
                {{form.goodsVolume}} <span v-if="form.goodsVolume">m³</span>
              </el-form-item>
            </two-column>
            <el-form-item label="货品名称">
              {{form.goodsTotalName}}
            </el-form-item>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[4].key === currentTab.key}">
              {{pageSets[4].name}}</h3>
          </div>
          <div class="content">
            <two-column>
              <el-form-item slot="left" label="提货时间">
                {{form.pickUpTime|date}}
              </el-form-item>
              <el-form-item slot="right" label="送达时限">
                {{form.deliveryTime|date}}
              </el-form-item>
            </two-column>
            <el-form-item label="始发地">
              {{form.provenance}}
            </el-form-item>
            <el-form-item label="目的地">
              {{form.destination}}
            </el-form-item>
            <el-form-item slot="right" label="备注">
              {{form.remark}}
            </el-form-item>
            <div class="hr mb-10"></div>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[5].key === currentTab.key}">
              {{pageSets[5].name}}</h3>
          </div>
          <div class="content">
            <el-table :data="form.goodsList" border style="width: 100%">
              <el-table-column prop="goodsName" label="货品名称">
              </el-table-column>
              <el-table-column prop="weight" label="货品重量">
                <template slot-scope="scope">
                  {{scope.row.weight}} <span v-if="scope.row.weight">kg</span>
                </template>
              </el-table-column>
              <el-table-column prop="volume" label="货品体积">
                <template slot-scope="scope">
                  {{scope.row.volume}} <span v-if="scope.row.volume">m³</span>
                </template>
              </el-table-column>
              <el-table-column prop="specifications" label="货品规格">
              </el-table-column>
              <el-table-column prop="code" label="货品追溯码">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import TwoColumn from '@dtop/dtop-web-common/packages/two-column';
  import {TmsWayBill} from '@/resources';

  export default {
    components: {TwoColumn},
    data() {
      return {
        list: [],
        times: [],
        pageSets: [
          {name: '基本信息', key: 0},
          {name: '发货信息', key: 1},
          {name: '收货信息', key: 2},
          {name: '货品信息', key: 3},
          {name: '其他信息', key: 4},
          {name: '货品列表', key: 5}
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
          TmsWayBill.getOneTmsWayBill(val.id).then(res => {
            this.form = res.data;
          });
        }
      }
    },
    methods: {
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('right-close');
      }
    }
  };
</script>
