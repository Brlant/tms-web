<style scoped lang="scss">

  .content-part {
    .content-right {
      > h3 {
        left: 0;
      }
      left: 0;
    }
  }

  .pick-table {
    text-align: center;
    font-size: 12px;
    border-collapse: collapse;
    box-sizing: border-box;
    td {
      border: 1px solid #dfe6ec;
      height: 30px;
    }
    .t-head {
      background: #eef1f6;
      color: #1f2d3d;
      font-weight: bold;
    }
    .w50 {
      width: 50px;
    }
    .w150 {
      width: 150px;
    }
    .w100 {
      width: 100px;
    }
    .w200 {
      width: 200px;
    }
    .w300 {
      width: 300px;
    }
    .w400 {
      width: 400px;
    }
    .w250 {
      width: 250px;
    }
  }
</style>
<template>
  <div>
    <table class="pick-table" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td class="w400 t-head">货品</td>
        <td>
          <table cellpadding="0" cellspacing="0" border="0" frame="void">
            <tr>
              <td class="w150 t-head">批号</td>
              <td class="w100 t-head">应发数量</td>
              <td class="w300 t-head">
                <table cellpadding="0" cellspacing="0" border="0" frame="void">
                  <tr>
                    <td class="w100">包装类型</td>
                    <td class="w200">货位</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr v-if="loadingData">
        <td colspan="2" style="border: 0">
          <oms-loading :loading="loadingData"></oms-loading>
        </td>
      </tr>
      <tr v-else-if="orderList.length == 0">
        <td colspan="2" style="border: 0">
          <div class="empty-info">
            暂无信息
          </div>
        </td>
      </tr>
      <tr v-else v-for="i in orderList">
        <td class="w200">
          {{ i.goodsName }}
          <div class="f-grey">
            {{i.specification}}
          </div>
        </td>
        <td>
          <table cellpadding="0" cellspacing="0" border="0" frame="void">
            <tr v-for="i1 in i.batchNumberList">
              <td class="w150">{{ i1.batchNumber }}</td>
              <td class="w100">{{ i1.requiredQuantity }}</td>
              <td class="w300">
                <table cellpadding="0" cellspacing="0" border="0" frame="void" width="100%">

                  <tr v-for="(stores, key) in i1.kinds">
                    <td class="w100">{{ formatPackageType(key) }}</td>
                    <td class="w200">
                      <table cellpadding="0" cellspacing="0" border="0" frame="void" width="100%">
                        <tr v-for="i2 in stores">
                          <td>
                            {{ i2.list[0].storeName }}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import {InWork} from '@/resources';
import utils from '@/tools/utils';

export default {
    props: {
      orderId: String,
      index: Number
    },
    data() {
      return {
        orderList: [],
        loadingData: false
      };
    },
    watch: {
      index: function (val) {
        if (val !== 1) return;
        this.queryPicking();
      }
    },
    methods: {
      formatPackageType: utils.formatPackageType,
      queryPicking() {
        this.orderList = [];
        if (!this.orderId) return;
        this.loadingData = true;
        InWork.queryShelfGoodsDetail(this.orderId).then(res => {
          res.data.forEach(i => {
            i.batchNumberList.forEach(i2 => {
              let kinds = {};
              i2.packageList.forEach(s => {
                kinds[s.packageScheme] = [];
              });
              Object.keys(kinds).forEach(key => {
                kinds[key] = i2.packageList.filter(f => f.packageScheme === parseInt(key, 10));
              });
              i2.kinds = kinds;
            });
          });
          this.orderList = res.data;
          this.loadingData = false;
        }).catch(() => {
          this.loadingData = false;
        });
      }
    }
  };
</script>
