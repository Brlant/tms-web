<style lang="scss" scoped>
.qp-box {
  &.accessory {
    margin-bottom: 20px;
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 0 20px 10px 20px;

    h2 {
      line-height: 20px;
      margin: 10px 0;
      padding: 0;
    }

    .accessory-item {
      margin-top: 10px;
    }
  }

  .accessory-list {
    .show-list {
      .list-item {
        .attachment-delete, .download-link {
          float: right;
          padding: 0 3px;
          color: #fff;
          font-size: 16px;
        }

        &:hover .attachment-delete {
          color: red;
        }

        &:hover .download-link {
          display: block;
          color: #1c8de0;
        }

        .download-link {
          display: none;
        }
      }
    }
  }
}

.list_flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.exception-attachment {
  .show-list {
    .list-item {
      position: relative;
      line-height: 20px;
      padding-top: 3px;
      padding-bottom: 3px;
      border: 0;

      .attachment-span, .download-link {
        float: right;
        padding: 0 3px;
        color: #fff;
      }

      &:hover .attachment-span {
        color: red;
      }

      &:hover .download-link {
        color: #1c8de0;
      }
    }
  }
}

</style>
<template>
  <div>
    <div class="qp-box accessory" v-if="attachmentClass === 'accessory' ">
      <h2>
        {{ label }}
      </h2>
      <perm :label="currentAttachmentRight.watch">
        <div class="accessory-list">
          <div v-if="orderAttachment.length">
            <ul class="show-list">
              <li class="list-item list_flex" v-for="item in orderAttachment" :key="item.attachmentId"
                  @click="showAttachment(item)">
                <div class="attachment-name">
                  <el-tooltip effect="dark" :content="item.attachmentFileName" placement="top">
                    <span>
                        {{ item.attachmentFileName }}
                    </span>
                  </el-tooltip>
                </div>
                <div>
                  <perm :label="currentAttachmentRight.remove">
                   <span class="download-link attachment-delete" @click.stop.prevent="deleteAttachMentManageItem(item)"
                         v-show="isShowDeleteButton">
                     <i class="el-icon-t-delete"></i>
                    </span>
                  </perm>
                  <perm label="wms-attachment-name-update">
                    <span class="download-link attachment-delete" @click.stop.prevent="editName(item)">
                      <i class="el-icon-t-edit"></i>
                    </span>
                  </perm>
                  <perm :label="currentAttachmentRight.download">
                    <span class="attachment-delete">
                      <a class="download-link" @click.stop="$downloadFile(item)">
                        <i class="el-icon-t-download"></i>
                      </a>
                    </span>
                  </perm>
                </div>
              </li>
            </ul>
          </div>
          <div v-else>
            <span>无附件</span>
          </div>
        </div>
      </perm>
      <div class="accessory-item" v-show="isShowAttachmentUpload">
        <perm :label="currentAttachmentRight.upload">
          <oms-upload-relation :formData="{objectId:objId,objectType:objectType}" :showFileList="false"
                               @change="changeAttachmentFiles"></oms-upload-relation>
        </perm>
      </div>
    </div>
    <div class="exception-attachment" v-else-if="attachmentClass === 'exception-attachment' ">
      <ul class="show-list">
        <li class="list-item list_flex" v-for="item in orderAttachment" :key="item.attachmentId"
            @click="showAttachment(item)">
          <div class="attachment-name">
            <el-tooltip effect="dark" :content="item.attachmentFileName" placement="top">
              <span>
                  {{ item.attachmentFileName }}
              </span>
            </el-tooltip>
          </div>
          <div>
            <perm :label="currentAttachmentRight.remove">
                   <span class="download-link attachment-delete" @click.stop.prevent="deleteAttachMentManageItem(item)"
                         v-show="isShowDeleteButton">
                     <i class="el-icon-t-delete"></i>
                    </span>
            </perm>
            <perm label="wms-attachment-name-update">
                    <span class="download-link attachment-delete" @click.stop.prevent="editName(item)">
                      <i class="el-icon-t-edit"></i>
                    </span>
            </perm>
            <perm :label="currentAttachmentRight.download">
                    <span class="attachment-delete">
                      <a class="download-link" @click.stop="$downloadFile(item)">
                        <i class="el-icon-t-download"></i>
                      </a>
                    </span>
            </perm>
          </div>
        </li>
      </ul>
    </div>

    <el-dialog title="编辑附件名称" :visible.sync="dialogFormVisible" :modal="false">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="附件名称" :label-width="formLabelWidth" prop="attachmentFileName">
          <el-input v-model="form.attachmentFileName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click.prevent.stop="onSubmit('form')" :disabled="doing">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {OmsAttachment} from '@/resources';

