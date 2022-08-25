<style lang="scss" scoped>
  @import "~@/assets/scss/mixins.scss";

  $leftWidth: 260px;
  .content-part {
    .content-left {
      width: $leftWidth;
    }
    .content-right {
      > h3 {
        left: $leftWidth;
      }
      left: $leftWidth;
    }
  }


</style>


<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">生成波次</h2>
        <div class="dialog-left-list">
          <div class="dialog-left-item" v-for="(item, index) in checkList" :key="item.id"
               :class="{active:activeId === index}"
               @click="checkOrder(item,index)">
            订单 {{ item.orderNo }}
          </div>
        </div>
        <div class="opera-btn">
          <div @click="createWave('/wave-task/batch')" class="btn" type="primary">合并发波</div>
          <div @click="createWave('/wave-task/batch/order-list')" class="btn" type="primary">按订单发波</div>
        </div>
      </div>
      <div class="content-right min-row">
        <h3>{{ orderName }}</h3>

        <div v-if="loadingDetail">
          <oms-loading :loading="loadingDetail"></oms-loading>
        </div>
        <div v-else class="page-main-body padding" v-show="currentOrder.id">
          <el-row style="margin-bottom:0;position: relative"
                  v-show=" currentOrder.bizType !== '2-2'&& currentOrder.bizType !== '2-4' ">
            <el-col :span="12">
              <oms-row label="货主">
                {{currentOrder.orgName}}
              </oms-row>
              <oms-row label="去向单位" v-show=" currentOrder.bizType !== '2-3' ">
                {{currentOrder.customerName}}
              </oms-row>
              <oms-row label="仓库名称">
                {{currentOrder.warehouseName}}
              </oms-row>
              <oms-row label="仓库地址">
                {{currentOrder.warehouseAddress}}
              </oms-row>
              <oms-row label="运输条件">
                <dict :dict-group="'transportationCondition'" :dict-key="currentOrder.transportationCondition"></dict>
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
              <oms-row label="订单状态">
                {{ getCurrentOrderStatus() }}
              </oms-row>
            </el-col>
          </el-row>
          <el-row style="margin-bottom:0" v-show=" currentOrder.bizType === '2-2' || currentOrder.bizType === '2-4' ">
            <el-col :span="12">
              <oms-row label="货主">
                {{currentOrder.orgName}}
              </oms-row>
              <oms-row label="业务类型">
                <dict :dict-group="'bizOutType'" :dict-key="currentOrder.bizType"></dict>
              </oms-row>
            </el-col>
            <el-col :span="12">
              <oms-row label="下单时间">
                <span class="goods-span">{{currentOrder.createTime | minute}}</span>
              </oms-row>
              <oms-row label="出库完成时间">{{currentOrder.completeTime | minute}}</oms-row>
              <oms-row label="订单状态">
                {{ getCurrentOrderStatus() }}
              </oms-row>
            </el-col>
          </el-row>
          <el-row v-show="currentOrder.remark">
            <oms-row label="备注" :span="5">{{ currentOrder.remark }}</oms-row>
          </el-row>

          <hr class="hr"/>

          <table class="table no-border table-product-list" v-show="currentOrder.detailDtoList">
            <thead>
            <tr>
              <td></td>
              <td>名称</td>
              <td class="text-center">供货单位</td>
              <td>批号</td>
              <td>生产日期</td>
              <td>有效期</td>
              <td class="text-center">数量</td>
              <td class="text-center">单价</td>
              <td class="text-center">金额</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in currentOrder.detailDtoList" v-if="item.orgGoodsDto">
              <td width="80">
                <compressed-img v-if="$formatPhotoUrl(item)"
                                :src="$formatPhotoUrl(item) +'?image&action=resize:w_80,h_80,m_2' "
                                class="product-img"/>
                <img v-else :src="'../../../../static/img/userpic.png'" class="product-img">
              </td>
              <td width="240px">
                <div>
                  <el-tooltip class="item" effect="dark" content="货品主档名称" placement="right">
                    <span style="font-size: 14px;line-height: 20px">{{ item.goodsName }}</span>
                  </el-tooltip>
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="货主货品名称" placement="right">
                    <span style="font-size: 12px;color:#999">{{item.name}}</span>
                  </el-tooltip>
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="货品规格" placement="right">
                    <span style="font-size: 12px;">{{ item.orgGoodsDto.goodsDto.specifications }}</span>
                  </el-tooltip>
                </div>
              </td>
              <td class="text-center" width="180px">
                {{item.salesFirmName}}
              </td>
              <td width="80px" class="R">{{ item.batchNumber || '无' }}</td>
              <td>{{ item.productionDate | date }}</td>
              <td>{{ item.expiryDate | date }}</td>
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
              <td colspan="5"></td>
              <td colspan="4"><span style="font-weight:600;"
                                    v-show="currentOrder.totalAmount">合计: ¥  {{ currentOrder.totalAmount | formatMoney }}</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {http, Wave} from '@/resources';

export default {
    components: {},
    props: {
      checkList: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {
        loadingDetail: true,
        activeId: '',
        orderName: '', // 订单名称
        currentOrder: {} // 当前订单
      };
    },
    watch: {
      checkList(val) {
        if (val.length) this.checkOrder(val[0], 0);
      }
    },
    methods: {
      checkOrder(item, index) { // 选中订单
        this.activeId = index;
        this.orderName = `订单 ${item.orderNo}`;
        if (!item.id) {
          this.currentOrder = {};
          return;
        }
        this.loadingDetail = true;
        Wave.queryOrderDetail(item.id).then(res => {
          this.currentOrder = res.data;
          this.loadingDetail = false;
        });
      },
      createWave(url) { // 创建波次
        // let orgId = this.checkList[0].orgId;
        // let customerId = this.checkList[0].customerId;
        // let transportationAddressId = this.checkList[0].transportationAddressId;
        // let isCheckPass = this.checkList.every(item => item.orgId === orgId &&
        //   item.customerId === customerId &&
        //   item.transportationAddressId === transportationAddressId);
        // if (!isCheckPass) {
        //   this.$notify.error({
        //     duration: 20000,
        //     message: '相同货主、相同来源单位、相同仓库地址的订单 才能生成波次'
        //   });
        //   return;
        // }
        let detailList = [];
        this.checkList.forEach(item => {
          detailList.push(item.id);
        });
        this.$confirm('是否生成波次？', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          let object = {
            orderList: detailList
          };
          http.post(url, object).then(() => {
            this.$emit('close');
            this.$notify.success({
              message: '生成波次成功'
            });
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '生产波次失败'
            });
          });
        });
      },
      getTimeTitle: function (item) { // 格式化出库时间
        let title = '';
        switch (item.transportationMeansId) {
          case '0': {
            title = '预计送货';
            if (item.bizType === '2-1') {
              title = '预计出库';
            }
            break;
          }
          case '1': {
            title = '预计提货';
            break;
          }
          case '2': {
            title = '预计发货';
            break;
          }
          case '3': {
            title = '预计完成';
            break;
          }
        }
        if (item.bizType === '2-2' || item.bizType === '2-4') {
          title = '';
        }
        return title;
      },
      getCurrentOrderStatus: function () {
        return '待分波';
      }
    }
  };
</script>
