<template>
    <page-dialog class="payment-deal" v-model="visible" @close="close" :title="title" width="70%" @open="open">
        <div class="mt-sm">
            <el-row>
                <el-col :span="10" :offset="2">
                    <div class="row-content">
                        <span>供应商 : </span> <span>{{checkList.supplier}}</span>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="row-content">
                        <span>结算方式 : </span> <span>{{checkList.balance_text}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" :offset="2">
                    <div class="row-content">
                        <span>申请时间 : </span> <span>{{checkList.create_time_date}}</span>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="card-line"></div>
        <el-button class="mb-sm" type="primary" size="mini"
                   @click="del_purchase_numb()"
                   :disabled="selects.length===0">删除
        </el-button>
        <el-table :data="checkListDetail"
                  @selection-change="selectionChange">
            <el-table-column type="selection" width="30"><div></div></el-table-column>
            <el-table-column label="采购单号" min-width="70" inline-template>
                <div>{{row.purchase_order.id}}</div>
            </el-table-column>
            <el-table-column label="运费" min-width="70" inline-template>
                <div>{{row.purchase_order.currency_code}} {{row.purchase_order.shipping_cost | filtersPay}}</div>
            </el-table-column>
            <el-table-column label="应付款（货款+运费-优惠金额 )" min-width="100" inline-template>
                <div>{{row.purchase_order.currency_code}} {{row.purchase_order.payable_amount | filtersPay}}</div>
            </el-table-column>
            <el-table-column label="已支付" min-width="70" inline-template>
                <div>{{row.purchase_order.currency_code}} {{row.purchase_order.actual_payment | filtersPay}}</div>
            </el-table-column>
            <el-table-column label="已申请付款待处理金额" min-width="80" inline-template>
                <div>{{row.purchase_order.currency_code}} {{row.purchase_order.process_amount | filtersPay}}</div>
            </el-table-column>
            <el-table-column label="采购员" min-width="65" inline-template>
                <div>{{row.purchase_order.purchaser}}</div>
            </el-table-column>
            <el-table-column label="付款操作" min-width="130" inline-template>
                <div class="deal-center-pay">
                    <div class="width-super">
                        <span>本次申请金额：{{row.purchase_order.currency_code}}</span>
                        <ui-limit-number v-model="row.apply_amount"
                                         style="width:80px;"
                                         @blur="update_price(row)"
                                         :limit="3"
                                         :min="0"
                                         class="limit-input">
                        </ui-limit-number>
                    </div>
                    <div class="width-super">
                        <span>申请支付最大金额：{{row.purchase_order.currency_code}}</span>
                        <span>{{row.purchase_order.max_apply_price | filtersPay}}</span>
                    </div>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
            style="text-align:right;"
            class="mt-lg"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[50,100,200,500]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="checkListTotal">
        </el-pagination>
        <div class="pay-all">本次总申请: {{checkList.currency_code}} &nbsp<span class="c-red mr-sm">{{dealTotal}}</span></div>
        <div slot="footer">
            <permission tag="requestButton"
                        req-key="doInvalid"
                        @click.native="doInvalid"
                        :route="apis.url_purchase_apply_invalid">作废
            </permission>
            <permission tag="requestButton"
                        @click.native="dealSubmit"
                        req-key="dealSubmit"
                        :route="apis.url_purchase_apply_processor">提交
            </permission>
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus" >
    .payment-deal {
        .row-content{
            display: flex;
            align-items: center;
            span:first-child{
                display: inline-block;
                width:120px;
                text-align:right;
                padding:6px 5px;
                font-weight: bold;
            }
            span:last-child{
                width: 80%;
            }
        }
        .card-line{
            border-top: 1px solid #dee5ee;
            height: 15px;
            margin-top: 30px;
        }
        .pay-all{
            display:flex;
            width:100%;
            height:30px;
            border-radius:5px;
            justify-content : flex-end;
            border: 1px solid #E0E6ED;
            line-height:30px;
            margin-top: 20px;
            margin-bottom: 10px;
            font-weight: blod
        }
        .limit-input{
            font-size: 1.2rem;
            display: inline-block;
            vertical-align: middle;
        }
        .el-input__inner{
            height: 20px;
        }
        .deal-center-pay{
            display:flex;
            flex-direction column;
            text-align: left;
            padding: 0 25px;
        }
    }
</style>
<script>
    import {
        url_purchase_apply_invalid,
        api_purchase_apply_invalid,
        url_purchase_apply_processor,
        api_purchase_apply_processor
    } from "../../../api/finance-purchase"

    export default {
        permission: {
            url_purchase_apply_invalid,
            url_purchase_apply_processor
        },
        data() {
            return {
                page: 1,
                pageSize: 50,
                total: 0,
                filterGoodsLists:[],
                visible: false,
                selects: [],
                arrId:[],
            }
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            filtersPay(val){
                if(Number(val)>=0){
                    return Number(val).toFixed(3);
                }
            },
            payFilter(val){
                return val.toFixed(3);
            }
        },
        methods: {
            update_price(row){
                if (row.apply_amount < 0) {
                    row.apply_amount = 0;
                }
                row.apply_amount = Number((row.apply_amount * 1000) / 1000).toFixed(3);
            },
            selectionChange(val){
                this.selects = val;
            },
            del_purchase_numb() {//删除
                this.$confirm(`您将删除已勾选的采购单，确定进行此操作?`,'提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=> {
                    this.selects.forEach(row => {
                        let findIndex = this.checkList.detail.findIndex(data => data.id === row.id);
                        this.checkList.detail.splice(findIndex, 1);
                    });
                    this.arrId = this.arrId.concat(this.selects.map(row => row.id))
                }).catch(()=> {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    })
                })
            },
            dealSubmit(){//提交
                let teampObj = [];
                for (let i = 0; i < this.checkList.detail.length; i++) {
                    teampObj[i] = {
                        id: this.checkList.detail[i].id,
                        apply_amount: this.checkList.detail[i].apply_amount,
                    }
                }
                let data = {
                    delete: this.arrId,
                    update: teampObj
                };
                this.$http(api_purchase_apply_processor,this.checkList.id, {data:data}).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('dealSubmit', false);
                    },200)
                })
            },
            doInvalid(){//作废
                let params = {
                    id: this.checkList.id,
                };
                this.$http(api_purchase_apply_invalid,params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('doInvalid', false);
                    }, 200);
                });
            },
            refresh() {//刷新页面
                this.visible = false;
                this.$emit('search');
            },
            close(){
                this.arrId = [];
                this.selects = [];
            },
            open(){
            },
            handleSizeChange(pageSize){
                this.pageSize = pageSize;
            },
            handleCurrentChange(page){
                this.page = page;
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            },
        },
        mounted(){

        },
        computed:{
            checkListDetail(){
                if(this.checkList.detail){
                    return this.checkList.detail.slice((this.page-1)*this.pageSize, this.page*this.pageSize);
                }
            },
            checkListTotal(){
                if(this.checkList.detail){
                    return this.checkList.detail.length;
                }
            },
            dealTotal() {
                let sum = 0;
                if(this.checkList.detail){
                    this.checkList.detail.map(data => {
                        sum += (parseFloat(data.apply_amount) || 0);
                    });
                }
                return sum.toFixed(3);
            }
        },
        props: {
            value: {},
            title:{required:true, type: String},
            checkList: {required: true, type: Object,},
        },
        components: {
            requestButton: require('@/global-components/request-button.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            uiInput:require('../../../components/ui-input.vue').default,
            uiLimitNumber:require('../../../components/ui-limit-number').default,
        }
    }
</script>

