<template>
    <div class="c-batch-mdf-account">
        <page-dialog :title="title" v-model="dialog" size="small" @open="open" :close-on-click-modal="false">
            <el-form :model="form" ref="mdfForm" label-width="136px" :rules="rules">
                <el-form-item :label="$t('ebay-list.pa')" prop="account_id">
                    <param-account v-model="form.account_id"
                                   @change="change_account"
                                   url="get|Publish/Ebay/getAccounts"
                                   class="inline width-super" type="ebay"></param-account>
                    <label class="ml-sm" v-if="title===$t('ebay-list.bCopyTip3')">
                        <el-checkbox v-model="copyFor">{{$t('ebay-list.copy')}}</el-checkbox>
                    </label>
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
                <request-button req-key="batchMdfAccount" class="inline" @click="submit" v-if="isCopy">{{$t('ebay-list.DetermineCopy')}}</request-button>
                <request-button req-key="batchMdfAccount" class="inline" @click="submit" v-else>{{$t('common.confirm')}}</request-button>
                <el-button size="mini" class="inline" @click.native="dialog=false">{{$t('common.close')}}</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_up_accounts,api_get_paypals,api_copy_listing,api_c_draft_byDraft} from '../../../../../api/ebay-kandeng-public-module';
    export default {
        data() {
            return {
                dialog:this.value,
                paypalList:[],
                rules:{
                    paypal:[
                        {required:true,message:this.$t('ebay-list.mustPayPal'),trigger:'change'},
                    ],
                    account_id:[
                        {required:true,message:this.$t('ebay-list.mustPlatform'),trigger:'change',type:'number'},
                    ],
                },
                form:{
                    account_id:"",
                    paypal:"",
                },
                copyFor:false,
            }
        },
        methods:{
            open(){
                this.copyFor=false;
                this.form = {
                    account_id:"",
                    paypal:"",
                }
            },
            submit(){
                this.$refs.mdfForm.validate((b)=>{
                    if(b){
                        let data = window.clone(this.form);
                        let ids = this.ids.map(row=>row.id);
                        this.$set(data,'ids',ids);
                        if(!this.isCopy){
                            data.copy=this.copyFor?1:0;
                        }
                        let url = this.isCopy?api_copy_listing:api_up_accounts;
                        this.$http(url,data).then(res=>{
                            if(!res.data){
                                this.$message({type:"success",message:res.message||res});
                            }
                            this.dialog = false;
                            if(this.isCopy){
                                this.$emit('submit',res,this.isCopy);
                            }else{
                                if(this.copyFor){
                                    this.$emit('submit',res,this.copyFor);
                                }else {
                                    this.$emit('submit',data,this.copyFor);
                                }

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
                    if(!res.data)return this.$message({type:"warning",message:this.$t('ebay-list.dataError')});
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
