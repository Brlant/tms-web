<style lang="scss" scoped>
  $leftWidth: 180px;
  .content-part {
    .content-left {
      width: $leftWidth;
    }
    .content-right {
      > h3 {
        left: $leftWidth;
      }
      left: $leftWidth;
    }
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">订单详情</h2>
        <ul>
          <li class="list-style" v-for="item in pageSets" @click="showPart(item)"
              v-bind:class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
      <div class="content-right content-padding">
        <h3>{{ title }}</h3>
        <basic-info :currentOrder="currentOrder" v-show="index === 0" :index="index"></basic-info>
        <shelf :currentOrder="currentOrder" v-show="index === 1" :index="index" :orderId="orderId"></shelf>
        <log :currentOrder="currentOrder" v-show="index === 2" :isShow="index==2"></log>
        <relevance-code :currentOrder="currentOrder" :index="index" type="0" v-show="index === 8"></relevance-code>
        <relevance-code-review :currentOrder="currentOrder" :index="index" type="0"
                               v-show="index === 9"></relevance-code-review>
      </div>
    </div>
  </div>
</template>
<script>
import basicInfo from './base-info.vue';
import log from './log.vue';
import shelf from './shelf.vue';
import {InWork} from '@/resources';
import relevanceCode from '@/components/common/order/relevance.code.vue';
import relevanceCodeReview from '@/components/common/order/relevance.code-review';

export default {
    components: {basicInfo, log, shelf, relevanceCode, relevanceCodeReview},
    props: {
      orderId: {
        type: String
      }
    },
    data() {
      return {
        currentOrder: {},
        index: 0,
        title: ''
      };
    },
    watch: {
      orderId() {
        this.index = 0;
        this.title = '订单详情';
        this.queryOrderDetail();
      }
    },
    computed: {
      pageSets() {
        let menu = [];
        let perms = this.$store.state.permissions || [];
        menu.push({name: '订单详情', key: 0});
        if (this.currentOrder.wmsStatus === '1') {
          menu.push({name: '上架详情', key: 1});
        }
        if (perms.includes('stock-in-trace-code-watch')) {
          menu.push({name: '关联追溯码', key: 8});
        }
        if (perms.includes('stock-in-review-code-watch')) {
          menu.push({name: '复核追溯码', key: 9});
        }
        menu.push({name: '操作日志', key: 2});
        return menu;
      }
    },
    methods: {
      queryOrderDetail() {
        this.currentOrder = {};
        if (!this.orderId) return false;
        InWork.queryOrderDetail(this.orderId).then(res => {
          this.currentOrder = res.data;
        });
      },
      showPart(item) {
        this.index = item.key;
        this.title = item.name;
      }
    }
  };
</script>
