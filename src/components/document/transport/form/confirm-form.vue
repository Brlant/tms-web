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
        <h2 class="clearfix right-title">确认运单</h2>
        <div class="dialog-left-list">
          <div class="dialog-left-item" v-for="(item, index) in dataList" :key="item.id"
               :class="{active:activeId === index}"
               @click="showOrder(item,index)">
            运单 {{ item.waybillNumber }}
          </div>
        </div>
        <div class="opera-btn">
          <div type="primary" class="btn" @click="createWayBill" :disabled="doing">生成运单</div>
        </div>
      </div>
      <div class="content-right min-row" v-show="form.id">
        <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
                {{pageSets[0].name}}</h3>
            </div>
            <div class="content">
              <two-column>`
                <el-form-item slot="left" label="运单号:" v-show="form.waybillNumber">
                  {{form.waybillNumber}}
                </el-form-item>
                <el-form-item slot="right" label="来源订单号:" v-show="form.orderNoList">
                <span v-for="order in form.orderNoList">{{order}}<span
                  v-if="form.orderNoList.indexOf(order)!==form.orderNoList.length-1">,</span></span>
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="运单类型:" v-show="form.waybillType">
                  <dict :dict-group="'bizType'" :dict-key="form.waybillType"></dict>
                </el-form-item>
                <el-form-item slot="right" label="发运方式:" v-show="form.shipmentWay">
                  <dict :dict-group="'transportationCondition'" :dict-key="form.shipmentWay"></dict>
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="创建人:" v-show="form.creatorName">
                  {{form.creatorName}}
                </el-form-item>
                <el-form-item slot="right" label="创建时间:" v-show="form.createTime">
                  {{form.createTime|time}}
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="修改人:" v-show="form.updateName">
                  {{form.updateName}}
                </el-form-item>
                <el-form-item slot="right" label="修改时间:" v-show="form.updateTime">
                  {{form.updateTime|time}}
                </el-form-item>
              </two-column>
              <!--<two-column>-->
              <!--<el-form-item slot="left" label="服务方式">-->
              <!--<dict :dict-group="'serviceType'" :dict-key="form.serviceType"></dict>-->
              <!--</el-form-item>-->
              <!--</two-column>-->
            </div>
            <div class="hr mb-10"></div>
          </div>
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">
                {{pageSets[1].name}}</h3>
            </div>
            <div class="content" v-show="form.orgName">
              <el-form-item label="货主:">
                {{form.orgName}}
              </el-form-item>
              <el-form-item label="发货单位:" v-show="form.senderName">
                {{form.senderName}}
              </el-form-item>
              <two-column>
                <el-form-item slot="left" label="发货联系人:" v-show="form.senderContact">
                  {{form.senderContact}}
                </el-form-item>
                <el-form-item slot="right" label="发货联系电话:" v-show="form.senderContactPhone">
                  {{form.senderContactPhone}}
                </el-form-item>
              </two-column>
              <el-form-item slot="right" label="发货地址:" v-show="form.senderAddress">
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
              <el-form-item label="收货单位:" v-show="form.receiverName">
                {{form.receiverName}}
              </el-form-item>
              <two-column>
                <el-form-item slot="left" label="收货联系人:" v-show="form.receiverContact">
                  {{form.receiverContact}}
                </el-form-item>
                <el-form-item slot="right" label="收货联系电话:" v-show="form.receiverContractPhone">
                  {{form.receiverContractPhone}}
                </el-form-item>
              </two-column>
              <el-form-item slot="right" label="收货地址:" v-show="form.receiverAddress">
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
                <el-form-item slot="left" label="整装箱数:" v-show="form.wholeBoxCount">
                  {{form.wholeBoxCount}}
                </el-form-item>
                <el-form-item slot="right" label="散装箱数:" v-show="form.bulkBoxCount">
                  {{form.bulkBoxCount}}
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="包件数:" v-show="form.incubatorCount">
                  {{form.incubatorCount}}
                </el-form-item>
                <el-form-item slot="right" label="声明价格:" v-show="form.goodsPrice">
                  <span v-if="form.goodsPrice">¥</span> {{form.goodsPrice}}
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="重量:" prop="goodsWeight" v-show="form.goodsWeight">
                  {{form.goodsWeight}} <span v-if="form.goodsWeight">kg</span>
                </el-form-item>
                <el-form-item slot="right" label="体积:" prop="goodsVolume" v-show="form.goodsVolume">
                  {{form.goodsVolume}} <span v-if="form.goodsVolume">m³</span>
                </el-form-item>
              </two-column>
              <el-form-item label="货品名称:" v-show="form.goodsTotalName">
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
                <el-form-item slot="left" label="提货时间:" v-show="form.pickUpTime">
                  {{form.pickUpTime|date}}
                </el-form-item>
                <el-form-item slot="right" label="送达时限:" v-show="form.deliveryTime">
                  {{form.deliveryTime|date}}
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="始发地:" v-show="form.provenance">
                  {{form.provenance}}
                </el-form-item>
                <el-form-item slot="right" label="目的地:" v-show="form.destination">
                  {{form.destination}}
                </el-form-item>
              </two-column>
              <el-form-item slot="right" label="备注:" v-show="form.remark">
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
              <div class="hr mb-10"></div>
            </div>
          </div>
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[6].key === currentTab.key}">
                {{pageSets[6].name}}</h3>
            </div>
            <div class="content">
              <el-table :data="form.incubatorDtoList" border style="width: 100%">
                <el-table-column prop="boxNo" label="保温箱编号" width="200">
                </el-table-column>
                <el-table-column prop="thermometerNoList" label="温度计列表">
                  <template slot-scope="scope">
                  <span v-for="no in scope.row.thermometerNoList">
                      {{no}} <span
                    v-if="scope.row.thermometerNoList.indexOf(no)!==scope.row.thermometerNoList.length-1">,</span>
                  </span>
                  </template>
                </el-table-column>
                <el-table-column prop="codeList" label="货品追溯码">
                  <template slot-scope="scope">
                 <span v-for="code in scope.row.codeList">
                      {{code}} <span v-if="scope.row.codeList.indexOf(code)!==scope.row.codeList.length-1">,</span>
                  </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[7].key === currentTab.key}">
                {{pageSets[7].name}}</h3>
            </div>
            <div class="content">
              <el-form-item label="签收人:" v-show="form.signPerson">
                {{form.signPerson}}
              </el-form-item>
              <el-form-item label="附件:">
                <attachment-lists :attachmentIdList="attachmentIdList" :objectId="form.id"
                                  :objectType="'waybill'"></attachment-lists>
              </el-form-item>
            </div>
          </div>
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[8].key === currentTab.key}">
                {{pageSets[8].name}}</h3>
            </div>
            <div class="content">
              <map-path :formItem="formItem"></map-path>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import TwoColumn from '@dtop/dtop-web-common/packages/two-column';
  import {TmsWayBill} from '@/resources';

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
          {name: '货品列表', key: 5},
          {name: '保温箱列表', key: 6},
          {name: '签收信息', key: 7},
          {name: '派送情况', key: 8}
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
        activeId: '',
        doing: false
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
        this.$confirm('是否确认运单信息?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doing = true;
          TmsWayBill.batchConfirmWayBill({orderIdList: this.orderIdList}).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功确认运单'
            });
            this.doing = false;
            this.$emit('change', this.orderIdList);
            this.$emit('right-close');
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.msg || '确认运单失败'
            });
            this.doing = false;
          });
        }).catch(() => {

        });
      },
      showOrder: function (item, index) {
        if (item.id) {
          TmsWayBill.getOneTmsWayBill(item.id).then(val => {
            this.form = val.data;
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
