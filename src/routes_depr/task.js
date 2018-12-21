/**
 * Created by wcg on 16-10-14.
 */

export default [
    { path: '/task', components:{
        default:function(resolve){
            return resolve(require('../view/task/task.vue').default);
        }
    }}
];