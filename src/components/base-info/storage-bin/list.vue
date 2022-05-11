<style lang="scss" scoped>
.el-form .el-select {
  display: block;
}

.el-button i {
  font-size: 14px;
  color: #767676;
}

.icon20 {
  font-size: 20px !important;
  color: #767676;
}

.storeName {
  width: 150px;
  height: inherit;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.storeStatus {
  position: relative;
  margin: 0 20px;
}
</style>
<template>
  <div id="store">
    <div class="opera-btn-group">
      <div class="opera-icon">
        <el-col :span="2">
          <h2 class="header f-dib">
            仓库信息
          </h2>
        </el-col>
        <el-col :span="22" class="text-right">
          <el-button icon="el-icon-edit-outline" @click="openEditStorePage">
            编辑仓库
          </el-button>
          <el-button icon="el-icon-plus" @click="openAddStoreAreaPagePage">
            新增仓库
          </el-button>
        </el-col>
      </div>
    </div>
    <div class="d-table">
      <div class="d-table-left">
        <div class="empty-info" v-show="!storeList.length">暂无信息</div>
        <div style="padding-left: 10px">
          <el-collapse v-model="storeIndex" accordion>
            <el-collapse-item v-for="(store,index) in storeList" :name="index" :key="index">
              <template slot="title">
                <el-button type="text" @click.stop="openAddStoreAreaPage(store)" title="新增库区">
                  <i class="el-icon-circle-plus-outline icon20"></i>
                </el-button>
                <div class="storeName" :title="store.storeName">{{ store.storeName }}</div>
                <template v-if="store.deleteFlag == '0'">
                  <el-tag type="success" class="storeStatus">正常</el-tag>
                </template>
                <template v-else-if="store.deleteFlag == '1'">
                  <el-tag type="danger" class="storeStatus">禁用</el-tag>
                </template>
              </template>
              <ul class="show-list">
                <li v-for="(area,areaIndex) in store.areaList" :key="areaIndex" class="list-item"
                    @click="areaClick(areaIndex)">
                  {{ area.storeName }}
                  <template v-if="area.deleteFlag == '0'">
                    <el-tag type="success" class="pull-right ml-10">正常</el-tag>
                  </template>
                  <template v-else-if="area.deleteFlag == '1'">
                    <el-tag type="danger" class="pull-right ml-10">禁用</el-tag>
                  </template>
                  <template v-if="area.storeType == 'A'">
                    <el-tag type="success" class="pull-right ml-10">整件</el-tag>
                  </template>
                  <template v-else-if="area.storeType == 'B'">
                    <el-tag type="danger" class="pull-right ml-10">散件</el-tag>
                  </template>
                  <template v-else>
                    <el-tag type="danger" class="pull-right ml-10">不合格</el-tag>
                  </template>
                </li>
              </ul>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="btn-left-list-more">
          <bottom-loading></bottom-loading>
          <div @click.stop="getStoreMore" v-show="!$store.state.bottomLoading">
            <el-button v-show="showStoreMore">加载更多</el-button>
          </div>
        </div>
      </div>
      <div class="d-table-right">
        <div class="form-header-part">
          <el-descriptions v-show="areaItem.storeId" style="height: 175px">
            <template slot="title">
              <div class="header">
                <div class="sign f-dib"></div>
                <h3 class="ml-10">库区信息</h3>
              </div>
            </template>
            <template slot="extra" v-show="areaItem.storeId">
              <el-button type="text" @click="openEditStoreAreaPage" title="编辑库区">
                <i class="el-icon-edit-outline icon20"></i>
              </el-button>
            </template>
            <template>
              <el-descriptions-item label="库区代码">{{ areaItem.storeCode }}</el-descriptions-item>
              <el-descriptions-item label="库区名称">{{ areaItem.storeName }}</el-descriptions-item>
              <el-descriptions-item label="库区类型">
                <template v-if="areaItem.storeType == 'A'">
                  <el-tag type="success" class="pull-right ml-10">整件</el-tag>
                </template>
                <template v-else-if="areaItem.storeType == 'B'">
                  <el-tag type="danger" class="pull-right ml-10">散件</el-tag>
                </template>
                <template v-else>
                  <el-tag type="danger" class="pull-right ml-10">不合格</el-tag>
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="温度范围">
                {{`${areaItem.temperatureLowerLimit} ~ ${areaItem.temperatureUpperLimit}°C`}}
              </el-descriptions-item>
              <el-descriptions-item label="湿度范围">
                {{`${areaItem.humidityLowerLimit}% ~ ${areaItem.humidityUpperLimit}%`}}
              </el-descriptions-item>
            </template>

          </el-descriptions>
          <div v-show="!areaItem.storeId">
            <div class="el-descriptions__header">
              <div class="el-descriptions__title">
                <div class="header">
                  <div class="sign f-dib"></div>
                  <h3 class="ml-10">库位信息</h3>
                </div>
              </div>
            </div>
            <div class="empty-type-info" style="height: 0;padding-top: 105px">暂无库区信息</div>
          </div>
        </div>

        <div class="mb-15"></div>
        <div class="form-header-part">
          <div class="el-descriptions__header">
            <div class="el-descriptions__title">
              <div class="header">
                <div class="sign f-dib"></div>
                <h3 class="ml-10">库位信息</h3>
              </div>
            </div>
          </div>
          <div class="content">
            <el-table class="border-black" :data="positionList" border style="width: 100%">
              <!--              <el-table-column type="index" label="序号" width="50"/>-->
              <el-table-column prop="storeCode" label="库位编号"/>
              <el-table-column label="规格（长*宽*高）">
                <template v-slot="{row}">
                  {{`${row.storeLength|| 0} * ${row.storeWidth|| 0} * ${row.storeHeight|| 0}`}}
                </template>
              </el-table-column>
              <el-table-column prop="batchNumber" label="可存放cm³">
                <template v-slot="{row}">
                  {{row.volume - row.storeUsedSpace}}
                </template>
              </el-table-column>
              <el-table-column prop="specifications" label="存放比（已存/容积）">
                <template v-slot="{row}">
                  {{`${row.storeUsedSpace || 0} / ${row.volume || 0}`}}
                </template>
              </el-table-column>
              <el-table-column label="状态" width="120">
                <template v-slot="{row}">
                  <el-tag type="success" v-if="row.storeStatus == 0">
                    可用
                  </el-tag>
                  <el-tag type="danger" v-else>
                    不可用
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="code" label="操作">
                <template v-slot="{row}">
                  <el-button type="text" v-if="row.deleteFlag == 0">
                    <i class="el-icon-t-forbidden"> 停用</i>
                  </el-button>
                  <el-button type="text" v-else>
                    <i class="el-icon-success"> 启用</i>
                  </el-button>
                  <el-button type="text">
                    <i class="el-icon-edit-outline"> 编辑</i>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="hr mb-10"></div>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'1100px','padding':0}">
      <edit-form :formItem="form" :title="formTitle"
                 :action="action" :actionType="showRight"
                 @close="showRight=false" @change="itemChange"/>
    </page-right>
    <page-right :show="showDepartmentRight" @right-close="resetRightBox">
      <store-form :formItem="departmentForm" :title="formTitle"
                  :action="action" :actionType="showRight"
                  @close="showDepartmentRight=false" @change="StorageBinChange"/>
    </page-right>
  </div>

