<style lang="scss" scoped>
  .modeling-part {
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
  <div class="modeling-part">
    <div class="form-header-part">
      <div class="header">
        <div class="sign f-dib"></div>
        <h3 class="tit f-dib index-tit" :class="{active: pageSet.key === currentTab.key}">
          预装箱结果
        </h3>
        <span @click="open" class="des-btn" v-show="!show">
               <a href="#" class="btn-circle" @click.prevent="">
                 <i class="el-icon-zoom-in"></i></a>查看
          </span>
      </div>
      <div class="content">
        <el-table v-show="show" :data="list" border class="border-black" v-loading="loading">
          <el-table-column type="index" label="序号" width="50"/>
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
    </div>
  </div>
</template>
<script>
  export default {
    props: ['form', 'pageSet', 'currentTab'],
    data () {
      return {
        show: false,
        loading: false,
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
        this.loading = true;
        this.$http.get(`/tms-waybill/${this.form.id}/pre-pack`).then(res => {
          this.list = res.data;
          this.loading = false;
        });
      }
    }
  };
</script>
