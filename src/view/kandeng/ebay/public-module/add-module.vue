<template>
    <div class="c-add-module">
        <page-dialog :title="title" v-model="dialog" @open="open"
                     size="large" :close-on-click-modal="false">
            <div class="mr-sm">
                <el-form label-width="190px" class="bold-font" :model="form" ref="form"  :rules="rules" >
                <el-form-item label="公用模块类型：" prop="model_type">
                    <el-select class="width-super"
                               v-model="form.model_type"
                               ref="modelType"
                               v-mouse-side.mousewheel="()=>{$refs.modelType.visible = false}"
                               placeholder="请选择公用模块类型"
                               @change="change_model_type" filterable clearable>
                        <el-option
                                :key="item.value"
                                v-for="item in moduleTypeList"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属站点：" prop="site" placeholder="请选择所属站点"
                              v-if="showSite" filterable clearable>
                    <el-select class="width-super"
                               v-model="form.site"
                               ref="cursite"
                               v-mouse-side.mousewheel="()=>{$refs.cursite.visible = false}"
                               @change="change_site"
                               filterable clearable>
                        <el-option
                                :key="item.value"
                                v-for="item in siteList"
                                :label="item.name"
                                :value="item.siteid"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="公共模块模板名称：" prop="model_name">
                    <el-input class="inline width-super" v-model="form.model_name" placeholder="请输入公共模块模板名称"></el-input>
                </el-form-item>
                <!--销售说明  start-->
                <div v-if="form.model_type==='sale'">
                    <sale-detail class="mr-lg ml-lg" :form="form"></sale-detail>
                </div>
                <!--销售说明  end-->
                <!--公用模块 备货时间-->
                <el-form-item label="备货时间：" v-if="form.model_type==='choice'" prop="choice_date">
                    <el-select class="width-super"
                               ref="choicedate"
                               v-mouse-side.mousewheel="()=>{$refs.choicedate.visible = false}"
                               v-model="form.choice_date">
                        <el-option
                                :key="item.value"
                                v-for="item in choiceDate"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <!--接受买家还价(Best Offer) start-->
                <div v-if="form.model_type==='bargaining'">
                    <el-form-item label="接受买家还价(Best Offer)：">
                        <el-radio-group v-model="form.best_offer">
                            <el-radio class="normal-font" :label="0">关闭</el-radio>
                            <el-radio class="normal-font" :label="1">开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="接受的最低价：" prop="accept_lowest_price">
                        <el-input class="inline width-super" :disabled="!form.best_offer" v-model="form.accept_lowest_price"></el-input>
                        <span class="inline normal-font">{{curSite.currency}}&nbsp;(当客人提出的价格高于该价格时,直接成交)</span>
                    </el-form-item>
                    <el-form-item label="筛选的最低价：" prop="reject_lowest_price">
                        <el-input class="inline width-super" :disabled="!form.best_offer" v-model="form.reject_lowest_price"></el-input>
                        <span class="inline normal-font">{{curSite.currency}}&nbsp;(当客人提出的价格低于该价格时,直接无视)</span>
                        <div class="normal-font">小提示：接受买家还价(Best Offer)，并非适用所有类别产品。且只作用于卖家出售方式为：一口价(Fixed price)。</div>
                    </el-form-item>
                </div>
                <!--接受买家还价(Best Offer) end-->
                <!--收款方式  start-->
                <div v-if="form.model_type==='receivables'">
                    <el-form-item label="收款方式：" prop="pay_method">
                        <el-checkbox-group v-model="form.pay_method" class="nir">
                            <el-checkbox class="normal-font"
                                         v-for="(item,index) in payMethodList"
                                         :label="item.value"
                                         :key="item.value">{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="立即付款：">
                        <el-checkbox class="normal-font" v-model="form.auto_pay">是否立即付款</el-checkbox>
                        <div class="normal-font">注意：请确认您的Paypal帐号为商业帐号,刊登是一口价或带一口价的拍卖。同时请上官网查阅该类目是否支持立即付款</div>
                    </el-form-item>
                    <el-form-item label="付款说明：">
                        <el-input
                                v-model="form.payment_instructions"
                                type="textarea"
                                :autosize="{ minRows: 4, maxRows: 8}"
                                placeholder="请在此区域添加付款说明"
                        ></el-input>
                    </el-form-item>
                </div>
                <!--收款方式  end-->
                <!--数量  start-->
                <el-form-item label="数量：" v-if="form.model_type==='quantity'" prop="quantity">
                    <el-input class="inline width-super" v-model="form.quantity" placeholder="请输入数量"></el-input>
                </el-form-item>
                <!--数量  end-->
                <!--自提(Local Pickup) start-->
                <el-form-item label="自提(Local Pickup)：" v-if="form.model_type==='pickup'" >
                    <el-checkbox v-model="form.local_pickup" class="normal-font">Buyers can pick up the item from you</el-checkbox>
                    <div class="normal-font mt-lg">小提示：只有选择支付方式为PayPal，并且要求买家立即付款，该选项才有效！</div>
                </el-form-item>
                <!--自提(Local Pickup) end-->
                <!--私人物品  start-->
                <el-form-item label="私人物品：" v-if="form.model_type==='individual'" >
                    <el-radio class="normal-font" v-model="form.individual_listing" :label="1">是</el-radio>
                    <el-radio class="normal-font" v-model="form.individual_listing" :label="0">否</el-radio>
                </el-form-item>
                <!--私人物品  end-->
                <!--记数器  start-->
                <!--<el-form-item label="记数器：" v-if="model_type==='counter'" >-->
                    <!--<el-radio class="radio" v-model="counter" :label="0">不使用</el-radio>-->
                    <!--<el-radio class="radio" v-model="counter" :label="1">BasicStyle</el-radio>-->
                    <!--<el-radio class="radio" v-model="counter" :label="2">RetroStyle</el-radio>-->
                <!--</el-form-item>-->
                <!--记数器  end-->
                <!--橱窗展示图片  start-->
                <el-form-item label="橱窗展示(Gallery)图片：" v-if="form.model_type==='gallery'">
                    <el-radio class="normal-font" v-model="form.picture_gallery" :label="0">不使用</el-radio>
                    <el-radio class="normal-font" v-model="form.picture_gallery" :label="2">Featured</el-radio>
                    <el-radio class="normal-font" v-model="form.picture_gallery" :label="1">Gallery</el-radio>
                    <el-radio class="normal-font" v-model="form.picture_gallery" :label="3">Plus</el-radio>
                </el-form-item>
                <!--橱窗展示图片  end-->
                <!--发货地 start-->
                <div v-if="form.model_type==='location'">
                    <el-form-item label="商品所在地：" prop="location">
                        <el-input class="inline width-super" v-model="form.location" placeholder="请输入商品所在地"></el-input>
                    </el-form-item>
                    <el-form-item label="国家：" prop="country">
                        <el-select class="inline width-super"
                                   v-model="form.country"
                                   ref="country"
                                   v-mouse-side.mousewheel="()=>{$refs.country.visible = false}"
                                   placeholder="请选择国家"
                                   filterable clearable>
                            <el-option
                                :key="item.countrySn"
                                v-for="item in countryList"
                                :label="item.countrySn"
                                :value="item.countrySn"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="邮编：">
                        <el-input class="inline width-super" type="number" v-model="form.post_code" placeholder="请输入邮编"></el-input>
                    </el-form-item>
                </div>
                <!--发货地 end-->
                <!--不送达地区 start-->
                <el-form-item label="不运送地区：" v-if="form.model_type==='exclude'">
                    <delivery-country v-model="form.exclude"
                                      ref="excludeCountry"
                                      :location-list="locationList"></delivery-country>
                </el-form-item>
                <!--不送达地区 end-->
                <!--退货策略 start-->
                <div v-if="form.model_type==='returngoods'">
                    <el-form-item label="接受退货：" prop="return_policy">
                        <el-select class="width-super"
                                   v-model="form.return_policy"
                                   ref="returnpolicy"
                                   v-mouse-side.mousewheel="()=>{$refs.returnpolicy.visible = false}"
                                   placeholder="请选择是否接受退货">
                            <el-option
                                    :key="item.value"
                                    v-for="item in returnPolicyList"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="接受退货方式：" prop="return_type">
                        <el-select class="width-super"
                                   v-model="form.return_type"
                                   ref="returntype"
                                   v-mouse-side.mousewheel="()=>{$refs.returntype.visible = false}"
                                   placeholder="请选择退货方式">
                            <el-option
                                    :key="item.value"
                                    v-for="item in returnTypeList"
                                    :label="item.lable"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="接受退货周期：" prop="return_time">
                        <el-select class="width-super"
                                   v-model="form.return_time"
                                   ref="returntime"
                                   v-mouse-side.mousewheel="()=>{$refs.returntime.visible = false}"
                                   placeholder="请选择接受退货期限">
                            <el-option
                                    :key="item.value"
                                    v-for="item in returnTimeList"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="holiday return：">
                        <el-checkbox class="normal-font" v-model="form.extension">Off extended holiday returns until December 31</el-checkbox>
                    </el-form-item>
                    <el-form-item label="退货邮费承当：">
                        <el-select class="width-super"
                                   v-model="form.return_shipping_option"
                                   ref="return"
                                   v-mouse-side.mousewheel="()=>{$refs.return.visible = false}"
                                   placeholder="请选择邮费承担方">
                            <el-option
                                    :key="item.value"
                                    v-for="item in shippingOptions"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="折旧费(RestockingFeeValue)：">
                        <el-select class="inline width-super"
                                   v-model="form.restocking_fee_code"
                                   ref="feecode"
                                   v-mouse-side.mousewheel="()=>{$refs.feecode.visible = false}"
                                   filterable clearable>
                            <el-option v-for="item in restockingList"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="退货说明：">
                        <el-input
                                v-model="form.return_description"
                                type="textarea"
                                :autosize="{ minRows: 4, maxRows: 8}"
                                placeholder="请在此区域添加退货说明"
                        ></el-input>
                    </el-form-item>
                </div>
                <!--退货策略 end-->
                <!--买家限制 Start-->
                <div v-if="form.model_type==='refuse'">
                    <el-form-item label="买家要求：">
                        <div>
                            <el-radio v-model="form.refuse" :label="0">允许所有买家购买我的物品</el-radio>
                        </div>
                        <div>
                            <el-radio v-model="form.refuse" :label="1">不允许以下买家购买我的物品</el-radio>
                        </div>
                        <div class="ml-lg">
                            <div>
                                <el-checkbox :disabled="form.refuse===0" class="normal-font" v-model="form.link_paypal">没有 PayPal 账户</el-checkbox>
                            </div>
                            <div>
                                <el-checkbox :disabled="form.refuse===0" class="normal-font" v-model="form.registration">主要运送地址在我的运送范围之外</el-checkbox>
                            </div>
                            <div>
                                <el-checkbox :disabled="form.refuse===0" class="normal-font"v-model="form.strikes">曾收到&nbsp;
                                    <el-select :disabled="form.refuse===0"
                                               class="inline width-xs"
                                               v-model="form.strikes_count"
                                               ref="refuse"
                                               v-mouse-side.mousewheel="()=>{$refs.refuse.visible = false}">
                                        <el-option
                                             :key="item.value"
                                             v-for="item in discardNumber"
                                             :value="item.value"
                                             :label="item.label"
                                        ></el-option>
                                    </el-select>&nbsp;个弃标个案，在过去&nbsp;
                                    <el-select :disabled="form.refuse===0"
                                               class="inline width-xs"
                                               v-model="form.strikes_period"
                                               ref="strikesperiod"
                                               v-mouse-side.mousewheel="()=>{$refs.strikesperiod.visible = false}">
                                        <el-option
                                                :key="item.value"
                                                v-for="item in cycleTime"
                                                :value="item.value"
                                                :label="item.label"
                                        ></el-option>
                                    </el-select>&nbsp;天
                                </el-checkbox>
                            </div>
                            <div>
                                <el-checkbox :disabled="form.refuse===0" class="normal-font" v-model="form.violations">曾收到&nbsp;
                                    <el-select :disabled="form.refuse===0"
                                               v-model="form.violations_count"
                                               ref="violationscount"
                                               v-mouse-side.mousewheel="()=>{$refs.violationscount.visible = false}"
                                               class="inline width-xs">
                                    <el-option
                                        :key="item.value"
                                        v-for="item in violationsNumber"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>&nbsp;个违反政策检举，在过去
                                    <el-select :disabled="form.refuse===0"
                                               v-model="form.violations_period"
                                               ref="period"
                                               v-mouse-side.mousewheel="()=>{$refs.period.visible = false}"
                                               class="inline width-xs">
                                    <el-option
                                            :key="item.value"
                                            v-for="item in violationsPeriod"
                                            :label="item.label"
                                            :value="item.value"
                                    ></el-option>
                                </el-select>&nbsp;天
                                </el-checkbox>
                            </div>
                            <div>
                                <el-checkbox :disabled="form.refuse===0" class="normal-font" v-model="form.credit">
                                信用指标等于或低于：<el-select :disabled="form.refuse===0"
                                                     class="inline width-xs"
                                                     v-model="form.requirements_feedback_score"
                                                     ref="feedbackscore"
                                                     v-mouse-side.mousewheel="()=>{$refs.feedbackscore.visible = false}">
                                    <el-option
                                            :key="item.value"
                                            v-for="item in creditScore"
                                            :label="item.label"
                                            :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-checkbox>
                            </div>
                            <div>
                                <el-checkbox :disabled="form.refuse===0" class="normal-font" v-model="form.requirements">
                                在过去10天内曾出价或购买我的物品，已达到我所设定的限制&nbsp;
                                <el-select class="inline width-xs"
                                           :disabled="form.refuse===0"
                                           v-model="form.requirements_max_count"
                                           ref="maxcount"
                                           v-mouse-side.mousewheel="()=>{$refs.maxcount.visible = false}"
                                           filterable clearable>
                                    <el-option
                                        :key="item.value"
                                        v-for="item in requirementsCount"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-checkbox>
                            </div>
                            <div>
                                <el-checkbox :disabled="form.refuse===0" class="normal-font" v-model="form.minimum_feedback">
                                这项限制只适用于买家信用指数等于或低于&nbsp;
                                <el-select :disabled="form.refuse===0"
                                           class="inline width-xs"
                                           v-model="form.minimum_feedback_score"
                                           ref="minimum"
                                           v-mouse-side.mousewheel="()=>{$refs.minimum.visible = false}">
                                    <el-option
                                        :key="item.value"
                                        v-for="item in scoreList"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-checkbox>
                            </div>
                        </div>
                    </el-form-item>
                </div>
                <!--买家限制 end-->
                <!--物流设置-->
                <div v-if="showTrans">
                    <el-form-item label="国内运输"></el-form-item>
                    <div :class="[index===0?'':'mt-lg']"
                         v-for="(item,index) in inlandList" :key="index">
                        <el-form-item :label="`运输方式  ${index+1}：`">
                            <el-select class="inline"
                                       style="width: 300px;"
                                       v-model="item.trans_code"
                                       placeholder="请选择运输方式"
                                       ref="trans"
                                       v-mouse-side.mousewheel="()=>{$refs.trans[0].visible = false}"
                                       filterable clearable>
                                <el-option
                                        :key="item.shipping_service"
                                        v-for="item in intransportList"
                                        :label="item.description"
                                        :value="item.shipping_service"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="首件运费：">
                            <ui-limit-number class="inline width-super" v-model="item.cost" :limit="2" placeholder="请输入首件运费" ></ui-limit-number>
                            <label class="inline normal-font">{{curSite.currency}}</label>
                        </el-form-item>
                        <el-form-item label="续费运费：">
                            <ui-limit-number class="inline width-super" v-model="item.add_cost" :limit="2" placeholder="请输入续件运费" ></ui-limit-number>
                            <label class="inline normal-font">{{curSite.currency}}</label>
                        </el-form-item>
                        <el-form-item label="AK,HI,PR额外收费：" placeholder="请输入AK,HI,PR额外收费">
                            <el-input class="inline width-super" v-model="item.extra_cost"></el-input>
                            <label class="inline normal-font">{{curSite.currency}}</label>
                        </el-form-item>
                    </div>
                    <el-form-item>
                        <el-button type="primary" size="mini" @click.native="add_in_transport">添加运输方式</el-button>
                        <el-button  @click.native="del_inland" size="mini">删除</el-button>
                    </el-form-item>
                    <el-form-item class="mt-lg" label="国际运输"></el-form-item>
                    <div v-for="(item,index) in foreignList">
                        <el-form-item :label="`运输方式  ${index+1}：`">
                            <el-select class="inline"
                                       style="width: 300px;"
                                       v-model="item.trans_code"
                                       ref="foreigncode"
                                       v-mouse-side.mousewheel="()=>{$refs.foreigncode[0].visible = false}"
                                       placeholder="请选择国际运输方式"
                                       filterable clearable>
                                <el-option
                                     :key="item.shipping_service"
                                     v-for="item in outtransportList"
                                     :label="item.description"
                                     :value="item.shipping_service"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="首件运费：">
                            <el-input class="inline width-super" v-model="item.cost" placeholder="请输入首件运费"></el-input>
                            <label class="inline normal-font">{{curSite.currency}}</label>
                        </el-form-item>
                        <el-form-item label="续件运费：">
                            <el-input class="inline width-super" v-model="item.add_cost" placeholder="请输入续件运费"></el-input>
                            <label class="inline normal-font">{{curSite.currency}}</label>
                        </el-form-item>
                        <el-form-item label="可送至的国家：">
                            <delivery-country
                                    ref="deliveryCountry"
                                    :name-list="nameList"
                                    v-model="item.location"
                                    :location-list="locationList"></delivery-country>
                        </el-form-item>
                    </div>
                    <el-form-item>
                        <el-button type="primary" size="mini" @click.native="add_out_transport">添加运输方式</el-button>
                        <el-button  @click.native="del_foreign" size="mini">删除</el-button>
                    </el-form-item>
                </div>
            </el-form>
            </div>
            <div slot="footer">
                <el-button type="primary" size="mini" @click.native="add_new_module">确定</el-button>
                <el-button size="mini" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-add-module{
        .border-bottom{
            padding-bottom:5px;
            border-bottom: 1px solid #ddd;
        }
        .local-hidden{
            width:100px;
            vertical-align: middle;
            display: inline-block;
            text-overflow: ellipsis;
            word-break: keep-all;
            white-space: nowrap;
            overflow: hidden;
        }
    }
</style>
<script >
    import {api_save_common_model,api_save_common_trans,api_get_transform} from '../../../../api/ebay-kandeng-public-module';
    import {twoFloat,chinese} from '../../../../define/validator_reg';
    import htmlEditor from '../../../../components/html-editor.vue'; //-----文本编辑器引入
    import {get_local} from '../kandeng-list/add-edit-listing/get_localtion';
    export default{
        data(){
            let checkNumber = (rule,value,callback)=>{
                if(value){
                    return !twoFloat.test(value)?callback(new Error("数据格式非法！只能输入小于等于两位小数的数字")):callback();
                }else{
                    callback();
                }
            };
            let isChinese = (rule,value,callback)=>{
                if(value){
                    return chinese.test(value)?callback(new Error("非法字符，请更正")):callback();
                }else{
                    return callback(new Error('数量为必填项'));
                }
            };
            return {
                dialog:this.value,
                nameList:[
                    {name:"亚洲",value:1},
                    {name:"欧洲",value:2},
                    {name:"非洲",value:3},
                    {name:"北美洲",value:4},
                    {name:"南美洲",value:5},
                    {name:"澳洲",value:6},
                ],
                moduleTypeList:[
                    {label:"销售说明",value:"sale"},
                    {label:"接受买家还价(Best Offer)",value:"bargaining"},
                    {label:"备货时间",value:"choice"},
                    {label:"不运送地区",value:"exclude"},
                    {label:"橱窗展示(Gallery)图片",value:"gallery"},
                    {label:"自提(Local Pickup)",value:"pickup"},
                    {label:"商品所在地",value:"location"},
                    {label:"私人物品",value:"individual"},
                    {label:"数量",value:"quantity"},
                    {label:"收款选项",value:"receivables"},
                    {label:"买家限制",value:"refuse"},
                    {label:"退货",value:"returngoods"},
                    {label:"物流设置",value:"trans"},
                ],
                payMethodList:[
                    {label:"paypal",value:"PayPal"},
                    {label:"Visa or MasterCard",value:"VisaMC"},
                ],
                choiceDate:[
                    {label:"当天发货",value:0},
                    {label:"1天",value:1},
                    {label:"2天",value:2},
                    {label:"3天",value:3},
                    {label:"4天",value:4},
                    {label:"5天",value:5},
                    {label:"10天",value:10},
                    {label:"15天",value:15},
                    {label:"20天",value:20},
                    {label:"30天",value:30},
                    {label:"40天",value:40},
                ],
                excludeList:[],
                returnPolicyList:[
                    {label:"Returns Accepted",value:1},
                    {label:"No Returns Accepted",value:0},
                ],
                returnTypeList:[
                    {label:"Money Back",value:"MoneyBack"},
                    {label:"Money back or replacement（buyer's choice）",value:"MoneyBackOrReplacement"},
                    {label:"Money back or exchange（buyer's choice）",value:"MoneyBackOrExchange"},
                ],
                returnTimeList:[
                    {label:"14Days",value:1},
                    {label:"30Days",value:2},
                    {label:"60Days",value:3},
                ],
                shippingOptions:[
                    {label:"Buyer",value:1},
                    {label:"Seller",value:2},
                ],
                restockingList:[
                    {label:"NO",value:"NoRestockingFee"},
                    {label:"10%",value:"Percent_10"},
                    {label:"15%",value:"Percent_15"},
                    {label:"20%",value:"Percent_20"},
                ],
                discardNumber:[
                    {label:"2",value:2},
                    {label:"3",value:3},
                    {label:"4",value:4},
                    {label:"5",value:5},
                ],
                cycleTime:[
                    {label:"30",value:"Days_30"},
                    {label:"180",value:"Days_180"},
                    {label:"360",value:"Days_360"},
                ],
                violationsNumber:[
                    {label:"4",value:4},
                    {label:"5",value:5},
                    {label:"6",value:6},
                    {label:"7",value:7},
                ],
                violationsPeriod:[
                    {label:"30",value:"Days_30"},
                    {label:"180",value:"Days_180"},
                ],
                creditScore:[
                    {label:"-1",value:-1},
                    {label:"-2",value:-2},
                    {label:"-3",value:-3},
                ],
                requirementsCount:[
                    {label:"1",value:1},
                    {label:"2",value:2},
                    {label:"3",value:3},
                    {label:"4",value:4},
                    {label:"5",value:5},
                    {label:"6",value:6},
                    {label:"7",value:7},
                    {label:"8",value:8},
                    {label:"9",value:9},
                    {label:"10",value:10},
                    {label:"25",value:25},
                    {label:"50",value:50},
                    {label:"75",value:75},
                    {label:"100",value:100},
                ],
                scoreList:[
                    {label:"0",value:0},
                    {label:"1",value:1},
                    {label:"2",value:2},
                    {label:"3",value:3},
                    {label:"4",value:4},
                    {label:"5",value:5},
                ],
                intransportList:[],
                outtransportList:[],
                curSite:{
                    country:"", siteid:0, abbreviation:"", currency:"", name:"", symbol:"",
                },
                currentTab:"",
                isAllLocation:false,
                rules:{
                    model_type:[
                        {required:true,message:"公用模块类型为必选项",trigger:"blur,change"},
                    ],
                    site:[
                        {required:true,message:"所属站点为必选项",trigger:"blur,change",type:"number"},
                    ],
                    model_name:[
                        {required:true,message:"公共模块模板名称为必填项",trigger:"blur,change"},
                    ],
                    choice_date:[
                        {required:true,message:"备货时间为必填项",trigger:"blur,change",type:"number"},
                    ],
                    quantity:[
                        {validator:isChinese,required:true,trigger:"change"},
                    ],
                    location:[
                        {required:true,message:"商品所在地为必填项",trigger:"blur,change"},
                    ],
                    country:[
                        {required:true,message:"国家为必填项",trigger:"blur,change"},
                    ],
                    accept_lowest_price:[
                        {validator: checkNumber,trigger:'blur,change'}
                    ],
                    reject_lowest_price:[
                        {validator: checkNumber,trigger:'blur,change'}
                    ],
                    return_policy:[
                        {required:true,message:"接受退货为必填项",trigger:"blur,change",type:'number'}
                    ],
                    return_type:[
                        {required:true,message:"接受退货方式为必填项",trigger:"blur,change"}
                    ],
                    return_time:[
                        {required:true,message:"接受退货周期为必填项",trigger:"blur,change",type:'number'}
                    ],
                    pay_method:[
                        {required:true,message:"收款方式为必填项",trigger:"blur,change",type:'array'}
                    ]
                },

            }
        },
        created(){
        },
        computed:{
            showSite(){
                let cur = this.form.model_type;
                if(cur==='refuse'||cur==="quantity"||cur==="pickup"||cur==="individual"||cur==="counter"||cur==="gallery"||cur==="location"||cur==='refuse'||cur==='choice'||cur==='sale')return false;
                return true;
            },
            showTrans(){
                if(this.form.model_type==='trans'&&(this.form.site===0||this.form.site))return true;
                return false;
            },
            inlandList(){
                let curList = [];
                if(this.form.trans){
                    if(this.form.trans.length>0){
                        this.form.trans.forEach(row=>{
                            if(row.inter===0){
                                curList.push(row);
                            }
                        })
                    }
                }
                return curList;
            },
            foreignList(){
                let curList = [];
                if(this.form.trans){
                    if (this.form.trans.length > 0) {
                        this.form.trans.forEach(row => {
                            if (row.inter === 1) {
                                curList.push(row);
                            }
                        })
                    }
                }
                return curList;
            },
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            },
            "form.refuse"(val){
                if(val===0){
                    this.form.link_paypal = false;
                    this.form.registration = false;
                    this.form.strikes = false;
                    this.form.strikes_count = "";
                    this.form.strikes_period = "";
                    this.form.credit = false;
                    this.form.violations = false;
                    this.form.violations_count = "";
                    this.form.violations_period = "";
                    this.form.requirements_feedback_score = "";
                    this.form.requirements = false;
                    this.form.requirements_max_count = "";
                    this.form.minimum_feedback = false;
                    this.form.minimum_feedback_score = "";
                }
            }
        },
        methods:{
            get_local,
            open(){
                this.curSite.country = "";
                this.curSite.siteid = 0;
                this.curSite.abbreviation = "";
                this.curSite.currency = "";
                this.curSite.name = "";
                this.curSite.symbol = "";
            },
            get_edit_data(){//物流设置被选国家展示，在编辑时使用
                if(this.$refs.deliveryCountry&&this.$refs.deliveryCountry.length>0){
                    this.$refs.deliveryCountry.forEach(row=>{
                        row.edit_set_continent();
                    });
                }
                if(this.$refs.excludeCountry) this.$refs.excludeCountry.edit_set_continent();
            },
            /*更改  公用模块类型*/
            change_model_type(val){
                /*
                 * 更改 公用模块类型，除了name && model_type其他都初始化
                 */
                this.init_form();
            },
            init_form(){
                this.$set(this.form,'site',"");
                this.$set(this.form,'model_name',"");
                this.$set(this.form,'choice_date',"");
                this.$set(this.form,'best_offer',0);
                this.$set(this.form,'accept_lowest_price',"");
                this.$set(this.form,'reject_lowest_price',"");
                this.$set(this.form,'pay_method',[]);
                this.$set(this.form,'auto_pay',false);
                this.$set(this.form,'payment_instructions',"");
                this.$set(this.form,'quantity',"");
                this.$set(this.form,'local_pickup',false);
                this.$set(this.form,'individual_listing',1);
                this.$set(this.form,'picture_gallery',0);
                this.$set(this.form,'location',"");
                this.$set(this.form,'country',"");
                this.$set(this.form,'post_code',"");
                this.$set(this.form,'exclude',this.get_local(this.locationList));
                this.$set(this.form,'return_policy',"");
                this.$set(this.form,'return_type',"");
                this.$set(this.form,'return_time',"");
                this.$set(this.form,'restocking_fee_code',"");
                this.$set(this.form,'extension',false);
                this.$set(this.form,'return_shipping_option',"");
                this.$set(this.form,'return_description',"");
                this.$set(this.form,'refuse',0);
                this.$set(this.form,'link_paypal',false);
                this.$set(this.form,'registration',false);
                this.$set(this.form,'strikes',false);
                this.$set(this.form,'strikes_count',"");
                this.$set(this.form,'strikes_period',"");
                this.$set(this.form,'credit',false);
                this.$set(this.form,'violations',false);
                this.$set(this.form,'violations_count',"");
                this.$set(this.form,'violations_period',"");
                this.$set(this.form,'requirements_feedback_score',"");
                this.$set(this.form,'requirements',false);
                this.$set(this.form,'requirements_max_count',"");
                this.$set(this.form,'minimum_feedback',false);
                this.$set(this.form,'minimum_feedback_score',"");
                let trans = [
                    {inter:0,trans_code:"",cost:"",add_cost:"",extra_cost:"",location:[]},
//                    {inter:1,trans_code:"",cost:"",add_cost:"",extra_cost:"",is_all_location:false,location:this.get_local(this.locationList)},
                ];
                this.$set(this.form,'trans',trans);
            },
            /*更改  所属站点*/
            change_site(val){
                /*更改站点  初始国内国际运输方式*/
                let curSiteList = window.clone(this.siteList);
                if(val||val===0){
                    if(this.form.trans){
                        this.form.trans = [
                            {inter:0,trans_code:"",cost:"",add_cost:"",extra_cost:"",location:[]},
//                            {inter:1,trans_code:"",cost:"",add_cost:"",extra_cost:"",is_all_location:false,location:this.get_local(this.locationList)},
                        ];
                    }
                    this.curSite = curSiteList.find(row=>{return row.siteid===val});
                    this.get_site_transform();
                }else{
                    this.curSite.country = "";
                    this.curSite.siteid = 0;
                    this.curSite.abbreviation = "";
                    this.curSite.currency = "";
                    this.curSite.name = "";
                    this.curSite.symbol = "";
                }
            },
            /*添加运输方式 && 删除   国内*/
            add_in_transport(){
                let length =  this.inlandList.length;
                let cur_code = this.inlandList[length-1].trans_code;
                if(!cur_code) return this.$message({message:"请完善当前国内运输方式！", type:'warning'});
                let obj = {
                    inter:0,
                    trans_code:"",
                    cost:"",
                    add_cost:"",
                    extra_cost:"",
                    location:[],
                };
                this.form.trans.push(obj);
            },
            del_inland(){
                this.del_data(this.inlandList,);
            },
            del_foreign(){
                this.del_data(this.foreignList);
            },
            del_data(Array){
                let length = Array.length;
//                if(length===1)return this.$message({type:"warning",message:"最后一条数据不允许删除！"});
                let cur = Array[length-1];
                let index=this.form.trans.findIndex(row=>{
                    return row===cur
                });
                this.form.trans.splice(index,1);
            },
            /*添加运输方式 && 删除  国际*/
            add_out_transport(){
                let length = this.foreignList.length;
                if(length<=0){
                    let obj = {
                        inter:1,
                        trans_code:"",
                        cost:"",
                        add_cost:"",
                        extra_cost:"",
                        is_all_location:false,
                        location:this.get_local(this.locationList),
                    }
                    this.form.trans.push(obj);
                }else{
                    let cur_code = this.foreignList[length-1].trans_code;
                    if(!cur_code) return this.$message({message:"请完善当前国际运输方式！", type:'warning'});
                    let obj = {
                        inter:1,
                        trans_code:"",
                        cost:"",
                        add_cost:"",
                        extra_cost:"",
                        is_all_location:false,
                        location:this.get_local(this.locationList),
                    }
                    this.form.trans.push(obj);
                }



            },
            /*添加 && 取消 模板*/
            add_new_module(){
                this.$refs.form.validate((bool)=>{
                    if(bool){
                        let params = {
                            model_type:this.form.model_type,
                        };
                        let detail = [];
                        let obj = {};
                        if(this.form.model_type!=="trans"){
                            switch(this.form.model_type){
                                case "sale":
                                    /*销售说明*/
                                    obj ={
                                        type:this.form.model_type,
                                        model_name:this.form.model_name,
//                                        site:this.form.site,
                                        payment:this.form.payment,
                                        delivery_detail:this.form.delivery_detail,
                                        terms_of_sales:this.form.terms_of_sales,
                                        about_us:this.form.about_us,
                                        contact_us:this.form.contact_us
                                    };
                                    break;
                                case "bargaining":
                                    /*接受买家还价*/
                                    obj = {
                                        type:this.form.model_type,
                                        model_name:this.form.model_name,
                                        site:this.form.site,
                                        best_offer:this.form.best_offer,
                                        accept_lowest_price:this.form.accept_lowest_price,
                                        reject_lowest_price:this.form.reject_lowest_price,
                                    };
                                    break;
                                case "choice":
                                    /*备货时间*/
                                    obj = {
                                        type:this.form.model_type,
                                        model_name:this.form.model_name,
//                                        site:this.form.site,
                                        choice_date:this.form.choice_date
                                    };
                                    break;
                                case "counter":
                                    /*计数器*/
                                    break;
                                case "exclude":
                                    /*不送达地区*/
                                    obj = {
                                        type:this.form.model_type,
                                        model_name:this.form.model_name,
                                        site:this.form.site,
                                        exclude:this.form.exclude
                                    }
                                    break;
                                case "gallery":
                                    /*橱窗展示*/
                                    obj = {
                                        type:this.form.model_type,
                                        model_name:this.form.model_name,
                                        picture_gallery:this.form.picture_gallery
                                    }
                                    break;
                                case "pickup":
                                    /*自提*/
                                    obj = {
                                        type:this.form.model_type,
                                        model_name:this.form.model_name,
                                        local_pickup:this.form.local_pickup?1:0,
                                    }
                                    break;
                                case "location":
                                    /*发货地*/
                                    obj = {
                                        type:this.form.model_type,
                                        model_name:this.form.model_name,
                                        location:this.form.location,
                                        country:this.form.country,
                                        post_code:this.form.post_code
                                    }
                                    break;
                                case "individual":
                                    /*私有*/
                                    obj = {
                                        type:this.form.model_type,
                                        model_name:this.form.model_name,
                                        individual_listing:this.form.individual_listing,
                                    };
                                    break;
                                case "quantity":
                                    /*数量*/
                                    obj = {
                                        type:this.form.model_type,
                                        model_name:this.form.model_name,
                                        quantity:this.form.quantity
                                    };
                                    break;
                                case "receivables":
                                    /*收款方式*/
                                    obj = {
                                        type:this.form.model_type,
                                        model_name:this.form.model_name,
                                        site:this.form.site,
                                        pay_method:this.form.pay_method,
                                        auto_pay:this.form.auto_pay?1:0,
                                        payment_instructions:this.form.payment_instructions,
                                    };
                                    break;
                                case "refuse":
                                    /*买家限制*/
                                    obj = {
                                        type: this.form.model_type,
                                        refuse: this.form.refuse,
                                        model_name: this.form.model_name,
                                        link_paypal: this.form.link_paypal ? 1 : 0,
                                        registration: this.form.registration ? 1 : 0,
                                        violations: this.form.violations ? 1 : 0,
                                        violations_count: this.form.violations_count,
                                        violations_period: this.form.violations_period,
                                        strikes: this.form.strikes ? 1 : 0,
                                        strikes_count: this.form.strikes_count,
                                        strikes_period: this.form.strikes_period,
                                        credit: this.form.credit ? 1 : 0,
                                        requirements_feedback_score: this.form.requirements_feedback_score,
                                        requirements: this.form.requirements ? 1 : 0,
                                        requirements_max_count: this.form.requirements_max_count,
                                        minimum_feedback: this.form.minimum_feedback ? 1 : 0,
                                        minimum_feedback_score: this.form.minimum_feedback_score,
                                    };
                                    break;
                                case "returngoods":
                                    /*退货策略*/
                                    obj = {
                                        type:this.form.model_type,
                                        model_name:this.form.model_name,
                                        site:this.form.site,
                                        restocking_fee_code:this.form.restocking_fee_code,
                                        return_type:this.form.return_type,
                                        return_time:this.form.return_time,
                                        extension:this.form.extension?1:0,
                                        return_shipping_option:this.form.return_shipping_option,
                                        return_description:this.form.return_description,
                                        return_policy:this.form.return_policy,
                                    };
                                    break;
                            }
                            if(this.form.id&&this.modelType!==obj.type) {
                                delete this.form.id;
                            }else{
                                this.form.id&&(obj.id = this.form.id);
                            }
                            detail.push(obj);
                            params.detail = JSON.stringify(detail);
                            return this.$http(api_save_common_model,params).then(res=>{
                                if(res.result){
                                    this.$message({type:"success",message:res.message||res});
                                    this.dialog = false;
                                    this.$emit("add-new-module",this.form.model_type);
                                } else {
                                    this.$message({type:"error",message:res.message || res});
                                }
                                return Promise.resolve();
                            }).catch(code=>{
                                this.$message({message:code.message,type:'error'});
                            });
                        }else{
                            /*物流方式*/
                            let data = {
                                action:!!this.form.id?"edit":"add"
                            };

                            let curTrans = window.clone(this.form.trans);
                            let curTransList = [];
                            curTrans.forEach(row=>{
                                delete row.is_all_location;
                                if(!!row.trans_code){
                                    curTransList.push(row);
                                }
                                if(row.location.length===this.get_local(this.locationList).length) row.location = "Worldwide";
                            });

                            if(curTransList.length<=0)return this.$message({message:"请至少添加一种运输方式后，再点击保存！", type:'warning'});
                            obj = {
                                type:this.form.model_type,
                                model_name:this.form.model_name,
                                site:this.form.site,
                                trans:curTransList,
                            };
                            if(this.form.id&&this.modelType!==obj.type){
                                delete this.form.id
                            }else{
                                this.form.id&&(obj.id = this.form.id);
                            }
                            detail.push(obj);
                            data.detail = JSON.stringify(detail);
                            return this.$http(api_save_common_trans,data).then(res=>{
                                this.$message(res.message);
                                this.dialog = false;
                                this.$emit("add-new-module",this.form.model_type);
                                return Promise.resolve();
                            }).catch(code=>{
                                this.$message({message:code.message,type:'error'});
                            });
                        }
                    }
                })
            },
            cancel(){
                this.dialog = false;
            },
            /*获取Ebay物流方式*/
            get_site_transform(){
                this.$http(api_get_transform,{site:this.form.site}).then(res=>{
                    this.outtransportList = [];
                    this.intransportList = [];
                    res.forEach(row=>{
                        if(row.international_service){
                            this.outtransportList.push(row);
                        }else{
                            this.intransportList.push(row);
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        props:{
            title:{
                required:true,
                type:String
            },
            value:{},
            siteList:{
                required:true,
                type:Array
            },
            form:{
                required:true,
                type:Object
            },
            modelType:{},
            countryList:{
                required:true,
                type:Array
            },
            locationList:{
                required:true,
                type:Array
            },
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default,
            uiTips:require('../../../../components/ui-tips.vue').default,
            uiLimitNumber:require('../../../../components/ui-limit-number.vue').default,
            htmlEditor:require('../../../../components/html-editor.vue').default,
            saleDetail:require('./sale-detail.vue').default,
            deliveryCountry:require('../../ebay/kandeng-list/add-edit-listing/delivery-country.vue').default,
        }
    }
</script>
