<style lang="scss">
  .modeling-part {
    h3 {
      background: #f7f7f7;
      margin: 0;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .show-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ebeef5;
      &:last-child {
        border: 0;
      }
    }
  }
</style>
<template>
  <div class="modeling-part" v-show="show">
    <h3>
      <span>3D建模结果</span>
      <a href="#" @click="close" class="btn-circle" @click.prevent="">
        <i class="el-icon-t-remove"></i></a>
    </h3>
    <el-table :data="list" border class="border-black">
      <el-table-column type="index" label="箱号" width="50"/>
      <el-table-column label="货品">
        <template slot-scope="scope">
          <ul class="show-list">
            <li class="show-item" v-for="item in scope.row.list">
              <span>{{item.goodsName}}</span>
              <span class="f-grey">{{item.specification}}</span>
            </li>
          </ul>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    props: ['form'],
    data () {
      return {
        show: false,
        list: []
      };
    },
    watch: {
      'form.id' () {
        this.close();
        this.list = [];
      }
    },
    methods: {
      open () {
        this.show = true;
        this.queryList();
      },
      close () {
        this.show = false;
      },
      queryList () {
        if (this.list.length) return;
        this.$http.get(`/tms-waybill/${this.form.id}/pre-pack`).then(res => {
          this.list = res.data;
        });
      }
    }
  };
</script>
