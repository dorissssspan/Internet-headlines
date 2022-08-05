<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
    title="个人信息"/>
    <!-- 个人信息 -->
    <input
      type="file"
      hidden
      ref="file"
      @change="onFileChange"
    >
    <van-cell title="头像" is-link >
      <van-image
        class="headerimg"
        fit="cover"
        round
        :src="user.photo"
        @click="$refs.file.click()"
      />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      @click="errormessage"
      is-link/>
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      @click="isupdateGendershow = true"
      is-link/>
    <van-cell
      title="生日"
      :value="user.birthday"
      @click="isupdateBirthdayshow = true"
      is-link/>
    <!-- 修改性别 -->
    <van-popup
      v-model="isupdateGendershow"
      position="bottom"
    >
      <update-gender
        v-if="isupdateGendershow"
        @close="isupdateGendershow = false"
        v-model="user.gender"
      />
    </van-popup>
    <!-- 修改生日 -->
    <van-popup
      v-model="isupdateBirthdayshow"
      position="bottom"
    >
      <update-birthday
        v-if="isupdateBirthdayshow"
        @close="isupdateBirthdayshow = false"
        v-model="user.birthday"
      />
    </van-popup>
    <!-- 修改头像 -->
    <van-popup
      v-model="isupdatePhotoshow"
      position="bottom"
      style="height: 100%"
    >
      <update-photo
        v-if="isupdatePhotoshow"
        :img="img"
        @close="isupdatePhotoshow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateGender from './components/update-gender'
import UpdateBirthday from '@/views/user-profile/components/update-birthday'
import UpdatePhoto from '@/views/user-profile/components/update-photo'

export default {
  name: 'UserProfile',
  components: {
    UpdatePhoto,
    UpdateBirthday,
    UpdateGender
  },
  props: {},
  data () {
    return {
      user: {}, // 个人信息
      isupdateGendershow: false,
      isupdateBirthdayshow: false,
      isupdatePhotoshow: false,
      img: null // 预览的图片
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        console.log(data)
        this.user = data.data
      } catch (err) {
        this.$notify({ type: 'danger', message: '获取个人信息失败' })
      }
    },
    errormessage () {
      this.$notify({ type: 'danger', message: '昵称固定为手机号，不可修改' })
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)
      this.isupdatePhotoshow = true
      // file-input选了同一个文件不会触发 change 事件，解决：每次使用完毕清空value
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
  .user-profile {
    .headerimg {
      width: 60px;
      height: 60px;
    }
    .van-popup {
      background-color: #f5f7f9;
    }
  }
</style>
