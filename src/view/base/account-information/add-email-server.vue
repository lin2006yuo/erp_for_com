<template>
    <page-dialog v-model="dialog" :title="title" :close-on-click-modal="false">
        <el-form class='mt-sm mr-lg' :model="form" label-width="140px">
            <el-form-item label="邮件服务器地址：">
                <el-input v-model="form.imap_url"></el-input>
            </el-form-item>
            <el-form-item label="imap端口：">
                <el-input v-model="form.imap_ssl_port"></el-input>
            </el-form-item>
            <el-form-item label="smtp服务器地址：">
                <el-input v-model="form.smtp_url"></el-input>
            </el-form-item>
            <el-form-item label="smtp端口：">
                <el-input v-model="form.smtp_ssl_port"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button type="primary" size="mini" class="inline" @click.native="submit">确定</el-button>
            <el-button size="mini" class="inline" @click.native="dialog = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_save_email_server,api_edit_email_server,api_put_email_server} from  '../../../api/report-channel';
    export default {
        data() {
            return {
                dialog:this.value,
                form:{
                    imap_url:'',
                    imap_ssl_port:'',
                    smtp_url:'',
                    smtp_ssl_port:'',
                }
            }
        },
        methods:{
            /*提交保存*/
            submit(){
                let find = Object.keys(this.form).find(row=>!this.form[row]);
                if(find)return this.$message({type:'warning',message:'请将数据填写完整后再提交！'});
                if(this.id){
                    delete this.form.id;
                    this.$http(api_put_email_server,this.id,this.form).then(res =>{
                        this.$message({type:'success',message:res.message||res});
                        this.dialog = false;
                        this.$emit('update',res.data,this.id);
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    })
                }else{
                    this.$http(api_save_email_server,this.form).then(res => {
                        this.$message({type:'success',message:res.message||res});
                        this.dialog = false;
                        this.$emit('submit',res.data);
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code})
                    })
                }
            },
            /*编辑*/
            edit_form(){
                this.$http(api_edit_email_server,this.id).then(res => {
                    this.form = res;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
        },
        computed:{
            title(){
                return this.id?'编辑邮件服务器地址':'添加邮件服务器地址';
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
                if(val){
                    if(this.curPage==='edit'){
                        this.edit_form();
                    }else{
                        Object.keys(this.form).forEach(row=>this.form[row] = '');
                    }
                }
            },
        },
        props:{
            value:{},
            curPage:{
                required:true,
                type:String
            },
            id:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>