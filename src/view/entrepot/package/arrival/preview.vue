<template>
    <page class="tag-p-preview" v-show="previewShow">
        <page-dialog title="打印预览" v-model="visible" @change="change_dialog" :close-on-click-modal="false" size="large">
            <el-row>
                <label>使用打印模板：</label>
                <el-select v-model="printData.default_temp_id"
                           placeholder="请选择"
                           class="mr-sm inline"
                           @change="change_print">
                    <el-option
                            v-for="item in template"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-checkbox v-model="preview_relevance">是否打印关联模板</el-checkbox>
                <span class="fr mr-sm">
                <span>打印机：</span>
                    <select-printer v-model="preview_printer" class="inline width-lg"></select-printer>
                </span>
            </el-row>
            <div style="position: relative;margin: 0 auto;">
                <el-table
                        :data="tableData"
                        class="scroll-bar mt-sm"
                        max-height="580"
                        ref="table"
                        highlightCurrentRow>
                    <el-table-column
                            inline-template
                            label="标签">
                        <div>
                            <iframe frameborder="0"
                                    style="height: 100px !important;line-height: 100px;"
                                    :srcdoc="html"
                                    name="image">
                            </iframe>
                        </div>
                    </el-table-column>
                    <el-table-column
                            width="120"
                            inline-template
                            label="上架数量">
                        <div>
                            <integer-input v-model="printData.guide[0].quantity"
                                           :min="0"
                                           class="width-xs"
                                           ref="initial_value">
                            </integer-input>
                        </div>
                    </el-table-column>
                    <el-table-column
                            width="120"
                            inline-template
                            label="快速发货数量">
                        <div>
                            <integer-input v-model="printData.guide[1].quantity"
                                           :min="0"
                                           class="width-xs"
                                           ref="initial_value">
                            </integer-input>
                        </div>
                    </el-table-column>
                    <el-table-column
                            width="120"
                            inline-template
                            label="次品数量">
                        <div>
                            <integer-input v-model="printData.guide[2].quantity"
                                           :min="0"
                                           class="width-xs"
                                           ref="initial_value">
                            </integer-input>
                        </div>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer">
                <el-button type="primary" size="mini" @click.native="print">打印</el-button>
                <el-button size="mini" @click.native="visible=false">关闭</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .tag-p-preview {
    }
</style>
<script>
    import {print} from "./preview"
    import {api_label_type_list, api_label_edit} from "@/api/print"
    import {mapGetters, mapActions} from 'vuex';

    export default {
        data() {
            return {
                visible: false,
                template: [],
                templateData: {},
                html: '',
                print_content: '',
                footer: false,
                preview_printer: '',
                print_width: '',
                print_height: '',
                token: '',
                numberList: [],
                preview_relevance: true,
            }
        },
        methods: {
            ...mapActions({
                set_printerList: 'api/set_printerList'
            }),
            print() {
                let temp = /^[0-9]$/;
                this.numberList = [];
                this.print_content = '';
                if (this.footer) {
                    if (temp.test(this.start)) {
                        print.call(this, true);
                    } else {
                        this.$message({type: "error", message: '请输入正确的页脚'});
                    }
                } else {
                    print.call(this, true);
                }
            },
            change_print() {
                this.print_content = '';
                this.get_data(this.printData.default_temp_id).then(res => {
                    print.call(this, false);
                })
            },
            preview() {
                print.call(this, false);
            },
            get_data(id) {
                return this.$http(api_label_edit, id).then(res => {
                    this.templateData = res;
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            get_template(id, data) {
                this.$http(api_label_type_list, id, data).then(res => {
                    this.template = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            change_dialog(val) {
                if (!val) {
                    this.html = '';
                }
            },
        },
        watch: {
            value(val) {
                if (val) {
                    if (!Number(this.printData.print_num)) {
                        this.printData.print_num = '';
                    }
                    this.preview_relevance = clone(this.relevance);
                    this.preview_printer = clone(this.printer);
                }
                this.visible = val;
            },
            visible(val) {
                this.$emit("input", val);
            },
        },
        props: {
            value: {},
            printData: {},
            tableData: {},
            relevance: {},
            printer: {},
            previewShow: {
                deafult() {
                    return true;
                }
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            selectPrinter: require('@/components/select-printer.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
        }
    }
</script>
