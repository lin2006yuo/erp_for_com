<template>
    <page class="p-dialog">
        <page-dialog :title="`账户：${historyData.account_name}的历史记录`" v-model="showDialog" size="large" :close-on-click-modal="false">
            <el-table
                    :data="historyData.data"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="create_time"
                        label="数据抓取日期">
                </el-table-column>

                <el-table-column
                        prop="today_score"
                        label="今日服务分(满分100)">
                </el-table-column>

                <el-table-column
                        prop="back_transaction_rate"
                        label="成交不卖率">
                </el-table-column>

                <el-table-column
                        prop="not_cargo_dispute_rate"
                        label="未收到货物纠纷提起率">
                </el-table-column>

                <el-table-column
                        prop="error_cargo_dispute_rate"
                        label="货不对版纠纷提起率">
                </el-table-column>

                <el-table-column
                        prop="dsr_description"
                        label="DSR商品描述">
                </el-table-column>
                <el-table-column
                        prop="dsr_service"
                        label="DSR卖家服务">
                </el-table-column>

                <el-table-column
                        prop="dsr_shipping"
                        label="DSR物流">
                </el-table-column>

                <el-table-column
                        prop="forty_eight_deliver"
                        label="48小时发货率">
                </el-table-column>

                <el-table-column
                        prop="outlaw_quality"
                        label="商品信息质量违规">
                </el-table-column>

                <el-table-column
                        prop="outlaw_property"
                        label="知识产权禁限售违规">
                </el-table-column>

                <el-table-column
                        prop="outlaw_trancation"
                        label="交易违规及其他">
                </el-table-column>

                <el-table-column
                        prop="severity_outlaw_property"
                        label="知识产权严重违规">
                </el-table-column>

            </el-table>
            <div slot="footer" class="dialog-footer">
                <!--<el-button size="mini" type="primary" @click.native="get_shift">确定</el-button>-->
                <el-button size="mini" @click.native="showDialog=false">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus" scoped>
    .title{
        margin: 0;
        margin-bottom: 8px;
    }
    .center{
        display: flex;
        justify-content: center;
    }
</style>
<script>

    export default {
        data() {
            return {
                title:'批量修改监控值',
                showDialog:this.value,
            }
        },
        computed: {},
        filters: {},
        mounted() {
        },
        methods: {
            get_shift(){//确定

            },
        },
        watch: {
            value(val){
                this.showDialog = val;
            },
            showDialog(val){
                this.$emit('input',val);
            },
        },
        props: {
            value:{
                type:Boolean,
                default(){
                    return false;
                },
            },
            historyData:Object,
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
        }
    }
</script>
