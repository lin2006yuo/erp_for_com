import datef from 'datef';
import * as register from '@/api/register-company';
export class actions {
    get_register_status(that){
        that.$http(register.api_get_register_status).then(res=>{
            that.buttonStatus=[{label:'全部',value:''},...res];
        }).catch( error =>{
            error&&that.$message({type:'error', message:error.message||error});
        });
    }

    register_init(that){
        let data=that.searchData;
        that.loading=true;
        data.create_time_st=that.searchData.create_time_st?datef('YYYY-MM-dd',that.searchData.create_time_st):'';
        data.create_time_nd=that.searchData.create_time_nd?datef('YYYY-MM-dd',that.searchData.create_time_nd):'';
        that.$set(data,'page',that.tableData.page);
        that.$set(data,'pageSize',that.tableData.pageSize);
        that.$http(register.api_get_register_company_list,data).then(res=>{
            res.data.forEach(row=>{
                that.$set(row,'create_time_txt',row.create_time_txt?row.create_time_txt:'--')
            });
            res.page=Number(res.page);
            res.pageSize=Number(res.pageSize);
            that.tableData=res;
        }).catch( error =>{
            error&&that.$message({type:'error', message:error.message||error});
        }).finally(()=>{
            that.loading=false;
        });
    }

    add_audit_corporation(that,param){ //param.submit_code:submit_audit 提交给工商代理审核,save 保存
        param.id_date_st=datef('YYYY-MM-dd',param.id_date_st);
        param.id_date_nd=param.id_date_nd?datef('YYYY-MM-dd',param.id_date_nd):'';
        that.$http(register.api_add_corporation_info,param).then(res=>{
            // that.$set(that.dialogForm,'id',res.data.id);
            that.$message({type:'success',message:res.message||res});
            that.$set(that,'show',false);
            that.$emit('refresh');
        }).catch( error =>{
            error&&that.$message({type:'error', message:error.message||error});
        });
    }

    operate(that,row,string){
        that.$http(register.api_get_corporation_info,row.id).then(res=>{
            let front=JSON.parse(res.corporation_id_front);
            let back=JSON.parse(res.corporation_id_contrary);
            res.corporation_id_front=front.map(front=>{
                return {path:res.url_prefix+'/'+front.filePath,is_add:false,file_name:front.fileName,file_content:front.filePath};
            });
            res.corporation_id_contrary=back.map(back=>{
                return {path:res.url_prefix+'/'+back.filePath,is_add:false,file_name:back.fileName,file_content:back.filePath}
            });
            res.id_date_st=res.id_date_st*1000;//必填项
            res.id_date_nd=res.id_date_nd?res.id_date_nd*1000:'';
            res.id_date_nd_txt=res.id_date_nd?res.id_date_nd_txt:'长期有效';
            that.flag=string==='look-over'?1:2;
            Object.assign(that.form,res);
            that.actions.get_company_info(that,row);
        }).catch( error =>{
            error&&that.$message({type:'error', message:error.message||error});
        });
    }

    get_company_info(that,row){
        that.$http(register.api_get_company_info,row.id).then(res=>{
            console.log(res,'test');
            let first=!!res.business_term_st&&!!res.company;
            if(first){
                that.$set(that.form,'type',res.type);
                that.$set(that.form,'source',res.source);
            }else{//流程首次展示
                that.$set(that.form,'type','');
                that.$set(that.form,'source','');
            }
            if(row.status===1){//作废
                if(first){
                    that.$set(that.form,'status',3);
                }else{
                    that.$set(that.form,'status',2);
                }
            }else if(row.status===2||row.status===3){//接收法人资料 工商代理审核中
                that.$set(that.form,'status',row.status-1);
            }else if(row.status===4||row.status===5){//工商代理审核未通过 待批执照
                that.$set(that.form,'status',row.status-2);
            }else{
                that.$set(that.form,'status',row.status-3);
            }
            that.$set(that.form,'status_text',row.status_txt);
            that.$set(that.form,'company',res.company);
            that.$set(that.form,'company_registration_number',res.company_registration_number);
            that.$set(that.form,'business_term_st',res.business_term_st?res.business_term_st*1000:'');
            that.$set(that.form,'business_term_nd',res.business_term_nd?res.business_term_nd*1000:'');
            that.$set(that.form,'company_time',res.company_time?res.company_time*1000:'');
            that.$set(that.form,'company_address_zip',res.company_address_zip);
            that.addEditShow=true;
        }).catch( error =>{
            error&&that.$message({type:'error', message:error.message||error});
        });
    }

