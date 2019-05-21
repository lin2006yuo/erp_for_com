<template>
    <page-dialog title="打印申报发票" v-model="visible" size="large" class="p-invoice-preview" :close-on-click-modal="false">
        <div class="print">
            <p class="print-title">
                请使用本界面的打印按钮直接打印，不要用浏览器打印功能
                <el-button @click="print">打印</el-button>
                <span class="fr mr-sm">
                        <span>打印机：</span>
                        <select-printer v-model="printer" class="inline width-lg"></select-printer>
                </span>
            </p>
        </div>
        <div v-html="previewHtml"></div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-invoice-preview{
        .print{
            text-align: center;
            margin-bottom: 10px;
            color: #ff4949;
            height: 40px;
            line-height:40px;
            .print-title{
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
    export default {
        data() {
            return {
                visible:false,
                printer:'',
                file_list:{},
                previewHtml:''
            }
        },
        methods: {
            print(){
                let numberList = [];
                let content = '';
                let type = 'html';
                let coordinate = '';
                let watermark = '';
                this.printData.file_list.forEach(row=>{
                    content = row.file;
                    coordinate = row.coordinate || '';
                    if(row.label_num === ''){
                        watermark = '##';
                    } else {
                        watermark = row.label_num || '';
                    }
                });
                numberList =  this.printData.identification;
                let params = {
                    top:30,
                    type:type,
                    coordinate:coordinate,
                    watermark:watermark,
                    content:content,
                    numberList:numberList,
                    url:config.apiHost+ this.printData.callback,
                    Width:210,
                    Height:297,
                    PrintName:this.printer
                };
                this.$printerOverlap(this.printer, params);
            },
            print_preview(){
                this.$http(this.api, this.params).then(res=>{
                    this.printData = res;
                    res.file_list.forEach(row=>{
                        this.previewHtml = row.file;
                    });
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            }
        },
        watch: {
            visible(val){
                this.$emit('input', val);
            },
            value(val){
                this.visible = val;
            }
        },
        props: {
            value:{},
            api:{},
            params:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog').default,
            selectPrinter:require('@/components/select-printer').default
        }
    }
</script>
