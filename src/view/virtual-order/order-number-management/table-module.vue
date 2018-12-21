<template>
    <div>
        <el-table :data="tableData"
                  class="scroll-bar"
                  v-resize="{height:41}"
                  v-loading="loading"
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
                    <ui-tip :content="row.channel_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="账号简称">
                <div>
                    <ui-tip :content="row.account_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    align="left"
                    label="订单号">
                    <div v-if="row.order_number&&row.order_number.length>0"
                         v-copy
                         v-for="(item,index) in row.order_number" :key="index">{{item}}</div>
            </el-table-column>
            <el-table-column
                    width="80"
                    inline-template
                    label="状态">
                <div>
                    <ui-tip :content="row.status" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="创建人">
                <div>
                    <ui-tip :content="row.creator" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="创建时间">
                <div>
                    <ui-tip :content="row.created_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="120"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" class="operat-color" @click="edit(scope.row)">修改</el-button>
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
    .operat-color{
        color: #69f;
    }
</style>
<script>
    import {api_order_list, api_delete_order} from '../../../api/order-number-management'
    export default {
        data(){
            return {
                tableData:[],
                loading:false,
                total:0,
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
            toFixed2(val){
                return Number(val).toFixed(4);
            }
        },
        methods: {
            init(){
                this.loading = true;
                this.$http(api_order_list, this.searchData).then(res=>{
                    this.loading = false;
                    res.data.forEach(row=>{
                        row.order_number = JSON.parse(row.order_number);
                    });
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
            delete_order(row){
                this.$confirm(`您将删除虚拟订单号${row.order_number},确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_order, row.id).then(res=>{
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
            edit(row){
                this.$emit('edit',row);
            },
            selectCheck(select){
                this.checkData = select.map(row=>{
                    return row.id;
                });
                this.$emit('selectCheck', this.checkData);
            }
        },
        computed: {},
        watch: {
            newOrder(val){
                let flag = this.tableData.findIndex(row=>{
                    return row.id === val.id;
                });
                if(flag !== -1){
                    this.tableData[flag] = val;
                } else {
                    console.log(val);
                    this.tableData.push(val);
                }
            }
        },
        props: {
            searchData:{},
            newOrder:{}
        },
        components: {
            uiTip:require('../../../components/ui-tip.vue').default
        },
    }
</script>
