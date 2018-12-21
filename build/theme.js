/**
 * Created by alison on 16-11-7.
 */

/**
 * Created by wuchuguang on 16-11-7.
 */

var et = require('element-theme')

// watch mode
et.watch({
    config: './element-variables.css',
    out: './theme/'
})

// build
et.run({
    config: './element-variables.css',
    out: './theme/',
    minimize: false
})
