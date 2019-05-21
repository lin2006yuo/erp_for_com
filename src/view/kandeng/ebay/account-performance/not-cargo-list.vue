<template>
    <page>
        <account-change @change-account="change_account" :form="form"></account-change>
        <div class="table">
            <label class="inline mb-mini bold-font padding-border" style="font-size: 1.4rem">导致非货运表现问题的刊登列表：</label>
            <template>
                <el-table
                    size="mini"
                    v-resize="{height:41}"
                    class="scroll-bar"
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="account_name"
                        label="用户名">
                    </el-table-column>
                    <el-table-column
                        prop="item_id"
                        width="150"
                        label="物品编号">
                    </el-table-column>
                    <el-table-column
                        prop="sku"
                        width="180"
                        label="sku">
                    </el-table-column>
                    <el-table-column
                        prop="gmv_usd"
                        label="交易额">
                    </el-table-column>
                    <el-table-column
                        prop="trans_cnt"
                        label="交易量">
                    </el-table-column>
                    <el-table-column
                        prop="defect_cnt"
                        label="问题交易量">
                    </el-table-column>
                    <el-table-column
                        width="150"
                        label="问题交易量比例（%）">
                        <template slot-scope="scope">
                            {{scope.row.defect_rate}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="刊登状态">
                        <template slot-scope="scope">
                            {{scope.row.status?'在线':'已下线'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="nn_cnt"
                        label="中差评交易">
                    </el-table-column>
                    <el-table-column
                        prop="esc_snad_cnt"
                        label="物品与描述不符纠纷">
                    </el-table-column>
                    <el-table-column
                        prop="snad_cnt"
                        label="物品与描述不符差评">
                    </el-table-column>
                    <el-table-column
                        prop="low_iad_dsr_cnt"
                        label="物品与描述不符低分">
                    </el-table-column>
                    <el-table-column
                        prop="return_snad_cnt"
                        label="物品与描述不符退货">
                    </el-table-column>
                    <el-table-column
                        prop="stockout_cnt"
                        label="卖家取消交易">
                    </el-table-column>
                    <el-table-column
                        prop="review_start_date"
                        label="审核开始时间">
                    </el-table-column>
                    <el-table-column
                        prop="review_end_date"
                        label="审核截止时间">
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination
            class="page-fixed"
            @size-change="size_change"
            @current-change="current_change"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
        </el-pagination>
    </page>
</template>

<script>
    import {
        api_account_nonshipping_defect
    } from '@/api/ebay-kandeng-public-module';
    export default {
        name: "not-cargo-list",
        data(){
            return{
                page:1,
                pageSize:50,
                count:0,
                form:{
                    account_id:'',
                },
                tableData:[],
            }
        },
        mounted(){
            this.form.account_id=this.param.account_id;
        },
        methods:{
            defect_rateas(data){
                return `${Math.floor(Number(Number(data.defect_rate)) * 100)}%`
            },
            current_change(page){
                this.page = page;
                this.init();
            },
            size_change(size){
                this.pageSize = size;
                this.init();
            },
            init(){
                let data={
                    page:this.page,
                    pageSize:this.pageSize
                }
                this.$http(api_account_nonshipping_defect,this.form.account_id,data).then(res=>{
                    this.tableData=res.data;
                    this.count=res.count;
                }).catch(code=>{
                    this.$message({
                        type:"warning",
                        message:  code.message||code
                    });
                })
            },
            change_account(){

                this.init()
            }
        },
        components:{
            accountChange:require('./account-change').default,
        },
        props:{
            param:{
                require:true,
                type:Object
            }
        }
    }
</script>

<style scoped>
    .padding-border{
        padding: 10px 0;
    }
</style>
