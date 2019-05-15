<template>
    <div class="padding-test">
        <el-table
            :data="tableData"
            v-resize="{height:41}"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            class="scroll-bar"
            ref="tableModule"
            @selection-change="handle_selection_change"
            @row-click="handle_row_click"
            highlightCurrentRow>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column v-if="selection" type="selection"></el-table-column>
            <el-table-column
                v-for="(item, index) in tableColumns"
                :key="`${item.value}-${index}-${item.label}`"
                :label="item.label">
                <el-table-column :label="item.value" :prop="item.value">asd</el-table-column>
            </el-table-column>
        </el-table>
        <el-pagination
            class="page-fixed"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page="searchData.page"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="searchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                emptyText: '暂无数据',
                dataMock: {},
                sum: {
                    sum1: 1,
                    sum2: 2,
                    sum3: 3,
                }
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            handle_size_change(val) {
                this.$emit('size-change', val)
            },
            handle_current_change(val) {
                this.$emit('current-change',val)
            },
            handle_selection_change(val) {
                this.$emit('selection-change', val)
            },
            handle_row_click(row) {
                 this.$refs.tableModule.toggleRowSelection(row)
            },
            getData() {
                setTimeout(() => {
                   this.dataMock = {
                       a: '哈哈',
                       b: '比比'
                   }
                }, 2000)
            },
            renderHeader (h, { column, $index }) {
                // return h('p', {}, [column.label])
                // const renderColumn = () => {
                //     if($index % 2 ===0) {
                //         return (
                //             <div class="header-div">哈哈</div>
                //         )
                //     }else {
                //         return (
                //             <ul>
                //                 <li class="header-li">AA</li>
                //                 <li class="header-li">BB</li>
                //             </ul>
                //         )
                //     }
                // }
                // return (
                //     <div>
                //         <p class="header-title">{column.label}</p>
                //         {renderColumn()}
                        
                //     </div>
                // )
                const renderHeader = () => {
                    switch ($index) {
                        case 1:
                            return (<div class="border-top">汇总</div>)
                        case 5:
                             return (<div class="border-top">this.sum.package_num</div>)
                        case 6:
                             return (<div class="border-top">this.sum.package_weight</div>)
                        case 7:
                             return (<div class="border-top">this.sum.shipping_fee</div>)
                        default:
                            return <div></div>
                    }

                }
                return (
                    <div>
                        <div>{column.label}</div>
                        {renderHeader()}
                    </div>
                )
            }
        },
        props: {
            searchData: {
                type: Object,
                require: true
            },
            tableColumns: {
                type: Array,
                require: true
            },
            tableData: {
                type:Array,
                require: true
            },
            loading: {
                default: false
            },
            total: {
                default: 0
            },
            selection: {
                type: Boolean,
                default: false
            }
        }
    }
</script>
<style scope lang="stylus">
.header-title {
    border-bottom: 1px solid #e0e6ed;
    padding: 0;
    margin: 0;
}
.header-li {
    height: 40px
}
.header-div {
    height: 80px
}
.padding-test th {
    padding: 0;
}
.padding-test .cell {
    padding: 0;
}
.border-top {
    border-top: 1px solid #e0e6ed;
}
</style>
