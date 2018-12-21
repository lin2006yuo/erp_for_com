<template>
    <div class="c-table-data">
        <el-table
                ref="multipleTable"
                class="scroll-bar"
                :data="tableData"
                v-resize="{height:41}"
                v-loading="loading"  
                element-loading-text="玩命加载中..."
                :default-sort = "{prop: 'uploaded_deadline', order: 'descending'}"
                highlight-current-row
                @selection-change="selectionChange"
             >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>

            <el-table-column
                type="selection"
              >
            </el-table-column>
            <el-table-column
                prop="country_code"
                label="图片"   
                inline-template 
             >
                <el-popover
                        placement="right"
                        trigger="hover">
                    <img width="200px" height="200px" v-lazy="sku_image(row.thumb)">
                    <span slot="reference">
                        <img height="60px" width="60px" style="border:none" :src="row.thumb">
                    </span>
                </el-popover>

            </el-table-column>
            <el-table-column
                prop="sku"
                label="SKU/SKU别名"
                >
            </el-table-column>
            <el-table-column
                label="产品名称"
                min-width="95"
                inline-template>
                <div class="p-table-list-td-text" :title="row.spu_name">
                     {{row.spu_name}}
                </div>               
            </el-table-column>
            <el-table-column
                prop="old_weight"
                label="原重量(g)"
              
              >
            </el-table-column>
            <el-table-column
                prop="weight"
                label="现重量(g)"             
             >
            </el-table-column>
            <el-table-column
                prop="diff_weight"
                label="差异重量(g)"              
            >
            </el-table-column>
            <el-table-column
                prop="diff_scale"
                label="差异比例"
              >
            </el-table-column>   

            <el-table-column   
                label="自动校准"
                prop='is_auto_update_weight'                 
              >                
            </el-table-column>
            <el-table-column   
                label="校准时间"            
              >
               <template slot-scope="scope">
                  <span>{{scope.row.auto_update_time}}</span>
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
                :page-size=searchData.page_size
                layout="total, sizes, prev, pager, next, jumper"
                :total='total'>
            </el-pagination>
        </div>

    </div>
</template>
<style lang="stylus">
.p-table-list-td-text{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
<script>

    export default {
        data() {
            return {
                multipleSelection: []
            }
        },
        methods:{
            handleCurrentChange(val){
                this.$emit('current-change',val);
            },
            handleSizeChange(val){
                this.$emit('size-change',val);
            },
            selectionChange(rows) {                
                // 全选得到所有的选中row的{}
                this.$emit("selection-change", rows)
            },
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.')
                }
                return ""
            },
        },
        filters: {
            timeFilter(val) {                
                return datef("YYYY-MM-dd HH:mm:ss", val);                 
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
                type:Array
            },
            searchData: {
                required: true,
                type: Object
            },
            loading:{      // el-table的一个提示加载提示组件
                required: false,
                type:Boolean
            },
            platform:{},
            total:{
                type: Number,
                default: 0
            },
            firstLoading:{   // 没有数据的提示。
                type: Boolean,
                require: false
            }
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,
        }
    }
</script>