import Mock from 'mockjs';
import store from './data/store'

// 设置拦截ajax请求的相应时间
Mock.setup({
  timeout: '200-600',
  baseURL: '/api'
});

/**
 * 封装一下通用的mock方法，用于mock一次请求
 * @param {RegExp|string} apiPath 请求路径
 * @param {string} reqType 请求方式
 * @param {Object} mockData mock数据
 */
const mockOne = (apiPath, reqType, mockData) => {
  Mock.mock(new RegExp(apiPath), reqType, (options) => {
    return Mock.mock(mockData)
  });
}

const mockApi = {
  get(apiPath, mockData) {
    mockOne(apiPath, "GET", mockData)
  },
  post(apiPath, mockData) {
    mockOne(apiPath, "POST", mockData)
  },
  put(apiPath, mockData) {
    mockOne(apiPath, "PUT", mockData)
  },
  del(apiPath, mockData) {
    mockOne(apiPath, "DELETE", mockData)
  }
}

// 仓库列表
mockApi.get('tms-store/api/queryTmsStore?pageNo=1&pageSize=10', store.list);
