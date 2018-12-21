<template>
    <page-dialog title="添加软件" v-model="formVisible"
                 @open="open"
                 size="small"
                 :close-on-click-modal="false">
        <el-form :model="formData"
                 ref="formData"
                 label-width="120px">
            <el-form-item label="客户端版本：" required>
                <el-col :span="20">
                    <el-input v-model="formData.version"></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="软件类型：" required>
                <el-col :span="20">
                    <el-select v-model="formData.software_type">
                        <el-option
                                :key="item.value"
                                v-for="item in typeOptions"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>

            <el-form-item label="更新地址：">
                <el-col :span="20">
                    <el-input v-model="formData.upgrade_address"></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="md5：">
                <el-col :span="20">
                    <el-input v-model="formData.md5"></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="备注：" required>
                <el-col :span="20">
                    <el-input type="textarea" v-model="formData.remark" :rows="3"></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="状态：" required>
                <el-col :span="20">
                    <el-switch v-model="formData.status"
                               on-text="启用"
                               on-color="#20a0ff"
                               off-text="停用"
                               off-color="#C0CCDA">
                    </el-switch>
                </el-col>
            </el-form-item>
            <el-form-item label="上传文件：" required>
                <el-col :span="20">
                    <file-upload
                            :thumbnail-mode="true"
                            label="选择文件"
                            class="mt-mini mb-mini"
                            :multiple="false"
                            ref="fileUpload"
                            :image="{width:'100px',height:'100px'}"
                            @handle-change="file_change"
                            :init="fileList"></file-upload>
                    <span class="ml-sm red" v-if="fileList.length === 0">只支持上传zip格式的文件</span>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="confirm" type="primary">确定</el-button>
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
                formData: {},
                typeOptions: [
                    {label: '账号app', value: 0},
                    {label: '打印软件', value: 1},
                    {label: '服务软件', value: 2},
                ],
                fileList:[]
            }
        },
        methods:{
            open(){
                this.formData = {
                    version: '',
                    software_type: '',
                    upgrade_address: '',
                    remark: '',
                    md5: '',
                    status: true,
                    doc: ''
                };
                this.fileList = []
            },
            confirm(){
                if(this.formData.version === ''||this.formData.software_type === ''||this.formData.remark === ''||this.fileList.length === 0){
                    console.log(this.fileList.length);
                    console.log(this.formData);
                    this.$message({type: 'warning', message: '请填写必填项'});
                }else{
                    let data = {
                        version: this.formData.version,
                        software_type: this.formData.software_type,
                        upgrade_address: this.formData.upgrade_address,
                        remark: this.formData.remark,
                        md5: this.formData.md5,
                        status: this.formData.status ? 0 : 1,
                        doc: this.fileList
                    };
                    this.$emit('add',data)
                }
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
            value:{}
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
            fileUpload: require('./file-upload').default
        }
    }
</script>
