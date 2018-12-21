function proxyMethod(name, func, object){
    let call = function(){
        object.loadings[name] = true;
        let ret = func.call(object, ...arguments)
        if(ret instanceof Promise){
            ret.finally(() =>{
                object.loadings[name] = false;
            })
        }else{
            console.error(`component menthod ${name} is not return promise`);
            object.loadings[name] = false;
        }
    };
    return call.bind(object);
}
export default function(Vue){
    Vue.directive('autoload', {
        bind(el, bind, vnode){
            const method = bind.expression;
            const VC = vnode.context;
            if(VC.$options.methods[method]){
                VC[method] = VC.$options.methods[method] = proxyMethod(method, VC.$options.methods[method], VC);
            }
        }
    });
}
