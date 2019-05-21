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
                        prop="defect_rate"
                        label="问题交易量比例（%）">
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="刊登状态">
                        <template slot-scope="scope">
                            {{filterStatus(scope.row.status)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="low_dsr_st_cnt"
                        label="运送时间DSR低分">
                    </el-table-column>
                    <el-table-column
                        prop="inr_flag_cnt"
                        label="物品未收到纠纷">
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
        api_account_ship_defect_five
    } from '@/api/ebay-kandeng-public-module';
    export default {
        name: "cargo-trouble-five",
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
                };
                this.$http(api_account_ship_defect_five,this.form.account_id,data).then(res=>{
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
                if(!this.form.account_id)return;
                this.init()
            },
            filterStatus(status){
                switch (status){
                    case 0:
                        return '已下线';
                    case 1:
                        return '在线';
                }
            }
        },
        computed:{

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
