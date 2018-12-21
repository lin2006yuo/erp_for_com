<template>
        <page class="p-index">
            <card-search
                    :search-data="searchData"
                    @search="search"
                    :service-list="serviceList"
                    :channel-id="channelId"
                    @channel-remote="channel_remote"
                    @channel-service="channel_service"></card-search>
            <request-button class="mt-xs mb-xs ml-sm"
                            :disabled="tableData.list.length === 0"
                            :request="exports">导出</request-button>
            <table-data :table-data="tableData"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :total="total"
                        :loading="loading"></table-data>
            <export-dialog v-model="visible"></export-dialog>
        </page>
    </template>
    <style lang="stylus">

    </style>
    <script>
        import {api_get_message,api_get_export,api_get_member,api_get_channel} from '../../../api/performance-service'
        export default{
            data(){
                return{
                    searchData:{
                        channel_id:1,
                        customer_id:'',
                        date_b:(Date.now()-(14*24*60*60*1000)),
                        date_e:Date.now(),
                    },
                    channelId:[],
                    serviceList:[],
                    tableData:{
                        list:[],
                        page:1,
                        pageSize:50,
                        count:0,
                    },
                    loading:false,
                    total:1,
                    visible:false,
                }
            },
            refresh(){
                this.init();
            },
            mounted(){
                this.get_channel();
                this.channel_service();
            },
            methods:{
                search(){
                    this.init();
                    this.channel_service();
                },
                init(){
                    let params = this.init_params(this.searchData);
                    this.$set(params,'page',this.tableData.page);
                    this.$set(params,'pageSize',this.tableData.pageSize);
                    this.$http(api_get_message,params).then(res=>{
                        this.tableData.list = res.data;
                        this.total = res.count;
                    })
                },
                init_params(){
                    let params = clone(this.searchData);
                    if (this.searchData.date_b) {
                        params.date_b =datef("YYYY-MM-dd",this.searchData.date_b/1000)
                    }else {
                        params.date_b="";
                    }
                    if (this.searchData.date_e) {
                        params.date_e =datef("YYYY-MM-dd",this.searchData.date_e/1000)
                    }else {
                        params.date_e="";
                    }
                    return params
                },
                channel_service(){
                    this.$http(api_get_member,{channel_id:this.searchData.channel_id}).then(res=>{
                        res = res.map(row=>{
                            return{
                                value:row.customer_id,
                                label:row.realname
                            }
                        })
                        this.serviceList = [{label: '全部', value: ''}, ...res];
                    }).catch(code => {
                        console.log(code)
                    })
                },
                get_channel(){
                    return this.$http(api_get_channel).then(res=>{
                        this.channelId = [...res];
                    }).catch(code=>{
                        console.log(code);
                    });
                },
                channel_remote(val){
                    this.searchData.channel_id = val;
                    this.channel_service();
                    this.init();
                },
                exports(){
                    let data = this.init_params(this.searchData);
                    return this.$http(api_get_export, data).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.visible = true;
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
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
                exportDialog:require('../export-dialog.vue').default,
                cardSearch:require('./card-search.vue').default,
                tableData:require('./table-data.vue').default,
                requestButton:require('@/global-components/request-button').default
            }
        }
    </script>