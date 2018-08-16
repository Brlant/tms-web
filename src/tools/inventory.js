import {BaseInfo, Inventory, InWork, LogisticsCenter, Store} from '@/resources';

export default {
  filterLogisticsCenter (query) { // 查物流中心
    let param = Object.assign({}, {
      keyWord: query,
      deleteFlag: false
    });
    LogisticsCenter.query(param).then(res => {
      this.logisticsCenters = res.data;
    });
  },
  filterWarehouse (query) { // 查仓库
    if (!this.form.logisticsCentreId) {
      this.form.warehouseId = '';
      this.warehouses = [];
      return;
    }
    let params = {
      keyWord: query,
      parent: this.form.logisticsCentreId,
      storeTypeId: 0,
      deleteFlag: false
    };
    Store.query(params).then(res => {
      this.warehouses = res.data.list;
    });
  },
  filterArea (query) { // 查库区
    if (!this.form.warehouseId) {
      this.form.areaId = '';
      this.areas = [];
      return;
    }
    let params = {
      keyWord: query,
      parent: this.form.warehouseId,
      storeTypeId: 1,
      deleteFlag: false
    };
    Store.query(params).then(res => {
      this.areas = res.data.list;
    });
  },
  filterPlace (query) {
    if (!this.form.areaId) {
      this.form.placeId = '';
      this.places = [];
      return;
    }
    let params = {
      keyWord: query,
      parent: this.form.areaId,
      level: 2,
      deleteFlag: false
    };
    Store.query(params).then(res => {
      this.places = res.data.list;
    });
  },
  queryStatusNum () {
    let id = this.$route.query.id;
    let params = Object.assign({}, this.filters);
    Inventory.queryStatusNum(id, params).then(res => {
      this.inventoryType[0].num = res.data['all'];
      this.inventoryType[1].num = res.data['no-operation'];
      this.inventoryType[2].num = res.data['normal'];
      this.inventoryType[3].num = res.data['exception'];
    });
  },
  filterOperators (query) { // 查询操作人员列表
    let params = {
      keyWord: query
    };
    InWork.queryOperator(params).then(res => {
      this.operators = res.data.list;
    });
  },
  filterOrg (query) {
    BaseInfo.query({keyWord: query, type: 0}).then(res => {
      this.orgList = res.data.list;
    });
  }
};
