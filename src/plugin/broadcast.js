/**
 * Created by wuchuguang on 17-6-3.
 */
export default {
    install(Vue){
        Vue.mixin({
            methods:{
                $broadcast(event, ...argvs){
                    const borad = (children) =>{
                        let isBreak = false;
                        children.forEach(child=>{
                            const events = child.$options.events || {};
                            if(events[event]){
                                const result = events[event].call(child, ...argvs);
                                if(!result){
                                    isBreak = true;
                                }
                            }
                        });
                        if(!isBreak){
                            children.forEach(child=>{
                                borad(child.$children);
                            })
                        }
                    };
                    borad(this.$children);
                }
            },
        })
    }
};