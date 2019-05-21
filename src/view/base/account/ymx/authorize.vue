<template>
    <el-row class="p-authorize">
        <page-dialog :title="title" size="small" v-model="show" @open="open">
            <el-form :model="authorizeData" label-width="160px" ref="form" :rules="rules">
                <el-form-item label="Amazion用户名：" prop="account_name">
                    <el-col :span="15">
                    <el-input v-model="authorizeData.account_name" :disabled="true"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="简称：" prop="code">
                    <el-col :span="15">
                    <el-input v-model="authorizeData.code"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="站点：" prop="site">
                    <el-col :span="15">
                        <el-select v-model="authorizeData.site" @input="(val)=>{currentSel(val)}">
                           <el-option v-for="item in addEditSiteList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="API用户名："  prop="merchant_id">
                    <el-col :span="15">
                    <el-input v-model="authorizeData.merchant_id"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="授权类型："  prop="authorization_type"> 
                    <el-col :span="15">
                        <el-select v-model="authorizeData.authorization_type" 
                                   @change="(val)=>{currentSel2(val)}"
                                   :disabled="!authorizeData.site">
                            <el-option v-for="item in typeList"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="API密码：" v-if="!isShow"  prop="access_key_id">
                    <el-col :span="15">
                    <el-input v-model="authorizeData.access_key_id"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="API签名：" v-if="!isShow"  prop="secret_key">
                    <el-col :span="15">
                        <el-input v-model="authorizeData.secret_key" type="textarea" :rows="2"  placeholder="请输入内容"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="第三方API密码：" prop="developer_access_key_id" v-if="isShow">
                    <el-col :span="14">
                        <el-input v-model="authorizeData.developer_access_key_id"  v-if="!isView"></el-input>
                        <span v-if="isView">{{authorizeData.developer_access_key_id}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="第三方API签名：" prop="developer_secret_key" v-if="isShow">
                    <el-col :span="20">
                        <el-input type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 4}"
                                  v-model="authorizeData.developer_secret_key"
                                  v-if="!isView">
                        </el-input>
                        <span v-if="isView">{{authorizeData.developer_secret_key}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="第三方授权Token： " prop="auth_token" v-if="isShow">
                    <el-col :span="14">
                        <el-input v-model="authorizeData.auth_token" v-if="!isView"></el-input>
                        <span v-if="isView">{{authorizeData.auth_token}}</span>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="put_authorize">确定</el-button>
                <el-button size="mini" @click="close">取 消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
import pageDialog from '@/components/page-dialog.vue';
import {api_amazon_permit,ymx_site_accredit} from '../../../../api/ymx.js'
    export default{
        data(){
            return{
                rules:{
                    account_name:{required:true,message: '必填项不能为空', trigger: 'change'},
                    code:{required:true,message: '必填项不能为空', trigger: 'change'},
                    site:{required:true,message: '必填项不能为空', trigger: 'change'},
                    merchant_id:{required:true,message: '必填项不能为空', trigger: 'change'},
                    // authorization_type:{required:true,message: '必填项不能为空', trigger: 'change'},
                    access_key_id:{required:true,message: '必填项不能为空', trigger: 'change'},
                    secret_key:{required:true,message: '必填项不能为空', trigger: 'change'},
                    developer_access_key_id:{required:true,message: '必填项不能为空', trigger: 'change'},
                    developer_secret_key:{required:true,message: '必填项不能为空', trigger: 'change'},
                    auth_token:{required:true,message: '必填项不能为空', trigger: 'change'},
                },
                authorizeData:{
                    account_name:'',
                    code:'',
                    site:'',
                    merchant_id:'',
                    authorization_type:'',
                    access_key_id:'',
                    secret_key:'',
                    developer_access_key_id:'',
                    developer_secret_key:'',
                    auth_token:'',
                },
                authorVisible:false,
                typeList:[
                    {label:'自授权',value:0},
                    {label:'第三方授权',value:1}
                ],  
            }
        },
        computed:{
            title(){
                return `给账号 : ${this.accountName}授权`
            },
            isShow(){
               if(this.editData){
                    return this.editData.authorization_type ===1
               }
            },
             isView(){
                return this.action.name === 'view';
            },
            show:{
                get(){
                    return this.value
                },
                set(val){
                    this.$emit("input",val)
                }
            }
        }
        ,
        methods:{
            open(){
                Object.keys(this.editData).forEach(key=>{
                    if(this.authorizeData.hasOwnProperty(key)){
                        this.authorizeData[key]=this.editData[key]
                    }
                })
                console.log("open-authorizeData:",this.authorizeData);
            },
            close(){
                this.authorVisible = false;
            },
            currentSel(val){
              
                this.editData.site = val;
                this.doSomething()
            },
            currentSel2(val){
                this.editData.authorization_type = val;
                this.doSomething();
            },
            doSomething(){
                if(this.editData.authorization_type===1){
                    this.$http(ymx_site_accredit,this.editData.site).then(res => {
                        // console.log("接口数据:",res);
                        if(res.ack===1){
                            this.authorizeData.developer_access_key_id = res.data.developer_access_key_id;
                            this.authorizeData.developer_secret_key = res.data.developer_secret_key;
                        }else{
                            this.$message({type: "error", message: res.message || code});
                            this.authorizeData.authorization_type = 0;
                        }
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    })
                }else{
                    this.authorizeData.authorization_type = 0;
                }
            },
            put_authorize(){
                this.$refs['form'].validate(valid=>{
                    if(valid){
                        this.$http(api_amazon_permit,this.rowId,this.authorizeData)
                            .then(res=>{
                                this.$message({type:'success',message:'授权成功'});
                                this.show=false;
                                this.$emit("status-change",1);
                            })
                            .catch(error=>{
                                this.$message({type:'error',message:error.message||error});
                                this.show=false;
                            })
                    }
                    else{
                        return false
                    }
                })
            }
            
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
            editData:{
                required:true,
                type:Object
            },
            value:{
            },
            accountName:{},
            action:{},
            addEditSiteList:{
                required:true,
                type:Array
            },
            rowId:{}
        },
        components:{
            pageDialog
        }
    }
</script>