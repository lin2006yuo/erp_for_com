/**
 * Created by wuchuguang on 17-6-30.
 */

export default {
    namespaced:true,
    state:{
        pages:[],
        roles:[1],
        apis:[]
    },
    mutations:{
        load(state, res){
            state.pages = res.pages;
            state.roles = res.roles;
            state.apis = res.apis || [];
        },
        addPermission(state, url){
            const index = state.apis.indexOf(url);
            if(index < 0){
                state.apis.push(url);
            }
        },
        delPermission(state, url){
            const index = state.apis.indexOf(url);
            if(index >= 0){
                state.apis.splice(index,1);
            }
        }
    },
    actions:{
        load({commit}, res){
            commit('load', res);
        },
        addPermission({commit}, url){
            commit('addPermission', url);
        },
        delPermission({commit}, url){
            commit('delPermission', url);
        }
    },
    getters:{
        hasPermission:state=>{
            return (url)=>{
                return state.roles.includes(1) || !!state.apis.find(api=>api===url);
            }
        },
        permission:state=>state.apis,
        roles:state=>state.roles
    }
};
