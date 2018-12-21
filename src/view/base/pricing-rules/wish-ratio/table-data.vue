<template>
    <div class="c-table-data">
        <el-table
                class="scroll-bar"
                :data="tableData"
                style="width: 100%"
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
                width='110'
              >
            </el-table-column>
            <el-table-column
                prop="country_code"
                label="目的地"
                width='110'
             >
            </el-table-column>
            <el-table-column
                prop="order_number"
                label="订单数"
                sortable
                width='110'
                >
            </el-table-column>
            <el-table-column
                prop="rate"
                label="订单占比"
                sortable
                width='110'
               >
            </el-table-column>
            <el-table-column
                label="(普通)平邮物流方式"
                prop='general_surface_shipping'
                sortable
                inline-template                
              >
                <div>
                    <ui-tip :content="row.general_surface_shipping" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column       
                label="(普通)挂号物流方式"
                sortable
                inline-template
                prop='general_registration_shipping'
             >
                <div>
                    <ui-tip :content="row.general_registration_shipping" :width="98"></ui-tip>
                </div>              
            </el-table-column>
            <el-table-column
                label="(特性)平邮物流方式"
                sortable   
                inline-template     
                prop='special_surface_shipping'   
              >
                <div>
                    <ui-tip :content="row.special_surface_shipping" :width="98"></ui-tip>
                </div>  
            </el-table-column>
            <el-table-column
                label="(特性)挂号物流方式"
                sortable      
                inline-template      
                prop='special_registration_shipping'        
               >
                <div>
                    <ui-tip :content="row.special_registration_shipping" :width="98"></ui-tip>
                </div> 
            </el-table-column>   

            <el-table-column width='120' label="操作">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">指定物流方式</el-button>                    
                </template>
            </el-table-column>

        </el-table>

        <div class="block">
            <el-pagination
                    class="page-fixed"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page=searchData.page
                    :page-sizes="[20,50,100,200,500]"
                    :page-size=searchData.pageSize
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=total>
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
                this.$emit('sort-change',type, column.property, )
            },
            handleCurrentChange(val){
                this.$emit('current-change',val);
            },
            handleSizeChange(val){
                this.$emit('size-change',val);
            },
            handleClick (row) {
                this.$emit('handle-click', row.id, row)
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
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,
        }
    }
</script>