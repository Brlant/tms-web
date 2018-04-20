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

  .id-part {
    font-size: 12px;
    color: #888;

  }

  .tr-position {
    position: fixed;
    background: #ffffff;
    height: 100%;
  }
</style>
<template>
  <div>
    <div>
      <search-part @search="searchResult">
        <template slot="btn">
          <perm label="tms-task-add">
            <el-button plain size="small" @click="showPart(0)">
              <f-a class="icon-small" name="detail"></f-a>
              生成派送
            </el-button>
          </perm>
        </template>
      </search-part>
      <el-row class="second-part clearfix">
        <el-col :span="12">
          <h2 class="header f-dib">
            您已选择：共有{{totalTicket}}票，{{totalIncubatorCount}}件，{{totalWeight}}公斤，{{totalVolume}}立方米
          </h2>
        </el-col>
        <el-col :span="2">
        </el-col>
        <el-col :span="10" class="text-right">
          <!--<el-button-group>-->
          <!--<perm label="tms-task-add">-->
          <!--<el-button plain size="small" @click="showPart(0)">生成派送</el-button>-->
          <!--</perm>-->
          <!--<el-button plain size="small">显示当天任务</el-button>-->
          <!--</el-button-group>-->
        </el-col>
      </el-row>
      <div class="d-table">
        <div class="d-table-left">
          <table class="table" style="margin-bottom: 0">
            <thead>
            <tr>
              <th width="8%"></th>
              <th width="14%">包件数</th>
              <th width="30%">运单号</th>
              <th width="24%">收货单位</th>
              <th width="24%">收货地址</th>
            </tr>
            </thead>
          </table>

          <el-scrollbar tag="div" class="d-table-left_scroll" :style="'height:'+bodyHeight" @scroll="scrollLoadingData">
            <div class="scrollbar-content">
              <div class="m-list">
                <table class="table table-hover">
                  <tbody>
                  <tr v-for="item in dataRows" :class="{active: item.isChecked}" @click.stop.prevent="rowClick(item)">
                    <td width="8%">
                      <el-checkbox v-model="item.isChecked"></el-checkbox>
                    </td>
                    <td width="14%">{{item.incubatorCount}}</td>
                    <td width="30%" class="R">
                      <div class="id-part">
                        <dict :dict-group="'bizType'" :dict-key="item.waybillType"></dict>
                      </div>
                      <div>
                        {{item.waybillNumber}}
                      </div>
                    </td>
                    <td width="24%" class="R">{{item.receiverName}}</td>
                    <td width="24%" class="R">{{item.receiverAddress}}</td>
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
          </el-scrollbar>
        </div>
        <div class="d-table-right">
          <el-amap vid="aMap" :plugin="plugins" :zoom="10" :center="center" :style="'height:'+ bodyHeight">
            <el-amap-marker v-for="(marker, index) in markers" :key="index" :vid="index" :position="marker.position"
                            :label="marker.label" :icon="marker.icon" :animation="marker.animation"
                            :events="marker.events"></el-amap-marker>
          </el-amap>
        </div>
      </div>
    </div>

    <page-right :show="showIndex === 0" @right-close="resetRightBox"
                :css="{'width':'1000px','padding':0, 'z-index': 1000}">
      <component :is="currentPart" :checkList="orderIdList" @right-close="resetRightBox" @change="submit"/>
    </page-right>
  </div>
