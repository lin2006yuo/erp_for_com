<template>
    <page-dialog size="large" v-model="show" @change="open" :title="title">
        <el-row>
            <el-col :span="16" :offset="2">
                <el-form label-width="120px">
                    <el-form-item label="任务名：" required>
                        <el-input v-model="form.name"  placeholder="任务名长度不能小于6"
                        ></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="10" :offset="10">
                            进程模式 {{form.mode}}
                            <el-form-item label="进程模式：" required>
                                <el-radio-group class="inline" v-model="form.mode">
                                    <el-radio :label="1" :value="1">永远</el-radio>
                                    <el-radio :label="2" :value="2">临时</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="任务状态：" required>
                                <el-switch v-model="form.status"
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
                                    v-model="form.begin"
                                    type="datetime"
                                    :picker-options="start_date"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间：" required>
                            <el-date-picker
                                    class="date"
                                    v-model="form.end"
                                    type="datetime"
                                    :picker-options="end_date"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <loop-form :form="form"

                        >
                            <!--:loop_type.sync="loop_type"-->
                            <!--:loop_value.sync="loop_value"-->
                            <!--:max_count.sync="max_count"-->
                        </loop-form>
                    </el-col>
                </el-row>
            </el-form>
        </label-panel>
        <!--<label-panel label="类型设置">-->
        <!--<el-card>-->
        <!--<label-item label="类型：">-->
        <!--<el-select class="width-md"-->
        <!--v-model="runtype"-->
        <!--filterable-->
        <!--clearable-->
        <!--placeholder="请选择">-->
        <!--<el-option-->
        <!--v-for="item in types"-->
        <!--:key="item.value"-->
        <!--:label="item.label"-->
        <!--:value="item.value">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</label-item>-->
        <!--</el-card>-->
        <!--</label-panel>-->
        <label-panel label="参数设置">
            <param-setting :rules="rules" :param="form.param"></param-setting>
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
                form:{
                    name:'',
                    mode:1,
                    status:false,
                    loop_type:0,
                    max_count:0,
                    begin:'',
                    end:'',
                    param:[],
                    loop_value:0
                },
                // loop_type:0,
                // loop_value:0,
                // name:'',
                // mode:1,
                // status:false,
                // begin:'',
                // end:'',
                // max_count:0,
                // param:{},
                rules:{},
                start_date:{
                    disabledDate:(time)=>{
                        if(this.form.end){
                            return  time.getTime() >= this.form.end;
                        }else {
                            return false
                        }
                    }
                },
                end_date:{
                    disabledDate:(time)=>{
                        if(this.form.begin){
                            return  time.getTime() <= this.form.begin;
                        }else {
                            return false
                        }
                    }
                },
                runtype:'',
                types:[]
            }
        },
        methods:{
            open(isOpen){
                if(isOpen){
                    if(this.worker.id){
                        this.$http(api_worker_get, this.worker.id).then(res=>{
                            this.$set(this.form,'name',res.name);
                            this.$set(this.form,'mode',parseInt(res.mode));
                            this.$set(this.form,'status',Boolean(res.status));
                            this.$set(this.form,'begin',new Date(res.begin * 1000));
                            this.$set(this.form,'end',new Date(res.end * 1000));
                            this.$set(this.form,'loop_value',parseInt(res.loop_value));
                            this.$set(this.form,'loop_type',parseInt(res.loop_type));
                            this.$set(this.form,'max_count',parseInt(res.max_count));
                            this.$set(this.form,'param',res.param);
                            this.init_rule(res.task_id);
                        }).catch(code=>{
                            this.$message({type:'error',message:code.message || code});
                        });
                    }else{
                        this.clear();
                        this.init_rule(this.worker.task_id);
                    }
                }
            },
            init_rule(taskid){
                this.$http(api_rules, taskid).then(res=>{
                    this.rules = res;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message || code});
                });
            },
            clear(){
                this.form={
                    name:'',
                    mode:1,
                    status:false,
                    loop_type:0,
                    max_count:0,
                    begin:'',
                    end:'',
                    param:{},
                    loop_value:0
                }
            },
            save(){
                if(!this.form.begin || !this.form.end){
                    this.$reqKey('workerFormSave',false);
                    return this.$message({type:'error',message:"必需设置任务时间"});
                }
                this.$http(api_worker_new, this.worker.task_id,this.params()).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.$emit('reload');
                    this.show = false;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message || code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('workerFormSave', false);
                    }, 300)
                })
            },
            params(){
                return {
                    loop_value:this.form.loop_value,
                    loop_type:this.form.loop_type,
                    max_count:this.form.max_count,
                    name:this.form.name,
                    mode:this.form.mode,
                    status:this.form.status,
                    begin:timeformat(this.form.begin),
                    end:timeformat(this.form.end),
                    param:this.form.param
                }
            },
            modify(){
                if(!this.form.begin || !this.form.end){
                    this.$reqKey('workerFormModify', false);
                    return this.$message({type:'error',message:"必需设置任务时间"});
                }
                this.$http(api_worker_mdf,this.worker.id,this.params()).then(res=>{
                    this.$message({type:'success',message:res.message || res});
                    this.$emit('edit-update');
                    this.show = false;
                }).catch(code=>{
                    this.$message({type:'error', message:code.message || code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('workerFormModify', false);
                    }, 300)
                })
            },
            cancel(){
                this.show = false;
            },
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
            // pageDialog:require('../../../components/page-dialog.vue').default,
            labelPanel:require('../../../components/label-panel.vue').default,
            paramSetting:require('./param-setting.vue').default,
            loopForm:require('./loop-form.vue').default,
            requestButton:require('../../../global-components/request-button').default,
            labelItem:require('@/components/label-item').default
        }
    }
</script>
