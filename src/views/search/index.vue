<template>
  <div class="search-container">
    <!-- 搜索栏  -->
    <!-- form 标签且 action 不为空，即可在 iOS 输入法中显示搜索按钮-->
    <form class="search-form" action="/">
      <van-search
        v-model="searchText"
        show-action
        action-text="取消"
        background="#5babfb"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
      <!-- 搜索结果 -->
      <search-result
        v-if="isResultShow"
        :search-text="searchText"
      />
      <!-- 联想建议 -->
      <search-suggestion
        v-else-if="searchText"
        :search-text="searchText"
        @search="onSearch"
      />
      <!-- 搜索历史 -->
      <van-cell-group v-else>
        <van-cell title="历史记录">
          <template v-if="isDeleteShow">
            <span @click="searchHistories = []">全部删除</span>
            &nbsp;&nbsp;
            <span @click="isDeleteShow = false">完成</span>
          </template>
          <van-icon v-else name="delete" @click="isDeleteShow = true"></van-icon>
        </van-cell>
        <van-cell
          :title="item"
          v-for="(item, index) in searchHistories"
          :key="index"
          @click="onHistoryClick(item, index)"
        >
          <van-icon
            v-show="isDeleteShow"
            name="close"
          ></van-icon>
        </van-cell>
      </van-cell-group>
    </form>
  </div>
</template>

<script>
import SearchSuggestion from '@/views/search/components/search-suggestion'
import SearchResult from '@/views/search/components/search-result'
import { getItem, setItem } from '@/utils/storage'

export default {
  name: 'SearchIndex',
  components: { SearchResult, SearchSuggestion },
  props: {
    SearchSuggestion,
    SearchResult
  },
  data () {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的展示
      searchHistories: getItem('serach-histories') || [],
      isDeleteShow: false // 控制删除相关元素的显示状态
    }
  },
  computed: {},
  watch: {
    searchHistories (val) {
      // 同步到本地存储
      setItem('serach-histories', val)
    }
  },
  created () {},
  mounted () {},
  methods: {
    onSearch (val) {
      // 更新文本框内容
      this.searchText = val
      // 存储搜索历史记录：不要有重复历史记录、最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      console.log(val)
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    },
    onHistoryClick (item, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
      } else {
        // 否则执行搜索操作
        this.onSearch(item)
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: white;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
