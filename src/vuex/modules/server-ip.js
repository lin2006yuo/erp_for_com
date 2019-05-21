/**
 * Created by Administrator on 2017/9/4.
 */
export default {
    namespaced:true,
    state:{
        info:[]
    },
    mutations:{
        set_info(state, info){
            state.info = info;
        },
        addServer(state, obj){
            let temp = state.info.find(row=>{
                if(row.id === obj.id){
                    return true;
                }
            });
            if(!temp){
                state.info.push(obj);
            }
        },
        editServer(state, obj){
            state.info.find((row, index)=>{
                if(row.id === obj.id){
                    state.info[index] = obj;
                }
            });
        },
        deleteServer(state, obj){
            state.info.find((row, index)=>{
                if(row.id === obj.id){
                    state.info.splice(index, 1);
                }
            });
        }
    },
    actions:{
        set_info({commit}, info){
            commit('set_info', info);
        },
        addServer({commit}, obj){
            commit('addServer', obj);
        },
        editServer({commit}, obj){
            commit('editServer', obj);
        },
        deleteServer({commit}, obj){
            commit('deleteServer', obj);
        },
    },
    getters:{
        info:state=>state.info,
        ipList:state=>state.info.map(row=>{
            return {
                label:`${row.ip}(${row.name})`,
                value:row.id
            }
        }),
        search_ipList:state=>{
            let ipList = state.info.map(row=>{
                return {
                    label:`${row.ip}(${row.name})`,
                    value:row.id
                }
            });
            ipList.unshift({label:'全部',value:''});
            return ipList;
        }
    }
};