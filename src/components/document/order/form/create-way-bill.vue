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
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">生成运单</h2>
        <div class="dialog-left-list">
          <div class="dialog-left-item" v-for="(item, index) in dataList" :key="item.id"
               :class="{active:activeId === index}"
               @click="showOrder(item,index)">
            订单 {{ item.orderNo }}
          </div>
        </div>
        <div class="opera-btn">
          <div type="primary" class="btn" @click="createWayBill">生成运单</div>
        </div>
      </div>
      <div class="content-right min-row" v-show="currentOrder.id">
        <el-form ref="currentOrder" :rules="rules" :model="currentOrder" class="clearfix" label-width="100px"
                 onsubmit="return false">
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
                {{pageSets[0].name}}</h3>
            </div>
            <div class="content">
              <two-column>
                <el-form-item slot="left" label="订单号">
                  {{currentOrder.orderNo}}
                </el-form-item>
                <el-form-item slot="right" label="订单类型">
                  <dict :dict-group="'transportationMeans'" :dict-key="currentOrder.waybillType"></dict>
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="发运方式">
                  <dict :dict-group="'transportationCondition'" :dict-key="currentOrder.shipmentWay"></dict>
                </el-form-item>
                <!--<el-form-item slot="right" label="服务方式">-->
                  <!--<dict :dict-group="'serviceType'" :dict-key="currentOrder.serviceType"></dict>-->
                <!--</el-form-item>-->
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
                {{currentOrder.orgName}}
              </el-form-item>
              <el-form-item label="发货单位">
                {{currentOrder.senderName}}
              </el-form-item>
              <two-column>
                <el-form-item slot="left" label="发货联系人">
                  {{currentOrder.senderContact}}
                </el-form-item>
                <el-form-item slot="right" label="发货联系电话">
                  {{currentOrder.senderContactPhone}}
                </el-form-item>
              </two-column>
              <el-form-item slot="right" label="发货地址">
                {{currentOrder.senderAddress}}
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
                {{currentOrder.receiverName}}
              </el-form-item>
              <two-column>
                <el-form-item slot="left" label="收货联系人">
                  {{currentOrder.receiverContact}}
                </el-form-item>
                <el-form-item slot="right" label="收货联系电话">
                  {{currentOrder.receiverContractPhone}}
                </el-form-item>
              </two-column>
              <el-form-item slot="right" label="收货地址">
                {{currentOrder.receiverAddress}}
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
                  {{currentOrder.wholeBoxCount}} <span v-if="currentOrder.wholeBoxCount">箱</span>
                </el-form-item>
                <el-form-item slot="right" label="散装箱数">
                  {{currentOrder.bulkBoxCount}} <span v-if="currentOrder.bulkBoxCount">箱</span>
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="包件数">
                  {{currentOrder.incubatorCount}} <span v-if="currentOrder.incubatorCount">件</span>
                </el-form-item>
                <el-form-item slot="right" label="声明价格">
                  <span v-if="currentOrder.goodsPrice">人民币</span> {{currentOrder.goodsPrice}}
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="重量" prop="goodsWeight">
                  {{currentOrder.goodsWeight}} <span v-if="currentOrder.goodsWeight">kg</span>
                </el-form-item>
                <el-form-item slot="right" label="体积" prop="goodsVolume">
                  {{currentOrder.goodsVolume}} <span v-if="currentOrder.goodsVolume">m³</span>
                </el-form-item>
              </two-column>
              <el-form-item label="货品名称">
                {{currentOrder.goodsTotalName}}
              </el-form-item>
            </div>
            <div class="hr mb-10"></div>
          </div>
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[5].key === currentTab.key}">
                {{pageSets[4].name}}</h3>
            </div>
            <div class="content">
              <two-column>
                <el-form-item slot="left" label="提货时间">
                  {{currentOrder.pickUpTime|date}}
                </el-form-item>
                <el-form-item slot="right" label="送达时限">
                  {{currentOrder.deliveryTime|date}}
                </el-form-item>
              </two-column>
              <el-form-item label="始发地">
                {{currentOrder.provenance}}
              </el-form-item>
              <el-form-item label="目的地">
                {{currentOrder.destination}}
              </el-form-item>
              <el-form-item slot="right" label="备注">
                {{currentOrder.remark}}
              </el-form-item>
            </div>
          </div>
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[5].key === currentTab.key}">
                {{pageSets[5].name}}</h3>
            </div>
            <div class="content">
              <el-table :data="currentOrder.goodsList" border style="width: 100%">
                <el-table-column prop="goodsName" label="货品名称" width="200">
                </el-table-column>
                <el-table-column prop="weight" label="货品重量(kg)">
                  <template slot-scope="scope">
                    {{scope.row.weight}}
                  </template>
                </el-table-column>
                <el-table-column prop="volume" label="货品体积(m³)">
                  <template slot-scope="scope">
                    {{scope.row.volume}}
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
      </div>
    </div>
  </div>
</template>
<script>
  import TwoColumn from '@dtop/dtop-web-common/packages/two-column';
  import {TmsOrder} from '@/resources';

  export default {
    components: {TwoColumn},
    data() {
      return {
        dataList: [],
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
        orderIdList: [],
        rules: {},
        currentOrder: {},
        activeId: ''
      };
    },
    computed: {},
    props: ['checkList'],
    watch: {
      checkList: function (val) {
        this.dataList = val;
        if (val.length) {
          this.dataList.forEach(val => {
            this.orderIdList.push(val.id);
          });
          this.showOrder(val[0], 0);
        }
      }
    },
    methods: {
      createWayBill: function () {
        this.$confirm('确认生成运单?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TmsOrder.createWayBill({orderIdList: this.orderIdList}).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功生成运单'
            });
            this.$emit('change', this.orderIdList);
            this.$emit('right-close');
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '生成运单失败'
            });
          });
        }).catch(() => {

        });
      },
      showOrder: function (item, index) {
        if (item.id) {
          TmsOrder.getOneTmsOrder(item.id).then(val => {
            this.currentOrder = val.data;
            this.activeId = index;
          });
        }
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
