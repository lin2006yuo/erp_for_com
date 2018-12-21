<template>
    <page-dialog class="p-import-excel" title="excel导入" v-model="visible" size="large" :close-on-click-modal="false">
        <div>
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
                    <ul v-if="file.errors.length > 0" class="error">
                        <li>
                            {{file.errors}}
                        </li>
                    </ul>
                </li>
                <li v-if="files.length <= 0" class="prompt-message">
                    请选择要导入的文件！
                </li>
            </ul>
        </div>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="uploadImport" @click="upload" :mintime="300" :timeout="1000"
                            :disabled="files.length<=0">
                确认导入
            </request-button>
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
    .p-import-excel{
        li{
            padding: 5px;
            margin:5px;
            .error{
                margin-top: 5px;
                padding: 10px;
            }
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
    import {api_import_sku_map} from '../../../api/goods-sku-map';
    import {downloadFile} from '../../../lib/http';
    import RequestButton from "../../../global-components/request-button.vue";

    export default {
        data() {
            return {
                visible: false,
                fullscreenLoading: false,
                errors:[],
                files:[],
                file_url:'下载导入模板',
                file:`downfile`
            }
        },
        methods: {
            remove(file){
                const index = this.files.indexOf(file);
                this.files.splice(index,1);
                console.log(this.$refs.file.files)
            },
            upload() {
                this.fullscreenLoading = true;
                this.files.forEach(({file}) =>{
                    let data = {
                        extension: file.name.substring(file.name.lastIndexOf('.') + 1),
                        content: '',
                        name: file.name
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
                    file:data.content,
                };
                this.$http(api_import_sku_map, item).then(res => {
                	this.fullscreenLoading = false;
                    if(res.message === `导入成功`){
                        this.$message({
                            type: 'success',
                            message: `导入文件成功!`
                        });
                        this.files[index].result = `导入文件成功!`;
                        this.$emit('files-success');
                        this.visible=false;
                    }else{
                        this.files[index].result = "导入有失败！";
                        this.files[index].errors = res.message;
                    }
                    console.log('12312313');
                }).catch(code => {
                    this.fullscreenLoading = false;
                    this.files[index].result = "导入有失败！";
                    this.files[index].errors = code.message;
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('uploadImport', false);
                    }, 300)
                })
            },
            file_change() {
                const files = this.$refs.file.files;
                Object.keys(files).forEach(key=>{
                    let file = files[key];
                    console.log(file)
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
                    code:'good_sku_map'
                }
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
                this.files = [];
            }
        },
        props: {
            value: {},
            warehouseId: {}
        },
        components: {
            RequestButton,
            pageDialog: require('../../../components/page-dialog.vue').default
        }
    }
</script>

