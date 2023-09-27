<style lang="scss" scoped>
@import "../../../assets/scss/mixins";

$leftWidth: 200px;

.min-gutter {
    .el-form-item {
        margin-bottom: 20px;
    }
}

.content-part {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;

    .content-left {
        width: $leftWidth;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        text-align: left;
        background-color: #eef2f3;

        >ul {
            margin: 0;
        }

        >h2 {
            padding: 0;
            margin: 0;
            font-size: 18px;
            font-weight: bold;
            line-height: 55px;
            border-bottom: 1px solid #ddd;
        }

        .list-style {
            cursor: pointer;
            padding: 10px;
            text-align: center;

            span {
                display: inline-block;
                padding: 8px 35px;
            }

            &.active {
                span {
                    background-color: $activeColor;
                    border-radius: 20px;
                    color: $activeColorFont
                }
            }

            &:hover {
                background: #dee9eb
            }

        }

    }

    .content-right {
        >h3 {
            padding: 0;
            margin: 0 0 20px;
            font-size: 18px;
            font-weight: normal;
            line-height: 55px;
            height: 55px;
            border-bottom: 1px solid #ddd;
            text-align: center;
            position: fixed;
            top: 0;
            right: 0;
            left: $leftWidth;
            background: #fff;
            z-index: 2;
        }

        position: absolute;
        top: 0;
        left: $leftWidth;
        right: 0;
        bottom: 0;
        overflow: auto;
        padding-top: 75px;

        .hide-content {
            display: none;
        }

        .show-content {
            padding: 0 20px;
            display: block;
        }
    }

    .min-gutter {
        .el-form-item {
            margin-bottom: 20px;
        }

        .el-form-item__label {
            font-size: 12px
        }
    }
}

.el-form .el-select {
    display: block;
}

.el-form .el-cascader {
    display: block;
}
</style>
<template>
    <div>
        <div class="content-part">
            <div class="content-left">
                <h2 class="clearfix right-title">司机档案</h2>
                <ul>
                    <li class="list-style active">
                        <span>基本信息</span>
                    </li>
                    <li align="center"
                        style="margin-top:40px;position:absolute;bottom:80px;left:0;right:0;text-align: center">
                        <el-button type="primary" @click="onSubmit('baseform')" :disabled="doing">保存</el-button>
                    </li>
                    <li align="center"
                        style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;text-align: center">
                        <el-button @click="doClose">取消</el-button>
                    </li>
                </ul>
            </div>
            <div class="content-right min-gutter">
                <h3>{{ title }}</h3>
                <el-form ref="baseform" :rules="rules" :model="form" label-width="140px" class="min-gutter"
                    @submit.prevent="onSubmit('baseform')" onsubmit="return false" style="padding-right: 20px">
                    <el-form-item label="司机姓名:" prop="driverName">
                        <oms-input type="text" :disabled="action == 'edit'" v-model="form.driverName" placeholder="请输入司机姓名"></oms-input>
                    </el-form-item>
                    <el-form-item label="分  类:" prop="driverType">
                        <el-select placeholder="请选择分类" :disabled="action == 'edit'" v-model="form.driverType" @change="exchangeType">
                            <el-option :label="item.label" :value="item.key" :key="item.key"
                                v-for="item in driverType"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属单位:" prop="carrierId">
                        <el-select placeholder="请选择单位" :disabled="action == 'edit'"  v-model="form.carrierId" @change="exchangeCarrier">
                            <el-option :label="item.carrierName" :value="item.carrierId" :key="item.carrierId"
                                v-for="item in orgLevel"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="工号:" prop="jobNumber"
                        :rules="form.driverType == '1' ? rules.jobNumber : [{ required: false, message: '请输入', trigger: 'blur' }]">
                        <oms-input type="text" :disabled="action == 'edit'" v-model="form.jobNumber" placeholder="请输入工号"></oms-input>
                    </el-form-item>
                    <el-form-item label="手机号码:" prop="driverPhone">
                        <oms-input type="text" v-model="form.driverPhone" placeholder="请输入手机号码" :maxlength="11"></oms-input>
                    </el-form-item>
                    <el-form-item label="身份证号码:" prop="driverIdentity">
                        <oms-input type="text" v-model="form.driverIdentity" placeholder="请输入身份证号码"></oms-input>
                    </el-form-item>
                    <el-form-item label="驾驶证到期日:" prop="licenceEndDate">
                        <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" v-model="form.licenceEndDate"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="从业资格证到期日:" prop="professionEndDate"
                        :rules="form.driverType == '1' ? rules.professionEndDate : [{required: false, message: '请选择日期', trigger: 'change' }]">
                        <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" v-model="form.professionEndDate"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="健康证到期日:" prop="healthEndDate"
                        :rules="form.driverType == '1' ? rules.healthEndDate : [{required: false, message: '请选择日期', trigger: 'change' }]">
                        <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" v-model="form.healthEndDate"></el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable object-shorthand */
