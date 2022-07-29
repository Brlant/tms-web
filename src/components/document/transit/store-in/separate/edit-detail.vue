<style lang="scss" scoped>
  .content-part {
    .content-right {
      > h3 {
        left: 0;
      }
      left: 0;
      padding-left: 25px;
      padding-right: 25px;
    }
  }

  .tr-bg {
    background: #eeeeee;
  }

  .table > tbody > tr:first-child > td {
    border-top: 0;
  }

  .batch-info {
    .oms-row {
      margin-bottom: 10px;
    }
  }

  .show-item {
    padding: 5px 10px;
    border: 1px solid #f1f1f1;
    margin-bottom: 10px;
    overflow: hidden;
    .store {
      float: left;
    }
    .count {
      float: right;
    }
  }

  .mb0 {
    margin-bottom: 0;
  }

  .el-form-item {
    margin-bottom: 2px;
  }

</style>
<template>
  <div>
    <div class="content-part">
      <div class="content-right content-padding">
        <h3>{{ $route.meta.type === 0 ? '整件' : '散件' }}入库任务详情</h3>
        <div class="page-main-body padding">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="订单详情" name="1">
              <el-row class="mb0">
                <el-col :span="12">
                  <oms-row label="订单号">
                    {{info.orderNo}}
                  </oms-row>
                  <oms-row label="货主">
                    {{info.orgName}}
                  </oms-row>
                </el-col>
                <el-col :span="12">
                  <oms-row label="业务类型">
                    <dict :dict-group="'bizInType'" :dict-key="info.bizType"></dict>
                  </oms-row>
                  <oms-row label="来源单位">
                    {{info.supplierName}}
                  </oms-row>
                  <oms-row label="状态" class="mb0">
                    {{ getWaveStatus(info) }}
                  </oms-row>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="货品详情" name="2">
              <el-form ref="form" :rules="rules" :model="info" label-width="236px">
                <two-column>
                  <el-form-item slot="left" label="货品主档名称:">
                    {{info.goodsName}}
                  </el-form-item>
                  <el-form-item slot="right" label="批号:" prop="batchNumberId">
                    <el-select v-model="info.batchNumberId" filterable clearable remote
                               :remoteMethod="filterBatchNumber"
                               @click.native="filterBatchNumber('')" placeholder="请输入批号名称搜索批号"
                               @change="batchNumberIdChange" @clear="clearBatchNumberId">
                      <el-option v-for="item in batchNumberList" :value="item.id" :key="item.id"
                                 :label="item.batchNumber">
                        {{ item.batchNumber }}
                      </el-option>
                    </el-select>
                  </el-form-item>
                </two-column>
                <two-column>
                  <el-form-item slot="left" label="生产单位:">
                    {{info.factoryName}}
                  </el-form-item>
                  <el-form-item slot="right" label="生产日期:">
                    {{info.productionDate | date}}
                  </el-form-item>
                </two-column>
                <two-column>
                  <el-form-item slot="left" label="货品规格:">
                    {{info.specification}}
                  </el-form-item>
                  <el-form-item slot="right" label="有效期:">
                    {{info.expirationDate | date}}
                  </el-form-item>
                </two-column>
                <two-column>
                  <el-form-item slot="left" label="数量:">
                    <oms-input type="number" v-model.trim.number="info.count" placeholder="请输入数量"
                               style="width: 200px">
                      <template slot="append">
                        {{info.packageUnit}}
                      </template>
                    </oms-input>
                  </el-form-item>
                  <el-form-item slot="right" label="是否合格:">
                    <el-radio-group v-model="info.qualifiedFlag" size="small">
                      <el-radio-button label="true">是</el-radio-button>
                      <el-radio-button label="false">否</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </two-column>
                <el-form-item label-width="236px">
                  <el-button type="primary" plain @click="onSubmit('form')" :disabled="doing">保存</el-button>
                </el-form-item>
              </el-form>
            </el-collapse-item>
            <el-collapse-item title="货位详情" name="3" v-if="storeList.length">
              <oms-row :span="5" label="分配货位" v-show="storeList.length && status !== '5'">
                <div v-if="storeList[0].length === 1">
                  <span>{{ storeList[0].centreName }}/</span>
                  <span>{{ storeList[0].warehouseName }}/</span>
                  <span>{{ storeList[0].areaName }}/</span>
                  <span>{{ storeList[0].storeName }}</span>
                </div>
                <div v-else>
                  <ul class="show-list">
                    <li class="show-item" v-for="item in storeList">
                      <span class="store">
                        <span>{{ item.centreName }}/</span>
                        <span>{{ item.warehouseName }}/</span>
                        <span>{{ item.areaName }}/</span>
                        <span>{{ item.storeName }}</span>
                      </span>
                      <span class="count">
                        分配数量:{{ item.count }}
                      </span>
                    </li>
                  </ul>
                </div>
              </oms-row>
              <oms-row :span="5" label="分配货位" v-show="storeList.length && status === '5'" class="mb0">
                <div>
                  <ul class="show-list">
                    <template v-for="item in storeList">
                      <template v-for="b in item.batchNumberList">
                        <template v-for="p in b.packageList">
                          <li class="show-item" v-for="s in p.list">
                            <span class="store">
                              <span>{{ s.centreName }}/</span>
                              <span>{{ s.warehouseName }}/</span>
                              <span>{{ s.areaName }}/</span>
                              <span>{{ s.storeName }}</span>
                            </span>
                            <span class="count">
                              分配数量:{{ s.storeQuantity }}
                            </span>
                          </li>
                        </template>
                      </template>
                    </template>
                  </ul>
                </div>
              </oms-row>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {InHouseWork, OrgGoods} from '@/resources';
