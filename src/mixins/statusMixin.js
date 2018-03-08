export default {
  data () {
    return {
      currentItem: {},
      currentItemId: ''
    };
  },
  methods: {
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
    },
    formatStatusTitle (status, statusType) {
      let title = '';
      Object.keys(statusType).forEach(k => {
        if (status === null) {
          if (statusType[k].status === status) {
            title = statusType[k].title;
          }
        } else {
          let s1 = Number(statusType[k].status);
          let s2 = Number(status);
          if (s1 === s2) {
            title = statusType[k].title;
          }
        }
      });
      return title;
    }
  }
};
