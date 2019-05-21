<template>
    <page class="refund-apply">
        <search :clears="clears"
                :searchData="searchData"
                @search="search"
                @select-status="select_status"></search>
        <data-table :tableData="tableData"
                    :search-data="searchData"
                    :payment-status="searchData.status"
                    @sort-change="sort_change"
                    :loading="loading"
                    :first-loading="firstLoading"
                    @reflash="search"
                    @search="search">
        </data-table>
        <el-pagination
            class="page-fixed"
            @size-change="size_change"
            @current-change="current_change"
            :current-page="searchData.page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="searchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </page>
</template>

<script>
    import {
        api_ali_pay_time_list,
        url_ali_pay_time_list
    } from "../../../api/ali-last-pay-time";
    export default {
        permission: {
            url_ali_pay_time_list
        },
        page: {
            devinfo: {
                frontEnd: '熊辉',
                backEnd: '陈林深',
                createTime: '',
                updateTime: '',
            }
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                total:0,
                tableData:[],
                loading:true,
                firstLoading: true,
                searchData: {
                    ali1688_account_id: '', //1688账号
                    snType: 'ali_order_id', //id=>退款申请单号  purchase_order_id=>采购单号 external_number=>外部流水号
                    snText: '', //批量搜索
                    date_b:"",
                    date_e:"",
                    page: 1,
                    pageSize: 50,
                },
                clears:{
                    page:1,
                    pageSize:50,
                    snType: 'ali_order_id',
                },
            };
        },
        filters: {},
        mounted() {
            this.init();
        },
        methods: {
            search() {
                this.init();
            },
            init() {
                let data = window.clone(this.searchData);
                if(data.snText.trim()) {
                    data.snText = data.snText.replace(new RegExp(' ', 'gm'), '\n').trim().split('\n').map(row => row.trim()).filter(row => row !== '');
                }else{
                    data.snText = '';
                }
                if (this.searchData.date_b) {
                    let d = new Date(this.searchData.date_b);
                    data.date_b = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
                }else{
                    data.date_b = ''
                }
                if (this.searchData.date_e) {
                    let e = new Date(this.searchData.date_e);
                    data.date_e = e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate()
                }else{
                    data.date_e = ''
                }
                this.loading = true;
                this.sort_field &&this.$set(data,'sort_field',this.sort_field );
                this.sort_type&&this.$set(data,'sort_type',this.sort_type);
                this.$http(api_ali_pay_time_list,data).then(res => {
                    this.tableData = res.data;
                    this.loading = false;
                    this.firstLoading = false;
                    this.total = res.count;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            size_change(val){//更改页条数
                this.searchData.pageSize = val;
                this.init()
            },
            //更改页数
            current_change(val){ //更改页数
                this.searchData.page = val;
                this.init()
            },
            select_status(val){ //更改状态
                this.searchData.status = val;
                this.init();
            },
            sort_change(val){
                if(!val.column||!val.column.label)return;
                console.log('23424', val.column.label);
                switch(val.column.label){
                    case '实付款(元)':
                        this.sort_field = 'payable_amount';
                        break;
                    case '最迟付款时间':
                        this.sort_field = 'payment_last_time';
                        break;
                    default:
                        this.sort_field = '';
                }
                this.sort_type = val.order === 'descending' ? 'desc' : 'asc';
                this.init();
            },
        },
        props: {},
        components: {
            search: require('./search').default,
            dataTable:require('./data-table.vue').default,
        },
    }
</script>

<style lang="stylus">
    .refund-apply{

    }
</style>
