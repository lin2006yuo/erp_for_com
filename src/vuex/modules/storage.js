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
        init(state, config){
            Vue.set(state.storages, config.key, initStorage(config));
        },
        storageInit(state, storageData){
            console.log(state.storages, storageData);
            if(!storageData.forceCovered){
                if(!state.storages[storageData.key]){
                    Vue.set(state.storages, storageData.key, storageData);
                }
            }else{
                Vue.set(state.storages, storageData.key, storageData);
            }
        },
        curRow(state, {key, value}){
            const storages = state.storages[key];
            let find  = null;
            if(storages) find = storages.data.find(row=>row.value===value);
            return find||{}
        },
        addPageData(state, {key, page, data}){
            console.log(state.storages[key].data);
            console.log(key, page, data);
            Vue.set(state.storages[key].data, page, data);
        },
        setCount(state, {key, count}){
            state.storages[key].count = count;
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
        addPageData({commit}, {key, page, data}){
            commit('addPageData', {key, page, data});
        },
        setCount({commit}, {key, count}){
            commit('setCount', {key, count});
        }
    },

    getters:{
        getPageData(state){
            return (key, page, options = {}) =>{
                const storage = state.storages[key];
                if(options.filter){
                }
                return storage?storage.data[page]:[]
            }
        },
        getAllOptions(state){
            return (key) =>{
                const storage = state.storages[key] || {data:[]};
                return Object.values(storage.data).reduce((ret, row) => [...ret, ...row])
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
        getOptions2(state){
            return (key,query)=>{
                const storage = state.storages[key];
                if(!!storage){
                    if(query!==''){
                        let filterData = [];
                        if(typeof query === 'number'){
                            filterData = storage.data.filter(row=>{
                                return Number(row.value)===Number(query)
                            });
                        }else{
                            filterData = storage.data.filter(row=>{
                                return row.label.toLowerCase().indexOf(query.toLowerCase())>-1
                            });
                        }
                        return splitData(filterData,storage.page,storage.pageSize);
                    }else{
                        return splitData(storage.data,storage.page,storage.pageSize);
                    }
                }else{
                    return []
                }
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
function splitData(storage,page,pageSize) {
    let start = (page-1)*pageSize;
    let end = start+ pageSize;
    return storage.slice(start,end);
}
function duplicateRemoval(newStorage,totalStorage){
    let filterData = newStorage.data.filter(row=>{
        return !totalStorage.data.find(res=>res.value===row.value)
    });
    totalStorage.data = [...totalStorage.data,...filterData];
    return totalStorage;
}
function getNewPage(state, config) {
    let storage =  state.storages[config.key];
    if(storage){
        let newPage = null;
        let page = storage.page;
        let pageSize = storage.pageSize;
        let count = storage.count;
        if(config.type ==='up'){
            if(page-1>0){
                newPage = page-1;
            }else{
                newPage = 1;
            }
        }else if(config.type === 'down'){
            if((page + 1) <= Math.ceil(count / pageSize)){
                newPage = page + 1;
            }else{
                newPage = 1;
            }
        }else{
            newPage = 1;
        }
        return newPage
    }
}
