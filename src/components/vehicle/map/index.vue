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

  .b-map {
    width: 100%;
    min-height: 500px;
    height: 100%;
    margin-bottom: 20px;
  }
  .table-hover {
    >tbody > tr {
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
          <div>
            <baidu-map ref="bmap" class="b-view" :center="{lng: 121.480539, lat: 31.235929}" :zoom="10"
                       :scroll-wheel-zoom="true" :pinch-to-zoom="true" :dragging="true">
              <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>
              <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
              <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP', ]"
                           anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>
              <bm-view class="b-map" :style="'height:'+ bodyHeight"></bm-view>
            </baidu-map>
          </div>
        </div>
      </div>
      <el-row class="bottom-part">
        合计：共有20票，57件，0公斤，42051立方：
      </el-row>
    </div>

    <page-right :show="showIndex === 0" @right-close="resetRightBox" :css="{'width':'800px','padding':0}">
      <component :is="currentPart"/>
    </page-right>
  </div>
</template>
<script>
  import mapMixin from '@/mixins/mapMixin';
  import SearchPart from './search';
  import DeliveryForm from './delivery-form';
  export default {
    mixins: [mapMixin],
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
          0: DeliveryForm
        }
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return (height - 70) + 'px';
      },
      map () {
        return this.$refs['bmap'].map;
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
        item._marker.setAnimation(item.isChecked ? window.BMAP_ANIMATION_BOUNCE : null);
        // const Icon = item._marker.getIcon();
        // Icon.imageUrl = item.isChecked ? '../../assets/img/marker_red.png' : '../../assets/img/marker_blue.png';
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
      addOverlays () {
        const {map} = this;
        const BMap = window.BMap;
        // 清空覆盖物
        map.clearOverlays();
        this.dataRows.forEach(i => {
          this.getLgtAndLat(i.address, point => {
            if (point) {
              const marker = new BMap.Marker(point);
              i._marker = marker;
              // 文字标注
              const label = new BMap.Label(i.name, {offset: new BMap.Size(20, -10)});
              marker.setLabel(label);
              //监听事件
              marker.addEventListener('click', () => {
                i.isChecked = !i.isChecked;
                marker.setAnimation(i.isChecked ? window.BMAP_ANIMATION_BOUNCE : null);
                // const Icon = marker.getIcon();
                // Icon.imageUrl = i.isChecked ? '../../assets/img/marker_red.png' : '../../assets/img/marker_blue.png';
              });
              map.addOverlay(marker);
            }
          });
        });
      }
    }
  };
</script>
