<template>
    <page-dialog class="c-balance-detail" v-model="dialog"
                 size="large" @open="init"
                 :title="`${title}${curDate}`"
                 height="650"
                 :close-on-click-modal="false">
        <el-table
            class="scroll-bar" 
            :data="tableData"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            highlight-current-row>
            <el-table-column prop="account_name" label="账号简称" ></el-table-column>
            <el-table-column prop="site" label="站点" ></el-table-column>
            <el-table-column label="余额(本币种)" inline-template>
                <div>{{row.balance}} {{row.currency}}</div>
            </el-table-column>
            <el-table-column prop="balance_CNY" label="余额(CNY)" ></el-table-column>
            <el-table-column label="下次转账时间" inline-template>
                 <div>{{row.transfer_amount_a_time | filterTime}}</div>
            </el-table-column>
            <el-table-column label="上次转账金额（本币种）" inline-template>
                <div>{{row.latest_payment}} {{row.currencyy}}</div>
            </el-table-column>
            <el-table-column prop="latest_payment_CNY" label="上次转账金额（CNY）" ></el-table-column>
        </el-table>
        <el-pagination
            class="fr"
            @size-change="size_change"
            @current-change="current_change"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
        </el-pagination>
        <div slot="footer">
            <el-button size="mini" class="inline" @click.native="dialog = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_balance_details} from '@/api/balance-data';
    export default {
        data() {
            return {
                title: '账号余额-亚马逊',
                dialog: this.value,
                tableData:[],
                page:1,
                pageSize:20,
                count:0,
                loading:false,
            }
        },
        watch: {
            dialog(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.dialog = val;
            },
        },
        filters:{
            filterTime(val){
                return datef('YYYY-MM-dd',val)
            },
        },
        methods: {
            get_label(name){
                switch(name){
                    case 'balance': return this.currency?`余额（${this.currency}）`:'余额';
                    case 'latest': return this.currency?`上次转账金额（${this.currencyy}）`:'上次转账金额';
                    default:return '找不到name值'
                }
            },
            init(){
                this.loading = true;
                let data = {
                    time:this.curDate,
                    page:this.page,
                    pageSize:this.pageSize
                };
                this.$http(api_balance_details,data).then(res=>{
                    this.tableData = res.data;
                    this.count = res.count;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code})
                }).finally(()=>{
                    this.loading = false;
                })
            },
            size_change(size){
                this.pageSize = size;
                this.init();
            },
            current_change(page){
                this.page = page;
                this.init();
            },
        },
        computed:{
            currency(){
                if(this.tableData&&this.tableData.length>0){
                    return this.tableData[0].currency
                }
            },
            currencyy(){
                if(this.tableData&&this.tableData.length>0){
                    return this.tableData[0].currencyy
                }
            }
        },
        props: {
            value: {},
            curDate:{},
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
        }
    }
</script>
