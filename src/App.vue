<template>
  <div id="app">
    <keep-alive
      exclude="SearchIndex,SearchResult,ArticleIndex,CommentList,UserProfile">
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
