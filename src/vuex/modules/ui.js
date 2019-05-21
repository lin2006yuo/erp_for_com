export default {
    namespaced: true,
    state: {
        viewMode:'nav'
    },
    mutations:{
        changeViewMode(state, mode){
            state.viewMode = mode;
        }
    },
    actions:{
        changeViewMode({commit}, mode){
            commit('changeViewMode', mode);
        }
    },
    getters:{
        viewMode(state){
            return state.viewMode;
        }
    }
};