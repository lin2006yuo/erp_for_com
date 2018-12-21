<template>
    <el-row class="c-proceeds">
        <rainbow-header title="收款选项" background-color="#541B86">
            <div class="fr mt-mini mr-sm" slot="header-right">
                <el-select class="inline width-lg"
                           :disabled="receivablesList.length<=0"
                           :value="form.list.mod_receivables"
                           @input="(val)=>{change_proceeds(val)}"
                           filterable clearable
                           :placeholder="placeHolder">
                    <el-option
                            v-for="res in receivablesList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
                <el-button class="inline" type="primary" size="mini" @click.native="save_as">另存为</el-button>
            </div>
            <el-form :model="form" label-width="220px">
                <el-form-item label="Paypal 收款帐号：" required>
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-select v-model="form.list.paypal_emailaddress" filterable clearable>
                                <el-option
                                        v-for="item in paypalAll.list"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="收款方式：" required>
                    <el-checkbox-group v-model="form.set.payment_method">
                        <el-checkbox v-for="item in payMethodList" :label="item.value" :key="item.value">
                            {{item.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="立即付款：">
                    <el-checkbox v-model="form.list.autopay">要求买家立即付款</el-checkbox>
                    <span>（请确认您的Paypal帐号为商业帐号,刊登是一口价或带一口价的拍卖。同时请上官网查阅该类目是否支持立即付款）</span>
                </el-form-item>
                <el-form-item label="付款说明：">
                    <el-row>
                        <el-col :span="largeSpan">
                            <el-input type="textarea" v-model="form.set.payment_instructions"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </rainbow-header>
        <save-as v-model="dialog" @submit="submit"></save-as>
    </el-row>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {
        api_get_paypals,
        api_common_modeList,
        api_save_common_model,
        api_edit_model
    } from '../../../../../api/ebay-kandeng-public-module';
    import {change_proceeds} from './batch_methods'

    export default {
        data() {
            return {
                dialog: false,
                payMethodList: [
                    {label: "PayPal", value: "PayPal"},
                    {label: "Visa or MasterCard", value: "VisaMC"},
                ],

                paypalAll: {
                    list: [],

                },
                /*获取收款项模板*/
                receivablesList: []
            }
        },
        mounted() {
            this.get_paypal();
            this.get_receivablesList();
        },
        computed: {
            placeHolder() {
                if (this.form.list.site === "") {
                    return "请先选择站点";
                } else if (this.form.list.site !== "" && this.receivablesList.length <= 0) {
                    return "暂无数据"
                } else {
                    return "选择已有模板";
                }

            },
            surplusCom() {
                return Number(23 - this.commonSpan);
            },
            surplusLar() {
                return Number(23 - this.largeSpan);
            },
            curSite() {
                let curObj = {};
                if (this.siteList && this.siteList.length > 0) {
                    let cur = this.siteList.find(row => row.siteid === this.form.list.site);
                    if (!!cur) curObj = cur;
                }
                return curObj
            },
        },
        methods: {
            change_proceeds,
            /*选择已有模板*/
//            change_proceeds(val){
//                this.form.list.mod_receivables = val;
//                let params = {
//                    model_type:"receivables",
//                    id:val,
//                }
//                this.$http(api_edit_model,params).then(res=>{
//                    this.form.set.payment_method = JSON.parse(res.data.pay_method);
//                    this.form.list.autopay = res.data.auto_pay===1?true:false;
//                    this.form.set.payment_instructions = res.data.payment_instructions;
//                }).catch(code=>{
//                    console.log(code);
//                })
//            },
            /*另存为*/
            save_as() {
                this.dialog = true;
            },
            submit(val) {
                if (this.form.list.site === "" || !val) return this.$message({
                    type: "warning",
                    message: "站点及另存模板名称为必填项"
                });
                let detail = [];
                let model_type = "receivables";
                let obj = {
                    model_type: model_type,
                    model_name: val,
                    site: this.form.list.site,
                    payment_method: this.form.set.payment_method,
                    auto_pay: this.form.list.autopay ? 1 : 0,
                    payment_instructions: this.form.set.payment_instructions
                }
                detail.push(obj);
                let params = {
                    model_type: model_type,
                };
                params.detail = JSON.stringify(detail);
                this.$http(api_save_common_model, params).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message || res
                    })
                    this.dialog = false;
                    this.get_receivablesList();
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })

            },
            /*获取收款项模板*/
            get_receivablesList() {
                if (!this.form.list || this.form.list.site === '') return;
                this.receivablesList = [];
                let params = {
                    model_type: "receivables",
                    site: this.form.list.site
                };
                this.$http(api_common_modeList, params).then(res => {
                    this.receivablesList = res.data.map(row => {
                        return {
                            label: row.model_name,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            /*获取paypal账号*/
            get_paypal() {
                this.$http(api_get_paypals, {account_id: this.form.list.account_id}).then(res => {
                    this.paypalAll.list = [];
                    if (res.data) {
                        let max_paypal, min_paypal;
                        if (res.data.max_paypals instanceof Array && res.data.max_paypals.length > 0) {
                            res.data.max_paypals.map(row => {
                                let obj = {
                                    value: row.account_name,
                                    name: 'max',
                                    label: row.account_name
                                }
                                if (!this.paypalAll.list.find(it => it.value === obj.value)) {
                                    this.paypalAll.list.push(obj);
                                }
                            });
                        } else {
                            console.log("max_paypals 数据不存在");
                        }
                        if (res.data.min_paypals instanceof Array && res.data.min_paypals.length > 0) {
                            res.data.min_paypals.map(row => {
                                let obj = {
                                    label: `(小额)${row.account_name}`,
                                    name: 'min',
                                    value: row.account_name
                                }
                                if (!this.paypalAll.list.find(it => it.value === obj.value)) {
                                    this.paypalAll.list.push(obj);
                                }
                            });
                        } else {
                            console.log("min_paypals 数据不存在");
                        }
                        this.paypalAll.currency = res.data.currency;
                        if (this.curPage === 'notYet') {
                            console.log('notYet');
                            this.blur_default_payid();
                        }
                    } else {
                        this.$message({type: "warning", message: "paypal账号数据不存在，请检查配置"})
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
            /*获取默认值paypal账号*/
            blur_default_payid() {
                /*
                * 1.拍卖 (listing_type=2) 拍卖底价(start_price)&&当前币种，进行筛选,
                * 2.一口价 (listing_type=1)
                *       A.单属性(variation=0) 一口价(start_price)&&当前币种，筛选
                *       B.多属性(variation=1) 找出sku列表中最高销售价&&币种，筛选
                * */
                let lessPrice = 0;
                let find = Object.keys(this.paypalAll.currency).findIndex((row, index) => {
                    return row === '';
                });
                if (this.paypalAll.currency instanceof Array || find > -1){
                    console.log('currency 数据不存在');
                    return;
                }
                Object.keys(this.paypalAll.currency).forEach(row => {
                    if (row === this.curSite.currency) {
                        let curPrice = this.paypalAll.currency[row];
                        lessPrice = curPrice ? parseFloat(curPrice) : 0;
                    }
                });
                if(this.paypalAll.list.length===1){//Paypal数组长度为1时，直接给默认值
                    this.form.list.paypal_emailaddress = this.paypalAll.list[0].value
                }else if(this.paypalAll.list.length>1){
                    if (this.form.list.listing_type === 2 || !this.form.list.variation) {
                        let start_price = this.form.list.start_price !== '' ? parseFloat(this.form.list.start_price) : 0;
                        this.get_default_payid(start_price, lessPrice);
                    } else {
                        let numberList = this.form.varians.map(it => it.v_price).filter(it => it !== '');
                        let maxPrice = Math.max(...numberList);
                        this.get_default_payid(maxPrice, lessPrice);
                    }
                }

            },
            get_default_payid(newPrice, lessPrice) {
                if (parseFloat(newPrice) < parseFloat(lessPrice)) {
                    let find = this.paypalAll.list.find(it => it.name === 'min');
                    if (find) this.form.list.paypal_emailaddress = find.value;
                } else {
                    let find = this.paypalAll.list.find(it => it.name === 'max');
                    if (find) this.form.list.paypal_emailaddress = find.value;
                }
            },
        },
        props: {
            curPage: {//判断当前模块
                type: String,
            },
            form: {},
            commonSpan: {
                require: true,
                type: Number
            },
            largeSpan: {
                require: true,
                type: Number
            },
            siteList: {
                require: true,
                type: Array
            }
        },
        components: {
            saveAs: require("./save-as.vue").default,
            rainbowHeader:require('@/components/rainbow-header.vue').default,
        }
    }
</script>