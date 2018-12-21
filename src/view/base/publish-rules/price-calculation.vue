<template>
    <page-dialog v-model="show" size="large" class="price-calculation"
                 @open="open"
                 @close="close"
                 :title="`价格计算器${platformInformation.platform_name}`" :close-on-click-modal="false">
        <el-form :model="form" :label-width="`${labelWidth}`" class="price-calculation-form">
            <el-form-item label="物流附加费：">
                <el-input v-model="form.logistics_surcharge" class="width-xs inline" type="number"></el-input> RMB
            </el-form-item>
            <el-form-item label="重量：">
                <el-input v-model="form.weight" class="width-xs inline" type="number"></el-input> g
            </el-form-item>
            <el-form-item label="运费：">
                <div class="mb-sm">
                    【首重】前 <el-input v-model="form.first_weight" class="price-calculation-freightInput inline" type="number"></el-input> g , 收取 <el-input v-model="form.first_freight" class="price-calculation-freightInput inline" type="number"></el-input> RMB
                    <el-button type="text" size="mini" class="ml-sm" @click.native="freight_trial">运费试算</el-button>
                </div>
                <div>
                    【续重】每 <el-input v-model="form.continued_weight" class="price-calculation-freightInput inline" type="number"></el-input> g , 收取 <el-input v-model="form.continued_freight" class="price-calculation-freightInput inline" type="number"></el-input> RMB
                </div>
            </el-form-item>
            <el-form-item label="物流挂号费：">
                <el-input v-model="form.registration_fee" class="width-xs inline" type="number"></el-input> RMB
            </el-form-item>
            <el-form-item label="其他固定成本：">
                <div class="width-lg inline">
                    <el-input v-model="form.other_fixed_fee" class="width-xs inline" type="number"></el-input> RMB
                </div>
                <label class="ml-xs inline t-right" :class="{'width-md':platformInformation.platform === 1,'width-sm':platformInformation.platform === 3 || platformInformation.platform === 4}">其他动态成本：</label>
                <el-input v-model="form.other_dynamic_fee" class="width-xs inline" type="number"></el-input> RMB/g
            </el-form-item>
            <el-form-item label="毛利润率：">
                <el-input v-model="form.gross_profit" class="width-xs inline" type="number"></el-input> %
            </el-form-item>
            <el-form-item label="平台佣金率：">
                <el-input v-model="form.platform_profit" class="width-xs inline" type="number"></el-input> %
            </el-form-item>
            <el-form-item label="平台活动折扣率：">
                <el-input v-model="form.platform_discount_profit" class="width-xs inline" type="number"></el-input> %
            </el-form-item>
            <el-form-item label="币种：">
                <div class="width-lg inline">
                    <el-select v-model="form.currency"
                               placeholder="请选择币种"
                               class="width-xs inline"
                               @change="change_dictionary">
                        <el-option v-for="(item,i) in currency_list"
                                   :key="i"
                                   :label="item.name"
                                   :value="item.code"
                                   filterable
                                   clearable>
                        </el-option>
                    </el-select>
                </div>
                <label class="ml-xs inline t-right"
                       :class="{'width-md':platformInformation.platform === 1,'width-sm':platformInformation.platform === 3 || platformInformation.platform === 4}">
                    换算汇率：
                </label>
                <el-input v-model="form.exchange_rate" class="width-xs inline" type="number"></el-input>
            </el-form-item>
            <el-form-item v-if="platformInformation.platform === 1" label="Paypal大额收款账户费率：">
                <div class="width-lg inline">
                    <el-input v-model="form.paypal_procedure_big_profit" class="width-xs inline" type="number"></el-input> %
                </div>
                <label class="ml-xs width-md inline t-right">Paypal大额固定金额：</label>
                <el-input v-model="form.paypal_fixed_big_price" class="width-xs inline" type="number"></el-input> {{form.currency}}
            </el-form-item>
            <el-form-item v-if="platformInformation.platform === 1" label="Paypal小额收款账户费率：">
                <div class="width-lg inline">
                    <el-input v-model="form.paypal_procedure_small_profit" class="width-xs inline" type="number"></el-input> %
                </div>
                <label class="ml-xs width-md inline t-right">Paypal小额固定金额：</label>
                <el-input v-model="form.paypal_fixed_small_price" class="width-xs inline" type="number"></el-input> {{form.currency}}
            </el-form-item>
            <table border="1px" class="price-calculation-countTable" cellspacing="0" cellpadding="0">
                <tr>
                    <td width="190" height="30">采购价（RMB）</td>
                    <td width="190" height="30">总销售价（RMB）</td>
                    <td width="190" height="30">总销售价（{{form.currency}}）</td>
                </tr>
                <tr>
                    <td width="190" height="30"><el-input class="width-sm inline" v-model="form.purchase_price" type="number"></el-input></td>
                    <td width="190" height="30"><el-input class="width-sm inline price-calculation-redColor" v-model="form.total_price_CN" type="number"></el-input></td>
                    <td width="190" height="30"><el-input class="width-sm inline price-calculation-redColor" v-model="form.total_price_OT" type="number"></el-input></td>
                </tr>
            </table>
        </el-form>
        <div>
            <div v-if="platformInformation.platform === 1" class="price-calculation-price_explain">
                <p>
                    总销售价=（采购价格+重量*运费/g+Paypal固定金额附加费*汇率+物流附加费+物流挂号费+其他固定成本+重量*其他动态成本/g）/（1-毛利润率-平台佣金率-折扣率-Paypal手续费率）/ 汇率
                </p>
                <p>注意：此处取PayPal“大额”与“小额”手续费下，较小的计算结果作为最终的总销售价！</p>
            </div>
            <div v-else-if="platformInformation.platform === 3 || platformInformation.platform === 4" class="price-calculation-price_explain">
                <p>总销售价=（采购价格+重量*运费/g+物流附加费+物流挂号费+其他固定成本+重量*其他动态成本/g）/（1-毛利润率-平台佣金率-折扣率）/ 汇率</p>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click.native="count_total" size="mini">计算总销售价</el-button>
            <el-button type="primary" @click.native="count_price" size="mini">计算采购价</el-button>
            <el-button @click.native="show = false" size="mini">返回</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .price-calculation .dialog__body{
        /*max-height: 1000px !important;*/
    }
    .price-calculation .inner {
        top: 5% !important;
    }
    .price-calculation-freightInput input{
        width:70px;
    }
    .price-calculation-countTable{
        margin: 0 auto;
        border-color: lightgray;
        text-align: center;
    }
    .price-calculation-countTable input{
        text-align center
    }
    .price-calculation-redColor input{
        color: red;
    }
    .price-calculation-price_explain{
        padding: 0 200px;
    }
