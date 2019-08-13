module.exports = {
  productionSourceMap: false,
  transpileDependencies: ['vuetify'],
  chainWebpack: config => {
    config.output.chunkFilename(`js/[name].[id].[chunkhash:8].js`)

  },
  pwa: {
    name: "FlyCalc",
    themeColor: "#063761",
    msTileColor: "#063761",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: 'default',
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      navigateFallback: "/",
      include: [/\.html$/, /\.js$/, /\.css$/, /\.json$/, /\.png$/, /\.jpg$/, /\.svg$/],
      exclude: []
    }
  }
};
