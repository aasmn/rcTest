var rm = require('rimraf')
const webpack = require('webpack')
const chalk = require('chalk')

var webpackConfig = require('./webpack.prod.config')

var ora = require('ora')
var spinner = ora('building...')

spinner.start()

function callback (err, stats) {
  spinner.stop()
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')
  const info = stats.toJson()
  if (stats.hasWarnings()) {
    console.warn(chalk.yellow(info.warnings))
  }
  if (err || stats.hasErrors()) {
    console.error(chalk.red(info.errors))
  } else {
    console.log(chalk.green('[ok] Builded with successful'))
  }
}

rm('deploy/dist/*', function (err) {
  if (err) throw err
  webpack(webpackConfig, callback)
})
