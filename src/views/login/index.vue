<template>
  <div class="login-container">
  <!--  导航栏  -->
    <van-nav-bar
      class="page-nav-bar"
      title="登录">
      <van-icon
        slot="left"
        name="cross"
        @click="$router.back()"
      />
    </van-nav-bar>
  <!--  登录表单 label提示文本，placeholder输入框提示信息 -->
    <!--
        1.vant-field组件配置rules验证规则
        参考文档：https://vant-contrib.gitee.io/vant/v2/#/zh-CN/form#rule-shu-ju-jie-gou
        2.表单提交会自动触发表单验证，通过触发submit事件，失败就不会触发submit事件
    -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="phone"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
      <!-- vant Slots插槽 -->
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>

      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon"
           class="toutiao toutiao-yanzhengma">
        </i>
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="10 * 1000"
            format="ss s"
            @finish = "isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            round size="small"
            type="default"
            @click="onSendSms"
            native-type="button"
          >发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13823019930',
        code: '246810'
      },
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      },
      isCountDownShow: false // 是否展示倒计时
    }
  },
  methods: {
    async onSubmit () {
      // 1.获取表单数据
      // const user = this.user
      // 2.表单验证 在组件中必须通过this.$toast来调用Toast组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认 2000，0 表示持续展示不关闭
      })
      // 3.提交表单请求登录,根据请求响应结果处理
      try {
        const { data } = await login(this.user)
        console.log(data)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        this.$router.replace('/my')
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
    },
    async onSendSms () {
    //  1.获取手机号
      try {
        await this.$refs.loginForm.validate('phone')
      } catch (err) {
        return console.log('验证失败', err)
      }
      //  2.验证通过，显示倒计时
      this.isCountDownShow = true
      // 3.请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了请稍后')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
}
.send-sms-btn {
  width: 160px;
  height: 46px;
  line-height: 46px;
  background-color: #ededed;
  font-size: 22px;
  color: #666666;
}
.login-btn-wrap {
  padding: 53px 33px;
  .login-btn {
    background-color: #6db4fb;
    border: none;
  }
}
</style>
