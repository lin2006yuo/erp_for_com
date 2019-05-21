<template>
    <page>
        <account-change @change-account="change_account" :form="form"></account-change>
        <div class="table">
            <label class="inline mb-mini bold-font padding-border" style="font-size: 1.4rem">商业追踪计划：
                <span :class="classObject(tableData.pgc_status_txt)" style="font-size: 1.4rem">{{tableData.pgc_status_txt}}</span>
            </label>
            <table class="template" ref="table">
                <tr>
                    <td rowspan=2 class="label-width"> </td>
                    <th rowspan="2">账号累计营业额</th>
                    <th rowspan="2">是否已被冻结</th>
                    <th rowspan="2">重复刊登违规</th>
                    <th colspan="3">商业计划完成总体表现</th>
                    <th rowspan="2">账号不良交易率</th>
                    <th rowspan="2">海外仓使用率</th>
                    <th rowspan="2">平均月销售额</th>
                </tr>
                <tr>
                    <th>目标站点完成情况</th>
                    <th>目标平类完成情况</th>
                    <th>目标平均单价完成情况</th>
                </tr>
                <tr>
                    <th>标准值</th>
                    <td >{{tableData.account_cmltv_std}}</td>
                    <td >{{tableData.suspension_std}}</td>
                    <td >{{tableData.duplicate_std}}</td>
                    <td >{{tableData.cridr_as_std}}</td>
                    <td >{{tableData.cat_as_std}}</td>
                    <td >{{tableData.asp_as_std}}</td>
                    <td >{{tableData.dft_std}}</td>
                    <td >{{tableData.wh_std}}</td>
                    <td >{{tableData.avg_gmv_std}}</td>
                </tr>
                <tr>
                    <th rowspan="2">状态</th>
                    <td >
                        <span :class="[!!tableData.account_cmltv?'out':'pass','inline']"></span>
                    </td>
                    <td >
                        <span :class="[!!tableData.suspension_sts?'out':'pass','inline']"></span>
                    </td>
                    <td >
                        <span :class="[!!tableData.duplicate_sts?'out':'pass','inline']"></span>
                    </td>
                    <td >
                        <span :class="[!!tableData.cridr_as_promised?'out':'pass','inline']"></span>
                    </td>
                    <td >
                        <span :class="[!!tableData.cat_as_promised?'out':'pass','inline']"></span>
                    </td>
                    <td >
                        <span :class="[!!tableData.asp_as_promised?'out':'pass','inline']"></span>
                    </td>
                    <td >
                        <span :class="[!!tableData.dft_sts?'out':'pass','inline']"></span>
                    </td>
                    <td >
                        <span :class="[!!tableData.wh_sts?'out':'pass','inline']"></span>
                    </td>
                    <td >
                        <span :class="[!!tableData.avg_gmv_sts?'out':'pass','inline']"></span>
                    </td>
                </tr>
            </table>
            <label class="inline mb-mini bold-font mt-lg padding-border" style="font-size: 1.4rem">提交的当前账号的商业计划：</label>
            <table class="template" ref="table">
                <tr>
                    <th>主要销售国家</th>
                    <th>次要销售国家</th>
                    <th>主要产品所属一级分类</th>
                    <th>主要产品所属二级分类</th>
                    <th>次要产品所属一级分类</th>
                    <th>次要产品所属二级分类</th>
                    <th>申请账户主营产品预估平均单价（美金）</th>
                    <th>仓储所在地</th>
                    <th>海外仓存货销售占比</th>
                </tr>
                <tr>
                    <td >{{tableData.primary_corridor}}</td>
                    <td >{{tableData.secondary_corridor}}</td>
                    <td >{{tableData.primary_vertical}}</td>
                    <td >{{tableData.primary_category}}</td>
                    <td >{{tableData.secondary_vertical}}</td>
                    <td >{{tableData.secondary_category}}</td>
                    <td >{{tableData.estimated_item_asp_usd}}</td>
                    <td >{{tableData.location_of_warehouse}}</td>
                    <td >{{tableData.warehouse_adoption_rate}}</td>
                </tr>
            </table>
        </div>
    </page>
</template>

<script>
    import {api_account_acct_pgc_tracking} from '@/api/ebay-kandeng-public-module'
    export default {
        name: "business-plan",
        mounted(){
            this.form.account_id=this.param.account_id;
        },
        data(){
            return{
                form:{
                    account_id:'',
                },
                tableData:{},
            }
        },
        methods:{
            classObject(text){
                return {
                    'color-green': text!=="--"&&text==='正常',
                    'color-red': text!=="--"&&(text!=='正常'&&text!=='超标'),
                    'color-yellow':text!=="--"&&text==='超标'
                }
            },
            filter_status(status){
                switch (status){
                    case 0:
                        return '达标';
                    case 1:
                        return '不达标'
                }
            },
            init(){
                this.$http(api_account_acct_pgc_tracking,this.form.account_id).then(res=>{
                    if(!(res.data instanceof Array)){
                        this.tableData=res.data;
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

<style scoped>
    .padding-border{
        padding: 10px 0;
    }
    .label-width{
        width: 80px;
    }
    .green{color: green;}
    .red{
        color: red;}
    .out{
        width: 20px;
        height: 20px;
        background: url('../../../../assets/out.png') no-repeat center;
        background-size: 100%;
        text-align: center;
    }
    .pass{
        width: 20px;
        height: 20px;
        background: url('../../../../assets/pass.png') no-repeat center;
        background-size: 100%;
        text-align: center;
    }
</style>
