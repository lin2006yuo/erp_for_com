/**
 * Created by wcg on 16-10-14.
 */


export default [
    { path: '/setting', components:{
        default:function(resolve){
            return resolve(require('../view/setting/setting.vue').default);
        }
    }},
];