<template>
    <el-row class="p-first-order-table">
        <el-table
                :data="tableData"
                ref="multipleTable"
                v-resize="{height:41}"
                border
                style="width: 100%"
                v-loading="loading"
                highlight-current-row
                element-loading-text="玩命加载中..."
                class="scroll-bar">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>

            <el-table-column
                    width="150"
                    label="sku/sku别名">
                <template slot-scope="scope">
                    <span>{{scope.row.sku}}</span>
                    <br>
                    <span>{{scope.row.sku_alias===''?'--':scope.row.sku_alias}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="130"
                    label="图片">
                <template slot-scope="scope">
                    <el-popover placement="right" trigger="hover">
                        <img  v-lazy="sku_image(scope.row.thumb)"
                              width="200px" height="200px">
                        <span slot="reference">
                                          <img  v-lazy="get_path(scope.row.thumb)"
                                                height="60px" width="60px" style="border:none">
                                    </span>
                    </el-popover>
                </template>
            </el-table-column>

            <el-table-column
                    prop="goods_name"
                    label="产品名称">
            </el-table-column>

            <el-table-column
                    prop="category"
                    width="190"
                    label="所属分类">
            </el-table-column>

            <el-table-column
                    prop="channel_id"
                    width="140"
                    label="平台">
            </el-table-column>

            <el-table-column
                    prop="developer"
                    width="140"
                    label="开发员">
            </el-table-column>

            <el-table-column
                    prop="shelf_time"
                    width="140"
                    label="上架日期">
            </el-table-column>

            <el-table-column
                    prop="order_time"
                    width="140"
                    label="下单日期">
            </el-table-column>

            <el-table-column
                    prop="issue_time"
                    width="140"
                    label="出单日期(天)">
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
    </el-row>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {get_path}from '../../kandeng/ebay/kandeng-list/add-edit-listing/get-path';
    export default {
        name: "table-module",
        filters: {
            filterImage(val){
                return val.replace("_60x60","_200x200");
            },
        },
        methods: {
            handle_size_change(val){//----切换条数
                this.$emit('handle-size-change',val)
            },
            handle_current_change(val){//----切换页数
                this.$emit('handle-current-change',val)
            },
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.')
                }
                return ""
            },
            get_path
        },
        computed:{
            emptyText(){
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        props: {
            tableData: {
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
                type: Object
            },
            total: {
                type: Number
            },
        }

    }
</script>