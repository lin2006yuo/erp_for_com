
export default {
    namespaced:true,
    state:{
        ids:[],
        dataTable:[],
    },
    mutations:{
        get_ids(state,info){
            if(info.length<=0)return;
            state.ids = [...state.ids,...info];
        },
        get_table(state,info){
            if(info.length<=0)return;
            state.dataTable = [...state.dataTable,...info];
        },
        replace_table(state,info){
            if(info.length<=0)return;
            state.dataTable.forEach(row=>{
                let find = info.find(res=>res.id===row.listing_id);
                if(!!find){
                    Object.assign(row,find);
                }
            });
        },
        clear_data(state){
            state.ids = [];
            state.dataTable = [];
        },
        remove_ids(state,ids){
            let index = state.ids.findIndex(row=>row===ids);
            if(index>-1)state.ids.splice(index,1);
        },
    },
    actions:{
        get_ids({commit},info){
            commit('get_ids',info);
        },
        get_table({commit},info){
            commit('get_table',info);
        },
        clear_data({commit}, info){
            commit('clear_data');
        },
        remove_ids({commit},info){
            commit('remove_ids',info);
        },
        replace_table({commit},info){
            commit('replace_table',info)
        }
    },
    getters:{
        ids:state=>state.ids.join(','),
        dataTable:state=>state.dataTable
    }
};