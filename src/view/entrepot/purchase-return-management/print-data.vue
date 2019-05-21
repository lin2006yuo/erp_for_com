<template>
    <page-dialog title="打印采购退货拣货单"
                 size="large"
                 class="p-purchase-return-print"
                 @close="close"
                 v-model="visible"
                 :close-on-click-modal="false">
        <div class="print">
            <p class="print-title">
                请使用本界面的打印按钮直接打印，不要用浏览器打印功能
                <el-button @click="prints">打印</el-button>
                <span class="fr mr-sm">
                    <span>打印机：</span>
                    <select-printer v-model="printer" class="inline width-lg"></select-printer>
                </span>
            </p>
        </div>
        <h1 class="t-center">采购退货拣货单</h1>
        <div>
            <el-row class="header-top">
                <el-col>
                    <div>
                        <el-row>
                            <div class="inline">
                                <span>退货单号：</span>
                                <span>{{trendAction.number}}</span>
                            </div>
                            <div class="ml-sm inline">
                                <span>采购单号：</span>
                                <span>{{trendAction.purchase_order_id}}</span>
                            </div>
                            <div class="ml-sm inline">
                                <span>SKU品种数：</span>
                                <span>{{trendAction.sku_type_quantity}}</span>
                            </div>
                            <div class="ml-sm inline">
                                <span>SKU总数量：</span>
                                <span>{{trendAction.sku_quantity}}</span>
                            </div>
                        </el-row>
                        <el-row>
                            <div class="inline">
                                <span>退货收件人：</span>
                                <span>{{trendAction.recipients}}</span>
                            </div>
                            <div class="ml-sm inline">
                                <span>收件人联系电话：</span>
                                <span>{{trendAction.recipients_phone}}</span>
                            </div>
                        </el-row>
                        <el-row>
                            <span>退货地址：</span>
                            <span>{{trendAction.recipients_address}}</span>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-table :data="curData"
                  v-resize="{height:150}"
                  class="scroll-bar mt-sm"
                  highlightCurrentRow>
            <el-table-column
                    label="#"
                    prop="num"
                    width="40">
            </el-table-column>
            <el-table-column
                    inline-template
                    width="120"
                    label="货位">
                <div>
                    <ui-tip :content="row.code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="40"
                    label="数量">
                <div>
                    <ui-tip :content="row.quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="120"
                    label="SKU">
                <div>
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="品名">
                <div>
                    {{row.spu_name}}
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="fr mt-sm"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </page-dialog>
</template>
<style lang="stylus">
    .p-purchase-return-print {
        .text-line {
            text-decoration: underline;
        }
        .header-top {
            overflow: hidden;
            span {
                font-size: 18px;
            }
        }
        .header-right {
            height: 60px;
            line-height: 60px;
        }
        .sku-name {
            height: 50px;
            line-height: 16px;
            vertical-align: middle;
            overflow: hidden;
        }
        .number-code {
            line-height: 14px;
            font-weight: bold;
        }
        .print {
            text-align: center;
            margin-bottom: 10px;
            color: #ff4949;
            height: 40px;
            line-height: 40px;
            .print-title {
                width: 100%;
                border: 3px solid black;
                font-size: 2rem;
                background-color: yellow;
                margin: 0 auto;
            }
        }
    }
</style>
<script>
    import {print} from './preview'
    import {mapActions, mapGetters} from 'vuex';

    export default {
        data() {
            return {
                visible: false,
                searchData: {
                    page: 1,
                    pageSize: 20
                },
                printData: {},
                total: 0,
                curData: [], //分页显示的数据
                print_html: '',
                print_number: 1,
                print_list: [],
                printContent: '',
                printer: '',
            }
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm", val);
            }
        },
        methods: {
            init() {
                this.trendAction.details.forEach((row, index) => {
                    row.num || this.$set(row, 'num', index + 1);
                });
                this.total = this.trendAction.details.length;
            },
            ...mapActions({
                set_printerList: 'api/set_printerList'
            }),
            //打印
            prints() {
                let pageSize = 25;
                let flag = false;
                this.print_html = '';
                this.print_number = 1;
                for (let i = 0; i < Math.ceil(this.total / pageSize); i++) {
                    this.print_list = [];
                    if (i === Math.ceil(this.total / pageSize) - 1) {
                        flag = true;
                    }
                    this.trendAction.details.forEach((row, index) => {
                        if (index < this.print_number * pageSize && index >= (this.print_number - 1) * pageSize) {
                            this.print_list.push(row);
                        }
                    });
                    print.call(this, true, flag, (this.print_number - 1) * pageSize);
                    this.print_number++;
                }
            },
            close() {
                this.searchData = {
                    page: 1,
                    pageSize: 20
                };
                this.curData = []; //分页显示的数据
                this.print_html = '';
                this.print_number = 1;
                this.print_list = [];
                this.printContent = '';
            },
            /* 前端分页 */
            paging_handle() {
                this.curData = this.pagingData[this.searchData.page - 1];
            },
            //分页器
            handle_size_change(val) {
                this.searchData.pageSize = val;
                let maxPage = Math.ceil(this.trendAction.details.length / this.searchData.pageSize) - 1;
                this.searchData.page = this.searchData.page > maxPage ? maxPage : this.searchData.page;
                this.paging_handle();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.paging_handle();
            },
        },
        computed: {
            ...mapGetters({
                'user': 'user/info'
            }),
            pagingData() { // 分页
                let pagingData = [];
                if (this.trendAction.details && this.trendAction.details.length !== 0) {
                    let length = Math.ceil(this.trendAction.details.length / this.searchData.pageSize);
                    for (let i = 0; i < length; i++) {
                        let start = i * this.searchData.pageSize;
                        pagingData.push(this.trendAction.details.slice(start, start + this.searchData.pageSize));
                    }
                }
                return pagingData;
            },
        },
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                if (val) {
                    this.init();
                }
                this.visible = val;
            },
            pagingData() {
                this.paging_handle();
            },
        },
        props: {
            value: {},
            trendAction: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            selectPrinter: require('@/components/select-printer.vue').default
        },
    }
</script>
