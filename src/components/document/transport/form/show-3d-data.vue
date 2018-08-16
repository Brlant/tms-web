<style lang="scss" scoped>
  .modeling-part {
    .show-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ebeef5;
      &:last-child {
        border: 0;
      }
    }
  }

  .min-gutter {
    .el-form-item {
      /*margin-bottom: 20px;*/
    }
    .el-form-item__label {
      font-size: 12px
    }
  }
</style>
<template>
  <div class="modeling-part">
    <div class="form-header-part min-gutter">
      <div class="header">
        <div class="sign f-dib"></div>
        <h3 class="tit f-dib index-tit" :class="{active: pageSet.key === currentTab.key}">
          预装箱结果
        </h3>
        <span @click="open" class="des-btn">
               <a href="#" class="btn-circle" @click.prevent="">
                 <i class="el-icon-zoom-in"></i></a>查看
        </span>
        <span @click="showAdd" class="des-btn">
          <a href="#" class="btn-circle" @click.prevent="">
            <i class="el-icon-t-plus"></i>
          </a>
          新箱模型
        </span>
      </div>
      <div>
        <el-form ref="boxSizeForm" :model="boxSizeForm" :rules="boxSizeFormRules" class="clearfix" label-width="100px"
                 v-show="showAddFlag">
          <el-form-item label-width="0px">
            <el-row>
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-form-item prop="length">
                    <oms-input type="number" min="0" v-model="boxSizeForm.length" placeholder="长">
                      <template slot="append">CM</template>
                    </oms-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1">X</el-col>
                <el-col :span="6">
                  <el-form-item prop="width">
                    <oms-input type="number" min="0" v-model="boxSizeForm.width" placeholder="宽">
                      <template slot="append">CM</template>
                    </oms-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1">X</el-col>
                <el-col :span="6">
                  <el-form-item prop="height">
                    <oms-input type="number" min="0" v-model="boxSizeForm.height" placeholder="高">
                      <template slot="append">CM</template>
                    </oms-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" @click="onSubmit('boxSizeForm')" :disabled="doing">重新计算</el-button>
                </el-col>
              </el-row>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <el-table v-show="show" :data="list" border class="border-black" v-loading="loading">
          <el-table-column type="index" label="序号" width="50"/>
          <el-table-column label="货品">
            <template slot-scope="scope">
              <ul class="show-list">
                <li class="show-item" v-for="item in scope.row.list">
                  <span>{{item.goodsName}}</span>
                  <span class="f-grey">{{item.specification}}</span>
                </li>
              </ul>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['form', 'pageSet', 'currentTab'],
    data () {
      return {
        show: false,
        loading: false,
        list: [],
        boxSizeForm: {
          id: '',
          length: '',
          height: '',
          width: ''
        },
        showAddFlag: false,
        doing: false,
        saveKey: 'boxSizeForm',
        boxSizeFormRules: {
          'length': [
            {required: true, message: '请输入箱体长度', trigger: 'blur'}
          ],
          'width': [
            {required: true, message: '请输入箱体宽度', trigger: 'blur'}
          ],
          'height': [
            {required: true, message: '请输入箱体高度', trigger: 'blur'}
          ]
        }
      };
    },
    watch: {
      'form.id' () {
        this.close();
        this.showAddFlag = false;
        this.list = [];
      }
    },
    methods: {
      showAdd: function () {
        this.showAddFlag = !this.showAddFlag;
        let oldForm = window.localStorage.getItem(this.saveKey);
        if (oldForm) {
          this.boxSizeForm = Object.assign({}, this.boxSizeForm, JSON.parse(oldForm));
        }
      },
      onSubmit: function () {
        this.boxSizeForm.id = this.form.id;
        this.doing = true;
        let sizeForm = {
          length: this.boxSizeForm.length,
          height: this.boxSizeForm.height,
          width: this.boxSizeForm.width
        };
        this.loading = true;
        this.$http.get(`/tms-waybill/${this.form.id}/pre-pack`, {params: this.boxSizeForm}).then(res => {
          this.list = res.data;
          this.show = true;
          this.loading = false;
          this.doing = false;
          // 保存长宽高
          window.localStorage.setItem(this.saveKey, JSON.stringify(sizeForm));
        }).catch(error => {
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '查询预装箱失败'
          });
        });
      },
      open () {
        console.log('111');
        this.show = true;
        this.queryList();
      },
      close () {
        this.show = false;
      },
      queryList () {
        this.loading = true;
        this.$http.get(`/tms-waybill/${this.form.id}/pre-pack`).then(res => {
          this.list = res.data;
          this.loading = false;
        });
      }
    }
  };
</script>
