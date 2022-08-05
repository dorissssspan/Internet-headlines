<template>
  <div class="search-suggestion">
    <van-cell
      :title="text"
      icon="search"
      v-for="(text, index) in suggestion"
      :key="index"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchsuggestion } from '@/api/search'
// 按需加载
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    // 向父组件获取监听
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestion: [], // 联想建议数组  获取api数据放到数组中
      htmlStr: 'Hello <span style="color: red">World</span>'
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 发生改变的时候会调用 handler 函数
      // handler (value) {
      //   this.loadsearchsuggestion(value)
      // },
      // debounce函数  参数1：一个函数  参数2：延迟事件，单位是毫秒 返回值：防抖之后的函数
      handler: debounce(function (value) {
        this.loadsearchsuggestion(value)
      }, 500),
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  created () {},
  mounted () {},
  methods: {
    // 获取api数据
    async loadsearchsuggestion (q) {
      try {
        const { data } = await getSearchsuggestion(q)
        this.suggestion = data.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    highlight (text) {
      const highlight = `<span class="active">${this.searchText}</span>`
      // RegExp 正则表达式构造函数  参1： 匹配模式字符串  参2： 匹配模式
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlight)
    }
  }
}
</script>

<style scoped lang="less">
  .search-suggestion{
    /deep/span.active {
      color: red;
    }
  }
</style>
