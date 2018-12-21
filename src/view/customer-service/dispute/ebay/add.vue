<template>
    <page-dialog class="after-sale-add" title="售后处理"
                 v-model="dialog"
                 width="85%" left="8%"
                 size="full"
                 @open="open"
                 :close-on-click-modal="false">
        <el-row :gutter="8">
            <el-col :span="10">
                <div class="box">
                    <div class="mb-sm">
                        <span class="bold-font">第一步：选择订单 </span>
                        <!--<el-input class="inline width-super" @keydown.native.enter="search" v-model="order_number"></el-input>-->
                        <permission tag="ElInput" :route="apis.url_get_find" class="inline width-super"
                                    @keydown.native.enter="search" v-model="order_number">查找订单
                        </permission>
                        <permission tag="ElButton" :route="apis.url_get_find" class="inline" type="primary" size="mini"
                                    @click.native="search" :disabled="isTrigger">查找订单
                        </permission>
                    </div>
                    <div class="mb-sm colors-box orange bold-font">
                        <div v-if="isShow">
                            <span>订单号：</span><span>{{c_order_number}}</span>
                            <span>包裹号：</span><span>{{package_number}}</span>
                            <span>目的地：</span><span>{{address_country}}</span>
                        </div>
                        <span v-else>请选择您需要进行售后处理的订单</span>
                    </div>
                    <div class="colors-box blue bold-font grey-black">选择问题货品</div>
                    <div class="default-box">
                        <div v-if="problem.length>0">
                            <el-table
                                :data="problem"
                                :highlight-current-row="true"
                                height="150"
                            >
                                <el-table-column label="名称" prop="sku_title" show-overflow-tooltip></el-table-column>
                                <el-table-column label="SKU" prop="sku" show-overflow-tooltip></el-table-column>
                                <el-table-column label="发货数量" prop="delivery_quantity">
                                </el-table-column>
                                <el-table-column label="问题数量" inline-template>
                                    <input
                                        placeholder="不填默认为0。"
                                        class="inline width-sm el-input__inner"
                                        v-model="row.quantity"
                                        type="number"
                                        min="0"
                                        onkeyup="this.value=this.value.replace(/\D/g,'')"
                                        onafterpaste="this.value=this.value.replace(/\D/g,'')">
                                </el-table-column>
                            </el-table>
                        </div>
                        <el-card v-else class="t-center">
                            暂无问题货品....
                        </el-card>
                        <div>
                            <div class="red">1.建议按真实情况录入问题数量，方便日后统计货品的退换货比例。</div>
                            <div class="red">2.物流原因损坏的货品问题，请不要计入问题数量，以免影响对货品本身质量的统计分析。</div>
                        </div>
                    </div>
                    <div class="mt-sm colors-box blue bold-font whitebold-font grey-black">备注</div>
                    <div class="default-box mb-sm" style="position:relative">
                        <little-remark top="35px" right="347px" label="添加原因" v-if="isAdd" @submit="save_reason"
                                       @cancel="cancel_reason"></little-remark>
                        <el-form label-width="80px" :ref="remarkData">
                            <el-form-item label="原因："
                                          prop="reason" required
                            >
                                <el-select class="inline width-super" v-model="remarkData.reason" placeholder="请选择">
                                    <el-option
                                        :key="item.value"
                                        v-for="item in reasonList"
                                        :label="item.label"
                                        :value="item.value">
                                        <span style="float: left;line-height: 26px !important">{{ item.label }}</span>
                                        <span
                                            v-if="item.value !==1&&item.value !==2&&item.value !==3&&item.value !==4&&item.value !==5"
                                            style="float: right;line-height: 26px !important" class="el-icon-close"
                                            @click="delete_reason(item)"></span>
                                    </el-option>
                                </el-select>
                                <img class="inline" src="../../../../assets/add2.png" @click="add_btn">
                            </el-form-item>
                            <el-form-item label="备注：">
                                <el-input type="textarea" v-model="remarkData.remark"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <span class="bold-font">第二步：选择售后操作内容</span>（可多选）
                    <div class="mt-xs colors-box bold-font">
                        <el-checkbox-group class="inline ml-xs"
                                           v-for="(item,index) in afterList"
                                           :key="index"
                                           v-model="item.isSelect" @change="change(item,index)">
                            <el-checkbox :label="item.label"
                                         :disabled="!showDetail || (index>0&&!isAccept) || isDispute"></el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <!--退款   start-->
                    <div v-if="afterList[0].isSelect">
                        <div class="mt-sm colors-box blue bold-font grey-black">退款</div>
                        <div class="default-box">
                            <el-table
                                height="150"
                                border
                                :data="refundData">
                                <el-table-column label="付款类型" show-overflow-tooltip inline-template>
                                    <div>{{filterPayName(row.pay_name)}}</div>
                                </el-table-column>
                                <el-table-column label="付款单号" show-overflow-tooltip></el-table-column>
                                <el-table-column label="付款金额" inline-template>
                                    <div>{{row.pay_fee | filterPrice}}&nbsp;{{currency}}</div>
                                </el-table-column>
                                <el-table-column label="已退金额" inline-template>
                                    <div>{{row.refund_fee | filterPrice}}&nbsp;{{currency}}</div>
                                </el-table-column>
                                <el-table-column label="付款日期" inline-template>
                                    <div>{{row.pay_time | filterTime}}</div>
                                </el-table-column>
                            </el-table>
                            <div class="default-box mt-xs">
                                <el-form label-width="85px">
                                    <el-form-item label="申请退款金额：">
                                        <el-input class="inline width-xs" v-model="refund_amount" value="number"
                                                  :disabled="!parseFloat(max_refund_amount)||isDispute"></el-input>
                                        <el-input class="inline" style="width:50px" v-model="currency"
                                                  :disabled="true"></el-input>
                                        <span>不可高于：{{max_refund_amount}} {{currency}}</span>
                                        <span v-if="!parseFloat(max_refund_amount)"
                                              class="red">可退款金额为0，已不能再创建退款售后单</span>
                                    </el-form-item>
                                    <el-form-item label="给买家的留言：">
                                        <el-input type="textarea" v-model="to_buyer_message"></el-input>
                                    </el-form-item>
                                </el-form>
                                <span v-if="!isDispute" class="red">系统将生成PayPal退款请求，审核通过后将自动为您退款，您无需登录PayPal处理退款</span>
                            </div>
                        </div>
                    </div>
                    <!--退款   end-->

                    <!--补发货  start-->
                    <div v-if="afterList[1].isSelect">
                        <div class="mt-sm colors-box blue bold-font grey-black">补发单货品信息</div>
                        <div class="default-box">
                            <el-button class="inline" type="primary" size="mini" @click.native="add_more_goods">添加货品
                            </el-button>
                            <el-button class="inline fr" type="text" size="mini" @click.native="clear_goods">清空并填入问题货品
                            </el-button>
                            <el-table
                                height="150"
                                class="mt-xs"
                                :data="deliveryGoods"
                            >
                                <el-table-column label="SKU/商品名称" inline-template show-overflow-tooltip>
                                    <div>{{row.sku}}/{{row.spu_name}}</div>
                                </el-table-column>
                                <el-table-column label="申请补发数量" inline-template>
                                    <input class="inline width-sm el-input__inner" type="number" min="0"
                                           onkeyup="this.value=this.value.replace(/\D/g,'')" v-model="row.quantity"
                                           onafterpaste="this.value=this.value.replace(/\D/g,'')">
                                </el-table-column>
                                <el-table-column label="操作" inline-template>
                                    <span class="operate" @click="delivery_delete(row.sku_id)">删除</span>
                                </el-table-column>
                            </el-table>
                            <span class="red">补发货品用于创建新的补发订单</span>
                        </div>
                        <div class="mt-sm colors-box blue bold-font grey-black">补发单物流信息</div>
                        <div class="default-box">
                            <span class="bold-font">买家收货地址</span>
                            <el-button class="inline fr" type="text" size="mini" @click.native="old_address">填入原订单收货地址
                            </el-button>
                            <el-form class="mt-xs" label-width="100px" :model="address" ref="address" :rules="rules">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="收件人：">
                                            <el-input v-model="address.buyer_name"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="15">
                                        <el-form-item label="地址1：" prop="buyer_address_one">
                                            <el-input v-model="address.buyer_address_one"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="15">
                                        <el-form-item label="地址2：" prop="buyer_address_two">
                                            <el-input v-model="address.buyer_address_two"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="城市：">
                                            <el-input v-model="address.buyer_city"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="州/省：">
                                            <el-input v-model="address.buyer_state"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="国家：">
                                            <el-select v-model="address.buyer_country_code"
                                                       filterable
                                                       clearable:isSelect="isSelect">
                                                <el-option
                                                    v-for="item in countryList"
                                                    :label="item.country_cn_name"
                                                    :value="item.country_code"
                                                    :key="item.country_code"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="邮编：" prop="buyer_postal_code">
                                            <el-input v-model="address.buyer_postal_code"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="电话：" prop="buyer_phone">
                                            <el-input v-model="address.buyer_phone"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="手机：" prop="buyer_mobile">
                                            <el-input v-model="address.buyer_mobile"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div class="default-box">
                                <span class="bold-font">发货仓库及物流</span>
                                <div class="inline fr">
                                    <el-button class="inline" size="mini" type="text" @click.native="reissue_clear">清空
                                    </el-button>
                                    <el-button class="ml-xs inline" size="mini" type="text"
                                               @click.native="old_warehouse">选择原仓库及物流
                                    </el-button>
                                </div>
                                <el-form label-width="100px">
                                    <el-form-item label="发货仓库：">
                                        <ui-select style="width:170px"
                                                   v-model="new_warehouse_id"
                                                   ref="new_warehouse_id"
                                                   @change="shipping_remote"
                                                   v-mouse-side.mousewheel="()=>{$refs.new_warehouse_id.visible=false}"
                                                   filterable clearable>
                                            <el-option v-for="item in warehouseLists"
                                                       :key="item.value"
                                                       :label="item.label"
                                                       :value="item.value"></el-option>
                                        </ui-select>
                                    </el-form-item>
                                    <el-form-item label="邮寄方式：">
                                        <ui-select class="inline mr-sm"
                                                   v-model="shipping_method_id"
                                                   :placeholder="shippingPlaceholder"
                                                   :disabled="shippingList.length<=1"
                                                   ref="shipping_method_id"
                                                   v-mouse-side.mousewheel="()=>{$refs.shipping_method_id.visible=false}"
                                                   filterable clearable>
                                            <el-option v-for="item in shippingList"
                                                       :key="item.value"
                                                       :label="item.label"
                                                       :value="item.value">
                                            </el-option>
                                        </ui-select>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                    <!--补发货  end-->

                    <!--退货 start-->
                    <div v-if="afterList[2].isSelect">
                        <div class="mt-sm colors-box blue bold-font grey-black">退货</div>
                        <div class="default-box">
                            <el-button class="inline" type="primary" size="mini" @click.native="add_goods">添加货品
                            </el-button>
                            <el-button class="inline fr" type="text" size="mini" @click.native="clear_good2">清空并填入问题货品
                            </el-button>
                            <el-table
                                height="150"
                                class="mt-xs"
                                :data="returnsData.goods">
                                <el-table-column label="SKU/商品名称" inline-template show-overflow-tooltip>
                                    <div>{{row.sku}}/{{row.spu_name}}</div>
                                </el-table-column>
                                <el-table-column label="申请补发数量" inline-template>
                                    <input class="inline width-sm el-input__inner" v-model="row.quantity" type="number"
                                           min="0" onkeyup="this.value=this.value.replace(/\D/g,'')"
                                           onafterpaste="this.value=this.value.replace(/\D/g,'')">
                                </el-table-column>
                                <el-table-column label="操作" inline-template>
                                    <span class="operate" @click="refund_delete(row.sku_id)">删除</span>
                                </el-table-column>
                            </el-table>
                            <div class="mt-sm ml-xs">
                                <span class="inline width-lg required-sign">接收退货的仓库</span>
                                <ui-select class="inline" v-model="returnsData.warehouse_id" :isSelect="isSelect">
                                    <el-option
                                        v-for="item in warehouseList"
                                        :value="item.value"
                                        :label="item.label"
                                        :key="item.id"
                                    ></el-option>
                                </ui-select>
                            </div>
                            <div class="mt-sm ml-xs">
                                <span class="inline width-lg">买家退货使用的carrier</span>
                                <el-input class="inline" v-model="returnsData.buyer_return_carrier"></el-input>
                            </div>
                            <div class="mt-sm ml-xs">
                                <span class="inline width-lg">买家退货的跟踪单号</span>
                                <el-input class="inline" v-model="returnsData.buyer_return_tracking_num"></el-input>
                            </div>
                            <span class="red inline mt-sm">退货货品清单将在退货仓库【买家退货】中创建等待入库记录</span>
                        </div>
                    </div>
                    <!--退货 end-->
                </div>
            </el-col>
            <el-col :span="14">
                <div class="box">
                    <order-mdf v-show="showDetail"
                              :mdfid="orderId"
                              :forms="forms"
                              @submit-note="submit_note"
                              @delete-note="delete_note"></order-mdf>
                    <div class="colors-box blue grey-black" v-if="!showDetail">请选择订单...</div>
                </div>
            </el-col>
        </el-row>
        <add-goods v-model="addMore" @add-goods="add_issue_goods"></add-goods>
        <div slot="footer">
            <permission tag="ElButton" :route="apis.url_add_order" type="primary" size="mini" @click.native="submit">
                提交审批
            </permission>
            <permission tag="ElButton" :route="apis.url_add_order" type="primary" size="mini" @click.native="save">确定
            </permission>
            <el-button size="mini" @click.native="dialog = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .after-sale-add {
        .box {
            box-sizing: border-box;
            height: 680px;
            border: 1px solid #9DB5CB;
            padding: 8px 5px;
            overflow-y: auto;
        }
        .bold-font {
            font-weight: bold;
        }
        .grey-black {
            color: #1f2d3d;
        }
        .colors-box {
            box-sizing: border-box;
            height: 30px;
            line-height: 28px;
            font-size: 1.2rem;
            padding-left: 3px;
        }
        .default-box {
            border: 1px solid #dcdcdc;
            padding: 5px 3px;
            border-top: none;
        }
        .orange {
            border: 1px solid #fbd2c9;
            background-color: #fbd2c9;
            border-radius: 3px;
        }
        .blue {
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
            border: 1px solid #e4e8f1;
            background-color: #e4e8f1;
        }
        .red {
            color: #e4393c;
        }
        .after-sale-look {
            .remark-sale-look {
                height: 130px;
                right: 35px;
            }
        }
    }
