<template>
  <div class="article-list">
    <!-- 下拉刷新效果 -->
    <van-pull-refresh
      v-model="refreshing"
      success-text="刷新成功"
      @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <!--  显示对应频道列表信息-列表项   -->
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null,
      error: false, // 控制失败提示列表
      refreshing: false // 控制下拉刷新的 loading状态
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 初始化或滚动到底部的时候会触发onload事件
    async onLoad () {
      try {
        // 1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          // timestamp 简单理解就是请求数据的页码
          timestamp: this.timestamp || Date.now()
        })
        // 2.把请求结果数据放到 list 数组中
        const { results } = data.data
        // ...数组的展开操作
        this.list.push(...results)
        // 3.加载状态结束
        this.loading = false
        // 4.数据全部加载完成
        if (results.length) {
        //   更新获取下一页数据
          this.timestamp = data.data.pre_timestamp
        } else {
        //  没有数据，finished设置为true，不再loading
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    },
    // 下拉刷新会触发该函数
    async onRefresh () {
      try {
        // 1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          // timestamp 简单理解就是请求数据的页码
          timestamp: Date.now()
        })
        // 2.将数据追加到列表的顶部
        this.list.unshift(...data.data.results)
        // 3.关闭下拉刷新的 loading 状态
        this.refreshing = false
      } catch (err) {
        console.log('请求失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
  .article-list{
    /* 百分比是相对父元素的*/
    /*height: 100%;*/
    height: 80vh;
    overflow: auto;
  }
</style>
