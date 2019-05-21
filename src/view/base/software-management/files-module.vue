<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="addData"
                 label-width="140px"
                 ref="addData"
                 :rules="rules"
                 class="c-company-info">
            <el-form-item label="code："  prop="code">
                <el-col :span="20">
                    <el-input v-model="addData.code" :maxlength="20"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="软件名："  prop="software_name">
                <el-col :span="20">
                    <super-select
                            disabled
                            v-model="addData.software_name"
                            :storage-key="`channelsoftwareName`"
                            :options="softwareList">
                    </super-select>
                </el-col>
            </el-form-item>
            <el-form-item label="客户端版本："  prop="version">
                <el-col :span="20">
                    <el-input v-model="addData.version"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="运行环境："  prop="run_environment">
                <el-col :span="20">
                    <el-select v-model="addData.run_environment">
                        <el-option
                             v-for="item in typeOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="md5：">
                <el-col :span="20">
                    <el-input v-model="addData.md5"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="备注："  prop="remark">
                <el-input
                        type="textarea"
                        :rows="3"
                        v-model="addData.remark" style="width: 300px;">
                </el-input>
            </el-form-item>
            <el-form-item label="状态："  prop="status">
                <el-col :span="20">
                    <el-select v-model="addData.status">
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

            <el-form-item label="上传进度：" v-show="uploadShow">
                <el-col :span="20">
                    <span>{{process}}</span>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">确定</el-button>
            <el-button size="mini" @click.native="show=false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_post_software_version} from '@/api/software-management';
    export default{
        data(){
            return{
                show:this.value,
                status:["启用","停用"],
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
            
            },
            keep(){
                this.$refs.addData.validate((valid)=>{
                    if(valid){
                        if(this.fileList.length === 0){
                            this.$message({type: 'warning', message: '请选择文件'});
                        }else{
                            let data = {
                                version: this.addData.version,
                                run_environment: this.addData.run_environment,
                                remark: this.addData.remark,
                                md5: this.addData.md5,
                                status: this.addData.status,
                                code:this.addData.code,
                                software_name:this.addData.software_name,
                                file: this.fileList,
                                id: this.addData.id,
                            };
                            this.$emit('release', data, "release");
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
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            addData:{},
            typeOptions: {
                required:true,
                type:Array
            },
            title:{},
            softwareList:{},
            uploadShow:{},
            process:{},
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            fileUpload: require('./file-upload2').default
        }
    }
</script>
