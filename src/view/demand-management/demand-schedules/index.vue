<template>
    <page class="c-demand-schedules-index">
        <card-search @search="search" :form="searchData" :clears="clears" :buttons="buttons"></card-search>
        <div class="mt-sm">
            <permission class="ml-sm inline"
                        tag="ElButton"
                        type="primary"
                        size="mini"
                        :route="apis.url_get_progress_permission"
                        @click="add_demand">新增需求
            </permission>
            <permission tag="trendsSelect"
                        class="inline ml-sm"
                        type="primary"
                        :route="apis.url_progress_update_status"
                        :selects="handleOptions"
                        @trigger="handle_option"></permission>
            <permission class="ml-sm inline"
                        tag="request-button"
                        type="primary"
                        size="mini"
                        req-key="batch_del_demand"
                        :mintime="200"
                        :route="apis.url_progress_batch_delete"
                        @click="batch_del">批量删除
            </permission>
        </div>
        <table-module class="mt-sm"
                      :loading="loading"
                      :first-loading="firstLoading"
                      @edit="edit"
                      @del-row="del_row"
                      @selection-change="selection_change"
                      :table-data="tableData"></table-module>
        <add-edit v-model="addVisible"
                  :action="action"
                  @save-success="save_success"
                  :editData="editData"></add-edit>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </page>
</template>
<style lang="stylus">
    .c-demand-schedules-index{
        .el-dropdown .el-button-group {
            display: inline-block;
            position: relative;
            top: 1px;
        }
    }
