<template>
        <page class="p-index">
            <search-time
                :search-data="searchData"
                @search="search"
                :clears="clears"
                @change-status="change_status">
            </search-time>
            <request-button class="mt-xs mb-xs ml-sm"
                            :disabled="tableData.list.length === 0"
                            :request="exports">批量导出</request-button>
            <span style="visibility: hidden;">{{status}}</span>
            <table-data
                    :table-data="tableData"
                    :loading="loading"
                    :first-loading="firstLoading"
                    :total="total"
                    :platform="platform"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
            @sort-change="sort_change">
            </table-data>
            <export-dialog v-model="visible"></export-dialog>
        </page>
    </template>
    <style lang="stylus">

    </style>
    <script>
        import {api_get_publish,api_export_publish} from '../../../api/platform-statistics'
        export default{
            page:{
                devinfo:{
                    frontEnd:'汤敏',
                    backEnd:'乔衡山',
                    createTime:'2018-7-16',
                    updateTime:'2018-7-18'
                }
            },
            refresh(){
                this.init();
            },
            data(){
                return{
                    searchData:{
                        channel_id:1,
                        warehouse_id:'',
                        start_time:"",
                        end_time:"",
                        spu:'',
                        order_type:'',
                        order_sort:'',
                        developer_id:''
                    },
                    clears:{
                        channel_id:this.status,
                        start_time:'',
                        end_time:'',
                        spu:'',
                        order_type:'',
                        order_sort:'',
                        developer_id:''
                    },
                    tableData:{
                        list:[],
                        page:1,
                        pageSize:20,
                    },
                    loading:false,
                    firstLoading: true,
                    visible:false,
                    platform:'',
                    total:1,

                }
            },
            // mounted(){
            //     this.init()
            // },
            computed:{
                status(){
                    if(!!this.searchData.channel_id){
                        return this.clears.channel_id=this.searchData.channel_id ;
                    }
                }
            },
            methods:{
                search(){
                    this.init()
                },
                change_status(val,lable){
                    this.searchData.channel_id = val;
                    this.tableData.list=[];
                    this.searchData.start_time = '';
                    this.searchData.end_time = '';
                    this.platform = lable;
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
                    let curString = this.searchData.spu.replace(new RegExp(' ', 'gm'), '\n');
                    let cur = curString.split('\n').filter(row => !!row);
                    data.spu = cur && cur.length > 1 ? cur.map(row => row.trim()) : this.searchData.spu;
                    return this.$http(api_export_publish, data).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.visible = true;
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                },
                init(){
                    this.loading = true;
                    let data = this.deal_time(this.searchData);
                    this.$set(data,'page',this.tableData.page);
                    this.$set(data,'pageSize',this.tableData.pageSize);
                    let curString = this.searchData.spu.replace(new RegExp(' ', 'gm'), '\n');
                    let cur = curString.split('\n').filter(row => !!row);
                    data.spu = cur && cur.length > 1 ? cur.map(row => row.trim()) : this.searchData.spu;
                    this.$http(api_get_publish,data).then(res=>{
                        this.tableData.list = res.data;
                        this.total = res.total;
                        this.loading = false;
                        this.firstLoading = false
                    }).catch(code => {
                        //this.$message({type: 'error', message: code.message || code});
                        console.log(code)
                        this.loading = false;
                        this.firstLoading = false;
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
                sort_change(val){
                    this.searchData.order_type = 'publish_count';
                    this.searchData.order_sort =val;
                    this.init()
                }
            },
            components:{
                searchTime:require('./search-time.vue').default,
                tableData:require('./table-data.vue').default,
                exportDialog:require('../export-dialog.vue').default,
                requestButton:require('../../../global-components/request-button').default
            }
        }
    </script>