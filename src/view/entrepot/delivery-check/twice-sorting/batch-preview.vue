<template>
    <el-dialog class="c-batch-preview" title="打印预览" @open="guide" v-model="show" :close-on-click-modal="false"
               size="mini">
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
                    max-height="380"
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
                <!--<el-table-column
                        width="120"
                        inline-template
                        label="打印数量">
                    <div>
                        <el-input v-model="row.print_num"
                                  class="width-xs"
                                  ref="initial_value">
                        </el-input>
                    </div>
                </el-table-column>-->
            </el-table>
        </div>
        <div slot="footer">
            <el-button type="primary" size="mini" @click.native="print" :disabled="relevancing">打印</el-button>
            <el-button size="mini" @click.native="show=false">关闭</el-button>
        </div>
    </el-dialog>
</template>
<style lang="stylus">
    /*
    .c-batch-preview {
        z-index: 2040 !important;
    }
    */
</style>
<script>
    import {print} from "./batch-preview"
    import {api_label_type_list, api_label_edit, api_label_list} from "@/api/print"
    import {mapGetters, mapActions} from 'vuex';

    export default {
        data() {
            return {
                show: this.value,
                template: [],
                templateData: {},
                templateLabel: '',
                templateGuide: '',
                htmlList: [],
                printData: {},
                footer: false,
                printer: '',
                print_html: '',
                print_width: '',
                print_height: '',
                print_content: [],
                print_url: '',
                print_type: [],
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
                // this.$emit('query');
            },
            guide() {
                if (this.isBatch) {
                    this.$http(api_label_list, {temp_name: '拣货单引导'}).then(res => {
                        this.templateGuide = res.data[0];
                        let size = this.templateGuide.size.split('x');
                        this.templateGuide.size = {
                            height: Number(size[1]),
                            width: Number(size[0]),
                        };
                        this.$nextTick(() => {
                            if (this.batchData.default_temp_id) {
                                this.change_print();
                                console.log("label", this.templateData, this.templateGuide, this.batchData);
                            }
                        })
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.measure || code
                        })
                    });
                } else {
                    this.templateGuide = '';
                    this.$nextTick(() => {
                        if (this.batchData.default_temp_id) {
                            this.change_print();
                            console.log("label", this.templateData, this.templateGuide, this.batchData);
                        }
                    })
                }
            },
            print() {
                let flag = false;
                this.numberList = [];
                this.print_content = [];
                this.print_type = [];
                this.htmlList = [];
                for (let i = 0; i < this.batchData.print_data.length; i++) {
                    this.batchData.print_data[i].default_temp_id = this.batchData.default_temp_id;
                    this.printData = this.batchData.print_data[i];
                    if (i === this.batchData.print_data.length - 1) {
                        flag = true;
                    }
                    print.call(this, true, flag);
                    if (flag) {
                        this.$emit('query');
                    }
                }
            },
            change_print() {
                this.numberList = [];
                this.print_content = [];
                this.print_type = [];
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
                    this.templateLabel = res;
                    console.log('temp', this.templateLabel);
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
            },
            isBatch: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
            selectPrinter: require('@/components/select-printer.vue').default,
        }
    }
</script>
