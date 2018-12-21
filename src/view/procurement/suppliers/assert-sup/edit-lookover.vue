<template>
    <el-row>
        <page-dialog :title="title" v-model="dialog" @open="open" width="765px" left="30%" size="full"
                     :close-on-click-modal="false" class="suppliers-edit">
            <el-form :model="lookEditForm" ref="lookEditForm" :rules="rules" label-width="150px">
                <el-row>
                    <label class="box-label">基本资料</label>
                    <el-col :span="22">
                        <el-form-item label="名称：" prop="company_name">
                            <ui-input v-model="lookEditForm.company_name" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="统一社会信用代码：" prop="code">
                            <ui-input v-model="lookEditForm.code" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="等级：">
                            <label-select
                                :edit="!isLook"
                                v-model="lookEditForm.level"
                                :lists="levelList"
                                @change="cc"
                                clearable
                                placeholder="请选择供应商等级..."
                            ></label-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="供应商类型：" prop="type">
                            <el-select class="inline"
                                       v-model="lookEditForm.type"
                                       ref="type"
                                       v-mouse-side.mousewheel="()=>{$refs.type.visible = false}"
                                       v-if="!isLook">
                                <el-option :key="item.value" v-for="item in typeList" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                            <span v-else>{{comTitle}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="发票类型：" prop="invoice">
                            <label-select
                                :edit="!isLook"
                                v-model="lookEditForm.invoice"
                                placeholder="请选择发票类型..."
                                :lists="invoiceList"
                            ></label-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="法人代表：" prop="legal">
                            <ui-input :edit="!isLook" v-model="lookEditForm.legal"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="营业执照名称：" prop="business_license">
                            <ui-input :edit="!isLook" v-model="lookEditForm.business_license"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item
                            prop="file"
                            label="营业执照附件："
                            :show-message="lookEditForm.file&&lookEditForm.file.length===0"
                            class="file-image">
                            <image-upload v-model="lookEditForm.file"
                                          @remove-img="remove_file"
                                          :download-img="downloadImg"
                                          :is-look="isLook"
                                          :show-download="true"
                                          :maximum="5"
                                          :maximize="1048576*5"
                                          class="inline"
                                          ref="images-file"></image-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="网上店铺全称：">
                            <ui-input v-model="lookEditForm.online_shop_name" placeholder="请填写网上店铺全称..." :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="店铺网址：" prop="link">
                            <ui-input v-model="lookEditForm.link" placeholder="请填写店铺网址..." :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="采购员：">
                            <purchaser class="inline s-width-default"
                                       v-model="lookEditForm.purchaser_id" style="width: 178px" v-if="!isLook"></purchaser>
                            <span v-else>{{lookEditForm.purchaser}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="分类：" prop="categorys" :show-message="categorysMessage" required>
                            <template v-if="!isLook">
                                <el-cascader
                                    clearable
                                    filterable
                                    placeholder="请选择分类..."
                                    class="inline s-width-large"
                                    v-model="lookEditForm.categorys"
                                    @change="categorys_change"
                                    expand-trigger="hover"
                                    :options="categorysList"
                                ></el-cascader>
                                <el-row class="mt-mini">
                                    <el-tag
                                        v-for="categorys in selectCategorys"
                                        :key="categorys.child_id"
                                        :closable="true"
                                        class="mr-xs"
                                        @close="close_categorys(categorys)"
                                        type="gray">
                                        {{categorys.label}}
                                    </el-tag>
                                </el-row>
                            </template>
                            <el-tag
                                v-else
                                v-for="categorys in selectCategorys"
                                :key="categorys.child_id"
                                class="mr-xs"
                                type="gray">
                                {{categorys.label}}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="新增理由：" prop="new_reason">
                            <ui-input type="textarea" v-model="lookEditForm.new_reason" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <label class="box-label">财务结算</label>
                    <el-col :span="22">
                        <el-form-item label="交易类型：" prop="transaction_type">
                            <el-select class="inline"
                                       v-if="!isLook"
                                       ref="transaction"
                                       clearable
                                       v-mouse-side.mousewheel="()=>{$refs.transaction.visible = false}"
                                       v-model="lookEditForm.transaction_type"
                                       placeholder="请选择交易类型...">
                                <el-option :key="item.label" v-for="item in transactionTypeList" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                            <span v-else>{{comTransaction}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="支付方式：" prop="pay_type">
                            <label-select
                                :edit="!isLook"
                                :lists="payList"
                                v-model="lookEditForm.pay_type"
                                clearable
                                placeholder="请选择支付方式..."
                                @change="select_pay_type"
                            ></label-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <template v-if="lookEditForm.pay_type===2">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item
                                label="对公账户："
                                prop="public_accounts"
                                :show-message="publicIsRequired"
                                :required="publicIsRequired">
                                <el-input v-model="lookEditForm.public_accounts" v-if="!isLook" style="width: 178px;"
                                          placeholder="请输入对公账户..."></el-input>
                                <span v-else>{{lookEditForm.public_accounts}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item
                                label="户名(对公)："
                                prop="public_accounts_name"
                                :show-message="publicIsRequired"
                                :required="publicIsRequired">
                                <el-input v-model="lookEditForm.public_accounts_name" v-if="!isLook"
                                          placeholder="输入对公户名..."></el-input>
                                <span v-else>{{lookEditForm.public_accounts_name}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item
                                label="开户行(对公)："
                                prop="public_accounts_bank"
                                :show-message="publicIsRequired"
                                :required="publicIsRequired">
                                <el-input v-model="lookEditForm.public_accounts_bank" v-if="!isLook" style="width: 178px;"
                                          placeholder="请输入对公开启行..."></el-input>
                                <span v-else>{{lookEditForm.public_accounts_bank}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item
                                label="开户行所在市(对公)："
                                prop="public_bank_city"
                                :show-message="publicIsRequired"
                                :required="publicIsRequired">
                                <label-select
                                    :edit="!isLook"
                                    :clearable="true"
                                    :filterable="true"
                                    v-model="lookEditForm.public_bank_city"
                                    placeholder="请搜索/选择城市"
                                    :lists="bankDepositCity"
                                ></label-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item
                                label="银行留存联系方式(对公)："
                                prop="public_bank_retained_contact_way"
                                :show-message="publicIsRequired"
                                :required="publicIsRequired">
                                <ui-input
                                    style="width: 178px;"
                                    v-model="lookEditForm.public_bank_retained_contact_way" placeholder="请填写店铺网址..."
                                    :edit="!isLook"></ui-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="对私账户：" prop="private_accounts">
                                <el-input v-model="lookEditForm.private_accounts" v-if="!isLook" style="width: 178px;"
                                          placeholder="请输入对私账户..."></el-input>
                                <span v-else>{{lookEditForm.private_accounts}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="户名(对私)：" prop="private_accounts_name">
                                <el-input v-model="lookEditForm.private_accounts_name" v-if="!isLook"
                                          placeholder="输入户名..."></el-input>
                                <span v-else>{{lookEditForm.private_accounts_name}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="开户行(对私)：" prop="private_accounts_bank">
                                <el-input v-model="lookEditForm.private_accounts_bank" v-if="!isLook"
                                          style="width: 178px;" placeholder="输入开户行..."></el-input>
                                <span v-else>{{lookEditForm.private_accounts_bank}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="开户行所在市(对私)：" prop="opening_bank_city">
                                <label-select
                                    :edit="!isLook"
                                    :clearable="true"
                                    :filterable="true"
                                    v-model="lookEditForm.opening_bank_city"
                                    placeholder="请搜索/选择城市"
                                    :lists="bankDepositCity"
                                ></label-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="开户身份证号(对私)：" prop="opening_id_card">
                                <el-input v-model="lookEditForm.opening_id_card" v-if="!isLook"
                                          style="width: 178px;" placeholder="输入开户身份证号..."></el-input>
                                <span v-else>{{lookEditForm.opening_id_card}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="银行留存联系方式(对私)：" prop="bank_retained_contact_way">
                                <el-input v-model="lookEditForm.bank_retained_contact_way" v-if="!isLook"
                                          placeholder="输入银行留存联系方式..."></el-input>
                                <span v-else>{{lookEditForm.bank_retained_contact_way}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item
                                prop="payment_information"
                                :show-message="lookEditForm.payment_information&&lookEditForm.payment_information.length===0"
                                label="付款资料(盖章)：">
                                <image-upload v-model="lookEditForm.payment_information"
                                              @remove-img="remove_information"
                                              :download-img="downloadImg"
                                              :is-look="isLook"
                                              :show-download="true"
                                              :maximum="5"
                                              :maximize="1048576*5"
                                              class="inline"
                                              ref="images-file"></image-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="结算方式：" prop="balance_type">
                            <label-select
                                :edit="!isLook"
                                placeholder="请选择结算方式"
                                v-model="lookEditForm.balance_type"
                                :lists="balanceList"
                            ></label-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="账期生效日期：">
                            <el-date-picker
                                class="inline date"
                                v-model="lookEditForm.payment_effective_time"
                                v-if="!isLook"
                                style="width: 178px;"
                                type="date"
                                placeholder="账期生效日期"></el-date-picker>
                            <span v-else>{{lookEditForm.payment_effective_time|filterDate}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="谈账期人：">
                            <scroll-select v-model="account_period_people" style="width:178px" class="inline"
                                           textAlign="left"
                                           :queryClearabled="true"
                                           v-if="!isLook"
                                           :remote="'get|user'"
                                           :fix-params="fix_params_account"
                                           :fixResult="fix_result_account">
                            </scroll-select>
                            <span v-else>{{lookEditForm.payment_communicator_name}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <label class="box-label">联系方式</label>
                    <el-col :span="11">
                        <el-form-item label="联系人1：" prop="contacts">
                            <ui-input v-model="lookEditForm.contacts" style="width: 178px;" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="职务1：" prop="contacts_job">
                            <ui-input v-model="lookEditForm.contacts_job" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="联系电话1：" prop="mobile">
                            <ui-input v-model="lookEditForm.mobile" style="width: 178px;" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="QQ号1：" prop="qq">
                            <ui-input v-model="lookEditForm.qq" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="联系人2：">
                            <ui-input v-model="lookEditForm.contacts2" style="width: 178px;" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="职务2：">
                            <ui-input v-model="lookEditForm.contacts2_job" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="联系电话2：">
                            <ui-input v-model="lookEditForm.mobile2" style="width: 178px;" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="QQ号2：">
                            <ui-input v-model="lookEditForm.qq2" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-col :span="9">
                            <el-form-item prop="province_id" label="地址：" required>
                                <label-select
                                        :edit="!isLook"
                                        :clearable="true"
                                        v-model="lookEditForm.province_id"
                                        placeholder="请选择省"
                                        :lists="provinceList"
                                        @change="select_province"
                                ></label-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item prop="city_id" label="省/市/州：" label-width="70px" required>
                                <label-select
                                        :edit="!isLook"
                                        :clearable="true"
                                        v-model="lookEditForm.city_id"
                                        placeholder="请选择市"
                                        :lists="cityOption"
                                        @change="select_city"
                                ></label-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="area_id" label="地区/市/县：" label-width="82px" required>
                                <label-select
                                        :edit="!isLook"
                                        :clearable="true"
                                        v-model="lookEditForm.area_id"
                                        placeholder="请选择区"
                                        :lists="areaOption"
                                        @change="select_area"
                                ></label-select>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item prop="address" label="详细地址：">
                            <ui-input v-model="lookEditForm.address" :edit="!isLook" placeholder="请填写详细地址"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注：">
                            <ui-input type="textarea" v-model="lookEditForm.remark" :edit="!isLook"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-row v-if="isLook" class="mb-xs mt-xs">
                <el-button size="mini" type="primary" class="fr" @click="btnclick">{{btnName}}</el-button>
            </el-row>
            <card label="操作日志" class="mt-sm" v-show="loghidden">
                <el-table
                    :data="actionLog"
                    v-loading="logLoading"
                    element-loading-text="玩命加载中"
                    highlight-current-row
                    style="max-height: 400px;">
                    <el-table-column
                        width="60"
                        label="操作人"
                        prop="operator"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="日期"
                        width="140"
                        inline-template
                        show-overflow-tooltip>
                        <span>{{row.operating_time}}</span>
                    </el-table-column>
                    <el-table-column
                        inline-template
                        width="70"
                        label="操作状态"
                        show-overflow-tooltip>
                        <div>{{row.status}}</div>
                    </el-table-column>
                    <el-table-column
                        label="操作记录"
                        inline-template>
                        <ui-tip :content="row.content" :width="88"></ui-tip>
                    </el-table-column>
                </el-table>
            </card>
            <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
            <div slot="footer">
                <el-button v-if="isLook" size="mini" @click.native="close">关闭</el-button>
                <div v-else>
                    <request-button req-key="update_look_edit_form" :mintime="200" @click.native="update(lookEditForm.id)">确定
                    </request-button>
                    <el-button size="mini" @click.native="cancel">取消</el-button>
                </div>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .suppliers-edit {
        table.template td, .el-table td, table.template th, .el-table th {
            padding: 0;
            height: 26px;
            text-align: center;
            box-sizing: border-box;
            border-right: 1px solid #e0e6ed;
            border-bottom: 1px solid #e0e6ed;
        }
        .el-table__body-wrapper {
            overflow-x: hidden;
            overflow-y: scroll;
            position: relative;
        }
        .p-table-list-td-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .file-image {
            .el-form-item__content {
                line-height 0;
            }
        }
        .pretend {
            color: #008BCE !important;
            word-break: break-all;
        }
        .box-label {
            width: 100%;
            display: block;
            border-bottom: 1px solid #e0e6ed;
            margin-bottom: 10px;
        }
    }

</style>
<script>
    import {
        api_supplier_Level,
        api_supplier_type,
        api_supplier_transaction,
        api_supplier_payment,
        api_supplier_area,
        api_get_invoice, api_get_balance,
        api_get_supplier_id_log
    } from '../../../../api/assert-sup';
    import {downloadFile} from '@/lib/http';
    import {api_get_categories} from '@/api/goods-sku-map'

    export default {
        data() {
            return {
                imgDialog: false,
                imgPath: '',
                dialog: false,
                dialogSize: "full",
                levelList: [],
                typeList: [],
                invoiceList: [],
                balanceList: [],
                payList: [],
                district: {},
                provinceList: [],
                cityList: [],
                areaList: [],
                transactionTypeList: [],
                rules: {
                    company_name: [
                        {required: "true", message: "名称不能为空", trigger: "blur,change"}
                    ],
                    code: [
                        {required: "true", message: "统一社会信用代码不能为空", trigger: "blur,change"}
                    ],
                    type: [
                        {required: "true", message: "供应商类型不能为空", trigger: "blur", type: "number"}
                    ],
                    invoice: [
                        {required: "true", message: "发票类型不能为空", trigger: "blur", type: "number"}
                    ],
                    legal:[
                        {required: "true", message: "法人代表不能为空", trigger: "blur,change"}
                    ],
                    file: [
                        {required: "true", message: "请上传营业执照", trigger: "blur,change", type: "array"}
                    ],
                    link:[
                        {required: "true", message: "店铺网址为不能空", trigger: "blur,change"}
                    ],
                    categorys: [
                        {required: "true", message: "请选择分类", trigger: "blur,change", type: "array"}
                    ],
                    new_reason:[
                        {required: "true", message: "新增理由不能为空", trigger: "blur,change"}
                    ],
                    transaction_type: [
                        {required: "true", message: "请选择交易类型", trigger: "change", type: "number"}
                    ],
                    pay_type:[
                        {required: "true", message: "请选择支付方式", trigger: "change", type: "number"}
                    ],
                    system_name: [
                        {required: "true", message: "系统名称不能为空", trigger: "blur"}
                    ],
                    business_license: [
                        {required: "true", message: "营业执照名称不能为空", trigger: "blur"}
                    ],
                    balance_type: [
                        {required: "true", message: "结算方式不能为空", trigger: "blur", type: "number"}
                    ],
                    bank: [
                        {required: "true", message: "开户行不能为空", trigger: "blur"}
                    ],
                    bank_account: [
                        {required: "true", message: "帐号不能为空", trigger: "blur"}
                    ],
                    account_name: [
                        {required: "true", message: "开户名不能为空", trigger: "blur"}
                    ],
                    contacts: [
                        {required: "true", message: "联系人1不能为空", trigger: "blur,change"}
                    ],
                    contacts_job: [
                        {required: "true", message: "职务1不能为空", trigger: "blur,change"}
                    ],
                    mobile: [
                        {required: "true", message: '联系电话1不能为空', trigger: 'blur,change'}
                    ],
                    qq: [
                        {required: "true", message: 'QQ号1不能为空', trigger: 'blur,change'}
                    ],
                    address: [
                        {required: "true", message: "详细地址不能为空", trigger: "blur,change"}
                    ]
                },
                loghidden: false,
                actionLog: [],
                logLoading: false,
                categorysRes:{},
                categorysList:[],
                selectCategorys:[],
                categorysMessage:false

            }
        },
        created() {
            this.init();
            this.get_supplier_type();
            this.supplier_transaction();
        },
        mounted() {
            this.dialog = this.value;
        },
        methods: {
            open() {
                this.provinceList = [];
                this.cityList = [];
                this.areaList = [];
                this.init();
                this.actionLog = [];
                this.loghidden = false;
                if(this.categorysList.length===0){
                    this.get_categorys();
                }
            },
            fix_params_account({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    snType:'realname',
                    snText:keyword?keyword:''

                };
            },
            fix_result_account(res){
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            get_categorys(){
                this.$http(api_get_categories).then(res=>{
                    this.categorysRes = res;
                    let list = [];
                    Object.keys(res).forEach(key=>{
                        if(res[key]&&res[key].child_ids&&res[key].child_ids.length>0){
                            let children = [];
                            res[key].child_ids.forEach(child_key=>{
                                children.push(res[child_key]);
                            });
                            this.$set(res[key],'children',children);
                            list.push(res[key]);
                        }
                    });
                    this.categorysList = list.map(row=>{
                        return {
                            label:row.name,
                            value:row.id,
                            disabled:row.children.length===0,
                            children:row.children.map(child=>{
                                return {
                                    label:child.name,
                                    value:child.id,
                                    disabled:false
                                }
                            })
                        }
                    });
                    this.init_categorys();
                }).catch(code=>{
                    console.log(code);
                });
            },
            categorys_change(val){
                this.selectCategorys.push({
                    label: `${this.categorysRes[val[0]].name}/${this.categorysRes[val[1]].name}`,
                    parent_id: this.categorysRes[val[0]].id,
                    child_id: this.categorysRes[val[1]].id
                });
                this.categorysList.forEach(row=>{
                    let find = row.children.find(child=>child.value===this.categorysRes[val[1]].id);
                    if(!!find){
                        find.disabled = true;
                    }
                });
                this.$nextTick(()=>{
                    this.lookEditForm.categorys = [];
                    if(this.selectCategorys.length){
                        this.rules.categorys = [];
                        this.categorysMessage = false;
                    }
                })
            },
            close_categorys(item){
                let index = this.selectCategorys.findIndex(row=>row.child_id===item.child_id);
                this.categorysList.forEach(row=>{
                    let find = row.children.find(child=>child.value===item.child_id);
                    if(!!find){
                        find.disabled = false;
                    }
                });
                if(index>-1){
                    this.selectCategorys.splice(index,1);
                }
            },
            downloadImg(file){
                downloadFile({
                    url:`${config.apiHost}supplier/download-image`,
                    get: {file: file},
                    fileName: file.slice(file.lastIndexOf('/') - 1, file.lastIndexOf('.')),
                    suffix: file.slice(file.lastIndexOf('.'))
                });
            },
            remove_file(arr){
                this.removeFile.push(...arr);
            },
            remove_information(arr){
                this.removeInformation.push(...arr);
            },
            btnclick() {
                this.loghidden = !this.loghidden;
                if (this.actionLog.length === 0) {
                    this.logLoading = true;
                    this.$http(api_get_supplier_id_log, this.lookEditForm.id).then(res => {
                        this.actionLog = res;
                        this.logLoading = false;
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                }
            },
            cc(val) {
                console.log(val);
            },
            init() {
                /*供应商等级*/
                this.$http(api_supplier_Level).then(res => {
                    if (res) {
                        this.levelList = res.map(row => {
                            return {
                                label: row.name,
                                value: row.label,
                            }
                        });
                    }

                }).catch(code => {
                    console.log(code);
                });
                /*支付方式*/
                this.$http(api_supplier_payment).then(res => {
                    if (res) {
                        this.payList = res.map(row => {
                            return {
                                label: row.name,
                                value: row.label,
                            }
                        });
                    }
                }).catch(code => {
                    console.log(code);
                });
                /*结算方式*/
                this.$http(api_get_balance).then(res => {
                    this.balanceList = res.map(row => {
                        return {
                            label: row.name,
                            value: row.label,
                        }
                    });
                }).catch(code => {
                    console.log(code);
                });
                /*发票类型*/
                this.$http(api_get_invoice).then(res => {
                    this.invoiceList = res.map(row => {
                        return {
                            label: row.name,
                            value: row.label
                        };
                    });
                }).catch(code => {
                    console.log(code);
                });
                /*获取省市县*/
                this.$http(api_supplier_area).then(res => {
                    this.district = res;
                    let city = "";
                    let area = "";
                    for (var i in this.district) {
                        this.provinceList.push({
                            label: this.district[i].name,
                            value: this.district[i].id,
                            pid: this.district[i].pid
                        });
                        this.district[i]._child && (city = this.district[i]._child);
                        for (var c in city) {
                            this.cityList.push({label: city[c].name, value: city[c].id, pid: city[c].pid});
                            city[c]._child && (area = city[c]._child);
                            for (var a in area) {
                                this.areaList.push({label: area[a].name, value: area[a].id, pid: area[a].pid});
                            }
                        }
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
//          ---------------------------------  选择支付方式
            select_pay_type(val) {
                console.log(val);
            },
//            ---------------------------------  选择省
            select_province(val) {
                this.$emit("select-province", val);
            },
//            ---------------------------------  选择市
            select_city(val) {
                this.$emit("select-city", val);
            },
//            ---------------------------------  选择县
            select_area(val) {
            },
//            -------------------------------  保存
            update(id) {
                if(this.selectCategorys.length===0){
                    this.categorysMessage = true;
                    this.rules.categorys = [
                        {required: "true", message: "请选择分类", trigger: "blur,change", type: "array"}
                    ];
                }
                this.$refs.lookEditForm.validate((bool) => {
                    if (bool) {
                        this.$emit("add-edit", id,this.selectCategorys.map(row=>row.child_id));
                    } else {
                        this.$reqKey('update_look_edit_form', false);
                    }
                })
            },
//            -------------------------------  取消
            cancel() {
                this.dialog = false;
            },
//            -------------------------------   关闭
            close() {
                this.dialog = false;
            },
//           供应商类型
            get_supplier_type() {
                this.$http(api_supplier_type).then(res => {
                    this.typeList = res.map(row => {
                        return {
                            value: row.label,
                            label: row.name
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
//          交易类型
            supplier_transaction() {
                this.$http(api_supplier_transaction).then(res => {
                    this.transactionTypeList = res.map(row => {
                        return {
                            value: row.label,
                            label: row.name
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            init_categorys(){
                this.selectCategorys = [];
                if(this.lookEditForm.categorys&&this.lookEditForm.categorys.length>0&&this.categorysList.length>0) {
                    this.lookEditForm.categorys.forEach(id => {
                        this.categorysList.forEach(row => {
                            let find = row.children.find(child => child.value === id);
                            if (!!find) {
                                this.selectCategorys.push({
                                    label: `${this.categorysRes[row.value].name}/${this.categorysRes[find.value].name}`,
                                    parent_id: row.value,
                                    child_id: find.value
                                });
                                find.disabled = true;
                                this.rules.categorys = [];
                                this.categorysMessage = false;
                            }
                        });
                    });
                    this.$nextTick(() => {
                        this.lookEditForm.categorys = [];
                    })
                }
            }
        },
        watch: {
            dialog(val) {
                this.$emit("input", val);
            },
            value(val) {
                this.dialog = val;
            },
            'lookEditForm.payment_information': {
                immediate: true,
                handler(val) {
                    if (this.lookEditForm.pay_type === 2 && !!val && val.length===0) {
                        this.rules.payment_information = [
                            {required: "true", message: "必须上传付款资料", trigger: "blur,change", type: "array"}
                        ];
                    } else {
                        this.rules.payment_information = [];
                    }
                }
            },
            'lookEditForm.pay_type': {
                immediate: true,
                handler(val) {
                    if (val === 2) {
                        this.rules.private_accounts = [
                            {required: "true", message: "对私账户不能为空", trigger: "blur,change"}
                        ];
                        this.rules.private_accounts_name = [
                            {required: "true", message: "对私户名不能为空", trigger: "blur,change"}
                        ];
                        this.rules.private_accounts_bank = [
                            {required: "true", message: "对私开户行不能为空", trigger: "blur,change"}
                        ];
                        this.rules.opening_bank_city = [
                            {required: "true", message: "开户行所在市不能为空", trigger: "blur,change",type:'number'}
                        ];
                        this.rules.opening_id_card = [
                            {required: "true", message: "开户身份证不能为空", trigger: "blur,change"}
                        ];
                        this.rules.bank_retained_contact_way = [
                            {required: "true", message: "银行留存联系方式不能为空", trigger: "blur,change"}
                        ];
                        if (this.lookEditForm.payment_information&&this.lookEditForm.payment_information.length===0) {
                            this.rules.payment_information = [
                                {required: "true", message: "必须上传付款资料", trigger: "blur,change", type: "array"}
                            ];
                        } else {
                            this.rules.payment_information = [];
                        }
                    } else {
                        this.rules.private_accounts = [];
                        this.rules.private_accounts_name = [];
                        this.rules.private_accounts_bank = [];
                        this.rules.opening_bank_city = [];
                        this.rules.opening_id_card = [];
                        this.rules.bank_retained_contact_way = [];
                        this.rules.payment_information = [];
                    }
                }
            },
            provinceList:{
                immediate: true,
                handler(val) {
                    if (val.length > 0) {
                        this.rules.province_id = [
                            {required: "true", message: "地址不能为空", trigger: "change", type: 'number'}
                        ];
                    } else {
                        this.rules.province_id = [];
                    }
                }
            },
            cityOption:{
                immediate: true,
                handler(val) {
                    if (val.length > 0) {
                        this.rules.city_id = [
                            {required: "true", message: "省/市/州不能为空", trigger: "change", type: 'number'}
                        ];
                    } else {
                        this.rules.city_id = [];
                    }
                }
            },
            areaOption:{
                immediate: true,
                handler(val) {
                    if (val.length > 0) {
                        this.rules.area_id = [
                            {required: "true", message: "地区/市/县不能为空", trigger: "change", type: 'number'}
                        ];
                    } else {
                        this.rules.area_id = [];
                    }
                }
            },
            'lookEditForm'(val) {
                if (val.transaction_type === 0) {
                    val.transaction_type = '';
                }
                if(val.hasOwnProperty('categorys')){
                    this.init_categorys();
                }
            },
            publicIsRequired:{
                immediate:true,
                handler(val){
                    if(val&&this.lookEditForm.pay_type===2){
                        this.rules.public_accounts = [
                            {required: "true", message: "对公账户必须填写完整！或不填。", trigger: "blur,change"}
                        ];
                        this.rules.public_accounts_name = [
                            {required: "true", message: "对公账户必须填写完整！或不填。", trigger: "blur,change"}
                        ];
                        this.rules.public_accounts_bank = [
                            {required: "true", message: "对公账户必须填写完整！或不填。", trigger: "blur,change"}
                        ];
                        this.rules.public_bank_city = [
                            {required: "true", message: "对公账户必须填写完整！或不填。", trigger: "blur,change",type:'number'}
                        ];
                        this.rules.public_bank_retained_contact_way = [
                            {required: "true", message: "对公账户必须填写完整！或不填。", trigger: "blur,change"}
                        ];
                    }else{
                        this.rules.public_accounts = [];
                        this.rules.public_accounts_name = [];
                        this.rules.public_accounts_bank = [];
                        this.rules.public_bank_city = [];
                        this.rules.public_bank_retained_contact_way = [];
                    }
                }
            }
        },
        computed: {
            publicIsRequired(){
                return !!this.lookEditForm.public_accounts||!!this.lookEditForm.public_accounts_name||!!this.lookEditForm.public_accounts_bank||!!this.lookEditForm.public_bank_city||!!this.lookEditForm.public_bank_retained_contact_way
            },
            btnName() {
                if (this.loghidden) {
                    return "隐藏操作日记"
                } else {
                    return "显示操作日记"
                }
            },
            comTransaction() {
                if (this.transactionTypeList instanceof Array) {
                    let ret = this.transactionTypeList.findRet(row => {
                        if (row.value === this.lookEditForm.transaction_type) {
                            return row.label;
                        }
                    });
                    return ret;
                }
            },
            comTitle() {
                if (this.typeList instanceof Array) {
                    let ret = this.typeList.findRet(row => {
                        if (row.value === this.lookEditForm.type) {
                            return row.label;
                        }
                    });
                    return ret;
                }
            },
            cityOption() {
                let city = [];
                this.cityList.length > 0 && (
                    this.cityList.map(row => {
                        if (row.pid === this.lookEditForm.province_id) {
                            city.push({label: row.label, value: row.value});
                        }
                    })
                );
                return city;
            },
            areaOption() {
                let area = [];
                this.areaList.length > 0 && (
                    this.areaList.map(row => {
                        if (row.pid === this.lookEditForm.city_id) {
                            area.push({label: row.label, value: row.value});
                        }
                    })
                );
                return area;
            },
            account_period_people:{
                get(){
                    return {label:this.lookEditForm.payment_communicator_name,
                        value:this.lookEditForm.payment_communicator}
                },
                set(val){
                    this.lookEditForm.payment_communicator_name = val.label;
                    this.lookEditForm.payment_communicator = val.value;
                }
            },
            bankDepositCity(){
                let city = [];
                Object.keys(this.district).forEach(key=>{
                    Object.keys(this.district[key]._child).forEach(childKey=> {
                        city.push({label: this.district[key]._child[childKey].name, value: this.district[key]._child[childKey].id});
                    });
                });
                return city;
            }
        },
        filters:{
            filterDate(val){
                return val?datef('YYYY-MM-dd',val/1000):'-- --';
            },
        },
        props: {
            lookEditForm: {
                required: true,
                type: Object
            },
            value: {},
            isLook: {
                required: true,
                type: Boolean
            },
            title: {
                required: true,
                type: String
            },
            removeFile:{
                type:Array,
                default(){
                    return []
                }
            },
            removeInformation:{
                type:Array,
                default(){
                    return []
                }
            }
        },
        components: {
            pageDialog:require('@/components/page-dialog').default,
            uiInput: require('@/components/ui-input').default,
            labelSelect: require('@/components/label-select').default,
            uiSelect: require('@/components/ui-select').default,
            requestButton: require('@/global-components/request-button').default,
            imageUpload: require("./image-upload").default,
            blowupImage: require("@/components/blowup-image").default,
            purchaser: require('@/api-components/purchaser').default,
            card: require('@/components/card').default,
            uiTip: require('@/components/ui-tip').default,
            scrollSelect:require('@/components/scroll-select').default
        }
    }

</script>
