<template>
    <page-dialog class="form-mdf scroll-bar"
                 v-model="visible"
                 @close='close_parcel'
                 @open="open"
                 :close-on-click-modal="false"
                 :title="`查看包裹号：${information.package.number}信息`" size="large">
        <el-row>
            <el-col>
                <tabs>
                    <tab-head
                            :navs="[
                            {label:'地址信息',action:'address'},
                            {label:'货品信息',action:'productList'},
                            {label:'仓储物流',action:'logistics'},
                            {label:'申报',action:'declare'},
                            {label:'日志',action:'log'}]">
                        <div style="overflow: hidden">
                            <div style="overflow: hidden">
                                <b class="mr-lg">包裹号：{{information.package.number}}</b>
                                <img src="">
                                <el-button class="fr"
                                           size="mini"
                                           type="primary"
                                           @click="release_order"
                                           disabled>释放订单
                                </el-button>
                            </div>
                            <el-steps ref="step" :space="130"
                                      :active="active"
                                      finish-status="success" class="ml-lg">
                                <el-step v-for="(item,index) in steps"
                                         :key="index" :title="item.name">
                                    <template slot="description">
                                        <div>{{filterTime(item.time)}}</div>
                                        <div style="color: #6699FF;">{{item.operator || ''}}</div>
                                    </template>
                                </el-step>
                            </el-steps>
                            <table class="template">
                                <tr>
                                    <td width="100"><b>包含订单</b></td>
                                    <td class="t-left">
                                        <el-button type="text"
                                                   class="mr-xs"
                                                   v-for="item in information.order"
                                                   :key="item.id"
                                                   @click="view_order(item.id)">{{item.order_number}}
                                        </el-button>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </tab-head>
                    <tab-item id="address" label="地址信息">
                        <el-card>

                            <el-form label-width="120px" :model="information.address" ref="form" :rules="rules">
                                <el-form-item label="买家ID：">
                                    <span>{{information.address.buyer_id}}</span>
                                </el-form-item>
                                <el-form-item label="收货人：" prop="consignee">
                                    <span>{{information.address.consignee}}</span>
                                </el-form-item>
                                <el-form-item label="地址1：" prop="address">
                                    <el-input v-if="click_address" v-model="information.address.address"
                                              class="width-super"></el-input>
                                    <span v-else>{{information.address.address}}</span>
                                </el-form-item>
                                <el-form-item label="地址2：">
                                    <el-input v-if="click_address" v-model="information.address.address2"
                                              class="width-super"></el-input>
                                    <span v-else>{{information.address.address2}}</span>
                                </el-form-item>
                                <el-form-item label="城市：" :prop="information.address.country_code!=='JP'?'city':''">
                                    <el-input v-if="click_address" v-model="information.address.city"
                                              class="width-super"></el-input>
                                    <span v-else>{{information.address.city}}</span>
                                </el-form-item>
                                <el-form-item label="省/州：">
                                    <el-input v-if="click_address" v-model="information.address.province"
                                              class="width-super"></el-input>
                                    <span v-else>{{information.address.province}}</span>
                                </el-form-item>
                                <el-form-item label="国家：" prop="country_code">
                                    <span>{{information.address.country_code}}</span>
                                </el-form-item>
                                <el-form-item label="邮编：" prop="zipcode">
                                    <el-input v-if="click_address" v-model="information.address.zipcode"
                                              class="width-lg"></el-input>
                                    <span v-else>{{information.address.zipcode}}</span>
                                </el-form-item>
                                <el-form-item label="联系电话：" prop="tel">
                                    <el-input v-if="click_address" v-model="information.address.tel"
                                              class="width-super"></el-input>
                                    <span v-else>{{information.address.tel}}</span>
                                </el-form-item>
                                <el-form-item label="手机号：" prop="mobile">
                                    <el-input v-if="click_address" v-model="information.address.mobile"
                                              class="width-super"></el-input>
                                    <span v-else>{{information.address.mobile}}</span>
                                </el-form-item>
                                <el-form-item label="买家邮件：" prop="email">
                                    <el-input v-if="click_address" v-model="information.address.email"
                                              class="width-super"></el-input>
                                    <span v-else>{{information.address.email}}</span>
                                </el-form-item>
                                <el-row>
                                    <el-col :span="24">
                                        <!--权限  编辑-->
                                        <permission
                                                tag="ElButton"
                                                :route="apis.url_updata_package"
                                                class="fr"
                                                v-if="!click_address"
                                                size="mini"
                                                type="primary"
                                                @click.native="edit_address"
                                        >编辑
                                        </permission>
                                        <div v-else class="fr">
                                            <request-button
                                                    req-key="save_address"
                                                    @click="save_address">保存
                                            </request-button>
                                            <el-button size="mini"
                                                       @click="cancel_address">取消
                                            </el-button>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-card>
                    </tab-item>
                    <tab-item id="productList" label="货品信息">
                        <div v-for="(product, index) in information.product" :key="index">
                            <el-table :data="product"
                                      @header-click="set_select(index)"
                                      class="mb-sm scroll-bar">
                                <el-table-column :label="`${index+1}`" width="30">
                                    <template v-if="deliverGoodsList[index].is_deliver_goods === ''" slot-scope="{row}">
                                        <img v-if="row.type===0" src="../../../assets/relevance.png" title="自动关联">
                                        <img v-if="row.type===1" src="../../../assets/handwork.png" title="人工添加">
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        width="70"
                                        label="图片">
                                    <template v-if="deliverGoodsList[index].is_deliver_goods === ''" slot-scope="scope">
                                        <el-popover
                                                placement="right"
                                                trigger="hover">
                                            <img :src="scope.row.sku_thumb | filterImg">
                                            <span slot="reference">
                                            <img :src="scope.row.sku_thumb"
                                                 v-if="scope.row.sku_thumb"
                                                 height="60px" width="60px"
                                                 style="border:none">
                                        </span>
                                        </el-popover>
                                    </template>
                                </el-table-column>
                                <el-table-column min-width="150"
                                                 :label="`平台SKU:${product[0].channel_sku}`">
                                    <template v-if="deliverGoodsList[index].is_deliver_goods === ''" slot-scope="scope">
                                        <ui-tip v-if="!click_product" class="inline mb-sm"
                                                :content="`产品SKU:${scope.row.sku}`" :width="98"></ui-tip>
                                        <div v-else>
                                            <span>产品SKU:</span>
                                            <el-select class="inline goods-sku" v-model="scope.row.sku_id"
                                                       @change="change_sku(scope.row)">
                                                <el-option v-for="item in scope.row.siblingsList"
                                                           :label="item.label"
                                                           :value="item.value"
                                                           :key="item.value"></el-option>
                                            </el-select>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column min-width="200"
                                                 label="产品名称" prop="sku_title">
                                </el-table-column>
                                <el-table-column min-width="100"
                                                 label="备注">
                                    <template v-if="deliverGoodsList[index].is_deliver_goods === ''" slot-scope="{row}">
                                        <ui-tip v-if="!click_product" :content="row.remark" :width="98"></ui-tip>
                                        <el-input v-else v-model="row.remark"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="lock_quantity" label="锁定数量" width="70">
                                </el-table-column>
                                <el-table-column prop="sku_quantity" width="100" :render-header="is_require">
                                    <template slot-scope="{row}">
                                        <div v-if="deliverGoodsList[index].is_deliver_goods === ''">
                                            <ui-tip v-if="!click_product" :content="row.sku_quantity"></ui-tip>
                                            <div v-else>
                                                <span>数量：</span>
                                                <input class="sub-num" v-model="row.sku_quantity"
                                                       type="number"
                                                       min="1"
                                                       max="100"
                                                       onkeyup="this.value=this.value.replace(/\D/g,'')"
                                                       onafterpaste="this.value=this.value.replace(/\D/g,'')"/>
                                                <i class="el-icon-delete red pointer"
                                                   @click="del_product(product, row, index)"></i>
                                            </div>
                                        </div>
                                        <el-checkbox v-else v-model="deliverGoodsList[index].is_deliver_goods">无需发货？
                                        </el-checkbox>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="fr">
                            <request-button
                                    req-key="save_product_edit"
                                    v-show="click_product"
                                    :disabled="isEmpty"
                                    @click="save_product">保存
                            </request-button>
                            <el-button size="mini"
                                       v-show="click_product"
                                       @click="cancel_product">取消
                            </el-button>
                            <el-button type="primary"
                                       size="mini"
                                       v-if="isProductEdit"
                                       v-show="!click_product"
                                       @click="edit_product">编辑
                            </el-button>
                        </div>
                    </tab-item>
                    <tab-item id="logistics" label="仓储物流">
                        <el-checkbox :checked="information.package.prior === 1"
                                     @change="click_prior"
                                     :disabled="information.package.is_click === 1">
                            <b>优先配货</b>
                        </el-checkbox>
                        <span>（由订单处理人员标记,包含多订单时,只要有一笔订单标记为优先则整包裹优先）</span>
                        <table class="template mb-sm mt-xs">
                            <tr>
                                <td width="80" class="t-right"><b>发货仓库：</b></td>
                                <td width="300" class="t-left">
                                    <span v-if="!click_edit || information.can_edit === 0">{{information.package.warehouse_name}}</span>
                                    <el-select v-else v-model="information.package.warehouse_id"
                                               @change="change_warehouse">
                                        <el-option :key="item.value"
                                                   v-for="item in warehouseList"
                                                   :value="item.value"
                                                   :label="item.label"
                                        ></el-option>
                                    </el-select>
                                </td>
                                <td width="80" class="t-right"><b>邮寄方式：</b></td>
                                <td class="t-left">
                                    <span v-if="!click_edit || information.can_edit === 0">{{information.package.shipping_name}}</span>
                                    <el-select v-else v-model="information.package.shipping_id"
                                               :placeholder="placeholder()" filterable
                                               @change="change_shipping"
                                               :disabled="shippingList.length<=0">
                                        <el-option
                                                :key="res.value"
                                                v-for="res in shippingList"
                                                :value="res.value"
                                                :label="res.label">

                                        </el-option>

                                    </el-select>
                                </td>
                            </tr>
                            <tr>
                                <td width="80" class="t-right"><b>估算重量：</b></td>
                                <td class="t-left">
                                    {{information.package.estimated_weight | noFixed}} g
                                </td>
                                <td width="80" class="t-right"><b>估算运费：</b></td>
                                <td class="t-left">
                                    {{information.package.estimated_fee | toFixed2}} CNY
                                </td>
                            </tr>
                            <tr>
                                <td width="80" class="t-right"><b>称重重量：</b></td>
                                <td class="t-left">
                                    <span v-if="!click_edit">
                                        {{information.package.package_weight | noFixed}}</span>
                                    <integer-zero-input :class="{is_edit: click_edit}"
                                                        class="inline"
                                                        :min="0"
                                                        :readonly="!click_edit"
                                                        v-if="click_edit"
                                                        v-model="information.package.package_weight">
                                    </integer-zero-input>
                                    g
                                </td>
                                <td width="80" class="t-right"><b>称重后运费：</b></td>
                                <td class="t-left">
                                    <span v-if="!click_edit">
                                        {{information.package.shipping_fee | noFixed}}</span>
                                    <el-input :class="{is_edit: click_edit}"
                                              class="inline"
                                              type="number"
                                              :min="0"
                                              :readonly="!click_edit"
                                              v-if="click_edit"
                                              v-model="information.package.shipping_fee">
                                    </el-input>
                                    CNY
                                </td>
                            </tr>
                            <tr>
                                <td width="80" class="t-right"><b>包裹尺寸：</b></td>
                                <td class="t-left" colspan="3">
                                    <span v-if="!click_edit">{{information.package.length}}</span>
                                    <el-input :class="{is_edit: click_edit}"
                                              class="inline"
                                              type="number" min="0"
                                              :readonly="!click_edit"
                                              v-if="click_edit"
                                              v-model="information.package.length">
                                    </el-input>
                                    cm 长 x
                                    <span v-if="!click_edit">{{information.package.width}}</span>
                                    <el-input :class="{is_edit: click_edit}"
                                              class="inline"
                                              type="number" min="0"
                                              :readonly="!click_edit"
                                              v-if="click_edit"
                                              v-model="information.package.width">
                                    </el-input>
                                    cm 宽 x
                                    <span v-if="!click_edit">{{information.package.height}}</span>
                                    <el-input :class="{is_edit: click_edit}"
                                              class="inline"
                                              type="number" min="0"
                                              :readonly="!click_edit"
                                              v-if="click_edit"
                                              v-model="information.package.height">
                                    </el-input>
                                    cm 高
                                </td>
                            </tr>
                            <tr>
                                <td width="80" class="t-right"><b>物流商称重：</b></td>
                                <td class="t-left">
                                    <span v-if="!click_edit">
                                        {{information.package.providers_weight | noFixed}}</span>
                                    <integer-zero-input :class="{is_edit: click_edit}"
                                                        class="inline"
                                                        :min="0"
                                                        :readonly="!click_edit"
                                                        v-model="information.package.providers_weight"
                                                        v-if="click_edit">
                                    </integer-zero-input>
                                    g
                                </td>
                                <td width="80" class="t-right"><b>物流商运费：</b></td>
                                <td class="t-left">
                                    <span v-if="!click_edit">
                                        {{information.package.providers_fee | toFixed2}}</span>
                                    <el-input :class="{is_edit: click_edit}"
                                              class="inline"
                                              type="number" min="0"
                                              :readonly="!click_edit"
                                              v-model="information.package.providers_fee"
                                              v-if="click_edit">
                                    </el-input>
                                    CNY
                                </td>
                            </tr>
                            <tr>
                                <td width="100" class="t-right"><b>物流商单号：</b></td>
                                <td class="t-left">{{information.package.process_code}}</td>
                                <td width="100" class="t-right"><b>跟踪号：</b></td>
                                <td class="t-left track">
                                    <span>{{information.package.shipping_number}}</span>
                                </td>
                            </tr>
                        </table>
                        <div class="fr">
                            <request-button
                                    req-key="save_logisticsAdd"
                                    v-show="click_edit"
                                    @click="save_logistics">保存
                            </request-button>
                            <el-button size="mini"
                                       v-show="click_edit"
                                       @click="cancel_logistics">取消
                            </el-button>
                            <el-button type="primary"
                                       size="mini"
                                       v-if="isLogisticsEdit"
                                       v-show="!click_edit"
                                       @click="edit_logistics">编辑
                            </el-button>
                        </div>
                    </tab-item>
                    <tab-item id="declare" label="申报">
                        <div class="mb-xs" style="overflow: hidden" v-show="click_declare">
                            <el-button type="primary"
                                       size="mini" class="fl"
                                       @click="add_declare">添加
                            </el-button>
                            <el-select v-model="currency"
                                       placeholder="请选择币种"
                                       @change="changeCurrency"
                                       class="fr ml-md width-lg">
                                <el-option v-for="item in currency_list"
                                           :key="item.code"
                                           :label="item.code"
                                           :value="item.code"
                                           filterable
                                           clearable>
                                    <span style="float: left">{{ item.code }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                                </el-option>
                            </el-select>
                            <label class="fr" style="line-height: 26px;"><b>币种</b></label>
                        </div>
                        <el-table class="mb-xs declares scroll-bar"
                                  :data="information.declare"
                                  style="width: 100%">
                            <el-table-column type="index"
                                             width="50">
                            </el-table-column>
                            <el-table-column label="产品SKU">
                                <template slot-scope="scope">
                                    <div v-if="!click_declare">
                                        <ui-tip :content="scope.row.sku" :width="98"></ui-tip>
                                    </div>
                                    <el-input :class="{is_declare: click_declare}"
                                              :readonly="!click_declare"
                                              v-model="scope.row.sku"
                                              v-if="click_declare"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="英文报关名/中文报关名"
                                             show-overflow-tooltip
                                             width="200">
                                <template slot-scope="scope">
                                    <span v-if="!click_declare">{{scope.row.goods_name_en}}</span>
                                    <el-input :class="{is_declare: click_declare}"
                                              class="name inline"
                                              :readonly="!click_declare"
                                              v-model="scope.row.goods_name_en"
                                              v-if="click_declare"></el-input>
                                    <span v-show="!click_declare">/</span>
                                    <span v-if="!click_declare">{{scope.row.goods_name_cn}}</span>
                                    <el-input :class="{is_declare: click_declare}"
                                              class="name inline"
                                              :readonly="!click_declare"
                                              v-model="scope.row.goods_name_cn"
                                              v-if="click_declare"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                                             label="HS Code">
                                <template slot-scope="scope">
                                    <span v-if="!click_declare">{{scope.row.hs_code}}</span>
                                    <el-input :class="{is_declare: click_declare}"
                                              :readonly="!click_declare"
                                              v-model="scope.row.hs_code"
                                              v-if="click_declare"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                                             label="产品链接地址">
                                <template slot-scope="scope">
                                    <span v-if="!click_declare">{{scope.row.sku_url}}</span>
                                    <el-input :class="{is_declare: click_declare}"
                                              :readonly="!click_declare"
                                              v-model="scope.row.sku_url"
                                              v-if="click_declare">
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                                             label="单品重量(g)">
                                <template slot-scope="scope">
                                    <span v-if="!click_declare">
                                        {{scope.row.unit_weight | noFixed}}</span>
                                    <el-input type="number" min="0"
                                              :class="{is_declare: click_declare}"
                                              :readonly="!click_declare"
                                              v-model="scope.row.unit_weight"
                                              v-if="click_declare">
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                                             label="单品价格">
                                <template slot-scope="scope">
                                    <span v-if="!click_declare">
                                        {{scope.row.declare_currency}}
                                    </span>
                                    <span v-if="!click_declare">
                                        {{scope.row.unit_price | toFixed2}}
                                    </span>
                                    <el-input type="number"
                                              min="0"
                                              :class="{is_declare: click_declare}"
                                              :readonly="!click_declare"
                                              v-model="scope.row.unit_price"
                                              v-if="click_declare">
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                                             label="数量">
                                <template slot-scope="scope">
                                    <span v-if="!click_declare">
                                        {{scope.row.quantity}}
                                    </span>
                                    <el-input type="number"
                                              min="0"
                                              :class="{is_declare: click_declare}"
                                              :readonly="!click_declare"
                                              v-model="scope.row.quantity"
                                              v-if="click_declare">
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="click_declare"
                                             label="操作">
                                <template slot-scope="scope">
                                    <el-button type="text"
                                               size="mini"
                                               @click="del_declare(scope.row)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="fr" >
                            <el-button type="primary" size="mini"
                                       v-show="click_declare"
                                       @click="save_declare">保存
                            </el-button>
                            <el-button size="mini"
                                       v-show="click_declare"
                                       @click="cancel_declare">取消
                            </el-button>
                            <el-button type="primary" size="mini"
                                       v-if="isDeclareEdit"
                                       class="fr" v-show="!click_declare"
                                       @click="edit_declare">编辑
                            </el-button>
                        </div>
                    </tab-item>
                    <tab-item id="log" label="日志">
                        <el-table
                                :data="information.log">
                            <el-table-column
                                    inline-template
                                    label="信息">
                                <span>{{row.remark}}</span>
                            </el-table-column>
                            <el-table-column
                                    inline-template
                                    width="100"
                                    label="包裹状态">
                                <ui-tip :content="row.process" :width="98"></ui-tip>
                            </el-table-column>
                            <el-table-column
                                    inline-template
                                    width="100"
                                    label="操作人">
                                <ui-tip :content="row.operator" :width="98"></ui-tip>
                            </el-table-column>
                            <el-table-column
                                    inline-template
                                    width="150"
                                    label="日期">
                                <ui-tip :content="row.create_time | filterTime" :width="98"></ui-tip>
                            </el-table-column>
                        </el-table>
                    </tab-item>
                </tabs>
            </el-col>
        </el-row>
        <span slot="footer">
            <el-button size="mini" @click.native="close_parcel" class="mr-lg">关闭</el-button>
        </span>
        <add-goods @add-goods="add_product" v-model="showProductList"></add-goods>
    </page-dialog>
</template>
<style lang="stylus">
    .form-mdf {
        position: relative;
        .template .is_edit {
            width: 80px;
        }
        .declares .name {
            width: 80px;
        }
        .mes-box {
            position: relative;
            margin: 5px 10px 5px;
            padding: 5px 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            > .close {
                position: absolute;
                top: -2px;
                right: 2px;
                width: 12px;
                height: 12px;
                display: inline-block;
                background: url(../../../../images/close.png) no-repeat;
                &:hover {
                    background: url(../../../../images/close-hover.png) no-repeat;
                }
            }
        }
        .invalid-color {
            background-color: #DF5255;
        }

        .red-color {
            background-color: #FBD2C9;
        }

        .green-color {
            background-color: #E0F7E6;
        }

        .blue-color {
            background-color: #C6DDF4;
        }

        .marker {
            font-size: 1.3rem;
            font-weight: bold
        }

        .remark-sale-look {
            overflow-y: hidden;
            width: 190px;
            height: 140px;
            position: absolute;
            top: 67px;
            right: 7px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background: #fff;
            padding: 0 5px;
            z-index: 999;

            .remark-sale-header {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 25px;
                padding-left: 10px;
                padding-top: 5px;
                background-color: #fff;
            }

            .remark-sale-body {
                overflow-y: auto;
                position: absolute;
                top: 30px;
                left: 0;
                right: 0;
                bottom: 30px;
                padding: 0 5px;
            }

            .remark-sale-footer {
                position: absolute;
                height: 25px;
                left: 0;
                right: 0;
                bottom: 0;
                padding-bottom: 5px;
                padding-right: 5px;
                background-color: #fff;
            }

        }
        .error-border {
            padding-top: 10px;
            border-top: 1px dotted #c0ccda;
        }

        .small-button {
            font-size: 1.1rem;
            border-radius: 2px;
            padding: 2px 4px;
        }

        .submit {
            color: #fff;
            background: #008BCE;
            border: 1px solid #008BCE;

            &
            :hover {
                background: #008BCE;
            }

        }
        .cancel {
            background: #fff;
            border: 1px solid #ddd;

            &:hover {
                color: #008BCE;
                border-color: #008BCE;
            }

        }
        .label {
            display: inline-block;
            width: 140px;
            text-align: right;
            padding: 3px 5px;
        }

        .detail {
            padding: 3px 5px;
            width: 200px;
        }

        .point {
            cursor: pointer;
        }

        .hasOrder {
            width: 50px;
            text-align: center;
            font-weight: 900;
        }
        .goods-sku {
            width: 65%;
        }
        .sub-num {
            width: 40px;
            text-align: center;
        }

    }
</style>
<script>
    //    import formMdf from '../../order/local/form-mdf.vue';
    import pageDialog from "@/components/page-dialog.vue";
    import {
        api_get_package,
        api_get_package_speed,
        api_updata_package,
        api_get_currency,
        url_updata_package
    } from "@/api/shipment";
    import {api_get_warehouse, api_get_sku_siblings, api_get_shipping} from '@/api/order-local';
    import {email, integer, extraReg, chinese} from '@/define/validator_reg';

    export default {
//        name:"parcel-information",
        page: {
            devinfo: {
                frontEnd: '张明亮',
                backEnd: '张文宇',
                createTime: '2017-7-5',
                updateTime: '2017-8-28'
            }
        },
        permission: {
            url_updata_package
        },
        data() {
            let checkEmail = (rule, value, callback) => {
                if (value) {
                    return !email.test(value) ? callback(new Error("邮箱格式有误，请重新输入!")) : callback();
                } else {
                    return callback();
                }
            };
            let checkNumber = (rule, value, callback) => {
                if (value) {
                    return !integer.test(value) ? callback(new Error("手机号输入有误，请重新输入！")) : callback()
                } else {
                    return callback();
                }

            };
            let checkTel = (rule, value, callback) => {
                if (value) {
                    return !extraReg.test(value) ? callback(new Error("号码输入有误，请重新输入！")) : callback()
                } else {
                    return callback();
                }

            };
            let checkChinese = (rule, value, callback) => {
                if (value) {
                    return chinese.test(value) ? callback(new Error("不允许输入中文，请更正！")) : callback();
                } else {
                    return callback();
                }
            };
            return {
                visible: false,
                click_edit: false,//物流是否是编辑状态
                click_declare: false,//申报是否是编辑状态
                click_product: false,//货品是否是编辑状态
                click_address: false,//地址编辑状态
                priority_checked: false,
                currency: 'USD',//货币
                steps: [],
                mdfid: 0,
                mdfValue: false,
                mdfTitle: '',
                isEdit: {edit: false},
                btnShow: false,
                showProductList: false,
                tableData: [
                    {
                        a: 1
                    }
                ],
                active: 1,
                last_address: {},
                last_declare: [],
                last_package: {},
                last_product: [],
                information: {
                    order: [],
                    address: {
                        buyer: '',
                        consignee: '',
                        address: '',
                        address2: '',
                        city: '',
                        country_code: '',
                        zipcode: '',
                        tel: '',
                        mobile: '',
                        email: ''
                    },
                    product: [],
                    package: {},
                    declare: []
                },
                warehouseList: [],
                shippingList: [],
                currency_list: [],
                siblingsList: [],
                deliverGoodsList: [],//是否发货标记
                selectedIndex: 0,//添加商品索引标记
                rules: {
                    address: [
                        {required: true, message: "详细地址不能为空", trigger: "blur"}
                    ],
                    tel: [
                        {validator: checkNumber, trigger: "blur"}
                    ],
                    zipcode: [
                        {validator: checkChinese, trigger: "blur,change"}
                    ],
                    mobile: [
                        {validator: checkTel, trigger: "blur"}
                    ],
                    email: [
                        {validator: checkEmail, trigger: "blur"}
                    ],

                }
            }
        },
        mounted() {
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            noFixed(val) {
                return Number(val).toFixed(0);
            },
            toFixed2(val) {
                return Number(val).toFixed(2);
            },
            filterImg(val) {
                return val.replace('_60x60.', '_200x200.');
            }
        },
        methods: {
            open() {
                this.init();
            },
            close_parcel() {
                this.visible = false;
                this.$emit('close-parcel');
            },
            init() {
                console.log(this.order,'order');
                this.$http(api_get_package, this.order.id).then(res => {
                    this.information = res;
                    this.init_product();
                    this.init_deliver_goods(res.product);
                    if (res.package.width === 0) {
                        res.package.width = '';
                    }
                    if (res.package.height === 0) {
                        res.package.height = '';
                    }
                    if (res.package.length === 0) {
                        res.package.length = '';
                    }
                    this.init_warehouse();
                    this.init_shipping();
                    console.log(res);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                this.$http(api_get_package_speed, this.order.id).then(res => {
                    this.steps = res;
                    let active = 0;
                    res.forEach(row => {
                        if (row.time) {
                            active = active + 1;
                        }
                    });
                    this.active = active;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                this.$http(api_get_currency).then(res => {
                    this.currency_list = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            init_product() {
                this.information.product = this.information.product.map(res => {
                    this.get_sku_siblings(res);
                    return [res];
                });
            },
            init_deliver_goods(product) {
                this.deliverGoodsList = [];
                product.forEach(res => {
                    this.deliverGoodsList.push({
                        is_deliver_goods: ''
                    });
                })
            },
            filterTime(val) {
                if (val) return datef("YYYY-MM-dd HH:mm:ss", val);
                return '';
            },
            //释放订单
            release_order() {

            },
            //编辑地址
            edit_address() {
                this.last_address = clone(this.information.address);
                this.click_address = true;
            },
            //保存地址信息
            save_address() {
                let {consignee, buyer_id, country_code, ...address} = this.information.address;
                Object.keys(address).forEach(key => {
                    if (typeof address[key] === 'string') {
                        address[key] = address[key].trim();
                    }
                });
                let data = {
                    address
                };

                if (!address.tel && !address.mobile) return this.$message({message: "请至少填写一种联系方式", type: 'warning'});
                this.$refs.form.validate((bool) => {
                    if (bool) {
                        this.$http(api_updata_package, this.order.id, {data: data}).then(res => {
                            this.$message({type: "success", message: res.message || res});
                            this.click_address = false;
                        }).catch(code => {
                            this.$message({type: "error", message: code.message || code});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey(`save_address`, false);
                            }, 200);
                        });
                    } else {
                        this.$reqKey('save_address', false);
                    }
                });
            },
            //取消保存地址信息
            cancel_address() {
                this.information.address = this.last_address;
                this.click_address = false;
            },
            //编辑物流信息
            edit_logistics() {
                this.last_package = clone(this.information.package);
                this.click_edit = true;
            },
            //保存物流信息
            save_logistics() {
                let information = window.clone(this.information);

                if (information.package.shipping_id === '') {
                    this.$message({type: "error", message: '必须选择邮寄方式'});
                    this.$reqKey(`save_logisticsAdd`, false);
                    return false;
                }
                let addInfo = {// 新增可编辑项，只有再可编辑情况下才传给后端
                    shipping_id: information.package.shipping_id,
                    shipping_name: information.package.shipping_name,
                    warehouse_id: information.package.warehouse_id
                };
                Object.keys(addInfo).forEach(key => {
                    if (typeof addInfo[key] === 'string') {
                        addInfo[key] = addInfo[key].trim();
                    }
                });
                let data = {
                    package: {
                        package_weight: information.package.package_weight,
                        providers_weight: information.package.providers_weight,
                        providers_fee: information.package.providers_fee,
                        shipping_fee: information.package.shipping_fee,
                        width: information.package.width,
                        height: information.package.height,
                        length: information.package.length,
                        prior: information.package.prior,
                    }
                };
                Object.keys(data.package).forEach(key => {
                    if (typeof data.package[key] === 'string') {
                        data.package[key] = data.package[key].trim();
                    }
                });
                if (this.information.can_edit !== 0) {
                    Object.assign(data.package, addInfo);
                }

                if (data.package.package_weight === '') {
                    data.package.package_weight = 0;
                }
                if (data.package.providers_weight === '') {
                    data.package.providers_weight = 0;
                }
                if (data.package.providers_fee === '') {
                    data.package.providers_fee = 0;
                }
                if (data.package.shipping_fee === '') {
                    data.package.shipping_fee = 0;
                }
                if (data.package.width === '') {
                    data.package.width = 0;
                }
                if (data.package.height === '') {
                    data.package.height = 0;
                }
                if (data.package.length === '') {
                    data.package.length = 0;
                }
                this.$http(api_updata_package, this.order.id, {data: data}).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.click_edit = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`save_logisticsAdd`, false);
                    }, 200);
                });
            },
            //取消保存物流信息
            cancel_logistics() {
                this.information.package = this.last_package;
                this.click_edit = false;
            },
            //编辑申报信息
            edit_declare() {
                this.last_declare = clone(this.information.declare);
                this.click_declare = true;
                this.$forceUpdate();
            },
            //保存申报信息
            save_declare() {
                let data = {
                    declare: this.information.declare
                };
                let reg2 = /^[0-9]*$/;
                let reg3 = /^(((ht|f)tps?):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
                let bool = true;
                this.information.declare.find((row, index) => {
                    if (chinese.test(row.goods_name_en) && row.goods_name_en) {
                        this.$message({type: "error", message: `申报产品第${index + 1}个英文报关名不能有汉字`});
                        bool = false;
                        return true;
                    } else if (!reg2.test(row.hs_code) && row.hs_code) {
                        this.$message({type: "error", message: `申报产品第${index + 1}个HScode格式不正确`});
                        bool = false;
                        return true;
                    } else if (!reg3.test(row.sku_url) && row.sku_url) {
                        this.$message({type: "error", message: `申报产品第${index + 1}个url格式不正确`});
                        bool = false;
                        return true;
                    } else if (!row.unit_weight || !row.unit_price) {
                        row.unit_weight = 0;
                        row.unit_price = 0;
                    }
                });
                if (!bool) {
                    return false;
                }
                this.$http(api_updata_package, this.order.id, {data: data}).then(res => {
                    console.log(res);
                    this.$message({type: "success", message: res.message || res});
                    this.click_declare = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            //取消申报信息
            cancel_declare() {
                this.information.declare = this.last_declare;
                this.click_declare = false;
            },
            //添加申报信息
            add_declare() {
                let row = {
                    sku_id: '',
                    goods_name_en: '',
                    goods_name_cn: '',
                    hs_code: '',
                    unit_weight: '',
                    unit_price: '',
                    quantity: '',
                    sku_url: '',
                    declare_currency: this.currency,
                };
                this.information.declare.push(row);
            },
            //刪除申报信息
            del_declare(index) {
                for (let i = 0; i < this.information.declare.length; i++) {
                    if (index.id === this.information.declare[i].id) {
                        this.information.declare.splice(i, 1);
                        return false;
                    }
                }
            },
            //编辑货品信息
            edit_product() {
                this.last_product = clone(this.information.product);
                this.click_product = true;
            },
            //保存货品信息
            update_product(data) {
                this.$http(api_updata_package, this.order.id, {data: data}).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.click_product = false;
                }).catch(code => {
                    if (code.code === 'confirm') {
                        this.$confirm(`${code.message}`, '提示', {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(() => {
                            Object.assign(data, {confirm: true});
                            this.update_product(data);
                        }).catch(() => {
                            return;
                        })
                    } else {
                        this.$message({type: "error", message: code.message || code});
                    }
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`save_product_edit`, false);
                    }, 200);
                });
            },
            save_product() { // 根据数据生成调api的参数
                let information = window.clone(this.information);
                let product = [];
                information.product.forEach((res, index) => {
                    let is_deliver_goods = this.deliverGoodsList[index].is_deliver_goods;
                    if (is_deliver_goods !== '') {
                        if (is_deliver_goods === false) return;
                        product.push({
                            source_id: res[0].order_source_detail_id || '',
                            is_deliver_goods: 1,
                        });
                        return;
                    }
                    res.forEach(row => {
                        let goods = {
                            sku_id: row.sku_id,
                            sku_quantity: row.sku_quantity,
                            type: row.type,
                            source_id: row.order_source_detail_id,
                        };
                        Object.keys(goods).forEach(key => {
                            if (typeof goods[key] === 'string') {
                                goods[key] = goods[key].trim();
                            }
                        });
                        product.push(goods);
                    });
                });
                if (!this.validate_product(product)) return;
                let data = {
                    product: product
                };
                this.update_product(data);
            },
            validate_product(product) {
                let problemObj = product.find(res => {
                    return res.sku_quantity === "" || parseFloat(res.sku_quantity) === 0
                });
                if (!!problemObj) {
                    this.$message({message: "订单商品数量不能为0或者为空!", type: 'warning'});
                    return false;
                }
                return true;
            },
            //取消保存货品信息
            cancel_product() {
                this.information.product = this.last_product;
                this.init_deliver_goods(this.information.product);
                this.click_product = false;
            },
            //删除货品信息
            //因为货品删除完后有一个交互，因此这里再删除最后一条货品信息时做了一个伪删除处理
            del_product(product, row, index) {
                console.log('del product', product, row, index);
                if (product.length > 1) {
                    let deleteIndex = product.indexOf(row);
                    product.splice(deleteIndex, 1);
                } else if (product.length === 1) {
                    Object.assign(product[0], {
                        type: '',
                        sku_thumb: '',
                        sku: '',
                        sku_title: '',
                        remark: '',
                        lock_quantity: '',
                        sku_quantity: '',
                    })
                    this.deliverGoodsList[index].is_deliver_goods = false;
                }
            },
            is_require(h, {column, $index}) {
                if (this.click_product) {
                    return h(
                        'div',
                        [
                            h('span', {}, '数量'),
                            h('button', {
                                'class': "el-button el-button--primary el-button--mini ml-xs", on: {
                                    click: this.add
                                }
                            }, '添加商品')
                        ]
                    )
                } else {
                    return h('span', {}, '数量')
                }
            },

            //查看订单
            view_order(order) {
                let params = {
                    mdfTitle: `查看 ${order} 订单`,
                    mdfid: order,
                    isEdit: {edit: false},
                    mdfValue: true,
                    btnShow: false,
                };
                console.log('ddfff');
                this.$emit('view-order', params);
            },
            //选择优先级
            click_prior() {
                this.information.package.prior = this.information.package.prior === 0 ? 1 : 0;
            },
            //改变货币
            changeCurrency() {
                this.information.declare.forEach(row => {
                    row.declare_currency = this.currency;
                })
            },
            placeholder() {
                if (this.shippingList.length <= 0) return '暂无数据';
                return '请选择运输方式'
            },
            change_warehouse() {
                this.information.package.shipping_id = '';
                this.init_shipping();
            },
            change_shipping() {
                let item = this.shippingList.find(res => res.value === this.information.package.shipping_id);
                console.log('shipping change', item);
                if (item) {
                    this.information.package.shipping_name = item.label;
                    this.information.package.estimated_fee = item.cny_amount;
                    return;
                }
                this.information.package.estimated_fee = 0;

            },
            init_warehouse() {
                console.log('get warehouse');
                this.$http(api_get_warehouse).then(res => {
                    this.warehouseList = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            init_shipping() {
                console.log('get shipping list');
                this.shippingList = [];
                if (this.information.package.warehouse_id !== 0) {
                    let params = {
                        warehouse_id: this.information.package.warehouse_id,
                        country_code: this.information.address.country_code,
                        package_id: this.information.package.id,
                    };
                    this.$http(api_get_shipping, params).then(res => {
                        this.shippingList = res.map(row => {
                            return {
                                label: `${row.carrier_name}>>${row.shipping_method_name}`,
                                value: row.shipping_id,
                                cny_amount: row.cny_amount,
                            }
                        });
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                }
            },
            add() {
                this.showProductList = true;
            },
            // 添加商品，当此时该平台应该没有数据时，添加前先删除掉伪数据
            add_product(val, goods) {
                let curProduct = window.clone(this.information.product[this.selectedIndex]);
                let source_id = curProduct[0].order_source_detail_id;

                // 删除伪数据操作
                if (curProduct.length === 1 && this.deliverGoodsList[this.selectedIndex].is_deliver_goods !== '') {
                    this.information.product[this.selectedIndex].splice(0, 1);
                }
                val.forEach(sel => {
                    if (curProduct.find(row => {
                            return row.sku_id === sel.id
                        })) {
                        return this.$message({message: `请不要重复添加 ${sel.spu_name}商品`, type: 'warning'});
                    } else {
                        let obj = {
                            remark: '',
                            sku_title: sel.spu_name,
                            sku_quantity: 1,
                            sku_id: sel.id,
                            sku: sel.sku,
                            sku_thumb: sel.thumb,
                            order_source_detail_id: source_id,
                            type: 1,
                            status: sel.status_txt,
                        };
                        this.get_sku_siblings(obj);
                        this.deliverGoodsList[this.selectedIndex].is_deliver_goods = '';
                        this.information.product[this.selectedIndex].push(obj);
                    }
                });
            },
            //获取sku列表
            get_sku_siblings(row) {
                this.$http(api_get_sku_siblings, row.sku_id).then(res => {
                    res = res.map(item => {
                        return {
                            value: item.id,
                            label: item.sku
                        }
                    });
                    this.$set(row, 'siblingsList', res);
                })
            },
            set_select(index) {
                this.selectedIndex = index;
            },
            change_sku(row) {//改变sku_id时相应改变其sku值
                row.sku = row.siblingsList.find(sku => sku.value === row.sku_id).label;
            }
        },
        computed: {
            isEmpty() {
                return this.deliverGoodsList.find(res => res.is_deliver_goods === false);
            },
            isProductEdit() {
                return this.information.can_edit !== 0 && !this.information.package.shipping_time;
            },
            isLogisticsEdit() {
                return !this.information.package.shipping_time;
            },
            isDeclareEdit() {
                return !this.information.package.shipping_time;
            },
            countryTitle() {
                if (this.countryList instanceof Array) {
                    let cur = this.countryList.findRet(row => {
                        if (row.country_code === this.form.country_code) {
                            return row.country_en_name;
                        }
                    });
                    return cur;
                }
            }
        },
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.click_edit = false;
                this.click_declare = false;
                this.visible = val;
            },
        },
        props: {
            value: {},
            order: {
                required: true,
                type: Object
            },
        },
        components: {
            pageDialog,
            tabs: require('../../../components/tabs.vue').default,
            tabHead: require('../../../components/tab-head.vue').default,
            tabItem: require('../../../components/tab-item.vue').default,
            uiTip: require('../../../components/ui-tip.vue').default,
            integerZeroInput: require('../../../components/integer-zero-input').default,
            addGoods: require('../../../api-components/add-goods.vue').default,
        },
    }
</script>
