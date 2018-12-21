<template>
    <div class="c-batch-mdf-listing">
        <page-dialog v-model="dialog" @open="open"
                     size="small" title="导入信息到范本"
                     :close-on-click-modal="false">
            <el-form :model="form"
                     label-width="150px"
                     ref="formData"
                     :rules="rules">
                <el-form-item label="Item ID：" prop="Item_id">
                    <el-input v-model="form.Item_id" class="inline width-super"></el-input>
                </el-form-item>
                <el-form-item label="平台账号：" prop="Account_id">
                    <el-select v-model="form.Account_id"
                               class="inline width-super"
                               filterable clearable>
                        <el-option
                            v-for="res in accountList"
                            :label="res.code"
                            :value="res.account_id"
                            :key="res.account_id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="loading">
                    数据获取中...
                </el-form-item>
            </el-form>
            <div slot="footer">
                <request-button class="inline" req-key="batchMdfListing" :mintime="300"
                                @click="submit" :disabled="loading">确定</request-button>
                <el-button size="mini" class="inline" @click.native="dialog = false" :disabled="loading">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_by_itemid} from '../../../../../api/ebay-kandeng-public-module';
    import {api_ebay_account} from '../../../../../api/publish-smt';
    export default {
        data() {
            return {
                dialog:this.value,
                form:{
                    Item_id:"",
                    Account_id:"",
                },
                accountList:[],
                rules:{
                    Item_id:[
                        {required:true,message:"Item ID为必填项，请补充完整！",trigger:"change"}
                    ],
                    Account_id:[
                        {required:true,message:"平台账号为必填项，请补充完整！",trigger:"change",type:"number"}
                    ]
                },
                loading:false,
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            }
        },
        created(){
            this.get_account();
        },
        methods:{
            open(){
                this.form = {
                    Item_id:"",
                    Account_id:"",
                }
            },
            submit(){
            	this.loading = true;
                this.$refs.formData.validate((b)=>{
                    if(b){
                        this.$http(api_get_by_itemid,this.form).then(res=>{
                            res.data.info.varians.forEach(row=>{
                                if(row.variation)row.variation = JSON.parse(row.variation);
                            });
                            let data = res.data.info.list;
                            this.$set(data,'varians',res.data.info.varians);
                            if(!!data.v_varkey){
                                data.v_varkey = data.v_varkey instanceof Array?data.v_varkey:JSON.parse(data.v_varkey);
                            }
                            this.$message({type:"success",message:res.message||res});
                            this.dialog = false;
                            this.loading = false;
                            this.$emit('submit',data);
                        }).catch(code=>{
                            this.loading = false;
                            this.dialog = false;
                            this.$message({type:"error",message:code.message||code});
                        }).finally(()=>{
                            this.$reqKey('batchMdfListing',false)
                        })
                    }else{
                        this.$reqKey('batchMdfListing',false)
                    }
                });
            },
            get_account(){
                this.$http(api_ebay_account).then(res=>{
                    this.accountList = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        props:{
            value:{},
        },
        components: {
            pageDialog:require('../../../../../components/page-dialog.vue').default,
        }
    }
</script>
