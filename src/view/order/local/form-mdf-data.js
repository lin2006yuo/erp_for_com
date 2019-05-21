
export default {
    namespaced:true,
    state:{
        formData:[],
    },
    mutations:{
        get_form(state,info){
            if(!info)return;
            let find = state.formData.find(row=>info.id===row.id);
            if(find){
                Object.assign(find, info);
            }else{
                state.formData.push(info);
            }
        },
    },
    actions:{
        get_form({commit}, info){
            commit('get_form',info);
        },
    },
    getters:{
        formData:state=>state.formData
    }
};