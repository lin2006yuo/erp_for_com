export default {
    namespaced:true,
    state:{
        unfinish_list:[]
    },
    mutations:{
        push_wait_sorting(state, data){
            const index = state.unfinish_list.findIndex(unfinish=>unfinish.picking_id ===data.picking_id);
            if(index >= 0){
                state.unfinish_list.splice(index, 1, data)
            }else{
                state.unfinish_list.unshift(data);
            }
        }
    },
    actions:{
        push_wait_sorting({commit}, data){
            commit('push_wait_sorting', data);
        }
    },
    getters:{
        unfinish_list(state){
            return state.unfinish_list;
        }
    }
};