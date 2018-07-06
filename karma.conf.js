// Karma configuration
// Generated on Thu Dec 21 2017 14:14:56 GMT+0800 (CST)

const webpack = require('webpack')
const path = require('path')
module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      './test/tests.webpack.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './test/tests.webpack.js': ['webpack']
    },

    webpack: {
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: [/node_modules/],
            use: 'babel-loader'
          },
          {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader'
              },
              {
                loader: 'awesome-typescript-loader'
              }
            ]
          },
          {
            test: /\.css$/,
            exclude: path.resolve(__dirname, 'src'),
            use: [
              'style-loader',
              'css-loader?sourceMap=true',
              'postcss-loader'
            ]
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
          }
        ]
      },
      plugins: [
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery'
        })
      ],
      resolve: {
        modules: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src')],
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.min.js', '.json', '.styl', '.css'],
        alias: {
          'libs': path.join(__dirname, 'libs'),
          '@': path.join(__dirname, 'src/')
        }
      },
      devtool: 'inline-source-map'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['junit', 'progress'],
    junitReporter: {
      outputDir: './reports',
      suite: 'models'
    },
    // web server port
    port: 9876,
    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },

    proxies: {
      '/api': {
        'target': 'https://x-agent.i-counting.cn/api',
        'changeOrigin': true
      }
    },

    // proxyReq: function(proxyReq, req, res, options) {
    //   proxyReq.setHeader('Referer', 'https://x-agent.i-counting.cn/');
    // },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
