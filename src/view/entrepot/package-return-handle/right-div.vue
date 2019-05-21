<template>
    <div class="package-return">
        <el-table :data="tableData"
                  v-resize="{height:45}"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  class="scroll-bar"
                  highlight-current-row>
            <el-table-column
                inline-template
                label="退回单号">
                <div>
                    <img src="../../../assets/table-arrow.svg"
                         style="width:20px;height: 15px;float: left;vertical-align: middle">
                    <ui-tip :content="row.package_return_number" :width="98" class="inline"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="面单号">
                <div>
                    <ui-tip :content="row.shipping_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="包裹号">
                <div>
                    <ui-tip :content="`${row.number}`" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                width="70"
                label="退回类型">
                <div>
                    <ui-tip :content="row.return_type" :width="98"></ui-tip>
                </div>
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
<style lang="stylus">
    .package-return{
        .table_head{
            height:32px;
            line-height: 32px;
            border:1px solid #e0e6ed;
            background-color: #6295E9;
            color:white;
        }
    }
</style>
<script>
    import {api_get_return} from '@/api/package-return'
    export default {
        data() {
            return {
                loading:false,
                total:0,
                searchData:{
                    page:1,
                    pageSize:20
                }
            }
        },
        mounted(){

        },
        methods: {
            init(){

            },
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
        },
        watch: {},
        props: {
            tableData:{},
            warehouseId:{}
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,
        }
    }
</script>