</style>
<script>
    import {integer} from '../../../../define/validator_reg';
    import {
        get_reason,
        delete_reason,
        get_find,
        api_get_country,
        api_get_warehouse,
        api_get_postway,
        api_add_order,
        add_reason
    } from '@/api/after-sale';
    import {api_get_shipping} from '@/api/common';
    import {api_get_ship} from '@/api/handwork'
    import {url_get_find, url_add_order} from '@/api/after-sale'

    export default {
        permission: {
            url_get_find,
            url_add_order
        },
        name: 'add',
        data() {
            let isNumber = (rule, value, callback) => {
                return !integer.test(value) ? callback(new Error("非法数据，请重新输入")) : callback();
            };
            return {
                dialog: this.value,
                isSelect: true,
                order_number: "",
                orderId: "",
                skuList: [],
                //备注 start
                reasonList: [],
                remarkData: {reason: "", remark: ""},
                //备注 end
                type: [],
                afterList: [
                    {label: "退款", type: 1, isSelect: false},
                    {label: "补发货", type: 2, isSelect: false},
                    {label: "退货", type: 4, isSelect: false}
                ],
                //退款start
                refund_amount: this.max_refund_amount,
                currency: "",
                to_buyer_message: "",
                //退款end
                //补发货 start
                address: {
                    buyer_name: "",
                    buyer_address_one: "",
                    buyer_address_two: "",
                    buyer_city: "",
                    buyer_state: "",
                    buyer_country_code: "",
                    buyer_postal_code: "",
                    buyer_phone: "",
                    buyer_mobile: "",
                },
                deliveryGoods: [],
                new_warehouse_id: "",
                shipping_method_id: "",
                warehouseList: [],
                postList: [],
                countryList: [],
                //补发货 end
                //退货start
                returnsData: {
                    goods: [],
                    warehouse_id: "",
                    buyer_return_carrier: "",
                    buyer_return_tracking_num: ""
                },
                //退货end
                //右侧订单数据
                forms: {},
                isAdd: false,
                showDetail: false,
                addMore: false,
                curAdd: 0,
                isAccept: false,
                rules: {
                    address: [
                        {required: true, message: "地址信息不能为空", trigger: "blur"},
                    ],
                    zip: [
                        {validator: isNumber, trigger: "blur,change"},
                    ],
                },
                warehouseLists: [],
                shippingList: [],
                isUpdateShipping: false
            }
        },
        mounted() {
            this.warehouse_remote();
        },
        filters: {
            filterTime(val) {
                return val ? datef("YYYY-MM-dd", val) : "-- --";
            },
            filterPrice(val) {
                return val ? parseFloat(val).toFixed(2) : "0.00";
            }
        },
        computed: {
            shippingPlaceholder() {
                if (this.new_warehouse_id <= 0) {
                    return "请先选择发货仓库";
                } else if (this.new_warehouse_id > 0 && this.shippingList.length <= 1) {
                    return "该发货仓库下暂无运输方式";
                } else {
                    return "请选择运输方式";
                }
            },
            isShow() {
                return this.c_order_number || this.package_number || this.address_country;
            },
            order_id() {
                let cur = "";
                if (this.orderId) {
                    if (this.forms[this.orderId]) {
                        cur = this.forms[this.orderId].id;
                        return cur;
                    } else {
                        return cur;
                    }
                } else {
                    return cur;
                }
            },
            c_order_number() {
                let cur = "";
                if (this.orderId) {
                    if (this.forms[this.orderId]) {
                        cur = this.forms[this.orderId].order_number;
                        return cur
                    } else {
                        return cur;
                    }
                } else {
                    return cur;
                }
            },
            package_number() {
                const order = this.forms[this.orderId] || {};
                const packagelist = order.package_list || [];
                const numbers = packagelist.map(row => row.number);
                return numbers.join(',');
            },
            address_country() {
                const order = this.forms[this.orderId] || {};
                const country_code = order.country_code || "";
                const country = this.countryList.find(row => row.country_code === country_code);
                if (country) {
                    return country.country_en_name
                } else {
                    return "不存在的国家CODE";
                }
            },
            //问题货品 start
            problem() {
                let cur = [];
                if (this.orderId) {
                    if (this.forms[this.orderId]) {
                        let detail = this.forms[this.orderId].product_list;
                        detail.forEach((data, i, arr) => {
                            if (data.detail_goods.length <= 0) {
                                cur.push({
                                    sku: data.channel_sku,
                                    channel_sku: data.channel_sku,
                                    channel_item_id:data.channel_item_id,
                                    sku_id: 0,
                                    sku_title: "商品未知",
                                    quantity: '',
                                    delivery_quantity: 0,
                                    channel_sku_quantity: data.channel_sku_quantity
                                })
                            } else {
                                data.detail_goods.forEach((res, i) => {
                                    cur.push({
                                        sku: res.sku,
                                        channel_sku: data.channel_sku,
                                        channel_item_id:data.channel_item_id,
                                        sku_id: res.sku_id,
                                        sku_title: res.sku_title,
                                        quantity: '',
                                        delivery_quantity: res.sku_quantity,
                                        channel_sku_quantity: data.channel_sku_quantity
                                    });
                                    this.skuList.push(res.sku_id);
                                })
                            }
                            cur.forEach((res) => {
                                this.$set(res, "good_id", data.id);
                            })
                        });
                        return cur;
                    } else {
                        return cur;
                    }
                } else {
                    return cur;
                }
            },
            //问题货品 end
            //退款列表 start
            refundData() {
                let cur = [];
                if (this.orderId) {
                    if (this.forms[this.orderId]) {
                        let detail = this.forms[this.orderId].payment;
                        cur.push({
                            pay_name: detail.pay_name,
                            pay_fee: detail.pay_fee,
                            pay_time: detail.pay_time,
                            refund_fee: detail.retired_amount
                        });
                        this.currency = detail.currency_code;
                        return cur;
                    } else {
                        return cur;
                    }
                } else {
                    return cur;
                }
            },
            max_refund_amount() {
                let cur = "";
                if (this.refundData.length > 0) {
                    this.refundData.forEach((data) => {
                        let pay = 0.00;
                        let ref = 0.00;
                        if (data.pay_fee) pay = parseFloat(data.pay_fee);
                        if (data.refund_fee) ref = parseFloat(data.refund_fee);
                        cur = (pay * 100 - ref * 100) / 100;
                        if (cur < 0) cur = 0;
                    });
                    if(this.disputeParams.refund_amount){
                        this.refund_amount = this.disputeParams.refund_amount;
                    }else{
                        this.refund_amount = cur;
                    }
                    return cur;
                } else {
                    return cur;
                }
            },
            //退款 end
            placeholder() {
                return this.postList.length > 0 ? "请选择邮寄方式" : "请先选择发货仓库";
            },
        },
        watch: {
            refund_amount(val) {
                let cur = parseFloat(val);
                let max_amount = parseFloat(this.max_refund_amount);
                if (cur > max_amount) return this.$message({type: "warning", message: "可退款金额不能超过最大退款金额"});
            },
            order_number(val) {
                if (this.isTrigger) {
                    if (val) {
                        this.orderId = this.order_number.trim();
                        this.require_server(this.orderId);
                    } else {
                        this.showDetail = false;
                        this.forms = {};
                        return this.$message({type: "warning", message: "请输入订单号"});

                    }
                }
            },
            dialog(val) {
                this.$emit("input", val);
            },
            value(val) {
                this.dialog = val;
            },
            forms(val) {
                if (val[this.orderId]) {
                    this.isAccept = !!val[this.orderId].shipping_time;
                    let c = val[this.orderId].order_address;
                    this.address = {
                        buyer_name: c.consignee,
                        buyer_address_one: c.address,
                        buyer_address_two: c.address2,
                        buyer_city: c.city,
                        buyer_state: c.province,
                        buyer_country_code: c.country_code,
                        buyer_postal_code: c.zipcode,
                        buyer_phone: c.tel,
                        buyer_mobile: c.mobile,
                    };
                }
            },
        },
        methods: {
            open(){
                this.get_country();
                this.get_warehouse();
                this.get_reason();
                this.get_postway();
                this.forms = {};
                this.remarkData = {reason: "", remark: ""};
                this.showDetail = false;
                this.afterList = [
                    {label: "退款", type: 1, isSelect: false},
                    {label: "补发货", type: 2, isSelect: false},
                    {label: "退货", type: 4, isSelect: false}
                ];
                this.skuList = [];
                this.type = [];
                if(this.disputeParams.refund_amount){
                    this.refund_amount = this.disputeParams.refund_amount;
                }else{
                    this.refund_amount = this.max_refund_amount;
                }
                this.currency = "";
                this.to_buyer_message = "";
                this.deliveryGoods = [];
                this.new_warehouse_id = "";
                this.shipping_method_id = "";
                this.returnsData = {
                    goods: [],
                    warehouse_id: "",
                    buyer_return_carrier: "",
                    buyer_return_tracking_num: ""
                };
                this.addMore = false;
                this.curAdd = 0;
                this.isAccept = false;
                if (this.orderNumber) {
                    this.order_number = this.orderNumber;
                } else {
                    this.order_number = "";
                }
                if(this.disputeParams.type){
                    this.afterList.forEach(row=>{
                        row.type===this.disputeParams.type?row.isSelect=true:row.isSelect=false
                    });
                    this.type.push(this.disputeParams.type);
                    if(this.disputeParams.refund_amount){
                        this.refund_amount = this.disputeParams.refund_amount;
                    }
                }
            },
            filterPayName(val){
                return this.isDispute?'纠纷退款/退货':val
            },
            warehouse_remote() {
                this.$http(api_get_warehouse).then(res => {
                    this.warehouseLists = [{label: "全部", value: ""}, ...res];
                });
            },
            shipping_remote() {
                if (this.new_warehouse_id === "") return this.shippingList = [{label: "", value: ""}];
                if (!this.address.buyer_country_code) return this.$message({type: "info", message: '请选择国家'});
                let param = {
                    warehouse_id: this.new_warehouse_id,
                    country_code: this.address.buyer_country_code,
                    sku: this.deliveryGoods.map(row => row.sku_id)
                };
                this.shipping_method_id = '';
                this.$http(api_get_ship, param).then(res => {
                    if (res.length <= 0) return this.shippingList = [{label: "", value: ""}];
                    res = res.map(row => {
                        return {
                            label: `${row.carrier_name}>>${row.shipping_method_name}`,
                            value: row.shipping_id
                        }
                    });
                    this.shippingList = [{label: "全部", value: ""}, ...res];
                    if (this.isUpdateShipping) {
                        let old = this.forms[this.orderId].package_list[0];
                        let curs = this.postList.find(row => {
                            return old.shipping_id === row.value
                        });
                        let hasShipping = this.shippingList.find(row => {
                            return old.shipping_id === row.value
                        });
                        if (curs && hasShipping) {
                            this.shipping_method_id = curs.value;
                        } else {
                            this.$message({type: 'waring', message: '该仓库下暂时没有原邮寄方式！'})
                        }
                        this.isUpdateShipping = false;
                    }
                }).catch(code => {
                    console.log(code);
                });
            },
//            查找订单
            search() {
                if (!this.order_number) {
                    this.showDetail = false;
                    this.forms = {};
                    return this.$message({type: "warning", message: "请输入订单号"});
                }
                this.orderId = this.order_number.trim();
                this.require_server(this.orderId);
            },
//           备注   添加原因按钮
            add_btn() {
                this.isAdd = true;
            },
//            删除原因
            delete_reason(val) {
                this.$confirm('您将删除此条信息，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(delete_reason, val.value).then(res => {
                        this.get_reason();
                        this.$message({type: "success", message: res.message || res})
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            },
//          保存/取消 新增原因
            save_reason(val) {
                if (!val) return this.$message({type: "warning", message: "请填写原因后再点击保存"});
                return this.$http(add_reason, {remark: val}).then(res => {
                    this.$message(res.message);
                    this.get_reason();
                    this.isAdd = false;
                    return Promise.resolve();
                }).catch(code => {
                    this.isAdd = true;
                    this.$message({type: "error", message: code.message || code})
                });
            },
            cancel_reason() {
                this.isAdd = false;
            },
            submit() {
                if (this.type.length <= 0) return this.$message({
                    type: "warning",
                    message: '请至少选择一种售后操作内容，并填写完整后再点击提交'
                });
                let curObj = this.problem.find(row => row.quantity !== "" && parseFloat(row.quantity) !== 0);
                let problemObj = this.problem.find(row => {
                    return (row.delivery_quantity > 0 && parseFloat(row.quantity) > parseFloat(row.delivery_quantity))
                        || (row.delivery_quantity === 0 && row.quantity > row.channel_sku_quantity);
                });
                if (!curObj) return this.$message({type: "warning", message: "请至少填写一个商品的问题数量"});
                if (!!problemObj) return this.$message({type: "warning", message: "问题数量不能大于发货数量"});
                let params = {
                    is_submit: 2,
                    order_id: this.order_id,
                    order_number: this.c_order_number,
                    reason: this.remarkData.reason,
                    remark: this.remarkData.remark,
                    type: this.type,
                    problem: {
                        goods: this.problem.map(goods => {
                            let row = window.clone(goods);
                            delete row.channel_sku_quantity;
                            if (row.quantity === '') {
                                row.quantity = 0
                            }
                            return row
                        }),
                    },
                };
                this.type.forEach((data) => {
                    switch (data) {
                        case 1://退款
                            let cur = this.type.find(res => res === 1);
                            if (!!cur && (parseFloat(this.refund_amount) > parseFloat(this.max_refund_amount))) return this.$message({
                                type: "warning",
                                message: "可退款金额不能超过最大退款金额"
                            });
                            if (!!cur && !parseFloat(this.refund_amount)) return this.$message({
                                type: "warning",
                                message: "可退款金额不能为0"
                            });
                            this.$set(params, "refund", {
                                refund_amount: this.refund_amount,
                                to_buyer_message: this.to_buyer_message
                            });
                            break;
                        case 2://补发货
                            this.$set(params, "delivery", {
                                goods: this.deliveryGoods,
                                address: this.address,
                                new_warehouse_id: this.new_warehouse_id,
                                shipping_method_id: this.shipping_method_id
                            });
                            break;
                        case 4://退货
                            if (this.returnsData.warehouse_id === '') return this.$message({
                                type: "warning",
                                message: "接收退货的仓库为必填项"
                            });
                            this.$set(params, "return", this.returnsData);
                            break;
                    }
                });
                if(this.isDispute){
                    params.source_type = 1;
                    params.source_id = `${this.disputeParams.dispute_type}-${this.disputeParams.dispute_id}`;
                }
                return this.$http(api_add_order, params).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.$emit("submit", res.data,res.is_handle);
                    this.dialog = false;
                    return Promise.resolve();
                }).catch(code => {
                    this.dialog = true;
                    this.$message({type: "error", message: code.message || code})
                })
            },
            save() {
                if (this.type.length <= 0) return this.$message({
                    type: "warning",
                    message: '请至少选择一种售后操作内容，并填写完整后再点击提交'
                });
                let curObj = this.problem.find(row => row.quantity !== "" && parseFloat(row.quantity) !== 0);
                let problemObj = this.problem.find(row => {
                    return (row.delivery_quantity > 0 && parseFloat(row.quantity) > parseFloat(row.delivery_quantity))
                        || (row.delivery_quantity === 0 && row.quantity > row.channel_sku_quantity);
                });
                if (!curObj) return this.$message({type: "warning", message: "请填写问题数量"});
                if (!!problemObj) return this.$message({type: "warning", message: "问题数量不能为空，且不能大于发货数量"});
                let params = {
                    order_id: this.order_id,
                    order_number: this.c_order_number,
                    reason: this.remarkData.reason,
                    remark: this.remarkData.remark,
                    type: this.type,
                    problem: {
                        goods: this.problem.map(goods => {
                            let row = window.clone(goods);
                            delete row.channel_sku_quantity;
                            if (row.quantity === '') {
                                row.quantity = 0
                            }
                            return row
                        }),
                    },
                };
                let cur = this.type.find(res => res === 1);
                if (!!cur && (parseFloat(this.refund_amount) > parseFloat(this.max_refund_amount))) return this.$message({
                    type: "warning",
                    message: "可退款金额不能超过最大退款金额"
                });
                if (!!cur && !parseFloat(this.refund_amount)) return this.$message({
                    type: "warning",
                    message: "可退款金额不能为0"
                });
                this.type.forEach((data) => {
                    switch (data) {
                        case 1:
                            this.$set(params, "refund", {
                                refund_amount: this.refund_amount,
                                to_buyer_message: this.to_buyer_message
                            });
                            break;
                        case 2:
                            this.$set(params, "delivery", {
                                goods: this.deliveryGoods,
                                address: this.address,
                                new_warehouse_id: this.new_warehouse_id,
                                shipping_method_id: this.shipping_method_id
                            });
                            break;
                        case 4:
                            this.$set(params, "return", this.returnsData);
                            break;
                    }
                });
                if(this.isDispute){
                    params.source_type = 1;
                    params.source_id = `${this.disputeParams.dispute_type}-${this.disputeParams.dispute_id}`;
                }
                this.$http(api_add_order, params).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.dialog = false;
                    this.$emit("save", res.data,res.is_handle);
                }).catch(code => {
                    this.dialog = true;
                    this.$message({type: "error", message: code.message || code})
                })
            },
