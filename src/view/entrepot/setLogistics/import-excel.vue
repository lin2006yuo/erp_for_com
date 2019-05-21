<template>
    <page-dialog class="p-import-excel" :title="importData.title" v-model="visible" size="large"
                 @close="close"
                 :close-on-click-modal="false">
        <div>
            <div class="file-btn">
                请选择要导入的Excel文件
                <input type="file" ref="file" multiple @change="file_change">
            </div>
            <el-button type="primary" class="inline ml-sm" size="mini" @click="file_download">
                导入模板下载
            </el-button>
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
            <template v-if="importData.type === 'group'">
                <el-button type="primary" size="mini"
                           :disabled="files.length<=0"
                           v-loading.fullscreen.lock="fullscreenLoading"
                           @click="compare_price">
                    价格对比
                </el-button>
                <el-button type="primary" size="mini" @click="upload" :disabled="files.length<=0 || !compareSuccess"
                           v-loading.fullscreen.lock="fullscreenLoading"
                           element-loading-text="正在上传请稍后...">
                    确认上传
                </el-button>
            </template>
            <el-button type="primary" size="mini"
                       v-else
                       @click="upload" :disabled="files.length<=0"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       element-loading-text="正在上传请稍后...">
                确认上传
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

    .p-import-excel {
        li {
            padding: 5px;
            margin: 5px;
            .error {
                margin-top: 5px;
                padding: 10px;
            }
        }
    }

    .prompt-message {
        color: #1F2D3D;
    }

    .error-color {
        background-color: #FF4949;
    }

    .success-color {
        background-color: #13CE66;
    }
</style>
<script>
    import {
        api_shipping_detail,
        api_shipping_fee_import,
        api_shipping_day_import,
        api_compare_price
    } from "@/api/setLogistics"
    import {downloadFile} from '@/lib/http';

    export default {
        data() {
            return {
                visible: false,
                fullscreenLoading: false,
                errors: [],
                files: [],
                downExcelUrl: config.apiHost + 'downfile',
                compareSuccess: false,
            }
        },
        methods: {
            close() {
                this.errors = [];
                this.files = [];
                this.compareSuccess = false;
                this.fullscreenLoading = false;
            },
            remove(file) {
                const index = this.files.indexOf(file);
                this.files.splice(index, 1);
            },
            compare_price() {
                this.get_file((data) => {
                    this.$http(api_compare_price, data).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.compareSuccess = true;
                        this.$emit('compare-success', res.file_code);
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.fullscreenLoading = false;
                        }, 200);
                    });
                });
            },
            upload() {
                this.get_file((data, file) => {
                    this.submit(data, file);
                });
            },
            get_file(callback) {
                this.fullscreenLoading = true;
                this.files.forEach(({file}) => {
                    let data = {
                        id: this.id,
                        file: ''
                    };
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {
                        data.file = e.target.result;
                        callback(data, file);
                    };
                });
            },
            submit(data, file) {
                const index = this.files.indexOfFun(f => f.file === file);
                let api = this.importData.type === 'group' ?
                    api_shipping_detail : this.importData.type === 'section' ?
                        api_shipping_fee_import : api_shipping_day_import;
                // 分组导入需要上传参数
                this.importData.type === 'group' && (data.arrive_type = this.arrive_type);

                this.$http(api, data).then(res => {
                    if (res.message.includes(`导入成功`) || res.message.includes(`操作成功`)) {
                        this.$message({
                            type: 'success',
                            message: `导入文件成功!`
                        });
                        this.files[index].result = `导入文件成功!`;
                        this.$emit('files-success', this.id);
                        this.visible = false;
                    } else {
                        this.files[index].result = "导入有失败！";
                        this.files[index].errors = res.message;
                    }
                }).catch(code => {
                    this.files[index].result = "上传有失败！";
                    this.files[index].errors = code.message;
                }).finally(() => {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                    }, 200);
                });
            },
            file_change() {
                const files = this.$refs.file.files;
                console.log("files", files)
                Object.keys(files).forEach(key => {
                    let file = files[key];
                    if ((/\.(?!(xlsx$|xls$))/.test(file.name))) {
                        this.$message({
                            type: "error",
                            message: "文件类型错误，请选择Excel文件上传！"
                        });
                    } else {
                        this.files.push({file: file, result: '', errors: []});
                    }
                });
                //手动清掉input value
                this.$refs.file.value = '';
            },
            file_download() {
                let url = this.downExcelUrl;
                let code = {
                    code: this.importData.code
                };
                downloadFile({
                    url: url,
                    get: code,
                    fileName: this.importData.file_name,
                    suffix: '.xls',
                });
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
            id: {},
            arrive_type: {},
            importData: {},
        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default
        }
    }
</script>

