<template>
    <div>
        <el-table
                :data="tableData"
                v-resize="{height:41}"
                v-loading="loading"
                @select="selectCheck($event)"
                @select-all="selectCheck"
                class="scroll-bar"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <el-table-column
                    v-if="is_stay && searchData.warehouse_area_type !== 12"
                    type="selection"
                    min-width="40">
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="40"
                    label="批次">
                <div>
                    <ui-tip :content="row.batch_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                min-width="56"
                    inline-template
                    label="采购单id">
                <div>
                    <ui-tip :content="row.purchase_order_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="70"
                    label="图片">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            trigger="hover">
                        <img :src="scope.row.sku_img | filterImage" width="200px" height="200px">
                        <span slot="reference">
                                    <img :src="scope.row.sku_img" v-if="scope.row.sku_img" height="60px" width="60px" style="border:none;vertical-align: middle">
                                </span>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                min-width="60"
                    inline-template
                    label="SKU/SKU别名">
                <div>
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                    <div v-for="item in row.sku_alia" :key="item">{{item || `--`}}</div>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="名称">
                <div>
                    {{row.sku_name}}
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="数量（上架数/总数）">
                <div>
                    <span>
                        <integer-input v-model="row.quantity"
                                       :min="0" v-if="is_stay"
                                       class="inline"
                                       style="width: 80px"
                                       :class="{'red':row.quantity > row.waiting_quantity}">
                        </integer-input>
                        <span v-if="!is_stay">{{row.quantity}}</span>
                    </span>
                    <span>/{{row.waiting_quantity}}</span>
                </div>
            </el-table-column>
            <el-table-column
                min-width="60"
                    inline-template
                    label="货位">
                <div>
                    <ui-tip :content="row.warehouse_cargo_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="40"
                    label="类型">
                <div>
                    <ui-tip :content="row.warehouse_area_type" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="40"
                    label="状态">
                <div>
                    <ui-tip :content="row.status" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="40"
                    inline-template
                    label="创建人">
                <div>
                    <ui-tip :content="row.creator_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="创建时间">
                <div>
                    <ui-tip :content="row.create_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="50"
                    inline-template
                    label="更新人">
                <div>
                    <ui-tip :content="row.update_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="更新时间">
                <div>
                    <ui-tip :content="row.update_time | timeFilter" :width="98"></ui-tip>
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
<style lang="stylus">

</style>
<script>
    export default {
        data(){
            return {
                checkData:[]
            }
        },
        filters:{
            timeFilter(val){
                if(val){
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
            filterImage(val){
                return val.replace("_60x60","_200x200");
            },
        },
        methods: {
            selectCheck(select){
                this.checkData = select;
                this.$emit('select-check', this.checkData);
            },
            delete_goods(){
                this.checkData.forEach(row=>{
                    this.tableData.forEach((item, index)=>{
                        if(row.id === item.id){
                            this.tableData.splice(index, 1);
                        }
                    })
                })
            }
        },
        computed: {
            is_stay(){
                return this.searchData.status === 0;
            },
            emptyText(){
                return this.firstLoading ? '等待查询数据中...' : '暂无数据'
            }
        },
        props: {
            searchData: {},
            tableData: {},
            loading: {},
            total: {},
            firstLoading: {}
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,
            integerInput:require('@/components/integer-input.vue').default,
        },
    }
</script>
