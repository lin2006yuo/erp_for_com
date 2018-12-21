<template>
    <div class="p-putaway-order">
        <el-table
                :data="tableData"
                v-resize="{height:41}"
                v-loading="loading"
                class="scroll-bar"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
            <el-table-column
                    inline-template
                    label="上架单号">
                <div>
                    <ui-tip :content="row.id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="上架区">
                <div>
                    <ui-tip :content="`${row.warehouse_area_id}(${row.warehouse_area_type})`" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="150"
                    label="数量（上架数/总数）">
                <div>
                    <ui-tip :content="`${row.num_update}/${row.num_all}`" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="状态">
                <div>
                    <ui-tip :content="row.status" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="备注">
                <div>
                    <ui-tip :content="row.remark" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="开始时间">
                <div>
                    <ui-tip :content="row.putaway_start_time | filterTime" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="结束时间">
                <div>
                    <ui-tip :content="row.putaway_end_time | filterTime" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="创建人">
                <div>
                    <ui-tip :content="row.creator_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="创建时间">
                <div>
                    <ui-tip :content="row.create_time | filterTime" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text"
                               class="operat-color"
                               size="mini"
                               @click="look_data(scope.row)">查看
                    </el-button>
                </template>
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
    .p-putaway-order{
        .operat-color{
            color: #69f;
        }
    }

</style>
<script>
    import {api_get_putaway} from '@/api/putaway-order'
    export default {
        data(){
            return {
                loading:false,
                tableData:[],
                total:0
            }
        },
        mounted(){
        },
        filters:{
            filterTime(val){
                return datef("YYYY-MM-dd HH:mm:ss",val);
            },
        },
        methods: {
            init(){
                this.loading = true;
                let data = this.deal_time(this.searchData);
                this.$http(api_get_putaway, data).then(res=>{
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code=>{
                    this.loading = false;
                    this.$message({type:"error",message:code.message || code});
                })
            },
            //处理年月日
            deal_time(searchData){
                //处理年月日 YYYY-MM-dd
                let data=clone(searchData);
                if(searchData.create_time_from){
                    data.create_time_from=datef('YYYY-MM-dd', searchData.create_time_from/1000);
                }else {
                    data.create_time_from='';
                }
                if(searchData.create_time_to){
                    data.create_time_to=datef('YYYY-MM-dd', searchData.create_time_to/1000);
                }else {
                    data.create_time_to='';
                }
                return data;
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
            look_data(row){
                this.$emit('look',row);
            }
        },
        computed: {},
        watch: {},
        props: {
            searchData:{}
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default
        },
    }
</script>
