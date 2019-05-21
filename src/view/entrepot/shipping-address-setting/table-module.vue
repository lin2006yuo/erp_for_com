<template>
    <div>
        <el-table
                class="mt-xs scroll-bar"
                v-resize="{height:41}"
                :data="tableData"
                border
                highlight-current-row
                v-loading="loading"
                element-loading-text="拼命加载中"
                @selection-change="$listeners['handle-selection-change']">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>

            <el-table-column label="类型" inline-template>
                <div>
                    <ui-tip :content="row.type | typeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="名称" inline-template>
                <div>
                    <ui-tip :content="row.address_name" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="创建人" inline-template>
                <div>
                    <ui-tip :content="row.creator" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="创建时间" inline-template>
                <div>
                    <ui-tip :content="row.create_time" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="更新人" inline-template>
                <div>
                    <ui-tip :content="row.updater" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="更新时间" inline-template>
                <div>
                    <ui-tip :content="row.update_time" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="操作" inline-template>
                <div>
                    <el-button type="text" @click.native="look_edit(row,'look')">查看</el-button>
                    <span>|</span>
                    <el-button type="text" @click.native="look_edit(row,'edit')">修改</el-button>
                    <span>|</span>
                    <el-button type="text" @click.native="delete_address(row)">删除</el-button>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>

<style lang="stylus" scoped>

</style>

<script>
    export default {
        filters: {
            typeFilter(val){
                const typeName = new Map()
                    .set(1,'寄件人信息')
                    .set(2,'揽收人信息')
                    .set(3,'退货人信息');
                return typeName.get(val)
            }
        },
        methods:{
            look_edit(row, operation){
                this.$emit('look-edit', row, operation)
            },
            delete_address(row){
                this.$emit('delete-address', row)
            }
        },
        computed:{
            emptyText(){
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        props: {
            tableData: {
                required: true,
                type: Array
            },
            loading: {
                required: true,
                type: Boolean
            },
            firstLoading: {
                required: true,
                type: Boolean
            },
            searchData: {
                required: true,
                type: Object
            },
            total: {
                required: true,
                type: Number
            },
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default
        }
    }
</script>