import Vue from 'vue';
export default {
    namespaced: true,
    state: {
        reqKeys:{}
    },
    mutations:{
        setReqKey(state, {key, val}){
            // console.log(Vue, Vue.$set);
            if(state.reqKeys[key] === undefined){
                Vue.set(state.reqKeys, key, val);
            }else{
                state.reqKeys[key]= val;
            }
        }
    },
    actions:{
        setReqKey({commit}, {key, val}){
            commit('setReqKey', {key, val});
        }
    },
    getters:{
        getReqKey(state){
            return (key) => state.reqKeys[key];
        }
    }
};