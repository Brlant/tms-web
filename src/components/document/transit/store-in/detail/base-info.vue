<template>
  <div>
    <div v-if="!currentOrder.id">
      <oms-loading :loading="!currentOrder.id"></oms-loading>
    </div>
    <div v-else class="page-main-body padding in-order-info">
      <el-row style="margin-bottom:0" v-show=" currentOrder.bizType !== '1-2' ">
        <oms-col label="货主订单号" :value="currentOrder.orderNo"/>
        <oms-col label="货主" :value="currentOrder.orgName"/>
        <oms-col label="业务类型" :value="currentOrder.bizType">
          <dict :dict-group="'bizInType'" :dict-key="currentOrder.bizType"></dict>
        </oms-col>
        <oms-col label="来源订单号" :value="currentOrder.thirdPartyNumber"
                 v-show=" (currentOrder.bizType ==='1-0'||currentOrder.bizType ==='1-1')  && currentOrder.thirdPartyNumber"/>
        <oms-col label="来源单位" :value="currentOrder.supplierName" v-show="currentOrder.bizType !== '1-3'"/>
        <oms-col label="物流方式" :value="currentOrder.transportationMeansId">
          <dict :dict-group="'transportationMeans'" :dict-key="currentOrder.transportationMeansId"></dict>
        </oms-col>
        <oms-col :value="currentOrder.logisticsProviderName" label="物流商"
                 v-show="currentOrder.transportationMeansId === '1' || currentOrder.transportationMeansId === '3'"/>
        <oms-col label="提货地址" :value="currentOrder.pickUpWarehouseAddress"
                 v-show="currentOrder.transportationMeansId === '2'"/>
        <oms-col label="申请人" :value="currentOrder.actualConsignee"
                 v-show="currentOrder.transportationMeansId === '2' && currentOrder.bizType === '1-1'"/>
        <oms-col label="运输条件" :value="currentOrder.transportationCondition">
          <dict :dict-group="'transportationCondition'" :dict-key="currentOrder.transportationCondition"></dict>
        </oms-col>
        <oms-col label="物流中心" :value="currentOrder.centreName"/>
        <oms-col label="下单时间" :value="currentOrder.createTime | minute"/>
        <oms-col label="上架时间" :value="currentOrder.completeTime | minute"/>
        <oms-col :label="currentOrder.bizType === '1-1'?'拟退货时间':'预计入库时间'" :value="currentOrder.expectedTime | date"/>
        <oms-col label="货主仓库地址" :value="currentOrder.warehouseAddress"/>
        <oms-col label="是否合格" :is-show="true" :value="currentOrder.qualifiedFlag"
                 v-show="(typeof currentOrder.qualifiedFlag === 'boolean') && currentOrder.bizType === '1-1'">
          <span class="goods-span" v-show="currentOrder.qualifiedFlag">合格</span>
          <span class="goods-span" v-show="!currentOrder.qualifiedFlag">不合格</span>
        </oms-col>
        <oms-col label="订单状态" :is-show="true">{{ getCurrentOrderStatus(currentOrder.wmsStatus) }}</oms-col>
        <oms-col label="退货原因" :value="currentOrder.returnReason" v-show="currentOrder.bizType === '1-1'"/>
        <oms-col label="订单状态" :is-show="true">
          {{ getCurrentOrderStatus(currentOrder.wmsStatus) }}
          <el-tag type="warning" v-show="currentOrder.rushOrderFlag">急</el-tag>
        </oms-col>
        <oms-col label="客户备注" :is-show="true" :value="currentOrder.remark"/>
        <oms-col label="备注" :is-show="true" :value="currentOrder.orderRemark"/>
      </el-row>
      <el-row style="margin-bottom:0" v-show=" currentOrder.bizType === '1-2' ">
        <oms-col label="货主订单号" :value="currentOrder.orderNo"/>
        <oms-col label="货主" :value="currentOrder.orgName"/>
        <oms-col label="货主仓库地址" :value="currentOrder.warehouseAddress"/>
        <oms-col label="物流中心" :value="currentOrder.centreName"/>
        <oms-col label="下单时间" :value="currentOrder.createTime | minute"/>
        <oms-col label="上架时间" :value="currentOrder.completeTime | minute"/>
        <oms-col label="订单状态" :is-show="true">
          {{ getCurrentOrderStatus(currentOrder.wmsStatus) }}
          <el-tag type="warning" v-show="currentOrder.rushOrderFlag">急</el-tag>
        </oms-col>
        <oms-col label="客户备注" :is-show="true" :value="currentOrder.remark"/>
        <oms-col label="备注" :is-show="true" :value="currentOrder.orderRemark"/>
      </el-row>
      <hr class="hr"/>
      <table class="table no-border table-product-list" v-show="currentOrder.detailDtoList">
        <thead>
        <tr>
          <td></td>
          <td>货品</td>
          <td class="text-center">供货单位</td>
          <td class="text-center">数量</td>
          <td class="text-center">单价</td>
          <td class="text-center">金额</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in currentOrder.detailDtoList" v-if="item.orgGoodsDto">
          <td width="80">
            <el-tooltip effect="light" popperClass="el-tooltip" v-if="$formatPhotoUrl(item)"
                        placement="right">
              <compressed-img :src="$formatPhotoUrl(item) +'?image&action=resize:w_80,h_80,m_2' "
                              class="product-img"/>
              <compressed-img :src="$formatPhotoUrl(item) +'?image&action=resize:h_200,m_2' " slot="content"
                              class="product-img"/>
            </el-tooltip>
            <el-tooltip v-else effect="light" popperClass="el-tooltip" placement="right">
              <img src="../../../../../../static/img/userpic.png" class="product-img">
              <img src="../../../../../../static/img/userpic.png" slot="content" class="product-img">
            </el-tooltip>
          </td>
          <td width="240px">
            <div>
              <el-tooltip class="item" effect="dark" :content="`货品主档编号:${item.orgGoodsDto.goodsDto.code} 货品主档ID:${item.goodsId}`" placement="right">
                <span style="font-size: 14px;line-height: 20px">{{ item.goodsName }}</span>
              </el-tooltip>
            </div>
            <div>
              <el-tooltip class="item" effect="dark" :content="`货主货品编码:${item.orgGoodsDto.goodsNo} 货主货品ID:${item.orgGoodsId}`" placement="right">
                <span style="font-size: 12px;color:#999">{{item.name}}</span>
              </el-tooltip>
            </div>
            <div>
              <el-tooltip class="item" effect="dark" content="货品规格" placement="right">
                <span style="font-size: 12px;">{{ item.orgGoodsDto.goodsDto.specifications }}</span>
              </el-tooltip>
            </div>
            <div v-show="currentOrder.bizType === '1-1'">
              批号: {{item.batchNumber}}
            </div>
          </td>
          <td class="text-center" width="200px">
            {{item.salesFirmName}}
          </td>
          <td width="100px" class="text-center">
            {{item.amount}}
            <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
          </td>
          <td width="80px" class="text-center">
            <span v-if="item.unitPrice">￥{{item.unitPrice}}</span>
            <span v-if="!item.unitPrice">-</span>
          </td>
          <td class="text-center">
            <span v-if="item.unitPrice">
                <span>¥</span>{{ item.amount * item.unitPrice | formatMoney }}
            </span>
            <span v-if="!item.unitPrice">-</span>
          </td>
        </tr>
        <tr class="text-center">
          <td colspan="4"></td>
          <td colspan="2" align="right">
            <span style="font-weight:600;" v-if="currentOrder.totalAmount">合计: ¥  {{ currentOrder.totalAmount | formatMoney}}</span>
          </td>
        </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>
<script>
import utils from '@/tools/utils';
import OmsCol from '@/components/common/oms-col';

export default {
    components: {OmsCol},
    props: {
      currentOrder: {
        type: Object,
        default: function () {
          return {};
        }
      }
    },
    methods: {
      getCurrentOrderStatus: function (state) {// 获取订单状态
        let retstate = '';
        for (let key in utils.inType) {
          if (state === utils.inType[key].state) {
            retstate = utils.inType[key].title;
          }
        }
        return retstate;
      }
    }
  };
</script>
