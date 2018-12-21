<template>
    <div class="c-add-edit-page">
        <page-dialog v-model="dialog" :title="title" size="full" width="73%" :close-on-click-modal="false">
            <div style="margin:8px auto;width:70%">
                <el-form :model="form" ref="form" :rules="rules" label-width="120px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="刊登风格模板名称：" prop="model_name">
                                <el-input v-model="form.model_name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="box-line"></div>
            <div  style="height:580px;width:100%;overflow-y: auto;overflow-x:hidden">
                    <el-row :gutter="4">
                        <el-col :span="20">
                            <kindeditor :editor-text="form.style_detail"
                                        width="100%"
                                        height="500px"
                                        channel="ebay"
                                        :canReplace="!form.hasOwnProperty('id')"
                                        :add_img_btn="add_img_btn"
                                        :showAddPicNormal="false"
                                        :showAddPicLocal="true"
                                        :showAddPicNet="true"
                                        editorId="styleEditor"
                                        @content-change="editor_content_change"></kindeditor>

                        </el-col>
                        <el-col :span="4">
                            <div>
                                <template-variable class="mb-sm"
                                                   label="模板变量"
                                                   :variable="variable1"
                                                   @cur-item="cur_item"></template-variable>
                                <template-variable class="mb-sm"
                                                   label="销售说明"
                                                   :variable="variable2"
                                                   @cur-item="cur_item"
                                ></template-variable>
                            </div>
                            <div class="relative">
                                <template-variable class="mb-sm"
                                                   label="主图图片变量"
                                                   :variable="variable3"
                                                   @cur-item="cur_item"
                                ></template-variable>
                                <template-variable class="mb-sm variable-position"
                                                   label="详情描述图标"
                                                   :variable="variable4"
                                                   @cur-item="cur_item"
                                ></template-variable>
                            </div>
                        </el-col>
                    </el-row>
            </div>
            <div slot="footer">
                <permission
                        tag="ElButton"
                        :route="apis.url_save_stylelist"
                        type="primary"
                        size="mini"
                        class="inline"
                        @click.native="submit">确定</permission>
                <el-button  size="mini" class="inline" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-add-edit-page{
        .box-line{
            border-top:1px solid #ddd;
            height:5px;
        }
        .variable-position{
            position: absolute;
            top:0;
            right:25px
        }
        .wangEditor-container {
            div.wangEditor-txt{
                height:580px !important;
            }
        }
    }
</style>
<script>
    import {api_save_stylelist,api_get_account} from '../../../../api/ebay-kandeng-public-module';
    import {url_save_stylelist} from '../../../../api/ebay-kandeng-public-module';
    export default{
        permission:{
            url_save_stylelist
        },
        data(){
            return {
                dialog:this.value,
                rules:{
                    model_name:[
                        {required:true,message:"刊登风格模板名称为必填项！",trigger:"change,blur"}
                    ],
                    ebay_account:[
                        {required:true,message:"ebay账号为必填项！",trigger:"change,blur",type:'number'}
                    ]
                },
                variable1:["[DESCRIBE]","[SKU]","[PICTURE]","[TITLE]","[PRICE]"],
                variable2:["[Shipping]","[Payment]","[Terms of Sale]","[About Me]","[Contact Us]"],
                variable3:["[IMG1]","[IMG2]","[IMG3]","[IMG4]","[IMG5]","[IMG6]","[IMG7]","[IMG8]","[IMG9]","[IMG10]","[IMG11]","[IMG12]"],
                variable4:["[TIMG1]","[TIMG2]","[TIMG3]","[TIMG4]","[TIMG5]","[TIMG6]","[TIMG7]","[TIMG8]","[TIMG9]","[TIMG10]","[TIMG11]","[TIMG12]","[TIMG13]",
                    "[TIMG14]","[TIMG15]","[TIMG16]","[TIMG17]","[TIMG18]","[TIMG19]","[TIMG20]"],
                add_img_btn:{
                    'position': 'absolute',
                    'top':'1px',
                    'right':'30px',
                    'z-index':'1000',
                },
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            }
        },
        computed:{
            variable5(){
//                let list = [];
//                for(let i = 1;i++;i<=20){
//                    const n=i;
//                    list.push(`[TIMG${n}]`);
//                }
//                console.log(published-records,'published-records');
//                return list;
            }
        },
        methods:{
            editor_content_change(val){
                this.form.style_detail = val;
            },
            cur_item(item){
                KindEditor.insertHtml(`#styleEditor`, item);
            },
            submit(){
                this.$refs.form.validate((bool)=>{
                    if(bool){
//                        let reg = /(\n)|(\r)/g;
                        let params = {
                            model_type:"style",
                        };
                        if(this.form.id){
                            params.id = this.form.id;
                        }
//                        this.form.style_detail =  this.form.style_detail.replace(reg,'');
                        let cur = window.clone(this.form);
                        let detail = [];
                        detail.push(cur);
                        params.detail = JSON.stringify(detail);
                        return this.$http(api_save_stylelist,params).then(res=>{
                            this.$message({
                                type:"success",
                                message:res.message||res
                            });
                            this.dialog = false;
                            this.$emit("submit",cur,res.data);
                            return Promise.resolve();
                        }).catch(code=>{
                            this.$message({
                                type:"error",
                                message:code.message||code
                            })
                        })
                    }
                })
            },
            cancel(){
                this.dialog = false;
            },
        },
        props:{
            title:{},
            value:{},
            form:{},
            accountList:{
                required:true,
                type:Array
            }
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default,
//            htmlEditor:require('../../../../components/html-editor.vue').default,
//            uEditor:require('../../../../components/u-editor.vue').default,
            kindeditor:require('@/components/kindeditor.vue').default,
            templateVariable:require('./template-variable.vue').default
        }
    }
</script>
