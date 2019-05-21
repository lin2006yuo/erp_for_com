import Vue from 'vue';
export default {
    namespaced:true,
    state:{
        storages:{

        }
    },
    mutations:{
        init(state,config){
            Vue.set(state.storages,config.key,config.data);
        },
    },
    actions:{
        init({commit},config){
            commit('init',config);
        },
    },
    getters:{
        getAllOptions(state){
            return (key)=>{
                return state.storages[key]
            }
        }
    },
}
