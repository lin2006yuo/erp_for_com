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
            <el-table-column label="详情编辑" >
                <template slot-scope="scope">
                    <span @click="showDesc(scope.row)"
                          :class="scope.row.is_desc_edit?'blue':''">{{scope.row.is_desc_edit?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" inline-template width="180">
                <trends-select class="inline btn-trends-select-relative ml-mini"
                               :selects="exportBtn"
                               ref="trends"
                               type="primary"
                               @trigger="mark_handle(row,$event)">
                </trends-select>
                <!--<el-button @click="edit(row)" size='mini' type="primary">标题</el-button>-->
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
    import {url_get_goods_desc,url_edit_ebay_titles} from  '../../../../api/ebay-title-key'
    export default {
        permission: {
            url_get_goods_desc,url_edit_ebay_titles
        },
        data(){
            return{
                table:{},
                filterHandles:[
                    {name: "标题编辑",api:url_edit_ebay_titles, value: 1,action(row){this.edit(row)}},
                    {name: "描述编辑",api:url_get_goods_desc, value: 2,action(row){this.desc_edit(row)}},
                ],
            }
        },
        methods: {
            showDesc(row){
                if(!row.is_desc_edit)return;
                this.$emit('desc-edit',row)
            },
            mark_handle(row,option){
                option.action.call(this,row);
            },
            desc_edit(row){
                this.$emit('desc-edit',row)
            },
            edit(row){
                this.$emit('edit',row)
            },
            selection_change(val){
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
            des(){

            },
            exportBtn(){
                return this.filterHandles.filter(row=>{
                    return this.$hasPermission(row.api)
                })
            },
            emptyText() {
                return this.firstTime ? '请查询数据' : '暂无数据'
            }
        },
        components:{
            trendsSelect:require('../../../../components/trends-select.vue').default,
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
.blue{
    color: #33B2FC;
    cursor: pointer;
}
.elli{
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
}
</style>
