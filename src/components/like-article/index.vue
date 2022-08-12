<template>
  <!--文章详情-点赞-->
  <van-icon
    :color="value === 1 ? '#6db4fb' : '#777'"
    :name="value === 1 ? 'good-job' : 'good-job-o'"
    :loading = "loading"
    @click="onLike"
  />
</template>

<script>
import { addLike, delLike } from '@/api/article'

export default {
  name: 'LikeArticle',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    },
    articleIdd: {
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
    async onLike () {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          await delLike(this.articleIdd)
          this.$toast.success('取消点赞')
        } else {
          await addLike(this.articleIdd)
          this.$toast.success('点赞成功')
          status = 1
        }
        this.$emit('input', status)
      } catch (err) {
        console.log(err)
        this.$toast.fail('点赞失败，请稍后重试')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less"></style>
