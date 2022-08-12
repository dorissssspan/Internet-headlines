<template>
  <!--文章详情-关注模块-->
    <van-button
      v-if="value"
      class="follow-btn"
      round
      :loading="loading"
      size="small"
      @click="onFollow"
    >已关注</van-button>
    <van-button
      v-else
      class="follow-btn"
      type="info"
      color="#3296fa"
      round
      :loading="loading"
      size="small"
      icon="plus"
      @click="onFollow"
    >关注</van-button>
</template>

<script>
import { addFollow, delFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  components: {},
  props: {
    value: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 监听用户关注
    async onFollow () {
      this.loading = true
      try {
        if (this.value) {
          //  已关注→取消
          const { data } = await delFollow(this.userId)
          console.log(data)
        } else {
          //  未关注→关注
          const { data } = await addFollow(this.userId)
          console.log(data)
        }
        // this.value = !this.value
        // 向父组件发出请求  父组件监听事件
        this.$emit('input', !this.value)
      } catch (err) {
        let message = '操作失败，请重试'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己！'
        }
        this.$toast(message)
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less"></style>
