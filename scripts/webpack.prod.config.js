var webpack = require('webpack')
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin') // html模板插入代码。
var ExtractTextPlugin = require('extract-text-webpack-plugin') // 从bundle中提取文本到一个新的文件中
var Visualizer = require('webpack-visualizer-plugin')
const webpackUploadPlugin = require('webpack-nexus-upload-plugin')
const aliOSS = {
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  accessKeySecret: process.env.ACCESS_KEY_SECRET,
  bucket: process.env.BUCKET,
  fileDir: process.env.FILE_DIR
}
const publicPath = 'https://assets.pilipa.cn/' + process.env.FILE_DIR
console.log(publicPath)
console.log(JSON.stringify(aliOSS))
const extractCommon = new ExtractTextPlugin({
  filename: 'css/common.[contenthash:8].css',
  allChunks: true
})
const extractApp = new ExtractTextPlugin({
  filename: 'css/app.[contenthash:8].css',
  allChunks: true
})
console.log(path.resolve(__dirname, '../deploy/dist'))
var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: `'production'`
    }
  }),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, '../src/index.html'),
    // 要把<script>标签插入到页面哪个标签里(body|true|head|false)
    inject: 'true',
    filename: path.resolve(__dirname, '../deploy/dist/index.html'),
    favicon: path.resolve(__dirname, '..', 'src/favicon.ico'),
    // hash如果为true，将添加hash到所有包含的脚本和css文件，对于解除cache很有用
    // minify用于压缩html文件，其中的removeComments:true用于移除html中的注释，collapseWhitespace:true用于删除空白符与换行符
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    }
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    // chunksSortMode: 'dependency'
    // hash:true
  }),
  new webpack.ProvidePlugin({$: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery'}),
  // Explicit vendor chunk
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor'],
    minChunks: function (module) {
      return module.context && module.context.includes('node_modules')
      // return module.context && module.context.includes('node_modules') && /(rc-(\w)*|immutable|echarts|zrender|jquery|moment|antd)/.test(module.context) === false
    }
  }),
  // 引导
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_console: true,
      drop_debugger: true
    }
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  extractCommon,
  extractApp,
  new Visualizer(),
  new webpackUploadPlugin({
    path: path.resolve(__dirname, '../deploy/dist'),
    aliOSS
  })
]

module.exports = {
  entry: {
    app: [path.resolve(__dirname, '../src/app')]
  },
  output: {
    path: path.resolve(__dirname, '../deploy/dist'),
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
    publicPath: publicPath
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }, {
            loader: 'ts-loader'
          }
        ]
      }, {
        test: /\.js$/,
        include: path.resolve(__dirname, '../src'),
        exclude: /node_modules/,
        use: ['babel-loader']
      }, {
        test: /\.css$/,
        use: extractCommon.extract({
          fallback: 'style-loader', // 应用于当 CSS 没有被提取(也就是一个额外的 chunk，当 allChunks: false)
          use: ['css-loader', 'postcss-loader']
        })
      }, {
        test: /\.styl$/,
        include: path.resolve(__dirname, '../src'),
        use: extractApp.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[local]-[hash:base64:5]'
              }
            }, {
              loader: 'postcss-loader'
            }, {
              loader: 'stylus-loader'
            }
          ]
        })
      }, {
        test: /\.(png|jpe?g|git)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: 'images/[name].[hash:7].[ext]'
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }, {
        test: /\.(mp3)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: plugins,
  resolve: {
    modules: [
      path.resolve(__dirname, '../node_modules'),
      path.resolve(__dirname, '../src')
    ],
    extensions: [
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.min.js',
      '.json',
      '.styl',
      '.css'
    ],
    alias: {
      '@': path.join(__dirname, '../src/')
    }
  },
  externals: {
    './cptable': 'var cptable',
    '../xlsx.js': 'var _XLSX',
    './jszip': "jszip"
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}
