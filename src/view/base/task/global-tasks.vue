<template>
    <page-dialog size="large" v-model="show" @open="open" title="全局进程任务">
        <el-table :data="globalTable" height="200">
            <el-table-column label="名称" prop="name">
            </el-table-column>
            <el-table-column label="进程数" prop="num"></el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <el-button type="primary" size="mini" @click.native="change(row)">改数</el-button>
                    <!--<el-button type="danger" size="mini" @click.native="remove(row.name)">删除</el-button>-->
                </div>
            </el-table-column>
        </el-table>
        <span>进程名：</span>
        <el-autocomplete
                class="inline"
                v-model="selectTask"
                :fetch-suggestions="querySearch"
                placeholder="请输入任务名"
                @select="handleSelect"
        ></el-autocomplete>
        <span>  进程数：</span>
        <el-input-number class="inline" v-model="num"></el-input-number>
        <request-button class="inline" req-key="globelTasks"
                   v-show="selectTask"
                   @click="add_and_start">添加并启动</request-button>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    import {api_add_global_task, api_global_tasks, api_global_task_change} from '../../../api/task';
    export default{
        data(){
            return{
                show:this.value,
                selectTask:'',
                select:{},
                global:[],
                num:1
            }
        },
        methods:{
            open(){
                this.init();
            },
            add_and_start(){
                if(this.selectTask){
                    this.$http(api_add_global_task, {task:this.select.global.id}).then(res=>{
                        this.$message({
                            type:'success',
                            message:'成功'
                        });
                        this.init();
                        this.$nextTick(()=>{
                            this.selectTask = '';
                            this.select = '';
                        })
                    }).catch(code=>{
                        console.log(code);
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('globelTasks', false);
                        }, 300)
                    })
                }else{
                    this.$message({
                        type:'error',
                        message:'非法启动'
                    });
                    this.$reqKey('globelTasks', false);
                }
            },
            init(){
                this.$http(api_global_tasks).then(res=>{
                    this.global = res;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                });
            },
            change(row){
                this.$prompt('请输入进程数', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[\d]+$/,
                    inputErrorMessage: '非法数值'
                }).then(({ value }) => {
                    this.$http(api_global_task_change, {task:row.value, num:value}).then(res=>{
                        console.log(res);
                        row.num = value;
                    }).catch(code=>{
                        console.log(code);
                    })
                }).catch(() => {
                });
            },
            remove(task){

            },
            querySearch(query, callback){
                let ret = [];
                this.notStartGlobals.forEach(global=>{
                    if(query === '' || global.name.indexOf(query)>=0){
                        ret.push({value:global.name,global:global});
                    }
                });
                callback(ret);
            },
            handleSelect(item){
                this.select = item;
            }
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        computed:{
            notStartGlobals(){
                return this.tasks.filter(r=>{
                    return !this.global.find(g=>g.class === r.id)
                })
            },
            globalTable(){
                return this.global.map(g =>{
                    let task = this.tasks.find(t=>t.id === g.task);
                    return {
                        name:task.name,
                        num:g.num,
                        value:g.task
                    };
                })
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            tasks:{
                required:true,
                type:Array
            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default
        }
    }
</script>