<template>
    <page class="page-scroll">
        <account-change @change-account="change_account" :form="form"></account-change>
        <div class="table scroll-table">
            <label class="inline  mb-mini bold-font padding-border" style="font-size: 1.4rem">综合表现：</label>
            <template>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        label="综合表现"
                        width="180">
                        <template slot-scope="scope">
                            <span :class="classObject(scope.row.program_status_lst_eval_txt)">
                                {{scope.row.program_status_lst_eval_txt}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="refreshed_date"
                        label="数据更新时间"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="dft_lst_eval_beg_dt"
                        label="月度评价开始时间">
                    </el-table-column>
                    <el-table-column
                        prop="dft_lst_eval_end_dt"
                        label="月度评价截止时间">
                    </el-table-column>
                    <el-table-column
                        prop="dft_wk_eval_beg_dt"
                        label="当前表现开始时间">
                    </el-table-column>
                    <el-table-column
                        prop="dft_wk_eval_end_dt"
                        label="当前表现截止时间">
                    </el-table-column>
                    <el-table-column
                        prop="next_review_dt"
                        label="下次评估时间">
                    </el-table-column>
                </el-table>
            </template>
            <trade-rate :table="unhealthyTable"></trade-rate>
            <label class="inline  mt-lg mb-mini bold-font padding-border" style="font-size: 1.4rem">纠纷表现（%）：</label>
            <el-table
                :data="snadTable"
                style="width: 100%">
                <el-table-column
                    label="纠纷表现">
                    <template slot-scope="scope">
                        <span :class="classObject(scope.row.snad_status_lst_eval_txt)">
                            {{scope.row.snad_status_lst_eval_txt}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="delta_snad_rt_12m_lst_eval"
                    label="超出标准值比例">
                </el-table-column>
                <el-table-column
                    label="预期评价状态">
                    <template slot-scope="scope">
                        <span :class="classObject(scope.row.snad_status_wk_eval_txt)">
                            {{scope.row.snad_status_wk_eval_txt}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="dft_lst_eval_end_dt"
                    label="月度评价截止时间">
                </el-table-column>
                <el-table-column label="纠纷国际细分">
                    <el-table-column
                        prop="adj_snad_rt_12m_na"
                        label="北美">
                    </el-table-column>
                    <el-table-column
                        prop="adj_snad_rt_12m_uk"
                        label="英国">
                    </el-table-column>
                    <el-table-column
                        prop="adj_snad_rt_12m_de"
                        label="德国">
                    </el-table-column>
                    <el-table-column
                        prop="adj_snad_rt_12m_au"
                        label="澳大利亚">
                    </el-table-column>
                    <el-table-column
                        prop="adj_snad_rt_12m_frites"
                        label="意法西">
                    </el-table-column>
                    <el-table-column
                        prop="adj_snad_rt_12m_gbh"
                        label="新兴市场">
                    </el-table-column>
                    <el-table-column
                        prop="adj_snad_rt_12m_other"
                        label="其他">
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
    </page>
</template>

<script>
    import {
        api_account_performance_ltnp
    } from '@/api/ebay-kandeng-public-module';
    export default {
        name: "comprehensive",
        data(){
            return{
                snadTable:[],
                table:{},
                tableData:[],
                unhealthyTable:{},
                accountList:[],
                form:{
                    account_id:''
                },

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
            change_account(){//改变账号
                if(!this.form.account_id)return;
                this.snadTable=[];
                this.tableData=[];
                this.init();

            },
            init(){
                this.snadTable=[];
                this.tableData=[];
                this.$http(api_account_performance_ltnp,this.form.account_id).then(res=>{
                    let obj = {
                        program_status_lst_eval:res.data.program_status_lst_eval,
                        program_status_lst_eval_txt:res.data.program_status_lst_eval_txt,//综合表现状态
                        refreshed_date:res.data.refreshed_date,//数据更新时间
                        dft_lst_eval_beg_dt:res.data.dft_lst_eval_beg_dt,//月度评价开始时间
                        dft_lst_eval_end_dt:res.data.dft_lst_eval_end_dt,//月度评价截止时间
                        dft_wk_eval_beg_dt:res.data.dft_wk_eval_beg_dt,//当前表现开始时间
                        dft_wk_eval_end_dt:res.data.dft_wk_eval_end_dt,//当前表现截止时间
                        next_review_dt:res.data.next_review_dt,//下次评估时间
                    };
                    let obj_ = {
                        status_lst_eval:res.data.status_lst_eval,
                        status_lst_eval_txt:res.data.status_lst_eval_txt,//不良交易率表现状态
                        status_lt10_lst_eval_txt:res.data.status_lt10_lst_eval_txt,//小于等于10美金12月不良交易率状态
                        dft_rt_lt10_12m_lst_eval:res.data.dft_rt_lt10_12m_lst_eval,//小于等于10美金12月不良交易率当前值
                        dft_rt_lt10_12m_th:res.data.dft_rt_lt10_12m_th,//小于等于10美金12月不良交易率标准值
                        status_gt10_lst_eval_txt:res.data.status_gt10_lst_eval_txt,//大于10美金12月不良交易率状态
                        dft_rt_gt10_12m_lst_eval:res.data.dft_rt_gt10_12m_lst_eval,//大于10美金12月不良交易率当前值,
                        dft_rt_gt10_12m_th:res.data.dft_rt_gt10_12m_th,//大于10美金12月不良交易率标准值,
                        status_adj_lst_eval_txt:res.data.status_adj_lst_eval_txt,//综合12月不良交易率状态
                        adj_dft_rt_12m_lst_eval:res.data.adj_dft_rt_12m_lst_eval,// 综合12月不良交易率当前值,
                        adj_dft_rt_12m_th:res.data.adj_dft_rt_12m_th,//综合12月不良交易率标准值
                        status_wk_eval_txt:res.data.status_wk_eval_txt,//预期评价状态
                        status_lt10_wk_eval_txt:res.data.status_lt10_wk_eval_txt,//预期-小于等于10美金12月不良交易率状态
                        dft_rt_lt10_12m_wk_eval:res.data.dft_rt_lt10_12m_wk_eval,//预期-小于等于10美金12月不良交易率当前值
                        status_gt10_wk_eval_txt:res.data.status_gt10_wk_eval_txt,//大于等于10美金12月不良交易率状态
                        dft_rt_gt10_12m_wk_eval:res.data.dft_rt_gt10_12m_wk_eval,//大于等于10美金12月不良交易率当前值
                        status_adj_wk_eval_txt:res.data.status_adj_wk_eval_txt,//预期-综合12月不良交易率状态
                        adj_dft_rt_12m_wk_eval:res.data.adj_dft_rt_12m_wk_eval//预期-综合12月不良交易率当前值
                    };
                    let sandObj = {
                        snad_status_lst_eval_txt:res.data.snad_status_lst_eval_txt,//纠纷表现状态
                        delta_snad_rt_12m_lst_eval:res.data.delta_snad_rt_12m_lst_eval,//超出标准值比例
                        snad_status_wk_eval_txt:res.data.snad_status_wk_eval_txt,//预期评价状态
                        dft_lst_eval_end_dt:res.data.dft_lst_eval_end_dt,//月度评价截止时间
                        adj_snad_rt_12m_na:res.data.adj_snad_rt_12m_na,//北美
                        adj_snad_rt_12m_uk:res.data.adj_snad_rt_12m_uk,//英国
                        adj_snad_rt_12m_de:res.data.adj_snad_rt_12m_de,//德国
                        adj_snad_rt_12m_au:res.data.adj_snad_rt_12m_au,//澳大利亚
                        adj_snad_rt_12m_frites:res.data.adj_snad_rt_12m_frites,//意法西
                        adj_snad_rt_12m_gbh:res.data.adj_snad_rt_12m_gbh,//新兴市场
                        adj_snad_rt_12m_other:res.data.adj_snad_rt_12m_other//其他
                    }
                    this.snadTable.push(sandObj)
                    this.unhealthyTable=window.clone(obj_);
                    this.tableData.push(obj)
                }).catch(code=>{
                    this.$message({
                        type:"warning",
                        message:  code.message||code
                    });
                })
            }
        },
        components:{
            accountChange:require('./account-change').default,
            tradeRate:require('./trade-rate').default//不良交易率表现
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
.page-scroll{
    height: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    .scroll-table{
        flex:1;
        overflow-y scroll;
        padding-bottom 40px;
    }
    .padding-border{
        padding: 10px 0;
    }
}

</style>
