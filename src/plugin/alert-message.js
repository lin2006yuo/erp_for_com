import alertMessage from '@/components/alert-message';
let instance;
export default {
    install(Vue){
        Vue.prototype.$alertMsg = (options) =>{
            console.log(options)
            const AlertMessage = Vue.extend(alertMessage);
            instance = new AlertMessage(Object.assign({},options,{value:true}))
            instance.vm = instance.$mount();
            console.log(instance.vm.$el)
            document.body.appendChild(instance.vm.$el);
            instance.dom = instance.vm.$el;
            return instance.vm;
        }
    }
}