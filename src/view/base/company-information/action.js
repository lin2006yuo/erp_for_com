import {api_get_account_log, api_get_channel,
} from '@/api/company-info';

export function get_channel(that) {//适用平台
    that.$http(api_get_channel).then(res=>{
        let channel_count={}.toString.call(that.form.channel_count);
        if(channel_count==='[object Array]'){

        }else if(channel_count==='[object Object]'){
            for(let val in that.form.channel_count){
                res.forEach(row=>{
                    if(Number(val)===row.value){
                        that.$set(row,'label',row.label+`(${that.form.channel_count[val]})`);
                    }
                })
            }
        }
        that.channels=res;
    }).catch(error =>{
        error&&that.$message({type:'error', message:error});
    });
}

export function look_at_operation_log(that,id) { //operation-log
    that.$http(api_get_account_log,id).then(res=>{
        that.$set(that.form,'log',res.data);
    }).catch( error =>{
        console.log(error);
    });
}
