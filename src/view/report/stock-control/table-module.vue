<template>
    <div class="p-stock-control">
        <el-table :data="tableData"
                  v-resize="{height:41}"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  class="table-module"
                  highlightCurrentRow>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                请查询数据！
            </div>
            <el-table-column
                    inline-template
                    label="编号">
                <div>
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="250"
                    inline-template
                    label="SKU别名">
                <div>
                    <ui-tip :content="row.sku_alias" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="中文配货名称">
                <div>
                    <ui-tip :content="row.packing_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="250"
                    inline-template
                    label="中文名称">
                <div>
                    <ui-tip :content="row.name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="产品状态">
                <div>
                    <ui-tip :content="row.status" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="110"
                    inline-template
                    label="品类">
                <div>
                    <ui-tip :content="row.category" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="开发员">
                <div>
                    <ui-tip :content="row.developer_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="采购员">
                <div>
                    <ui-tip :content="row.purchaser_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="100"
                    inline-template
                    label="导入系统时间">
                <div>
                    <ui-tip :content="row.create_time" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="上次采购价">
                <div>
                    <ui-tip :content="row.last_purchase_price" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="当前成本">
                <div>
                    <ui-tip :content="row.cost_price" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="价格差值">
                <div>
                    <ui-tip :content="row.diff_price" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="重量">
                <div>
                    <ui-tip :content="row.weight" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="7天销量">
                <div>
                    <ui-tip :content="row.seven_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="7天营业额">
                <div>
                    <ui-tip :content="row.seven_amount" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="100"
                    inline-template
                    label="7天销售成本">
                <div>
                    <ui-tip :content="row.seven_cost" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="100"
                    inline-template
                    label="7天周转天数">
                <div>
                    <ui-tip :content="row.seven_turn_days" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="30天销量">
                <div>
                    <ui-tip :content="row.thirty_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="30天营业额">
                <div>
                    <ui-tip :content="row.thirty_amount" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="100"
                    inline-template
                    label="30天销售成本">
                <div>
                    <ui-tip :content="row.thirty_cost" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="100"
                    inline-template
                    label="30天周转天数">
                <div>
                    <ui-tip :content="row.thirty_turn_days" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="90天销量">
                <div>
                    <ui-tip :content="row.ninety_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="90天营业额">
                <div>
                    <ui-tip :content="row.ninety_amount" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="100"
                    inline-template
                    label="90天销售成本">
                <div>
                    <ui-tip :content="row.ninety_cost" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="100"
                    inline-template
                    label="90天周转天数">
                <div>
                    <ui-tip :content="row.ninety_turn_days" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="100"
                    inline-template
                    label="可用库存数量">
                <div>
                    <ui-tip :content="row.available_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="100"
                    inline-template
                    label="待发库存数量">
                <div>
                    <ui-tip :content="row.waiting_shipping_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="在途数量">
                <div>
                    <ui-tip :content="row.instransit_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="150"
                    inline-template
                    label="库存总金额（包括在途）">
                <div>
                    <ui-tip :content="row.stock_amt" :width="98"></ui-tip>
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
    .p-stock-control{
        .table-module .el-table__empty-text{
            /*left: 35% !important;*/
            position: fixed;
            top :50%;
            left :50%;
        }
        .el-table__body-wrapper {
            overflow: auto;
        }
        @media screen and (max-width: 1366px) {
            .table-module .el-table__empty-text{
                left: 28% !important;
            }
        }
    }
</style>
<script>
    import {api_get_stock, api_export_stock} from '../../../api/stock-control'
    export default {
        data(){
            return {
                tableData:[],
                loading:false,
                total:0
            }
        },
        mounted(){
        },
        methods: {
            async init(){
                try {
                    this.loading = true;
                    let data = this.deal_time(this.searchData);
                    const res = await this.$http(api_get_stock, data);
                    this.tableData = res.data;
                    this.total = res.count;
                } catch (code){
                    this.$message({type:"error",message:code.message || code});
                } finally {
                    this.loading = false;
                }
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
                data.category_id = data.category_id[data.category_id.length-1];
                data.sku_ids = data.sku_ids.join(',');
                return data;
            },
            exports(){
                let data = this.deal_time(this.searchData);
                return this.$http(api_export_stock, data).then(res=>{
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
                this.init()
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
        },
        computed: {},
        watch: {
            searchData(){
                this.init();
            }
        },
        props: {
            searchData:{}
        },
        components: {
            uiTip:require('../../../components/ui-tip.vue').default
        },
    }
</script>
