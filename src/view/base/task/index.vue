<template>
    <page>
        <el-card class="mb-xs">
            <label-buttons label="状态：" :buttons="condition" @select="select_handles" class="inline mr-sm"></label-buttons>
            <label-item label="搜索：" class="inline">
                <el-select v-model="filterKey"  class="width-sm">
                    <el-option v-for="filter in filters"
                               :label="filter.label"
                               :value="filter.value"
                               :key="filter.value">
                    </el-option>
                </el-select>
            </label-item>
            <el-input class="inline" v-model="filterVal" icon="search"></el-input>
        </el-card>
        <el-row class="mb-xs mt-xs ml-sm">
            <permission tag="ElButton" @click.native="process = true;"
                        size="mini" type="primary"  :route="apis.url_worker_schedulers">进度</permission>
            <permission tag="requestButton"  :request="init" :route="apis.url_get">刷新</permission>
            <permission tag="requestButton" @click.native="reload" type="warning"  :route="apis.url_reload">
                Reload
                <span>最后刷新时间：{{reload_time | ftime}}</span>
            </permission>
        </el-row>
        <worker-form @reload="init()" :worker="worker" v-model="showForm" @edit-update="edit_update"></worker-form>
        <worker-logs :worker="worker" v-model="showLogs"></worker-logs>
        <process v-model="process"></process>
        <exp-tasks v-if="showExpTasks" v-model="showExpTasks" :exp-tasks="expTasks"></exp-tasks>
        <global-tasks v-model="global" :tasks="tasksClass"></global-tasks>
        <synchronous v-model="synchronousShow"></synchronous>
        <task-table  :tasks="filterTasks"
                     :first-loading="firstLoading"
                     @worker-edit="worker_edit"
                    @worker-logs="worker_logs"
                     ref="taskTable"
                    @create="create">
        </task-table>
    </page>
</template>
<style lang="stylus">

</style>
<script>

    import {api_get,api_reload,api_synchronous,url_get,url_worker_schedulers,url_add_global_task,url_synchronous,url_reload} from '../../../api/task';
    export default{
        permission: {
            url_get,url_worker_schedulers,url_add_global_task,url_synchronous,url_reload
        },
        page:{},
        refresh(){
          this.init();
        },
        data(){
            return{
                firstLoading:true,
                condition:[
                    {name:'全部',value:0},
                    {name:'未执行',value:1},
                    {name:'等待执行',value:2},
                    {name:'正在执行',value:3},
                    {name:'任务结束',value:4},
                ],
                showFinish:true,
                showForm:false,
                showLogs:false,
                process:false,
                global:false,
                synchronousShow:false,
                showExpTasks:false,
                reload_time:'',
                worker:{},
                tasks:[],
                expTasks:[
                ],
                filterKey:1,
                filters:[
                    {label:'任务名',value:1},
                    {label:'任务类',value:2},
                    {label:'任务描述',value:3},
                    {label:'任务作者',value:4},
                ],
                filterVal:"",
                status:''
            }
        },
        filters:{
            ftime(val){
                if(val){
                    return fdatetime(val * 1000);
                }else{
                    return ""
                }
            }
        },
        mounted(){
            this.init();
        },

        methods:{
            edit_update(){
                this.init();
            },
            init_status_btn(){
                let curBtn = this.condition;
                this.condition = [];
                this.$nextTick(()=>{
                    this.condition = curBtn;
                })
            },
            select_handles(val, item){
                this.status = item.value;
            },
            create(task){
                this.worker = {
                    id:0,
                    task_id:task.id,
                    title:"新建任务：" + task.name
                };
                this.showForm = true;
            },
            worker_edit(task, worker){
                this.worker = {
                    id:worker.id,
                    title:"编辑任务："+task.name+"-"+worker.name
                };
                this.showForm = true;
            },
            worker_logs(task, worker){
                this.worker = {
                    id:worker.id,
                    run_time:worker.run_tag,
                    title:`日志信息：${task.name}-（${worker.id}）${worker.name}`
                };
                this.showLogs = true;
            },
            reload(){
                return this.$http(api_reload).then(res=>{
                    this.reload_time = res.message;
                })
            },
            init(){
                this.$refs.taskTable.Loading = true;
                return this.$http(api_get).then(res=>{
                    res.tasks.forEach(row=>{
                        row.status=row.status==='true'?true:false
                    })
                    this.tasks = res.tasks;
                    this.expTasks = res.expTasks;
                    this.reload_time = res.last_reload;
                    this.$refs.taskTable.Loading = false;
                    this.$forceUpdate();
                    this.firstLoading = false;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                    this.$refs.taskTable.Loading = false;
                });
            }
        },
        computed:{
            tasksClass(){
                return this.tasks.map(task=>{
                    let cloneTask = clone(task);
                    delete cloneTask.workers;
                    return cloneTask;
                })
            },
            filterTasks(){
                return this.filterTasks_.map(task =>{
                    let taskClone = clone(task);
                    taskClone.workers = taskClone.workers.filter(worker =>{
                        if(this.status){
                            return worker.run_status === this.status;
                        }else{
                            return true;
                        }
                    });
                    return taskClone;
                });

            },
            filterTasks_(){
                let ret = [];
                switch (this.filterKey){
                    case 1:
                        const num = parseInt(this.filterVal);
                        this.tasks.forEach(task=>{
                            let cloneTask = clone(task);
                            if(cloneTask.name.indexOf(this.filterVal)>=0){
                                return ret.push(cloneTask);
                            }
                            let workers = cloneTask.workers.filter(worker=>{
                                let status = worker.name.indexOf(this.filterVal)>=0
                                    || worker.id === num;
                                return status;
                            });
                            if(workers.length > 0){
                                cloneTask.workers = workers;
                                ret.push(cloneTask);
                            }
                        });
                        return ret;
                        break;
                    case 2:
                        this.tasks.forEach(task=>{
//                            let cloneTask = clone(task);
                            let cloneTask = task;
                            if(cloneTask.id.indexOf(this.filterVal)>=0){
                                return ret.push(cloneTask);
                            }
                        });
                        return ret;
                        break;
                    case 3:
                        this.tasks.forEach(task=>{
//                            let cloneTask = clone(task);
                            let cloneTask = task;
                            if(cloneTask.desc.indexOf(this.filterVal)>=0){
                                return ret.push(cloneTask);
                            }
                        });
                        return ret;
                    case 4:
                        this.tasks.forEach(task=>{
//                            let cloneTask = clone(task);
                            let cloneTask = task;
                            if(cloneTask.creator.indexOf(this.filterVal)>=0){
                                return ret.push(cloneTask);
                            }
                        });
                        return ret;
                    default:
                        break;
                }
            }
        },
        watch:{
        },
        components:{
            taskList:require('./task-list.vue').default,
            workerForm:require('./worker-form.vue').default,
            workerLogs:require('./worker-logs.vue').default,
            process:require('./process.vue').default,
            expTasks:require('./exp-tasks.vue').default,
            synchronous:require('./synchronous.vue').default,
            globalTasks:require('./global-tasks.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            taskTable:require('./task-table.vue').default,
            labelButtons:require('../../../components/label-all-buttons.vue').default,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>
