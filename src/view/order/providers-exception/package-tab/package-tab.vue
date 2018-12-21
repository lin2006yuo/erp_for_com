<template>
    <div class="p-package-index">
        <card-search @search="search" :form="form" :buttons="buttons" :clears="clears"></card-search>
        <table-data :table-data="tableData"
                    @size-change="size_change"
                    @current-change="current_change"
                    :loading="loading"
                    :isFirst="isFirst"
                    class="mt-sm">
        </table-data>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_package_collection_wait_problem,api_package_collection_wait_problem_type} from '@/api/packages-tab';
    export default {
        permission:{

        },
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'詹熏欣，张文宇',
                createTime:'2018-5-23',
                updateTime:'2018-5-23'
            }},
        refresh(){
            this.init();
        },
        data() {
            return {
                isFirst:true,
                loading:false,
                tableData:{
                    list:[],
                    page:1,
                    pageSize:50,
                    total:0,
                },
                form:{
                    shipping:[],
                    channel_id:'',
                    channel_account_id:'',
                    warehouse_id:'',
                    site_code:'',
                    sn_type:'order_no',
                    sn_text:'',
                    time_st: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    time_nd: Date.now(),
                    exception_type:0
                },
                clears:{
                    shipping:[],
                    sn_type:'order_no',
                    time_st: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    time_nd: Date.now(),
                },
                buttons:[]
            }
        },
        created(){
            this.init();
            this.get_package_type();
        },
        methods:{
            get_package_type(){
                this.$http(api_package_collection_wait_problem_type).then(res=>{
                    this.buttons = res;
                }).catch(code=>{
                    console.log(code);
                });
            },
            search(){
                this.init();
            },
            init_params(){
                let params = {
                    sn_type:this.form.sn_type,
                    page:this.tableData.page,
                    pageSize:this.tableData.pageSize,
                    exception_type:this.form.exception_type,
                    time_type:1
                };
                this.form.channel_id&&(params.channel_id = this.form.channel_id);
                this.form.channel_account_id&&(params.channel_account_id = this.form.channel_account_id);
                this.form.site_code&&(params.site_code = this.form.site_code);
                this.form.warehouse_id&&(params.warehouse_id = this.form.warehouse_id);
                if(this.form.sn_text){
                    let list = this.form.sn_text.split('\n').filter(row=>!!row);
                    params.sn_text = list.length<=1?this.form.sn_text:list;
                }
                if(this.form.time_nd){
                    let cur = new Date(this.form.time_nd);
                    params.time_nd = datef('YYYY-MM-dd',cur/1000);
                }
                if(this.form.time_st){
                    let cur = new Date(this.form.time_st);
                    params.time_st = datef('YYYY-MM-dd',cur/1000);
                }
                return params
            },
            init(){
                let params = this.init_params();
                this.loading = true;
                this.$http(api_package_collection_wait_problem,params).then(res=>{
                    this.loading = false;
                    this.isFirst = false;
                    this.tableData.list = res.list;
                    this.tableData.total = res.count;
                }).catch(code=>{
                    this.loading = false;
                    console.log(code);
                })
            },
            current_change(val){
                this.tableData.page = val;
                this.init();
            },
            size_change(val){
                this.tableData.pageSize = val;
                this.init();
            },

        },
        components: {
            cardSearch:require('./card-search.vue').default,
            tableData:require('./table-data.vue').default,
        }
    }
</script>
