<template>
    <page-dialog :title="title"
                 v-model="show"
                 width="70%"
                 class="c-add-edit-basic">
        <div v-for="item in contents" :key="item.value">
            <component :is="item.component"
                       ref="baseAccount"
                       :form="form"
                       :flag="flag"
                       :channel-list="channelList"
                       :creator-data="creatorData"
            >
            </component>
        </div>
        <div slot="footer">
            <el-button size="mini" type="primary"
                       @click.native="submit" :disabled="submitDisabled">确定</el-button>
            <el-button @click.native="show=false" size="mini">取消</el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus" >
    .c-add-edit-basic{
        .basic-title-info{
            height: 25px;
            line-height: 25px;
            margin-bottom: 6px;
            padding: 0 10px;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,0.12);
        }
    }
</style>

<script>
    import accountInfo from './account-info';
    import companyInfo from './company-info';
    import baseInfo from './base-info';
    import payInfo from './pay-info';
    import creatorInfo from './creator-info';
    import datef from "datef";
    import {api_add_account,api_updata_account} from '@/api/account-information';
    export default {
        name: "add-edit-dialog",
        data() {
            return {
                show:this.value,
                contents:[
                    {value:1,component:accountInfo},
                    {value:2,component:companyInfo},
                    {value:3,component:baseInfo},
                    {value:4,component:payInfo},
                    {value:5,component:creatorInfo},
                ],
                submitDisabled:false
            }
        },
        computed: {},
        watch: {
            show(val){
                this.$emit('input',val);
            },
            value(val){
                this.show=val;
            }
        },
        methods: {
            async submit(){
                try{
                    this.form.account_create_time=this.form.account_create_time?new Date(this.form.account_create_time):'';
                    let filter=await this.$refs.baseAccount.filter(row=>row.validate&&row.validate());
                    if(filter.length===4){
                        let minAccount1=!!this.form.account_name_minor&&!this.form.password_minor;
                        let minAccount2=!this.form.account_name_minor&&!!this.form.password_minor;
                        if(minAccount1||minAccount2)return this.$message({type:'warning',message:'子账号全称和子账号密码两项中有一项未填写！ 必须两项全填或全不填'});
                        if(this.form.account_name_minor===this.form.account_name)return his.$message({type:'warning',message:'子账号全称不可和主账号全称相同！'});
                        let payMessage=this.form.collection_msg.filter(row=>{
                            let isEmpty =row.collection_account===''&&row.collection_type===''&&row.collection_email===''&&row.collection_user==='';
                            return !isEmpty;
                        });
                        if(!payMessage.length){
                            payMessage=[{collection_account:'',collection_type:'',collection_email:'',collection_user:''}];
                        }
                        if(this.form.account_create_time){
                            this.form.account_create_time=datef('YYYY-MM-dd',this.form.account_create_time);
                        }
                        let param={
                            channel_id:this.form.channel_id,
                            site_code:this.form.site_code,
                            shop_name:this.form.shop_name,
                            account_name:this.form.account_name,
                            password:this.form.password,
                            account_code:this.form.account_code,
                            server_id:this.form.server_id,
                            company_id:this.form.company_id,
                            phone:this.form.phone,
                            email:this.form.email,
                            phone_id:this.form.phone_id,
                            email_id:this.form.email_id,
                            account_name_minor:this.form.account_name_minor,
                            password_minor:this.form.password_minor,
                            credit_card_id:this.form.credit_card_id,
                            collection_msg:payMessage,
                            account_creator:this.form.account_creator,
                            account_create_time:this.form.account_create_time,
                            status:this.form.status,
                            is_set_company:this.form.is_set_company,
                            is_set_server:this.form.is_set_server,
                            is_set_phone:this.form.is_set_phone,
                            remark:this.form.remark
                        };
                        if(!this.flag){//add
                            this.submitDisabled=true;
                            this.$http(api_add_account,param).then(res=>{
                                this.$message({type:'success',message:res.message||res});
                                this.show=false;
                                this.$emit('refresh');
                                this.submitDisabled=false;
                            }).catch( error =>{
                                this.submitDisabled=false;
                                error&&this.$message({type:'error', message:error.ymessage||error});
                            });
                        }else{//edit
                            this.submitDisabled=true;
                            this.$http(api_updata_account,this.form.id,param).then(res=>{
                                this.$message({type:'success',message:res.message||res});
                                this.show=false;
                                this.$emit('refresh');
                                this.submitDisabled=false;
                            }).catch( error =>{
                                this.submitDisabled=false;
                                error&&this.$message({type:'error', message:error.message||error});
                            });
                        }
                    }else{
                        console.error('validator false!');
                    }
                    // let bool=await this.$refs.baseAccount.every(async row=>{
                    //     if(row.validate){
                    //         console.log(row.validate(),47878888);
                    //         return await row.validate();
                    //     }else{
                    //         return false;
                    //     }
                    // })
                    // if(bool){
                    //     console.log('can enter');
                    // }
                }catch(error){
                    console.error(error);
                }
            },
        },
        props: {
            value:Boolean,
            title:String,
            form:Object,
            flag:Number,
            channelList:Array,
            creatorData:Array
        },
        components: {},
    }
</script>