export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    orderAttachment: {
      required: true,
      type: Array,
      default: function () {
        return [];
      }
    },
    objectType: {
      type: String,
      default: ''
    },
    objectId: {
      type: String,
      default: ''
    },
    currentOrder: {
      type: Object,
      default: function () {
        return {};
      }
    },
    attachmentRight: {
      type: Object,
      default: function () {
        return {};
      }
    },
    isShowUpload: {
      type: Boolean,
      default: true
    },
    attachmentClass: {
      type: String,
      default: 'accessory'
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {},
      formLabelWidth: '120px',
      rules: {
        attachmentFileName: [
          {required: true, message: '请输入附件名称', trigger: 'blur'}
        ]
      },
      doing: false
    };
  },
  computed: {
    isShowDeleteButton: function () {
      let isShow = true;
//        let state = this.currentOrder.state;
//        if (state === '0' || state === '3') isShow = true;
      return isShow;
    },
    isShowAttachmentUpload: function () {// 是否显示附件上传
      let isShow = true;
//        let state = this.currentOrder.state;
//        if (state === '4' || state === '7' || state === '8' || state === '6') {
//          isShow = false;
//        }
      return isShow && this.isShowUpload;
    },
    objId() {
      let id = '';
      if (this.currentOrder.id) id = this.currentOrder.id;
      if (this.objectId) id = this.objectId;
      return id;
    },
    currentAttachmentRight() {
      return Object.assign({upload: '', watch: '', download: '', remove: ''}, this.attachmentRight);
    }
  },
  methods: {
    onSubmit: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid || this.doing) return;
        // 修改附件名称
        let param = {'attachmentFileName': this.form.attachmentFileName};
        let index = '';
        this.orderAttachment.forEach(val => {
          if (val.attachmentId === this.form.attachmentId) {
            index = this.orderAttachment.indexOf(val);
          }
        });
        this.doing = true;
        this.$http.put(`/omsAttachment/${this.form.attachmentId}/name`, param).then(res => {
          this.$notify.success({
            message: '修改附件文件名成功'
          });
          this.orderAttachment.splice(index, 1, res.data);
          this.dialogFormVisible = false;
          this.doing = false;
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '修改附件文件名失败'
          });
          this.doing = false;
        });
      });
    },
    editName: function (val) {
      this.form = {
        attachmentId: val.attachmentId,
        attachmentFileName: val.attachmentFileName
      };
      this.dialogFormVisible = true;
      if (this.$refs['form']) {
        this.$refs['form'].clearValidate();
      }
    },
    showAttachment: function (item) {// 显示预览
      this.$store.commit('changeAttachment', item.attachmentId);

    },
    deleteAttachMentManageItem: function (item) {// 删除附件管理附件
      OmsAttachment.delete(item.attachmentId).then(() => {
        this.$emit('refreshAttachment');
        this.$notify.success({
          duration: 2000,
          title: '成功',
          message: '已成功删除附件'
        });
      });
    },
    changeAttachmentFiles: function () {// 附件列表改变时，触发
      this.$emit('refreshAttachment');
    }
  }
};
</script>
