import Vue from 'vue';
import router from './routers';
import tinyVue from './lib/tinyVue';
import moment from 'moment';
import 'moment/locale/zh-cn';
import '@/assets/scss/index.scss';

import './assets/css/basic.css';
import '../static/fonts/iconfont.css';
import Vuex from 'vuex';
import store from './store';
import {init} from './tools/init';
import VueAMap from 'vue-amap';

init(Vue);
Vue.use(require('vue-moment'), {moment});
Vue.use(tinyVue);
Vue.use(Vuex);

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: 'b551e033d09a45de75ebbc1170025c20',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.Geocoder'],
  uiVersion: '1.0'
});

new Vue({
  template: '<router-view id="app"></router-view>',
  router,
  store
}).$mount('#app');

Vue.filter('formatMoney', function (val) {
  let num = '';
  if (typeof val === 'string') {
    num = val;
  } else if (typeof val === 'number') {
    num = val.toFixed(2).toString();
  }
  if (num) {
    // 判断数字是否有负号
    let count = num.indexOf('-');
    let isMinusSign = false;
    if (count !== -1) {
      // 如果包含负号
      isMinusSign = true;
      // 先去除负号
      num = num.replace('-', '');
    }
    // 整数部分进行千分位分割
    let arr = num.split('.');
    num = arr[0];
    let result = '';
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    // 拼接小数位
    result = result + '.' + arr[1];
    if (isMinusSign) {
      // 如果原来包含负号则重新拼接
      result = '-' + result;
    }
    return result;
  }
});

// 滚动下拉加载
Vue.prototype.$scrollLoadingData = function (event) {
  let e = event ? event : window.event;
  let target = e.target || e.srcElement;
  if (!target) return false;
  let difference = 20;
  let height = target.scrollHeight - target.clientHeight;
  let scrollTop = target.scrollTop;
  if (height > 0 && height - scrollTop < difference) {
    if (this.getMore && this.pager.currentPage < this.pager.totalPage && !this.$store.state.bottomLoading) {
      this.$store.commit('initBottomLoading', true);
      this.getMore();
    }
    if (this.getMore && this.goodsAreaPage.currentPage < this.goodsAreaPage.totalPage && !this.$store.state.bottomLoading) {
      this.$store.commit('initBottomLoading', true);
      this.getMore();
    }
    if (this.getOrgMore && this.typePager.currentPage < this.typePager.totalPage && !this.$store.state.bottomLoading) {
      this.$store.commit('initBottomLoading', true);
      this.getOrgMore();
    }
  }
};
