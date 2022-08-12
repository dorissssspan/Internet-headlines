<template>
  <!--文章详情-收藏模块 -->
  <van-icon
    :color="value ? '#ffa500' : '#777'"
    :name="value ? 'star' : 'star-o'"
    @click="onCollect"
    :loading = "loading"
  />
</template>

<script>
import { addCollect, delCollect } from '@/api/article'

export default {
  name: 'CollectArticle',
  components: {},
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
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
    async onCollect () {
      this.loading = true
      try {
        if (this.value) {
        // 已收藏，取消收藏
          await delCollect(this.articleId)
          this.$toast('取消收藏')
        } else {
        // 没有收藏，添加收藏
          await addCollect(this.articleId)
          this.$toast('收藏成功')
        }
        // 更新视图
        this.$emit('input', !this.value)
      } catch (err) {
        this.$toast.fail('操作失败，请重试')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less"></style>