//          改变多选
            change(val) {
                this.type = [];
                if (!this.isAccept) {
                    if (val.type === 2) {
                        val.isSelect = false;
                        this.$message({type: "warning", message: "该订单未完成收货，补发货功能暂不能使用"})
                    } else if (val.type === 4) {
                        val.isSelect = false;
                        this.$message({type: "warning", message: "该订单未完成收货，退货功能暂不能使用"})
                    } else {
                        this.type.push(1);
                    }
                } else {
                    this.afterList.findRet(row => {
                        if (row.isSelect === true) {
                            this.type.push(row.type);
                        }
                    });
                }
            },
//            补发单货品信息  添加货品
            add_more_goods() {
                this.addMore = true;
                this.curAdd = 1;
            },
//            补发货 清空并填入问题货品
            clear_goods() {
                this.deliveryGoods = [];
                while (this.deliveryGoods.shift()) {
                }
                this.problem.forEach((data) => {
                    if (data.quantity > 0) {
                        this.deliveryGoods.push({
                            spu_name: data.sku_title,
                            goods_id: data.goods_id,
                            sku: data.sku,
                            sku_id: data.sku_id,
                            quantity: data.quantity,
                        })
                    }
                })
            },
//            补发货表格的删除
            delivery_delete(val) {
                let index = '';
                this.deliveryGoods.forEach((data, i) => {
                    if (data.sku_id === val) {
                        index = i;
                    }
                })
                this.deliveryGoods.splice(index, 1);
            },
