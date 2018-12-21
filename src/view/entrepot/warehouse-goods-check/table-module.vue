<template>
    <div class="p-turnover-box">
        <el-table
                :data="tableData"
                v-resize="{height:41}"
                v-loading="loading"
                class="scroll-bar"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
            <el-table-column
                    inline-template
                    label="盘点单号">
                <div>
                    <ui-tip :content="row.id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="仓库">
                <div>
                    <ui-tip :content="row.warehouse_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="盘点人">
                <div>
                    <ui-tip :content="row.checker_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                min-width="60"
                label="盘点状态">
                <div>
                    <ui-tip :content="row.status_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="60"
                    label="创建人">
                <div>
                    <ui-tip :content="row.creator_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                min-width="130"
                    inline-template
                    label="创建时间">
                <div>
                    <ui-tip :content="row.create_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                min-width="60"
                label="完成人">
                <div>
                    <ui-tip :content="row.update_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                min-width="130"
                label="完成时间">
                <div>
                    <ui-tip :content="row.update_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                min-width="200"
                    label="操作">
                <template slot-scope="scope">
                    <permission tag="ElButton"
                                 :route="apis.url_get_detail"
                                 type="text"
                                 class="operat-color"
                                 size="mini"
                                 @click="look(scope.row)">查看
                    </permission>
                    <span> | </span>
                    <el-button type="text"
                                class="operat-color"
                                size="mini"
                                @click="print_list(scope.row)">打印
                    </el-button>
                    <span> | </span>
                    <permission tag="ElButton"
                                :route="apis.url_get_detail"
                                type="text"
                                :class="{'operat-color':!(scope.row.status === 3 || scope.row.status === 4)}"
                                size="mini"
                                :disabled="scope.row.status === 3 || scope.row.status === 4"
                                @click="edit(scope.row)">编辑
                    </permission>
                    <span> | </span>
                    <permission tag="ElButton"
                                :route="apis.url_finish_detail"
                                type="text"
                                :class="{'operat-color':scope.row.status === 2}"
                                :disabled="scope.row.status !== 2"
                                size="mini"
                                @click="finish(scope.row)">完成
                    </permission>
                    <span> | </span>
                    <permission tag="ElButton"
                                :route="apis.url_cancels_check"
                                type="text"
                                :class="{'operat-color':!(scope.row.status === 3 || scope.row.status === 4)}"
                                :disabled="scope.row.status === 3 || scope.row.status === 4"
                                size="mini"
                                @click="invalid(scope.row)">作废
                    </permission>
                    <span> | </span>
                    <permission tag="ElButton"
                                :route="apis.url_delete_check"
                                type="text"
                                :class="{'operat-color':scope.row.status === 0}"
                                :disabled="scope.row.status !== 0"
                                size="mini"
                                @click="delete_check(scope.row)">删除
                    </permission>
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
    .p-turnover-box{
        .operat-color{
            color: #69f;
        }
    }

</style>
<script>
    import {api_warehouse_goods_check, api_finish_detail, api_cancels_check, api_delete_check,
        url_get_detail, url_finish_detail, url_cancels_check, url_delete_check
    } from '@/api/warehouse-goods-check'
    export default {
        permission: {
            url_get_detail,
            url_finish_detail,
            url_cancels_check,
            url_delete_check
        },
        data(){
            return {
                loading:false,
                tableData:[],
                total:0,
                action:{},
                visible:false,
                trendAction:{},
                lookVisible:false
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
        },
        methods: {
            init(){
                this.loading = true;
                let data = this.deal_time(this.searchData);
                this.$http(api_warehouse_goods_check, data).then(res=>{
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
            look(row){
                this.$emit('look',row);
            },
            edit(row){
                this.$emit('edit', row);
            },
            finish(row){
                this.$emit('finish',row);
            },
            invalid(row){
                this.$confirm(`您将作废盘点单${row.id},确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_cancels_check, row.id).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        if(this.searchData.status !== ''){
                            this.tableData.find((item, index)=>{
                                if(item.id === row.id){
                                    this.tableData.splice(index, 1);
                                }
                                return item.id === row.id;
                            });
                            this.total--;
                        }else {
                            this.init();
                        }
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            delete_check(row){
                this.$confirm(`您将删除盘点单${row.id},确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_check, row.id).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        if(this.searchData.status !== ''){
                            this.tableData.find((item, index)=>{
                                if(item.id === row.id){
                                    this.tableData.splice(index, 1);
                                }
                                return item.id === row.id;
                            });
                            this.total--;
                        }else {
                            this.init();
                        }
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
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
            print_list(row){
                this.$emit('print',row);
            }
        },
        computed: {},
        watch: {
            newItem(val){
                this.total++;
                this.tableData.unshift(val);
            }
        },
        props: {
            searchData:{},
            newItem:{}
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,
        },
    }
</script>
