/**
 * Created by wuchuguang on 17-1-21.
 */


function data2string(data) {
    return JSON.stringify(data);
}

function string2data(string) {
    return JSON.parse(string);
}

//https://github.com/dfahlander/Dexie.js/wiki/API-Reference
//https://github.com/localForage/localForage
let cache = {
    install(Vue, options){
        Vue.mixin({
            created(){
                this.$options.$cacheSet = function (key, data, timeout) {
                    localStorage.setItem(`cache$${key}`,data2string(data));
                };
                this.$options.$cacheGet = function (key) {
                    let value = localStorage.getItem(`cache$${key}`);
                    if(value){
                        return string2data(value);
                    }else{
                        return undefined;
                    }
                };
                this.$options.$cacheDel = function (key) {
                    localStorage.removeItem(`cache$${key}`);
                };
            }
        })
    }
};

export default cache;