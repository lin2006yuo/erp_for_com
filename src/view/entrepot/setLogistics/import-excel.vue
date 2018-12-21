<template>
    <page-dialog class="p-import-excel" title="excel导入" v-model="visible" size="large" :close-on-click-modal="false">
        <div>
            <div class="file-btn">
                请选择要导入的Excel文件
                <input type="file" ref="file" multiple @change="file_change">
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
            <el-button type="primary" size="mini" @click="upload" :disabled="files.length<=0"
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
    import {api_shipping_detail} from "../../../api/setLogistics"

    export default {
        data() {
            return {
                visible: false,
                fullscreenLoading: false,
                errors: [],
                files: [],
            }
        },
        methods: {
            remove(file) {
                const index = this.files.indexOf(file);
                this.files.splice(index, 1);
            },
            upload() {
                this.fullscreenLoading = true;
                this.files.forEach(({file}) => {
                    let data = {
                        id: this.id,
                        arrive_type: this.arrive_type,
                        file: ''
                    };
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {
                        data.file = e.target.result;
                        this.submit(file, data);
                    };
                });
            },
            submit(file, data) {
                const index = this.files.indexOfFun(f => f.file === file);
                this.$http(api_shipping_detail, data).then(res => {
                    this.fullscreenLoading = false;
                    if (res.message.includes(`导入成功`)) {
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
                    this.fullscreenLoading = false;
                    this.files[index].result = "上传有失败！";
                    this.files[index].errors = code.message;
                })
            },
            file_change() {
                const files = this.$refs.file.files;
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
            arrive_type: {}
        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default
        }
    }
</script>

