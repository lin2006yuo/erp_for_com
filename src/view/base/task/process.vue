<template>
    <page-dialog v-model="show" size="large"
                 @open='open' @close='close' title="查看进度">
        <el-button type="primary" size="mini" @click.native="reload">客户端当前时间:{{(new Date()).pattern("yyyy-MM-dd hh:mm:ss:S")}}</el-button>
        <el-button size="mini" @click.native="getservertime">服务器当前进间：{{servertime |fdatetimes}}</el-button>
        <el-table :data="processes">
            <el-table-column label="任务器" prop="taskName">
            </el-table-column>
            <el-table-column label="任务名" prop="workerName">
            </el-table-column>
            <el-table-column label="执行时间(ms)"
                             property="run_tag"
                             :formatter="formatterTime"
                             sortable >
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <span>
                    <span class="btn" @click="after(row)">延时</span>
                    <span class="btn" @click="tester(row)">测试</span>
                </span>
            </el-table-column>
        </el-table>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    import {api_worker_schedulers, api_worker_change_time} from '../../../api/task';
    import {api_system_time} from '../../../api/system';
    export default{
        data(){
            return{
                show:this.value,
                servertime:0,
                processes:[
                ],
                timer:null,
            }
        },
        methods:{
            open(){
                this.reload();
                this.timer = setInterval(() =>{
                    this.servertime +=1;
                },1);
            },
            close(){
                clearInterval(this.timer);
            },
            after(row){
                let inputValue = fdatetime(row.run_tag,'YYYY-MM-dd HH:mm:ss:f');
                this.$prompt(`延时至yyyy-mm-dd hh:mm:ss:ms (${inputValue})`, `延时任务--${row.workerName}`, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue:inputValue,
                    inputPattern: /^[\d]{4}-[\d]{1,2}-[\d]{1,2} [\d]{1,2}:[\d]{1,2}:[\d]{1,2}:[\d]{1,3}$/,
                    inputErrorMessage: '时间格式有误'
                }).then(({ value }) => {
                    value = new Date(value);
                    value = value.getTime();
                    this.$http(api_worker_change_time, row.id, value).then(res=>{
                        this.$message({
                            type:'success',
                            message:res.message||res
                        });
                        this.reload();
                    })
                }).catch(() => {
                });
            },
            tester(row){
                let inputValue = fdatetime(row.run_tag,'YYYY-MM-dd HH:mm:ss:f');
                this.$prompt(`测试时间yyyy-mm-dd hh:mm:ss:ms (${inputValue})`, `测试任务--${row.workerName}`, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue:inputValue,
                    inputPattern: /^[\d]{4}-[\d]{1,2}-[\d]{1,2} [\d]{1,2}:[\d]{1,2}:[\d]{1,2}:[\d]{1,3}$/,
                    inputErrorMessage: '时间格式有误'
                }).then(({ value }) => {
                    value = new Date(value);
                    value = value.getTime();
                    this.$http(api_worker_change_time, row.id, value).then(res=>{
                        this.$message({
                            type:'success',
                            message:res.message||res
                        });
                        this.reload();
                    })
                }).catch(() => {
                });
            },
            reload(){
                this.$http(api_worker_schedulers).then(res=>{
                    this.processes = res.process;
                    this.servertime = res.time;
                })
            },
            getservertime(){
                this.$http(api_system_time).then(res=>{
                    this.servertime = res;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            formatterTime(row){
                return fdatetime(row.run_tag,'YYYY-MM-dd HH:mm:ss:ff');
            }
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input',val);
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default
        }
    }
</script>
