<template>
    <page class="tag-p-preview">
        <page-dialog title="打印预览" v-model="show" @change="change_dialog" :close-on-click-modal="false">
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
                <label>打印数量：</label>
                <integer-input v-model="printData.print_num"
                               :min="0"
                               class="inline"
                               @change="change_print"
                               ref="initial_value"
                               @keyup.enter.native="printing_quantity">
                </integer-input>
            </el-row>
            <el-row class="mt-sm">
                <div>
                    <span class="fr mr-sm">
                    <span>打印机：</span>
                        <select-printer v-model="printer" class="inline width-lg"></select-printer>
                    </span>
                </div>
                <label v-if="footer">起始值：</label>
                <integer-input v-model="start"
                               :min="0"
                               @change="change_print"
                               v-if="footer"
                               ref="footer_start"
                               class="inline">
                </integer-input>
            </el-row>
            <div style="position: relative;height: 300px ;width:400px;margin: 0 auto">
                <iframe frameborder="0"
                        :srcdoc="html"
                        style="position: absolute; left: 0;right: 0;top:80px;bottom: 0;margin: 0 auto;"
                        name="image">
                </iframe>
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
    import {print} from "./preview"
    import {api_label_type_list, api_label_edit} from "@/api/print"
    import {mapGetters, mapActions} from 'vuex';

    export default {
        data() {
            return {
                show: false,
                template: [],
                templateData: {},
                html: '',
                footer: false,
                start: 1,
                printer: '',
                print_width: '',
                print_height: '',
                print_content: '',
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
            ...mapActions({
                set_printerList: 'api/set_printerList'
            }),
            print() {
                let temp = /^[0-9]$/;
                this.numberList = [];
                if (this.footer) {
                    if (temp.test(this.start)) {
                        if (!!Number(this.printData.print_num)) {
                            print.call(this, true);
                        } else {
                            this.$message({type: "error", message: "请输入正确的打印数量"});
                        }
                    } else {
                        this.$message({type: "error", message: '请输入正确的页脚'});
                    }
                } else {
                    if (!!Number(this.printData.print_num)) {
                        print.call(this, true);
                    } else {
                        this.$message({type: "error", message: "请输入正确的打印数量"});
                    }
                }

            },
            change_print() {
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
                    this.html = '';
                }
            },
            printing_quantity() {
                if (!!this.printData.print_num) {
                    print.call(this, true);
                }
            }
        },
        filters: {},
        watch: {
            value(val) {
                if (val) {
                    this.$nextTick(() => {
                        this.$refs.initial_value.$refs.input.select();
                    });
                    if (!Number(this.printData.print_num)) {
                        this.printData.print_num = '';
                    }
                }
                this.show = val;
            },
            show(val) {
                this.$emit("input", val);
            },
            footer(val) {
                if (val) {
                    this.$nextTick(() => {
                        this.$refs.footer_start.$refs.input.select();
                    })
                }
            }
        },
        props: {
            value: {},
            printData: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            selectPrinter: require('@/components/select-printer.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
        }
    }
</script>
