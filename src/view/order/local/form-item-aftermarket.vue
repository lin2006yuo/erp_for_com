<template>
    <div class="after-marker">
        <div class="dotted-boxs mb-xs">联络/评价</div>

        <evaluate
            :formData="formData"
            :order_id="order_id"
            :channel_name="channel_name"
            :mdfid="mdfid"
            :has-shipping-time="hasShippingTime"
            :form="form"
            :orders-number="ordersNumber"
            @review="review"
            @refund-status-change="refund_status_change"
            :cancelId="cancelid">

        </evaluate>

        <div class="dotted-boxs">invoice</div>
        <table class="template mt-xs" style="width:100%">
            <tr style="line-height:25px">
                <td class="bold-font t-right" style="width:20%">Invoice地址：</td>
                <td class="t-left">
                    <div v-if="!isShow && form.customer && form.customer.address &&!form.customer.address.recipient">
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
                        <el-form label-width="100px" :model="address" ref="address" :rules="rules">
                            <el-row class="mb-sm">
                                <el-col :span="8">
                                    <el-form-item label="收件人：" prop="recipient">
                                        <ui-input :edit="isEdit" v-model="address.recipient"></ui-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="电话：" prop="tel">
                                        <ui-input :edit="isEdit" v-model="address.tel"></ui-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="邮编：">
                                        <ui-input :edit="isEdit" type="number" v-model="address.zip_code"
                                                  @input="change_english"></ui-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row class="mb-sm">
                                <el-col :span="8">
                                    <el-form-item label="城市：">
                                        <ui-input :edit="isEdit" v-model="address.city"></ui-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="省/州：">
                                        <ui-input :edit="isEdit" v-model="address.province"></ui-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="国家：">
                                        <el-select v-if="isEdit" v-model="address.country_code" ref="country"
                                                   v-mouse-side.mousewheel="()=>{$refs.country.visible=false}"
                                                   filterable clearable>
                                            <el-option v-for="(item, index) in countryList" :key="index"
                                                       :value="item.value" :label="item.label"></el-option>
                                        </el-select>
                                        <span v-else>{{countryTitle}}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row class="mb-sm">
                                <el-col :span="12">
                                    <el-form-item label="地址：" prop="address">
                                        <ui-input :edit="isEdit" v-model="address.address"></ui-input>
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
                                <el-button size="mini" type="primary" @click.native="save('address')">保存</el-button>
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
                            <!--<a class="link ml-lg" :href="downUrl" :download="form.customer.filePath" target="_blank" title="点击下载pdf文件"></a>-->
                            <span class="operate ml-sm" @click="download_pdf" title="点击下载pdf文件">下载</span>
                            <permission
                                tag="span"
                                :route="apis.url_get_generate"
                                class="t-right ml-sm operate"
                                @click="create_click"
                                title="点击重新生成发票">重新生成
                            </permission>
                            <el-button type="primary" class="ml-sm" size="mini" @click="send_invoice">发送Invoice给买家
                            </el-button>
                        </div>
                        <div v-else>
                            <span>尚未生成</span>
                            <permission
                                tag="span"
                                class="ml-sm operate"
                                :route="apis.url_get_generate"
                                @click="create_click" title="点击手动生成发票">手动生成
                            </permission>
                            <el-button type="primary" class="ml-sm" size="mini" @click="send_invoice" :disabled="true">
                                发送Invoice给买家
                            </el-button>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
        <div class="mt-xs">
            <div class="dotted-boxs mb-xs">
                <span class="bold-font">售后处理</span>
                <permission
                    v-if="isPackage"
                    tag="span"
                    :route="apis.url_add_order"
                    class="operate ml-lg"
                    @click="new_add"
                >新建售后处理单
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
                    <span class="operate" @click="open_after_sale(row)">{{row.sale_number}}</span>
                </el-table-column>
                <el-table-column label="售后处理" prop="type"></el-table-column>
                <el-table-column label="退款金额" inline-template>
                    <div>{{row.refund_amount | filterPrice}}</div>
                </el-table-column>
                <el-table-column label="操作人" prop="operator" show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
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
        <add ref="addAfter"
             :order-number="orderNumber"
             v-model="addDialog"
             @save="save_after"
             @submit="submit"
             :is-trigger="isTrigger"></add>
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
        <send-invoice v-model="invoiceDialog" :mdfid="mdfid"></send-invoice>
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
        .tab-head .body {
            padding-top: 40px;
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
            border: 1px solid #dcdcdc;
            border-top: none;
            padding-right: 5px;
            padding-bottom: 5px;
            padding-left: 5px;
            width: calc(100% - 12px);
        }
    }

