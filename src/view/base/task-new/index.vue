<template>
    <div>
        <el-card>
            <label-item label="搜索：" class="inline ml-sm">
                <el-select v-model="searchData.filterKey"  class="width-sm">
                    <el-option v-for="filter in filters"
                               :label="filter.label"
                               :value="filter.value"
                               :key="filter.value">
                    </el-option>
                </el-select>
                <el-input class="inline" icon="search" clearable
                          v-model="searchData.filterVal">
                </el-input>
            </label-item>
        </el-card>
        <el-row class="mt-xs mb-xs ml-sm">
            <permission tag="ElButton"
                        @click.native="processShow = true"
                        size="mini"
                        type="primary"
                        :route="apis.url_worker_schedulers">进度
            </permission>
            <el-button size="mini" type="primary"
                       class="ml-sm" @click.native="init">刷新
            </el-button>
            <permission tag="requestButton" type="warning"
                        @click.native="reload"
                        :route="apis.url_reload">Reload
                <span>最后刷新时间：{{reload_time|fmsdatetime}}</span>
            </permission>
            <el-button size="mini" type="primary"
                       @click.native="task_all">任务</el-button>
        </el-row>
        <el-table :data="filterTasks"
                  v-loading="loading"
                  element-loading-text="玩命加载中..."
                  v-resize="{height:41}"
                  empty-text="暂无任务记录"
                  @expand="expend">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <template v-if="props.row.workers&&props.row.workers.length">
                        <el-table :data="props.row.workers">
                            <el-table-column label="（ID）名称" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.id}} {{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="时间参数">
                                <template slot-scope="scope">
                                    <span>{{timeParam(scope.row)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="开始-结束（时间）">
                                <template slot-scope="scope">
                                    <span>{{scope.row.begin|fmsdatetime}} 至 {{scope.row.end|fmsdatetime}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="启用状态">
                                <template slot-scope="scope">
                                    <el-switch v-model="scope.row.status"
                                               on-text="启用"
                                               off-text="停用"
                                               @change="change_worker_status(props.row,scope.row)">
                                    </el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <span v-for="(operate,index) in operation" :key="index">
                                        <span class="operate" @click="current_operate(operate,scope.row,props.row)">{{operate.name}}</span>
                                        <span v-if="index!==(operation.length-1)">&nbsp;|&nbsp;</span>
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="任务工作器类名" prop="task_class"></el-table-column>
            <el-table-column label="任务名称" prop="name"></el-table-column>
            <el-table-column label="任务描述" prop="desc"></el-table-column>
            <el-table-column label="任务作者" prop="author"></el-table-column>
            <el-table-column label="操作" inline-template>
                <div >
                    <span class="operate" @click="change_status(row)">{{row.task_status?'停用':'启用'}}</span>
                    |
                    <span class="operate" @click="add(row)">新增</span>
                    |
                    <span class="operate" @click="uninstall(row)">卸载</span>
                </div>
            </el-table-column>
        </el-table>
        <process v-model="processShow"></process>
        <task-class v-model="taskClassShow" :loading="taskClassLoading"
                    :tasks="taskClassList" @refresh="init"></task-class>
        <worker-form @reload="init"
                     :worker="worker"
                     v-model="workerFormShow"
                     @edit-update="init">
        </worker-form>
        <worker-logs :worker="worker"
                     v-model="showLogs">
        </worker-logs>
    </div>
</template>

<script>
    import {api_get_task_list,url_worker_schedulers,url_reload,
        api_reload,api_status,api_get_task_worker,api_worker_status,
        api_worker_remove,api_get_task_classes,api_uninstall_task_class} from '@/api/task';
    import process from '@/view/base/task/process';
    import taskClass from './task-class';
    import workerForm from '@/view/base/task/worker-form';
    import {loop_type_label, loop_type_value} from '@/view/base/task/task-const';
    import workerLogs from '@/view/base/task/worker-logs';
    export default {
        name: "index",
        permission: {
            url_worker_schedulers,
            url_reload
        },
        data() {
            return {
                searchData:{
                    filterKey:1,
                    filterVal:''
                },
                filters:[
                    {label:'任务名',value:1},
                    {label:'任务类',value:2},
                    {label:'任务描述',value:3},
                    {label:'任务作者',value:4},
                ],
                tasksData:[],
                loading:false,
                processShow:false,
                reload_time:'',
                taskClassShow:false,
                taskClassLoading:false,
                taskClassList:[],
                worker:{},
                workerFormShow:false,
                operation:[
                    {name:'编辑',value:1},
                    {name:'详情',value:2},
                    {name:'移除',value:3},
                ],
                showLogs:false,
            }
        },
        mounted() {
            this.init();
        },
        computed: {
            filterTasks(){
                switch (this.searchData.filterKey){
                    case 1:
                        return this.tasksData.filter(row=>row.name.indexOf(this.searchData.filterVal)>-1);
                    case 2:
                        return this.tasksData.filter(row=>row.task_class.indexOf(this.searchData.filterVal)>-1);
                    case 3:
                        return this.tasksData.filter(row=>row.desc.indexOf(this.searchData.filterVal)>-1);
                    case 4:
                        return this.tasksData.filter(row=>row.author.indexOf(this.searchData.filterVal)>-1);
                }
            },
        },
        methods: {
            task_all(){
                this.taskClassLoading=true;
                this.$http(api_get_task_classes).then(res=>{
                    this.taskClassList=res.tasks;
                    this.taskClassShow=true;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                }).finally(()=>{
                    this.taskClassLoading=false;
                });
            },
            init(){
                this.loading=true;
                this.$http(api_get_task_list).then(res=>{
                    console.log(`当前任务列表`,res);
                    res.tasks.forEach(row=>{
                        if(row.name===null)this.$set(row,'name','');
                        if(row.task_class===null)this.$set(row,'task_class','');
                        if(row.desc===null)this.$set(row,'desc','');
                        if(row.desc===null)this.$set(row,'author','');
                        if(row.task_status==='false'){
                            row.task_status=false;
                        }else if(row.task_status==='true'){
                            row.task_status=true;
                        }
                    });
                    this.tasksData=res.tasks;
                    this.reload_time = res.last_reload;
                    this.loading=false;
                }).catch( error =>{
                    this.loading=false;
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            reload(){
                return this.$http(api_reload).then(res=>{
                    this.reload_time = res.message;
                })
            },
            change_status(row){
                console.log(row,'test');
                this.$confirm(`您将${row.task_status?"停用":"启用"}该任务, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_status, row.task_class,{status: !row.task_status}).then(res => {
                        this.$message({type: 'success',message: res.message || res});
                        row.task_status = !row.task_status;
                        this.init();
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code})
                    })
                }).catch(() => {
                    this.$message({ type: 'info',message: '已取消'});
                });
            },
            add(row){
                this.worker = {
                    id:0,
                    task_id:row.task_class,
                    title:"新建任务：" + row.name
                };
                this.workerFormShow = true;
            },
            expend(row, expandedRows){
                if(expandedRows){
                    if(row.workers&&row.workers.length)return;
                    this.$http(api_get_task_worker,row.task_class).then(res=>{
                        this.$set(row,'workers',res);
                    }).catch( error =>{
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }
            },
            uninstall(row){
                this.$http(api_uninstall_task_class,row.task_class).then(res=>{
                    let index = this.tasksData.findIndex(find=>find.task_class===row.task_class);
                    this.tasksData.splice(index,1);
                    this.$message({type:'success', message:res.message||res});
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            timeParam(worker){
                const label = loop_type_label(worker.loop_type);
                const value = loop_type_value(worker.loop_type, worker.loop_value);
                return `${label}:${value}`;
            },
            change_worker_status(row,worker){
                this.$confirm(`您将修改该任务状态, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    this.$http(api_worker_status, worker.id, worker.status).then(res=>{
                        this.$forceUpdate();
                        this.$message({type:'success',message:res.message || res});
                    }).catch(code=>{
                        worker.status = !worker.status;
                        this.$message({type:'error',message: code.message || code});
                    })
                }).catch(() => {
                    worker.status=!worker.status;
                    this.$message({type:'info',message:'已取消'});
                });
            },
            current_operate(operate,worker,row){
                switch (operate.value){
                    case 1://编辑
                        this.change_worker_edit(worker,row);
                        break;
                    case 2://详情
                        this.change_worker_detail(worker,row);
                        break;
                    case 3://移除
                        this.change_worker_remove(worker,row);
                        break;
                }
            },
            change_worker_edit(worker,row){
                this.worker = {
                    id:worker.id,
                    title:"编辑任务："+row.name+"-"+worker.name
                };
                this.workerFormShow = true;
            },
            change_worker_detail(worker,row){
                this.worker = {
                    id:worker.id,
                    run_time:worker.run_tag,
                    title:`日志信息：${row.name}-（${worker.id}）${worker.name}`
                };
                this.showLogs = true;
            },
            change_worker_remove(worker,row){
                if(worker.deleted_at > 0){
                    this.$message({type:'error',message:'任务已移除'});
                    return;
                }
                this.$confirm('您将移除该任务, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_worker_remove, worker.id).then(res=>{
                        let index = row.workers.findIndex(item=>item===worker);
                        row.workers.splice(index, 1);
                        this.$message({type:'success',message: res.message || res});
                    }).catch(code=>{
                        this.$message({type:'error',message:code.message || code})
                    })
                }).catch(() => {
                    this.$message({type: 'info',message: '已取消移除'});
                });
            }
        },
        components: {
            labelButtons:require('@/components/label-buttons').default,
            labelItem:require('@/components/label-item').default,
            requestButton:require('@/global-components/request-button').default,
            process,
            taskClass,
            workerForm,
            workerLogs
        },
    }
</script>

