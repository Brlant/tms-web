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

.el-form-item {
  margin-bottom: 0;
}

.el-icon-zoom-in {
  font-size: 16px;
}

.f-14 {
  font-size: 14px;
}
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">任务详情</template>
    <template slot="btn">
      <el-button plain @click="onSubmit('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
              {{ pageSets[0].name }}
            </h3>
          </div>
          <div class="content">
            <el-table :data="form.waybillList" border style="width: 100%">
              <el-table-column prop="sort" label="序号" width="50">
                <template slot-scope=" scope">
                  <div class="f-14">
                    {{ scope.row.sort }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="waybillNumber" label="运单号" width="140">
                <template slot-scope=" scope">
                     <span class="f-14">
                     {{ scope.row.waybillNumber }}
                       <el-tag v-if="scope.row.packFlag" type="success">已包</el-tag>
                        <el-tag v-if="!scope.row.packFlag" type="warning">未包</el-tag>
                      </span>
                </template>
              </el-table-column>
              <el-table-column prop="receiverName" label="发货单位" mix-width="110">
                <template slot-scope=" scope">
                  <div class="f-14">
                    {{ scope.row.senderName }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="receiverName" label="收货单位" mix-width="110">
                <template slot-scope=" scope">
                  <div class="f-14">
                    {{ scope.row.receiverName }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="receiverName" label="收货地址" mix-width="110">
                <template slot-scope=" scope">
                  <div class="f-14">
                    {{ scope.row.receiverAddress }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="incubatorCount" label="包件" width="50">
                <template slot-scope=" scope">
                  <span class="f-14">
                     {{ scope.row.incubatorCount }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="80">
                <template slot-scope=" scope">
                  <span class="f-14">
                    {{ formatStatusTitle(scope.row.status, wayBillType) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="" label="升序" width="50">
                <template slot-scope="scope">
                    <span @click.stop="upDetail(form.waybillList,scope.row.sort-1,scope.row)">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-top"></i>
                      </a>
                    </span>
                </template>
              </el-table-column>
              <el-table-column prop="" label="降序" width="50">
                <template slot-scope="scope">
                    <span @click.stop="downDetail(form.waybillList,scope.row.sort-1,scope.row)">
                      <a @click.pervent="" class="btn-circle btn-opera">
                        <i class="el-icon-bottom"></i>
                      </a>
                    </span>
                </template>
              </el-table-column>
              <el-table-column prop="" label="是否加锁" width="80">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.lockStatus" active-value="1" inactive-value="0">
                  </el-switch>
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
import {TransportTask} from '@/resources';
import utils from '@/tools/utils';

export default {
  components: {},
  data() {
    return {
      span: 7,
      list: [],
      times: [],
      pageSets: [
        {name: '运单明细', key: 0}
      ],
      currentTab: {},
      form: {
        goodsList: [
          {
            goodsName: '',
            specifications: '',
            weight: '',
            volume: '',
            code: ''
          }
        ]
      },
      detailForm: {
        taskId: '',
        list: []
      },
      loadingLog: false,
      rules: {},
      doing: false,
      wayBillType: utils.wayBillType
    };
  },
  computed: {},
  props: ['formItem'],
  watch: {
    formItem: function (val) {
      this.selectTab(this.pageSets[0]);
      if (val.id) {
        TransportTask.getOneTransportTask(val.id).then(res => {
          this.form = res.data;
          this.form.waybillList.forEach(val => {
            val.sort = this.form.waybillList.indexOf(val) + 1;
          });
        });
      }
    }
  },
  methods: {
    formatStatusTitle(status, statusType) {
      let title = '';
      Object.keys(statusType).forEach(k => {
        if (status === null) {
          if (statusType[k].status === status) {
            title = statusType[k].title;
          }
        } else {
          let s1 = Number(statusType[k].status);
          let s2 = Number(status);
          if (s1 === s2) {
            title = statusType[k].title;
          }
        }
      });
      return title;
    },
    onSubmit: function () {
      if (!this.form.waybillList.length) {
        this.$notify.warning({
          duration: 2000,
          message: '运单明细不能为空'
        });
        return;
      }
      this.detailForm.taskId = this.form.id;
      this.form.waybillList.forEach(v => {
        this.detailForm.list.push(Object.assign({}, {sort: v.sort, lockStatus: v.lockStatus, tmsOrderId: v.id}));
      })
      this.doing = true;
      this.$http.post('transport-task/detail/sort', this.detailForm).then(() => {
        this.$notify.success({
          duration: 2000,
          title: '成功',
          message: '调整运单详情顺序成功'
        });
        this.doing = false;
        this.detailForm = {
          taskId: '',
          list: []
        };
        this.close();
      }).catch(error => {
        this.doing = false;
        this.detailForm = {
          taskId: '',
          list: []
        };
        this.$notify.error({
          duration: 2000,
          message: error.response && error.response.data && error.response.data.msg || '调整运单详情顺序失败'
        });
      });
    },
    upDetail(fieldData, index, item) {
      if (index !== 0) {
        fieldData[index] = fieldData.splice(index - 1, 1, fieldData[index])[0];
      } else {
        fieldData.push(fieldData.shift());
      }
      fieldData.forEach(val => {
        val.sort = fieldData.indexOf(val) + 1;
      });
    },
    downDetail(fieldData, index, item) {
      if (index !== fieldData.length - 1) {
        fieldData[index] = fieldData.splice(index + 1, 1, fieldData[index])[0];
      } else {
        fieldData.unshift(fieldData.splice(index, 1)[0]);
      }
      fieldData.forEach(val => {
        val.sort = fieldData.indexOf(val) + 1;
      });
    },
    selectTab(item) {
      this.currentTab = item;
    },
    close() {
      this.$emit('right-close');
    }
  }
};
</script>
