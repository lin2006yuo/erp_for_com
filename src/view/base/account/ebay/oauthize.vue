<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-form label-width="150px">
            <el-form-item label="oAuth code：">
                <el-col :span="8">
                    <el-input class="inline" v-model="oauthData.oauth_code"></el-input>
                    <!--<span>{{addEditData.code}}</span>-->
                </el-col>
                <el-button size="mini" class="inline ml-xs" @click.native="addCode" type="primary">获取oAuth code</el-button>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click.native="keep" type="primary">获取oAuth Token</el-button>
        <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {account_ebay_oauth,account_oauth_token} from '../../../../api/account-ebay';
    export default{
        data(){
            return{
                show:this.value,
            }
        },
        methods:{
            open(){
            
            },
            cloce(){
            
            },
            keep(){
                let account_id = this.oauthData.id;
                let parmes = {
                    oauth_code:this.oauthData.oauth_code
                };
            	this.$http(account_oauth_token,account_id,parmes).then(res=>{
                    this.$message({type: 'success', message: res.message || res});
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code,});
                })
            },
            addCode(){
                let account_id = this.oauthData.id;
                this.$http(account_ebay_oauth,account_id).then(res=>{
                    window.open(res.data)
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code,});
                })
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            oauthData:{
                required:true,
                type:Object
            },
            title:{
                required:true,
                type:String
            }
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
        }
    }
</script>