</template>
<script>
  import SearchPart from './search';
  import Icon from '@/assets/img/marker.png';
  import IconActive from '@/assets/img/marker_active.png';
  import { TmsWayBill } from '@/resources';
  import deliveryForm from './delivery-form';
  import utils from '@/tools/utils';

  export default {
    components: {
      SearchPart
    },
    data: function () {
      return {
        dataRows: [],
        searchWord: '',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 100
        },
        showIndex: false,
        currentPart: null,
        dialogComponents: {
          0: deliveryForm
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
        ],
        filters: {
          status: '0',
          waybillNumber: '',
          waybillType: '',
          shipmentWay: '',
          serviceType: '',
          senderId: '',
          receiverId: '',
          startTime: '',
          endTime: ''
        },
        orderIdList: [],
        totalTicket: 0,
        totalIncubatorCount: 0,
        totalWeight: 0,
        totalVolume: 0,
        dataMap: []
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return (height - 150) + 'px';
      },
      checkList () {
        return this.dataRows.filter(f => f.isChecked);
      }
    },
    mounted () {
      this.getWayBillOrderList(1);
    },
    watch: {
      filters: {
        handler: function () {
          this.getWayBillOrderList(1);
        },
        deep: true
      },
      checkList: function (val) {
        if (val) {
          this.totalIncubatorCount = 0;
          this.totalWeight = 0;
          this.totalVolume = 0;
          this.totalTicket = val.length;
          val.forEach(item => {
            this.totalIncubatorCount = this.totalIncubatorCount + item.incubatorCount;
            this.totalWeight = this.totalWeight + item.goodsWeight;
            this.totalVolume = this.totalVolume + item.goodsVolume;
          });
          this.formatVolume();
          this.formatWeight();
        }
      }
    },
    methods: {
      getMore: function () {
        this.getWayBillOrderList(this.pager.currentPage + 1, true);
      },
      formatVolume () {// 保留两位小数
        if (!this.totalVolume) return 0;
        this.totalVolume = utils.autoformatDecimalPoint(this.totalVolume.toString());
      },
      formatWeight () {// 保留两位小数
        if (!this.totalWeight) return 0;
        this.totalWeight = utils.autoformatDecimalPoint(this.totalWeight.toString());
      },
      submit: function () {
        this.getWayBillOrderList(1);
        // 清空勾选的运单列表
        this.orderIdList = [];
        this.totalIncubatorCount = 0;
        this.totalWeight = 0;
        this.totalVolume = 0;
        this.totalTicket = 0;
      },
      getWayBillOrderList: function (pageNo, isContinue = false) {
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        TmsWayBill.query(param).then(res => {
          this.$store.commit('initBottomLoading', false);
          if (isContinue) {
            res.data.list.forEach(i => {
              i.isChecked = false;
            });
            this.dataRows = this.dataRows.concat(res.data.list);
            this.addOverlays(res.data.list, true);
          } else {
            res.data.list.forEach(i => {
              i.isChecked = false;
            });
            this.dataRows = [];
            this.dataRows = res.data.list;
            this.addOverlays(this.dataRows, false);
          }
          this.pager.totalPage = res.data.totalPage;
        });
      },
      scrollLoadingData (event) {
        this.$scrollLoadingData(event);
      },
      rowClick (item) {
        item.isChecked = !item.isChecked;
        // 判断 其他选中的运单有没有此收货单位
        this.$nextTick(() => {
          const isOtherSameUnit = this.checkList.some(s => s.receiverAddress === item.receiverAddress);
          this.setMarkerStyle(item, isOtherSameUnit);
        });
      },
      resetRightBox () {
        this.showIndex = -1;
      },
      showPart (index) {
        let {checkList, $notify, dialogComponents} = this;
        if (!checkList.length) {
          $notify.warning({
            duration: 2000,
            message: '请选择需要生成派送任务的运单'
          });
          return;
        }
        this.showIndex = index;
        this.currentPart = dialogComponents[index];
        this.$nextTick(() => {
          this.orderIdList = checkList.map(m => m.id);
        });
      },
      searchResult (search) {
        // 清空勾选的运单列表
        this.orderIdList = [];
        this.totalIncubatorCount = 0;
        this.totalWeight = 0;
        this.totalVolume = 0;
        this.totalTicket = 0;
        Object.assign(this.filters, search);
      },
      // 得到经纬度
      getLgtAndLat (query, callBack) {
        const AMap = window.AMap;
        const myGeo = new AMap.Geocoder();
        myGeo.getLocation(query, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            callBack(result);
          }
        });
      },
      // 添加点
      addOverlays (list, isContinue) {
        // 清空覆盖物
        if (!isContinue || list.length === 0) {
          this.markers = [];
        }
        list.forEach(i => {
          if (i.receiverAddressDimension && i.receiverAddressLongitude) {
            this.addMarker({
              lng: i.receiverAddressLongitude,
              lat: i.receiverAddressDimension
            }, i, true);
          } else {
            this.getLgtAndLat(i.receiverAddress, result => {
              let geoCodes = result.geocodes;
              geoCodes.forEach(g => {
                this.addMarker(g, i);
              });
            });
          }
        });
      },
      //生产15位随机数
      guid () {
        function s4 () {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (s4() + '-' + s4() + '-' + s4());
      },
      addMarker (d, row, isHas = false) {
        // 判断点是否已经存在
        let marker = {};
        let isExist = this.markers.some(s => {
          let isEqual = s.receiverAddress === row.receiverAddress;
          if (isEqual) marker = s;
          return isEqual;
        });
        // 存在, 赋给当前运单
        if (isExist) {
          row._marker = marker;
          return;
        }
        // 不存在, 新增点
        let id = this.guid();
        marker = {
          label: {
            content: `<div class="index_${id}">${row.receiverName}</div>`,
            offset: [20, 20]
          },
          icon: Icon,
          events: {
            click: () => {
              this.clickMarker(row);
            },
            mouseover: () => {
              this.setMarkerStyle(row, !row.isChecked);
            },
            mouseout: () => {
              this.setMarkerStyle(row, row.isChecked);
            }
          },
          receiverAddress: row.receiverAddress,
          markerId: id
        };
        if (!isHas) {
          marker.position = [d.location.getLng(), d.location.getLat()];
        } else {
          marker.position = [d.lng, d.lat];
        }
        this.markers.push(marker);
        row._marker = marker;
        // 为点的标签绑定事件
        this.bindMarkerLabelEvent(row);
      },
      // 绑定点的标签的事件
      bindMarkerLabelEvent (row) {
        let ele_ary = this.$el.getElementsByClassName(`index_${row._marker.markerId}`);
        if (!ele_ary.length) {
          // 若得不到dom对象, 延时100ms, 再次查找
          setTimeout(() => {
            this.bindMarkerLabelEvent(row);
          }, 100);
          return;
        }
        const div = ele_ary[0];
        row._marker._label = div;
        let aMapEvent = window.AMap.event;
        aMapEvent.addDomListener(div, 'click', () => {
          this.clickMarker(row);
        });
        aMapEvent.addDomListener(div, 'mouseover', () => {
          this.setMarkerStyle(row, !row.isChecked);
        });
        aMapEvent.addDomListener(div, 'mouseout', () => {
          this.setMarkerStyle(row, row.isChecked);
        });
      },
      clickMarker (row) {
        row.isChecked = !row.isChecked;
        // 选中同一收货地址的所有运单
        this.dataRows.forEach(i => {
          if (i.receiverAddress === row.receiverAddress) i.isChecked = row.isChecked;
        });
        this.setMarkerStyle(row, row.isChecked);
      },
      setMarkerStyle (row, isChecked) {
        let rowCheck = typeof isChecked === 'boolean' ? isChecked : row.isChecked;
        row._marker.icon = rowCheck ? IconActive : Icon;
        this.setLabelBorderColor(row, rowCheck);
      },
      setLabelBorderColor (row, isChecked) {
        let label = row._marker._label;
        if (!label) return;
        const classList = label.parentNode.classList;
        isChecked ? classList.add('active') : classList.remove('active');
      }
    }
  };
</script>
