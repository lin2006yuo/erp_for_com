<template>
    <div class="c-form-mdf">
        <div v-if="detailTable">
            <tabs class="relative">
                <tab-head class="tab-heads"
                    :navs="[{label:'收件人信息',action:'buyinfo'},{label:'产品信息',action:'product'},{label:'仓储物流',action:'logistics'},{label:'售后',action:'aftermarket'},{label:'付款',action:'saller'},{label:'利润',action:'profit'},{label:'日志',action:'logs'}]">
                    <div>
                        <div>
                            <div class="inline">
                                <span class="marker">订单号：</span><span class="marker">{{order_number}}</span>
                                <span class="ml-lg is-wish-express" v-if="isWishExpress&&channel_name==='wish'">&nbsp;Wish Express&nbsp;</span>
                                <span class="ml-lg is-epc-order" v-if="isEpcOrder&&channel_name==='wish'">&nbspEPC-合并交易&nbsp</span>
                                <span class="ml-lg red" v-if="salesRemark">{{salesRemark}}</span>
                                <span class="ml-lg">{{channel_name}}</span>
                            </div>
                            <div class="fr">
                                <span class="mr-lg">{{seller}}</span>
                                <!--备注权限-->
                                <permission
                                    tag="ElButton"
                                    :route="apis.url_update"
                                    class="inline"
                                    size="mini"
                                    type="primary"
                                    @click.native="show_remark">备注
                                </permission>
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
                                            <button class="small-button submit" type="button" @click="submit">提交
                                            </button>
                                            <button class="small-button cancel" type="button" @click="cancel">取消
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!--作废 / 需人工审核  状态才出现的备注框-->
                                <little-remark top="67px"
                                               right="3px"
                                               label="添加原因" v-if="isAdd"
                                               @submit="save_reason"
                                               @cancel="cancel_reason"></little-remark>
                                <trends-select v-if="showTrends"
                                               :style="processStatus.length===0?`vertical-align: bottom`:''"
                                               class="inline"
                                               :selects="processStatus"
                                               type="primary"
                                               @trigger="next_handle"></trends-select>
                            </div>
                            <div style="clear:both"></div>
                        </div>
                        <!--作废订单备注显示-->
                        <div v-if="invalid.status&&invalid.status===4294967295"
                             class="mes-box invalid-color">
                            <!--title-->
                            <span style="color:#FAEB21" class="bold-font inline">订单已作废：</span>
                            <!--作废订单的备注信息-->
                            <ui-tips style="color:#fff" :content="invalid.reason_for_invalid" :width="70"></ui-tips>
                            <span class="fr inline" style="color:#fff">
                                    {{invalid.time_for_invalid | filterTime}}
                                </span>
                        </div>
                        <!--客户留言信息显示-->
                        <div :class="[checks?'green-color':'red-color','mes-box']" v-if="message">
                            <span class="bold-font">留言信息：</span><br>
                            <span v-html="message"></span>
                            <el-checkbox class="fr" v-model="checks" @change="already(checks)" :disabled="checks">已读
                            </el-checkbox>
                        </div>
                        <div class="mes-box blue-color mb-mini"
                             v-for="(item,index) in comNotes" :key="index">
                                <span class="fr">
                                     <span>{{item.create_time|filterTime}}</span>
                                     <span class="ml-xs">{{item.creator_id}}</span>
                                </span>
                            <div class="inline bold-font" style="vertical-align: top;word-break: break-all;width: 75%;">备注信息：<span>{{item.note}}</span></div>
                            <i class="close-icon" @click="delete_note(item)"></i>
                        </div>
                        <!--员工备注信息显示-->
                        <el-steps refindex="step" :active="active" finish-status="success" class="ml-lg">
                            <el-step v-for="(item,index) in steps"
                                     :key="index"
                                     :title="item.name"
                                     :description="step_time(item.time)"
                            ></el-step>
                        </el-steps>
                        <div class="mt-sm error-border" v-if="errorList.length>0">
                            <span class="marker">订单异常情况：</span>
                            <div class="ml-sm mt-mini" v-for="item in errorList"
                                 :key="item.message"
                            >
                                <span>{{item.remark}}</span>：<span>{{item.message}}</span>
                            </div>
                        </div>
                    </div>
                </tab-head>
                <tab-item id="buyinfo" label="收件人信息" :def="error_state('0_2')">
                    <form-item-buyinfo :id="selectRow"
                                       :form="buyinfo"
                                       @submit="buyinfo_edit"
                                       :show-btn="showBtnPublic"></form-item-buyinfo>
                </tab-item>
                <tab-item id="product" label="产品信息" :def="error_state('0_4','0_64', '16_1')">
                    <form-item-product
                        :id="selectRow"
                        :show-btn="showBtnPublic"
                        :assist="base"
                        :cur-status="curStatus"
                        :form="productList"
                        @submit="product_edit"></form-item-product>
                </tab-item>
                <tab-item id="logistics" label="仓储物流" :def="error_state('0_16') || error_state('0_8')">
                    <form-item-logistics
                        :id="selectRow"
                        :date="date"
                        :form="logistics"
                        :is-hold=true
                        :btn-show=true
                        @click-number="click_number"
                        @submit="logistics_edit"
                        @change-shipping="change_shipping"
                        :show-btn="showBtnPublic"
                        :deadline="deadline"
                        @change-warehouse="change_warehouse"
                        @cancel="logistics_cancel"
                    ></form-item-logistics>
                </tab-item>
                <tab-item id="aftermarket" label="售后" :def="false">
                    <form-item-aftermarket
                        :mdf-id="selectRow"
                        :form="customer"
                        :is-after="showAfter"
                        :show-btn="edit&&invalid.status!==4294967295"
                        ref="aftermarket"
                        :orders-number="order_number"
                        @create-click="create_click"
                        @add-aftermarker="add_aftermarker"
                        :form-data="formData"
                        @review="review"
                        @refund-status-change="refund_status_change"
                        :cancel-id="cancelId"
                        :isDisabled="isShow"
                        :channel_name="channel_name"
                        :is-invalid="invalid.status===4294967295"
                        :order_id="selectRow"
                    ></form-item-aftermarket>
                </tab-item>
                <tab-item id="saller" label="付款" :def="error_state('0_0')">
                    <form-item-payment :form="payment"></form-item-payment>
                </tab-item>
                <tab-item id="profit" label="利润" :def="false">
                    <form-item-profit :form="profit" :order="order_number"></form-item-profit>
                </tab-item>
                <tab-item id="logs" label="日志" :def="false">
                    <form-item-logs :form="logs"></form-item-logs>
                </tab-item>
            </tabs>
        </div>
        <el-card v-else v-resize="{height:50}">
                <span class="left-main-empty">
                    {{selectRow > 0 ? "等待加载数据" : "请选择左侧数据"}}
                </span>
        </el-card>
    </div>
