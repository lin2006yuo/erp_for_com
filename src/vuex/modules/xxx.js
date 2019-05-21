/**
 * Created by Administrator on 2017/7/11.
 */


export default {
    namespaced:true,
    state :{
        xxx:[],
        yyy:{},
        ggg:[1,3,5]
    },

    getters:{
        xxxFilexxx(state){
            return state.xxx;
        },
        yyy(state){
            return state.yyy;
        },
        isExistGGG(state){
            return (ggg) => state.ggg.includes(ggg);
        }
    },

    mutations:{
        setXXX(state, xxx){
            state.xxx = xxx;
        }
    },
    actions:{
        setXXX($store = {commit}, xxx){
            commit('setXXX', xxx)
        }
    }
};
