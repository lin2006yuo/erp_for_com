<template>
    <div class="p-place-index">
        <card-search @search="search" :form="form" @error-info-search="error_info_search" :clears="clears"></card-search>
        <table-data :table-data="tableData"
                    @size-change="size_change"
                    @current-change="current_change"
                    :loading="loading"
                    class="mt-sm"
                    :init_params=" init_params"
                    @change="init"
                    :isFirst="isFirst">
        </table-data>
        <error-info-search v-model="errorInfoDialog" ></error-info-search>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_providers_exception} from '../../../../api/packages';
    export default {
        permission:{

        },
        page:{},
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
                    shipping_id:'',
                    snType:'number',
                    snText:'',
                    providers_error_info: '',
                    snDate:'pay_time',
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                },
                clears:{
                    shipping:[],
                    snType:'order_number',
                    snDate:'pay_time',
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                },
                errorInfoDialog:false
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
                    snDate:this.form.snDate,
                    page:this.tableData.page,
                    pageSize:this.tableData.pageSize
                };
                this.form.channel_id&&(params.channel_id = this.form.channel_id);
                this.form.channel_account_id&&(params.channel_account_id = this.form.channel_account_id);
                this.form.warehouse_id&&(params.warehouse_id = this.form.warehouse_id);
                this.form.site_code&&(params.site_code = this.form.site_code);
                this.form.providers_error_info.trim()&&(params.providers_error_info = this.form.providers_error_info.trim());
                this.form.shipping.length===1 && (params.carrier_id = this.form.shipping[0]);
                this.form.shipping.length===2 && (params.shipping_id = this.form.shipping[1]);
                if(this.form.snText.trim()){
                    let list = this.form.snText.split('\n').map(row=>row.trim()).filter(row=>row!=='');
                    params.snText = list.length<=1?this.form.snText.trim():list;
                }
                if(this.form.date_e){
                    let cur = new Date(this.form.date_e);
                    params.date_e = datef('YYYY-MM-dd',cur/1000);
                }
                if(this.form.date_b){
                    let cur = new Date(this.form.date_b);
                    params.date_b = datef('YYYY-MM-dd',cur/1000);
                }
                return params
            },
            init(){
                let params = this.init_params();
                this.loading = true;
                this.$http(api_get_providers_exception,params).then(res=>{
                    this.loading = false;
                    this.isFirst = false;
                    this.tableData.list = res.data;
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
            error_info_search(){
                this.errorInfoDialog = true;
            }
        },
        components: {
            cardSearch:require('./card-search.vue').default,
            tableData:require('./table-data.vue').default,
            errorInfoSearch:require('./error-info-search').default,
        }
    }
</script>
