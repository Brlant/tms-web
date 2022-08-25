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
    <template slot="title">订单</template>
    <template slot="btn">
      <el-button plain @click="close()">关闭</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
              {{ pageSets[0].name }}</h3>
          </div>
          <div class="content">
            <oms-col label="订单号" :rowSpan="span" :value="form.orderNo"/>
            <oms-col label="订单状态" :rowSpan="span" :value="form.status">
              {{ formatStatusTitle(form.status, orderType) }}
            </oms-col>
            <oms-col label="订单类型" :rowSpan="span" :value="form.waybillType">
              <dict :dict-group="'bizType'" :dict-key="form.waybillType"></dict>
            </oms-col>
            <oms-col label="运输条件" :rowSpan="span" :value="form.shipmentWay">
              <dict :dict-group="'transportationCondition'" :dict-key="form.shipmentWay"></dict>
            </oms-col>
            <oms-col label="发运方式" :rowSpan="span" :value="form.deliveryWay">
              <dict :dict-group="'deliveryWay'" :dict-key="form.deliveryWay"></dict>
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
            <oms-col label="面单号" :rowSpan="span" :value="form.faceSheetNo">
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
            <oms-col label="发货地址" :rowSpan="span" :value="form.senderAddress"/>
            <oms-col label="发货联系人" :rowSpan="span" :value="form.senderContact"/>
            <oms-col label="电话" :rowSpan="span" :value="form.senderContactPhone"/>
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
            <oms-col label="收货联系人" :rowSpan="span" :value="form.receiverContact"/>
            <oms-col label="电话" :rowSpan="span" :value="form.receiverContractPhone"/>
            <oms-col label="收货单位" :rowSpan="span" :value="form.receiverName"/>
            <oms-col label="收货地址" :rowSpan="span" :value="form.receiverAddress"/>
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
            <el-table class="border-black" :data="form.goodsList" border style="width: 100%">
              <el-table-column type="index" label="序号" width="50"/>
              <el-table-column prop="goodsName" label="货品" width="398">
                <template slot-scope="scope">
                  <div>
                    <el-tooltip class="item" effect="dark" :content="formatGoodsPackage(scope.row)" placement="right">
                      <span style="font-size: 14px;line-height: 20px">{{ scope.row.goodsName }}</span>
                    </el-tooltip>
                  </div>
                  <div>
                    <span v-if="scope.row.goodsFactory">生产厂商: {{ scope.row.goodsFactory }}</span>
                  </div>
                  <div>
                    <span v-if="scope.row.supplyManufacturers">供货厂商: {{ scope.row.supplyManufacturers }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="batchNumber" label="批号" width="100">
              </el-table-column>
              <el-table-column prop="specifications" label="货品规格" width="100">
              </el-table-column>
              <el-table-column prop="goodsCount" label="数量" width="60">
                <template slot-scope="scope">
                  {{ scope.row.goodsCount }}
                </template>
              </el-table-column>
              <el-table-column prop="weight" label="重量/体积" width="120">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.weight }} kg
                  </div>
                  <div>
                    {{ scope.row.volume }} m³
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="code" label="追溯码" width="120">
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
            <map-path :formItem="formItem" :showBigMap="showBigMap"></map-path>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[7].key === currentTab.key}">
              {{ pageSets[7].name }}</h3>
          </div>
          <div class="content">
            <div v-if="loadingLog">
              <oms-loading :loading="loadingLog"></oms-loading>
            </div>
            <div v-else>
              <div class="order-cost-part">
                <i class="el-icon-time"></i> 订单消耗时间:
                <oms-cost-time :fDate="form.createTime" :tDate="form.waybillCompleteTime"></oms-cost-time>
                <el-tag v-if="form.waybillCompleteTime&&form.status!=='5'" type="success">已结束</el-tag>
                <el-tag v-if="!form.waybillCompleteTime&&form.status!=='5'" type="success">进行中</el-tag>
                <el-tag v-if="form.status==='5'" type="danger">已取消</el-tag>
              </div>
              <Timeline>
                <template v-for="(log,index) in orderLogList">
                  <TimelineItem color="green" v-if="log.showDate">
                    <i class="iconfont icon-home" slot="dot"></i>
                    <h3><span>{{ log.dateWeek }}</span></h3>
                  </TimelineItem>
                  <TimelineItem color="grey">
                    <el-row class="tiny-timeline-content">
                      <el-col :span="4">
                        <div>{{ log.time }}</div>
                      </el-col>
                      <el-col :span="18"><strong>{{ log.title }}</strong>
                        <el-tooltip class="item" effect="dark"
                                    :content="log.operatorOrgName ? log.operatorOrgName : '平台用户' "
                                    placement="right" v-show="log.operatorName">
                          <span class="font-gray">[{{ log.operatorName }}]</span>
                        </el-tooltip>
                      </el-col>
                    </el-row>
                  </TimelineItem>
                </template>
              </Timeline>
              <div class="order-cost-part" v-if="orderLogList.length>0">
                <i class="el-icon-time"></i> 订单消耗时间:
                <oms-cost-time :fDate="form.createTime" :tDate="form.waybillCompleteTime"></oms-cost-time>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
