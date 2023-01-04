module.exports = {
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: '信用卡批次授權系統',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  publicPath: `${process.env.VUE_APP_BASE_ROUTE}/`,
  productionSourceMap: false,
  devServer: {
    proxy: {
      '^/nbps-main-dev': {
        target: process.env.VUE_APP_BASE_URL,
        changeOrigin: true
      },
      '^/nbps-main': {
        target: process.env.VUE_APP_BASE_URL,
        changeOrigin: true
      }
    }
  }
}
