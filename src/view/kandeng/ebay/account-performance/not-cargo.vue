<template>
    <page>
        <account-change @change-account="change_account" :form="form"></account-change>
        <div class="table">
            <label class="inline mb-mini bold-font padding-border" style="font-size: 1.4rem">非货运表现：</label>
            <template>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        label="非货运表现"
                        width="180">
                        <template slot-scope="scope">
                            <span :class="classObject(scope.row.result_txt)">
                                {{scope.row.result_txt}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="refreshed_date"
                        label="数据更新时间"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="review_start_dt"
                        label="审核开始时间">
                    </el-table-column>
                    <el-table-column
                        prop="review_end_dt"
                        label="审核截止时间">
                    </el-table-column>
                    <el-table-column
                        prop="ns_defect_ddj_rt8wk"
                        label="超出标准值比例">
                    </el-table-column>
                    <el-table-column
                        prop="next_eval_date"
                        label="下次评估时间">
                    </el-table-column>
                </el-table>
            </template>
            <label class="inline mb-mini bold-font padding-border" style="font-size: 1.4rem">非货运问题交易率各国细分（%）：</label>
            <template>
                <el-table
                    :data="table"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="na_ns_defect_adj_rt8wk"
                        label="北美"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="uk_ns_defect_adj_rt8wk"
                        label="英国"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="de_ns_defect_adj_rt8wk"
                        label="德国">
                    </el-table-column>
                    <el-table-column
                        prop="au_ns_defect_adj_rt8wk"
                        label="澳大利亚">
                    </el-table-column>
                    <el-table-column
                        prop="gl_ns_defect_adj_rt8wk"
                        label="其他">
                    </el-table-column>
                </el-table>
            </template>
        </div>
    </page>
</template>

<script>
    import {api_account_performance_tci} from '@/api/ebay-kandeng-public-module';
    export default {
        name: "not-cargo",
        data(){
            return{
                form:{
                    account_id:'',
                },
                tableData:[],
                table:[]
            }
        },
        mounted(){
            this.form.account_id=this.param.account_id;
        },
        methods:{
            classObject(text){
                return {
                    'color-green': text!=="--"&&text==='正常',
                    'color-red': text!=="--"&&(text!=='正常'&&text!=='超标'),
                    'color-yellow':text!=="--"&&text==='超标'
                }
            },
            init(){
                this.table=[];
                this.tableData=[];
                this.$http(api_account_performance_tci,this.form.account_id).then(res=>{
                    let obj ={
                        result_txt:res.data.result_txt,//非货运变现状态
                        refreshed_date:res.data.refreshed_date,//数据更新时间
                        review_start_dt:res.data.review_start_dt,//审核开始时间
                        review_end_dt:res.data.review_end_dt,//审核截止时间
                        ns_defect_ddj_rt8wk:res.data.ns_defect_ddj_rt8wk,//超出标准值比例
                        next_eval_date:res.data.next_eval_date,//下次评估时间
                    };
                    let obj_ = {
                        na_ns_defect_adj_rt8wk:res.data.na_ns_defect_adj_rt8wk,//北美
                        uk_ns_defect_adj_rt8wk:res.data.uk_ns_defect_adj_rt8wk,//英国
                        de_ns_defect_adj_rt8wk:res.data.de_ns_defect_adj_rt8wk,//德国
                        au_ns_defect_adj_rt8wk:res.data.au_ns_defect_adj_rt8wk,//澳大利亚
                        gl_ns_defect_adj_rt8wk:res.data.gl_ns_defect_adj_rt8wk,//其他

                    };
                    this.table.push(obj_)
                    this.tableData.push(obj)
                }).catch(code=>{
                    this.$message({
                        type:"warning",
                        message:  code.message||code
                    });
                })
            },
            change_account(){
                if(!this.form.account_id)return;
                this.table=[];
                this.tableData=[];
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

<style lang="stylus">
    .padding-border{
        padding: 10px 0;
    }
</style>
