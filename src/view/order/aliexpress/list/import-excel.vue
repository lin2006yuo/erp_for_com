<template>
    <page-dialog class="p-import-excel" title="excel导入" v-model="visible" @open="open" size="large" :close-on-click-modal="false">
        <div>
            <label class="inline">账号简称：</label>
            <el-select class="inline width-lg" v-model="value2" filterable clearable @change="changeID">
                <el-option v-for="(v,i) in accountLists"
                           :label="v.label"
                           :value="v.value"
                           :key="v.label"
                ></el-option>
            </el-select>
            <div class="file-btn">
                请选择要导入的Excel文件
                <input type="file" ref="file" multiple @change="file_change">
            </div>
            <div class="file-btn ml-sm" style="width: 120px;" @click="download_file">
                {{file_url}}
            </div>
                <ul class="files">
                <li v-if="files.length > 0" v-for="file in files">
                    <div>
                        <span>{{file.file.name}}</span>
                        <el-tag :class="{'error-color':file.errors.length, 'success-color':!file.errors.length && file.result}">
                            {{file.result ? file.result : '未上传'}}
                        </el-tag>
                        <i v-if="!file.result" class="el-icon-circle-cross" @click="remove(file)"></i>
                    </div>
                    <ul v-if="file.errors.length > 0" class="error" style="margin-top: 5px;">
                        <li v-for="(error,index) in file.errors" :key="index">
                            {{error}}
                        </li>
                    </ul>
                </li>
                <li v-if="files.length <= 0" class="prompt-message">
                    请选择要导入的文件！
                </li>
            </ul>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" @click="upload" :disabled="files.length<=0"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       element-loading-text="正在上传请稍后...">
                确认导入
            </el-button>
            <el-button size="mini" class="mr-sm" @click.native="visible=false">关闭</el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus">
    .file-btn {
        display: inline-block;
        cursor: pointer;
        height: 26px;
        width: 150px;
        text-align: center;
        line-height: 26px;
        background: #008BCE;
        border-radius: 4px;
        position: relative;
        color: #fff;
        input {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 100%;
            opacity: 0;
        }
    }
    .files{
        li{
            margin-top :5px;
        }
    }
    .prompt-message{
        color: #1F2D3D;
    }

    .error-color{
        background-color: #FF4949;
    }
    .success-color{
        background-color: #13CE66;
    }
</style>
<script>
    import {downloadFile} from '../../../../lib/http';
    import {aliexpress_order_import} from '../../../../api/aliexpress-order'
    import { api_get_account} from '../../../../api/aliexpress-order'

    export default {
        data() {
            return {
                accountLists:{},
                visible: false,
                fullscreenLoading: false,
                errors:[],
                files:[],
                file_url:'下载导入模板',
                file:`downfile`,
                value2:'',
                account_id:'',
            }
        },
        mounted(){
            this.$http(api_get_account, {channel_id: 4}).then(res => {
                this.accountLists = [{label: "全部", value: ""},...res.account];
            }).catch(code => {
                console.log(code);
            })
        },
        methods: {
            open(){
                this.files = [];
            },
            changeID(val){
                this.account_id = val;
            },
            remove(file){
                const index = this.files.indexOf(file);
                this.files.splice(index,1);
            },
            upload() {
                this.fullscreenLoading = true;
                this.files.forEach(({file}) =>{
                    let data = {
                        extension: file.name.substring(file.name.lastIndexOf('.') + 1),
                        content: '',
                        name: file.name,
                    };
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {
                        data.content = e.target.result;
                        this.submit(file, data);
                    };
                });
            },
            submit(file, data) {
                const index = this.files.indexOfFun(f=>f.file === file);
                let item={
                    content:data.content,
                    extension: data.name.substring(file.name.lastIndexOf('.') + 1),
                    name: data.name,
                    account_id:this.account_id,
                }
                this.$http(aliexpress_order_import, item).then(res => {
                	this.fullscreenLoading = false;
                    if(res.fail_num === 0){
                        this.$message({
                            type: 'success',
                            message: `导入文件成功!`
                        });
                        this.files[index].result = `导入文件成功!`;
                        this.visible=false;
                        this.$emit('files-update');
                    }else{
                        if(res.fail_message){
                            this.files[index].result = "导入有失败！";
                            this.files[index].errors = res.fail_message;
                        }
                    }
                }).catch(code => {
                    this.fullscreenLoading = false;
                    this.files[index].result = "导入有失败！";
                    let error = [];
                    error.push(code.message);
                    this.files[index].errors = error;
                })
            },
            file_change() {
                const files = this.$refs.file.files;
                Object.keys(files).forEach(key=>{
                    let file = files[key];
                    if ((/\.(?!(xlsx$|xls$))/.test(file.name))) {
                        this.$message({
                            type: "error",
                            message: "文件类型错误，请选择Excel文件上传！"
                        });
                    }else{
                        this.files.push({file:file,result:'', errors:[]});
                    }
                });
                //手动清掉input value
                this.$refs.file.value = '';
            },
            download_file(){
                let url = config.apiHost+this.file;
                let code={
                    code:'aliexpress_order_import'
                };
                downloadFile({
                    url:url,
                    get:code,
                    fileName:this.file_url,
                    suffix:'.xls',
                })
            }
        },
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
            }
        },
        props: {
            value: {},
        },
        components: {
            pageDialog: require('../../../../components/page-dialog.vue').default
        }
    }
</script>

