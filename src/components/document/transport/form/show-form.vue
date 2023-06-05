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
  margin-bottom: 0;
}
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">运单</template>
    <template slot="btn">
      <div style="margin-bottom: 30px;">
        <el-button type="primary" @click="confirmationReceipt()">回单确认</el-button>
      </div>
      <el-button plain @click="close()">关闭</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: getPageSet(0).key === currentTab.key}">
              {{ getPageSet(0).name }}</h3>
          </div>
          <div class="content">
            <oms-col label="运单号" :rowSpan="span" :value="form.waybillNumber"/>
            <oms-col label="委托单号" :rowSpan="span" :value="form.tmsOrderNumber"/>
            <oms-col label="运单状态" :rowSpan="span" :value="form.status">
              {{ formatStatusTitle(form.status, orderType) }}
            </oms-col>
            <oms-col label="来源订单号" :rowSpan="span" :value="form.orderNoList" class="R">
                 <span v-for="order in form.orderNoList">{{ order }}
                   <span v-if="form.orderNoList.indexOf(order)!==form.orderNoList.length-1">,</span>
                 </span>
            </oms-col>
            <oms-col label="面单号" :rowSpan="span" :value="form.faceSheetNo"/>
            <oms-col label="运单类型" :rowSpan="span" :value="form.waybillType">
              <dict :dict-group="'bizType'" :dict-key="form.waybillType"></dict>
            </oms-col>
            <oms-col label="运输条件" :rowSpan="span" :value="form.shipmentWay">
              <dict :dict-group="'transportationCondition'" :dict-key="form.shipmentWay"></dict>
            </oms-col>
            <oms-col label="发运方式" :rowSpan="span" :value="form.deliveryWay">
              <dict :dict-group="'deliveryWay'" :dict-key="form.deliveryWay"></dict>
            </oms-col>
            <oms-col label="创建人" :rowSpan="span" :value="form.creatorName"/>
            <oms-col label="修改人" :rowSpan="span" :value="form.updateName"/>
            <oms-col label="修改时间" :rowSpan="span" :value="form.updateTime">
              {{ form.updateTime|time }}
            </oms-col>
            <oms-col label="司机" :rowSpan="span" :value="form.driverName"/>
            <oms-col label="车牌号" :rowSpan="span" :value="form.carNo"/>
            <oms-col label="启运时间" :rowSpan="span" :value="form.startTransportTime">
              {{ form.startTransportTime|time }}
            </oms-col>
            <oms-col label="送达时间" :rowSpan="span" :value="form.deliveryCompleteTime">
              {{ form.deliveryCompleteTime|time }}
            </oms-col>
            <oms-col label="结束时间" :rowSpan="span" :value="form.waybillCompleteTime">
              {{ form.waybillCompleteTime|time }}
            </oms-col>
            <oms-col label="承运类型" :rowSpan="span" :value="form.carryType===0?'自行承运':'第三方承运'"></oms-col>
            <oms-col label="承运商名称" :rowSpan="span" :value="form.carryType===0?'':form.carrierName"></oms-col>
            <oms-col label="第三方承运单号" :rowSpan="span" :value="form.thirdNo"></oms-col>
            <oms-col label="是否投保" :rowSpan="span" :value="form.insure?'是':'否'"></oms-col>
            <oms-col label="投保金额（元）" :rowSpan="span" :value="form.insureAmount"></oms-col>
          </div>
          <div class="hr mb-10 clearfix"></div>
        </div>
        <div class="form-header-part ">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: getPageSet(1).key === currentTab.key}">
              {{ getPageSet(1).name }}</h3>
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
            <h3 class="tit f-dib index-tit" :class="{active: getPageSet(2).key === currentTab.key}">
              {{ getPageSet(2).name }}</h3>
          </div>
          <div class="content">
            <oms-col label="收货联系人" :rowSpan="span" :value="form.receiverContact"/>
            <oms-col label="电话" :rowSpan="span" :value="form.receiverContractPhone"/>
            <oms-col label="收货单位" :rowSpan="span" :value="form.receiverName"/>
            <oms-col label="收货地址" :rowSpan="span" :value="form.receiverAddress"/>
            <oms-col :rowSpan="span" :value="form.receiverAddressLongitude" label="经度"/>
            <oms-col :rowSpan="span" :value="form.receiverAddressDimension" label="纬度"/>
            <div class="clearfix">
              <map-location :draggable="false" ref="bdMap" v-if="form.receiverAddress" vid="showmap"></map-location>
            </div>
          </div>
          <div class="hr mb-10 clearfix"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: getPageSet(3).key === currentTab.key}">
              {{ getPageSet(3).name }}</h3>
          </div>
          <div class="content">
            <oms-col label="整装箱数" :rowSpan="span" :value="form.wholeBoxCount" isShow="true"/>
            <oms-col label="散装箱数" :rowSpan="span" :value="form.bulkBoxCount" isShow="true"/>
            <oms-col label="包件数" :rowSpan="span" :value="form.incubatorCount" isShow="true"/>
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
            <h3 class="tit f-dib index-tit" :class="{active: getPageSet(4).key === currentTab.key}">
              {{ getPageSet(4).name }}</h3>
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
            <h3 class="tit f-dib index-tit" :class="{active: getPageSet(5).key === currentTab.key}">
              {{ getPageSet(5).name }}</h3>
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
            <div class="hr mb-10"></div>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: getPageSet(6).key === currentTab.key}">
              {{ getPageSet(6).name }}
            </h3>
            <perm label="tms-waybill-pack">
              <span @click="showAdd" class="btn-circle"><i
                class="el-icon-t-plus"></i> </span>
            </perm>
          </div>
          <div>
            <el-form ref="detailForm" :model="detailForm" class="clearfix" label-width="100px" v-show="showAddFlag">
              <el-row>
                <el-col :span="7">
                  <el-form-item label="保温箱" style="margin-top: 20px;margin-bottom: 20px">
                    <el-select filterable remote placeholder="请输入保温箱名称/编号/编码查询保温箱" :remote-method="queryBoxList"
                               :clearable="true" @click.native="queryBoxList('')"
                               v-model="detailForm.incubator" popperClass="good-selects">
                      <el-option :value="box.devNo" :key="box.devNo" :label="box.devNo"
                                 v-for="box in boxList">
                        <div style="overflow: hidden">
                          <span class="pull-left" style="clear: right">{{ box.devNo }}-{{ box.devName }}</span>
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="温度计" style="margin-top: 20px;margin-bottom: 20px">
                    <el-select filterable remote placeholder="请输入温度计名称/编号/编码查询温度计" :remote-method="queryDevList"
                               :clearable="true" @click.native="queryDevList('')"
                               v-model="detailForm.thermometerList" popperClass="good-selects" multiple="">
                      <el-option :key="ccsDev.id" :label="ccsDev.devName" :value="ccsDev.devCode"
                                 v-for="ccsDev in ccsDevList">
                        <div style="overflow: hidden">
                          <span class="pull-left" style="clear: right">{{ ccsDev.devName }}</span>
                        </div>
                        <div style="overflow: hidden">
                          <span class="select-other-info pull-left">
                            <span v-show="ccsDev.devCode">设备编码:</span>{{ ccsDev.devCode }}
                          </span>
                          <span class="select-other-info pull-left" style="margin-left: 10px">
                            <span v-show="ccsDev.devNo">设备编号:</span>{{ ccsDev.devNo }}
                          </span>
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="追溯码" style="margin-top: 20px;margin-bottom: 20px">
                    <el-input v-model="detailForm.codeList" :rows="5" class="input-width" type="textarea"
                              @change="formatNumberToAry"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="margin-top: 20px;margin-bottom: 20px;padding-left: 40px">
                  <el-button type="primary" @click="onSubmit('detailForm')" :disabled="doing">保存</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="content">
            <el-table class="border-black" :data="form.incubatorDtoList" border style="width: 100%">
              <el-table-column type="index" label="序号" width="50"/>
              <el-table-column prop="boxNo" label="保温箱编号" width="200">
                <template slot-scope="scope">
                  <el-tooltip effect="dark" class="item" :content="formatTime(scope.row.createTime)" placement="right">
                    <span>
                       <el-tag :closable="form.status!=='3'&&isShow('tms-waybill-temperature-delete')"
                               @close="deleteDevBox(scope.row)" :key="scope.row.boxNo">{{ scope.row.boxNo }}
                       </el-tag>
                    </span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="thermometerNoList" label="温度计列表">
                <template slot-scope="scope">
                  <el-tag v-for="no in scope.row.thermometerNoList"
                          :closable="form.status!=='3'&&isShow('tms-waybill-temperature-delete')"
                          :key="no.thermometerNo" @close="deleteThermometer(no)">
                    {{ no.thermometerNo }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="codeList" label="追溯码">
                <template slot-scope="scope">
                  <div v-for="code in scope.row.codeList">
                    {{ code }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <show3d-data ref="modelingData" :pageSet="getPageSet(11)" :form="form" :currentTab="currentTab"></show3d-data>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: getPageSet(7).key === currentTab.key}">
              {{ getPageSet(7).name }}</h3>
          </div>
          <div class="content">
            <el-form-item label="签收人:" v-show="form.signPerson">
              {{ form.signPerson }}
            </el-form-item>
            <el-form-item label="附件:">
              <oms-upload :fileList="attachmentList" @change="changeFiles"
                          :formData="{ objectId: form.id, objectType: 'waybill'}"></oms-upload>
            </el-form-item>
          </div>
        </div>
        <div class="form-header-part" v-if="form.status==='6'&&form.qualityInspection && getPageSet(8)">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: getPageSet(8).key === currentTab.key}">
              {{ getPageSet(8).name }}</h3>
          </div>
          <div class="content">
            <el-col :span="24">
              <div>
                <oms-row label="中止原因" :span="4" style="padding-bottom: 5px">
                  <slot>
                    <dict :dict-group="'waybillEndReason'" :dict-key="form.suspendReason"></dict>
                  </slot>
                </oms-row>
              </div>
            </el-col>
            <el-col :span="24">
              <div>
                <oms-row label="评估结论" :span="4" style="padding-bottom: 5px">
                  <slot>
                    <el-tag :type="form.qualityFlag?'success':'danger'">
                      {{ isQualityFlag(form.qualityFlag) }}
                    </el-tag>
                    {{ form.qualityInspection }}
                  </slot>
                </oms-row>
              </div>
            </el-col>
            <el-col :span="24">
              <div>
                <oms-row label="附件" :span="4" style="padding-bottom: 5px">
                  <attachment-lists :attachmentIdList="assessAttachmentIdList" :objectId="form.id"
                                    :objectType="'waybill-check'" :permission="'show'"/>
                </oms-row>
              </div>
            </el-col>
            <div class="hr mb-10 clearfix"></div>
          </div>
        </div>
        <!-- 派送信息 -->
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: getPageSet(9).key === currentTab.key}">
              {{ getPageSet(9).name }}</h3>

          </div>
          <div class="content ml-15">
            <el-tabs v-model="delivery.activeName" type="card" @tab-click="handleDeliveryTabClick">
              <el-tab-pane label="地图信息" name="map">
                <div style="line-height: 30px;height: 30px">
                  <strong class="mr-10">运单号：{{ form.waybillNumber }}</strong>
                  <el-link @click="showBigMap(formItem)" icon="el-icon-zoom-in btn-circle" :underline="false">查看大图
                  </el-link>
                </div>
                <map-path :formItem="formItem"></map-path>
              </el-tab-pane>
              <el-tab-pane label="物流信息" name="logistics">
                <div style="line-height: 30px;height: 30px">
                  <strong class="mr-10">运单号：{{ form.waybillNumber }}</strong>
                </div>
                <div style="padding: 20px 0">
                  <div v-show="logisticsList.length === 0" class="empty-info mini">暂无物流信息</div>
                  <Timeline>
                    <template v-for="(log,index) in logisticsList">
                      <TimelineItem color="green" v-if="log.statusName">
                        <i class="iconfont icon-home" slot="dot"></i>
                        <el-row class="tiny-timeline-content">
                          <el-col :span="2">
                            <strong style="font-size: 16px">{{ log.statusName }}</strong>
                          </el-col>
                          <el-col :span="10">
                            <strong>{{ log.logisticsTime|time }}</strong>
                          </el-col>
                        </el-row>
                        <el-row class="tiny-timeline-content">
                          <el-col :span="24">
                            {{ log.logisticsDetail }}
                          </el-col>
                        </el-row>
                      </TimelineItem>
                      <TimelineItem color="grey" v-else>
                        <el-row class="tiny-timeline-content">
                          <el-col :span="10">
                            {{ log.logisticsTime|time }}
                          </el-col>
                        </el-row>
                        <el-row class="tiny-timeline-content">
                          <el-col :span="24">
                            {{ log.logisticsDetail }}
                          </el-col>
                        </el-row>
                      </TimelineItem>
                    </template>
                  </Timeline>
                </div>
              </el-tab-pane>
              <el-tab-pane label="温度数据" name="temperature">
                <div style="line-height: 30px;height: 30px">
                  <strong class="mr-10">运单号：{{ form.waybillNumber }}</strong>
                </div>
                <div>
                  <div v-show="handOverList.length">
                    <chart-line-hand ref="vhDevTempLineHand" class="mt-10" :dataList="handOverList"
                                     :devInfo="devInfo"></chart-line-hand>
                  </div>
                  <div v-show="!handOverList.length">暂无数据</div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: getPageSet(10).key === currentTab.key}">
              {{ getPageSet(10).name }}</h3>
          </div>
          <div class="content">
            <div v-if="loadingLog">
              <oms-loading :loading="loadingLog"></oms-loading>
            </div>
            <div v-else>
              <div class="order-cost-part">
                <i class="el-icon-time"></i> 运单消耗时间:
                <oms-cost-time :fDate="form.createTime" :tDate="form.waybillCompleteTime"></oms-cost-time>
                <el-tag v-if="form.waybillCompleteTime&&form.status!=='4'&&form.status!=='6'" type="success">已结束
                </el-tag>
                <el-tag v-if="!form.waybillCompleteTime&&form.status!=='4'&&form.status!=='6'" type="success">进行中
                </el-tag>
                <el-tag v-if="form.status==='4'&&form.status!=='6'" type="danger">已取消</el-tag>
                <el-tag v-if="form.status==='6'&&form.status!=='4'" type="warning">已中止</el-tag>
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
                <i class="el-icon-time"></i> 运单消耗时间:
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
import {OmsAttachment, TmsLog, TmsPack, TmsWayBill} from '@/resources';
import MapPath from '../../common/map-path';
import attachmentLists from '../../../common/attachment/attachmentList';
import OmsCol from '@dtop/dtop-web-common/packages/col';
import utils from '@/tools/utils';
import Perm from '@/components/common/perm';
import OmsCostTime from '@/components/common/timeCost.vue';
import Show3dData from './show-3d-data';
import MapLocation from '@/components/common/map-location';
import ChartLineHand from '../chat/chart-line-hand';

