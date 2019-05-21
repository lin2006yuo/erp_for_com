<template>
    <div class="c-data-table">
        <el-table
            class="mt-xs scroll-bar"
            border
            v-resize="{height:41}"
            :data="dataTable.lists"
            v-loading="isLoading"
            element-loading-text="玩命加载中..."
            highlight-current-row
            @sort-change="sort_change"
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                type="selection"
                :selectable="selectable"
                width="30">
            </el-table-column>
            <el-table-column label="售后单编号" inline-template width="160">
                <div>
                    <ui-tip :content="row.sale_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="订单号" inline-template width="200">
                <div>
                    <ui-tip :is-operate="true" :content="row.order_number"  :width="98" @cur-click="cur_click(row)"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="收件人国家" inline-template>
                <div>
                    <ui-tip :content="row.buyer_country_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="买家ID" inline-template>
                <div>
                    <ui-tip :content="row.buyer_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="退款" prop="refund"></el-table-column>
            <el-table-column label="补发货" prop="redeliver"></el-table-column>
            <el-table-column label="退货" prop="return"></el-table-column>
            <el-table-column label="跟踪单号" sortable show-tooltip-when-overflow prop="buyer_return_tracking_num"></el-table-column>
            <el-table-column label="创建人" prop="creator"></el-table-column>
            <el-table-column label="提交人" sortable inline-template>
                <div>
                    <ui-tip :content="row.submitter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="创建时间" sortable inline-template>
                <times :time="row.create_time"></times>
            </el-table-column>
            <el-table-column label="提交时间" sortable inline-template>
                <times :time="row.submit_time"></times>
            </el-table-column>
            <el-table-column label="审批时间" sortable inline-template>
                <times :time="row.approve_time"></times>
            </el-table-column>
            <el-table-column label="操作" inline-template width="200">
                <div>
                    <permission tag="span" :route="apis.url_look_over" class="operate inline" @click="look_over(row)">查看</permission>
                    <span  class="inline" v-if="(row.approve_status===1||row.approve_status===3)&&row.source_type!==1">
                        |
                        <permission tag="span" :route="apis.url_edit" class="operate" @click="edit(row)">编辑</permission>
                    </span>
                    <span class="inline" v-if="row.approve_status!==4">
                        |
                        <permission tag="span" :route="apis.url_look_over" class="operate" @click="handle(row)">处理</permission>
                    </span>
                    <span v-if="row.approve_status===1 || row.approve_status===3">
                        |
                        <permission tag="span" :route="apis.url_delete" class="operate" @click="cur_delete(row)">删除</permission>
                    </span>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="dataTable.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="dataTable.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="dataTable.total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {url_edit,url_look_over,url_delete} from '../../../api/after-sale'
    export default{
        permission:{
            url_edit,
            url_look_over,
            url_delete
        },
        data(){
            return {}
        },
        filters:{
            filterTime(val){
                return !!val? datef("YYYY-MM-dd HH:mm:ss",val):'-- --';
            }
        },
        watch:{

        },
        methods:{
            cur_click(val){
                this.$emit('cur-click',val);
            },
//            表格排序
            sort_change(val){
                this.$emit("sort-change",val);
            },
            selectable(row){
                return row.refund_status!==4
            },
            size_change(size){
                this.$emit("size-change",size);
            },
            current_change(page){
                this.$emit("current-change",page);
            },
            look_over(val){
                this.$emit("look-over",val);
            },
            edit(val){
                this.$emit("edit",val);
            },
            handle(val){
                this.$emit("handle",val);
            },
            cur_delete(val){
                this.$emit("cur-delete",val);
            },
            handleSelectionChange(value) {
                this.$emit("data-change", value)
            },
        },
        props:{
            dataTable:{
                required:true,
                type:Object
            },
            isLoading:{
                required:true,
                type:Boolean
            },

        },
        components: {
            uiTip:require('../../../components/ui-tip.vue').default
        }
    }
</script>
