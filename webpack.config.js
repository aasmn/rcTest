var webpack = require('webpack')
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin') // html模板插入代码。
var ExtractTextPlugin = require('extract-text-webpack-plugin') // 从bundle中提取文本到一个新的文件中
// var Visualizer = require('webpack-visualizer-plugin');

const extractCommon = new ExtractTextPlugin({
  filename: '[name][contenthash].css',
  allChunks: true
})
const extractApp = new ExtractTextPlugin({
  filename: '[name][contenthash].css', // [name][contenthash]
  allChunks: true
})

var plugins = [
  extractCommon,
  extractApp,
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: `"development"`
    }
  }),
  new HtmlWebpackPlugin({
    template: './src/index.html',
    // 要把<script>标签插入到页面哪个标签里(body|true|head|false)
    inject: 'true',
    favicon: './src/favicon.ico',
    filename: path.resolve(__dirname, 'dist/index.html')
  }),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery'
  }),
  // 将node_modules打入vendor
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function (module, count) {
      return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf(
          path.join(__dirname, 'node_modules')
        ) !== -1
      )
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest'
  }),
  // new webpack.NamedModulesPlugin(),
  new webpack.HotModuleReplacementPlugin()
  // new webpack.DllReferencePlugin({
  //   context:  path.join(__dirname, "dist"),
  //   manifest: require("./dist/manifest")
  // }),
  // new Visualizer({
  //   filename: './statistics.html'
  // })
]
module.exports = {
  entry: {
    client: 'webpack-hot-middleware/client?reload=true',
    app: ['babel-polyfill', './src/app']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: [/node_modules/, path.resolve(__dirname, 'lib')],
        use: [
          'source-map-loader'
        ]
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader',
        options: {
          useCache: true,
          useBabel: true,
          babelOptions: {
            babelrc: false, /* Important line */
            presets: [
              [
                'env',
                {
                  'targets': {
                    'browsers': ['> 5%', 'last 2 versions']
                  },
                  'modules': false
                }
              ],
              'stage-0',
              'react'
            ]
          }
        }
      },
      {
        test: /\.(js|jsx)$/,
        // include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.css$/,
        exclude: path.resolve(__dirname, 'src'),
        use: extractCommon.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?sourceMap=true',
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.styl$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]-[hash:base64:5]',
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'stylus-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings 
        }, {
            loader: "css-loader", // translates CSS into CommonJS 
            options: {
              importLoaders: 1
            }
        }, {
            loader: "less-loader" // compiles Sass to CSS 
        }]
      },
      {
        test: /\.(png|jpe?g|git)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: '[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp3|mp4)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: plugins,
  devServer: {
    contentBase: 'dist',
    // 热替换的区别就在于，当前端代码变动时，无需刷新整个页面，只把变化的部分替换掉。
    // 自动刷新整个页面刷新
    inline: true,
    hot: true,
    overlay: true,
    // stats(string or object) errors-only|minimal|none|normal|verbose(输出所有)
    stats: {
      // context: './src/',
      // assets: true,
      colors: true,
      errors: true
    },
    proxy: {
      '/api': {
        // target: 'https://x-agent-nexus.i-counting.cn/',
        target: 'https://x-agent.i-counting.cn/',
        changeOrigin: true
        // pathRewrite: {
        // }
      },
      '*.json': {
        // target: 'https://x-agent-nexus.i-counting.cn/',
        target: 'https://x-agent.i-counting.cn/',
        changeOrigin: true
        // pathRewrite: {
        // }
      }
    },
    // 启用gzip压缩一切服务:
    // compress: true,
    // host: '0.0.0.0',
    // host: '192.168.198.211',
    port: '3001'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src')],
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.min.js', '.json', '.styl', '.css'],
    alias: {
      '@': path.join(__dirname, 'src/')
    }
  },
  devtool: 'cheap-module-source-map',
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
  // eval： 生成代码 每个模块都被eval执行，并且存在@sourceURL
  //
  // cheap-eval-source-map： 转换代码（行内） 每个模块被eval执行，并且sourcemap作为eval的一个dataurl
  //
  // cheap-module-eval-source-map： 原始代码（只有行内） 同样道理，但是更高的质量和更低的性能
  //
  // eval-source-map： 原始代码 同样道理，但是最高的质量和最低的性能
  //
  // cheap-source-map： 转换代码（行内） 生成的sourcemap没有列映射，从loaders生成的sourcemap没有被使用
  //
  // cheap-module-source-map： 原始代码（只有行内） 与上面一样除了每行特点的从loader中进行映射
  //
  // source-map： 原始代码 最好的sourcemap质量有完整的结果，但是会很慢
}
