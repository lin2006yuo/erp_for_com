<template>
    <page-dialog :title="title"
                 v-model="show"
                 width="65%"
                 :close-on-click-modal="false"
                 @change="open_dialog"
                 class="c-company-info-dialog">
        <el-tabs v-model="activeName"
                 type="card"
                 @tab-click="tab_click_item">
            <el-tab-pane v-for="item in showCurrentTabs"
                         :label="item.label"
                         :name="item.name"
                         :key="item.id">
                <component :is="item.comp"
                           ref="comp"
                           :form="form"
                           :channels="channels"
                           :channelData="channelData"
                           :businessPicture="businessPicture"
                           :IDFront="IDFront"
                           :IDBack="IDBack"
                           :flag="flag"
                           :accounts="accounts"
                           @company="keep_company_info"
                           @account="keep_account_info"
                           @vat="keep_update_vat"
                           :original-form="originalForm">
                </component>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
            <!--<span @click="test">test</span>-->
            <el-button size="mini"
                       @click.native="close">关闭
            </el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus">

</style>

<script>
    import companyInfo from './company-info';
    import accountInfo from './account-info';
    import taxRate from './tax-rate';
    import operationLog from './operation-log';
    import {get_channel,init_data,add_company_info,keep_account,
        look_at_operation_log,update_company_info,keep_update_vats} from './action';
    export default {
        name: "add-look-edit",
        data() {
            return {
                show:this.value,
                activeName:'companyInfo',
                tabs:[
                    {id:1,label:"公司信息",name:"companyInfo",comp:companyInfo,isView:false},
                    {id:2,label:"账号信息",name:"accountInfo",comp:accountInfo,isView:false},
                    {id:3,label:"VAT",name:"taxRate",comp:taxRate,isView:false},
                    {id:4,label:"操作日志",name:"operationLog",comp:operationLog,isView:false},
                ],
                channels:[],
                businessPicture:[],
                IDFront:[],
                IDBack:[],
                accounts:[{label:''}],
                channelData:[],
                originalForm:{}
            }
        },
        computed: {
            showCurrentTabs(){
                return this.tabs.filter(tab=>tab.isView);
            }
        },
        watch: {
            show(val){
                this.$emit('input',val)
            },
            value(val){
                this.show=val;
            },
            form:{
                deep:true,
                handler(val){
                    if(!val.company_time){
                        this.$set(val,'company_time','');
                    }
                    if(this.flag===2){
                        if(val.collection_account&&val.collection_account.length){
                            this.accounts=val.collection_account.map(row=>{return {label:row}})
                        }
                    }
                    if(val.charter_url){
                        this.businessPicture=[];
                        this.$set(this,'businessPicture',[{name:val.charter_url}]);
                    }
                    if(val.corporation_id_front){
                        this.IDFront=[];
                        this.$set(this,'IDFront',[{name:val.corporation_id_front}]);
                    }
                    if(val.corporation_id_contrary){
                        this.IDBack=[];
                        this.$set(this,'IDBack',[{name:val.corporation_id_contrary}]);
                    }
                }
            },
            channels:{
                deep:true,
                handler(val){
                    if(!!this.flag){
                        this.channelData=[];
                        if(this.form.channel===0){
                            this.channelData=val.map(row=>row.label);
                        }else{
                            if(({}.toString.call(this.form.channel))==='[object Array]'){
                                val.forEach(row=>{
                                    this.form.channel.forEach(num=>{
                                        if(Number(num)===row.value){
                                            this.channelData.push(row.label);
                                        }
                                    })
                                })
                            }
                        }
                    }
                }
            }
        },
        methods: {
            open_dialog(isOpen){
                if(isOpen){
                    this.activeName='companyInfo';
                    this.originalForm={};
                    get_channel(this);
                    if(!this.flag){//add
                        init_data(this);
                        this.tabs.forEach(row=>{
                            this.$set(row,'isView',false);
                        });
                        this.tabs[0].isView=true;
                    }else{// look over and edit
                        this.tabs.forEach(row=>{
                            this.$set(row,'isView',true);
                        });
                        this.originalForm=JSON.parse(JSON.stringify(this.form))
                    }
                }
            },
            tab_click_item(tab,event){
                if(tab.name==='operationLog'){
                    look_at_operation_log(this,this.form.id);
                }
            },
            keep_company_info(){
                this.deal_with_picture(this.businessPicture,'charter_url');
                this.deal_with_picture(this.IDFront,'corporation_id_front');
                this.deal_with_picture(this.IDBack,'corporation_id_contrary');
                if(this.form.id){
                    update_company_info(this);
                }else{
                    add_company_info(this);
                }
            },
            deal_with_picture(arr,string){
                if(arr.length){
                    let param=arr.map(row=>row.name).join(',');
                    let data=arr.map(row=>row.image).join(',');
                    if(!!data){
                        this.$set(this.form,string,data);
                    }else {
                        this.$set(this.form,string,param);
                    }
                }
            },
            keep_account_info(){
                keep_account(this);
            },
            keep_update_vat(){
                keep_update_vats(this);
            },
            close(){
                this.show=false;
                this.$emit('refresh');
            },
        },
        props: {
            value:{},
            title:{},
            flag:{//0 add  1 look over  2 edit
                type:Number
            },
            id:{},
            form:{}
        },
        components: {
            companyInfo,accountInfo,taxRate,operationLog
        },
    }
</script>

