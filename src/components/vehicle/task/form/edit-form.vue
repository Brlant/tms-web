<style lang="scss" scoped>
  .content-part {
    .content-right {
      > h3 {
        left: 0;
      }
      left: 0;
    }
  }

  .info-part {
    .el-form-item {
      margin-bottom: 0;
    }
  }
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">编辑出车任务</template>
    <template slot="btn">
      <el-button plain @click="save('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">{{pageSets[0].name}}
            </h3>
          </div>
          <div class="content">
            <el-form-item label="运货车辆" prop="carId">
              <el-select filterable remote placeholder="请输入车牌号搜索运货车辆" :remote-method="getCarList"
                         :clearable="true" @change="setCarInfo(form.carId)"
                         v-model="form.carId" popperClass="good-selects" @clear="clearCarInfo">
                <el-option :value="car.carDto.id" :key="car.carDto.id" :label="car.carDto.plateNumber"
                           v-for="car in carList">
                </el-option>
              </el-select>
            </el-form-item>
            <div class="info-part">
              <two-column v-if="carInfo.id">
                <el-form-item slot="left" label="车牌号">
                  {{carInfo.plateNumber}}
                </el-form-item>
                <el-form-item slot="right" label="车型">
                  <dict :dict-group="'carType'" :dict-key="carInfo.type"></dict>
                </el-form-item>
              </two-column>
              <two-column v-if="carInfo.id">
                <el-form-item slot="left" label="车辆容积">
                  {{carInfo.volume}} <span v-if="carInfo.volume">立方米</span>
                </el-form-item>
                <el-form-item slot="right" label="车辆承重">
                  {{carInfo.loadBearing}} <span v-if="carInfo.loadBearing">千克</span>
                </el-form-item>
              </two-column>
            </div>
            <two-column>
              <el-form-item slot="left" label="司机" prop="driveId">
                <el-select filterable remote placeholder="请输入名称/拼音首字母缩写搜索" :remote-method="filterUser"
                           :clearable="true" @change="setDriverInfo(form.driveId)"
                           v-model="form.driveId" popperClass="good-selects">
                  <el-option :value="user.id" :key="user.id" :label="user.name" v-for="user in userList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{user.name}}</span>
                      <span class="pull-right">
                        {{user.companyDepartmentName}}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item slot="right" label="司机电话">
                <oms-input v-model="form.driverPhone" placeholder="请输入司机电话"></oms-input>
              </el-form-item>
            </two-column>
          </div>
          <el-form-item slot="left" label="负责人" prop="head">
            <el-select filterable remote placeholder="请输入名称/拼音首字母缩写搜索" :remote-method="filterHead"
                       :clearable="true" @click.native.once="filterHead('')" @change="setHeadNameInfo(form.head)"
                       v-model="form.head" popperClass="good-selects">
              <el-option :value="user.id" :key="user.id" :label="user.name" v-for="user in headList">
                <div style="overflow: hidden">
                  <span class="pull-left" style="clear: right">{{user.name}}</span>
                  <span class="pull-right">
                        {{user.companyDepartmentName}}
                  </span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">{{pageSets[1].name}}
              <span @click="addTallyClerk" class="btn-circle"><i class="el-icon-t-plus"></i> </span>
            </h3>
          </div>
          <div class="content">
            <div class="part-hj-box" v-for="hj in form.tallyClerkDtoList">
              <two-column>
                <el-form-item slot="left" label="外勤客服">
                  <el-select filterable remote placeholder="请输入名称/拼音搜索" :remote-method="filterTallyClerk"
                             :clearable="true" v-model="hj.userId" popperClass="good-selects">
                    <el-option :value="user.id" :key="user.id" :label="user.name" v-for="user in tallyClerkList">
                      <div style="overflow: hidden">
                        <span class="pull-left" style="clear: right">{{user.name}}</span>
                        <span class="pull-right">
                        {{user.companyDepartmentName}}
                      </span>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item slot="right" label="外勤客服电话">
                  <oms-input v-model="hj.userPhone" placeholder="请输入外勤客服电话"></oms-input>
                </el-form-item>
              </two-column>
              <el-form-item label-width="120px">
                <el-button @click.prevent="remove(hj)" :plain="true" type="danger">删除外勤客服</el-button>
              </el-form-item>
            </div>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[2].key === currentTab.key}">{{pageSets[2].name}}
            </h3>
          </div>
          <div class="content">
            <two-column>
              <el-form-item slot="left" label="任务号">
                {{form.transportTaskNo}}
              </el-form-item>
              <el-form-item slot="right" label="任务类型">
                <el-select placeholder="请选择车型" v-model="form.type">
                  <el-option :label="item.label" :value="item.key" :key="item.key"
                             v-for="item in deliveryTaskTypeList"></el-option>
                </el-select>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="承运商">
                <el-select filterable remote placeholder="名称/拼音/系统代码搜索承运商" :remote-method="filterTaskCarriers"
                           :clearable="true"
                           v-model="form.taskCarriers" popperClass="good-selects">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{org.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                      <span>系统代码:</span>{{org.manufacturerCode}}
                    </span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item slot="right" label="包件数" prop="incubatorCount">
                <oms-input type="number" :min="0" v-model="form.incubatorCount" placeholder="请输入包件数"
                           @blur="setIncubatorCount(form.incubatorCount)"></oms-input>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="载重" prop="goodsWeight">
                <oms-input v-model="form.carLoadBearing" placeholder="请输入车辆载重"
                           @blur="setGoodsWeight(form.carLoadBearing)">
                  <template slot="append">kg</template>
                </oms-input>
              </el-form-item>
              <el-form-item slot="right" label="容积" prop="goodsVolume">
                <oms-input v-model="form.carVolume" placeholder="请输入车辆容积"
                           @blur="setGoodsVolume(form.carVolume)">
                  <template slot="append">m³</template>
                </oms-input>
              </el-form-item>
            </two-column>
            <el-form-item label="派送要求">
              <oms-input v-model="form.remark" type="textarea" placeholder="请输入派送要求"></oms-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
import {BaseInfo, CarArchives, TransportTask, User} from '@/resources';
import TwoColumn from '@dtop/dtop-web-common/packages/two-column';

export default {
    components: {TwoColumn},
    data() {
      return {
        rules: {
          'carId': [
            {required: true, message: '请选择运货车辆', trigger: 'change'}
          ],
          'driveId': [
            {required: true, message: '请选择司机', trigger: 'change'}
          ]
        },
        list: [],
        times: [],
        carList: [],
        carInfo: {},
        form: {
          orderIdList: [],
          tallyClerkDtoList: [{
            id: '',
            index: '',
            userId: '',
            userName: '',
            userPhone: ''
          }]
        },
        doing: false,
        userList: [],
        headList: [],
        tallyClerkList: [],
        orgList: [],
        pageSets: [
          {name: '车辆选择', key: 0},
          {name: '外勤客服信息', key: 1},
          {name: '派送信息', key: 2}
        ],
        currentTab: {}
      };
    },
    computed: {
      deliveryTaskTypeList() {
        return this.$getDict('deliveryTaskType');
      }
    },
    props: ['formItem'],
    watch: {
      checkList: {
        handler: function (val) {
          this.form.orderIdList = val;
        },
        deep: true
      },
      carInfo: function (val) {
        if (val) {
          this.form.carPlateNumber = val.plateNumber;
          if (val.defaultDriver) {
            this.filterUser(val.defaultDriverName);
            this.form.driveId = val.defaultDriver;
          } else {
            this.form.driveId = '';
          }
        }
      },
      formItem: function (val) {
        if (val.id) {
          TransportTask.getOneTransportTask(val.id).then(res => {
            this.form = res.data;
            this.filterUser(this.form.driverName);
            this.filterHead(this.form.headName);
            this.getCarList(this.form.carPlateNumber);
            this.filterTaskCarriers(this.form.taskCarriersName);
            if (this.form.tallyClerkDtoList.length !== 0) {
              this.form.tallyClerkDtoList.forEach(val => {
                val.index = this.form.tallyClerkDtoList.indexOf(val) + 1;
                this.filterTallyClerk(val.userName);
              });
            } else {
              this.form.tallyClerkDtoList = [{userId: '', userPhone: ''}];
            }
          });
        }
      }
    },
    methods: {
      selectTab(item) {
        this.currentTab = item;
      },
      remove: function (item) {
        let index = this.form.tallyClerkDtoList.indexOf(item);
        // 移除删除项
        this.form.tallyClerkDtoList.splice(index, 1);
      },
      addTallyClerk: function () {
        let tpl = {};
        // 计算排序值
        tpl = Object.assign(tpl, {userId: '', userPhone: ''});
        this.form.tallyClerkDtoList.splice(0, 0, tpl);
        this.filterTallyClerk();
      },
      filterTaskCarriers: function (query) {// 过滤承运商
        BaseInfo.query({keyWord: query}).then(res => {
          this.orgList = res.data.list;
        });
      },
      setIncubatorCount: function (value) {
        if (!value || isNaN(value)) return;
        this.form.incubatorCount = parseInt(value, 10);
      },
      setGoodsWeight: function (value) {
        if (!value || isNaN(value)) return;
        this.form.goodsWeight = parseFloat(value);
      },
      setGoodsVolume: function (value) {
        if (!value || isNaN(value)) return;
        this.form.goodsVolume = parseFloat(value);
      },
      clearCarInfo: function () {
        this.form.carId = '';
        this.form.driveId = '';
        this.form.driverPhone = '';
        this.form.driverName = '';
        this.carInfo = {};
      },
      filterHead: function (query) {
        let data = Object.assign({}, {
          pageNo: 1,
          pageSize: 20,
          objectId: 'oms-system',
          keyWord: query,
          status: 1
        });
        User.query(data).then(res => {
          if (res.data.list.length === 0) {
            this.headList.push({id: this.form.head, name: this.form.headName});
          } else {
            this.headList = res.data.list;
          }
        });
      },
      filterUser: function (query) {
        let data = Object.assign({}, {
          pageNo: 1,
          pageSize: 20,
          objectId: 'oms-system',
          keyWord: query,
          status: 1
        });
        User.query(data).then(res => {
          if (res.data.list.length === 0) {
            this.userList.push({id: this.form.driveId, name: this.form.driverName});
          } else {
            this.userList = res.data.list;
          }
        });
      },
      filterTallyClerk: function (query) {
        let data = Object.assign({}, {
          pageNo: 1,
          pageSize: 20,
          objectId: 'oms-system',
          keyWord: query,
          status: 1
        });
        User.query(data).then(res => {
          let userList = res.data.list;
          // 判断已选择的数据列表里是否存在
          let userIdList = [];
          userList.forEach(res => {
            userIdList.push(res.id);
          });
          this.form.tallyClerkDtoList.forEach(val => {
            if (val.userId !== '') {
              let index = userIdList.indexOf(val.userId);
              if (index === -1 && val.userId) {
                User.queryInfo(val.userId).then(res => {
                  userList.push({id: val.userId, name: res.data.name});
                });
              }
            }
          });
          this.tallyClerkList = res.data.list;
        });
      },
      getCarList: function (query) {
        let param = Object.assign({}, {
          keyword: query
        });
        CarArchives.query(param).then(res => {
          this.carList = res.data.list;
        });
      },
      setCarInfo: function (id) {
        if (id) {
          this.carList.forEach(val => {
            if (val.carDto.id === id) {
              this.carInfo = val.carDto;
            }
          });
        }
      },
      setHeadNameInfo: function (id) {
        if (id) {
          this.headList.forEach(val => {
            if (val.id === id) {
              this.form.head = val.id;
              this.form.headName = val.name;
            }
          });
        }
      },
      setDriverInfo: function (id) {
        if (id) {
          this.userList.forEach(val => {
            if (val.id === id) {
              this.form.driveId = val.id;
              this.form.driverPhone = val.phone;
              this.form.driverName = val.name;
            }
          });
        }
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.doing = true;
            // 处理外勤客服列表
            if (this.form.tallyClerkDtoList) {
              let list = [];
              this.form.tallyClerkDtoList.forEach(val => {
                if (val.userId !== '') {
                  list.push(val);
                }
              });
              this.form.tallyClerkDtoList = list;
            }
            TransportTask.update(this.form.id, this.form).then(res => {
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '编辑派送任务成功'
              });
              this.doing = false;
              this.$emit('change', res.data);
              this.$emit('right-close');
            }).catch(error => {
              this.$notify.error({
                message: error.response&&error.response.data && error.response.data.msg || '编辑派送任务失败'
              });
              this.doing = false;
            });

          } else {

          }
        });

      }
    }
  };
</script>
