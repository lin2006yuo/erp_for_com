<template>
    <div>
        <el-table
            class="scroll-bar "
            :data="tableData"
            v-loading="loading"
            v-resize="{height:41}"
            element-loading-text="玩命加载中..."
            highlight-current-row
            @selection-change="selection_change">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="task_number"
                    label="任务编号">
            </el-table-column>
            <el-table-column
                    label="计划下单时间"
                    width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.task_time | dateFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="状态/类型">
                <template slot-scope="scope">
                    <span>{{ scope.row.status_txt }}</span>
                    <br>
                    <span>{{ scope.row.type }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="返款状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.type === '国外刷单'&&scope.row.status === 4">{{ scope.row.refund_status | refundStatusFilter}}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="functionary_name"
                    label="负责人">
            </el-table-column>
            <el-table-column
                    label="图片">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            trigger="hover">
                        <img width="200px" height="200px" :src="scope.row.thumb | filterImage ">
                        <span slot="reference">
                              <img height="60px" width="60px" style="border:none" :src="scope.row.thumb">
                        </span>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    label="SKU/ASIN">
                <template slot-scope="scope">
                    <span>{{ scope.row.sku | emptyFilter }}</span>
                    <br>
                    <span>{{ scope.row.asin | emptyFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="平台/站点">
                <template slot-scope="scope">
                    <span>{{ scope.row.channel_id | emptyFilter }}</span>
                    <br>
                    <span>{{ scope.row.site | emptyFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="账号简称/店铺名称"
                    width="140">
                <template slot-scope="scope">
                    <span>{{ scope.row.account_id }}</span>
                    <br>
                    <span>{{ scope.row.account_name }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="seller_id_name"
                    label="销售员">
            </el-table-column>
            <el-table-column
                    prop="keyword"
                    label="关键词">
            </el-table-column>
            <el-table-column
                    label="销售单价">
                <template slot-scope="scope">
                    <span>{{ scope.row.seller_cost }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="运单类型">
                <template slot-scope="scope">
                    <span>{{ scope.row.shipping_type|shippingTypeFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="quantity"
                    label="下单数量">
            </el-table-column>
            <el-table-column
                    show-overflow-tooltip
                    label="备注">
                <template slot-scope="scope">
                    <span>{{ scope.row.remark | emptyFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="order_number"
                    label="交易订单号">
            </el-table-column>
            <el-table-column
                    label="订单总支付金额"
                    width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.order_cost }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="150"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text"
                               size="mini"
                               @click.native="view(scope.row)">查看</el-button>
                    <span>|</span>
                    <el-button type="text"
                               size="mini"
                               v-if="scope.row.type !== '外包刷单'&&scope.row.status === 2"
                               @click.native="specify_buyer(scope.row)">指定买家</el-button>
                    <span v-if="scope.row.type !== '外包刷单'&&scope.row.status === 2">|</span>
                    <el-button type="text"
                               size="mini"
                               @click.native="journal(scope.row)">日志</el-button>
                    <span v-if="scope.row.type === '国外刷单'&&scope.row.status === 4&&scope.row.refund_status === null" >|</span>
                    <el-button type="text"
                               size="mini"
                               v-if="scope.row.type === '国外刷单'&&scope.row.status === 4&&scope.row.refund_status === null"
                               @click.native="apply_for_refund(scope.row)">申请返款</el-button>
                </template>
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
<style lang="stylus" scoped>

</style>
<script>
    export default {
        name: "table-module",
        filters: {
            emptyFilter(val){
                return val===''?'--':val
            },
            filterImage(val){
                return val.replace("_60x60","_200x200");
            },
            dateFilter(val) {//-----------日期过滤
                return datef('YYYY-MM-dd', val);
            },
            refundStatusFilter(val){
                let ret = '';
                switch (val){
                    case null:
                        ret = '未申请';
                        break;
                    case 0:
                        ret = '未返款';
                        break;
                    case 1:
                        ret = '已返款';
                        break;
                    case 2:
                        ret = '返款异常';
                        break;
                    case 3:
                        ret = '取消返款';
                        break;
                }
                return ret
            },
            shippingTypeFilter(val){
                let ret = '';
                switch (val){
                    case 0:
                        ret = '--';
                        break;
                    case 1:
                        ret = 'FBA';
                        break;
                    case 2:
                        ret = 'FBM';
                        break;
                }
                return ret
            }
        },
        methods: {
            selection_change(val){
                this.$emit('selection-change',val)
            },
            view(val){//查看
                this.$emit('view',val)
            },
            specify_buyer(row){//指定买家
                this.$emit('specify-buyer',row)
            },
            journal(row){//日志
                this.$emit('journal',row)
            },
            apply_for_refund(row){//申请返款
                this.$emit('apply-for-refund',row)
            },
            handle_size_change(val){//切换条数
                this.$emit('handle-size-change',val)
            },
            handle_current_change(val){//切换页数
                this.$emit('handle-current-change',val)
            },
        },
        computed:{
            emptyText(){
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        props: {
            tableData:{
                type:Array
            },
            loading:{
                type:Boolean
            },
            searchData:{
                type:Object
            },
            firstLoading:{
                type: Boolean,
                required: true
            },
            total: {
                type: Number
            }
        },
        components: {

        }
    }
</script>