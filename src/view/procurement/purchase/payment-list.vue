<template>
    <div class="p-payment-list">
        <page-dialog v-model="paymentVisable" size="large" title="申请付款" :close-on-click-modal="false">
            <el-table :data="filterData" border style="width: 100%" height="400">
                <el-table-column prop="purchase_order_code" label="采购单号" width="120"></el-table-column>
                <el-table-column label="运费" width="100" inline-template>
                    <div>
                        <span>{{row.currency_code}}</span>&nbsp;
                        <span>{{row.shipping_cost}}</span>
                    </div>
                </el-table-column>
                <el-table-column label="应付款(货款+运费-优惠金额)" width="200" inline-template>
                    <div>
                        <span>{{row.currency_code}}</span>&nbsp;
                        <el-input class="inline" v-model="row.payable_amount" readonly="readonly"></el-input>
                    </div>
                </el-table-column>
                <el-table-column label="已支付" width="120" inline-template>
                    <div>
                        <span>{{row.currency_code}}</span>&nbsp;
                        <span>{{row.payment_amount|filterAmount}}</span>
                    </div>
                </el-table-column>
                <el-table-column label="已申请付款待处理金额" width="140" inline-template>
                    <div>
                        <span>{{row.currency_code}}</span>&nbsp;
                        <span>{{row.process_payment_amount|filterAmount}}</span>
                    </div>
                </el-table-column>
                <el-table-column label="付款操作" inline-template align="left">
                    <div>
                        <div style="margin-top: 3px;">
                            <span>本次申请金额：</span>
                            <span>{{row.currency_code}}</span>&nbsp;
                            <ui-limit-number v-model="row.apply_amount"
                                             style="width:80px"
                                             :limit="3"
                                             :class="`inline ${Number(row.apply_amount)>Number(row.rest_amount)?'error-color':''}`"
                                             :min="0">
                            </ui-limit-number>
                            <span v-if="Number(row.apply_amount)>Number(row.rest_amount)" style="color: red;">申请金额大于最大支付金额</span>
                            <div style="display: block">
                                <span>申请支付最大金额：</span>
                                <span>{{row.currency_code}}</span>&nbsp;
                                <span>{{row.rest_amount|filterAmount}}</span>
                            </div>
                        </div>
                    </div>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination
                    class="fr inline"
                    style="margin: 5px 0 20px 0px;"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page=page
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size=pageSize
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=payData.total>
                </el-pagination>
                <div class="fr inline" style="margin-top: 12px;">
                    <span>本次总申请：</span>
                    <span v-for="code in currency_codes">
                        <span style="color:red">{{code}}{{total_money(code)}}</span>&nbsp;&nbsp;
                    </span>
                </div>
            </el-row>
            <!--<el-card class="payment-card">-->
            <!--</el-card>-->
            <div slot="footer" class="dialog-footer">
                <request-button @click.native="submit" req-key="submit_pay" :mintime="200"
                                :disabled="payData.dataList.length==0">确认申请
                </request-button>
                <el-button size="mini" @click="paymentVisable=false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .p-payment-list {
        .el-table__body-wrapper {
            overflow-x: hidden;
        }
        .payment-card {
            height: 40px;
            width: 100%;
            .el-card__body {
                padding: 11px;
            }
        }
        .addClass {
            color: red;
        }
        .error-color{
            .el-input__inner {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                background-color: #fff;
                background-image: none;
                border-radius: 3px;
                border: 1px solid red;
                box-sizing: border-box;
                color: #1f2d3d;
                display: block;
                font-size: inherit;
                height: 26px;
                line-height: 1;
                outline: none;
                padding: 3px 10px;
                transition: border-color .2s cubic-bezier(.645,.045,.355,1);
                width: 100%;
            }
        }
    }
</style>
<script>
    import pageDialog from "../../../components/page-dialog.vue"
    import {api_pay} from "../../../api/purchase"

    export default {
        page: {
            devinfo: {
                frontEnd: '徐梦娇;黎宏珍',
                backEnd: '杨伟权;谭斌',
                createTime: '2017-3-8',
                updateTime: '2017-8-22'
            }
        },
        data() {
            return {
                paymentVisable: false,
                page: 1,
                pageSize: 50
            }
        },
        methods: {
            submit() {//----确认申请
                let teampObj = {};
                for (let i = 0; i < this.payData.dataList.length; i++) {
                    if (this.payData.dataList[i].apply_amount > this.payData.dataList[i].payable_amount - this.payData.dataList[i].payment_amount - this.payData.dataList[i].process_payment_amount) {
                        this.$reqKey('submit_pay', false);
                        this.$message({type: "warning", message: "本次申请金额不能大于最大支付金额！"});
                        return false;
                    } else if (this.payData.dataList[i].apply_amount === '0') {
                        this.$reqKey('submit_pay', false);
                        this.$message({type: "warning", message: "本次申请支付金额必须大于0！"});
                        return false;
                    }
                    teampObj[this.payData.dataList[i].id] = {
                        apply_amount: this.payData.dataList[i].apply_amount,
                        apply_remark: ''
                    }
                }
                let data = {
                    applyPayment: teampObj
                };
                this.$http(api_pay, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message
                    });
                    this.paymentVisable = false;
                    this.$emit('refresh');
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('submit_pay', false);
                    }, 200);
                });
            },
            change_amount(row) {
                if (row.apply_amount < 0) {
                    row.apply_amount = 0
                }
                let num = row.rest_amount;
                if (row.apply_amount > num) {
                    row.apply_amount = num;
                } else {
                    row.apply_amount = Number(row.apply_amount).toFixed(3);
                }
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;

            },
            handleCurrentChange(page) {
                this.page = page;
            },
            total_money(code){
                return this.filterData.reduce((total,row)=>{
                    if(row.currency_code===code){
                        return total += !isNaN(Number(row.apply_amount))? Number(row.apply_amount) : 0;
                    }else{
                        return total
                    }
                },0).toFixed(3);
            }
        },
        filters: {
            filterAmount(val) {
                return !!val&&!isNaN(Number(val))?Number(val).toFixed(3):val;
            }
        },
        watch: {
            value(val) {
                this.paymentVisable = val
            },
            paymentVisable(val) {
                this.$emit("input", val)
            }
        },
        computed: {
            filterData() {
                let ret = [];
                let index = (this.page - 1) * this.pageSize;
                let j = this.pageSize;
                for (let i = index; i < this.payData.dataList.length && j > 0; i++) {
                    let row = this.payData.dataList[i];
                    ret.push(row);
                    j = j - 1;
                }
                return ret;
            },
            currency_codes(){
                let obj = {};
                this.filterData.forEach((row,index)=>{
                    obj[row.currency_code] = index;
                });
                return Object.keys(obj);
            }
        },
        props: {
            value: {},
            payData: {}
        },
        components: {
            pageDialog,
            uiLimitNumber: require('@/components/ui-limit-number').default
        }
    }
</script>
