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
import App from './components/App';
import utils from './tools/utils';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

// import './mock'

init(Vue);
Vue.use(require('vue-moment'), {moment});
Vue.use(tinyVue);
Vue.use(Vuex);

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '6c228c74ad098018b2e889b27a303a07',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.Geocoder', 'AMap.MouseTool', 'AMap.PolyEditor'],
  v: '1.4.6',
  uiVersion: '1.0'

});

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://eb94ae86f9104780be615d09d50416f2@f-log.sinopharm-bio.com/3',
    integrations: [new Integrations.Vue({Vue, attachProps: true})],
    ignoreErrors: ['Request failed with status code 401', 'Request failed with status code 502']
  });
}

new Vue({
  router,
  store,
  render: h => h(App)
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


Vue.filter('formatAddress', val => {
  if (!val) return '';
  return utils.formatAddress(...val.split('/'));
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
    if (this.getMore && this.pager && this.pager.currentPage < this.pager.totalPage && !this.$store.state.bottomLoading) {
      this.$store.commit('initBottomLoading', true);
      this.getMore();
    }
    if (this.getMore && this.goodsAreaPage && this.goodsAreaPage.currentPage < this.goodsAreaPage.totalPage && !this.$store.state.bottomLoading) {
      this.$store.commit('initBottomLoading', true);
      this.getMore();
    }
    if (this.getOrgMore && this.goodsAreaPage && this.typePager.currentPage < this.typePager.totalPage && !this.$store.state.bottomLoading) {
      this.$store.commit('initBottomLoading', true);
      this.getOrgMore();
    }
  }
};

Vue.prototype.$formatAryTime = function (ary, index, str = 'YYYY-MM-DD HH:mm:ss') {
  return Array.isArray(ary) && ary[index] ? this.$moment(ary[index]).format(str) : '';
};

Vue.prototype.$formatPhotoUrl = function (item) {
  return item.orgGoodsDto.photoUrl || item.orgGoodsDto.goodsDto.photo;
};
