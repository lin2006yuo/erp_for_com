export default {
    namespaced: true,
    state: {
        token: '',
        voices: [],
    },
    mutations: {
        set_token(state, data) {
            state.token = data;
        },
        set_voice(state, data) {
            console.log('set voice', data);
            let index = state.voices.findIndex(row => row.voice === data.voice)
            if (index !== -1) {
                state.voices.splice(index, 1, data);
            } else {
                state.voices.push(data);
            }
        }
    },
    actions: {
        set_token({commit}, data) {
            commit('set_token', data);
        },
        set_voice({commit}, data) {
            commit('set_voice', data);
        }
    },
    getters: {
        token(state) {
            return state.token;
        },
        voice(state) {
            return (voice) => state.voices.find(row => row.voice === voice);
        }
    }
};