import { BaseInfo, plateNumber, User, Carrier } from '@/resources';
import utils from '@/tools/utils';
import axios from 'axios';

export default {
    props: {
        formItem: {
            type: Object,
            default: {},
            required: true
        },
        title: {
            type: String,
            default: '添加'
        },
        action: {
            type: String,
            default: ''
        },
    },
    data: function () {
        return {
            form: {},
            rules: {
                driverName: [{ required: true, message: '请输入司机名称', trigger: 'blur' }],
                carrierId: [{ required: true, message: '请选择承运单位', trigger: 'change' }],
                driverType: [{ required: true, message: '请选择司机类型', trigger: 'change' }],
                jobNumber: [{ required: true, message: '请输入工号', trigger: 'blur' }],
                driverPhone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
                driverIdentity: [{required: true, message: '请输入身份证号', trigger: 'blur' }],
                licenceEndDate: [{required: true, message: '请选择日期', trigger: 'change' }],
                professionEndDate: [{required: true, message: '请选择日期', trigger: 'change' }],
                healthEndDate: [{required: true, message: '请选择日期', trigger: 'change' }],
            },
            doing: false,
            orgLevel: [],  // 所属单位
            carrList: [
                {
                    carrierId: 'GO1',
                    carrierName: '国药控股上海生物医药有限公司',
                }
            ]
        };
    },
    mounted: function () {
    },
    computed: {
        driverType() {
            return this.$getDict('driverType');
        },
    },
    watch: {
        formItem: function (val) {
            if (val.driverId) {
                this.setDhsOrgInfo(val);
            } else {
                this.resetDhsOrgInfo(val);
            }
            this.$nextTick(() => {
                this.$refs.baseform && this.$refs.baseform.clearValidate();
            });
        },
    },
    methods: {
        // 分类事件
        async exchangeType() {
            if (this.form.driverType == 1) {
                this.orgLevel = this.carrList
            } else if (this.form.driverType == 2) {
                await this.getCarrierList()
            }
            this.form.carrierId = ''
            this.form.carrierName = ''
        },
        // 获取启用的承运商
        getCarrierList() {
            new Promise((resolve, reject) => {
                this.orgLevel = []
                let params = {
                    status: '', // ''全部  0待审核 2启用 1禁用
                    carrierName: '', // 承运商名称（模糊查询）
                    transportationConditions: '', // 承运条件 A 全部 B 冷链运输 C 常温运输
                    pageNo: 1,
                    pageSize: 1000,
                }
                Carrier.query(params).then(res => {
                    const { list } = res.data;
                    this.orgLevel = list;
                    resolve()
                })
            })
        },
        // 选择承运商时需要最后id，与name都提交
        exchangeCarrier() {
            this.orgLevel.forEach(item => {
                if (item.carrierId == this.form.carrierId) {
                    this.form.carrierName = item.carrierName
                }
            })
        },
        setDhsOrgInfo: function (val) {
            if (this.form.driverType == 1) {
                this.orgLevel = this.carrList
            } else {
                this.getCarrierList()
            }
            // 字典是字符串
            val.driverType = ''+val.driverType
            if(val.licenceEndDate){
                val.licenceEndDate = this.$moment(val.licenceEndDate).format('YYYY-MM-DD');
            }
            if(val.professionEndDate){
                val.professionEndDate = this.$moment(val.professionEndDate).format('YYYY-MM-DD');
            }
            if(val.healthEndDate){
                val.healthEndDate = this.$moment(val.healthEndDate).format('YYYY-MM-DD');
            }
            this.form = Object.assign({}, val);
            
        },
        resetDhsOrgInfo: function (val) {
            this.form = {
                'driverId': '',
                'driverName': '',
                'jobNumber': '',
                'carrierId': '',
                'carrierName': '',
                'driverType': '',
                'driverPhone': '',
                'driverIdentity': '',
                'licenceEndDate': '',
                'professionEndDate': '',
                'healthEndDate': '',
                'driverStatus': '',
            };
        },
        // 校验 // 驾驶证到期日、从业资格证到期日、健康证到期日  提交提示语
        isOverdue(periodValidity) {
            // 1,大于30天，2,0到30以内 3,小于0
            if (!periodValidity) {
                return 1
            } else {
                let nowTime = this.$moment();
                let endtime = this.$moment(periodValidity);
                let days = endtime.diff(nowTime, 'days', true);  // 第三个参数，是否取整，不加第三个参数，默认四色五入取整，加上true，为实际的有效时间(不取整)
                if (days > 30) {
                    return 1
                } else if (days <= 30 && days > 0) {
                    return 2
                } else {
                    return 3
                }
            }
        },
        onSubmit: function (formName) {
            let self = this;
            this.$refs[formName].validate((valid) => {
                if (!valid || this.doing) {
                    return false;
                }
                let obj = {}
                let a = this.isOverdue(this.form.licenceEndDate)
                let b = this.isOverdue(this.form.professionEndDate)
                let c = this.isOverdue(this.form.healthEndDate)
                obj[a] = a
                obj[b] = b
                obj[c] = c
                if (obj[3]) {
                    // 超期
                    this.$confirm('存在已超期时间，是否确认保存?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.saveInfo()
                    })
                } else if (obj[2]) {
                    // 即将超期
                    this.$confirm('存在即将超期时间，是否确认保存?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.saveInfo()
                    })
                } else {
                    // 正常
                    this.saveInfo()
                }
            });
        },
        saveInfo() {
            let self = this;
            this.doing = true;
            if (this.action === 'add') {
                // 校验工号是否存在   首先判断自有还是委外
                if (self.form.driverType == 1) {  // 自有
                    let obj = {
                        jobNumber: this.form.jobNumber
                    }
                    this.$http.get('/driver-info/checkJobNumber', { params: obj }).then(res => {
                        if (res.data) {
                            this.$http.post('/driver-info', self.form).then(res => {
                                this.doing = false;
                                this.$notify.success({
                                    duration: 2000,
                                    name: '成功',
                                    message: '新增成功'
                                });
                                self.$emit('change', Object.assign({}, self.form));
                            }).catch(error => {
                                this.doing = false;
                                this.$notify.error({
                                    duration: 2000,
                                    name: '失败',
                                    message: error.response && error.response.data && error.response.data.msg || '新增失败'
                                });
                            });
                        } else {
                            this.$message.warning('工号错误，请确认')
                        }
                    })
                } else { // 委外  不校验工号
                    this.$http.post('/driver-info', self.form).then(res => {
                        this.doing = false;
                        this.$notify.success({
                            duration: 2000,
                            name: '成功',
                            message: '新增成功'
                        });
                        self.$emit('change', Object.assign({}, self.form));
                    }).catch(error => {
                        this.doing = false;
                        this.$notify.error({
                            duration: 2000,
                            name: '失败',
                            message: error.response && error.response.data && error.response.data.msg || '新增失败'
                        });
                    });
                }
            } else {
                this.$http.put(`/driver-info/${this.form.driverId}`, self.form).then(() => {
                    this.doing = false;
                    this.$notify.success({
                        duration: 2000,
                        name: '成功',
                        message: '编辑成功'
                    });
                    self.$emit('change', Object.assign({}, self.form));
                })
                .catch(error=>{
                    this.doing = false;
                    this.$notify.error({
                        duration: 2000,
                        name: '失败',
                        message: error.response && error.response.data && error.response.data.msg || '编辑失败'
                    });
                })
            }
        },
        doClose: function () {
            this.$emit('close');
            this.$refs['baseform'].resetFields();
        }
    }
};
</script>
