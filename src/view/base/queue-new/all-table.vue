<template>
    <div class="c-all-queue">
        <data-tables :data="allData" :pagination-props="{ pageSizes: [20, 50, 100] }"
                  border
                  v-resize="{height:41}"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  empty-text="没有定义或使用队列"
                  align="center">
            <el-table-column
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column align="left"
                             label="Key"
                             prop="key">
            </el-table-column>
            <el-table-column align="left"
                             label="名称">
                <template slot-scope="scope">
                    <span :title="scope.row.desc">
                        <span v-if="scope.row.length"
                              class="btn">RUN</span>
                        {{scope.row.name}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="作者"
                             prop="author"
                             width="85">
            </el-table-column>
            <el-table-column label="消费者"
                             prop="maxTask"
                             width="60">
            </el-table-column>
            <el-table-column label="优先级(<)"
                             prop="priority"
                             width="70">
            </el-table-column>
            <el-table-column label="服务器"
                             width="115">
                <template slot-scope="scope">
                    <el-select class="width-xs"
                               v-model="scope.row.hosttype"
                               filterable
                               clearable
                               @change="change_type(scope.row,$event)"
                               placeholder="请选择">
                        <el-option
                                v-for="item in types"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="队列" inline-template>
                <div class="tasks" title="点击查看所有元素" @click="show_detail(row)">
                    <!--<span v-for="(element,i) in row.elements"-->
                          <!--:class="[element.count?'fail':'']"-->
                          <!--:key="i">{{element.element}}-->
                    <!--</span>-->
                </div>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status"
                               on-text="启用"
                               off-text="停用"
                               @change="change_status(scope.row,$event)">
                    </el-switch>
                    <span class="btns">
                        <span  v-for="(item,index) in operation"
                               :key="item.value" class="btn" @click="operates(scope.row,item,scope.$index)"
                              :class="[is_disabled(scope.row,item)?'disabled':'','operate']">
                            <i v-if="item.value===0"
                               :class="scope.row.loading?'el-icon-loading':''" ></i>
                            {{item.label}}
                        </span>
                    </span>
                </template>
            </el-table-column>
        </data-tables>
        <page-dialog v-model="detailShow"
                     width="50%"
                     :title="detailTitle">
            <div class="top-tasks">
                    <span v-for="(element,i) in detail.elements"
                          :key="i"
                          :title="detail_title(element)"
                          :class="[element.count ? 'fail' : '','task-span']">
                        <i class="el-icon-close" title="删除当前元素" @click="del(element)"></i>
                        {{element.element}}
                        <!--<span class="btn" v-if="element.count" @click="clear_fails(element.element)">清错</span>-->
                    </span>
            </div>
            <span slot="footer" v-if="errorShow">
            <el-button size="mini" type="warning" @click.native="clear_fails">清掉错误元素</el-button>
            </span>
        </page-dialog>
        <page-dialog v-model="timingShow"
                     :title="timingTitle"
                     size="large">
            <el-table :data="timingData"
                      border
                      empty-text="没有正在使用的队列"
                      align="center">
                <el-table-column label="元素"
                                 prop="element">
                    <template slot-scope="scope">
                        <span>{{scope.row.element}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="执行时间"
                                 prop="timer">
                    <template slot-scope="scope">
                        <span>{{scope.row.timer|fmsdatetime}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer">
                <el-button size="mini"
                           @click.native="timingShow=false">关闭
                </el-button>
            </span>
        </page-dialog>

    </div>
</template>

<style lang="stylus">
    .c-all-queue{
        position :relative;
        .el-table__body-wrapper{
            overflow-x :hidden!important;
        }
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
    }
</style>

<script>
    import {api_change_status,api_change_queue_type,api_uninstall_task,
        api_del_remove_element,api_get_queue_consuming,api_clear_current_fail} from '@/api/queue';
    import {DataTables} from 'vue-data-tables';
    export default {
        name: "all-table",
        data() {
            return {
                addShow:false,
                uninstallQueue:[],
                operation:[
                    {label:'编辑',value:0,action(row,item,index){this.$emit('edit',row,index)}},
                    {label:'刷新',value:1,action(row){this.$emit('refresh',row)}},
                    {label:'日志',value:2,action(row){this.$emit('operations',row)}},
                    {label:'定时',value:3,action(row){
                            if(!row.timers||!row.timers.length)return;
                            this.timingTitle=`${row.key}队列定时元素(${row.timers.length}个)`;
                            this.timingData=row.timers;
                            this.timingShow=true;
                        }},
                    {label:'清空',value:4,action(row){this.$emit('clear',row)}},
                    {label:'查看',value:5,action(row){
                            this.$http(api_get_queue_consuming,{key:row.key}).then(res=>{
                                this.$emit('look-detail', {
                                    title:`查看当前Key${row.key}正在消费的元素`,
                                    data:res.message
                                })
                            }).catch( error =>{
                                error&&this.$message({type:'error', message:error.message||error});
                            });
                        }
                    },
                    {label:'卸载',value:6,action(row){this.uninstall(row)}}
                ],
                timingShow:false,
                timingTitle:'',
                timingData:[],
                runnerShow:false,
                runnerTitle:'',
                runnerData:{},
                detailShow:false,
                detailTitle:'',
                detail:{
                    elements:[]
                },
            }
        },
        computed: {
            errorShow(){
                if(this.detail.elements.length){
                    return this.detail.elements.filter(e=>e.count).length;
                }
            }
        },
        methods: {
            is_disabled(row,item){
                if(item.value!==3){
                    return false;
                }else{
                    if(row.timers&&row.timers.length){
                        return false;
                    }else{
                        return true;
                    }
                }
            },
            change_type(row,type){
                if(type===row.previous_status)return;
                this.$confirm('此操作将更改当前类型, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_change_queue_type,{queuer:row.key,hosttype:type}).then(res=>{
                        this.$message({type:'success', message:res.message||res});
                        // this.$emit('status');
                    }).catch((error) => {
                        this.$set(row,'hosttype',row.previous_status);
                        this.$message({type: 'error',message:error.message||error});
                    });
                }).catch(() => {
                    this.$set(row,'hosttype',row.previous_status);
                    this.$message({type: 'info',message: '已取消操作'});
                });
            },
            show_detail(row){
                this.detail=row;
                this.detailTitle=`${row.key}队列所有元素（${row.elements.length}）个`;
                this.detailShow=true;
            },
            detail_title(element){
                const fail = element.count?`失败:${element.count}次`:'';
                return `当前乘下数:${element.remain};${fail}`;
            },
            del(row){
                this.$confirm('此操作将删除当前元素, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_del_remove_element,{key:this.detail.key,element:row.element}).then(res=>{
                        let index;
                        if(row.count){
                            index = this.detail.elements.findIndex(item=>(item.element===row.element)&&!!row.count);
                        }else{
                            index = this.detail.elements.findIndex(item=>item.element===row.element);
                        }
                        if(index!==-1)this.detail.elements.splice(index,1);
                        res&&this.$message({type:'success', message:res.message||res});
                    }).catch( error =>{
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }).catch(() => {
                    this.$message({type: 'info',message: '已取消操作'});
                });
            },
            clear_fails(row){    //当前清错清掉所有
                this.$confirm('此操作将清掉错误元素, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_clear_current_fail,this.detail.key).then(res=>{
                        this.$message({type:'success',message:res.message||res});
                    }).catch(code =>{
                        this.$message({message:code.message,type:'error'});
                    })
                }).catch(() => {
                    this.$message({type: 'info',message: '已取消操作'});
                });
            },
            change_status(row,status){
                const statusName = status?'继续执行':"暂停执行" ;
                this.$confirm(`是否确认${row.name} ${statusName}队列`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_change_status,{queuer:row.key,status:status,hosttype:row.hosttype}).then(res=>{
                        this.$message({type:'success',message: res.message||res});
                        row.status = status;
                    }).catch(code =>{
                        row.status = !status;
                        this.$message({type:'error',message: code.message||code});
                    })
                }).catch(() => {
                    row.status = !status;
                });
            },
            operates(row,operate,index){
                operate.action.call(this,row,operate,index);
            },
            uninstall(row){
                this.$http(api_uninstall_task,row.key).then(res=>{
                    let index=this.allData.findIndex(all=>all.key===row.key);
                    if(index!==-1){
                        this.allData.splice(index,1);
                    }
                    this.$message({type:'success', message:res.message||res})
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
        },
        props: {
            allData:Array,
            types:Array,
            loading:Boolean
        },
        components: {
            labelItem:require('@/components/label-item').default,
            DataTables,
        },
    }
</script>

