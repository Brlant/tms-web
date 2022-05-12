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


.area ::v-deep .el-descriptions__body {
  padding-left: 40px;
}

.overflow {
  width: 180px;
  margin-right: 20px;
  line-height: 40px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.list-li {
  cursor: pointer;
  padding: 0 20px;
  line-height: 40px;

  .hover-show {
    display: none

  }

  &.active, &:hover {
    background: #f5f5f5;
  }

  &.active {
    .hover-show {
      display: block;

      a:hover {
        color: #00bff3
      }
    }

    a.hover-show:hover {
      color: #00bff3
    }
  }
}

.tag {
  margin-right: 15px;
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
          <el-button icon="el-icon-plus" @click="openAddStorePage">
            新增仓库
          </el-button>
        </el-col>
      </div>
    </div>
    <div class="d-table">
      <div class="d-table-left">
        <div class="empty-info" v-show="!storeList.length">暂无信息</div>
        <div style="padding-left: 10px">
          <el-collapse v-model="activeName" accordion style="width: 350px">
            <el-collapse-item v-for="(store,index) in storeList" :name="index" :key="index">
              <template slot="title">
                <el-button type="text" @click.stop="openAddAreaPage(store)" title="新增库区">
                  <i class="el-icon-circle-plus-outline icon20"></i>
                </el-button>
                <div class="overflow" :title="store.storeName">{{ store.storeName }}</div>
                <template v-if="store.deleteFlag == '0'">
                  <el-tag type="success" class="tag">正常</el-tag>
                </template>
                <template v-else-if="store.deleteFlag == '1'">
                  <el-tag type="danger" class="tag">禁用</el-tag>
                </template>
              </template>
              <ul class="show-list">
                <li v-for="(area,areaIndex) in store.areaList" :key="areaIndex" class="list-li"
                    @click="areaClick(areaIndex)">
                  <div style="display: inline-flex;align-items: center;">
                    <span class="overflow" :title="area.storeName">{{ area.storeName }}</span>
                    <template v-if="area.deleteFlag == '0'">
                      <el-tag type="success" class="tag">正常</el-tag>
                    </template>
                    <template v-else-if="area.deleteFlag == '1'">
                      <el-tag type="danger" class="tag">禁用</el-tag>
                    </template>
                    <template v-if="area.storeType == 'A'">
                      <el-tag type="success" class="tag">整件</el-tag>
                    </template>
                    <template v-else-if="area.storeType == 'B'">
                      <el-tag type="warning" class="tag">散件</el-tag>
                    </template>
                    <template v-else>
                      <el-tag type="danger" class="tag">不合格</el-tag>
                    </template>
                  </div>

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
        <div class="form-header-part area">
          <el-descriptions :colon="!!areaItem.storeId" style="height: 175px">
            <template slot="title">
              <div class="header">
                <div class="sign f-dib"></div>
                <h3 class="ml-10">库区信息</h3>
              </div>
            </template>
            <template slot="extra" v-show="areaItem.storeId">
              <el-button type="text" @click="openEditAreaPage" title="编辑库区">
                <i class="el-icon-edit-outline icon20"></i>
              </el-button>
            </template>
            <template v-if="areaItem.storeId">
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
                {{ `${areaItem.temperatureLowerLimit} ~ ${areaItem.temperatureUpperLimit}°C` }}
              </el-descriptions-item>
              <el-descriptions-item label="湿度范围">
                {{ `${areaItem.humidityLowerLimit}% ~ ${areaItem.humidityUpperLimit}%` }}
              </el-descriptions-item>
            </template>
            <template v-else>
              <el-descriptions-item style="display: inline-flex">
                <div class="empty-type-info" style="height: 0;padding-top: 105px">暂无库区信息</div>
              </el-descriptions-item>
            </template>
          </el-descriptions>
        </div>

        <div class="mb-15"></div>
        <div class="form-header-part">
          <el-descriptions :colon="false">
            <template slot="title">
              <div class="header">
                <div class="sign f-dib"></div>
                <h3 class="ml-10">库位信息</h3>
              </div>
            </template>
            <template slot="extra">
              <el-button-group style="margin-right: 40px">
                <el-input v-model="positionParams.keyWord" placeholder="请输入关键字搜索" @keyup.enter.native="getStorePositionList(1)">
                  <a href="javascript:void(0)" slot="suffix" class="el-icon-t-search el-input__icon"
                     @click.stop="getStorePositionList(1)" title="点击搜索"></a>
                </el-input>
              </el-button-group>
              <el-button-group>
                <el-button @click="openAddPositionPage">
                  新增
                </el-button>
                <el-button @click="batchUpdateStatus(0)">
                  批量停用
                </el-button>
                <el-button @click="batchUpdateStatus(1)">
                  批量启用
                </el-button>
                <el-button @click="exportExcel">
                  导出Excel
                </el-button>
              </el-button-group>
            </template>
            <template>
              <el-descriptions-item>

              </el-descriptions-item>
            </template>

          </el-descriptions>
          <el-table :data="positionList" border @selection-change="handleSelectionChange">>
            <!--              <el-table-column type="index" label="序号" width="50"/>-->
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column prop="storeCode" label="库位编号"/>
            <el-table-column label="规格（长*宽*高）">
              <template v-slot="{row}">
                {{ `${row.storeLength || 0} * ${row.storeWidth || 0} * ${row.storeHeight || 0}` }}
              </template>
            </el-table-column>
            <el-table-column prop="batchNumber" label="可存放cm³">
              <template v-slot="{row}">
                {{ row.volume - row.storeUsedSpace }}
              </template>
            </el-table-column>
            <el-table-column prop="specifications" label="存放数（已存/容积）">
              <template v-slot="{row}">
                {{ `${row.storeUsedSpace || 0} / ${row.volume || 0}` }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="120">
              <template v-slot="{row}">
                <el-tag type="danger" v-if="row.deleteFlag">
                  不可用
                </el-tag>
                <el-tag type="success" v-else>
                  可用
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="code" label="操作">
              <template v-slot="{row}">
                <el-button type="text" v-if="!row.deleteFlag" @click="updateStatus(row,0)">
                  <i class="el-icon-t-forbidden"> 停用</i>
                </el-button>
                <el-button type="text" v-else @click="updateStatus(row,1)">
                  <i class="el-icon-success"> 启用</i>
                </el-button>
                <el-button type="text" @click="openEditPositionPage(row)">
                  <i class="el-icon-edit-outline"> 编辑</i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="text-center" v-show="positionList.length">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="positionParams.pageNo"
                           :page-sizes="[10,20,50,100]"
                           :page-size="positionParams.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="positionParams.count">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>

    <page-right :show="showRight" @right-close="closeForms">
      <store-form
        v-show="showStoreForm"
        :action="formAction"
        :title="formTitle"
        :form="formData"
        @cancel="closeForms"
        @storeUpdate="storeUpdateHandle"/>

      <store-area-form
        v-show="showAreaForm"
        :action="formAction"
        :title="formTitle"
        :form="formData"
        @cancel="closeForms"
        @storeAreaUpdate="storeAreaUpdateHandle"/>
      <store-position-form
        v-show="showPositionForm"
        :action="formAction"
        :title="formTitle"
        :form="formData"
        @cancel="closeForms"
        @storePositionUpdate="storePositionUpdateHandle"/>
    </page-right>
  </div>

</template>
<script>
import {StorageBin} from '@/resources';
import StoreForm from './form/StoreForm.vue';
import StoreAreaForm from './form/StoreAreaForm.vue';
import StorePositionForm from './form/StorePositionForm.vue';

import utils from '@/tools/utils';

export default {
  components: {
    StoreForm, StoreAreaForm, StorePositionForm
  },
  data() {
    return {
      span: 10,
      // 控制右侧显示
      showRight: false,
      showStoreForm: false,
      showAreaForm: false,
      showPositionForm: false,
      // form相关参数
      formAction: '',
      formTitle: '',
      formData: {},
      // 查询参数
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
        pageSize: 10,
        storeParent: '',
        storeLevel: 2,
        count: 0,
      },
      // 活动面板名称,实际存的是仓库的下标
      activeName: 0,
      // 当前仓库的下标
      storeIndex: 0,
      // 当前仓库下已打开的库区的下标
      areaIndex: 0,
      // 当前编辑的库位的下标
      positionIndex: 0,
      // 仓库列表
      storeList: [],
      // 仓位列表
      positionList: [],
      // 已打开的库区信息
      areaItem: {},
      // 仓库列表显示加载更多
      showStoreMore: false,
      doing: false,
      checkedRows: [],
    };
  },
  computed: {},
  watch: {
    // 监听折叠面板的变化
    activeName(val) {
      if (val === '') {
        // 关闭的情况下不做操作
        return;
      }

      this.storeIndex = val;
      // 仓库切换时,需要懒加载仓库下的所有库区,获取库区的方法会判断是不是最后一页的数据,不是的话会递归调用,直到所有库区都加载完毕
      this.getStoreAreaList();
    },
    areaIndex(val) {
      this.areaItem = this.storeList[this.storeIndex].areaList[val];
    }
  },
  methods: {
    // 获取仓库列表
    getStoreList(isContinue = false) {
      if (this.doing) {
        return;
      }

      this.doing = true;
      StorageBin.query(this.storeParams).then(res => {
        this.doing = false;
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


        this.showStoreMore = this.storeParams.pageNo < totalPage;
        if (isContinue) {
          this.storeList = this.storeList.concat(list);
        } else {
          this.storeList = list;
        }

        // 获取仓库下的库区
        this.getStoreAreaList();
      }).catch(({res}) => {
        console.log(res);
        this.doing = false;
      });
    },
    //获取库区列表
    getStoreAreaList(pageNo = 1, isContinue = false) {
      if (this.doing) {
        return;
      }

      const {storeId, storeCode, storeName, isLoadData, areaList} = this.storeList[this.storeIndex];
      if (isLoadData) {
        if (areaList.length == 0) {
          this.areaItem = {};
          this.positionList = [];
          return
        }

        if (pageNo == 1) {
          this.areaItem = areaList[this.areaIndex];
          this.getStorePositionList(1);
          return;
        }
      }

      this.areaParams.pageNo = pageNo;
      // 把仓库的id作为查询库区的父节点id
      this.areaParams.storeParent = storeId;

      this.doing = true;
      StorageBin.query(this.areaParams).then(res => {
        this.doing = false;
        let {list, count, totalPage} = res.data;
        if (list.length === 0) {
          // 库区信息清空
          this.areaItem = {};
          return;
        }

        list = list.map(item => {
          item.storeParent = storeId;
          item.highestCode = storeCode;
          item.highestName = storeName;
          return item;
        });

        this.storeList[this.storeIndex].isLoadData = true;
        if (isContinue) {
          this.storeList[this.storeIndex].areaList = this.areaList.concat(list);
        } else {
          this.storeList[this.storeIndex].areaList = list;
          // 只有第一次的时候调用
          this.areaIndex = 0;
          this.areaItem = list[0];
          this.getStorePositionList(1);
        }

        // 判断是否加载完，没有的话继续请求
        const hasMore = this.storeParams.pageNo < totalPage;
        if (hasMore) {
          pageNo++;
          this.getStoreAreaList(pageNo, true);
        }
      }).catch(({res}) => {
        console.log(res);
        this.doing = false;
      });
    },
    //获取库位列表
    getStorePositionList(pageNo = 1,search=false) {
      if (this.doing) {
        return;
      }

      const {storeId} = this.areaItem;

      this.positionParams.pageNo = pageNo;
      // 把仓库的id作为查询库区的父节点id
      this.positionParams.storeParent = storeId;

      this.doing = true;
      StorageBin.query(this.positionParams).then(res => {
        const {list, count, totalPage} = res.data;
        this.positionParams.count = count;
        this.positionList = list;
      }).catch(({res}) => {
        console.log(res);

      }).finally(()=>{
        this.doing = false;
      });
    },
    openAddStorePage() {
      // 新增仓库时,表单数据需要清空
      this.formData = {};
      this.formAction = 'add';
      this.formTitle = '新增仓库';
      this.showRight = true;
      this.showStoreForm = true;
    },
    openEditStorePage() {
      // 编辑时取当前仓库的数据
      this.formData = this.storeList[this.storeIndex];
      this.formAction = 'edit';
      this.formTitle = '编辑仓库';
      this.showRight = true;
      this.showStoreForm = true;
    },
    openAddAreaPage(store) {
      // 新增库区需要把仓库的代码和名称带上
      this.formData = {
        storeParent: store.storeId,
        highestCode: store.storeCode,
        highestName: store.storeName,
      };

      this.formAction = 'add';
      this.formTitle = '新增库区信息';
      this.showRight = true;
      this.showAreaForm = true;
    },
    openEditAreaPage(store) {
      // 编辑库区也需要需要把仓库的代码和名称带上
      this.formData = this.areaItem;
      this.formAction = 'edit';
      this.formTitle = '编辑库区信息';
      this.showRight = true;
      this.showAreaForm = true;
    },
    openAddPositionPage() {
      // 新增库区需要把仓库的代码和名称带上
      this.formData = {
        storeType: this.areaItem.storeType,
        storeParent: this.areaItem.storeId,
        parentCode: this.areaItem.storeCode,
        parentName: this.areaItem.storeName,
        highestCode: this.areaItem.highestCode,
        highestName: this.areaItem.highestName,
      };

      this.formAction = 'add';
      this.formTitle = '新增库位信息';
      this.showRight = true;
      this.showPositionForm = true;
    },
    openEditPositionPage(storePosition) {
      // 编辑库区也需要需要把仓库的代码和名称带上
      this.formData = Object.assign({}, storePosition, {
        storeType: this.areaItem.storeType,
        storeParent: this.areaItem.storeId,
        parentCode: this.areaItem.storeCode,
        parentName: this.areaItem.storeName,
        highestCode: this.areaItem.highestCode,
        highestName: this.areaItem.highestName,
      });

      this.formAction = 'edit';
      this.formTitle = '编辑库位信息';
      this.showRight = true;
      this.showPositionForm = true;
    },
    // 仓库更新处理
    storeUpdateHandle(item, updated) {
      this.closeForms();
      // console.log(`storeUpdateHandle:`, item);

      if (updated) {
        // 如果仓库已经更新,那么不需要再次请求,刷新数据就好
        let store = this.storeList[this.storeIndex];
        this.storeList[this.storeIndex] = Object.assign(store, item);
        return;
      }

      // 如果是新增仓库成功,那么把新增的追加到storeList
      item.areaList = [];
      item.isLoadData = false;
      this.storeList.push(item);
    },
    // 库区更新处理
    storeAreaUpdateHandle(item, updated) {
      this.closeForms();
      // console.log(`storeAreaUpdateHandle:`, item);

      if (updated) {
        // 如果已经更新,那么不需要再次请求,刷新数据就好
        this.storeList[this.storeIndex].areaList[this.areaIndex] = Object.assign(this.areaItem, item);
        return;
      }

      // 如果是新增库区,需要追加到对应的仓库下面
      this.storeList[this.storeIndex].areaList.push(item);
    },
    // 库位更新处理
    storePositionUpdateHandle(item, updated) {
      this.closeForms();
      // console.log(`storePositionUpdateHandle:`, item);

      if (updated) {
        // 如果已经更新,那么不需要再次请求,刷新数据就好
        let store = this.positionList[this.positionIndex];
        this.positionList[this.positionIndex] = Object.assign(store, item);
        return;
      }

      // 如果是新增库区,需要追加到对应的仓库下面
      this.positionList.push(item);
      // 新增完总量加1
      this.positionParams.count++;
    },
    getStoreMore() {
      this.storeParams.pageNo++;
      this.getStoreList(true);
    },
    scrollLoadingData(event) {
      this.$scrollLoadingData(event);
    },
    closeForms() {
      this.showRight = false;
      this.showStoreForm = false;
      this.showAreaForm = false;
      this.showPositionForm = false;
    },
    areaClick(index) {
      this.areaIndex = index;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    // 分页处理
    handleSizeChange(val) {
      this.positionParams.pageSize = val;
      this.getStorePositionList(1);
    },
    handleCurrentChange(val) {
      this.getStorePositionList(val);
    },
    handleSelectionChange(rows) {
      this.checkedRows = rows;
    },
    updateStatus(row, status) {
      const params = [{storeId: row.storeId, deleteFlag: status === 0}];
      const tip = '是否确认' + (status == 1 ? '启用' : '停用');
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        StorageBin.batchUpdateStatus(params)
          .then(res => {
            this.$notify.success(res.msg || '操作成功');
            // 更新后刷新页面
            this.getStorePositionList();
          })
          .catch((error) => {
            const msg = error.response.data.msg;
            this.$notify.error(msg || '操作失败');
          });
      });
    },
    batchUpdateStatus(status) {
      if (this.checkedRows.length == 0) {
        this.$notify.warning('请选择仓位后再操作');
        return;
      }

      const params = this.checkedRows.map(row => {
        return {storeId: row.storeId, deleteFlag: status === 0};
      })

      const tip = '是否确认批量' + (status == 1 ? '启用' : '停用');

      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        StorageBin.batchUpdateStatus(params)
          .then(res => {
            this.$notify.success(res.msg || '操作成功');
            // 更新后刷新页面
            this.getStorePositionList();
          })
          .catch((error) => {
            const msg = error.response.data.msg;
            this.$notify.error(msg || '操作失败');
          });
      });
    },
    // 导出库区下的所有库位信息
    exportExcel() {
      StorageBin.exportExcel({storeId: this.areaItem.storeId})
        .then(res => {
          utils.download(res.data, 'TMS库位信息')
        })
        .catch((error) => {
          const msg = error.response.data.msg;
          this.$notify.error(msg || '导出失败');
        });
    }
  },
  mounted() {
    this.getStoreList();
  }

};
</script>
