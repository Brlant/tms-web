<style lang="scss" scoped>
  $leftWidth: 220px;
  .content-part {
    .content-left {
      width: $leftWidth;
    }
    .content-right {
      > h3 {
        left: $leftWidth;
        z-index: 4;
      }
      left: $leftWidth;
    }
  }

  .store-list {
    display: flex;
    flex-wrap: wrap;
    padding-left: 8px;
    .store-item {
      width: 260px;
      height: 160px;
      margin: 10px;
      padding: 0;
      background: #fff;
      border: 1px solid #eee;
      h3 {
        margin: 0;
        padding: 5px 10px;
        background: #eee;
      }
      .store-body {
        position: relative;
        padding: 10px;
        color: #666;
        font-size: 12px;
        line-height: 20px;
        .store-other-info {
          font-size: 13px;
          padding-top: 10px;
          line-height: 22px;
          input {
            width: 50px;
            height: 24px;
            margin-left: 5px;
            border-radius: 4px;
            border: 1px solid #ccc;
            box-shadow: none;
            outline: none;
          }
        }
        .store-select {
          position: absolute;
          right: -9px;
          bottom: 2px;
          color: #999;
          cursor: pointer;
          &.checked {
            color: #f00
          }
          span {
            font-size: 20px;
          }
        }
      }
    }
  }

  .btn-submit-save {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    text-align: center;
    padding: 15px;
  }

  .product-list {
    padding: 10px;
    .product-item {
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background: #fff;
      text-align: center;
      padding: 15px 0;
      cursor: pointer;
      position: relative;
      .product-status {
        position: absolute;
        right: 3px;
        bottom: 3px;
        color: #0c0;
      }
      .no-bg {
        color: #999;
      }
    }
  }

  .span-title {
    position: relative;

    color: #fff;
    padding: 5px;
    top: -5px;
    right: -10px;
    bottom: -5px;
    width: 18px;
    height: 20px;
    cursor: pointer;
  }

  .lock-title {
    background: #999;
  }

  .deblocking-title {
    background: red;
  }

  .pt5 {
    padding-top: 5px;
  }

  .in-block {
    display: inline-block;
    width: 280px;
    .el-select {
      width: 100%;
    }
  }

  .add-store {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #d9d9d9;
    h2 {
      padding: 0;
    }
  }
</style>


