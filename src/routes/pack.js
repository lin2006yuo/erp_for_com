/**
 * Created by wuchuguang on 16-12-19.
 */


export default [
    {
        id:3,
        title:'首页',
        paths:'/dashboard',
        routeMap:{
            component(resolve){
                require(['@/view/dashboard'], resolve)
            }
        }
    },
    {
        id:'tt',
        title:'打印机设置',
        paths:'/setting-printer',
        routeMap:{
            component(resolve){
                require(['@/view/setting-printer'], resolve)
            }
        }
    }
];