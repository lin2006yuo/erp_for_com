/**
 * Created by wuchuguang on 17-1-6.
 */
import Vue from 'vue';
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
                nav_index: nav.index,
                key: nav.router,
                param:nav.param || {},
                query:nav.query || {},
                style: style,
                ref: 'page',
            });
            this.$nextTick(() => {
                if (vnode && vnode.child && vnode.child.$options) {
                    let node = vnode.child;
                    node.$options.page_active = bool;
                    if (node.$options.__MESSAGES === undefined) {
                        node.$options.__MESSAGES = [];
                    }
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
            console.log(`navRouter:${nav.router}`, vnode);
            return vnode;
        });
        this.childs = childsObj;
        return <div class="fullwh">{childs}</div>;
    }
};
