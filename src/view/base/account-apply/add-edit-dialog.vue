<template>
    <page-dialog :title="title"
                 v-model="show"
                 width="70%"
                 @change="open_dialog"
                 @close="close"
                 class="c-account-apply-dialog">
        <el-form :model="formData" label-width="320px">
            <el-form-item label="当前账号状态：">
                <el-steps :space="120" :active="formData.status">
                    <el-step v-for="(item,index) in show_status(formData.status,formData.status_txt)"
                             :key="index"
                             :status="step_status(item,index)"
                             :title="item.label"
                    ></el-step>
                </el-steps>
            </el-form-item>
        </el-form>
        <el-tabs type="border-card" v-model="activeTab"
                 @tab-click="tab_click_item">
            <el-tab-pane v-for="tab in tabShow"
                         :label="tab.label"
                         :name="tab.value"
                         :key="tab.name" ref="pane">
                <base-info :form="formData" ref="base"
                           v-if="tab.value==='base'"
                           :flag="flag"
                           :creator-data="creatorData"
                           :company-data="companyData"
                           @site-info="get_site"
                           @get-site="get_company"
                           @submit-base="submit_base"
                           :ever-form="everForm">
                </base-info>
                <!--@get-site="get_company"-->
                <register-info :form="formData" ref="register"
                               v-if="tabs[1].show&&tab.value==='register'"
                               :flag="flag"
                               :site-options="siteOptions"
                               :multiple-amazon="multipleAmazon"
                               :ever-form="everForm"
                               @submit-register="submit_register"
                               :tempCardTitle="title"
                >
                </register-info>
                <audit-info :form="formData" ref="auditPane"
                            v-if="tabs[2].show&&tab.value==='audit'"
                            :flag="flag"
                            :ever-form="everForm"
                            @submit-audit="submit_audit">
                </audit-info>
                <registration-info :form="formData" ref="registration"
                                   v-if="tabs[3].show&&tab.value==='registration'"
                                   :flag="flag"
                                   :ever-form="everForm"
                                   @submit-register-result="submit_register_result"
                                   @close="close">
                </registration-info>
                <log-info :form="formData"
                          v-if="tabs[4].show&&tab.value==='log'">
                </log-info>
            </el-tab-pane>
        </el-tabs>
        <little-remark v-if="remarkShow&&activeTab==='registration'"
                       :title="remarkTitle"
                       :cardStyle="remarkStyle"
                       @remark-submit="remark_submit"
                       @cancel="remarkShow=false"></little-remark>
        <el-row slot="footer" class="dialog-footer">
            <el-button size="mini" @click="close">关 闭
            </el-button>
        </el-row>
    </page-dialog>
</template>

