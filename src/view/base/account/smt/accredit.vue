<template>
    <el-row class="p-accredit">
        <page-dialog :title="accessory.title"  size="small" v-model="accreditDialog" :close-on-click-modal=false>
           <div>
               <el-form label-width="120px" :model="form" ref="form" :rules="rules">
                   <el-form-item
                           label="账户ID："
                           prop="client_id"
                   >
                       <el-col :span="15">
                           <el-input v-model="form.client_id"></el-input>
                       </el-col>
                   </el-form-item>
                   <el-form-item label="账户密钥：" prop="client_secret">
                       <el-col :span="15">
                           <el-input v-model="form.client_secret" ></el-input>
                       </el-col>
                   </el-form-item>
                   <el-form-item label="授权码：" prop="authorization_code">
                       <el-col :span="9">
                           <el-input v-model="form.authorization_code"></el-input>
                       </el-col>
                       <el-col :span="4" class="accredit-mt" >
                           <request-button req-key='accreditSmt' @click="get_code" v-show="isShow">获取授权码</request-button>
                       </el-col>
                   </el-form-item>
               </el-form>
           </div>
            <span slot="footer" class="dialog-footer">
                <request-button req-key='getTokenSmt' @click="getToken">获取token</request-button>
                <el-button  size="mini" @click.native="cancal">取消</el-button>
            </span>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .accredit-mt{
        margin-left:4px;
    }
</style>

<script>
    import {aliexpress_getToken,aliexpress_getCode} from '../../../../api/aliexpress';
    import pageDialog from '../../../../components/page-dialog.vue';
    export default{
        data(){
            return {
                accreditDialog:false,
                isGetCodeAddr:false,
                rules:{
                    client_id:[
                        {required:true,message:"账户ID不能为空",trigger:"blur"}
                    ],
                    client_secret:[
                        {required:true,message:"账户密钥不能为空",trigger:"blur"}
                    ],
                    authorization_code:[
                        {required:true,message:"授权码不能为空",trigger:"blur"}
                    ]

                }
            }
        },
        mounted(){
            this.accreditDialog = this.value;
        },
        methods:{
//____________________________________________________getToken API
            getToken(){
                this.$refs.form.validate((res)=>{
                    if(res){
                        let params = clone(this.form);
                        this.$set(params,'id',this.accessory.id);
                        this.$http(aliexpress_getToken,params).then(res=>{
                            this.$message({
                                type:"success",
                                message:res.message||res
                            });
                            this.accreditDialog=false;
                        }).catch(code=>{
                            this.accreditDialog=true;
                            this.$message({
                                type:"error",
                                message:code.message||code
                            })
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('getTokenSmt',false);
                            }, 300)
                        })
                    }else{
                        this.$reqKey('getTokenSmt',false);
                    }
                })
            },
//_____________________________________________________getCode API
            get_code(){
                this.$http(aliexpress_getCode,this.form.client_id, this.form.client_secret).then(addr=> {
                    window.open(addr.url);
                }).catch(code=> {
                    this.$message({
                        type: 'error',
                        message: code.message||code
                    })
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('accreditSmt', false);
                    }, 300)
                })
            },
            cancal(){
                this.accreditDialog=false;
                }
        },
        watch:{
            accreditDialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.accreditDialog = val;
            }
        },
        computed:{
            isShow(){
                return this.form.client_id&&this.form.client_secret ? true:false;
            },
        },
        props:{
            value:{},
            form:{
                required:true,
                type:Object
            },
            accessory:{
                required:true,
                type:Object
            }
        },
        components: {
            pageDialog
        }
    }
</script>