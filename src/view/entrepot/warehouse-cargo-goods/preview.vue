<template>
    <page-dialog title="打印预览" v-model="show" @close="close" :close-on-click-modal="false" size="small">
        <el-row>
            <label>使用打印模板：</label>
            <el-select v-model="batchData.default_temp_id"
                       placeholder="请选择"
                       class="mr-sm inline width-sm"
                       @change="change_print">
                <el-option
                        v-for="item in template"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <span class="fr mr-sm">
                <span>打印机：</span>
                <select-printer v-model="printer" class="inline width-lg"></select-printer>
            </span>
        </el-row>
        <div style="position: relative;margin: 0 auto;">
            <el-table
                    :data="batchData.print_data"
                    class="scroll-bar mt-sm"
                    max-height="580"
                    ref="table"
                    highlightCurrentRow>
                <el-table-column
                        inline-template
                        label="标签">
                    <div>
                        <iframe frameborder="0"
                                :style="{height:`${columnHeight}px`}"
                                :srcdoc="htmlList[$index]"
                                v-if="batchData.default_temp_id"
                                name="image">
                        </iframe>
                        <span v-else class="gray">没有选择模板</span>
                    </div>
                </el-table-column>
                <el-table-column
                        width="120"
                        inline-template
                        label="打印数量">
                    <div>
                        <el-input v-model="row.print_num"
                                  class="width-xs"
                                  ref="initial_value">
                        </el-input>
                    </div>
                </el-table-column>
            </el-table>
        </div>
        <div slot="footer">
            <el-button type="primary" size="mini" @click.native="print" :disabled="relevancing">打印</el-button>
            <el-button size="mini" @click.native="show=false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .labelheight {
        height: 300px !important;
    }
</style>
<script>
    import {print} from "./preview"
    import {api_get_label} from '@/api/product-library'
    import {api_label_type_list, api_label_edit} from "@/api/print"
    import {mapGetters, mapActions} from 'vuex';

    export default {
        data() {
            return {
                show: this.value,
                template: [],
                templateData: {},
                htmlList: [],
                printData: {},
                footer: false,
                printer: '',
                print_width: '',
                print_height: '',
                print_content: '',
                token: '',
                numberList: [],
                relevancing: false,
            }
        },
        methods: {
            ...mapActions({
                set_printerList: 'api/set_printerList'
            }),
            close() {
                this.html = '';
            },
            print() {
                let flag = false;
                this.print_html = '';
                for (let i = 0; i < this.batchData.print_data.length; i++) {
                    this.batchData.print_data[i].print_num = Number(this.batchData.print_data[i].print_num);
                    if (this.batchData.print_data[i].print_num <= 0 || isNaN(this.batchData.print_data[i].print_num)) {
                        this.$message({type: "error", message: '请输入要打印的数量'});
                        return false;
                    }
                    this.batchData.print_data[i].default_temp_id = this.batchData.default_temp_id;
                    this.printData = this.batchData.print_data[i];
                    if (i === this.batchData.print_data.length - 1) {
                        flag = true;
                    }
                    print.call(this, true, flag);
                }
            },
            change_print() {
                this.htmlList = [];
                this.get_data(this.batchData.default_temp_id).then(res => {
                    this.batchData.print_data.forEach(row => {
                        row.default_temp_id = this.batchData.default_temp_id;
                        this.printData = row;
                        print.call(this, false);
                    })
                })
            },
            get_data(id) {
                return this.$http(api_label_edit, id).then(res => {
                    this.templateData = res;
                    console.log('temp', this.templateData)
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            get_template(id) {
                this.$http(api_label_type_list, id).then(res => {
                    this.template = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
        },
        watch: {
            value(val) {
                this.show = val;
                this.$nextTick(() => {
                    if (val) {
                        this.$refs.initial_value.$refs.input.select();
                    }
                });
            },
            show(val) {
                this.$emit("input", val);
            },
        },
        computed: {},
        props: {
            value: {
                default() {
                    return false;
                },
            },
            batchData: {},
            //打印的数据的id
            printId: {},
            columnHeight: {
                default() {
                    return 100;
                }
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
            selectPrinter: require('@/components/select-printer.vue').default,
        }
    }
</script>
