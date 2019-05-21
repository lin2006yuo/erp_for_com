<template>
    <div class="plan-table-module">
        <el-table class="mb-sm scroll-bar"
                  border :data="tableData"
                  highlight-current-row
                  ref="multipleTable"
                  v-resize="{height: 41}"
                  :row-key="row_key"
                  :row-class-name="row_class_name"
                  @selection-change="selection_change"
                  @sort-change="sort_change"
                  v-loading="isLoading"
                  element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="30" align="center">
            </el-table-column>
            <el-table-column label="编号" min-width="60" inline-template>
                <ui-title>{{row.purchase_plan_code}}</ui-title>
            </el-table-column>
            <el-table-column label="采购仓库" min-width="55" inline-template>
                <div :title="row.warehouse_name" class="ellipsis">{{row.warehouse_name}}</div>
            </el-table-column>
            <el-table-column label="供应商" min-width="90" inline-template>
                <div v-if="row.supplier_list" class="ellipsis" :title="row.supplier_list">{{row.supplier_list}}</div>
                <div v-else>
                    <div class="ellipsis red" title="错误供应商">错误供应商</div>
                </div>
            </el-table-column>
            <el-table-column label="结算方式" min-width="60" inline-template>
                <div :title="row.balance_text" class="ellipsis">{{row.balance_text}}</div>
            </el-table-column>
            <el-table-column label="贴标/套袋" min-width="60" inline-template>
                <ui-title>{{row.label_deck|filterLabelDeck}}</ui-title>
            </el-table-column>
            <el-table-column label="产品种类数" min-width="65" inline-template sortable>
                <ui-title>{{row.kind}}</ui-title>
            </el-table-column>
            <el-table-column label="运费" inline-template min-width="65">
                <div class="ellipsis" :title="row.ship_fee?row.ship_fee:'--'|filterAmount">{{row.ship_fee?row.currency_code:''}} {{row.ship_fee?row.ship_fee:'--'|filterAmount}}</div>
            </el-table-column>
            <el-table-column label="总金额" inline-template sortable min-width="65">
                <div class="ellipsis" :title="row.amount|filterAmount">{{row.currency_code}} {{row.amount|filterAmount}}</div>
            </el-table-column>
            <el-table-column label="创建人" min-width="50" inline-template>
                <ui-title>{{row.creater}}</ui-title>
            </el-table-column>
            <el-table-column label="相关采购员" min-width="60" inline-template>
                <ui-title>{{row.purchaser_list}}</ui-title>
            </el-table-column>
            <el-table-column label="提交日期" inline-template>
                <div :title="row.commit_date | filterDate" class="ellipsis">{{row.commit_date | filterDate}}</div>
            </el-table-column>
            <el-table-column label="一级审核人" min-width="50" inline-template>
                <div class="ellipsis" :title="row.approver_name?row.approver_name:'--'">{{row.approver_name?row.approver_name:'--'}}</div>
            </el-table-column>
            <el-table-column label="二级审核人" min-width="50" inline-template>
                <ui-title>{{row.second_approver_name?row.second_approver_name:'--'}}</ui-title>
            </el-table-column>
            <el-table-column label="状态" min-width="55" inline-template>
                <div class="ellipsis" :title="row.status|filterStatus">{{row.status|filterStatus}}</div>
            </el-table-column>
            <el-table-column label="备注" inline-template>
                <div class="ellipsis" :title="row.description">{{row.description}}</div>
            </el-table-column>
            <el-table-column label="操作" inline-template min-width="100">
                <dropdown :actions="operations(row)"
                          v-model="current"
                          @action="operationClick(row, $event)"></dropdown>
            </el-table-column>
        </el-table>

    </div>
</template>
<style lang="stylus">
    .plan-table-module {

    }
</style>
<script>
    export default {
        name: 'search-module',
        data() {
            return {
                current: 0,
            }
        },
        methods: {
            operationClick(row, $event) {
                this.$emit('operation-click', row, $event);
            },
            selection_change(val) {
                this.$emit('selection-change', val)
            },
            sort_change(val) {
                this.$emit('sort-change', val)
            },
            row_class_name(row) {
                if (row.warehouse_id === 550) {
                    return 'green';
                } else if(!row.supplier_list){
                    return 'red';
                }else {
                    return '';
                }
            },
            row_key(row){
                return `${row.id}${row.developer_id}${row.purchase_id}`
            },
        },
        computed:{
            emptyText() {
                return this.firstLoading ? '等待请求数据中...' : '暂无数据'
            },
        },
        filters: {
            filterLabelDeck(val){
                switch (val) {
                    case 0:
                        return '都不支持';
                        break
                    case 1:
                        return '仅贴标';
                        break
                    case 2:
                        return '仅套袋';
                        break
                    case 3:
                        return '贴标和套袋';
                        break
                    case 4:
                        return '都不支持';
                        break
                    default:
                        return '都不支持';
                }
            },
            filterAmount(val){
                return !!val&&!isNaN(Number(val))?Number(val).toFixed(3):val;
            },
            filterDate(val){
                return typeof val==="number"?datef('YYYY-MM-dd HH:mm:ss',val):(val||'-- --');
            },
            filterStatus(val) {
                switch (val) {
                    case 0:
                        return '未提交';
                        break
                    case 1:
                        return '等待审批';
                        break
                    case 2:
                        return '审批未通过';
                        break
                    case 3:
                        return '取消采购';
                        break
                    case 4:
                        return '已生成采购单';
                        break
                    case 5:
                        return '禁用';
                        break
                    default:
                        return '未定义';
                }
            },
        },
        props: {
            tableData: {
                required: true,
                type: Array
            },
            isLoading: {
                required: true,
                type: Boolean
            },
            firstLoading: {
                required: true,
                type: Boolean
            },
            operations: {
                required: true,
            }
        },
        components: {
        }
    }
</script>
