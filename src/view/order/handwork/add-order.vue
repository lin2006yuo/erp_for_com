<template>
    <div class="c-add-order">
        <page-dialog title="添加手工订单" v-model="dialog" @open="open" size="large" :close-on-click-modal="false">
            <div>
                <label class="inline t-right bold-font" style="width:50px">订单号：</label>
                <el-input class="inline" :disabled="true" v-model="form.number"></el-input>
                <div class="mt-xs mb-sm bold-font">
                    <label-select
                        class="inline"
                        :show-required="true"
                        fontWeight="bold"
                        label="渠道："
                        label-width="50"
                        v-model="form.channel_id"
                        :lists="channelList"
                        @change="change_channel"
                        placeholder="请选择渠道"
                        :clearable="true"
                        :filterable="true"
                    ></label-select>
                    <label-select
                        class="inline ml-sm"
                        fontWeight="bold"
                        label="站点："
                        v-show="siteList.length>0"
                        v-model="form.site_code"
                        :lists="siteList"
                        @change="change_site"
                        placeholder="请选择站点"
                        :clearable="true"
                        :filterable="true"
                    ></label-select>
                    <label-select
                        class="inline ml-sm"
                        fontWeight="bold"
                        label="账号："
                        v-show="accountList.length>0"
                        v-model="form.channel_account_id"
                        :lists="accountList"
                        @change="change_account"
                        placeholder="请选择账号"
                        :clearable="true"
                        :filterable="true"
                    ></label-select>
                    <label-select
                        v-if="form.channel_id===7"
                        class="inline ml-sm"
                        fontWeight="bold"
                        label="店铺："
                        v-model="joom_shop_id"
                        :lists="joomShopList"
                        :placeholder="joomShopListPlace"
                        :clearable="true"
                        :filterable="true"
                    ></label-select>
                    <div class="mt-xs" v-if="form.channel_account_id !== ''">
                        <label class="inline">平台订单号：</label>
                        <el-input class="inline" @keydown.native.enter="get_order_info" placeholder="请输入平台订单号" v-model="form.channel_order_number"></el-input>
                        <request-button v-if="form.channel_order_number&&!!form.channel_order_number.trim()" class="inline ml-sm" @click.native="get_order_info" req-key="get-order-info" :mintime="300">获取订单信息</request-button>
                    </div>
                </div>
                <tab-items label="付款信息">
                    <payment-message :form="form" ref="payment" @change-currency="change_currency"></payment-message>
                </tab-items>
                <tab-items label="订单商品">
                    <order-goods :data-list="form.goods"
                                 @add-new-goods="add_new_goods"
                                 :cur-currency="curCurrency"></order-goods>
                </tab-items>
                <tab-items label="买家信息">
                    <buyer-message :form="form" ref="buyer" ></buyer-message>
                </tab-items>
                <tab-items label="收货地址">
                    <el-form :model="form" ref="form" label-width="120px" :rules="rules">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="Buyer Full Name" prop="consignee">
                                    <el-input class="ml-sm" v-model="form.consignee"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="Street1" prop="address">
                                    <el-input class="ml-sm" v-model="form.address"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="Street2">
                                    <el-input class="ml-sm" v-model="form.address2"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="City" prop="city">
                                    <el-input class="ml-sm" v-model="form.city"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="State/Province" prop="province">
                                    <el-input class="ml-sm" v-model="form.province"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="Phone Numbe1" prop="tel">
                                    <el-input class="ml-sm" v-model="form.tel"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="Phone Numbe2">
                                    <el-input class="ml-sm" v-model="form.mobile"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="Zip/Postal Code ">
                                    <el-input class="ml-sm" v-model="form.zipcode"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="Country " prop="country_code">
                                    <el-select class="ml-sm" v-model="form.country_code" filterable clearable>
                                        <el-option v-for="item in countryList"
                                                   :key="item.value"
                                                   :value="item.value"
                                                   :label="item.label"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </tab-items>
                <tab-items label="仓库信息">
                    <warehouse-message :form="form" :show-required="true" @warehouse-change="warehouse_change"></warehouse-message>
                </tab-items>
                <tab-items label="物流信息">
                    <logistics-message :form="form" ref="logistics"></logistics-message>
                </tab-items>
                <tab-items label="订单备注">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入备注内容"
                        v-model="form.note">
                    </el-input>
                </tab-items>
            </div>
            <div slot="footer">
                <request-button req-key="click_native_save" @click="save">确定</request-button>
                <el-button size="mini" @click.native="undo">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {extraReg} from '../../../define/validator_reg'
    import {api_get_number,add_order,api_get_channel,api_get_account,api_get_country, api_get_manual_orders_buyer_message,api_get_order_joom_shops} from '../../../api/handwork';
    export default{
        data(){
            let checkTel  = (rule,value,callback)=>{
                return !extraReg.test(value)?callback(new Error("电话号码输入有误，请重新输入！")):callback()
            };
            return {
                curChannel:"",
                dialog:this.value,
                channelList:[],
                siteList:[],
                accountList:[],
                countryList:[],
                joomShopList:[],
                joom_shop_id:'',
                form:{
                    number:"",
                    channel_id:"",
                    site_code:"",
                    channel_account_id:"",
                    channel_order_number: "",
                    currency_code:"",
                    amount:"",
                    is_pay:"",
                    pay_name:"",
                    pay_code:"",
                    pay_link:"",
                    pay_note:"",
                    follow:"",
                    goods:[],
                    /*买家信息 b*/
                    buyer_id:"",
                    email:"",
                    /*买家信息 e*/
                    /*收货地址 b*/
                    consignee:"",
                    zipcode:"",
                    country_code:"",
                    tel:"",
                    province:"",
                    city:"",
                    address:"",
                    /*收货地址 e*/
                    /*仓库信息 b*/
                    warehouse_id:"",
                    /*仓库信息 e*/
                    /*运输方式 b*/
                    shipping_id:"",
                    estimated_fee:"",
                    /*运输方式 e*/
                    note:"",
                    mobile:'',
                    address2:''
                },
                rules: {
                    consignee: [
                        {required: true, message: "收件人不能为空", trigger: "blur"}
                    ],
                    address: [
                        {required: true, message: "详细地址不能为空", trigger: "blur"}
                    ],
                    city: [
                        {required: true, message: "城市不能为空", trigger: "blur"}
                    ],
                    province: [
                        {required: true, message: "省/州不能为空", trigger: "blur"}
                    ],
                    country_code: [
                        {required: true, message: "国家不能为空", trigger: "blur"}
                    ],
                    tel:[
                        {required: true, message: "电话不能为空", trigger: "blur"},
                        {validator: checkTel, trigger: "blur"}
                    ],
                }
            }
        },
        computed:{
            joomShopListPlace(){
                if (this.form.channel_account_id!=='') {
                    return '请选择店铺'
                }else{
                    return '请选择账号'
                }
            },

            showSite(){
                return this.curChannel === "ebay"||this.curChannel === "ymx";
            },
            showAccount(){
                return this.curChannel === "other"?false:true;
            },
            curCurrency(){
                return !!this.form.currency_code?this.form.currency_code:"CNY";
            },
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            },
        },
        methods:{
            open(){
                this.api_get_country();
                this.api_get_number();
                this.get_channel();
                this.siteList = [];
                this.accountList = [];
                this.form = {
                    number:"",
                    channel_id:"",
                    site_code:"",
                    channel_account_id:"",
                    currency_code:"",
                    amount:"",
                    is_pay:"",
                    pay_name:"",
                    pay_code:"",
                    pay_link:"",
                    pay_note:"",
                    follow:"",
                    goods:[],
                    /*买家信息 b*/
                    buyer_id:"",
                    email:"",
                    /*买家信息 e*/
                    /*收货地址 b*/
                    consignee:"",
                    zipcode:"",
                    country_code:"",
                    tel:"",
                    province:"",
                    city:"",
                    address:"",
                    /*收货地址 e*/
                    /*仓库信息 b*/
                    warehouse_id:"",
                    /*仓库信息 e*/
                    /*运输方式 b*/
                    shipping_id:"",
                    estimated_fee:"",
                    /*运输方式 e*/
                    note:"",
                };
            },
            warehouse_change(){
                this.form.estimated_fee ='';
                this.$refs.logistics.shipping_name = '';
            },
            get_order_info(){
                let data = {
                    channel_id:this.form.channel_id,
                    site_code:this.form.site_code,
                    account_id:this.form.channel_account_id,
                    channel_order_number:this.form.channel_order_number
                };
                this.$http(api_get_manual_orders_buyer_message,data).then(res=>{
                    Object.assign(this.form,res.data);
                    this.$message({type:'success',message:res.message||res});
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('get-order-info',false);
                    },200);
                })
            },
            save(){
                    if(this.channelList.length>0&&!this.form.channel_id){
                        this.$reqKey('click_native_save',false);
                        return this.$message({type:"warning",message:"渠道为必选项，请补充完整！"});
                    }
                    if(this.siteList.length>0 && !this.form.site_code) {
                        this.$reqKey('click_native_save',false);
                        return this.$message({message:"站点为必选项，请补充完整！", type:'warning'});
                    }
                    if(this.accountList.length>0 && !this.form.channel_account_id) {
                        this.$reqKey('click_native_save',false);
                        return this.$message({message:"账号为必选项，请补充完整！", type:'warning'});
                    }
                    if(this.form.channel_id===7){
                        if(this.joomShopList.length>0 && !this.joom_shop_id) {
                            this.$reqKey('click_native_save',false);
                            return this.$message({message:"店铺为必选项，请补充完整！", type:'warning'});
                        }
                    }
                    this.submit();
            },
            submit(){
                let l = this.$refs.logistics.submit();
                let b = this.$refs.payment.submit();
                let buyer = this.$refs.buyer.submit();
                this.$refs.form.validate((bool)=>{
                    if(bool&&b&&buyer&&l){
                        if(this.form.goods.find(row=>row.sku_quantity==='0'||row.sku_quantity==="")) {
                            this.$reqKey('click_native_save',false);
                            return this.$message({message:"订单商品选择数据后，数量为必填项", type:'warning'});
                        }
                        if(this.form.goods.find(row=>row.sku_price<=0)){
                            this.$reqKey('click_native_save',false);
                            return this.$message({message:"商品单价不允许小于或等于0，请更正！",type:'warning'});
                        }
                        let data=window.clone(this.form);
                        if (this.form.channel_id===7) {
                            data.channel_account_id=this.joom_shop_id;
                        }
                        this.$http(add_order,data).then(res=>{
                            this.$emit("save");
                            this.$message({
                                type: 'success',
                                message: '添加成功'
                            });
                            this.dialog = false;
                        }).catch(code=>{
                            this.dialog = true;
                            this.$message({message:code.message||code,type:'error'});
                        }).finally(()=>{
                            setTimeout(()=>{
                                this.$reqKey('click_native_save',false);
                            },200);
                        });
                    }else{
                        this.$reqKey('click_native_save',false);
                    }
                })
            },
            undo(){
                this.dialog = false;
            },
            /*更改渠道*/
            change_channel(val){
                this.curChannel = val;
                this.get_site(val);
                this.form.site_code = "";
                this.form.channel_account_id="";
            },
            /*更改站点*/
            change_site(val){
                if(!val) return;
                this.form.channel_account_id="";
                this.get_account(this.curChannel,val);
            },
            /*更改账号*/
            change_account(val){
                if (this.form.channel_id===7) {
                    this.joom_shop_id='';
                    this.joomShopList=[];
                    let data={
                        account_id:val
                    };
                    this.$http(api_get_order_joom_shops,data).then(res=>{
                        let list=Object.values(res);
                        this.joomShopList=list.map(row=>{
                            return {label:row.code,value:row.id}
                        })
                    }).catch(code=>{
                        console.log(code);
                    })
                }
            },
            /*更改币种*/
            change_currency(){
                if(this.form.goods&&this.form.goods.length>0){
                    this.form.goods.forEach(row=>{
                        row.sku_price = 0
                    })
                }
            },
