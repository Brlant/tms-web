import Vue from 'vue';
import router from './routers';
import tinyVue from './lib/tinyVue';
import moment from 'moment';
import 'moment/locale/zh-cn';
import '@/assets/scss/index.scss';

import './assets/css/basic.css';
import './assets/fonts/iconfont.css';
import Vuex from 'vuex';
import store from './store';
import utils from './tools/utils';
import { init } from './tools/init';
init(Vue);
Vue.use(require('vue-moment'), {moment});
Vue.use(tinyVue);
Vue.use(Vuex);

import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: 'b551e033d09a45de75ebbc1170025c20',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.Geocoder'],
  uiVersion: '1.0',
  v: '1.4.4'
});

new Vue({
  template: '<router-view id="app"></router-view>',
  router,
  store
}).$mount('#app');

(function (window, utils) {
  let configuration = window.localStorage.getItem('localConfiguration');
  if (!configuration) {
    window.localStorage.setItem('localConfiguration', JSON.stringify(utils.configurationList));
  }
})(window, utils);
