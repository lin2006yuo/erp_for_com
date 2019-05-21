<template>
    <page class="p-queue">
        <el-row :gutter="8">
            <el-col :span="19">
                <el-input v-model="searchKey" placeholder="搜索队列。。。"></el-input>
                <el-tabs v-model="activeName">
                    <el-tab-pane v-for="item in tabPane"
                                 :key="item.value"
                                 :label="item.label"
                                 :name="item.value">
                    </el-tab-pane>
                </el-tabs>
                <queue-panel
                        :all-data="panelData"
                        :loading="loading"
                        :types="types"
                        @look-detail="lookDetail"
                        @refresh="renovate"
                        @operations="operations"
                        @clear="clear"
                        @edit="edit"></queue-panel>
            </el-col>
            <el-col :span="5">
                <el-button type="primary" size="mini" class="mb-xs"
                           @click.native="open_task">
                    <i :class="buttonLoading?'el-icon-loading':''" ></i> 队列
                </el-button>
                <el-card class="queue-right-card">
                    <el-table :data="rightData"
                              border
                              align="center">
                        <el-table-column label="类型"
                                         prop="hosttype"
                                         width="70">
                        </el-table-column>
                        <el-table-column :render-header="render_header">
                            <template slot-scope="scope">
                                {{scope.row.taskUsed}}/{{scope.row.taskMax}}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <span class="operate" @click="update_task(scope.row)">
                                     <i :class="scope.row.loading?'el-icon-loading':''" ></i>
                                    更新</span>
                                <span class="ml-mini mr-mini">|</span>
                                <span :class="[scope.row.items.length?'':'disabled','operate']"
                                      @click="get_detail(scope.row,)">详情</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <operation-log v-model="operationLogShow"
                       :title="logTitle"
                       :log-key="logKey">
        </operation-log>
        <element-detail v-model="elementShow"
                        :title="consumingTitle"
                        :consuming="elementArr"
                        :loading="elementLoading"
                        :is-refresh="isRefresh"
                        @fresh="get_detail(tempData)"
                        @close="close_element">
        </element-detail>
        <add-queue v-model="addShow"
                   :uninstall-queue="uninstallQueue"
                   @fresh="get_table_list('carrier')">
        </add-queue>
        <look-detail v-model="lookDetailShow"
                     :title="lookDetailTitle"
                     :look-detail="lookDetailData">
        </look-detail>
        <edit-table v-model="editMoudel"
                    :title="title"
                    :edit-data="editData"
                    @queue_edit="edit_table">
        </edit-table>
    </page>
</template>

<style lang="stylus" >
</style>

