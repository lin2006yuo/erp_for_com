<template>
    <page-dialog v-model="visible" @open="open" @close="close" :title="importAction.title">
        <div class="file-btn">
            {{`请选择要导入的${importAction.isPDF}文件`}}
            <input type="file" ref="file" :multiple="importAction.isMultiple"
                   @change="file_change">
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
        <div slot="footer">
            <request-button
                    req-key="boxUpdate"
                    @click="sure"
                    :disabled="files.length<=0"
                    v-loading.fullscreen.lock="fullscreenLoading"
                    element-loading-text="正在上传请稍后...">
                确认导入
            </request-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
</style>
<script>
    import {api_upload_allocation_attachment} from "@/api/transfer-plan";

    export default {
        data() {
            return {
                visible: false,
                errors: [],
                files: [],
                file: `downfile`,
                fullscreenLoading: false,
            }
        },
        methods: {
            remove(file) {
                const index = this.files.indexOf(file);
                this.files.splice(index, 1);
            },
            open() {
            },
            sure() {
                let type = this.importAction.type;
                let attachment = [];
                this.files.forEach(({file}, index) => {
                    let data = {
                        // extension: file.name.substring(file.name.lastIndexOf('.') + 1),
                        content: '',
                        name: file.name
                    };
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {
                        data.content = e.target.result;
                        attachment.push(data);
                        if (attachment.length === this.files.length) {
                            if (this.submit(type, attachment, true) === false) return;
                        }
                    };
                })
            },
            submit(type, attachment, isLast) {
                let data = {
                    type: type,
                    attachment: attachment,
                };
                let message = true;
                this.fullscreenLoading = true;
                this.$http(api_upload_allocation_attachment, this.importAction.id, data).then(res => {
                    if(isLast) {
                        this.$message({type: 'success', message: res.message || res});
                        this.$emit('upload', type, res.data);
                        this.visible = false;
                    }
                }).catch(code => {
                    isLast && this.$message({type: 'error', message: code.message || code});
                    message = false;
                }).finally(() => {
                    this.fullscreenLoading = false;
                    this.$reqKey('boxUpdate', false);
                });
                return message;
            },
            file_change() {
                const files = this.$refs.file.files;
                Object.keys(files).forEach(key => {
                    let file = files[key];
                    if(this.importAction.isMultiple) {
                        this.files.push({file: file, result: '', errors: []});
                    } else {
                        this.$set(this.files, 0, {file: file, result: '', errors: []});
                    }
                    /*switch(this.importAction.isPDF) {
                        case 'PDF':
                            if ((/\.(?!(pdf$))/.test(file.name))) {
                                this.$message({
                                    type: "error",
                                    message: "文件类型错误，请选择PDF文件上传！"
                                });
                            } else {
                                if(this.importAction.isMultiple) {
                                    this.files.push({file: file, result: '', errors: []});
                                } else {
                                    this.$set(this.files, 0, {file: file, result: '', errors: []});
                                }
                            }
                            break;
                        case 'Excel':
                            if ((/\.(?!(xlsx$|xls$))/.test(file.name))) {
                                this.$message({
                                    type: "error",
                                    message: "文件类型错误，请选择Excel文件上传！"
                                });
                            } else {
                                if(this.importAction.isMultiple) {
                                    this.files.push({file: file, result: '', errors: []});
                                } else {
                                    this.$set(this.files, 0, {file: file, result: '', errors: []});
                                }
                            }
                            break;
                        case '':
                            if(this.importAction.isMultiple) {
                                this.files.push({file: file, result: '', errors: []});
                            } else {
                                this.$set(this.files, 0, {file: file, result: '', errors: []});
                            }
                            break;
                    }*/
                });
                //手动清掉input value
                this.$refs.file.value = '';
            },
            close() {
                this.files = [];
                this.errors = [];
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            importAction: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>