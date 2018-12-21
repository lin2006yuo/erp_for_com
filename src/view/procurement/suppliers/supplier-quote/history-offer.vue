<template>
    <page-dialog class="history" @open="open" :title="`查看SKU：${sku} 历史报价`" v-model="historyDialog" size="large"
                 :close-on-click-modal="false">
        <page>
            <el-button type="primary" @click="presentSpu" size="mini">当前供应商报价</el-button>
            <el-button type="primary" @click="allSpu" size="mini">全部供应商报价</el-button>
        </page>
        <el-table
            class="scroll-bar"
            v-resize="{height:208}"
            border
            :data="dataList"
            v-loading="historyLoading"
            element-loading-text="玩命加载中"
            highlight-current-row
        >
            <el-table-column label="报价日期" min-width="40" inline-template show-overflow-tooltip>
                <times :time="row.create_time"></times>
            </el-table-column>
            <el-table-column label="供应商" inline-template>
                <span>{{row.company_name}}</span>
            </el-table-column>
            <el-table-column label="最小起订量" min-width="50" inline-template>
                <span>{{row.min_qty}}</span>
            </el-table-column>
            <el-table-column label="最新报价" inline-template>
                <div>
                    <span>{{row.currency_code}}</span>&nbsp;
                    <ui-tips style="vertical-align: bottom;" :content="row.price|filterPrice" :width="40"></ui-tips>
                </div>
            </el-table-column>
            <el-table-column label="数量/报价" min-width="100" inline-template>
                <div v-for="item in row.section" :key="item.min_quantity">
                    <span>{{item.min_quantity}}</span>~<span>{{item.max_quantity?item.max_quantity:'无穷大'}}</span>&nbsp;/&nbsp;<span>{{row.currency_code}}</span>&nbsp;<span>{{item.price | filterPrice}}</span>
                </div>
            </el-table-column>
            <el-table-column label="记录员" min-width="40" show-overflow-tooltip inline-template>
                <span>{{row.creator}}</span>
            </el-table-column>
            <el-table-column label="采购链接" inline-template>
                <span>{{row.link}}</span>
            </el-table-column>
            <el-table-column label="审核状态" min-width="45" inline-template show-overflow-tooltip>
                <span>{{row.status | filterStatus}}</span>
            </el-table-column>
        </el-table>
        <el-pagination
            class="fr"
            @size-change="size_change"
            @current-change="current_change"
            :current-page="history.page"
            :page-size="history.pageSize"
            layout="total,sizes,prev, pager, next, jumper"
            :total="history.totalSize">
        </el-pagination>
        <div slot="footer">
            <el-button size="mini" @click.native="close">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .history {
        .dialog__body {
            max-height: 630px !important;
            table.template td, .el-table td, table.template th, .el-table th{
                padding: 0;
                height: 26px;
                text-align: center;
                box-sizing: border-box;
                border-right: 1px solid #e0e6ed;
                border-bottom: 1px solid #e0e6ed;
            }
        }
    }

</style>
<script>
    import pageDialog from '../../../../components/page-dialog.vue';
    import {api_history_offer} from '../../../../api/supplier-quote';

    export default {
        data() {
            return {
                historyLoading: false,
                historyDialog: false,
                history: {
                    page: 1,
                    pageSize: 30,
                    totalSize: 0
                },
                dataList: []

            }
        },
        filters: {
            filterTime(val) {
                if (val) return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            filterPrice(val) {
                return val ? parseFloat(val).toFixed(3) : '0.000';
            },
            filterStatus(val) {
                switch (val) {
                    case 0:
                        return "未审核";
                        break;
                    case 1:
                        return "审核通过";
                        break;
                    case 2:
                        return "审核未通过";
                        break;
                }
            },
        },
        mounted() {
            this.historyDialog = this.value;
        },
        created() {

        },
        watch: {
            historyDialog(val) {
                this.$emit("input", val);
            },
            value(val) {
                this.historyDialog = val;
            }
        },
        methods: {
            open() {
                this.api_history_offer();
            },
            presentSpu() {
                this.api_history_offer();
            },
            allSpu() {
                this.api_history_offer2();
            },
            size_change(size) {
                this.history.pageSize = size;
                this.api_history_offer();
            },
            current_change(page) {
                this.history.page = page;
                this.api_history_offer();
            },
            close() {
                this.historyDialog = false;
            },
            api_history_offer() {
                this.historyLoading = true;
                this.dataList = [];
                let params = {
                    //id:this.id,
                    sku_id: this.sku_id,
                    supplier_id: this.supplier_id,
                    page: this.history.page,
                    pageSize: this.history.pageSize
                };
                this.$http(api_history_offer, params).then(res => {
                    this.dataList = res.data;
                    this.history.totalSize = res.count;
                    this.historyLoading = false;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                    this.historyLoading = false;
                });
            },
            api_history_offer2() {
                this.historyLoading = true;
                this.dataList = [];
                let params = {
                    //id:this.id,
                    sku_id: this.sku_id,
                    supplier_id: '',
                    page: this.history.page,
                    pageSize: this.history.pageSize
                };
                this.$http(api_history_offer, params).then(res => {
                    this.dataList = res.data;
                    this.history.totalSize = res.count;
                    this.historyLoading = false;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                    this.historyLoading = false;
                });
            }
        },
        props: {
            value: {},
            id: {
                required: true,
                type: Number
            },
            sku_id: {
                required: true,
                type: Number
            },
            sku: {},
            supplier_id: {}
        },
        components: {
            pageDialog,
            uiTips: require('../../../../components/ui-tip.vue').default,
        }
    }
</script>
