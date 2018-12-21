<template>
    <div class="after-marker">
        <div class="dotted-boxs mb-xs">联络/评价</div>

        <evaluate :formData="formData"
                  :order_id="order_id"
                  :orders-number="ordersNumber"
                  :mdfid="mdfId"
                  :channel_name="channel_name"
                  :has-shipping-time="hasShippingTime"
                  @refund-status-change="refund_status_change"
                  :form="form"
                  :cancel-id="cancelId"
                  @review="review"></evaluate>

        <div class="dotted-boxs">invoice</div>
        <table class="template mt-xs" style="width:100%">
            <tr style="line-height:25px">
                <td class="bold-font t-right" style="width:20%">Invoice地址：</td>
                <td class="t-left">
                    <div v-if="!isShow&&!form.customer.address.recipient">
                        <span>Invoice地址未录入，将使用订单地址生成</span>
                        <permission
                            tag="ElButton"
                            :route="apis.url_update"
                            class="fr"
                            size="mini"
                            type="primary"
                            @click.native="edit_address">编辑
                        </permission>
                    </div>
                    <div class="mt-xs" v-else>
                        <el-form label-width="100px" :model="form.customer.address" ref="address" :rules="rules">
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="收件人：" prop="recipient">
                                        <ui-input :edit="isEdit" v-model="form.customer.address.recipient"></ui-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="16">
                                    <el-form-item label="地址：" prop="address">
                                        <ui-input :edit="isEdit" v-model="form.customer.address.address"></ui-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="城市：">
                                        <ui-input :edit="isEdit" v-model="form.customer.address.city"></ui-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="省/州：">
                                        <ui-input :edit="isEdit" v-model="form.customer.address.province"></ui-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="邮编：">
                                        <ui-input :edit="isEdit" v-model="form.customer.address.zip_code"
                                                  @input="change_english"></ui-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="国家：">
                                        <el-select v-if="isEdit"
                                                   ref="country"
                                                   v-mouse-side.mousewheel="()=>{$refs.country.visible=false}"
                                                   v-model="form.customer.address.country_code"
                                                   filterable clearable>
                                            <el-option v-for="item in countryList" :key="item.value" :value="item.value"
                                                       :label="item.label"></el-option>
                                        </el-select>
                                        <span v-else>{{countryTitle}}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="电话：" prop="tel">
                                        <ui-input :edit="isEdit" v-model="form.customer.address.tel"></ui-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <div class="fr mb-xs">
                            <permission tag="ElButton"
                                        :route="apis.url_update"
                                        v-if="!isEdit"
                                        type="primary"
                                        size="mini"
                                        @click.native="do_edit">编辑
                            </permission>
                            <div v-else>
                                <el-button size="mini" type="primary" @click.native="save('address')">确定</el-button>
                                <el-button size="mini" @click.native="cancel">取消</el-button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            <tr style="line-height:25px">
                <td class="bold-font t-right">
                    <div>Invoice</div>
                    <div>PDF</div>
                </td>
                <td class="t-left">
                    <div v-if="form.customer">
                        <div v-if="form.customer.is_generate">
                            <a class="link" :href="pdfUrl" target="_blank" title="点击打开pdf文件">打开</a>
                            <!--<a class="link ml-lg" :href="downUrl" :download="form.customer.filePath" target="_blank" title="点击下载pdf文件">下载</a>-->
                            <span class="operate ml-sm" @click="download_pdf" title="点击下载pdf文件">下载</span>
                            <permission
                                tag="span"
                                :route="apis.url_get_generate"
                                class="t-right ml-lg operate"
                                @click="create_click"
                                title="点击重新生成发票">重新生成
                            </permission>
                            <el-button type="primary" class="ml-sm" size="mini" @click="send_invoice">发送Invoice给买家</el-button>
                        </div>
                        <div v-else>
                            <span>尚未生成</span>
                            <permission
                                tag="span"
                                class="ml-sm operate"
                                :route="apis.url_get_generate"
                                @click="create_click" title="点击手动生成发票">手动生成
                            </permission>
                            <el-button type="primary" class="ml-sm" size="mini" @click="send_invoice" :disabled="true">发送Invoice给买家</el-button>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
        <div class="mt-xs">
            <div class="dotted-boxs mb-xs">
                <span class="bold-font">售后处理</span>
                <permission
                    tag="span"
                    :route="apis.url_add_order"
                    class="operate ml-lg"
                    @click="new_add">新建售后处理单
                </permission>
            </div>
            <el-table
                class="scroll-bar"
                v-if="after.length>0"
                :data="after"
                border
                highlight-current-row
            >
                <el-table-column label="时间" inline-template>
                    <times :time="row.create_time"></times>
                </el-table-column>
                <el-table-column label="售后单号" inline-template>
                    <span class="operate" @click="cur_aftersale(row.sale_number)">{{row.sale_number}}</span>
                </el-table-column>
                <el-table-column label="售后处理" prop="type"></el-table-column>
                <el-table-column label="退款金额" inline-template>
                    <div>{{row.refund_amount | filterPrice}}</div>
                </el-table-column>
                <el-table-column label="操作人" prop="operator" show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
        <after-sale ref="addAfter"
                    :order-number="orderNumber"
                    v-model="addDialog"
                    @save="save_after"
                    @submit="submit"
                    :is-trigger="isTrigger"></after-sale>
        <look-edit
            :title="afterSaleTitle"
            v-model="lookEditDialog"
            :form="lookEditForm"
            :is-edit="editAfterSale"
            :ap-status="apStatus"
            :re-status="reStatus"
            :is-handle="isHandle"
            @open-aftersale="open_aftersale"
        ></look-edit>
        <form-mdf
            ref="formmfd"
            :mdfid="localMdfId"
            :order_id="localOrderId"
            v-model="mdfValue"
            :is-edit="mdfEdit"
            :has-after-remark="false"
            :title="mdfTitle"
            :btn-show="false"
        ></form-mdf>
        <send-invoice v-model="invoiceDialog" :mdfid="order_id"></send-invoice>
        <invoice-rules v-model="invoiceRules" :rules-list="rulesList" @sure_click="sure_click"></invoice-rules>
    </div>
