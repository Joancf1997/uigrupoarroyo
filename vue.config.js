module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    devServer: {
      compress: true,
      disableHostCheck: true,   // That solved it
    }
  }
}
