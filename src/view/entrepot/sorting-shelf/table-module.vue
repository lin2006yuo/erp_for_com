<template>
    <div class="p-sorting-shelf">
        <el-table
                :data="tableData"
                v-resize="{height:41}"
                v-loading="loading"
                class="scroll-bar"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
            <el-table-column
                    type="index"
                    width="40">
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="80"
                    label="播种车名称">
                <div>
                    <ui-tip :content="row.name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="80"
                    label="仓库">
                <div>
                    <ui-tip :content="row.warehouse" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="100"
                    label="播种货架（行*列）">
                <template slot-scope="scope">
                    <p class="nomargin" v-for="(item, index) in scope.row.row_column" :key="index">
                        货架{{index+1}}：<span class="green_color">{{item}}</span>
                    </p>
                </template>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="最大包裹数量">
                <div>
                    <ui-tip :content="row.total" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="默认播种车">
                <div>
                    <ui-tip :content="row.is_default | defaultFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="状态">
                <div>
                    <el-switch v-model="row.status"
                               onText="开启"
                               offText="关闭"
                               @change="change_status(row)">
                    </el-switch>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="创建人">
                <div>
                    <ui-tip :content="row.creator" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="120"
                    label="创建时间">
                <div>
                    <ui-tip :content="row.create_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="120"
                    label="更新时间">
                <div>
                    <ui-tip :content="row.update_time | timeFilter" :width="98"></ui-tip>
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
                    min-width="100"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text"
                               class="operat-color"
                               size="mini"
                               @click="edit(scope.row)">修改
                    </el-button>
                    <span>  |  </span>
                    <el-button type="text"
                               class="operat-color"
                               size="mini"
                               @click="delete_data(scope.row)">删除
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
    .p-sorting-shelf{
        .nomargin{
            margin:0;
        }
        .operat-color{
            color: #69f;
        }
        .green_color{
            color: #009900;
        }
    }
</style>
<script>
    import {api_get_shelf, api_delete_shelf, api_change_status} from '../../../api/sorting-shelf'
    export default {
        data(){
            return {
                tableData:[],
                loading:false,
                total:0,
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
            defaultFilter(val){
                if(val > 0){
                    return '是';
                } else {
                    return '否';
                }
            }
        },
        methods: {
            init(){
                this.loading = true;
                this.$http(api_get_shelf, this.searchData).then(res=>{
                    this.loading = false;
                    res.data.forEach(row=>{
                        row.status = !row.status;
                    });
                    this.tableData = res.data;
                    this.total = res.count;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            change_status(item){
                let status = item.status ? 1 : 0;
                console.log('status', item.status);
                this.$confirm(`您将${status ? '停用' : '启用' }播种车${item.name}`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    this.$http(api_change_status, item.id, {status:status}).then(res=> {
                        this.tableData.find(row=>{
                            if(row.id === item.id){
                                row.update_time = new Date().getTime()/1000;
                            }
                        });
                        this.$message({
                            type: 'success',
                            message: status ? '停用成功' : '启用成功'
                        });
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: status ? '停用失败' : '启用失败'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                    item.status = !item.status;
                });
            },
            edit(row){
                this.$emit('edit',row);
            },
            delete_data(row){
                this.$confirm(`您将删除播种车${row.name},确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_shelf, row.id).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.tableData.find((item, index)=>{
                            if(item.id === row.id){
                                this.tableData.splice(index, 1);
                            }
                            return item.id === row.id;
                        });
                        this.total--;
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
        },
        computed: {},
        watch: {
            newItem(val){
                let flag = this.tableData.findIndex(row=>{
                    return row.id === val.id;
                });
                val.status = !val.status;
                if(val.is_default === 1){
                    this.tableData.forEach(row=>{
                        if(row.warehouse_id === val.warehouse_id){
                            row.is_default = 0;
                        }
                    })
                }
                if(flag !== -1){
                    this.tableData[flag] = val;
                } else {
                    this.total++;
                    this.pageSize++;
                    this.tableData.unshift(val);
                }
            }
        },
        props: {
            searchData:{},
            newItem:{}
        },
        components: {
            uiTip:require('../../../components/ui-tip.vue').default
        },
    }
</script>
