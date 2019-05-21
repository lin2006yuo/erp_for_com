<template>
    <el-card header="包裹详情">
        <el-table :data="packageInfo"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  class="scroll-bar"
                  v-resize="{height: 41}"
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
    </el-card>
</template>

<style lang="stylus">

</style>

<script>
    export default {
        props: {
            packageInfo: {},
            loading: {
                require: true,
                default() {
                    return false
                }
            }
        },
        components:{
            uiTip: require('@/components/ui-tip.vue').default,
        }
    }
</script>
