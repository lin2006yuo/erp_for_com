<template>
    <page-dialog :title="trendAction.title"
                 size="large"
                 class="p-allocation-pickings-print"
                 @open="open"
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
        <h1 class="t-center">仓库发货拣货单</h1>
        <div>
            <el-row class="header-top">
                <el-col :span="18">
                    <div class="header-left">
                        <el-row>
                            <div class="inline">
                                <span>出库仓库：</span>
                                <span class="text-line">{{printData.out_warehouse_name}}</span>
                            </div>
                            <div class="ml-sm inline">
                                <span>入库仓库：</span>
                                <span class="text-line">{{printData.in_warehouse_name}}</span>
                            </div>
                        </el-row>
                        <el-row>
                            <div class="inline ml-sm">
                                <span>SKU品种数：</span>
                                <span class="text-line">{{printData.sku_type}}</span>
                            </div>
                            <div class="inline ml-sm">
                                <span>包裹总数：</span>
                                <span class="text-line">{{printData.sku_quantity}}</span>
                            </div>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="header-right">
                        <img :src="barsrc" alt="">
                    </div>
                </el-col>
            </el-row>
            <el-row class="header-bottom">
                <el-col :span="6">
                    <span>打单时间：</span>
                    <span class="text-line">{{printData.print_time}}</span>
                </el-col>
                <el-col :span="3">
                    <span>打单员：</span>
                    <span class="text-line">{{printData.print}}</span>
                </el-col>
            </el-row>
        </div>
        <el-table :data="printData.detail"
                  v-resize="{height:150}"
                  v-loading="loading"
                  class="scroll-bar mt-sm"
                  element-loading-text="玩命加载中"
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
                    <ui-tip :content="row.warehouse_cargo" :width="98"></ui-tip>
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
                    label="SKU/SKU别名">
                <div>
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                    <div v-for="item in row.alias" :key="item">{{item}}</div>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="品名">
                <div>
                    {{row.name}}
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="fr"
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
    .p-allocation-pickings-print {
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
    import {print, barCode} from './preview'
    import {api_allocation_picking_print} from "@/api/allocation-picking";
    import {mapActions, mapGetters} from 'vuex';

    export default {
        data() {
            return {
                loading: false,
                visible: false,
                searchData: {
                    page: 1,
                    pageSize: 20
                },
                printData: {},
                total: 0,
                arr: [], //分页显示的数据
                copyData: [], //拷贝获取的所有数据
                print_html: '',
                print_number: 1,
                print_list: [],
                printContent: '',
                printer: '',
                token: '',
                numberList: [],
                barsrc: '',//二维码的地址
            }
        },
        mounted() {

        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm", val);
            }
        },
        methods: {
            init() {
                this.loading = true;
                this.$http(api_allocation_picking_print, this.trendAction.id).then(res => {
                    this.printData = res;
                    this.printData.printer_time = new Date().getTime() / 1000;
                    this.printData.printer_id = this.user.realname;
                    this.barsrc = barCode(this.printData.number, true);
                    this.copyData = clone(this.printData.detail);
                    this.total = this.copyData.length;
                    this.tabData();
                    this.loading = false;
                }).catch(code => {
                    this.loading = false;
                    this.$message({type: "error", message: code.message || code});
                })
            },
            //分页器
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            },
            //前端分页
            tabData() {
                this.arr = [];
                this.printData.detail = [];
                this.copyData.forEach((row, index) => {
                    row.num || this.$set(row, 'num', index + 1);
                    if (index < this.searchData.page * this.searchData.pageSize && index >= (this.searchData.page - 1) * this.searchData.pageSize) {
                        this.arr.push(row);
                    }
                });
                this.printData.detail = this.arr;
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
                if (this.printData.type === '含备注') {
                    const maxNum = 52;//一页最大数据行数
                    let curNum = 0;
                    let start = 0;//排序号
                    for (let i = 0; i < this.copyData.length; i++) {
                        let row = this.copyData[i];
                        curNum += row.order_list.length > 2 ? row.order_list.length : 2;
                        this.print_list.push(row);
                        if (i === this.copyData.length - 1) {//最后一条数据
                            print.call(this, true, true, start);
                            this.print_number++;
                            this.print_list = [];
                            return;
                        }
                        let nextNum = this.copyData[i + 1].order_list.length > 2 ? this.copyData[i + 1].order_list.length : 2;
                        if (curNum + nextNum > maxNum) {//若下条数据会超出则换页
                            curNum = 0;
                            print.call(this, true, false, start);
                            start = i + 1;
                            this.print_number++;
                            this.print_list = [];
                        }
                    }
                } else {
                    for (let i = 0; i < Math.ceil(this.copyData.length / pageSize); i++) {
                        this.print_list = [];
                        if (i === Math.ceil(this.copyData.length / pageSize) - 1) {
                            flag = true;
                        }
                        this.copyData.forEach((row, index) => {
                            if (index < this.print_number * pageSize && index >= (this.print_number - 1) * pageSize) {
                                this.print_list.push(row);
                            }
                        });
                        print.call(this, true, flag, (this.print_number - 1) * pageSize);
                        this.print_number++;
                    }
                }
            },
            close() {
                this.searchData = {
                    page: 1,
                    pageSize: 20
                };
                this.printData = {};
                this.copyData = [];
                this.arr = []; //分页显示的数据
                this.print_html = '';
                this.print_number = 1;
                this.print_list = [];
                this.printContent = '';
                this.token = '';
                this.numberList = [];
                this.barsrc = ''
            },
            open() {
                this.init();
            }
        },
        computed: {
            ...mapGetters({
                'user': 'user/info'
            }),
        },
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
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
