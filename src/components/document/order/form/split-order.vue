<style lang="scss" scoped>
  $labelWidth: 180px;
  .content-part {
    .content-left {
      width: $labelWidth;
    }
    .content-right {
      > h3 {
        left: $labelWidth;
      }
      left: $labelWidth;
    }
  }

  .part-hj-box {
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
  }
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">拆分订单</template>
    <template slot="btn">
      <el-button plain @click="save('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content">
            <el-form-item label="拆分数量">
              <oms-input type="number" v-model.number="splitCount" min="0" placeholder="请输入拆分运单数量"
                         @change="setSplitCount"></oms-input>
            </el-form-item>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">
              {{pageSets[1].name}}</h3>
          </div>
          <div class="content">
            <el-table :data="form.goodsList" border style="width: 100%">
              <el-table-column prop="goodsName" label="货品名称" width="200">
              </el-table-column>
              <el-table-column prop="weight" label="货品重量(kg)">
                <template slot-scope="scope">
                  {{scope.row.weight}}
                </template>
              </el-table-column>
              <el-table-column prop="volume" label="货品体积(m³)">
                <template slot-scope="scope">
                  {{scope.row.volume}}
                </template>
              </el-table-column>
              <el-table-column prop="specifications" label="货品规格">
              </el-table-column>
              <el-table-column prop="code" label="追溯码">
              </el-table-column>
              <el-table-column prop="" label="操作">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.orderIndex" placeholder="请选择运单" :clearable="true">
                    <el-option :label="item.name" :value="item.value" :key="item.value"
                               v-for="item in splitList"></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {TmsOrder} from '@/resources';

  export default {
    data () {
      return {
        list: [],
        times: [],
        pageSets: [
          {name: '基本信息', key: 0},
          {name: '货品列表', key: 1}
        ],
        currentTab: {},
        splitCount: '',
        form: {},
        doing: false,
        rules: {},
        splitList: []
      };
    },
    computed: {},
    props: ['formItem', 'action'],
    watch: {
      formItem: function (val) {
        this.splitCount = '';
        this.splitList = [];
        if (val.id) {
          TmsOrder.getOneTmsOrder(val.id).then(res => {
            this.form = res.data;
          });
        }
      }
    },
    methods: {
      setSplitCount: function () {
        let index = this.splitCount;
        this.splitList = [];
        for (let i = 0; i < index; i++) {
          let count = i + 1;
          this.splitList.push({name: '运单' + count, value: count});
        }
      },
      selectTab (item) {
        this.currentTab = item;
      },
      save (formName) {
        // 判断拆分数量
        if (this.splitCount === '') {
          this.$notify.warning({
            duration: 2000,
            message: '请选择输入需要拆分的订单数量'
          });
          return;
        }
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            // 处理货品列表
            if (this.form.goodsList) {
              let goodsList = [];
              this.form.goodsList.forEach(val => {
                if (val.goodsName !== '' || val.specifications !== '' || val.weight !== '' || val.volume !== '' || val.code !== '') {
                  goodsList.push(val);
                }
              });
              this.form.goodsList = goodsList;
            }
            // 判断货品列表是否分配完成
            let isFlag = false;
            this.form.goodsList.forEach(val => {
              if (!val.orderIndex || val.orderIndex === '') {
                isFlag = true;
              }
            });
            if (isFlag) {
              this.$notify.warning({
                duration: 2000,
                message: '尚有未分配订单的货品,请分配完成再提交'
              });
              return;
            }
            // 对货品列表进行归类
            let goodsList = this.form.goodsList;
            let data = [];
            for (let i = 0; i < goodsList.length; i++) {
              let index = goodsList[i].orderIndex;
              if (index) {
                if (!data[index]) {
                  let arr = [];
                  arr.push(goodsList[i]);
                  data[index] = {key: index, list: arr};
                } else {
                  let list = data[index].list;
                  if (list) {
                    list.push(goodsList[i]);
                  }
                  data[index].list = list;
                }
              }
            }
            // 处理数组中的空项
            for (let i = 0, len = data.length; i < len; i++) {
              if (!data[i] || data[i] === '') {
                data.splice(i, 1);
                len--;
              }
            }
            // 组装数据
            let saveData = {orderId: this.form.id, requestList: data};
            this.doing = true;
            TmsOrder.dismantlingOrder(this.form.id, saveData).then(res => {
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '拆解订单成功'
              });
              this.doing = false;
              this.$emit('change', res.data);
              this.$emit('right-close');
            }).catch(error => {
              this.$notify.error({
                duration: 2000,
                message: error.response && error.response.data && error.response.data.msg || '拆解订单失败'
              });
              this.doing = false;
            });
          } else {

          }
        });

      }
    }
  };
</script>
