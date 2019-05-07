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
    component: () => import('./components/index.vue'),
    children: [
      {
        path: '/vehicle',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'vehicle', title: '运输任务', icon: 'repertory', perm: 'tms-task-manager'},
        children: [
          {
            path: '/vehicle/map/delivery',
            component: () => import('./components/vehicle/map/index-new.vue'),
            meta: {moduleId: 'vehicle', title: '地图派送', perm: 'tms-task-map-manager'}
          },
          {
            path: '/vehicle/scheduling',
            component: () => import('./components/vehicle/scheduling/index.vue'),
            meta: {moduleId: 'vehicle', title: '排单记录', perm: 'tms-task-add'}
          },
          {
            path: '/vehicle/delivery/task/:id',
            component: () => import('./components/vehicle/task/index.vue'),
            meta: {moduleId: 'vehicle', title: '出车任务', perm: 'tms-task-car-task-query'}
          },
          {
            path: '/vehicle/distribution',
            component: () => import('./components/vehicle/distribution/index.vue'),
            meta: {moduleId: 'vehicle', title: '车辆分布', perm: 'tms-carmap-scan'}
          }
        ]
      },
      {
        path: '/document',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'document', title: '单据管理', icon: 'warehouse', perm: 'tms-documents-info'},
        children: [
          {
            path: '/document/order/:id',
            component: () => import('./components/document/order/index.vue'),
            meta: {moduleId: 'document', title: '订单管理', perm: 'tms-order-query'}
          },
          {
            path: '/document/transport/:id',
            component: () => import('./components/document/transport/index.vue'),
            meta: {moduleId: 'document', title: '运单管理', perm: 'tms-waybill-query'}
          }
        ]
      },
      {
        path: '/baseInfo',
        component: () => import('./components/base-info/index.vue'),
        meta: {moduleId: 'baseInfo', title: '基础信息', icon: 'basic', perm: 'tms-base-info'},
        children: [
          {
            path: '/baseInfo/org-list',
            component: () => import('./components/base-info/org-list/list.vue'),
            meta: {moduleId: 'baseInfo', title: '业务单位', perm: 'tms-business-unit-query'}
          },
          {
            path: '/baseInfo/car-archives',
            component: () => import('./components/base-info/car-archives/index.vue'),
            meta: {moduleId: 'baseInfo', title: '车辆档案', perm: 'tms-car-archives-watch'}
          },
          {
            path: '/baseInfo/packaging-consumables',
            component: () => import('./components/base-info/dev/index.vue'),
            meta: {moduleId: 'baseInfo', title: '包装耗材', perm: 'tms-car-archives-watch'},
            children: []
          },
          {
            path: '/baseInfo/goods-area',
            component: () => import('./components/base-info/goods-area/list.vue'),
            meta: {moduleId: 'baseInfo', title: '集货区管理', perm: 'tms-goods-area-query'},
            children: []
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
          },
          {
            path: '/permission/log',
            component: () => import('./components/common/log/list.vue'),
            meta: {moduleId: 'permission', title: '系统日志', perm: 'tms-system-log'}
          }
        ]
      }
    ]
  },
  {path: '/resetpsw', component: () => import('./components/login/resetpsw.vue')},
  {path: '/404', component: () => import('./components/error/error_404.vue')},
  {path: '/500', component: () => import('./components/error/error_500.vue')},
  {path: '/login', component: () => import('./components/login/login.vue')},
  {path: '/forget', component: () => import('./components/login/forget.vue')},
  {path: '/code/:id', component: () => import('./components/login/resetpwd.vue')},
  {path: '*', redirect: '/'}
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
