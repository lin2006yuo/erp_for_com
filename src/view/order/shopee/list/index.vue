<template>
    <page class="p-index">
        <search-list :buttons="buttons"
                     @select="changeSelect"
                     @search_list="search_list"
                     :clears="clears"
                     :search-data="searchData"></search-list>
        <div class="mt-sm ml-sm mb-sm">
            <el-button type="primary" size="mini" class="inline"
                       @click.native="verification">手动核查订单</el-button>
        </div>
        <data-table :data-table="dataTable"
                    class="mt-xs"
                    :loading="loading"
                    :first-loading="firstLoading"
                    :export_data="export_data"
                    @sort-click="sort_click"></data-table>
        <!--分页-->
        <div class="block">
            <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[20,50,100,200,500]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <verification-order v-model="verificationDialog" cur-platform="Shopee"></verification-order>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import searchList from './searchList.vue';
    import dataTable from './data-table.vue';
    import {api_order_shopee_list, api_order_shopee_status} from '../../.././../api/order_shopee';

    export default {
        page: {
            devinfo: {
                frontEnd: '覃宏峰',
                backEnd: '詹熏欣',
                createTime: '2018-5-23',
                updateTime: '2018-5-23'
            }
        },
        refresh() {
            this.buttons = [];
            this.get_status();
            this.init();
        },
        data() {
            return {
                firstLoading:true,
                verificationDialog:false,
                is_batch: "",
                buttons: [],
                dataTable: [],
                total: 0,
                page: 1,
                pageSize: 50,
                searchData: {
                    sn_type: 'order_sn',
                    sn_text: '',
                    site:'',
                    account_id: '',
                    time_st: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    time_nd: Date.now(),
                    order_status: 0,
                    order_field: '',
                    order_val: '',
                },
                clears: {
                    sn_type: 'order_sn',
                    time_st: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    time_nd: Date.now(),
                },
                loading: false
            }
        },
        mounted() {
            this.get_status();
        },
        methods: {
            verification(){
                this.verificationDialog = true;
            },
            get_status() {
                let data = this.get_params();
                data.order_status = 0;
                this.$http(api_order_shopee_status, data).then(res => {
                    res.forEach(btn=>{
                        this.$set(btn,'value',btn.id);
                    });
                    if (this.buttons.length === 0) {
                        this.buttons = res;
                    } else {
                        this.buttons.forEach(button => {
                            let find = res.find(row => {
                                return button.id === row.id
                            });
                            if (find) {
                                button.count = find.count;
                            }
                        });
                    }
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                })
            },
            get_params() {
                let data = window.clone(this.searchData);
                this.$set(data, 'page', this.page);
                this.$set(data, 'pageSize', this.pageSize);
                let curString = data.sn_text.trim();
                if (curString.length > 0) {
                    data.sn_text = data.snType === 'item_id' ? curString.split('\n').map(row => row.trim()).filter(row => row !== '') : curString.replace(/\s/g, '\n').split('\n').map(row => row.trim()).filter(row => row !== '');
                }
                if (!!data.time_st) {
                    data.time_st = datef('YYYY-MM-dd', data.time_st / 1000);
                } else {
                    data.time_st = ''
                }
                if (!!data.time_nd) {
                    data.time_nd = datef('YYYY-MM-dd', data.time_nd / 1000);
                } else {
                    data.time_nd = ''
                }
                return data;
            },
            init() {
                this.loading = true;
                this.dataTable = [];
                this.$http(api_order_shopee_list, this.get_params()).then(res => {
                    this.dataTable = res.list;
                    this.dataTable.forEach((data, i) => {
                        this.$set(this.dataTable[i], 'show', false);
                        this.$set(this.dataTable[i], 'isCheck', false);
                    });
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        message: code.message || code,
                        type: 'error'
                    });
                    this.loading = false;
                })
            },
            //            表格升降序
            sort_click(val) {
                switch (val.label) {
                    case "支付总额":
                        this.searchData.order_field = "total_amount";
                        break;
                    case "下单时间":
                        this.searchData.order_field = "create_time";
                        break;
                    case "最迟发货时间":
                        this.searchData.order_field = "last_time";
                        break;
                }
                this.searchData.order_val = val.order;
                this.init();
            },
            changeSelect(item) {
                this.searchData.order_status = item.id;
                this.init();
            },
            handleSizeChange(val) {//---------------分页每页显示条数
                this.pageSize = val;
                this.init();
            },
            handleCurrentChange(val) {//------------分页当前页
                this.page = val;
                this.init();
            },
            search_list() {
                this.get_status();
                this.init();
            },
        },
        computed: {
            export_data() {
                return this.get_params();
            }
        },
        components: {
            searchList,
            dataTable,
            verificationOrder:require('../../verification-order.vue').default,
        }
    }
</script>
