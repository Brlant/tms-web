import {Address} from '@dtop/dtop-web-common';
import qs from 'qs';
export default {
  address: Address.value,
  inType: {
    0: {'title': '所有', state: null, num: ''},
    1: {'title': '执行中', state: '0', num: ''},
    2: {'title': '入库完成', state: '1', num: ''}
  },
  outType: {
    0: {'title': '所有', state: null, num: ''},
    1: {'title': '待分波', state: '6', num: ''},
    2: {'title': '待拣货', state: '7', num: ''},
    3: {'title': '待复核', state: '8', num: ''},
    4: {'title': '待包装', state: '9', num: ''},
    5: {'title': '已发货', state: '10', num: ''},
    6: {'title': '待签收', state: '11', num: ''},
    7: {'title': '已完成', state: '12', num: ''}
  },
  recallType: {
    0: {'title': '所有', state: null, num: ''},
    1: {'title': '待确认', state: '0', num: ''},
    2: {'title': '确认不通过', state: '1', num: ''},
    3: {'title': '待下架', state: '2', num: ''},
    4: {'title': '已下架', state: '3', num: ''}
  },
  waveType: {
    // 0: {'title': '所有', state: null, num: ''},
    1: {'title': '待拆解', state: 0, num: ''},
    3: {'title': '执行中', state: 1, num: ''},
    4: {'title': '已发货', state: 4, num: ''},
    5: {'title': '待收货', state: 5, num: ''},
    6: {'title': '波次任务完成', state: 6, num: ''}
  },
  scrapType: {
    0: {'title': '所有', status: null, num: ''},
    1: {'title': '待审核', status: '0', num: ''},
    2: {'title': '待下架', status: '1', num: ''},
    3: {'title': '待扫码复核', status: '2', num: ''},
    4: {'title': '待上架', status: '3', num: ''},
    5: {'title': '已完成', status: '4', num: ''},
    6: {'title': '审核未通过', status: '5', num: ''}
  },
  maintainType: {
    0: {'title': '所有', state: null, num: ''},
    1: {'title': '一般养护', state: '0', num: ''},
    2: {'title': '重点养护', state: '1', num: ''}
  },
  scatterType: {
    0: {'title': '待下架', state: '0', num: ''},
    1: {'title': '待复核', state: '1', num: ''},
    2: {'title': '待上架', state: '2', num: ''},
    3: {'title': '已完成', state: '3', num: ''}
  },
  moveType: {
    0: {'title': '所有', state: null, num: ''},
    1: {'title': '待移库', state: '0', num: ''},
    2: {'title': '待下架', state: '1', num: ''},
    3: {'title': '待上架', state: '2', num: ''},
    4: {'title': '已完成', state: '3', num: ''}
  },
  taskType: ['入库作业', '波次作业', '分配订单复核人', '入库订单上架', '入库订单复核', '出库订单拣货', '分配订单上架人'],
  taskStatus: ['待执行', '执行完毕', '取消'],
  inventoryType: {
    0: {'title': '所有', status: null, num: ''},
    1: {'title': '待操作', status: 0, num: ''},
    2: {'title': '正常', status: 1, num: ''},
    3: {'title': '异常', status: 2, num: ''}
  },
  wholeType: {
    0: {'title': '待认领', state: '0', num: ''},
    1: {'title': '待下架', state: '1', num: ''},
    2: {'title': '待复核', state: '2', num: ''},
    3: {'title': '待包装', state: '3', num: ''},
    4: {'title': '任务结束', state: '4', num: ''}
  },
  pieceType: {
    0: {'title': '待认领', state: '0', num: ''},
    1: {'title': '待装箱', state: '1', num: ''},
    2: {'title': '待复核', state: '2', num: ''},
    3: {'title': '待包装', state: '3', num: ''},
    4: {'title': '任务结束', state: '4', num: ''}
  },
  errorType: [
    '追溯码不存在', '追溯码包装类型与复核所需包装类型不匹配', '追溯码对应的批号与复核所需的批号不一致',
    '追溯码对应的货品与需要复核的货品不一致', '追溯码对应的货品的库存批次不存在', '不是小包装的追溯码，而是大包装里的子包装的追溯码',
    '码状态异常', '追溯码已在其他箱中被扫码', '复核的数量超过需要的数量'
  ],
  inHouseType: {
    0: {'title': '待配复核人', status: '0', num: ''},
    1: {'title': '待扫码复核', status: '1', num: ''},
    2: {'title': '待分配货位', status: '2', num: ''},
    3: {'title': '待配上架人', status: '3', num: ''},
    4: {'title': '待上架', status: '4', num: ''},
    5: {'title': '已完成', status: '5', num: ''}
  },
  maintainTaskType: {
    0: {'title': '所有', status: null, num: ''},
    1: {'title': '执行中', status: '0', num: ''},
    2: {'title': '已结束', status: '1', num: ''}
  },
  maintainTaskDetailType: {
    0: {'title': '所有', status: null, num: ''},
    1: {'title': '未养护', status: '0', num: ''},
    2: {'title': '已养护', status: '1', num: ''}
  },
  configurationList: [
    {
      label: '打印服务器IP',
      key: 'printIp',
      value: 'https://print.sinopharm-bio.com:8015',
      default: false
    }
  ],
  packageType: ['第一级包装', '第二级包装', '第三级包装', '第四级包装',
    '第五级包装', '第六级包装', '第七级包装', '第八级包装', '第九级包装', '第十级包装'],
  /**
   * 格式化包装层级, 支持1到99级
   * @param index
   * @returns {string}
   */
  formatPackageType: function (index) {
    if (!index) return '';
    index = parseInt(index, 10);
    return index === 1 ? '散件' : '整件';
  },
  /**
   * 格式化地址，已省/市/区显示
   * @param province
   * @param city
   * @param region
   * @returns {string}
   */
  formatAddress: function (province, city, region) {
    let _address = '';
    this.address.forEach(p => {
      if (province === p.value) {
        if (!p.children) return;
        p.children.forEach(c => {
          if (!c.children) return;
          if (city === c.value) {
            if (!c.children) return;
            c.children.forEach(r => {
              if (region === r.value) {
                _address += p.label + '/' + c.label + '/' + r.label;
              }
              return false;
            });
          }
          return false;
        });
      }
    });
    return _address;
  },

  /**
   * 实时动态强制更改用户录入
   * @param th
   */
  format2DecimalPoint (val) {
    let th = val.toString();
    const regStrs = [
      ['^0(\\d+)$', '$1'], // 禁止录入整数部分两位以上，但首位为0
      ['[^\\d\\.]+$', ''], // 禁止录入任何非数字和点
      ['\\.(\\d?)\\.+', '.$1'], // 禁止录入两个以上的点
      ['^(\\d+\\.\\d{2}).+', '$1'] // 禁止录入小数点后两位以上
    ];
    for (let i = 0; i < regStrs.length; i++) {
      let reg = new RegExp(regStrs[i][0]);
      th = th.replace(reg, regStrs[i][1]);
    }
    th = parseFloat(th);
    if (isNaN(th)) {
      th = '';
    }
    return th;
  },
  /**
   * 录入完成后，输入模式失去焦点后对录入进行判断并强制更改，并对小数点进行0补全
   * @param th
   */
  autoCompleteDecimalPoint: function (val) {
    if (!val) {
      return 0;
    }
    let v = val.toString();
    v = v.replace(/[^0-9\.]*/g, '');
    if (v === '') {
      v = '0.00';
    } else if (v === '0') {
      v = '0.00';
    } else if (v === '0.') {
      v = '0.00';
    } else if (/^0+\d+\.?\d*.*$/.test(v)) {
      v = v.replace(/^0+(\d+\.?\d*).*$/, '$1');
    } else if (/^0\.\d$/.test(v)) {
      v = v + '0';
    } else if (!/^\d+\.\d{2}$/.test(v)) {
      if (/^\d+\.\d{2}.+/.test(v)) {
        v = v.replace(/^(\d+\.\d{2}).*$/, '$1');
      } else if (/^\d+$/.test(v)) {
        v = v + '.00';
      } else if (/^\d+\.$/.test(v)) {
        v = v + '00';
      } else if (/^\d+\.\d$/.test(v)) {
        v = v + '0';
      } else if (/^[^\d]+\d+\.?\d*$/.test(v)) {
        v = v.replace(/^[^\d]+(\d+\.?\d*)$/, '$1');
      } else if (/\d+/.test(v)) {
        v = v.replace(/^[^\d]*(\d+\.?\d*).*$/, '$1');
      } else if (/^0+\d+\.?\d*$/.test(v)) {
        v = v.replace(/^0+(\d+\.?\d*)$/, '$1');
      } else {
        v = '0.00';
      }
    }
    return parseFloat(v);
  },
  /**
   * 录入完成后，输入模式失去焦点后对录入进行判断并强制更改，并对小数点进行0补全
   * @param th
   */
  autoformatDecimalPoint: function (v) {
    v = v.replace(/[^0-9\.]*/g, '');
    if (v === '') {
      v = '0.00';
    } else if (v === '0') {
      v = '0.00';
    } else if (v === '0.') {
      v = '0.00';
    } else if (/^0+\d+\.?\d*.*$/.test(v)) {
      v = v.replace(/^0+(\d+\.?\d*).*$/, '$1');
    } else if (/^0\.\d$/.test(v)) {
      v = v + '0';
    } else if (!/^\d+\.\d{2}$/.test(v)) {
      if (/^\d+\.\d{2}.+/.test(v)) {
        v = v.replace(/^(\d+\.\d{2}).*$/, '$1');
      } else if (/^\d+$/.test(v)) {
        v = v + '.00';
      } else if (/^\d+\.$/.test(v)) {
        v = v + '00';
      } else if (/^\d+\.\d$/.test(v)) {
        v = v + '0';
      } else if (/^[^\d]+\d+\.?\d*$/.test(v)) {
        v = v.replace(/^[^\d]+(\d+\.?\d*)$/, '$1');
      } else if (/\d+/.test(v)) {
        v = v.replace(/^[^\d]*(\d+\.?\d*).*$/, '$1');
      } else if (/^0+\d+\.?\d*$/.test(v)) {
        v = v.replace(/^0+(\d+\.?\d*)$/, '$1');
      } else {
        v = '0.00';
      }
    }
    return v;
  },
  toDecimal2: function (x) {
    return Math.floor(x * 1000 + 1) / 1000;
  },
  hasClass: function (elem, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length === 0) return false;
    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
  },
  addClass: function (elem, cls) {
    if (!this.hasClass(elem, cls)) {
      elem.className = elem.className === '' ? cls : elem.className + ' ' + cls;
    }
  },
  removeClass: function (elem, cls) {
    if (this.hasClass(elem, cls)) {
      let newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
      while (newClass.indexOf(' ' + cls + ' ') >= 0) {
        newClass = newClass.replace(' ' + cls + ' ', ' ');
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
  },
  getSelectLabel: function (key, labelList) {
    let label = '';
    let len = 0;
    if (!Array.isArray(labelList)) {
      len = labelList.length;
      for (let i = 0; i < len; i++) {
        if (labelList[i].key === key) {
          label = labelList.label;
          break;
        }
      }
    }
    return label;
  },
  download (src, fileName) {
    let $a = document.createElement('a');
    $a.setAttribute('href', src);
    $a.setAttribute('download', fileName);
    let fileLink = document.createElement('span');
    fileLink.setAttribute('style', 'cursor: pointer; -webkit-tap-highlight-color: transparent');
    $a.appendChild(fileLink);
    let body = document.getElementsByTagName('body')[0];
    body.appendChild($a);
    fileLink.click();
    body.removeChild($a);
  },
  printLocation(that, obj) {
    let url = 'https://print.sinopharm-bio.com:8015';
    let ary = JSON.parse(window.localStorage.getItem('localConfiguration')) || [];
    ary.forEach(i => {
      if (i.key === 'printIp' && i.value) {
        url = i.value;
      }
    });
    that.$http({
      url: `${url}/print/${obj.type}`,
      method: 'get',
      params: obj,
      timeout: 30000
      // paramsSerializer (params) {
      //   return qs.stringify(params);
      // }
    }).then(res => {
      that.$notify.success({
        message: '打印机正在打印文件'
      });
    }).catch(error => {
      that.$notify.error({
        message: error.response && error.response.data && error.response.msg || '打印失败'
      });
    });
  },
  bindKeyUpEnterEvent (callback) {
    document.onkeydown = e => {
      let event = e || window.event;
      if (event.keyCode === 13) {
        console.log(1);
        callback();
      }
    };
  }
};
