<template>
    <page class="p-queue over-flow-auto">
        <el-row :gutter="8">
            <el-col :span="18">
                <el-tabs :active-name="ququeActiveName">
                    <el-tab-pane name="swoole" label="Swoole队列">
                        <data-table :run-tasks="runTasks"
                                    :server-queues="serverQueues"
                                    @look="look_at"></data-table>
                    </el-tab-pane>
                    <el-tab-pane name="all" label="所有队列数据">
                        <queue-table :run-tasks="runTasks"
                                     :queues="queues"
                        @look="look_at"></queue-table>
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
        <page-dialog v-model="detailShow" width="70%" class="c-queue-detail-dialog">
            <el-table class="c-queue-detail-table"
                      :data="runTasks"
                      empty-text="没有正在使用的队列">
                <el-table-column label="TaskID"
                                 property="pname"
                                 width="70">
                </el-table-column>
                <el-table-column label="PID"
                                 property="pid"
                                 width="50">
                </el-table-column>
                <el-table-column label="Task"
                                 property="task">
                </el-table-column>
                <el-table-column label="开始时间"
                                 width="150"
                                 inline-template>
                    <div>{{row.time|fmsdatetime}}</div>
                </el-table-column>
                <el-table-column label="正在消费"
                                 inline-template>
                    <div class="tasks" title="点击查看所有元素" @click="all_detail(row,row.consuming)">
                        <span v-for="(element,i) in row.consuming"
                              :key="i">{{element}}</span>
                    </div>
                </el-table-column>
                <el-table-column label="操作"
                                 inline-template
                                 width="90">
                    <div>
                        <el-button type="danger"
                                   @click.native="forceKill(row.task,row.workerId)">强制关闭
                        </el-button>
                    </div>
                </el-table-column>
            </el-table>
            <span slot="footer">
                <el-button @click.native="detailShow=false">取消</el-button>
            </span>
        </page-dialog>
        <page-dialog v-model="consumingShow" width="70%" :title="consumingTitle">
            <div class="top-tasks">
                <span v-for="(item,index) in consuming"
                      :key="index">
                   {{item}}
                </span>
            </div>
            <div slot="footer">
                <!--<el-button size="mini" @click.native="fresh">刷新</el-button>-->
                <el-button @click.native="close_consuming" size="mini">关闭</el-button>
            </div>
        </page-dialog>
        <element-detail v-model="elementShow"
                        :title="consumingTitle"
                        :consuming="elementArr"
                        :loading="elementLoading"
                        @fresh="refresh_"
                        @close="close_element">
        </element-detail>
    </page>
</template>
<style lang="stylus">
    .block-header{
        margin-top :33px;
    }
    .c-queue-detail-dialog{
        .c-queue-detail-table{
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
    }
    .top-tasks {
        min-height: 200px;
        span {
            display: inline-block;
            margin-left: 5px;
            padding: 2px 5px;
            border: 1px dashed #d7cbcb;
        }
        span:nth-child(even) {
            color: #0000ff
        }
        span:nth-child(odd) {
            color: #2ba9bc
        }
    }
</style>
<script>
    import elementDetail from './element-detail';
    import {init_element} from './common';
    import {api_status, api_force_task,api_get,api_get_queue_consuming} from '../../../api/queue';
    export default {
        data() {
            return {
                taskUsed: 1,
                taskMax: 10,
                detailShow: false,
                logs: [],
                activeName: 'workers',
                ququeActiveName: 'swoole',
                runTasks: [],
                serverQueues:[],
                queues:[],
                consumingShow:false,
                consuming:[],
                param:'',
                elementShow:false,
                consumingTitle:'',
                elementArr:[],
                temp:'',
                elementLoading:false,
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
            look_at(row){
                console.log(row,'test');
                this.temp=row.key;
                init_element(this,row.key);
            },
            refresh_(){
                init_element(this,this.temp);
            },
            close_element(){
                this.elementShow=false;
                this.temp='';
                this.consumingTitle='';
                this.elementArr=[]
            },
            init() {
                this.queueStatus();
                this.init_list();
            },
            init_list(){
                this.$http(api_get).then(res => {
                    console.log(res,'current');
                    this.serverQueues = res.swooles;
                    this.queues = [...res.swooles, ...res.commons];
                })
            },
            forceKill(key, workerId){
                this.$http(api_force_task, key, workerId).then(res =>{
                    this.$message({type:'success',message:res.message||res});
                    // this.$message(res.message);
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
            all_detail(row,arr){
                this.consumingTitle=`当前Task：${row.task}正在消费的消息`;
                this.consuming=arr;
                this.param=row.task;
                this.consumingShow=true;
            },
            fresh(){
                this.$http(api_get_queue_consuming,{key:this.param}).then(res=>{
                    this.consuming=res.message;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            close_consuming(){
                this.consumingShow=false;
                this.consuming=[];
                this.param='';
            }
        },
        components: {
            dataTable: require('./data-table.vue').default,
            queueTable: require('./queue-table.vue').default,
            workers: require('./workers.vue').default,
            workerLog: require('./worker-log.vue').default,
            labelItem: require('../../../components/label-item.vue').default,
            elementDetail
        }
    }
</script>
