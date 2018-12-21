/**
 * Created by wuchuguang on 17-6-23.
 */

export default {
    namespaced:true,
    state:{
        goodsCategory:[]
    },
    mutations:{
        goodsCategory(state, goodsCategory){
            state.goodsCategory = goodsCategory;
        }
    },
    actions:{
        goodsCategory({commit}, goodsCategory){
            commit('goodsCategory', goodsCategory)
        }
    },
    getters:{
        goodsCategory(state){
            return state.goodsCategory;
        }
    }

};