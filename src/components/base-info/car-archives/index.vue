<style lang="less" scoped=''>

  .margin-left {
    margin-left: 15px;
  }

  .margin-left-right {
    margin-left: 38px;
    margin-right: 38px;
  }

  .power-style-part {
    margin: 12px 0;
    background-color: rgb(238, 238, 238);
    padding: 12px 10px 10px 10px;
  }

  .el-form .el-checkbox__label {
    font-size: 12px;
    padding-left: 5px;
  }

  .el-form .el-checkbox__inner {
    width: 14px;
    height: 14px;
  }

  .d-table-col-wrap {
    overflow: auto;
  }

  .d-table > div.d-table-right {
    padding-right: 0;
  }

</style>
<template>
  <div>
    <div class="d-table">
      <div class="d-table-left">
        <el-scrollbar tag="div" class="d-table-left_scroll" :style="'height:'+bodyHeight" @scroll="scrollLoadingData">
        <div class="scrollbar-content">
          <h2 class="header">
            <span class="pull-right">
              <!--<perm label="qualityItem-add">-->
              <!--<a href="#" class="btn-circle" @click.stop.prevent="addType">-->
              <!--<i class="el-icon-t-plus"></i>-->
              <!--</a>-->
              <des-btn icon="plus" @click="showPart(0)"></des-btn>
              <!--</perm>-->
                <a href="#" class="btn-circle" @click.prevent="searchType">
                  <i class="el-icon-t-search"></i>
                </a>
            </span>
            车辆档案
          </h2>
          <div class="search-left-box" v-show="showTypeSearch">
            <oms-input v-model='typeTxt' placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>
          </div>
          <div v-if="!data.carDto.id" class="empty-type-info">
            暂无信息
          </div>
          <div v-else>
            <ul class="show-list">
              <li v-for="item in showTypeList" class="list-item" @click="showType(item)"
                  :class="{'active':item.carDto.plateNumber==currentItem.carDto.plateNumber}">
                <!--<perm label="tms-car-archives-delete">-->
                <a href="#" class="pull-right hover-show" @click.prevent="removeType(item)">
                  <i class="el-icon-t-delete"></i>
                </a>
                <!--</perm>-->
                {{item.carDto.plateNumber}}
              </li>
            </ul>
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
        <el-scrollbar tag="div" class="d-table-left_scroll" :style="'height:'+bodyHeight">
          <div class="scrollbar-content">
          <div v-if="!data.carDto.id" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <h2 class="clearfix">
                <span class="pull-right">
                  <el-button-group>
                    <perm label="car-blacklist-add">
                      <el-button @click="addBlacklist()">
                        <i class="el-icon-t-edit"></i>
                        新增黑名单
                      </el-button>
                    </perm>
                    <perm label="car-blacklist-delete">
                      <el-button @click="batchDeleteBlacklist()" v-show="blacklist.length> 0">
                        <i class="el-icon-t-delete"></i>
                        一键删除黑名单
                      </el-button>
                    </perm>
                      <el-button @click="edit()">
                        <i class="el-icon-t-edit"></i>
                        编辑
                      </el-button>
                      <el-button @click="remove()">
                          <i class="el-icon-t-delete"></i>
                          删除
                        </el-button>
                    <!--</perm> -->
                    </el-button-group>
                </span>
            </h2>
            <div class="page-main-body min-row">
              <el-row>
                <el-col :span="24" style="font-size: 16px;">
                  [ 主档信息 ]
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <goods-row label="车牌号" :span="8">
                    {{ data.carDto.plateNumber}}
                  </goods-row>
                  <goods-row label="车辆归属公司" :span="8">
                    {{ data.carDto.ascriptionCompanyName}}
                  </goods-row>
                  <goods-row label="车辆默认司机" :span="8">
                    {{ data.carDto.defaultDriverName}}
                  </goods-row>
                  <goods-row label="车型" :span="8">
                    <dict :dict-group="'carType'" :dict-key="formatStatus( data.carDto.type)"></dict>
                  </goods-row>
                  <goods-row label="车辆核定载人数" :span="8">
                    {{ data.carDto.authorizedNumber}} <span v-if="data.carDto.authorizedNumber">人</span>
                  </goods-row>
                  <goods-row label="每公里运费" :span="8">
                    <span v-if="data.carDto.perFreight">¥</span> {{ data.carDto.perFreight| formatMoney}}
                  </goods-row>
                </el-col>
                <el-col :span="12">
                  <goods-row label="车辆承重" :span="8">
                    {{ data.carDto.loadBearing}} <span v-if="data.carDto.loadBearing">千克</span>
                  </goods-row>
                  <goods-row label="车厢长度" :span="8">
                    {{ data.carDto.carriageLength}} <span v-if="data.carDto.carriageLength">米</span>
                  </goods-row>
                  <goods-row label="车厢宽度" :span="8">
                    {{ data.carDto.carriageWidth}} <span v-if="data.carDto.carriageWidth">米</span>
                  </goods-row>
                  <goods-row label="车厢高度" :span="8">
                    {{ data.carDto.carriageHeight}} <span v-if="data.carDto.carriageHeight">米</span>
                  </goods-row>
                  <goods-row label="车厢容积" :span="8">
                    {{ data.carDto.volume}} <span v-if="data.carDto.volume">立方米</span>
                  </goods-row>
                  <goods-row label="起步运费" :span="8">
                    <span v-if="data.carDto.freight">¥</span>{{ data.carDto.freight| formatMoney}}
                  </goods-row>
                  <goods-row label="运输范围" :span="8">
                   <span v-for="(type,index) in data.carDto.scopeList">
                    <dict :dict-group="'transportationCondition'" :dict-key="type"></dict><span v-if="(data.carDto.scopeList.length-1)!==index">/</span>
                  </span>
                  </goods-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style="font-size: 16px;">
                  [ 行驶证信息 ]
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <goods-row label="车辆品牌" :span="8">
                    {{ data.carDetailDto.brand}}
                  </goods-row>
                  <goods-row label="车辆识别代码" :span="8">
                    {{ data.carDetailDto.identificationNumber}}
                  </goods-row>
                  <goods-row label="发证日期" :span="8">
                    {{ data.carDetailDto.issuingDate|date}}
                  </goods-row>
                  <goods-row label="强制报废日" :span="8">
                    {{ data.carDetailDto.forciblyDiscardedDay|date}}
                  </goods-row>
                </el-col>
                <el-col :span="12">
                  <goods-row label="车辆发动机号" :span="8">
                    {{ data.carDetailDto.engineNumber}}
                  </goods-row>
                  <goods-row label="车辆注册日期" :span="8">
                    {{ data.carDetailDto.createDate|date}}
                  </goods-row>
                  <goods-row label="检验有效期" :span="8">
                    {{ data.carDetailDto.checkValidityDate|date}}
                  </goods-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style="font-size: 16px;">
                  [ 保险信息 ]
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <goods-row label="保险公司" :span="8">
                    {{ data.carDetailDto.insuranceCompany}}
                  </goods-row>
                  <goods-row label="交强险保单号" :span="8">
                    {{ data.carDetailDto.ctaliNumber}}
                  </goods-row>
                  <goods-row label="交强险截止日期" :span="8">
                    {{ data.carDetailDto.ctaliEndDate|date}}
                  </goods-row>
                </el-col>
                <el-col :span="12">
                  <goods-row label="第三责任险截止日期" :span="8">
                    {{ data.carDetailDto.thirdPartyInsuranceEndDate|date}}
                  </goods-row>
                  <goods-row label="第三责任险保单号" :span="8">
                    {{ data.carDetailDto.thirdPartyInsuranceNumber}}
                  </goods-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style="font-size: 16px;">
                  [ 运输黑名单列表 ]
                  <div class="pull-right">
                    <span class="btn-search-toggle open" v-show="showSearch">
                      <single-input v-model="keyTxt" placeholder="请输入关键字搜索"
                                    :showFocus="showSearch"></single-input>
                      <i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>
                    </span>
                    <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
                      <i class="el-icon-t-search"></i>
                    </a>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <div v-if="blacklist.length === 0" class="empty-info" style="padding-left: 20px">
                  暂无信息
                </div>
                <div v-else>
                  <table class="table table-hover">
                    <thead>
                    <tr>
                      <th width="50%">单位名称</th>
                      <th width="30%"></th>
                      <th width="20%">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="row in blacklist">
                      <td width="50%">
                        {{row.orgName}}
                      </td>
                      <td width="30%">
                      </td>
                      <td class="list-op" width="20%">
                        <perm label="car-blacklist-delete">
                          <a href="#" @click.stop.prevent="deleteOrg(row)"><i class="el-icon-t-delete"></i>删除</a>
                        </perm>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  <div class="text-center" v-show="blacklist.length">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page="orgPager.currentPage"
                                   :page-sizes="[20,50,100]" :page-size="20"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="orgPager.count">
                    </el-pagination>
                  </div>
                </div>
              </el-row>
            </div>
          </div>
        </div>
        </el-scrollbar>
      </div>
    </div>
    <page-right :show="showIndex === 0" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <component :is="currentPart" :action="action" :formItem="form" @right-close="resetRightBox" @change="onSubmit"/>
    </page-right>
    <page-right :show="showOrgIndex === 0" @right-close="resetRightBox" :css="{'width':'1100px','padding':0}">
      <component :is="currentOrgPart" :action="action" :formItem="form" @right-close="resetRightBox"
                 @change="getBlackList(currentItem.carDto.id,1)"/>
    </page-right>
  </div>

