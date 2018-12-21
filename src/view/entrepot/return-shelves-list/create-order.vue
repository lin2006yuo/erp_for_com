<template>
    <page-dialog :title="`查看上架单${trendAction.number}`"
                 size="large"
                 class="p-return-shelves"
                 v-model="visible"
                 :close-on-click-modal="false">
        <el-table
            :data="orderData"
            v-loading="orderLoading"
            class="scroll-bar"
            element-loading-text="玩命加载中"
            highlightCurrentRow>
            <el-table-column
                inline-template
                label="上架单号">
                <div>
                    <ui-tip :content="row.id" :width="98"></ui-tip>
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
                label="状态">
                <div>
                    <ui-tip :content="row.status_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="待上架数">
                <div>
                    <ui-tip :content="Number(row.quantity_left)" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="总数">
                <div>
                    <ui-tip :content="Number(row.quantity)" :width="98"></ui-tip>
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
        </el-table>
        <el-table
            :data="detailData"
            v-resize="{height:150}"
            v-loading="detailLoading"
            class="scroll-bar mt-sm"
            element-loading-text="玩命加载中"
            highlightCurrentRow>
            <el-table-column
                inline-template
                label="上架编号">
                <div>
                    <ui-tip :content="row.id" :width="98"></ui-tip>
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
                label="待上架数">
                <div>
                    <ui-tip :content="row.quantity_left" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="上架总数">
                <div>
                    <ui-tip :content="row.quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="库存">
                <div>
                    <ui-tip :content="row.quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                width="500"
                label="商品名称（规格）">
                <div>
                    <ui-tip :content="row.spu_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <el-button size="mini" @click="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
</style>
<script>
    import {api_look_shelves} from '../../../api/return-shelves'
    export default {
        data(){
            return {
                visible: this.value,
                orderLoading:false,
                detailLoading:false,
                orderNumber:'',
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
        methods: {},
        computed: {},
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value:{
                default(){
                    return false;
                },
            },
            orderData:{},
            detailData:{},
            trendAction:{}
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            uiTip:require('../../../components/ui-tip').default
        },
    }
</script>
