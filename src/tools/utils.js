import {Address} from '@dtop/dtop-web-common';
import moment from 'moment';

export default {
  address: Address.value,
  orderType: {
    0: {'title': '待生成运单', status: '0', num: ''},
    1: {'title': '待派车', status: '1', num: ''},
    2: {'title': '待启运', status: '2', num: ''},
    3: {'title': '待送达', status: '3', num: ''},
    4: {'title': '已完成', status: '4', num: ''},
    5: {'title': '已取消', status: '5', num: ''}
  },
  wayBillType: {
    0: {'title': '所有', status: null, num: ''},
    1: {'title': '待确认', status: '-2', num: ''},
    2: {'title': '待打包', status: '-1', num: ''},
    3: {'title': '待派车', status: '0', num: ''},
    4: {'title': '待启运', status: '1', num: ''},
    5: {'title': '待送达', status: '2', num: ''},
    6: {'title': '待完成', status: '7', num: ''},
    7: {'title': '已完成', status: '3', num: ''},
    8: {'title': '已取消', status: '4', num: ''},
    9: {'title': '质量待评估', status: '5', num: ''},
    10: {'title': '已中止', status: '6', num: ''}
  },
  carTaskType: {
    0: {'title': '待确认', status: '0', num: ''},
    1: {'title': '待开始', status: '1', num: ''},
    2: {'title': '待结束', status: '2', num: ''},
    3: {'title': '已完成', status: '3', num: ''},
    4: {'title': '已取消', status: '4', num: ''}
  },
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
        _address += p.label;
        if (!p.children) return;
        p.children.forEach(c => {
          if (!c.children) return;
          if (city === c.value) {
            _address += ('/' + c.label);
            if (!c.children) return;
            c.children.forEach(r => {
              if (region === r.value) {
                _address += ('/' + r.label);
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
  printLocation (that, obj) {
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
        message: error.response && error.response.data && error.response.data.msg || '打印失败'
      });
    });
  },
  getPos (e) {//这是一个 获取鼠标位置的函数
    let oEvent = e || event;
    return {
      x: oEvent.clientX + document.documentElement.scrollLeft || document.body.scrollLeft,
      y: oEvent.clientY + document.documentElement.scrollTop || document.body.scrollTop
    };
  },
  bindKeyUpEnterEvent (callback) {
    document.onkeydown = e => {
      let event = e || window.event;
      if (event.keyCode === 13) {
        callback();
      }
    };
  },
  formatTimeAry (times, index, str) {
    if (!times) return;
    return this.formatTime(times[index], str);
  },
  formatTime (time, str = 'YYYY-MM-DD HH:mm:ss') {
    return time ? moment(time).format(str) : '';
  }

};
