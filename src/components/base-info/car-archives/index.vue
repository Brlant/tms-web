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
</style>
<template>
  <div>
    <div class="container d-table">
      <div class="d-table-left">
        <div class="d-table-col-wrap" :style="'height:'+bodyHeight" @scroll="scrollLoadingData">
          <h2 class="header">
            <span class="pull-right">
              <!--<perm label="qualityItem-add">-->
                <a href="#" class="btn-circle" @click.stop.prevent="addType">
                  <i class="el-icon-t-plus"></i>
                </a>
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
          <div v-if="!data.carDto" class="empty-type-info">
            暂无信息
          </div>
          <div v-else>
            <ul class="show-list">
              <li v-for="item in showTypeList" class="list-item" @click="showType(item)"
                  :class="{'active':item.carDto.plateNumber==currentItem.carDto.plateNumber}">
                <!--<perm label="qualityItem-softDelete"><a href="#" class="pull-right hover-show"-->
                <!--@click.prevent="removeType(item)">-->
                <!--<i class="el-icon-t-delete"></i> </a></perm>-->
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
      </div>
      <div class="d-table-right">
        <div class="d-table-col-wrap" :style="'height:'+bodyHeight">
          <div v-if="!data.carDto" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <h2 class="clearfix">
                <span class="pull-right">
                  <el-button-group>
                    <!--<perm label="qualityItem-update">-->
                      <el-button @click="edit()">
                        <i class="el-icon-t-edit"></i>
                        编辑
                      </el-button>
                    </el-button-group>
                </span>
            </h2>
            <div class="page-main-body min-row">
              <el-row>
                <el-col :span="4" class="text-right" style="font-size: 12px">
                  [ 基础信息 ]
                </el-col>
                <el-col :span="12" class="text-right" style="font-size: 12px">
                  [ 详细信息 ]
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <goods-row label="车牌号" :span="8">
                    {{ data.carDto.plateNumber}}
                  </goods-row>
                  <goods-row label="车辆归属公司" :span="8">
                    {{ data.carDto.ascriptionCompany}}
                  </goods-row>
                  <goods-row label="车辆默认司机" :span="8">
                    {{ data.carDto.defaultDriver}}
                  </goods-row>
                  <goods-row label="车辆核定载人数" :span="8">
                    {{ data.carDto.authorizedNumber}} <span v-if="data.carDto.authorizedNumber">人</span>
                  </goods-row>
                  <goods-row label="车型" :span="8">
                    {{ data.carDto.type}}
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
                  <goods-row label="车辆承重" :span="8">
                    {{ data.carDto.loadBearing}} <span v-if="data.carDto.loadBearing">吨</span>
                  </goods-row>
                </el-col>
                <el-col :span="12">
                  <goods-row label="车辆品牌" :span="8">
                    {{ data.carDetailDto.brand}}
                  </goods-row>
                  <goods-row label="车辆发动机号" :span="8">
                    {{ data.carDetailDto.engineNumber}}
                  </goods-row>
                  <goods-row label="车辆识别代码" :span="8">
                    {{ data.carDetailDto.identificationNumber}}
                  </goods-row>
                  <goods-row label="车辆注册日期" :span="8">
                    {{ data.carDetailDto.createDate|date}}
                  </goods-row>
                  <goods-row label="发证日期" :span="8">
                    {{ data.carDetailDto.issuingDate|date}}
                  </goods-row>
                  <goods-row label="检验有效期" :span="8">
                    {{ data.carDetailDto.checkValidityDate|date}}
                  </goods-row>
                  <goods-row label="强制报废日" :span="8">
                    {{ data.carDetailDto.forciblyDiscardedDay|date}}
                  </goods-row>
                  <goods-row label="保险公司" :span="8">
                    {{ data.carDetailDto.insuranceCompany}}
                  </goods-row>
                  <goods-row label="交强险保单号" :span="8">
                    {{ data.carDetailDto.ctaliNumber}}
                  </goods-row>
                  <goods-row label="交强险截止日期" :span="8">
                    {{ data.carDetailDto.ctaliEndDate|date}}
                  </goods-row>
                  <goods-row label="第三责任险保单号" :span="8">
                    {{ data.carDetailDto.thirdPartyInsuranceNumber}}
                  </goods-row>
                  <goods-row label="第三责任险截止日期" :span="8">
                    {{ data.carDetailDto.thirdPartyInsuranceEndDate|date}}
                  </goods-row>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox">
      <edit-form :formItem="form" @change="onSubmit" :action="action" :actionType="showRight"
                 :css="{'width':'1000px','padding':0}"
                 @right-close="resetRightBox"></edit-form>
    </page-right>
  </div>

</template>
<script>
  import {CarArchives} from '../../../resources';
  import editForm from './form/form.vue';
  import goodsRow from './goods.row';

  export default {
    components: {
      editForm, goodsRow
    },
    data: function () {
      return {
        showRight: false,
        showTypeRight: false,
        showTypeSearch: false,
        currentItem: 0,
        showSearch: false,
        data: {},
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
        orgType: {
          //          0: {'title': '所有', 'num': '', 'status': null},
          0: {'title': '正常', 'num': '', 'status': 1},
          1: {'title': '停用', 'num': '', 'status': 0}
        },
        activeStatus: 0,
        filters: {
          status: 1
        },
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
      filters: {
        handler: function () {
          this.getPageList(1);
        },
        deep: true
      }
    },
    methods: {
      scrollLoadingData(event) {
        this.$scrollLoadingData(event);
      },
      getPageList: function (pageNo, isContinue = false) {
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          keyword: this.typeTxt
        }, this.filters);
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
      getMore: function () {
        this.getPageList(this.pager.currentPage + 1, true);
      },
      resetRightBox: function () {
        this.showRight = false;
      },
      addType: function () {
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
        this.showRight = true;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      edit: function () {
        this.action = 'edit';
        this.form = JSON.parse(JSON.stringify(this.data));
        this.showRight = true;
      },
      remove: function () {
        this.$confirm('确认删除车辆档案"' + this.data.name + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CarArchives.delete(this.data.id).then(() => {
            this.getPageList(1);
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功删除车辆档案"' + this.data.name + '"'
            });
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '删除车辆档案"' + this.data.name + '"失败'
            });
          });
        }).catch(() => {

        });
      },
      removeType: function (item) {
        this.$confirm('确认删除车辆档案"' + item.name + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CarArchives.delete(this.data.id).then(() => {
            this.getPageList(1);
            this.$notify.success({
              title: '成功',
              duration: 2000,
              message: '已成功删除车辆档案"' + item.name + '"'
            });
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '删除车辆档案"' + item.name + '"失败'
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
            idList.push(val.id);
          });
          this.showTypeList.splice(idList.indexOf(this.currentItem.id), 1, item);
        }
        this.showType(item);
      }

    }
  };
</script>
