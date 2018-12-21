<template>
    <el-row class="c-title-price">
        <!--拍卖    Chinese-->
        <div v-if="whichPage===0">
            <rainbow-header title="标题与价格（拍卖）" backgroundColor="#F18700">
                <el-form :model="form" label-width="220px" ref="form" :rules="rules">
                        <el-form-item label="本地SKU：" required>
                            <el-row :gutter="8">
                                <el-col :span="commonSpan">
                                    <el-input v-model="form.list.local_sku" :disabled="!!form.list.assoc_order"></el-input>
                                </el-col>
                                <el-col :span="surplusCom">
                                    <el-button type="primary" size="mini" @click.native="select_product">选择产品</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="捆绑/打包销售：" required>
                            <el-row :gutter="8">
                                <el-col :span="commonSpan">
                                    <el-input v-model="form.list.sku" disabled></el-input>
                                </el-col>
                                <el-col :span="surplusCom">
                                    <el-button type="primary" size="mini" @click.native="bundling_sales">添加产品</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="订单商品关联：" required>
                            <el-row :gutter="8">
                                <el-radio class="radio" v-model="form.list.assoc_order" :label="1">自动关联订单商品</el-radio>
                                <el-radio class="radio" v-model="form.list.assoc_order" :label="0">不关联订单商品(将转为商品未知订单)</el-radio>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="刊登标题：" prop="list.title" required>
                            <el-row :gutter="8">
                                <el-col :span="largeSpan">
                                    <limit-input
                                            v-model="form.list.title"
                                            :is-textarea="false"
                                            :maxlength="80"
                                            :cur-span="23"
                                    ></limit-input>
                                </el-col>
                                <el-col :span="surplusLar">
                                    <el-button class="ml-sm" type="primary" @click.native="initial_uppercase" size="mini">首字母大写</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="刊登副标题($)：" prop="list.sub_title">
                            <el-row :gutter="8">
                                <el-col :span="largeSpan">
                                    <limit-input
                                            v-model="form.list.sub_title"
                                            :is-textarea="false"
                                            :maxlength="55"
                                            :cur-span="23"
                                    ></limit-input>
                                </el-col>
                                <el-col :span="surplusLar">
                                    <a class="link ml-sm" href="http://pages.ebay.com/help/sell/fees.html" target="_blank">查看Ebay费用</a>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="数量：" required>
                            <el-row>
                                <el-col :span="smallSpan">
                                    <input  class="inline el-input__inner disable"
                                            v-model="form.list.quantity"
                                            :disabled="true"
                                            type="number" min="0"
                                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                                            onafterpaste="this.value=this.value.replace(/\D/g,'')" >
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="上架时间：" required>
                            <el-row>
                                <el-col :span="commonSpan">
                                    <el-select v-model="form.list.listing_duration"
                                               ref="listingduration"
                                               v-mouse-side.mousewheel="()=>{$refs.listingduration.visible=false}"
                                               filterable clearable>
                                        <el-option
                                                v-for="item in timeList2"
                                                :label="item.label"
                                                :value="item.value"
                                                :key="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="拍卖底价 (≥0.01)：" required>
                            <el-row>
                                <el-col :span="smallSpan">
                                    <ui-limit-number
                                            @blur="blur_price"
                                            v-model="form.list.start_price"
                                            :limit="2"></ui-limit-number>
                                </el-col>
                                <el-col :span="1">
                                    <span class="ml-sm">{{curSite.currency}}</span>
                                </el-col>
                                <el-col :span="smallSpan">
                                    <label v-if="showRef" class="ml-lg">参考定价：<span class="red">{{comRef}}</span></label>
                                </el-col>
                                <el-col :span="2" class="t-right">
                                    <span>保底拍卖价：</span>
                                </el-col>
                                <el-col :span="smallSpan">
                                    <ui-limit-number
                                            v-model="form.list.reserve_price"
                                            :limit="2"></ui-limit-number>
                                </el-col>
                                <el-col :span="2">
                                    <span class="ml-sm">{{curSite.currency}}</span>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="一口价 (≥0.01)：">
                            <el-row :gutter="8">
                                <el-col :span="smallSpan">
                                    <ui-limit-number
                                            v-model="form.list.buy_it_nowprice"
                                            :limit="2"></ui-limit-number>
                                </el-col>
                                <el-col :span="surplusSma">
                                    <span>{{curSite.currency}}</span>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="VAT税率：">
                            <el-row :gutter="8">
                                <el-col :span="smallSpan">
                                    <ui-limit-number
                                            v-model="form.list.vat_percent"
                                            :limit="2"></ui-limit-number>
                                </el-col>
                                <el-col :span="surplusSma">
                                    <span class="inline mr-xs">%</span>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="私人物品(Private Listing)：">
                            <el-radio  v-model="form.list.private_listing" class="ml-lg" :label="0">不使用</el-radio>
                            <el-radio  v-model="form.list.private_listing" :label="1">使用</el-radio>
                            <span>（注意：该功能会使其他买家不能看到您刊登的被购买记录。）</span>
                        </el-form-item>
                        <el-form-item label="促销折扣设置：" v-if="!isEdit">
                            <el-row :gutter="8">
                                <el-col :span="commonSpan">
                                    <el-select v-model="form.list.promotion_id"
                                               ref="promotionid"
                                               v-mouse-side.mousewheel="()=>{$refs.promotionid.visible=false}"
                                               filterable clearable>
                                        <el-option
                                                v-for="item in promotionList"
                                                :label="item.label"
                                                :value="item.value"
                                                :key="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="surplusCom">
                                    <el-button type="primary" size="mini" @click.native="add_sales">添加</el-button>
                                    <span class="inline">（请确认您的eBay账号开通了商店，否则无法使用折扣。）</span>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
            </rainbow-header>
        </div>
        <!--一口价 多属性   FixedPriceItem-->
        <div v-if="whichPage===1">
            <rainbow-header title="标题与价格（一口价 多属性）" backgroundColor="#F18700">
                <el-form :model="form" label-width="220px" ref="form" :rules="rules">
                    <el-form-item label="刊登标题："  prop="list.title" required>
                        <el-row :gutter="8">
                            <el-col :span="largeSpan">
                                <limit-input
                                        v-model="form.list.title"
                                        :is-textarea="false"
                                        :maxlength="80"
                                        :cur-span="23"
                                ></limit-input>
                            </el-col>
                            <el-col :span="surplusLar">
                                <el-button class="ml-sm" type="primary"
                                           @click.native="initial_uppercase" size="mini">首字母大写</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="刊登副标题（$）：" prop="list.sub_title">
                        <el-row :gutter="8">
                            <el-col :span="largeSpan">
                                <limit-input
                                        v-model="form.list.sub_title"
                                        :is-textarea="false"
                                        :maxlength="55"
                                        :cur-span="23"
                                ></limit-input>
                            </el-col>
                            <el-col :span="surplusLar">
                                <a class="link ml-sm" href="http://pages.ebay.com/help/sell/fees.html" target="_blank">查看Ebay费用</a>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="数量：" required>
                        <el-row>
                            <el-col :span="smallSpan">
                                <input class="inline el-input__inner" v-model="form.list.quantity" type="number" min="0" onkeyup="this.value=this.value.replace(/\D/g,'')"onafterpaste="this.value=this.value.replace(/\D/g,'')" ></input>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="上架时间：" required>
                        <el-row>
                            <el-col :span="commonSpan">
                                <el-select v-model="form.list.listing_duration"
                                           ref="duration"
                                           v-mouse-side.mousewheel="()=>{$refs.duration.visible=false}"
                                           filterable clearable>
                                    <el-option
                                            v-for="item in timeList1"
                                            :label="item.label"
                                            :value="item.value"
                                            :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="一口价（≥0.99）：">
                        <el-row :gutter="8">
                            <el-col :span="smallSpan">
                                <ui-limit-number
                                        @blur="blur_price"
                                        v-model="form.list.start_price"
                                        :limit="2"></ui-limit-number>
                            </el-col>
                            <el-col :span="surplusSma">
                                <span class="inline mr-xs">{{curSite.currency}}&nbsp;(多属性Listing可不填写)</span>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="VAT税率：">
                        <el-row :gutter="8">
                            <el-col :span="smallSpan">
                                <ui-limit-number
                                        v-model="form.list.vat_percent"
                                        :limit="2"></ui-limit-number>
                            </el-col>
                            <el-col :span="surplusSma">
                                <span>%</span>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="接受买家还价(Best Offer)：" required>
                        <el-radio-group v-model="form.list.best_offer" @change="change_best_offer">
                            <el-radio class="inline"  :label="0">关闭</el-radio>
                            <el-radio class="inline ml-lg" :label="1">开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox-group>
                            <el-row class="mb-mini">
                                <el-col :span="2"  class="t-right">
                                    <span>自动交易价格&nbsp;≥：</span>
                                </el-col>
                                <el-col :span="smallSpan">
                                    <ui-limit-number
                                            :disabled="!form.list.best_offer"
                                            v-model="form.set.auto_accept_price"
                                            :limit="2"></ui-limit-number>
                                </el-col>
                                <el-col :span="2">
                                    <span class="inline mr-xs">{{curSite.currency}}</span>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="2"  class="t-right">
                                    <span>自动拒绝价格&nbsp;≤：</span>
                                </el-col>
                                <el-col :span="smallSpan">
                                    <ui-limit-number
                                            :disabled="!form.list.best_offer"
                                            v-model="form.set.minimum_accept_price"
                                            :limit="2"></ui-limit-number>
                                </el-col>
                                <el-col :span="2">
                                    <span class="inline mr-xs">{{curSite.currency}}</span>
                                </el-col>
                            </el-row>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="私人物品(Private Listing)：">
                        <el-radio v-model="form.list.private_listing" :label="0">不使用</el-radio>
                        <el-radio v-model="form.list.private_listing" :label="1">使用</el-radio>
                        <span>（注意：该功能会使其他买家不能看到您刊登的被购买记录。）</span>
                    </el-form-item>
                    <el-form-item label="促销折扣设置：" v-if="!isEdit">
                        <el-row :gutter="8">
                            <el-col :span="commonSpan">
                                <el-select v-model="form.list.promotion_id"
                                           ref="promotion"
                                           v-mouse-side.mousewheel="()=>{$refs.promotion.visible=false}"
                                           filterable clearable>
                                    <el-option
                                            v-for="item in promotionList"
                                            :label="item.label"
                                            :value="item.value"
                                            :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="surplusCom">
                                <span class="inline">（请确认您的eBay账号开通了商店，否则无法使用折扣。）</span>
                            </el-col>
                        </el-row>

                    </el-form-item>
                </el-form>
            </rainbow-header>
        </div>
        <!--一口价 单属性-->
        <div v-if="whichPage===2">
            <rainbow-header title="标题与价格（一口价 单属性）" backgroundColor="#F18700">
                <el-form :model="form" label-width="220px" ref="form" :rules="rules">
                    <el-form-item label="本地SKU：" required>
                        <el-row :gutter="8">
                            <el-col :span="commonSpan">
                                <el-input v-model="form.list.local_sku" :disabled="!!form.list.assoc_order"></el-input>
                            </el-col>
                            <el-col :span="surplusCom">
                                <el-button type="primary" size="mini" @click.native="select_product">选择产品</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="平台SKU：">
                        <el-row :gutter="8">
                            <el-col :span="commonSpan">
                                <el-input v-model="form.list.listing_sku" :disabled="!!form.list.assoc_order"></el-input>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="捆绑/打包销售：" required>
                        <el-row :gutter="8">
                            <el-col :span="commonSpan">
                                <el-input v-model="form.list.sku" :disabled="true"></el-input>
                            </el-col>
                            <el-col :span="surplusCom">
                                <el-button type="primary" size="mini" @click.native="bundling_sales">添加产品</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="订单商品关联：" required>
                        <el-row :gutter="8">
                            <el-radio class="radio" v-model="form.list.assoc_order" :label="1">自动关联订单商品</el-radio>
                            <el-radio class="radio" v-model="form.list.assoc_order" :label="0">不关联订单商品(将转为商品未知订单)</el-radio>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="刊登标题：" prop="list.title" required>
                        <el-row :gutter="8">
                            <el-col :span="largeSpan">
                                <limit-input
                                        v-model="form.list.title"
                                        :is-textarea="false"
                                        :maxlength="80"
                                        :cur-span="23"
                                ></limit-input>
                            </el-col>
                            <el-col :span="surplusLar">
                                <el-button class="ml-sm" type="primary" @click.native="initial_uppercase" size="mini">首字母大写</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="刊登副标题($)：" prop="list.sub_title">
                        <el-row :gutter="8">
                            <el-col :span="largeSpan">
                                <limit-input
                                        v-model="form.list.sub_title"
                                        :is-textarea="false"
                                        :maxlength="55"
                                        :cur-span="23"
                                ></limit-input>
                            </el-col>
                            <el-col :span="surplusLar">
                                <a class="link ml-sm" href="http://pages.ebay.com/help/sell/fees.html" target="_blank">查看Ebay费用</a>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="数量：" required>
                        <el-row>
                            <el-col :span="smallSpan">
                                <input  class="inline el-input__inner"
                                        v-model="form.list.quantity"
                                        type="number" min="0"
                                        onkeyup="this.value=this.value.replace(/\D/g,'')"
                                        onafterpaste="this.value=this.value.replace(/\D/g,'')" >
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="上架时间：" required>
                        <el-row>
                            <el-col :span="commonSpan">
                                <el-select v-model="form.list.listing_duration"
                                           ref="listingduration"
                                           v-mouse-side.mousewheel="()=>{$refs.listingduration.visible=false}"
                                           filterable clearable>
                                    <el-option
                                            v-for="item in timeList1"
                                            :label="item.label"
                                            :value="item.value"
                                            :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="一口价 (≥0.99)：" required>
                        <el-row :gutter="8">
                            <el-col :span="smallSpan">
                                <ui-limit-number
                                        @blur="blur_price"
                                        v-model="form.list.start_price"
                                        :limit="2"></ui-limit-number>
                            </el-col>
                            <el-col :span="surplusSma">
                                <span>{{curSite.currency}}</span>
                                <label v-if="showRef" class="ml-lg">参考定价：<span class="red">{{comRef}}</span></label>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="VAT税率：">
                        <el-row :gutter="8">
                            <el-col :span="smallSpan">
                                <ui-limit-number
                                        v-model="form.list.vat_percent"
                                        :limit="2"></ui-limit-number>
                            </el-col>
                            <el-col :span="surplusSma">
                                <span class="inline mr-xs">%</span>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="接受买家还价(Best Offer)：" required>
                        <el-radio-group v-model="form.list.best_offer" @change="change_best_offer">
                            <el-radio class="inline"  :label="0">关闭</el-radio>
                            <el-radio class="inline ml-lg" :label="1">开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox-group>
                            <el-row class="mb-mini">
                                <el-col :span="2"  class="t-right">
                                    <span>自动交易价格&nbsp;≥：</span>
                                </el-col>
                                <el-col :span="smallSpan">
                                    <ui-limit-number
                                            :disabled="!form.list.best_offer"
                                            v-model="form.set.auto_accept_price"
                                            :limit="2"></ui-limit-number>
                                </el-col>
                                <el-col :span="2">
                                    <span class="inline mr-xs">{{curSite.currency}}</span>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="2"  class="t-right">
                                    <span>自动拒绝价格&nbsp;≤：</span>
                                </el-col>
                                <el-col :span="smallSpan">
                                    <ui-limit-number
                                            :disabled="!form.list.best_offer"
                                            v-model="form.set.minimum_accept_price"
                                            :limit="2"></ui-limit-number>
                                </el-col>
                                <el-col :span="2">
                                    <span class="inline mr-xs">{{curSite.currency}}</span>
                                </el-col>
                            </el-row>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="促销折扣设置：" v-if="!isEdit">
                        <el-row :gutter="8">
                            <el-col :span="commonSpan">
                                <el-select v-model="form.list.promotion_id"
                                           ref="promotionid"
                                           v-mouse-side.mousewheel="()=>{$refs.promotionid.visible=false}"
                                           filterable clearable>
                                    <el-option
                                            v-for="item in promotionList"
                                            :label="item.label"
                                            :value="item.value"
                                            :key="item.value"
                                    ></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="surplusCom">
                                <el-button type="primary" size="mini" @click.native="add_sales">添加</el-button>
                                <span class="inline">（请确认您的eBay账号开通了商店，否则无法使用折扣。）</span>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </rainbow-header>
        </div>
        <!--添加促销-->
        <add-promotion-rule
                title="新增促销设置"
                :form="promotionForm"
                v-model="promotionDialog"
                :account-list="comAccountList"
                :read-only="true"
                @save="save"
        ></add-promotion-rule>
        <!--选择产品-->
        <add-product
                :search-param="formSpu"
                @submit="submit_product"
                v-model="productDialog"></add-product>
        <!--捆绑销售-->
        <bundling-sales v-model="bundlingDialog"
                        :data="bundlingData"
                        :is-fixed-price-item="false"
                        @submit="bundling_submit"></bundling-sales>
    </el-row>
