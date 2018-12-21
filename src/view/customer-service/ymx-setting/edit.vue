<template>
    <div    class="ymx-setting-p-edit">
        <page-dialog v-model="show" :title="title"  :close-on-click-modal="false" @open="open">
            <el-form ref="form" :model="form" label-width="150px" :rules="rules">
                <el-form-item label="平台：" required prop="channel_id">
                    <el-select  :value="form.channel_id" @input="change_channel" clearable class="sm-width">
                        <el-option v-for="item in channel"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号简称：" required prop="account_id">
                    <el-select :disabled="accoutOptions.length<=1"
                               filterable clearable
                               placeholder="请选择平台"
                               class="sm-width"
                               v-model="form.account_id">
                        <el-option v-for="item in accoutOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="邮箱账号：" required prop="email_account">
                    <el-input v-model="form.email_account" class="sm-width"></el-input>
                </el-form-item>
                <el-form-item label="邮箱密码：" required prop="email_password">
                    <el-input v-model="form.email_password"  class="sm-width"></el-input>
                </el-form-item>
                <el-form-item label="邮箱imap服务器地址：" required prop="imap_url">
                    <el-input v-model="form.imap_url" class="sm-width"></el-input>
                </el-form-item>
                <el-form-item label="imap端口：" required prop="imap_ssl_port">
                    <el-input v-model="form.imap_ssl_port" class="sm-width"></el-input>
                </el-form-item>
                <el-form-item label="smtp服务器地址：" required prop="smtp_url">
                    <el-input v-model="form.smtp_url" class="sm-width"></el-input>
                </el-form-item>
                <el-form-item label="smtp端口：" required prop="smtp_ssl_port">
                    <el-input v-model="form.smtp_ssl_port" class="sm-width"></el-input>
                </el-form-item>
                <el-form-item label="是否开启接收邮件：" required>
                    <el-select v-model="form.allowed_receive" placeholder="请选择" class="sm-width">
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否开启发送邮件：" required>
                    <el-select v-model="form.allowed_send" placeholder="请选择" class="sm-width">
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用：" required>
                    <el-radio-group v-model="form.is_enabled">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" @click.native="submit">确定</el-button>
                <el-button size="mini" @click.native="show = false;">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .ymx-setting-p-edit{
        .sm-width{
            width: 200px;
        }
    }
</style>
<script>
    import {api_amazon_email_account_add,api_amazon_email_account_mdf} from "../../../api/letter-amazon"
    import {api_email_account} from "@/api/order-local"
    export default{
        data(){
            return {
                show:false,
                rules:{
                    account_id:[{required:true,message:'请输入账号简称',trigger:'blur'}],
                    email_account:[{required:true,message:'请输入邮箱账号',trigger:'blur'}],
                    email_password:[{required:true,message:'请输入邮箱密码',trigger:'blur'}],
                    imap_url:[{required:true,message:'请输入邮箱imap服务器地址',trigger:'blur'}],
                    imap_ssl_port:[{required:true,message:'请输入imap端口',trigger:'blur'}],
                    smtp_url:[{required:true,message:'请输入smtp服务器地址',trigger:'blur'}],
                    smtp_ssl_port:[{required:true,message:'请输入smtp端口',trigger:'blur'}],
                },
                siteOptions:[{label:"全部",value:""}],
                accoutOptions:[{label:"全部",value:""}],

            }
        },
        created(){
        },
        mounted(){
        },
        computed: {
        },
        methods: {
            open(){
                    if(this.isAdd!==1){
                        console.log("open:",this.form.channel_id)
                        let account_id=this.form.account_id
                        this.change_channel(this.form.channel_id).then(res=>{
                            this.form.account_id=account_id;
                        })
                    }
            },
            change_channel(channel_id){
                this.form.channel_id=channel_id||'';
                this.form.account_id='';
                if(!channel_id){
                    this.accoutOptions = [{label:"全部",value:""}];
                    return
                }
             return   this.$http(api_email_account,{channel_id:channel_id}).then(res=>{
                    this.accoutOptions = [...res.account];
                    return Promise.resolve()
                }).catch(code=>{
                    console.log(code);
                })
            },
            submit(){
                if(this.isAdd){
                        let data=clone(this.form);
                        // data.allow_receive=this.form.allowed_receive;
                        // data.allow_send=this.form.allowed_send;
                    return this.$http(api_amazon_email_account_add,data).then(res=>{
                        this.$message({type: "success", message: res.message || res});
                        this.show=false;
                        let accout=this.accoutOptions.find(row=>row.value===this.form.account_id)
                       this.$set(this.form,"account_code",(accout&&accout.label));
                        this.$emit("add-update",res.id,this.form);
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({type: "error", message: code.message || code})
                    })
                }else {
                    let data=clone(this.form);
                    // data.allow_receive=this.form.allowed_receive;
                    // data.allow_send=this.form.allowed_send;
                    return this.$http(api_amazon_email_account_mdf,this.form.id,data).then(res=>{
                        this.$message({type: "success", message: res.message || res});
                        let accout=this.accoutOptions.find(row=>row.value===this.form.account_id)
                        this.$set(this.form,"account_code",(accout&&accout.label));
                       this.$emit("edit-update",this.form.id,this.form);
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({type: "error", message: code.message || code})
                    })
                }
            },
        },
        filters: {},
        watch: {
            show(val){
                this.$emit("input",val)
            },
            value(val){
                this.show=val;
            }
        },
        props: {
            title:{
                required:true,
                type:String
            },
            value:{},
            form:{},
            isAdd:{},
            channel:{
                required:true,
                type:Array
            }
        },
        components: {
            pageDialog:require("../../../components/page-dialog.vue").default,
            paramAccount:require('../../../api-components/param-account.vue').default
        }
    }
</script>