import TwoColumn from '@dtop/dtop-web-common/packages/two-column';
import {TmsLog, TmsOrder} from '@/resources';
import MapPath from '../../common/map-list';
import utils from '@/tools/utils';
import OmsCostTime from '@/components/common/timeCost.vue';

export default {
  components: {TwoColumn, MapPath, OmsCostTime},
  data() {
    return {
      span: 7,
      list: [],
      times: [],
      orderType: utils.orderType,
      pageSets: [
        {name: '基本信息', key: 0},
        {name: '发货信息', key: 1},
        {name: '收货信息', key: 2},
        {name: '货品信息', key: 3},
        {name: '其他信息', key: 4},
        {name: '货品列表', key: 5},
        {name: '派送信息', key: 6},
        {name: '操作日志', key: 7}
      ],
      orderLogList: [],
      loadingLog: false,
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
  props: ['formItem', 'showBigMap'],
  watch: {
    formItem: function (val) {
      if (val.id) {
        TmsOrder.getOneTmsOrder(val.id).then(res => {
          this.form = res.data;
          // 查询日志信息
          this.queryLog(val.id);
        });
      }
    }
  },
  methods: {
    formatGoodsPackage: function (item) {
      if (item) {
        return '包装：' + item.goodsLength + 'cm' + ' x ' + item.goodsWidth + 'cm' + ' x ' + item.goodsHeight + 'cm';
      }
    },
    queryLog: function (id) {
      if (!id) return;
      this.loadingLog = true;
      let params = Object.assign({}, {
        pageNo: 1,
        pageSize: 100,
        objId: id,
        objType: 'tms-order'
      });
      TmsLog.queryLog(params).then(res => {
        let dateArr = [];
        res.data.list.forEach(item => {
          let time = this.$moment(item.time);// .format('YYYY年MM月DD日/dddd');
          item.dateWeek = time.format('YYYY年MM月DD日 dddd');
          item.time = time.format('HH:mm:ss');
          if (dateArr.includes(item.dateWeek)) {
            item.showDate = false;
          } else {
            dateArr.push(item.dateWeek);
            item.showDate = true;
          }
        });
        this.orderLogList = res.data.list;
        this.loadingLog = false;
      }).catch(error => {
        this.loadingLog = false;
      });
    },
    formatStatusTitle(status, statusType) {
      let title = '';
      Object.keys(statusType).forEach(k => {
        if (status === null) {
          if (statusType[k].status === status) {
            title = statusType[k].title;
          }
        } else {
          let s1 = Number(statusType[k].status);
          let s2 = Number(status);
          if (s1 === s2) {
            title = statusType[k].title;
          }
        }
      });
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
