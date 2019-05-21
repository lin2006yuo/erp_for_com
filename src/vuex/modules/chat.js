import {getItem, setItem} from "../../lib/localStorage";

export default {
    namespaced: true,
    state: {
        users:[
            {userid:'',nick:'',icon:'search',lastChatMsg:'xfasf',lastChatTime:13242322},
            {userid:'',nick:'',icon:'search',lastChatMsg:'xfasf',lastChatTime:13242322},
            {userid:'',nick:'',icon:'search',lastChatMsg:'xfasf',lastChatTime:13242322},
            {userid:'',nick:'',icon:'search',lastChatMsg:'xfasf',lastChatTime:13242322},
        ],
        opens:[
            {userid:1111,nick:'asdfasf',icon:'xxxx'},
            {userid:1111,nick:'asdfasf',icon:'xxxx'},
            {userid:1111,nick:'asdfasf',icon:'xxxx'},
            {userid:1111,nick:'asdfasf',icon:'xxxx'},
            {userid:1111,nick:'asdfasf',icon:'xxxx'},
            {userid:1111,nick:'asdfasf',icon:'xxxx'},
            {userid:1111,nick:'asdfasf',icon:'xxxx'},
            {userid:1111,nick:'asdfasf',icon:'xxxx'},
        ],
        message:{},
        ding:getItem('chat:ding',false)
    },

    mutations: {
        changeDing(state, ding){
            state.ding = ding;
            setItem('chat.ding', ding);
        },

        sendMessage(state, userid, message) {
            let umsgs = state.message[userid] || [];
            umsgs.push(message);
        },

        recvMessage(state, fromid, message){
            let umsgs = state.message[fromid] || [];
            umsgs.push(message);
        },
        readMessage(state, userid){
            let umsgs = state.message[userid] || [];
            state.message[userid] = umsgs.map(msg => {
                msg.read = true;
            });
        },

        addUser(state, user){
            if(!state.users.find(u=>u.userid === user.userid)){
                state.users.push(user);
            }
        },
        remUser(state, userid){
            let index = state.users.indexOfFun(u=>u.userid === userid);
            if(index >= 0){
                state.users.splice(index, 1);
            }
        },

        addOpen(state, user){
            if(!state.opens.find(u=>u.userid === user.userid)){
                state.opens.push(user);
            }
        },
        remOpen(state, userid){
            let index = state.opens.indexOfFun(u=>u.userid === userid);
            if(index >= 0){
                state.opens.splice(index, 1);
            }
        },
        save(state){
        }
    },

    actions: {
        changeDing({commit}, ding){
            commit('changeDing', ding);
        },

        sendMessage({commit}, userid, message){
            commit('sendMessage', userid, message);
        },

        recvMessage({commit}, fromid, message){
            commit('recvMessage', fromid, message);
        },
        readMessage({commit}, userid){
            commit('readMessage', userid);
        },

        addUser({commit}, user){
            commit('addUser',user);
        },
        remUser({commit}, userid){
            commit('remUser',userid);
        },

        addOpen({commit}, user){
            commit('addOpen',user);
        },
        remOpen({commit}, userid){
            commit('remOpen',userid);
        },
    },

    getters: {
        ding(state){
            return state.ding;
        },
        users(state){
            return state.users;
        },
        opens(state){
            return state.opens;
        }
    }
};