</template>
<script>
  import {CarArchives, TransportBlacklist} from '@/resources';
  import editForm from './form/form.vue';
  import blackForm from './form/blacklist';
  import goodsRow from './goods.row';
  import Perm from '../../common/perm';

  export default {
    components: {
      Perm,
      editForm, goodsRow
    },
    data: function () {
      return {
        orgPager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        showSearch: false,
        showIndex: -1,
        showOrgIndex: -1,
        currentPart: null,
        currentOrgPart: null,
        dialogComponents: {
          0: editForm
        },
        dialogOrgComponents: {
          0: blackForm
        },
        showTypeRight: false,
        showTypeSearch: false,
        currentItem: 0,
        data: {
          carDto: {
            id: '',
            plateNumber: '',
            ascriptionCompany: '',
            defaultDriver: '',
            loadBearing: '',
            volume: '',
            authorizedNumber: '',
            type: '',
            carriageLength: '',
            carriageWidth: '',
            carriageHeight: ''
          },
          carDetailDto: {
            id: '',
            brand: '',
            engineNumber: '',
            identificationNumber: '',
            createDate: '',
            issuingDate: '',
            checkValidityDate: '',
            forciblyDiscardedDay: '',
            insuranceCompany: '',
            ctaliNumber: '',
            ctaliEndDate: '',
            thirdPartyInsuranceNumber: '',
            thirdPartyInsuranceEndDate: ''
          }
        },
        typeList: [],
        showTypeList: [],
        typeTxt: '',
        keyTxt: '',
        form: {},
        action: '',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        blacklist: [],
        activeStatus: 0,
        doing: false
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return (height - 70) + 'px';
      }
    },
    filters: {
      formatIsUse: function (value) {
        return value === 1 ? '是' : '否';
      }
    },
    mounted() {
      this.$emit('loaded');
      this.getPageList(1);
    },
    watch: {
      'typeTxt': function () {
        this.getPageList(1);
      },
      'keyTxt': function () {
        this.getBlackList(this.currentItem.carDto.id, 1);
      },
      filters: {
        handler: function () {
          this.getPageList(1);
        },
        deep: true
      },
      'currentItem': function (val) {
        if (val) {
          this.getBlackList(val.carDto.id, 1);
        }
      }
    },
    methods: {
      batchDeleteBlacklist: function (item) {
        this.$confirm('确认一键删除车辆' + this.currentItem.carDto.plateNumber + '的运输黑名单?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.commit('initPrint', {
            isPrinting: true,
            text: '删除运输黑名单中',
            moduleId: '/baseInfo/car-archives'
          });
          TransportBlacklist.batchDelete(this.currentItem.carDto.id).then(() => {
            this.$store.commit('initPrint', {
              isPrinting: false,
              moduleId: '/baseInfo/car-archives'
            });
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '删除车辆' + this.currentItem.carDto.plateNumber + '的运输黑名单成功'
            });
            this.getBlackList(this.currentItem.carDto.id, this.orgPager.currentPage);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.data.msg || '删除车辆' + this.currentItem.carDto.plateNumber + '的运输黑名单失败'
            });
          });
        }).catch(() => {

        });
      },
      deleteOrg: function (item) {
        this.$confirm('确认删除单位' + item.orgName + '?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          TransportBlacklist.delete(item.id).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '删除单位成功'
            });
            this.getBlackList(item.carId, this.orgPager.currentPage);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.data.msg || '删除单位失败'
            });
          });
        }).catch(() => {

        });
      },
      handleSizeChange(val) {
        this.orgPager.pageSize = val;
        this.getBlackList(this.currentItem.carDto.id, 1);
      },
      handleCurrentChange(val) {
        this.getBlackList(this.currentItem.carDto.id, val);
      },
      formatStatus: function (value) {
        if (!value) return '';
        return value.toString();
      },
      scrollLoadingData(event) {
        this.$scrollLoadingData(event);
      },
      getPageList: function (pageNo, isContinue = false) {
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          keyword: this.typeTxt
        });
        CarArchives.query(param).then(res => {
          this.$store.commit('initBottomLoading', false);
          if (isContinue) {
            this.showTypeList = this.showTypeList.concat(res.data.list);
          } else {
            this.showTypeList = res.data.list;
            this.data = Object.assign({}, {carDto: {plateNumber: ''}, carDetailDto: {}}, res.data.list[0]);
            this.currentItem = this.data;
          }
          this.pager.totalPage = res.data.totalPage;
        });
      },
      getBlackList: function (carId, pageNo) {
        this.orgPager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.orgPager.pageSize,
          keyword: this.keyTxt,
          carId: this.currentItem.carDto.id
        });
        TransportBlacklist.query(param).then(res => {
          this.blacklist = res.data.list;
          this.orgPager.count = res.data.count;
        });
      },
      getMore: function () {
        this.getPageList(this.pager.currentPage + 1, true);
      },
      resetRightBox: function () {
        this.showIndex = -1;
        this.showOrgIndex = -1;
      },
      showPart: function () {
        this.action = 'add';
        this.form = {
          carDto: {
            id: '',
            plateNumber: '',
            ascriptionCompany: '',
            defaultDriver: '',
            loadBearing: '',
            volume: '',
            authorizedNumber: '',
            type: '',
            carriageLength: '',
            carriageWidth: '',
            carriageHeight: ''
          },
          carDetailDto: {
            id: '',
            brand: '',
            engineNumber: '',
            identificationNumber: '',
            createDate: '',
            issuingDate: '',
            checkValidityDate: '',
            forciblyDiscardedDay: '',
            insuranceCompany: '',
            ctaliNumber: '',
            ctaliEndDate: '',
            thirdPartyInsuranceNumber: '',
            thirdPartyInsuranceEndDate: ''
          }
        };
        this.showIndex = 0;
        this.currentPart = this.dialogComponents[0];
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      edit: function () {
        this.action = 'edit';
        this.showIndex = 0;
        this.currentPart = this.dialogComponents[0];
        this.$nextTick(() => {
          this.form = JSON.parse(JSON.stringify(this.data));
        });
      },
      addBlacklist: function () {
        this.showOrgIndex = 0;
        this.action = 'add';
        this.currentOrgPart = this.dialogOrgComponents[0];
        this.$nextTick(() => {
          this.form = JSON.parse(JSON.stringify(this.data));
        });
      },
      remove: function () {
        this.$confirm('确认删除车辆档案"' + this.data.carDto.plateNumber + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CarArchives.delete(this.data.carDto.id).then(() => {
            this.getPageList(1);
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功删除车辆档案"' + this.data.carDto.plateNumber + '"'
            });
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '删除车辆档案"' + this.data.carDto.plateNumber + '"失败'
            });
          });
        }).catch(() => {

        });
      },
      removeType: function (item) {
        this.$confirm('确认删除车辆档案"' + item.carDto.plateNumber + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CarArchives.delete(this.data.carDto.id).then(() => {
            this.getPageList(1);
            this.$notify.success({
              title: '成功',
              duration: 2000,
              message: '已成功删除车辆档案"' + item.carDto.plateNumber + '"'
            });
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '删除车辆档案"' + item.carDto.plateNumber + '"失败'
            });
          });
        }).catch(() => {

        });
      },
      showType: function (type) {
        this.data = type;
        this.currentItem = this.data;
      },
      changeType: function (key, item) {// 根据当前选中的标签，重置状态等相关参数。
        this.activeStatus = key;
        this.filters.status = item.status;
      },
      onSubmit: function (item) {
        if (this.action === 'add') {
          this.showTypeList.splice(0, 0, item);
        } else {
          let idList = [];
          this.showTypeList.forEach(val => {
            idList.push(val.carDto.id);
          });
          this.showTypeList.splice(idList.indexOf(this.currentItem.carDto.id), 1, item);
        }
        this.showType(item);
      }

    }
  };
</script>
