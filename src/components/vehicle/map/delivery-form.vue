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

.part-hj-box {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">生成派送</template>
    <template slot="btn">
      <el-button plain @click="save('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :rules="rules" :model="form" class="clearfix" label-width="100px" onsubmit="return false">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{ active: pageSets[0].key === currentTab.key }">
              {{ pageSets[0].name }}</h3>
          </div>
          <div class="content">
            <el-form-item label="运货车辆" prop="carId">
              <el-select filterable remote placeholder="请输入车牌号搜索运货车辆" :remote-method="getCarList"
                         :clearable="true" @change="setCarInfo(form.carId)" @click.native="getCarList('')"
                         v-model="form.carId" popperClass="good-selects" @clear="clearCarInfo">
                <el-option :value="car.carDto.id" :key="car.carDto.id" :label="car.carDto.plateNumber"
                           v-for="car in carList" :disabled="car.carDto.carState == 6">
                  <span style="float: left">{{ car.carDto.plateNumber }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ carStatusList[car.carDto.carState || 0].title }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <div class="info-part">
              <two-column v-if="carInfo.id">
                <el-form-item slot="left" label="车牌号">
                  {{ carInfo.plateNumber }}
                </el-form-item>
                <el-form-item slot="right" label="车型">
                  <dict :dict-group="'carType'" :dict-key="carInfo.type"></dict>
                </el-form-item>
              </two-column>
              <two-column v-if="carInfo.id">
                <el-form-item slot="left" label="车辆容积">
                  {{ carInfo.volume }} <span v-if="carInfo.volume">立方米</span>
                </el-form-item>
                <el-form-item slot="right" label="车辆承重">
                  {{ carInfo.loadBearing }} <span v-if="carInfo.loadBearing">千克</span>
                </el-form-item>
              </two-column>
            </div>
            <two-column>
              <el-form-item slot="left" label="司机" prop="driveId">
                <el-select filterable remote placeholder="请输入名称/拼音首字母缩写搜索" :remote-method="filterUser"
                           :clearable="true" @change="setDriverInfo(form.driveId)" @click.native="filterUser('')"
                           v-model="form.driveId" popperClass="good-selects" @clear="clearDriveInfo">
                  <el-option :value="user.driverId" :key="user.driverId" :label="user.driverName" v-for="user in userList" :disabled="user.driverStatus == 2">
                    <span style="float: left">{{ user.driverName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ driverStatusFn(user.driverStatus) }}</span>
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
                       :clearable="true" @click.native="filterHead('')"
                       v-model="form.head" popperClass="good-selects">
              <el-option :value="user.id" :key="user.id" :label="user.name" v-for="user in headList">
                <div style="overflow: hidden">
                  <span class="pull-left" style="clear: right">{{ user.name }}</span>
                  <span class="pull-right">
                    {{ user.companyDepartmentName }}
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
            <h3 class="tit f-dib index-tit" :class="{ active: pageSets[1].key === currentTab.key }">{{
                pageSets[1].name
              }}
              <span @click="addTallyClerk" class="btn-circle"><i class="el-icon-t-plus"></i> </span>
            </h3>
          </div>
          <div class="content">
            <div class="part-hj-box" v-for="hj in form.clerkDtoList">
              <two-column>
                <el-form-item slot="left" label="外勤客服">
                  <el-select filterable remote placeholder="请输入名称/拼音搜索" :remote-method="filterTallyClerk"
                             @click.native.once="filterTallyClerk('')" :clearable="true" v-model="hj.userId"
                             popperClass="good-selects">
                    <el-option :value="user.id" :key="user.id" :label="user.name" v-for="user in tallyClerkList">
                      <div style="overflow: hidden">
                        <span class="pull-left" style="clear: right">{{ user.name }}</span>
                        <span class="pull-right">
                          {{ user.companyDepartmentName }}
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
            <h3 class="tit f-dib index-tit" :class="{ active: pageSets[2].key === currentTab.key }">{{
                pageSets[2].name
              }}
            </h3>
          </div>
          <div class="content">
            <two-column>
              <el-form-item slot="left" label="任务号" v-show="form.transportTaskNo">
                {{ form.transportTaskNo }}
              </el-form-item>
              <el-form-item :slot="form.type ? 'right' : 'left'" label="任务类型">
                <el-select placeholder="请选择任务类型" v-model="form.type">
                  <el-option :label="item.label" :value="item.key" :key="item.key"
                             v-for="item in deliveryTaskTypeList"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :slot="form.type ? 'left' : 'right'" label="运输条件" prop="transportConditionId"
                            v-if="carInfo.type != 3">
                <el-select placeholder="请选择运输条件" v-model="form.transportConditionId">
                  <el-option :label="item.label" :value="item.key" :key="item.key"
                             v-for="item in transportationConditionList"></el-option>
                </el-select>
              </el-form-item>
            </two-column>
            <two-column>
              <el-form-item slot="left" label="承运商">
                <el-select filterable remote placeholder="名称/拼音/系统代码搜索承运商" :remote-method="filterTaskCarriers"
                           :clearable="true" v-model="form.taskCarriers" popperClass="good-selects">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{ org.name }}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{ org.manufacturerCode }}
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
                <oms-input v-model="form.carVolume" placeholder="请输入车辆容积" @blur="setGoodsVolume(form.carVolume)">
                  <template slot="append">m³</template>
                </oms-input>
              </el-form-item>
            </two-column>
            <el-form-item label="派送要求">
              <oms-input v-model="form.remark" type="textarea" placeholder="请输入派送要求"></oms-input>
            </el-form-item>
          </div>
          <div class="hr mb-10"></div>
        </div>
        <!-- 区域信息 -->
        <div class="form-header-part" v-if="!pageSets[3].showFlag">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{ active: pageSets[3].key === currentTab.key }">{{
                pageSets[3].name
              }}
            </h3>
          </div>
          <div class="content">
            <el-table :data="form.areaInfoList" border style="width: 100%">
              <el-table-column prop="areaName" label="区域名称" width="180">
              </el-table-column>
              <el-table-column prop="transportConditionId" label="运输条件" width="180">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.transportConditionId" placeholder="请选择..." clearable
                             @change="areaTransport(scope.row.transportConditionId, scope.$index)">
                    <el-option :label="item.label" :value="item.key" :key="item.key"
                               v-for="item in transportationConditionList"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="ids" label="承运单号">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.ids" placeholder="请选择..." multiple
                             @change="areaWaybillNumber(scope.row.ids, scope.$index)">
                    <el-option :label="item.waybillNumber" :value="item.id" :key="item.id"
                               v-for="(item, index) in acceptList" :disabled="item.disabled">
                      <span style="float: left">{{ item.waybillNumber }}</span>
                      <span style="float: right;font-size: 13px">
                        <dict :dict-group="'transportationCondition'" :dict-key="item.shipmentWay"></dict>
                      </span>
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
import {BaseInfo, CarArchives, TransportTask, User} from '@/resources';
import utils from '@/tools/utils';

