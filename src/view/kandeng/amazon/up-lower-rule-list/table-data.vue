<template>
    <div class="c-table-data">
        <el-table
                class="scroll-bar"
                v-resize="{height:41}"
                :data="tableData.lists"
                v-loading="loading"
                :element-loading-text="$t('ymx-up-lower-rule.loading')"
                highlight-current-row
                @selection-change="handle_selection_change">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>

            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>

            <el-table-column :label="$t('ymx-up-lower-rule.ruleName')" prop="rule_name">

            </el-table-column>

            <el-table-column :label="$t('ymx-up-lower-rule.ruleValidity')">
                <template slot-scope="scope">
                    <span>{{scope.row.start_time}}--{{scope.row.end_time}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('ymx-up-lower-rule.whetherToEnable')">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status === 0 ? true : false"
                               :onText="$t('ymx-up-lower-rule.enable')"
                               :offText="$t('ymx-up-lower-rule.disable')"
                               @change="change_status(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>

            <el-table-column :label="$t('ymx-up-lower-rule.founder')" prop="username"></el-table-column>

            <el-table-column :label="$t('ymx-up-lower-rule.creationTime')">
                <template slot-scope="scope">
                    <span>{{scope.row.created_time}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('ymx-up-lower-rule.operation')">
                <template slot-scope="scope">
                    <el-button type="text" @click.native="edit(scope.row)">{{$t('ymx-up-lower-rule.editBtn')}}</el-button>
                    <span> | </span>
                    <el-button type="text" @click.native="delete_rule(scope.row)">{{$t('ymx-up-lower-rule.deleteBtn')}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="tableData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size=tableData.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {}
        },
        methods:{
            edit(row){//编辑
                this.$emit('edit',row)
            },
            delete_rule(row){//删除
                this.$emit('delete-rule',row)
            },
            change_status(row){
                this.$emit('change-status', row)
            },
            handle_selection_change(val) {
                this.$emit('handle-selection-change',val)
            },
            size_change(size){
                this.$emit('size-change',size);
            },
            current_change(page){
                this.$emit('current-change',page);
            },
        },
        computed:{
            emptyText() {
                return this.firstLoading?this.$t('ymx-up-lower-rule.waitForData'):this.$t('ymx-up-lower-rule.emptyData')
            }
        },
        props:{
            tableData:{
                type:Object,
                required:true,
            },
            loading:{
                type:Boolean,
                required:true,
            },
            firstLoading:{
                type:Boolean,
                required:true,
            }
        },
        components: {}
    }
</script>