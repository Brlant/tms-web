<style scoped>
  .amap {
    width: 100%;
    height: 300px;
    margin-bottom: 20px;
  }

  .search-box {
    position: absolute;
    top: 25px;
    left: 20px;
  }

  .amap-container {
    position: relative;
  }
</style>
<template>
  <div class="amap-container">
    <el-amap-search-box :on-search-result="onSearchResult" class="search-box" ref="elMapSearch"
                        v-if="draggable"></el-amap-search-box>
    <el-amap :vid="mapId" :zoom="zoom" class="amap" ref="map">
      <el-amap-marker :draggable="true" :events="{dragend}" :key="index"
                      :position="marker" v-for="(marker, index) in markers"></el-amap-marker>
    </el-amap>
  </div>
</template>

<script>
  export default {
    props: {
      location: String,
      mapId: {type: String, default: 'a-map'},
      draggable: {
        type: Boolean,
        default: true
      }
    },
    data: function () {
      return {
        markers: [],
        zoom: 12
      };
    },
    watch: {
      location(val) {
        this.searchOption.city = val;
      }
    },
    methods: {
      clear() {
        this.markers = [];
      },
      onSearchResult(pois) {
        this.markers = [];
        if (pois.length > 0) {
          this.$nextTick(() => {
            this.markers.push([pois[0].lng, pois[0].lat]);
            let map = this.$refs.map.$$getInstance();
            map && map.setCenter([pois[0].lng, pois[0].lat]);
            this.zoom = 18;
            this.setAddress(pois);
          });
        }
      },
      setAddress(pois) {
        this.$emit('changeAddress', pois);
      },
      dragend(e) {
        this.setAddress([{
          lng: e.lnglat.lng,
          lat: e.lnglat.lat
        }]);
      },
      getLgtAndLat(query, callBack) {
        const AMap = window.AMap;
        const myGeo = new AMap.Geocoder();
        let that = this;
        myGeo.getLocation(query, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            callBack(result);
          } else {
            that.$notify.info({
              message: '您选择的地址没有解析到结果!'
            });
          }
        });
      }
    }
  };
</script>
