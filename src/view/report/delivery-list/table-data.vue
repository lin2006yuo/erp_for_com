<template>
    <div class="c-table-data">
        <el-table
                class="scroll-bar"
                :data="tableData.list"
                v-resize="{height:41}"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                :default-sort = "{prop: 'uploaded_deadline', order: 'descending'}"
                @select="selectCheck($event)"
                :row-class-name="row_class_name"
                @select-all="selectCheck"
                highlight-current-row>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <el-table-column
                    v-for="(column,index) in header"
                    :key="`column_${index}`"
                    :type="column.check ? 'selection' : ''"
                    :selectable="selectable"
                    :label="column.label"
                    :prop="column.value"
                    :width="column.width">
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    class="page-fixed"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page=tableData.page
                    :page-sizes="[20,50,100,200,500]"
                    :page-size=tableData.pageSize
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=total>
            </el-pagination>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                header: [
                    { check: true, width: "40" },
                    { label: 'NO.', value: 'id'},
                    { label: '物流商', value: 'carrier_company' },
                    { label: '邮寄方式', value: 'shortname' },
                    { label: '结算方式', value: 'settlement_method' },
                    { label: '揽收商', value: 'collector_name' },
                    { label: '发货包裹数量', value: 'parcels_num' },
                    { label: '重量( KG )', value: 'package_weight' },
                    { label: '运费( CNY )', value: 'shipping_fee' },
                ]
            }
        },
        methods:{
            handleCurrentChange(val){
                this.$emit('current-change',val);
            },
            handleSizeChange(val){
                this.$emit('size-change',val);
            },
            selectCheck(val){
                this.$emit('select-check',val);
            },
            row_class_name(row) {
                return row.id === '汇总' ? 'bold-font' : '';
            },
            selectable(row) {
                return row.id !== '汇总';
            }
        },
        watch: {
            'searchData.status':function (val) {
                if(val!==0){
                    this.checkData = [];
                    this.checkData.length = 0;
                }
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '正在请求数据...' : '暂无数据'
            }
        },
        props:{
            tableData:{
                required:true,
                type:Object,
            },
            loading:{
                required:true,
                type:Boolean
            },
            total:{},
            firstLoading:{
                type: Boolean,
                require:true
            },
            sum: {
                type: Object
            }
        },
        components: {}
    }
</script>
<style lang="stylus" scoped>
.c-table-data {
    th {
        padding 0
    }
    .cell {
        padding: 0;
    }
    .border-top {
        border-top: 1px solid #e0e6ed;
        height 27px
    }
}
</style>
