<style lang="scss" scoped>
$table-background-color: #dfe6ec;
$table-background-color-tint: #eee;
.product-detail-list {
  /*margin-top: 20px;*/
  table-layout: fixed;
  text-align: center;
  border-collapse: collapse;
  font-size: 12px;

  > tbody > tr > td {
    padding: 5px;
    border: 1px solid $table-background-color;
  }

  .t-head {
    background: #eaf2f8;
    color: #1f2d3d;
    font-weight: bold;
  }

  &.is-top {
    > tbody > tr > td {
      border-bottom: 0;
    }
  }

  &.is-tint {
    > tbody > tr > td {
      border: 1px solid #d6d6d6;
    }

    .t-head {
      background: $table-background-color-tint;
    }

    &.is-top {
      > tbody > tr > td {
        border-bottom: 0;
      }
    }
  }
}

.list-item {
  position: relative;
  line-height: 20px;
  padding-top: 0;
  padding-bottom: 0;
  border: 0;
  padding-left: 0;

  .download-link {
    display: none;
  }

  &:hover .download-link {
    display: block;
  }
}

.list_flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-item {
  margin-bottom: 20px;
}

.text-left {
  text-align: left;
}
</style>
<template>
  <el-dialog title="作业提醒" :visible.sync="visible" append-to-body width="70%">
    <div class="table-item" v-for="(item, index) in list" :key="index">
      <table class="product-detail-list" width="100%">
        <tbody>
        <tr>
          <td colspan="1" class="t-head">异常类型</td>
          <td colspan="5">
            {{ types[item.exceptionType] }}
          </td>
          <td colspan="1" class="t-head">{{ item.exceptionType === 1 ? '异常单位' : '异常批号' }}</td>
          <td colspan="5">
            {{ item.objectName }}
          </td>
        </tr>
        <tr v-show="item.exceptionType === 2">
          <td colspan="1" class="t-head">货品</td>
          <td colspan="5">
            <div>{{ item.goodsName }}</div>
            <div class="f-grey">{{ item.specification }}</div>
          </td>
          <td colspan="1" class="t-head">生产单位</td>
          <td colspan="5">
            {{ item.factoryName }}
          </td>
        </tr>
        <tr>
          <td colspan="1" class="t-head">异常原因</td>
          <td colspan="11" class="text-left">
            {{ item.reason }}
          </td>
        </tr>
        <tr>
          <td colspan="1" class="t-head">备注</td>
          <td colspan="11" class="text-left">
            {{ item.remark }}
          </td>
        </tr>
        <tr>
          <td colspan="1" class="t-head">附件</td>
          <td colspan="11">
            <ul class="show-list" v-if="item.attachmentList">
              <li class="list-item list_flex" v-for="attachment in item.attachmentList"
                  @click="handlePreview(attachment, item.attachmentList)">
                <div class="attachment-name">
                  <el-tooltip effect="dark" :content="attachment.attachmentFileName" placement="top">
                      <span>
                          {{ attachment.attachmentFileName }}
                      </span>
                  </el-tooltip>
                </div>
                <div>
                  <a class="download-link pull-right" @click.stop="$downloadFile(attachment)">
                    <i class="el-icon-t-download"></i>
                  </a>
                </div>
              </li>
            </ul>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <template slot="footer">
      <el-button @click="cancel" type="primary">待定</el-button>
      <el-button @click="confirm" plain>已确认，继续作业</el-button>
    </template>
  </el-dialog>
</template>
<script>
export default {
  props: {
    list: Array,
    type: String,
    handlerStep: Function
  },
  data() {
    return {
      visible: false,
      types: ['其它', '上游单位异常', '批号异常']
    };
  },
  methods: {
    handlePreview(file, attachmentList) {
      this.$store.commit('changeAttachment', {currentId: file.attachmentId, attachmentList: attachmentList});
    },
    cancel() {
      this.visible = false;
    },
    confirm() {
      this.handlerStep({checkExceptionFlag: false});
      this.cancel();
    }
  }
};
</script>
