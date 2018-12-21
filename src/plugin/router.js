/**
 * Created by wuchuguang on 16-10-28.
 */

export default {
    install(Vue, Options){
        Vue.mixin({
            beforeCreate(){
                if (this.$options.page) {
                    this.$options.page_active = false;
                    this.$options.created = this.$options.created || [];

                    this.$options.created.unshift(function () {
                        this.$emit('created', this);
                    });
                    this.$options.activated = this.$options.activated || [];
                    this.$options.activated.push(function () {
                        this.$options.page_active = true;
                    });
                    this.$options.deactivated = this.$options.deactivated || [];
                    this.$options.deactivated.push(function () {
                        this.$options.page_active = false;
                    });
                }
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
                    window.open(requrl);
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

