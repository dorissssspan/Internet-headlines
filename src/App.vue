<template>
  <div id="app">
    <keep-alive
      include ="HomeIndex">
    <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">

</style>
