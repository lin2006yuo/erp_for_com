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
            <el-table-column key="account_code" label="账号简称" v-if="is_salesman">
            </el-table-column>
            <el-table-column label="销售员" >
            </el-table-column>
            <el-table-column  label="销售组长" v-if="is_salesman">
            </el-table-column>
            <el-table-column label="订单数" >
            </el-table-column>
            <el-table-column label="售价CNY" >
            </el-table-column>
            <el-table-column label="平台费用CNY" >
            </el-table-column>
            <el-table-column label="P卡费用" >
            </el-table-column>
            <el-table-column label="物流费用" >
            </el-table-column>
            <el-table-column label="包装费用" >
            </el-table-column>
            <el-table-column label="头程报关费" >
            </el-table-column>
            <el-table-column label="商品成本" >
            </el-table-column>
            <el-table-column label="毛利" >
            </el-table-column>
            <el-table-column label="转运费"  v-if="is_overwarehouse">
            </el-table-column>
            <el-table-column label="退款" >
            </el-table-column>
            <el-table-column label="实际利润" >
            </el-table-column>
            <el-table-column label="利润率" >
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
            is_overwarehouse(){
                return this.searchData.report_type !== 'overseas';
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