<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">分配货位</h2>

        <div class="btn-submit-save" v-show="status !== '4' ">
          <div style="margin-bottom: 10px">
            <el-button type="primary" @click="newAllot">重新分配货位</el-button>
          </div>
          <div>
            <el-button type="primary" @click="onSubmit()">提交分配方案</el-button>
          </div>
        </div>
        <div class="btn-submit-save" v-show="status === '4' ">
          <perm label="stock-in-putaway">
            <el-button type="primary" @click="onShelf()">上架</el-button>
          </perm>
        </div>
      </div>
      <div class="content-right">
        <h3></h3>
        <el-row>
          <el-col :span="12">
            <oms-row label="订单号" :span="spanNum" class="row-black">{{ info.orderNo }}</oms-row>
            <oms-row label="货品" :span="spanNum" class="row-black">{{ info.goodsName }}</oms-row>
            <oms-row label="生产单位" :span="spanNum" class="row-black">{{ info.factoryName }}</oms-row>
            <oms-row label="生产日期" :span="spanNum" class="row-black">{{ info.productionDate | date }}</oms-row>
            <oms-row label="数量" :span="spanNum" class="row-black">{{ info.count }}</oms-row>
            <oms-row label="创建时间" :span="spanNum" class="row-black">{{ info.createTime | minute }}</oms-row>
            <oms-row label="物流中心" :span="spanNum" class="row-black">{{ centerName }}
            </oms-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="货主" :span="spanNum" class="row-black">{{ info.orgName }}</oms-row>
            <oms-row label="货品规格" :span="spanNum" class="row-black">{{ info.specification }}</oms-row>
            <oms-row label="批号" :span="spanNum" class="row-black">{{ info.batchNumber }}</oms-row>
            <oms-row label="有效期" :span="spanNum" class="row-black">{{ info.expirationDate | date }}</oms-row>
            <oms-row label="是否合格" :span="spanNum" class="row-black">
              {{ info.qualifiedFlag | formatStatus }}
            </oms-row>
            <oms-row label="状态" :span="spanNum" class="row-black">{{ getOrderStatus(info) }}</oms-row>
          </el-col>
        </el-row>

        <h2 v-show="status === '4'">
          <span style="cursor:pointer" @click.prevent="">
              <a href="#"
                 @click.prevent="add"
                 class="btn-circle" v-show="noAllotCount"><i
                class="el-icon-t-plus"></i></a></span>
          <span class="pull-right" v-show="noAllotCount">未分配数量：{{ noAllotCount }}</span>
        </h2>
        <div v-if="loadingData">
          <oms-loading :loading="loadingData"></oms-loading>
        </div>
        <div v-else class="order-list clearfix">
          <el-row class="order-list-header">
            <el-col :span="status === '4' ? 12: 13 ">库位</el-col>
            <el-col :span="7">分配数量</el-col>
            <el-col :span="5" v-show="status === '4'">操作</el-col>
          </el-row>
          <div class="order-list-body flex-list-dom">
            <div v-if="!isEnough && status !== '4'" class="empty-info">
              暂无货位信息，请重新分配货位
            </div>
            <div v-else class="order-list-item order-list-item-bg" v-for="item in storeList"
                 :class="[{'active':currentId===item.id}]"
                 @click.prevent="currentId = item.id">
              <el-row>
                <el-col :span="status === '4' ? 12: 13 " class="pt5">
                  <span v-show="!item.isEdited">{{ item.storeName }}</span>
                  <el-select v-if="item.isEdited" placeholder="请输入库位编码搜索库位" :remote-method="filterLocationItem"
                             v-model="item.storeName" filterable remote clearable>
                    <el-option :value="location.code" :key="location.id" :label="location.name"
                               v-for="location in LocationListItem"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="7">
                  <span v-show="!item.isEdited">{{ item.count }}</span>
                  <input v-show="item.isEdited" type="number" v-model.number="item.count" class="el-input__inner"
                         @input="changeCount(item)"/>
                </el-col>
                <el-col :span="5" v-show="status === '4'">
                  <div v-show="!item.isEdited">
                    <el-button
                      size="mini"
                      @click="edit(item)" :disabled="doing">编辑
                    </el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click.native="deleteItem(item)" :disabled="doing">删除
                    </el-button>
                  </div>
                  <div v-show="item.isEdited">
                    <el-button
                      size="mini"
                      type="primary"
                      @click="save(item)" :disabled="doing">保存
                    </el-button>
                    <el-button
                      size="mini"
                      @click="cancel(item)" :disabled="doing">取消
                    </el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {http, InHouseWork, Store} from '@/resources';
import utils from '@/tools/utils';

