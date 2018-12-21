<template>
    <page class="p-index">
        <card-search :searchData="searchData" @search="search" :clears="clears"></card-search>
        <permission tag="trendsSelect"
                    class="inline ml-sm mr-xs mt-sm"
                    type="primary"
                    :route="apis.url_wish_account_export"
                    :selects="partAllOptions"
                    @trigger="export_wish"></permission>
        <table-list class="mt-sm" :table="table" :loading="loading" :firstTime="firstTime" @select-change="select_change"
                    @sizeChange="handleSizeChange" @pageChange="handleCurrentChange"
        ></table-list>
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>

<style scoped>

</style>

<script>
    import {downloadFile} from '../../../../lib/http';
    import {api_wish_account_list,api_wish_account_export,url_wish_account_export} from '@/api/wish-cash-account'
    export default {
        permission:{
            url_wish_account_export
        },
        page:{
            devinfo:{
                frontEnd:'陆城锫',
                backEnd:'王威',
                createTime:'2018-12-12',
                updateTime:''
            }
        },
        data() {
            return {
                searchData: {
                    account_ids:'',
                    seller_id:'',
                    date_s:new Date(new Date().getFullYear(), new Date().getMonth()-1, 1),
                    date_e:this.lastDay()
                },
                table:{
                    list:[],
                    page:1,
                    pageSize:20,
                    total:0
                },
                clears:{
                    account_ids:'',
                    seller_id:'',
                    date_s:new Date(new Date().getFullYear(), new Date().getMonth()-1, 1),
                    date_e:this.lastDay()
                },
                loading:false,
                firstTime:true,
                export_visible:false,
                partAllOptions: [
                    {name: "部分导出", value: 0},
                    {name: "全部导出", value: 1}
                ],
                ids:[],
                flag:true
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            search() {
                this.init()
            },
            lastDay(){
                let time = new Date();
                let year = time.getFullYear();
                let month = time.getMonth();
                if(month===0){
                    month = 12;
                    year = year-1
                }else if(month<10){
                    month='0'+month;
                }
                let myDate = new Date(year,month,0);
                let lastDay = year+'-'+month+'-'+myDate.getDate();
                return lastDay
            },
            init(){
                let data = this.init_params();
                if(!data.date_s) data.date_s='';
                if(!data.date_e) data.date_e = '';
                this.loading = true;
                if(this.flag){
                    this.flag = false;
                    this.$http(api_wish_account_list,data).then(res=>{
                        this.loading = false;
                        this.firstTime = false;
                        this.flag = true;
                        this.table.list = res.data;
                        this.table.total = res.count;
                    }).catch(err=>{
                        console.log(err);
                        this.loading = false;
                        this.firstTime = false
                    })
                }
            },
            init_params(){
                let data = window.clone(this.searchData);
                if(this.searchData.date_s){
                   data.date_s= datef('YYYY-MM-dd', new Date(this.searchData.date_s).getTime()/1000)
                }else {
                    data.date_s = ''
                };
                if(this.searchData.date_e) {
                    data.date_e=datef('YYYY-MM-dd', new Date(this.searchData.date_e).getTime()/1000)
                }else {
                    data.date_e = ''
                };
                this.table.page&&(data.page = this.table.page);
                this.table.pageSize&&(data.pageSize = this.table.pageSize)
                return data
            },
            export_wish(val){
                let account_ids = this.ids.map(k=>k.account_id).join(',');
                if(val.value===0&&!!this.ids.length){
                    let data = this.init_params();
                    this.$set(data,'account_ids',account_ids);
                    return this.$http(api_wish_account_export,data).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.export_visible = true;
                        return Promise.resolve();
                    })
                }else if(val.value===1){
                    let data = this.init_params();
                    return this.$http(api_wish_account_export,data).then(res=>{
                        if (res.join_queue === 1) {
                            this.export_visible = true;
                            this.$message({type: "success", message: res.message || res});
                        }
                    })
                }else {
                    this.$message({type:'warning',message:'请选择需要导出的数据'})
                }
                return Promise.resolve()
            },
            select_change(val){
                this.ids = val
            },
            handleSizeChange(val){
                this.table.pageSize = val;
                this.init()
            },
            handleCurrentChange(val){
                this.table.page = val;
                this.init()
            }
        },
        components:{
            cardSearch:require('./card-search').default,
            tableList:require('./table-list').default,
            exportDialog: require('../../../report/export-dialog').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            exportField: require("@/components/export-field").default,
        }
    }
</script>

