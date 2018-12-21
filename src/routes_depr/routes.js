/**
 * Created by wcg on 16-10-9.
 */

export default [
    { path: '/login', components:{
        default:function(resolve){
            return resolve(require('./../view/login.vue').default);
        }
    }},
    { path: '/test', components:{
        default:function(resolve){
            return resolve(require('./../view/test.vue').default);
        }
    }},
    { path: '/delivery-check/single-box/single-sku', components:{
        default:function(resolve){
            return resolve(require('./../view/entrepot/delivery-check/single-box/single-sku/single-sku.vue').default);
        }
    }},
    { path: '/delivery-check/twice-sorting', components:{
        default:function(resolve){
            return resolve(require('./../view/entrepot/delivery-check/twice-sorting/index.vue').default);
        }
    }},
    { path: '/pdf-preview', components:{
        default:function(resolve){
            return resolve(require('./../components/pdf-preview').default);
        }
    }},
    {path:'*',components:{
        default:function(resolve){
            return resolve(require('./../Router.vue').default);
        }
    }}
];
