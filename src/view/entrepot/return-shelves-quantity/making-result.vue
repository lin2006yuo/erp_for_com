<template>
    <page-dialog v-model="visible" @open="" @close="close" :title="title">
        <el-table :data="result" class="scroll-bar" v-resize="{height: 150}">
            <el-table-column label="周转箱号" prop="turnover"></el-table-column>
            <el-table-column label="SKU" prop="sku"></el-table-column>
            <el-table-column label="数量" prop="quantity"></el-table-column>
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
        name: "feedback",
        data() {
            return {
                visible: false,
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
            result: {},
            title: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>