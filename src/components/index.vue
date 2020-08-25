<style lang="scss">

  /*.d-table {*/
  /*min-height: 500px;*/
  /*}*/

  @-webkit-keyframes bouncedelay {
    0%, 80%, 100% {
      -webkit-transform: scale(0)
    }
    40% {
      -webkit-transform: scale(1)
    }
  }

  @keyframes bouncedelay {
    0%, 80%, 100% {
      transform: scale(0)
    }
    40% {
      transform: scale(1)
    }
  }

  .layer-loading {
    text-align: center;
    background: #f9f9f9;
    padding-top: 15rem;
    position: absolute;
    top: 65px;
    width: 100%;
    z-index: 1000;
    bottom: 0
  }

  .layer-loading > i {
    -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
    animation: bouncedelay 1.4s infinite ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    background-color: #A6A6A6;
    display: inline-block;
    border-radius: 100%;
    margin: 0 2px;
    height: 18px;
    width: 18px
  }

  .layer-loading > i:nth-child(2) {
    -webkit-animation-delay: .2s;
    animation-delay: .2s
  }

  .layer-loading > i:nth-child(3) {
    -webkit-animation-delay: .4s;
    animation-delay: .4s
  }

  .btn-left-list-more {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 5;
    background: rgba(255, 255, 255, 0.9);
    text-align: center;
    .el-button {
      border: none;
      color: #666;
      background: 0 0;
      padding-left: 0;
      padding-right: 0;
      &:hover {
        color: #333
      }
    }
  }

  .min-div {
    height: 0;
    width: 0;
    display: inline;
    overflow: hidden;
    line-height: 0;
  }

  .app-body-org {
    padding-top: 0;
    .layer-loading {
      top: 0
    }
  }

</style>
<template>
  <div class="app-body full-width">
    <app-header :to-route="toRoute" v-if="userType"></app-header>
    <div class="main-body container">
      <div class="layer-loading" v-show="loading"><i></i><i></i><i></i></div>
      <el-scrollbar tag="div" class="body_scroll">
        <transition name="scale" mode="out-in" appear>
          <router-view class="app-content-view"></router-view>
        </transition>
      </el-scrollbar>
    </div>
    <attachmentDialog></attachmentDialog>
    <print-dialog></print-dialog>
  </div>
</template>

<script>
  import AppHeader from './layout/app.header.vue';
  import AppFooter from './layout/app.footer.vue';
  import utils from '../tools/utils';
  import attachmentDialog from './common/attachment/attachment.dialog.vue';
  import {Auth} from '@/resources';
  import printDialog from './common/print.loading.vue';
  import QCodeDialog from './chart/q-code-dialog';

  export default {
    data: () => ({
      transitionName: 'slide-left',
      toRoute: {},
      loading: true,
      loopQuery: false
    }),
    computed: {
      userType: function () {
        return this.$store.state.user['userType'];
      },
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return height + 'px';
      }
    },
    beforeRouteEnter (to, form, next) {
      next(vm => {
        vm.toRoute = to;
      });
    },
    beforeRouteUpdate (to, from, next) {
      utils.removeClass(document.getElementsByTagName('body')[0], 'overflow-hidden');
      this.toRoute = to;
      next();
    },
    components: {AppHeader, AppFooter, attachmentDialog, printDialog,QCodeDialog},
    methods: {
      closeQcode: function () {
        this.loopQuery = false;
      },
      queryUserwehcatInfo: function () {
        // 查询用户绑定微信信息，未绑定微信时弹出二维码进行关注绑定
        this.$http.get('/wechat/user-info/current-user', {}).then(res => {
          let data = res.data;
          if (data.code && 404 === data.code) {
            this.getQCode();
          }
        }).catch(() => {
        });
      },
      getQCode() {
        let item = {
          ticket: '',
          loading: false,
          openId: ''
        };
        let params = {
          userId: this.$store.state.user.userId
        };
        // 获取二维码
        this.$http.get('/wechat/user-info/queryWechatQrCode', {params}).then(res => {
          item.ticket = res.data.ticket;
          if (!res.data.path) {
            this.$refs.qrCode.show();
          } else {
            this.$refs.qrCode.open(res.data.path, item);
          }
        });
        // 已经在轮询中, 返回
        if (item.loading) return;
        this.loopQuery = true;
        // 轮询查询关注信息
        setTimeout(() => {
          item.loading = true;
          this.loopQueryInfo(item);
        }, 3000);
      },
      loopQueryInfo(item) {
        if (item.openId || !this.loopQuery) return;
        let code = this.$refs.qrCode;
        this.$http.get(`/wechat/user-info/queryWeChatTicketInfo/${code.ticket}`).then(res => {
          item.loading = false;
          if (res.data.openId === '400') {
            this.$notify.info({
              duration: 2000,
              message: '该微信账号已绑定用户，请取消关注后再操作'
            });
            this.$emit('closeDialog');
          } else {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '关注成功'
            });
            item.openId = res.data.openId;
            this.$refs.qrCode.close();
          }
        }).catch(() => {
          setTimeout(() => {
            this.loopQueryInfo(item, code.ticket);
          }, 3000);
        });
      },
      setBodyHeight: function () {
        this.$store.commit('setBodyHeight', {
          height: window.innerHeight - 200 + 'px',
          window: {width: window.innerWidth, height: window.innerHeight}
        });
      }
    },
    mounted: function () {
      this.$getDict('printer');
      window.localStorage.removeItem('noticeError');
      if (!this.$store.state.user || !this.$store.state.user.userId) {
        Auth.checkLogin().then(() => {
          let data = window.localStorage.getItem('user');
          if (!data) {
            Auth.logout().then(() => {
              this.$router.replace('/login');
            });
          }
          data = JSON.parse(data);
          this.$store.commit('initUser', data);
          // 查询登录用户微信绑定信息
          this.queryUserwehcatInfo();
        }).catch(() => {
          Auth.logout().then(() => {
            this.$router.replace('/login');
          });
        });
      }
      Auth.permission().then(res => {
        this.$store.commit('initPermissions', res.data);

      }).then(() => {
        utils.removeClass(document.getElementsByTagName('body')[0], 'overflow-hidden');
        this.loading = false;
        // DictGroup.getAll().then(data => {
        //   this.$store.commit('initDict', data);
        // });
      });
      window.addEventListener('resize', (e) => {
        this.setBodyHeight();
      });
      this.setBodyHeight();
    }
  };
</script>
