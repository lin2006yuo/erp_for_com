<template>
    <page-dialog :title="title"
                 v-model="show"
                 @close="close_dialog"
                 class="p-hand-word-form"
                 @open="open"
                 :close-on-click-modal="false" size="large">
        <tabs>
            <tab-head class="tab-heads"
                      :navs="[{label:'收件人信息',action:'buyinfo'},{label:'产品信息',action:'productList'},{label:'仓储物流',action:'logistics'},{label:'售后',action:'aftermarket'},{label:'付款',action:'pay'},{label:'利润',action:'profit'},{label:'日志',action:'logs'}]">
                <div>
                    <div style="position:relative">
                        <div class="inline">
                            <span class="marker">订单号：</span><span class="marker">{{order_number}}</span>
                            <span class="ml-lg is-wish-express" v-if="isWishExpress&&channel_name==='wish'">&nbspWish Express&nbsp</span>
                            <span class="ml-lg is-epc-order" v-if="isEpcOrder&&channel_name==='wish'">&nbspEPC-合并交易&nbsp</span>
                            <span class="ml-lg red" v-if="salesRemark">{{salesRemark}}</span>
                            <span class="ml-lg">{{channel_name}}</span>
                        </div>
                        <div class="fr">
                            <span class="mr-lg">{{seller}}</span>
                            <!--常用备注   一直存在页面-->
                            <div class="remark-sale-look" v-if="showRemark">
                                <label class="remark-sale-header">备注信息</label>
                                <el-form class="remark-sale-body">
                                    <el-form-item>
                                        <el-input type="textarea" v-model="notes" :maxlength="225"
                                                  :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                                    </el-form-item>
                                </el-form>
                                <div class="remark-sale-footer">
                                    <div class="fr">
                                        <button class="small-button submit" type="button" @click="submit">提交</button>
                                        <button class="small-button cancel" type="button" @click="cancel">取消</button>
                                    </div>
                                </div>
                            </div>
                            <el-button class="inline" size="mini" type="primary" @click.native="show_remark">备注
                            </el-button>
                            <!--作废 / 需人工审核  状态才出现的备注框-->
                            <little-remark top="28px" right="0"
                                           label="添加原因" v-if="isAdd"
                                           @submit="save_reason"
                                           @cancel="cancel_reason"></little-remark>
                            <trends-select
                                v-if="showTrends"
                                :style="processStatus.length===0?`vertical-align: bottom`:''"
                                class="inline"
                                :selects="processStatus"
                                type="primary"
                                @trigger="cur_operate"></trends-select>
                        </div>
                        <div style="clear:both"></div>
                    </div>
                    <!--作废订单备注显示-->
                    <div v-if="invalid.status&&invalid.status===4294967295" class="mes-box invalid-color">
                        <!--title-->
                        <span style="color:#FAEB21" class="bold-font inline">订单已作废：</span>
                        <!--作废订单的备注信息-->
                        <ui-tips style="color:#fff" :content="invalid.reason_for_invalid" :width="70"></ui-tips>
                        <span class="fr inline" style="color:#fff">{{filterTime(invalid.time_for_invalid)}}</span>
                    </div>
                    <!--客户留言信息显示-->
                    <div :class="[check?'green-color':'red-color','mes-box']" v-if="message">
                        <span class="bold-font">留言信息：</span><br>
                        <span v-html="message"></span>
                        <el-checkbox class="fr" v-model="check" @change="already(check)" :disabled="check">已读
                        </el-checkbox>
                    </div>
                    <!--员工备注信息显示-->
                    <div class="mes-box blue-color" v-for="item in comNotes" :key="item.creator_id">
                                <span class="fr">
                                     <span>{{filterTime(item.create_time)}}</span>
                                     <span class="ml-xs">{{item.creator_id}}</span>
                                </span>
                        <div class="inline bold-font" style="vertical-align: top;word-break: break-all;width: 75%;">备注信息：<span>{{item.note}}</span></div>
                        <i class="close-icon" @click="delete_note(item)"></i>
                    </div>
                    <el-steps ref="step" :space="100" :active="active" finish-status="success" class="ml-lg">
                        <el-step v-for="(item,index) in steps" :key="index" :title="item.name"
                                 :description="filterTime(item.time)"></el-step>
                    </el-steps>
                    <div class="mt-sm error-border" v-if="errorList.length>0">
                        <span class="marker">订单异常情况：</span>
                        <div class="ml-sm mt-mini" v-for="(item,index) in errorList" :key="index">
                            <span>{{item.remark}}</span>：<span>{{item.message}}</span>
                        </div>
                    </div>
                </div>
            </tab-head>
            <tab-item id="buyinfo" label="收件人信息">
                <form-item-buyinfo :id="mdfid" :form="buyinfo" @submit="buyinfo_edit"
                                   :showBtn="showBtnPublic"></form-item-buyinfo>
            </tab-item>
            <tab-item id="productList" label="产品信息">
                <form-item-product :id="mdfid" :form="productList" @submit="product_edit" :showBtn="showBtnPublic"
                                   :cur-status="curStatus"></form-item-product>
            </tab-item>
            <tab-item id="logistics" label="仓储物流">
                <form-item-logistics :id="mdfid" :form="logistics"
                                     :formData="forms"
                                     @submit="logistics_edit"
                                     @set-valuation="set_valuation"
                                     :btn-show="btnShow"
                                     @refresh="refresh"
                                     :is-hold="isHold"
                                     @click-number="click_number"
                                     :deadline="deadline"
                                     :showBtn="showBtnPublic"></form-item-logistics>
            </tab-item>
            <tab-item id="aftermarket" label="售后">
                <form-item-aftermarket :showBtn="isEdit.edit&&invalid.status!==4294967295" :form="customer" :is-after="showAfter"
                                       @create-click="create_click" @add-aftermarker="add_aftermarker"
                                       @review="review"
                                       @refund-status-change="refund_status_change"
                                       :form-data="formData"
                                       :is-invalid="invalid.status===4294967295"
                                       :channel_name="channel_name"
                                       :order_id="mdfid"
                ></form-item-aftermarket>
            </tab-item>
            <tab-item id="pay" label="付款">
                <form-item-payment :form="payment"></form-item-payment>
            </tab-item>
            <tab-item id="profit" label="利润">
                <form-item-profit :form="profit" :order="order_number"></form-item-profit>
            </tab-item>
            <tab-item id="logs" label="日志">
                <form-item-logs :form="logs"></form-item-logs>
            </tab-item>
        </tabs>
        <span slot="footer">
            <el-button size="mini" type="default"
                       @click.native="show=false"
                       class="mr-lg">关闭</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">
    .p-hand-word-form {
        .tab-heads {
            .head {
                width: 55.7%;
                position: fixed;
                z-index: 555;
            }
            .body {
                border-top-right-radius: 3px;
                border-top-left-radius: 3px;
                position: relative;
                padding-top: 40px;
            }

        }
        .mes-box {
            position: relative;
            margin: 5px 10px 5px;
            padding: 5px 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            > .close-icon {
                position: absolute;
                top: -2px;
                right: 2px;
                width: 12px;
                height: 12px;
                display: inline-block;
                background: url(../../../../images/close.png) no-repeat;
                transition: all .2s;
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
            top: 27px;
            right: 0px;
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
            &:hover {
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
        .is-wish-express{
            background-color #f60;
            color #fff;
        }
        .is-epc-order{
            border 1px solid #797979;
            background-color #FFCC00;
            color #FF0000;
        }
    }
</style>
<script>
    import selectRemote from '../../../components/select-remote.vue';
    import {
        api_delete_note, api_get_speed, api_info,
        api_get_already, api_status_operation, api_get_sku_siblings,
        api_change_status, api_update
    } from '../../../api/order-local';
    import pageDialog from "../../../components/page-dialog.vue";
    import cardControl from "../../../components/card-control.vue";
    import cardHidden from "../../../components/card-hidden.vue";

    export default {
        data() {
            return {
                show: this.value,
                notes: "",
                forms: {},
                showRemark: false,
                steps: [],
                processStatus: [],
                active: 1,
                showAfter: false,
                isAdd: false,
                nextHandleValue: "",
                formData: []
            }
        },
        watch: {
            show(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            },
            productList(val) {
                if (val.length > 0) {
                    if (val.find(row => {
                        return row.detail_goods.length > 0
                    })) {
                        this.showAfter = true;
                    } else {
                        this.showAfter = false;
                    }
                }
            }
        },
        methods: {
            open() {
                this.get_speed(this.mdfid);
            },
            click_number(val) {
                this.$emit('click-number', val);
            },
            close_dialog() {
                this.$emit('close-dialog');
            },
            already(val) {
                this.get_already();
            },
//            删除备注
            delete_note(item) {
                this.$confirm('您将删除此备注信息, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_note, this.mdfid, item.id).then(res => {
                        this.$message({message: res.message || res, type: 'success'});
                        this.require_server(this.mdfid);
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    })
                }).catch(code => {
                    this.$message({
                        type: 'info',
                        message: "已取消删除"
                    })
                })
            },
            filterTime(val) {
                if (val) return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            show_remark() {
                this.showRemark = !this.showRemark;
            },
            cancel() {
                this.showRemark = false;
            },
            submit() {
                if (!this.notes) return this.$message({message: "请填写备注内容后，再点击提交", type: 'warning'});
                this.$http(api_update, this.mdfid, {note: this.notes,confirm: true}).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message,
                    })
                    /*添加备注后，需要映射操作时间和操作人，所以要请求一次接口*/
                    this.require_server(this.mdfid);
                    this.notes = "";
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message
                    })
                });
                this.showRemark = false;
            },
            /*作废 / 需人工审核的状态下出现的备注框   保存按钮*/
            save_reason(val) {
                if (!val) return this.$message({message: "请添加原因后，再点击提交!", type: 'warning'});
                this.save_reason_(false, val);
            },
            save_reason_(isTrue, val) {
                let params = {};
                params.reason = val;
                if (isTrue) {
                    params.confirm = true;
                }
                this.$http(api_change_status, this.mdfid, this.nextHandleValue, params).then(res => {
                    this.$message(res.message);
                    /*关闭整个弹框*/
                    this.show = false;
                    this.$emit("cur-operate");
                }).catch(code => {
                    if (code.hasOwnProperty("code") && code.code === "confirm") {
                        this.$confirm(`${code.message}`, '提示', {
                            confirmButtonText: '继续',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.save_reason_(true, val);
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    }
                })
                this.require_server(this.mdfid);
                this.isAdd = false;
            },
            cancel_reason(val) {
                this.isAdd = false;
            },
            cur_operate(val) {
                this.nextHandleValue = val.value;
                if (this.nextHandleValue === 65792 || this.nextHandleValue === 4294967295) {
                    this.isAdd = true;
                } else {
                    this.change_status(this.mdfid, val.value);
                }
            },
            require_server(val) {
                this.$http(api_info, val).then(res => {
                    res.product_list.forEach(row => {
                        row.detail_goods.forEach(item => {
                            this.get_sku_siblings(item);
                        })
                    });
                    this.$set(this.forms, val, res);
                    this.formData = res.customer.source;
                    this.status_operation(res);
                }).catch(code => {
                    console.log(code)
                })
            },
            get_sku_siblings(row) {
                this.$http(api_get_sku_siblings, row.sku_id).then(res => {
                    res = res.map(item => {
                        return {
                            value: item.id,
                            label: item.attr ? `${item.sku}-[${item.attr}]` : item.sku,
                            attr: item.attr,
                            sku: item.sku
                        }
                    });
                    this.$set(row, 'siblingsList', res);
                })
            },
            review() {
                this.require_server(this.mdfid);
            },
            refund_status_change(status){
                this.$set(this.forms[this.mdfid], 'refund_status', status);
            },
            create_click(res) {
                this.$set(this.forms[this.mdfid].customer, 'is_generate', 1);
                this.$set(this.forms[this.mdfid].customer, 'open_link', res.open_link);
                this.$set(this.forms[this.mdfid].customer, 'filePath', res.filePath);
            },
            add_aftermarker() {
                this.require_server(this.mdfid);
            },
            logistics_edit(form) {
                this.forms[this.mdfid].package_list = form;
            },
            set_valuation(item) {
                let profit = this.forms[this.mdfid].profit;
                if (profit && profit.expend) {
                    profit.expend.shipping_fee = item.estimated_fee;
                }
            },
            buyinfo_edit(form) {
                this.$set(this.forms[this.mdfid], 'consignee', form.consignee);
                this.$set(this.forms[this.mdfid], 'address', form.address);
                this.$set(this.forms[this.mdfid], 'mobile', form.mobile);
                this.$set(this.forms[this.mdfid], 'tel', form.tel);
                this.$set(this.forms[this.mdfid], 'zipcode', form.zipcode);
                this.$set(this.forms[this.mdfid], 'email', form.email);
                this.$set(this.forms[this.mdfid], 'province', form.province);
                this.$set(this.forms[this.mdfid], 'city', form.city);
                this.$set(this.forms[this.mdfid], 'country_code', form.country_code);
            },
            product_edit(form) {
                this.$set(this.forms[this.mdfid], 'product_list', form);
            },
            status_operation(val) {
                if(val&&val.hasOwnProperty('status')&&val.hasOwnProperty('type')) {
                    let params = {};
                    params.code = val.status;
                    params.type = val.type;
                    this.$http(api_status_operation, params).then(res => {
                        this.processStatus = res.map(row => {
                            return {
                                label: row.remark,
                                value: row.code
                            }
                        });
                    }).catch(code => {
                        console.log(code);
                    })
                }
            },
            change_status(val, val2, data) {
                this.$http(api_change_status, val, val2, data).then(res => {
                    this.$message(res.message);
                    /*整个弹框关闭*/
                    this.show = false;
                    this.$emit("cur-operate")
                }).catch(code => {
                    this.$message({message: code.message, type: 'error'})
                    this.show = true;
                })
            },
            get_already() {
                let cur = [];
                cur.push(this.mdfid);
                this.$http(api_get_already, {order_id: cur}).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message
                    })
                    this.$set(this.forms[this.mdfid], "message", "");
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message
                    })
                });
            },
            get_speed(id) {
                this.$http(api_get_speed, id).then(res => {
                    this.steps = res;
                    let active = 0;
                    res.forEach(row => {
                        if (row.time) {
                            active = active + 1;
                        }
                    })
                    this.active = active;
                }).catch(code => {
                    console.log(code);
                })
            },
            refresh() {
                this.mdfid > 0 && this.require_server(this.mdfid);
            },
        },
        computed: {
            isAliExpress(){
                return this.forms[this.mdfid]?this.forms[this.mdfid].channel_id===4:false
            },
            deadline(){
                if(this.isAliExpress&&this.forms[this.mdfid]){
                    return this.forms[this.mdfid].uploaded_deadline?this.forms[this.mdfid].uploaded_deadline:''
                }else{
                    return ''
                }
            },
            check: {
                get() {
                    if (this.mdfid > 0) {
                        if (this.forms[this.mdfid]) {
                            return this.forms[this.mdfid].is_already ? true : false;
                        }
                    }
                },
                set(val) {
                    this.forms[this.mdfid].is_already = val;
                }
            },
            salesRemark() {
                let def = "";
                if (this.mdfid > 0) {
                    if (this.forms[this.mdfid]) {
                        def = this.forms[this.mdfid].sales_remark;
                    }
                }
                return def;
            },
            logs: {
                get() {
                    let def = [];
                    if (this.mdfid > 0) {
                        if (this.forms[this.mdfid]) {
                            return this.forms[this.mdfid].log;
                        } else {
                            return def
                        }
                    } else {
                        return def
                    }
                }
            },
            /*作废*/
            invalid: {
                get() {
                    let curObj = {};
                    if (this.mdfid > 0) {
                        if (this.forms[this.mdfid]) {
                            this.$set(curObj, 'status', this.forms[this.mdfid].status);
                            this.$set(curObj, 'reason_for_invalid', this.forms[this.mdfid].reason_for_invalid);
                            this.$set(curObj, 'time_for_invalid', this.forms[this.mdfid].time_for_invalid);
                        }
                    }
                    return curObj;
                }
            },
            buyinfo: {
                get() {
                    let def = {
                        buyer: 0,
                        consignee: "",
                        address: "",
                        tel: "",
                        mobile: "",
                        email: "",
                        zipcode: "",
                        province: "",
                        city: "",
                        country_code: "",
                        buyer: "",
                        source_address: {},
                        channel_name: "",
                        isMerge: false,
                    };
                    let isMerge = false;
                    if (this.mdfid > 0) {
                        if (this.forms[this.mdfid]) {
                            if (this.forms[this.mdfid].package_list && this.forms[this.mdfid].package_list.length > 0) {
                                if (this.forms[this.mdfid].package_list[0].merge_order_number) {
                                    isMerge = true;//判断是否为合并订单
                                }
                            }
                            this.$set(this.forms[this.mdfid].order_address, "channel_name", this.forms[this.mdfid].channel_name);
                            if (isMerge) this.$set(this.forms[this.mdfid].order_address, "is_apply", false);
                            return this.forms[this.mdfid].order_address;
                        } else {
                            return def;
                        }
                    } else {
                        return def
                    }
                }
            },
            comNotes() {
                let def = [];
                if (this.mdfid > 0) {
                    if (this.forms[this.mdfid]) {
                        let cur = this.forms[this.mdfid];
                        return cur.note;
                    } else {
                        return def
                    }
                } else {
                    return def
                }
            },
            message() {
                let def = "";
                if (this.mdfid > 0) {
                    if (this.forms[this.mdfid]) {
                        let cur = this.forms[this.mdfid];
                        return cur.message.replace(/(\r|\n)+/gm,`<br>`);
                    } else {
                        return def
                    }
                } else {
                    return def
                }
            },
            productList: {
                get() {
                    let def = [];
                    if (this.mdfid > 0) {
                        if (this.forms[this.mdfid]) {
                            this.forms[this.mdfid].product_list.forEach(row => {
                                row.is_deliver_goods = row.is_deliver_goods ? true : false;
                            });
                            return this.forms[this.mdfid].product_list;
                        } else {
                            return def
                        }
                    } else {
                        return def
                    }
                },
            },
            curStatus() {
                let def = 0;
                if (this.mdfid > 0) {
                    if (this.forms[this.mdfid]) {
                        return this.forms[this.mdfid].status;
                    } else {
                        return def;
                    }
                } else {
                    return def;
                }
            },
            errorList: {
                get() {
                    let def = [];
                    if (this.mdfid > 0) {
                        if (this.forms[this.mdfid]) {
                            return this.forms[this.mdfid].error;
                        } else {
                            return def
                        }
                    } else {
                        return def
                    }
                }
            },
            logistics: {
                get() {
                    let def = [];
                    if (this.mdfid > 0) {
                        if (this.forms[this.mdfid]) {
                            def = this.forms[this.mdfid].package_list;
                            def.forEach(res => {
                                this.$set(res, 'buyer_selected_logistics', this.forms[this.mdfid].buyer_selected_logistics);
                                this.$set(res, 'product_list', this.forms[this.mdfid].product_list);//获取运输方式需要
                                this.$set(res, 'country_code', this.forms[this.mdfid].order_address.country_code);//获取运输方式需要
                            })
                            return def
                        } else {
                            return def;
                        }
                    } else {
                        return def
                    }
                },
                set(value) {
                    console.log(value)
                }
            },
            payment: {
                get() {
                    let def = [];
                    if (this.mdfid > 0) {
                        if (this.forms[this.mdfid]) {
                            return this.forms[this.mdfid].payment;
                        } else {
                            return def;
                        }
                    } else {
                        return def;
                    }
                }
            },
            profit() {
                let def = {};
                if (this.mdfid > 0) {
                    if (this.forms[this.mdfid]) {
                        let cur = this.forms[this.mdfid];
                        return {
                            id: this.mdfid,
                            shipping_time: cur.shipping_time,
                            income: cur.profit.income,
                            expend: cur.profit.expend,
                            rate: cur.rate,
                            rate_remark: cur.rate_remark,
                            sales: cur.profit.sales
                        };
                    } else {
                        return def;
                    }
                } else {
                    return def;
                }
            },
            showTrends() {
                let bool = false;
                if (this.forms[this.mdfid]) {
                    if (this.hasAfterRemark && !this.isEdit.edit && !this.forms[this.mdfid].shipping_time) {
                        bool = true;
                    } else {
                        bool = this.isEdit.edit;
                    }
                }
                return bool;
            },
            showBtnPublic() {//已发货订单  收件人信息/产品信息/仓储物流 模块屏蔽操作按钮
                let bool = true;
                if (this.forms[this.mdfid]) {
                    if (!!this.forms[this.mdfid].shipping_time) {
                        bool = false;
                    } else {
                        bool = this.isEdit.edit&&this.invalid.status!==4294967295;
                    }
                }
                return bool;
            },
            customer: {
                get() {
                    let def = {};
                    if (this.mdfid > 0) {
                        if (this.forms[this.mdfid]) {
                            def.customer = this.forms[this.mdfid].customer;
                            def.order_number = this.forms[this.mdfid].order_number;
                            def.id = this.forms[this.mdfid].id;
                            def.refund_status = this.forms[this.mdfid].refund_status;
                            if (this.forms[this.mdfid].customer.after.length > 0) {
                                this.isEdit.edit = false;
                            }
                            return def;
                        } else {
                            return def;
                        }
                    } else {
                        return def;
                    }
                },
                set(val) {
                    console.log(val);
                }
            },
            order_number() {
                let def = 0;
                if (this.mdfid > 0) {
                    if (this.forms[this.mdfid]) {
                        let cur = this.forms[this.mdfid];
                        return cur.order_number;
                    } else {
                        return def;
                    }
                } else {
                    return def;
                }
            },
            channel_name() {
                let def = "";
                if (this.mdfid > 0) {
                    if (this.forms[this.mdfid]) {
                        let cur = this.forms[this.mdfid];
                        return cur.channel_name;
                    } else {
                        return def;
                    }
                } else {
                    return def;
                }
            },
            seller() {
                let defName = "";
                if (this.mdfid > 0) {
                    if (this.forms[this.mdfid]) {
                        let cur = this.forms[this.mdfid];
                        return cur.seller;
                    } else {
                        return defName;
                    }
                } else {
                    return defName;
                }
            },
            isWishExpress(){
                let def = "";
                if (this.mdfid > 0) {
                    if (this.forms[this.mdfid]) {
                        def = this.forms[this.mdfid].is_wish_express;
                    }
                }
                return def;
            },
            isEpcOrder(){
                let def = "";
                if (this.mdfid > 0) {
                    if (this.forms[this.mdfid]) {
                        def = this.forms[this.mdfid].is_epc_order;
                    }
                }
                return def;
            },
        },
        props: {
            value: {},
            mdfid: {
                required: true,
            },
            isEdit: {
                default() {
                    return true
                }
            },
            hasAfterRemark: {},
            title: {
                default() {
                    return ''
                }
            },
            btnShow: {},
            isHold: {}
        },
        components: {
            formItemBuyinfo: require('../local/form-item-buyinfo.vue').default,
            formItemProduct: require('../local/form-item-product.vue').default,
            formItemLogistics: require('../local/form-item-logistics.vue').default,
            formItemAftermarket: require('../pending/form-item-aftermarket.vue').default,
            formItemProfit: require('../local/form-item-profit.vue').default,
            formItemLogs: require('../local/form-item-logs.vue').default,
            formItemPayment: require('../local/form-item-payment.vue').default,
            selectRemote,
            pageDialog,
            cardControl,
            cardHidden,
            tabs: require('../../../components/tabs.vue').default,
            tabHead: require('../../../components/tab-head.vue').default,
            tabItem: require('../../../components/tab-item.vue').default,
            trendsSelect: require('../../../components/trends-select.vue').default,
            littleRemark: require("../../../components/little-remark.vue").default,
            uiTips: require('../../../components/ui-tips.vue').default
        }
    }
</script>
