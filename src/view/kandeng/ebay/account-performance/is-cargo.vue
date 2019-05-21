<template>
    <page>
        <account-change @change-account="change_account" :form="form"></account-change>
        <div class="table">
            <label class="inline mb-mini bold-font padding-border" style="font-size: 1.4rem">货运表现：</label>
            <template>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        label="评估时间段">
                        <template slot-scope="scope">
                            {{scope.row.date_range?'5-12周':'1-8周'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="表现状态">
                        <template slot-scope="scope">
                            <span :class="classObject(filter_status(scope.row.result))">
                                {{filter_status(scope.row.result)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="refreshed_date"
                        label="数据更新时间">
                    </el-table-column>
                    <el-table-column
                        prop="review_start_date"
                        label="审核开始时间">
                    </el-table-column>
                    <el-table-column
                        prop="review_end_date"
                        label="审核截止时间">
                    </el-table-column>
                    <el-table-column
                        prop="glb_shtm_de_rate_pre"
                        label="超出标准值比例">
                    </el-table-column>
                    <el-table-column
                        prop="next_eval_date"
                        label="下次评估时间">
                    </el-table-column>
                </el-table>
            </template>
            <label class="inline mb-mini mt-lg bold-font padding-border" style="font-size: 1.4rem">货运问题交易率各国细分（%）：</label>
            <template>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        label="评估时间段">
                        <template slot-scope="scope">
                            {{scope.row.date_range?'5-12周':'1-8周'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="na_shtm_rate_pre"
                        label="北美">
                    </el-table-column>
                    <el-table-column
                        prop="uk_shtm_rate_pre"
                        label="英国">
                    </el-table-column>
                    <el-table-column
                        prop="de_shtm_rate_pre"
                        label="德国">
                    </el-table-column>
                    <el-table-column
                        prop="au_shtm_rate_pre"
                        label="澳大利亚">
                    </el-table-column>
                    <el-table-column
                        prop="oth_shtm_rate_pre"
                        label="其他">
                    </el-table-column>
                </el-table>
            </template>
        </div>
    </page>
</template>

<script>
    import {api_account_performance_ship} from '@/api/ebay-kandeng-public-module';
    export default {
        name: "is-cargo",
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
            filter_status(result){
                switch (result){
                    case 0:
                        return '正常';
                    case 1:
                        return '超标';
                    case 2:
                        return '警告';
                    case 3:
                        return '限制';
                    case null:
                        return '数据未更新';
                }
            },
            init(){
                this.$http(api_account_performance_ship,this.form.account_id).then(res=>{
                    this.tableData = res.data
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
                    type:Object
            }
        },
        components:{
            accountChange:require('./account-change').default,
        }
    }
</script>

<style scoped>
    .padding-border{
        padding: 10px 0;
    }
</style>
