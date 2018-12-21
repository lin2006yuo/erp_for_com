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
            @refund-status-change="refund_status_change"
            @review="review"></evaluate>
        <div class="dotted-boxs">invoice</div>
        <table class="template mt-xs" style="width:100%">
            <tr style="line-height:25px">
                <td class="bold-font t-right" style="width:20%">Invoice地址：</td>
                <td class="t-left">
                    <div v-if="!isShow&&Object.keys(address).length===0">
                        <span>Invoice地址未录入，将使用订单地址生成</span>
                        <el-button class="fr" size="mini" type="primary" @click.native="edit_address" v-if="showBtn">
                            编辑
                        </el-button>
                    </div>
                    <div class="mt-xs" v-if="isShow||Object.keys(address).length>0">
                        <el-form label-width="100px" :model="address" ref="address" :rules="rules">
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="收件人：" prop="recipient">
                                        <ui-input :edit="isEdit" v-model="address.recipient"></ui-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="16">
                                    <el-form-item label="地址：" prop="address">
                                        <ui-input :edit="isEdit" v-model="address.address"></ui-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="城市：">
                                        <ui-input :edit="isEdit" v-model="address.city"></ui-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="省/州：">
                                        <ui-input :edit="isEdit" v-model="address.province"></ui-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="邮编：">
                                        <ui-input :edit="isEdit" v-model="address.zip_code"
                                                  @input="change_english"></ui-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="国家：">
                                        <el-select v-if="isEdit" v-model="address.country_code" filterable clearable>
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
                                        <ui-input :edit="isEdit" v-model="address.tel"></ui-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <div class="fr mb-xs" v-if="showBtn">
                            <el-button v-if="!isEdit" type="primary" size="mini" @click.native="do_edit">编辑</el-button>
                            <div v-else>
                                <el-button size="mini" type="primary" @click.native="save">确定</el-button>
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
                        <div v-if="showBtn">
                            <div v-if="form.customer.is_generate">
                                <a class="link" :href="pdfUrl" target="_blank" title="点击打开pdf文件">打开</a>
                                <!--<a class="link ml-lg" :href="downUrl" :download="form.customer.filePath" target="_blank"-->
                                <!--title="点击下载pdf文件">下载</a>-->
                                <span class="operate ml-sm" @click="download_pdf" title="点击下载pdf文件">下载</span>
                                <span class="t-right ml-lg operate" @click="create_click" title="点击重新生成发票">重新生成</span>
                                <el-button type="primary" class="ml-sm" size="mini" @click="send_invoice">发送Invoice给买家
                                </el-button>
                            </div>
                            <div v-else>
                                <span>尚未生成</span>
                                <span class="operate ml-lg" @click="create_click" title="点击手动生成发票">手动生成</span>
                                <el-button type="primary" class="ml-sm" size="mini" @click="send_invoice"
                                           :disabled="true">发送Invoice给买家
                                </el-button>
                            </div>
                        </div>
                        <div v-else>
                            <div v-if="form.customer.is_generate">
                                <span title="该功能已被禁止">打开</span>
                                <span class="ml-lg" title="该功能已被禁止">下载</span>
                                <span class="t-right ml-lg" title="该功能已被禁止">重新生成</span>
                            </div>
                            <div v-else>
                                <span>尚未生成</span>
                                <span class="ml-lg" title="该功能已被禁止">手动生成</span>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
        <div class="mt-xs">
            <div class="dotted-boxs mb-xs">
                <span class="bold-font">售后处理</span>
                <span class="operate ml-lg" @click="new_add" v-if="showBtn">新建售后处理单</span>
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
                <el-table-column label="售后单号" prop="sale_number"></el-table-column>
                <el-table-column label="售后处理" prop="type"></el-table-column>
                <el-table-column label="退款金额" inline-template>
                    <div>{{row.refund_amount | filterPrice}}</div>
                </el-table-column>
                <el-table-column label="操作人" prop="operator" show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
        <send-invoice v-model="invoiceDialog" :mdfid="mdfid"></send-invoice>
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
    import {api_update, api_get_country, api_get_generate} from '@/api/order-local';

    import {chinese, allPhone} from '@/define/validator_reg';
    import {downloadFile} from '@/lib/http';

    export default {
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
                isEdit: false,
                countryList: [],
                isShow: false,
                orderNumber: "",
                isTrigger: false,
                addDialog: false,
                oldAddress: {},
                address: {},
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
                invoiceDialog: false
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
            downUrl() {
                if (this.form.customer) {
                    return `${config.apiHost}/downloadFile/downPdfFile`;
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
                        if (row.value === this.address.country_code) {
                            return row.label;
                        }
                    })
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
                return this.form.shipping_time > 0 || this.isInvalid
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
            review() {
                this.$emit('review')
            },
            refund_status_change(status){
                this.$set('refund-status-change', status);
            },
            require_server() {
                this.$http(api_info, this.order_id).then(res => {
                    this.formData = res.customer.source[0];
                    this.$emit('require-server')
                }).catch(code => {
                    console.log(code)
                })
            },
            edit_address() {
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
                this.oldAddress = window.clone(this.address);
                this.isShow = true;
                this.isEdit = true
            },
            download() {
                window.location.href = config.apiHost + this.form.customer.filePath;
            },
            create_click() {
                this.$http(api_get_generate, this.form.id).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.$emit("create-click", res);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
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
            do_edit() {
                this.isEdit = true;
                this.oldAddress = window.clone(this.address);
            },
            save() {
                this.$refs.address.validate((bool) => {
                    if (bool) {
                        let params = {
                            address: this.address,
                        }
                        this.$http(api_update, this.form.id, {customer: params}).then(res => {
                            this.$message({type: "success", message: res.message || res})
                            this.isEdit = false;
                        }).catch(code => {
                            this.isEdit = true;
                            this.$message({type: "error", message: code.message || code})
                        })
                    }
                })
            },
            cancel() {
                for (let i in this.oldAddress) {
                    this.oldAddress.hasOwnProperty(i) && (this.address[i] = this.oldAddress[i]);
                }
                this.isEdit = false;
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
        },
        props: {
            isInvalid: {},
            showBtn: {
                default() {
                    return true
                }
            },
            form: {
                required: true,
                type: Object
            },
            channel_name: {},
            order_id: {},
            ordersNumber: {},
            formData: {},
            mdfid: {}
        },
        components: {
            uiInput: require('@/components/ui-input.vue').default,
            evaluate: require('./evaluate.vue').default,
            sendInvoice: require('./send-invoice').default,
        }
    }
</script>
