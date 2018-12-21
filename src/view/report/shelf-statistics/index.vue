<template>
        <page class="p-index">
            <search-time
                    :search-data="searchData"
                    :list="channel_list"
                    @search="search"
                    :tip.sync="async_tips"
            ></search-time>
            <request-button class="mt-xs mb-xs ml-sm"
                            :disabled="tableData.list.length === 0"
                            :request="exports">批量导出</request-button>
            <table-data
                :platlist="platform"
                :loading="loading"
                :table-data="tableData"
                :first-loading="firstLoading"
                @sort-click="sort_click"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                @get-info="getInfo"
                :total="total"></table-data>
            <export-dialog v-model="visible"></export-dialog>
            <info-dialog :title="title" v-model="dialogShow" :info-list="infoData"></info-dialog>
        </page>
    </template>
    <style lang="stylus">

    </style>
    <script>
        import {api_export_info,api_channel_info} from '../../../api/shelf-statistics'
        export default{
            page:{
                devinfo:{
                    frontEnd:'汤敏,陆城锫',
                    backEnd:'乔衡山',
                    createTime:'2018-7-26',
                    updateTime:'2018-11-20'
                }
            },
            refresh(){
                this.init();
            },
            data(){
                return{
                    async_tips:'',
                    channel_list:[],
                    dialogShow:false,
                    platform:[],
                    title:'',
                    searchData:{
                        start_time: (Date.now() - (15 * 24 * 60 * 60 * 1000)),
                        end_time: (Date.now()- 24 * 60 * 60 * 1000),
                        developer_id:'',
                        spu:'',
                        order_type:'',
                        order_sort:'',
                        channel_id:'',
                        total_b:'',
                        total_e:'',
                    },
                    infoData:[],
                    firstLoading: true,
                    loading:false,
                    tableData:{
                        list:[],
                        page:1,
                        pageSize:20,
                    },
                    total:0,
                    visible:false,
                }
            },
            mounted(){
                this.init()
            },
            methods:{
                sort_click(val){
                    this.searchData.order_type = val.order_type;
                    this.searchData.order_sort =val.order;
                    this.init();
                },
                getInfo(row,infoList){
                    this.title=`开发员:${row.developer} 刊登SPU:${row.spu}的具体账号`;
                    this.infoData=infoList;
                    this. dialogShow=true;
                },
                search(){
                    this.init();
                },
                //处理年月日
                deal_time(searchData){
                    //处理年月日 YYYY-MM-dd
                    let data=clone(searchData);
                    if(searchData.start_time){
                        data.start_time=datef('YYYY-MM-dd', searchData.start_time/1000);
                    }else {
                        data.start_time='';
                    }
                    if(searchData.end_time){
                        data.end_time=datef('YYYY-MM-dd', searchData.end_time/1000);
                    }else {
                        data.end_time='';
                    }
                    return data;
                },
                exports(){
                    let data = this.deal_time(this.searchData);
                    this.$set(data,'date_b',data.start_time);
                    this.$set(data,'date_e',data.end_time);
                    this.$set(data,'developer_id',data.developer_id);
                    this.$delete(data,'developer');
                    this.$delete(data,'start_time');
                    this.$delete(data,'end_time');
                    return this.$http(api_export_info, data).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.visible = true;
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                },
                init(){
                    let data = this.deal_time(this.searchData);
                    let curString = this.searchData.spu.replace(new RegExp(' ', 'gm'), '\n');
                    let cur = curString.split('\n').filter(row => !!row);
                    data.spu = cur && cur.length > 1 ? cur.map(row => row.trim()) : this.searchData.spu;
                    this.$set(data,'page',this.tableData.page);
                    this.$set(data,'pageSize',this.tableData.pageSize);
                    // this.$set(data,'developer_id',data.developer_id);
                    this.$set(data,'date_b',data.start_time);
                    this.$set(data,'date_e',data.end_time);
                    this.$delete(data,'start_time');
                    this.$delete(data,'end_time');
                    this.$delete(data,'developer');
                    if(!!this.async_tips){
                        this.$message({
                            message:'最大值输入有误',
                            type:'warning'
                        })
                    }else {
                        this.loading = true;
                        this.$http(api_channel_info,data).then(res=>{
                            this.tableData.list = res.data;
                            this.total = res.count;
                            this.loading = false;
                            this.firstLoading = false;
                            if(!!res.data.length){
                                this.channel_list = this.tableData.list[0].statistics.map(row=>{
                                    return row
                                });
                                this.channel_list = [{name:'刊登总数',channel_id:''},...this.channel_list];
                            }else {
                                this.channel_list = [{name:'刊登总数',channel_id:''}];
                            }
                            this.tableData.list.forEach(row=>{
                                this.$set(row,'isCheck',false);
                            });
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                            this.loading = false;
                            this.firstLoading = false;
                        })
                    }
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
                searchTime:require('./search-time.vue').default,
                tableData:require('./table-data.vue').default,
                exportDialog:require('../export-dialog.vue').default,
                requestButton:require('../../../global-components/request-button').default,
                infoDialog:require('./dialog.vue').default
            }
        }
    </script>