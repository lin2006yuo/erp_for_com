<template>
    <page class="c-demand-schedules-index">
        <card-search @search="search" :type-list="typeList" :form="searchData" :clears="clears"></card-search>
        <div class="mt-sm">
            <permission class="ml-sm inline"
                        tag="request-button"
                        type="primary"
                        size="mini"
                        req-key="url_internal_letters_draft_delete"
                        :mintime="200"
                        :route="apis.url_internal_letters_draft_delete"
                        @click="batch_del">批量删除
            </permission>
            <permission class="ml-sm inline"
                        tag="request-button"
                        type="primary"
                        size="mini"
                        req-key="url_post_internal_letters_batch_send"
                        :mintime="200"
                        :route="apis.url_post_internal_letters_batch_send"
                        @click="batch_send">批量发送
            </permission>
        </div>
        <table-module class="mt-sm"
                      :loading="loading"
                      :first-loading="firstLoading"
                      :type-list="typeList"
                      @selection-change="selection_change"
                      :table-data="tableData"></table-module>
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
    import {api_get_internal_letter_get_all_type} from '../../../api/system-notice-inbox'
    import {
        api_get_internal_letters_draft,
        url_internal_letters_draft_delete,
        api_internal_letters_draft_delete,
        url_post_internal_letters_batch_send,
        api_post_internal_letters_batch_send
    } from '@/api/system-notice-drafts'
    export default {
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'邓海波',
                createTime:'2018-8-22',
                updateTime:'2018-8-31'
            }
        },
        data() {
            return {
                typeList:[],
                firstLoading:true,
                loading:false,
                searchData:{
                    type:'',
                    receiver_id:'',
                    snText:'',
                    btime:'',
                    etime:''
                },
                clears:{
                    type:'',
                    receiver_id:'',
                    snText:'',
                    btime:'',
                    etime:''
                },
                page:1,
                pageSize:20,
                total:0,
                tableData:[],
                ids:[]
            }
        },
        permission:{
            url_internal_letters_draft_delete,
            url_post_internal_letters_batch_send
        },
        refresh(){
            this.init();
        },
        mounted(){
            this.init();
            this.get_mes_type();
        },
        methods:{
            get_mes_type(){
                this.$http(api_get_internal_letter_get_all_type).then(res=>{
                    this.typeList = [{label:'全部',value:''},...res];
                }).catch(code=>{
                    console.log(code);
                });
            },
            init_params(){
                let data = window.clone(this.searchData);
                if(!!data.btime){
                    data.btime = datef('YYYY-MM-dd', this.searchData.btime.getTime()/1000);
                }else{
                    delete data.btime;
                }
                if(!!data.etime){
                    data.etime = datef('YYYY-MM-dd', this.searchData.etime.getTime()/1000);
                }else{
                    delete data.etime;
                }
                if(data.snText.trim()){
                    data.snText.trim();
                }else{
                    delete data.snText;
                }
                data.type===''&&delete data.type;
                data.receiver_id===''&&delete data.receiver_id;
                data.page = this.page;
                data.pageSize = this.pageSize;
                return data
            },
            init(){
                let data = this.init_params();
                this.loading = true;
                this.$http(api_get_internal_letters_draft,data).then(res=>{
                    this.tableData = res.data;
                    this.total = res.count;
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
            selection_change(selects){
                this.ids = selects.map(row=>row.id);
            },
            batch_del(){
                if(this.ids.length===0){
                    this.$reqKey('url_internal_letters_draft_delete',false);
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
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_internal_letters_draft_delete',false);
                    },200);
                });
            },
            delete_data(ids){
                this.$http(api_internal_letters_draft_delete,{letter_ids:ids}).then(res=>{
                    ids.forEach(id=>{
                        let delIndex = this.tableData.findIndex(row=>row.id===id);
                        if(delIndex>=0){
                            this.tableData.splice(delIndex,1);
                            this.total -=1;
                        }
                    });
                    this.ids = [];
                    this.$message({type:'success',message:res.message||res});
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_internal_letters_draft_delete',false);
                    },200);
                });
            },
            batch_send(){
                if(this.ids.length===0){
                    this.$reqKey('url_post_internal_letters_batch_send',false);
                    return this.$message({type:'warning',message:'请选择要操作的数据！'});
                }
                this.$http(api_post_internal_letters_batch_send,{letter_ids:this.ids}).then(res=>{
                    this.$message({type: 'success', message: res.message || res});
                    this.ids.forEach(id => {
                        let delIndex = this.tableData.findIndex(row => row.id === id);
                        if (delIndex >= 0) {
                            this.tableData.splice(delIndex, 1);
                            this.total -=1;
                        }
                    });
                    this.ids = [];
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_post_internal_letters_batch_send',false);
                    },200);
                });
            }
        },
        components: {
            cardSearch:require('./card-search').default,
            tableModule:require('./table-module').default,
            trendsSelect: require('@/components/trends-select.vue').default,
        }
    }
</script>
