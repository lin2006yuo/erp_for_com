<template>
    <div class="c-table-data">
        <el-table
                class="scroll-bar"
                v-resize="{height:41}"
                :data="tableData.lists"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                highlight-current-row
                @selection-change="handle_selection_change">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>

            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>

            <el-table-column label='返款申请单号' prop="refund_number">

            </el-table-column>

            <el-table-column label='任务编号' prop="task_number">

            </el-table-column>

            <el-table-column label='平台/站点'>
                <template slot-scope="scope">
                    <div>{{scope.row.channel_id|textFilter}}</div>
                    <div>{{scope.row.site|textFilter}}</div>
                </template>
            </el-table-column>

            <el-table-column label='账号简称' prop="account_name">

            </el-table-column>

            <el-table-column label='销售员' prop="seller_name">

            </el-table-column>

            <el-table-column label="交易订单号" prop="order_number">

            </el-table-column>

            <el-table-column label="运单类型">
                <template slot-scope="scope">
                    <span>{{scope.row.shipping_type?scope.row.shipping_type:'--'}}</span>
                </template>
            </el-table-column>

            <el-table-column label="SKU/ASIN">
                <template slot-scope="scope">
                    <div>{{scope.row.sku|textFilter}}</div>
                    <div>{{scope.row.asin|textFilter}}</div>
                </template>
            </el-table-column>
            <el-table-column label="返款总额">
                <template slot-scope="scope">
                    <span>{{scope.row.refund_currency}}{{scope.row.refund_cost}}</span>
                </template>
            </el-table-column>
            <el-table-column label="返款方式" prop="refund_type">
            </el-table-column>

            <el-table-column label="审核状态" prop="postil_status">

            </el-table-column>

            <el-table-column label="返款状态" prop="refund_status">

            </el-table-column>

            <el-table-column label="负责人/审核人">
                <template slot-scope="scope">
                    <div>{{scope.row.functionary_name|textFilter}}</div>
                    <div>{{scope.row.audit_id_name|textFilter}}</div>
                </template>
            </el-table-column>

            <el-table-column label="申请时间/审核时间" width="140">
                <template slot-scope="scope">
                    <div>{{scope.row.created_time?scope.row.created_time:'-- --'}}</div>
                    <div>{{scope.row.status_time?scope.row.status_time:'-- --'}}</div>
                </template>
            </el-table-column>

            <el-table-column label="返款人/返款时间" width="140">
                <template slot-scope="scope">
                    <div>{{scope.row.refund_id_name?scope.row.refund_id_name:'--'}}</div>
                    <div>{{scope.row.refund_time?scope.row.refund_time:'-- --'}}</div>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="130" inline-template>
                <trends-select class="inline" @trigger="trigger_select(row,$event)" :selects="select_option(row)" type="primary"></trends-select>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="tableData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size=tableData.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {}
        },
        filters:{
            textFilter(val){
                return val?val:'--'
            },
        },
        methods:{
            trigger_select(val,action){
                this.$emit("trigger-select",val,action);
            },
            select_option(row){
                if(row.postil_status === '待审核'){
                    return this.operationList.filter(params=>{
                        return params.value === 1||params.value === 2
                    });
                }else if(row.postil_status === '审核通过'){
                    return this.operationList.filter(params=>{
                        return params.value === 1
                    });
                }else if(row.postil_status === '审核不通过'){
                    return this.operationList.filter(params=>{
                        return params.value === 1||params.value === 3
                    });
                }
            },
            handle_selection_change(val) {
                this.$emit('handle-selection-change',val)
            },
            size_change(size){
                this.$emit('size-change',size);
            },
            current_change(page){
                this.$emit('current-change',page);
            },
        },
        computed:{
            emptyText() {
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        props:{
            tableData:{
                type:Object,
                required:true,
            },
            loading:{
                type:Boolean,
                required:true,
            },
            firstLoading:{
                type:Boolean,
                required:true,
            },
            operationList:{
                type:Array,
                require:true
            }
        },
        components: {
            trendsSelect:require('@/components/trends-select.vue').default
        }
    }
</script>