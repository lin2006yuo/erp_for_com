/**
 * Created by wuchuguang on 16-10-28.
 */

function findPage(vue){
    if(vue.$vnode.data.page__){
        let navIndex = vue.$vnode.data.nav_index;
        return vue.$store.getters['menu-nav/navs_cur'](navIndex);
    }
    return findPage(vue.$parent);
}
export default {
    install(Vue, Options){
        Object.defineProperty(Vue.prototype, '$page', {
            get(){
                console.log(this);
                this._page = this._page || findPage(this);
                return this._page;
            }
        });
        Vue.mixin({
            beforeCreate() {
                if (this.$options.page) {
                    this.$options.page_active = false;
                    this.$options.activated = this.$options.activated || [];
                    this.$options.activated.push(function () {
                        this.$options.page_active = true;
                    });
                    this.$options.deactivated = this.$options.deactivated || [];
                    this.$options.deactivated.push(function () {
                        this.$options.page_active = false;
                    });
                    let params = {};
                    const symbolParam = Symbol('param');
                    let querys = {};
                    const symbolQuery = Symbol('query');
                    this.$on('param', (comp, new_, old_) =>{
                        if(params[symbolParam]){
                            params[symbolParam].call(this, new_, old_);
                        }
                        for(let k in new_){
                            if(params[k]){
                                params[k].call(this, new_[k], old_[k] || undefined);
                            }
                        }
                    });
                    this.$on('query', (comp, new_, old_) =>{
                        if(params[symbolParam]){
                            params[symbolParam].call(this, new_, old_);
                        }
                        for(let k in new_){
                            if(params[k]){
                                params[k].call(this, new_[k], old_[k] || undefined);
                            }
                        }
                    });
                    const watchs  = this.$options.watch || {};
                    const __addWatchPage = (page, callback) =>{
                        let match = /^\$page(\.(query|param))?(\.([\d\w]+))?$/.exec(page);
                        if(match[2]){
                            switch (match[2]) {
                                case 'query':
                                    if(!match[4]){
                                        querys[symbolQuery] = callback;
                                    }else{
                                        querys[match[4]] = callback;
                                    }
                                    break;
                                case 'param':
                                    if(!match[4]){
                                        params[symbolParam] = callback;
                                    }else{
                                        params[match[4]] = callback;
                                    }
                                    break;
                            }
                        }
                    };
                    for(let page in watchs){
                        if(/^\$page/.test(page)){
                            __addWatchPage(page, watchs[page]);
                        }
                    }
                }

            },
            beforeDestroy(){
                if (this.$options.page) {
                    this.$emit('__pageDestory', this);
                    if(this.$options.pageDestory){
                        this.$options.pageDestory.call(this);
                    }
                }
            }
        });
        Vue.mixin({
            beforeCreate(){
                let self = this;
                this.$open = function () {
                    let router;
                    switch (arguments.length){
                        case 1:
                            router = arguments[0];
                            break;
                        case 2:
                            if (typeof arguments[1] !== 'object') {
                                console.error(`${arg} 隐性传参必需是对象`);
                                return
                            }
                            router = {paths: arguments[0], param: arguments[1]};
                            break;
                        case 3:
                            let param = arguments[1];
                            if (typeof param !== 'object') {
                                console.error(`${arg} 隐性传参必需是对象`);
                                return
                            }
                            router = Object.assign({},{paths: arguments[0], param: arguments[1]},arguments[2]);
                            break;
                        default:
                            return console.error(`this.$router.open support this.$router(|,|,,)`);
                    }
                    self.$store.dispatch('menu-nav/nav_open', router);
                    if (arguments.length === 1) {

                        return;
                    }
                    if (arguments.length === 2) {

                        return;
                    }
                    if(arguments.length === 3){

                    }

                };
                this.$openNew = function(paths){
                    const requrl = `${url('protocol')}://${url('hostname')}:${url('port')}${paths}`;
                    return window.open(requrl);
                };
                this.$cast = function (router) {
                    self.$store.dispatch('menu-nav/nav_cast_router', router);
                };
                this.$close = function (router) {
                    self.$store.dispatch('menu-nav/nav_close', router);
                };
                this.$active = function (router) {

                }
            }
        })
    }
};

