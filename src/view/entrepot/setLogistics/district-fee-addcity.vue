<template>
    <page-dialog title="添加城市" :value.sync="value" @close="close" width="300px">
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
                {id: 1, cn: '新疆'},
                {id: 2, cn: '广东'},
                {id: 3, cn: '浙江'},
                {id: 4, cn: '福建'},
            ],
            selectOptions: [],
            visible: this.value
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
            console.log('change')
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
        value: '',
        select: {
            type: Array,
            default: () => []
        },
    },
    watch: {
        value(show) {
            if(show) {
                // setTimeout(() => {
                //     this.select.forEach(row => {
                //         console.log(row)
                //         this.$refs.cityTabel.toggleRowSelection(row, true)
                //     })
                // }, 200);
                this.$nextTick(() => {
                    this.select.forEach(row => {
                        for(let val of this.city) {
                            if(val.id === row.id) {
                                this.$refs.cityTabel.toggleRowSelection(val, true)
                            }
                        }
                    })
                })
            }
        }
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