/**
 * Created by wcg on 16-10-10.
 */


export default [
    { path: '/stat', components:{
        default:function(resolve){
            return resolve(require('../view/stat.vue').default);
        }
    }}
];