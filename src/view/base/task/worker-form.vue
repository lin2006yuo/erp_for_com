<template>
    <page-dialog size="large" v-model="show" @open="open" :title="title">
        <el-row>
            <el-col :span="16" :offset="2">
                <el-form label-width="120px">
                    <el-form-item label="任务名：" required>
                        <el-input v-model="name"  placeholder="任务名长度不能小于6"
                        ></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="10" :offset="10">
                            <el-form-item label="进程模式：" required>
                                <el-radio-group class="inline" v-model="mode">
                                    <el-radio :label="1" :value="1">永远</el-radio>
                                    <el-radio :label="2" :value="2">临时</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="任务状态：" required>
                                <el-switch v-model="status"
                                           on-text="启用" off-text="停用"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-col>
        </el-row>
        <label-panel label="时间设置" :padding="{paddingLeft:'25px',paddingRight:'25px'}">
            <el-form label-width="80px">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="开始时间：" required>
                            <el-date-picker
                                    class="date"
                                    v-model="begin"
                                    type="datetime"
                                    :picker-options="start_date"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间：" required>
                            <el-date-picker
                                    class="date"
                                    v-model="end"
                                    type="datetime"
                                    :picker-options="end_date"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <loop-form :loop_type.sync="loop_type"
                                   :loop_value.sync="loop_value"
                                   :max_count.sync="max_count"
                        >
                        </loop-form>
                    </el-col>
                </el-row>
            </el-form>
        </label-panel>
        <label-panel label="参数设置">
            <param-setting :rules="rules" :param="param"></param-setting>
        </label-panel>
        <span slot="footer">
            <request-button v-if="isModify" req-key='workerFormModify' @click="modify">
                保存
            </request-button>
            <request-button req-key='workerFormSave' v-else @click="save">
                添加
            </request-button>
            <el-button @click.native="cancel" size="mini">
                取消
            </el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    import {api_rules, api_worker_get, api_worker_new, api_worker_mdf} from '../../../api/task';
    export default{
        data(){
            return{
                show:false,
                loop_type:0,
                loop_value:0,
                name:'',
                mode:1,
                status:false,
                begin:'',
                end:'',
                max_count:0,
                rules:{},
                param:{},
                start_date:{
                    disabledDate:(time)=>{
                        if(this.end){
                            return  time.getTime() >= this.end;
                        }else {
                            return false
                        }
                    }
                },
                end_date:{
                    disabledDate:(time)=>{
                        if(this.begin){
                            return  time.getTime() <= this.begin;
                        }else {
                            return false
                        }
                    }
                }
            }
        },
        methods:{
            open(){
                if(this.worker.id){
                    this.$http(api_worker_get, this.worker.id).then(res=>{
                        this.loop_value = parseInt(res.loop_value);
                        this.name = res.name;
                        this.mode = parseInt(res.mode);
                        this.status = !!res.status;
                        this.loop_type= parseInt(res.loop_type);
                        this.max_count = parseInt(res.max_count);
                        this.param = res.param;
                        this.begin = new Date(res.begin * 1000);
                        this.end = new Date(res.end * 1000);
                        this.init_rule(res.task_id);
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        });
                    });
                }else{
                    this.clear();
                    this.init_rule(this.worker.task_id);
                }
            },
            clear(){
                this.loop_value = 0;
                this.name = '';
                this.mode = 1;
                this.status = false;
                this.begin = '';
                this.end = '';
                this.loop_type = 0;
                this.max_count = 0;
                this.param = {};
            },
            save(){
                if(!this.begin || !this.end){
                    this.$reqKey('workerFormSave',false);
                    return this.$message({
                        type:'error',
                        message:"必需设置任务时间"
                    });
                }
                let params = {
                    loop_value:this.loop_value,
                    loop_type:this.loop_type,
                    max_count:this.max_count,
                    name:this.name,
                    mode:this.mode,
                    status:this.status,
                    begin:timeformat(this.begin),
                    end:timeformat(this.end),
                    param:this.param
                };
                this.$http(api_worker_new, this.worker.task_id, params).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message||res
                    });
                    this.$emit('reload');
                    this.show = false;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('workerFormSave', false);
                    }, 300)
                })
            },
            modify(){
                if(!this.begin || !this.end){
                    this.$reqKey('workerFormModify', false);
                    return this.$message({
                        type:'error',
                        message:"必需设置任务时间"
                    });
                }
                let params = {
                    loop_value:this.loop_value,
                    loop_type:this.loop_type,
                    max_count:this.max_count,
                    name:this.name,
                    mode:this.mode,
                    status:this.status,
                    begin:timeformat(this.begin),
                    end:timeformat(this.end),
                    param:this.param
                };
                this.$http(api_worker_mdf, this.worker.id, params).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message || res
                    });
                    this.$emit('edit-update');
                    this.show = false;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('workerFormModify', false);
                    }, 300)
                })
            },
            cancel(){
                this.show = false;
            },
            init_rule(taskid){
                this.$http(api_rules, taskid).then(res=>{
                    this.rules = res;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                });
            }
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input', val);
            }
        },
        computed:{
            title(){
                return this.worker.title;
            },
            isModify(){
                return !!this.worker.id;
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            worker:{
                required:true,
                type:Object
            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default,
            labelPanel:require('../../../components/label-panel.vue').default,
            paramSetting:require('./param-setting.vue').default,
            loopForm:require('./loop-form.vue').default,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>
