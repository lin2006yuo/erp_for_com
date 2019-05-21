<template>
    <div class="p-look-list">
        <page-dialog v-model="addVisable" @open="open" size="large" :title="`查看采购单号：${lookData.purchase_order_code} 信息`"
                     @change="change_dialog" width="80%" left="10%">

            <tabs>
                <tab-head
                    class="tab-heads"
                    :navs="[
                    {label:'基本信息',action:'basic'},
                    {label:'物流信息',action:'logistics'},
                    {label:'商品信息',action:'product'},
                    {label:'采购计划备注',action:'procurement-note'},
                    {label:'操作日志',action:'operation-log'}]">
                    <el-row>
                        <span>采购单号：{{lookData.purchase_order_code}}</span> <span class="ml-sm  mr-sm">{{lookData.status|statusFilter}}</span>
                        <span>采购计划编号：{{lookData.purchase_plan_number}}</span>
                    </el-row>
                    <el-row>
                        <div class="mt-sm" style=" text-align: center;">
                            <el-steps :space="110" :align-center="true" :active="stepsStatus" finish-status="success">
                                <el-step title="等待下单" :description="filterTime(lookData.create_time)"></el-step>
                                <el-step title="等待到货" :description="filterTimeSelf(lookData.wait_arrival_time)"></el-step>
                                <el-step title="部分到货等待剩余" :description="filterTime(lookData.wait_partial_arrival_surplus)"></el-step>
                                <el-step title="部分到货不等待剩余" :description="filterTime(lookData.no_wait_partial_arrival_surplus)"></el-step>
                                <el-step title="全部到货" :description="filterTime(lookData.full_arrival_time)"></el-step>
                                <el-step title="已作废" :description="filterTime(lookData.invalid_time)"></el-step>
                                <el-step title="未申请付款"></el-step>
                                <el-step title="已申请付款"></el-step>
                                <el-step title="已取消付款"></el-step>
                                <el-step title="已付款"></el-step>
                                <el-step title="部分付款"></el-step>
                            </el-steps>
                        </div>
                    </el-row>
                </tab-head>
                <tab-item label="基本信息" id="basic">
                    <el-form :model="lookData" label-width="120px" :rules="rules" ref="form1">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="采购仓库：" prop="warehouse_id" required>
                                    <span v-if="!edit">{{lookData.warehouse}}</span>
                                    <el-select v-if="edit" v-model="lookData.warehouse_id" placeholder="请选择"
                                               class="default-width">
                                        <el-option
                                            :key="item.id"
                                            v-for="item in depots"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="采购人员：" prop="purchase_user_id" required>
                                    <span v-if="!edit">{{lookData.purchaser}}</span>
                                    <el-select v-if="edit" v-model="lookData.purchase_user_id" placeholder="请选择"
                                               class="default-width">
                                        <el-option
                                            :key="item.id"
                                            v-for="item in buyers"
                                            :label="item.realname"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="供应商：" prop="supplier_id" required>
                                    <span v-if="!edit">{{lookData.supplier}}</span>
                                    <el-select v-if="edit" v-model="lookData.supplier_id" placeholder="请选择"
                                               class="default-width">
                                        <el-option
                                            :key="item.id"
                                            v-for="item in suppliers"
                                            :label="item.company_name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="供应链专员：">
                                    <span v-if="!edit">{{lookData.supply_chain_specialist|emptyByDefault}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" v-if="!edit">
                                <el-form-item label="贴标套袋：">
                                    <span>{{lookData.label_deck|filterLabelDeck}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="!edit">
                                <el-form-item label="供应链金融：">
                                    <span>{{lookData.supply_chain_finance}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" v-if="!edit">
                                <el-form-item label="是否能退货：">
                                    <span>{{lookData.return_goods|filterReturnGoods}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="!edit">
                                <el-form-item label="退货天数：">
                                    <span>{{lookData.return_goods_data|filterReturnGoodsData}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-table
                        :data="baseTable"
                        highlight-current-row
                        style="width: 100%">
                        <el-table-column
                            label="币种"
                            width="45"
                            inline-template>
                            <div class="ellipsis" :title="currency!=='CNY' ? `1 ${currency}=${lookData.rate} CNY` : ''">
                                <span>{{currency}}</span>&nbsp;<span v-if="currency!=='CNY'">({{`1 ${currency}=${lookData.rate} CNY`}}))</span>
                            </div>
                        </el-table-column>
                        <el-table-column
                            label="货款"
                            inline-template>
                            <div>
                                <span>{{lookData.amount | filterNumber}}</span>
                            </div>
                        </el-table-column>
                        <el-table-column
                            inline-template
                            label="实际应付货款">
                            <div>
                                <span>{{lookData.payable_amount| filterNumber}}</span>
                            </div>
                        </el-table-column>
                        <el-table-column
                            label="运费"
                            inline-template>
                            <div>
                                <span>{{lookData.shipping_cost | filterNumber}}</span>
                            </div>
                        </el-table-column>
                        <el-table-column
                            label="实际运费"
                            inline-template>
                            <div>
                                <span>{{lookData.actual_shipping_cost | filterNumber}}</span>
                            </div>
                        </el-table-column>
                        <el-table-column
                            inline-template
                            label="发票类型">
                            <div class="ellipsis" :title="lookData.invoice">{{lookData.invoice}}</div>
                        </el-table-column>
                        <el-table-column
                            inline-template
                            label="开票加收税点">
                            <div>{{lookData.tax_rate}}</div>
                        </el-table-column>
                        <el-table-column
                            label="税额"
                            inline-template>
                            <div v-if="stepsStatus < 3">- -</div>
                            <div v-else>{{lookData.tax_money| filterAli}}</div>
                        </el-table-column>
                        <el-table-column
                            inline-template
                            label="优惠金额">
                            <div>
                                <span>{{lookData.discount_amount | filterNumber}}</span>
                            </div>
                        </el-table-column>
                        <el-table-column
                            inline-template
                            label="折扣金额">
                            <div>{{lookData.refund_amount | filterNumber}}</div>
                        </el-table-column>
                        <el-table-column
                            label="退款金额"
                            inline-template>
                            <div>{{lookData.returned_amount | filterNumber}}</div>
                        </el-table-column>
                        <el-table-column
                            inline-template
                            label="付款金额">
                            <div>{{lookData.actual_payment | filterNumber}}</div>
                        </el-table-column>
                        <el-table-column
                            label="实际付款"
                            inline-template>
                            <div>{{lookData.actual_payed_amount | filterNumber}}</div>
                        </el-table-column>
                        <el-table-column
                            inline-template
                            label="阿里订单金额">
                            <div>
                                <span v-if="lookData.external_number">{{lookData.ali_order_account | filterAli}}</span>
                                <span v-else>- -</span>
                            </div>
                        </el-table-column>
                    </el-table>
                </tab-item>
                <tab-item id="logistics" label="物流信息">
                    <el-form :model="lookData" label-width="90px" label="left" ref="form2" :rules="rules">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="外部流水号：" style="padding-left: 30px;">
                                    <span v-if="!isEdit">{{lookData.external_number}}</span>
                                    <ui-limit-number v-model="lookData.external_number"
                                                     v-if="isEdit"
                                                     @change="check_chinese(lookData)"
                                                     :limit="0"
                                                     class="default-width inline"
                                                     :disabled="balanceType"
                                                     :class="bordColor === true ? 'border-color-red' : ''"
                                                     :max-length="18"
                                                     :min="0">
                                    </ui-limit-number>
                                    <el-button type="primary" size="mini" class="ml-md inline"
                                               @click="get_tracking_number"
                                               :disabled="editAble || stepsStatus !== 2"
                                               v-if="lookData.external_number">获取运单号
                                    </el-button>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="运费：" class="inline" style="padding-left: 30px;">
                                    <el-input v-if="lookData.payment_status == '5'&& isEdit"
                                              v-model="lookData.shipping_cost" style="width:150px" class="inline"
                                              type="number" min="0" step="0.01"
                                              @blur="blur_shipping_cost()"></el-input>
                                    <span v-else>{{lookData.shipping_cost | filterNumber}}</span>
                                    (<span>实际运费：{{lookData.actual_shipping_cost | filterNumber}}</span>)
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-for="(item,index) in lookData.logistics" :key="item.id">
                            <el-form :model="item" ref="item" :rules="rules">
                                <el-col :span="4">
                                    <div class="inline">
                                    <span v-show="item.is_from_input == 0">
                                      <img src="../../../assets/relevance.png" title="自动获取">
                                    </span>
                                        <span v-show="item.is_from_input == 1">
                                       <img src="../../../assets/handwork.png" title="手动添加">
                                    </span>
                                    </div>
                                    <el-form-item label="运输方式：" class="inline"
                                                  style="width: 190px;padding-left: 5px;"
                                                  prop="logistics_company_name" required>
                                    <span v-if="isEdit">
                                          <allow-create-select v-model="item.logistics_company_name"
                                                               style="width: 120px;"></allow-create-select>
                                    </span>
                                        <span v-else>{{item.logistics_company_name}}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="运单号：" class="logistics-bill-on" style="margin-left: 25px" prop="logistics_bill_no"
                                                  required>
                                        <el-input v-if="isEdit"
                                                  v-model="item.logistics_bill_no"
                                                  :min="0"
                                                  @change="set_value($event,item)"
                                                  style="width:110px;"
                                                  class="inline"></el-input>
                                        <span
                                            v-else
                                            class="inline select-link-btn p-table-list-td-text"
                                            :title="item.logistics_bill_no"
                                            @click="get_logistics(lookData.purchase_order_code,item)">{{item.logistics_bill_no}}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item style="margin-left: 5px" label="发货时间：">
                                        <el-date-picker
                                            v-model="item.delivered_time"
                                            style="width:115px;"
                                            type="date"
                                            placeholder="选择日期"
                                            :picker-options="pickerArriveDate"
                                            v-if="isEdit">
                                        </el-date-picker>
                                        <span v-else>{{item.delivered_time|dataFilter}}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="预计到达日期：" class="inline">
                                        <el-date-picker
                                            v-model="item.expect_arrive_date"
                                            style="width:115px;"
                                            type="date"
                                            placeholder="选择日期"
                                            :picker-options="pickerArriveDate"
                                            v-if="isEdit">
                                        </el-date-picker>
                                        <span v-else>{{item.expect_arrive_date|dataFilter}}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item label="实际到货日期：" class="inline">
                                        <span>{{item.real_arrive_date|dataFilter}}</span>
                                    </el-form-item>
                                    <div class="mt-mini inline" @click="delete_tracks(index)"
                                         v-if="index>0&&isEdit&&item.is_from_input == 1">
                                        <img src="../../../assets/delete(2).png">
                                    </div>
                                    <div class="mt-mini inline" @click="add_Edit" v-if="isEdit" v-model="add2Edit">
                                        <img src="../../../assets/add2.png" style="vertical-align: sub;">
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="紧急拦截：">
                                        <el-select v-if="isEdit"
                                                   v-model="item.intercept_status"
                                                   class="inline s-width-default">
                                            <el-option
                                                :key="item.value"
                                                v-for="item in interceptList"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <span v-else>{{filterIntercept(item.intercept_status)}}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1" v-if="!(lookData.status === 21)&&item.real_arrive_date!==0&&item.is_not_unpack===1">
                                    <request-button type="primary" size="small" class="inline btn-tag" req-key='long_time' @click="long_time(item)">标记</request-button>
                                </el-col>
                            </el-form>
                        </el-row>
                        <el-row v-for="(item,index) in logisticsData" :key="index" v-if="isEdit && addEdit"
                                v-model="addEdit">
                            <el-form :model="item" ref="item" :rules="rules">
                                <el-col :span="4">
                                    <div class="inline" style="width: 16px;">
                                      <span v-if="item.logistics_company_name">
                                        <img src="../../../assets/handwork.png">
                                      </span>
                                    </div>
                                    <el-form-item label="运输方式：" class="inline"
                                                  style="width: 190px;padding-left: 5px;"
                                                  prop="logistics_company_name" required>
                                    <span v-if="isEdit">
                                        <allow-create-select v-model="item.logistics_company_name"
                                                             style="width: 120px;"></allow-create-select>
                                    </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="运单号：" style="margin-left: 25px" prop="logistics_bill_no"
                                                  required>
                                        <el-input v-if="isEdit"
                                                  v-model="item.logistics_bill_no"
                                                  style="width:110px;"
                                                  :min="0"
                                                  @change="set_value($event,item)"
                                                  class="inline"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item style="margin-left: 5px" label="发货时间：">
                                        <el-date-picker
                                            v-model="item.delivered_time"
                                            style="width:115px;"
                                            type="date"
                                            placeholder="选择日期"
                                            :picker-options="pickerArriveDate"
                                            v-if="isEdit">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="预计到达日期：" class="inline">
                                        <el-date-picker
                                            v-model="item.expect_arrive_date"
                                            style="width:115px;"
                                            type="date"
                                            placeholder="选择日期"
                                            :picker-options="pickerArriveDate"
                                            v-if="isEdit">
                                        </el-date-picker>
                                    </el-form-item>
                                    <div class="inline">
                                        <div v-if="deleteShow">
                                            <div class="mt-mini inline" @click="delete_track(index)">
                                                <img src="../../../assets/delete(2).png">
                                            </div>
                                        </div>
                                        <div v-else>
                                            <div class="mt-mini inline" @click="delete_track(index)" v-if="index>0">
                                                <img src="../../../assets/delete(2).png">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mt-mini inline" @click="add_track" v-if="isEdit">
                                        <img src="../../../assets/add2.png" style="vertical-align: sub;">
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label="紧急拦截：">
                                        <el-select v-if="isEdit"
                                                   v-model="item.intercept_status"
                                                   class="inline s-width-small">
                                            <el-option
                                                :key="item.value"
                                                v-for="item in interceptList"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <span v-else>{{filterIntercept(item.intercept_status)}}</span>
                                    </el-form-item>
                                </el-col>
                            </el-form>
                        </el-row>
                        <div class="fr" v-if="!isEdit">
                            <el-button size="mini" type="primary"
                                       v-if="isShowEdit"
                                       @click="edit_logistics"
                                       :disabled="lookData.status == 21||lookData.status == -1 || editAble">编辑
                            </el-button>
                        </div>
                        <div class="fr" v-else>
                            <el-button size="mini" type="primary" @click="save_logistics">确定</el-button>
                            <el-button size="mini" @click="close_logistics">取消</el-button>
                        </div>
                    </el-form>
                </tab-item>
                <tab-item id="product" label="商品信息">
                    <div class="ml-lg" v-if="edit">
                        <el-button type="primary" size="mini" @click="add_goods">添加商品</el-button>
                    </div>
                    <div class="fr mb-xs mr-xs" v-if="isShowCheck">
                        <label class="inline ml-sm" title="请选择发货状态">发货状态：</label>
                        <el-checkbox class="inline" :indeterminate="isIndeterminate" v-model="checkAllStatus"
                                     @change="handleCheckAllChange">全选
                        </el-checkbox>
                        <el-checkbox-group v-model="checkedStatus" class="inline ml-sm"
                                           @change="handleCheckedStatusChange">
                            <el-checkbox v-for="status in statusLists" :label="status" :key="status">{{status}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <el-table
                        highlight-current-row
                        class="mt-sm scroll-bar product-list-table"
                        :data="filterLookList"
                        :max-height="495"
                        style="width: 100%;min-height: 225px;">
                        <el-table-column width="70" label="图片">
                            <el-table-column
                                width="70"
                                label="汇总">
                                <template slot-scope="scope">
                                    <el-popover
                                        v-if="scope.row.thumb"
                                        placement="right"
                                        trigger="hover">
                                        <img :src="scope.row.thumb | filterImage"
                                             width="200px"
                                             height="200px">
                                        <span slot="reference">
                                <img :src="scope.row.thumb"
                                     @click="click_sku_img(scope.row.thumb)"
                                     height="60px" width="60px"
                                     style="border:none">
                                            </span>
                                    </el-popover>
                                    <img src="/static/error-picture-128.png"
                                         v-else
                                         height="60px" width="60px"
                                         style="border:none">
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                            label="货号(SKU)/别名"
                            min-width="80">
                            <el-table-column min-width="80" label="">
                                <template slot-scope="scope">
                                    <div>
                                        <ui-tip :content="`${scope.row.sku}`" :width="98"></ui-tip>
                                        <ui-tip :content="`${scope.row.sku_alias}`" :width="98"></ui-tip>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                            label="货品名称"
                            min-width="150">
                            <el-table-column min-width="150" label="">
                                <template slot-scope="scope">
                                    <div :title="scope.row.sku_name">
                                        {{scope.row.sku_name}}
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            min-width="40"
                            label="可用库存">
                            <el-table-column min-width="40" label="">
                                <template slot-scope="scope">
                                    {{scope.row.available_qty}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            min-width="40"
                            label="上次采购数">
                            <el-table-column min-width="40" label="">
                                <template slot-scope="scope">
                                    <span>{{scope.row.last_purchase_qty}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            min-width="40"
                            label="本次采购数">
                            <el-table-column min-width="40" label="">
                                <template slot-scope="scope">
                                    <ui-input :edit="edit" v-model="scope.row.qty"
                                              @input="chang_(scope.row)"></ui-input>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            min-width="40"
                            label="良品数">
                            <el-table-column min-width="40" label="">
                                <template slot-scope="scope">
                                    <span>{{scope.row.expected_int_qty}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            min-width="40"
                            label="入库数">
                            <el-table-column min-width="40" label="">
                                <template slot-scope="scope">
                                    <span>{{scope.row.in_qty}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            min-width="40"
                            label="次品数">
                            <el-table-column min-width="40" label="">
                                <template slot-scope="scope">
                                    <span>{{scope.row.expected_defective_qty}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            min-width="50"
                            :label="`采购单价${currency?`(${currency})`:''}`">
                            <el-table-column min-width="50" label="">
                                <template slot-scope="scope">
                                    <span>{{scope.row.price| filterNumber}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            min-width="60"
                            :label="`最后一次采购单价${currency?`(${currency})`:''}`">
                            <el-table-column min-width="60" label="">
                                <template slot-scope="scope">
                                    <span>{{scope.row.price| filterNumber}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            min-width="50"
                            label="商品重量(G)">
                            <el-table-column min-width="50" label="">
                                <template slot-scope="scope">
                                    <span>{{scope.row.weight}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            :label="`当前供应商最新报价${currency?`(${currency})`:''}`"
                            min-width="60">
                            <el-table-column min-width="60" label="">
                                <template slot-scope="scope">
                                    <span>{{scope.row.supplie_price| filterNumber}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                            min-width="50"
                            label="是否为替换品">
                            <el-table-column min-width="50" label="">
                                <template slot-scope="scope">
                                    <select-text :edit="edit" v-model="scope.row.is_replace" placeholder="请选择"
                                                 @input="chang_(scope.row)">
                                        <el-option
                                            :key="item.value"
                                            v-for="item in options"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </select-text>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                            show-overflow-tooltip
                            min-width="60"
                            :label="`入库总额${currency?`(${currency})`:''}`">
                            <el-table-column min-width="60" :label="inQtyAmount| filterNumber">
                                <template slot-scope="scope">
                                    <span>{{scope.row.in_qty_amount| filterNumber}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                            min-width="230"
                            label="备注">
                            <el-table-column min-width="230" label="">
                                <template slot-scope="scope">
                                    <div title="点击可更改备注" @click="cur_click(scope.row)"
                                         v-if="(lookData.status==0 || lookData.status==10)&&!scope.row.isEdit_remark">
                                        <span v-if="scope.row.remark" class="operate">{{scope.row.remark}}</span>
                                        <span v-else class="operate">点击可更改备注</span>
                                    </div>
                                    <el-input
                                        v-else-if="(lookData.status==0 || lookData.status==10)&&scope.row.isEdit_remark"
                                        v-model="scope.row.remark"
                                        type="textarea"
                                        :autofocus="true"
                                        @blur="blur_shipping_redact(scope.row)"></el-input>
                                    <div v-else>
                                        <ui-tip :content="`${scope.row.remark}`" :width="98"></ui-tip>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                            width="50"
                            label="操作">
                            <el-table-column width="50" label="">
                                <template slot-scope="scope">
                                    <div v-if="edit">
                                        <span class="operate" @click="del_sku(scope.row)">删除</span>
                                        |
                                        <span class="operate" v-if="scope.row.link">
                             <a class="link" :href="`${scope.row.link}`" target="_blank">下单</a>
                            </span>
                                        <span class="operate" v-else @click="order_none">下单</span>
                                    </div>
                                    <div v-else>
                              <span class="operate" v-if="scope.row.link">
                               <a class="link" :href="`${scope.row.link}`" target="_blank">下单</a>
                              </span>
                                        <span class="operate" v-else-if="editAble">下单</span>
                                        <span class="operate" v-else @click="order_none">下单</span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        style="text-align: right;"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="[20, 50, 100, 200,500]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="count">
                    </el-pagination>
                </tab-item>
                <tab-item id="procurement-note" label="采购计划备注">
                    <div class="p-look-plan-remark">
                        <div class="p-look-plan-remark-list">
                            备注：
                            <div class="p-look-plan-remark-list" v-html="filterRemark"></div>
                        </div>
                    </div>
                </tab-item>
                <tab-item id="operation-log" label="操作日志">
                    <el-table
                        :data="actionLog"
                        height="200"
                        highlight-current-row
                        style="width: 100%">
                        <el-table-column
                            label="操作人"
                            width="100"
                            inline-template>
                            <ui-tip :content="`${row.operater_user}`" :width="98"></ui-tip>
                        </el-table-column>
                        <el-table-column
                            label="日期"
                            width="150"
                            inline-template>
                            <span>{{row.operate_time|dataFilter(true)}}</span>
                        </el-table-column>
                        <el-table-column
                            inline-template
                            width="150"
                            label="操作状态">
                            <span>{{row.status|statusFilter}}</span>
                        </el-table-column>
                        <el-table-column
                            label="操作记录"
                            inline-template>
                            <div>
                                <span class="inline">{{row.operate_content}}</span>
                                <div v-for="(item,index) in row.img" :key="index" v-if="row.img" class="inline">
                                    <el-popover
                                        placement="right"
                                        trigger="hover">
                                        <img v-lazy="sku_image(item)" width="200px" height="200px">
                                        <span slot="reference">
                                            <img v-lazy="small_img(item)"
                                                 @click="search_img(item)"
                                                 height="60px" width="60px" style="border:none">
                                         </span>
                                    </el-popover>
                                </div>
                            </div>
                        </el-table-column>
                    </el-table>
                    <div class="mt-xs" v-if="!editAble&&!isInvalidApply&&!isInvalidAudit">
                        <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="请输入内容"
                            v-model="mark">
                        </el-input>
                        <el-row>
                            <el-button type="primary" size="mini" class="fr mt-xs" @click="add_mark" :disabled="isMark">
                                添加备注
                            </el-button>
                        </el-row>
                    </div>
                </tab-item>
                <div class="row mt-sm" v-if="editAble||isInvalidApply||isInvalidAudit">
                    <el-row>
                        <label v-if="editAble" class="inline">请填写作废的原因: </label>
                        <label v-if="isInvalidApply" class="remark-sale-header">请填写申请作废的原因: </label>
                        <label v-if="isInvalidAudit" class="remark-sale-header">请填写审批备注: </label>
                        <label v-if="editAble" class="inline ml-sm">图片附件：</label>
                        <image-upload v-if="editAble" label="上传附件" class="inline" :thumbnail-mode="true" :init="file1" ref="images1"></image-upload>
                    </el-row>
                    <el-row>
                        <el-input
                            type="textarea"
                            class="mt-sm"
                            :autosize="{ minRows: 5, maxRows: 8}"
                            placeholder="请添加备注"
                            v-model="mark">
                        </el-input>
                    </el-row>
                    <label v-if="isInvalidApply" style="display: inline;margin-top: 10px;float: left;">图片附件：</label>
                    <image-upload v-if="isInvalidApply" :thumbnail-mode="true" label="上传附件"
                                  class="inline mt-sm mb-lg" ref="images" :init="file"></image-upload>
                </div>
            </tabs>
            <add-goods v-model="looklistVisable" @add-goods="selected"></add-goods>
            <div class="clear p-look-list-count">
                <label-item label="货品种类数：">
                    <span>{{purchase_count}}</span>
                </label-item>
                <label-item class="ml-sm" label="货品总数量：">
                    <span>{{purchase_sum}}</span>
                </label-item>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="edit" size="mini" @click="keep_edit">保 存</el-button>
                <el-button size="mini" v-if="edit" @click="cancel">取 消</el-button>
                <el-button type="primary" size="mini" v-if="editAble" @click="cancel_">作 废</el-button>
                <el-button type="primary" size="mini" v-if="isInvalidApply" @click="invalid_apply">申请作废</el-button>
                <div class="inline mb-mini" v-if="isInvalidAudit">
                    <el-button type="primary" size="mini" @click="invalid_apply('pass')">审批通过</el-button>
                    <el-button type="primary" size="mini" @click="invalid_apply('refuse')">审批不通过</el-button>
                </div>
                <el-button size="mini" @click="cancel">关 闭</el-button>
            </div>
        </page-dialog>
        <look-logistics v-model="showLogistics"
                        :title="title"
                        :loading-logistics="loadingLogistics"
                        :logistics-data="logisticsData">
        </look-logistics>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus">
    .p-look-list {
        .operat-color {
            color: #69f;
        }
        .logistics-bill-on{
            .el-form-item__content {
                max-width 72%
                .select-link-btn {
                    margin-bottom 3px;
                    cursor: pointer;
                    font-size: 1.2rem;
                    color: #6699FF;
                    max-width 100%;
                    &:hover {
                        text-decoration: underline;
                    }
                    &:active {
                        color: #397180;
                    }
                }
            }
        }
        .btn-tag{
            margin-left 13px;
        }
        table.template td, .el-table td, table.template th, .el-table th {
            padding 0;
        }
        .el-table__body-wrapper {
            overflow-x: hidden;
        }
        .el-input-number {
            width: 120px;
        }
        div.el-textarea {
            width: 100%;
        }
        .page-dialog .dialog__body {
        }
        .default-width {
            width: 50%;
        }
        .border-color-red {
            .el-input__inner {
                border-color red;
            }
        }
        .other-width {
            width: 20%;
        }
        .del {
            cursor: pointer;
            &:hover {
                background: #FF4949;
                color: #ffffff;
            }
        }
        .link:hover {
            text-decoration: none;
        }
        .page-card .body {
            padding-left: 0;
        }
        .el_card_remark {
            .remark-sale-look {
                overflow-y: hidden;
                width: 190px;
                height: 158px;
                position: absolute;
                bottom: 10px;
                right: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background: #fff;
                padding: 0 10px;
                z-index: 999;
                .remark-sale-header {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 25px;
                    padding-left: 20px;
                    padding-top: 5px;
                    background-color: #fff;
                }
                .remark-sale-body {
                    overflow-y: auto;
                    position: absolute;
                    top: 30px;
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
        }
        .el-row {
            .el-form {
                .el-form-item__content {
                    float: left;
                }
            }
        }
        .p-look-list-count {
            font-weight: bold;
            margin-bottom: 10px;
            position absolute;
            bottom 10px;
        }
        .p-look-plan-remark {
            margin-bottom 20px
            .p-look-plan-remark-list {
                padding-left: 30px;
            }
        }
        .product-list-table{
            th > .cell{
                line-height 16px;
                padding 5px 0;
            }
        }
    }

</style>
<script>
    import card from "../../../components/card.vue"
    import pageDialog from "../../../components/page-dialog.vue"
    import addGoods from "../../../api-components/add-goods.vue"
    import {
        publish_edit_depot,
        publish_edit_user,
        publish_edit_supplier,
        publish_edit_carrier,
        api_publish_look_sku,
        api_log_detail,
        api_publish_add_sku,
        api_update_detail,
        api_add_mark,
        api_get_tracking_number,
        api_purchase_long_time,
        api_purchase_order_logistics,
        api_logistics_detail,
        api_update_logistics,
        api_purchase_order_remarks
    } from "../../../api/purchase";
    import uiInput from "../../../components/ui-input.vue";
    import {chinese} from '../../../define/validator_reg';
    import TabItem from "@/components/tab-item";

    const statusOptions = [
        '未到货',
        '已到货',
        '部分到货',
    ];
    export default {
        page: {
            devinfo: {
                frontEnd: '张兵根;徐梦娇;黎宏珍',
                backEnd: '杨伟权;谭斌',
                createTime: '2017-1-14',
                updateTime: '2017-8-22'
            }
        },
        data() {
            var checkChinese = (rule, value, callback) => {
                setTimeout(() => {
                    if (chinese.test(value)) {
                        callback(new Error('请不要输入中文'));
                    } else {
                        callback();
                    }
                });
            };
            return {
                baseTable: [{
                    test: 1
                }],
                isShowCollect: true,
                true_collect_show: true,
                isShowEditBase: true,
                isShowBase: false,
                formData: {},
                refundTitle: '',
                refundVisable: false,
                visible2:false,
                bordColor: false,
                test: [],
                expressList: [],
                isEdit: false,
                addEdit: false,
                add2Edit: true,
                deleteShow: false,
                textarea: "",
                page: 1,
                pageSize: 20,
                count: 0,
                addVisable: false,
                showRemark: false,
                looklistVisable: false,
                actionLog: [],
                lookList: [],
                lookListData: {},
                inQtyAmount:'',
                options: [
                    {label: "是", value: 1},
                    {label: "否", value: 0},
                ],
                mark: "",
                depots: [],
                buyers: [],
                suppliers: [],
                transports: [],
                addSkuid: [],
                delSkuid: [],
                selects: [],
                rules: {
                    logistics_company_name: [{required: true, message: '运输方式不能为空', trigger: 'change'}],
                    logistics_bill_no: [{required: true, message: '运单号不能为空', trigger: 'change'},
                        {validator: checkChinese, trigger: 'blur'}],
                },
                cloneData: {},
                trackingNumberData: {},
                logisticsData: [
                    {
                        purchase_id: '',
                        logistics_bill_no: '',
                        logistics_company_name: '',
                        delivered_time: '',
                        expect_arrive_date: ''
                    }],
                pickerArriveDate: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                file: [],
                file1: [],
                statusLists: statusOptions,
                checkAllStatus: true,
                checkedStatus: statusOptions,
                isIndeterminate: false,
                loadingLogistics: true,
                showLogistics: false,
                title: '',
                imgPath: '',
                imgDialog: false,
                timerLongTime:null,
                interceptList: [
                    {label: '未启用', value: 0},
                    {label: '紧急入库', value: 1},
                    {label: '联系采购员', value: 2}
                ]
            }
        },
        /*      supplier_balance_type => 结算方式
               3 => '款到发货',
               4 => '货到付款',
               5 => '定期结算-周结周付',
               6 => '定期结算-半月结半月付',
               7 => '定期结算-月结月付',
               8 => '定期结算-月结2月付',
               9 => '定期结算-月结3月付',
               11 => '阿里30天',
               12 => '阿里现结',
               13 => '跨境宝-阿里现结',
               14 => '跨境宝-阿里30天',
               15 => '跨境宝-阿里60天',
               16 => '跨境宝-阿里20天',
               18 => '跨境宝-阿里7天',
               19 => '阿里20天',
               20 => '阿里7天',
               21 => '阿里60天',
               22 => '阿里45天',
               23 => '阿里90天',
               24 => '跨境宝-阿里45天',
               25 => '跨境宝-阿里90天',
               0 => '',*/
        computed: {
            balanceType() {
                let arrType = [5,6,7,8,9];
                return arrType.includes(this.lookData.supplier_balance_type);
            },
            currency() {
                return this.lookData.currency_code
            },
            filterRemark() {
                return (!!this.lookData.remark) ? this.lookData.remark.replace(/\n/g, '<br/>') : '';
            },
            purchase_count() {
                return this.filterLookList.length;
            },
            purchase_sum() {
                let sum = 0;
                this.filterLookList.forEach(num => {
                    sum += Number(num.qty);
                });
                return sum;
            },
            isShowCheck() {
                if (!this.edit && !this.editAble) {
                    return this.lookData.status === 11 || this.lookData.status === 15 || this.lookData.status === 20
                } else {
                    return false
                }
            },
            filterLookList() {
                if (!this.edit && !this.editAble) {
                    return this.lookList.filter(row => row.isShow === true);
                } else {
                    return this.lookList
                }
            },
            stepsStatus() {
                let status = this.lookData.status;
                switch (status) {
                    case 0: //1个
                        return 1;
                        break;
                    case -1:
                        return 6;
                        break;
                    case 5:
                        return 7;
                        break;
                    case 6:
                        return 8;
                        break;
                    case 7:
                        return 9;
                        break;
                    case 8:
                        return 10;
                        break;
                    case 9:
                        return 11;
                        break;
                    case 10:  //2个
                        return 2;
                        break;
                    case 11:
                        return 3;
                        break;
                    case 20:
                        return 4;
                        break;
                    case 21:
                        return 5;
                        break;

                }

            },
            isMark() {
                if (!this.mark.trim()) {
                    return true
                } else {
                    return false
                }
            },
            money() {
                let count = 0;
                for (let i = 0; i < this.lookList.length; i++) {
                    count += Number(this.lookList[i].qty || 0) * Number(this.lookList[i].price || 0)
                }
                count += Number(this.lookData.shipping_cost);
                return count
            },
            isShowEdit(){
                switch (this.lookData.status) {
                    case 15:
                    case 20:
                    case 21:
                    case -11:
                    case -1:
                        return false
                    default:
                        return true

                }
            }
        },
        methods: {
            filterTime(val) {
                if (val && val>0){
                    return datef("YYYY-MM-dd HH:mm:ss", val);
                }else {
                    return ''
                }
            },
            filterTimeSelf(val) {
                if (val && val>0){
                    return datef("YYYY-MM-dd HH:mm:ss", val);
                }else if(this.stepsStatus > 1) {
                    return datef("YYYY-MM-dd HH:mm:ss", this.lookData.create_time);
                }else {
                    return ''
                }
            },
            open() {
                this.file = [];
                this.file1 = [];
                this.textarea = '';
                this.showRemark = false;
                this.bordColor = false;
            },
            cur_click(row) {
                row.isEdit_remark = true;
            },
            blur_shipping_redact(row) {
                row.isEdit_remark = false;
                if (row.remark === row.remark_old) {
                    return
                }
                this.$http(api_purchase_order_remarks, row.id, {remark: row.remark}).then(res => {
                    row.remark_old = row.remark;
                    this.$message({type: 'success', message: `${res.message}，货号(SKU):${row.sku}备注信息已修改。` || res});
                }).catch(code => {
                    row.remark = row.remark_old;
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })

            },
            small_img(image) {
                if (!!image&&typeof image ==='string') {
                    if ((/http:\/\/.+/.test(image)|| /https:\/\/.+/.test(image))) {
                        return image;
                    }
                    return `${config.apiHost}${image}`;
                }
                return '';
            },
            sku_image(image) {
                if (!!image&&typeof image ==='string') {
                    if ((/http:\/\/.+/.test(image)|| /https:\/\/.+/.test(image))) {
                        return image.replace('60x60', '200x200');
                    }
                    return `${config.apiHost}${image.replace('60x60', '200x200')}`;
                }
                return '';
            },
            click_sku_img(image) {
                if (!!image&&typeof image ==='string') {
                    this.imgPath = (/http:\/\/.+/.test(image) || /https:\/\/.+/.test(image)) ? image.replace("_60x60", "_500x500") : `${config.apiHost}${image.replace('60x60', '500x500')}`;
                    this.imgDialog = true;
                }
            },
            search_img(image) {
                if (/http:\/\/.+/.test(image)) {
                    window.open(image.replace('60x60', '500x500'));
                } else {
                    window.open(`${config.apiHost}${image.replace('60x60', '500x500')}`);
                }
            },
            check_chinese(val) {
                let chinese = /[\u4E00-\u9FA5\uF900-\uFA2D]/g;
                if (val.external_number.match(chinese)) {
                    this.$set(this.lookData, 'external_number', '');
                }
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.sku_init();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.sku_init();
            },
            isFromInput(item) {
                if (item.is_from_input === 1) {
                    return false;
                } else {
                    return true;
                }
            },
            //获取网络下单运单号
            get_tracking_number() {
                this.$http(api_get_tracking_number, {external_number: this.lookData.external_number}).then(res => {
                    this.trackingNumberData = res.data;
                    if (res.status === 200) {
                        this.$message({type: 'success', message: `获取运单号成功!`});
                    } else {
                        this.$message({type: 'error', message: res.message || res});
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //点击无链接下单按钮
            order_none() {
                return this.$message({type: "error", message: `无下单链接,无法下单!`});
            },
            /*------------编辑运费信息-input失去焦点事件-保留两位小数*/
            blur_shipping_cost() {
                if (Number(this.lookData.shipping_cost) < 0) {
                    this.lookData.shipping_cost = 0;
                }
                this.lookData.shipping_cost = Number(this.lookData.shipping_cost).toFixed(2);
            },
            /*----------------------标记长时间未拆*/
            long_time(item){
                this.$confirm('此操作将包裹标记为未拆异常，是否继续操作？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data={
                        tracking_number:item.logistics_bill_no
                    };
                    this.$http(api_purchase_long_time, data).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message
                        })

                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('long_time',false);
                        },200)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                    setTimeout(()=>{
                        this.$reqKey('long_time',false);
                    },200)
                })
            },
            /*------------编辑物流信息*/
            edit_logistics() {
                this.add_init();
                if (this.lookData.logistics.length > 0) {
                    this.addEdit = false;
                    this.deleteShow = true;
                } else {
                    this.addEdit = true;
                    this.deleteShow = false;
                    this.add2Edit = false;
                }
                this.isEdit = true;
                this.lookData.logistics.forEach(row => {
                    if (row.expect_arrive_date) {
                        row.expect_arrive_date = datef('YYYY-MM-dd HH:mm:ss', row.expect_arrive_date);
                    } else {
                        let deliveryTimeList = [];
                        let create_time = '';
                        this.lookList.forEach(data => {
                            create_time = datef('YYYY-MM-dd HH:mm:ss', data.create_time);
                            deliveryTimeList.push(data.delivery_time);
                        })
                        let delivery_time = Math.max(...deliveryTimeList);
                        if (delivery_time !== 0) {
                            let expect_arrive_time = new Date(create_time).getTime() + 3600 * 1000 * 24 * delivery_time;
                            row.expect_arrive_date = expect_arrive_time;
                        } else {
                            row.expect_arrive_date = '';
                        }
                    }
                    if (row.delivered_time) {
                        row.delivered_time = datef('YYYY-MM-dd HH:mm:ss', row.delivered_time);
                    } else {
                        row.delivered_time = '';
                    }
                })
            },
            save_logistics() {
                if(!!this.lookData.external_number.length && this.lookData.external_number.length <18){
                    this.$message({type: 'warning', message: '外部流水号为18位数值'});
                    this.bordColor = true;
                    return;
                }
                let logistics = [];
                //更新采购单物流信息
                this.lookData.logistics.forEach(row => {
                    let logistic = {
                        id: row.id,
                        purchase_id: this.lookData.id,
                        logistics_bill_no: row.logistics_bill_no,
                        logistics_company_name: row.logistics_company_name,
                        delivered_time: row.delivered_time ? new Date(row.delivered_time).getTime() / 1000 : '',
                        expect_arrive_date: row.expect_arrive_date ? new Date(row.expect_arrive_date).getTime() / 1000 : '',
                        intercept_status: row.intercept_status
                    };
                    logistics.push(logistic);
                });
                //新建采购单物流信息
                if (this.addEdit) {
                    this.logisticsData.forEach(row => {
                        let logistic = {
                            purchase_id: this.lookData.id,
                            logistics_bill_no: row.logistics_bill_no,
                            logistics_company_name: row.logistics_company_name,
                            delivered_time: row.delivered_time ? new Date(row.delivered_time).getTime() / 1000 : '',
                            expect_arrive_date: row.expect_arrive_date ? new Date(row.expect_arrive_date).getTime() / 1000 : '',
                            intercept_status: row.intercept_status
                        };
                        logistics.push(logistic);
                    });
                }
                let pram = {
                    id: this.lookData.id,
                    shipping_cost: this.lookData.shipping_cost,
                    external_number: this.lookData.external_number,
                    logistics: logistics
                };
                this.$http(api_update_logistics, this.lookData.id, pram).then(res => {
                    if (res.status == 500) {
                        this.$message({type: 'error', message: res.message || res});
                        this.isEdit = true;
                    } else {
                        this.isEdit = false;
                        this.$emit("save-logistics", this.listId);
                        this.add_init();
                        this.log_init();
                        this.$message({type: 'success', message: res.message || res});
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })

                });
            },
            add_Edit() {
                this.addEdit = true;
                if (!!this.logisticsData) {
                    this.add_init();
                }
            },
            close_logistics() {
                this.isEdit = false;
                this.addEdit = false;
                this.add2Edit = true;
                this.$emit("save-logistics", this.listId);
                this.add_init();
                for (let i in this.cloneData) {
                    if (this.cloneData.hasOwnProperty(i)) {
                        this.lookData[i] = this.cloneData[i];
                    }
                }
                this.lookData.tracking_number = window.clone(this.cloneData.tracking_number)
                if (this.lookData.expect_arrive_date === '') {
                    this.lookData.expect_arrive_date = '-- --';
                }
            },
            add_track() {
                let deliveryTimeList = [];
                let create_time = '';
                this.lookList.forEach(data => {
                    create_time = datef('YYYY-MM-dd HH:mm:ss', data.create_time);
                    deliveryTimeList.push(data.delivery_time);
                })
                let delivery_time = Math.max(...deliveryTimeList);
                if (delivery_time !== 0) {
                    let expect_arrive_time = new Date(create_time).getTime() + 3600 * 1000 * 24 * delivery_time;
                    this.logisticsData.push({
                        logistics_bill_no: '',
                        logistics_company_name: '',
                        delivered_time: '',
                        expect_arrive_date: expect_arrive_time
                    });
                } else if (delivery_time === 0) {
                    this.logisticsData.push({
                        logistics_bill_no: '',
                        logistics_company_name: '',
                        delivered_time: '',
                        expect_arrive_date: ''
                    });
                }
            },
            delete_track(index) {
                this.logisticsData.splice(index, 1);
            },
            delete_tracks(index) {
                this.lookData.logistics.splice(index, 1);
            },
            add_init() {
                let deliveryTimeList = [];
                let create_time = '';
                this.lookList.forEach(data => {
                    create_time = datef('YYYY-MM-dd HH:mm:ss', data.create_time);
                    deliveryTimeList.push(data.delivery_time);
                })
                let delivery_time = Math.max(...deliveryTimeList);
                if (delivery_time === 0) {
                    this.logisticsData = [
                        {
                            purchase_id: '',
                            logistics_bill_no: '',
                            logistics_company_name: '',
                            delivered_time: '',
                            expect_arrive_date: '',
                            intercept_status: 0
                        }];
                } else {
                    let expect_arrive_time = new Date(create_time).getTime() + 3600 * 1000 * 24 * delivery_time;
                    this.logisticsData = [
                        {
                            purchase_id: '',
                            logistics_bill_no: '',
                            logistics_company_name: '',
                            delivered_time: '',
                            expect_arrive_date: expect_arrive_time,
                            intercept_status: 0
                        }];

                }
            },
            /*------end*/
            //更改触发
            chang_(row) {
                this.isShow = true;
                if (!row.action) {
                    row.action = "mod"
                }
            },
            selected(sels) {
                this.isShow = true;
                sels.forEach(row => {
                    if (this.selects.indexOf(row.id) === -1) {
                        this.selects.push(row.id)
                        this.addSkuid.push(row.id);
                        this.add_sku_init({
                            sku_id: row.id,
                            supplier_id: "",
                        });
                    } else {
                        this.$message({
                            type: "error",
                            message: `SKU为：${row.sku} 已存在`
                        })
                    }
                });
            },
            //获取所有仓库
            depot_init() {
                this.$http(publish_edit_depot).then(res => {
                    this.depots = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //  获取所有采购人员
            purer_init() {
                this.buyers = [];
                this.$http(publish_edit_user).then(res => {
                    this.buyers = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //供应商初始化
            supplier_init() {
                this.$http(publish_edit_supplier).then(res => {
                    this.suppliers = res.data;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //请求Sku
            sku_init() {
                let data = {
                    purchase_order_id: this.listId,
                    page: this.page,
                    pageSize: this.pageSize
                };
                this.lookList = [];
                this.inQtyAmount = '';
                this.$http(api_publish_look_sku, data).then(res => {
                    this.lookList = res.data;
                    this.inQtyAmount = res.inQtyAmount;
                    this.lookList.forEach(row => {
                        this.selects.push(row.sku_id);
                        this.$set(row, 'isEdit_remark', false);
                        this.$set(row, 'remark_old', row.remark);
                        this.$set(row, 'isShow', true);
                    });
                    this.count = res.count;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //请求添加SKu
            add_sku_init(data) {
                this.$http(api_publish_add_sku, data).then(res => {
                    let arr = this.clone(res);
                    arr.purchase_price = 0;
                    arr.purchase_qty = 0;
                    arr.is_replace = 0;
                    arr.in_qty = "";
                    arr.arrival_qty = 0;
                    arr.action = "add"
                    this.lookList.push(arr);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //删除sku
            del_sku(row) {
                let index = this.lookList.indexOfFun(item => {
                    return item.sku_id === row.sku_id
                })
                let i = this.selects.indexOf(row.sku_id)
                this.selects.splice(i, 1)
                if (this.addSkuid.indexOf(this.lookList[index].sku_id) === -1) {
                    this.delSkuid.push(this.lookList[index].sku_id)
                }
                this.lookList.splice(index, 1)
            },
            keep() {
                let pram = {
                    purchase_id: this.lookData.purchase_user_id,
                    supplier_id: this.lookData.supplier_id,
                    warehouse_id: this.lookData.warehouse_id,
                    tracking_number: this.lookData.tracking_number,
                    external_number: this.lookData.external_number,
                    payable_amount: this.lookData.payable_amount,
                    actual_payment: this.lookData.actual_payment,
                    shipping_type: this.lookData.shipping_type,
                    shipping_cost: this.lookData.shipping_cost,
                    remark: this.lookData.remark
                }
                pram.expect_arrive_date = this.lookData.expect_arrive_date ? new Date(this.lookData.expect_arrive_date).getTime() / 1000 : '';
                if (this.isShow) {
                    pram.payable_amount = this.money;
                }
                let addaction = this.lookList.filter(item => {
                    return item.action === "add"
                })
                let add = {}
                addaction.forEach(row => {
                    add[row.sku_id] = {
                        purchase_price: row.price,
                        purchase_qty: row.qty,
                        is_replace: row.is_replace
                    };
                })
                let mod = {}
                let modaction = this.lookList.filter(item => {
                    return item.action === "mod"
                })
                modaction.forEach(row => {
                    mod[row.sku_id] = {
                        purchase_price: row.price,
                        purchase_qty: row.qty,
                        is_replace: row.is_replace
                    };
                })
                pram.sku_json = {
                    add, mod, del: this.delSkuid
                }
                this.$http(api_update_detail, this.listId, pram).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.addVisable = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //点击保存
            keep_edit() {
                // 判断上半部分 3个必填
                let isKeep = false;
                this.$refs.form1.validate((valid) => {
                    if (valid) {
                        isKeep = true
                    } else {
                        return;
                    }
                });
                //判断运输方式必填
                let isCheck = false;
                this.$refs.form2.validate((valid) => {
                    if (valid) {
                        isCheck = true
                    } else {
                        return;
                    }
                });
                isKeep && isCheck && this.keep()
            },
            //请求日记
            log_init() {
                this.$http(api_log_detail, {purchase_order_id: this.listId, page:1, pageSize: 500}).then(res => {
                    this.actionLog = res.data;
                    this.actionLog.forEach(res => {
                        if (res.img) {
                            res.img = res.img.split(',');
                        }
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            add_goods() {
                this.looklistVisable = true
            },
            cancel() {
                this.addVisable = false;
                this.showRemark = false;
            },
            cancel_() {
                if (!this.mark.trim()) {
                    this.$message({type: 'error', message: `请输入作废原因!`});
                } else  if (this.file1.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: "请提交图片附件"
                    });
                    return false;
                } else{
                    let data = {
                        id: this.lookData.id,
                        remark: this.mark.trim(),
                        status: -1,
                        file: this.file1
                    };
                    this.$emit("cancel-look", data);
                    this.addVisable = false;
                    this.showRemark = false;
                }
            },
            invalid_apply(status) {
                if (!this.mark.trim()) {
                    this.$message({type: 'warning', message: `请输入备注信息!`});
                } else {
                    if (this.isInvalidApply) {
                        if (this.file.length === 0) {
                            this.$message({
                                type: 'warning',
                                message: "请提交图片附件"
                            });
                            return false;
                        }
                        let data = {
                            remark: this.mark.trim(),
                            status: 'apply',
                            file: this.file
                        };
                        this.$emit("invalid-apply", this.lookData.id, data);
                        this.addVisable = false;
                        this.showRemark = false;
                    }
                    if (this.isInvalidAudit) {
                        let data = {
                            remark: this.mark.trim(),
                            status
                        };
                        this.$emit("invalid-audit", this.lookData.id, data);
                        this.addVisable = false;
                        this.showRemark = false;
                    }
                }
            },
            add_mark() {
                if (!this.mark.trim()) {
                    this.$message({type: 'warning', message: `请输入备注信息!`});
                    return
                }
                let obj = {
                    id: this.listId,
                    remark: this.mark.trim()
                };
                this.$http(api_add_mark, obj).then(res => {
                    this.mark = "";
                    this.log_init();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //开启时 将下拉框数据请求回来
            change_dialog(val) {
                if (val) {
                    this.isEdit = false
                    this.addSkuid = [];
                    this.delSkuid = [];
                    this.log_init();
                    this.sku_init();
                    this.mark = "";
                    if (this.edit) {  //查看请求
                        this.depot_init();
                        this.purer_init();
                        this.supplier_init();
                    }
                }
            },
            //对象深度克隆
            clone(obj) {
                var o;
                if (typeof obj == "object") {
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (var i = 0, len = obj.length; i < len; i++) {
                                o.push(this.clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (var j in obj) {
                                o[j] = this.clone(obj[j]);
                            }
                        }
                    }
                } else {
                    o = obj;
                }
                return o;
            },
            handleCheckAllChange(event) {
                this.checkedStatus = event.target.checked ? statusOptions : [];
                this.isIndeterminate = false;
                if (event.target.checked) {
                    this.lookList.forEach(row => {
                        this.$set(row, 'isShow', true);
                    });
                } else {
                    this.lookList.forEach(row => {
                        this.$set(row, 'isShow', false);
                    });
                }
            },
            handleCheckedStatusChange(value) {
                let checkedCount = value.length;
                this.checkAllStatus = checkedCount === this.statusLists.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.statusLists.length;
                this.lookList.forEach(row => {
                    if (row.arrival_status === 0) {
                        let status = value.find(row => row === '未到货');
                        if (status) {
                            this.$set(row, 'isShow', true);
                        } else {
                            this.$set(row, 'isShow', false);
                        }
                    }
                    if (row.arrival_status === 1) {
                        let status = value.find(row => row === '已到货');
                        if (status) {
                            this.$set(row, 'isShow', true);
                        } else {
                            this.$set(row, 'isShow', false);
                        }
                    }
                    if (row.arrival_status === 2) {
                        let status = value.find(row => row === '部分到货');
                        if (status) {
                            this.$set(row, 'isShow', true);
                        } else {
                            this.$set(row, 'isShow', false);
                        }
                    }

                });
            },
            set_value(val, item) {
                val = val.replace(/[^a-zA-Z0-9]/g, '');
                this.$set(item, 'logistics_bill_no', val);
            },
            get_logistics(purchase_order_code, item) {
                if (!item.external_number) {
                    window.open(`http://cha.chawuliu.cn/?stype=kd&q=${item.logistics_bill_no}`);
                } else {
                    this.$http(api_logistics_detail, item.external_number).then(res => {
                        this.logisticsData = res.data;
                        this.logisticsData.forEach((row) => {
                            row.external_number = item.external_number;
                            row.logisticsSteps.reverse();
                        });
                        this.loadingLogistics = false;
                        this.title = `查看采购单号：${purchase_order_code}的物流跟踪信息`;
                        this.showLogistics = true;
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    })
                }
            },
            filterIntercept(val) {
                return this.interceptList.find(row => row.value === val) ? this.interceptList.find(row => row.value === val).label : val;
            }
        },
        filters: {
            filterReturnGoods(val){
                switch (val) {
                    case 0:
                        return '否';
                        break;
                    case 1:
                        return '是';
                        break;
                    case 2:
                        return '否';
                        break;
                    default:
                        return '否';
                }
            },
            filterReturnGoodsData(val){
                switch (val) {
                    case 0:
                        return '--';
                        break;
                    case 1:
                        return '30天';
                        break;
                    case 2:
                        return '45天';
                        break;
                    case 3:
                        return '60天';
                        break;
                    case 4:
                        return '90天';
                        break;
                    default:
                        return '--';
                }
            },
            filterLabelDeck(val) {
                switch (val) {
                    case 0:
                        return '都不支持';
                        break;
                    case 1:
                        return '仅贴标';
                        break;
                    case 2:
                        return '仅套袋';
                        break;
                    case 3:
                        return '贴标和套袋';
                        break;
                    case 4:
                        return '都不支持';
                        break;
                    default:
                        return '都不支持';
                }
            },
            statusFilter(val) {
                switch (val) {
                    case 10:
                        return "等待到货";
                        break;
                    case 11:
                        return "部分到货等待剩余";
                        break;
                    case 20:
                        return "部分到货不等待剩余";
                        break;
                    case 21:
                        return "全部到货";
                        break;
                    case 0:
                        return "等待下单";
                        break;
                    case -1:
                        return "已作废";
                        break;
                    case 5:
                        return "未申请付款";
                        break;
                    case 6:
                        return "已申请付款";
                        break;
                    case 7:
                        return "已取消付款";
                        break;
                    case 8:
                        return "已付款";
                        break;
                    case 9:
                        return "部分付款";
                        break;
                    case 15:
                        return "不等待剩余待审";
                        break;
                }
            },
            dataFilter(val, hasHMS) {
                let str = hasHMS ? 'YYYY-MM-dd HH:mm:ss' : 'YYYY-MM-dd';
                return datef(str, val);
            },
            timeFilter(val) {
                return datef('YYYY-MM-dd HH:mm:ss', val);
            },
            filterNumber(val) {
                if (val && Number(val) >= 0) {
                    return parseFloat(val).toFixed(2);
                } else {
                    return val;
                }
            },
            filterAli(val) {
                if (val && Number(val) >= 0) {
                    return parseFloat(val).toFixed(2);
                } else {
                    return '- - ';
                }
            },
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            }
        },
        watch: {
            value(val) {
                this.addVisable = val;
            },
            addVisable(val) {
                this.$emit("input", val);
                this.add_init();
            }
        },
        props: {
            value: {},
            lookData: {
                type: Object
            },
            edit: {
                required: true,
                type: Boolean
            },
            listId: {
                required: true
            },
            editAble: {},
            isInvalidApply: {},
            isInvalidAudit: {}
        },
        components: {
            TabItem,
            card,
            pageDialog,
            addGoods,
            uiInput,
            selectText: require("@/components/select-text.vue").default,
            uiTip: require('@/components/ui-tip.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            allowCreateSelect: require('@/components/allow-create-select.vue').default,
            imageUpload: require("../../customer-service/smt/inbox/image-upload.vue").default,
            labelItem: require('@/components/label-item').default,
            lookLogistics: require('./look-logistics').default,
            blowupImage: require("@/components/blowup-image.vue").default,
            tabs: require('@/components/tabs.vue').default,
            tabHead: require('@/components/tab-head.vue').default,
            tabItem: require('@/components/tab-item.vue').default,
            uiLimitNumber: require("../../../components/ui-limit-number.vue").default,
        }
    }
</script>
