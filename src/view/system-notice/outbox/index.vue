<template>
    <page class="c-demand-schedules-index">
        <card-search :type-list="typeList" @search="search" :form="searchData" :clears="clears"></card-search>
        <div class="mt-sm">
            <permission class="ml-sm inline"
                        tag="request-button"
                        type="primary"
                        size="mini"
                        req-key="url_internal_letters_delet_sent_letters"
                        :mintime="200"
                        :route="apis.url_internal_letters_delet_sent_letters"
                        @click="batch_del">批量删除
            </permission>
        </div>
        <table-module class="mt-sm"
                      :type-list="typeList"
                      :loading="loading"
                      :first-loading="firstLoading"
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
        api_get_internal_letters_sent_letter,
        url_internal_letters_delet_sent_letters,
        api_internal_letters_delet_sent_letters
    } from '../../../api/system-notice-outbox'
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
                firstLoading:true,
                loading:false,
                typeList:[],
                searchData:{
                    type:'',
                    snText:'',
                    receiver_id:'',
                    btime:'',
                    etime:''
                },
                clears:{
                    type:'',
                    snText:'',
                    receiver_id:'',
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
            url_internal_letters_delet_sent_letters
        },
        refresh(){
            this.init();
        },
        mounted(){
            this.get_mes_type();
            this.init();
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
                this.$http(api_get_internal_letters_sent_letter,data).then(res=>{
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
            translateTime(row,key){
                return row[key]?row[key]*1000:''
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
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_internal_letters_delet_sent_letters',false);
                    },200);
                });;
            },
            delete_data(ids){
                this.$http(api_internal_letters_delet_sent_letters,{letter_ids:ids}).then(res=>{
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
                        this.$reqKey('url_internal_letters_delet_sent_letters',false);
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
