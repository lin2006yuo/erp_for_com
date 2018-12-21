/**
 * Created by wuchuguang on 16-11-2.
 */

const path = require('path');
const fs = require('fs');
module.exports = function () {
    let obj = Object.create(null);
    fs.readdirSync('./api/').forEach(file=>{
        file = `./api/${file}`;
        if(/\.json$/.test(file)){
            let temp = JSON.parse(fs.readFileSync(file).toString());
            obj = Object.assign(obj,temp);
        }
    });
    fs.watch('./api/',function (event, file) {
        file = `./api/${file}`;
        if(/\.json$/.test(file)){
            let temp = JSON.parse(fs.readFileSync(file).toString());
            obj = Object.assign(obj,temp);
        }
    });
    return obj;
};
