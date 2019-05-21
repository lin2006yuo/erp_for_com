<template>
    <page>
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
    import {api_phone} from '@/api/phone-management'
    export default {
        name: "index",
        page:{
            devinfo:{
                frontEnd:'文军辉',
                backEnd:'',
                createTime:'2019-1-7',
                updateTime:'2019-1-7'
            }
        },
        data() {
            return {
                searchData:{
                    status: '',
                    operator:'',
                    phone:'',
                    reg_time_st:(Date.now() - (30 * 24 * 60 * 60 * 1000)),
                    reg_time_nd:Date.now(),
                    account_count_st:'',
                    account_count_nd:'',
                    cat_pool:'全部'
                },
                clears:{
                    status: '',
                    operator:'',
                    phone:'',
                    reg_time_st:(Date.now() - (30 * 24 * 60 * 60 * 1000)),
                    reg_time_nd:Date.now(),
                    account_count_st:'',
                    account_count_nd:''
                },
                loading:false,
                tableData:{
                    data:[],
                    page:1,
                    pageSize:50,
                    count:0
                },
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init(){
                let data=window.clone(this.searchData); 
                data.phone = data.phone.trim();                
                data.reg_time_st = data.reg_time_st ? datef('YYYY-MM-dd', data.reg_time_st) : '';
                data.reg_time_nd = data.reg_time_nd ? datef('YYYY-MM-dd', data.reg_time_nd) : '';
                data.page = this.tableData.page;
                data.pageSize = this.tableData.pageSize;
                // 注册账号数验证。
                if (!this.verification(data)) {
                    return false;
                }
                this.loading=true;
                this.$http(api_phone, data).then(res=>{                    
                    this.tableData.count = res.count;                    
                    this.$set(this.tableData, 'data', res.list);
                    this.tableData.page = res.page - 0;
                    this.tableData.pageSize = res.pageSize - 0;                    
                    this.loading=false;
                }).catch(error=>{
                    this.loading=false;
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            verification(data) {
                if (this.searchData.account_count_st !== '' && this.searchData.account_count_nd !== '') {
                    if ((this.searchData.account_count_st - 0) > (this.searchData.account_count_nd - 0)) {
                        this.$message({
                            type:'warning',
                            message: "注册账号数结束不能小于开始值"
                        });
                        return false;
                    }
                }
                return true;
            },
            page_change(page) {
                this.$set(this.tableData,'page',page);
                this.init();
            },
            size_change(size){
                this.$set(this.tableData,'pageSize',size);
                this.init();
            },
        },
        components: {
            search,
            tableList
        },
    }
</script>