export default {
    props: {
      orderId: {
        'type': String,
        'default': ''
      },
      showPartIndex: String,
      status: String
    },
    data: function () {
      return {
        spanNum: 4,
        loadingData: false,
        storeList: [],
        filters: {
          type: 0
        },
        info: {},
        currentId: '',
        currentItem: {},
        form: {
          warehouseId: '',
          areaId: '',
          storeId: '',
          count: ''
        },
        LocationListItem: [],
        staticStoreList: [],
        doing: false
      };
    },
    watch: {
      showPartIndex: function (val) {
        this.storeList = [];
        this.info = {};
        if (val === '2' || val === '4') {
          this.getProduct();
          this.getStores();
        }
      }
    },
    mounted() {

    },
    computed: {
      isEnough() {
        return this.storeList.every(f => f.storeId) && this.storeList.length;
      },
      noAllotCount() {
        let count = 0;
        this.staticStoreList.forEach(i => {
          count += i.count;
        });
        return this.info.count - count;
      },
      centerName() {
        let name = '';
        this.storeList.forEach(i => {
          if (i.centreName) {
            name = i.centreName;
          }
        });
        return name;
      }
    },
    methods: {
      getOrderStatus: function (order) { // 获取订单状态
        let status = '';
        for (let key in utils.inHouseType) {
          if (order.status === utils.inHouseType[key].status) {
            status = utils.inHouseType[key].title;
          }
        }
        return status;
      },
      getProduct: function () {
        if (!this.orderId) return;
        InHouseWork.get(this.orderId).then(res => {
          this.info = res.data;
        });
      },
      getStores: function () { // 根据类型，得到货位列表
        this.loadingData = true;
        InHouseWork.queryAssignStore(this.orderId).then(res => {
          res.data.forEach(i => {
            i.isEdited = false;
          });
          this.staticStoreList = JSON.parse(JSON.stringify(res.data));
          this.storeList = res.data;
          this.loadingData = false;
        }).catch(() => {
          this.loadingData = false;
        });
      },
      newAllot() {
        this.$confirm('是否重新分配货位', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          http.put(`/order-stock-task/${this.orderId}/reassign/pre-position`).then(res => {
            this.getStores();
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '重新分配失败'
            });
          });
        });
      },
      onShelf() {
        this.$confirm('是否确认上架', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          InHouseWork.onShelf(this.orderId).then(res => {
            this.$notify.success({
              message: '确认上架成功'
            });
            this.$emit('close');
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '确认上架失败'
            });
          });
        });
      },
      onSubmit: function () {
        InHouseWork.allotPlace(this.orderId).then(() => {
          this.$notify.success({
            message: '提交分配方案成功'
          });
          this.$emit('close');
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '提交分配方案失败'
          });
        });
      },
      filterLocationItem(query) { // 查库位
        let params = {
          keyWord: query,
          level: 2,
          deleteFlag: false
        };
        Store.query(params).then(res => {
          this.LocationListItem = res.data.list;
        });
      },
      edit(item) {
        this.currentItem = item;
        this.currentId = item.id;
        this.storeList.forEach(i => {
          if (i.isEdited) {
            this.staticStoreList.forEach(f => {
              if (f.id === i.id) {
                i.storeName = f.storeName;
                i.count = f.count;
              }
            });
          }
          i.isEdited = i.id === item.id;
        });
        this.filterLocationItem(item.storeName);
      },
      add() {
        let index = -1;
        this.storeList.forEach(i => {
          if (!i.id) {
            index = 1;
          }
        });
        if (index !== -1) {
          return;
        }
        this.storeList.forEach(i => {
          i.isEdited = false;
        });
        this.storeList.splice(0, 0, {
          storeName: '',
          count: '',
          isEdited: true
        });
      },
      deleteItem(item) {
        this.$confirm('是否删除货位' + item.storeName, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (!item.id) {
            let index = this.storeList.indexOf(item);
            if (index !== -1) {
              this.storeList.splice(index, 1);
            }
            return;
          }
          this.doing = true;
          this.$http.delete(`/order-stock-task/pre-position/${item.id}`).then(res => {
            this.$notify.success({
              message: '删除货位成功'
            });
            this.doing = false;
            let index = this.storeList.indexOf(item);
            if (index !== -1) {
              this.storeList.splice(index, 1);
            }
            this.staticStoreList.forEach((f, index) => {
              if (f.id === item.id) {
                this.staticStoreList.splice(index, 1);
              }
            });
          }).catch(error => {
            this.doing = false;
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '删除货位失败'
            });
          });
        });
      },
      cancel(item) {
        if (!item.id) {
          let index = this.storeList.indexOf(item);
          if (index !== -1) {
            this.storeList.splice(index, 1);
          }
        } else {
          this.storeList.forEach(i => {
            if (i.isEdited) {
              this.staticStoreList.forEach(f => {
                if (f.id === i.id) {
                  i.storeName = f.storeName;
                  i.count = f.count;
                }
              });
            }
            i.isEdited = false;
          });
        }
      },
      changeCount(item) {
        let count = 0;
        this.staticStoreList.forEach(f => {
          if (f.id === item.id) {
            count += f.count;
          }
        });
        count += this.noAllotCount;
        if (item.count > count) {
          item.count = count;
        }
      },
      save(item) {
        if (!item.storeName) {
          this.$notify.info({
            message: '请选择货位'
          });
          return;
        }
        if (!item.count) {
          this.$notify.info({
            message: '请输入数量'
          });
          return;
        }
        this.doing = true;
        if (item.id) {
          let obj = {
            id: item.id,
            storeNo: item.storeName,
            count: item.count
          };
          http.put(`/order-stock-task/pre-position/${item.id}`, obj).then(res => {
            this.$notify.success({
              message: '修改货位成功'
            });
            this.doing = false;
            item.isEdited = false;
            this.staticStoreList.forEach((i, index) => {
              if (i.id === item.id) {
                this.staticStoreList.splice(index, 1, JSON.parse(JSON.stringify(item)));
              }
            });
          }).catch(error => {
            this.doing = false;
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '修改货位失败'
            });
          });
        } else {
          let obj = {
            orderId: this.orderId,
            storeNo: item.storeName,
            count: item.count
          };
          http.post('/order-stock-task/pre-position/single', obj).then(res => {
            this.$notify.success({
              message: '添加货位成功'
            });
            this.doing = false;
            this.getStores();
          }).catch(error => {
            this.doing = false;
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '添加货位失败'
            });
          });
        }
      }
    }
  };
</script>
