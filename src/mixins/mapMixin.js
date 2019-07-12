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
    },
    addMapTools (amapManager) {
      const map = amapManager || this.amapManager._map;
      if (!map || !window.AMapUI) {
        return setTimeout(this.addMapTools, 200);
      }
      window.AMapUI && window.AMapUI.loadUI(['control/BasicControl'], function (BasicControl) {
        //缩放控件
        map.addControl(new BasicControl.Zoom({
          position: 'rb', //left top，左上角
          showZoomNum: false //显示zoom值
        }));
      });
    }
  }
};
