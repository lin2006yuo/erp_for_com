<style lang="stylus">
    .task2{
        .ui-table-body{
            .template.secTable{
                /*border-collapse:separate;*/
                tr.task ~ tr:not(.task) + tr{
                    color: #2d4f4b;
                }
                .task.status{
                    border-top:2px solid rgba(41, 137, 188, 0.5)!important;
                }
            .task.status:nth-of-type(1){
                border-top:none!important;
            }
                /*tr.task + tr.task{*/
                    /*td{*/
                        /*!*border-bottom:2px solid #2989bc !important;*!*/
                    /*}*/
                /*}*/
            }
        }
    }
</style>
<script>
    import {api_status, api_worker_remove, api_worker_status,url_worker_get,url_status,url_worker_status,url_worker_mdf,url_worker_logs,url_worker_remove} from '../../../api/task';
    import {loop_type_label, loop_type_value} from './task-const';
    const options=[
        {dom(createElement, worker, task, action){
            return createElement('span', {key:`${worker.id}-${worker.status}`, class:['operate','mr-sm'],on:{
                click:()=>{action.call(this,task, worker)}
            }}, worker.status ? '停用' : '启用')
        },api:url_worker_status, action(task, worker){
            this.change_worker_status(task, worker)
        }},
        {dom(createElement, worker, task, action){
            return createElement('span', {key:`${worker.id}-${worker.status}`, class:['operate','mr-sm'],on:{
                click:()=>{action.call(this,task, worker)}
            }}, '编辑')
        },api:url_worker_mdf,action(task, worker){
            this.change_worker_edit(task, worker)
        }},
        {dom(createElement, worker, task, action){
            return createElement('span', {key:`${worker.id}-${worker.status}`, class:['operate','mr-sm'],on:{
                click:()=>{action.call(this,task, worker)}
            }}, '详情')
        },api:url_worker_logs,  action(task, worker){
            this.change_worker_info(task, worker)
        }},
        {dom(createElement, worker, task, action){
            return createElement('span', {key:`${worker.id}-${worker.status}`, class:['operate','mr-sm'],on:{
                click:()=>{action.call(this,task, worker)}
            }}, '移除')
        }, api:url_worker_remove, action(task, worker){
            this.change_worker_remove(task, worker)
        }},
    ];
    export default{
        name:'task-list',
        permission: {
            url_worker_get,
            url_worker_status,
            url_worker_mdf,url_worker_logs,
            url_worker_remove,
            url_status
        },
        data(){
            return {
                heads:[
                    {label:"任务名称",colspan:1,width:14.2858},
                    {label:"任务描述",colspan:2,width:14.2857},
                    {label:"任务作者",colspan:2,width:14.2857},
                    {label:"操作",colspan:2,width:14.2857}
                ]
            }
        },
        methods:{
            change_status(task){
                this.$http(api_status, task.id, {status:!task.status}).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message||res
                    });
                    task.status = !task.status;
                    this.$forceUpdate();
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                });
            },
            create(task){
                this.$emit('create', task);
            },
            change_worker_status(task, worker){
                const status = !worker.status;
                this.$http(api_worker_status, worker.id, status).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message || res
                    });
                    worker.status = status;
                    this.$forceUpdate();
                }).catch(code=>{
                    worker.status = !worker.status;
                    this.$message({
                        type:'error',
                        message: code.message || code
                    });
                })
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
        components: {
            uiSwitch: require('../../../components/ui-switch'),
            uiTableBody:require('../../../components/ui-table-body.vue').default,
        },
        props: {
            tasks: {
                required: true,
                type: Array
            },
            showFinish:{
                required:true,
                type:Boolean
            }
        },
        render(createElement){
            let tr = (task) =>{
                let operate = [];
                if(task.status) {
                    let add="";
                    if(this.$hasPermission(url_worker_mdf)){
                        add=createElement('span', {class:['operate','mr-sm'],on:{
                            click:()=>{this.create(task)}
                        }}, "新增")
                    }
                    operate.push(add);
                }
                let rowspan = task.workers.length > 0 ? task.workers.length+2 : 1;
                let statu="";
                if(this.$hasPermission(url_status)){
                    statu=createElement('span', {class:['operate','mr-sm'],on:{
                        click:()=>{this.change_status(task)}
                    }}, task.status ? '停用' : '启用')
                }
                let tds = [
                    createElement('td', {attrs:{rowspan:rowspan}}, task.name),
                    createElement('td', {attrs:{colspan:2}}, task.desc),
                    createElement('td', {attrs:{colspan:2}}, task.creator),
                    createElement('td', {class:['t-left'],attrs:{colspan:2}}, [statu , ...operate])];
                if(task.workers.length > 0){
                    let workerhead = createElement('tr',{},[
                        createElement('th',{},"（ID）名称"),
                        createElement('th',{},"时间参数"),
                        createElement('th',{attrs:{colspan:2}},"开启-结束(时间)"),
//                        createElement('th',{},"触发条件"),
                        createElement('th',{},"启停状态 / 运行状态"),
                        createElement('th',{},"操作"),
                    ]);
                    let workersbody = [];
                    task.workers.forEach(worker=>{
                        let run_status = "";
                        switch (worker.run_status){
                            case 0:
                                run_status = "未开始";
                                break;
                            case 1:
                                run_status = "正在执行";
                                break;
                            case 2:
                                run_status = "执行完毕";
                                break;
                            case 3:
                                run_status = "准备下一次执行";
                                break;
                            case 4:
                                run_status = "结束";
                                if(!this.showFinish){
                                    return;
                                }
                                break;
                            default:
                                run_status = `未定义的状态${worker.run_status}`;
                                break;
                        }
                        let operatings=options.filter(row=>{
                            return this.$hasPermission(row.api)
                        });
                        let operate=operatings.map(row =>row.dom.call(this, createElement, worker, task, row.action));
                        let workertds = [
                            createElement('td', {}, `（${worker.id}）${worker.name}`),
                            createElement('td', {}, timeparam(worker)),
                            createElement('td', {attrs:{colspan:2}}, datef('YYYY-M-dd HH:mm:ss',worker.begin) + "至" + datef('YYYY-M-dd HH:mm:ss',worker.end)),
//                            createElement('td', {}, worker.trigger),
                            createElement('td', {}, (worker.status ? '已启用' : '已停用') + " / "+ run_status),
                            createElement('td', {class:['t-left'],attrs:{colspan:2}}, [...operate])
                        ];
                        if(!worker.id){
                            console.log(worker);
                        }
                        workersbody.push(createElement('tr',{key:worker.id},workertds));
                    });
                    if(workersbody.length > 0){
                        return [createElement('tr', {key:task.id, class:['task', task.status ? 'status':'']},tds), workerhead, ...workersbody];
                    }else{
                        return  createElement('tr', {key:task.id, class:['task', task.status ? 'status':'']},tds)
                    }
                }else{
                    return  createElement('tr', {class:['task', task.status ? 'status':'']},tds)
                }


            };
            let trs = this.tasks.map(task=>tr(task));                                                                                                                                57
            return createElement('ui-table-body',{props:{heads:this.heads},class:['task2']},trs);
        }
    }

    function timeparam(worker){
        const label = loop_type_label(worker.loop_type);
        const value = loop_type_value(worker.loop_type, worker.loop_value);
        return `${label}:${value}`;
    }
</script>
