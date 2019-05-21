<template>
    <page-dialog title="添加" @open="open" size="large" v-model="modelVisible" :close-on-click-modal="false" class="product-info-add">
        <div style="padding:30px 80px;">
            <el-form label-width="120px" :model="ruleFrom" :rules="rule">
                <el-form-item label="速卖通账号简称："
                              :rules="[{required: true, message: '请选择速卖通账号简称', trigger: 'change', type:'number'}]"
                              prop="searchData.account_id"
                >
                    <el-select class="inline" placeholder="请选择" v-model="ruleFrom.searchData.account_id" filterable>
                        <el-option
                                v-for="item in accountList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模块名称：" prop="addModelName">
                    <el-input style="display: inline-block" v-model="ruleFrom.addModelName"></el-input>
                </el-form-item>
                <el-form-item label="自定义模块内容：" prop="module_contents">
                    <html-editor :editid="'0'" v-model="ruleFrom.module_contents" ref="child_edit" style="position: absolute;left: 0;top: 0"></html-editor>
                    <el-button @click="add_local" style="position: absolute;right: 82px;top: 3px;z-index:2" type="primary" size="mini">本地图片</el-button>
                    <el-button @click="add_web" style="position: absolute;right: 8px;top: 3px;z-index:2" type="primary" size="mini">网络图片</el-button>
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <request-button :mintime="200" req-key="add_model_save" :request="addModel">确定</request-button>
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
    import {api_create_custom, api_review,api_upload_net_images,api_upload_local_images} from '../../../../api/aliexpress-product-info'

    export default {
        data() {
            return {
                modelVisible: false,
                addVisible: false,
                rule: {
                    searchData: {
                        account_id: [{
                            required: true,
                            message: '请选择速卖通账号简称',
                            trigger: 'change',
                            type: 'number'
                        }]
                    },
                    addModelName: [{required: true, message: '请填写模块名称', trigger: 'blur', type: 'string'}],
                    module_contents: [{required: true, message: '自定义模板内容', trigger: 'blur', type: 'string'}]
                },
                ruleFrom: {
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
                },
            }
        },
        created() {
        },
        filters: {},
        mounted() {
        },
        updated() {
        },
        destroy() {
        },
        methods: {
            open(){
                this.ruleFrom.searchData.account_id = '';
                this.ruleFrom.addModelName = '';
                this.ruleFrom.module_contents = '';
            },
            add_click(){
                this.$emit('preview-def-model')
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
            addModel() {//添加模块
                if ((this.ruleFrom.module_contents).replace(/<p>|<\/p>|<br>|&nbsp;/g, "") === '') {
                    this.$reqKey('add_model_save',false);
                    this.$message({
                        type: "error",
                        message: "模块内容不能为空！"
                    });
                    return
                }
                let param = {
                    name: this.ruleFrom.addModelName,
                    module_contents: this.ruleFrom.module_contents,
                    account_id: this.ruleFrom.searchData.account_id
                };
                return this.$http(api_create_custom,param).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.$emit('add-model',param,res.data);
                    this.modelVisible = false;
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('add_model_save',false);
                    },200);
                })
            },
            previewDefModel() {//预览模块
            }
        },
        computed: {},
        watch: {
            modelVisible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.modelVisible = val;
            }
        },
        props: {
            value: {},
            accountList: {
                type: Array
            }
        },
        components: {
            pageDialog: require("../../../../components/page-dialog.vue").default,
            htmlEditor: require("../../../../components/html-editor.vue").default,
            addNetworkImgs:require('../../../../components/add-network-imgs.vue').default,
        }
    }
</script>
