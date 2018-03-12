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
  <div class="content-part">
    <div class="content-right content-padding">
      <h3>生成派送</h3>
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib">车辆选择</h3>
          </div>
          <div class="content">
            <el-form-item label="运货车辆" prop="receiverId">
              <el-select filterable remote placeholder="请输入车牌号搜索运货车辆" :remote-method="getCarList"
                         :clearable="true" @change="setCarInfo(form.carId)"
                         v-model="form.carId" popperClass="good-selects">
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
                           :clearable="true"
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
          <div class="hr mb-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib">派送信息</h3>
          </div>
          <div class="content">
            <el-form-item label="承运商">
              <oms-input v-model="form.taskCarriers" placeholder="请输入承运商"></oms-input>
            </el-form-item>
            <two-column>
              <el-form-item slot="left" label="任务类型">
                <el-select placeholder="请选择车型" v-model="form.type">
                  <el-option :label="item.label" :value="item.key" :key="item.key"
                             v-for="item in deliveryTaskTypeList"></el-option>
                </el-select>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="理货员">
                <el-select filterable remote placeholder="请输入名称/拼音首字母缩写搜索" :remote-method="filterTallyClerk"
                           :clearable="true"
                           v-model="form.tallyClerkId" popperClass="good-selects">
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
              <el-form-item slot="right" label="理货员电话">
                <oms-input v-model="form.tallyClerkPhone" placeholder="请输入理货员电话"></oms-input>
              </el-form-item>
            </two-column>
            <el-form-item label="派送要求">
              <oms-input v-model="form.remark" type="textarea" placeholder="请输入派送要求"></oms-input>
            </el-form-item>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <el-row class="text-center" style="margin-right: 80px">
          <el-form-item>
            <el-button type="primary" @click="save('form')" :disabled="doing">保存</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
  import {CarArchives, TransportTask, User} from '@/resources';

  export default {
    data () {
      return {
        rules: {
          'driveId': [
            {required: true, message: '请输入司机', trigger: 'blur'}
          ]
        },
        list: [],
        times: [],
        carList: [],
        carInfo: {},
        form: {
          orderIdList: []
        },
        doing: false,
        userList: [],
        tallyClerkList: []
      };
    },
    computed: {
      deliveryTaskTypeList() {
        return this.$getDict('deliveryTaskType');
      }
    },
    props: ['checkList'],
    watch: {
      checkList: {
        handler: function (val) {
          this.form.orderIdList = val;
        },
        deep: true
      },
      carInfo: function (val) {
        if (val) {
          console.log(val);
          this.form.carPlateNumber = val.plateNumber;
          if (val.defaultDriver) {
            this.form.driveId = val.defaultDriver;
            this.filterUser(val.defaultDriverName);
          }
        }
      }
    },
    methods: {
      filterUser: function (query) {
        let data = Object.assign({}, {
          pageNo: 1,
          pageSize: 20,
          objectId: 'oms-system',
          keyWord: query,
          status: 1
        });
        User.query(data).then(res => {
          this.userList = res.data.list;
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
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.doing = true;
            TransportTask.save(this.form).then(res => {
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '新增派送任务成功'
              });
              this.doing = false;
              this.$emit('change', res.data);
              this.$emit('right-close');
            }).catch(error => {
              this.$notify.error({
                message: error.response.data && error.response.data.msg || '新增派送任务失败'
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