    update_corporation_info(that,param,id){
        param.id_date_st=datef('YYYY-MM-dd',param.id_date_st);
        param.id_date_nd=param.id_date_nd?datef('YYYY-MM-dd',param.id_date_nd):'';
        that.$http(register.api_update_corporation_info,id,param).then(res=>{
            that.$message({type:'success',message:res.message||res});
            if(param.submit_code==='audit_fail'){
                that.remarkShow=false;
                that.$set(that.dialogForm,'status_text','工商代理审核未通过');
            }else{
                that.$set(that,'show',false);
                that.$emit('refresh');
            }
        }).catch( error =>{
            error&&that.$message({type:'error', message:error.message||error});
        });
    }

    audit_company_info(that,id,param){
        param.business_term_st=datef('YYYY-MM-dd',param.business_term_st);
        param.business_term_nd=param.business_term_nd?datef('YYYY-MM-dd',param.business_term_nd):'';
        param.company_time=param.company_time?datef('YYYY-MM-dd',param.company_time):'';
        that.$http(register.api_save_company_info,id,param).then(res=>{
            if(param.submit_code==='audit_success'){
                that.$set(that.dialogForm,'status',4);
                that.$set(that.dialogForm,'status_text','待领执照');
                that.$set(that,'show',false);
                that.$emit('refresh');
            }else{
                that.$set(that.dialogForm,'status_text','待批执照未通过');
                that.$set(that.dialogForm,'licence_status',true);
                that.remarkShow=false;
                that.activeTab='corporationInfo';
            }
            that.$message({type:'success',message:res.message||res});

        }).catch( error =>{
            error&&that.$message({type:'error', message:error.message||error});
        });
    }

    submit_save_licence(that,id,param){
        that.$http(register.api_save_business_licence,id,param).then(res=>{
            that.$message({type:'success',message:res.message||res});
            that.$set(that.dialogForm,'status',5);
            that.$set(that.dialogForm,'status_text','待结账');
            that.$set(that,'show',false);
            that.$emit('refresh');
        }).catch( error =>{
            error&&that.$message({type:'error', message:error.message||error});
        });
    }

    submit_balance_info(that,string,bool){
        that.$http(register.api_save_balance_info,that.dialogForm.id,{
            corporate_settlement:that.dialogForm.corporate_settlement,
            agency_settlement:that.dialogForm.agency_settlement,
            has_seal:that.dialogForm.has_seal,
            settlement_remark:that.dialogForm.settlement_remark,
            submit_code:string
        }).then(res=>{
            that.$message({type:'success',message:res.message||res});
            if(string==='audit_submit'){//待领公章按钮 注册完成按钮
                if(bool){
                    that.$set(that,'show',false);
                    that.$emit('refresh');
                }else {
                    that.$set(that.dialogForm,'status',6);
                    that.$set(that.dialogForm,'status_text','待领公章');
                }
            }else if(string==='audit_success'){//领取公章按钮 和
                that.$set(that.dialogForm,'status',7);
                that.$set(that.dialogForm,'status_text','注册完成');
                that.$set(that,'show',false);
                that.$emit('refresh');
            }else{//save
                that.$set(that,'show',false);
                that.$emit('refresh');
            }
        }).catch( error =>{
            error&&that.$message({type:'error', message:error.message||error});
        });
    }

    get_operation_info(that,id){
        that.$http(register.api_get_operation_info,id).then(res=>{
            that.$set(that.dialogForm,'log',res);
        }).catch( error =>{
            error&&that.$message({type:'error', message:error.message||error});
        });
    }
}