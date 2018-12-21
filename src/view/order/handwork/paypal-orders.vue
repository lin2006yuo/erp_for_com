<template>
    <div class="c-paypal-orders">
        <page-dialog title="选择Paypal支付信息" v-model="dialog" size="full" >
            <div>
                <label-select class="inline width-sm" v-model="snType" :lists="searchList"></label-select>
                <el-input class="inline width-super" v-model="snText" placeholder="请输入需要搜索的内容"></el-input>
                <el-button class="inline" @click.native="search" size="mini" type="primary">搜索</el-button>
                <el-button class="inline" @click.native="clear" size="mini" >清空搜索</el-button>
            </div>
            <el-table
                class="mt-sm scroll-bar"
                :data="data.paypalList"
                v-resize="{height:120}"
                border
                v-loading="isloading"
                highlight-current-row
                element-loading-text="玩命加载中..."
            >
                <el-table-column inline-template width="35">
                    <el-checkbox v-model="row.isCheck" @change="check_order(row)"></el-checkbox>
                </el-table-column>
                <el-table-column label="PayPal交易号" prop="txn_id" show-overflow-tooltip width="160px"></el-table-column>
                <el-table-column label="买家姓名/PayPal帐号" inline-template show-overflow-tooltip width="300">
                    <div>{{row.payer_name}} / {{row.payer_email}}</div>
                </el-table-column>
                <el-table-column label="金额" inline-template width="100">
                    <div>
                        {{row.mc_currency}} {{row.amt | filterPrice}}
                    </div>
                </el-table-column>
                <el-table-column label="付款时间" inline-template width="110px">
                    <times :time="row.payment_date"></times>
                </el-table-column>
                <el-table-column label="消费内容" inline-template show-overflow-tooltip>
                    <div>{{row.item_name}}</div>
                </el-table-column>
            </el-table>
            <el-pagination
                    class="fr"
                    @size-change="size_change"
                    @current-change="current_change"
                    :current-page="data.page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size="data.pageSize"
                    layout="total,prev, pager, next, jumper"
                    :total="data.count">
            </el-pagination>
            <div slot="footer">
                <el-button type="primary" size="mini" @click.native="add">确定</el-button>
                <el-button size="mini" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
import {api_get_paypal} from '../../../api/handwork';
    export default{
        data(){
            return {
                dialog:this.value,
                snType:"txn_id",
                snText:"",
                isloading:false,
                searchList:[
                    {label:"交易号",value:"txn_id"},
                    {label:"买家姓名",value:"payer_name"},
                    {label:"金额",value:"amt"},
                    {label:"paypal账号",value:"payer_email"},
                ],
                data:{
                    paypalList:[],
                    page:1,
                    pageSize:50,
                },
                radio:"",
                addData:{}
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val)
            },
            value(val){
                this.dialog = val;
                if(val){
                    this.snType = "txn_id";
                    this.snText = "";
                    this.data.page = 1;
                    this.data.pageSize = 30;
                    this.get_paypal();
                }
            }
        },
        filters:{
            filterPrice(val){
                return val?parseFloat(val).toFixed(2):"0:00";
            }
        },
        created(){

        },
        methods:{
            check_order(val){
                if(val.isCheck){
                    this.data.paypalList.forEach((data)=>{
                        data.id !==val.id&&(this.$set(data,'isCheck',false));
                    })
                }
                this.addData = val;
            },
            search(){
                this.get_paypal();
            },
            clear(){
                this.snType = "txn_id";
                this.snText  = "";
                this.get_paypal();
            },
            add(){
                this.$emit("add-paypal",this.addData);
                this.dialog = false
            },
            cancel(){
                this.dialog = false
            },
            size_change(size){
                this.data.pageSize = size;
                this.get_paypal();
            },
            current_change(page){
                this.data.page = page;
                this.get_paypal();
            },
            get_paypal(){
                let params = {
                    refund:2,
                    page:this.data.page,
                    pageSize:this.data.pageSize,
                    snType:this.snType,
                    snText:this.snText.trim()
                }
                this.isloading = true;
                this.$http(api_get_paypal,params).then(res=>{
                    this.data.paypalList = res.data;
                    this.data.paypalList.map(row=>{
                        this.$set(row,'isCheck',false)
                    })
                    this.data.count = res.count;
                    this.isloading = false;
                }).catch(code=>{
                    setTimeout(()=>{
                        this.isloading = true;
                    },500);
                  console.log(code);
                })
            }
        },
        props:{
            value:{},
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            labelSelect:require('../../../components/label-select.vue').default
        }
    }
</script>