<script>
    import baseInfo from './base-info';
    import registerInfo from './register-info';
    import auditInfo from './audit-info';
    import registrationInfo from './registration-info'
    import logInfo from './log-info';
    import littleRemark from './little-remark';
    import {api_get_company_name,} from '@/api/account-information';
    import {api_add_base_info,api_update_register_info_new,api_update_audit_info_new,
        api_update_base_info,api_update_register_result,api_get_operation_log,api_get_server_phone} from '@/api/account-apply';
    export default {
        name: "add-edit-dialog",
        data() {
            return {
                show:this.value,
                registerStatus: [
                    {label:'新增',value:0},
                    {label:'注册',value:1},
                    {label:'审核中',value:2},
                    {label:'注册结果',value:3},
                    {label:'未触发KYC注册结果',value:4},
                    {label:'已推送/注册完成',value:5},
                    {label:'已作废',value:6},
                ],
                activeTab:'base',
                tabs:[
                    {label:'基本信息',value:'base',show:true},
                    {label:'注册信息',value:'register',show:false},
                    {label:'审核',value:'audit',show:false},
                    {label:'注册结果',value:'registration',show:false},
                    {label:'操作日志',value:'log',show:false}
                ],
                companyData:[],
                siteOptions:[],
                multipleAmazon:[],
                remarkShow:false,
                remarkTitle:'',
                auditButton:'audit' ,//audit nullify,
                everForm:{},//编辑打开时的form,
                cancelData:{}//储存作废数据
            }
        },
        computed: {
            tabShow(){
                return this.tabs.filter(row=>row.show);
            },
            remarkStyle(){
                if(this.remarkShow&&this.activeTab==='registration'){
                    return {width:'300px',position:'absolute',left:'15px',bottom:'55px',zIndex:999,}
                }
            }
        },
        watch: {
            show(val){
                this.$emit('input',val);
            },
            value(val){
                this.show=val;
            },
        },
        methods: {
            open_dialog(isOpen){
                if(isOpen){
                    this.siteOptions=[];
                    this.multipleAmazon=[];
                    this.cancelData={};
                    if(this.flag){
                        if(this.formData.channel_id&&(this.formData.company_type!=='')){
                            //this.get_company(this.formData.channel_id,this.formData.company_type);
                        }
                        this.get_site();
                        this.tabs.forEach(row=>{
                            if(row.value==='base'||row.value==='log'){
                                this.$set(row,'show',true);
                            }else if(row.value==='register'){
                                if(this.formData.status>=2){
                                    this.$set(row,'show',true);
                                }else{
                                    this.$set(row,'show',false);
                                }
                            }else if(row.value==='audit'){
                                if(this.formData.status>=3){
                                    this.$set(row,'show',true);
                                }else{
                                    this.$set(row,'show',false);
                                }
                            }else if(row.value==='registration'){
                                if(this.formData.status>=4){
                                    this.$set(row,'show',true);
                                }else{
                                    this.$set(row,'show',false);
                                }
                            }
                        });
                        let index=(this.tabs.filter(row=>row.show).length)-2;
                        this.activeTab=this.tabs[index].value;
                        this.everForm=JSON.parse(JSON.stringify(this.formData));
                    }else{
                        this.tabs.forEach(row=>{
                            this.$set(row,'show',false);
                        });
                        this.tabs[0].show=true;
                        this.activeTab='base';
                        this.everForm={};
                    }
                }
            },
            show_status(status,status_text){
                let normal=this.registerStatus.filter(row=>row.value!==4&&row.value!==6);
                if(status<=3){
                    return normal;
                }else if(status===4){
                    if(this.formData.channel_id===1||(this.formData.channel_id===2&&this.formData.is_kyc===1)){//注册结果
                        return normal;
                    }else if(this.formData.channel_id===2&&this.formData.is_kyc===0){//未触发KYC注册结果
                        return this.registerStatus.filter(row=>row.value!==3&&row.value!==6);
                    }
                }else if(status===5){
                    if(status_text==='已推送/注册完成'){
                        if(this.formData.channel_id===1||(this.formData.channel_id===2&&this.formData.is_kyc===1)){//注册结果
                            return normal;
                        }else if(this.formData.channel_id===2&&this.formData.is_kyc===0){//未触发KYC注册结果
                            return this.registerStatus.filter(row=>row.value!==3&&row.value!==6);
                        }
                    }else {//已作废
                        if(this.formData.channel_id===1||(this.formData.channel_id===2&&this.formData.is_kyc===1)){//注册结果
                            return this.registerStatus.filter(row=>row.value!==4&&row.value!==5);
                        }else if(this.formData.channel_id===2&&this.formData.is_kyc===0){//未触发KYC注册结果
                            return this.registerStatus.filter(row=>row.value!==3&&row.value!==5);
                        }
                    }
                }
            },
            step_status(status,index){
                if(status.label==='已作废'){
                    return 'error';
                }else{
                    if(index<this.formData.status)return 'success';
                }
            },
            tab_click_item(tab,event){
                if(tab.name==="log"){
                    this.get_log_info();
                }
            },
            get_company(){
                this.$set(this.formData,'company_id','');
                this.$set(this.formData,'company_name','');
                this.$set(this.formData,'server_id','');
                this.$set(this.formData,'service_ip','');
                this.$set(this.formData,'phone_id','');
                this.$set(this.formData,'phone','');
            },
//            get_company(channel_id,company_type){
//                if(channel_id&&company_type!=='') {
//                    this.companyData = [];
//                    this.$http(api_get_company_name, {
//                        channel_id: channel_id,
//                        type: company_type,
//                    }).then(res => {
//                        this.companyData = res.data.map(row => {
//                            return {label: row.company, value: row.id};
//                        });
//                        let find=this.companyData.find(row=>row.value===this.formData.company_id);
//                        if(find){
//                            this.$set(this.formData,'company_id',find.value);
//                        }else{
//                            this.$set(this.formData,'company_id','');
//                        }
//                        this.formData.accounts.forEach(row=>{
//                            if(row.site_code){
//                                this.$set(row,'site_code',this.formData.channel_id===2?row.site_code.split(','):row.site_code);
//                            }else if(!row.site_code){
//                                this.$set(row,'site_code',this.formData.channel_id===2?[]:'');
//                            }
//                        });
//                    }).catch(error => {
//                        console.error(error);
//                    });
//                }
//            },
            get_site(bool){
                this.formData.accounts.forEach(row=>{
                    if(row.site_code){
                        this.$set(row,'site_code',this.formData.channel_id===2?row.site_code.split(','):row.site_code);
                    }else if(!row.site_code){
                        this.$set(row,'site_code',this.formData.channel_id===2?[]:'');
                    }
                });
                if(!this.formData.company_id||!this.formData.channel_id)return;
                this.$http(api_get_server_phone,this.formData.company_id,this.formData.channel_id).then(res=>{
                    this.$set(this.formData,'ip_disabled',res.status);
                    if(bool){//查看编辑会重新赋值
                        this.$set(this.formData,'server_id',res.server_id);
                        this.$set(this.formData,'service_ip',res.server);
                        this.$set(this.formData,'phone_id',res.phone_id);
                        this.$set(this.formData,'phone',res.phone);
                    }
                    this.siteOptions=res.can_use_site;
                    this.multipleAmazon=res.map;//ebay为[]，Amazon有数据
                }).catch( error =>{
                    console.error(error);
                });
            },
            submit_base(data){
                if(!this.formData.id){//新增
                    this.$http(api_add_base_info,data).then(res=>{
                        // console.log(this.$refs.base,'base');
                        if(this.formData.status<=2){
                            this.$set(this.formData,'status',2);
                            this.$set(this.formData,'status_txt','注册');
                            this.$set(this.tabs[1],'show',true);
                            this.activeTab='register';
                            this.$set(this.tabs[4],'show',true);
                        }
                        this.$set(this.formData,'id',res.data.id);
                        this.$set(this.formData,'channel_txt',res.data.channel_txt);
                        this.$set(this.formData,'company_name',res.data.company_name);
                        this.$refs.base[0].isEdit=false;
                        this.$message({type:'success',message:res.message||res});
                    }).catch( error =>{
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }else{//编辑
                    this.$http(api_update_base_info,this.formData.id,data).then(res=>{
                        this.$message({type:'success',message:res.message||res});
                    }).catch( error =>{
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }
            },
            get_log_info(){
                this.$http(api_get_operation_log,this.formData.id).then(res=>{
                    this.$set(this.formData,'log',res);
                }).catch( error =>{
                    console.error(error);
                });
            },
            submit_register(string){
                let data=JSON.parse(JSON.stringify(this.formData.accounts));
                data=data.filter(row=>row.account_name);
                if(this.formData.channel_id===2){
                    data.forEach(row=>{
                        this.$set(row,'site_code',row.site_code.join(','))
                    });
                }
                this.$http(api_update_register_info_new,this.formData.id,{
                    accounts:data,
                    submit_code:string
                }).then(res=>{
                    if(!this.flag){
                        this.$refs.register[0].isEdit=false;
                    }
                    this.$set(this.formData,'register_submited',true);
                    res.data.accounts.forEach(row=>{
                        this.$set(row,'id',row.id);
                        this.$set(row,'is_eye',false);
                        this.$set(row,'password_type',true);
                        this.$set(row,'is_eye',false);
                        this.$set(row,'password',row.password||'');
                        this.$set(row,'site_code',this.formData.channel_id===1?row.site_code:row.site_code.split(','));
                        if(!row.collection_data.length){
                            row.collection_data=[
                                {
                                    collection_account:'',
                                    collection_type:'',
                                    collection_email:'',
                                    collection_name:''
                                }
                            ]
                        }
                    });
                    this.$set(this.formData,'accounts',res.data.accounts);
                    if(string==='submit_register'){
                        if(this.formData.status<=2){
                            this.$set(this.formData,'status',3);
                            this.$set(this.formData,'status_txt','审核中');
                            this.$set(this.tabs[2],'show',true);
                            this.activeTab='audit';
                        }
                    }
                    this.$message({type:'success',message:res.message||res});
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            submit_audit(data){
                this.$http(api_update_audit_info_new,this.formData.id,data).then(res=>{
                    if(!this.flag){
                        this.$refs.auditPane[0].isEdit=false;
                    }
                    this.$set(this.formData,'audit_submited',true);
                    if(data.submit_code==='submit_audit'){
                        if(this.formData.status<=3){
                            this.$set(this.formData,'status',4);
                            let text='注册结果';
                            if(this.formData.channel_id===1){
                                text='注册结果';
                            }else if(this.formData.channel_id===2){
                                text=data.is_kyc?'注册结果':'未触发KYC注册结果';
                            }
                            this.$set(this.formData,'status_txt',text);
                        }
                        this.$set(this.tabs[3],'show',true);
                        this.activeTab='registration';
                    }else if(data.submit_code==='submit_push'){
                        this.close();
                    }
                    this.$message({type:'success',message:res.message||res});
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            submit_register_result(data){
                if(data.submit_code==='cancel'){
                    this.remarkShow=true;
                    this.remarkTitle='作废的原因';
                    this.cancelData=data;
                }else{
                    this.remarkShow=false;
                    this.submit_registration(data);
                }
            },
            submit_registration(data){
                data.fulfill_time=data.fulfill_time?datef('YYYY-MM-dd',data.fulfill_time/1000):'';
                this.$http(api_update_register_result,this.formData.id,data).then(res=>{
                    if(!this.flag){
                        this.$refs.registration[0].isEdit=false;
                    }
                    if(this.formData.status<=4){
                        this.$set(this.formData,'status',5);
                        this.$set(this.formData,'status_txt',data.submit_code==='cancel'?'已作废':'已推送/注册完成');
                    }
                    this.remarkShow=false;
                    let arr=['sure','cancel'];
                    if(arr.includes(data.submit_code)){
                        this.close();
                    }
                    this.$message({type:'success',message:res.message||res});
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            remark_submit(remark){
                let data=this.cancelData;
                this.$set(data,'reason',remark);
                this.submit_registration(data);
            },
            close(){
                this.$emit('refresh');
                this.show=false;
            }
        },
        props: {
            value:{},
            title:{},
            formData:{},
            creatorData:{},
            flag:{}//add 0 look 1 edit 2
        },
        components: {
            baseInfo,registerInfo,auditInfo,registrationInfo,logInfo,littleRemark
        },
    }
</script>

