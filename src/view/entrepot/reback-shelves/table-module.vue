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
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column
                    width="80"
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
                    inline-template
                    label="SKU">
                <div>
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="商品名称（规格）">
                <div>
                    {{row.sku_name}}
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="数量">
                <div>
                    <el-input v-model="row.quantity"></el-input>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="分区">
                <div>
                    <ui-tip :content="row.warehouse_area_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="货位">
                <div>
                    <ui-tip :content="row.warehouse_cargo_code" :width="98"></ui-tip>
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

</style>
<script>
    import {api_reback_shelves_old_list} from '../../../api/reback-shelves';
    export default {
        data(){
            return {
                loading:false,
                tableData:[],
                total:0,
                trendAction:{},
                lookVisible:false,
                checkData:[],
            }
        },
        mounted(){
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
            init(){
                this.tableData = [];
                this.loading = true;
                let data = window.clone(this.searchData);
                this.$http(api_reback_shelves_old_list, data).then(res=>{
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code=>{
                    this.loading = false;
                    this.$message({type:"error",message:code.message || code});
                })
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
            selectCheck(select){
                this.checkData = select.map(row=>{
                    return {id:row.id,quantity:row.quantity};
                });
                this.$emit('select-check', this.checkData, select);
            },
            delete_goods(data){
                data.forEach(row=>{
                    if(row.quantity === 0){
                        let index = this.tableData.findIndex(item=>{
                            return row.id === item.id;
                        });
                        this.tableData.splice(index, 1);
                    } else {
                        let index = this.tableData.findIndex(item=>{
                            return row.id === item.id;
                        });
                        this.tableData[index].quantity = row.quantity;
                    }
                })
            }
        },
        computed: {},
        watch: {},
        props: {
            searchData:{},
        },
        components: {
            uiTip:require('../../../components/ui-tip.vue').default,
        },
    }
</script>
