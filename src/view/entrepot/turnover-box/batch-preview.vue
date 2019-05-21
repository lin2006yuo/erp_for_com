<template>
    <page class="tag-p-preview">
        <page-dialog title="打印预览" v-model="show" @change="change_dialog" :close-on-click-modal="false">
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
                <el-button type="primary" size="mini" @click.native="print">打印</el-button>
                <el-button size="mini" @click.native="show=false">关闭</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .tag-p-preview {
    }
</style>
<script>
    import {print} from "./batch_preview"
    import {api_label_type_list, api_label_edit} from "@/api/print"

    export default {
        data() {
            return {
                show: false,
                template: [],
                templateData: {},
                htmlList: [],
                print_html: '',
                footer: false,
                start: 1,
                printData: {},
                printer: '',
                print_width: '',
                print_height: '',
                print_type: [],
                print_direction: [],
                print_content: [],
                token: '',
                numberList: [],
            }
        },
        created() {
        },
        mounted() {
        },
        computed: {},
        methods: {
            print() {
                if (this.printer === '') {
                    this.$message({type: "error", message: '当前PC未启动打印服务'});
                    return false;
                }
                //引入一个布尔值用来判断是否已经是最后一个打印数据传输
                let flag = false;
                let temp = /^[0-9a-zA-Z\-]+$/;
                this.numberList = [];

                this.htmlList = [];
                this.print_content = [];
                this.print_type = [];
                this.print_direction = [];
                if (temp.test(this.start)) {
                    this.print_html = '';
                    for (let i = 0; i < this.batchData.print_data.length; i++) {
                        this.batchData.print_data[i].default_temp_id = this.batchData.default_temp_id;
                        this.printData = this.batchData.print_data[i];
                        if (i === this.batchData.print_data.length - 1) {
                            flag = true;
                        }
                        if (!!Number(this.batchData.print_data[i].print_num)) {
                            print.call(this, true, flag);
                        } else {
                            return false;
                        }
                    }
                } else {
                    this.$message({type: "error", message: '请输入正确的页脚'});
                }

            },
            change_print() {
                this.numberList = [];
                this.htmlList = [];
                this.print_content = [];
                this.print_type = [];
                this.print_direction = [];

                this.get_data(this.batchData.default_temp_id).then(res => {
                    this.batchData.print_data.forEach(row => {
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
                this.$http(api_label_type_list, id).then(res => {
                    this.template = res;
                    let default_temp = this.template.some(row => {
                        if (row.is_default === 1) {
                            this.printData.default_temp_id = row.id;
                            this.change_print();
                            return true;
                        }
                        return false;
                    });
                    if(!default_temp) {
                        this.printData.default_temp_id = this.template[0].id;
                        this.change_print();
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            change_dialog(val) {
                if (!val) {
                    this.htmlList = [];
                }
            }
        },
        filters: {},
        watch: {
            value(val) {
                this.show = val;
                if (val) {
                    this.$nextTick(() => {
                        if (this.batchData.default_temp_id) {
                            this.$refs.initial_value[0].$refs.input.select();
                        }
                    });
                    this.batchData.print_data.forEach(row => {
                        if (!Number(row.print_num)) {
                            row.print_num = 2;
                        }
                    })
                }
            },
            show(val) {
                this.$emit("input", val);
            }
        },
        props: {
            value: {},
            batchData: {},
            columnHeight: {
                default() {
                    return 100;
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
