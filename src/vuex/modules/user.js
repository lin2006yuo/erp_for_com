/**
 * Created by wuchuguang on 16-10-29.
 */

export default {
  namespaced:true,
  state:{
    info:{}
  },
  mutations:{
    set_info(state, info){
      state.info = info;
    }
  },
  actions:{
    set_info({commit}, info){
      commit('set_info', info);
    }
  },
  getters:{
    info:state=>state.info
  }
};