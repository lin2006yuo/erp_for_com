<template>
    <div>
        <el-table class="queue-data-table"
                  v-resize="{height:10}"
                  :data="calucQueues" empty-text="没有定义或使用队列">
            <el-table-column align="left" label="Key" property="key" width="220">
            </el-table-column>
            <el-table-column align="left" label="名称" inline-template>
                <span :title="row.desc">
                    <span v-if="row.run" :title="row.run" @click="showRuner(row)" class="btn">RUN</span>
                    {{row.name}}
                </span>
            </el-table-column>
            <el-table-column label="作者" property="author" width="80">
            </el-table-column>
            <el-table-column label="类型" property="type" inline-template width="150">
                <div>
                    <el-select class="width-md"
                               v-model="row.runtype"
                               filterable
                               clearable
                               @change="change_type(row,$event)"
                               placeholder="请选择">
                        <el-option
                                v-for="item in types"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-table-column>
            <el-table-column label="队列" inline-template>
                <div class="tasks" title="点击查看所有元素" @click="showDetail(row)">
                    <span v-for="(element,i) in row.elements"
                          :key="i"
                          :class="element.count ? 'fail' : ''"
                    >{{element.element}}</span>
                </div>
            </el-table-column>
            <el-table-column label="操作" inline-template width="240">
            <span>
                <span class="btn" @click="reloadElement(row)">刷新
                    <i :class="row.loading ? 'el-icon-loading':''"></i>
                </span>
                <span class="btn" @click="seeLog(row)">日志</span>
                <span class="btn" :disabled="(!row.timers) || (row.timers.length <= 0)" @click="timerElements(row)">定时</span>
                <span class="btn" @click="clear(row)">清空</span>
                 <span class="btn" @click="$emit('look',row)">查看</span>
            </span>
            </el-table-column>
        </el-table>
        <page-dialog v-model="showDetailDialog"
                     width="50%"
                     :title="dialogTitle">
            <div class="top-tasks">
                    <span v-for="(element,i) in detail.elements"
                          :key="i"
                          :title="detailTitle(element)"
                          :class="[element.count ? 'fail' : '','task-span']">
                        <i class="el-icon-close" title="删除当前元素" @click="del(element)"></i>
                        {{element.element}}
                        <span class="btn" v-if="element.count" @click="clearFail(element.element)">清错</span>
                    </span>
            </div>
            <span slot="footer" v-if="detailFailCount">
                <el-button size="mini" type="warning" @click.native="clearFails()">清掉错误元素次数</el-button>
            </span>
        </page-dialog>
        <page-dialog v-model="showLogDialog" size="large"
                     :title="getLogTitle"
        >
            <el-table :data="getLogs" v-loading="logs.loading">
                <el-table-column label="时间" inline-template width="140">
                    <span>{{row.t | fmsdatetime}}</span>
                </el-table-column>
                <el-table-column label="元素" inline-template>
                    <span>{{row.e}}</span>
                </el-table-column>
                <el-table-column label="类型" inline-template width="60">
                    <span>{{row.c | type}}</span>
                </el-table-column>
                <el-table-column label="结果" inline-template>
                    <span>{{row.r}}</span>
                </el-table-column>
            </el-table>
            <span slot="footer">
                <el-button @click.native="request_log()" size="mini" type="primary">刷新</el-button>
                <el-button @click.native="showLogDialog=false" size="mini">关闭</el-button>
            </span>
        </page-dialog>
        <page-dialog v-model="showTimeDialog" size="large"
                     :title="timeDialogTitle"
        >
            <div>
                <table class="template">
                    <tr>
                        <th>元素</th>
                        <th>执行时间</th>
                    </tr>
                    <tr v-for="(t, k) in timer" :key="k">
                        <td>{{t.element}}</td>
                        <td>{{t.timer|fmsdatetime}}</td>
                    </tr>
                </table>
            </div>
            <span slot="footer">
                <el-button @click.native="showTimeDialog=false" size="mini">关闭</el-button>
            </span>
        </page-dialog>
        <page-dialog v-model="runerShow" size="large"
                     :title="`队列${runner.key}存在正在处理队列的Task`"
        >
            <div>
                <table class="template">
                    <tr>
                        <th>WorkerID</th>
                        <th>开始时间</th>
                        <th>操作</th>
                    </tr>
                    <tr v-for="(t, k) in runner.timers" :key="k">
                        <td>{{t.workerId}}</td>
                        <td>{{t.timer|fmsdatetime}}</td>
                        <td><el-button type="danger"
                                       @click.native="forceKill(runner.key, t.workerId)">强制关闭</el-button></td>
                    </tr>
                </table>
            </div>
            <span slot="footer">
            </span>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .queue-data-table {
        .tasks {
            vertical-align: middle;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
                margin-left: 5px;
                padding: 2px;
                border: 1px dashed #f0f0f0;
            }
            span:nth-child(even) {
                color: #0000ff
            }
            span:nth-child(odd) {
                color: #2ba9bc
            }
        }
    }
    .top-tasks {
        min-height: 200px;
        span {
            display: inline-block;
            margin-left: 5px;
            padding: 2px 5px;
            border: 1px dashed #d7cbcb;
        }
        span.task-span{
            position :relative;
            i{
                display :none;
            }
            &:hover{
                i{
                    display :inline-block;
                    position :absolute;
                    right :0;
                    top:0;
                    font-size :12px;
                    &:hover{
                        cursor :pointer;
                        color :red;
                    }
                }
            }
        }
        span:nth-child(even) {
            color: #0000ff
        }
        span:nth-child(odd) {
            color: #2ba9bc
        }
        span.fail{
            color: red;
        }
    }
