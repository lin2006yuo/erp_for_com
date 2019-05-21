/**
 * Created by RondaFul on 2017/10/11.
 */
export default {
    namespaced:true,
    state: {
        globals:[],
        locals:[],
        diys:getDiys()
    },
    mutations:{
        globals(state, globals){
            state.globals = globals;
        }
    },
    actions: {
        globals({commit}, globals){
            commit('globals', globals)
        }
    },
    getters:{
        all(state){
            return [...state.globals, ...state.locals, ...state.diys];
        },
        diys(state){
            return state.diys || [];
        },
        locals(state){
            return state.locals || [];
        },
        globals(state){
            return state.globals || [];
        }
    },
}

function getDiys(){
    let diys = localStorage.getItem(`printers|diys`);
    if(diys){
        return JSON.parse(diys);
    }else{
        return [];
    }
}

function setDiys(diys){
    localStorage.setItem(`printers|diys`, JSON.stringify(diys));
}