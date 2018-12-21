<template>
    <page-dialog class="p-import-excel" title="excel导入" v-model="visible" size="large" :close-on-click-modal="false">
        <div>
            <div class="file-btn">
                请选择要导入的Excel文件
                <input type="file" ref="file" multiple @change="file_change">
            </div>
            <div class="file-btn ml-sm inline" style="width: 120px;" @click="download_file">
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
                    <ul v-if="file.errors.length > 0"  class="error">
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
            <request-button
                req-key="apiAdd"
                @click="upload"
                :disabled="files.length<=0"
                v-loading.fullscreen.lock="fullscreenLoading"
                element-loading-text="正在上传请稍后...">
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
        width: 190px;
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
                margin-top: 5px;
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
    import {api_warehouse_goods_init,api_warehouse_goods_purchase_in} from '@/api/local';
    import {downloadFile} from '@/lib/http';

    export default {
        data() {
            return {
                visible: false,
                fullscreenLoading: false,
                errors:[],
                files:[],
                file_url:'下载导入模板',
                file:`downfile`,
                code:''
            }
        },
        methods: {
            remove(file){
                const index = this.files.indexOf(file);
                this.files.splice(index,1);
//                console.log(this.$refs.file.files)
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
                        this.$reqKey(`apiAdd`, false);
                    };
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey(`apiAdd`, false);
                    },200);
                });
            },
            submit(file, data) {
                const index = this.files.indexOfFun(f=>f.file === file);
                if(this.importType===1){
                    this.$http(api_warehouse_goods_init, data).then(res => {
                        this.fullscreenLoading = false;
                        if(res.fail_num === 0){
                            this.$message({
                                type: 'success',
                                message: `导入文件成功!`
                            });
                            this.files[index].result = `导入文件成功!`;
                            this.visible=false;
                        }else{
                            if(res.fail_message){
                                this.files[index].result = "导入有失败！";
                                this.files[index].errors = res.fail_message;
                            }
                        }
                        this.$emit('files-data',res.data);
                    }).catch(code => {
                        this.fullscreenLoading = false;
                        this.files[index].result = "导入有失败！";
                        let error = [];
                        error.push(code.message);
                        this.files[index].errors = error;
                    });
                }else{
                	this.$set(data,'warehouse_id',this.warehouseId);
//                	console.log('this.warehouse_id',this.warehouseId);
                    this.$http(api_warehouse_goods_purchase_in, data).then(res => {
                        this.fullscreenLoading = false;
                        if(res.fail_num === 0){
                            this.$message({
                                type: 'success',
                                message: `导入文件成功!`
                            });
                            this.files[index].result = `导入文件成功!`;
                            this.visible=false;
                        }else{
                            if(res.fail_message){
                                this.files[index].result = "导入有失败！";
                                this.files[index].errors = res.fail_message;
                            }
                        }
                        this.$emit('files-data',res.data);
                    }).catch(code => {
                        this.fullscreenLoading = false;
                        this.files[index].result = "导入有失败！";
                        let error = [];
                        error.push(code.message);
                        this.files[index].errors = error;
                    });
                }

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
                    code:this.code
                };
                downloadFile({
                    url:url,
                    get:code,
                    fileName:this.file_url,
                    suffix:'.xlsx',
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
            },
            importType(val){
            	if(val===1){
                    this.file_url = '导入期初库存模板';
                    this.code = 'warehouse_goods_init';
                }else{
                    this.file_url = '导入采购库存模板';
                    this.code = 'warehouse_goods_purchase';
                }
            }
        },
        props: {
            value: {},
            importType: {},
            warehouseId: {},
        },
        components: {
            RequestButton: require('@/global-components/request-button').default,
            pageDialog: require('@/components/page-dialog.vue').default
        }
    }
</script>

