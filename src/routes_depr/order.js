/**
 * Created by wcg on 16-10-11.
 */


export default [
    { path: '/order/history', components:{
        default:function(resolve){
            return resolve(require('../view/order/history.vue').default);
        }
    }}
];