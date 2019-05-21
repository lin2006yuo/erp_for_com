<template>
    <div class="p-table-module">
        <el-table
                class="mt-xs"
                v-resize="{height:41}"
                :data="tableData"
                border
                highlight-current-row
                :row-class-name="row_class_name"
                style="width: 100%"
                v-loading="loading"
                element-loading-text="拼命加载中"
                @sort-change="$listeners['sort-click']"
                @selection-change="$listeners['handle-selection-change']">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>

            <el-table-column label="平台" prop="channel_name" width="150">

            </el-table-column>

            <el-table-column label="站点" prop="site" width="150">

            </el-table-column>

            <el-table-column label="账号简称" prop="account_code" width="150">

            </el-table-column>

            <el-table-column label="销售员" prop="seller_name" width="150">

            </el-table-column>

            <el-table-column label="销售组长" prop="team_leader_name" inline-template width="150">
                <ui-tip :content="row.team_leader_name"></ui-tip>
            </el-table-column>

            <el-table-column label="销售主管" prop="supervisor_name" inline-template width="150">
                <ui-tip :content="row.supervisor_name"></ui-tip>
            </el-table-column>

            <el-table-column label="销售所属部门" prop="department_name" width="150">

            </el-table-column>

            <el-table-column label="账号状态" prop="account_status" width="150">

            </el-table-column>

            <el-table-column label="是否有VAT" prop="is_vat" width="150">

            </el-table-column>

            <el-table-column label="是否可发FBA" prop="can_send_fba" width="150">

            </el-table-column>

            <el-table-column label="刊登数量" prop="publish_quantity" sortable="custom" width="150">

            </el-table-column>

            <el-table-column label="昨日在线Listing数量" prop="online_listing_quantity" sortable="custom" width="150">

            </el-table-column>

            <el-table-column label="销售额(USD)" prop="sale_amount" sortable="custom" width="150">

            </el-table-column>

            <el-table-column label="订单量" prop="order_quantity" sortable="custom" width="150">

            </el-table-column>

            <el-table-column label="ODR" prop="odr" width="150" sortable="custom">

            </el-table-column>

            <el-table-column label="平均动销率" prop="average_retail_rate" sortable="custom" width="150">

            </el-table-column>

            <el-table-column label="在线ASIN数量" prop="online_asin_quantity" sortable="custom" width="150">

            </el-table-column>

            <el-table-column label="账号注册日期" prop="account_create_time" inline-template sortable="custom" width="150">
                <div>
                    <span>{{row.account_create_time | filterTime}}</span>
                </div>
            </el-table-column>

            <el-table-column label="账号交接日期" prop="fulfill_time" inline-template sortable="custom" width="150">
                <div>
                    <span>{{row.fulfill_time | filterTime}}</span>
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
    </div>
</template>

<style lang="stylus" scoped>
    p-table-module{

    }
</style>

<script>
    export default {
        filters: {
            filterTime(val){
                return datef("YYYY-MM-dd HH:mm:ss",val);
            }
        },
        methods:{
            row_class_name(row) {
                if (Number(row.is_red) === 1) {
                    return 'red';
                } else {
                    return '';
                }
            },
        },
        computed:{
            emptyText(){
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        props: {
            tableData: {
                required: true,
                type: Array
            },
            loading: {
                required: true,
                type: Boolean
            },
            firstLoading: {
                required: true,
                type: Boolean
            },
            searchData: {
                required: true,
                type: Object
            },
            total: {
                required: true,
                type: Number
            },
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default
        }
    }
</script>