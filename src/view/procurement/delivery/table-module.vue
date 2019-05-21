<template>
    <div class="delivery-table-module">
        <el-table
            class="scroll-bar"
            :data="tableData"
            @selection-change="selectionChange"
            :row-key="row_key"
            :row-class-name="row_class_name"
            v-loading="isLoading"
            element-loading-text="玩命加载中..."
            highlight-current-row
            v-resize="{height:41}">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="图片" inline-template width="70">
                <el-popover
                    placement="right"
                    trigger="hover">
                    <img v-lazy="sku_image(row.thumb)" width="200px" height="200px">
                    <span slot="reference">
                                    <img v-lazy="row.thumb" height="60px" width="60px" style="border:none"
                                         v-if="row.thumb">
                                </span>
                </el-popover>
            </el-table-column>
            <el-table-column label="SKU/别名" inline-template min-width="60">
                <div>
                    <div>
                        <ui-tip :content="row.sku" :width="98"></ui-tip>
                    </div>
                    <div>
                        <ui-tip :content="row.sku_alias|filterAlias" :width="98"></ui-tip>
                    </div>
                </div>
            </el-table-column>
            <el-table-column label="名称" inline-template>
                <div :title="row.name">{{row.name}}</div>
            </el-table-column>
            <el-table-column label="供应商" inline-template min-width="80">
                <div>
                    <ui-tip :content="row.company_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="仓库" inline-template min-width="40">
                <ui-tip :content="row.warehouse_name" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="更新时间" inline-template min-width="60">
                <div>
                    <times :time="row.update_time"></times>
                </div>
            </el-table-column>
            <el-table-column label="到货交期" inline-template min-width="50">
                <ui-limit-number
                    v-model="row.delivery_days"
                    :limit="0"
                    :min="0"
                    class="inline enter-result s-width-mini"></ui-limit-number>
            </el-table-column>
            <el-table-column label="备货天数" inline-template min-width="50">
                <div :title="row.stocking_days">{{row.stocking_days}}</div>
                <!--<ui-limit-number-->
                <!--v-model="row.stocking_days"-->
                <!--:limit="0"-->
                <!--:min="0"-->
                <!--class="inline enter-result s-width-mini"></ui-limit-number>-->
            </el-table-column>
            <el-table-column label="仓库内耗" inline-template min-width="50">
                <ui-tip :content="row.shelf_days" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="安全交期" inline-template min-width="50">
                <ui-tip :content="row.safe_days" :width="98"></ui-tip>
            </el-table-column>
        </el-table>
    </div>
</template>
<style lang="stylus">
    .delivery-search-module {

    }
</style>
<script>
    export default {
        name: 'search-module',
        data() {
            return {
                clears: {
                    warehouse_id: '',
                    supplier_id: '',
                    orderKey: 'sku',
                    orderValue: '',
                    dds_b: '',
                    dds_e: '',
                    sds_b: '',
                    sds_e: '',
                    wif_b: '',
                    wif_e: '',
                    sd_b: '',
                    sd_e: ''
                },
                orders: [
                    {label: '商品SKU', value: 'sku'},
                    {label: '商品名称', value: 'name'},
                    {label: '商品SPU', value: 'spu'},
                ]
            }
        },
        methods: {
            selectionChange(val) {
                this.$emit('selection-change', val)
            },
            row_class_name(row) {
                if (Number(row.old_delivery_days) !== Number(row.delivery_days)) {
                    return 'row-change';
                } else {
                    return '';
                }
            },
            row_key(row){
                return `${row.id}${row.sku_id}`
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.')
                }
                return ""
            },
        },
        computed:{
            emptyText() {
                return this.firstLoading ? '等待请求数据中...' : '暂无数据'
            },
        },
        filters: {
            filterAlias(val) {
                return Array.isArray(val) ? val.join(',') : val
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
            }

        },
        components: {
            uiLimitNumber: require('@/components/ui-limit-number').default,
        }
    }
</script>
