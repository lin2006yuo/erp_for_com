<template>
    <page-dialog v-model="consumingShow"
                 width="70%"
                 :title="`当前类型：${title}正在消费的消息`"
                 class="c-consuming-dialog">
        <el-table border
                  highlight-current-row
                  :data="consuming"
                  v-loading="loading"
                  style="width: 100%;min-height: 200px;"
                  empty-text="暂无正在使用的队列">
            <el-table-column
                    label="TaskID"
                    prop="pname"
                    width="90">
            </el-table-column>
            <el-table-column
                    width="80"
                    label="PID"
                    prop="pid">
            </el-table-column>
            <el-table-column
                    label="Task"
                    prop="task">
            </el-table-column>
            <el-table-column
                    label="开始时间"
                    prop="remark"
                    width="150"
                    inline-template>
                <div>{{row.time|fmsdatetime}}</div>
            </el-table-column>
            <el-table-column
                    label="正在消费"
                    prop="remark"
                    inline-template>
                <div class="consuming-tasks" title="点击查看全部"
                     @click="all_details(row)">
                    <span v-for="(item,index) in row.consuming"
                          :key="index">{{item}}
                    </span>
                </div>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="110">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="force(scope.row,scope.$index)">强制关闭
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <page-dialog :title="detailTitle"
                     v-model="detailShow"
                     width="70%" >
            <div class="top-tasks" v-if="details.length">
                当前正在消费的详情：
                <span v-for="(item,index) in details"
                      :key="index">
               {{item}}
                </span>
            </div>
            <div v-else style="text-align: center">
                暂无正在消费的消息
            </div>
            <div slot="footer">
                <el-button @click.native="detailShow=false"
                           size="mini">关闭
                </el-button>
            </div>
        </page-dialog>
        <div slot="footer">
            <el-button v-if="isRefresh==='table'"
                       size="mini"
                       @click.native="$emit('fresh')">刷新
            </el-button>
            <el-button @click.native="$emit('close')"
                       size="mini">关闭
            </el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus" scoped>
    .c-consuming-dialog{
        .consuming-tasks {
            vertical-align: middle;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
                margin-left: 5px;
                padding: 2px 5px;
                border: 1px dashed #f0f0f0;
            }
            span:nth-child(even) {
                color: #0000ff
            }
            span:nth-child(odd) {
                color: #2ba9bc
            }
        }
        .top-tasks{
            min-height :200px;
        }
    }
</style>

<script>
    import {api_force_task} from '@/api/queue';
    export default {
        name: "element-detail",
        data() {
            return {
                consumingShow:this.value,
                detailShow:false,
                detailTitle:'',
                details:[]
            }
        },
        methods:{
            all_details(row){
                if(!row.consuming.length)return;
                this.detailTitle=`当前正在消费的Task: ${row.task} 详情`;
                this.details=row.consuming;
                this.detailShow=true;
            },
            force(row,index){
                this.$http(api_force_task,row.task,row.workerId,this.title).then(res=>{
                    this.consuming.splice(index,1);
                    this.$message({type:'success', message:res.message||res});
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            }
        },
        watch: {
            consumingShow(val){
                this.$emit('input',val);
            },
            value(val){
                this.consumingShow=val;
                console.log(this.consuming,'consuming');
                if(val){
                    this.detailShow=false;
                    this.detailTitle='';
                    this.details=[];
                }
            }
        },
        props: {
            value:Boolean,
            title:String,
            consuming:Array,
            loading:Boolean,
            isRefresh:{//'table'表格进入 'detail'详情按钮进入
                type:String,
                default(){
                    return 'detail'
                }
            }
        },
    }
</script>

