import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

//  专门用来展示静态HTML文件的组件
// const Html = {
//   template: '<div v-html="html"></div>',
//   data: () => ({
//     html: ''
//   }),
//   beforeRouteEnter(to, from, next) {
//     axios.get('/static/html/' + to.params.file).then(response => {
//       next(vm => {
//         vm.html = response.data;
//         vm.$nextTick(() => vm.$emit('loaded'));
//       });
//     });
//   },
//   beforeRouteUpdate(to, from, next) {
//     this.$emit('loaded', 1);
//     axios.get('/static/html/' + to.params.file).then(response => {
//       this.html = response.data;
//       this.$nextTick(() => {
//         this.$emit('loaded', 0);
//         next();
//       });
//     });
//   }
// };
export const routes = [
  {
    path: '/',
    component: require('./components/index.vue'),
    children: [
      {
        path: '/baseInfo',
        component: resolve => require(['./components/base-info/index.vue'], resolve),
        meta: {moduleId: 'baseInfo', title: '基础信息', icon: 'warehouse', perm: 'tms-base-info'},
        children: [
          {
            path: '/baseInfo/car-archives',
            component: resolve => require(['./components/base-info/car-archives/index.vue'], resolve),
            meta: {moduleId: 'baseInfo', title: '车辆档案', perm: 'tms-car-archives-watch'}
          }
        ]
      },
      {
        path: '/document',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'document', title: '单据管理', icon: 'setting', perm: 'tms-system-config'},
        children: [
          {
            path: '/document/order',
            component: () => import('./components/document/order/index.vue'),
            meta: {moduleId: 'document', title: '订单管理', perm: 'show'}
          },
          {
            path: '/document/transport',
            component: () => import('./components/document/transport/index.vue'),
            meta: {moduleId: 'document', title: '运单管理', perm: 'show'}
          }
        ]
      },
      {
        path: '/vehicle',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'vehicle', title: '任务管理', icon: 'setting', perm: 'tms-system-config'},
        children: [
          {
            path: '/vehicle/map/delivery',
            component: () => import('./components/vehicle/map/index.vue'),
            meta: {moduleId: 'vehicle', title: '地图派送', perm: 'show'}
          }
        ]
      },
      {
        path: '/permission',
        component: () => import('./components/system/index.vue'),
        meta: {moduleId: 'permission', title: '系统设置', icon: 'setting', perm: 'tms-system-config'},
        children: [
          {
            path: '/permission/user',
            component: () => import('./components/system/user/user.vue'),
            meta: {moduleId: 'permission', title: '用户管理', perm: 'tms-platform-user-manager'}
          },
          {
            path: '/permission/role',
            component: () => import('./components/system/role/role.vue'),
            meta: {moduleId: 'permission', title: '角色管理', perm: 'tms-access-role-watch'}
          }
        ]
      }
    ]
  },
  {path: '/resetpsw', component: () => import('./components/login/resetpsw.vue')},
  {path: '/404', component: resolve => require(['./components/error/error_404.vue'], resolve)},
  {path: '/500', component: resolve => require(['./components/error/error_500.vue'], resolve)},
  {path: '/login', component: resolve => require(['./components/login/login.vue'], resolve)},
  {path: '/forget', component: resolve => require(['./components/login/forget.vue'], resolve)},
  {path: '/code/:id', component: resolve => require(['./components/login/resetpwd.vue'], resolve)}
];

//  不需要鉴权的路径
// const permissive = ['/login', '/404', '/500'];

const router = new VueRouter({
  //  mode: 'history',
  routes: routes,
  base: '/'
});

router.beforeEach((to, from, next) => {
  return next();
});

export default router;