</template>
<script>
import {StorageBin} from '@/resources';
import editForm from './form/form.vue';
import StoreForm from './form/StoreForm.vue';
import bgBox from '../../common/bgbox.vue';

export default {
  components: {
    editForm, bgBox, StoreForm
  },
  data() {
    return {
      showRight: false,
      showDepartmentRight: false,
      form: {},
      departmentForm: {},
      formTitle: '',
      action: 'add',
      span: 10,

      // 以下是重点
      storeParams: {
        pageNo: 1,
        pageSize: 10,
        storeLevel: 0,
      },
      areaParams: {
        pageNo: 1,
        pageSize: 100,
        storeParent: '',
        storeLevel: 1,
      },
      positionParams: {
        pageNo: 1,
        pageSize: 100,
        storeParent: '',
        storeLevel: 2
      },
      storeIndex: 0,
      areaIndex: 0,
      storeList: [],//仓库列表
      positionList: [],//仓位列表
      areaItem: {},
      positionItem: {},
      showStoreMore: false,//仓库列表显示加载更多
    };
  },
  computed: {
    bodyHeight() {
      let height = parseInt(this.$store.state.bodyHeight, 10);
      height = (height - 30) + 'px';
      return height;
    },
  },
  watch: {
    storeIndex(newIndex) {
      this.getStoreAreaList();
    }
  },
  methods: {
    // 获取仓库列表
    getStoreList(isContinue = false) {
      StorageBin.query(this.storeParams).then(res => {
        this.$store.commit('initBottomLoading', false);

        let {list, totalPage} = res.data;
        if (list.length === 0) {
          return;
        }

        list = list.map(item => {
          item.areaList = [];
          item.isLoadData = false;
          return item;
        });

        const storeIndex = this.storeList.length;
        this.showStoreMore = this.storeParams.pageNo < totalPage;
        if (isContinue) {
          this.storeList = this.storeList.concat(list);
        } else {
          this.storeList = list;
        }

        // 获取仓库下的库区
        this.storeIndex = storeIndex;
        this.getStoreAreaList();
      });
    },
    //获取库区列表
    getStoreAreaList(pageNo = 1, isContinue = false) {
      const {storeId, isLoadData} = this.storeList[this.storeIndex];
      if (isLoadData && this.areaItem.storeId) {
        return;
      }

      this.areaParams.pageNo = pageNo;
      // 把仓库的id作为查询库区的父节点id
      this.areaParams.storeParent = storeId;

      StorageBin.query(this.areaParams).then(res => {
        const {list, count, totalPage} = res.data;
        if (list.length === 0) {
          // 库区信息清空
          this.areaItem = {};
          return;
        }

        const areaIndex = this.storeList[this.storeIndex].areaList.length;
        if (isContinue) {
          this.storeList[this.storeIndex].areaList = this.areaList.concat(list);
        } else {
          this.storeList[this.storeIndex].areaList = list;
        }

        this.storeList[this.storeIndex].isLoadData = true;
        this.areaItem = list[0];
        if (areaIndex === 0) {
          // 只有第一次的时候调用
          this.areaIndex = areaIndex;
          this.getStorePositionList(1);
        }

        // 判断是否加载完，没有的话继续请求
        const hasMore = this.storeParams.pageNo < totalPage;
        if (hasMore) {
          pageNo++;
          this.getStoreAreaList(pageNo, true);
        }
      });
    },
    //获取库位列表
    getStorePositionList(pageNo = 1, isContinue = false) {
      const {storeId, loadPageNo} = this.storeList[this.storeIndex].areaList[this.areaIndex];
      if (pageNo == loadPageNo) {
        this.positionList = this.storeList[this.storeIndex].areaList[this.areaIndex].positionList;
      }

      this.positionParams.pageNo = pageNo;
      // 把仓库的id作为查询库区的父节点id
      this.positionParams.storeParent = storeId;

      StorageBin.query(this.positionParams).then(res => {
        this.$store.commit('initBottomLoading', false);

        const {list, count, totalPage} = res.data;
        if (list.length === 0) {
          return;
        }

        this.positionParams.totalCount = count;
        this.positionParams.totalPage = totalPage;
        if (isContinue) {
          this.storeList[this.storeIndex].areaList[this.areaIndex].positionList = this.storeList[this.storeIndex].areaList[this.areaIndex].positionList.concat(list);
        } else {
          this.storeList[this.storeIndex].areaList[this.areaIndex].positionList = list;
        }

        this.storeList[this.storeIndex].areaList[this.areaIndex].loadPageNo = pageNo;
        this.positionList = list;
      });
    },
    StorageBinChange() {
      this.getStoreList(1);
      this.showDepartmentRight = false;
    },
    itemChange() {
      this.showRight = false;
    },
    openAddStoreAreaPage(item) {
      this.$message('你点击了新增库区:' + JSON.stringify(item));
    },
    openEditStoreAreaPage(item) {
      this.$message('你点击了编辑库区:' + JSON.stringify(item));
    },
    openAddStoreAreaPagePage() {
      this.action = 'add';
      this.departmentForm = {};
      this.formTitle = '新增';
      this.showDepartmentRight = true;
    },
    openEditStorePage(item) {
      this.action = 'edit';
      this.departmentForm = Object.assign({}, item);
      this.formTitle = '编辑';
      this.showDepartmentRight = true;
    },
    getStoreMore() {
      this.storeParams.pageNo++;
      this.getStoreList(true);
    },
    scrollLoadingData(event) {
      this.$scrollLoadingData(event);
    },
    resetRightBox() {
      this.showRight = false;
      this.showDepartmentRight = false;
    },
    areaClick(index) {
      this.areaIndex = index;
    }
  },
  mounted() {
    this.getStoreList(1);
  },

};
</script>
