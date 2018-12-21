<template>
    <page class="p-pdf-preview">
        <div style="margin: 0 auto;">
            <div style="margin: 100px auto 0 auto">
                <div>
                    <span>打印机：</span>
                    <select-printer v-model="printer" class="inline width-lg"></select-printer>
                    <el-button type="primary" size="mini" @click="print" class="ml-sm">打印</el-button>
                </div>
            </div>
            <div v-if="!!pdf_url">
                <img :src="pdf_url">
            </div>
            <div v-else v-html="pdf_html"></div>
        </div>
    </page>
</template>
<style lang="stylus">
    .p-pdf-preview{
        .p-center{
            position: absolute;
            top:0;
            left:0;
            bottom:0;
            right:0;
            margin: auto;
        }
    }
</style>
<script>
    import {api_print_package, api_get_pdf} from '../api/pickings'
    export default {
        data() {
            return {
                pdf_url: '',
                pdf_html: '',
                token: '',
                printer: '',
                package_id: ''
            }
        },
        mounted() {
            this.package_id = this.$route.query.package_id;
            this.$http(api_get_pdf, this.package_id).then(res => {
                if (res.type === 'html') {
                    this.pdf_html = res.content;
                } else {
                    this.pdf_url = res.url;
                }
            }).catch(code => {
                this.$message({type: "error", message: code.message || code});
            })
        },
        methods: {
            print() {
                let type = [];
                let content = '';
                let coordinate = [];
                let direction = 1;
                let numberList = [];
                let watermark = [];
                this.$http(api_print_package, {package_id: this.package_id}).then(res => {
                    res.file_list.forEach(row => {
                        content = row.file;
                        type = row.type;
                        coordinate = row.coordinate;
                        if (row.label_num === '') {
                            watermark = '##';
                        } else {
                            watermark = row.label_num;
                        }
                    });
                    numberList = res.identification;
                    direction = res.direction || direction;
                    let data = {
                        Type: type,
                        Token: this.token,
                        Width: 100,
                        Height: 100,
                        Url: config.apiHost + res.callback,
                        PrintName: this.printer,
                        NumberList: numberList,
                        Coordinate: coordinate,
                        Watermark: watermark,
                        content: content,
                        Direction: direction === 1 ? 'vertical' : 'transverse'
                    };
                    this.$printer(this.printer, data);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            }
        },
        watch: {},
        props: {},
        components: {
            selectPrinter: require('./../components/select-printer').default
        }
    }
</script>
