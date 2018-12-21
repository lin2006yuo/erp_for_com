<template>
    <div class="p-package-handling">
        <div class="table_head">
            <span class="ml-sm table_title">已处理包裹</span>
            <span class="fr mr-sm">
                <span class="printer_title">打印机：</span>
                <select-printer v-model="printer" class="inline width-lg"></select-printer>
            </span>
        </div>
        <el-table :data="tableData"
                  v-resize="{height:40}"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  class="scroll-bar"
                  highlight-current-row>
            <el-table-column
                    inline-template
                    min-width="80"
                    label="面单号">
                <div>
                    <ui-tip :content="row.shipping_number" :width="98" class="inline"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="包裹号">
                <div>
                    <ui-tip :content="row.package_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="邮寄方式">
                <div>
                    <ui-tip :content="row.shipping_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="40"
                    label="重量(g)">
                <div>
                    <ui-tip :content="row.package_weight" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="预估重量(g)">
                <div>
                    <ui-tip :content="row.estimated_weight" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="70"
                    inline-template
                    label="异常原因">
                <div>
                    <ui-tip :content="row.exception_type_txt" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="60"
                    label="处理措施">
                <div>
                    <ui-tip :content="row.measure" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="40"
                    label="操作">
                <div>
                    <span class="operate" @click="print(row)">打印</span>
                </div>
            </el-table-column>
        </el-table>
        <!--<el-pagination class="t-right mt-sm"
                       @size-change="handle_size_change"
                       @current-change="handle_current_change"
                       :current-page="page"
                       :page-size="pageSize"
                       layout="total, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>-->
    </div>
</template>
<style lang="stylus">
    .p-package-handling {
        .printer_title {
            display: inline-block;
            line-height: 32px;
            vertical-align: middle;
        }
    }
</style>
<script>
    import {api_print_package} from '../../../api/package-handling'
    import {mapGetters, mapActions} from 'vuex';

    export default {
        data() {
            return {
                loading: false,
                curData: [],
                printer: '',
                token: '',
                numberList: [],
                page: 1,
                pageSize: 30,
                pagingData: [],
            }
        },
        mounted() {
        },
        methods: {
            ...mapActions({
                set_printerList: 'api/set_printerList'
            }),
            print(row) {
                let content = '';
                let direction = 1;
                let numberList = [];
                this.$http(api_print_package, row.package_id, {type: 5}).then(res => {
                    content = res.file;
                    direction = res.direction || direction;
                    numberList = res.package_id;
                    let data = {
                        Type: 'pdf',
                        Token: this.token,
                        Width: 100,
                        Height: 100,
                        Url: config.apiHost + res.callback,
                        PrintName: this.printer,
                        NumberList: numberList,
                        content: content,
                        Direction: direction === 1 ? 'vertical' : 'transverse'
                    };
                    this.$printer(this.printer, data);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })

            },
            handle_size_change(val) {
                this.pageSize = val;
                let maxPage = Math.ceil(this.packages.length / this.pageSize) - 1;
                this.page = this.page > maxPage ? maxPage : this.page;
                this.paging_handle();
            },
            handle_current_change(val) {
                this.page = val;
                this.paging_handle();
            },
            paging_handle() {
                this.curData = this.pagingData[this.page - 1];
            }
        },
        computed: {
            total() {
                return this.tableData.length;
            }
        },
        watch: {
            printer(value) {
                this.$emit('set-printer', value);
            },
            pagingData: {
                deep: true,
                handler(val) {
                    console.log('pagingData change', val);
                    this.paging_handle();
                }
            },
            tableData: {
                deep: true,
                handler(val) {
                    console.log('tableData change', val);
                    let pagingData = [];
                    if (val.length === 0) {
                        return pagingData;
                    }
                    let length = Math.ceil(val.length / this.pageSize);
                    for (let i = 0; i < length; i++) {
                        let start = i * this.pageSize;
                        pagingData.push(val.slice(start, start + this.pageSize));
                    }
                    this.pagingData = pagingData;
                    console.log('change end', this.pagingData, pagingData);
                }
            }
        },
        props: {
            tableData: {},
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            selectPrinter: require('@/components/select-printer').default
        },
    }
</script>
