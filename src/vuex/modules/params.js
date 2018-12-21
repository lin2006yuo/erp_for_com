/**
 * Created by RondaFul on 2017/10/11.
 */
import Vue from 'vue';
export default {
    namespaced:true,
    state: {

    },
    mutations:{
        setChannelAccount(state,data){
            Vue.set(state,data.type,data.channels)
        },
    },
    actions: {
        setChannelAccount({commit}, data){
            commit('setChannelAccount', data);
        },
    },
    getters:{
        channelAccount(state){
            return (type)=>{
                    return state[type]||[]
            }
        },
    },
}