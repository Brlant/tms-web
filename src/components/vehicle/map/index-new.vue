<style lang="scss" scoped="">
  @import "../../../assets/scss/mixins";

  .d-table {
    margin-top: 0;
    margin-bottom: 0;

    .d-table-left {
      width: 450px;
    }

    .d-table-right {
      border: 1px;
      padding: 0;
      position: relative;
    }
  }

  .m-part {
    padding: 0 10px;
    border: 1px solid #eee;
  }

  .second-part {
    position: relative;
    @extend .m-part;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .header--padding {
    padding-left: 43px;
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

  .icon__point {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 43px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-right: 1px solid #eee;
    cursor: pointer;

    .el-icon-t-zoom-point {
      font-size: 30px;
      color: $activeColor;
      transform: rotate(180deg);
    }

    &.on {
      .el-icon-t-zoom-point {
        transform: rotate(0);
      }
    }

    &:hover {
      background: $activeColor;

      .el-icon-t-zoom-point {
        color: #fff;
      }
    }
  }

  .custom-radio-list {
    .el-col {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px 0;
      border-bottom: 1px solid #eee;
      border-right: 1px solid #eee;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;

      &.on {
        border-bottom: 4px solid $activeColor;
      }
    }
  }

  .btn-tool {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 14px;
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
          <perm label="tms-task-add">
            <el-button plain size="small" @click="showPart(1, '请勾选需要自动排单的运单')" v-show="checkList.length">
              <f-a class="icon-small" name="wave"></f-a>
              自动排单
            </el-button>
          </perm>
        </template>
      </search-part>
      <el-row class="second-part clearfix">
        <div class="icon__point" :class="{on: isShowList}" @click="isShowList=!isShowList">
          <f-a name="zoom-point"/>
        </div>
        <el-col :span="16">
          <h2 class="header f-dib header--padding">
            您已选择：共有{{totalTicket}}票，{{totalIncubatorCount}}件，{{totalWeight}}公斤，{{totalVolume}}立方米，预估包装
            {{preIncubatorCount}}件，实际包装 {{incubatorCount}}件
          </h2>
        </el-col>
        <el-col :span="2">
        </el-col>
        <el-col :span="6" class="text-right">
          <!--<el-button-group>-->
          <!--<perm label="tms-task-add">-->
          <!--<el-button plain size="small" @click="showPart(0)">生成派送</el-button>-->
          <!--</perm>-->
          <!--<el-button plain size="small">显示当天任务</el-button>-->
          <!--</el-button-group>-->
        </el-col>
      </el-row>
      <div class="d-table">
        <div class="d-table-left" v-show="isShowList">
          <el-row class="custom-radio-list">
            <el-col :span="12" :class="{on: receiveStatus==='1'}" @click.native="receiveStatus='1'">
              已选 <span v-show="checkList.length">（{{checkList.length}}）</span>
            </el-col>
            <el-col :span="12" :class="{on: receiveStatus==='0'}" @click.native="receiveStatus='0'">
              全部 <span v-show="dataRows.length">（{{dataRows.length}}）</span>
            </el-col>
          </el-row>
          <table class="table" style="margin-bottom: 0">
            <thead>
            <tr>
              <th width="8%" class="search-no-border" @click="isShowSearch = !isShowSearch">
                <span><i class="el-icon-t-search"></i></span>
              </th>
              <th width="14%">包件数</th>
              <th width="30%">运单号</th>
              <th width="24%">收货单位</th>
              <th width="24%">收货地址</th>
            </tr>
            </thead>
          </table>
          <el-scrollbar tag="div" class="d-table-left_scroll" :style="'height:'+bodyHeight + 'px'"
                        @scroll="scrollLoadingData">
            <div class="scrollbar-content">
              <div class="m-list">
                <table class="table table-hover">
                  <tbody>
                  <tr v-show="isShowSearch">
                    <td colspan="5">
                      <oms-input class="search-input" v-model='typeTxt' placeholder="请输入运单号/收货单位/收货地址搜索"
                                 :showFocus="isShowSearch"/>
                    </td>
                  </tr>
                  <tr v-for="item in dataRows"
                      v-show="(receiveStatus==='0' || receiveStatus==='1' && item.isChecked) && item.isHasSearchText"
                      :class="{active: item.isChecked}" @click.stop.prevent="rowClick(item)">
                    <td width="8%">
                      <el-checkbox v-model="item.isChecked"></el-checkbox>
                    </td>
                    <td width="14%">{{showIncubatorCount(item)}}</td>
                    <td width="30%" class="R">
                      <div class="id-part">
                        <dict :dict-group="'bizType'" :dict-key="item.waybillType"></dict>
                      </div>
                      <div>
                        {{item.waybillNumber}}
                      </div>
                    </td>
                    <td width="24%" class="R">{{item.waybillType==='1-1'?item.senderName:item.receiverName}}</td>
                    <td width="24%" class="R">{{item.waybillType==='1-1'?item.senderAddress:item.receiverAddress}}</td>
                  </tr>
                  </tbody>
                </table>
                <div class="btn-left-list-more" v-show="receiveStatus==='0'">
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
          <el-amap :plugin="plugins" :zoom="10" ref="deliveryMap" vid="aMap"
                   :style="'height:'+ (bodyHeight + 90)  + 'px'">
            <el-amap-marker v-for="(marker, index) in markers" :key="index" :vid="index" :position="marker.position"
                            :label="marker.label" :icon="marker.icon" :animation="marker.animation"
                            :events="marker.events"></el-amap-marker>
          </el-amap>
          <div class="btn-tool">
            <el-button-group>
              <el-button size="mini" class="el-button--checkbox">
                <el-checkbox v-model="isShowLabel" size="mini" @change="switchShowLabel">标签</el-checkbox>
              </el-button>
              <el-button size="mini" v-show="!isDrawArea" @click="drawArea">选择区域</el-button>
              <el-button size="mini" @click="redrawArea" v-show="isDrawArea">重新选择</el-button>
              <el-button size="mini" @click="closeDrawArea" v-show="isDrawArea">取消</el-button>
              <el-button size="mini" @click="confirmArea" v-show="curArea && isDrawArea">确认</el-button>
            </el-button-group>
          </div>
        </div>
      </div>
    </div>

    <page-right :show="showIndex !== -1" @right-close="resetRightBox"
                :css="{'width':'1000px','padding':0, 'z-index': 1000}">
      <component :is="currentPart" :checkList="orderIdList" @right-close="resetRightBox" @change="submit"/>
    </page-right>
  </div>
</template>
<script>
  import SearchPart from './search';
  import Icon from '@/assets/img/marker.png';
  import IconActive from '@/assets/img/marker_active.png';
  import {TransportTask} from '@/resources';
  import deliveryForm from './delivery-form';
  import utils from '@/tools/utils';
  import batchAutoForm from '@/components/document/transport/form/auto-form';

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
          pageSize: 200
        },
        showIndex: -1,
        currentPart: null,
        dialogComponents: {
          0: deliveryForm,
          1: batchAutoForm
        },
        center: [121.5273285, 31.21515044],
        markers: [],
        plugins: [
          {pName: 'ToolBar'},
          {pName: 'Scale'}
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
        incubatorCount: 0,
        preIncubatorCount: 0,
        dataMap: [],
        isShowList: false,
        receiveStatus: '0',
        isShowSearch: false,
        typeTxt: '',
        isDrawArea: false,
        mouseTool: null,
        curArea: null,
        editorArea: null,
        isShowLabel: true
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return (height - 190);
      },
      checkList() {
        return this.dataRows.filter(f => f.isChecked);
      }
    },
    mounted() {
      this.getWayBillOrderList(1);
      this.initMapTools();
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
          this.incubatorCount = 0;
          this.preIncubatorCount = 0;
          val.forEach(item => {
            if (item.status === '0') {
              this.totalIncubatorCount = this.totalIncubatorCount + item.incubatorCount;
            }
            if (item.status === '-1') {
              this.totalIncubatorCount = this.totalIncubatorCount + item.preIncubatorCount;
            }
            this.incubatorCount = this.incubatorCount + item.incubatorCount;
            this.preIncubatorCount = this.preIncubatorCount + item.preIncubatorCount;
            this.totalWeight = this.totalWeight + item.goodsWeight;
            this.totalVolume = this.totalVolume + item.goodsVolume;
          });
          this.formatVolume();
          this.formatWeight();
        }
      },
      typeTxt(val) {
        this.dataRows.forEach(i => {
          if (!val) {
            i.isHasSearchText = true;
            return;
          }
          i.isHasSearchText = i.waybillNumber && i.waybillNumber.includes(val) ||
            i.receiverName && i.receiverName.includes(val) ||
            i.receiverAddress && i.receiverAddress.includes(val);
        });
      }
    },
    methods: {
      showIncubatorCount: function (item) {
        if (!item.packFlag) {
          return item.preIncubatorCount;
        }
        return item.incubatorCount;
      },
      initMapTools() {
        let time = setTimeout(this.initMapTools, 100);
        let deliveryMap = this.$refs.deliveryMap;
        if (!deliveryMap) return;
        let map = deliveryMap.$$getInstance();
        if (!map) return;
        window.clearInterval(time);
        if (!this.mouseTool) {
          this.mouseTool = new window.AMap.MouseTool(map);
          this.mouseTool.on('draw', e => {
            this.curArea = e.obj;
            // 结束绘制
            this.mouseTool.close(false);
            // 区域可编辑
            this.editorArea = new window.AMap.PolyEditor(map, e.obj);
            this.editorArea.open();
          }, this);
        }
      },
      getMore: function () {
        this.getWayBillOrderList(this.pager.currentPage + 1, true);
      },
      formatVolume() {// 保留两位小数
        if (!this.totalVolume) return 0;
        this.totalVolume = utils.autoformatDecimalPoint(this.totalVolume.toString());
      },
      formatWeight() {// 保留两位小数
        if (!this.totalWeight) return 0;
        this.totalWeight = utils.autoformatDecimalPoint(this.totalWeight.toString());
      },
      submit: function () {
        this.getWayBillOrderList(1);
        // 清空勾选的运单列表
        this.orderIdList = [];
        this.totalIncubatorCount = 0;
        this.incubatorCount = 0;
        this.preIncubatorCount = 0;
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
        TransportTask.validWayBill(param).then(res => {
          this.$store.commit('initBottomLoading', false);
          if (isContinue) {
            res.data.list.forEach(i => {
              i.isChecked = false;
              i.isHasSearchText = true;
            });
            this.dataRows = this.dataRows.concat(res.data.list);
            this.changeAddress(this.dataRows);
            this.addOverlays(res.data.list, true);
          } else {
            this.setCenter(res.data.list);
            res.data.list.forEach(i => {
              i.isChecked = false;
              i.isHasSearchText = true;
            });
            this.dataRows = [];
            this.dataRows = res.data.list;
            this.changeAddress(this.dataRows);
            this.addOverlays(this.dataRows, false);
          }
          this.pager.totalPage = res.data.totalPage;
        });
      },
      setCenter(list) {
        if (!list.length) return;
        let item = list[0];
        if (!item.receiverAddressDimension && !item.receiverAddressLongitude) return;
        let deliveryMap = this.$refs.deliveryMap;
        if (!deliveryMap) {
          setTimeout(() => {
            this.setCenter(list);
          }, 200);
          return;
        }
        let map = deliveryMap.$$getInstance();
        if (!map) {
          setTimeout(() => {
            this.setCenter(list);
          }, 200);
          return;
        }
        map.setCenter([item.receiverAddressLongitude, item.receiverAddressDimension]);
      },
      changeAddress(dataRows) {
        if (dataRows) {
          for (let i = 0; i < dataRows.length; i++) {
            // 如果是销售退货，收货单位和收货地址取发货信息
            let data = dataRows[i];
            if (data.waybillType === '1-1') {
              data.receiverName = data.senderName;
              data.receiverAddress = data.senderAddress;
            }
          }
        }
      },
      scrollLoadingData(event) {
        this.$scrollLoadingData(event);
      },
      rowClick(item) {
        item.isChecked = !item.isChecked;
        this.$nextTick(() => {
          this.setMarkerByRow(item);
        });
      },
      setMarkerByRow(item) {
        // 判断 其他选中的运单有没有此收货单位
        this.$nextTick(() => {
          const isOtherSameUnit = this.checkList.some(s => s.receiverAddress === item.receiverAddress);
          this.setMarkerStyle(item, isOtherSameUnit);
        });
      },
      resetRightBox() {
        this.showIndex = -1;
      },
      showPart(index, str = '请选择需要生成派送任务的运单') { // 请勾选需要自动排单的运单
        let {checkList, $notify, dialogComponents} = this;
        if (!checkList.length) {
          $notify.warning({
            duration: 2000,
            message: str
          });
          return;
        }
        this.showIndex = index;
        this.currentPart = dialogComponents[index];
        this.$nextTick(() => {
          this.orderIdList = index === 0 ? checkList.map(m => m.id) : checkList.slice();
        });
      },
      searchResult(search) {
        // 清空勾选的运单列表
        this.orderIdList = [];
        this.totalIncubatorCount = 0;
        this.incubatorCount = 0;
        this.preIncubatorCount = 0;
        this.totalWeight = 0;
        this.totalVolume = 0;
        this.totalTicket = 0;
        Object.assign(this.filters, search);
      },
      // 得到经纬度
      getLgtAndLat(query, callBack) {
        const AMap = window.AMap;
        const myGeo = new AMap.Geocoder();
        myGeo.getLocation(query, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            callBack(result);
          }
        });
      },
      // 添加点
      addOverlays(list, isContinue) {
        // 清空覆盖物
        if (!isContinue || list.length === 0) {
          this.markers = [];
        }
        list.forEach(i => {
          if (i.receiverAddressDimension && i.receiverAddressLongitude) {
            if (i.waybillType === '1-1') {
              if (i.senderAddressDimension && i.senderAddressLongitude) {
                this.addMarker({
                  lng: i.senderAddressLongitude,
                  lat: i.senderAddressDimension
                }, i, true);
              }
            } else {
              this.addMarker({
                lng: i.receiverAddressLongitude,
                lat: i.receiverAddressDimension
              }, i, true);
            }
          } else {
            if (i.waybillType === '1-1') {
              this.getLgtAndLat(i.senderAddress, result => {
                let geoCodes = result.geocodes;
                geoCodes.forEach(g => {
                  this.addMarker(g, i);
                });
              });
            } else {
              this.getLgtAndLat(i.receiverAddress, result => {
                let geoCodes = result.geocodes;
                geoCodes.forEach(g => {
                  this.addMarker(g, i);
                });
              });
            }
          }
        });
      },
      //生产15位随机数
      guid() {
        function s4() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (s4() + '-' + s4() + '-' + s4());
      },
      addMarker(d, row, isHas = false) {
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
            content: `<div class="babel__container index_${id}" style="display:${this.isShowLabel ? 'block' : 'none'}">
                        <div class="bg"></div>
                        <div class="title">${row.receiverName}</div><div>${row.receiverName}</div>
                      </div>`,
            offset: [15, 15]
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
      bindMarkerLabelEvent(row) {
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
      clickMarker(row) {
        row.isChecked = !row.isChecked;
        // 选中同一收货地址的所有运单
        this.dataRows.forEach(i => {
          if (i.receiverAddress === row.receiverAddress) i.isChecked = row.isChecked;
        });
        this.setMarkerStyle(row, row.isChecked);
      },
      setMarkerStyle(row, isChecked) {
        let rowCheck = typeof isChecked === 'boolean' ? isChecked : row.isChecked;
        row._marker.icon = rowCheck ? IconActive : Icon;
        this.setLabelBorderColor(row, rowCheck);
      },
      setLabelBorderColor(row, isChecked) {
        let label = row._marker._label;
        if (!label) return;
        const classList = label.parentNode.classList;
        isChecked ? classList.add('active') : classList.remove('active');
      },
      // 地图加载完成, 初始化工具
      initTools() {
        console.log(1);
      },
      // 开启绘制区域
      drawArea() {
        this.isDrawArea = true;
        this.mouseTool.polygon({
          strokeColor: '#f00'
        });
      },
      // 重新绘制区域
      redrawArea() {
        this.mouseTool.close(true);
        this.mouseTool.polygon({
          strokeColor: '#f00'
        });
        this.editorArea && this.editorArea.close();
      },
      // 取消绘制
      closeDrawArea() {
        this.mouseTool.close(true);
        this.isDrawArea = false;
        this.curArea = null;
        this.editorArea && this.editorArea.close();
        this.editorArea = null;
      },
      // 确认区域
      confirmArea() {
        // 循环设置所有运单选中状态
        this.dataRows.forEach(i => {
          if (i.isChecked) return;
          i.isChecked = window.AMap.GeometryUtil.isPointInRing(i._marker.position, this.curArea.getPath());
          this.setMarkerByRow(i);
        });
        this.isShowList = true;
        this.receiveStatus = '1';
        this.closeDrawArea();
      },
      // 是否显示点的标签
      switchShowLabel(val) {
        let elements = this.$el.querySelectorAll('.babel__container');
        [...elements].forEach(i => {
          i.style.display = val ? 'block' : 'none';
        });
      }
    }
  };
</script>
