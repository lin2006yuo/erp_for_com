<template>
    <div class="p-package-handling">
        <div class="table_head">
            <span class="ml-sm fl table_title">打印包裹面单</span>
            <span class="fr mr-sm">
                <span class="printer_title">打印机：</span>
                <select-printer v-model="printer" class="inline width-lg"></select-printer>
            </span>
        </div>
        <div style="border:1px solid #e0e6ed; border-top:none;">
            <label-item label="包裹号/面单号：" class="mt-sm mb-sm" :labelWidth="120">
                <el-input v-model="searchData.number"
                          autofocus
                          clearable
                          ref="number"
                          class="width-lg inline"
                          @keyup.enter.native="print"
                          @change="number_change">
                </el-input>
                <span v-if="!!warning.number">
                    <i class="delete-icon"></i>
                    <span class="red tip">{{warning.number}}</span>
                </span>
                <span v-if="warning.success" class="ml-sm">
                    <i class="el-icon-circle-check"></i>
                </span>
            </label-item>
        </div>
    </div>
</template>
<style lang="stylus">
    .p-package-handling{
        .warning-text{
            font-size:2rem !important;
        }
        .tip{
            font-size: 16px !important;
            vertical-align: middle;
        }
        .right-table{
            width: 100%;
            border-left:1px solid #d3dce6;
            border-top:1px solid #d3dce6;
            td{
                border-bottom:1px solid #d3dce6;
                border-right:1px solid #d3dce6;
                height:33px;
            }
        }
        .big-width{
            width: 250px;
        }
        .el-icon-circle-check{
            vertical-align: middle;
            color: #13CE66;
        }
    }
</style>
<script>
    import {api_print_label} from '@/api/delivery-check'
    import {api_call_package} from '@/api/package-handling';
    import {mapActions} from 'vuex';
    export default {
        data(){
            return {
                searchData: {
                    info:[],
                    number:'',
                    sku:[],
                    message:'',
                    created_at:''
                },
                warning:{
                    number:'',
                    success:''
                },
                token:'',
                numberList:[],
                printer:''
            }
        },
        mounted(){

        },
        methods: {
            init(){
                this.$emit('init-data', this.searchData);
            },
            clear(data){
                Object.keys(data).forEach(key=>{
                    if(typeof data[key] === 'object'){
                        data[key].length = 0;
                    } else {
                        data[key] = "";
                    }
                });
            },
            ...mapActions({
                set_printerList:'api/set_printerList'
            }),
            async print(){
                try {
                    let type = [];
                    let content = '';
                    let numberList = [];
                    let coordinate = '';
                    let direction = 1;
                    let watermark = '';
                    this.warning.number = '';
                    this.searchData.sku.length = 0;
                    typeof this.searchData.number === 'string' && (this.searchData.number = this.searchData.number.trim());
                    let res = await this.$http(api_print_label, {number:this.searchData.number});
                    this.warning.success = true;
                    let infoObj = {
                        packing_time: res.packing_time,
                        package_create_time: res.package_create_time,
                        process_code: res.process_code,
                        shipping_number: res.shipping_number,
                        shipping_name: res.shipping_name,
                        package_number: res.package_number
                    };
                    this.searchData.info.length=0;
                    this.searchData.info.push(infoObj);
                    this.searchData.sku = res.sku_list;
                    res.print_data.file_list.forEach(row=>{
                        content = row.file;
                        type = row.type;
                        coordinate = row.coordinate;
                        watermark = row.label_num;
                    });
                    direction = res.print_data.direction || direction;
                    numberList = res.print_data.identification;
                    let params = {
                        Type:type,
                        Token:this.token,
                        Width:100,
                        Height:100,
                        Url:config.apiHost+res.print_data.callback,
                        PrintName:this.printer,
                        NumberList:numberList,
                        Coordinate:coordinate,
                        Watermark:watermark,
                        content:content,
                        Direction: direction === 1 ? 'vertical' : 'transverse',
                    };
                    params.Width = res.print_data.width;
                    params.Height = res.print_data.height;
                    this.searchData.created_at = res.created_at;
                    let flag =  this.$printer(this.printer, params);
                    if(!!flag){
                        flag.then(async printResult=>{
                            console.log('printResult', printResult);
                            if(printResult){
                                this.searchData.message = `扫描：${this.searchData.number}，包裹面单打印成功！`;
                                await this.$http(api_call_package, {package_id:res.package_id});
                            } else {
                                this.searchData.message = `扫描：${this.searchData.number}，包裹面单打印失败！`;
                            }
                            this.init();
                        })
                    } else {
                        this.searchData.message = `扫描：${this.searchData.number}，包裹面单打印失败！`;
                        this.init();
                    }
                } catch(code){
                    this.searchData.message = `扫描：${this.searchData.number}，${code.message}`;
                    this.searchData.created_at = code.created_at;
                    this.warning.number = code.message;
                    this.$message({type:"error",message:code.message || code});
                    this.init();
                } finally {
                    this.$refs.number.$refs.input.select();
                }
            },
            number_change(){
                this.warning.number = '';
                this.warning.success = false;
            }
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            labelItem:require('@/components/label-item').default,
            selectPrinter:require('@/components/select-printer').default
        },
    }
</script>
