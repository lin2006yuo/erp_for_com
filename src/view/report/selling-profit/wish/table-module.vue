<template>
    <div>
        <el-table :data="tableData"
                  highlight-current-row
                  :loading="loading"
                  element-loading-text="玩命加载中"
                  v-resize="{height:41}">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <template v-if="is_salesman">
                <el-table-column key="account_code" label="账号简称" inline-template>
                    <div>
                        <ui-tip :content="row.account_code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
            </template>
            <el-table-column label="销售员" inline-template>
                <div>
                    <ui-tip :content="row.sale_user" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <template v-if="is_salesman">
                <el-table-column key="sale_group_leader" label="销售组长" inline-template>
                    <div>
                        <ui-tip :content="row.sale_group_leader" :width="98"></ui-tip>
                    </div>
                </el-table-column>
            </template>
            <el-table-column label="订单数" inline-template>
                <div>
                    <ui-tip :content="row.order_num" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="售价CNY" inline-template>
                <div>
                    <ui-tip :content="row.sale_amount | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="平台费用CNY" inline-template width="100">
                <div>
                    <ui-tip :content="row.channel_cost | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="P卡费用" inline-template>
                <div>
                    <ui-tip :content="row.p_fee | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="物流费用" inline-template>
                <div>
                    <ui-tip :content="row.shipping_fee | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="包装费用" inline-template>
                <div>
                    <ui-tip :content="row.package_fee | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="头程报关费" inline-template>
                <div>
                    <ui-tip :content="row.first_fee | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="商品成本" inline-template>
                <div>
                    <ui-tip :content="row.goods_cost | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="毛利" inline-template>
                <div>
                    <ui-tip :content="row.gross_profit | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="退款" inline-template>
                <div>
                    <ui-tip :content="row.refund_amount | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="实际利润" inline-template>
                <div>
                    <ui-tip :content="row.profit | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="利润率" inline-template>
                <div>
                    <ui-tip :content="row.profit_rate" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
            class="page-fixed"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page="searchData.page"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="searchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_wish_list, api_export_performance} from '../../../../api/selling-profit';
    export default {
        data(){
            return {
                tableData:[],
                loading:false,
                firstLoading:true,
                total:0,
            }
        },
        mounted(){
        },
        filters:{
            toFixed2(val){
                return Number(val).toFixed(2);
            },
            toFixed0(val){
                return Number(val).toFixed(0);
            }
        },
        methods: {
            init(){
                this.loading = true;
                let data = this.deal_time(this.searchData);
                this.$http(api_wish_list, data).then(res=>{
                    this.loading = false;
                    this.firstLoading = false;
                    this.tableData = res.data;
                    this.total = res.count;
                    let flag = this.tableData.length <= 0;
                    this.$emit('can-export', flag);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                    this.loading = false;
                    this.firstLoading = false;
                });
            },
            //处理年月日
            deal_time(searchData){
                //处理年月日 YYYY-MM-dd
                let data=clone(searchData);
                if(searchData.date_b){
                    data.date_b=datef('YYYY-MM-dd', searchData.date_b/1000);
                }else {
                    data.date_b='';
                }
                if(searchData.date_e){
                    data.date_e=datef('YYYY-MM-dd', searchData.date_e/1000);
                }else {
                    data.date_e='';
                }
                return data;
            },
            exports(){
                let data = this.deal_time(this.searchData);
                return this.$http(api_export_performance, data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.$emit('exports-result', true);
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
        },
        computed: {
            is_salesman(){
                return this.searchData.report_type !== 'seller';
            },
            emptyText() {
                return this.firstLoading ? '等待查询数据中...' : '暂无数据'
            }
        },
        watch: {},
        props: {
            searchData:{},
        },
        components: {
            uiTip:require('../../../../components/ui-tip.vue').default,
        },
    }
</script>