</style>
<script>
    import {
        api_get_progress,
        url_add_progress,
        url_progress_update_status,
        api_progress_update_status,
        url_progress_batch_delete,
        api_progress_batch_delete,
        url_get_progress_permission,
        api_get_progress_permission
    } from '../../../api/demand-schedules'
    export default {
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'乔衡山',
                createTime:'2018-8-3',
                updateTime:'2018-8-6'
            }
        },
        data() {
            return {
                firstLoading:true,
                loading:false,
                searchData:{
                    status:'',
                    sn_type:'id',
                    sn_text:'',
                    type:'',
                    priority:'',
                    raiser:'',
                    raiser_id:'',
                    time_type:'raise_time',
                    date_begin:'',
                    date_end:''
                },
                clears:{
                    status:'',
                    sn_type:'id',
                    sn_text:'',
                    type:'',
                    priority:'',
                    raiser:'',
                    raiser_id:'',
                    time_type:'raise_time',
                    date_begin:'',
                    date_end:''
                },
                page:1,
                pageSize:20,
                total:0,
                tableData:[],
                editData:{
                    id:'',
                    version:'',
                    type:0,
                    status:0,
                    priority:0,
                    module:'',
                    content:'',
                    summary:'',
                    raiser_id:'',
                    raiser:'',
                    raise_time:'',
                    plan_listing_time:'',
                    listing_time:'',
                    leading_id:'',
                    leading:'',
                    plan_complete_time:'',
                    plan_percent:'',
                    real_complete_time:'',
                    developer_id:'',
                    developer:'',
                    fronter_id:'',
                    fronter:'',
                    plan_developer_time:'',
                    developer_percent:'',
                    real_developer_time:'',
                    test_id:'',
                    tester:'',
                    plan_test_time:'',
                    test_percent:'',
                    real_test_time:'',
                    remark:'',
                    leading_status:0,
                    leading_stop_remark:'',
                    developer_status:0,
                    developer_stop_remark:'',
                    test_status:0,
                    test_stop_remark:'',
                    can_delete:0
                },
                action:{
                    title:'新增需求',
                    value:'add'
                },
                addVisible:false,
                handleOptions:[
                    {label:'未开始',value:0},
                    {label:'已计划',value:1},
                    {label:'需要设计',value:2},
                    {label:'待研发',value:3},
                    {label:'研发中',value:4},
                    {label:'研发完毕',value:5},
                    {label:'测试中',value:6},
                    {label:'测试完毕',value:7},
                    {label:'已发布',value:8},
                    {label:'已作废',value:9},
                ],
                ids:[]
            }
        },
        permission:{
            url_add_progress,
            url_progress_update_status,
            url_progress_batch_delete,
            url_get_progress_permission
        },
        refresh(){
            this.init();
        },
        mounted(){
            this.init();
        },
        methods:{
            init_params(){
                let data = window.clone(this.searchData);
                if(!!data.date_begin){
                    data.date_begin = datef('YYYY-MM-dd', this.searchData.date_begin.getTime()/1000);
                }else{
                    delete data.date_begin;
                }
                if(!!data.date_end){
                    data.date_end = datef('YYYY-MM-dd', this.searchData.date_end.getTime()/1000);
                }else{
                    delete data.date_end;
                }
                if(data.sn_text.trim()){
                    data.sn_text.trim();
                }else{
                    delete data.sn_text;
                    delete data.sn_type;
                }
                data.type===''&&delete data.type;
                data.priority===''&&delete data.priority;
                data.raiser_id===''&&delete data.raiser_id;
                data.page = this.page;
                data.pageSize = this.pageSize;
                delete data.raiser;
                return data
            },
            init(){
                let data = this.init_params();
                this.loading = true;
                this.$http(api_get_progress,data).then(res=>{
                    this.tableData = res.data;
                    this.total = res.total;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                })
            },
            search(){
                this.init()
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.init()
            },
            handleCurrentChange(val) {
                this.page = val;
                this.init();
            },
            add_demand(){
                this.$http(api_get_progress_permission).then(res=>{
                    this.action.title = '新增需求';
                    this.action.value = 'add';
                    this.addVisible = true;
                        Object.keys(this.editData).forEach(key=>{
                            if(key==='can_delete'){
                                this.editData[key] = res?1:0;
                            }else if(key==='status'||key==='priority'||key==='type'){
                                this.editData[key] = 0;
                            }else if(key==='leading_status'||key==='developer_status'||key==='test_status'){
                                this.editData[key] = 1;
                            }else{
                                this.editData[key] = '';
                            }
                        });

                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_get_progress_permission',false);
                    },200);
                });
            },
            init_edit_params(row){
                let data = window.clone(row);
                data.raise_time = this.translateTime(row, 'raise_time');
                data.plan_listing_time = this.translateTime(row,'plan_listing_time');
                data.listing_time = this.translateTime(row, 'listing_time');
                data.plan_complete_time = this.translateTime(row, 'plan_complete_time');
                data.real_complete_time = this.translateTime(row, 'real_complete_time');
                data.plan_developer_time = this.translateTime(row, 'plan_developer_time');
                data.real_developer_time = this.translateTime(row, 'real_developer_time');
                data.plan_test_time = this.translateTime(row, 'plan_test_time');
                data.real_test_time = this.translateTime(row, 'real_test_time');
                return data
            },
            translateTime(row,key){
                return row[key]?row[key]*1000:''
            },
            edit(row){
                this.editData = this.init_edit_params(row);
                this.action.value = 'edit';
                this.action.title = '编辑需求';
                this.addVisible = true;
            },
            handle_option(status){
                if(this.ids.length===0)return this.$message({type:'warning',message:'请选择要操作的数据！'});
                this.$http(api_progress_update_status,{ids:this.ids.join(','),status:status.value}).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.ids.forEach(id=>{
                        let row = this.tableData.find(row=>row.id===id);
                        if(!!row){
                            row.status = status.value;
                        }
                    });
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code})
                });
            },
            save_success(){
                this.init();
            },
            selection_change(selects){
                this.ids = selects.map(row=>row.id);
            },
            batch_del(){
                if(this.ids.length===0){
                    this.$reqKey('batch_del_demand',false);
                    return this.$message({type:'warning',message:'请选择要操作的数据！'});
                }
                this.$confirm(`您将删除已勾选的数据，确定进行此操作?`,'提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=> {
                    this.delete_data(this.ids);
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    })
                });
            },
            del_row(row){
                this.$confirm(`您将删除编号为${row.id}的数据，确定进行此操作?`,'提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=> {
                    this.delete_data([row.id]);
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    })
                });
            },
            delete_data(ids){
                this.$http(api_progress_batch_delete,{ids:ids.join(',')}).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    ids.forEach(id=>{
                        let index = this.tableData.findIndex(row=>row.id===id);
                        if(index>=0){
                            this.tableData.splice(index,1);
                        }
                    });
                    this.ids = [];
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code})
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('batch_del_demand',false);
                    })
                });
            }
        },
        computed:{
            buttons(){
                return [{label:'全部',value:''},...this.handleOptions];
            }
        },
        components: {
            cardSearch:require('./card-search').default,
            tableModule:require('./table-module').default,
            addEdit:require('./add-edit').default,
            trendsSelect: require('@/components/trends-select.vue').default,
        }
    }
</script>
