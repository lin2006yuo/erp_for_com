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
            <div style="position: relative;height: 100px ;width:400px;" v-for="(num, index) in batchData.data"
                 :key="index" v-if="batchData.default_temp_id !== ''">
                <iframe frameborder="0"
                        style="position: absolute; left: 0;right: 0;top:30px;bottom: 0;"
                        :srcdoc="htmlList[index]"
                        name="image">
                </iframe>
                <div class="width-xs" style="position: absolute;right: 0;top:30px;bottom: 0;">
                    <label>打印数量：</label>
                    <integer-input v-model="num.print_num"
                                   :min="0"
                                   class="inline"
                                   ref="initial_value"
                                   @keyup.enter.native="printing_quantity">
                    </integer-input>
                    <span v-if="num.print_num <= 0" class="red">请输入打印数量</span>
                </div>
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
            print() {
                if (this.printer === '') {
                    this.$message({type: "error", message: '当前PC未启动打印服务'});
                    return false;
                }
                //引入一个布尔值用来判断是否已经是最后一个打印数据传输
                let flag = false;
                let temp = /^[0-9a-zA-Z\-]+$/;
                this.numberList = [];
                if (temp.test(this.start)) {
                    this.print_html = '';
                    for (let i = 0; i < this.batchData.data.length; i++) {
                        this.batchData.data[i].default_temp_id = this.batchData.default_temp_id;
                        this.printData = this.batchData.data[i];
                        if (i === this.batchData.data.length - 1) {
                            flag = true;
                        }
                        if (!!Number(this.batchData.data[i].print_num)) {
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
            },
            printing_quantity() {
                print.call(this, true);
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
                    this.batchData.data.forEach(row => {
                        if (!Number(row.print_num)) {
                            row.print_num = '';
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
            batchData: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            selectPrinter: require('@/components/select-printer.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
        }
    }
</script>
