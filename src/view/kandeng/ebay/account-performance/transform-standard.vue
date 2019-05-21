<template>
    <page>
        <account-change @change-account="change_account" :form="form"></account-change>
        <div class="table">
            <label class="inline mb-mini bold-font padding-border" style="font-size: 1.4rem">美国<$5及其他25个主要国家的物流使用合规表现（%）：</label>
            <template>
                <el-table
                    :data="table"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="e_packet_status_txt"
                        label="表现状态">
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
                        prop="next_evaluation_date"
                        label="下次评估时间">
                    </el-table-column>
                    <el-table-column
                        prop="standard_value"
                        label="标准值">
                    </el-table-column>
                    <el-table-column
                        prop="evaluated_tnx_cnt"
                        label="评估总交易数">
                    </el-table-column>
                    <el-table-column
                        prop="adoption"
                        label="物流使用合规比例">
                    </el-table-column>
                    <el-table-column
                        prop="cbt_tnx_cnt"
                        label="其中：买家选择使用标准型物流交易数">
                    </el-table-column>
                    <el-table-column
                        prop="cbt_adoption"
                        label="标准型物流交易使用全程追踪物流比例">
                    </el-table-column>
                    <el-table-column
                        prop="wh_tnx_cnt"
                        label="其中：买家选择使用经济型物流交易数">
                    </el-table-column>
                    <el-table-column
                        prop="wh_adoption"
                        label="经济型物流交易中使用至少含揽收信息或全程跟踪物流比例">
                    </el-table-column>
                </el-table>
            </template>
            <label class="inline mb-mini mt-lg bold-font padding-border" style="font-size: 1.4rem">美国>$5交易的物流使用表现（%）：</label>
            <template>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        label="表现状态">
                        <template slot-scope="scope">
                        <span :class="classObject(scope.row.e_packet_status_txt)">
                            {{scope.row.e_packet_status_txt}}
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
                        prop="next_evaluation_date"
                        label="下次评估时间">
                    </el-table-column>
                    <el-table-column
                        prop="standard_value"
                        label="标准值">
                    </el-table-column>
                    <el-table-column
                        prop="evaluated_tnx_cnt"
                        label="评估总交易数">
                    </el-table-column>
                    <el-table-column
                        prop="adoption"
                        label="使用全程跟踪物流比例">
                    </el-table-column>
                    <el-table-column
                        prop="cbt_tnx_cnt"
                        label="其中：跨境发货交易数">
                    </el-table-column>
                    <el-table-column
                        prop="cbt_adoption"
                        label="跨境发货交易中使用ePacket+比例">
                    </el-table-column>
                    <el-table-column
                        prop="wh_tnx_cnt"
                        label="其中：海外仓发货交易数">
                    </el-table-column>
                    <el-table-column
                        prop="wh_adoption"
                        label="海外仓发货交易中使用带有效终物流比例">
                    </el-table-column>
                </el-table>
            </template>
        </div>
    </page>
</template>

<script>
    import {
        api_account_shipping_policy
    } from '@/api/ebay-kandeng-public-module';
    export default {
        name: "transform-standard",
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
                this.$http(api_account_shipping_policy,this.form.account_id).then(res=>{
                    if(!(res.epacket_shipping instanceof Array)){
                        this.tableData.push(res.epacket_shipping);//大于5
                    }
                    if(!(res.eds_shipping instanceof Array)){
                        this.table.push(res.eds_shipping)//小于5
                        console.log(this.tableData)
                    }
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
                this.tableData = [];
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
    .color-red{
        color red;
    }
    .padding-border{
        padding: 10px 0;
    }
    .color-green{
        color green;
    }
</style>
