<template>
    <page-dialog :title="title" v-model="formVisible"
                 @open="open"
                 @close="close"
                 size="small"
                 :close-on-click-modal="false">
        <el-form :model="formData"
                 ref="formData"
                 :rules="rules"
                 label-width="120px">
            <el-form-item label="code：" prop="code">
                <el-col :span="20">
                    <el-input v-model="formData.code" :maxlength="20"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="软件名：" prop="software_name">
                <el-col :span="20">
                    <super-select
                            :disabled="!editCode"
                            v-model="formData.software_name"
                            :storage-key="`channelsoftwareName`"
                            :options="softwareList">
                    </super-select>
                </el-col>
            </el-form-item>

            <el-form-item label="客户端版本：" prop="version">
                <el-col :span="20">
                    <el-input v-model="formData.version"></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="运行环境：" prop="run_environment">
                <el-col :span="20">
                    <el-select v-model="formData.run_environment">
                        <el-option
                                :key="item.value"
                                v-for="item in typeOptions"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>

            <el-form-item label="md5：">
                <el-col :span="20">
                    <el-input v-model="formData.md5"></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="备注：" prop="remark">
                <el-col :span="20">
                    <el-input type="textarea" v-model="formData.remark" :rows="3"></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="状态：" prop="status">
                <el-col :span="20">
                    <el-select v-model="formData.status">
                        <el-option
                                v-for="item in statusList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="上传文件：" required>
                <el-col :span="20">
                    <span v-if="fileList.length === 0">{{formData.upgrade_address}}</span>
                    <file-upload
                            :thumbnail-mode="true"
                            label="选择文件"
                            class="mt-mini mb-mini"
                            :multiple="false"
                            ref="fileUpload"
                            :image="{width:'100px',height:'100px'}"
                            @handle-change="file_change"
                            :init="fileList"></file-upload>
                    <span class="ml-sm red" v-if="fileList.length === 0 && formData.upgrade_address === ''">只支持上传zip格式的文件</span>
                </el-col>
            </el-form-item>

            <el-form-item label="上传进度：" v-show="uploadShow">
                <el-col :span="20">
                    <span>{{process}}</span>
                </el-col>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="confirm" type="primary"  :disabled="uploadShow">确定</el-button>
            <el-button size="mini" @click.native="formVisible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    export default{
        data(){
            return {
                formVisible:false,
                fileList:[],
                statusList:[
                    {label:'已启用',value:0},
                    {label:'已停用',value:1},
                ],
                rules: {
                    code: [{required: true,  message: "code为必填项", trigger: "blur change"}],
                    software_name: [{required: true, message: "软件名为必填项", trigger: "blur change", type:'number'}],
                    version: [{required: true, message: "客户端版本为必填项", trigger: "blur change"}],
                    run_environment: [{required: true, message: "运行环境为必填项", trigger: "blur change", type:'number'}],
                    remark: [{required: true, message: "备注为必填项", trigger: "blur change"}],
                    status: [{required: true, message: "状态为必填项", trigger: "blur change", type:'number'}],
                }
            }
        },
        methods:{
            open(){
                this.fileList = []
            },
            close(){
                Object.keys(this.formData).forEach(key=>{
                    this.formData[key] = "";
                });
            },
            confirm(){
                this.$refs.formData.validate((valid)=>{
                    if(valid){
                        if(this.fileList.length === 0 && this.formData.upgrade_address === ''){
                            this.$message({type: 'warning', message: '请选择文件'});
                        }else{
                            let data = {
                                version: this.formData.version,
                                run_environment: this.formData.run_environment,
                                remark: this.formData.remark,
                                md5: this.formData.md5,
                                status: this.formData.status,
                                code:this.formData.code,
                                software_name:this.formData.software_name,
                                id: this.formData.id
                            };
                            if(!this.fileList.length){
                                this.$set(data,'file',this.formData.upgrade_address);
                            }else {
                                this.$set(data,'file',this.fileList);
                            }
                            this.$emit('add',data, "add")
                        }
                    }else{
                        console.log(1111);
                    }
                });
            },
            file_change(images){
                this.fileList = images;
            },
        },
        filters:{

        },
        watch:{
            formVisible(val){
                this.$emit('input',val)
            },
            value(val){
                this.formVisible=val;
            },
        },
        props:{
            title:{},
            value: {},
            formData:{},
            typeOptions: {},
            softwareList: {},
            editCode:{},
            uploadShow:{},
            process:{},
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
            // fileUpload: require('./file-upload').default
            fileUpload: require('./file-upload2').default
        }
    }
</script>
