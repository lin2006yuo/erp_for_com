<template>
    <page class="p-company-information">
        <search :search-data="searchData"
                :clears="clears"
                @search="init">
        </search>
        <table-list :loading="loading"
                    :table-data="tableData"
                    @sort="sort"
                    @page="page_change"
                    @size="size_change"
                    @fresh="init">
        </table-list>
    </page>
</template>

<style lang="stylus">

</style>

<script>
    import datef from "datef";
    import {api_get_company_info_list,} from '@/api/company-info'
    export default {
        name: "index",
        page:{},
        data() {
            return {
                searchData:{
                    type:'',
                    status:'',
                    id:'',
                    source:'',
                    corporation:'',
                    account_count_st:'',
                    account_count_nd:'',
                    time_start:(Date.now() - (15 * 24 * 60 * 60 * 1000)),
                    time_end:Date.now(),
                    sort_field:'',
                    sort_value:''
                },
                clears:{
                    type:'',
                    status:'',
                    id:'',
                    source:'',
                    corporation:'',
                    account_count_st:'',
                    account_count_nd:'',
                    time_start:(Date.now() - (15 * 24 * 60 * 60 * 1000)),
                    time_end:Date.now()
                },
                loading:false,
                tableData:{
                    data:[],
                    page:1,
                    pageSize:50,
                    count:0
                },
                images:[]
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init(){
                if(Number(this.searchData.account_count_st)>this.searchData.account_count_nd&&Number(this.searchData.account_count_nd)){
                    return this.$message({type:'warning',message: "注册账号数结束值不能小于开始值"});
                }
                this.loading=true;
                let data=window.clone(this.searchData);
                if(this.searchData.type==='')delete data.type;
                if(this.searchData.source==='')delete data.source;
                data.time_start=this.searchData.time_start?(datef('YYYY-MM-dd',this.searchData.time_start)):'';
                data.time_end=this.searchData.time_end?(datef('YYYY-MM-dd',this.searchData.time_end)):'';
                this.$set(data,'page',this.tableData.page);
                this.$set(data,'pageSize',this.tableData.pageSize);
                this.$http(api_get_company_info_list,data).then(res=>{
                    res.data.forEach(row=>{
                        if(!row.company_time){
                            this.$set(row,'company_time','')
                        }else{
                            this.$set(row,'company_time',datef('YYYY-MM-dd',row.company_time*1000))
                        }
                        this.$set(row,'vat_code',JSON.parse(row.vat_data).map(vat=>vat.vat+' '+vat.code).join('，'));
                    });
                    res.page=Number(res.page);
                    res.pageSize=Number(res.pageSize);
                    this.tableData=JSON.parse(JSON.stringify(res));
                    this.loading=false;
                }).catch(error=>{
                    this.loading=false;
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            sort(row){
                this.$set(this.searchData,'sort_field',row.prop);
                this.$set(this.searchData,'sort_value',row.order==='ascending'?'asc':'desc');
                this.init();
            },
            page_change(page){
                this.$set(this.tableData,'page',page);
                this.init();
            },
            size_change(size){
                this.$set(this.tableData,'pageSize',size);
                this.init();
            }
        },
        components: {
            search:require('./search').default,
            tableList:require('./table-data').default,
            bankCard:require('./bank-card').default,
            multiUpload:require('./multi-upload').default
        },
    }
</script>

