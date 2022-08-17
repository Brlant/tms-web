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
            path: '/vehicle/delivery/detail/export',
            component: () => import('./components/vehicle/export/export.vue'),
            meta: {moduleId: 'vehicle', title: '导出运单统计明细', perm: 'tms-task-car-task-export-detail'}
          },
          {
            path: '/vehicle/distribution',
            component: () => import('./components/vehicle/distribution/index.vue'),
            meta: {moduleId: 'vehicle', title: '车辆分布', perm: 'tms-carmap-scan'}
          }, {
            path: '/vehicle/status',
            component: () => import('./components/vehicle/archives/VehicleArchivesList.vue'),
            meta: {moduleId: 'vehicle', title: '车辆状态', perm: 'tms-carmap-scan'}
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
          },
          {
            path: '/transit/store-in',
            component: () => import('./components/document/transit/store-in/TransitStoreIn.vue'),
            meta: {moduleId: 'document', title: '中转入库', perm: 'tms-transfer-in'}
          },
          {
            path: '/transit/store-out',
            component: () => import('./components/document/transit/store-out/TransitStoreOut.vue'),
            meta: {moduleId: 'document', title: '中转出库', perm: 'tms-transfer-out'}
          },
        ]
      },
      {
        path: '/base-info',
        component: () => import('./components/base-info/index.vue'),
        meta: {moduleId: 'base-info', title: '基础信息', icon: 'basic', perm: 'tms-base-info'},
        children: [
          {
            path: '/base-info/org-list',
            component: () => import('./components/base-info/org-list/list.vue'),
            meta: {moduleId: 'base-info', title: '业务单位', perm: 'tms-business-unit-query'}
          },
          {
            path: '/base-info/car-archives',
            component: () => import('./components/base-info/car-archives/index.vue'),
            meta: {moduleId: 'base-info', title: '车辆档案', perm: 'tms-car-archives-watch'}
          },
          {
            path: '/base-info/packaging-consumables',
            component: () => import('./components/base-info/dev/index.vue'),
            meta: {moduleId: 'base-info', title: '包装耗材', perm: 'tms-car-archives-watch'},
            children: []
          },
          {
            path: '/base-info/goods-area',
            component: () => import('./components/base-info/goods-area/list.vue'),
            meta: {moduleId: 'base-info', title: '集货区管理', perm: 'tms-goods-area-query'},
            children: []
          },
          {
            path: '/base-info/carrier',
            component: () => import('./components/base-info/carrier/CarrierList.vue'),
            meta: {moduleId: 'base-info', title: '第三方承运商管理', perm: 'tms-carrier-query'},
            children: []
          },
          {
            path: '/base-info/storage-bin',
            component: () => import('./components/base-info/storage-bin/list.vue'),
            meta: {moduleId: 'base-info', title: '仓位档案', perm: 'tms-storage-bin-query'},
            children: []
          }
        ]
      },
      {
        path: '/stock-manager',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'stock-manager', title: '库存管理', icon: 'basic', perm: 'tms-stock-manager'},
        children: [
          {
            path: '/stock-manager/stock',
            component: () => import('./components/stock-manager/StockManager'),
            meta: {moduleId: 'stock-manager', title: '库存管理', perm: 'tms-business-unit-query'}
          },
          {
            path: '/stock-manager/store',
            component: () => import('./components/stock-manager/StoreStock'),
            meta: {moduleId: 'stock-manager', title: '库位库存', perm: 'tms-business-unit-query'}
          },
        ]
      },
      {
        path: '/permission',
        component: () => import('./components/system/index.vue'),
        meta: {moduleId: 'permission', title: '系统设置', icon: 'setting', perm: 'system-config'},
        children: [
          {
            path: '/permission/user',
            component: () => import('./components/system/user/user.vue'),
            meta: {moduleId: 'permission', title: '用户管理', perm: 'tms-platform-user-manager'}
          },
          {
            path: '/permission/role',
            component: () => import('./components/system/role/role.vue'),
            meta: {moduleId: 'permission', title: '角色管理', perm: 'access-role-watch'}
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
