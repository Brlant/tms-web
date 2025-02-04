<style lang="scss">
.dialog-template {
  $width: 180px;

  &.content-part {
    .content-left {
      width: $width;
    }

    .content-right {
      > h3 {
        left: $width;
        margin-bottom: 0;
      }

      left: $width;
      padding-top: 65px;
      padding-right: 0;
    }
  }

  .dialog-template_scroll {
    overflow: hidden;
    height: 100%;
  }

  .dialog-template_scroll_content {
    padding-right: 30px;
  }
}
</style>
<template>
  <div class="content-part dialog-template">
    <div class="content-left">
      <h2 class="clearfix right-title">
        <slot name="title"></slot>
      </h2>
      <ul v-if="pageSets.length>0">
        <!-- showFlag 作为显示或者不显示此条目的标签,  默认pageSets数组中元素中无showFlag为显示该标签 -->
        <li class="list-style" v-for="(item, key) in pageSets" @click="selectTab(item, key)"
            v-bind:class="{ 'active' : index == key}" v-if="!item.showFlag"><span>{{ item.name }}</span>
        </li>
      </ul>
      <div class="btn-group-lt-bm-part">
        <slot name="btn"></slot>
      </div>
    </div>
    <div class="content-right content-padding">
      <h3>{{ title }}</h3>
      <el-scrollbar tag="div" class="dialog-template_scroll" @scroll="throttle">
        <div class="dialog-template_scroll_content">
          <slot name="content"></slot>
          <div class="btn-save" :style="{'padding-left': `${btnSavePosition}px`}">
            <slot name="btnSave"></slot>
          </div>
        </div>
      </el-scrollbar>

    </div>
  </div>
</template>
<script>
const wait = 500;
let canRun = true;

export default {
  name: 'dialogTemplate',
  props: {
    pageSets: [Array, Object],
    indexClass: {
      type: String,
      default: 'index-tit'
    },
    btnSavePosition: {
      type: Number,
      default: 80
    }
  },
  data() {
    return {
      index: 0,
      title: '',
      isClickLeftTab: false,
      titleAry: null,
      dialogWarp: null
    };
  },
  computed: {
    showIndex() {
      return this.$parent.$parent.show;
    }
  },
  watch: {
    showIndex(val) {
      if (!val && this.pageSets) {
        this.selectTab(this.pageSets[0], 0);
      }
      this.titleAry = null;
      this.dialogWarp = null;
    },
    pageSets: {
      handler(val) {
        if (val && val.lengh > 0) {
          val && this.$emit('selectTab', this.pageSets[0]);
        }
      },
      immediate: true // 初始化tab时，直接选中第一个
    }
  },
  methods: {
    setTitleAry() {
      if (this.titleAry) return;
      this.titleAry = this.$el.querySelectorAll('.' + this.indexClass);
    },
    getDialogWarp() {
      if (this.dialogWarp) return;
      this.dialogWarp = this.$el.getElementsByClassName('el-scrollbar__wrap')[0];
    },
    selectTab(item, key) {
      if (!item){
        return
      }

      this.index = key;
      this.title = item.name;
      this.isClickLeftTab = true;
      this.setScrollTop(key);
      this.$emit('selectTab', item);
    },
    // 节流
    throttle(e) {
      this.setTitleAry();
      if (!canRun) return;
      canRun = false;
      setTimeout(() => {
        this.setIndex(e);
        canRun = true;
      }, wait);
    },
    setIndex(e) {
      if (this.isClickLeftTab) {
        this.isClickLeftTab = false;
        return;
      }
      let event = e || window.event;
      let target = event.target || e.srcElement;
      let {titleAry} = this;
      if (!titleAry) return;
      let scrollTop = target.scrollHeight - target.clientHeight;
      // 滚到底处理
      if (scrollTop - target.scrollTop < 20) {
        this.setLeftPageSets(titleAry.length - 1);
        return;
      }
      for (let i = 0; i < titleAry.length; i++) {
        if (!titleAry[i]) return;
        let curOffsetTop = titleAry[i].parentNode.parentNode.offsetTop - 65;
        let nexOffsetTop = i < titleAry.length - 1 ? titleAry[i + 1].parentNode.parentNode.offsetTop - 65 : 0;
        if (target.scrollTop > curOffsetTop && target.scrollTop < nexOffsetTop) {
          this.setLeftPageSets(i);
        }
      }
    },
    setScrollTop(index) {
      this.setTitleAry();
      this.getDialogWarp();
      let {titleAry, dialogWarp} = this;
      if (!titleAry || !dialogWarp) return;
      let scrollTop = dialogWarp.scrollHeight - dialogWarp.clientHeight;
      let curItem = this.getCurTitleItem(index);
      if (!curItem) return;
      let otp = curItem.parentNode.parentNode.offsetTop - 65;
      dialogWarp && (dialogWarp.scrollTop = scrollTop > otp ? otp : scrollTop);
    },
    // 根据左侧选中的tab的key值，得到右边对应的title;
    // index值可能为数组的索引值，对象的key值
    getCurTitleItem(index) {
      let curItem = null;
      if (this.pageSets instanceof Array) {
        curItem = this.titleAry[index];
      } else {
        Object.keys(this.pageSets).forEach((k, d) => {
          if (k === index) {
            curItem = this.titleAry[d];
          }
        });
      }
      return curItem;
    },
    // 根据右侧滚动选中的title的索引值，设置左边的tab
    setLeftPageSets(index) {
      let curIndex = index;
      let pageSets = this.pageSets;
      if (pageSets.length == 0) {
        // 如果pageSets是空的，那么pageSets[curIndex]会越界，从而导致报错
        return;
      }

      if (pageSets instanceof Object) {
        Object.keys(pageSets).forEach((k, d) => {
          if (d === index) {
            curIndex = k;
          }
        });
      }

      this.index = curIndex;
      this.title = pageSets[curIndex].name;
      this.$emit('selectTab', pageSets[curIndex]);
    }
  }
};
</script>
