<template>
    <page>
        <account-change @change-account="change_account" :form="form"></account-change>
        <label class="inline mt-sm mb-sm bold-font" style="font-size: 1.4rem">数据更新时间：{{ updated_time()}}</label>
        <div class="table">
            <label class="inline mb-mini bold-font padding-border" style="font-size: 1.4rem">待处理刊登列表：</label>
            <template>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="item_id"
                        label="刊登编号">
                    </el-table-column>
                    <el-table-column
                        prop="rm_dead_dt"
                        label="到期时间">
                    </el-table-column>
                    <el-table-column
                        prop="auct_end_dt"
                        label="下线时间">
                    </el-table-column>
                    <el-table-column
                        prop="gmv_usd"
                        label="交易额">
                    </el-table-column>
                    <el-table-column
                        prop="bbe_trans"
                        label="问题交易量">
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
    import {api_account_qclist} from '@/api/ebay-kandeng-public-module'
    export default {
        name: "wait-deal-list",
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
            updated_time(){
                if(this.tableData.length>0){
                    return this.tableData[0].refreshed_date
                }else {
                    return ''
                }
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
                let data = {
                    page:this.page,
                    pageSize:this.pageSize
                }
                this.$http(api_account_qclist,this.form.account_id,data).then(res=>{
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
            }
        },
        props:{
            param:{
                require:true,
                type:Object,
            }
        },
        components:{
            accountChange:require('./account-change').default,
        }
    }
</script>

<style lang="stylus">

    .padding-border{
        padding: 10px 0;
    }
</style>
