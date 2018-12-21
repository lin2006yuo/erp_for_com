const vuedoc = require('@vuedoc/md/lib/cli').exec;
const fs = require('fs');
const path = require('path');
const realPath = path.resolve(__dirname, 'src/components');
let components = fs.readdirSync(realPath);
components = components.map(component => {
    return path.resolve(realPath, component)
});
const destPath = path.resolve(__dirname, 'doc/components');
components.forEach(async component =>{
    try{
        await vuedoc([component, '--output', destPath]);
    }catch (e) {
        console.log(e.message)
    }
});