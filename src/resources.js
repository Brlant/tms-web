import {Notification} from 'element-ui/lib/notification';
import axios from 'axios';
import Vue from 'vue';
import qs from 'qs';
import * as Sentry from '@sentry/browser';

export const http = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 30000,
  withCredentials: true
});

function isNewReturnType(data) {
  let keys = Object.keys(data);
  if (keys.length !== 3) return false;
  return ['code', 'data', 'msg'].every(e => keys.includes(e));
}

// 添加请求拦截器
http.interceptors.request.use(function (config) {
  try {
    let data = JSON.parse(window.localStorage.getItem('user'));
    let u = {
      'username': data.userName,
      'id': data.userId
    }
    Sentry.setUser(u);
  } catch (e) {
  }
  if (config.method === 'get') {
    config.paramsSerializer = params => {
      return qs.stringify(params, {indices: false});
    };
  }
  return config;
});

http.interceptors.response.use(response => {
  if (isNewReturnType(response.data)) {
    switch (response.data.code) {
      case 200 :
        return response.data;
      case 401:
        window.location.href = '#/login';
        return Promise.reject({response});
      case 403:
        Notification.error({
          message: '您没有权限请求信息，请联系管理员。',
          onClose: function () {
            window.localStorage.removeItem('noticeError');
          }
        });
        return Promise.reject({response});
      case 400:
        return Promise.reject({response});
      default:
        return Promise.reject({response});
    }
  } else {
    return response;
  }
}, error => {
  let noticeTipKey = 'noticeError';
  let notice = window.localStorage.getItem(noticeTipKey);
  let response = error.response;

  if (notice === '1' && response && response.status !== 401) {
    return Promise.reject(error);
  } else {
    window.localStorage.setItem(noticeTipKey, '1');
  }
  if (!response || response.status === 500) {
    Notification.warning({
      message: '网络服务异常, 请重试',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
    return Promise.reject(error);
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
      message: '您没有权限请求信息，请联系管理员。',
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

// tmsLog 对象
export const TmsLog = resource('/tms-log', http, {
  queryLog: (params) => {
    return http.get('/tms-log/' + params.objId + '/type/' + params.objType, {params});
  }
});

// tmsOrder 对象
export const TmsOrder = resource('/tms-order', http, {
  queryStateNum: (params) => {
    return http.get('/tms-order/count', {params});
  },
  createWayBill: (params, single) => {
    if (single) {
      return http.put('/tms-order/list/generate/single', params);
    }
    return http.put('/tms-order/list/generate', params);
  },
  createSingleWayBill: (params) => {
    return http.put('/tms-order/list/generate/single', params);
  },
  autoCreateWayBill: (params) => {
    return http.put('/tms-order/generate', params);
  },
  getOneTmsOrder: (id) => {
    return http.get('/tms-order/' + id, {});
  },
  cancelOrder: (id) => {
    return http.put('/tms-order/' + id + '/cancel', {});
  },
  dismantlingOrder: (id, params) => {
    return http.put('/tms-order/' + id + '/dismantling', params);
  }
});

// TmsPack 对象
export const TmsPack = resource('/tms-waybill-pack', http, {
  deleteTemperature: (id) => {
    return http.delete('/tms-waybill-pack/temperature/' + id, {});
  },
  deleteDevBox: (id) => {
    return http.delete('/tms-waybill-pack/box/' + id, {});
  }
});

// tms-waybill 对象
export const TmsWayBill = resource('/tms-waybill', http, {
  queryList: (params) => {
    return http.get('/tms-waybill/list', {params});
  },
  queryStateNum: (params) => {
    return http.get('/tms-waybill/count', {params});
  },
  getOneTmsWayBill: (id) => {
    return http.get('/tms-waybill/' + id, {});
  },
  cancelWayBill: (id) => {
    return http.put('/tms-waybill/' + id + '/cancel', {});
  },
  shipmentWayBill: (id) => {
    return http.put('/tms-waybill/' + id + '/shipment', {});
  },
  shipmentThirdWayBill: ({id, thirdNo}) => {
    return http.put(`/tms-waybill/${id}/shipment-butt?thirdNo=${thirdNo}`);
  },
  untieWayBill: (id, obj) => {
    return http.put('/tms-waybill/' + id + '/suspend', obj);
  },
  confirmWayBill: (id) => {
    return http.put('/tms-waybill/' + id + '/confirm', {});
  },
  deliveryWayBill: (id) => {
    return http.put('/tms-waybill/' + id + '/delivery', {});
  },
  deliverDate: (id, obj) => {
    return http.put('/tms-waybill/' + id + '/delivery-time', obj);
  },
  packageWayBill: (id) => {
    return http.put('/tms-waybill/' + id + '/pack', {});
  },
  signTmsWayBill: (id, obj) => {
    return http.put('/tms-waybill/' + id + '/sign', obj);
  },
  assessmentTmsWayBill: (id, obj) => {
    return http.put('/tms-waybill/' + id + '/quality-inspection', obj);
  },
  autoConfirmWayBill: (params) => {
    return http.put('/tms-waybill/batch/confirm', params);
  },
  batchConfirmWayBill: (params) => {
    return http.put('/tms-waybill/batch/confirm/list', params);
  }
});

// 中转入库单
export const TransferInOrder = {
  // 查询列表
  query: (params) => {
    return http.get('/transfer-in-order', {params});
  },
  // 查询列表的状态数量
  queryStateNum: (params) => {
    return http.get('/transfer-in-order/count', {params});
  },
  // 查询详情
  getDetails: (id) => {
    return http.get(`/transfer-in-order/${id}`);
  },
  // 认领任务
  claimTask: (id) => {
    return http.put(`/transfer-in-order/claim-task/${id}`);
  },
  // 上架
  shelves: (params) => {
    return http.put(`/transfer-in-order/shelves/${params.id}`, params);
  },
  // 指派上架人
  assignedOnPeople: (params) => {
    return http.put(`/transfer-in-order/assigned-on-people/${params.id}`, params);
  },
  // 收货
  receivingGoods: (params) => {
    return http.put(`/transfer-in-order/receiving-goods/${params.id}`, params);
  },
};

// 中转出库单
export const TransferOutOrder = resource('/transfer-in-order', http, {});

// dev设备对象
export const TempDev = resource('/ccsDevice', http, {
  queryStateNum: (params) => {
    return http.get('/ccsDevice/countDeviceGroup', {params});
  },
  queryTempData(params) {
    return http.get('/ccsDevice/gainDeviceReportDatas', {params});
  },
  queryALLTempByLike(params) {
    return http.get('/ccsDevice/queryDevListFuzzy', {params});
  },
  exportDevInfo(params) {
    return http.get('/ccsDevice/export-dev', {params});
  }
});

// transport-task 对象
export const TransportTask = resource('/transport-task', http, {
  queryAutoTaskList: (params) => {
    return http.get('/transport-task/auto/pager', {params});
  },
  batchCancel: (params) => {
    return http.put('/transport-task/batch-cancel', params);
  },
  startTransport: (id) => {
    return http.put('/transport-task/' + id + '/start', {});
  },
  batchAutoCreateWayBill: (params) => {
    return http.post('/transport-task/auto', params);
  },
  autoCreateWayBill: (params) => {
    return http.post('/transport-task/auto/list', params);
  },
  getOneTransportTask: (id) => {
    return http.get('/transport-task/' + id, {});
  },
  queryStateNum: (params) => {
    return http.get('/transport-task/count', {params});
  },
  deleteDetail: (id) => {
    return http.delete('/transport-task/detail/' + id, {});
  },
  batchAddDetail: (id, params) => {
    return http.post('/transport-task/detail/' + id, params);
  },
  validWayBill: (params) => {
    return http.get('/transport-task/valid/waybill', {params});
  },
  confirmTask: (id) => {
    return http.put('/transport-task/' + id + '/confirm', {});
  },
  cancelTask: (id) => {
    return http.put('/transport-task/' + id + '/cancel', {});
  }
});

// 货主车牌信息
export const plateNumber = resource('/org-plate', http, {
  batchAddPlateNumber(obj) {
    return http.post('/org-plate/batch', obj);
  }
});

// 车辆档案对象
export const CarArchives = resource('/car-archives', http, {
  checkPlateNumber: (params) => {
    return http.get('/car-archives/check/plate-number', {params});
  },
  queryUnboundOrg: (params) => {
    return http.get('/transport-blacklist/unbound/org', {params});
  },
  queryList: (params) => {
    return http.get('/car-archives/list', {params});
  }
});

// 车辆运输黑名单
export const TransportBlacklist = resource('/transport-blacklist', http, {
  queryUnboundOrg: (params) => {
    return http.get('/transport-blacklist/unbound/org', {params});
  },
  batchDelete: (id) => {
    return http.delete('transport-blacklist/' + id + '/batch', {});
  }
});

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

// 部门对象
export const Department = resource('/department', http, {
  getPage: (params) => {
    return http.get('/department/page', {params});
  },
  getOnesMember: (id, params) => {
    return http.get('/department/' + id + '/member', {params});
  },
  getMembers: (params) => {
    return http.get('/department/members', {params});
  },
  queryStateNum: (params) => {
    return http.get('/department/member/count', {params});
  }
});

export const GoodsArea = resource('goods-area', http, {
  getPage: (params) => {
    return http.get('goods-area', {params});
  },
  addGoodsAreaDetail: (params) => {
    return http.post('goods-area/detail', params);
  },
  getDetailPage: (params) => {
    return http.get('goods-area/detail', {params});
  },
  deleteDetail: (id) => {
    return http.delete('goods-area/detail/' + id, {});
  },
  queryGoodsAreaOrgList: (id) => {
    return http.get('goods-area/' + id + '/org-list', {});
  }
});

// 仓位档案相关的接口
export const StorageBin = {
  query: (params) => http.get('/tms-store/queryTmsStore', {params}),
  addSave: (params) => http.post('/tms-store/addTmsStore', params),
  editSave: (params) => http.post('/tms-store/editTmsStore', params),
  batchUpdateStatus: (params) => http.post('/tms-store/batchUpdate', params),
  exportExcel: (params) => http.get('/tms-store/exportTmsStore', {params}),
};

// 承运商相关的接口
export const Carrier = {
  query: (params) => http.get('/carrier/findCarrierByPage', {params}),
  count: (params) => http.get('/carrier/count', {params}),
  addSave: (params) => http.post('/carrier/addCarrier', params),
  editSave: (params) => http.post('/carrier/editCarrier', params),
};

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
  },
  devDetailStatusCount: (devId, dictGroupName) => {
    return http.get(`/dev-detail/status/count`, {
      params: {devId: devId, dictGroupName: dictGroupName}
    });
  },
  batchUpdateDevDetailStatus: params => {
    return http.put(`/dev-detail/batch/status`, params);
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
  queryInfo: (userId, params) => {
    return http.get('/oms/user/' + userId, {params});
  },
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
    return http.get('/oms/access/menus/tree', {params: {objectId: 'tms-system'}});
  },
  getOrgRoleMenus: (orgId) => {
    return http.get('/oms/access/org/' + orgId + '/admin/menus/tree');
  },
  getOrgRole: (orgId, params) => {
    return http.get('/oms/access/orgs/' + orgId, {params});
  },
  getRoleDetail: (roleId) => {
    return http.get('/oms/access/' + roleId);
  },
  queryStateNum: (params) => {
    return http.get('/oms/access/platform/count', {params});
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
  isLogin() {
    try {
      return User.current();
    } catch (e) {
      Notification.error('用户信息出错，请重新登录!');
    }
  },
  permission: () => {
    return http.get('/oms/access/permissions', {params: {objectId: 'tms-system'}}); // TODO 改成tms-system
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

// 货品管理
export const Goods = resource('/goods', http, {
  getGoodsDetail: (id) => {
    return http.get('/goods/' + id);
  }
});

/**
 * 入库作业
 * @type {the}
 */
export const InWork = resource('/stock-in', http, {
  queryOmsOrder(obj) { // 查询订单列表
    return http.get('/order', {params: obj});
  },
  queryOrder(obj) { // 查询wms订单列表
    return http.get('/stock-in/wms', {params: obj});
  },
  queryOrderExcepiton(obj) { // 查询wms异常订单列表
    return http.get('/stock-in/wms/quality-exception', {params: obj});
  },
  queryOrderCount(obj) { // 查询订单数量
    return http.get('/stock-in/task/count', {params: obj});
  },
  queryOrderDetail(id) { // 查询订单详细
    return http.get(`/order/${id}`, {params: {lockFlag: false}});
  },
  allotPlace(orderId) { // 分配货位
    return http.post(`/stock-in/${orderId}/batch/allot`);
  },
  queryOperator(obj) { // 查询操作员
    return http.get('/stock-in/operator', {params: obj});
  },
  queryOperatorOrders(obj) { // 查询操作员的任务
    return http.get('/stock-in/operator/orders', {params: obj});
  },
  allotShelfMan(orderId, obj) { // 分配上架人
    return http.put(`/stock-in/${orderId}/assign/putaway`, obj);
  },
  allotReviewer(orderId, obj) { // 分配复核人
    return http.put(`/stock-in/${orderId}/assign/reviewer`, obj);
  },
  queryAvailableStore(obj) { // 查询可用的库位
    return http.get('/stock-in/valid/store', {params: obj});
  },
  queryAssignStore(orderId) { // 查询已分配好的库位
    return http.get(`/stock-in/${orderId}/pre-position`);
  },
  updateAssignStore(orderId, obj) { // 查询已分配好的库位
    return http.put(`/stock-in/${orderId}/pre-position`, obj);
  },
  queryCodes(orderId) { // 查询编码
    return http.get(`/stock-in/${orderId}/code`);
  },
  reviewScan(orderId, obj) { // 提交编码
    return http.put(`/stock-in/${orderId}/review`, obj);
  },
  assignPlace(orderId) { // 通过复核，进入到分配货位
    return http.put(`/stock-in/${orderId}/review/operate`);
  },
  onShelf(orderId) {
    return http.put(`/stock-in/${orderId}/shelves`);
  },
  queryShelfGoodsDetail(orderId) {
    return http.get(`/stock-in/${orderId}/shelves/navigation`);
  },
  claimReviewTack(orderId) {
    return http.put(`/stock-in/${orderId}/claim/reviewer`);
  },
  claimShelfTack(orderId) {
    return http.put(`/stock-in/${orderId}/claim/putaway`);
  },
  claimTack(orderId) {
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

  // 查询dhs的平台单位
  queryDhsOrgs: (params) => {
    return http.get('/orgs/dhs', {params});
  },
  filterDhsOrgById: (orgId) => {
    return http.get('/orgs/dhs/' + orgId, {});
  },

  queryOrgMainInfoList: (params) => {
    return http.get('/orgs/main-info/list', {params});
  },
  // 转成货主
  turnToOwner: (orgId) => {
    return http.put('/orgs/transform/consignor/' + orgId, {});
  },
  // 一键审核单位基础信息(同时审核单位基本信息、经营范围、执照信息,并审核基础信息模块)
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
    return http.post('/orgs/name', {name, orgId});
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
function resource(path, http, actions) {
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
