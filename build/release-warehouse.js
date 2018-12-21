'use strict'
require('./check-versions')()
const remote = require('scp2');

process.env.NODE_ENV = 'warehouse'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.warehouse.conf')

const spinner = ora('building for release...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err
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

        console.log(chalk.cyan('  release complete.\n'));
        console.log(chalk.green('继续上传到远程服务器'));

        remote.scp('dist/static/', {
            host: '172.18.8.10',
            username: 'root',
            password: 'rondaful',
            path: '/srv/rsync/vue-deskop/vue-deskop/dist'
        }, function (err) {
            if(err){
                console.error(err);
                process.exit(1);
            }
            remote.scp('dist/index.html',{
                host: '172.18.8.10',
                username: 'root',
                password: 'rondaful',
                path: '/srv/rsync/vue-deskop/vue-deskop/dist'
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
});