//            退货表格的删除
            refund_delete(val) {
                let index = '';
                this.returnsData.goods.forEach((data, i) => {
                    if (data.sku_id === val) {
                        index = i;
                    }
                })
                this.returnsData.goods.splice(index, 1);
            },
//            填入原收货地址
            old_address() {
                let old = this.forms[this.orderId].order_address.source_address;
                this.address = {
                    buyer_name: old.consignee,
                    buyer_address_one: old.address,
                    buyer_address_two: old.address2,
                    buyer_city: old.city,
                    buyer_state: old.province,
                    buyer_country_code: old.country_code,
                    buyer_postal_code: old.zipcode,
                    buyer_phone: old.tel,
                    buyer_mobile: old.mobile,
                }
            },
//            补发单物流信息 清空
            reissue_clear() {
                this.new_warehouse_id = '';
                this.shipping_method_id = '';
            },
//          选择原仓库及物流
            old_warehouse() {
                let old = this.forms[this.orderId].package_list[0];
                if (!!old) {
                    let cur = this.warehouseList.find(row => {
                        return old.warehouse_id === row.value
                    });
                    if (cur) {
                        this.new_warehouse_id = cur.value;
                    }
                    this.isUpdateShipping = true;
                } else {
                    this.$message({
                        type: "warning",
                        message: "暂无原仓库及物流信息"
                    })
                }

            },
