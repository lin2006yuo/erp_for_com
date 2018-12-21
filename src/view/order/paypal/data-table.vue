<template>
    <div class="p-paypal-table">
        <el-table  v-resize="{height:38}"
                   :data="dataTable" border
                   highlight-current-row v-loading="loading"
                   element-loading-text="玩命加载中..."
                   @selection-change="selectionChange"
                   @sort-change="sort">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                type="selection"
                width="30">
            </el-table-column>
            <el-table-column inline-template label="客户交易号" align="center" :resizable="false">
                <div>
                    <ui-tip :content="row.txn_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="付款状态" align="center" inline-template width="90" :resizable="false">
                <div>{{row.payment_status}}</div>
            </el-table-column>
            <el-table-column inline-template label="收款账号" align="center" :resizable="false">
                <div>
                    <ui-tip :content="row.business" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column  inline-template label="付款账号" align="center" :resizable="false">
                <div>
                    <ui-tip :content="row.payer_email" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="收件人姓名" align="center" v-if="clientWidth" :resizable="false">
                <div>
                    <ui-tip :content="row.address_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="收件人地址" align="center" v-if="clientWidth" :resizable="false">
                <div>
                    <ui-tip :content="row.address_street" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="国家" width="80" align="center" v-if="clientWidth" :resizable="false">
                <div>
                    <ui-tip :content="row.country_cn_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="item_number" width="120" align="center" v-if="clientWidth" :resizable="false">
                <div>
                    <ui-tip :content="row.item_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="数量" align="center" width="60" :resizable="false">
                <div>
                    <ui-tip :content="row.quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="币种" align="center" width="60" :resizable="false">
                <div>
                    <ui-tip :content="row.mc_currency" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="金额" align="center" show-overflow-tooltip width="80" sortable :resizable="false">
                <div>{{row.amt | filterData}}</div>
            </el-table-column>
            <el-table-column prop="mc_fee" label="paypal税" align="center" show-overflow-tooltip width="70" :resizable="false"></el-table-column>
            <el-table-column inline-template label="交易类型" align="center" width="80" :resizable="false">
                <div>
                    <ui-tip :content="row.txn_type" :width="96"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="收款时间" align="center" sortable width="100" :resizable="false">
                <div>
                    <times :time="row.payment_date"></times>
                </div>
            </el-table-column>
            <el-table-column inline-template label="操作" align="center" width="100" :resizable="false">
                <permission
                        tag="span"
                        :route="apis.url_paypal_orders"
                        class="operate"
                        @click="lookOver(row)">查看</permission>
            </el-table-column>
        </el-table>
        <!--查看弹框-->
        <order-form v-model="orders" :checkList='checkList'></order-form>
    </div>
</template>
<style lang="stylus">
    .p-paypal-table{
        .el-table__body-wrapper{
            overflow-x: hidden;
        }
    }

</style>
<script>
 import {api_paypal_orders,url_paypal_orders} from '../../../api/order-paypal';
    export default{
        permission:{
            url_paypal_orders
        },
        data(){
            return {
                orders:false,
                checkList:{}
            }
        },
        created(){
        },
        mounted(){
        },
        methods: {
            lookOver (row) {
             console.log("222",row.id);
             this.orders = true;
             this.checkList = {};
             this.$http(api_paypal_orders,row.id).then(res=>{
                this.checkList = res;
             }).catch(code=>{
                this.$message({message:code.message||code,type:'error'})
             })
            },
            sort(col){
                this.$emit("sort",col)
            },
            selectionChange(value) {
                this.$emit("selection-change", value)
            },
        },
        filters: {
            filterData(val){
                if(val) return parseFloat(val).toFixed(2);
            }
        },
        computed:{
          clientWidth(){
            if(document.body.clientWidth>1366){
              return true;
            }else{
              return false;
            }
          },
            emptyText(){
              return this.isFirst?'等待请求数据中...':'暂无数据'
            }
        },
        props: {
            dataTable:{},
            loading:{},
            isFirst:{
                required: true,
                type: Boolean
            }
        },
        components: {
            times:require('../../../components/times.vue').default,
            orderForm:require('./order-form.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
        }
    }
</script>