import TwoColumn from '@dtop/dtop-web-common/packages/two-column';

export default {
    props: {
      taskId: String,
      orgType: Object,
      showPartIndex: String,
      status: String
    },
    components: {TwoColumn},
    data() {
      return {
        rules: {
          orgGoodsId: [
            {required: true, message: '请选择货主货品', trigger: 'blur'}
          ],
          batchNumberId: [
            {required: true, message: '请选择批号', trigger: 'blur'}
          ]
        },
        info: {},
        storeList: [],
        activeNames: ['1', '2', '3'],
        orgGoodsList: [],
        batchNumberList: [],
        doing: false,
        goodsChange: false
      };
    },
    watch: {
      showPartIndex(val) {
        this.info = {};
        if (val !== '6') return;
        this.queryDetails();
        this.getStores();
      }
    },
    methods: {
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.doing = true;
            InHouseWork.updateInHouseWork(this.info.id, this.info).then(res => {
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '修改入库任务成功'
              });
              this.doing = false;
              this.$emit('right-close');
            }).catch(error => {
              this.$notify.error({
                message: error.response && error.response.data && error.response.data.msg || '修改入库任务失败'
              });
              this.doing = false;
            });
          }
        });
      },
      clearBatchNumberId: function () {
        this.info.productionDate = '';
        this.info.expirationDate = '';
      },
      clearOrgGoodsId: function () {
        this.batchNumberList = [];
        this.info.batchNumberId = '';
        this.info.factoryName = '';
        this.info.specification = '';
        this.info.goodsName = '';
        this.info.productionDate = '';
        this.info.expirationDate = '';
      },
      batchNumberIdChange: function (batchNumberId) {
        if (!batchNumberId) return;
        this.batchNumberList.forEach(item => {
          if (item.id === batchNumberId) {
            this.info.productionDate = item.productionDate;
            this.info.expirationDate = item.expirationDate;
          }
        });
      },
      orgGoodsChange: function (orgGoodsId) {
        if (!orgGoodsId) return;
        this.orgGoodsList.forEach(item => {
          if (item.orgGoodsDto.id === orgGoodsId) {
            // 设置对应的参数
            this.info.goodsName = item.orgGoodsDto.goodsDto.name;
            this.info.factoryName = item.orgGoodsDto.goodsDto.factoryName;
            this.info.specification = item.orgGoodsDto.goodsDto.specifications;
            this.info.goodsId = item.orgGoodsDto.goodsId;
            this.info.orgGoodsId = item.orgGoodsDto.id;
            this.goodsChange = true;
            let packageDtoList = item.orgGoodsDto.goodsDto.packageDtoList;
            // 修改货品单位
            if (this.$route.meta.type === 0) {
              // 整件
              if (packageDtoList) {
                this.info.packageUnit = packageDtoList[0].packageUnit;
              }
            } else {
              // 散件
              if (packageDtoList) {
                this.info.packageUnit = packageDtoList[packageDtoList.length - 1].packageUnit;
              }
            }
          }
        });
      },
      filterOrgGoods(query) {
        this.orgGoodsList = [];
        if (!this.info.orgId) return;
        let params = Object.assign({}, {
          deleteFlag: false,
          orgId: this.info.orgId,
          keyWord: query
        });
        OrgGoods.query(params).then(res => {
          this.orgGoodsList = res.data.list;
        });
      },
      filterBatchNumber(query) { // 批号
        if (!this.info.orgGoodsId) {
          this.$notify.error({
            duration: 2000,
            name: '失败',
            message: '请先选择货品'
          });
          return;
        }
        let goodsId = '';
        this.orgGoodsList.forEach(item => {
          if (item.orgGoodsDto.id === this.info.orgGoodsId) {
            goodsId = item.orgGoodsDto.goodsId;
          }
        });
        if (!goodsId) return;
        this.$http.get('/batch-number/pager', {
          params: {
            keyWord: query,
            goodsId
          }
        }).then(res => {
          this.batchNumberList = res.data.list;
        });
      },
      queryDetails() {
        InHouseWork.get(this.taskId).then(res => {
          this.info = res.data;
          // 查询货品
          // this.filterOrgGoods(this.info.goodsName);
          // 查询批号
          this.$http.get('/batch-number/pager', {
            params: {
              goodsId: this.info.goodsId
            }
          }).then(res => {
            this.batchNumberList = res.data.list;
          });
        });
      },
      getWaveStatus: function (order) { // 获取订单状态
        let state = '';
        for (let key in this.orgType) {
          if (order.status === this.orgType[key].status) {
            state = this.orgType[key].title;
          }
        }
        return state;
      },
      getStores: function () { // 根据类型，得到货位列表
        if (this.status !== '5') {
          InHouseWork.queryAssignStore(this.taskId).then(res => {
            this.storeList = res.data;
          });
        } else { //
          InHouseWork.queryShelfGoodsDetail(this.taskId).then(res => {
            this.storeList = res.data;
          });
        }
      }
    }
  };
</script>