</template>
<style lang="stylus" scoped>
</style>
<script>
import {api_get_promotionList,api_pricing_rules} from '../../../../../api/ebay-kandeng-public-module';
import {ref_price,caluc_reference_sale_price,get_reference} from './public-methods';
import {chinese} from '../../../../../define/validator_reg';
    export default{
        data(){
            let isEnglish = (rule,value,callback)=>{
                    if(value){
                        return chinese.test(value)?callback(new Error("请输入英文！")):callback();
                    }else {
                        callback();
                    }
            }
            return {
                reference:[],
                showRef:false,
                productDialog:false,
                promotionList:[],
                bundlingDialog:false,
                bundlingData:[],
                timeList1:[
                    {label:"3天",value:3},
                    {label:"5天",value:4},
                    {label:"7天",value:5},
                    {label:"10天",value:6},
                    {label:"30天(此选项仅用于店铺与部分平台)",value:7},
                    {label:"GTC(此选项仅用于店铺)",value:1},
                ],
                timeList2:[
                    {label:"1天",value:2},
                    {label:"3天",value:3},
                    {label:"5天",value:4},
                    {label:"7天",value:5},
                    {label:"10天",value:6},
                ],
                promotionDialog:false,
                /*促销设置*/
                promotionForm:{
                    model_name:"",
                    ebay_account:this.form.list.account_id,
                    start_date:"",
                    end_date:"",
                    promotion:true,
                    promotion_type:1,
                    promotion_discount:"",
                    promotion_cash:"",
                    promotion_trans:false,
                },
                titleNum:0,
                subTitleNum:0,
                rules:{
                    "list.title":[
                        {validator:isEnglish,trigger:"change,blur"}
                    ],
                    "list.sub_title":[
                        {validator:isEnglish,trigger:"change,blur"}
                    ],
                }
            }
        },
        created(){
            this.get_promotion();
        },
        filters:{
            filterReference(val){
                let ref = null;
                return "rrrrrr"
//                if(ref = this.get_reference(val)){
//                    return ref.total_price;
//                }else{
//                    return ''
//                }
            }
        },
        mounted(){
            if(this.form.list.sku_id){
                this.ref_price([this.form.list.sku_id]);
            }
        },
        computed:{
            comRef(){
                if(this.form.list.sku_id){
                    let ref = this.get_reference(this.form.list.sku_id);
                    return ref?ref.total_price:'';
                }
            },
            whichPage(){
                let cur = 0;
                if(this.form.list.listing_type===2){
                    cur = 0;
                }else if(this.form.list.listing_type===1&&this.form.list.variation===1){
                    cur = 1;
                }else if(this.form.list.listing_type===1&&this.form.list.variation===0){
                    cur = 2;
                }
                return cur;
            },
            surplusCom(){
                return Number(23-this.commonSpan);
            },
            surplusLar(){
                return Number(23-this.largeSpan);
            },
            surplusSma(){
                return Number(23-this.smallSpan);
            },
            comAccountList(){
                return this.accountList.map(row=>{
                    return {
                        label:row.code,
                        value:row.account_id,
                    }
                })
            },
            curSite(){
                let curObj = {};
                if(this.siteList&&this.siteList.length>0){
                    let cur = this.siteList.find(row=>row.siteid===this.form.list.site);
                    if(!!cur) curObj = cur;
                }
                return curObj
            },
        },
        methods:{
            ref_price,
            caluc_reference_sale_price,
            get_reference,
            blur_price(){
                if(this.form.list.start_price==='') return;
                this.$emit('blur-price');
            },
            select_product(){
                this.productDialog = true;
            },
            submit_product(val){
                this.form.list.sku = `${val.sku}*1`;
                this.form.list.local_sku = val.sku;
                this.$emit('submit-product',val);
            },
            bundling_sales(){
                let localSkuList = [];
                this.bundlingDialog = true;
                this.bundlingData = [];
                localSkuList = this.form.list.sku.split(',');
                localSkuList.forEach(row=>{
                    let cur = row.split("*");
                    let obj = {
                        local_sku:cur[0],
                        quantity:cur[1],
                    };
                    this.bundlingData.push(obj);
                });
            },
            bundling_submit(val){
                this.form.list.sku = val;
                this.bundlingDialog = false;
            },
            //首字母大写
            initial_uppercase(){
                if(!this.form.list.title) return this.$message({message:"请输入刊登标题", type:'warning'});
                let name= this.form.list.title.split(/\s+/);
                name= name.map(row=>{
                    row=this.up_first_letter(row);
                    return row;
                });
                this.form.list.title=name.join(' ');
            },
            up_first_letter(str){
                return str.substring(0,1).toUpperCase( ) + str.substring(1);
            },
            //添加促销
            add_sales(){
                this.promotionForm.model_name = "";
                this.promotionForm.ebay_account = this.form.list.account_id;
                this.promotionForm.start_date = "";
                this.promotionForm.end_date = "";
                this.promotionForm.promotion = true;
                this.promotionForm.promotion_type = 1;
                this.promotionForm.promotion_discount = "";
                this.promotionForm.promotion_cash = "";
                this.promotionForm.promotion_trans = false;
                this.promotionDialog = true;
            },
            //保存新添加的促销
            save(){
                /*重新请求列表 促销折扣数据*/
                this.get_promotion();
            },
            //是否可以议价
            change_best_offer(){

            },
            //促销折扣数据
            get_promotion(){
                this.$http(api_get_promotionList,{model_type:"promotion",ebay_account:this.accountId,status:1}).then(res=>{
                    this.promotionList = res.data.map(row=>{
                        return {
                            label:row.model_name,
                            value:row.id,
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        props:{
            formSpu:{},
            form:{},
            accountList:{
                required:true,
                type:Array
            },
            accountId:{
                require:true,
                type:Number
            },
            siteList:{
                required:true,
                type:Array
            },
            commonSpan:{
                require:true,
                type:Number
            },
            largeSpan:{
                require:true,
                type:Number
            },
            smallSpan:{
                require:true,
                type:Number
            },
            isEdit:{
                require:true,
                type:Boolean
            }
        },
        components: {
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default,
            addPromotionRule:require('../../promotion-set/add-promotion-rule.vue').default,
            limitInput:require('./limit-input.vue').default,
            addProduct:require('./add-product.vue').default,
            bundlingSales:require('./bundling-sales.vue').default,
            rainbowHeader:require('@/components/rainbow-header.vue').default,
        }
    }
</script>
