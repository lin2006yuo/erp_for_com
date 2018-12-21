<template>
    <el-row class="p-add-brand">
        <page-dialog :title="titleName" v-model="dialogVisible"
                     @open="open"
                     size="small" :close-on-click-modal="false">
            <el-form :model="brandForm" :rules="rules" label-width="160px">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="品牌名称：" prop="name">
                            <el-input v-model="brandForm.name" auto-complete="off" v-if="isEdit"></el-input>
                            <div v-else>{{brandForm.name}}</div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="品牌code：">
                            <el-input v-model="brandForm.code" auto-complete="off" v-if="isEdit"></el-input>
                            <div v-else>{{brandForm.code}}</div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="品牌网址：">
                            <el-input v-model="brandForm.site_url" auto-complete="off" v-if="isEdit"></el-input>
                            <div v-else style="word-wrap: break-word;">{{brandForm.site_url}}</div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="品牌logo：">
                            <div v-if="isEdit">
                                <el-popover
                                    v-if="brandForm.logo"
                                    placement="right"
                                    width="200"
                                    trigger="hover">
                                    <img v-lazy="`http://${brandForm.logo}`" width="200" height="200">
                                    <span slot="reference">
                                    <img v-lazy="`http://${brandForm.logo}`" height="26px" width="26px" alt="">
                                    </span>
                                </el-popover>
                                <image-upload :thumbnail-mode="true" label="上传品牌logo"  class="inline" :multiple="false" ref="images" :init="brandForm.file"></image-upload>
                            </div>
                            <div v-else>
                                <img v-lazy="`http://${brandForm.logo}`" style="width:100px;height:100px"/>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="品牌描述：">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 6}"
                                    placeholder="请输入描述内容"
                                    v-model="brandForm.description" v-if="isEdit">
                            </el-input>
                            <div v-else>{{brandForm.description}}</div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div v-if="isEdit" style="display: inline;">
                    <request-button req-key='addBrand' @click="confirm" :disabled="isSave" v-if="markId==0">保存</request-button>
                    <request-button req-key='updateBrand' @click="edit_confirm" :disabled="isSave" v-else>保存</request-button>
                </div>
                <el-button size="mini" @click.native="dialogVisible=false">取 消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .el-dragger{
        width: 100px;
        height:100px;
    }
</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue'
    import {api_brand_data,api_add,api_delete,api_edit,api_update} from '../../../api/brand';
    export default{
        data(){
            return {
                dialogVisible:false,
                rules:{
                    name:[
                        { required: true, message: '名称不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            open(){
                this.brandForm.file = [];
            },
            confirm(){//-----------保存
                this.$http(api_add,this.brandForm).then(res=>{
                    this.$message({
                    type:"success",
                    message:res.message||res,
                     });
                    this.dialogVisible=false;
                   this.$emit("reload",res.id,this.brandForm);
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message||code,
                    })
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addBrand', false);
                    }, 300)
                })
            },
            //-----------------------------------------------更新
            edit_confirm(){
            	let data = window.clone(this.brandForm);
            	if(data.file.length===0){
            		this.$delete(data,'file');
                }
                this.$http(api_update,this.markId,data).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res,
                    });
                    this.dialogVisible=false;
                    this.$emit("update",this.markId,this.brandForm);
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message||code,
                    });
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('updateBrand', false);
                    }, 300)
                })
            },
        },
        computed:{
            isSave(){
                if(!this.brandForm.name){
                    return true;
                }
//                if(!this.brandForm.code){
//                    return true;
//                }
//                if(!this.brandForm.site_url){
//                    return true;
//                }
//                if(!this.brandForm.description){
//                    return true;
//                }
                return false;
            }
        },
        watch:{
            dialogVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialogVisible = val;
            },
        },
        props:{
            value:{},
            brandForm:{
                required:true,
                type:Object
            },
            markId:{
                required:true,
                type:Number
            },
            isEdit:{
                required:true,
                type:Boolean
            },
            titleName:{
                required:true,
                type:String
            }
        },
        components: {
            pageDialog,
            imageUpload:require("../../customer-service/smt/inbox/image-upload.vue").default,
        }
    }
</script>
