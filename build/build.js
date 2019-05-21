'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'
var remote = require('scp2');

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start();
let serverTag = process.argv[2] || "lxy";

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  let btime = Date.now();
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // if you are using ts-loader, setting this to true will make tyescript errors show up during build
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ));
    console.log(`build tatol time :${Date.now() - btime}ms`);
    remote.scp('dist/static/', {
      host: '172.18.8.246',
      username: 'root',
      password: 'R21000332+rwuchuwei!',
      path: `/srv/erp/vue/${serverTag}/static`
    }, function (err) {
      if(err){
        console.error(err);
        process.exit(1);
      }
      remote.scp('dist/index.html',{
        host: '172.18.8.246',
        username: 'root',
        password: 'R21000332+rwuchuwei!',
        path: `/srv/erp/vue/${serverTag}`
      },function(err){
        if(err){
          console.error(err);
          process.exit(1);
        }
        Date.prototype.format = function(format = 'yyyy-mm-dd hh:mm:ss'){
          return `${this.getFullYear()}-${this.getMonth()+1}-${this.getDate()} ${this.getHours()}:${this.getMinutes()}:${this.getSeconds()}`;
        };
        let date = new Date();
        console.log(`remote upload finish...${date.format()}`);
      })
    });
  })
})
