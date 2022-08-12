<template>
  <!--修改头像-->
  <div class="update-photo">
    <img class="img" :src="img" ref="img">
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'

export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data () {
    return {
      cropper: null
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    const image = this.$refs.img
    // Cropper配置
    this.cropper = new Cropper(image, {
      viewMode: 1, // 裁剪框的模式
      dragMode: 'move', // 拖动模式
      aspectRatio: 1, // 截图比例
      autoCropArea: 1, // 自动截取
      cropBoxMovable: false, // 截图区域是否移动
      cropBoxResizable: false, // 截图区域缩放
      background: false
    })
  },
  methods: {
    onConfirm () {
      // 基于服务端的裁切
      // console.log(this.cropper.getData())
      // 纯客户端的图片裁切
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhoto(blob)
      })
    },
    async updateUserPhoto (blob) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        // 如果接口要求 Content-Type 是 application/json，则传递普通js对象 ↓
        // updateUserPhoto({ photo: blob })
        // 如果接口要求 Content-Type 是 multipart/form-data，必须传递formdata对象 ↓
        const formData = new FormData()
        formData.append('photo', blob)
        const { data } = await updateUserPhoto(formData)
        // 关闭弹出层
        this.$emit('close')
        // 更新视图
        this.$emit('update-photo', data.data.photo)
        this.$toast.success('更新成功')
      } catch (err) {
        console.log(err)
        this.$toast.fail('头像更新失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
  .update-photo {
    background-color: black;
    height: 100%;
    .toolbar{
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      .cancel, .confirm {
        width: 90px;
        height: 90px;
        font-size: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
      }
    }
  }
  .img{
   max-width: 100%;
  }
</style>
