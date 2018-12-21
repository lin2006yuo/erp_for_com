/**
 * Created by wcg on 16-10-12.
 */


export default [
    { path: '/entrepot', components:{
        default:function(resolve){
            return resolve(require('../view/entrepot/index.vue').default);
        }
    }},
];