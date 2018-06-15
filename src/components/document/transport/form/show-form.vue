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
            <oms-col label="创建时间" :rowSpan="span" :value="form.createTime">{{form.createTime|time}}</oms-col>
            <oms-col label="修改人" :rowSpan="span" :value="form.updateName"/>
            <oms-col label="修改时间" :rowSpan="span" :value="form.updateTime">{{form.updateTime|time}}</oms-col>
            <oms-col label="启运时间" :rowSpan="span" :value="form.startTransportTime">{{form.startTransportTime|time}}</oms-col>
            <oms-col label="送达时间" :rowSpan="span" :value="form.waybillCompleteTime">{{form.waybillCompleteTime|time}}</oms-col>
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
                  <el-tag :key="scope.row.id" closable
                          @close="deleteDevBox(scope.row)" v-if="form.status!=='3'"
                          v-show="isShow('tms-waybill-temperature-delete')">
                    {{scope.row.boxNo}}
                  </el-tag>
                  <el-tag :key="scope.row.id" v-if="form.status!=='3'"
                          v-show="!isShow('tms-waybill-temperature-delete')">
                    {{scope.row.boxNo}}
                  </el-tag>
                  <el-tag :key="scope.row.id" v-if="form.status==='3'">
                    {{scope.row.boxNo}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="thermometerNoList" label="温度计列表">
                <template slot-scope="scope">
                  <el-tag v-for="no in scope.row.thermometerNoList" :key="no.id" closable
                          @close="deleteThermometer(no)" v-if="form.status!=='3'"
                          v-show="isShow('tms-waybill-temperature-delete')">
                    {{no.thermometerNo}}
                  </el-tag>
                  <el-tag v-for="no in scope.row.thermometerNoList" :key="no.id" v-if="form.status!=='3'"
                          v-show="!isShow('tms-waybill-temperature-delete')">
                    {{no.thermometerNo}}
                  </el-tag>
                  <el-tag v-for="no in scope.row.thermometerNoList" :key="no.id" v-if="form.status==='3'">
                    {{no.thermometerNo}}
                  </el-tag>
                  <!--<span v-for="no in scope.row.thermometerNoList">-->

                  <!--{{no.thermometerNo}} <span-->
                  <!--v-if="scope.row.thermometerNoList.indexOf(no)!==scope.row.thermometerNoList.length-1">,</span>-->
                  <!--</span>-->
                </template>
              </el-table-column>
              <el-table-column prop="codeList" label="追溯码">
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
            <el-form-item label="附件">
              <oms-upload :fileList="attachmentList" @change="changeFiles"
                          :formData="{ objectId: form.id, objectType: 'waybill'}"></oms-upload>
            </el-form-item>
          </div>
        </div>
        <div class="form-header-part" v-show="form.status==='6'">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[8].key === currentTab.key}">
              {{pageSets[8].name}}</h3>
          </div>
          <div class="content">
            <el-col :span="24">
              <div>
                <oms-row label="中止原因" :span="4">
                  <slot>
                    <dict :dict-group="'waybillEndReason'" :dict-key="form.suspendReason"></dict>
                  </slot>
                </oms-row>
              </div>
            </el-col>
            <oms-col label="质量评估" rowSpan="8" :value="form.qualityFlag">
              {{isQualityFlag(form.qualityFlag)}}
            </oms-col>
            <oms-col label="评估结论" rowSpan="8" :value="form.qualityInspection">
              {{form.qualityInspection}}
            </oms-col>
            <el-col :span="24">
              <div>
                <oms-row label="附件" :span="4">
                  <attachment-lists :attachmentIdList="assessAttachmentIdList" :objectId="form.id"
                                    :objectType="'waybill-check'" :permission="'show'" style="padding-top: 5px"/>
                </oms-row>
              </div>
            </el-col>
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
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import TwoColumn from '@dtop/dtop-web-common/packages/two-column';
  import {OmsAttachment, TmsPack, TmsWayBill} from '@/resources';
  import MapPath from '../../common/map-path';
  import attachmentLists from '../../../common/attachment/attachmentList';
  import OmsCol from '@dtop/dtop-web-common/packages/col';
  import utils from '@/tools/utils';
  import Perm from '@/components/common/perm';

  export default {
    components: {
      Perm,
      OmsCol,
      TwoColumn, MapPath, attachmentLists},
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
        attachmentList: [],
        attachmentIdList: [],
        assessAttachmentIdList: [],
        assessAttachmentList: []
      };
    },
    computed: {
      pageSets() {
        if (this.form.suspendReason) {
          return [
            {name: '基本信息', key: 0},
            {name: '发货信息', key: 1},
            {name: '收货信息', key: 2},
            {name: '货品信息', key: 3},
            {name: '其他信息', key: 4},
            {name: '货品列表', key: 5},
            {name: '保温箱列表', key: 6},
            {name: '签收信息', key: 7},
            {name: '质量评估', key: 8},
            {name: '派送信息', key: 9}
          ];
        } else {
          return [
            {name: '基本信息', key: 0},
            {name: '发货信息', key: 1},
            {name: '收货信息', key: 2},
            {name: '货品信息', key: 3},
            {name: '其他信息', key: 4},
            {name: '货品列表', key: 5},
            {name: '保温箱列表', key: 6},
            {name: '签收信息', key: 7},
            {name: '派送信息', key: 9}
          ];
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
            if (this.form.status === '6') {
              this.assessAttachmentList = [];
              this.getAssessFileList();
            }
          });
        }
      }
    },
    methods: {
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
      }
    }
  };
</script>
