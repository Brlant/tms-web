<style lang="scss" scoped>
  .order-cost-part {
    padding: 0 8px;
    margin-bottom: 20px;
    background: #f7f7f7;
    line-height: 26px;
    > i {
      margin-right: 10px;
      display: inline-block;
      margin-top: 3px;
    }
  }
</style>
<template>
  <div>
    <div v-if="loadingLog">
      <oms-loading :loading="loadingLog"></oms-loading>
    </div>
    <div v-else-if="orderLogList.length === 0" class="empty-info">
      暂无操作日志信息
    </div>
    <div v-else>
      <div class="order-cost-part">
        <i class="el-icon-time"></i> 订单消耗时间:
        <oms-cost-time :fDate="currentOrder.createTime" :tDate="orderEndTime"></oms-cost-time>
        <el-tag v-if="this.orderEndTime" type="success">已结束</el-tag>
        <el-tag v-if="!this.orderEndTime" type="success">进行中</el-tag>
      </div>
      <Timeline>
        <template v-for="(log,index) in orderLogList">
          <TimelineItem color="green" v-if="log.showDate">
            <i class="iconfont icon-home" slot="dot"></i>
            <h3><span>{{log.dateWeek}}</span></h3>
          </TimelineItem>
          <TimelineItem color="grey">
            <el-row>
              <el-col :span="4">
                <div>{{log.time}}</div>
              </el-col>
              <el-col :span="18"><strong>{{log.actionTitle}}</strong>
                <el-tooltip class="item" effect="dark" v-show="log.operatorName"
                            :content="log.operatorOrgName ? log.operatorOrgName : '平台用户' "
                            placement="right">
                  <span class="font-gray">[{{log.operatorName}}]</span>
                </el-tooltip>
              </el-col>
            </el-row>

          </TimelineItem>
        </template>
      </Timeline>
      <div class="order-cost-part" v-if="orderLogList.length>0">
        <i class="el-icon-time"></i> 订单消耗时间:
        <oms-cost-time :fDate="currentOrder.createTime" :tDate="orderEndTime"></oms-cost-time>
      </div>
    </div>
  </div>
</template>
<script>
import {http} from '@/resources';
import OmsCostTime from '@/components/common/timeCost.vue';

export default {
    components: {OmsCostTime},
    props: {
      currentOrder: {
        type: Object,
        default: function () {
          return {};
        }
      },
      isShow: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loadingLog: true,
        orderLogList: [],
        orderEndTime: ''
      };
    },
    watch: {
      isShow(val) {
        if (val) {
          this.getOrderLoglist();
        }
      }
    },
    methods: {
      getOrderLoglist() {// 获取操作日志
        this.orderLogList = [];
        if (!this.currentOrder.id) return;
        this.loadingLog = true;
        http.get('/order-log/orders/' + this.currentOrder.id).then(res => {
          let dateArr = [];
          res.data.forEach(item => {
            let time = this.$moment(item.operateTime);// .format('YYYY年MM月DD日/dddd');
            item.dateWeek = time.format('YYYY年MM月DD日 dddd');
            item.time = time.format('HH:mm:ss');
            if (dateArr.includes(item.dateWeek)) {
              item.showDate = false;
            } else {
              dateArr.push(item.dateWeek);
              item.showDate = true;
            }
          });
          this.orderLogList = res.data;
          this.loadingLog = false;

          if (this.currentOrder.wmsStatus === '1' && this.orderLogList.length > 0) {
            this.orderEndTime = this.orderLogList[0].operateTime;
          } else {
            this.orderEndTime = '';
          }
        });
      }
    },
    mounted: function () {
      this.getOrderLoglist();
    }
  };
</script>
