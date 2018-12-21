<template>
    <div class="c-table-data">
        <el-table
                class="scroll-bar"
                :data="tableData"
                v-resize="{height:41}"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                @sort-change="sort_change"
                :default-sort = "{prop: 'uploaded_deadline', order: 'descending'}"
                highlight-current-row>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>

            <el-table-column
                    prop="id"
                    label="序号"
               >
            </el-table-column>
            <el-table-column
                    prop="weight"
                    label="重量(g)"
            >
            </el-table-column>
            <el-table-column
                    prop="general_surface_fee"
                    sortable
                    label="(普货)平邮运费RMB"
            >
            </el-table-column>
            <el-table-column
                    prop="general_registration_fee"
                    label="(普货)挂号运费RMB"
                    sortable
            >
            </el-table-column>
            <el-table-column
                    prop="special_surface_fee"
                    label="(特性)平邮运费RMB"
                    sortable
            >
            </el-table-column>
            <el-table-column
                    prop="special_registration_fee"
                    label="(特性)挂号运费RMB"
                    sortable
              >
            </el-table-column>
        </el-table>

        <div class="block">
            <el-pagination
                    class="page-fixed"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="searchData.page"
                    :page-sizes="[20,50,100,200,500]"
                    :page-size="searchData.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>

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
            sort_change({column,pro,order}){
                let type = null;            
                if(order==='ascending'){
                    type = 'asc'
                }else if(order==='descending'){
                    type='desc'
                }            
                this.$emit('sort-change',type, column.property)
            },
            handleCurrentChange(val){
                this.$emit('current-change',val);
            },
            handleSizeChange(val){
                this.$emit('size-change',val);
            },
            handleClick (row) {
                this.$emit('handle-click', row.id)
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '请查询数据' : '暂无数据'
            }
        },
        props:{
            tableData:{
                required:true,
                type:Array,
            },
            searchData: {
                required: true,
                type: Object
            },
            loading:{      // el-table的一个提示加载提示组件
                required:true,
                type:Boolean
            },
            platform:{},
            total:{
                required: true,
                type: Number,
                default(){
                    return 0
                }
            },
            firstLoading:{   // 没有数据的提示。
                type: Boolean,
                require:true
            }
        }
    }
</script>