//            退货   添加货品
            add_goods() {
                this.addMore = true;
                this.curAdd = 2;
            },
//            添加商品
            add_issue_goods(val) {
                val.forEach((data) => {
                    let cur = {
                        spu_name: data.spu_name,
                        goods_id: data.goods_id,
                        sku: data.sku,
                        sku_id: data.id,
                        quantity: 1,
                    }
//                    if(!!this.skuList.find(res=>res===data.id)){
                    if (this.curAdd === 2) {
                        let isExist = this.returnsData.goods.find(row => {
                            return row.sku_id === data.id
                        })
                        if (!isExist) {
                            this.returnsData.goods.push(cur);
                        } else {
                            this.$message({type: "warning", message: "请不要重复添加商品"})
                        }
                    } else if (this.curAdd === 1) {
                        let isExist = this.deliveryGoods.find(row => {
                            return row.sku_id === data.id
                        })
                        if (!isExist) {
                            this.deliveryGoods.push(cur);
                        } else {
                            this.$message({type: "warning", message: "请不要重复添加商品"})
                        }
                    }
//                    }else{
//                        this.$message({type:"warning",message:"您添加的货品在原订单中不存在"})
//                    }
                });
            },
//             退货 清空并填入问题货品
            clear_good2() {
                while (this.returnsData.goods.shift()) {
                }
                this.problem.forEach((data) => {
                    if (data.quantity > 0) {
                        this.returnsData.goods.push({
                            spu_name: data.sku_title,
                            goods_id: data.goods_id,
                            sku: data.sku,
                            sku_id: data.sku_id,
                            quantity: data.quantity,
                        })
                    }
                })
            },
