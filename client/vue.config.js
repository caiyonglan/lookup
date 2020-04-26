// vue.config.js
module.exports = {
  publicPath: '/',
  outputDir: '../dist',
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      '/': {
        target: 'http://182.92.110.5:80', // 对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/': '/'
        }
      }
    }
  }
}
