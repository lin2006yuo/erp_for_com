/**
 * Created by wuchuguang on 17-1-6.
 */
export default {
    data() {
        return {};
    },

    mounted() {
        this.timer = setInterval(this.clearLoseOldNavs, 5000)
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        clearLoseOldNavs() {
            if (this.change) {
                this.change = false;
                Object.keys(this.oldNavs).forEach(router => {
                    if (this.oldNavs.hasOwnProperty(router)) {
                        let find = this.navs.find(nav => {
                            return router === nav.router;
                        });
                        if (!find) {
                            delete this.oldNavs[router];
                        }
                    }
                });
            }
        }
    },
    props: {
        navs: {}
    },
    computed: {
        soberNavs() {
            return this.navs.filter(nav => !nav.rest);
        }
    },
    render(createElement) {
        this.change = true;
        if (!this.oldNavs) {
            this.oldNavs = {};
        }
        let call_hook = (node, callbacks) => {
            callbacks.forEach(callback => {
                callback.call(node);
            });
        };
        let childsObj = {};
        let childs = this.soberNavs.map(nav => {
            let style = {};
            let vnode = null;
            let bool = nav.active;
            if (!bool) {
                style = {
                    display: 'none'
                };
            }
            let navComponent = this.oldNavs[nav.router] ? this.oldNavs[nav.router].component : nav.component;
            vnode = createElement(navComponent, {
                page__: true,
                paths__: nav.router,
                key: nav.router,
                style: style, ref: 'page', on: {
                    created(comp) {
                        comp['param'] = nav.param;
                        comp['query'] = nav.query;
                    },
                    param(comp, _new, _old) {
                        comp['param'] = _new;
                        if (comp.$options.watch) {
                            if (comp.$options.watch instanceof Object) {
                                if (comp.$options.watch['param']) {
                                    comp.$options.watch['param'].call(comp, _new, _old);
                                }
                                return;
                            }
                        }
                    },
                    query(comp, _new, _old) {
                        comp['query'] = _new;
                        if (comp.$options.watch) {
                            if (comp.$options.watch instanceof Object) {
                                if (comp.$options.watch['query']) {
                                    comp.$options.watch['query'].call(comp, _new, _old);
                                }
                                return;
                            }
                        }
                    }
                }
            });
            this.$nextTick(() => {
                if (vnode && vnode.child && vnode.child.$options) {
                    let node = vnode.child;
                    node.$options.page_active = bool;
                    if (node.$options.__MESSAGES === undefined) {
                        node.$options.__MESSAGES = [];
                    }
                    // console.log(node.$options.page_active,bool,'bool');
                    // console.log(node.$options,'node.$options');
                    if (node.$options.page_active) {
                        if (node.$options.__MESSAGES) {
                            let message;
                            while (message = node.$options.__MESSAGES.shift()) {
                                this.$message(message);
                            }
                        }
                    }
                    if (this.oldNavs[nav.router]) {
                        let oldNav = this.oldNavs[nav.router];
                        if (!isObjectValueEqual(oldNav.param, obj2value(nav.param))) {
                            node.$emit('param', node, nav.param, oldNav.param);
                        }

                        if (!isObjectValueEqual(oldNav.query, obj2value(nav.query))) {
                            node.$emit('query', node, nav.query, oldNav.query);
                        }
                        if (oldNav.active !== bool) {
                            call_hook(node, node.$options.activated || []);
                        }
                    } else {
                        call_hook(node, node.$options.deactivated || []);
                    }
                    this.oldNavs[nav.router] = {
                        active: bool,
                        component: navComponent,
                        param: obj2value(nav.param),
                        query: obj2value(nav.query)
                    };

                }
            });
            childsObj[nav.router] = vnode;
            return vnode;
        });
        this.childs = childsObj;
        return <div class="fullwh">{childs}</div>;
    }
};
