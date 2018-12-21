<template>
    <page-dialog class="p-import-excel" @open="open" title="excel导入" v-model="visible" size="large" :close-on-click-modal="false">
        <div>
            <div class="file-btn">
                请选择要导入的Excel文件
                <input type="file" ref="file" multiple @change="file_change">
            </div>
            <div class="file-btn ml-sm" @click="download_file" v-if="!!this.code">
            {{file_name}}
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
            <request-button req-key='importExcel' @click="upload" :mintime="300" :timeout="1000"
                            :disabled="files.length<=0">确认上传</request-button>
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
    .p-import-excel{
        li{
            .error{
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
    import {api_update_excel} from '../../../api/product-library';
    import {downloadFile} from '../../../lib/http';
    export default {
        data() {
            return {
                visible: false,
                fullscreenLoading: false,
                errors:[],
                files:[],
                file:`downfile`
            }
        },
        methods: {
            open(){
                this.files = [];
            },
            remove(file){
                const index = this.files.indexOf(file);
                this.files.splice(index,1);
                console.log(this.$refs.file.files)
            },
            upload() {
                this.fullscreenLoading = true;
                this.files.forEach(({file}) =>{
                    let data = {
//                        extension: file.name.substring(file.name.lastIndexOf('.') + 1),
                        extension: /\.([\d\w]+)$/.exec(file.name)[1],
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
                this.$http(this.api_port, data).then(res => {
                    this.fullscreenLoading = false;
                    if(res.fail_num === 0){
                        this.$message({
                            type: 'success',
                            message: `导入文件成功!`
                        });
                        this.files[index].result = `导入文件成功!`;
                        this.visible=false;
                    }else{
                        if(res.message){
                            this.files[index].result = "导入有失败！";
                            if(!!res.data && res.data.length > 0){
                                res.data.forEach(row=>{
                                    this.files[index].errors.push(row);
                                });
                            }
                            this.files[index].errors.push(res.message);
                        }
                    }
                }).catch(code => {
                    this.fullscreenLoading = false;
                    this.files[index].result = "上传有失败！";
                    this.files[index].errors.push(code.message);
                    console.log('code.message',code.message);
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('importExcel',false);
                    },300);
                })
            },
            file_change() {
                this.files = [];
                const files = this.$refs.file.files;
                Object.keys(files).forEach(key=>{
                    let file = files[key];
                    if ((/\.(xlsx$|xls$)/.test(file.name))) {
                        this.files.push({file:file,result:'', errors:[]});
                    }else{
                        this.$message({
                            type: "error",
                            message: "文件类型错误，请选择Excel文件上传！"
                        });
                    }
                });
                //手动清掉input value
                this.$refs.file.value = '';
            },
            download_file(){
                let url = config.apiHost+this.file;
                let code={
                    code:this.code
                };
                downloadFile({
                    url:url,
                    get:code,
                    fileName:this.file_name,
                    suffix:'.xls',
                })
            }
        },
        computed: {},
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
            code: {},
            file_name: {},
            api_port:{
                type:Function,
                required:true
            }
        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default
        }
    }
</script>

