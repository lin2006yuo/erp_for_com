<template>
    <div>
        <el-table
                v-resize="{height:10}"
                class="swoolqueue-data-table"
                :data="calucQueues" empty-text="没有定义或使用队列">
            <el-table-column label="名称" inline-template>
            <span :title="row.desc">{{row.name}}
                <span v-if="row.run" :title="row.run" class="btn">RUN</span>
            </span>
            </el-table-column>
            <el-table-column label="作者" property="author" width="80">
            </el-table-column>
            <el-table-column label="消费者" property="maxTask" width="50">
            </el-table-column>
            <el-table-column label="优先级(<)" property="priority" width="60">
            </el-table-column>
            <el-table-column label="执行器" inline-template width="100">
                <div class="tasks">
                <span class="btn"
                      v-for="(task,i) in row.tasks"
                      :key="task.time"
                      title="点击可以关闭该执行器"
                      @click="stop(row,task)"
                >{{1+i}}号</span>
                </div>
            </el-table-column>
            <el-table-column label="队列" inline-template>
                <div class="tasks" title="点击查看所有元素" @click="showDetail(row)">
                    <span v-for="(element,i) in row.elements"
                          :key="i"
                          :class="[element.count ? 'fail' : '']"
                    >{{element.element}}</span>
                </div>
            </el-table-column>
            <el-table-column label="操作" inline-template>
            <span>
                <el-switch :key="row.key"
                           :value="row.status"
                           on-text="启用"
                           off-text="停止"
                           @input="status(row)"
                ></el-switch>
                <span class="btn" @click="reloadElement(row)">刷新
                    <i :class="row.loading ? 'el-icon-loading':''" ></i>
                </span>
                <span class="btn" @click="seeLog(row)">日志</span>
                <span class="btn" @click="clear(row)">清空</span>
            </span>
            </el-table-column>
        </el-table>
        <page-dialog v-model="showDetailDialog"
                     :title="dialogTitle"
        >
            <div class="top-tasks">
                    <span v-for="(element,i) in detail.elements"
                          :key="element.element"
                          :title="element.count?`失败${element.count}次`:''"
                          :class="element.count ? 'fail' : ''"
                    >
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
    </div>
</template>
<style lang="stylus">
    .swoolqueue-data-table{
        .tasks{
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
</style>
<script>

    import {api_get, api_change_status, api_clear, api_logs, api_elements} from '../../../api/queue';
    export default{
        data(){
            return{
                serverQueues:[],
                showDetailDialog: false,
                showLogDialog: false,
                detail: {elements: []},
                logs: {key:'',title:'', logs: [], loading: false}
            }
        },
        mounted(){
            this.init();
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
        methods:{
            init(){
                this.$http(api_get).then(res => {
                    this.serverQueues = res.swooles;
                })
            },
            clearFails(){

            },
            clearFail(element){

            },
            showDetail(row) {
                this.detail = row;
                this.showDetailDialog = true;
            },
            seeLog(row) {
                this.logs.title = `队列-${row.key}-的日志`;
                this.logs.key = row.key;
                this.request_log(row.key);
                this.showLogDialog = true;
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
            stop(row, task){

            },
            status(row){
                const statusName = row.status ? "暂停执行" : '继续执行';
                this.$confirm(`是否确认${row.name} ${statusName}队列`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_change_status, {queuer:row.key,status:!(row.status)}).then(res=>{
                        row.status = !row.status;
                    }).catch(code =>{
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    })
                }).catch(() => {

                });
            },
        },
        computed:{
            queues(){
                return [...this.serverQueues];
            },
            dialogTitle() {
                return `${this.detail.key} 队列所有元素（${this.detail.elements.length}个）`
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
                    const task = runTasks.find(function(task){
                        return task.task === queue.key;
                    });
                    if(task){
                        queue.run = new Date(task.time * 1000);
                    }
                    return queue;
                })
            }
        },
        props:{
            runTasks:{}
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default
        }
    }
</script>