<template>
  <!-- 频道编辑 -->
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        size="mini"
        plain
        round
        @click="isEdit = !isEdit"
      >{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onmychannelclick(channel, index)"
        >
        <!-- 频道编辑按钮  不是固定频道并且不是编辑状态才显示 -->
        <van-icon
          v-show="isEdit && !flexChannels.includes(channel.id)"
          slot="icon"
          name="close"></van-icon>
        <!-- class 频道选中高亮显示  -->
        <span
          class="text"
          :class="{ active: index === active }"
          slot="text">
          {{ channel.name }}
        </span>
      </van-grid-item>
    </van-grid>

  <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        icon="plus"
        :key="index"
        :text="channel.name"
        @click="onAddChannel(channel)"/>
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addAllChannel,
  delAllChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 编辑状态的显示
      flexChannels: [0] // 固定频道，不允许删除
    }
  },
  computed: {
    // 映射数据
    ...mapState(['user']),
    // 处理获取推荐频道
    recommendChannels () {
      const channels = []
      this.allChannels.forEach(channel => {
        // find遍历数组，找到满足条件的元素项
        const ret = this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
        // 我的频道不包括该频道，推荐频道则显示
        if (!ret) {
          channels.push(channel)
        }
      })
      return channels
    }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    // 频道处理方法
    async onAddChannel (channel) {
      this.myChannels.push(channel) // 不建议子元素修改父元素的props值
      // 数据持久化处理
      if (this.user) {
        try {
          // 已登录，数据请求接口放到显示
          await addAllChannel({
            id: channel.id, // 频道id
            seq: this.myChannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录，数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    // 点击编辑 操作频道
    onmychannelclick (channel, index) {
      if (this.isEdit) {
        // 编辑状态
        // 1.如果是固定频道，则不删除
        if (this.flexChannels.includes(channel.id)) {
          return
        }
        // 2.删除频道  参数1：要删除元素的开始索引，参数2：删除个数
        this.myChannels.splice(index, 1)
        // 3.更新频道  如果删除的激活频道之前的频道，则更新激活频道
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1)
        }
        // 4.处理持久化
        this.deletChannel(channel)
      } else {
        // 非编辑状态，执行切换频道
        this.$emit('update-active', index, false)
      }
    },
    // 删除频道
    async deletChannel (channel) {
      try {
        if (this.user) {
          // 已登录，数据请求接口放到显示
          await delAllChannel(channel.id)
        } else {
          // 未登录，数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
  .channel-edit {
    padding: 85px 0;
    .title-text {
      font-size: 32px;
      color: #333;
    }
    .edit-btn {
      width: 104px;
      height: 48px;
      font-size: 24px;
      color: #f85959;
      border: 1px solid #f85959;
    }
    /deep/.grid-item {
      width: 160px;
      height: 86px;
      .van-grid-item__content {
        white-space: nowrap; //不换行
        background-color: #f4f5f6;
        .van-grid-item__text, .text {
          font-size: 28px;
          color: #222;
          margin-top: 8px;
        }
        .active {
          color: red;
        }
        .van-grid-item__icon-wrapper {
          position: unset;
        }
      }
    }
    /* 我的频道关闭按钮 */
    /deep/.my-grid {
     .grid-item {
       .van-icon-close {
         position: absolute;
         right: -5px;
         top: -5px;
         font-size: 30px;
         z-index: 2;
       }
     }
    }
    /deep/.recommend-grid {
      .grid-item {
        .van-grid-item__content {
          flex-direction: row;
          .van-icon-plus {
            font-size: 28px;
            margin-right: 6px;
          }
        }
      }
    }
  }
</style>
