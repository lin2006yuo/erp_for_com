<template>
    <div>
        <search @search="init"
                :form="form"
                :buttons="buttons"
                :clears="clears"
                @error-info-search="error_info_search">
        </search>
        <table-data :table-datas="tableDatas"
                    :loading="loading"
                    @current_change="change_current"
                    @size_change="change_size"
                    :isFirst="isFirst"
                    :init_params=" init_params">
        </table-data>
    </div>
</template>

<style lang="stylus" >

</style>

<script>
    import {api_package_exception_status,api_package_exception_list} from '../../../../api/shipment';
    export default {
        name: "abnormal-tab",
        data() {
            return {
                form:{
                    status:0,
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
                buttons:[],
                clears:{
                    shipping:[],
                    snType:'order_number',
                    snDate:'pay_time',
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                },
                tableDatas:{
                    list:[],
                    page:1,
                    pageSize:50,
                    total:0
                },
                loading:false,
                isFirst:false
            }
        },
        refresh(){
            this.init();
        },
        created() {
            this.get_abnormal_buttons();
            this.init();
        },
        computed: {},
        watch: {},
        methods: {
            get_abnormal_buttons(){
                this.$http(api_package_exception_status).then(res=>{
                    this.buttons = res.map(row=>{
                        return {label:row.remark,value:row.code};
                    });
                }).catch(code=>{
                    console.log(code);
                });
            },
            error_info_search(){},
            init_params(){
                let params = {
                    status:this.form.status,
                    snType:this.form.snType,
                    snDate:this.form.snDate,
                    page:this.tableDatas.page,
                    pageSize:this.tableDatas.pageSize
                };
                this.form.channel_id&&(params.channel_id = this.form.channel_id);
                this.form.channel_account_id&&(params.channel_account_id = this.form.channel_account_id);
                this.form.warehouse_id&&(params.warehouse_id = this.form.warehouse_id);
                this.form.site_code&&(params.site_code = this.form.site_code);
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
                this.$http(api_package_exception_list,params).then(res=>{
                    this.loading = false;
                    this.isFirst = false;
                    this.tableDatas.list = res.data;
                    this.tableDatas.total = res.count;
                }).catch(code=>{
                    this.loading = false;
                    console.log(code);
                })
            },
            change_current(page){
                this.tableDatas.page = page;
                this.init();
            },
            change_size(size){
                this.tableDatas.pageSize = size;
                this.init();
            }
        },
        props: {},
        components: {
            search:require('./search.vue').default,
            tableData:require('./table-data').default
        },
    }
</script>