</template>
<style lang="stylus">
    .after-marker {
        .title-box {
            box-sizing: border-box;
            padding: 0 8px;
            height: 26px;
            line-height: 24px;
            border: 1px solid #ddd;
            overflow: hidden;
        }
        .dotted-boxs {
            font-weight: bold;
            height: 20px;
            line-height: 19px;
            padding: 0 10px 0;
            border-bottom: 1px dotted #ddd;
        }
    }

</style>
<script>
    import {api_update, api_get_country, api_get_generate} from '../../../api/order-local';
    import {url_update, url_get_generate} from '../../../api/order-local';
    import {url_add_order,api_order_sales_invoice_rules} from '../../../api/after-sale';
    import {api_look_over} from '../../../api/after-sale';
    import {chinese, allPhone} from '../../../define/validator_reg';
    import {downloadFile} from '../../../lib/http';

    export default {
        permission: {
            url_update,
            url_add_order,
            url_get_generate,
        },
        data() {
            let checkTel = (rule, value, callback) => {
                if (value) {
                    let str = value.replace(/\s/g, '');
                    if (!allPhone.test(str)) {
                        return callback(new Error('请输入正确的电话号码'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            return {
                invoiceDialog:false,
                invoiceRules: false,
                rulesList:[],
                lookEditDialog: false,
                afterSaleTitle:'',
                lookEditForm: {},
                editAfterSale: false,
                apStatus: 1,
                reStatus: 1,
                isHandle: false,
                isEdit: false,
                countryList: [],
                isShow: false,
                orderNumber: "",
                isTrigger: false,
                addDialog: false,
                contactVisible: false,
                messageVisible: false,
                channel_id: 0,
                oldAddress: {},
//                address:{},
                rules: {
                    recipient: [
                        {required: true, message: "收件人必填", trigger: 'blur,change'},
                    ],
                    address: [
                        {required: true, message: "地址必填", trigger: 'blur,change'},
                    ],
                    tel: [
                        {validator: checkTel, trigger: 'blur'},
                    ]
                },
                localMdfId: "",
                localOrderId: "",
                mdfValue: false,
                mdfEdit: {
                    edit: false,
                },
                mdfTitle: "",
                invoiceDialog:false,
            }
        },
        computed: {
            downUrl() {
                if (this.form.customer) {
                    return `${config.apiHost}/downloadFile/downPdfFile`;
                }
            },
            /*暂未启用  控制 新建售后处理单 显示还是隐藏*/
            isShows() {
                if (this.showBtn) {
                    if (this.isAfter) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            },
            pdfUrl() {
                if (this.form.customer) {
                    return config.apiHost + this.form.customer.open_link;
                }
            },
            downUrl() {
                if (this.form.customer) {
                    return config.apiHost + this.form.customer.filePath;
                }
            },
            countryTitle() {
                if (this.countryList instanceof Array) {
                    let cur = this.countryList.findRet(row => {
                        if (row.value === this.form.customer.address.country_code) {
                            return row.label;
                        }
                    });
                    return cur;
                }
            },
            after() {
                let cur = [];
                if (this.form.customer) {
                    return this.form.customer.after;
                } else {
                    return cur
                }
            },
            hasShippingTime() {
                let nowTime = new Date().getTime();
                let outTime = new Date(this.form.shipping_time*1000);
                let time = nowTime-outTime;
                let loseTime = (time/(3600*1000*24));
                return  this.isInvalid || loseTime>30&&this.form.shipping_time!=0
            }
        },
        filters: {
            filterPrice(val) {
                return val ? parseFloat(val).toFixed(2) : '0.00';
            }
        },
        created() {
            this.get_country();
        },
        methods: {
            download_pdf() {
                let url = this.downUrl;
                let filePath = this.form.customer.filePath;
                downloadFile({
                    url,
                    get: {filePath},
                    fileName: filePath.slice(filePath.indexOf('/')).replace('.pdf', ''),
                    suffix: '.pdf'
                });
            },
            cur_aftersale(val) {
                console.log(val,'val');
                this.lookEditDialog = true;
                this.afterSaleTitle = `编辑售后单：${this.ordersNumber} 信息`;
                this.get_lookover(val);
            },
            review() {
                this.$emit('review')
            },
            refund_status_change(status){
                this.$emit('refund-status-change', status);
            },
//            获取查看状态下的数据
            get_lookover(val) {
                this.lookEditForm = {};
                this.$http(api_look_over, val).then(res => {
                    this.lookEditForm = res;
                }).catch(code => {
                    console.log(code);
                })
            },
            edit_address() {
                this.oldAddress = window.clone(this.form.customer.address);
                this.isShow = true;
                this.isEdit = true
            },
            open() {
                console.log("打开");
            },
            download() {
                console.log(this.form.customer.filePath);
                window.location.href = config.apiHost + this.form.customer.filePath;
            },
            create_again() {
                console.log("重新生成");
            },
            create_click() {
                this.invoiceRules = true;
                this.$http(api_order_sales_invoice_rules).then(res => {
                    this.rulesList = [{name: "全部", id: 0 }, ...res];
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                })
            },
            sure_click(val){
                this.$http(api_get_generate,this.order_id,{rule_id: val}).then(res=>{
                    this.$message(res.message);
                    this.$emit("create-click",res);
                    this.invoiceRules = false;
                }).catch(code=>{
                    this.$message({message:code.message,type:'error'});
                })
            },
            send_invoice(){
                this.invoiceDialog = true;
            },
            new_add() {
                this.addDialog = true;
                this.orderNumber = this.form.order_number;
                this.isTrigger = true;
                this.$nextTick(() => {
                    this.$refs.addAfter.search();
                })
            },
            submit(is_handle) {
                this.$emit('add-aftermarker',is_handle);
            },
            save_after(is_handle) {
                this.$emit('add-aftermarker',is_handle);
            },
            do_edit() {
                this.isEdit = true;
                this.oldAddress = window.clone(this.form.customer.address);
                console.log(this.oldAddress);
            },
            save(address) {
                this.$refs[address].validate((bool) => {
                    if (bool) {
                        let params = {
                            address: this.form.customer.address,
                        }
                        this.$http(api_update, this.form.id, {customer: params}).then(res => {
                            console.log(res);
                            this.$message(res.message);
                            this.isShow = true;
                            this.isEdit = false;
                        }).catch(code => {
                            this.isEdit = true;
                            this.$message({message: code.message, type: 'error'});
                        })
                    }
                })
            },
            cancel() {
                for (let i in this.oldAddress) {
                    this.oldAddress.hasOwnProperty(i) && (this.form.customer.address[i] = this.oldAddress[i]);
                }
                this.isEdit = false;
                this.isShow = false;
            },
            get_country() {
                this.$http(api_get_country).then(res => {
                    this.countryList = res.map(row => {
                        return {
                            label: row.country_cn_name,
                            value: row.country_code
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            //检查是邮编是否含有汉字
            change_english(val) {
                if (val.match(chinese)) {
                    this.form.customer.address.zip_code = val.replace(chinese, "")
                }
            },
            open_aftersale(val) {
                this.localMdfId = val.localMdfId;
                this.localOrderId = val.localOrderId;
                this.mdfValue = val.mdfValue;
                this.mdfTitle = val.mdfTitle;
                this.$refs.formmfd.require_server(this.localMdfId);
            },
            //判断是否是电话
//            change_phone(val){
//                console.log(val.match(allPhone))
//                if (val.match(allPhone)) {
//                    this.form.customer.address.tel = val.replace(allPhone, "");
//                    console.log(this.form.customer.address.tel);
//                }
//            }

        },
        props: {
            cancelId:{},
            isInvalid: {},
            /*index 页面已经传过来，但是没用，用来判断是否存在售后处理单*/
            showBtn: {
                default() {
                    return true
                }
            },
            /*index 页面已经传过来，但是没用，用来判断“产品信息”是否存在产品*/
            isAfter: {
                type: Boolean,
                required: true
            },
            form: {
                required: true,
                type: Object
            },
            formData: {
                required: true
            },
            channel_name: {
                type: String
            },
            ordersNumber: {},
            order_id: {},
            mdfId: {}
        },
        components: {
            labelSelect: require('../../../components/label-select.vue').default,
            afterSale: require('../../customer-service/after-sale/add.vue').default,
            uiInput: require('../../../components/ui-input.vue').default,
            evaluate: require('./evaluate.vue').default,
            lookEdit: require('../../customer-service/after-sale/look-edit.vue').default,
            formMdf: require('../local/form-mdf.vue').default,
            sendInvoice:require('../local/send-invoice').default,
            invoiceRules: require('./invoice-rules').default,
        }
    }
</script>
