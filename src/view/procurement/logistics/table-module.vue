<template>
    <div>
        <div v-for="(item, index) in tableData" :key="index">
            <span>
                <b>采购单id：</b>
                {{item.purchase_id}}
            </span>
            <span>
                <b>外部流水号：</b>
                {{item.external_number}}
            </span>
            <span>
                <b>运费：</b>
                {{item.shipping_cost|filterCost}}
            </span>
            <div v-for="(row, ind) in item.logistics" :key="ind">
                <b>运输方式：</b>
                <span>{{row.logistics_company_name}}</span>
                <b>运单号：</b>
                <span>{{row.logistics_bill_no}}</span>
                 <b>发货时间：</b>
                <span>{{row.delivered_time | timeFilter}}</span>
                 <b>预计到达日期：</b>
                <span>{{row.expect_arrive_date | timeFilter}}</span>
            </div>
        </div>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {}
        },
        filters:{
            filterCost(val){
                if(Number(val)>0){
                    return Number(val).toFixed(3);
                }else{
                    return val;
                }
            },
            timeFilter(val){
                if(val){
                    return datef('YYYY-MM-dd HH:mm:ss', val/1000);
                } else {
                    return "--";
                }
            },
        },
        props: {
            tableData:{}
        },
        components: {}
    }
</script>
