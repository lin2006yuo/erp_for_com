<template>
    <div class="c-buying-manage">
        <el-table :data="tableData"
                  v-resize="{height:41}"
                  v-loading="loading"
                  class="scroll-bar"
                  @select="selectCheck($event)"
                  @select-all="selectCheck"
                  element-loading-text="玩命加载中"
                  highlightCurrentRow>
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="平台">
                <div>
                    <ui-tip :content="row.channel_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="注册邮箱">
                <div>
                    <ui-tip :content="row.email" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="登录用户名">
                <div>
                    <ui-tip :content="row.username" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="服务器名称">
                <div>
                    <ui-tip :content="row.server_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="状态">
                <div>
                    <ui-tip :content="row.status" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="账号创建人">
                <div>
                    <ui-tip :content="row.account_creator" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="账号创建时间">
                <div>
                    <ui-tip :content="row.account_create_time | timeFilter2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="操作时间">
                <div>
                    <ui-tip :content="row.update_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="120"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" class="operat-color" @click="edit(scope.row)">编辑</el-button>
                    <span>  |  </span>
                    <el-button type="text" class="operat-color" @click="delete_order(scope.row)">删除</el-button>
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
    .c-buying-manage{
        .operat-color{
            color: #69f;
        }
    }
</style>
<script>
    import {api_get_buyers, api_delete_buyers} from '../../../api/buying-management';
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
            timeFilter2(val){
                if(val){
                    return datef('YYYY-MM-dd', val);
                } else {
                    return "--";
                }
            },
        },
        methods: {
            init(){
                this.loading = true;
                this.$http(api_get_buyers, this.searchData).then(res=>{
                    console.log(res);
                    this.loading = false;
                    this.tableData = res.data;
                    this.total = res.count;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
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
            selectCheck(select){
                this.checkData = select.map(row=>{
                    return row.id;
                });
                this.$emit('selectCheck', this.checkData);
            },
            edit(row){
                this.$emit('edit',row);
            },
            delete_order(row){
                this.$confirm(`您将删除买手管理${row.email},确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_buyers, row.id).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.tableData.find((item, index)=>{
                            if(item.id === row.id){
                                this.tableData.splice(index, 1);
                            }
                            return item.id === row.id;
                        })
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
            delete_orders(){
                this.checkData.forEach(row=>{
                    this.tableData.forEach((item, index)=>{
                        if(row === item.id){
                            this.tableData.splice(index, 1);
                        }
                    })
                })
            },
        },
        computed: {},
        watch: {
            newBuyer(val){
                let flag = this.tableData.findIndex(row=>{
                    return row.id === val.id;
                });
                if(flag !== -1){
                    this.tableData[flag] = val;
                } else {
                    this.tableData.push(val);
                }
            }
        },
        props: {
            searchData:{},
            newBuyer:{}
        },
        components: {
            uiTip:require('../../../components/ui-tip.vue').default
        },
    }
</script>