</style>
<script>
    import {api_get_currency} from '../../../api/publish-rules';
    export default {
        data(){
            return {
                show:false,
                form:{
                    logistics_surcharge:'',
                    weight:'',
                    first_weight:'',
                    first_freight:'',
                    continued_weight:'',
                    continued_freight:'',
                    registration_fee:'',
                    other_fixed_fee:'',
                    other_dynamic_fee:'',
                    gross_profit:'',
                    platform_profit:'',
                    platform_discount_profit:'',
                    currency:'USD',
                    exchange_rate:'',
                    purchase_price:'',
                    total_price_CN:'',
                    total_price_OT:'',
                    paypal_fixed_big_price:'',
                    paypal_procedure_big_profit:'',
                    paypal_fixed_small_price:'',
                    paypal_procedure_small_profit:'',
                },
                labelWidth:'',
                currency_list:[]
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            open(){
                this.form.currency = 'USD';
                this.change_dictionary();
                if(this.platformInformation.platform === 1){
                    this.labelWidth = `360px`;
                } else if(this.platformInformation.platform === 3 || this.platformInformation.platform === 4){
                    this.labelWidth = `330px`;
                }
            },
            close(){
                Object.keys(this.form).forEach(key=>{
                    this.form[key] = "";
                });
            },
            init(){
                this.$http(api_get_currency).then(res=>{
                    this.currency_list = res;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            calculateShipping(){
                if(!Number(this.form.continued_weight) && !Number(this.form.first_weight) && !Number(this.form.continued_freight) && !Number(this.form.first_freight)){
                    return false;
                } else {
                    let freight = Number(this.form.first_freight)+(Number(this.form.weight)-Number(this.form.first_weight))*(Number(this.form.continued_freight)/Number(this.form.continued_weight));
                    return freight;
                }

            },
            //计算总价
            count_total(){
                if(this.form.purchase_price === ''){
                    this.$message({type:"error",message:'请输入采购价'});
                    return false;
                }
                let freight = this.calculateShipping();
                if(!freight){
                    this.$message({type:"error",message:'请填写完整的运费信息'});
                    return false;
                }
                if(this.platformInformation.platform === 1){
                    let total_big_price = ((Number(this.form.purchase_price) + Number(this.form.logistics_surcharge) + Number(freight) + Number(this.form.registration_fee) + Number(this.form.other_fixed_fee) + Number(this.form.weight)*Number(this.form.other_dynamic_fee) + Number(this.form.paypal_fixed_big_price)) / (1-(Number(this.form.gross_profit)+Number(this.form.platform_profit)+Number(this.form.platform_discount_profit)+Number(this.form.paypal_procedure_big_profit))/100)).toFixed(3);
                    let total_small_price = ((Number(this.form.purchase_price) + Number(this.form.logistics_surcharge) + Number(freight) + Number(this.form.registration_fee) + Number(this.form.other_fixed_fee) + Number(this.form.weight)*Number(this.form.other_dynamic_fee) + Number(this.form.paypal_fixed_small_price)) / (1-(Number(this.form.gross_profit)+Number(this.form.platform_profit)+Number(this.form.platform_discount_profit)+Number(this.form.paypal_procedure_small_profit))/100)).toFixed(3);
                    this.form.total_price_CN = total_big_price > total_small_price ? total_big_price : total_small_price;
                    this.form.total_price_OT = (this.form.total_price_CN / this.form.exchange_rate).toFixed(3);
                } else if(this.platformInformation.platform === 3 || this.platformInformation.platform === 4){
                    this.form.total_price_CN = ((Number(this.form.purchase_price) + Number(this.form.logistics_surcharge) + Number(freight) + Number(this.form.registration_fee) + Number(this.form.other_fixed_fee) + Number(this.form.weight)*Number(this.form.other_dynamic_fee)) / (1-(Number(this.form.gross_profit)+Number(this.form.platform_profit)+Number(this.form.platform_discount_profit))/100)).toFixed(3);
                    this.form.total_price_OT = (this.form.total_price_CN / this.form.exchange_rate).toFixed(3);
                }
            },
            //计算采购价
            count_price(){
                if(this.form.total_price_CN !== '' && this.form.total_price_OT !== ''){
                    this.$message({type:"error",message:'人民币总销售价、其他货币总销售价输入框只能填写一项！'});
                } else if(this.form.total_price_CN === '' && this.form.total_price_OT === ''){
                    this.$message({type:"error",message:'请输入人民币总销售价或其他货币总销售价'});
                } else {
                    let freight = this.calculateShipping();
                    if(!freight){
                        return false;
                    }
                    if(this.platformInformation.platform === 1){
                        if(this.form.total_price_CN === ''){
                            this.form.purchase_price = (this.form.total_price_OT * this.form.exchange_rate * (1-(Number(this.form.gross_profit)+Number(this.form.platform_profit)+Number(this.form.platform_discount_profit)+Number(this.form.paypal_procedure_big_profit))/100) - (Number(this.form.logistics_surcharge) + Number(this.form.registration_fee) + Number(this.form.other_fixed_fee) + Number(this.form.weight)*Number(this.form.other_dynamic_fee) + Number(this.form.platform_discount_profit)) - freight).toFixed(3);
                            this.form.total_price_CN = (this.form.total_price_OT * this.form.exchange_rate).toFixed(3);
                        } else {
                            this.form.purchase_price = (this.form.total_price_CN * (1-(Number(this.form.gross_profit)+Number(this.form.platform_profit)+Number(this.form.platform_discount_profit)+Number(this.form.paypal_procedure_big_profit))/100) - (Number(this.form.logistics_surcharge) + Number(this.form.registration_fee) + Number(this.form.other_fixed_fee) + Number(this.form.weight)*Number(this.form.other_dynamic_fee) + Number(this.form.platform_discount_profit)) - freight).toFixed(3);
                            this.form.total_price_OT = (this.form.total_price_CN / this.form.exchange_rate).toFixed(3);
                        }
                    } else if(this.platformInformation.platform === 3 || this.platformInformation.platform === 4){
                        if(this.form.total_price_CN === ''){
                            this.form.purchase_price = (this.form.total_price_OT * this.form.exchange_rate * (1-(Number(this.form.gross_profit)+Number(this.form.platform_profit)+Number(this.form.platform_discount_profit))/100) - (Number(this.form.logistics_surcharge) + Number(this.form.registration_fee) + Number(this.form.other_fixed_fee) + Number(this.form.weight)*Number(this.form.other_dynamic_fee)) - freight).toFixed(3);
                            this.form.total_price_CN = (this.form.total_price_OT * this.form.exchange_rate).toFixed(3);
                        } else {
                            this.form.purchase_price = (this.form.total_price_CN * (1-(Number(this.form.gross_profit)+Number(this.form.platform_profit)+Number(this.form.platform_discount_profit))/100) - (Number(this.form.logistics_surcharge) + Number(this.form.registration_fee) + Number(this.form.other_fixed_fee) + Number(this.form.weight)*Number(this.form.other_dynamic_fee)) - freight).toFixed(3);
                            this.form.total_price_OT = (this.form.total_price_CN / this.form.exchange_rate).toFixed(3);
                        }
                    }
                }
            },
            //运费试算
            freight_trial(){
                this.$open('/shipping-method/trial');
            },
            //根据币种获取汇率
            change_dictionary(){
                this.currency_list.find(row=>{
                    if(this.form.currency === row.code){
                        this.form.exchange_rate = Number(row.system_rate).toFixed(3);
                    }
                })
            }
        },
        computed: {},
        watch: {
            value(val){
                this.show = val;

                if(val){

                }
            },
            show(val){
                this.$emit('input', val);
            },
        },
        props: {
            value:{},
            platformInformation:{}
        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default,
        },
    }
</script>
