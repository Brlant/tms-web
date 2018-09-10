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
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">{{showTitle}}运单</template>
    <template slot="btn">
      <el-button plain @click="save('form')" :disabled="doing">保存</el-button>
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
            <two-column>
              <el-form-item slot="left" label="运单号">
                <oms-input v-model="form.waybillNumber" placeholder="请输入运单号"></oms-input>
              </el-form-item>
              <!--<el-form-item slot="right" label="委托单号">-->
              <!--<oms-input v-model="form.tmsOrderNumber" placeholder="请输入"></oms-input>-->
              <!--</el-form-item>-->
            </two-column>
            <two-column>
              <el-form-item slot="left" label="运单类型" prop="waybillType">
                <el-select v-model="form.waybillType" placeholder="请选择运单类型" :clearable="true">
                  <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in typeList"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item slot="right" label="发运方式" prop="shipmentWay">
                <el-select v-model="form.shipmentWay" placeholder="请选择发运方式" :clearable="true">
                  <el-option :label="item.label" :value="item.key" :key="item.key"
                             v-for="item in shipmentWayList"></el-option>
                </el-select>
              </el-form-item>
            </two-column>
            <!--<two-column>-->
            <!--<el-form-item slot="left" label="服务方式">-->
            <!--<el-select v-model="form.serviceType" placeholder="请选择服务方式" :clearable="true">-->
            <!--<el-option :label="item.label" :value="item.key" :key="item.key"-->
            <!--v-for="item in serviceTypeList"></el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <!--</two-column>-->
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">
              {{pageSets[1].name}}</h3>
          </div>
          <div class="content">
            <el-form-item label="货主">
              <el-select filterable remote placeholder="请输入名称/拼音首字母缩写/系统代码搜索货主" :remote-method="filterCustomer"
                         :clearable="true"
                         v-model="form.orgId" popperClass="good-selects">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in customerList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.name}}</span>
                  </div>
                  <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                      <span>系统代码:</span>{{org.manufacturerCode}}
                    </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发货单位">
              <el-select filterable remote placeholder="请输入名称/拼音首字母缩写/系统代码搜索发货单位" :remote-method="filterSenderOrg"
                         :clearable="true"
                         v-model="form.senderId" popperClass="good-selects">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in senderOrgList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.name}}</span>
                  </div>
                  <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                      <span>系统代码:</span>{{org.manufacturerCode}}
                    </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <two-column>
              <el-form-item slot="left" label="发货联系人">
                <oms-input v-model="form.senderContact" placeholder="请输入发货联系人"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="电话">
                <oms-input v-model="form.senderContactPhone" placeholder="请输入电话"></oms-input>
              </el-form-item>
            </two-column>
            <el-form-item slot="right" label="发货地址">
              <oms-input v-model="form.senderAddress" placeholder="请输入发货地址"></oms-input>
            </el-form-item>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[2].key === currentTab.key}">
              {{pageSets[2].name}}</h3>
          </div>
          <div class="content">
            <el-form-item label="收货单位" prop="receiverId">
              <el-select filterable remote placeholder="请输入名称/拼音首字母缩写/系统代码搜索收货单位" :remote-method="filterReceiverOrg"
                         :clearable="true"
                         v-model="form.receiverId" popperClass="good-selects">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in receiverOrgList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.name}}</span>
                  </div>
                  <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                      <span>系统代码:</span>{{org.manufacturerCode}}
                    </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <two-column>
              <el-form-item slot="left" label="收货联系人">
                <oms-input v-model="form.receiverContact" placeholder="请输入收货联系人"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="电话">
                <oms-input v-model="form.receiverContractPhone" placeholder="请输入电话"></oms-input>
              </el-form-item>
            </two-column>
            <el-form-item slot="right" label="收货地址" prop="receiverAddress">
              <oms-input v-model="form.receiverAddress" placeholder="请输入收货地址"></oms-input>
            </el-form-item>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[3].key === currentTab.key}">
              {{pageSets[3].name}}</h3>
          </div>
          <div class="content">
            <two-column>
              <el-form-item slot="left" label="整装箱数" prop="wholeBoxCount">
                <oms-input type="integer" :min="0" v-model="form.wholeBoxCount" placeholder="请输入整装箱数"
                           @blur="setWholeBoxCount(form.wholeBoxCount)"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="散装箱数" prop="bulkBoxCount">
                <oms-input type="number" :min="0" v-model="form.bulkBoxCount" placeholder="请输入散装箱数"
                           @blur="setBulkBoxCount(form.bulkBoxCount)"></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="包件数" prop="incubatorCount">
                <oms-input type="number" :min="0" v-model="form.incubatorCount" placeholder="请输入包件数"
                           @blur="setIncubatorCount(form.incubatorCount)"></oms-input>
              </el-form-item>
              <el-form-item slot="right" label="声明价格">
                <oms-input type="number" :min="0" v-model="form.goodsPrice" placeholder="请输入声明价格">
                  <template slot="prepend">¥</template>
                </oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="重量" prop="goodsWeight">
                <oms-input v-model="form.goodsWeight" placeholder="请输入货品重量"
                           @blur="setGoodsWeight(form.goodsWeight)">
                  <template slot="append">kg</template>
                </oms-input>
              </el-form-item>
              <el-form-item slot="right" label="体积" prop="goodsVolume">
                <oms-input v-model="form.goodsVolume" placeholder="请输入货品体积"
                           @blur="setGoodsVolume(form.goodsVolume)">
                  <template slot="append">m³</template>
                </oms-input>
              </el-form-item>
            </two-column>
            <el-form-item label="货品名称">
              <oms-input v-model="form.goodsTotalName" placeholder="如果填写货品清单，货品名称会根据货品清单自动生成。"></oms-input>
            </el-form-item>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[4].key === currentTab.key}">{{pageSets[4].name}}
              <span @click="addGoods" class="btn-circle"><i class="el-icon-t-plus"></i> </span></h3>
          </div>
          <div class="content">
            <div class="part-hj-box" v-for="hj in form.goodsList" v-show="form.goodsList">
              <el-form-item label="货品名称">
                <oms-input v-model="hj.goodsName" placeholder="请输入货品名称"></oms-input>
              </el-form-item>
              <el-form-item label="批号">
                <oms-input v-model="hj.batchNumber" placeholder="请输入批号"></oms-input>
              </el-form-item>
              <two-column>
                <el-form-item slot="left" label="单价">
                  <oms-input v-model="hj.goodsUnitPrice" placeholder="请输入单价" type="number" :min="0"></oms-input>
                </el-form-item>
                <el-form-item slot="right" label="数量">
                  <oms-input v-model="hj.goodsCount" type="number" :min="0" placeholder="请输入数量"></oms-input>
                </el-form-item>
              </two-column>
              <el-form-item label="生产厂商">
                <oms-input v-model="hj.goodsFactory" placeholder="请输入生产厂商"></oms-input>
              </el-form-item>
              <el-form-item label="供货厂商">
                <oms-input v-model="hj.supplyManufacturers" placeholder="请输入供货厂商"></oms-input>
              </el-form-item>
              <two-column>
                <el-form-item slot="left" label="整件长">
                  <oms-input type="number" :min="0" v-model="hj.goodsLength" placeholder="请输入整件长">
                    <template slot="append">cm</template>
                  </oms-input>
                </el-form-item>
                <el-form-item slot="right" label="整件宽">
                  <oms-input type="number" :min="0" v-model="hj.goodsWidth" placeholder="请输入整件宽">
                    <template slot="append">cm</template>
                  </oms-input>
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="整件高">
                  <oms-input type="number" :min="0" v-model="hj.goodsHeight" placeholder="请输入整件高">
                    <template slot="append">cm</template>
                  </oms-input>
                </el-form-item>
                <el-form-item slot="right" label="整装箱数">
                  <oms-input type="number" :min="0" v-model="hj.wholeBoxCount" placeholder="请输入整装箱数">
                  </oms-input>
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="货品重量">
                  <oms-input type="number" :min="0" v-model="hj.weight" placeholder="请输入货品重量">
                    <template slot="append">kg</template>
                  </oms-input>
                </el-form-item>
                <el-form-item slot="right" label="货品体积">
                  <oms-input type="number" :min="0" v-model="hj.volume" placeholder="请输入货品体积">
                    <template slot="append">m³</template>
                  </oms-input>
                </el-form-item>
              </two-column>
              <two-column>
                <el-form-item slot="left" label="货品规格">
                  <oms-input v-model="hj.specifications" placeholder="请输入货品规格"></oms-input>
                </el-form-item>
                <el-form-item slot="right" label="追溯码">
                  <oms-input v-model="hj.code" placeholder="请输入追溯码"></oms-input>
                </el-form-item>
              </two-column>
              <el-form-item label-width="120px">
                <el-button @click.prevent="remove(hj)" :plain="true" type="danger">删除货品详情</el-button>
              </el-form-item>
            </div>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[5].key === currentTab.key}">
              {{pageSets[5].name}}</h3>
          </div>
          <div class="content">
            <two-column>
              <el-form-item slot="left" label="提货时间">
                <el-date-picker
                  v-model="form.pickUpTime"
                  type="date"
                  placeholder="选择提货时间" format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
              <el-form-item slot="right" label="送达时限">
                <el-date-picker
                  v-model="form.deliveryTime"
                  type="date"
                  placeholder="选择送达时限" format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </two-column>
            <el-form-item label="始发地">
              <oms-input v-model="form.provenance" placeholder="请输入始发地"></oms-input>
            </el-form-item>
            <el-form-item label="目的地">
              <oms-input v-model="form.destination" placeholder="请输入目的地"></oms-input>
            </el-form-item>
            <el-form-item slot="right" label="备注">
              <oms-input v-model="form.remark" type="textarea" placeholder="请输入备注"></oms-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {BaseInfo, TmsWayBill} from '@/resources';
  import TwoColumn from '@dtop/dtop-web-common/packages/two-column';

  export default {
    components: {TwoColumn},
    data () {
      return {
        list: [],
        times: [],
        pageSets: [
          {name: '基本信息', key: 0},
          {name: '发货信息', key: 1},
          {name: '收货信息', key: 2},
          {name: '货品信息', key: 3},
          {name: '货品列表', key: 4},
          {name: '其他信息', key: 5}
        ],
        currentTab: {},
        form: {
          goodsList: [
            {
              goodsName: '',
              specifications: '',
              weight: '',
              volume: '',
              code: '',
              batchNumber: '',
              goodsUnitPrice: '',
              goodsCount: '',
              goodsFactory: '',
              supplyManufacturers: '',
              goodsLength: '',
              goodsWidth: '',
              goodsHeight: '',
              wholeBoxCount: ''
            }
          ]
        },
        doing: false,
        rules: {
          waybillType: [
            {required: true, message: '请选择运单类型', trigger: 'change'}
          ],
          shipmentWay: [
            {required: true, message: '请选择发运方式', trigger: 'change'}
          ],
          receiverId: [
            {required: true, message: '请选择收货单位', trigger: 'change'}
          ],
          receiverAddress: [
            {required: true, message: '请输入收货地址', trigger: 'blur'}
          ],
          wholeBoxCount: [
            {required: true, type: 'integer', message: '请输入整装箱数', trigger: 'blur'}
          ],
          bulkBoxCount: [
            {required: true, type: 'integer', message: '请输入散装箱数', trigger: 'blur'}
          ],
          incubatorCount: [
            {required: true, type: 'integer', message: '请输入包件数', trigger: 'blur'}
          ],
          goodsWeight: [
            {required: true, type: 'number', message: '请输入货品重量', trigger: 'blur'}
          ],
          goodsVolume: [
            {required: true, type: 'number', message: '请输入货品体积', trigger: 'blur'}
          ]
        },
        customerList: [],
        senderOrgList: [],
        receiverOrgList: []
      };
    },
    computed: {
      shipmentWayList () {
        return this.$getDict('transportationCondition');
      },
      typeList () {
        return this.$getDict('bizType');
      },
      serviceTypeList () {
        return this.$getDict('serviceType');
      },
      showTitle: function () {
        let title = '新增';
        if (this.action === 'edit') {
          title = '修改';
        }
        return title;
      }
    },
    props: ['formItem', 'action'],
    watch: {
      formItem: function (val) {
        if (this.action === 'add') {
          this.form = Object.assign({}, val);
        }
        if (this.action === 'edit') {
          if (val.id) {
            TmsWayBill.getOneTmsWayBill(val.id).then(res => {
              this.form = res.data;
              this.filterCustomer(this.form.orgName);
              this.filterSenderOrg(this.form.senderName);
              this.filterReceiverOrg(this.form.receiverName);
              if (this.form.goodsList.length === 0) {
                this.addGoods();
              }
            });
          }
        }
      }
    },
    methods: {
      remove: function (item) {
        let index = this.form.goodsList.indexOf(item);
        // 移除删除项
        this.form.goodsList.splice(index, 1);
        // // 重新计算排序值
        // let delDtoList = this.form.goodsList;
        // let delList = [];
        // for (let i = 0; i < delDtoList.length ; i++) {
        //   let value = delDtoList[i];
        //   let no = value.index;
        //   // 比删除项大的排序值-1
        //   if (no > item.index) {
        //     value = Object.assign(value, {'index': no - 1});
        //   }
        //   delList.push(value);
        // }
        // this.form = {
        //   goodsList: delList
        // };
      },
      setWholeBoxCount: function (value) {
        if (!value || isNaN(value)) return;
        this.form.wholeBoxCount = parseInt(value, 10);
      },
      setBulkBoxCount: function (value) {
        if (!value || isNaN(value)) return;
        this.form.bulkBoxCount = parseInt(value, 10);
      },
      setIncubatorCount: function (value) {
        if (!value || isNaN(value)) return;
        this.form.incubatorCount = parseInt(value, 10);
      },
      setGoodsWeight: function (value) {
        if (!value || isNaN(value)) return;
        this.form.goodsWeight = parseFloat(value);
      },
      setGoodsVolume: function (value) {
        if (!value || isNaN(value)) return;
        this.form.goodsVolume = parseFloat(value);
      },
      addGoods: function () {
        let tpl = {};
        // 计算排序值
        tpl = Object.assign(tpl, {goodsName: '', specifications: '', weight: '', volume: '', code: ''});
        this.form.goodsList.splice(0, 0, tpl);
      },
      filterCustomer: function (query) {// 过滤货主
        BaseInfo.query({keyWord: query}).then(res => {
          this.customerList = res.data.list;
        });
      },
      filterSenderOrg: function (query) {// 过滤发货单位
        BaseInfo.query({keyWord: query}).then(res => {
          this.senderOrgList = res.data.list;
        });
      },
      filterReceiverOrg: function (query) {// 过滤收货单位
        BaseInfo.query({keyWord: query}).then(res => {
          this.receiverOrgList = res.data.list;
        });
      },
      selectTab (item) {
        this.currentTab = item;
      },
      save (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            // 处理货品列表
            if (this.form.goodsList) {
              let goodsList = [];
              this.form.goodsList.forEach(val => {
                if (val.goodsName !== '' || val.specifications !== '' || val.weight !== '' || val.volume !== '' || val.code !== '') {
                  goodsList.push(val);
                }
              });
              this.form.goodsList = goodsList;
            }
            if (this.action === 'add') {
              this.doing = true;
              TmsWayBill.save(this.form).then(res => {
                this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '新增运单成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(error => {
                this.$notify.error({
                  duration: 2000,
                  message: error.response && error.response.data && error.response.data.msg || '新增运单失败'
                });
                this.doing = false;
              });
            } else {
              this.doing = true;
              TmsWayBill.update(this.form.id, this.form).then(res => {
                this.$notify.success({
                  name: '成功',
                  message: '修改运单"' + this.form.orderNo + '"成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(error => {
                this.$notify.error({
                  duration: 2000,
                  message: error.response && error.response.data && error.response.data.msg || '修改运单失败'
                });
                this.doing = false;
              });
            }
          } else {

          }
        });

      }
    }
  };
</script>