<script>
    import {api_get_queue_label,api_get,api_status,api_clear,api_elements,api_get_queue_consuming,
        api_get_queue_type,api_queue_list,api_queue_edit} from '@/api/queue';
    import addQueue from './add-queue';
    import lookDetail from './look-detail';
    import PinYin from '@/lib/pinyin/cn';
    export default {
        name: "index",
        data() {
            return {
                tabPane:[],
                loading:false,
                activeName:'',
                operationLogShow:false,
                logTitle:'',
                logKey:'',
                elementShow:false,
                consumingTitle:'',
                elementArr:[],
                elementLoading:false,
                isRefresh:'table',
                tempData:{},
                types:[],
                rightData:[],
                addShow:false,
                uninstallQueue:[],
                buttonLoading:false,
                lookDetailShow:false,
                lookDetailTitle:'',
                lookDetailData:[],
                searchKey:'',
                editMoudel:false,
                title:'',
                editData:{},
                tempIndex:''
            }
        },
        mounted() {
            this.tempIndex='';
            this.init();
        },
        methods: {
            init(){
                this.$http(api_get_queue_label).then(res=>{
                    this.tabPane = Object.keys(res).map(value =>{
                        return {
                            label:res[value],
                            value:value,
                            data: []
                        }
                    });
                    this.activeName = this.tabPane[0].value;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
                this.$http(api_get_queue_type).then(res=>{
                    this.types = res.map(row=>{
                        return {label:row.hosttype,value:row.hosttype}
                    });
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
                this.$http(api_status).then(res=>{
                    this.rightData = res.filter(row=>({}.toString.call(row)==='[object Object]'));
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            lookDetail({title, data}){
                this.lookDetailData =data;
                this.lookDetailTitle = title;
                this.lookDetailShow = true;
            },
            get_table_list(name, force = false){
                let pane = this.tabPane.find(row => row.value === name);
                if(pane){
                    if(pane.data.length > 0 && !force){
                        return;
                    }
                    this.loading=true;
                    this.$http(api_get,name).then(res=>{
                        pane.data = [...res.commons,...res.swooles].map(row =>{
                            row.previous_status = JSON.parse(JSON.stringify(row.hosttype));
                            return row;
                        });
                        this.loading=false
                    }).catch( error =>{
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }
            },
            edit(row,index){
                this.title = `编辑：${row.desc}`;
                this.editData = {
                    queuer:row.key,
                    consumer:row.maxTask,
                    priority:row.priority,
                    run_times:row.run_times,
                    fail_times:row.fail_times,
                };
                this.tempIndex=index;
                this.editMoudel = true;
            },
            edit_table(obj){
                this.get_table_list(this.activeName,true);
                // let pane = this.tabPane.find(row => row.value === this.activeName);
                // if(pane){
                //     this.$set(pane.data[this.tempIndex],'maxTask',obj.consumer);
                //     // this.$set(pane.data[this.tempIndex],'maxTask',obj.consumer);
                //     // this.$set(pane.data[this.tempIndex],'maxTask',obj.consumer);
                //     // this.$set(pane.data[this.tempIndex],'maxTask',obj.consumer);
                // }
            },
            open_task(){
                this.buttonLoading=true;
                this.$http(api_queue_list).then(res=>{
                    this.uninstallQueue=res.queues;
                    this.buttonLoading=false;
                    this.addShow=true;
                }).catch( error =>{
                    this.buttonLoading=false;
                    this.addShow=false;
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            render_header(){
                return <span title="正在使用的任务数/任务总数">进程数</span>
            },
            update_task(row){
                let data=row?row.hosttype:'';
                if(row){
                    if(row.loading)return;
                    this.$set(row,'loading',true);
                }
                this.$http(api_status,{hosttype:data}).then(res=>{
                    if(row){
                        this.$set(row,'taskMax',res[0].taskMax);
                        this.$set(row,'taskUsed',res[0].taskUsed);
                        this.$set(row,'items',res[0].items);
                        this.$set(row,'loading',false);
                    }else{
                        this.rightData=res;
                    }
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            tab_click(tab,event){
                this.get_table_list(tab.name);
            },
            renovate(row){
                if(row.loading)return;
                this.$set(row,'loading',true);
                this.$http(api_elements,row.key).then(res=>{
                    this.$set(row,'elements',res);
                    row.loading = false;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            operations(row){
                this.logTitle=`队列-${row.key}-的日志`;
                this.logKey=row.key;
                this.operationLogShow=true;
            },
            clear(row){
                this.$prompt(`您将清空${row.key},确认此操作吗？`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showInput:false
                }).then(({ value }) => {
                    this.$http(api_clear, row.key).then(res=>{
                        this.$message({type:'success',message:'清空成功!'});
                        this.renovate(row);
                    }).catch(code=>{
                        this.$message({type:'error',message:code.message||code})
                    })
                }).catch(() => {});
            },
            look_over(row,str){
                this.tempData=row;
                this.get_detail(this.tempData,str);
            },
            get_detail(row,string){
                // if(string==='all'){
                //     this.elementLoading=true;
                //     this.$http(api_get_queue_consuming,{key:row.key}).then(res=>{
                //         console.log(res,12213);
                //         this.consumingTitle=`当前Task：${row.key} 类型：${row.hosttype}正在消费的消息`;
                //         this.elementArr=res.message;
                //         this.elementLoading=false;
                //         this.isRefresh='table';
                //         this.elementShow=true;
                //     }).catch( error =>{
                //         error&&this.$message({type:'error', message:error.message||error});
                //     });
                // }else{
                    if(!row.items.length)return;
                    this.consumingTitle=row.hosttype;
                    this.elementArr=row.items;
                    this.elementLoading=false;
                    this.isRefresh='detail';
                    this.elementShow=true;
                // }
            },
            close_element(){
                this.elementShow=false;
                this.tempData='';
                this.consumingTitle='';
                this.elementArr=[];
            }
        },
        computed:{
            panel(){
                return this.tabPane.find(row => row.value === this.activeName)
            },
            panelData(){
                if(this.panel){
                    if(this.searchKey){
                        const b = Date.now();
                        let ret = this.pinyin.query(this.searchKey);
                        return ret;
                    }else{
                        return this.panel.data;
                    }
                }else{
                    return [];
                }
            },
            pinyin(){
                return new PinYin(this.panel.data, ['name', 'desc', 'key']);
            }
        },
        watch:{
            activeName(active){
                this.get_table_list(active);
            }
        },
        components: {
            queuePanel:require('./all-table').default,
            operationLog:require('./operation-log').default,
            elementDetail:require('./element-detail').default,
            addQueue,
            lookDetail,
            editTable:require('./edit-table').default,
        },
    }
</script>

