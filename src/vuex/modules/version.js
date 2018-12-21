/**
 * Created by wuchuguang on 16-10-29.
 */
import {api_reads} from '../../api/release';
const version_cache = 'version:reads';
async function getReads(){
    let reads = localStorage.getItem(version_cache);
    if(reads){
        return JSON.parse(reads);
    }else{
        reads = await api_reads();
        return reads;
    }
}

function setReads(reads){
    localStorage.setItem(version_cache, JSON.stringify(reads));
}

async function addRead(read){
    let reads = await getReads();
    if(reads.indexOf(read) >= 0){
        return false;
    }else{
        reads.push(read);
        setReads(reads);
        return true;
    }
}

export default {
    namespaced: true,
    state: {
        versions: []
    },
    mutations: {
        async readVersion(state, id) {
            let index = state.versions.indexOfFun(v => v.id === id);
            let version = state.versions[index];
            version.read = true;
            state.versions.splice(index, 1, version);
            await addRead(id);
        },
        load(state, versions){
            console.log('loads');
            getReads().then(reads =>{
                versions = versions.map(version =>{
                    version.read = reads.indexOf(version.id)>=0;
                    return version;
                });
                state.versions = versions;
            })

        }
    },
    actions: {
        readVersion({commit}, id) {
            commit('readVersion', id);
        },
        load({commit}, versions){
            commit('load', versions);
        }
    },
    getters: {
        versions: state => state.versions
    }
};