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
import {init} from './tools/init';

init(Vue);
Vue.use(require('vue-moment'), {moment});
Vue.use(tinyVue);
Vue.use(Vuex);

import BaiduMap from 'vue-baidu-map';

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'ey4Q8mftyglv0vmy7MQz6Qhec8igNgkn'
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
