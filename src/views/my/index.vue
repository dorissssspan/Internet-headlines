<template>
  <div class="my-container">
    <!-- 已登录 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image
            round
            class="avatar"
            fit="cover"
            :src="userInfo.photo"
          />
          <span class="name">{{userInfo.name}}</span>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.replace('/login')">
        <img class="mobile-img" src="../../assets/mobile.png" alt="">
        <span class="text">登录 / 注册</span>
      </div>
  </div>
    <van-cell slot="icon" icon="more-o" title="编辑资料" is-link to="/user/profile" />
    <!-- van-cell class="mb-9" title="小智同学" is-link />-->
    <van-cell
      slot="icon"
      icon="bulb-o"
      v-if="user"
      class="login-out"
      @click="onlogout"
      title="退出登录"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'

export default {
  name: 'MyIndex',
  components: {},
  props: {},
  data () {
    return {
      userInfo: {} // 用户信息
    }
  },
  computed: {
    ...mapState(['user']) // 映射数据
  },
  watch: {},
  created () {
    // 如果用户登录，则请求加载用户信息数据 （调用加载）
    if (this.user) {
      this.loadUserInfo()
    }
  },
  mounted () {},
  methods: {
    onlogout () {
      // 退出提示
      this.$dialog.confirm({
        title: '确认退出吗？'
      }).then(() => {
        console.log('确认执行')
        // 清除登录状态，容器中的user和本地存储的uer
        this.$store.commit('setUser', null)
      }).catch(() => {
        console.log('取消执行')
      })
    },
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取数据失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background:url("~@/assets/banner.png");
    background-size: cover;
  }
  /*header未登录*/
  .not-login {
    display: flex;
    align-items: center;
    justify-content: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .mobile-img {
        width: 132px;
        height: 132px;
      }
      .text {
        margin-top: 15px;
        font-size: 28px;
        color: #fff;
      }
    }
  }
  /*header已登录*/
  .user-info {
    .base-info {
      box-sizing: border-box;
      height: 231px;
      padding: 76px 32px 23px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 1px solid #fff;
        }
        .name {
          font-size: 30px;
          color: #fff;
          margin-left: 23px;
        }
      }
    }
    .data-stats {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  /* 导航 */
  .grid-nav {
    margin-bottom: 9px;
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text{
        font-size: 28px;
      }
    }
  }
  .login-out {
    color: #d86262;
  }
  .mb-9 {
    margin-bottom: 9px;
  }
}
</style>
