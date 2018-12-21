<template>
    <div>
        <page-dialog title="" size="large" @open="open" v-model="visible" :close-on-click-modal="false">
            <el-row class="mt-xs mb-xs">
                <div class="fr">
                    <el-button type="primary" size="mini" @click="back_reset">一键清零</el-button>
                </div>
            </el-row>
            <el-row>
                <el-table
                        :data="arrivalList"
                        border
                        width="100%"
                        class="mt-xs scroll-bar"
                        max-height="400">
                    <el-table-column
                            width="65"
                            label="产品图片">
                        <template slot-scope="scope">
                            <el-popover
                                    placement="right"
                                    trigger="hover">
                                <img v-lazy="sku_image(scope.row.thumb)"
                                     width="200px"
                                     height="200px">
                                <span slot="reference">
                                    <img v-lazy="scope.row.thumb"
                                         v-if="scope.row.thumb"
                                         height="60px" width="60px"
                                         style="border:none">
                                </span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="80"
                        label="SKU/别名"
                        inline-template>
                        <div>
                            <div>{{row.sku}}</div>
                            <div>{{row.sku_alias|filterAlias}}</div>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="货品名称"
                            inline-template>
                        <div>
                            <ui-tip :content="row.sku_name" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                        width="120"
                        label="采购数量"
                        inline-template>
                        <div>
                            <ui-tip :content="row.qty" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                        width="120"
                        label="已到货数量"
                        inline-template>
                        <div>
                            <ui-tip :content="row.in_qty" :width="98" v-if="row.expected_int_qty"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            width="140"
                            label="本次到货数量"
                            inline-template>
                        <ui-limit-number v-model="row.arrival_num"
                                         style="width:80px"
                                         :max="row.qty-row.in_qty"
                                         :limit="1"
                                         class="inline"
                                         :min="0">
                        </ui-limit-number>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row class="mt-sm">
                <div style="font-weight: bold;">备注</div>
                <div>
                    <el-input
                        type="textarea"
                        class="mt-mini"
                        :autosize="{ minRows: 3, maxRows: 5}"
                        placeholder="请添加备注"
                        v-model="remark">
                    </el-input></div>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <request-button req-key="url_purchase_order_sure_arrival" :mintime="200" @click="confirm">确认</request-button>
                <el-button type="default" size="mini" @click="cancel">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style>
</style>
<script>
    export default {
        data(){
            return {
                visible: false,
                remark: '',
            }
        },
        methods: {
            open() {
                this.remark = '';
            },
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.');
                }
                return ""
            },
            back_reset(){
                this.arrivalList.forEach(row=>{
                    row.arrival_num = '0';
                });
            },
            confirm() {
                this.$emit('confirm',this.id);
            },
            cancel() {
                this.visible = false;
            }
        },
        filters:{
            filterAlias(val){
                return Array.isArray(val)?val.join(','):val
            },
        },
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
                required:true,
                type:Boolean
            },
            arrivalList:{
                required:true,
                type:Array
            },
            id:{}
        },
        components: {
            pageDialog:require("@/components/page-dialog.vue").default,
            uiTip: require('@/components/ui-tip.vue').default,
            uiLimitNumber:require('@/components/ui-limit-number').default,
        },
    }
</script>
