<template>
    <page-dialog class="p-import-excel" title="excel导入" v-model="visible" @open="open" size="large" :close-on-click-modal="false">
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
    export default {
        data() {
            return {
                visible: false,
                fullscreenLoading: false,
                errors:[],
                files:[],
                file_url:'下载导入模板',
                file:`downfile`,
            }
        },
        methods: {
            open(){
                this.files = [];
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
                };
                this.$http(this.importApi, item).then(res => {
                	this.fullscreenLoading = false;
                    if(res.message.length>0||res.error.length>0){
                        this.$message({
                            type: res.error.length?'info':'success',
                            message: res.message+'，'+res.error
                        });
                        this.files[index].result = res.message;
                        this.visible=false;
                        this.$emit('files-update');
                    }else{
                        this.files[index].result = "导入有失败！";
                        this.files[index].errors = res.fail_message;
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
                let data = this.selectList.length>0?{ids:this.selectList.map(row=>row.id).join(',')}:{};
                this.$http(this.exportApi,data).then(res=>{
                    if(res.status===1){
                        this.$message({type:'success',message:res.message||res});
                        downloadFile({
                            url:config.apiHost+'downloadFile/downExportFile',
                            get:{file_code:res.file_code},
                            fileName:res.file_name,
                            suffix:'.xlsx',
                        })
                    }else{
                        this.$message({type:'error',message:res.message||res});
                    }
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
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
            selectList:{},
            exportApi:{},
            importApi:{}
        },
        components: {
            pageDialog: require('../../../../components/page-dialog.vue').default
        }
    }
</script>

