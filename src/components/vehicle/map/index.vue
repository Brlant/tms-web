<style lang="scss" scoped="">
  .d-table {
    margin-top: 0;
    margin-bottom: 0;
    .d-table-left {
      width: 450px;
    }
    .d-table-right {
      border: 1px;
      padding: 0;
    }
  }

  .m-part {
    padding: 0 10px;
    border: 1px solid #eee;
  }

  .second-part {
    @extend .m-part;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .bottom-part {
    @extend .m-part;
    line-height: 30px;
    height: 30px;
  }

  .header {
    margin: 0;
    font-size: 18px;
  }

  .btn-search-toggle {
    > input {
      width: 180px;
    }
    background: #ffffff;
    &.open:hover {
      background: #ffffff;
    }
  }

  .m-list {
    width: 100%;
    box-sizing: border-box;
  }

  .aMap {
    width: 100%;
    min-height: 500px;
    height: 100%;
    margin-bottom: 20px;
  }

  .table-hover {
    > tbody > tr {
      cursor: pointer;
    }
  }
</style>
<template>
  <div>
    <div>
      <search-part @search="searchResult"></search-part>
      <el-row class="second-part clearfix">
        <el-col :span="2">
          <h2 class="header f-dib">查询结果</h2>
        </el-col>
        <el-col :span="6">
          <span class="btn-search-toggle open">
                  <single-input v-model="searchWord" placeholder="请输入关键字搜索"></single-input>
                  <i class="el-icon-t-search"></i>
          </span>
        </el-col>
        <el-col :span="16" class="text-right">
          <el-button-group>
            <el-button plain size="small" @click="showPart(0)">生成派送</el-button>
            <el-button plain size="small">显示当天任务</el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <div class="d-table">
        <div class="d-table-left">
          <div class="d-table-col-wrap" :style="'height:'+bodyHeight" @scroll="scrollLoadingData">
            <div class="m-list">
              <table class="table table-hover mt-10">
                <thead>
                <tr>
                  <th width="6%"></th>
                  <th width="12%">件数</th>
                  <th width="20%">运单类型</th>
                  <th width="30%">收货单位</th>
                  <th width="32%">收货地址</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in dataRows" :class="{active: item.isChecked}" @click="rowClick(item)">
                  <td>
                    <el-checkbox v-model="item.isChecked" @change="changeCheckStatus(item)"></el-checkbox>
                  </td>
                  <td>{{item.count}}</td>
                  <td>{{item.type}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.address}}</td>
                </tr>
                </tbody>
              </table>
              <div class="btn-left-list-more">
                <bottom-loading></bottom-loading>
                <div @click.stop="getMore" v-show="!$store.state.bottomLoading">
                  <el-button v-show="pager.currentPage<pager.totalPage">加载更多</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-table-right">
          <el-amap vid="aMap" :plugin="plugins" :zoom="10" :center="center" :style="'height:'+ bodyHeight">
            <el-amap-marker v-for="(marker, index) in markers" :key="index" :vid="index" :position="marker.position"
                            :label="marker.label" :icon="marker.icon" :animation="marker.animation"
                            :events="marker.events"></el-amap-marker>
          </el-amap>
        </div>
      </div>
      <el-row class="bottom-part">
        合计：共有20票，57件，0公斤，42051立方：
      </el-row>
    </div>

    <page-right :show="showIndex === 0" @right-close="resetRightBox"
                :css="{'width':'800px','padding':0, 'z-index': 1000}">
      <component :is="currentPart"/>
    </page-right>
  </div>
</template>
<script>
  import SearchPart from './search';
  import Icon from '@/assets/img/marker.png';
  import IconActive from '@/assets/img/marker_active.png';

  export default {
    components: {
      SearchPart
    },
    data: function () {
      return {
        dataRows: [],
        currentItem: {},
        searchWord: '',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        showIndex: false,
        currentPart: null,
        dialogComponents: {
          0: () => import('./delivery-form')
        },
        center: [121.5273285, 31.21515044],
        markers: [],
        plugins: [
          {pName: 'ToolBar'},
          {pName: 'Scale'},
          {
            pName: 'MapType',
            defaultType: 0
          }
        ]
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return (height - 70) + 'px';
      }
    },
    mounted () {
    },
    watch: {},
    methods: {
      scrollLoadingData (event) {
        this.$scrollLoadingData(event);
      },
      rowClick (item) {
        item.isChecked = !item.isChecked;
        this.changeCheckStatus(item);
      },
      resetRightBox () {
        this.showIndex = -1;
      },
      showPart (index) {
        this.showIndex = index;
        this.currentPart = this.dialogComponents[index];
      },
      changeCheckStatus (item) {
        this.setMarker(item._marker, item);
      },
      searchResult () {
        this.dataRows = [
          {count: 7, type: '冷藏药品', name: '浦东医院犬伤门诊（南中心', address: '浦东新区惠南镇拱为路2800号', isChecked: false},
          {count: 1, type: '冷藏药品', name: '上海市浦东新区金杨社区卫生服务中心', address: '浦东新区银山路332号', isChecked: false},
          {count: 2, type: '冷藏药品', name: '青村镇社区卫生服务中心钱桥分中心', address: '奉贤区长丰路45号', isChecked: false},
          {count: 3, type: '冷藏药品', name: '上海市第七人民医院', address: '上海市浦东新区高桥镇大同路358号（药库）', isChecked: false},
          {count: 4, type: '冷藏药品', name: '南桥镇社区卫生服务中心光明分中心', address: '奉贤区优化路108号', isChecked: false}
        ];
        this.addOverlays();
      },
      getLgtAndLat (query, callBack) {
        const AMap = window.AMap;
        const myGeo = new AMap.Geocoder();
        myGeo.getLocation(query, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            callBack(result);
          }
        });
      },
      addOverlays () {
        // 清空覆盖物
        this.markers = [];
        this.dataRows.forEach(i => {
          this.getLgtAndLat(i.address, result => {
            let geoCodes = result.geocodes;
            geoCodes.forEach(g => {
              this.addMarker(g, i);
            });
          });
        });
      },
      addMarker (d, row) {
        let marker = {
          position: [d.location.getLng(), d.location.getLat()],
          label: {
            content: `<div class="index_${row.count}">${row.name}</div>`,
            offset: [20, 20]
          },
          icon: Icon,
          animation: 'AMAP_ANIMATION_NONE',
          events: {
            click: () => {
              row.isChecked = !row.isChecked;
              this.setMarker(marker, row);
            },
            mouseover: () => {
              if (row.isChecked) return;
              this.setMarkerByMove(marker, row, true);
            },
            mouseout: () => {
              if (row.isChecked) return;
              this.setMarkerByMove(marker, row, false);
            }
          }
        };
        this.markers.push(marker);
        row._marker = marker;
      },
      setMarker (marker, row) {
        marker.animation = row.isChecked ? 'AMAP_ANIMATION_BOUNCE' : 'AMAP_ANIMATION_NONE';
        marker.icon = row.isChecked ? IconActive : Icon;
        this.setLabelBorderColor(row);
      },
      setLabelBorderColor (row) {
        const ele = this.$el.getElementsByClassName('index_' + row.count);
        if (ele) {
          const classList = ele[0].parentNode.classList;
          row.isChecked ? classList.add('active') : classList.remove('active');
        }
      },
      setMarkerByMove (marker, row, type) {
        marker.icon = type ? IconActive : Icon;
        const ele = this.$el.getElementsByClassName('index_' + row.count);
        if (ele) {
          const classList = ele[0].parentNode.classList;
          type ? classList.add('active') : classList.remove('active');
        }
      }
    }
  };
</script>
