<template>
  <!-- 列表项 -->
  <van-cell
    class="article-item"
    :to="`/article/${article.art_id}`"
  >
    <div slot="title" class="title van-multi-ellipsis--l2">{{ article.title }}</div>
    <div slot="label">
      <!-- 三个图片列表-->
        <div v-if="article.cover.type === 3" class="cover-wrap">
          <div class="cover-item"
            v-for="(img, index) in article.cover.images"
            :key="index">
            <van-image
              class="cover-item-img"
              fit="cover"
              :src="img"
            />
          </div>
        </div>
      <div class="label-info-wrap">
        <span>作者:{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>发布时间：{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <!-- 一个图片列表-->
      <van-image
        v-if="article.cover.type === 1"
        slot="default"
        class="right-cover"
        fit="cover"
        :src="article.cover.images[0]"
      />
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less">
  .article-item {
    .title {
      font-size: 32px;
      color: #3a3a3a;
    }
    .van-cell__value {
      flex: unset;
      width: 232px;
      height: 146px;
    }
    .right-cover {
      width: 232px;
      height: 146px;
      margin-left: 25px;
    }
    .label-info-wrap span {
      font-size: 22px;
      color: #b4b4b4;
      margin-right: 25px;
    }
    .cover-wrap {
      display: flex;
      padding: 30px 0;
      .cover-item{
        flex: 1;
        height: 146px;
        &:not(:last-child) {
          padding-right: 4px;
        }
        .cover-item-img {
          width: 100%;
          height: 146px;
        }
      }
    }
  }

</style>
