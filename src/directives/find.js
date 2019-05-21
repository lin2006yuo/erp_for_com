export default function(Vue) {
    Vue.directive('find', {
        bind(el,bind, vnode){
            console.log(vnode)
        }
    })
};