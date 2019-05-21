<template>
    <el-card header="当前操作日志" class="eub-label-log ml-sm">
        <el-table :data="logData"
                  v-resize="{height:41}"
                  class="scroll-bar"
                  highlight-current-row>
            <el-table-column
                    inline-template
                    align="left"
                    min-width="300"
                    header-align="center"
                    label="操作事项">
                <div>
                    <ui-tip :content="row.message" :width="98" class="inline"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="130"
                    label="操作时间">
                <div>
                    <ui-tip :content="row.created_at | filertTime" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<style lang="stylus">

</style>

<script>
    export default {

        filters: {
            filertTime(val) {
                return val ? datef('YYYY-MM-dd HH:mm:ss', val) : '-- --';
            }
        },
        props: {
            logData: {},
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
        }
    }
</script>
