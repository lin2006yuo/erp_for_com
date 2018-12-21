<template>
    <page-dialog title="Excel导入添加" size="small" v-model="visible" @open="open"
                 :close-on-click-modal="false">
        <div class='file_padding'>
            <div :class="[isDisabled?'file-disabled':'default-file','file-btn']">
                选取文件
                <input type="file" ref="file" :disabled='isDisabled' :multiple="isMultiple" @change="file_change">
            </div>
            <div class="file-btn default-file ml-sm" style="width: 100px;" @click="download_file">
                {{file_url}}
            </div>
            <ul class="files">
                <li v-if="files.length > 0" v-for="file in files">
                    <div>
                        <span>{{file.file.name}}</span>
                        <el-tag :class="{'error-color':file.errors.length, 'success-color':!file.errors.length && file.result}">
                            {{file.result ? file.result : '未上传'}}
                        </el-tag>
                        <i class="el-icon-circle-cross" @click="remove(file)"></i>
                    </div>
                    <ul v-if="isAbnormal&&file.errors.length > 0" class="error">
                        <li>
                            {{file.errors}}
                        </li>
                    </ul>
                    <el-table
                            :data="file.errors"
                            v-if="file.errors.length > 0&&!isAbnormal">
                        <el-table-column
                                width="80"
                                label="行数">
                            <template slot-scope="scope">
                                <span>{{scope.row.lineNum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="错误信息">
                            <template slot-scope="scope">
                                <span>{{scope.row.errorMsg}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </li>
                <li v-if="files.length <= 0" class="prompt-message">
                    只能上传<span class='text_weight'>Excel</span>文件
                </li>
            </ul>
        </div>
        <div slot="footer" class="dialog-footer">
            <request-button req-key='importFile' @click="upload" :timeout="3000"
                            :disabled="files.length<=0">确认导入</request-button>
            <el-button size="mini" class="mr-sm" @click.native="visible=false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .files{
        margin-top: 10px;
    }
    .text_weight{
        font-weight: 600;
    }
    .file_padding{
        padding: 0 10px;
    }
    .file-btn {
        display: inline-block;
        cursor: pointer;
        height: 26px;
        width: 100px;
        text-align: center;
        line-height: 26px;
        border-radius: 4px;
        position: relative;
        &.default-file{
            background: #33B2FC;
            color: #fff;
        }
        &.file-disabled{
            background: #EFF2F7;
            color: #33B2FC;
            cursor: not-allowed;
        }
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
//    import {api_post_import} from '../../../api/handwork';
    import {downloadFile} from '../lib/http';

    export default {
        data() {
            return {
                visible: false,
                fullscreenLoading: false,
                errors:[],
                files:[],
                isAbnormal:false,
                file_url:'下载模板',
            }
        },
        computed:{
            isDisabled(){
                return this.files.length>=1&&!this.isMultiple
            },
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
//                        extension: /\.([\d\w]+)$/.exec(file.name)[1], 测试备注勿删
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
                if(this.isEbay){//ebay范本管理 导入范本
                    this.$http(this.submitUrl, data).then(res => {
                        this.isAbnormal = false;
                        if(res.message[0][0] === '导入成功'){
                            this.$message({
                                type: 'success',
                                message: res.message||res
                            });
                            this.files[index].result = res.message||res;
                            this.visible=false;
                            this.fullscreenLoading = false;
                            this.$emit('files-data',res.data);
                        }else{
                            this.fullscreenLoading = false;
                            this.files[index].result = '导入有失败!';
                            this.files[index].errors = res.message.map(row => {
                                for(let key in row){
                                    return {
                                        lineNum: key,
                                        errorMsg: row[key]
                                    }
                                }
                            });
                        }
                    }).catch(code => {
                        this.isAbnormal = true;
                        this.fullscreenLoading = false;
                        this.files[index].result = "导入有失败！";
                        this.files[index].errors = code.message
                    }).finally(()=>{
                        this.$reqKey('importFile',false)
                    })
                }else{
                    this.$http(this.submitUrl, data).then(res => {
                        this.isAbnormal = false;
                        this.$message({
                            type: 'success',
                            message: res.message||res
                        });
                        this.files[index].result = res.message||res;
                        this.visible=false;
                        this.fullscreenLoading = false;
                        this.$emit('files-data',res.data);
                    }).catch(code => {
                        this.isAbnormal = true;
                        this.fullscreenLoading = false;
                        this.files[index].result = "导入有失败！";
                        this.files[index].errors = code[index].message||code[index];
                    }).finally(()=>{
                        this.$reqKey('importFile',false)
                    })
                }
            },
            file_change() {
                const files = this.$refs.file.files;
                Object.keys(files).forEach(key=>{
                    let file = files[key];
//                    if ((/\.(?!(xlsx$|xls$))/.test(file.name))) {
                    if (file.name.lastIndexOf('.xlsx')<0&&file.name.lastIndexOf('.xls')<0) {
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
                this.$emit('download-file');
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
            submitUrl:{
                //导入文件接口
            },
            isMultiple:{//是否允许批量上传文件
                type:Boolean,
                default(){
                    return true;
                }
            },
            isEbay:{
                type:Boolean,
                default(){
                    return false
                }
            }
        },
        components: {
            pageDialog: require('./page-dialog.vue').default
        }
    }
</script>
