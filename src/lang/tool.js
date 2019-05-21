import Vue from "vue";

export default function(modules){
    let result = {};
    modules.keys().forEach(key => {
        let re = /([\w\d_-]+)\.js$/i.exec(key);
        if(re){
            console.log(`key:${key}`);
            const mod = modules(key).default;
            result[re[1]] = mod;
        }
    });
    return result;
}