//            子页面 添加备注/删除备注 抛出事件
            submit_note() {
                this.require_server(this.orderId);
            },
            delete_note() {
                this.require_server(this.orderId);
            },
//           右边订单数据
            require_server(val) {
                this.forms = {};
                return this.$http(get_find, {content: val}).then(res => {
                    if (Object.keys(res).length === 0) return this.$message({
                        type: "warning",
                        message: "订单数据为空，请检查订单号输入是否正确"
                    });
                    this.$set(this.forms, val, res);
                    this.showDetail = Object.keys(this.forms).length !== 0 ? true : false;
                }).catch(code => {
                    this.showDetail = false;
                    this.$message({type: "warning", message: "当前订单不存在，请重新输入"})
                })
            },
//            获取国家
            get_country() {
                this.$http(api_get_country).then(res => {
                    this.countryList = res;
                }).catch(code => {
                    console.log(code);
                })
            },
//            获取仓库
            get_warehouse() {
                this.$http(api_get_warehouse).then(res => {
                    this.warehouseList = res;
                }).catch(code => {
                    console.log(code);
                })
            },
//            获取邮寄方式
            get_postway() {
                this.$http(api_get_postway).then(res => {
                    this.postList = res;
                }).catch(code => {
                    console.log(code);
                })
            },
