<template>
    <page-dialog class="p-import-txt" title="放款数据导入" v-model="visible" @open="open" size="large" :close-on-click-modal="false">
        <div v-loading="fullscreenLoading" element-loading-text="正在上传请稍后...">
            <div class="file-btn mt-md">
                请选择要导入的txt文件
                <input type="file" ref="file" multiple @change="file_change">
            </div>
            <ul class="files mt-sm">
                <li v-if="files.length > 0" v-for="file in files">
                    <div>
                        <span>{{file.file.name}}</span>
                        <el-tag :class="{'error-color':file.errors.length, 'success-color':!file.errors.length && file.result}">
                            {{file.result ? file.result : '未上传'}}
                        </el-tag>
                        <i v-if="!file.result" class="el-icon-circle-cross" @click="remove(file)"></i>
                    </div>
                    <ul v-if="file.errors.length > 0" class="red-error" style="margin-top: 5px;">
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
            <el-button type="primary" size="mini" @click="upload" :disabled="files.length<=0">
                确认导入
            </el-button>
            <el-button size="mini" class="mr-sm" @click.native="visible=false">关闭</el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus">
    .p-import-txt{
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
        .red-error{
            color: #f00;
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
    }
</style>
<script>
    import {downloadFile} from '../../../../lib/http';
    import {api_import_settle} from'../../.././../api/order_wish';
    export default {
        data() {
            return {
                visible: false,
                fullscreenLoading: false,
                errors:[],
                files:[],
                file:`downfile`,
            }
        },
        methods: {
            open(){
                this.files = [];
                this.fullscreenLoading = false;
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
                this.$http(api_import_settle, item).then(res => {
                    this.files[index].result = res.message;
                    this.fullscreenLoading = false;
                    this.files[index].errors = '';
                }).catch(code => {
                        this.files[index].result = "导入有失败！";
                        let error = [];
                        error.push(code.message);
                        this.files[index].errors = error;
                        this.fullscreenLoading = false;
                })
            },
            file_change() {
                const files = this.$refs.file.files;
                Object.keys(files).forEach(key=>{
                    let file = files[key];
                    if ((/\.(?!(txt$))/.test(file.name))) {
                        this.$message({
                            type: "error",
                            message: "文件类型错误，请选择txt文件上传！"
                        });
                    }else{
                        this.files.push({file:file,result:'', errors:[]});
                    }
                });
                //手动清掉input value
                this.$refs.file.value = '';
            },
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

