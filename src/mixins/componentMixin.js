export const remoteSelect = {
  props: {
    value: String,
    list: Array,
    remoteMethod: Function,
    placeholder: String
  },
  data () {
    return {
      valueModel: ''
    };
  },
  watch: {
    value (val) {
      this.valueModel = val;
    }
  },
  methods: {
    input (value) {
      this.valueModel = value;
      this.$emit('input', value);
    },
    change (val) {
      this.$emit('change', val);
    }
  }
};
export const select = {
  props: {
    value: String,
    list: Array,
    placeholder: String
  },
  data () {
    return {
      valueModel: ''
    };
  },
  methods: {
    input (value) {
      this.valueModel = value;
      this.$emit('input', value);
    }
  }
};
