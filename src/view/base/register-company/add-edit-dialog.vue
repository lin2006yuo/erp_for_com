<template>
    <page-dialog :title="title"
                 v-model="show"
                 width="65%"
                 @change="open_dialog"
                 class="register-company-dialog">
        <!--{{dialogForm.status}} 和 {{dialogForm.status_text}}-->
        <el-form :model="dialogForm">
            <el-form-item label="当前账号状态：">
                <el-steps :space="150" :active="dialogForm.status">
                    <el-step v-for="(item,index) in status_list(dialogForm.status,dialogForm.status_text)"
                             :key="index"
                             :title="item.label"
                             :status="current_status(item,index)"
                    ></el-step>
                </el-steps>
            </el-form-item>
        </el-form>
        <el-tabs type="border-card"
                 v-model="activeTab"
                 @tab-click="tab_click_item">
            <el-tab-pane v-for="tab in tabShow"
                         :label="tab.label"
                         :name="tab.name"
                         :key="tab.value">
                <component :is="tab.comp"
                           ref="comps"
                           :form="dialogForm"
                           :flag="flag"
                           @submit-save-corporation="submit_save_corporation"
                           @download="download"
                           @submit-company="submit_company"
                           @upload-business-licence="upload_business_licence"
                           @submit-balance-info="submit_balance_info"
                           @cancel="show=false">
                </component>
            </el-tab-pane>
        </el-tabs>
        <little-remark v-if="showRemark"
                       :title="remarkTitle"
                       :cardStyle="remarkStyle"
                       @remark-submit="remark_submit"
                       @cancel="cancel_remark">
        </little-remark>
        <el-row slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="show=false">关 闭 </el-button>
        </el-row>
    </page-dialog>
</template>

<style lang="stylus" >
    .register-company-dialog{
        position :relative;
    }
</style>

