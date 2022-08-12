<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      title="互联网头条"
      class="page-nav-bar"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="main-wrap">

      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading
          type="spinner"
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <h1 class="article-title">{{ article.title }}</h1>
        <!--用户信息-->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div class="user-name" slot="title">{{ article.aut_name}}</div>
          <div class="publish-data" slot="label">{{article.pubdate | relativeTime}}</div>
          <!--
          :user-id → userId 传递文章作者id
          :is-floowed → isFloowed 自定义事件 关注数据
          $event 是事件参数
          -->
          <follow-user
            class="follow-btn"
            :user-id="article.aut_id"
            v-model="article.is_followed"
          />
        </van-cell>
        <!--文章内容-->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>End</van-divider>
        <!-- 文章评论 -->
        <comment-list
          :source="article.art_id"
          :list="commentList"
          @onload-success = "totalcommenttotal = $event.total_count"
        />
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostshow = true"
          >写评论</van-button>
          <van-icon
            name="comment-o"
            :info="totalcommenttotal"
            color="#777"
          />
          <collect-article
            v-model="article.is_collected"
            :article-id ="article.art_id"
          />
          <like-article
            v-model="article.attitude"
            :article-idd ="article.art_id"
          />
          <van-icon name="share" color="#7777"/>
        </div>
        <!-- 评论弹出层 -->
        <van-popup
          v-model="isPostshow"
          position="bottom"
        >
          <comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          />
        </van-popup>
      </div>

      <!--加载失败404-->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>

      <!-- 加载失败其他-->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button @click="loadArticle" class="retry-btn">点击重试</van-button>
      </div>
    </div>

  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article/index'
import CommentList from './components/comment-list'
import CommentPost from './components/commnet-post'

export default {
  name: 'ArticleIndex',
  components: {
    LikeArticle,
    FollowUser,
    CollectArticle,
    CommentList,
    CommentPost
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的loading 状态
      errStatus: 0, // 失败状态码
      followLoading: false,
      totalcommenttotal: 0,
      isPostshow: false,
      commentList: [] // 评论列表
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    onClickLeft () {
      this.$router.back()
    },
    // 加载文章详情
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        this.article = data.data
        console.log(data)
        // 初始化图片点击预览
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
      }
      // 无论成功还是失败都需要比loading关闭
      this.loading = false
    },
    // 点击图片预览
    previewImage () {
      const articleContent = this.$refs['article-content']
      const img = articleContent.querySelectorAll('img')
      const images = []
      img.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images,
            startPosition: index
          })
        }
      })
    },
    // 评论列表更新
    onPostSuccess (data) {
      // 关闭弹出层
      this.isPostshow = false
      // 发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
  @import "./github-markdown.css";

  .article-container{
    .main-wrap {
      position: fixed;
      left: 0;
      right: 0;
      top: 92px;
      bottom: 88px;
      overflow-y: scroll;
      background-color: #fff;
    }
    .loading-wrap {
      padding: 200px 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
    }
    .article-detail{
      .article-title {
        font-size: 35px;
        padding: 50px 32px;
        margin: 0;
        color: #3a3a3a;
      }
      .user-info {
        padding: 0 32px;
        .avatar {
          width: 70px;
          height: 70px;
          margin-right: 17px;
        }
        .van-cell__label {
          margin-top: 0;
        }
        .user-name {
          font-size: 24px;
          color: #3a3a3a;
        }
        .publish-data {
          font-size: 23px;
          color: #b7b7b7;
        }
        .follow-btn {
          width: 170px;
          height: 58px;
        }
      }
      .article-content {
        padding: 55px 32px;
        /deep/ p {
          text-align: justify;
        }
      }
    }
    .error-wrap {
      padding: 200px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      .van-icon {
        font-size: 122px;
        color: #b4b4b4;
      }
      .text {
        font-size: 30px;
        color: #666666;
        margin: 33px 0 46px;
      }
      .retry-btn {
        width: 280px;
        height: 70px;
        line-height: 70px;
        border: 1px solid #c3c3c3;
        font-size: 30px;
        color: #666666;
      }
    }

    .article-bottom {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-sizing: border-box;
      height: 88px;
      border-top: 1px solid #d8d8d8;
      background-color: #fff;
      .comment-btn {
        width: 282px;
        height: 46px;
        border: 2px solid #eeeeee;
        font-size: 30px;
        line-height: 46px;
        color: #a7a7a7;
      }
      /deep/.van-icon {
        font-size: 40px;
        .van-info {
          font-size: 16px;
          background-color: #e22829;
        }
      }
    }
  }
</style>
