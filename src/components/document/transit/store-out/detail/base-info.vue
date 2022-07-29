<style lang="scss" scoped>
  @import "~@/assets/scss/mixins";

  .table-product-list {
    thead {
      background: $tableHeaderColor;
    }

    margin-top: 10px;
    font-size: 14px;

    > tbody > tr > td, > thead > tr > th {
      padding: 5px;
    }

    .table-product-item {
      border-bottom: 1px solid #eee;

      &:hover {
        background: $dialog-left-bg;
      }
    }
  }
</style>
<template>
  <div>
    <div v-if="!currentOrder.id">
      <oms-loading :loading="!currentOrder.id"></oms-loading>
    </div>
    <div v-else class="page-main-body padding out-order-info">

      <el-row style="margin-bottom:0;position: relative"
              v-show=" currentOrder.bizType !== '2-2' && currentOrder.bizType !== '2-4' ">
        <el-col :span="12">
          <oms-row label="货主订单号">
            {{currentOrder.orderNo}}
          </oms-row>
          <oms-row label="货主">
            {{currentOrder.orgName}}
          </oms-row>
          <oms-row label="去向订单号"
                   v-show=" (currentOrder.bizType==='2-0'||currentOrder.bizType==='2-1') && currentOrder.thirdPartyNumber">
            {{currentOrder.thirdPartyNumber}}
          </oms-row>
          <oms-row label="去向单位" v-show=" currentOrder.bizType !== '2-3' ">
            {{currentOrder.customerName}}
          </oms-row>
          <oms-row label="去向单位仓库地址">
            {{currentOrder.warehouseAddress}}
          </oms-row>
          <oms-row label="运输条件">
            <dict :dict-group="'transportationCondition'" :dict-key="currentOrder.transportationCondition"></dict>
          </oms-row>
          <oms-row label="货主仓库地址">
            <span class="goods-span">{{currentOrder.outWarehouseAddress}}</span>
          </oms-row>
          <oms-row label="退货原因" v-show="currentOrder.bizType === '2-1' && currentOrder.returnReason ">
            {{ currentOrder.returnReason }}
          </oms-row>
          <oms-row label="备注">{{ currentOrder.orderRemark }}</oms-row>
          <oms-row v-show="currentOrder.handoverTime" label="交付时间">
            {{currentOrder.handoverTime|time}}
          </oms-row>
          <oms-row v-show="currentOrder.orgHandlers" label="本单位交接人员">
            {{currentOrder.orgHandlers}}
          </oms-row>
          <oms-row v-show="currentOrder.handoverRemark&&currentOrder.handoverTime" label="交接备注">
            {{currentOrder.handoverRemark}}
          </oms-row>
          <oms-row v-show="currentOrder.handoverRemark&&!currentOrder.handoverTime" label="中止交付原因">
            <span class="goods-span">{{currentOrder.handoverRemark}}</span>
          </oms-row>
        </el-col>
        <el-col :span="12">
          <oms-row label="业务类型">
            <dict :dict-group="'bizOutType'" :dict-key="currentOrder.bizType"></dict>
          </oms-row>
          <oms-row label="物流方式">
            <dict :dict-group="'outTransportMeans'" :dict-key="currentOrder.transportationMeansId"></dict>
          </oms-row>
          <oms-row label="下单时间">
            <span class="goods-span">{{currentOrder.createTime | minute}}</span>
          </oms-row>
          <oms-row label="出库完成时间">{{currentOrder.completeTime | minute}}</oms-row>
          <oms-row :label="getTimeTitle(currentOrder)" v-show="currentOrder.expectedTime">
            <span class="goods-span">{{currentOrder.expectedTime | date}}</span>
          </oms-row>
          <oms-row label="是否合格"
                   v-show="(currentOrder.bizType === '2-1'||currentOrder.bizType === '2-3'||currentOrder.bizType === '2-4') && (typeof currentOrder.qualifiedFlag === 'boolean')">
            <span class="goods-span" v-show="currentOrder.qualifiedFlag">合格</span>
            <span class="goods-span" style="color: red" v-show="!currentOrder.qualifiedFlag">不合格</span>
          </oms-row>
          <oms-row label="物流中心">
            <span class="goods-span">{{currentOrder.centreName}}</span>
          </oms-row>
          <oms-row label="客户备注">{{ currentOrder.remark }}</oms-row>
          <oms-row label="订单状态">
            {{ getOrderStatus(currentOrder) }}
            <el-tag type="warning" v-show="currentOrder.rushOrderFlag">急</el-tag>
          </oms-row>
          <oms-row v-show="currentOrder.transactOrgHandlers" label="交接提货人">
            {{currentOrder.transactOrgHandlers}}
          </oms-row>
          <oms-row v-show="currentOrder.carNo" label="交接提货车辆">
            {{currentOrder.carNo}}
          </oms-row>
        </el-col>
      </el-row>
      <div v-show=" currentOrder.bizType === '2-2'">
        <el-row style="margin-bottom: 0">
          <oms-row label="货主订单号" :span="5">{{ currentOrder.orderNo }}</oms-row>
        </el-row>
        <el-row style="margin-bottom:0">
          <el-col :span="12">
            <oms-row label="货主">
              {{currentOrder.orgName}}
            </oms-row>
            <oms-row label="业务类型">
              <dict :dict-group="'bizOutType'" :dict-key="currentOrder.bizType"></dict>
            </oms-row>
            <oms-row label="货主仓库地址">
              <span class="goods-span">{{currentOrder.outWarehouseAddress}}</span>
            </oms-row>
            <oms-row label="物流中心">
              <span class="goods-span">{{currentOrder.centreName}}</span>
            </oms-row>
            <oms-row v-show="currentOrder.handoverTime" label="交付时间">
              {{currentOrder.handoverTime|time}}
            </oms-row>
            <oms-row v-show="currentOrder.orgHandlers" label="本单位交接人员">
              {{currentOrder.orgHandlers}}
            </oms-row>
            <oms-row v-show="currentOrder.handoverRemark&&currentOrder.handoverTime" label="交接备注">
              {{currentOrder.handoverRemark}}
            </oms-row>
            <oms-row v-show="currentOrder.handoverRemark&&!currentOrder.handoverTime" label="中止交付原因">
              <span class="goods-span">{{currentOrder.handoverRemark}}</span>
            </oms-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="下单时间">
              <span class="goods-span">{{currentOrder.createTime | minute}}</span>
            </oms-row>
            <oms-row label="出库完成时间">{{currentOrder.completeTime | minute}}</oms-row>
            <oms-row label="是否合格"
                     v-show="(currentOrder.bizType === '2-1'||currentOrder.bizType === '2-3'||currentOrder.bizType === '2-4') && (typeof currentOrder.qualifiedFlag === 'boolean')">
              <span class="goods-span" v-show="currentOrder.qualifiedFlag">合格</span>
              <span class="goods-span" style="color: red" v-show="!currentOrder.qualifiedFlag">不合格</span>
            </oms-row>
            <oms-row label="客户备注">{{ currentOrder.remark }}</oms-row>
            <oms-row :label="备注">{{ currentOrder.orderRemark }}</oms-row>
            <oms-row label="订单状态">
              {{ getOrderStatus(currentOrder) }}
              <el-tag type="warning" v-show="currentOrder.rushOrderFlag">急</el-tag>
            </oms-row>
            <oms-row v-show="currentOrder.transactOrgHandlers" label="交接提货人">
              {{currentOrder.transactOrgHandlers}}
            </oms-row>
            <oms-row v-show="currentOrder.carNo" label="交接提货车辆">
              {{currentOrder.carNo}}
            </oms-row>
          </el-col>
        </el-row>
      </div>
      <div v-show="currentOrder.bizType === '2-4'">
        <el-row style="margin-bottom:0;position: relative">
          <el-col :span="12">
            <oms-row label="货主订单号" >
              {{currentOrder.orderNo}}
            </oms-row>
            <oms-row label="货主" >
              {{currentOrder.orgName}}
            </oms-row>
            <oms-row label="报损方式" >
              <dict :dict-group="'breakageType'" :dict-key="currentOrder.customerChannel"></dict>
            </oms-row>
            <oms-row label="上级疾控中心"  v-show="currentOrder.customerChannel === '1'">
              {{currentOrder.customerName}}
            </oms-row>
            <oms-row label="物流中心"  v-show="currentOrder.centreName">
              {{currentOrder.centreName}}
            </oms-row>
            <oms-row v-show="currentOrder.handoverTime" label="交付时间">
              {{currentOrder.handoverTime|time}}
            </oms-row>
            <oms-row v-show="currentOrder.orgHandlers" label="本单位交接人员">
              {{currentOrder.orgHandlers}}
            </oms-row>
            <oms-row v-show="currentOrder.handoverRemark&&currentOrder.handoverTime" label="交接备注">
              {{currentOrder.handoverRemark}}
            </oms-row>
            <oms-row v-show="currentOrder.handoverRemark&&!currentOrder.handoverTime" label="中止交付原因">
              <span class="goods-span">{{currentOrder.handoverRemark}}</span>
            </oms-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="业务类型">
              <dict :dict-group="'bizOutType'" :dict-key="currentOrder.bizType"></dict>
            </oms-row>
            <oms-row label="是否合格"
                     v-show="(currentOrder.bizType === '2-1'||currentOrder.bizType === '2-3'||currentOrder.bizType === '2-4') && (typeof currentOrder.qualifiedFlag === 'boolean')">
              <span class="goods-span" v-show="currentOrder.qualifiedFlag">合格</span>
              <span class="goods-span" style="color: red" v-show="!currentOrder.qualifiedFlag">不合格</span>
            </oms-row>
            <oms-row label="运输方式" v-show="currentOrder.transportationMeansId">
              <dict :dict-group="'outTransportMeans'" :dict-key="currentOrder.transportationMeansId"></dict>
            </oms-row>
            <oms-row label="运输条件" v-show="currentOrder.transportationCondition">
              <dict :dict-group="'transportationCondition'"
                    :dict-key="currentOrder.transportationCondition"></dict>
            </oms-row>
            <oms-row label="下单时间">
              <span class="goods-span">{{currentOrder.createTime | minute}}</span>
            </oms-row>

            <oms-row label="订单状态">
              {{ getOrderStatus(currentOrder) }}
            </oms-row>
            <!--<oms-row :label="getTimeTitle(currentOrder)" v-show="currentOrder.expectedTime">-->
            <!--<span class="goods-span">{{currentOrder.expectedTime | date}}</span>-->
            <!--</oms-row>-->
          </el-col>
        </el-row>
        <el-row style="margin-bottom:0">
          <oms-row label="仓库地址" :span="4">
            <span class="goods-span">{{currentOrder.outWarehouseAddress}}</span>
          </oms-row>
        </el-row>
        <el-row style="margin-bottom:0" v-show="currentOrder.warehouseAddress">
          <oms-row label="收货地址" :span="4">
            <span class="goods-span">{{currentOrder.warehouseAddress}}</span>
          </oms-row>
        </el-row>
        <el-row v-show="currentOrder.remark">
          <oms-row label="报损原因" :span="4">{{ currentOrder.remark }}</oms-row>
        </el-row>
        <oms-row v-show="currentOrder.transactOrgHandlers" label="交接提货人">
          {{currentOrder.transactOrgHandlers}}
        </oms-row>
        <oms-row v-show="currentOrder.carNo" label="交接提货车辆">
          {{currentOrder.carNo}}
        </oms-row>
      </div>
      <hr class="hr"/>

      <div class="table-wrap">
        <table class="table no-border table-product-list" v-show="currentOrder.detailDtoList">
          <thead>
          <tr>
            <td class="text-center"></td>
            <td></td>
            <td class="text-center">货品</td>
            <td class="text-center">规格</td>
            <td class="text-center">生产/有效日期</td>
            <td class="text-center">单价</td>
            <td class="text-center">数量</td>
            <td class="text-center" width="30">金额</td>
          </tr>
          </thead>
          <tbody>
          <tr class="table-product-item" v-for="item in currentOrder.detailDtoList" v-if="item.orgGoodsDto">
            <td class="text-center">{{item.sort}}</td>
            <td width="80">
              <el-tooltip v-if="$formatPhotoUrl(item)" popperClass="el-tooltip" class="item"
                          effect="light" placement="right">
                <compressed-img :src="$formatPhotoUrl(item) +'?image&action=resize:w_80,h_80,m_2' "
                                class="product-img"/>
                <compressed-img slot="content" :src="$formatPhotoUrl(item) +'?image&action=resize:h_200,m_2' "
                                class="product-img"/>
              </el-tooltip>
              <el-tooltip v-else class="item" effect="light" popperClass="el-tooltip" placement="right">
                <img :src="'../../../../static/img/userpic.png'" class="product-img">
                <img :src="'../../../../static/img/userpic.png'" slot="content" class="product-img">
              </el-tooltip>
            </td>
            <td>
              <div>
                <el-tooltip class="item" effect="dark" :content="`货主货品编码:${item.orgGoodsDto.goodsNo} 货主货品ID:${item.orgGoodsId}`" placement="right">
                  <span style="font-size: 14px;line-height: 20px">{{item.name}}</span>
                </el-tooltip>
              </div>
              <div>
                <el-tooltip class="item" effect="dark" :content="`货品主档编号:${item.orgGoodsDto.goodsDto.code} 货品主档ID:${item.goodsId}`" placement="right">
                  <span style="font-size: 12px;color:#999">{{ item.goodsName }}</span>
                </el-tooltip>
              </div>
              <div class="" v-show="item.orgGoodsDto.goodsDto.dosageFormName ">
                剂型：{{item.orgGoodsDto.goodsDto.dosageFormName }}
              </div>
              <!--<div>-->
              <!--<el-tooltip class="item" effect="dark" content="货品规格" placement="right">-->
              <!--<span style="font-size: 12px;">{{ item.orgGoodsDto.goodsDto.specifications }}</span>-->
              <!--</el-tooltip>-->
              <!--</div>-->
              <div>
                <span v-if="item.orgGoodsDto.goodsDto">生产单位: {{ item.orgGoodsDto.goodsDto.factoryName }}</span>
              </div>
              <div>
                <span v-if="item.orgGoodsDto.goodsDto.vaccineMarketingApprovalPossessorName">上市许可持有人: {{ item.orgGoodsDto.goodsDto.vaccineMarketingApprovalPossessorName }}</span>
              </div>
              <div>
                <!--<el-tooltip class="item" effect="dark" content="供货单位" placement="right">-->
                <!--<span>{{ item.salesFirmName }}</span>-->
                <!--</el-tooltip>-->
                <span v-show="item.salesFirmName">供货单位: {{ item.salesFirmName }}</span>
              </div>
              <div class="">
                批号：{{item.batchNumber || '无' }}
                <!--<el-tag v-show="item.inEffectiveFlag" type="danger">近效期</el-tag>-->
                <goods-status-tag :form="currentOrder" :item="item"/>
              </div>
            </td>
            <td width="50px" class="text-center">
              <span>{{ item.orgGoodsDto.goodsDto.specifications }}</span>
            </td>
            <td width="110px" class="text-center">
              <div>{{ item.productionDate | date }}</div>
              <div>{{ item.expiryDate | date }}</div>
            </td>
            <td width="80px" class="text-center">
              <span v-show="item.unitPrice">￥{{item.unitPrice | formatMoney}}</span>
              <span v-if="!item.unitPrice">-</span>
            </td>
            <td width="80px" class="text-center">
              {{item.amount}}
              <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
            </td>
            <td class="text-center">
                  <span v-if="item.unitPrice">
                    <span>¥</span>{{ item.amount * item.unitPrice | formatMoney }}
                  </span>
              <span v-if="!item.unitPrice">-</span>
            </td>
          </tr>
          <tr class="text-center">
            <td align="right" colspan="8">
                      <span style="font-weight:600;"
                            v-show="totalCount">数量合计: {{ totalCount}}</span>
              <span style="font-weight:600;"
                    v-show="currentOrder.totalAmount">；金额合计: ¥  {{ currentOrder.totalAmount | formatMoney
                  }}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>
<script>
import utils from '@/tools/utils';
import OmsRow from '@dtop/dtop-web-common/packages/row';

export default {
    components: {OmsRow},
    props: {
      currentOrder: {
        type: Object,
        default: function () {
          return {
            span: 8
          };
        }
      }
    },
    computed: {
      totalCount() {
        let totalCount = 0;
        if (!this.currentOrder.detailDtoList.length) return totalCount;
        this.currentOrder.detailDtoList.forEach(item => {
          totalCount += item.amount;
        });
        return totalCount;
      },
    },
    methods: {
      getTimeTitle: function (item) {
        return item.transportationMeansId === '0'
          ? item.bizType === '2-1' ? '预计出库' : '预计送货'
          : item.transportationMeansId === '1' ? '预计提货'
            : item.transportationMeansId === '2' ? '预计发货'
              : item.transportationMeansId === '3' ? '预计完成' : '';
      },
      getOrderStatus: function (order) { // 获取订单状态
        let state = '';
        for (let key in utils.outType) {
          if (order.wmsStatus === utils.outType[key].state) {
            state = utils.outType[key].title;
          }
        }
        return state;
      }

    }
  };
</script>
