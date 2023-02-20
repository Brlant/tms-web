<style lang="scss" scoped>
$labelWidth: 220px;
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

.h40 ::v-deep .height20 {
  .el-col {
    line-height: 36px;
  }

  //&.lh26 {
  //  .col-label {
  //    line-height: 40px;
  //  }
  //}
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
          <!--          <el-button plain @click="$emit('entrustShow',true)" :disabled="doing" class="mb-10">委托第三方承运</el-button>-->
          <el-button plain @click="validate" :disabled="doing">生成运单</el-button>
        </div>
      </div>
      <div class="content-right min-row" v-show="currentOrder.id">
        <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
                {{ pageSets[0].name }}</h3>
            </div>
            <div class="content h40">
              <oms-col label="订单号" :rowSpan="span" :value="form.orderNo"/>
              <oms-col label="订单类型" :rowSpan="span" :value="form.waybillType">
                <dict :dict-group="'bizType'" :dict-key="form.waybillType"></dict>
              </oms-col>
              <oms-col label="发运方式" :rowSpan="span" :value="form.shipmentWay">
                <dict :dict-group="'transportationCondition'" :dict-key="form.shipmentWay"></dict>
              </oms-col>
              <oms-col label="委托单号" :rowSpan="span" :value="form.tmsOrderNumber"/>
              <oms-col label="创建人" :rowSpan="span" :value="form.creatorName"/>
              <oms-col label="创建时间" :rowSpan="span" :value="form.createTime">
                {{ form.createTime|time }}
              </oms-col>
              <oms-col label="修改人" :rowSpan="span" :value="form.updateName"/>
              <oms-col label="修改时间" :rowSpan="span" :value="form.updateTime">
                {{ form.updateTime|time }}
              </oms-col>
              <oms-col label="面单号" :rowSpan="span" :value="1">
                <oms-input model="text" v-model="carryInfo.faceSheetNo" min="0" placeholder="请输入面单号"></oms-input>
              </oms-col>
              <oms-col label="承运类型" :rowSpan="span" :value="1">
                <el-radio-group v-model="carryInfo.carryType" size="mini">
                  <el-radio :label="0">自行承运</el-radio>
                  <el-radio :label="1">第三方承运</el-radio>
                </el-radio-group>
              </oms-col>
              <oms-col label="承运商名称" :rowSpan="span" :value="carryInfo.carryType == 1"
                       v-show="carryInfo.carryType == 1">
                <el-select v-model="carryInfo.carrierId" placeholder="请选择承运商" filterable
                           size="mini">
                  <el-option v-for="item in carrierList"
                             :key="item.carrierId"
                             :label="item.carrierName"
                             :value="item.carrierId">
                    <span style="float: left" title="承运商名称">{{ item.carrierName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px" title="承运条件">{{
                        item.transportationConditions|transName
                      }}</span>
                  </el-option>
                </el-select>

              </oms-col>

              <oms-col label="是否投保" :rowSpan="span" :value="1">
                <el-radio-group v-model="carryInfo.insure" size="mini">
                  <el-radio :label="false">否</el-radio>
                  <el-radio :label="true">是</el-radio>
                </el-radio-group>
              </oms-col>
              <oms-col label="投保金额（元）" :rowSpan="span" :value="1" v-show="carryInfo.insure">
                <oms-input model="text" v-model="carryInfo.insureAmount" :min="0" :max="99999999.99"
                           placeholder="请输入投保金额,最多保留两位小数"
                           @blur="insureAmountFormat">
                  <template slot="prepend">¥</template>
                </oms-input>
              </oms-col>
            </div>
            <div class="hr mb-10 clearfix"></div>
          </div>
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">
                {{ pageSets[1].name }}</h3>
            </div>
            <div class="content">
              <oms-col label="货主" :rowSpan="span" :value="form.orgName"/>
              <oms-col label="发货单位" :rowSpan="span" :value="form.senderName"/>
              <oms-col label="发货联系人" :rowSpan="span" :value="form.senderContact"/>
              <oms-col label="电话" :rowSpan="span" :value="form.senderContactPhone"/>
              <oms-col label="发货地址" :rowSpan="span" :value="form.senderAddress"/>
            </div>
            <div class="hr mb-10 clearfix"></div>
          </div>
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[2].key === currentTab.key}">
                {{ pageSets[2].name }}</h3>
            </div>
            <div class="content">
              <oms-col label="收货单位" :rowSpan="span" :value="form.receiverName"/>
              <oms-col label="收货联系人" :rowSpan="span" :value="form.receiverContact"/>
              <oms-col label="电话" :rowSpan="8" :value="form.receiverContractPhone"/>
              <oms-col label="收货地址" :rowSpan="6" :value="form.receiverAddress"/>
            </div>
            <div class="hr mb-10 clearfix"></div>
          </div>
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[3].key === currentTab.key}">
                {{ pageSets[3].name }}</h3>
            </div>
            <div class="content">
              <oms-col label="整装箱数" :rowSpan="span" :value="form.wholeBoxCount" isShow="true"/>
              <oms-col label="散装箱数" :rowSpan="span" :value="form.bulkBoxCount" isShow="true"/>
              <!--<oms-col label="包件数" :rowSpan="span" :value="form.incubatorCount" isShow="true"/>-->
              <oms-col label="声明价格" :rowSpan="span" :value="form.goodsPrice" isShow="true">
                <span v-if="form.goodsPrice">¥</span> {{ form.goodsPrice }}
              </oms-col>
              <oms-col label="重量" :rowSpan="span" :value="form.goodsWeight" isShow="true">
                {{ form.goodsWeight }} <span v-if="form.goodsWeight">kg</span>
              </oms-col>
              <oms-col label="体积" :rowSpan="span" :value="form.goodsVolume" isShow="true">
                {{ form.goodsVolume }} <span v-if="form.goodsVolume">m³</span>
              </oms-col>
              <el-col :span="24">
                <div>
                  <oms-row label="货品名称" :span="4">
                    <slot>{{ form.goodsTotalName }}</slot>
                  </oms-row>
                </div>
              </el-col>
            </div>
            <div class="hr mb-10 clearfix"></div>
          </div>
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[4].key === currentTab.key}">
                {{ pageSets[4].name }}</h3>
            </div>
            <div class="content">
              <oms-col label="提货时间" :rowSpan="span" :value="form.pickUpTime">{{ form.pickUpTime|date }}</oms-col>
              <oms-col label="送达时限" :rowSpan="span" :value="form.deliveryTime">{{ form.deliveryTime|date }}</oms-col>
              <oms-col :rowSpan="span" :value="form.provenance | formatAddress" label="始发地"/>
              <oms-col :rowSpan="span" :value="form.destination | formatAddress" label="目的地"/>
              <oms-col label="备注" :rowSpan="span" :value="form.remark"/>
              <div class="hr mb-10 clearfix"></div>
            </div>
          </div>
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[5].key === currentTab.key}">
                {{ pageSets[5].name }}</h3>
            </div>
            <div class="content">
              <el-table :data="form.goodsList" border style="width: 100%">
                <el-table-column prop="goodsName" label="货品名称" width="200">
                </el-table-column>
                <el-table-column prop="weight" label="货品重量(kg)">
                  <template v-slot="scope">
                    {{ scope.row.weight }}
                  </template>
                </el-table-column>
                <el-table-column prop="volume" label="货品体积(m³)">
                  <template v-slot="scope">
                    {{ scope.row.volume }}
                  </template>
                </el-table-column>
                <el-table-column prop="specifications" label="货品规格">
                </el-table-column>
                <el-table-column prop="code" label="追溯码">
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[6].key === currentTab.key}">
                {{ pageSets[6].name }}</h3>
            </div>
            <div class="content">
              <map-path :formItem="form"></map-path>
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
import MapPath from '../../common/map-list-new';
import utils from '@/tools/utils'

