<template>
    <div class="c-batch-mdf-account">
        <page-dialog :title="title" v-model="dialog" size="small" @open="open" :close-on-click-modal="false">
            <el-form :model="form" ref="mdfForm" label-width="120px" :rules="rules">
                <el-form-item label="平台账号：" prop="account_id">
                    <param-account v-model="form.account_id"
                                   @change="change_account"
                                   url="get|Publish/Ebay/getAccounts"
                                   class="inline width-super" type="ebay"></param-account>
                </el-form-item>
                <el-form-item label="Paypal：" prop="paypal">
                    <el-select v-model="form.paypal"
                               class="inline width-super"
                               filterable clearable>
                        <el-option
                            v-for="res in paypalList"
                            :label="res.account_name"
                            :value="res.account_name"
                            :key="res.account_name"
                        ></el-option>   
                    </el-select>   
                </el-form-item>
            </el-form>
            <div slot="footer">
                <request-button req-key="batchMdfAccount" class="inline" @click="submit" v-if="isCopy">确定复制</request-button>
                <request-button req-key="batchMdfAccount" class="inline" @click="submit" v-else>确定</request-button>
                <el-button size="mini" class="inline" @click.native="dialog=false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_up_accounts,api_get_paypals,api_c_draft_byDraft} from '../../../../../api/ebay-kandeng-public-module';
    export default {
        data() {
            return {
                dialog:this.value,
                paypalList:[],
                rules:{
                    paypal:[
                        {required:true,message:"Paypal账号为必选项",trigger:'change'},
                    ],
                    account_id:[
                        {required:true,message:"平台账号为必选项",trigger:'change',type:'number'},
                    ],
                },
                form:{
                    account_id:"",
                    paypal:"",
                },
            }
        },
        methods:{
            open(){
                this.form = {
                    account_id:"",
                    paypal:"",
                }
            },
            submit(){
                this.$refs.mdfForm.validate((b)=>{
                    if(b){
                        let data = window.clone(this.form);
                        let ids = this.ids.map(row=>row.id).join(',');
                        this.$set(data,'ids',ids);
                        let url = this.isCopy?api_c_draft_byDraft:api_up_accounts;
                        this.$http(url,data).then(res=>{
                            this.$message({type:"success",message:res.message||res});
                            this.dialog = false;
                            if(this.isCopy){
                                this.$emit('submit',res,this.isCopy);
                            }else{
                                this.$emit('submit',data,this.isCopy);
                            }
                        }).catch(code=>{
                            this.$message({type:"error",message:code.message||code});
                        }).finally(()=>{
                            this.$reqKey('batchMdfAccount',false)
                        })
                    }else{
                        this.$reqKey('batchMdfAccount',false)
                    }
                });
            },
            change_account(val){
                if(!val)return;
                this.form.paypal = '';
                this.get_paypal(val);
            },
            get_paypal(account_id){
                this.paypalList = [];
                this.$http(api_get_paypals,{account_id:account_id}).then(res=>{
                    if(!res.data)return this.$message({type:"warning",message:"后台数据返回有误"});
                    if(res.data.max_paypals instanceof Array){
                        res.data.max_paypals.forEach(row=>{
                            let find = this.paypalList.find(it=>it.account_name===row.account_name);
                            if(!find) this.paypalList.push(row);
                        });
                    }else{
                        console.log("res.data.max_paypals数组格式返回有误");
                    }
                    if(res.data.min_paypals instanceof Array){
                        res.data.min_paypals.forEach(row=>{
                            let find = this.paypalList.find(it=>it.account_name===row.account_name);
                            if(!find) this.paypalList.push(row);
                        })
                    }else{
                        console.log("res.data.min_paypals数组格式返回有误");
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        props:{
            value:{},
            ids:{
                required:true,
                type:Array
            },
            title:{
                type:String,
                default(){
                    return '选择账号';
                }
            },
            isCopy:{
                type:Boolean,
                default(){
                    return false
                },
            }
        },
        components: {
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            paramAccount:require('../../../../../api-components/param-account.vue').default,
        }
    }
</script>