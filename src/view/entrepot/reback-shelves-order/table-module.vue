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
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
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
                min-width="120"
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
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
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
    import {api_look_reback_shelves_order} from '@/api/return-shelves'
    export default {
        data(){
            return {
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
        computed: {
            emptyText(){
                return this.firstLoading ? '等待查询数据中...' : '暂无数据'
            }
        },
        props: {
            searchData:{},
            tableData: {},
            loading: {},
            total: {},
            firstLoading: {}
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,
            createOrder:require('./create-order').default
        },
    }
</script>
