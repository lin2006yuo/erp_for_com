/**
 * Created by RondaFul on 2017/6/13.
 */
const getField = (mdfs) => {
    //return键值数组
    mdfs = Object.keys(mdfs);
    if (mdfs[0]) {
        return mdfs[0];
    } else {
        console.error(`sf not define field`)
    }
};
export default function (Vue) {
    Vue.directive('sf', {
        /**
         * 
         * @param {*} vnode.componentInstance 组件vue实例 el-select
         * @param {*} vnode.componentInstance.$parent 父组件vue实例 label-item
         * @param {*} bind 
         * @param {*} vnode 组件虚拟DOM
         */
        bind(el, bind, vnode) {
            if (!vnode.componentInstance) {
                return console.error(`v-sf must use in VueCompoment`);
            }
            console.log({ bind })
            console.log({ vnode })
            const field = getField(bind.modifiers); //field 为snType
            function injectBox(parent) {
                if (!parent) {
                    return console.error('error');
                }
                if (parent._isVue && parent.fieldComponents) {
                    parent.fieldComponents[field] = vnode;
                } else {
                    injectBox(parent.$parent);
                }
            }
            injectBox(vnode.componentInstance.$parent);
        },
        update(el, bind, vnode) {
            const field = getField(bind.modifiers);
            function injectBox(parent) {
                if (!parent) {
                    console.error('error');
                }
                if (parent._isVue && parent.fieldComponents) {
                    parent.fieldComponents[field] = vnode;
                } else {
                    injectBox(parent.$parent);
                }
            }
            injectBox(vnode.componentInstance.$parent);
        },
        unbind(el, bind, vnode) {
            const field = getField(bind.modifiers);
            function removeBox(parent) {
                if (!parent) {
                    console.error('error');
                }
                if (parent._isVue && parent.fieldComponents) {
                    delete parent.fieldComponents[field];
                } else {
                    removeBox(parent.$parent);
                }
            }
            removeBox(vnode.componentInstance.$parent);
        },
    })
};