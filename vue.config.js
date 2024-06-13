const { defineConfig } = require('@vue/cli-service')
module.exports =
  defineConfig({
    transpileDependencies: true,

  })
// chainWebpack: config => {
//   // добавляем загрузчик для шрифтов
//   config.module
//     .rule('fonts')
//     .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
//     .use('file-loader')
//       .loader('file-loader')
//       .options({
//         name: 'fonts/[name].[hash:8].[ext]'
//       })
//       .end()
// }

