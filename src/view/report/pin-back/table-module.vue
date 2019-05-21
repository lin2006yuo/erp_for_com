<template>
    <div>
        <el-table :data="tableData"
                  v-resize="{height:41}"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  class="table-module"
                  show-summary
                  highlightCurrentRow>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                请查询数据！
            </div>
            <el-table-column
                    inline-template
                    width="60"
                    label="SKU">
                <div>
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="货品名称">
                <div>
                    <ui-tip :content="row.goods_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="70"
                    label="退款总额">
                <div>
                    <ui-tip :content="row.total_refund | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="退款（买家未收到货）">
                <div>
                    <ui-tip :content="row.refund_not_received | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="200"
                    label="退款（买家反映物品质量有问题）">
                <div>
                    <ui-tip :content="row.refund_has_problem | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="退款买家反映物品与描述不符">
                <div>
                    <ui-tip :content="row.refund_not_match | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="退款（其他）">
                <div>
                    <ui-tip :content="row.refund_other | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="补发总数量">
                <div>
                    <ui-tip :content="row.total_add_num" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="150"
                    label="补发货（买家未收到货）">
                <div>
                    <ui-tip :content="row.num_not_received" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="补发货（买家反映质量有问题）">
                <div>
                    <ui-tip :content="row.num_has_problem" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="220"
                    label="补发货（买家反映物品与描述不符）">
                <div>
                    <ui-tip :content="row.num_not_match" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="补发货（其他）">
                <div>
                    <ui-tip :content="row.num_other" :width="98"></ui-tip>
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
    import {api_get_refund, api_export_refund} from '../../../api/pin-back'
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
                this.$http(api_get_refund, data).then(res=>{
                    this.loading = false;
                    this.tableData = res.data;
                    this.total = res.count;
                    let flag = this.tableData.length <= 0;
                    this.$emit('can-export', flag);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
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
                data.sku_ids = this.searchData.sku_ids.join(',');
                return data;
            },
            exports(){
                let data = this.deal_time(this.searchData);
                return this.$http(api_export_refund, data).then(res=>{
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