//            添加 订单商品
            add_new_goods(val){
                val.forEach((data)=>{
                    if(this.form.goods.find(row=>{return row.sku_id===data.id})) return this.$message({message:"请不要重复添加商品", type:'warning'});
                    let i = !!data.cost_price?parseFloat(data.cost_price).toFixed(2):0;
                    this.form.goods.push({
                        spu_name:data.spu_name,
                        goods_id:data.goods_id,
                        sku_id:data.id,
                        sku_price:i,
                        sku_quantity:1,
                    })
                });
            },
//            获取订单号
            api_get_number(){
                this.$http(api_get_number).then(res=>{
                    this.form.number = res.number;
                }).catch(code=>{
                    console.log(code);
                })
            },
//          获取渠道
            get_channel(){
                this.$http(api_get_channel).then(res=>{
                    this.channelList = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
//            获取站点
            get_site(val){
                this.accountList = [];
                this.siteList = [];
                this.$http(api_get_account,{channel_id:val}).then(res=>{
                    if(res.site.length<=0){
                        this.accountList = res.account;
                    }else{
                        this.siteList = res.site;
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
//            获取账号
            get_account(channel,site){
                this.$http(api_get_account,{channel_id:channel,site_code:site}).then(res=>{
                    this.accountList = res.account;
                }).catch(code=>{
                    console.log(code);
                })
            },
//            获取国家
            api_get_country(){
                this.$http(api_get_country).then(res=>{
                    return this.countryList=(res.map(row=>{
                        return {label:row.country_en_name,value:row.country_code}
                    }))
                }).catch(code=>{
                    console.log(code);
                })
            }
        },
        props:{
            value:{},
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            tabItems:require('../../../components/tab-items.vue').default,
            labelSelect:require('../../../components/label-select.vue').default,
            paymentMessage:require('./payment-message.vue').default,
            orderGoods:require('./order-goods.vue').default,
            buyerMessage:require('./buyer-message.vue').default,
//            addressMessage:require('./address-message'),
            warehouseMessage:require('./warehouse-message').default,
            logisticsMessage:require('./logistics-message').default
        }
    }
</script>
