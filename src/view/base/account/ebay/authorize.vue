<template>
    <el-row class="p-authorize">
        <page-dialog title="授权"     v-model="authorVisible"   :close-on-click-modal=false>
            <el-form :model="authorizeData">
                <el-form-item label="账户ID:"    label-width="100px">
                    <el-col :span="6">
                        <div style="text-align: center;" > {{authorizeData.account_name}}&nbsp;</div>
                    </el-col>
                    <el-col :span="6">
                        <a  :href="authorizeData.url" class="ebay-link"  style="margin-left:20px" target="_blank"  >   获取授权码</a>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <request-button req-key='haveAuthor' @click="have_author">已获得授权</request-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .p-authorize{
        .ebay-link{
            display: block;
            background: #20a0ff;
            width: 100%;
            color: white;
            text-align: center;
            border-radius: 5px;
        }
        .ebay-link:hover{
            font-size: 1rem;
        }
        .el-dialog__body{
            height: 26px;
        }
        /*.el-icon-close:before {*/
        /*content: "";*/
        /*}*/
    }
</style>
<script>
    import pageDialog from "../../../../components/page-dialog.vue"
    import   { account_ebay_token}   from  '../../../../api/account-ebay'   //引入添加token接口
    export default{
        data(){
            return{
                authorVisible:false
            }
        },
        computed:{
        },
        methods:{
            //授权
            have_author(){
                let authortemp={};
                authortemp.id=this.authorizeData.id;
                authortemp.sessId= this.authorizeData.sessId;
                this.$http(account_ebay_token,authortemp).then(res=>{
                    this.$message({
                        type: 'success',
                        message:res.message||res,
                    });
                    this.authorVisible=false;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('haveAuthor', false);
                    }, 300)
                })
            },
            //关闭授权页面
            close_author(){
                this.authorVisible=false;
            },

        },
        watch:{
            authorVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.authorVisible = val;
            }
        },
        props:{
            authorizeData:{
                required:true,
                type:Object
            },
            value:{
            }
        },
        components:{
            pageDialog
        }
    }
</script>