export default {
    data () {
      return {
        rules: {
          'carId': [
            {required: true, message: '请选择运货车辆', trigger: 'change'}
          ],
          'driveId': [
            {required: true, message: '请选择司机', trigger: 'change'}
          ],
          'head': [
            {required: true, message: '请选择负责人', trigger: 'change'}
          ],
          'transportConditionId': [
            {required: true, message: '请选择运输条件', trigger: 'change'}
          ]
        },
        list: [],
        times: [],
        carList: [],
        // 车辆状态 1，运输、2：空闲、 3：维修 4：停用  5：报废 6: 异常  7: 即将超期
        carStatusList: [
          {title: '', status: ''},
          {title: '运输', status: 1},
          {title: '空闲', status: 2},
          {title: '维修', status: 3},
          {title: '停用', status: 4},
          {title: '报废', status: 5},
          {title: '异常', status: 6},
          {title: '即将超期', status: 7}, 
        ],
        // 司机状态 // 0-停用；1-正常；2-异常；3-即将超期
        driverStatus:[
          { label:'停用',value:0,},
          { label:'正常',value:1,},
          { label:'异常',value:2,},
          { label:'即将超期',value:3,},
        ],
        carInfo: {},
        form: {
          driveId: '',
          driverPhone: '',
          jobNumber:'',
          transportConditionId:'',
          head: '',
          orderIdList: [],
          clerkDtoList: [{userId: '', userPhone: ''}]
        },
        doing: false,
        userList: [],
        headList: [],
        tallyClerkList: [],
        orgList: [],
        pageSets: [
          {name: '车辆选择', key: 0},
          {name: '外勤客服信息', key: 1},
          {name: '派送信息', key: 2},
          { name: '区域信息', key: 3, showFlag: true },
        ],
        currentTab: {},
        acceptList: [],
        transportationConditionArr: [],  // 运输条件 字典全部数据
      };
    },
    computed: {
      deliveryTaskTypeList () {
        return this.$getDict('deliveryTaskType');
      },
      // 派送信息-运输条件 过滤筛选
      transportationConditionList() {
        let arr = this.$getDict('transportationCondition');
        this.transportationConditionArr = JSON.parse(JSON.stringify(arr))
        let array = []
        array = arr.filter(item => {
          return this.tackerList.find(prop => {
            return prop.shipmentWay == item.key
          })
        })
        // 若已勾选订单均为相同运输条件，则运输条件默认显示已选运单运输条件
        if (array.length == 1) {
          console.log();
          this.form.transportConditionId = array[0].key
        }
        return array
      },
    },
    props: ['checkList', 'tackerList'],
    watch: {
      checkList: {
        handler: function (val) {
          this.form = {
            driveId: '',
            driverPhone: '',
            head: '',
            jobNumber:'',
            transportConditionId:"",
            orderIdList: [],
            areaInfoList: [
              {areaName: 'A区', transportConditionId: '', ids: [], isConsistent: true,isAll:0},
              {areaName: 'B区', transportConditionId: '', ids: [], isConsistent: true,isAll:0},
              {areaName: 'C区', transportConditionId: '', ids: [], isConsistent: true,isAll:0},
            ],
            clerkDtoList: [{userId: '', userPhone: ''}]
          };
          this.$nextTick(()=>{
            this.$refs.form && this.$refs.form.clearValidate();
          })
          this.acceptList = this.tackerList.map(item => item)
          this.carInfo = {};
          this.form.orderIdList = val;
          // this.setDefaultDriver();
        },
        deep: true
      },
      //去除已经选中的运单号  // 承运单号列表
      'form.areaInfoList': {
        handler: function (val) {
          if (val.length != 0) {
            let list = JSON.parse(JSON.stringify(this.acceptList))
            this.acceptList = []
            list.forEach((item) => {
              let i = val.find((i) => i.ids.includes(item.id))
              item.disabled = i ? true : false
            })
            this.acceptList = list
          }
        },
        deep: true
      }
      // carInfo: function (val) {
      //   if (val) {
      //     this.form.carPlateNumber = val.plateNumber;
      //     if (val.defaultDriver) {
      //       this.filterUser(val.defaultDriverName);
      //       this.filterHead(val.headName);
      //       this.form.driveId = val.defaultDriver;
      //     } else {
      //       this.form.driveId = '';
      //     }
      //   }
      // }
    },
    methods: {
       // 区域信息-承运单号
      areaWaybillNumber(val, index) {
        let transportConditionId = this.form.areaInfoList[index].transportConditionId  // 获取当前行的运输条件
        // 先判断当前行的运输条件是否存在
        if (transportConditionId) {
          let arr = this.acceptList.filter(item => val.includes(item.id))
          if (arr.length != 0) {
            let flag = arr.every(item => {
              return item.shipmentWay == transportConditionId
            })
            this.form.areaInfoList[index].isConsistent = flag
          } else {
            this.form.areaInfoList[index].isConsistent = true
          }
        } else {  // 不存在直接置为true
          this.form.areaInfoList[index].isConsistent = true
        }
        // 
        if(!transportConditionId && val.length == 0){
          this.form.areaInfoList[index].isAll = 0
        }else if(transportConditionId && val.length > 0){
          this.form.areaInfoList[index].isAll = 2
        }else {
          this.form.areaInfoList[index].isAll = 1
        }
      },
      // 区域信息-运输条件
      areaTransport(val, index) {
        let ids = this.form.areaInfoList[index].ids  // 获取当前行的承运单号
        // 先判断当前行的承运单号是否存在
        if (ids.length != 0) {
          let arr = this.acceptList.filter(item => ids.includes(item.id))
          if (arr.length != 0) {
            let flag = arr.every(item => {
              return item.shipmentWay == val
            })
            this.form.areaInfoList[index].isConsistent = flag
          } else {
            this.form.areaInfoList[index].isConsistent = true
          }
        } else {
          this.form.areaInfoList[index].isConsistent = true
        }
        // 
        if(!val && ids.length == 0){
          this.form.areaInfoList[index].isAll = 0
        }else if(val && ids.length > 0){
          this.form.areaInfoList[index].isAll = 2
        }else {
          this.form.areaInfoList[index].isAll = 1
        }
      },
      // 司机状态回显
      driverStatusFn(val){
         return this.driverStatus.find(item=> item.value == val).label
      },
      setDefaultDriver: function () {
        let conditon = {
          pageNo: 1,
          pageSize: 1,
          status: 3
        };
        let statusCount = utils.carTaskType;
        if (statusCount['2'].num > 0) {
          conditon.status = 2;
        }
        if (statusCount['1'].num > 0) {
          conditon.status = 1;
        }
        if (statusCount['0'].num > 0) {
          conditon.status = 0;
        }
        let params = JSON.parse(JSON.stringify(conditon));
        this.$http.get('/transport-task', {params}).then((res) => {
          this.form.driveId = res.data.list[0].driveId;
          this.form.driverPhone = res.data.list[0].driverPhone;
          this.form.head = res.data.list[0].head;
          this.filterUser(res.data.list[0].driverName);
          this.filterHead(res.data.list[0].headName);
        });
      },
      selectTab (item) {
        this.currentTab = item;
      },
      remove: function (item) {
        let index = this.form.clerkDtoList.indexOf(item);
        // 移除删除项
        this.form.clerkDtoList.splice(index, 1);
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
      addTallyClerk: function () {
        let tpl = {};
        // 计算排序值
        tpl = Object.assign(tpl, {userId: '', userPhone: ''});
        this.form.clerkDtoList.splice(0, 0, tpl);
        this.filterTallyClerk();
      },
      filterTaskCarriers: function (query) {// 过滤承运商
        BaseInfo.query({keyWord: query}).then(res => {
          this.orgList = res.data.list;
        });
      },
      clearCarInfo: function () {
        this.form.carId = '';
        this.form.driveId = '';
        this.form.driverPhone = '';
        this.form.jobNumber = ''
        this.carInfo = {};
      },
      clearDriveInfo: function () {
        this.form.driveId = '';
        this.form.driverPhone = '';
        this.form.jobNumber = ''
      },
      filterUser: function (query) {
        let data =Object.assign({},{
          keyWord:query,
          driverType:1,   // 自有司机
        })
        this.$http.post('/driver-info/queryOwnDriver',data).then(res=>{
          this.userList = res.data
        })
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
          this.headList = res.data.list;
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
          this.form.clerkDtoList.forEach(val => {
            if (val.userId !== '') {
              let index = userIdList.indexOf(val.userId);
              if (index === -1 && val.userId) {
                User.queryInfo(val.userId).then(res => {
                  userList.push({id: val.userId, name: res.data.name});
                });
              }
            }
          });
          this.tallyClerkList = userList;
        });
      },
      getCarList: function (query) {
        let data = {
          keyword:query,
          ascriptionCompany:'GO1',  // 国控生物公司
        }
        this.$http.post('/car-archives/queryCarByCondition',data).then(res=>{
          this.carList = res.data;
        })
      },
      setCarInfo: function (id) {
        if (id) {
          this.carList.forEach(val => {
            if (val.carDto.id === id) {
              this.carInfo = val.carDto;
              //若为三温车
              if (val.carDto.type == 3) {
                let arr = [
                  {name: '车辆选择', key: 0},
                  {name: '外勤客服信息', key: 1},
                  {name: '派送信息', key: 2},
                  {name: '区域信息', key: 3, showFlag: false},
                ]
                this.pageSets = arr
                // 还要清空区域信息内容
                let areaInfoList = [
                  {areaName: 'A区', transportConditionId: '', ids: [], isConsistent: true,isAll:0},
                  {areaName: 'B区', transportConditionId: '', ids: [], isConsistent: true,isAll:0},
                  {areaName: 'C区', transportConditionId: '', ids: [], isConsistent: true,isAll:0},
                ]
                this.form.areaInfoList = areaInfoList
              } else {
                let arr = [
                  {name: '车辆选择', key: 0},
                  {name: '外勤客服信息', key: 1},
                  {name: '派送信息', key: 2},
                  {name: '区域信息', key: 3, showFlag: true},
                ]
                this.pageSets = arr
              }
            }
          });
        }
      },
      setDriverInfo: function (id) {
        if (id) {
          this.userList.forEach(val => {
            if (id === val.driverId) {
              this.form.driveId = val.driverId;
              this.form.driverPhone = val.driverPhone;
              this.form.jobNumber = val.jobNumber
            }
          });
        }
      },
      save (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            // 处理外勤客服列表
            if (this.form.clerkDtoList) {
              let list = [];
              this.form.clerkDtoList.forEach(val => {
                if (val.userId !== '') {
                  list.push(val);
                }
              });
              this.form.clerkDtoList = list;
            }
             // 若为三温车 校验区域信息
            if (this.carInfo.type == 3) {
              if (this.form.areaInfoList.some((val) => val.isAll == 1)) {  // 存在填了一条未完整的信息
                this.$notify.warning({
                  message: '启用区域时必选运输条件及运单号，请确认'
                });
                return
              } else if (this.form.areaInfoList.some((val) => val.isAll == 2)){ // 存在填了一条完整的信息
                  // 获取勾选的运单号数量
                let infoNum = this.waybillList.length
                let num = 0
                this.form.areaInfoList.forEach(item => {
                  num += item.ids.length
                })
                if (num != infoNum) {
                  this.$notify.warning({
                    message: '存在未分配区域的运单，请确认'  
                  });
                  return
                }
                // 判断
                let flag = this.form.areaInfoList.every(item => {
                  return item.isConsistent == true
                })
                if (flag) {
                  //三温车 需要清除掉运输条件
                  this.form.transportConditionId = ''
                  this.sure()
                } else {
                  this.$confirm('已勾选运单运输条件与区域温度不一致，是否确认同运输?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    //三温车 需要清除掉运输条件
                    this.form.transportConditionId = ''
                    this.sure()
                  })
                }
              } else {  // 一条的信息都没填
                this.$notify.warning({
                  message: '三温车必须填写一个及以上区域信息，请确认'
                });
                return
              }
              // let flag = true
              // this.form.areaInfoList.forEach(item=>{
              //   if(item.ids.length>0 && !item.transportConditionId){
              //     flag = false
              //   }
              // })
              // // 判断区域信息至少填写了一条数据，然后再判断承运单号下拉框里面(有运单号就必须填写运输条件)
              // if (flag) {
              //   // 获取勾选的运单号数量
              //   let infoNum = this.acceptList.length
              //   let num = 0
              //   this.form.areaInfoList.forEach(item => {
              //     num += item.ids.length
              //   })
              //   if (num != infoNum) {
              //     this.$notify.warning({
              //       message: '存在未分配区域的运单，请确认'  
              //     });
              //     return
              //   }
              //   // 判断
              //   let flag = this.form.areaInfoList.every(item => {
              //     return item.isConsistent == true
              //   })
              //   if (flag) {
              //     //三温车 需要清除掉运输条件
              //     this.form.transportConditionId = ''
              //     this.sure()
              //   } else {
              //     this.$confirm('已勾选运单运输条件与区域温度不一致，是否确认同运输?', '提示', {
              //       confirmButtonText: '确定',
              //       cancelButtonText: '取消',
              //       type: 'warning'
              //     }).then(() => {
              //       //三温车 需要清除掉运输条件
              //       this.form.transportConditionId = ''
              //       this.sure()
              //     })
              //   }
              // } else {
              //   this.$notify.warning({
              //     message: '三温车必须填写一个及以上区域信息，请确认'
              //   });
              //   return
              // }
          } else {
            // 非三温车，需要清除区域信息
            this.form.areaInfoList = []
            this.sure()
          }
        } else {

        }
      });

    },
    //
    sure() {
      this.doing = true;
      TransportTask.save(this.form).then(res => {
        this.$notify.success({
          duration: 2000,
          name: '成功',
          message: '新增派送任务成功'
        });
        this.doing = false;
        // 清空表单
        this.$emit('change', res.data);
        this.$emit('right-close');
      }).catch(error => {
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '新增派送任务失败'
        });
        this.doing = false;
      });
    }
  }
};
</script>
