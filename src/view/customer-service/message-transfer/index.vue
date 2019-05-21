<template>
        <page class="p-index">
            <card-search :search-data="searchData"
                         @search="search"
                         @select-boxs="select_boxs"></card-search>
            <table-data :table-data="tableData"
                        :loading="loading"
                        :total="total"
                        :first-loading="firstLoading"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"></table-data>
        </page>
    </template>
    <style lang="stylus">

    </style>
    <script>
        import {api_message_record} from '@/api/message-record'
        export default{
            data(){
                return{
                    searchData:{
                        channel_id:'',
                        create_id:'',
                        time_start:'',
                        time_end:'',
                    },
                    tableData:{
                        list:[],
                        page:1,
                        pageSize:50
                    },
                    total:0,
                    loading:false,
                    firstLoading:true,
                }
            },
            methods:{
                search(){
                    this.init();
                },
                init(){
                    this.loading = true;
                    let parmes = clone(this.searchData);
                    this.$set(parmes,'page',this.tableData.page);
                    this.$set(parmes,'pageSize',this.tableData.pageSize);
                    if (this.searchData.time_start) {
                        parmes.time_start =datef("YYYY-MM-dd",this.searchData.time_start/1000)
                    }else {
                        parmes.time_start="";
                    }
                    if (this.searchData.time_end) {
                        parmes.time_end =datef("YYYY-MM-dd",this.searchData.time_end/1000)
                    }else {
                        parmes.time_end="";
                    }
                    this.$http(api_message_record,parmes).then(res=>{
                        this.loading = false;
                        this.firstLoading = false;
                        this.total = res.count;
                        this.tableData.list = res.data;
                    });
                },
                select_boxs(val){//---平台
                    this.searchData.channel_id = val;
                    this.init();
                },
                handleSizeChange(val) {//------------分页
                    this.tableData.page = 1;
                    this.tableData.pageSize = val;
                    this.init();
                },
                handleCurrentChange(val) {//------------分页
                    this.tableData.page = val;
                    this.init();
                },
            },
            components:{
                cardSearch:require('./card-search.vue').default,
                tableData:require('./table-data.vue').default,
            }
        }
    </script>