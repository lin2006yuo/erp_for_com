<template>
    <ui-card class="form-item">
        <span slot="header">
            <img src="../../../assets/u1828.png" class="title-img ml-xs">
            <span class="title-text">{{`产能操作明细（${title.warehouseName}-${title.use}）`}}</span>
        </span>
        <el-table
                :data="tableData.data"
                class="scroll-bar"
                @sort-change="sort_change"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                v-resize="{height:61}"
                highlight-current-row>
            <el-table-column
                    inline-template
                    v-for="(item, index) in tableColumns"
                    :key="`${item.value}-${index}-${item.label}`"
                    :label="item.label"
                    :prop="item.value"
                    sortable="custom">
                <ui-tip :content="row[item.value]" :width="98"></ui-tip>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="Number(tableData.page)"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="Number(tableData.pageSize)"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.count">
        </el-pagination>
    </ui-card>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {}
        },
        methods: {
            sort_change({ column, prop, order }){
                this.$emit('sort', prop, order);
            },
            handle_size_change(val){
                this.$emit('handle-size-change',val);
            },
            handle_current_change(val){
                this.$emit('handle-current-change',val);
            },
        },
        props: {
            tableColumns:{},
            tableData:{},
            title:{},
            loading:{}
        },
        components: {
            uiCard: require('@/components/ui-card').default,
            uiTip:require('@/components/ui-tip').default
        }
    }
</script>
