
import {api_get_queue_consuming} from '@/api/queue';
export function init_element(that,param) {
    that.elementLoading=true;
    that.$http(api_get_queue_consuming,{key:param}).then(res=>{
        console.log(res,12213);
        that.consumingTitle=`当前Task：${param}正在消费的消息`;
        that.elementArr=res.message;
        that.elementLoading=false;
        that.elementShow=true;
    }).catch( error =>{
        error&&that.$message({type:'error', message:error.message||error});
    });
}