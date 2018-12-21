<template>
    <div class='p-wish-monitor-history'>
        <page-dialog :title="title" v-model="showDialog" size="large" :close-on-click-modal="false">
            <el-table
                    :data="history"
                    border
                    style="width: 100%"
                    height="400"
              >

                <el-table-column
                        prop="create_time"
                        label="数据抓取日期">
                </el-table-column>
                <el-table-column
                        label="仿品率(目标≤0.5%)">
                    <template slot-scope="scope">
                        <div >{{scope.row.imitation_rate}}{{unit.imitation_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="有效跟踪率(目标≥95%)">
                    <template slot-scope="scope">
                        <div >{{scope.row.tracking_rate}}{{unit.tracking_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="延长发货率(目标≤10%)">
                    <template slot-scope="scope">
                        <div >{{scope.row.delay_shipment_rate}}{{unit.delay_shipment_rate}}</div>
                    </template>
                </el-table-column>

                <el-table-column
                        label="30天平均评分(目标≥4)">
                    <template slot-scope="scope">
                        <div >{{scope.row.thirty_score}}{{unit.thirty_score}}</div>
                    </template>
                </el-table-column>

                <el-table-column
                        label="60~90天内的退款率(目标≤10)">
                    <template slot-scope="scope">
                        <div>{{scope.row.refund_rate}}{{unit.refund_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="onway_amount"
                        label="在途金额">
                </el-table-column>
                <el-table-column
                        prop="finish_date"
                        label="到款时间">
                </el-table-column>
                <el-table-column
                        prop="unconfirm_amount"
                        label="待确认配送的金额">
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="showDialog=false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus" scoped>
</style>
<script>
    export default {
        data() {
            return {
                showDialog:false,
            }
        },
        created() {
        },
        mounted() {
        },
        computed: {},
        methods: {

        },
        watch: {
            value(val){
                this.showDialog = val;
            },
            showDialog(val){
                this.$emit('input',val);
            },
        },
        filters: {},
        props: {
            value:{
                type:Boolean,
                default(){
                    return false;
                },
            },
            title:{

            },
            history:{

            },
            unit:{}
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
        }
    }
</script>

