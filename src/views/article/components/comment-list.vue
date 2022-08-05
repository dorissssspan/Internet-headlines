<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
  <!--  <van-cell
      v-for="(item, index) in list"
      :key="index"
      :title="item.content" />-->
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment = "item"
    />
  </van-list>
</template>

<script>
import { getComment } from '@/api/comment'
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      request: true
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页的数据标记
      limit: 10
    }
  },
  computed: {},
  watch: {},
  created () {
    this.onLoad()
  },
  mounted () {},
  methods: {
    async onLoad () {
      try {
        const { data } = await getComment({
          // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          type: 'a',
          // 源id，文章id或评论id
          source: this.source,
          // 获取评论数据的偏移量，不传表示从第一页开始读取数据
          offset: this.offset,
          // 默认每页数据量
          limit: this.limit
        })
        const { results } = data.data
        this.list.push(...results)
        // 文章评论的总数量传递到外部
        this.$emit('onload-success', data.data)

        this.loading = false
        if (results.length) {
          // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {
        this.$toast('请求失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
