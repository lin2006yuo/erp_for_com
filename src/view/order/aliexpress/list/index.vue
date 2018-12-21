<template>
    <page class="p-index">
        <card-search :form="cardForm"
                     :clears="clears"
                     :buttons="buttons"
                     :accountList="accountList"
                     ref="cardSearch"
                     @batch-search="batch_search"
                     @change-status="change_status"
                     @search-data="search_data"></card-search>
        <data-table
                :dataTable="dataTable"
                @size-change="change_size"
                @page-change="change_page"
                :is-loading="isLoading"
                :first-loading="firstLoading"
                :get-params="get_params"
                @files-update="files_update"
                @sort-click="sort_click"
                @sysc-success="init"
                :search-form="cardForm"
        ></data-table>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {aliexpress_order, api_get_account, api_get_status} from '../../../../api/aliexpress-order';
    import cardSearch from'./card-search.vue';
    import dataTable from'./data-table.vue';
    export default{
        page: {},
        refresh(){
            this.get_status();
            this.init();
        },
        data(){
            return {
                firstLoading: true,
                snType2: '',
                snText2: [],
                buttons: [],
                cardForm: {
                    is_transfer_money:'',
                    snType: "order_id",
                    snText: "",
                    pay_status:'',
                    shipping_status:-1,
                    refund_status:-1,
                    snDate: "transaction_date",
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    account_id: "",
                    orderStatus:-1,
                },
                clears: {
                    is_transfer_money:'',
                    snType: "order_id",
                    snDate: "transaction_date",
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    orderStatus:-1,
                    shipping_status:-1,
                    refund_status:-1,
                },
                accountList: [],
                dataTable: {
                    totalSize: 0,
                    lists: [],
                    page: 1,
                    pageSize: 50
                },
                isLoading: true,
                sort_type: "",
                sort_val: "",
            }
        },
        created(){
            this.get_account();
            this.get_status(true);
        },
        methods: {
            get_params(){
                let params = {
                    page: this.dataTable.page,
                    pageSize: this.dataTable.pageSize,
                    snType: this.cardForm.snType,
                    snText: '',
                    snDate: this.cardForm.snDate,
                    account_id: this.cardForm.account_id,
                    status: this.cardForm.orderStatus,
                    is_transfer_money: this.cardForm.is_transfer_money,
                    shipping_status: this.cardForm.shipping_status,
                    refund_status: this.cardForm.refund_status,
                };
                let curString = this.cardForm.snText.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                params.snText = cur&&cur.length>1?cur.map(row=>row.trim()):this.cardForm.snText;
                this.sort_type && (params.sort_type = this.sort_type);
                this.sort_val && (params.sort_val = this.sort_val);
                this.cardForm.pay_status &&　(params.pay_status = this.cardForm.pay_status);
                if (!!this.cardForm.date_b) {
                    let date_b = new Date(this.cardForm.date_b);
                    params.date_b = datef("YYYY-MM-dd", date_b / 1000);
                } else {
                    params.date_b = "";
                }

                if (!!this.cardForm.date_e) {
                    let date_e = new Date(this.cardForm.date_e);
                    params.date_e = datef("YYYY-MM-dd", date_e / 1000);
                } else {
                    params.date_e = "";
                }
                return params;
            },
            files_update(){
            	this.init();
            },
            init(){
                this.isLoading = true;
                this.dataTable.lists = [];
                this.$http(aliexpress_order, this.get_params()).then(res => {
                    this.dataTable.totalSize = res.count;
                    this.dataTable.lists = res.data;
                    this.dataTable.lists.forEach((list, i) => {
                        this.$set(this.dataTable.lists[i], "show", false);
                        this.$set(this.dataTable.lists[i], "isCheck", false);
                    });
                    this.isLoading = false;
                    this.firstLoading = false;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            batch_search(data, arr){
                this.snType2 = data;
                this.snText2 = arr;
                this.init();
            },
            change_size(size){
                this.dataTable.pageSize = size;
                this.init();
            },
            change_page(page){
                this.dataTable.page = page;
                this.init();
            },
//            表格升降序
            sort_click(val){
                switch (val.label) {
                    case "支付总额":
                        this.sort_type = "pay_amount";
                        break;
                    case "发货状态":
                        this.sort_type = "send_time";
                        break;
                    case "付款状态":
                        this.sort_type = "pay_time";
                        break;
                    case "下单时间":
                        this.sort_type = "create";
                        break;
                    case "最迟发货时间":
                        this.sort_type = "expire";
                        break;
                }
                this.sort_val = val.order === "asc" ? 1 : 2;
                this.init();
            },
            change_status(status){
                this.cardForm.orderStatus = status;
                this.init();
            },
            search_data(){
                this.get_status();
                this.init();
            },
            get_account(){
                this.$http(api_get_account, {channel_id: 4}).then(res => {
                    if (res.account.length > 0) {
                        res = res.account;
                        this.accountList = [{label: "全部", value: ""}, ...res];
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
            get_status(val){
                let params = this.get_params();
                delete params.status;
                delete params.page;
                delete params.pageSize;
                this.$http(api_get_status, params).then(res => {
                    this.buttons = res.map(row => {
                        return {
                            label: row.name,
                            value: row.id,
                            count: row.count,
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            }
        },
        components: {
            cardSearch,
            dataTable
        }
    }
</script>
