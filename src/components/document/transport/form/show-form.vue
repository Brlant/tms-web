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
    <template slot="title">运单</template>
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
            <oms-col label="运单状态" :rowSpan="span" :value="form.status">
              {{formatStatusTitle(form.status, orderType)}}
            </oms-col>
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
            <oms-col label="修改人" :rowSpan="span" :value="form.updateName"/>
            <oms-col label="修改时间" :rowSpan="span" :value="form.updateTime">{{form.updateTime|time}}</oms-col>
            <oms-col label="司机" :rowSpan="span" :value="form.driverName"/>
            <oms-col label="车牌号" :rowSpan="span" :value="form.carNo"/>
            <oms-col label="启运时间" :rowSpan="span" :value="form.startTransportTime">{{form.startTransportTime|time}}
            </oms-col>
            <oms-col label="送达时间" :rowSpan="span" :value="form.waybillCompleteTime">{{form.waybillCompleteTime|time}}
            </oms-col>
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
              {{pageSets[2].name}}</h3>
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
              {{pageSets[3].name}}</h3>
          </div>
          <div class="content">
            <oms-col label="整装箱数" :rowSpan="span" :value="form.wholeBoxCount" isShow="true"/>
            <oms-col label="散装箱数" :rowSpan="span" :value="form.bulkBoxCount" isShow="true"/>
            <oms-col label="包件数" :rowSpan="span" :value="form.incubatorCount" isShow="true"/>
            <oms-col label="声明价格" :rowSpan="span" :value="form.goodsPrice" isShow="true">
              <span v-if="form.goodsPrice">¥</span> {{form.goodsPrice}}
            </oms-col>
            <oms-col label="重量" :rowSpan="span" :value="form.goodsWeight" isShow="true">
              {{form.goodsWeight}} <span v-if="form.goodsWeight">kg</span>
            </oms-col>
            <oms-col label="体积" :rowSpan="span" :value="form.goodsVolume" isShow="true">
              {{form.goodsVolume}} <span v-if="form.goodsVolume">m³</span>
            </oms-col>
            <el-col :span="24">
              <div>
                <oms-row label="货品名称" :span="4">
                  <slot>{{form.goodsTotalName}}</slot>
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
              {{pageSets[4].name}}</h3>
          </div>
          <div class="content">
            <oms-col label="提货时间" :rowSpan="span" :value="form.pickUpTime">{{form.pickUpTime|date}}</oms-col>
            <oms-col label="送达时限" :rowSpan="span" :value="form.deliveryTime">{{form.deliveryTime|date}}</oms-col>
            <oms-col label="始发地" :rowSpan="span" :value="form.provenance"/>
            <oms-col label="目的地" :rowSpan="span" :value="form.destination"/>
            <oms-col label="备注" :rowSpan="span" :value="form.remark"/>
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
              <el-table-column prop="code" label="追溯码">
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
                <template slot-scope="scope">
                  <el-tooltip effect="dark" :content="formatTime(scope.row.createTime)" placement="right">
                    <el-tag :closable="form.status!=='3'&&isShow('tms-waybill-temperature-delete')"
                            @close="deleteDevBox(scope.row)" :key="scope.row.boxNo">
                      {{scope.row.boxNo}}
                    </el-tag>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="thermometerNoList" label="温度计列表">
                <template slot-scope="scope">
                  <el-tag v-for="no in scope.row.thermometerNoList"
                          :closable="form.status!=='3'&&isShow('tms-waybill-temperature-delete')"
                          :key="no.thermometerNo" @close="deleteThermometer(no)">
                    {{no.thermometerNo}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="codeList" label="追溯码">
                <template slot-scope="scope">
                  <div v-for="code in scope.row.codeList">
                    {{code}}
                  </div>
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
              <oms-upload :fileList="attachmentList" @change="changeFiles"
                          :formData="{ objectId: form.id, objectType: 'waybill'}"></oms-upload>
            </el-form-item>
          </div>
        </div>
        <div class="form-header-part" v-if="form.status==='6'&&form.qualityInspection">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[8].key === currentTab.key}">
              {{pageSets[8].name}}</h3>
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
                      {{isQualityFlag(form.qualityFlag)}}
                    </el-tag>
                    {{form.qualityInspection}}
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
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[9].key === currentTab.key}">
              {{pageSets[9].name}}</h3>
            <span @click="showBigMap(formItem)" class="des-btn">
               <a href="#" class="btn-circle" @click.prevent="">
                 <i class="el-icon-zoom-in"></i></a>查看大图
            </span>
          </div>
          <div class="content">
            <map-path :formItem="formItem"></map-path>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[10].key === currentTab.key}">
              {{pageSets[10].name}}</h3>
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
                    <h3><span>{{log.dateWeek}}</span></h3>
                  </TimelineItem>
                  <TimelineItem color="grey">
                    <el-row class="tiny-timeline-content">
                      <el-col :span="4">
                        <div>{{log.time}}</div>
                      </el-col>
                      <el-col :span="18"><strong>{{log.title}}</strong>
                        <el-tooltip class="item" effect="dark"
                                    :content="log.operatorOrgName ? log.operatorOrgName : '平台用户' "
                                    placement="right" v-show="log.operatorName">
                          <span class="font-gray">[{{log.operatorName}}]</span>
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

  export default {
    components: {
      Perm,
      OmsCol,
      TwoColumn, MapPath, attachmentLists, OmsCostTime
    },
    data () {
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
        loadingLog: false,
        attachmentList: [],
        attachmentIdList: [],
        assessAttachmentIdList: [],
        assessAttachmentList: []
      };
    },
    computed: {
      pageSets () {
        if (this.form.qualityInspection) {
          return {
            0: {name: '基本信息', key: 0},
            1: {name: '发货信息', key: 1},
            2: {name: '收货信息', key: 2},
            3: {name: '货品信息', key: 3},
            4: {name: '其他信息', key: 4},
            5: {name: '货品列表', key: 5},
            6: {name: '保温箱列表', key: 6},
            7: {name: '签收信息', key: 7},
            8: {name: '质量评估', key: 8},
            9: {name: '派送信息', key: 9},
            10: {name: '操作日志', key: 10}
          };
        } else {
          return {
            0: {name: '基本信息', key: 0},
            1: {name: '发货信息', key: 1},
            2: {name: '收货信息', key: 2},
            3: {name: '货品信息', key: 3},
            4: {name: '其他信息', key: 4},
            5: {name: '货品列表', key: 5},
            6: {name: '保温箱列表', key: 6},
            7: {name: '签收信息', key: 7},
            9: {name: '派送信息', key: 9},
            10: {name: '操作日志', key: 10}
          };
        }
      }
    },
    props: ['formItem', 'showBigMap'],
    watch: {
      formItem: function (val) {
        if (val.id) {
          TmsWayBill.getOneTmsWayBill(val.id).then(res => {
            this.form = res.data;
            this.attachmentList = [];
            this.getFileList();
            // 查询日志信息
            this.queryLog(val.id);
            if (this.form.status === '6') {
              this.assessAttachmentList = [];
              this.getAssessFileList();
            }
          });
        }
      }
    },
    methods: {
      formatTime (date) {
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
      formatStatusTitle (status, statusType) {
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
      selectTab (item) {
        this.currentTab = item;
      },
      close () {
        this.$emit('right-close');
      }
    }
  };
</script>