export default {
  components: {
    Perm,
    OmsCol,
    TwoColumn, MapPath, attachmentLists, OmsCostTime, Show3dData, ChartLineHand,
    MapLocation
  },
  data() {
    return {
      span: 7,
      list: [],
      times: [],
      orderType: utils.wayBillType,
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
      orderLogList: [],
      logisticsList: [],
      handOverList: [],
      devInfo: {},
      loadingLog: false,
      attachmentList: [],
      attachmentIdList: [],
      assessAttachmentIdList: [],
      assessAttachmentList: [],
      showAddFlag: false,
      detailForm: {
        incubator: '',
        thermometerList: [],
        codeList: '',
        boxCodeList: [],
        waybillId: ''
      },
      ccsDevList: [],
      boxList: [],
      doing: false,
      delivery: {
        // 默认显示地图信息
        activeName: 'map'
      }
    };
  },
  computed: {
    pageSets() {
      let ary = [
        {name: '基本信息', key: 0},
        {name: '发货信息', key: 1},
        {name: '收货信息', key: 2},
        {name: '货品信息', key: 3},
        {name: '其他信息', key: 4},
        {name: '货品列表', key: 5},
        {name: '保温箱列表', key: 6},
        {name: '预装箱结果', key: 11},
        {name: '签收信息', key: 7},
        {name: '派送信息', key: 9},
        {name: '操作日志', key: 10}
      ];
      if (this.form.qualityInspection) {
        ary.splice(8, 0, {name: '质量评估', key: 8});
      }
      return ary;
    }
  },
  props: ['formItem', 'showBigMap'],
  watch: {
    formItem: function (val) {
      if (val.id) {
        TmsWayBill.getOneTmsWayBill(val.id).then(res => {
          this.form = res.data;
          this.form.receiverAddressLongitude && this.setMarker();
          this.detailForm = {
            incubator: '',
            thermometerList: [],
            boxCodeList: [],
            codeList: '',
            waybillId: ''
          };
          this.showAddFlag = false;
          this.attachmentList = [];
          this.getFileList();
          // 查询日志信息
          this.queryLog(val.id);
          if (this.form.status === '6') {
            this.assessAttachmentList = [];
            this.getAssessFileList();
          }

          const waybillNo = this.form.waybillNumber;
          this.getLogisticsList(waybillNo);
          this.getWaybillData(waybillNo)
          this.getHandoverData(waybillNo)
        });
      }
    }
  },
  methods: {
    // 回单确认
    confirmationReceipt(){
      this.$confirm('是否确认回单附件?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // TODO

        
      }).catch(()=>{

      })
    },
    // 切换地图与物流信息的面板展示
    handleDeliveryTabClick(tab, event) {
      console.log(tab, event);
    },
    formatNumberToAry(value) {
      if (!value) {
        this.detailForm.boxCodeList = [];
      }
      let list = value.split(/[\n,\s，]/g).filter(i => i);
      list.forEach(v => {
        this.detailForm.boxCodeList.push({boxCode: v});
      })
    },
    setMarker() {
      const that = this.$refs['bdMap'];
      if (!that) {
        setTimeout(() => {
          this.setMarker();
        }, 1000);
        return;
      }
      that.clear();
      that.onSearchResult([
        {lng: this.form.receiverAddressLongitude, lat: this.form.receiverAddressDimension}
      ]);
    },
    onSubmit: function () {
      if (!this.detailForm.incubator && !this.detailForm.thermometerList.length) {
        this.$notify.warning({
          duration: 2000,
          message: '请选择保温箱或者温度计静香绑定'
        });
        return;
      }
      this.detailForm.waybillId = this.form.id;
      this.doing = true;
      this.$http.post('tms-waybill-pack/waybill', this.detailForm).then(res => {
        this.doing = false;
        this.showAddFlag = !this.showAddFlag;
        this.$notify.success({
          duration: 2000,
          message: '新增保温箱成功'
        });
        // 清空表单
        this.detailForm = {
          incubator: '',
          thermometerList: [],
          codeList: '',
          boxCodeList: [],
          waybillId: ''
        };
        // 刷新页面信息
        TmsWayBill.getOneTmsWayBill(this.form.id).then(res => {
          this.form = res.data;
          this.attachmentList = [];
          this.getFileList();
          if (this.form.status === '6') {
            this.assessAttachmentList = [];
            this.getAssessFileList();
          }
        });
      }).catch(error => {
        this.$notify.error({
          duration: 2000,
          message: error.response && error.response.data && error.response.data.msg || '新增保温箱失败'
        });
        this.doing = false;
      });
    },
    queryBoxList: function (query) {
      let params = {
        keyWord: query,
        pageNo: 1,
        pageSize: 20
      };
      this.$http.get('/dev-detail/free-dev', {params}).then(res => {
        this.boxList = res.data.list;
      });
    },
    queryDevList: function (query) {
      let params = {
        keyWord: query,
        pageNo: 1,
        pageSize: 20,
        devType: 1
      };
      this.$http.get('/tms-waybill-pack/dev', {params}).then(res => {
        this.ccsDevList = res.data.currentList;
      });
    },
    showAdd: function () {
      this.showAddFlag = !this.showAddFlag;
    },
    formatGoodsPackage: function (item) {
      if (item) {
        return '包装：' + item.goodsLength + 'cm' + ' x ' + item.goodsWidth + 'cm' + ' x ' + item.goodsHeight + 'cm';
      }
    },
    getPageSet(key) {
      return this.pageSets.filter(f => f.key === key)[0];
    },
    formatTime(date) {
      return date ? '绑定时间：' + this.$moment(date).format('YYYY-MM-DD HH:mm:ss') : '';
    },
    queryLog: function (id) {
      if (!id) return;
      this.loadingLog = true;
      let params = Object.assign({}, {
        pageNo: 1,
        pageSize: 100,
        objId: id,
        objType: 'tms-waybill'
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
    isQualityFlag: function (value) {
      let title = '';
      if (value) {
        title = '合格';
      } else {
        title = '不合格';
      }
      return title;
    },
    isShow: function (title) {
      if (title === 'show') return true;
      return this.$store.state.permissions.indexOf(title) !== -1;
    },
    deleteDevBox: function (item) {
      // 删除温度计
      this.$confirm('确认删除保温箱"' + item.boxNo + '"的数据?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        TmsPack.deleteDevBox(item.id).then(res => {
          this.$notify.success({
            duration: 2000,
            message: '删除保温箱' + item.boxNo + '成功'
          });
          // 刷新页面信息
          TmsWayBill.getOneTmsWayBill(this.form.id).then(res => {
            this.form = res.data;
            this.attachmentList = [];
            this.getFileList();
            if (this.form.status === '6') {
              this.assessAttachmentList = [];
              this.getAssessFileList();
            }
          });
        }).catch(error => {
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '删除保温箱' + item.devNo + '失败'
          });
        });
      }).catch(() => {

      });

    },
    deleteThermometer: function (no) {
      // 删除温度计
      TmsPack.deleteTemperature(no.id).then(res => {
        this.$notify.success({
          duration: 2000,
          message: '删除温度计' + no.thermometerNo + '成功'
        });
        // 刷新页面信息
        TmsWayBill.getOneTmsWayBill(this.form.id).then(res => {
          this.form = res.data;
          this.attachmentList = [];
          this.getFileList();
          if (this.form.status === '6') {
            this.assessAttachmentList = [];
            this.getAssessFileList();
          }
        });
      }).catch(error => {
        this.$notify.error({
          duration: 2000,
          message: error.response && error.response.data && error.response.data.msg || '删除温度计' + no.thermometerNo + '失败'
        });
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
    getFileList: function () {
      if (!this.form.id) return;
      OmsAttachment.queryOneAttachmentList(this.form.id, 'waybill').then(res => {
        this.attachmentList = res.data;
        let ids = [];
        this.attachmentList.forEach(file => {
          ids.push(file.attachmentId);
        });
        this.form.attachmentIdList = ids;
      });
    },
    getAssessFileList: function () {
      if (!this.form.id) return;
      OmsAttachment.queryOneAttachmentList(this.form.id, 'waybill-check').then(res => {
        this.assattachmentList = res.data;
        let ids = [];
        this.assattachmentList.forEach(file => {
          ids.push(file.attachmentId);
        });
        this.form.assessAttachmentIdList = ids;
      });
    },
    changeFiles: function (fileList) {
      let ids = [];
      fileList.forEach(file => {
        ids.push(file.attachmentId);
      });
      this.form.attachmentIdList = ids;
      // 绑定附件
      TmsWayBill.update(this.form.id, {attachmentIdList: ids}).then(res => {
      });
    },
    selectTab(item) {
      this.currentTab = item;
    },
    close() {
      this.$emit('right-close');
    },
    // 获取物流信息（文字版）
    getLogisticsList(waybillNo) {
      this.$http.get(`/logistics/queryTmsLogisticsByNo?waybillNo=${waybillNo}`)
        .then(res => {
          this.logisticsList = res.data;
        })
        .catch(() => {
          // 不处理
        })
    },
    getWaybillData(waybillNo) {
      this.$http.get(`tms-waybill/${waybillNo}/waybill`)
        .then(res => {
          this.devInfo = res.data
        })
    },
    getHandoverData(waybillNo) {
      this.$http.get(`tms-waybill/handover-data/${waybillNo}`)
        .then(res => {
          res.data.forEach(item => {
            item.dataDtoList.forEach(i => {
              let collectionTime = this.$moment(i.collectionTime).format('YYYY-MM-DD HH:mm');
              i.collectionTime = this.$moment(collectionTime).valueOf();
            })
          });

          this.handOverList = res.data;
          if (res.data.length > 0) {
            const tempData = res.data[0];
            if (tempData.startTime && !this.devInfo.departTime) {
              this.devInfo.departTime = tempData.startTime;
            }

            if (tempData.endTime && !this.devInfo.departTime) {
              this.devInfo.arriveTime = tempData.endTime;
            }
          }

        })
    }
  },
};
</script>
