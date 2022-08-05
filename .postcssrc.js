// PostCss配置文件

module.exports = {
  plugins: {
    // 配置使用 postcss-pxtorem 插件
    'postcss-pxtorem': {
      // lib-flexible 的 REM 适配方案
      // 处理每个css都会调用这个函数
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // 配置要转换的css属性  *所有
      propList: ['*'],
      // 排除不要转换的样式资源
      exclude: 'github-markdown'
    }
  }
}
