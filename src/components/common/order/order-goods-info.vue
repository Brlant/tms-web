<style lang="scss" scoped>
.table {
  margin-top: 10px;
  padding-left: 5px;
  font-size: 12px;

  .order-list-item {
    color: #999;
    line-height: 20px;
  }

  border-collapse: separate;
  border-spacing: 0;

  > tbody > tr > td, > thead > tr > th {
    border: 0;
  }

  > thead {
    background: #eff4fb;
  }

  > tbody {
    background: #f6faff;
  }
}

.table-product-list {
  > thead > tr > th {
    padding: 5px 5px 5px 0;
  }

  > tbody > tr > td {
    padding: 2px 5px 2px 0;
  }
}

.table-product-list {
  margin-bottom: 0;
}

.product-title {
  text-align: center;
  border: 1px solid #eee;
  background: #eee;
}

.w-count {
  width: 150px;
}

.w-batch {
  width: 200px;
}

.w-date {
  width: 200px;
}
</style>
<template>
  <div v-if="isShowGoodsList">
    <table class="table no-border table-product-list order-list-detail" v-show="orderItem.detailDtoList">
      <thead>
      <tr>
        <th>货主货品</th>
        <th>规格</th>
        <th v-show="orderItem.type=== '1'">批号</th>
        <th v-show="orderItem.type=== '1'">有效期</th>
        <th>数量</th>
        <th>单价</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="product in orderItem.detailDtoList" v-if="product.orgGoodsDto">
        <td style="width: 400px">
          <span>{{ product.name }}</span>
        </td>
        <td style="width: 100px" v-if="product.orgGoodsDto.goodsDto">{{ product.orgGoodsDto.goodsDto.specifications }}
        </td>
        <td align="left" class="R w-batch" v-show="orderItem.type=== '1'">
          {{ product.batchNumber || '无' }}
          <!--<el-tag v-show="product.inEffectiveFlag" type="danger">近效期</el-tag>-->
        </td>
        <td class="w-date" align="left" v-show="orderItem.type=== '1'">{{ product.expiryDate | date }}</td>
        <td align="left" class="w-count">
          {{ product.amount }}
          <dict :dict-group="'measurementUnit'" v-if="product.orgGoodsDto.goodsDto"
                :dict-key="product.orgGoodsDto.goodsDto.measurementUnit"></dict>
        </td>
        <td align="left">
          <span v-if="product.unitPrice">￥{{ product.unitPrice }}</span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'OrderGoodsInfo',
  props: {
    orderItem: {}
  },
  computed: {
    isShowGoodsList() {
      return this.$store.state.isShowGoodsList;
    }
  }
};
</script>
