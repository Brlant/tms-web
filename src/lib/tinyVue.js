/* Automatic generated by './build/bin/build-entry.js' */
import Pagination from 'element-ui/lib/pagination';
import Dialog from 'element-ui/lib/dialog';
import Autocomplete from 'element-ui/lib/autocomplete';
import Dropdown from 'element-ui/lib/dropdown';
import DropdownMenu from 'element-ui/lib/dropdown-menu';
import DropdownItem from 'element-ui/lib/dropdown-item';
import Menu from 'element-ui/lib/menu';
import Submenu from 'element-ui/lib/submenu';
import MenuItem from 'element-ui/lib/menu-item';
import MenuItemGroup from 'element-ui/lib/menu-item-group';
import Input from 'element-ui/lib/input';
import InputNumber from 'element-ui/lib/input-number';
import Radio from 'element-ui/lib/radio';
import RadioGroup from 'element-ui/lib/radio-group';
import RadioButton from 'element-ui/lib/radio-button';
import Checkbox from 'element-ui/lib/checkbox';
import CheckboxButton from 'element-ui/lib/checkbox-button';
import CheckboxGroup from 'element-ui/lib/checkbox-group';
import Switch from 'element-ui/lib/switch';
import Select from 'element-ui/lib/select';
import Option from 'element-ui/lib/option';
import OptionGroup from 'element-ui/lib/option-group';
import Button from 'element-ui/lib/button';
import ButtonGroup from 'element-ui/lib/button-group';
import Table from 'element-ui/lib/table';
import TableColumn from 'element-ui/lib/table-column';
import DatePicker from 'element-ui/lib/date-picker';
import TimeSelect from 'element-ui/lib/time-select';
import TimePicker from 'element-ui/lib/time-picker';
import Popover from 'element-ui/lib/popover';
import Tooltip from 'element-ui/lib/tooltip';
import MessageBox from 'element-ui/lib/message-box';
import Breadcrumb from 'element-ui/lib/breadcrumb';
import BreadcrumbItem from 'element-ui/lib/breadcrumb-item';

import FormItem from 'element-ui/lib/form-item';
import Tabs from 'element-ui/lib/tabs';
import TabPane from 'element-ui/lib/tab-pane';
import Tag from 'element-ui/lib/tag';
import Tree from 'element-ui/lib/tree';
import Alert from 'element-ui/lib/alert';
import Notification from 'element-ui/lib/notification';
import Slider from 'element-ui/lib/slider';
import Loading from 'element-ui/lib/loading';
import Icon from 'element-ui/lib/icon';
import Row from 'element-ui/lib/row';
import Col from 'element-ui/lib/col';
// import Upload from 'element-ui/lib/upload';
import Progress from 'element-ui/lib/progress';
import Spinner from 'element-ui/lib/spinner';
import Message from 'element-ui/lib/message';
import Badge from 'element-ui/lib/badge';
import Card from 'element-ui/lib/card';
import Rate from 'element-ui/lib/rate';
import Steps from 'element-ui/lib/steps';
import Step from 'element-ui/lib/step';
import Carousel from 'element-ui/lib/carousel';
import Scrollbar from 'element-ui/lib/scrollbar';
import CarouselItem from 'element-ui/lib/carousel-item';
import Collapse from 'element-ui/lib/collapse';
import CollapseItem from 'element-ui/lib/collapse-item';
import Cascader from 'element-ui/lib/cascader';
import ColorPicker from 'element-ui/lib/color-picker';
import Transfer from 'element-ui/lib/transfer';
import locale from 'element-ui/lib/locale';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import {
  Dict,
  FA,
  Forbid,
  FormRow,
  InputSingle,
  LoadingBottom,
  Nl2br,
  PageRight,
  Remove,
  TimeLine,
  TimeLineItem,
  TinyInput,
  TinyLoading,
  TinyRow,
  TinyCol,
  goodsSwitch,
  TotalCount,
  orgSelect,
  orgGoodsSelect,
  goodsSelect,
  statusList,
  TwoColumn,
  DesBtn
} from '@dtop/dtop-web-common';

import upload from '../components/common/upload/upload.vue';
import uploadRelation from '../components/common/upload/upload.relation.vue';
import perm from '../components/common/perm.vue';
import ElForm from '../components/common/form/src/form.vue';

const tinyVue = [
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Slider,
  Icon,
  Row,
  Col,
  Progress,
  Spinner,
  Badge,
  Card,
  Rate,
  Steps,
  Step,
  Carousel,
  Scrollbar,
  CarouselItem,
  Collapse,
  CollapseItem,
  Cascader,
  ColorPicker,
  Transfer,
  CollapseTransition,
  upload,
  uploadRelation,
  perm,
  ElForm,
  //公用组件
  Dict,
  FA,
  Forbid,
  FormRow,
  InputSingle,
  LoadingBottom,
  Nl2br,
  PageRight,
  Remove,
  TimeLine,
  TimeLineItem,
  TinyInput,
  TinyLoading,
  TinyRow,
  TinyCol,
  goodsSwitch,
  TotalCount,
  orgSelect,
  orgGoodsSelect,
  goodsSelect,
  statusList,
  TwoColumn,
  DesBtn
];

const install = function (Vue, opts = {}) {
  /* istanbul ignore if */
  if (install.installed) {
    return;
  }
  locale.use(opts.locale);
  locale.i18n(opts.i18n);

  tinyVue.map(component => {
    Vue.component(component.name, component);
  });

  Vue.use(Loading.directive);

  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

module.exports = Object.assign(tinyVue, {install});
