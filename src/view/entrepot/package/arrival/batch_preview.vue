<template>
    <page class="tag-p-preview" v-show="batchShow">
        <page-dialog title="打印预览" v-model="visible" @change="change_dialog" :close-on-click-modal="false" size="large">
            <el-row>
                <label>使用打印模板：</label>
                <el-select v-model="batchData.default_temp_id"
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
                <el-checkbox v-model="batch_relevance">是否打印关联模板</el-checkbox>
                <span class="fr mr-sm">
                <span>打印机：</span>
                    <select-printer v-model="batch_printer" class="inline width-lg"></select-printer>
                </span>
            </el-row>
            <div style="position: relative;height: 300px;" v-if="batchData.default_temp_id !== ''">
                <el-table
                        :data="batchData.data"
                        class="scroll-bar mt-sm"
                        max-height="580"
                        ref="table"
                        highlightCurrentRow>
                    <el-table-column
                            inline-template
                            label="标签">
                        <div>
                            <iframe frameborder="0"
                                    style="height: 100px !important;"
                                    :srcdoc="htmlList[$index]"
                                    name="image">
                            </iframe>
                        </div>
                    </el-table-column>
                    <el-table-column
                            width="120"
                            inline-template
                            label="上架数量">
                        <div>
                            <integer-input v-model="batchData.data[$index].guide[0].quantity"
                                           class="width-xs"
                                           :min="0"
                                           ref="initial_value">
                            </integer-input>
                        </div>
                    </el-table-column>
                    <el-table-column
                            width="120"
                            inline-template
                            label="快速发货数量">
                        <div>
                            <integer-input v-model="batchData.data[$index].guide[1].quantity"
                                           class="width-xs"
                                           :min="0"
                                           ref="initial_value">
                            </integer-input>
                        </div>
                    </el-table-column>
                    <el-table-column
                            width="120"
                            inline-template
                            label="次品数量">
                        <div>
                            <integer-input v-model="batchData.data[$index].guide[2].quantity"
                                           class="width-xs"
                                           :min="0"
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
        .right-table {
            width: 100%;
            border-left: 1px solid #d3dce6;
            border-top: 1px solid #d3dce6;
            font-size: 10px;
        }
        td {
            text-align: center;
            border-bottom: 1px solid #d3dce6;
            border-right: 1px solid #d3dce6;
            height: 26px;
        }
    }
</style>
<script>
    import {print} from "./batch_preview"
    import {api_label_type_list, api_label_edit} from "@/api/print"
    import {mapGetters, mapActions} from 'vuex';

    export default {
        data() {
            return {
                visible: false,
                template: [],
                templateData: {},
                htmlList: [],
                print_html: '',
                footer: false,
                batch_relevance: true,
                start: 1,
                printData: {},
                batch_printer: '',
                print_width: '',
                print_height: '',
                token: '',
                numberList: [],
            }
        },
        methods: {
            ...mapActions({
                set_printerList: 'api/set_printerList'
            }),
            print() {
                //引入一个布尔值用来判断是否已经是最后一个打印数据传输
                let flag = false;
                let temp = /^[0-9a-zA-Z\-]+$/;
                this.numberList = [];
                if (temp.test(this.start.toString())) {
                    this.print_html = '';
                    for (let i = 0; i < this.batchData.data.length; i++) {
                        this.batchData.data[i].default_temp_id = this.batchData.default_temp_id;
                        this.printData = this.batchData.data[i];
                        if (i === this.batchData.data.length - 1) {
                            flag = true;
                        }
                        print.call(this, true, flag);
                    }
                } else {
                    this.$message({type: "error", message: '请输入正确的页脚'});
                }

            },
            change_print() {
                this.print_content = '';
                this.htmlList = [];
                this.get_data(this.batchData.default_temp_id).then(res => {
                    this.batchData.data.forEach(row => {
                        row.default_temp_id = this.batchData.default_temp_id;
                        this.printData = row;
                        print.call(this, false);
                    })
                })
            },
            preview() {
                print.call(this, false);
            },
            get_data(id) {
                return this.$http(api_label_edit, id).then(res => {
                    console.log('templateData', res);
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
                    this.htmlList = [];
                }
            },
        },
        watch: {
            value(val) {
                this.visible = val;
                if (this.show) {
                    this.batchData.data.forEach(row => {
                        if (!Number(row.print_num)) {
                            row.print_num = '';
                        }
                    });
                }
            },
            visible(val) {
                this.$emit("input", val);
            },
            printer(val) {
                this.batch_printer = clone(this.printer);
            },
            relevance() {
                this.batch_relevance = clone(this.relevance);
            },
        },
        props: {
            value: {},
            batchData: {},
            relevance: {},
            printer: {},
            batchShow: {
                default() {
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
