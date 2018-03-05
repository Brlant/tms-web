import {Notification} from 'element-ui/lib/notification';
import axios from 'axios';
import Vue from 'vue';

export const http = axios.create({
  baseURL: process.env.NODE_API,
  timeout: 30000,
  withCredentials: true
});

http.interceptors.response.use(response => {
  return response;
}, error => {
  let noticeTipKey = 'noticeError';
  let notice = window.localStorage.getItem(noticeTipKey);
  let response = error.response;

  if (notice === '1' && response.status !== 401) {
    return Promise.reject(error);
  } else {
    window.localStorage.setItem(noticeTipKey, '1');
  }
  if (!response || response.status === 500) {
    Notification.warning({
      message: '服务器太久没有响应, 请重试',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
  }
  if (response.status === 401) { //  Unauthorized, redirect to login
    let lastUrl = window.localStorage.getItem('lastUrl');
    if (!lastUrl || lastUrl.indexOf('/base/dict') === -1) {
    }
    window.location.href = '#/login';
    return Promise.reject(error);
  }
  if (response.status === 403) {
    Notification.error({
      message: '非法请求',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
  }

  if (response.status === 502) {
    Notification.error({
      message: '系统请求失败',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
  }
  return Promise.reject(error);
});

Vue.prototype.$http = http;

// 库存移库记录对象
export const StockMoveLog = resource('/stock-move-log', http, {});

// logisticsCenter物流中心对象
export const LogisticsCenter = resource('/logisticsCenter', http, {});

// store存储位对象
export const Store = resource('/store', http, {
  // 查询库位下的批次信息
  queryStockBatches: (id) => {
    return http.get('/store/' + id + '/batches', {});
  },
  // 过滤移出库位
  filterOutStore: (params) => {
    return http.get('/store/filter/outStore', {params});
  },
  // 过滤移出库区
  filterOutArea: (params) => {
    return http.get('/store/filter/outArea', {params});
  },
  batchStopStore: (params) => {
    return http.put('/store/batch/stop', params);
  },
  batchStartStore: (params) => {
    return http.put('/store/batch/start', params);
  },
  checkCode: (params) => {
    return http.get('/store/code', {params});
  }
});

// packingScheme包装方案对象
export const PackingScheme = resource('/packing-scheme', http, {
  start: (id) => {
    return http.put('/packing-scheme/' + id + '/enable', {});
  },
  forbid: (id) => {
    return http.delete('/packing-scheme/' + id, {});
  },
  queryStateNum: (params) => {
    return http.get('/packing-scheme/count', {params});
  }
});

// stockScrap库存报废对象
export const StockScrap = resource('/stock-scrap', http, {
  queryInfo: (id) => {
    return http.get('/stock-scrap/' + id, {});
  },
  queryCodes: (id) => {
    return http.get('/stock-scrap/' + id + '/code', {});
  },
  editDetailStore(id, newStoreId) {
    return http({url: `/stock-scrap/${id}/perStore`, method: 'put', params: {newStoreId}});
  },
  queryDetailStore(id, moveType) {
    return http({url: `/stock-scrap/${id}/detail`, method: 'get', params: {moveType}});
  },
  saveShelf: (id, obj) => {
    return http.post('/stock-scrap/' + id + '/save/store', obj);
  },
  allotShelf: (id) => {
    return http.get('/stock-scrap/' + id + '/allotment/store', {});
  },
  review: (id) => {
    return http.put('/stock-scrap/' + id + '/review', {});
  },
  deleteCode: (id) => {
    return http.delete('/stock-scrap/' + id + '/code', {});
  },
  lowerShelf: (id, obj) => {
    return http.put('/stock-scrap/' + id + '/lower/shelf', obj);
  },
  upperShelf: (id) => {
    return http.put('/stock-scrap/' + id + '/upper/shelf', {});
  },
  scrap: (id) => {
    return http.put('/stock-scrap/' + id + '/scrap', {});
  },
  audit: (id) => {
    return http.put('/stock-scrap/' + id + '/audit', {});
  },
  refused: (id) => {
    return http.put('/stock-scrap/' + id + '/refused', {});
  },
  code: (id, obj) => {
    return http.post('/stock-scrap/' + id + '/code', obj);
  },
  queryCount (obj) { // 查询库存报废单数量
    return http.get('/stock-scrap/count', {params: obj});
  },
  queryBatchNumber(key) {
    return http.get(`/stock-scrap/${key}/batch`, {});
  },
  queryStore(batchNumberId, orgId) {
    return http.get(`/stock-scrap/${batchNumberId}/store`, {params: {orgId}});
  }
});

// 部门对象
export const Department = resource('oms/department', http, {
  getPage: (params) => {
    return http.get('oms/department/page', {params});
  },
  getOnesMember: (id, params) => {
    return http.get('oms/department/' + id + '/member', {params});
  },
  getMembers: (params) => {
    return http.get('oms/department/members', {params});
  }
});

// dev设备对象
export const Dev = resource('/dev', http, {});

// devDetail设备详情对象
export const DevDetail = resource('/dev-detail', http, {
  checkDevNo: (devNo, id, devId) => {
    return http.get('/dev-detail/devNo', {
      params: {devNo: devNo, id: id, devId: devId}
    });
  },
  getLogPageByDevDetailId: (devDetailId, params) => {
    return http.get(`/dev-detail/${devDetailId}/page`, {params});
  }
});

// devStore设备存储对象
export const DevStore = resource('/dev-store', http, {
  queryDevPager: (id, params) => {
    return http.get('/dev-store/dev/' + id, {params});
  }
});

// oms附件对象
export const OmsAttachment = resource('/omsAttachment', http, {
  queryOneAttachmentList: (objectId, objectType) => {
    return http.get('/omsAttachment/' + objectType + '/' + objectId, {});
  }
});

// 平台用户权限对象
export const User = resource('/oms/user', http, {
  checkEmail: (email, userId, orgId) => {
    return http.get('/oms/user/email', {
      params: {email: email, userId: userId, orgId: orgId}
    });
  },
  checkPhone: (phone, userId, orgId) => {
    return http.get('/oms/user/phone', {
      params: {phone: phone, userId: userId, orgId: orgId}
    });
  },
  resetPsw: (Obj) => {
    return http.put('/oms/user/password', Obj);
  },
  forget: (obj) => {
    return http.post('/oms/user/password/verifyMail', obj);
  },
  stopUser: (userId) => {
    return http.put(`/oms/user/${userId}/stop`);
  },
  enableUser: (userId) => {
    return http.put(`/oms/user/${userId}/enablement`);
  }
});

// 角色管理对象
export const Access = resource('/oms/access', http, {
  getRoleMenus: () => {
    return http.get('/oms/access/menus/tree', {params: {objectId: 'wms-system'}});
  },
  getOrgRoleMenus: (orgId) => {
    return http.get('/oms/access/org/' + orgId + '/admin/menus/tree');
  },
  getOrgRole: (orgId, params) => {
    return http.get('/oms/access/orgs/' + orgId, {params});
  },
  getRoleDetail: (roleId) => {
    return http.get('/oms/access/' + roleId);
  }
});

export const Auth = {
  checkLogin: () => {
    return http.get('/userinfo');
  },
  login: (data) => {
    return http.post('/login', data);
  },
  logout: () => {
    return http.get('/logout');
  },
  isLogin () {
    try {
      return User.current();
    } catch (e) {
      Notification.error('用户信息出错，请重新登录!');
    }
  },
  permission: () => {
    return http.get('/oms/access/permissions', {params: {objectId: 'wms-system'}}); // TODO 改成wms-system
  }
};

// 数据字典组对象
export const DictGroup = resource('/dictGroup', http, {
  checkGroupName: (groupName, groupId) => {
    return http.get('/dictGroup/name', {
      params: {groupName: groupName, groupId: groupId}
    });
  },
  checkItemKey: (key, itemId, groupId) => {
    return http.get('/dictItem/key', {
      params: {key: key, itemId: itemId, groupId: groupId}
    });
  },
  getAll: () => {
    return new Promise((resolve) => {
      http.get('/dictGroups').then(res => {
        let data = {};
        let groupItem;
        let item;
        for (let i = 0, len = res.data.length; i < len; i++) {
          groupItem = res.data[i];
          data[groupItem.group.name] = [];
          for (let j = 0, len1 = groupItem.items.length; j < len1; j++) {
            item = groupItem.items[j];
            data[groupItem.group.name].push({key: item.key, label: item.label});
          }
        }
        resolve(data);
      });
    });
  }
});

export const packingRecord = resource('/packing-record', http, {
  queryGoods (waveId) {
    return http.get(`/packing-record/${waveId}/bulk-goods`);
  }
});

/**
 * 复核扫码
 * @type {the}
 */
export const reviewScan = resource('/review-code', http, {});

/**
 * 复核扫码
 * @type {the}
 */
export const singleTasksList = resource('/bulk-task/box/pager', http, {
  queryDetail (id) {
    return http.get(`/bulk-task/box/log/${id}/detail`);
  }
});

/**
 * 散件任务api
 * @type {the}
 */
export const singleTasks = resource('/bulk-task', http, {
  claim (taskId) {
    return http.put(`/bulk-task/${taskId}/claim`);
  },
  pack (taskId) {
    return http.put(`/bulk-task/${taskId}/pack`);
  },
  binningBox (taskId, obj) {
    return http.put(`/bulk-task/${taskId}/bind`, obj);
  },
  binComplete (taskId) {
    return http.put(`/bulk-task/${taskId}/pick`);
  },
  queryCodes(taskId) {
    return http.get(`/bulk-task/${taskId}/bind-package`);
  },
  review (taskId, obj) {
    return http.put(`/bulk-task/${taskId}/review`, obj);
  },
  reviewComplete (taskId) {
    return http.put(`/bulk-task/${taskId}/review-code`);
  },
  querySingleCount(params) {
    return http.get('/bulk-task/count', {params});
  },
  queryReviewCodes(taskId) {
    return http.get(`/bulk-task/${taskId}/code`);
  }
});

/**
 * 整件任务api
 * @type {the}
 */
export const fullTasks = resource('/whole-piece-task', http, {
  claim (taskId) {
    return http.put(`/whole-piece-task/${taskId}/claim`);
  },
  execute (taskId, obj) {
    return http.put(`/whole-piece-task/${taskId}/execute`, obj);
  },
  pack (taskId) {
    return http.put(`/whole-piece-task/${taskId}/pack`);
  },
  queryFullCount(params) {
    return http.get('/whole-piece-task/count', {params});
  }
});

/**
 * 整件入库任务api
 * @type {the}
 */
export const InHouseWork = resource('/order-stock-task', http, {
  queryOmsOrder (obj) { // 查询订单列表
    return http.get('/order', {params: obj});
  },
  queryOrderCount (obj) { // 查询订单数量
    return http.get('/order-stock-task/count', {params: obj});
  },
  queryOrderDetail (id) { // 查询订单详细
    return http.get(`/order/${id}`, {params: {lockFlag: false}});
  },
  allotPlace (orderId) { // 分配货位
    return http.post(`/order-stock-task/${orderId}/batch/allot`);
  },
  queryOperator (obj) { // 查询操作员
    return http.get('/order-stock-task/operator/', {params: obj});
  },
  queryOperatorOrders (obj) { // 查询操作员的任务
    return http.get('/order-stock-task/operator/orders', {params: obj});
  },
  allotShelfMan (orderId, obj) { // 分配上架人
    return http.put(`/order-stock-task/${orderId}/assign/putaway`, obj);
  },
  allotReviewer (orderId, obj) { // 分配复核人
    return http.put(`/order-stock-task/${orderId}/assign/reviewer`, obj);
  },
  queryAvailableStore (obj) { // 查询可用的库位
    return http.get('/order-stock-task/valid/store', {params: obj});
  },
  queryAssignStore (orderId) { // 查询已分配好的库位
    return http.get(`/order-stock-task/${orderId}/pre-position`);
  },
  updateAssignStore (orderId, obj) { // 查询已分配好的库位
    return http.put(`/order-stock-task/${orderId}/pre-position`, obj);
  },
  queryCodes (orderId) { // 查询编码
    return http.get(`/order-stock-task/${orderId}/code`);
  },
  reviewScan (orderId, obj) { // 提交编码
    return http.put(`/order-stock-task/${orderId}/review`, obj);
  },
  assignPlace (orderId) { // 通过复核，进入到分配货位
    return http.put(`/order-stock-task/${orderId}/review/operate`);
  },
  onShelf (orderId) {
    return http.put(`/order-stock-task/${orderId}/shelves`);
  },
  queryShelfGoodsDetail (orderId) {
    return http.get(`/order-stock-task/${orderId}/shelves/navigation`);
  },
  claimReviewTack (orderId) {
    return http.put(`/order-stock-task/${orderId}/claim/reviewer`);
  },
  claimShelfTack (orderId) {
    return http.put(`/order-stock-task/${orderId}/claim/putaway`);
  },
  claimTack (orderId) {
    return http.put(`/order-stock-task/${orderId}/claim`);
  }
});

/**
 * 仓库拆零
 * @type {the}
 */
export const Scatter = resource('/warehouse-scattered', http, {
  review (obj) {
    return http.put('/warehouse-scattered/operate', obj);
  },
  queryDetails (id, params) {
    return http.get(`/warehouse-scattered/${id}/detail`, {params});
  },
  scan (key, obj) {
    return http.put(`/warehouse-scattered/${key}/review-code`, obj);
  },
  queryStateNum (params) {
    return http.get('warehouse-scattered/count', {params});
  }
});

// 货品管理
export const Goods = resource('/goods', http, {
  getGoodsDetail: (id) => {
    return http.get('/goods/' + id);
  }
});

/**
 * 仓库盘点
 * @type {the}
 */
export const Inventory = resource('/stock-inventory', http, {
  queryDetail (id, params) {
    return http.get(`/stock-inventory/${id}/detail`, {params});
  },
  inventoryWork (detailId, obj) {
    return http.put(`/stock-inventory/detail/${detailId}`, obj);
  },
  queryStatusNum (id, params) {
    return http.get(`/stock-inventory/${id}/detail/count`, {params});
  }
});

/**
 * 库存波次
 * @type {the}
 */
export const Batch = resource('/stock-batch', http, {});

/**
 * 波次作业
 */
export const Wave = resource('/wave-task', http, {
  queryOmsOrder (obj) {
    return http.get('/outbound', {params: obj});
  },
  queryWaveCount (obj) {
    return http.get('/wave-task/count', {params: obj});
  },
  queryOrderDetail (orderId) {
    return http.get(`/order/${orderId}`, {params: {lockFlag: false}});
  },
  queryOperator (params) {
    return http.get('/wave-task/operator', {params});
  },
  assignOperator (obj) {
    return http.put(`/wave-task/${obj.id}/assign`, obj);
  },
  queryGoodsPlace (id) {
    return http.get(`/wave-task/${id}/store`);
  },
  queryAddress: (id, params) => {
    return http.get('/orgAddressInfo/' + id, {params});
  },
  queryCodes (id) {
    return http.get(`/review-code/${id}/code`);
  },
  submit (waveId, list) {
    return http.put(`/review-code/${waveId}/review`, list);
  },
  deleteCode (logId) {
    return http.delete(`/review-code/${logId}`);
  },
  reviewPass (waveId) {
    return http.put(`/review-code/${waveId}/review/operate`);
  },
  packComplete (waveId) {
    return http.put(`/wave-task/${waveId}/packing`);
  },
  claimTack (waveId, obj) {
    return http.put(`/wave-task/${waveId}/claim`, obj);
  }
});
/*
* 仓库养护
*
* */
export const Maintain = resource('/maintain', http, {
  queryMaintainRecords (obj) {
    return http.get('/maintain', {params: obj});
  },
  queryMatainDetail (key) {
    return http.get(`/maintain/${key}`);
  }
});
/*
* 仓库养护
*
* */
export const MaintainTask = resource('/maintain/task', http, {
  queryTaskCount (params) {
    return http.get('/maintain/task/count', {params});
  },
  queryDetail (params) {
    return http.get('/maintain/task/detail', {params});
  },
  queryTaskDetailCount (params) {
    return http.get('/maintain/task-detail/count', {params});
  },
  modifyDetail (id, obj) {
    return http.put('/maintain/task/detail/' + id, obj);
  }
});

/*
*
* 计划管理
* */
export const Plan = resource('/plan/', http, {
  queryOrderCount: (params) => {
    return http.get('/plan', {
      params: {
        date: params
      }
    });
  }
});

export const outWork = resource('/outbound/count', http, {
  queryOrderCount (obj) {
    return http.get('/outbound/count', {params: obj});
  }
});

/**
 * 入库作业
 * @type {the}
 */
export const InWork = resource('/stock-in', http, {
  queryOmsOrder (obj) { // 查询订单列表
    return http.get('/order', {params: obj});
  },
  queryOrderCount (obj) { // 查询订单数量
    return http.get('/stock-in/task/count', {params: obj});
  },
  queryOrderDetail (id) { // 查询订单详细
    return http.get(`/order/${id}`, {params: {lockFlag: false}});
  },
  allotPlace (orderId) { // 分配货位
    return http.post(`/stock-in/${orderId}/batch/allot`);
  },
  queryOperator (obj) { // 查询操作员
    return http.get('/stock-in/operator/', {params: obj});
  },
  queryOperatorOrders (obj) { // 查询操作员的任务
    return http.get('/stock-in/operator/orders', {params: obj});
  },
  allotShelfMan (orderId, obj) { // 分配上架人
    return http.put(`/stock-in/${orderId}/assign/putaway`, obj);
  },
  allotReviewer (orderId, obj) { // 分配复核人
    return http.put(`/stock-in/${orderId}/assign/reviewer`, obj);
  },
  queryAvailableStore (obj) { // 查询可用的库位
    return http.get('/stock-in/valid/store', {params: obj});
  },
  queryAssignStore (orderId) { // 查询已分配好的库位
    return http.get(`/stock-in/${orderId}/pre-position`);
  },
  updateAssignStore (orderId, obj) { // 查询已分配好的库位
    return http.put(`/stock-in/${orderId}/pre-position`, obj);
  },
  queryCodes (orderId) { // 查询编码
    return http.get(`/stock-in/${orderId}/code`);
  },
  reviewScan (orderId, obj) { // 提交编码
    return http.put(`/stock-in/${orderId}/review`, obj);
  },
  assignPlace (orderId) { // 通过复核，进入到分配货位
    return http.put(`/stock-in/${orderId}/review/operate`);
  },
  onShelf (orderId) {
    return http.put(`/stock-in/${orderId}/shelves`);
  },
  queryShelfGoodsDetail (orderId) {
    return http.get(`/stock-in/${orderId}/shelves/navigation`);
  },
  claimReviewTack (orderId) {
    return http.put(`/stock-in/${orderId}/claim/reviewer`);
  },
  claimShelfTack (orderId) {
    return http.put(`/stock-in/${orderId}/claim/putaway`);
  },
  claimTack (orderId) {
    return http.put(`/stock-in/${orderId}/claim`);
  }
});

// 货主货品
export const OrgGoods = resource('/org/goods', http, {
  queryOneGoods: (id) => {
    return http.get('/orgs/goods/' + id, {});
  },
  check: (id, obj) => {
    return http.put('/org/goods/' + id + '/check', obj);
  },
  queryStateNum: (params) => {
    return http.get('/org/goods/count', {params});
  }
});

// 货主-基本信息
export const BaseInfo = resource('/orgs', http, {
  // 查询数量
  queryStateNum: (params) => {
    return http.get('/orgs/count', {params});
  },
  // 转成货主
  turnToOwner: (orgId) => {
    return http.put('/orgs/transform/consignor/' + orgId, {});
  },
  // 一键审核组织基础信息(同时审核单位基本信息、经营范围、执照信息,并审核基础信息模块)
  auditBaseInfo: (orgId, obj) => {
    return http.put('/orgs/' + orgId + '/check', obj);
  },
  // 根据业务关系查询相关的单位
  queryOrgByReation: (orgId, obj) => {
    return http.get('/orgs/' + orgId + '/relation/', {params: obj});
  },
  // 根据业务关系查询相关的单位
  queryOrgByValidReation: (orgId, obj) => {
    return http.get('/orgs/' + orgId + '/valid-relation/', {params: obj});
  },
  // 校验邮箱
  checkEmail: (email, userId) => {
    return http.get('/oms/user/email', {
      params: {email: email, userId: userId}
    });
  },
  // 校验名字
  checkName: (name, orgId) => {
    return http.get('/orgs/name', {
      params: {name, orgId}
    });
  },
  // 校验身份证
  checkCreditCode: (creditCode, orgId) => {
    return http.get('/orgs/creditCode', {
      params: {creditCode, orgId}
    });
  },
  // 校验oms代码唯一性
  checkManufacturerCode: (code, orgId) => {
    return http.get('/orgs/manufacturerCode', {
      params: {code, orgId}
    });
  },
  // 校验管理员账户唯一性
  checkAdminAccount: (account, orgId) => {
    return http.get('/orgs/account', {
      params: {account, orgId}
    });
  },

  // 货主基本信息
  queryBaseInfo: (orgid) => {
    return http.get('/orgs/' + orgid);
  },
  // 删除客服人员
  deleteCus: (id) => {
    return http.delete('/cusService/' + id, {});
  },
  // 添加客服人员
  addCus: (obj) => {
    return http.post('/cusService', obj);
  },
  // 添加货主经营范围
  addOrgScope: (obj) => {
    return http.post('/orgScope', obj);
  },
  // 删除货主经营范围
  deleteOrgScope: (id) => {
    return http.delete('/orgScope/' + id);
  },
  // 查询其他客服人员
  queryOtherCus: (obj) => {
    return http.get('/cusService/orgs/' + obj.orgId + '/users', {obj});
  },
  // 新增受控法规
  addFg: (obj) => {
    return http.post('/bizLegislation', obj);
  },
  // 删除受控法规
  deleteFg: (id) => {
    return http.delete('/bizLegislation/' + id);
  }
});

/**
 * create vue-resource's resource like object
 *
 * Default Actions
 *   get: {method: 'GET'}
 *   save: {method: 'POST'}
 *   query: {method: 'GET'}
 *   update: {method: 'PUT'}
 *   delete: {method: 'DELETE'}
 *
 * @param path the resource path
 * @param http axios instance
 * @param actions custom actions
 * @returns the resource object
 */
function resource (path, http, actions) {
  let obj = {
    get: id => http.get(path + '/' + id),
    save: obj => http.post(path, obj),
    query: params => http.get(path, {params}),
    update: (id, obj) => {
      let url = path + '/' + id;
      if (typeof (id) === 'object') {
        url = path;
        obj = id;
      }
      return http.put(url, obj);
    },
    delete: id => http.delete(path + '/' + id)
  };
  return Object.assign(obj, actions);
}

