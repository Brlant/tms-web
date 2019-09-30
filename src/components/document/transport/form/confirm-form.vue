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
          <el-button plain @click="createWayBill" :disabled="doing">确认运单</el-button>
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
              <oms-col label="电话" :rowSpan="span" :value="form.senderContactPhone"/>
              <oms-col label="发货地址" :rowSpan="span" :value="form.senderAddress"/>
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
              <oms-col label="电话" :rowSpan="8" :value="form.receiverContractPhone"/>
              <oms-col label="收货地址" :rowSpan="6" :value="form.receiverAddress"/>
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
                </el-table-column>
                <el-table-column prop="thermometerNoList" label="温度计列表">
                  <template slot-scope="scope">
                  <span v-for="no in scope.row.thermometerNoList">
                      {{no.thermometerNo}} <span
                    v-if="scope.row.thermometerNoList.indexOf(no)!==scope.row.thermometerNoList.length-1">,</span>
                  </span>
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
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit" :class="{active: pageSets[8].key === currentTab.key}">
                {{pageSets[8].name}}</h3>
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
  import {TmsWayBill} from '@/resources';
  import MapPath from '../../common/map-path-new';

  export default {
    components: {TwoColumn, MapPath},
    data () {
      return {
        attachmentList: [],
        span: 7,
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
        this.orderIdList = [];
        this.dataList = val;
        if (val.length) {
          this.dataList.forEach(val => {
            let index = this.orderIdList.indexOf(val.id);
            if (index === -1) {
              this.orderIdList.push(val.id);
            }
          });
          this.showOrder(val[0], 0);
        }
      }
    },
    methods: {
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
              message: error.response && error.response.data && error.response.data.msg || '确认运单失败'
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
      selectTab (item) {
        this.currentTab = item;
      },
      close () {
        this.$emit('right-close');
      }
    }
  };
</script>
