<template>
    <div>
        <page-dialog title="查看橱窗产品" size="large" v-model="visible" :close-on-click-modal="false">
            <p>
                当前账号：<span class="mr-xs error">{{product.account.code}}</span>
                正在使用橱窗：<span class="mr-xs error">{{product.used_count}}</span>
                还可用橱窗：<span class="mr-xs error">{{product.left_count}}</span>
            </p>
            <el-table
                    :data="product.list"
                    border
                    max-height="500"
                    style="width: 100%"
                    class="mb-sm scroll-bar">
                <el-table-column
                        width="50"
                        label="图片">
                    <template slot-scope="scope">
                        <el-popover
                                placement="right"
                                trigger="hover">
                            <img :src="scope.row.imageurls" width="150px" height="150px">
                            <span slot="reference">
                                    <img :src="scope.row.imageurls" v-if="scope.row.imageurls" height="26px" width="26px" style="border:none">
                                </span>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                        label="平台产品ID"
                        inline-template>
                    <div>
                        <ui-tip :content="row.productId" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="本地SPU"
                        inline-template>
                    <div>
                        <ui-tip :content="row.goods_spu" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="刊登标题"
                        inline-template>
                    <div>
                        <ui-tip :content="row.subject" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="账号简称"
                        inline-template>
                    <div>
                        <ui-tip :content="product.account.code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="产品分组"
                        inline-template>
                    <div>
                        <ui-tip :content="row.group_name" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="零售价"
                        inline-template>
                    <div>
                        <ui-tip :content="row.product_price" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="批发价"
                        inline-template>
                    <div>
                        <ui-tip :content="row.bulk_price" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="剩余生效时间"
                        inline-template>
                    <div>
                        <ui-tip :content="row.remainingDays" :width="98"></ui-tip>
                    </div>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="visible = false">关 闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
</style>
<script>
    export default {
        data(){
            return {
                visible:false,
            }
        },
        mounted(){
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
            value:{},
            product:{
                required:true,
                type:Object
            },
        },
        components: {
            pageDialog:require("../../../../components/page-dialog.vue").default,
            uiTip:require("../../../../components/ui-tip.vue").default
        },
    }
</script>
