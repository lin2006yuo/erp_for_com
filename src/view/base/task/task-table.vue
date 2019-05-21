<template>
    <div class="p-task-table">
        <ui-table  v-loading="Loading" :first-loading="firstLoading" element-loading-text="玩命加载中..." :has-data="tasks.length>0" :heads="heads"  :body-height="10" >
            <tbody>
            <template  v-for="item in tasks" >
                <template v-if="item.workers&&item.workers.length!==0"   v-for="(row,row_i) in item.workers" >
                    <tr>
                        <td v-if="row_i===0" :rowspan="item.workers.length"> <span :title="item.desc">{{item.name}}</span></td>
                        <td v-if="row_i===0" :rowspan="item.workers.length">{{item.creator}}</td>
                        <td v-if="row_i===0" :rowspan="item.workers.length">
                            <permission tag="span"   :route="apis.url_status" title="当前状态已启用,点击之后停用"  class='operate' v-if="item.status" @click="change_status(item)">停用</permission>
                            <permission tag="span"   :route="apis.url_status"   title="当前状态已停用,点击之后启用"  class='operate' v-if="!item.status" @click="change_status(item)">启用</permission>
                            <span  >|</span>
                            <permission tag="span"   :route="apis.url_worker_new"  title="新增任务"  class='operate' @click="create(item)">新增</permission>
                        </td>
                        <td>({{row.id}}){{row.name}}</td>
                        <td>{{timeparam(row)}}</td>
                        <td>{{row.begin|fmsdatetime}} 至 {{row.end|fmsdatetime}}</td>
                        <td>
                            <permission tag="ElSwitch"
                                        v-model="row.status"
                                        :key="row.id"
                                        on-text="启用"
                                        off-text="停用"
                                        @change="change_worker_status(item,row)" :route="apis.url_worker_status"></permission>

                        </td>
                        <td>{{row.run_status|runStatus}}</td>
                        <td >
                            <template v-for="(action,action_i) in  option">
                                <span  :key="action.name" class='operate' @click="actions(action,item,row)">{{action.name}}</span>
                                <span v-if="action_i!==(option.length-1)">&nbsp;|&nbsp;</span>
                            </template>
                           </td>
                    </tr>
                </template>
                <tr  v-if="item.workers&&item.workers.length===0">
                    <td><span :title="item.desc">{{item.name}}</span></td>
                    <td>{{item.creator}}</td>
                    <td>
                        <span class='operate' v-if="item.status" title="当前状态已启用,点击之后停用"  @click="change_status(item)">停用</span>
                        <span class='operate'v-if="!item.status" title="当前状态已停用,点击之后启用" @click="change_status(item)">启用</span>
                        <span  >|</span>
                        <span  class='operate' @click="create(item)" title="新增任务"  >新增</span>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </template>
            </tbody>
        </ui-table>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_status, api_worker_remove, api_worker_status,url_worker_get,url_status,url_worker_status,url_worker_mdf,url_worker_logs,url_worker_remove,url_worker_new} from '../../../api/task';
    import {loop_type_label, loop_type_value} from './task-const';
    const options=[
        {name:'编辑',api:url_worker_mdf,action(task,worker){
            this.change_worker_edit(task, worker)
        }},
        {name:'详情',api:url_worker_logs,action(task,worker){
            this.change_worker_info(task, worker)
        }},
        {name:'移除',api:url_worker_remove,action(task,worker){
            this.change_worker_remove(task, worker)
        }},
    ]
    export default{
        permission: {
            url_worker_get,
            url_worker_status,
            url_worker_mdf,url_worker_logs,
            url_worker_remove,
            url_status,
            url_worker_new
        },
        data(){
            return {
                Loading:false,
                heads:[
                    {label:"任务名称",width:14},
                    {label:"任务作者",width:8},
                    {label:"操作",width:8},
                    {label:"（ID）名称",width:10},
                    {label:"时间参数",width:10},
                    {label:"开始-结束（时间）",width:20},
                    {label:"启用状态",width:10},
                    {label:"运行状态",width:8},
                    {label:"操作",width:12},
                ]
            }
        },
        computed: {
            option(){
                return options.filter(row=>{
                        return this.$hasPermission(row.api)
                })
            }
        },
        methods: {
            actions(action,task,work){
                action.action.call(this,task,work)
            },
            timeparam(worker){
                const label = loop_type_label(worker.loop_type);
                const value = loop_type_value(worker.loop_type, worker.loop_value);
                return `${label}:${value}`;
            },
            change_status(task){
                this.$confirm(`您将${task.status?"停用":"启用"}该任务, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_status, task.id, {status: !task.status}).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        task.status = !task.status;
                        this.$forceUpdate();
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    })
                }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            });
                        });
            },
            create(task){
                this.$emit('create', task);
            },
            change_worker_status(task, worker){
                this.$confirm(`您将修改该任务状态, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    this.$http(api_worker_status, worker.id, worker.status).then(res=>{
                        this.$forceUpdate();
                        this.$message({
                            type:'success',
                            message:res.message || res
                        });
                    }).catch(code=>{
                        worker.status = !worker.status;
                        this.$message({
                            type:'error',
                            message: code.message || code
                        });
                    })
                }).catch(() => {
                    worker.status=!worker.status;
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            change_worker_edit(task, worker){
                this.$emit('worker-edit', task, worker);
            },
            change_worker_info(task, worker){
                this.$emit('worker-logs', task, worker);
            },
            change_worker_remove(task, worker){
                if(worker.deleted_at > 0){
                    this.$message({
                        type:'error',
                        message:'任务已移除'
                    });
                    return;
                }
                this.$confirm('您将删除该任务, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_worker_remove, worker.id).then(res=>{
                        let index = task.workers.indexOf(worker);
                        task.workers.splice(index, 1);
                        this.$message({
                            type:'success',
                            message: res.message || res
                        });
                        this.$forceUpdate();
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        filters: {
            runStatus(val){
                let run_status;
                switch (val){
                    case 0:
                        run_status= "未开始";
                        break;
                    case 1:
                        run_status= "正在执行";
                        break;
                    case 2:
                        run_status= "执行完毕";
                        break;
                    case 3:
                        run_status="准备下一次执行";
                        break;
                    case 4:
                        run_status = "结束";
//                        if(!this.showFinish){
//                            return;
//                        }
                        break;
                    default:
                        run_status = `未定义的状态${val}`;
                        break;
                }
                return  run_status
            }
        },
        watch: {},
        props: {
            tasks: {
                required: true,
                type: Array
            },
            firstLoading:{
                required:true,
                type:Boolean
            }
        },
        components: {
            uiTable:require("../../../components/ui-table.vue").default
        }
    }
</script>
