//账号申请和基础资料添加手机号、邮箱
import {api_get_phone_info,api_get_email_info} from '@/api/account-apply'
export function init_phone_email(that,str,channel_id,bool) {
    switch (str){
        case '手机号':
            that.$http(api_get_phone_info,{
                phone:that.selectPhoneSearch.value,
                page:that.selectPhoneSearch.page,
                pageSize:that.selectPhoneSearch.pageSize
            }).then(res=>{
                that.selectPhoneData=res.list;
                that.total=res.count;
                that.selectPhoneShow=true;
            }).catch( error =>{
                error&&that.$message({type:'error', message:error.message||error});
            });
            break;
        case '邮箱':
            that.$http(api_get_email_info,{
                email:that.selectPhoneSearch.value,
                channel_id:channel_id,
                page:that.selectPhoneSearch.page,
                pageSize:that.selectPhoneSearch.pageSize
            }).then(res=>{
                that.selectPhoneData=res.list;
                that.total=res.count;
                if(bool){
                    let find=that.selectPhoneData.find(row=>row.email===that.editData.email);
                    if(!find){
                        that.$set(that.editData,'email','');
                    }
                }else{
                    that.selectPhoneShow=true;
                }
            }).catch( error =>{
                error&&that.$message({type:'error', message:error.message||error});
            });
            break;    
    }
}