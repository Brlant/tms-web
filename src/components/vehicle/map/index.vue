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
            <el-button plain size="small" @click="showPart(0)">生成派送</el-button>
          </perm>
        </template>
      </search-part>
      <el-row class="second-part clearfix">
        <el-col :span="12">
          <h2 class="header f-dib">
            您已选择：共有{{totalTicket}}票，{{totalIncubatorCount}}件，{{totalWeight}}公斤，{{totalVolume}}立方米</h2>
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
              <th width="4%"></th>
              <th width="14%">包件数</th>
              <th width="30%">运单号</th>
              <th width="26%">收货单位</th>
              <th width="26%">收货地址</th>
            </tr>
            </thead>
          </table>
          <div class="d-table-col-wrap" :style="'height:'+bodyHeight" @scroll="scrollLoadingData">
            <div class="m-list">
              <table class="table table-hover">
                <tbody>
                <tr v-for="item in dataRows" :class="{active: item.isChecked}" @click="rowClick(item)">
                  <td width="4%">
                    <el-checkbox v-model="item.isChecked" @change="changeCheckStatus(item)"></el-checkbox>
                  </td>
                  <td width="12%">{{item.incubatorCount}}</td>
                  <td width="32%" class="R">
                    <div class="id-part">
                      <dict :dict-group="'bizType'" :dict-key="item.waybillType"></dict>
                    </div>
                    <div>
                      {{item.waybillNumber}}
                    </div>
                  </td>
                  <td width="26%" class="R">{{item.receiverName}}</td>
                  <td width="26%" class="R">{{item.receiverAddress}}</td>
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
    </div>

    <page-right :show="showIndex === 0" @right-close="resetRightBox"
                :css="{'width':'800px','padding':0, 'z-index': 1000}">
      <component :is="currentPart" :checkList="orderIdList"  @right-close="resetRightBox" @change="submit"/>
    </page-right>
  </div>
</template>
<script>
  import SearchPart from './search';
  import Icon from '@/assets/img/marker.png';
  import IconActive from '@/assets/img/marker_active.png';
  import {TmsWayBill} from '@/resources';
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
          pageSize: 20
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
        checkList: [],
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
        return (height - 90) + 'px';
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
            this.dataRows = this.dataRows.concat(res.data.list);
            this.addOverlays(res.data.list, true);
          } else {
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
        this.changeCheckStatus(item);
      },
      resetRightBox () {
        this.showIndex = -1;
      },
      showPart (index) {
        if (!this.checkList.length) {
          this.$notify.warning({
            duration: 2000,
            message: '请选择需要生成派送任务的运单'
          });
          return;
        }
        this.showIndex = index;
        this.currentPart = this.dialogComponents[index];
        this.$nextTick(() => {
          let orderIdList = [];
          this.checkList.forEach(val => {
            orderIdList.push(val.id);
          });
          this.orderIdList = orderIdList;
        });
      },
      changeCheckStatus (item) {
        let index = this.checkList.indexOf(item);
        if (item.isChecked) {
          if (index === -1) {
            this.checkList.push(item);
          }
        } else {
          this.checkList.splice(index, 1);
        }
        this.setMarker(item._marker, item);
      },
      searchResult (search) {
        Object.assign(this.filters, search);
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
      addOverlays(list, isContinue) {
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
      addMarker (d, row, isHas = false) {
        let marker = {
          label: {
            content: `<div class="index_${row.id}">${row.receiverName}</div>`,
            offset: [20, 20]
          },
          icon: Icon,
          animation: 'AMAP_ANIMATION_NONE',
          events: {
            click: () => {
              this.clickMarker(marker, row);
            },
            mouseover: () => {
              this.setMarkerByMove(marker, row, !row.isChecked);
            },
            mouseout: () => {
              this.setMarkerByMove(marker, row, row.isChecked);
            }
          }
        };
        if (!isHas) {
          marker.position = [d.location.getLng(), d.location.getLat()];
        } else {
          marker.position = [d.lng, d.lat];
        }
        this.markers.push(marker);
        row._marker = marker;
        setTimeout(() => {
          this.createMarkerLabel(marker, row);
        }, 300);
      },
      createMarkerLabel (marker, row) {
        let ele_ary = this.$el.getElementsByClassName('index_' + row.id);
        if (!ele_ary.length) return;
        const div = ele_ary[0];
        let aMapEvent = window.AMap.event;
        aMapEvent.addDomListener(div, 'click', () => {
          this.clickMarker(marker, row);
        });
        aMapEvent.addDomListener(div, 'mouseover', () => {
          this.setMarkerByMove(marker, row, !row.isChecked);
        });
        aMapEvent.addDomListener(div, 'mouseout', () => {
          this.setMarkerByMove(marker, row, row.isChecked);
        });
      },
      clickMarker (marker, row) {
        row.isChecked = !row.isChecked;
        this.setMarker(marker, row);
        let index = this.checkList.indexOf(row);
        if (row.isChecked) {
          if (index === -1) {
            this.checkList.push(row);
          }
        } else {
          this.checkList.splice(index, 1);
        }
      },
      setMarker (marker, row) {
        // marker.animation = row.isChecked ? 'AMAP_ANIMATION_BOUNCE' : 'AMAP_ANIMATION_NONE';
        marker.icon = row.isChecked ? IconActive : Icon;
        this.setLabelBorderColor(row);
      },
      setLabelBorderColor (row) {
        const ele = this.$el.getElementsByClassName('index_' + row.id);
        if (ele.length) {
          const classList = ele[0].parentNode.classList;
          row.isChecked ? classList.add('active') : classList.remove('active');
        }
      },
      setMarkerByMove (marker, row, type) {
        marker.icon = type ? IconActive : Icon;
        const ele = this.$el.getElementsByClassName('index_' + row.id);
        if (ele.length) {
          const classList = ele[0].parentNode.classList;
          type ? classList.add('active') : classList.remove('active');
        }
      }
    }
  };
</script>
