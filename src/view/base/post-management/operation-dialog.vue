<template>
    <page-dialog v-model="show"
                 :title="title"
                 :close-on-cilck-modal="false"
                 @open="open"
                 @close="close">      
        <el-form :model="formData"
                 label-position="right" 
                 label-width="180px"
                 :rules="rules"
                 ref="ruleForm">
            <el-form-item v-if="!add" label="添加人：">
                <el-col :span="14">
                    <el-input v-model="formData.create_txt" :disabled="true"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item v-if="!add" label="添加时间：">
                <el-col :span="14">
                    <el-input v-model="formData.create_time_date" :disabled="true"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="邮局：" prop="post">
                <el-col :span="14">
                    <el-input v-model="formData.post" :disabled="view||(!add&&cannotEditPostOffice)" ></el-input>
                </el-col>
            </el-form-item>
              <el-form-item label="收件服务器地址：">
                <el-col :span="14">
                    <el-input v-model="formData.imap_url" :disabled="view" ></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="imap端口：" prop="imap_port" v-if="!!formData.imap_url">
                <el-col :span="14">
                    <el-input v-model="formData.imap_port"
                              :disabled="view">
                    </el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="发件服务器地址：">
                <el-col :span="14">
                    <el-input v-model="formData.smtp_url" :disabled="view" ></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="smtp端口：" prop="smtp_port" v-if="!!formData.smtp_url">
                <el-col :span="14">
                    <el-input v-model="formData.smtp_port"
                              :disabled="view">
                    </el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="状态：">
                <el-switch :value="formData.status"
                           on-text="启用"
                           off-text="停用"
                           :disabled="view"
                           @change="status_change(row)">
                </el-switch>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" v-if="!view" @click.native="update">确定</el-button>
            <el-button size="mini" v-if="!view" @click.native="close">取消</el-button>
            <el-button size="mini" v-else @click.native="close">关   闭</el-button>
        </div>             
    </page-dialog>
</template>

<style lang="">
</style>
<script>
import {api_put_postoffice,api_post_postoffice} from '../../../api/post-management.js'

export default{
    data(){
        var editPostOffice=(rule,value,callback)=>{
            if (!value) {
                return callback(new Error('必填项不能为空'));
            }
            else if(!((new RegExp("^[a-z0-9]+[\.]com$")).test(value))){
                return callback(new Error('格式不正确'));
            }
            else callback(); 
        }
        var numberValidate=(rule,value,callback)=>{
            if (!value) {
                return callback(new Error('必填项不能为空'));
            }
            else if(!((new RegExp("^[0-9]+$")).test(value))){
                return callback(new Error('请输入数字'));
            }
            else callback(); 
        }
        return{
            rules:{
                // addPostOffice:[
                //     {required:true,message:"必填项不能为空",trigger:"change"},
                //     {type:"email",message:"邮箱格式不正确",trigger:"change"}
                // ],
                post:[
                    {validator:editPostOffice,required:true,trigger:"change"}
                ],
                // imap_url:[
                //     {type:'string',required:true,message:"必填项不能为空",trigger:"change"}
                // ],
                imap_port:[
                    // {required:true,message:"必填项不能为空"},
                    // {type:'number',message:"必须为数字"}
                    {validator:numberValidate,required:true,trigger:"change"}
                ],
                // smtp_url:[
                //     {type:'string',required:true,message:"必填项不能为空",trigger:"change"}
                // ],
                smtp_port:[
                    // {required:true,message:"必填项不能为空"},
                    // {type:'number',message:"必须为数字"}
                    {validator:numberValidate,required:true,trigger:"change"}
                ]
            },
            updateData:{
                post:'',
                imap_url:'',
                imap_port:'',
                smtp_url:'',
                smtp_port:'',
                status:0
            }
        }
    },
    methods:{
        open(){

        },
        update_edition(){
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.filter();
                    // console.log("updateData:",this.updateData);
                    this.$http(api_put_postoffice,this.id,this.updateData)
                        .then(res=>{
                            // console.log("res_edit:",res);
                            this.$message({type:'success',message:res.message})
                            this.show=false;
                            this.$emit("update-edittion",this.updateData);
                        })
                        .catch(error=>{
                            this.$message({type:'error',message:error.message})
                        })
                } else {
                    // console.log('编辑错误!!',this.formData);
                    return false;
                }
        });
        },
        update_addtion(){
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.filter();
                    this.$http(api_post_postoffice,this.updateData)
                    .then(res=>{
                        this.$message({type:'success',message:res.message});
                        this.show=false;
                        this.$emit("update-addition");
                    })
                    .catch(error=>{
                        this.$message({type:'error',message:error.message});
                    })
                } else {
                    return false;
                }
            });
        },
        status_change(){
             this.$confirm(`确定进行此操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(()=>{
                    this.formData.status=!this.formData.status;
                    this.$message({type:'success',message:'修改成功'});
                }).catch(()=>{
                   
                   this.$message({
                        type:"info",
                        message:"已取消操作"
                    })
                })
        },
        filter(){   //将formData的数据转移到updateData
            Object.keys(this.formData).forEach(item=>{
                if(this.updateData.hasOwnProperty(item)){
                    //处理status字段，Boolean转Number
                    if(item==="status"){
                        switch(this.formData.status){
                            case true:
                                 this.updateData.status=1
                                 break;
                            case false:
                                this.updateData.status=0
                                break;
                             case ''||undefined:
                                this.updateData.status=0
                                break;                                   
                        }  
                    }
                    else{
                        this.updateData[item]=this.formData[item];
                    } 
                }
            })
        },
        close(){
            this.$emit('input',false);
            Object.keys(this.formData).forEach(item=>{
                if(item==="status"){
                    this.formData[item]=0;
                }
                else{
                    this.formData[item]='';
                }   
            })
        }
    },
    props:{
        // formData:{},
        view:{
            type:Boolean,
            required:true
        },
        title:{},
        add:{
            type:Boolean,
            required:true
        },
        value:{
            type:Boolean,
            required:true
        },
        formData:{
            required:true,
            type:Object
        },
        id:{},
        cannotEditPostOffice:{
            required:true,
            type:Boolean
        },
    },
    computed:{
        update(){
            return this.add?this.update_addtion:this.update_edition
        },
        show:{
            get(){
                return this.value;
            },
            set(val){
                this.$emit("input",val);
            }
        },
        // formData(){
        //     return this.formData;
        // }
    },
    components:{
        pageDialog:require('@/components/page-dialog').default,
    }
}
</script>
