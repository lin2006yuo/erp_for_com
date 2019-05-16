import Vue from 'vue';
export default {
    namespaced:true,
    state:{
        storages:{

        }
    },
    mutations:{
        clearStorage(state, key){
            // state.storages[key] = initStorage(state.storages[key]);
        },
        storageInit(state, storageData){
            if(!storageData.forceCovered){
                if(!state.storages[storageData.key]){
                    Vue.set(state.storages, storageData.key, storageData);
                }
            }else{
                Vue.set(state.storages, storageData.key, storageData);
            }
        },
        setData(state, {key, data}){
            console.log('mutation setdata', key, data)
            state.storages[key].data = data;
        },
        setCount(state, {key, count}){
            state.storages[key].count = count;
        },
        async tryLoadOptions(state, {key, callback, execute}){
            if(!state.storages[key]){
                await callback(execute);
            }

        }
    },

    actions:{
        clear({commit}, key){
            commit('clearStorage', key);
        },
        init({commit}, config){
            commit('init', config)
        },
        storageInit({commit}, initStorageData){
            commit('storageInit', initStorageData);
        },
        curRow({commit}, key, value){
            commit('curRow',key,value)
        },
        setData({commit}, {key, data}){
            commit('setData', {key, data});
        },
        setCount({commit}, {key, count}){
            commit('setCount', {key, count});
        },
        tryLoadOptions({commit}, {key, callback, execute}){
            commit('tryLoadOptions', {key, callback, execute});
        }
    },

    getters:{
        getPageData(state){
            return (key, page, pageSize) =>{
                const storage = state.storages[key] || {data:[]};
                let offset = (page - 1) * pageSize;
                return storage.data.slice(offset, offset + pageSize);
            }
        },
        getAllOptions(state){
            return (key) =>{
                const storage = state.storages[key] || {data:[]};
                return storage.data || [];
            }
        },
        getCount(state){
            return (key) =>{
                const storage = state.storages[key] || {};
                return storage.count || 0;
            };
        },
        isInit(state){
            return (key) => {
                return !!state.storages[key];
            }
        },
        getStorages(state){
            return ()=>{
                return state.storages
            }
        }
    }
}

function initStorage(config, timeout = 3 * 3600 * 1000){
    return {
        url:config.url,
        count:config.count,
        data:config.data,
        timeout:Date.now() + timeout
    }
}
