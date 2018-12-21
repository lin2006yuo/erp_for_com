<template>
    <el-row class="p-index">
        <div class="card">
            <el-card>
                <label-buttons label="状态：" :dataParams="dataParams" :buttons="butStatus" @select="changeSelect" @search_list="search_list"></label-buttons>
            </el-card>
            <el-button type="primary" size="mini" @click="add_form" style="margin:5px" >添加</el-button>
            <el-button type="primary" size="mini" @click="refresh">刷新任务进程</el-button>
            <label style="color:red">（此处刷新的是swoole进程）</label>
            <data-table :dataList="dataList" @edit_task="edit_task" @del="del" :loading="loading"> </data-table>
            <add-form  v-model="addVisable" :formData="formData" :titleName="titleName" :tagId="tagId" @submit_="submit_"></add-form>
        </div>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page=dataParams.page
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size=dataParams.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=total>
        </el-pagination>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
    import labelButtons from './label-buttons.vue';
    import dataTable from './data-table.vue';
    import  addForm  from  './add-form.vue'
    import {task_list,task_edit,task_refresh} from '../../../api/taskManage';

    export default{
    	  page:{},
        refresh(){
    	  	this.formData = {
            name:'',
            controller:'',
            exec_time:'',
            cron_time:'',
            max_exec_num:'',
            args:null,
            mark:''
          };
    	  	this.init();
        },
        data(){
            return {
                addVisable:false,
                tagId:0,//-----标识
                titleName:'',
                butStatus:[
                    {name:"未执行",status:0},
                    {name:"正在执行",status:1},
                    {name:"执行失败", status:2},
                    {name:"已删除", status:3}
                ],
                dataList:[],
                total:0,
                dataParams:{
                    page:1,
                    pageSize:50,
                    status:0,
                    snType:'name',
                    snText:'',
                    stime:'',
                    etime:''
                },
                formData:{
                    name:'',
                    controller:'',
                    exec_time:'',
                    cron_time:'',
                    max_exec_num:'',
                    args:null,
                    mark:''
                },
                loading:true
            }
        },
        created(){
            this.listFun()
        },
        methods:{
            listFun(){
                this.dataList=[];
                this.loading=true;
                this.$http(task_list,this.dataParams).then(res=>{
                    console.log(res);
                    this.dataList=res.data;
                    this.total=res.count;
                    this.loading=false;
                }).catch(code=>{

                })
            },
            add_form(){//------------------增加弹框打开
                this.addVisable=true;
                this.tagId=0;
                this.titleName='添加任务';
                this.formData={//------清空
                    name:'',
                    controller:'',
                    exec_time:'',
                    cron_time:'',
                    max_exec_num:'',
                    args:null,
                    mark:''
                }
            },
            refresh(){//-----刷新任务进程
                this.$http(task_refresh).then(res=>{
                    this.$message({type: "success", message: res.message || res})
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            edit_task(row){//------------编辑
                this.addVisable=true;
                this.tagId=row.id;
                this.titleName='修改任务';
                this.$http(task_edit,row.id).then(res=>{
                    console.log(res);
                    if(res.exec_time==0){
                        this.formData.exec_time=''
                    }else{
                        this.formData.exec_time= datef('YYYY-MM-dd HH:mm:ss', res.exec_time);
                    }
                    this.formData.name=res.name;
                    this.formData.controller=res.controller;
                    this.formData.cron_time=res.cron_time;
                    this.formData.max_exec_num=res.max_exec_num;
                    this.formData.mark=res.mark;
                    this.formData.args=res.args;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            submit_(){//-----添加/更新
                this.listFun()
            },
            del(){//-----删除/恢复
                this.listFun()
            },
            changeSelect(select){
                console.log(select);
                this.dataParams.status=select;
                this.listFun()
            },
            search_list(){//----------搜索
                console.log(this.dataParams);
                if(this.dataParams.stime){
                    var d = new Date(this.dataParams.stime);
                    this.dataParams.stime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
                }
                if(this.dataParams.etime){
                    var e = new Date(this.dataParams.etime);
                    this.dataParams.etime=e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate()
                }
                this.listFun()
            },
            handleSizeChange(val) {//---------------分页每页显示条数
                this.dataParams.pageSize=val;
                this.listFun()
            },
            handleCurrentChange(val) {//------------分页当前页
                this.dataParams.page=val;
                this.listFun()
            },
        },
        components: {
            labelButtons,
            dataTable,
            addForm
        }
    }
</script>
