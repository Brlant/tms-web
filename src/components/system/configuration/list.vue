<style lang="scss" scoped="">


  .el-form .el-select {
    display: block;
  }
</style>
<template>
  <div>
    <div class="d-table">
      <div class="d-table-right">
        <span class="pull-right">
          <span class="btn-search-toggle open" v-show="showSearch">
            <single-input v-model="filters.label" placeholder="请输入标题搜索"
                          :showFocus="showSearch"></single-input>
            <i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>
          </span>
          <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
            <i class="el-icon-t-search"></i>
          </a>
        </span>
        <div v-if="dataRows.length == 0" class="empty-info">
          暂无信息
        </div>
        <div v-else>
          <table class="table table-hover">
            <thead>
            <tr>
              <th>标题</th>
              <th>内容</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="row in dataRows">
              <td>
                {{row.label}}
              </td>
              <td>
                {{row.value}}
              </td>
              <td>
                  <a href="#" @click.stop.prevent="edit(row)"><i class="el-icon-t-edit"></i>编辑</a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox">
      <edit-form :formItem="form" @close="showRight=false"
                 @change="itemChange"></edit-form>
    </page-right>
  </div>

</template>
<script>
  import editForm from './form.vue';
  export default {
    components: {
      editForm
    },
    data: function () {
      return {
        showRight: false,
        showSearch: false,
        dataRows: [],
        filters: {
          label: ''
        },
        form: {}
      };
    },
    mounted () {
      this.getPageList();
    },
    watch: {
      filters: {
        handler: function () {
          this.getPageList();
        },
        deep: true
      }
    },
    methods: {
      resetRightBox: function () {
        this.showRight = false;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getPageList: function () {
        let ary = JSON.parse(window.localStorage.getItem('localConfiguration')) || [];
        this.dataRows = this.filters.label ? ary.filter(f => f.label.indexOf(this.filters.label) !== -1) : ary;
      },
      add: function () {
        this.form = {};
        this.showRight = true;
      },
      edit: function (item) {
        this.form = item;
        this.showRight = true;
      },
      itemChange: function (formData) {
        this.dataRows.forEach((item, index) => {
          if (item.key === formData.key) {
            this.dataRows.splice(index, 1, formData);
          }
        });
        this.showRight = false;
      }
    }
  };
</script>
