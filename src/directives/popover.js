/**
 * Created by wuchuguang on 17-7-4.
 */

export default function(Vue){
    Vue.directive('popover', {
        bind(el, binding, vnode) {
            vnode.context.$refs[binding.arg].$refs.reference = el;
        }
    });
};