</style>
<script>
    import {api_get, api_force_task, api_elements, api_clear_fail_tag,
        api_clear, api_logs,api_get_queue_type,api_change_queue_type,api_del_remove_element,} from '../../../api/queue';
    export default {
        data() {
            return {
                runner:{},
                // queues: [],
                showDetailDialog: false,
                runerShow: false,
                showTimeDialog: false,
                showLogDialog: false,
                detail: {key:'',elements: [], timers:[]},
                logs: {key:'',title:'', logs: [], loading: false},
                types:[],
            }
        },
        filters: {
            type(type) {
                switch (type) {
                    case 0:
                        return '成功';
                    case 1:
                        return '失败';
                    case 2:
                        return '异常';
                    case 3:
                        return '错误';
                }
            },
        },
        mounted() {
            // this.init();
            this.get_type();
        },
        methods: {
            get_type(){
                this.$http(api_get_queue_type).then(res=>{
                    console.log(res,12213,'类型');
                    this.types=res;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            change_type(row,type){
                this.$confirm('此操作将更改当前类型, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_change_queue_type,{queuer:row.key,runtype:type}).then(res=>{
                        this.$message({type:'success', message:res.message||res});
                    }).catch( error =>{
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }).catch(() => {
                    this.$message({type: 'info',message: '已取消操作'});
                });
            },
            del(row){
                console.log(this.detail.elements,row,'www');
                this.$confirm('此操作将删除当前元素, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_del_remove_element,{
                        key:this.detail.key,
                        element:row.element
                    }).then(res=>{
                        this.$message({type:'success', message:res.message||res});
                        let index;
                        if(row.count){
                            index = this.detail.elements.findIndex(item=>(item.element===row.element)&&!!row.count);
                        }else{
                            index = this.detail.elements.findIndex(item=>item.element===row.element);
                        }
                        this.detail.elements.splice(index,1);
                    }).catch( error =>{
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }).catch(() => {
                    this.$message({type: 'info',message: '已取消操作'});
                });
            },
            showRuner(row){
                this.runner = row;
                this.runerShow = true;
            },
            forceKill(key, workerId){
                this.$http(api_force_task, key, workerId).then(res =>{
                    this.$message(res.message);
                }).catch(code =>{
                    this.$message({message:code.message,type:'error'});
                })
            },
            detailTitle(element){
                const fail = element.count?`失败:${element.count}次`:'';
                return `当前乘下数:${element.remain};${fail}`;
            },
            clearFails(){
                this.$http(api_clear_fail_tag, row.key).then(res=>{
                    this.$message(res.message);
                }).catch(code =>{
                    this.$message({message:code.message,type:'error'});
                })
            },
            clearFail(element){
                this.$http(api_clear_fail_tag, row.key, element).then(res=>{
                    this.$message(res.message);
                }).catch(code =>{
                    this.$message({message:code.message,type:'error'});
                })
            },
            showDetail(row) {
                console.log(row,'test deatao');
                this.detail={key:'',elements: [], timers:[]};
                this.detail = row;
                this.showDetailDialog = true;
            },
            seeLog(row) {
                this.logs.title = `队列-${row.key}-的日志`;
                this.logs.key = row.key;
                this.request_log(row.key);
                this.showLogDialog = true;
            },
            clear(row){
                this.$prompt(`您将清空${row.key},确认此操作吗？`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showInput:false
                }).then(({ value }) => {
                    this.$http(api_clear, row.key).then(res=>{
                        this.$message({
                            type:'success',
                            message:'清空成功!'
                        });
                        this.$http(api_elements, row.key).then(res => {
                            row.elements = res;
                            row.loading = false;
                        })
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message||code
                        })
                    })
                }).catch(() => {

                });
            },
            request_log(key){
                key = key || this.logs.key;
                this.logs.loading = true;
                this.$http(api_logs, key).then(res => {
                    this.logs.logs = res;
                    this.logs.loading = false;
                }).catch(code => {
                    this.logs.logs = [];
                    this.logs.loading = false;
                });
            },
            reloadElement(row) {
                if (row.loading) {
                    return;
                }
                this.$set(row, 'loading', true);
                this.$http(api_elements, row.key).then(res => {
                    row.elements = res;
                    row.loading = false;
                })
            },
            timerElements(row){
                this.detail = row;
                this.showTimeDialog = true;
            }
        },
        computed: {
            timer(){
                return this.detail.timers;
            },
            dialogTitle() {
                return `${this.detail.key} 队列所有元素（${this.detail.elements.length}/${this.detail.length}个）`
            },
            timeDialogTitle(){
                return `${this.detail.key} 队列定时元素（${this.detail.timers.length}个）`
            },
            detailFailCount(){
                return this.detail.elements.filter(e=>e.count).length;
            },
            getLogs() {
                return this.logs.logs;
            },
            getLogTitle(){
                return this.logs.title;
            },
            calucQueues(){
                const runTasks = this.runTasks || [];
                return this.queues.map(queue=>{
                    const tasks = runTasks.filter((task)=>{
                        return task.task === queue.key;
                    });
                    if(tasks.length > 0){
                        queue.timers = tasks;
                        queue.run = tasks.map(task =>{
                            let date = new Date(task.time * 1000);
                            date = `${date.getDate()}/${date.getMonth()+1} ${date.getHours()}:${date.getMinutes()}:${date.getUTCSeconds()}`;
                            return `${task.workerId} => ${date}`;
                        }).join('');
                    }
                    return queue;
                });
            }
        },
        props:{
            runTasks:{},
            queues:{}
        },
    }
</script>