/**
 * Created by RondaFul on 2017/10/11.
 */
export default {
    namespaced:true,
    state: {
        query:()=>{},
        find:()=>{},
        show:false
    },
    mutations:{
        show(state, show){
            state.show = show;
        },
        find(state, find){
            state.find = find;
        },
        query(state, query){
            state.query = query;
        },
    },
    actions: {
        show({commit}, show){
            commit('show', show)
        },
        find({commit}, find){
            commit('find', find)
        },
        query({commit}, query){
            commit('query', query)
        }
    },
    getters:{
        show:(state)=>state.show,
        find:(state)=>state.find,
        query:(state)=>state.query,
    },
}
