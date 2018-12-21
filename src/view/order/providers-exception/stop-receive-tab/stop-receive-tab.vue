<template>
    <div class="p-package-index">
        <card-search @search="search" :form="form" :clears="clears"></card-search>
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
    import {api_get_packages_stop_collecting} from '@/api/stop-receive-tab';
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
                    channel_id:'',
                    account_id:'',
                    warehouse_id:'',
                    site_code:'',
                    snType:'channel_order_number',
                    snText:''
                },
                clears:{
                    channel_id:'',
                    account_id:'',
                    warehouse_id:'',
                    site_code:'',
                    snType:'channel_order_number',
                    snText:''
                }
            }
        },
        created(){
            this.init();
        },
        methods:{
            search(){
                this.init();
            },
            init_params(){
                let params = {
                    snType:this.form.snType,
                    page:this.tableData.page,
                    pageSize:this.tableData.pageSize
                };
                this.form.channel_id&&(params.channel_id = this.form.channel_id);
                this.form.account_id&&(params.account_id = this.form.account_id);
                this.form.site_code&&(params.site_code = this.form.site_code);
                this.form.warehouse_id&&(params.warehouse_id = this.form.warehouse_id);
                if(this.form.snText){
                    let list = this.form.snText.split('\n').filter(row=>!!row);
                    params.snText = list.length<=1?this.form.snText:list;
                }
                return params
            },
            init(){
                let params = this.init_params();
                this.loading = true;
                this.$http(api_get_packages_stop_collecting,params).then(res=>{
                    this.loading = false;
                    this.isFirst = false;
                    this.tableData.list = res.data;
                    this.tableData.total = res.count;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code})
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
