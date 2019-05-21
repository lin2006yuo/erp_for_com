/**
 * Created by wuchuguang on 17-7-4.
 */

function isPage(component) {
    return component.$options.page_active !== undefined;
}

function isPageShow(component) {
    return component.$options.page_active
}

export default {
    install(Vue) {
        Vue.mixin({
            created() {
                if (this.$message instanceof Function) {
                    const message = this.$message;
                    this.$message = this.$message__ = function (options) {
                        if (typeof options === 'string') {
                            options = {message: options};
                        }
                        message(Object.assign({showClose: true, type: 'success'}, options));
                    };
                    this.$messageNew = (options) => {
                        const cantShow = (parent, dialog = false) => {
                            if (parent.$children.find(row=>row.isDialog)) {
                                return parent.$children.find(row=>row.isDialog)
                            }
                            if (parent.isDialog) {
                                if (parent.show && parent.$parent && parent.$parent.isDialog === true) {
                                    return cantShow(parent.$parent, parent);
                                } else {
                                    return parent;
                                }
                            }
                            if (isPage(parent)) {
                                if (!isPageShow(parent)) {
                                    parent.$options.__MESSAGES.push(options);
                                    return false;
                                } else {
                                    return dialog ? dialog : true;
                                }
                            }
                            if (parent.$parent) {
                                return cantShow(parent.$parent);
                            }
                            return false;
                        };
                        const can = cantShow(this);
                        if (can) {
                            if (can === true) {
                                this.$message(options)
                            } else if (can !== false) {
                                can.showMessage(options);
                            }
                        }

                    };
                }
            }
        })
    }
};


