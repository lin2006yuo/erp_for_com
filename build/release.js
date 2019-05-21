'use strict'
require('./check-versions')()
const remote = require('scp2');

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.release.conf')

const spinner = ora('building for release...')
spinner.start();

module.exports = function (){
    return new Promise((succ, fail) =>{
        rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
            if (err) {
                return fail();
            }
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
                    fail()
                }else{
                    console.log(chalk.cyan('  release complete.\n'));
                    succ();
                }
            })
        })
    })
}
