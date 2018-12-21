/**
 * Created by wcg on 16-10-13.
 */

export default [
    { path: '/mall/product', components:{
        default:function(resolve){
            return require(['../view/mall/product/index.vue'], resolve);
        }
    }},
];
