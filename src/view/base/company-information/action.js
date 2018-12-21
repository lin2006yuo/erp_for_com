import {
    api_add_company_info, api_get_account_log, api_get_channel, api_keep_company_account, api_keep_update_vat,
    api_update_company_info
} from '@/api/company-info';
import datef from "datef";

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
    }).catch(({fail, error}) =>{
        fail&&that.$message({type:'warning',message:fail});
        error&&that.$message({type:'error', message:error});
    });
}
export function init_data(that) {//添加数据初始化
    that.businessPicture=[];
    that.IDFront=[];
    that.IDBack=[];
    that.accounts=[{label:''}];
    that.channelData=[];
}

export function add_company_info(that) {
    let validator=that.$refs.comp[0].validator;
    if(validator){
        let valid=that.$refs.comp[0].validator();
        if(valid instanceof Promise){
            valid.then(() =>{
                add_base_info();
            }).catch(errors =>{
                that.$message({type:'warning',message:`${errors}`});
            });
            return;
        }else if(valid===true){
            return add_base_info();
        }else{
            return
        }
    }
    function add_base_info() {
        if(that.form.company_time){
            that.form.company_time=datef('YYYY-MM-dd',that.form.company_time)
        }else {
            that.form.company_time='';
        }
        that.$http(api_add_company_info,that.form).then(res=>{
            that.$set(that.form,'company',res.data.company);
            that.$set(that.form,'charter_url',res.data.charter_url);
            that.$set(that.form,'company_type',res.data.company_type);
            that.$set(that.form,'company_registration_number',res.data.company_registration_number);
            that.$set(that.form,'corporation',res.data.corporation);
            that.$set(that.form,'corporation_id',res.data.corporation_id);
            that.$set(that.form,'corporation_id_front',res.data.corporation_id_front);
            that.$set(that.form,'company_time',res.data.company_time?res.data.company_time*1000:'');
            that.$set(that.form,'company_address_zip',res.data.company_address_zip);
            that.$set(that.form,'status',res.data.status);
            that.$set(that.form,'channel',res.data.channel);
            that.$set(that.form,'channel_count',res.data.channel_count);
            that.$set(that.form,'id',res.data.id);
            look_at_operation_log(that,that.form.id);
            that.activeName='accountInfo';
            let find=that.tabs.find(row=>row.name===that.activeName);
            if(find){
                that.$set(find,'isView',true);
            }
            that.$set(that.tabs[3],'isView',true);
            that.$message({type:'success',message:res.message||res});
        }).catch(code =>{
            that.$message({type: "error", message: code.message || code});
        });
    }
}

export function keep_account(that) {
    let param={
        collection_account:that.form.collection_account,
        credit_card:that.form.credit_card
    };
    that.$http(api_keep_company_account,that.form.id,param).then(res=>{
        that.$set(that.form,'collection_account',res.data.collection_account);
        that.$set(that.form,'credit_card',res.data.credit_card);
        if(!that.id){
            that.activeName='taxRate';
            let find=that.tabs.find(row=>row.name===that.activeName);
            if(find){
                that.$set(find,'isView',true);
            }
        }
        look_at_operation_log(that,that.form.id);
        that.$message({type:'success',message:res.message||res});
    }).catch( error =>{
        error&&that.$message({type:'error', message:error.message||error});
    });
}

export function look_at_operation_log(that,id) { //operation-log
    that.$http(api_get_account_log,id).then(res=>{
        res.data.forEach(row=>{
            // that.$set(row,'remark',row.remark.join(','))
        });
        that.$set(that.form,'log',res.data);
    }).catch( error =>{
        console.log(error);
    });
}

export function update_company_info(that) {//
    if(that.form.company_time){
        that.form.company_time=datef('YYYY-MM-dd',that.form.company_time)
    }else {
        that.form.company_time='';
    }
    let data={
        company:that.form.company,
        charter_url:that.form.charter_url,
        company_type:that.form.company_type,
        company_registration_number:that.form.company_registration_number,
        corporation:that.form.corporation,
        corporation_id:that.form.corporation_id,
        corporation_id_front:that.form.corporation_id_front,
        corporation_id_contrary:that.form.corporation_id_contrary,
        company_time:that.form.company_time,
        company_address_zip:that.form.company_address_zip,
        corporation_address_zip:that.form.corporation_address_zip,
        status:that.form.status,
        channel:that.form.channel
    };
    that.$http(api_update_company_info,that.form.id,data).then(res=>{
        that.$set(that.form,'company',res.data.company);
        that.$set(that.form,'charter_url',res.data.charter_url);
        that.$set(that.form,'company_type',res.data.company_type);
        that.$set(that.form,'company_registration_number',res.data.company_registration_number);
        that.$set(that.form,'corporation',res.data.corporation);
        that.$set(that.form,'corporation_id',res.data.corporation_id);
        that.$set(that.form,'corporation_id_front',res.data.corporation_id_front);
        that.$set(that.form,'company_time',res.data.company_time?res.data.company_time * 1000:'');
        that.$set(that.form,'company_address_zip',res.data.company_address_zip);
        that.$set(that.form,'status',res.data.status);
        that.$set(that.form,'channel',res.data.channel);
        that.$set(that.form,'channel_count',res.data.channel_count);
        that.$message({type:'success',message:res.message||res});
    }).catch((fail) =>{
        fail&&that.$message({type:'warning',message:fail.message||fail});
    });
}

export function keep_update_vats(that) {

    that.$http(api_keep_update_vat,that.form.id,{vat:that.form.vat}).then(res=>{
        that.$set(that.form,'vat',res.data.vat);
        if(that.flag!==1){
            look_at_operation_log(that,that.form.id);
        }
        if(!that.id){
            // that.activeName='operationLog';
            // let find=that.tabs.find(row=>row.name===that.activeName);
            // if(find){
            //     that.$set(find,'isView',true);
            // }
            that.$emit('refresh');
            that.show=false;
        }

        that.$message({type:'success',message:res.message||res});
    }).catch(error =>{
        error&&that.$message({type:'error', message:error.message||error});
    });

}