</style>
<script>
    import {api_update, api_get_country, api_get_generate} from '../../../api/order-local';
    import {url_update, url_get_generate} from '../../../api/order-local';
    import {url_add_order} from '../../../api/after-sale';
    import {api_look_over, api_order_sales_invoice_rules} from '../../../api/after-sale';
    import {chinese, allPhone} from '../../../define/validator_reg';
    import {downloadFile} from '../../../lib/http';

    export default {
        name: 'formItemAftermarket',
        permission: {
            url_update,
            url_get_generate,
            url_add_order
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
                afterSaleTitle: "",
                pForm: {
                    id: '',
                    isAll: '',
                    orderId: '',
                    isAddTo: false,
                    title: ''
                },
                isEdit: false,
                editAfterSale: false,
                apStatus: 1,
                reStatus: 1,
                lookEditDialog: false,
                isHandle: false,
                countryList: [],
                isShow: false,
                orderNumber: "",
                isTrigger: false,
                addDialog: false,
                contactVisible: false,
                messageVisible: false,
                evaluateVisible: false,
                oldAddress: {},
                address: {},
                lookEditForm: {},
                channel_id: 0,
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
                invoiceDialog: false,
                invoiceRules: false,
                rulesList: [],
            }
        },
        watch: {
            //用计算属性 address中国家号没办法赋值,所以用监听
            form(val) {
                if (val.customer) {
                    if (val.customer.address instanceof Array) {
                        this.address = {}
                    } else {
                        this.address = val.customer.address;
                    }
                }
            },
        },
        computed: {
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
                    return `${config.apiHost}/downloadFile/downPdfFile`;
                }
            },
            countryTitle() {
                if (this.countryList instanceof Array) {
                    let cur = this.countryList.findRet(row => {
                        if (row.value === this.address.country_code) {
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
                let outTime = new Date(this.form.shipping_time * 1000);
                let time = nowTime - outTime;
                let loseTime = (time / (3600 * 1000 * 24));
                return this.isInvalid || (loseTime > 30 && this.form.shipping_time != 0)
            }
        },
        filters: {
            filterPrice(val) {
                return val ? parseFloat(val).toFixed(2) : '0.00';
            }
        },
        methods: {
            refund_status_change(status){
                this.$emit('refund-status-change',status);
            },
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
            review() {
                this.$emit('review')
            },
            edit_address() {
                this.oldAddress = window.clone(this.address);
                if (Object.keys(this.address).length <= 0) {
                    this.address = {
                        address: "",
                        city: "",
                        province: "",
                        zip_code: "",
                        country_code: "",
                        tel: "",
                    };
                }
                this.isShow = true;
                this.isEdit = true
            },
            open() {
                console.log("打开");
            },
            download() {
                window.location.href = config.apiHost + this.form.customer.filePath;
            },
            create_click() {
                this.invoiceRules = true;
                this.$http(api_order_sales_invoice_rules).then(res => {
                    this.rulesList = [{name: "全部", id: 0}, ...res];
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                })
            },
            sure_click(val) {
                if (val === '') {
                    this.$message({type: 'info', message: '发票规则不能为空！'})
                } else {
                    this.$http(api_get_generate, this.cancelid, {rule_id: val}).then(res => {
                        this.$message(res.message);
                        this.$emit("create-click", res);
                        this.invoiceRules = false;
                    }).catch(code => {
                        this.$message({message: code.message, type: 'error'});
                    })
                }
            },
            send_invoice() {
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
            open_after_sale(row) {
                this.lookEditDialog = true;
                this.afterSaleTitle = `编辑售后单：${this.ordersNumber} 信息`;
                this.get_lookover(row.sale_number);
            },
            submit() {
                this.$emit('add-aftermarker');
            },
            save_after() {
                this.$emit('add-aftermarker');
            },
            do_edit() {
                this.isEdit = true;
                this.oldAddress = window.clone(this.address);
            },
            save() {
                this.$refs.address.validate((bool) => {
                    if (bool) {
                        Object.keys(this.address).forEach(key => {
                            if (typeof this.address[key] === 'string') {
                                this.address[key] = this.address[key].trim();
                            }
                        });
                        let params = {
                            address: this.address,
                        };
                        this.$http(api_update, this.form.id, {customer: params}).then(res => {
                            this.$message({type: 'success', message: res.message || res});
                            this.isEdit = false;
                        }).catch(code => {
                            this.isEdit = true;
                            this.$message({message: code.message, type: 'error'});
                        })
                    }
                })
            },
            cancel() {
                this.address = {};
                for (let i in this.oldAddress) {
                    this.oldAddress.hasOwnProperty(i) && (this.address[i] = this.oldAddress[i]);
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
            //            获取查看状态下的数据
            get_lookover(val) {
                this.$http(api_look_over, val).then(res => {
                    this.lookEditForm = res;
                }).catch(code => {
                    console.log(code);
                });
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
        },
        props: {
            isInvalid: {},
            cancelid: {},
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
                required: true,
            },
            channel_name: {},
            order_id: {},
            mdfid: {},
            ordersNumber: {},
            isPackage: {
                type: Boolean,
                default() {
                    return true;
                }
            } //是否是从包裹列表进入
        },
        components: {
            labelSelect: require('../../../components/label-select.vue').default,
            add: require('../../customer-service/after-sale/add.vue').default,
            uiInput: require('../../../components/ui-input.vue').default,
            lookEdit: require('../../customer-service/after-sale/look-edit.vue').default,
            evaluate: require('./evaluate.vue').default,
            formMdf: require('../stock-orders/form-mdf.vue').default,
            sendInvoice: require('./send-invoice').default,
            invoiceRules: require('./invoice-rules').default,
        }
    }
</script>