<script>
    import corporationInfo from './corporation-info';
    import companyInfo from './company-info';
    import businessLicence from './business-licence';
    import balanceInfo from './balance-info';
    import operationInfo from './operation-info';
    import {actions} from './action';
    import littleRemark from '@/view/base/account-apply/little-remark';
    import {downloadFile} from '@/lib/http';
    export default {
        name: "add-edit-dialog",
        data() {
            return {
                show:this.value,
                activeTab:'corporationInfo',
                tabPane:[
                    {label:'法人信息',name:'corporationInfo',value:1,comp:corporationInfo,show:false},
                    {label:'公司信息',name:'companyInfo',value:2,comp:companyInfo,show:false},
                    {label:'营业执照',name:'businessLicence',value:3,comp:businessLicence,show:false},
                    {label:'结账信息',name:'balanceInfo',value:4,comp:balanceInfo,show:false},
                    {label:'操作日志',name:'operationInfo',value:5,comp:operationInfo,show:false},
                ],
                actions:new actions(),
                compareForm:{},
                remarkTitle:'',
                remarkShow:false,
                tempCorporation:{},
                tabLabel:'',//辨识哪里打开
            }
        },
        computed: {
            tabShow(){
                return this.tabPane.filter(row=>row.show);
            },
            remarkStyle(){
                if((this.tabLabel===2||this.tabLabel===1)&&this.remarkShow){
                    return {width:'300px',position:'absolute',left:'350px',bottom:'110px',zIndex:999}
                }
            },
            showRemark(){
                let a=this.activeTab==='companyInfo'&&this.remarkShow&&this.tabLabel===2;
                let b=this.activeTab==='corporationInfo'&&this.remarkShow&&this.tabLabel===1;
                return a||b;
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
            open_dialog(openDialog){
                if(openDialog){
                    this.remarkShow=false;
                    this.tempCorporation={};
                    if(this.flag){
                        this.tabPane.forEach(row=>{
                            switch (row.value){
                                case 1:
                                    this.$set(row,'show',true);
                                    break;
                                case 2:
                                    let businessTime=this.dialogForm.business_term_st,
                                        company=this.dialogForm.company;
                                    if(this.dialogForm.status>=3||(this.dialogForm.status===2&&!!businessTime&&!!company)){
                                        this.$set(row,'show',true)
                                    }else {
                                        this.$set(row,'show',false);
                                    }
                                    break;
                                case 3:
                                    if(this.dialogForm.status>=4){
                                        this.$set(row,'show',true)
                                    }else{
                                        this.$set(row,'show',false);
                                    }
                                    break;
                                case 4:
                                    if(this.dialogForm.status>=5){
                                        this.$set(row,'show',true)
                                    }else{
                                        this.$set(row,'show',false);
                                    }
                                    break;
                                case 5:
                                    this.$set(row,'show',true);
                                    break;
                            }
                        });
                        if(this.dialogForm.status===1||this.dialogForm.status===2){
                            this.activeTab='corporationInfo';
                        }else if(this.dialogForm.status===3){
                            this.activeTab='companyInfo';
                        }else if(this.dialogForm.status===4){
                            this.activeTab='businessLicence';
                        }else if(this.dialogForm.status===5||this.dialogForm.status===6){
                            this.activeTab='balanceInfo';
                        }else if(this.dialogForm.status===7){
                            this.activeTab='operationInfo';
                        }
                        this.actions.get_operation_info(this,this.dialogForm.id);
                    }else{
                        this.tabPane.forEach(row=>{
                            this.$set(row,'show',false);
                        });
                        this.tabPane[0].show=true;
                        this.activeTab='corporationInfo';
                    }
                }
            },
            status_list(status,text){
                if(!this.statusList.length)return;
                let arr=JSON.parse(JSON.stringify(this.statusList)).filter(row=>row.value&&row.value!==1).map(row=>{
                    if(row.value===3){
                        row.label=`工商代理审核中${(status===2&&text==='已作废')?'(已作废)':''}`;
                    }
                    if(row.value===5){
                        row.label=`待批执照${(status===3&&text==='已作废')?'(已作废)':''}`;
                    }
                    return row;
                });
                let normal=arr.filter(row=>row.value!==4&&row.value!==6);
                if(!this.flag){
                    return normal;
                }else{
                    if(status===2&&text==='工商代理审核未通过'){
                        return arr.filter(row=>row.value!==3&&row.value!==6);
                    }else if(status===2&&text==='已作废'){
                        return arr.filter(row=>row.value!==4&&row.value!==6);
                    }else if(status===3&&text==='待批执照未通过'){
                        return arr.filter(row=>row.value!==4&&row.value!==5);
                    }else if(status===3&&text==='已作废'){
                        return arr.filter(row=>row.value!==4&&row.value!==6);
                    }else if(status===7&&text==='注册完成'&&this.dialogForm.has_seal===0){
                        return normal.filter(row=>row.value!==9);
                    }else{
                        return normal;
                    }
                }
            },
            current_status(item,index){
                let arr=['工商代理审核中(已作废)','待批执照(已作废)','工商代理审核未通过','待批执照未通过'];
                if(arr.includes(item.label)){
                    return 'error';
                }else{
                    if(index<this.dialogForm.status){
                        return 'success';
                    }
                }
                // if((item.value===4&&this.dialogForm.status===2)||(item.value===6&&this.dialogForm.status===3)||(this.dialogForm.status===2&&item.value===3)||(this.dialogForm.status===2&&item.value===5)){
                //     return 'error';
                // }else{
                //     if(index<this.dialogForm.status){
                //         return 'success';
                //     }
                // }
            },
            tab_click_item(tab,event){
                if(tab.label==='操作日志'){
                    this.actions.get_operation_info(this,this.dialogForm.id);
                }
            },
            download(img){
                let index=img.name.indexOf('/upload');
                if(index!==-1){
                    let path=img.name.substring(index,img.name.length);
                    downloadFile({
                        url:`${config.apiHost}supplier/download-image`,
                        get: {file: path},
                        fileName: path.slice(path.lastIndexOf('/')-1,path.lastIndexOf('.')),
                        suffix: path.slice(path.lastIndexOf('.'))
                    });
                }else{
                    this.$message({type:'warning',message:'文件未上传，无法下载'})
                }
            },
            submit_save_corporation(data){
                if(!this.flag){//add
                    this.actions.add_audit_corporation(this,data);
                }else{//deal with
                    if(data.submit_code==='cancel'||data.submit_code==='audit_fail'){//作废 审核不通过
                        this.remarkTitle=`${data.submit_code==='audit_fail'?'审核不通过':'作废'}的原因`;
                        this.tabLabel=1;
                        this.remarkShow=true;
                        this.tempCorporation=data;
                    }else{
                        this.actions.update_corporation_info(this,data,this.dialogForm.id);
                    }
                }
            },
            remark_submit(reason){
                this.$set(this.tempCorporation,'reason',reason);
                if(this.activeTab==='corporationInfo'){
                    this.actions.update_corporation_info(this,this.tempCorporation,this.dialogForm.id);
                }else if(this.activeTab==='companyInfo'){
                    this.actions.audit_company_info(this,this.dialogForm.id,this.tempCorporation);
                }
            },
            cancel_remark(){
                this.remarkShow=false;
                this.tempCorporation={};
            },
            submit_company(param){
                if(param.submit_code==='audit_success'){
                    this.actions.audit_company_info(this,this.dialogForm.id,param);
                }else if(param.submit_code==='audit_fail'){
                    this.remarkTitle='审核不通过的原因';
                    this.remarkShow=true;
                    this.tabLabel=2;
                    this.tempCorporation=param;
                }
            },
            upload_business_licence(data){
                this.actions.submit_save_licence(this,this.dialogForm.id,data);
            },
            submit_balance_info(string,boolean){
                this.actions.submit_balance_info(this,string,boolean);
            }
        },
        props: {
            title:String,
            value:Boolean,
            flag:Number, //0 add  1 look over  2 deal with
            dialogForm:Object,
            statusList:Array,
        },
        components: {
            littleRemark
        },
    }
</script>