export default {
  components: {TwoColumn, MapPath},
  props: ['checkList', 'carrierList'],
  data() {
    return {
      span: 8,
      dataList: [],
      times: [],
      pageSets: [
        {name: '基本信息', key: 0},
        {name: '发货信息', key: 1},
        {name: '收货信息', key: 2},
        {name: '货品信息', key: 3},
        {name: '其他信息', key: 4},
        {name: '货品列表', key: 5},
        {name: '派送信息', key: 6}
      ],
      currentTab: {},
      form: {
        // 修改人
        updateName:'',
        goodsList: [
          {
            goodsName: '',
            specifications: '',
            weight: '',
            volume: '',
            code: ''
          }
        ],
        creatorName: '',
      },
      wayBillParams: [],
      rules: {},
      currentOrder: {},
      activeId: '',
      doing: false,
    };
  },
  computed: {
    carryInfo() {
      if (this.activeId === '') {
        return {
          "orderId": "", //订单id
          "faceSheetNo": "",//面单号
          "carryType": 0, //承运类型
          "carrierId": "", //承运商id
          "insure": false, //是否投保
          "insureAmount": 10 //投保金额
        };
      }

      return this.wayBillParams[this.activeId];
    }
  },

  watch: {
    checkList(newList) {
      this.dataList = newList;
      this.wayBillParams = [];
      if (newList.length > 0) {
        this.wayBillParams = this.dataList.map(data => {
          return {
            "orderId": data.id,
            "faceSheetNo": data.faceSheetNo || '',
            "carryType": 0,
            "insure": false,
            "insureAmount": '',
            "carrierId": ''
          }
        });
        this.showOrder(newList[0], 0);
      }
    }
  },
  filters: {
    transName(val) {
      if (val === 'A') {
        return '全部';
      } else if (val === 'B') {
        return '冷链运输';
      } else if (val === 'C') {
        return '常温运输';
      } else {
        return '';
      }
    }
  },
  methods: {
    insureAmountFormat() {// 格式化单价，保留两位小数
      this.carryInfo.insureAmount = utils.autoformatDecimalPoint(this.carryInfo.insureAmount);
    },
    checkError() {
      let error = false;
      for (const item of this.wayBillParams) {
        // 没选择承运商
        if (item.carryType === 1 && !item.carrierId) {
          this.$notify.warning("包含必填项未填写");
          error = true;
          break;
        }

        // 没填写投保金额
        if (item.insure && !item.insureAmount) {
          this.$notify.warning("包含必填项未填写");
          error = true;
          break;
        }

        // 没填写投保金额
        if (item.insure && item.insureAmount > 99999999.99) {
          this.$notify.warning("投保金额最多99999999.99元");
          this.carryInfo.insureAmount = 99999999.99;
          error = true;
          break;
        }
      }

      return error;
    },
    validate() {
      if (this.checkError()) return;

      this.$confirm('确认生成运单?', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认后调用接口
        this.createSingleWayBill();
      }).catch(() => {
        // 取消不做任何处理
      });
    },
    createSingleWayBill() {
      this.doing = true;

      let wayBillParams = this.wayBillParams;
      wayBillParams.forEach(wb=>{
        if (wb.carryType === 0) {
          wb.carrierId = '';
        }
      })

      TmsOrder.createSingleWayBill({wayBillParams}).then(() => {
        this.$notify.success({
          duration: 2000,
          title: '成功',
          message: '已成功生成运单'
        });
        this.doing = false;
        this.$emit('change');
        this.$emit('right-close');
      }).catch(error => {
        this.$notify.error({
          duration: 2000,
          message: error.response && error.response.data && error.response.data.msg || '生成运单失败'
        });
        this.doing = false;
      });
    },
    showOrder: function (item, index) {
      if (item.id) {
        TmsOrder.getOneTmsOrder(item.id).then(val => {
          this.currentOrder = val.data;
          this.form = val.data;
          this.activeId = index;
        });
      }
    },
    close() {
      this.$emit('right-close');
    },
  },
};
</script>
