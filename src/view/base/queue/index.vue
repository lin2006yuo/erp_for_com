<template>
    <page class="p-queue over-flow-auto">
        <el-row :gutter="8">
            <el-col :span="18">
                <el-tabs :active-name="ququeActiveName">
                    <el-tab-pane name="swoole" label="Swoole队列">
                        <data-table :run-tasks="runTasks"></data-table>
                    </el-tab-pane>
                    <el-tab-pane name="all" label="所有队列数据">
                        <queue-table :run-tasks="runTasks"></queue-table>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :span="6">
                <el-card class="block-header">
                    <div slot="header">参数/状态</div>
                    <div>
                        <label-item label-width="80" label="Task:">
                            <div>
                                {{taskUsed}}/{{taskMax}}
                                <span class="btn" @click="queueStatus">更新</span>
                                <span class="btn" @click="setQueueStatus">详情</span>
                            </div>
                        </label-item>
                        <el-tabs :active-name="activeName">
                            <el-tab-pane name="workers" label="当前队列">
                                <workers @throw-worker="throw_worker"></workers>
                            </el-tab-pane>
                            <el-tab-pane name="log" label="本次历史">
                                <worker-log log="logs"></worker-log>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <page-dialog v-model="detailShow">
            <div>
                <table class="template">
                    <tr>
                        <th>WorkerID</th>
                        <th>TaskID</th>
                        <th>开始时间</th>
                        <th>操作</th>
                    </tr>
                    <tr v-for="(t, k) in runTasks" :key="k">
                        <td>{{t.workerId}}</td>
                        <td>{{t.task}}</td>
                        <td>{{t.time|fmsdatetime}}</td>
                        <td>
                            <el-button type="danger"
                                       @click.native="forceKill(t.task, t.workerId)">强制关闭
                            </el-button>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer">
            </span>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .block-header{
        margin-top :33px;
    }
</style>
<script>

    import {api_status, api_force_task} from '../../../api/queue';

    export default {
        data() {
            return {
                taskUsed: 1,
                taskMax: 10,
                detailShow: false,
                logs: [],
                activeName: 'workers',
                ququeActiveName: 'swoole',
                runTasks: []
            }
        },
        page: {},
        refresh() {
            this.init();
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.queueStatus();
            },
            forceKill(key, workerId){
                this.$http(api_force_task, key, workerId).then(res =>{
                    this.$message(res.message);
                }).catch(code =>{
                    this.$message({message:code.message,type:'error'});
                })
            },
            setQueueStatus() {
                this.detailShow = true;
            },
            queueStatus() {
                this.$http(api_status).then(res => {
                    this.taskUsed = res.taskUsed;
                    this.taskMax = res.taskMax;
                    this.runTasks = res.items;
                })
            },
            throw_worker(worker) {
                this.logs.push(worker);
            },
            send() {
            },
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
            dataTable: require('./data-table.vue').default,
            queueTable: require('./queue-table.vue').default,
            workers: require('./workers.vue').default,
            workerLog: require('./worker-log.vue').default,
            labelItem: require('../../../components/label-item.vue').default
        }
    }
</script>
