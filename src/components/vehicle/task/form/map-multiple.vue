<style>
  .map-part {
    position: relative;
  }

  .map__checkbox {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 4px 6px;
    background: #fff;
    border-radius: 2px;
  }

  .map__checkbox__list {
    position: absolute;
    top: 50px;
    right: 10px;
    background: #fff;
    padding: 4px 6px;
    border-radius: 2px;
  }
</style>
<template>
  <div>
    <div class="map-part">
      <el-amap :vid="mapRef" :zoom="10" ref="taskMap" v-show="waybillList.length"
               :style="mapStyle">
        <!--<el-amap-marker v-for="(marker, index) in markers" :key="index" :vid="index" :position="marker.position"-->
        <!--:label="marker.label"></el-amap-marker>-->
      </el-amap>
      <div v-show class="empty-info mini">暂无信息</div>
      <div class="map__checkbox">
        <el-checkbox size="mini" v-show="waybillList.length" v-model="isShowLabel">标注</el-checkbox>
        <el-checkbox size="mini" v-show="waybillList.length" v-model="isShowPath">连线</el-checkbox>
      </div>
      <div class="map__checkbox__list">
        <div v-for="item in totalMarkers">
          <el-checkbox size="mini" v-model="item.isShow">{{item.no}}</el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  const Colors = [
    '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00',
    '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707',
    '#651067', '#329262', '#5574a6', '#3b3eac'
  ];
  const iconStyles = ['lightgreen', 'blue', 'beige', 'gray', 'green', 'lightblue', 'lightpink', 'orange', 'orchid', 'pink', 'purple', 'red', 'salmon', 'white', 'black', 'darkblue', 'darkgreen', 'darkred', 'cadetblue', 'lightgray'];

  export default {
    props: {
      waybillList: {
        type: Array,
        default () {
          return [];
        }
      },
      mapStyle: {
        type: Object,
        default () {
          return {
            height: '200px'
          };
        }
      },
      mapRef: {
        type: String,
        default: 'taskMapMultiple'
      },
      taskIdList: Array,
      isShowBigMap: Boolean
    },
    data: function () {
      return {
        isShowPath: false,
        totalMarkers: [],
        pathSimplifierIns: null,
        isShowLabel: true
      };
    },
    computed: {
      markers () {
        let {totalMarkers, taskIdList, isShowBigMap} = this;
        if (!isShowBigMap) return;
        if (!totalMarkers.length || !taskIdList) return [];
        if (totalMarkers.length < taskIdList.length) return;
        let start = {
          position: [totalMarkers[0].list[0].senderAddressLongitude, totalMarkers[0].list[0].senderAddressDimension],
          label: '起点'
        };
        return totalMarkers.map((m, i) => {
          let obj = {
            no: m.no,
            color: Colors[i],
            isShow: m.isShow
          };
          let {list} = m;
          let set = new Set();
          list.filter(f => f.receiverAddressLongitude).forEach(i => {
            set.add(i.receiverAddressLongitude + ',' + i.receiverAddressDimension);
          });
          obj.points = [start, ...[...set].map((m, index) => {
            let v = m.split(',');
            let title = '';
            list.forEach(i => {
              if (i.receiverAddressLongitude === v[0] * 1 && i.receiverAddressDimension === v[1] * 1) title = i.receiverName;
            });
            return {
              position: [v[0] * 1, v[1] * 1],
              label: title
            };
          })];
          return obj;
        });
      },
      isShowLine () {
        return this.$store.state.isShowLine;
      }
    },
    watch: {
      markers (val) {
        if (!val) return;
        if (!val.length || !this.$refs.taskMap) return;
        let map = this.$refs.taskMap.$$getInstance();
        if (!map) return;
        map.clearMap();
        val.filter(f => f.isShow).forEach((i, pIndex) => {
          i.points.forEach((p, index) => {
            // 画点
            this.drawPoint(map, p, index, pIndex);
          });
        });
        this.isShowPath = false;
        this.pathSimplifierIns && this.pathSimplifierIns.setData([]);
        let isShowLine = window.localStorage.getItem('isShowLine');
        this.$nextTick(() => {
          this.isShowPath = !!JSON.parse(isShowLine);
        });
      },
      waybillList (val) {
        val.forEach(i => (i.isShow = true));
        this.totalMarkers = JSON.parse(JSON.stringify(val));
      },
      isShowPath (val) {
        this.$store.commit('initIsShowLine', val);
        if (!this.isShowBigMap) return;
        this.switchPath(val);
      },
      isShowLine (val) {
        this.isShowPath = val;
      },
      isShowLabel (val) {
        let eles = this.$el.querySelectorAll('.babel__container');
        [...eles].forEach(i => {
          i.style.display = val ? 'block' : 'none';
        });
      }
    },
    methods: {
      // 画点
      drawPoint (map, i, index, pIndex) {
        window.AMapUI.loadUI(['overlay/SimpleMarker'], SimpleMarker => {
          const m = new SimpleMarker({
            //前景文字
            iconLabel: {
              innerHTML: `<div>${index ? index : '起'}</div>`,
              style: {
                color: '#fff'
              }
            },
            //图标主题
            iconTheme: 'default',
            //背景图标样式
            iconStyle: iconStyles[pIndex],
            map: map,
            showPositionPoint: false, //显示定位点
            position: i.position,
            label: {
              content: `<div class="babel__container"><div class="bg"></div><div class="title">${i.label}</div><div>${i.label}</div></div>`,
              offset: new window.AMap.Pixel(36, 10)
            }
          });
        });
      },
      switchPath (val) {
        window.localStorage.setItem('isShowLine', val);
        let map = this.$refs.taskMap.$$getInstance();
        let {markers, pathSimplifierIns} = this;
        // let paths = [...markers, markers[0]].map(m => ({lnglat: m.position}));

        let paths = [];
        markers.filter(f => f.isShow).forEach(i => {
          paths.push({
            name: `${i.no}`,
            path: [...i.points, markers[0].points[0]].map(m => (m.position))
          });
        });
        // 已经存在
        if (pathSimplifierIns) {
          pathSimplifierIns.setData([]);
          // 清除轨迹
          pathSimplifierIns.setData(val ? paths : []);
          return;
        }
        // 不存在, 调绘制方法
        val && this.drawPath(map, paths);
      },
      // 画出轨迹
      drawPath (map, paths) {
        window.AMapUI.loadUI(['misc/PathSimplifier'], PathSimplifier => {
          const pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            map: map, //所属的地图实例
            getPath: function (pathData, pathIndex) {
              return pathData.path;
            },
            getHoverTitle: function (pathData, pathIndex, pointIndex) {
              return pathData.name;
            },
            renderOptions: {
              pathLineStyle: {
                dirArrowStyle: true
              },
              getPathStyle: function (pathItem, zoom) {
                let color = Colors[pathItem.pathIndex % Colors.length];
                return {
                  pathLineStyle: {
                    strokeStyle: color,
                    lineWidth: 4
                  },
                  pathLineSelectedStyle: {
                    lineWidth: 8
                  },
                  pathNavigatorStyle: {
                    fillStyle: color
                  }
                };
              }
            }
          });
          this.pathSimplifierIns = pathSimplifierIns;
          pathSimplifierIns.setData(paths);
        });
      }
    }
  };
</script>
