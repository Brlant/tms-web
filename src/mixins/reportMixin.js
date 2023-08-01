export default {
    data() {
      return {
        fixedHeight: 0
      };
    },
    mounted() {
      let showSearch = JSON.parse(window.localStorage.getItem(this.$route.path));
      if (typeof showSearch === 'boolean') {
        this.showSearch = showSearch;
      }
    },
    computed: {
      vaccineSignList() {
        let ary = this.$getDict('orderGoodsType') || [];
        return ary.filter(f => f.key < 2);
      }
    },
    watch: {
      showSearch(val) {
        window.localStorage.setItem(this.$route.path, val);
      }
    },
    methods: {
      setFixedHeight() {
        setTimeout(() => {
          this.fixedHeight = Math.abs(this.fixedHeight - 1);
        }, 100);
      }
    }
  };
  
  