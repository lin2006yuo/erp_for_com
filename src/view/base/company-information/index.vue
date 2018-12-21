<template>
    <page class="p-company-information">
        <search :search-data="searchData"
                :clears="clears"
                @search="init">
        </search>
        <table-list :loading="loading"
                    :table-data="tableData"
                    @page="page_change"
                    @size="size_change"
                    @fresh="init">
        </table-list>
    </page>
</template>

<style lang="stylus">

</style>

<script>
    import search from './search';
    import tableList from './table-data';
    import datef from "datef";
    import {api_get_company_info_list,} from '@/api/company-info'
    export default {
        name: "index",
        data() {
            return {
                searchData:{
                    status:'',
                    id:'',
                    corporation:'',
                    time_start:(Date.now() - (15 * 24 * 60 * 60 * 1000)),
                    time_end:Date.now()
                },
                clears:{
                    status:'',
                    id:'',
                    corporation:'',
                    time_start:(Date.now() - (15 * 24 * 60 * 60 * 1000)),
                    time_end:Date.now()
                },
                loading:false,
                tableData:{
                    data:[],
                    page:1,
                    pageSize:50,
                    count:0
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init(){
                this.loading=true;
                let data=window.clone(this.searchData);
                this.searchData.time_start&&(data.time_start=datef('YYYY-MM-dd',this.searchData.time_start));
                this.searchData.time_end&&(data.time_end=datef('YYYY-MM-dd',this.searchData.time_end));
                this.$set(data,'page',this.tableData.page);
                this.$set(data,'pageSize',this.tableData.pageSize);
                this.$http(api_get_company_info_list,data).then(res=>{
                    res.data.forEach(row=>{
                        if(!row.collection_account||!row.collection_account.length){
                            this.$set(row,'collection_account','');
                        }else {
                            this.$set(row,'collection_account',row.collection_account.join(','));
                        }
                        if(!row.company_time){
                            this.$set(row,'company_time','')
                        }else{
                            this.$set(row,'company_time',datef('YYYY-MM-dd',row.company_time*1000))
                        }
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
            search,
            tableList
        },
    }
</script>

