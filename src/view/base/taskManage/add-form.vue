<template>
    <page class="p-add-form">
        <page-dialog :title="titleName" v-model="addFormVisible" size="small" >
            <ui-form :model="formData" :rules="rules" ref="formData" label-width="150px" class="task-form"  localtion="right">
                <ui-form-item label="任务名称：" prop="name" :col="20">
                    <el-col :span="20" style="width:300px">
                        <el-input v-model="formData.name" ></el-input>
                    </el-col>
                </ui-form-item>
                <ui-form-item label="执行控制器：" prop="controller"  :col="20">
                    <el-col :span="20" style="width:300px">
                        <el-input v-model="formData.controller"  ></el-input>
                    </el-col>
                </ui-form-item>
                <ui-form-item label="开始执行时间：" prop="exec_time"  :col="12" required>
                    <el-col :span="12">
                        <el-date-picker class="date" type="datetime"  v-model="formData.exec_time"></el-date-picker>
                    </el-col>
                </ui-form-item>
                <ui-form-item label="执行周期：" prop="cron_time"  :col="10" required>
                    <el-col :span="8">
                        <el-input v-model="formData.cron_time"  type="number"></el-input>
                    </el-col>
                    <el-col :span="8" class="p-add-col"> 分钟</el-col>
                </ui-form-item>
                <ui-form-item label="最大执行次数："  prop="max_exec_num" :col="13">
                    <el-col :span="8">
                        <el-input v-model="formData.max_exec_num"  type="number"></el-input>
                    </el-col>
                    <el-col :span="8" class="p-add-col">(0为无限次)</el-col>
                </ui-form-item>
                <ui-form-item label="参数：">
                    <el-col :span="20" style="width:300px">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入参数..."
                                v-model="formData.args">
                        </el-input>
                    </el-col>
                </ui-form-item>
                <ui-form-item label="备注：">
                    <el-col :span="20" style="width:300px">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入内容..."
                                v-model="formData.mark">
                        </el-input>
                    </el-col>
                </ui-form-item>
            </ui-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click.native="add_submit" :disabled="isDisabled" v-if="tagId==0" >确定</el-button>
                <el-button type="primary" size="mini" @click.native="update_submit" :disabled="isDisabled" v-else>确定</el-button>
                <el-button size="mini" @click.native="addFormVisible = false">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .task-form{
        .p-add-col{
            color: red;
            margin-left: 3px;
        }
    }
</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue'
    import {task_add,task_update} from '../../../api/taskManage'
    export default{
        data(){
            var checkTime = (rule, value, callback) => {
                setTimeout(() => {
                    if (!value) {
                        callback(new Error('不能为空'));
                    }else{
                        callback();
                    }
                }, 1000);
            };
            var checkcronTime = (rule, value, callback) => {
                setTimeout(() => {
                    if (value<=0) {
                        callback(new Error('不能为负数或0'));
                    }else if(value===''){
                        callback(new Error('不能为空'));
                    } else{
                        callback();
                    }
                }, 1000);
            };
            var checkmaxNum = (rule, value, callback) => {
                setTimeout(() => {
                    if (value<0) {
                        callback(new Error('不能为负数'));
                    }else{
                        callback();
                    }
                }, 1000);
            };
            return {
                addFormVisible:this.value,
                rules:{
                    name:[
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    controller:[
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    exec_time:[
                        { validator: checkTime, trigger: 'change'}
                    ],
                    cron_time:[
                        { validator: checkcronTime, trigger: 'blur'}
                    ],
                    max_exec_num:[
                        { validator: checkmaxNum, trigger: 'blur'}
                    ]
                }
            }
        },
        methods:{
            add_submit(){//---------添加保存
                var d = new Date(this.formData.exec_time);
                this.formData.exec_time=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                console.log(this.formData.exec_time);
                this.$refs.formData.validate((valid) => {
                    if(valid){
                        this.$http(task_add,this.formData).then(res=>{
                            this.$message({type: "success", message: res.message || res})
                            this.addFormVisible = false;
                            this.$emit('submit_')
                        }).catch(code=>{
                            this.$message({message:code.message||code,type:'error'});
                        })
                    }else{
                        return false;
                    }
                });
            },
            update_submit(){//----------编辑保存
                var d = new Date(this.formData.exec_time);
                this.formData.exec_time=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                console.log(this.formData);
                this.$refs.formData.validate((valid) => {
                    if(valid){
                        this.$http(task_update,this.tagId,this.formData).then(res=>{
                            this.$message({type: "success", message: res.message || res})
                            this.addFormVisible = false;
                            this.$emit('submit_')
                        }).catch(code=>{
                            this.$message({message:code.message||code,type:'error'});
                        })
                    }else{
                        return false;
                    }
                });
            },
        },
        computed:{
            isDisabled(){//---------验证
                if(!this.formData.name){
                    return true
                }
                if(!this.formData.controller){
                    return true
                }
                if(!this.formData.exec_time){
                    return true
                }
                if(this.formData.cron_time===''){
                    return true
                }
                return false
            }
        },
        watch:{
            addFormVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.addFormVisible = val;
            }
        },
        props:{
            formData:{
                required:true,
                type:Object
            },
            tagId:{
                required:true,
                type:Number
            },
            titleName:{
                required:true,
                type:String
            },
            value: {}
        },
        components: {
            pageDialog,
            uiForm:require('../../../components/ui-form.vue').default,
            uiFormItem:require('../../../components/ui-form-item.vue').default,
        }
    }
</script>
