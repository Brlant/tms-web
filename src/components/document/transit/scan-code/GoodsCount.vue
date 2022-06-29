<template>
  <ul class="show-list ui-left normal">
    <li class="show-item" v-for="(item, index) in myCountGoods()">
      <el-tooltip :content="title(index)" class="item" effect="dark"
                  placement="right">
                    <span>
                        <el-tag>{{item.count}}</el-tag>
                      {{ item.goodsName }}
                    </span>
      </el-tooltip>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "GoodsCount",
    props: {
      list: Array
    },
    methods: {
      title(goodsId) {
        return 'goodsId:' + goodsId
      },
      myCountGoods() {
        let countObj = {};
        this.list.forEach(v => {
          if (v.goodsId == null) {
            return;
          }
          if (countObj[v.goodsId]) {
            countObj[v.goodsId].count++;
          } else {
            countObj[v.goodsId] = {
              goodsName: v.goodsName,
              count: 1
            }
          }
        });
        return countObj;
      }
    }
  }
</script>
