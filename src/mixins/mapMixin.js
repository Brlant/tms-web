export default {
  methods: {
    /**
     * 得到经纬度，回调函数
     * @param query
     * @param callback
     */
    getLgtAndLat (query, callback) {
      const BMap = window.BMap;
      const myGeo = new BMap.Geocoder();
      myGeo.getPoint(query, callback);
    }
  }
};
