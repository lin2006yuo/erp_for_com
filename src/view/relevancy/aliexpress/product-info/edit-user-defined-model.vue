<template>
    <page-dialog @open="open" :title="`编辑模板：${editObject.name} 信息`" size="large" v-model="modelVisible" :close-on-click-modal="false" class="product-info-add">
        <div style="padding:30px 80px;">
            <el-form label-width="120px">
                <el-form-item label="速卖通账号简称：">
                    <el-select class="inline" placeholder="请选择" v-model="editObject.account_id" :disabled="true">
                        <el-option
                            v-for="item in accountList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模块名称：">
                    <el-input style="display: inline-block" v-model="editObject.name"></el-input>
                </el-form-item>
                <el-form-item label="自定义模块内容：">
                    <html-editor v-model="editObject.module_contents" :editid=" '0' " ref="child_edit" style="position: absolute;left: 0;top: 0"></html-editor>
                    <el-button @click="add_local" style="position: absolute;right: 82px;top: 3px;z-index:2" type="primary" size="mini">本地图片</el-button>
                    <el-button @click="add_web" style="position: absolute;right: 8px;top: 3px;z-index:2" type="primary" size="mini">网络图片</el-button>
                </el-form-item>
            </el-form>
            <div style="text-align: right">
                <el-button size="mini" type="primary" @click="editUserDe">确定</el-button>
                <!--<el-button size="mini" @click="add_click" type="primary">预览</el-button>-->
                <el-button size="mini" type="default" @click.native="modelVisible = false">取消</el-button>
            </div>
        </div>
        <input type="file" ref="input" hidden @change="handleChange" :multiple="true" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
        <add-network-imgs v-model="addVisible" @add-url="add_url"></add-network-imgs>
    </page-dialog>
</template>
<style lang="stylus">
    .product-info-add{
        .wangEditor-container {
            div.wangEditor-txt{
                height:380px !important;
            }
        }
    }
</style>
<script>
    import {api_edit, api_review,api_look_template,api_upload_net_images,api_upload_local_images} from '../../../../api/aliexpress-product-info'
    export default{
        data(){
            return {
                modelVisible: false,
                addVisible: false,
                searchData: {
                    page: 1,
                    pageSize: 50,
                    publish_status: 2,
                    account_id: "",
                    status: "",
                    snType: "sku",
                    snText: "",
                    start: "",
                    expire_day: "",
                    end: ""
                },
                addModelName: '',
                module_contents: '',
                editObject:{}
            }
        },
        methods: {
            open(){
                this.get_template();
            },
            add_click(){
            	this.$emit('preview-def-model')
            },
            get_template(){
                this.$http(api_look_template,{id:this.id}).then(res=>{
                    this.editObject = res;
                }).catch(code=>{
                    this.$message({
                        showClose: true,
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            add_local(){
                this.$refs.input.click();
            },
            handleChange(ev) {
                const files = ev.target.files;
                if (!files) {
                    return;
                }
                let fileArr = Array.prototype.slice.call(files);
                fileArr.forEach((file, index) => {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {
                        let imgs = e.target.result;
                        let path = URL.createObjectURL(file);
                        let img = JSON.stringify(imgs);
                        let params = [];
                        params.push(img);
                        if(params){
                            this.$http(api_upload_local_images,{images:params}).then(res=>{
                                if(res.data.length>0){
                                    res.data.forEach(row=>{
                                        let img = `<img src="${res.base_url}${row}" />`;
                                        this.$refs.child_edit.insertHtml(img);
                                    });
                                }
                            }).catch(code=>{
                                this.$message({
                                    type:'error',
                                    message:code.message || code
                                });
                            });
                        }
                    }
                });


            },
            add_web(){
                this.addVisible = true;
            },
            add_url(val){
            	this.$http(api_upload_net_images,{images:val}).then(res=>{
                    this.addVisible = false;
                    if(res.data.length>0){
                        res.data.forEach(row=>{
                            let img = `<img src="${res.base_url}${row}" />`;
                            this.$refs.child_edit.insertHtml(img);
                        });
                    }
                }).catch(code=>{
                                this.$message({
                                  type:'error',
                                  message:code.message || code
                                });
                              });
            },
            editUserDe(){//编辑模块
                if ((this.editObject.module_contents).replace(/<p>|<\/p>|<br>|&nbsp;/g, "") === '') {
                    this.$message({
                        type: "error",
                        message: "模块内容不能为空！"
                    });
                    return
                }
                let param={
                    id: this.editObject.id,
                    name: this.editObject.name,
                    module_contents: this.editObject.module_contents,
                    account_id: this.editObject.account_id
                };
                this.$http(api_edit, param).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message || res
                    });
                    this.$emit('edit-user-de',param)
                    this.modelVisible = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            }
        },
        computed: {},
        watch: {
            modelVisible(val){
                this.$emit('input', val);
            },
            value(val){
                this.modelVisible = val;
            }
        },
        props: {
            value: {},
            accountList: {
                type: Array
            },
            id:{}
        },
        components: {
            pageDialog: require("../../../../components/page-dialog.vue").default,
            htmlEditor: require("../../../../components/html-editor.vue").default,
            addNetworkImgs:require('../../../../components/add-network-imgs.vue').default,
        }
    }
</script>
