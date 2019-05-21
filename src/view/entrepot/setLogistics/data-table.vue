<template>
    <el-row class="setlogistics-table">
        <el-table
                :data="tableData.data"
                highlight-current-row
                @row-click="check_ship"
                :current-row-key="tableId"
                row-key="id"
                v-resize="{height:41}"
                v-loading="loading" element-loading-text="玩命加载中..." border>
            <el-table-column inline-template label="物流名称" align="center" show-overflow-tooltip>
                <ui-tip :content="row.fullname" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column property="code" label="物流代码" align="center"></el-table-column>
            <el-table-column inline-template label="面单序列号" align="center">
                <ui-tip :content="row.sequence_number" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column inline-template label="物流类型" align="center">
                <div>{{row.type|typeFilter}}</div>
            </el-table-column>
            <el-table-column inline-template label="状态" align="center" width="60">
                <div>
                    {{row.status|statusFilter}}
                </div>
            </el-table-column>
            <el-table-column inline-template label="添加/修改时间"  align="center" width="180" show-overflow-tooltip>
                <div class="t-left">
                    {{row.create_time|timeFilter}}/
                    {{row.update_time|timeFilter}}
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="1"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size=params.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=tableData.total
                class="t-right mt-sm">
        </el-pagination>
    </el-row>
</template>
<style lang="stylus">
    .setlogistics-table{
        .el-table__body-wrapper{
            overflow-x: hidden;
        }
    }
</style>
<script>
    export default{
        data(){
            return {
                tableId:''
            }
        },
        methods:{
            handle_size_change(val){
                this.$emit('size-change',val)
            },
            handle_current_change(val){
                this.$emit('cur-change',val)
            },
            check_ship(row){
                this.$emit('check-ship',row)
                this.tableId = row.id;
            },
        },
        filters:{
            timeFilter(val){
                return datef('YYYY-MM-dd',val);
            },
            typeFilter(val){
                return val === 0 ? '无对接物流商' : 'API对接物流商'
            },
            statusFilter(val){
                return val == 1 ? '启用' : '停用';
            }
        },
        props:{
            loading:{
                required:true,
                type:Boolean
            },
            tableData:{
                required:true,
                type:Object
            },
            params:{
                required:true,
                type:Object
            },
            activeID:{
                required:true,
                type:Number
            }
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,
        }
    }
</script>
