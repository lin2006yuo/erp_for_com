<template>
    <div class="p-package-handling">
        <div class="table_head">
            <span class="ml-sm fl table_title">包裹详情</span>
        </div>
        <el-table :data="searchData.info"
                  style="height:120px;"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  class="scroll-bar mb-sm"
                  highlight-current-row>
            <el-table-column
                inline-template
                label="包裹号">
                <div>
                    <ui-tip :content="row.package_number" :width="108"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                min-width="200"
                inline-template
                label="邮寄方式">
                <div>
                    <ui-tip :content="row.shipping_name" :width="108"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="跟踪号">
                <div>
                    <ui-tip :content="row.shipping_number" :width="108"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="物流商单号">
                <div>
                    <ui-tip :content="row.process_code" :width="108"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="包裹生成时间">
                <div>
                    <ui-tip :content="row.package_create_time|fmsdatetime" :width="108"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="包裹包装时间">
                <div>
                    <ui-tip :content="row.packing_time|fmsdatetime" :width="108"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
        <el-table :data="searchData.sku"
                  v-resize="{height:40}"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  class="scroll-bar"
                  highlight-current-row>
            <el-table-column
                width="100"
                label="图片">
                <template slot-scope="scope">
                    <el-popover
                        placement="right"
                        trigger="hover">
                        <img :src="scope.row.thumb | filterImage" width="200px" height="200px">
                        <span slot="reference">
                                    <img :src="scope.row.thumb" v-if="scope.row.thumb" height="60px" width="60px"
                                         style="border:none;vertical-align: middle">
                                </span>
                    </el-popover>
                </template>
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
                label="名称">
                <div>
                    {{row.goods_name}}
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="数量">
                <div>
                    <ui-tip :content="row.sku_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="重量(g)">
                <div>
                    <ui-tip :content="row.weight" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
    </div>
</template>
<style lang="stylus">
    .p-package-handling {

    .table_head {
        height: 32px;
        line-height: 28px;
        border: 1px solid #e0e6ed;
        background-color: #6295E9;
        color: white;
    }

    .table_title {
        vertical-align: middle;
        line-height: 32px;
    }

    .c-label-item {

    }

    .c-label-item > * {
        vertical-align: baseline;
    }

    .el-col-4 {
        height: 30px;
    }

    }
</style>
<script>
    export default {
        data(){
            return {
                loading: false,
            }
        },
        mounted(){
        },
        filters: {
            filterImage(val){
                return val.replace("_60x60", "_200x200");
            },
        },
        methods: {
            look(){
                console.log('this.searchData', this.searchData)
            }
        },
        computed: {},
        watch: {},
        props: {
            searchData: {
                required: true,
                type: Object
            }
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            labelItem: require('@/components/label-item.vue').default,
        },
    }
</script>
