<template>
    <page-dialog :title="$t('ebay-list.importType')" size="small" v-model="visible" @open="open"
                 :close-on-click-modal="false">
        <div class='file_padding'>
            <div :class="[isDisabled?'file-disabled':'default-file','file-btn']">
                {{$t('ebay-list.choiceFile')}}
                <input type="file" ref="file" :disabled='isDisabled' :multiple="isMultiple" @change="file_change">
            </div>
            <div class="file-btn default-file ml-sm" style="width: 120px;" @click="download_file">
                {{file_url}}
            </div>
            <ul class="files">
                <li v-if="files.length > 0" v-for="file in files">
                    <div>
                        <span>{{file.file.name}}</span>
                        <el-tag :class="{'error-color':file.errors.length, 'success-color':!file.errors.length && file.result}">
                            {{file.result ? file.result : $t('ebay-list.NotUploaded')}}
                        </el-tag>
                        <i class="el-icon-circle-cross" @click="remove(file)"></i>
                    </div>
                    <ul v-if="isAbnormal&&file.errors.length > 0" class="error">
                        <li>
                            {{file.errors}}
                        </li>
                    </ul>
                    <el-table
                        class="mt-sm"
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
                                :label="$t('ebay-list.errorMessage')">
                            <template slot-scope="scope">
                                <span>{{scope.row.errorMsg}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </li>
                <li v-if="files.length <= 0" class="prompt-message">
                    {{textTip()}}
                </li>
            </ul>
        </div>
        <div slot="footer" class="dialog-footer">
            <request-button req-key='importFile' @click="upload" :timeout="3000"
                            :disabled="files.length<=0">{{$t('ebay-list.ConfirmImport')}}</request-button>
            <el-button size="mini" class="mr-sm" @click.native="visible=false">{{$t('ebay-list.close')}}</el-button>
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
        width: 120px;
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
                errors:[],
                files:[],
                isAbnormal:false,
                file_url:this.$t('ebay-list.downloadTemplate'),
            }
        },
        computed:{
            isDisabled(){
                return this.files.length>=1&&!this.isMultiple
            },
        },
        methods: {
            textTip(){
                if(this.typeList==='csv'){
                    return this.$t('ebay-list.onlyCsv');
                }else {
                    return this.$t('ebay-list.onlyExcel');
                }

            },
            open(){
                this.files = [];
            },
            remove(file){
                const index = this.files.indexOf(file);
                this.files.splice(index,1);
            },
            upload() {//上传
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
                        if(res.message instanceof Array){
                            this.files[index].errors = res.message;
                            this.files[index].result = this.$t('ebay-list.haveFailed');
                        }else{
                            this.$message({type: 'success',message: res.message||res});
                            this.$emit('files-data',res.data);
                            this.visible = false;
                        }
                    }).catch(code => {
                        this.isAbnormal = true;
                        this.files[index].result = this.$t('ebay-list.haveFailed');
                        this.files[index].errors = code.message
                    }).finally(()=>{
                        this.$reqKey('importFile',false)
                    })
                }else{
                    this.$http(this.submitUrl, data).then(res => {
                        debugger;
                        if(res.result===false){
                            if(Object.prototype.toString.call(res.message) === "[object Array]") {
                                this.$emit('errmeaage', res.message);
                                return;
                            }else {
                                this.$message({
                                    type: 'error',
                                    message: res.message||res
                                });
                                this.isAbnormal = false;
                                return;
                            }
                        }
                        else if(res.error_count>0){
                            this.$emit('errmeaage',res)
                            return;
                        }
                        this.isAbnormal = false;
                        this.$message({
                            type: 'success',
                            message: res.message||res
                        });
                        this.files[index].result = res.message||res;
                        this.visible=false;
                        this.$emit('files-data',res.data);
                    }).catch(code => {
                        this.isAbnormal = true;
                        this.files[index].result =this.$t('ebay-list.haveFailed');
                        // this.files[index].errors = code[index].message||code[index];
                        this.files[index].errors = code.message||code;
                    }).finally(()=>{
                        this.$reqKey('importFile',false)
                    })
                }
            },
            file_change() {
                const files = this.$refs.file.files;
                Object.keys(files).forEach(key=>{
                    let file = files[key];
//                    if ((/\.(?!(xlsx$|xls$))/.test(file.name))&&file.name.lastIndexOf('.xls')<0) {
                    if(this.typeList==='csv'){
                        if (file.name.lastIndexOf('.csv')<0) {
                            this.$message({
                                type: "error",
                                message: this.$t('ebay-list.FailedImport')
                            });
                        }else{
                            this.files.push({file:file,result:'', errors:[]});
                        }
                    }else {
                        if (file.name.lastIndexOf('.xlsx')<0&&file.name.lastIndexOf('.xls')<0) {
                            this.$message({
                                type: "error",
                                message: this.$t('ebay-list.FailedImportExcel')
                            });
                        }else{
                            this.files.push({file:file,result:'', errors:[]});
                        }
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
            typeList:{//导入文件类型

                default(){
                    return 'excel';
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
