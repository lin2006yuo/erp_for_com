<template>
    <div class="c-scalp-task-data-table">
        <el-table
            class="scroll-bar "
            :data="tableData.list"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            highlight-current-row
            v-resize="{height:41}"
            @selection-change="selection_change">
            <el-table-column width="30px" type="selection"></el-table-column>
            <el-table-column label="编号" inline-template>
                <ui-tip :content="row.task_number" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="计划日期" inline-template>
                <ui-tip :content="row.task_time|filterDate" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column :render-header="filterHeader('状态|类型')" inline-template>
                <div>
                    <div>
                        <ui-tip :content="row.status_txt" :width="98"></ui-tip>
                    </div>
                    <div>
                        <ui-tip :content="row.type" :width="98"></ui-tip>
                    </div>
                </div>
            </el-table-column>
            <el-table-column label="负责人" inline-template>
                <ui-tip :content="row.functionary_name" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="图片">
                <template slot-scope="scope">
                    <el-popover
                        v-if="scope.row.sku_img"
                        placement="right"
                        trigger="hover">
                        <img :src="scope.row.sku_img | filterImage"
                             width="200px"
                             height="200px">
                        <span slot="reference">
                            <img :src="scope.row.sku_img"
                                 @click="search_img(scope.row.sku_img)"
                                 height="60px" width="60px"
                                 style="border:none">
                                        </span>
                    </el-popover>
                    <img src="/static/error-picture-128.png"
                         v-else
                         height="60px" width="60px"
                         style="border:none">
                </template>
            </el-table-column>
            <el-table-column :render-header="filterHeader('SKU|ASIN')" inline-template>
                <div>
                    <div>
                        <ui-tip :content="row.sku" :width="98"></ui-tip>
                    </div>
                    <div>
                        <ui-tip :content="row.asin" :width="98"></ui-tip>
                    </div>
                </div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('平台|站点')" inline-template>
                <div>
                    <div>
                        <ui-tip :content="row.channel_id" :width="98"></ui-tip>
                    </div>
                    <div>
                        <ui-tip :content="row.site" :width="98"></ui-tip>
                    </div>
                </div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('账号简称|店铺名称')" inline-template>
                <div>
                    <div>
                        <ui-tip :content="row.account_id" :width="98"></ui-tip>
                    </div>
                    <div>
                        <ui-tip :content="row.account_name" :width="98"></ui-tip>
                    </div>
                </div>
            </el-table-column>
            <el-table-column label="销售员" inline-template>
                <ui-tip :content="row.seller_name" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="关键词" inline-template>
                <ui-tip :content="row.keyword" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="销售单价" inline-template>
                <ui-tip :content="row.seller_cost" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="下单数量" inline-template>
                <ui-tip :content="row.quantity" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="备注" inline-template>
                <ui-tip :content="row.remark" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="交易订单号" inline-template>
                <ui-tip :content="row.order_number" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="订单总支付金额" inline-template>
                <ui-tip :content="row.order_cost" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <trends-select class="inline" @trigger="trigger_select(row,$event)" :selects="select_option(row)" type="primary"></trends-select>
            </el-table-column>
        </el-table>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="tableData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="tableData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.totalSize">
        </el-pagination>
    </div>
</template>
<style lang="stylus">
    .c-scalp-task-data-table{
        th>div.cell{
            line-height 16px;
            padding:5px 0;
        }
        td>div.cell{
            line-height 16px;
            padding:5px 0;
        }
    }
</style>
<script>
    export default {
        data() {
            return {
                imgDialog:false,
                imgPath:''
            }
        },
        filters:{
            filterDate(val){
                return val?datef('YYYY-MM-dd',val):'-- --';
            },
        },
        methods:{
            filterHeader(head){
                return (h)=>{
                    return h('div',[
                        h('div',head.split('|')[0]),
                        h('div',head.split('|')[1])
                    ])
                }
            },
            selection_change(val){
                this.$emit("selection-change",val)
            },
            size_change(val){
                this.$emit("size-change",val);
            },
            current_change(val){
                this.$emit("current-change",val);
            },
            trigger_select(val,action){
                this.$emit("trigger-select",val,action);
            },
            select_option(row){
                return this.selectList;/*.filter(params=>{
                    return row.purview.find(item=>item===params.value);
                });*/
            },
            search_img(image) {
                this.imgPath = image.replace("_60x60", "_500x500");
                this.imgDialog = true;
            },
        },
        props:{
            loading:{
                type:Boolean,
                require:true
            },
            tableData:{
                type:Object,
                require:true
            },
            loading:{
                type:Boolean,
                require:true
            },
            selectList:{
                type:Array,
                require:true
            }
        },
        components: {
            uiTip:require("../../../components/ui-tip.vue").default,
            blowupImage: require("@/components/blowup-image.vue").default,
            trendsSelect:require('../../../components/trends-select.vue').default,
        }
    }
</script>
