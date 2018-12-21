<template>
    <div>
        <el-table
                :data="tableData.lists" border  class="mb-sm scroll-bar"  v-loading="loading"
                v-resize="{height:41}"
                element-loading-text="玩命加载中..."
                @selection-change="selection_change"
                style="width: 100%">
            <el-table-column type="selection" width="50"></el-table-column>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column label="产品图片" inline-template width="80">
                <el-popover
                        placement="right"
                        width="200"
                        trigger="hover">
                    <img v-lazy="sku_image(row.thumb)" width="200" height="200"/>
                    <div slot="reference">
                        <img v-lazy="row.thumb" width="60" height="60"/>
                    </div>
                </el-popover>
            </el-table-column>
            <el-table-column label="本地SPU" prop="spu" width="180"></el-table-column>
            <el-table-column label="产品名称" width="340">
                <template slot-scope="scope">
                   <div >
                       <div class="elli" :title="scope.row.cnTitle">{{scope.row.cnTitle}}</div>
                       <div class="elli" :title="scope.row.enTitle">{{scope.row.enTitle}}</div>
                   </div>
                </template>
            </el-table-column>
            <el-table-column label="本地分类" prop="category_name"></el-table-column>
            <el-table-column label="销售平台状态" width="180">
                <template slot-scope="scope">
                   <span :class="{red:scope.row.platform_sale_status=='禁止上架'}">{{scope.row.platform_sale_status}}</span>
                </template>
            </el-table-column>
            <el-table-column label="发布时间" width="180">
                <template slot-scope="scope" >
                    <span v-if="!!scope.row.publish_time">{{scope.row.publish_time}}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column label="标题库" prop="title_store"></el-table-column>
            <el-table-column label="操作" inline-template width="180">
                <el-button @click="edit(row)" size='mini' type="primary">标题</el-button>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="tableData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="tableData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        methods: {
            edit(row){
                this.$emit('edit',row)
            },
            selection_change(val){
                console.log(val,'val');
                this.$emit('selection-change',val);
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.');
                }
                return ""
            },
            size_change(size){
                this.$emit('size-change',size);
            },
            current_change(page){
                this.$emit('current-change',page);
            },
        },
        filters: {
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            }
        },
        computed: {
            emptyText() {
                return this.firstTime ? '请查询数据' : '暂无数据'
            }
        },
        props:{
            tableData:{},
            loading: {
                type: Boolean,
                default: false
            },
            firstTime: {
                type: Boolean,
                default: true
            }
        }
    }
</script>

<style scoped>
.elli{
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
}
</style>