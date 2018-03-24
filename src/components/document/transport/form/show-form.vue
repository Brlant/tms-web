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
            <oms-col label="运单号" :rowSpan="span" :value="form.waybillNumber"/>
            <oms-col label="来源订单号" :rowSpan="span" :value="form.orderNoList">
                 <span v-for="order in form.orderNoList">{{order}}<span
                   v-if="form.orderNoList.indexOf(order)!==form.orderNoList.length-1">,</span></span>
            </oms-col>
            <oms-col label="运单类型" :rowSpan="span" :value="form.waybillType">
              <dict :dict-group="'bizType'" :dict-key="form.waybillType"></dict>
            </oms-col>
            <oms-col label="发运方式" :rowSpan="span" :value="form.shipmentWay">
              <dict :dict-group="'transportationCondition'" :dict-key="form.shipmentWay"></dict>
            </oms-col>
            <oms-col label="创建人" :rowSpan="span" :value="form.creatorName"/>
            <oms-col label="创建时间" :rowSpan="span" :value="form.createTime">{{form.createTime|time}}</oms-col>
            <oms-col label="修改人" :rowSpan="span" :value="form.updateName"/>
            <oms-col label="修改时间" :rowSpan="span" :value="form.updateTime">{{form.updateTime|time}}</oms-col>

            <!--<two-column>-->
              <!--<el-form-item slot="left" label="运单号:" v-show="form.waybillNumber">-->
                <!--{{form.waybillNumber}}-->
              <!--</el-form-item>-->
              <!--<el-form-item slot="right" label="来源订单号:" v-show="form.orderNoList">-->
                <!--<span v-for="order in form.orderNoList">{{order}}<span-->
                  <!--v-if="form.orderNoList.indexOf(order)!==form.orderNoList.length-1">,</span></span>-->
              <!--</el-form-item>-->
            <!--</two-column>-->
            <!--<two-column>-->
              <!--<el-form-item slot="left" label="运单类型:" v-show="form.waybillType">-->
                <!--<dict :dict-group="'bizType'" :dict-key="form.waybillType"></dict>-->
              <!--</el-form-item>-->
              <!--<el-form-item slot="right" label="发运方式:" v-show="form.shipmentWay">-->
                <!--<dict :dict-group="'transportationCondition'" :dict-key="form.shipmentWay"></dict>-->
              <!--</el-form-item>-->
            <!--</two-column>-->
            <!--<two-column>-->
              <!--<el-form-item slot="left" label="创建人:" v-show="form.creatorName">-->
                <!--{{form.creatorName}}-->
              <!--</el-form-item>-->
              <!--<el-form-item slot="right" label="创建时间:" v-show="form.createTime">-->
                <!--{{form.createTime|time}}-->
              <!--</el-form-item>-->
            <!--</two-column>-->
            <!--<two-column>-->
              <!--<el-form-item slot="left" label="修改人:" v-show="form.updateName">-->
                <!--{{form.updateName}}-->
              <!--</el-form-item>-->
              <!--<el-form-item slot="right" label="修改时间:" v-show="form.updateTime">-->
                <!--{{form.updateTime|time}}-->
              <!--</el-form-item>-->
            <!--</two-column>-->
            <!--<two-column>-->
              <!--<el-form-item slot="left" label="服务方式">-->
                <!--<dict :dict-group="'serviceType'" :dict-key="form.serviceType"></dict>-->
              <!--</el-form-item>-->
            <!--</two-column>-->
          </div>
          <div class="hr mb-10 clearfix"></div>
        </div>
        <div class="form-header-part ">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">
              {{pageSets[1].name}}</h3>
          </div>
          <div class="content">

            <oms-col label="货主" :rowSpan="span" :value="form.orgName"/>
            <oms-col label="发货单位" :rowSpan="span" :value="form.senderName"/>
            <oms-col label="发货联系人" :rowSpan="span" :value="form.senderContact"/>
            <oms-col label="发货联系电话" :rowSpan="span" :value="form.senderContactPhone"/>
            <oms-col label="发货地址" :rowSpan="span" :value="form.senderAddress"/>


            <!--<el-form-item label="货主:">-->
              <!--{{form.orgName}}-->
            <!--</el-form-item>-->
            <!--<el-form-item label="发货单位:" v-show="form.senderName">-->
              <!--{{form.senderName}}-->
            <!--</el-form-item>-->
            <!--<two-column>-->
              <!--<el-form-item slot="left" label="发货联系人:" v-show="form.senderContact">-->
                <!--{{form.senderContact}}-->
              <!--</el-form-item>-->
              <!--<el-form-item slot="right" label="发货联系电话:" v-show="form.senderContactPhone">-->
                <!--{{form.senderContactPhone}}-->
              <!--</el-form-item>-->
            <!--</two-column>-->
            <!--<el-form-item slot="right" label="发货地址:" v-show="form.senderAddress">-->
              <!--{{form.senderAddress}}-->
            <!--</el-form-item>-->
          </div>
          <div class="hr mb-10 clearfix"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[2].key === currentTab.key}">
              {{pageSets[2].name}}</h3>
          </div>
          <div class="content">
            <oms-col label="收货单位" :rowSpan="span" :value="form.receiverName"/>
            <oms-col label="收货联系人" :rowSpan="span" :value="form.receiverContact"/>
            <oms-col label="收货联系电话" :rowSpan="8" :value="form.receiverContractPhone"/>
            <oms-col label="收货地址" :rowSpan="6" :value="form.receiverAddress"/>

            <!--<el-form-item label="收货单位:" v-show="form.receiverName">-->
              <!--{{form.receiverName}}-->
            <!--</el-form-item>-->
            <!--<two-column>-->
              <!--<el-form-item slot="left" label="收货联系人:" v-show="form.receiverContact">-->
                <!--{{form.receiverContact}}-->
              <!--</el-form-item>-->
              <!--<el-form-item slot="right" label="收货联系电话:" v-show="form.receiverContractPhone">-->
                <!--{{form.receiverContractPhone}}-->
              <!--</el-form-item>-->
            <!--</two-column>-->
            <!--<el-form-item slot="right" label="收货地址:" v-show="form.receiverAddress">-->
              <!--{{form.receiverAddress}}-->
            <!--</el-form-item>-->
          </div>
          <div class="hr mb-10 clearfix"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[3].key === currentTab.key}">
              {{pageSets[3].name}}</h3>
          </div>
          <div class="content">
            <oms-col label="整装箱数" :rowSpan="span" :value="form.wholeBoxCount"/>
            <oms-col label="散装箱数" :rowSpan="span" :value="form.bulkBoxCount"/>
            <oms-col label="包件数" :rowSpan="span" :value="form.incubatorCount"/>
            <oms-col label="声明价格" :rowSpan="span" :value="form.goodsPrice">
              <span v-if="form.goodsPrice">¥</span> {{form.goodsPrice}}
            </oms-col>
            <oms-col label="重量" :rowSpan="span" :value="form.goodsWeight">
              {{form.goodsWeight}} <span v-if="form.goodsWeight">kg</span>
            </oms-col>
            <oms-col label="体积" :rowSpan="span" :value="form.goodsVolume">
              {{form.goodsVolume}} <span v-if="form.goodsVolume">m³</span>
            </oms-col>
            <oms-col label="货品名称" :rowSpan="span" :value="form.goodsTotalName"/>

            <!--<two-column>-->
              <!--<el-form-item slot="left" label="整装箱数:" v-show="form.wholeBoxCount">-->
                <!--{{form.wholeBoxCount}}-->
              <!--</el-form-item>-->
              <!--<el-form-item slot="right" label="散装箱数:" v-show="form.bulkBoxCount">-->
                <!--{{form.bulkBoxCount}}-->
              <!--</el-form-item>-->
            <!--</two-column>-->
            <!--<two-column>-->
              <!--<el-form-item slot="left" label="包件数:" v-show="form.incubatorCount">-->
                <!--{{form.incubatorCount}}-->
              <!--</el-form-item>-->
              <!--<el-form-item slot="right" label="声明价格:" v-show="form.goodsPrice">-->
                <!--<span v-if="form.goodsPrice">¥</span> {{form.goodsPrice}}-->
              <!--</el-form-item>-->
            <!--</two-column>-->
            <!--<two-column>-->
              <!--<el-form-item slot="left" label="重量:" prop="goodsWeight" v-show="form.goodsWeight">-->
                <!--{{form.goodsWeight}} <span v-if="form.goodsWeight">kg</span>-->
              <!--</el-form-item>-->
              <!--<el-form-item slot="right" label="体积:" prop="goodsVolume" v-show="form.goodsVolume">-->
                <!--{{form.goodsVolume}} <span v-if="form.goodsVolume">m³</span>-->
              <!--</el-form-item>-->
            <!--</two-column>-->
            <!--<el-form-item label="货品名称:" v-show="form.goodsTotalName">-->
              <!--{{form.goodsTotalName}}-->
            <!--</el-form-item>-->
          </div>
          <div class="hr mb-10 clearfix"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[4].key === currentTab.key}">
              {{pageSets[4].name}}</h3>
          </div>
          <div class="content">
            <oms-col label="提货时间" :rowSpan="span" :value="form.pickUpTime">{{form.pickUpTime|date}}</oms-col>
            <oms-col label="送达时限" :rowSpan="span" :value="form.deliveryTime">{{form.deliveryTime|date}}</oms-col>

            <oms-col label="始发地" :rowSpan="span" :value="form.provenance"/>
            <oms-col label="目的地" :rowSpan="span" :value="form.destination"/>
            <oms-col label="备注" :rowSpan="span" :value="form.remark"/>

            <!--<two-column>-->
              <!--<el-form-item slot="left" label="提货时间:" v-show="form.pickUpTime">-->
                <!--{{form.pickUpTime|date}}-->
              <!--</el-form-item>-->
              <!--<el-form-item slot="right" label="送达时限:" v-show="form.deliveryTime">-->
                <!--{{form.deliveryTime|date}}-->
              <!--</el-form-item>-->
            <!--</two-column>-->
            <!--<two-column>-->
              <!--<el-form-item slot="left" label="始发地:" v-show="form.provenance">-->
                <!--{{form.provenance}}-->
              <!--</el-form-item>-->
              <!--<el-form-item slot="right" label="目的地:" v-show="form.destination">-->
                <!--{{form.destination}}-->
              <!--</el-form-item>-->
            <!--</two-column>-->
            <!--<el-form-item slot="right" label="备注:" v-show="form.remark">-->
              <!--{{form.remark}}-->
            <!--</el-form-item>-->
            <div class="hr mb-10 clearfix"></div>
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
    </template>
  </dialog-template>
</template>
<script>
  import TwoColumn from '@dtop/dtop-web-common/packages/two-column';
  import {TmsWayBill} from '@/resources';
  import MapPath from '../../common/map-path-new';
  import attachmentLists from '../../../common/attachment/attachmentList';

  export default {
    components: {TwoColumn, MapPath, attachmentLists},
    data() {
      return {
        span: 7,
        list: [],
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
        rules: {},
        attachmentIdList: []
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
