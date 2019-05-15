<template>
    <page-dialog title="添加城市"  :value.sync="value" @close="close" width="300px">
        <el-table
            :data="city"
            ref="cityTabel"
            @selection-change="handle_selection_change"
            @row-click="handle_row_click"
            height="500"
        >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="英文" prop="english_name"></el-table-column>
            <el-table-column label="中文" prop="name"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="sure">确定</el-button>
            <el-button size="mini" @click.native="close">取消</el-button>
        </div>
    </page-dialog>
</template>
<script>
import { api_city } from '@/api/district-fee'
export default {
    data() {
        return {
            city: [],
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
        },
        get_citylist(country_code) {
            this.$http(api_city, {country_code, page: 1, pageSie: 1000}).then(res => {
                this.city = res.data
                    this.select.forEach(row => {
                        for(let val of this.city) {
                            if(val.id === row.id) {
                                this.$refs.cityTabel.toggleRowSelection(val, true)
                            }
                        }
                    })
                })
        },
    },
    watch: {
        value() {},
        code(val) {
            this.get_citylist(val)
        }
    },
    props: {
        value: '',
        select: {
            type: Array,
            default: () => []
        },
        //国家简码
        code: {}
    },
    components: {
        pageDialog: require('@/components/page-dialog.vue').default,
    },
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