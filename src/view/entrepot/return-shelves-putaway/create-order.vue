<template>
    <page-dialog title="成功创建上架单"
                 size="large"
                 class="p-return-shelves"
                 v-model="visible"
                 :before-close="true"
                 @close="close"
                 :close-on-click-modal="false">
        <div class="table_head">
            <span class="ml-sm fl table_title">
                请点击<b>上架单号</b>，查看并根据上架路径进行周转篮的位置排放
            </span>
            <span class="fr mr-sm">
                <span class="printer_title">打印机：</span>
                <select-printer v-model="printer" class="inline width-lg"></select-printer>
            </span>
        </div>
        <el-table
            :data="orderData"
            :max-height="200"
            v-loading="orderLoading"
            class="scroll-bar"
            element-loading-text="玩命加载中"
            highlightCurrentRow>
            <el-table-column
                inline-template
                label="上架单号">
                <div>
                    <ui-tip :is-operate="true"
                            :content="row.id"
                            @cur-click="order(row)"
                            :width="98">
                    </ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="分区">
                <div>
                    <ui-tip :content="row.warehouse_area_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="周转篮数量">
                <div>
                    <ui-tip :content="row.num" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="SKU数量">
                <div>
                    <ui-tip :content="row.quantity_left" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="创建人">
                <div>
                    <ui-tip :content="row.creator_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="创建时间">
                <div>
                    <ui-tip :content="row.create_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="操作">
                <div>
                    <el-button type="primary" size="mini" @click="print">打印</el-button>
                </div>
            </el-table-column>
        </el-table>
        <div class="table_head mt-sm">
            <span class="ml-sm fl table_title">
                上架单:{{orderNumber}}的上架路径
            </span>
        </div>
        <el-table
            :data="detailData"
            v-resize="{height:150}"
            v-loading="detailLoading"
            class="scroll-bar"
            element-loading-text="玩命加载中"
            highlightCurrentRow>
            <el-table-column
                inline-template
                sortable
                label="上架编号">
                <div>
                    <ui-tip :content="row.id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="周转篮号">
                <div>
                    <ui-tip :content="row.car_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="货位号">
                <div>
                    <ui-tip :content="row.warehouse_cargo_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="SKU">
                <div>
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="数量">
                <div>
                    <ui-tip :content="row.quantity_left" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <el-button size="mini" @click="close">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
</style>
<script>
    import {print} from './preview'
    import {api_look_shelves,api_look_reback_shelves_order} from '../../../api/return-shelves'
    export default {
        data(){
            return {
                visible: false,
                orderLoading:false,
                detailLoading:false,
                detailData:[],
                printer:'',
                orderNumber:'',
                print_html:'',
                print_number:'',
                token:'',
                printContent:''
            }
        },
        mounted(){},
        filters:{
            timeFilter(val){
                if(val){
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
        },
        methods: {
            order(row){
                this.$http(api_look_reback_shelves_order, row.id).then(res=>{
                    this.detailData = res.data.details;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            print(row){
                print.call(this, true);
            },
            close(){
                this.$confirm(`关闭此窗口将会清空当前周转篮编号数据，确定要关闭吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit('close');
                    sessionStorage.removeItem('reback_tableModule');
                    this.visible = false;
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        },
        computed: {},
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                if(val){
                    this.orderNumber = this.orderData[0].id;
                    this.order(this.orderData[0]);
                }
                this.visible = val;
            },
        },
        props: {
            value:{},
            orderData:{}
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            selectPrinter:require('../../../components/select-printer').default,
            uiTip:require('../../../components/ui-tip').default
        },
    }
</script>
