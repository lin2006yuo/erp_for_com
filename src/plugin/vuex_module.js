/**
 * Created by wuchuguang on 16-10-20.
 */

function getVuexModules(){
    if(this.$options.vuex_modules && this.$options.vuex_modules instanceof Object){
        return this.$options.vuex_modules;
    }else{
        return Object.create(null);
    }
}
export default {
    install(Vue, options){
        Vue.mixin({
            beforeCreate(){
                let modules = getVuexModules.call(this);
                for(module in modules){
                    if(modules.hasOwnProperty(module)){
                        this.$store.registerModule(module, modules[module]);
                    }
                }
            },
            beforeDestroy(){
                let modules = getVuexModules.call(this);
                for(module in modules){
                    if(modules.hasOwnProperty(module)){
                        this.$store.unregisterModule(module);
                    }
                }
            }
        })
    }
}