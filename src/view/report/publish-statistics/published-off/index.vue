<template>
    <page class="p-index">
        <search-time :search-data="searchData" @search="search" @getStatus="getStatus" :account-list="accountList"></search-time>
        <request-button class="mt-xs mb-xs ml-sm"
                        :disabled="tableData.list.length === 0"
                        :request="exports">部分导出</request-button>
        <data-table
                :table-data="tableData"
                :loading="loading"
                :first-loading="firstLoading"
                :count="count"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                v-model="dialogShow"
                @get-spu="get_spu"
                :resSpu.sync="spuRes"
        ></data-table>
        <export-dialog v-model="visible"></export-dialog>
        <dialog-module v-model="dialogShow" :title="title" :spu-form="spuForm"  :info="details"
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
                title:'',
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
                dialogShow:false,
                platform:'',
                visible:false,
                count:1,
                firstLoading:true,
                loading:true,
                searchData:{
                    channel_id:1,
                    date_b:'',
                    date_e:'',
                    account_id:'',
                    spu:'',
                },
                spuRes:{},
                accountList:[],
                tableData:{
                    list:[],
                    page:1,
                    pageSize:20,
                },
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            exports(){
                let data=this.handelTime(this.searchData);
                return this.$http(api_publised_off_export, data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.visible = true;
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            search(val){
                this.searchData.channel_id=val;
                this.init()
            },
            getStatus(val){
                this.loading=true;
                this.searchData.channel_id=val;
                this.$http(api_account_list,{channel_id:this.searchData.channel_id}).then(res=>{
                   this.accountList=[{label: "全部", value: ""},...res.account];
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            //处理时间
            handelTime(searchData) {
                let data = window.clone(searchData)
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
                return data
            },
            init(){
                let data=this.handelTime(this.searchData);
                this.$set(data,'page',this.tableData.page);
                this.$set(data,'pageSize',this.tableData.pageSize);
                this.$http(api_publised_off,data).then(res=>{
                    this.tableData.list = res.data;
                    this.title=`SPU总数`;
                    this.tableData.list.forEach(k=>{
                        let time = new Date(k.dateline*1000);
                        let Time =this.toTime(time);
                        this.$set(k,'time',Time)
                    });
                    this.count=res.count
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                    this.loading = false;
                    this.firstLoading = false;
                });
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
                       console.log(err);
                   });
                   this.details.page = 1;
               })
            },
            toTime(time){
                let Y = time.getFullYear() + '-';
                let M = (time.getMonth()+1 < 10 ? '0'+(time.getMonth()+1) : time.getMonth()+1) + '-';
                let D = time.getDate() + ' ';
                return Y+M+D;
            },
            handleSizeChange(val) {//------------分页
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
        },
        watch:{
            dialogShow(val){
                this.dialogShow=val
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
