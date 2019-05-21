<template>
    <page class="p-index">
        <search-time :search-data="searchData" @search="search" @getStatus="getStatus" :account-list="accountList"></search-time>
        <request-button class="mt-sm mb-sm ml-sm"
                        :disabled="tableData.list.length === 0"
                        :request="exports">部分导出</request-button>
        <data-table
            :table-data="tableData"
            :loading="loading"
            :first-loading="firstLoading"
            :count="count"
            @size-change="handleSizeChange"
            @get-spu="get_spu"
            @current-change="handleCurrentChange"
            @sort-change="sortChange"
            :resSpu.sync="spuRes"
        ></data-table>
        <export-dialog v-model="visible"></export-dialog>
        <dialog-module v-model="dialogShow" :title="title" :spu-form="spuForm":info="details"
                       @get-spu="get_spu"
        ></dialog-module>
    </page>
</template>

<script>
    import {api_publised_off,api_publised_off_export,api_off_spu} from '../../../../api/platform-statistics'
    import {
        api_account_list,
    } from '../../../../api/order-local';
    export default {
        data() {
            return {
                spuRes:{},
                spuForm:{
                    list:[],
                    total:0,
                    page:1,
                    pageSize:10
                },
                details:{
                    page:1,
                    pageSize:10
                },
                title:'',
                platform:'',
                dialogShow:false,
                visible:false,
                count:1,
                firstLoading:true,
                loading:false,
                searchData:{
                    channel_id:"",  // 平台
                    date_b:'', // 开始时间
                    date_e:'', // 结束时间
                    account_code:'', // 用户简称
                    spu:'', // SPU
                    min_num: '',
                    max_num: '',
                    shelf_name: '',
                    sort_val: ''
                },
                accountList:[],
                tableData:{
                    list:[],
                    page:1,
                    pageSize:20,
                },
            }
        },
        mounted(){
            // this.init()
        },
        methods: {
            exports(){
                let data=this.handelData(this.searchData);
                return this.$http(api_publised_off_export, data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.visible = true;
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            search(){
                this.init()
            },
            getStatus(val){
                this.loading=true;
                this.searchData.channel_id=val
                this.$http(api_account_list,{channel_id:this.searchData.channel_id}).then(res=>{
                    this.accountList=[{label: "全部", value: ""},...res.account];
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            //处理时间
            handelData(searchData) {
                let data = window.clone(searchData);
                if(!!data.date_b){
                    data.date_b=datef('YYYY-MM-dd', data.date_b/1000)
                }else {
                    data.date_b=''
                }
                if(!!data.date_e){
                    data.date_e = datef('YYYY-MM-dd',data.date_e/1000)
                }else {
                    data.date_e=''
                }

                let curString = data.spu.replace(new RegExp(' ', 'gm'), '\n');
                let cur = curString.split('\n').filter(row => !!row);
                let handelText = cur.map(row => row.trim());

                data.spu = handelText
                return data
            },
            init(){
                if(this.searchData.max_num !== '' && this.searchData.min_num === '') {
                    this.searchData.min_num = 1;
                }
                let data=this.handelData(this.searchData);
                if(data.spu.length && data.spu.length > 300) return this.$message({ type: 'warning', message: '批量搜索只支持300条数据！' })
                this.$set(data,'page',this.tableData.page);
                this.$set(data,'pageSize',this.tableData.pageSize);
                this.loading = true;
                this.$http(api_publised_off,data).then(res=>{
                    this.title=`SPU总数`;
                    this.tableData.list = res.data;
                    this.tableData.list.forEach(k=>{
                        let time = new Date(k.dateline*1000);
                        let Time =this.toTime(time);
                        this.$set(k,'time',Time)
                    });
                    this.loading = false;
                    this.firstLoading = false;
                    this.count=res.count
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                    this.loading = false;
                    this.firstLoading = false;
                });

            },
            toTime(time){
                let Y = time.getFullYear() + '-';
                let M = (time.getMonth()+1 < 10 ? '0'+(time.getMonth()+1) : time.getMonth()+1) + '-';
                let D = time.getDate() + ' ';
                return Y+M+D;
            },
            get_spu(){
                this.$nextTick(()=>{
                    let data ={
                        channel_id:this.spuRes.channel_id,
                        account_id:this.spuRes.account_id,
                        dateline:this.spuRes.dateline,
                        shelf_id:this.spuRes.shelf_id
                    };
                    this.$set(data,'page',this.details.page);
                    this.$set(data,'pageSize',this.details.pageSize);
                    this.$http(api_off_spu,data).then(res=>{
                        this.spuForm.list=res.data;
                        this.spuForm.total=res.count;
                        this.spuForm.page=Number(res.page);
                        this.spuForm.pageSize=Number(res.pageSize);
                        this. dialogShow=true;
                    }).catch(err=>{
                        console.log(err)
                    });
                    this.details.page = 1
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
            change_status(val){
                this.searchData.channel_id = val;
                this.tableData.list=[];
                this.searchData.date_b = '';
                this.searchData.date_e = '';
            },
            sortChange(order) {
                this.searchData.sort_val = order;
                this.init()
            }
        },
        components:{
            searchTime:require('./search-time.vue').default,
            dataTable:require('./data-table.vue').default,
            requestButton:require('../../../../global-components/request-button').default,
            exportDialog:require('../../export-dialog.vue').default,
            dialogModule:require('./dialog.vue').default,
        }
    }
</script>

<style scoped>

</style>
