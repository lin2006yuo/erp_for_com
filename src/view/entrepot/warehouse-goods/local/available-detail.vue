<template>
    <page-dialog v-model="visible" @open="open" @close="close" :title="availableInfo.title">
        <el-table :data="availableInfo.table"
                  :max-height="600"
                  class="scroll-bar"
                  border
                  highlight-current-row>
            <el-table-column label="备货计划单号" inline-template>
                <ui-tip :content="row.stocking_code" :width="95"></ui-tip>
            </el-table-column>
            <el-table-column label="备货人" inline-template>
                <ui-tip :content="row.stocking_user" :width="95"></ui-tip>
            </el-table-column>
            <el-table-column label="待发可用库存" inline-template>
                <ui-tip :content="row.available_qty" :width="95"></ui-tip>
            </el-table-column>
            <el-table-column label="调拨占用数量" inline-template>
                <ui-tip :content="row.use_qty" :width="95"></ui-tip>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                visible: this.value,
            }
        },
        methods: {
            open() {

            },
            sure() {

            },
            close() {
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            availableInfo: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
        }
    }
</script>