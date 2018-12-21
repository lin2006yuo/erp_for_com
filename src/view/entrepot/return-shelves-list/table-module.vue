<template>
    <div>
        <el-table
                :data="tableData"
                v-resize="{height:41}"
                v-loading="loading"
                @select="selectCheck($event)"
                @select-all="selectCheck"
                class="scroll-bar"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
            <el-table-column
                type="selection"
                width="50">
            </el-table-column>
            <el-table-column
                    inline-template
                    label="上架单号">
                <div>
                    <ui-tip :content="row.id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="上架区">
                <div>
                    <ui-tip :content="row.warehouse_area_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                width="150"
                label="数量（待上架数/总数）">
                <div>
                    <ui-tip :content="`${row.quantity_left}/${row.quantity}`" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="状态">
                <div>
                    <ui-tip :content="row.status_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="创建人">
                <div>
                    <ui-tip :content="row.creator_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="创建时间">
                <div>
                    <ui-tip :content="row.create_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="更新时间">
                <div>
                    <ui-tip :content="row.update_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="操作">
                <div>
                    <span class="operate" @click="look(row)">查看</span>
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
        <create-order v-model="createVisible"
                      :trend-action="trendAction"
                      :detail-data="detailData"
                      :order-data="orderData">
        </create-order>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_return, api_look_shelves,api_get_return_reback_shelves_order,api_look_reback_shelves_order} from '../../../api/return-shelves'
    export default {
        data(){
            return {
                loading:false,
                tableData:[],
                total:0,
                checkData:[],
                createVisible:false,
                orderData:[],
                detailData:[],
                trendAction:{}
            }
        },
        mounted(){
        },
        filters:{
            timeFilter(val){
                if(val){
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
        },
        methods: {
            init(){
                this.tableData = [];
                this.loading = true;
                let data = window.clone(this.searchData);
                this.$http(api_get_return_reback_shelves_order, data).then(res=>{
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code=>{
                    this.loading = false;
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
            selectCheck(select){
                this.checkData = select;
                this.$emit('select-check', this.checkData);
            },
            look(row){
                this.orderData.length = 0;
                this.$http(api_look_reback_shelves_order, row.id).then(res=>{
                    this.trendAction.number = row.id;
                    this.orderData.push(res.data);
                    this.detailData = res.data.details;
                    this.createVisible = true;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            }
        },
        computed: {},
        watch: {},
        props: {
            searchData:{},
        },
        components: {
            uiTip:require('../../../components/ui-tip.vue').default,
            createOrder:require('./create-order').default
        },
    }
</script>
