export default {
  data () {
    return {
      loadingData: false,
      activeStatus: 0,
      dataList: [],
      showIndex: -1,
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 20
      },
      currentItem: {},
      currentItemId: {}
    };
  },
  methods: {
    queryUtil (http, pageNo, beforeRequest, success) {
      this.pager.currentPage = pageNo;
      let params = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      this.loadingData = true;
      beforeRequest && beforeRequest();
      http(params).then(res => {
        this.dataList = res.data.list;
        this.pager.count = res.data.count;
        this.loadingData = false;
        success && success();
      });
      return params;
    },
    handleSizeChange (val) {
      this.pager.pageSize = val;
      this.queryList(1);
    },
    handleCurrentChange (val) {
      this.queryList(val);
    },
    formatRowClass (status, statusType) {
      let index = -1;
      Object.keys(statusType).forEach(k => {
        if (status === null) {
          if (statusType[k].status === status) {
            index = k;
          }
        } else {
          let s1 = Number(statusType[k].status);
          let s2 = Number(status);
          if (s1 === s2) {
            index = k;
          }
        }
      });
      index = index !== -1 ? 'status-' + index : '';
      return index;
    }
  }
};
