<template>
    <div class="c-data-table">
        <el-table
            class="scroll-bar "
            :data="tableData.list"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            highlight-current-row
            v-resize="{height:41}"
            @selection-change="selection_change">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection">
                <!--<el-checkbox v-model="row.isCheck()"></el-checkbox>-->
            </el-table-column>
            <el-table-column label="编号" inline-template>
                <ui-tip :content="row.number" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="平台/站点" inline-template>
                <div>
                    <span>{{row.channel}}</span>
                    <br>
                    <span>{{row.site|siteFilter}}</span>
                </div>
            </el-table-column>
            <el-table-column label="销售员" inline-template>
                <ui-tip :content="row.seller_name" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="申请原因" inline-template>
                <div>{{row.reason | filterReason}}</div>
            </el-table-column>
            <el-table-column label="总费用预估" inline-template>
                <ui-tip :content="row.estimate_total_cost" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="状态" inline-template>
                <ui-tip :content="row.status_txt" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="申请时间" inline-template>
                <times :time="row.created_time"></times>
            </el-table-column>
            <el-table-column label="操作人" inline-template>
                <ui-tip :content="row.operator_name" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <trends-select class="inline" @trigger="trigger_select(row,$event)" :selects="select_option(row)" type="primary"></trends-select>
            </el-table-column>
        </el-table>
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

</style>
<script>
    export default {
        data() {
            return {
            }
        },
        filters:{
            filterReason(val){
                switch(val){
                    case 1:
                        return "打造爆款";
                        break;
                    case 2:
                        return "问题帐号";
                        break;
                    case 3:
                        return "新店铺";
                        break;
                }
            },
            siteFilter(val){
                if(val){
                    return val
                }else{
                    return '--'
                }
            }
        },
        methods:{
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
                if(row.status === 1){
                    return this.selectList.filter(params=>{
                        return row.purview.find(item=>item===params.value);
                    });
                }else{
                    return this.selectList.filter(params=>{
                        if(params.value !==2){
                            return row.purview.find(item=>item===params.value);
                        }
                    });
                }

            }
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '等待请求数据中...' : '暂无数据'
            }
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
            },
            firstLoading:{
                type: Boolean,
                require:true
            }
        },
        components: {
            uiTip:require("../../../components/ui-tip.vue").default,
            trendsSelect:require('../../../components/trends-select.vue').default,
        }
    }
</script>
