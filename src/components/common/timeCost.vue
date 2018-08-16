<style lang="scss" scoped>
  .cost-time-dom {
    display: inline-block;
    line-height: 26px;
    .cost-time-show {
      color: #f00;
      margin: 0 5px;
      font-weight: bold;
    }

  }
</style>
<template>
  <span class="cost-time-dom">
    <span v-show="d"><span class="cost-time-show">{{d}}</span> 天</span>
    <span v-show="h"><span class="cost-time-show">{{h}}</span> 小时</span>
    <span><span class="cost-time-show">{{m}}</span> 分钟</span>
  </span>
</template>

<script>
  export default {
    name: 'OmsCostTime',
    props: ['fDate', 'tDate'],
    data () {
      return {
        d: '',
        h: '',
        m: ''
      };
    },
    watch: {
      fDate: function (newVal, oldVal) {
        this.getDate();
      },
      tDate: function (newVal, oldVal) {
        this.getDate();
      }
    },
    methods: {
      getDate: function () {
        let b = this.$moment(this.fDate);
        let a = this.tDate ? this.$moment(this.tDate) : this.$moment();
        this.d = a.diff(b, 'd');
        this.h = a.diff(b, 'H') % 24;
        let m = a.diff(b, 'm') % 60;
        this.m = m ? m : 0;
      }
    },
    mounted: function () {
      this.getDate();
    }
  };
</script>
