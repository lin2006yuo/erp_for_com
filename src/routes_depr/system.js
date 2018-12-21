/**
 * Created by wcg on 16-10-10.
 */

export default [
    { path: '/system/account', components:{
        default:function(resolve){
            return resolve(require('../view/system/account.vue').default);
        }
    }}
];