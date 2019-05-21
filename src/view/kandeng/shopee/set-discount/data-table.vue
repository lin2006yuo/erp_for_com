<template>
    <div class="c-data-table">
        <el-table
            :data="tableData.list"
            v-resize="{height:41}"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            class="scroll-bar"
            highlightCurrentRow>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                label="折扣名称"
                inline-template>
                <ui-tip :content="row.discount_name" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                label="账号简称"
                inline-template>
                <ui-tip :content="row.code" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                label="折扣商品数量"
                inline-template>
                <ui-tip :content="row.total" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                label="有效期"
                inline-template>
                <span>{{row.start_time | filterTime}}-- --{{row.end_time | filterTime}}</span>
            </el-table-column>
            <el-table-column
                label="操作"
                inline-template>
                <div>
                    <permission
                        tag="span"
                        :route="apis.url_discount_edit"
                        class="operate"
                        @click="edit(row)"
                        size="mini">编辑</permission>
                </div>
            </el-table-column>
        </el-table>
        <!-- 翻页 -->
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page=tableData.page
            :page-sizes="[20, 50, 100, 200]"
            :page-size=tableData.pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=total>
        </el-pagination>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {url_discount_edit} from '../../../../api/shopee-publish';
	export default{
        permission: {
            url_discount_edit,
        },
		data(){
			return {}
		},
        methods:{
            handleSizeChange(size){
                this.tableData.pageSize = size;
                this.init();
            },
            handleCurrentChange(page){
                this.tableData.page = page;
                this.init();
            },
            edit(val){
                this.$emit('tab-remove',val);
            }
        },
        filters: {
            filterTime(val){
                return val ? datef('YYYY-MM-dd', val) : "-- --";
            },
        },
        computed: {
            emptyText(){
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        props:{
            tableData:{
                required:true,
                type:Object
            },
            loading:{
                type: Boolean,
            },
            total:{
                required: true,
                type: Number,
                default(){
                    return 0
                }
            },
            firstLoading: {
                type: Boolean,
                required: true
            }
        },
		components: {
            uiTip: require('../../../../components/ui-tip.vue').default,
        }
	}
</script>
