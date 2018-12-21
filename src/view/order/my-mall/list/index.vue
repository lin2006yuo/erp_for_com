<template>
    <page class="p-index">
        <search-list :buttons="buttons"
                     @select="changeSelect"
                     @search_list="search_list"
                     :clears="clears"
                     :search-data="searchData"></search-list>
        <div class="mt-sm mb-sm ml-sm">
            <el-button type="primary" size="mini" class="inline"
                       @click.native="verification">手动核查订单</el-button>
        </div>
        <data-table :data-table="dataTable"
                    class="mt-xs"
                    :loading="loading"
                    :firstLoading="firstLoading"
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
        <verification-order v-model="verificationDialog" cur-platform="Mymall"></verification-order>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import searchList from './searchList.vue';
    import dataTable from './data-table.vue';
    import {api_order_pandao_list, api_order_pandao_status} from '../../.././../api/order_pandao';

    export default {
        page: {
            devinfo: {
                frontEnd: '覃宏峰',
                backEnd: '李佰敏',
                createTime: '2018-5-28',
                updateTime: '2018-5-28'
            }
        },
        refresh() {
            this.buttons = [];
            this.get_status();
            this.init();
        },
        data() {
            return {
                firstLoading: true,
                verificationDialog:false,
                is_batch: "",
                buttons: [],
                dataTable: [],
                total: 0,
                page: 1,
                pageSize: 50,
                searchData: {
                    snType: 'order_id',
                    snText: '',
                    account_id: '',
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    status: 0,
                    sort_field: '',
                    sort_type: '',
                },
                clears: {
                    snType: 'order_id',
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now()
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
                data.status = -1;
                this.$http(api_order_pandao_status, data).then(res => {
                    res.forEach(btn=>{
                        this.$set(btn,'value',btn.code);
                    });
                    if (this.buttons.length === 0) {
                        this.buttons = res;
                    } else {
                        this.buttons.forEach(button => {
                            let find = res.find(row => {
                                return button.code === row.code
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
                let curString = data.snText.trim();
                if (curString.length > 0) {
                    let cur = data.snType === 'product_id' ? curString.split('\n').map(row => row.trim()).filter(row => row !== '') : curString.replace(/\s/g, '\n').split('\n').map(row => row.trim()).filter(row => row !== '');
                    data.snText = cur.length > 1 ? JSON.stringify(cur) : curString;
                }
                if (!!data.date_b) {
                    data.date_b = datef('YYYY-MM-dd', data.date_b / 1000);
                } else {
                    data.date_b = ''
                }
                if (!!data.date_e) {
                    data.date_e = datef('YYYY-MM-dd', data.date_e / 1000);
                } else {
                    data.date_e = ''
                }
                return data;
            },
            init() {
                this.loading = true;
                this.dataTable = [];
                this.$http(api_order_pandao_list, this.get_params()).then(res => {
                    this.dataTable = res.data;
                    this.dataTable.forEach((data, i) => {
                        this.$set(this.dataTable[i], 'show', false);
                        this.$set(this.dataTable[i], 'isCheck', false);
                    });
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading =false
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
                        this.searchData.sort_type = "cost";
                        break;
                    case "付款时间":
                        this.searchData.sort_type = "order_time";
                        break;
                    case "平台发货状态":
                        this.searchData.sort_type = "shipping_time";
                        break;
                    case "下单时间":
                        this.searchData.sort_type = "order_time";
                        break;
                    case "最迟发货时间":
                        this.searchData.sort_type = "latest_shipped_time";
                        break;
                }
                this.searchData.sort_val = val.order === 'asc' ? 1 : 2;
                this.init();
            },
            changeSelect(item) {
                this.searchData.status = item.code;
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
