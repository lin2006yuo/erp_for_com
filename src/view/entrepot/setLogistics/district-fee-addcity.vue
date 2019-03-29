<template>
    <page-dialog title="添加城市" v-model="value" @close="close" width="300px">
        <el-table
            :data="city"
            ref="cityTabel"
            @selection-change="handle_selection_change"
            @row-click="handle_row_click"
        >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="英文" prop="en"></el-table-column>
            <el-table-column label="中文" prop="cn"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="sure">确定</el-button>
            <el-button size="mini" @click.native="close">取消</el-button>
        </div>
    </page-dialog>
</template>
<script>
export default {
    data() {
        return {
            city: [
                {en: 'Amarica', cn: '美国'},
                {en: 'China', cn: '中国'},
                {en: 'Janpen', cn: '日本'},
            ],
            selectOptions: []
        }
    },
    methods: {
        sure() {
            this.$emit('add-city', this.selectOptions)
        },
        close() {
            this.$emit('input', false)
        },
        handle_selection_change(val) {
            this.selectOptions = val
        },
        handle_row_click(row) {
            this.$refs.cityTabel.toggleRowSelection(row)
        }
    },
    components: {
        pageDialog: require('@/components/page-dialog.vue').default,
    },
    props: {
        value: ''
    }
}
</script>
<style lang="stylus">
    .c-district-fee {
        .el-card{
            overflow: inherit;
        }
        .title {
            line-height: 1;
            font-size: 14px;
            font-weight: 500;
            color: #1f2d3d;
            background-color: #fff;
        }
    }
</style>