//            新增订单接口
            api_add_order(data) {
                this.$http(api_add_order, data).then(res => {
                    this.$message({type: "success", message: res.message || res})
                    this.$emit("save");
                    this.dialog = false;
                }).catch(code => {
                    this.dialog = true;
                    this.$message({type: "error", message: code.message || code})
                })
            },
//            获取原因
            get_reason() {
                this.$http(get_reason).then(res => {
                    this.reasonList = res.map(row => {
                        return {
                            label: row.remark,
                            value: row.id,
                        }
                    });
                    this.remarkData.reason = this.reasonList[0].value;
                }).catch(code => {
                    console.log(code);
                })
            },
//            删除原因
        },
        props: {
            value: {},
            orderNumber: {},
            /*其他页面调用  add页面使用*/
            isTrigger: {
                default() {
                    return false
                }
            },
            isDispute:{
                default(){
                    return false
                }
            },
            disputeParams:{
                default(){
                    return {}
                }
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            shippingMethod: require('@/api-components/shipping-method.vue').default,
            littleRemark: require('@/components/little-remark.vue').default,
            orderMdf: require('./order-mdf.vue').default,
            uiSelect: require('@/components/ui-select.vue').default,
            addGoods: require('@/api-components/add-goods.vue').default,
            paramAccount: require('@/api-components/param-account.vue').default,
        }
    }
</script>
