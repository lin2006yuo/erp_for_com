<template>
    <ui-card>
        <span slot="header">
            <label-buttons class="inline" label="帐号业绩：" @select="change_time" :buttons="buttons"></label-buttons>
            <account-search @select="change_account"
                            @change-channel="change_channel"
                            ref="accountSearch"></account-search>
        </span>
        <el-table :data="datas" v-resize="{height:41}">
            <el-table-column label="帐号" prop="account_name"></el-table-column>
            <el-table-column label="售出" inline-template>
                <div>{{get_sell_out(row)}}</div>
            </el-table-column>
            <el-table-column label="已付款" prop="order_quantity"></el-table-column>
            <el-table-column label="已发货" prop="delivery_quantity"></el-table-column>
            <el-table-column label="销售额" prop="sale_amount"></el-table-column>
        </el-table>
    </ui-card>
</template>
<style lang="stylus">

</style>
<script>

    import {api_account_performance} from '../../api/dashborad';
    export default{
        data(){
            return{
                buttons:[],
                time:1,
                account:'',
                channel:1,
                datas:[]
            }
        },
        mounted(){
            let date = new Date();
            date = date.getDate();
            this.buttons.push({name:'昨天',value:1});
            if(date > 0){
                this.buttons.push({name:'上旬',value:2});
            }
            if(date > 10){
                this.buttons.push({name:'中旬',value:3})
            }
            if(date > 20){
                this.buttons.push({name:'下旬',value:4})
            }
            this.init();
        },
        methods:{
            get_sell_out(row){
                return Number(row.order_quantity)+Number(row.order_unpaid_quantity );
            },
            change_channel(val){
                this.channel = val;
                this.init();
            },
            change_time(index,item){
                this.time = item.value;
                this.init();
            },
            change_account(channel, account){
                this.channel = channel;
                this.account = account.id;
                this.init();
            },
            init(){
                this.$http(api_account_performance,this.channel, this.account, this.time).then(res=>{
                    this.datas = res;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            getAccount({channel_id,account_id}){
                return this.$store.getters['api/account'].bind(this)(channel_id, account_id);
            }
        },
        components:{
            uiCard:require('../../components/ui-card.vue').default,
            labelButtons:require('../../components/label-buttons.vue').default,
            accountSearch:require('../../components/account-search.vue').default,
        }
    }
</script>