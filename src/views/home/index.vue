<template>
  <div class="home-container">
    <!-- 导航 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        slot="title"
        class="search-btn"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- 频道列表 -->
    <!--  animated 开启切换标签内容转场动画，swipeable开启滑动切换标签页  -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!--  频道内容  -->
        <article-list :channel="channel"/>
      </van-tab>
      <!-- 占位符  -->
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="editshow = true" >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="editshow"
      closeable
      position="bottom"
      :style="{ height: '85%' }"
    >
      <channel-edit
        :my-channels="channels"
        :active="active"
        @update-active="onupdateactive"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      editshow: false // 控制编辑频道弹出层的显示
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {
    window.home = this
  },
  methods: {
    async loadChannels () {
      try {
        // const { data } = await getUserChannels()
        // this.channels = data.data.channels
        let channels = []
        if (this.user) {
          // 已登录，请求获取用户频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录，判断是否有本地频道列表数据
          const localChannels = getItem('TOUTIAO-CHANNEL')
          if (localChannels) {
            // 有 拿来用
            channels = localChannels
          } else {
          //  没有，请求获取默认频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道失败')
      }
    },
    onupdateactive (index, editshow = true) {
      this.active = index
      this.editshow = editshow
    }
  }
}
</script>
<style scoped lang="less">
  .home-container {
    padding-top: 174px;
    padding-bottom: 100px;
    /deep/.van-nav-bar__title {
      max-width: unset;
    }
    .search-btn {
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      border: none;
      font-size: 28px;
      .van-icon {
        font-size: 32px;
      }
    }

    /deep/ .channel-tabs {
      /* 频道列表翻滚置顶 */
      .van-tabs__wrap {
        position: fixed;
        top: 92px;
        z-index: 1;
        left: 0;
        right: 0;
        height: 82px;
      }
      /* 未选中标签文字 */
      .van-tab {
        border-right: 1px solid #edeff3;
        min-width: 200px;
        font-size: 30px;
        color: #777777;
      }
      /* 选中标签文字 */
      .van-tab--active {
        color: #333333;
      }
      /* 标签页底部横条 */
      .van-tabs__nav {
        padding-bottom: 0;
      }
      .van-tabs__line {
        bottom: 8px;
      }
      .placeholder {
        flex-shrink: 0;  // 不占位
        width: 66px;
        height: 82px;
      }
      .hamburger-btn {
        position: fixed;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 66px;
        height: 82px;
        background-color: #fff;
        opacity: 0.9;
        i.toutiao {
          font-size: 33px;
        }
      }
    }
  }
</style>
