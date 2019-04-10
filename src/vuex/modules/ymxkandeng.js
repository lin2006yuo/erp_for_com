import Vue from 'vue';
export default{
    namespaced:true,
    state:{
        //分类模板数据
        categoryTemplate:{},
        //产品模板属性
        productTemplateAttr:{},
        //产品id
        productId:{},
    },
    mutations:{
        setCateTemplate(state,config){
            if(!state.categoryTemplate[config.key]) Vue.set(state.categoryTemplate,config.key,config.data);
        },
        setProductAttr(state,config){
            if(!state.productTemplateAttr[config.key]) Vue.set(state.productTemplateAttr,config.key,config.data);
        },
        setProductId(state,config){
            if(!state.productId[config.key]) Vue.set(state.productId,config.key,config.data);
        },
    },
    actions:{
        setCateTemplate({commit},config){
            commit('setCateTemplate',config)
        },
        setProductAttr({commit},config){
            commit('setProductAttr',config);
        },
        setProductId({commit},config){
            commit('setProductId',config);
        },
    },
    getters:{
        categoryTemplateList(state){
            return state.categoryTemplate
        },
        productAttr(state){
            return state.productTemplateAttr
        },
        productId(state){
            return state.productId
        }

    }
}
