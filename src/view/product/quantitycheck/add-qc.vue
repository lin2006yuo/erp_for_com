<template>
    <el-row class="p-add-qc">
        <page-dialog :title="titleName" v-model="dialogVisible" size="small">
            <el-form :model="qcForm" ref="qcForm" :rules="rules" label-width="100px">
                <el-form-item label="质检项名称：" prop="name">
                    <el-col :span="10">
                        <el-input v-model="qcForm.name" auto-complete="off" v-if="isEdit"></el-input>
                        <div v-else>{{qcForm.name}}</div>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检类型：" prop="type">
                    <el-col :span="10">
                        <el-select v-model="qcForm.type">
                            <el-option v-for="type in types" :key="type.value" :label="type.label" :value="type.value"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检内容：" prop="content">
                    <el-col :span="16">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 6}"
                                placeholder="请输入质检内容"
                                v-model="qcForm.content" v-if="isEdit">
                        </el-input>
                        <div v-else>{{qcForm.content}}</div>
                    </el-col>
                </el-form-item>
                <el-form-item label="质检排序：">
                    <el-col :span="3">
                        <el-input v-model="qcForm.sort" auto-complete="off" v-if="isEdit"></el-input>
                        <div v-else>{{qcForm.sort}}</div>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div v-if="isEdit" style="display: inline;">
                    <el-button size="mini" type="primary" @click.native="confirm" :disabled="isSave" v-if="markId==0">保存</el-button>
                    <el-button size="mini" type="primary" @click.native="edit_confirm" :disabled="isSave" v-else>保存</el-button>
                </div>
                <el-button size="mini" @click.native="dialogVisible=false">取 消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .el-dragger{
        width: 100px;
        height:100px;
    }
</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue'
    import {api_qc_data,api_add,api_delete,api_edit,api_update} from '../../../api/qc';
    export default{
        data(){
            return {
                dialogVisible:false,
                rules:{
                    name:[
                        { required: true, message: '名称不能为空', trigger: 'blur' }
                    ],
                    type:[
                        { required: true, message: '质检类型为必填项', trigger: 'blur' }
                    ],
                    content:[
                        { required: true, message: '质检内容不能为空', trigger: 'blur' }
                    ]
                },
                types:[
                    {label:'无',value:0},
                    {label:'单选',value:1},
                    {label:'多选',value:2},
                ],
            }
        },
        methods:{
            confirm(){//-----------保存
                this.$http(api_add,this.qcForm).then(res=>{
                    this.$message({
                        type:"success",
                        message:`${res.message}`
                    });
                    this.dialogVisible=false;
                    this.$emit("reload");
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:`${code}`
                    });
                    return
                })
            },
            //-----------------------------------------------更新
            edit_confirm(){
                this.$http(api_update,this.markId,this.qcForm).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message
                    });
                    this.dialogVisible=false;
                    this.$emit("reload");
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code,
                    })
                    return
                })
            },
        },
        computed:{
            isSave(){
                if(this.qcForm.name && this.qcForm.type && this.qcForm.content){
                    return false;
                }else{
                    return true;
                }
            }
        },
        watch:{
            dialogVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialogVisible = val;
            },
        },
        props:{
            value:{},
            qcForm:{
                required:true,
                type:Object
            },
            markId:{
                required:true,
                type:Number
            },
            isEdit:{
                required:true,
                type:Boolean
            },
            titleName:{
                required:true,
                type:String
            }
        },
        components: {
            pageDialog
        }
    }
</script>