</template>
<style lang="stylus">
    .c-form-mdf {
        .tab-heads {
            .head {
                width: 44.1%;
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
        .invalid-color {
            background-color: #DF5255;
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
        .green-color {
            background-color: #E0F7E6;
        }
        .red-color {
            background-color: #FBD2C9;
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
            height: 160px;
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
    import {url_audited, url_preferred, url_pending} from '../../../api/order-pending';
    import {
        api_get_speed,
        api_status_operation,
        api_get_already,
        api_change_status,
        api_update,
        api_delete_note,
        api_get_shipping
    } from '../../../api/order-local';
    import {url_get_already, url_update, url_change_status} from '../../../api/order-local';

    export default {
        permission: {
            url_audited,
            url_preferred,
            url_pending,
            url_get_already,
            url_update,
            url_change_status
        },
        data() {
            return {
                showRemark: false,
                notes: "",
                isAdd: false,
                date: "",
                showAfter: false,
                isShow: true,
                active: 0,
                steps: [],
                processStatus: [],
                formData: [],
                shippingData:{}
            }
        },
        created() {
            this.date = new Date();
        },
        filters: {
            filterTime(val) {
                if (val) return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        methods: {
            click_number(val){
                this.$emit('click-number',val);
            },
//            删除备注
            delete_note(item) {
                this.$confirm('您将删除此备注信息, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_note, this.selectRow, item.id).then(res => {
                        this.$message({message: res.message || res, type: 'success'});
                        this.$emit("init-require",res.is_handle);
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
//            常用备注 保存/取消
            submit() {
                if (!this.notes.trim()) return this.$message({message: "请填写备注内容后，再点击提交", type: 'warning'});
                this.$http(api_update, this.selectRow, {note: this.notes.trim(),confirm: true}).then(res => {
                    this.$message(res.message);
                    /*添加备注后，需要映射操作时间和操作人，所以要请求一次接口*/
                    this.$emit("init-require",res.is_handle);
                    this.notes = "";
                    this.showRemark = false;
                }).catch(code => {
                    this.$message({message: code.message, type: 'error'})
                });
            },
            cancel() {
                this.showRemark = false;
            },
            show_remark() {
                this.showRemark = !this.showRemark;
                this.isAdd = false;
            },

//          作废 / 需人工审核的状态下出现的备注框   保存按钮
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
                this.$http(api_change_status, this.selectRow, this.nextHandleValue, params).then(res => {
                    this.$message(res.message);
                    /*关闭整个弹框*/
                    this.show = false;
                    this.$emit("cur-operate",this.selectRow,res.is_handle);
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
                });
                this.$emit("init-require");
                this.isAdd = false;
            },
            cancel_reason(val) {
                this.isAdd = false;
            },

//          状态列表
            status_operation(val) {
                if(val&&val.hasOwnProperty('status')&&val.hasOwnProperty('type')) {
                    let cur = {};
                    cur.code = val.status;
                    cur.type = val.type;
                    this.$http(api_status_operation, cur).then(res => {
                        this.processStatus = res.map(row => {
                            return {
                                label: row.remark,
                                value: row.code,
                                action: function (val) {
                                    this.nextHandleValue = val.value;
                                    if (this.nextHandleValue === 65792 || this.nextHandleValue === 4294967295) {
                                        this.isAdd = true;
                                        this.showRemark = false;
                                    } else {
                                        this.change_status(false, this.selectRow, this.nextHandleValue);
                                    }
                                }
                            }
                        });
                    }).catch(code => {
                        console.log(code);
                    })
                }
            },

//            -----------------------------------  更改详情订单状态
            next_handle(val) {
                val.action.call(this, val);
            },
            error_state(...state) {
                return !!this.errorList.find(row => state.includes(row.code));
            },
//          收件人信息
            buyinfo_edit(form,is_handle) {
                this.$set(this.forms[this.selectRow], 'consignee', form.consignee);
                this.$set(this.forms[this.selectRow], 'address', form.address);
                this.$set(this.forms[this.selectRow], 'mobile', form.mobile);
                this.$set(this.forms[this.selectRow], 'tel', form.tel);
                this.$set(this.forms[this.selectRow], 'zipcode', form.zipcode);
                this.$set(this.forms[this.selectRow], 'email', form.email);
                this.$set(this.forms[this.selectRow], 'province', form.province);
                this.$set(this.forms[this.selectRow], 'city', form.city);
                this.$set(this.forms[this.selectRow], 'country_code', form.country_code);
                this.$emit("buyinfo-edit",is_handle)
            },
//          产品信息
            product_edit(form,is_handle) {
                this.$set(this.forms[this.selectRow], 'product_list', form);
                this.$emit("product-edit",is_handle);
            },
//          仓储物流
            logistics_edit(form,is_handle) {
                this.$set(this.forms[this.selectRow], 'estimated_fee', form.estimated_fee);
                this.$set(this.forms[this.selectRow], 'shipping_fee', form.shipping_fee);
                this.$emit('logistics-edit',is_handle);
            },

//            -----------------------------------   仓储物流界面  改变发货仓库事件&& 取消事件
            change_warehouse(item) {
                this.init_shipping(item);
            },
            /*更改运输方式实时更改利润模块的估计运费
            * */
            change_shipping(item) {
                let profit = this.forms[this.selectRow].profit;
                if (profit && profit.expend) {
                    profit.expend.shipping_fee = item.estimated_fee;
                }
            },
            logistics_cancel(item) {
                this.init_shipping(item);
            },
            init_shipping(item){
                if (item.warehouse_id !== 0) {
                    if(!this.shippingData[`${item.warehouse_id}${item.country_code}${item.id}`]) {
                        let params = {
                            warehouse_id: item.warehouse_id,
                            country_code: item.country_code,
                            package_id: item.id,
                        };
                        this.$http(api_get_shipping, params).then(res => {
                            if (res.length <= 0) {
                                this.$set(item, 'shippingListOld', []);
                                return
                            }
                            this.shippingData[`${item.warehouse_id}${item.country_code}${item.id}`] = window.clone(res);
                            this.$set(item, 'shippingList', res);
                            let list = res.map(row => {
                                return row.carrier_id
                            });
                            list = this.carrier_unique(list).map(carrier_id => {
                                let label = res.find(row => row.carrier_id === carrier_id);
                                return {
                                    label: label.carrier_name,
                                    value: carrier_id
                                }
                            });
                            this.$set(item, 'shippingListOld', list.map(row => {
                                row.children = this.get_children(row, res);
                                return row
                            }));
                        }).catch(code => {
                            console.log(code);
                        });
                    }else {
                        let res = window.clone(this.shippingData[`${item.warehouse_id}${item.country_code}${item.id}`]);
                        this.$set(item, 'shippingList',res);
                        let list = res.map(row => {
                            return row.carrier_id
                        });
                        list = this.carrier_unique(list).map(carrier_id => {
                            let label = res.find(row => row.carrier_id === carrier_id);
                            return {
                                label: label.carrier_name,
                                value: carrier_id
                            }
                        });
                        this.$set(item, 'shippingListOld', list.map(row => {
                            row.children = this.get_children(row, res);
                            return row
                        }));
                    }
                }else{
                    this.$set(item,'shippingListOld',[]);
                    this.$set(item,'shippingList',[]);
                }
            },
            carrier_unique(arr){
                let res = [];
                let json = {};
                for(let i = 0; i < arr.length; i++){
                    if(!json[arr[i]]){
                        res.push(arr[i]);
                        json[arr[i]] = 1;
                    }
                }
                return res;
            },
            get_children(row,res) {
                let child = [];
                res.forEach(item=>{
                    if(row.value===item.carrier_id){
                        child.push({
                            label:item.shipping_method_name,
                            value:item.shipping_id
                        })
                    }
                });
                return child
            },


//            售后
            create_click(res) {
                this.$set(this.forms[this.selectRow].customer, 'is_generate', 1);
                this.$set(this.forms[this.selectRow].customer, 'open_link', res.open_link);
                this.$set(this.forms[this.selectRow].customer, 'filePath', res.filePath);
            },
            add_aftermarker(is_handle) {
                this.$emit("init-require",is_handle);
            },
            review() {
                this.$emit("init-require");
            },
            refund_status_change(status){
                this.$set(this.forms[this.selectRow], 'refund_status', status);
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
                    this.$nextTick(() => {
                        let step = this.$refs.step;
                        if (step) {
                            step.$forceUpdate();
                        }
                    })
                }).catch(code => {
                    console.log(code);
                })
            },
            step_time(val) {
                if (val) return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            change_status(bool, val, val2) {
                let params = {};
                if (bool) params.confirm = true;
                this.$http(api_change_status, val, val2, params).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.$emit('change-status',val,res.is_handle);
                }).catch(code => {
                    if (code.hasOwnProperty("code") && code.code === "confirm") {
                        this.$confirm(`${code.message}`, '提示', {
                            confirmButtonText: '继续',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.change_status(true, val, val2);
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    }
                })
            },
            already(val) {
                this.get_already()
            },
            get_already() {
                let cur = [];
                cur.push(this.selectRow);
                this.$http(api_get_already, {order_id: cur}).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message
                    });
                    this.$emit("get-already",res.is_handle);
                }).catch(code => {
                    console.log(code);
                })
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
            checks: {
                get() {
                    return this.forms[this.selectRow].is_already ? true : false;
                },
                set(val) {
                    this.forms[this.selectRow].is_already = val;
                }
            },
            detailTable() {
                if (this.selectRow > 0) {
                    return !!this.forms[this.selectRow];
                } else {
                    return false;
                }
            },

            /*作废*/
            invalid: {
                get() {
                    let curObj = {};
                    if (this.selectRow > 0) {
                        if (this.forms[this.selectRow]) {
                            this.$set(curObj, 'status', this.forms[this.selectRow].status);
                            this.$set(curObj, 'reason_for_invalid', this.forms[this.selectRow].reason_for_invalid);
                            this.$set(curObj, 'time_for_invalid', this.forms[this.selectRow].time_for_invalid);
                        }
                    }
                    return curObj;
                }
            },
            seller() {
                let defName = "";
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        let cur = this.forms[this.selectRow];
                        return cur.seller;
                    } else {
                        return defName;
                    }
                } else {
                    return defName;
                }
            },
            order_number() {
                let def = "";
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        let cur = this.forms[this.selectRow];
                        return cur.order_number;
                    } else {
                        return def;
                    }
                } else {
                    return def;
                }
            },
            salesRemark() {
                let def = "";
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        def = this.forms[this.selectRow].sales_remark;
                    }
                }
                return def;
            },
            channel_name() {
                let def = "";
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        let cur = this.forms[this.selectRow];
                        return cur.channel_name;
                    } else {
                        return def;
                    }
                } else {
                    return def;
                }
            },
            detailTable() {
                if (this.selectRow > 0) {
                    return !!this.forms[this.selectRow];
                } else {
                    return false;
                }
            },
            logs: {
                get() {
                    let def = [];
                    if (this.selectRow > 0) {
                        if (this.forms[this.selectRow]) {
                            return this.forms[this.selectRow].log;
                        } else {
                            return def
                        }
                    } else {
                        return def
                    }
                }
            },
            base() {
                const def = {
                    channel_id: 0,
                    channel_account_id: 0,
                };
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        const info = this.forms[this.selectRow];
                        return {
                            channel_id: info.channel_id,
                            channel_account_id: info.channel_account_id,
                        }
                    } else {
                        return def;
                    }
                } else {
                    return def
                }
            },
            buyinfo: {
                get() {
                    let def = {
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
                        isMerge:false,
                    };
                    let isMerge = false;
                    if (this.selectRow > 0) {
                        if (this.forms[this.selectRow]) {
                            if(this.forms[this.selectRow].package_list&&this.forms[this.selectRow].package_list.length>0){
                                if(this.forms[this.selectRow].package_list[0].merge_order_number){
                                    isMerge = true;//判断是否为合并订单
                                }
                            }
                            this.$set(this.forms[this.selectRow].order_address, "channel_name", this.forms[this.selectRow].channel_name);
                            if(isMerge) this.$set(this.forms[this.selectRow].order_address, "is_apply",false);
                            return this.forms[this.selectRow].order_address
                        } else {
                            return def;
                        }
                    } else {
                        return def
                    }
                }
            },
            customer: {
                get() {
                    let def = {};
                    if (this.selectRow > 0) {
                        if (this.forms[this.selectRow]) {
                            /*获得 售后页面的地址*/
                            def.customer = this.forms[this.selectRow].customer;
                            if (def.customer.address instanceof Array) {
                                def.customer.address = {
                                    recipient: "",
                                    address: "",
                                    city: "",
                                    province: "",
                                    zip_code: "",
                                    country_code: "",
                                    tel: "",
                                }
                            }
                            def.order_number = this.forms[this.selectRow].order_number;
                            def.refund_status = this.forms[this.selectRow].refund_status;
                            def.shipping_time = this.forms[this.selectRow].shipping_time;
                            def.id = this.forms[this.selectRow].id;
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
            edit() {
                let cur = true;
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        if (this.forms[this.selectRow].customer) {
                            let d = this.forms[this.selectRow].customer;
                            if (d.after.length > 0) {
                                cur = false
                            }
                        }
                    }
                }
                return cur;
            },
            showBtnPublic() {//已发货订单  收件人信息/产品信息/仓储物流 模块屏蔽操作按钮
                let cur = true;
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        if (!!this.forms[this.selectRow].shipping_time) {
                            cur = false;
                        } else {
                            cur = this.edit&&this.invalid.status!==4294967295;
                        }
                    }
                }
                return cur;
            },
            showTrends() {
                let bool = false;
                if (this.forms[this.selectRow]) {
                    if (!this.edit && !this.forms[this.selectRow].shipping_time) {
                        bool = true;
                    } else {
                        bool = this.edit;
                    }
                }
                return bool;
            },
            comNotes() {
                let def = [];
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        let cur = this.forms[this.selectRow];
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
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        let cur = this.forms[this.selectRow];
                        return cur.message.replace(/(\r|\n)+/gm,`<br>`);
                    } else {
                        return def
                    }
                } else {
                    return def
                }
            },
            errorList: {
                get() {
                    let def = [];
                    if (this.selectRow > 0) {
                        if (this.forms[this.selectRow]) {
                            return this.forms[this.selectRow].error;
                        } else {
                            return def
                        }
                    } else {
                        return def
                    }
                }
            },
            productList: {
                get() {
                    let def = [];
                    if (this.selectRow > 0) {
                        if (this.forms[this.selectRow]) {
                            this.forms[this.selectRow].product_list.forEach(row=>{
                                row.is_deliver_goods = row.is_deliver_goods?true:false;
                            });
                            return this.forms[this.selectRow].product_list;
                        } else {
                            return def
                        }
                    } else {
                        return def
                    }
                }
            },
            curStatus() {
                let def = 0;
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        return this.forms[this.selectRow].isOos;
                    } else {
                        return def
                    }
                } else {
                    return def
                }
            },
            logistics: {
                get() {
                    let def = [];
                    if (this.selectRow > 0) {
                        if (this.forms[this.selectRow]) {
                            def = this.forms[this.selectRow].package_list;
                            def.forEach((data) => {
                                data.prior = !!data.prior;
                                this.$set(data, 'buyer_selected_logistics', this.forms[this.selectRow].buyer_selected_logistics);
                                this.$set(data, 'country_code', this.forms[this.selectRow].order_address.country_code);//获取运输方式需要
                                this.$set(data, 'shipping_time', this.forms[this.selectRow].shipping_time);
                            });
                            def.forEach(row => {
                                this.init_shipping(row);
                            });
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
                    if (this.selectRow > 0) {
                        if (this.forms[this.selectRow]) {
                            return this.forms[this.selectRow].payment;
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
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        let cur = this.forms[this.selectRow];
                        return {
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
            isWishExpress(){
                let def = "";
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        def = this.forms[this.selectRow].is_wish_express;
                    }
                }
                return def;
            },
            isEpcOrder(){
                let def = "";
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        def = this.forms[this.selectRow].is_epc_order;
                    }
                }
                return def;
            },
        },
        props: {
            cancelId:{},
            selectRow: {
                required: true
            },
            forms: {
                required: true,
                type: Object
            },
        },
        components: {
            formItemBuyinfo: require('./form-item-buyinfo.vue').default,
            formItemProduct: require('./form-item-product.vue').default,
            formItemLogistics: require('./form-item-logistics.vue').default,
            formItemAftermarket: require('./form-item-aftermarket.vue').default,
            formItemProfit: require('./form-item-profit.vue').default,
            formItemLogs: require('./form-item-logs.vue').default,
            selectRemote: require('../../../components/select-remote.vue').default,
            trendsSelect: require('../../../components/trends-select.vue').default,
            formItemPayment: require('./form-item-payment.vue').default,
            tabs: require('../../../components/tabs.vue').default,
            tabHead: require('../../../components/tab-head.vue').default,
            tabItem: require('../../../components/tab-item.vue').default,
            selectDropdown: require('../../../components/select-dropdown.vue').default,
            labelSelect: require('../../../components/label-select.vue').default,
            labelButton: require('../../../components/label-buttons.vue').default,
            littleRemark: require('../../../components/little-remark.vue').default,
            uiTips: require('../../../components/ui-tips.vue').default,
            labelItem: require('../../../components/label-item.vue').default,
        }
    }
</script>
