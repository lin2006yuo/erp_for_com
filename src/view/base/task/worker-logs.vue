<template>
    <page-dialog v-model="show" size="large" :title="worker.title">
        <div>
            <el-row>
                <el-col :span="2" class="text-right">
                    执行时间在：
                </el-col>
                <el-col :span="7">
                    {{worker.run_time | fdatetime('YYYY-MM-dd HH:mm:ss:ff')}}
                </el-col>
                <el-col :offset="11" :span="4" style="color:green;">
                    最近 <integer-input style="width:65px;"
                                      class="inline"
                                      :min="1"
                                      v-model="count"></integer-input>条
                    <el-button class="inline" size="mini" type="primary" @click.native="refresh_logs">刷新</el-button>
                </el-col>
            </el-row>
            <el-table :data="logs" v-loading="loading">
                <el-table-column label="时间" inline-template width="160px">
                    <span>{{row.created_at |fdatetime('YYYY-MM-dd HH:mm:ss:ff')}}</span>
                </el-table-column>
                <el-table-column label="状态" inline-template width="120px">
                    <span>{{row.run_status|run_status}}</span>
                </el-table-column>
                <el-table-column label="备注" inline-template>
                    <span>{{row.remark}}</span>
                </el-table-column>
            </el-table>
        </div>
        <span slot="footer">
            <el-button size="mini" @click.native="show=false;">关闭</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    import {api_worker_logs} from '../../../api/task';
    export default{
        data(){
            return{
                show:this.value,
                logs:[],
                count:20,
                loading:false,
            }
        },
        filters:{
            run_status(status){
                switch (status){
                    case 0:return '未启动过';
                    case 1:return '准备处理';
                    case 2:return '完成处理';
                    case 3:return '等待下次处理';
                    case 4:return '结束任务';
                    case 5:return '运行时报错';
                    default:
                        return '未定义的状态';
                }
            }
        },
        methods:{
            refresh_logs(){
                this.loading = true;
                if(!this.count) return this.$message({type:"warning",message:"请输入要查询的数据条数，必须为整数！"});
                this.$http(api_worker_logs, this.worker.id, this.count).then(res=>{
                    this.logs = res;
                    this.loading = false;
                })
            }
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input', val);
                if(val){
                    this.refresh_logs();
                }
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            worker:{
                type:Object
            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default,
            integerInput:require('../../../components/integer-input.vue').default,
        }
    }
</script>