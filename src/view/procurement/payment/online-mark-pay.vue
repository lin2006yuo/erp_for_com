<template>
    <div class="online-mark-pay-class">
        <page-dialog v-model="show" :title="title" width="80%" @open="open" :close-on-click-modal="false">
            <div class="mt-sm">
                <div v-if="is_batch">
                    <search-card @search="search" :params="searchData">
                        <label-item label="匹配结果：" class="ml-xs" title="请选择匹配结果">
                            <el-select
                                v-sf.matching_code
                                v-model="searchData.matching_code"
                                class="inline s-width-default">
                                <el-option v-for="purchaseType in resultList"
                                           :key="purchaseType.value"
                                           :label="purchaseType.label"
                                           :value="purchaseType.value">
                                </el-option>
                            </el-select>
                        </label-item>
                        <label-item label="可用支付方式：" class="ml-sm mr-sm" title="请选择可用支付方式">
                            <el-select
                                placeholder="请选择"
                                v-model="searchData.pay_way_code"
                                v-sf.pay_way_code
                                class="inline s-width-default">
                                <el-option v-for="purchaseType in payList"
                                           :key="purchaseType.value"
                                           :label="purchaseType.label"
                                           :value="purchaseType.value">
                                </el-option>
                            </el-select>
                        </label-item>
                        <label-item label="账期支付：" class="ml-sm mr-sm" title="请选择可用支付方式">
                            <el-select
                                placeholder="请选择"
                                v-model="searchData.trade_type_desc_code"
                                v-sf.trade_type_desc_code
                                class="inline s-width-default">
                                <el-option v-for="purchaseType in typeList"
                                           :key="purchaseType.value"
                                           :label="purchaseType.label"
                                           :value="purchaseType.value">
                                </el-option>
                            </el-select>
                        </label-item>
                    </search-card>
                </div>
                <div v-if="!is_batch">
                    <el-row>
                        <el-col :span="10" :offset="2">
                            <div class="row-content">
                                <span>申请付款总额 : </span> <span>{{mark_detail.currency_code}} {{mark_detail.purchase_apply_amount | filtersPay}}</span>
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="row-content">
                                <span>付款状态 : </span> <span> {{mark_detail.status | filterStatus}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10" :offset="2">
                            <div class="row-content">
                                <span>供应商 : </span> <span>{{mark_detail.supplier}}</span>
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="row-content">
                                <span>结算方式 : </span> <span>{{mark_detail.balance_text | filterCount}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10" :offset="2">
                            <div class="row-content">
                                <span>申请时间 : </span> <span>{{mark_detail.apply_time | dateFilter}}</span>
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="row-content">
                                <span>最迟付款时间 : </span> <span>{{mark_detail.payment_last_time | dateFilter}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="card-line"></div>
                </div>
                <el-table border
                          :data="tableData"
                          style="width: 100%; margin-top: 20px"
                          v-loading="pay_loading"
                          @selection-change="selectionChange">
                    <el-table-column v-if="is_batch" type="selection" width="30" :selectable="selectable">
                        <div></div>
                    </el-table-column>
                    <el-table-column label="采购单号" inline-template>
                        <div style="color: #69f;cursor:pointer;" title="点击可查看采购详情" @click="look_(row)">
                            {{row.new_purchase_order_id}}
                        </div>
                    </el-table-column>
                    <el-table-column label="外部流水号" inline-template>
                        <div class="ellipsis" :title="row.external_number">{{row.external_number |
                            filterCount}}
                        </div>
                    </el-table-column>
                    <el-table-column label="1688账号" inline-template>
                        <div class="ellipsis" :title="row.account_1688">{{row.account_1688 | filterCount}}
                        </div>
                    </el-table-column>
                    <el-table-column label="采购单状态" inline-template>
                        <div class="ellipsis" :title="row.purchase_order_status_text">
                            {{row.purchase_order_status_text}}
                        </div>
                    </el-table-column>
                    <el-table-column label="币种" prop="currency_code">
                    </el-table-column>
                    <el-table-column label="申请付款金额" inline-template>
                        <div>{{row.apply_amount | filtersPay}}</div>
                    </el-table-column>
                    <el-table-column label="已付款金额" inline-template>
                        <div>{{row.payment_amount | filtersPay}}</div>
                    </el-table-column>
                    <el-table-column label="采购类型" inline-template>
                        <div class="ellipsis" :title="row.purchase_type">{{row.purchase_type}}</div>
                    </el-table-column>
                    <el-table-column label="采购员" prop="purchaser">
                    </el-table-column>
                    <el-table-column label="匹配结果" inline-template>
                        <div class="ellipsis">{{row.matching | filterCount}}</div>
                    </el-table-column>
                    <el-table-column label="阿里订单金额" inline-template>
                        <div class="ellipsis">{{row.ali_order_amount | filtersPay}}</div>
                    </el-table-column>
                    <el-table-column label="可用支付方式" inline-template>
                        <div class="ellipsis" :title="row.use_pay_way">{{row.use_pay_way | filterCount}}
                        </div>
                    </el-table-column>
                    <el-table-column label="账期支付" inline-template>
                        <div class="ellipsis">{{row.trade_type_desc_code | filterPay}}
                        </div>
                    </el-table-column>
                </el-table>
                <el-row class="mt-lg" v-if="is_batch">
                    <div class="row-content">
                        <span>可支付金额 : </span> <span>{{mark_detail.currency_code}}  {{support_payments}}</span>
                    </div>
                </el-row>
                <el-row v-if="is_batch">
                    <div class="row-content">
                        <span>不可支付金额 : </span> <span>{{mark_detail.currency_code}}  {{no_support_payments}}</span>
                    </div>
                </el-row>
                <el-card style="position: absolute;right:15px;bottom:55px;z-index: 99999;"
                         v-if="showRemark"
                         class="el_card_remark">
                    <div class="remark-sale-look" style="position: inherit;">
                        <label class="remark-sale-header">取消付款的原因: </label>
                        <el-form class="remark-sale-body">
                            <el-form-item>
                                <el-input type="textarea" :maxlength="100" placeholder="请输入原因"
                                          :autosize="{ minRows: 4, maxRows: 6}" v-model="reason">
                                </el-input>
                            </el-form-item>
                        </el-form>
                        <div class="remark-sale-footer">
                            <div class="fr mb-xs">
                                <el-button type="primary" size="mini" @click="cancel_pay_submit">提交</el-button>
                                <button class="small-button cancel" type="button" @click="showRemark=false">取消</button>
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>
            <div slot="footer">
                <el-button size="mini" @click="cancel_pay" type="primary" v-if="!is_batch">取消付款</el-button>
                <el-button size="mini" @click="hand_mark" type="primary" :disabled="disabled_mark">手动标记</el-button>
                <el-button size="mini" @click="online_pay" type="primary" :disabled="disabled_mark">线上付款</el-button>
                <el-button size="mini" @click.native="show = false">取消</el-button>
            </div>
            <!--查看采购单详情-->
            <look-list v-model="lookVisable"
                       :lookData="lookData"
                       :edit="false"
                       :listId="listId"
                       @save-logistics="save_logistics">
            </look-list>
            <page-dialog title="选择支付方式"
                         v-model="payWayVisable"
                         :close-on-click-modal="false"
                         @close="close_ali"
                         ref="payWay"
                         center>
                <el-form :model="form_list"
                         :rules="rules"
                         label-width="190px"
                         ref="form_list"
                         style="margin-top:20px;height:100px">
                    <el-form-item label="支付方式：" prop="pay_way">
                        <el-select v-model="form_list.pay_way"
                                   :close-on-click-modal="false"
                                   class="inline mr-sm"
                                   placeholder="请选择支付方式"
                                   style="width: 140px;" filterable clearable>
                            <el-option

                                :key="item.value"
                                v-for="item in wayList"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="mini" @click.native="payWayVisable = false">取 消</el-button>
                    <el-button size="mini" @click="submit('form_list')" type="primary">确定</el-button>
                </div>
            </page-dialog>
        </page-dialog>
    </div>
</template>

<style lang="stylus">
    .online-mark-pay-class {
        .sele-class {
            display: flex;
            justify-content: space-around;
        }
        .row-content {
            display: flex;
            align-items: center;

            span:first-child {
                display: inline-block;
                width: 91px;
                text-align: right;
                padding: 5px 5px;
                font-weight: bold;
            }

            span:last-child {
                width: 80%;
            }
        }

        .card-line {
            border-top: 1px solid #dee5ee;
            height: 15px;
            margin-top: 20px;
        }

        .red-color {
            color: #f00;
        }
        .limit-input {
            .el-input__inner {
                border: 1px solid #f00;
            }
        }

        .deal-center-pay {
            display: flex;
            justify-content: center;
            flex-direction: column;
            padding: 5px 5px;
        }

        .el_card_remark {
            .remark-sale-look {
                overflow-y: hidden;
                width: 190px;
                height: 140px;
                position: absolute;
                top: 67px;
                right: 7px;
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
        }
    }
</style>

<script>
    import {
        api_purchase_online_payment,
        api_get_ali_pay_type,
        api_purchase_ali_payment,
        api_purchase_apply_cancel,
    } from "../../../api/finance-purchase"
    import {api_look_detail} from "../../../api/purchase"

    export default {
        data() {
            return {
                rules: {
                    pay_way: [
                        {required: true, message: '请选择支付方式', trigger: 'change'}
                    ],
                },
                showRemark: false,
                payWayVisable: false,
                show: false,
                lookVisable: false,
                lookData: {},
                form_list: {
                    pay_way: '',
                },
                wayList: [],
                resultList: [
                    {label: "全部", value: ''},
                    {label: "匹配成功", value: 1},
                    {label: "交易关闭", value: 3},
                    {label: "金额不一致", value: 2},
                    {label: "外部流水号异常", value: 4},
                    {label: "交易成功", value: 5},
                    {label: "已付款", value: 6},
                ],
                payList: [
                    {label: "全部", value: ''},
                    {label: "支付宝", value: 1},
                    {label: "诚e赊", value: 2},
                    {label: "跨境宝", value: 3},
                ],
                typeList: [
                    {label: "全部", value: ''},
                    {label: "是", value: 1},
                    {label: "否", value: 0},
                ],
                listId: 0,
                reason: '',
                selects: [],
                tableData: []
            }
        },
        computed: {
            no_support_payments() {
                let no_match = this.tableData.filter(row => row.matching_code !== 1).map(item => item.apply_amount);
                if (this.tableData.length > 0 && no_match.length > 0) {
                    let no_money = no_match.map(Number).reduce((a, b) => {
                        return a + b;
                    });
                    return no_money.toFixed(2)
                } else {
                    return '- - '
                }
            },
            support_payments() {
                let is_match = this.tableData.filter(row => row.matching_code === 1).map(item => item.apply_amount);
                if (this.tableData.length > 0 && is_match.length > 0) {
                    let is_money = is_match.map(Number).reduce((a, b) => {
                        return a + b;
                    });
                    return is_money.toFixed(2)
                } else {
                    return '- - '
                }
            },
            disabled_mark() {
                if (!this.is_batch) {
                    return this.checkList.length > 0 && this.checkList[0].matching_code !== 1
                } else {
                    return this.selects.length === 0
                }
            }
        },
        watch: {
            show(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            }
        },
        methods: {
            close_ali(){
                this.$emit('close-ali');
            },
            filter_pay() {
                let teampObj = [];
                for (let i = 0; i < this.selects.length; i++) {
                    let teamp = {
                        purchase_order_id: this.selects[i].purchase_order_id,
                        external_number: this.selects[i].external_number,
                    };
                    teampObj.push(teamp);
                }
                let data = {
                    data: teampObj
                };
                this.get_ali_pay(data);
            },
            selectable(row) {
                return row.matching_code === 1 ? true : false;
            },
            hand_mark() {//手动标记
                this.$emit('hand-mark', this.tableData);
            },
            online_pay() {//线上付款
                let isSelect = this.checkList.filter(row => {
                    return row.matching_code !== 1 && row.trade_type_desc_code ===0
                }).map(item => {
                    return item.purchase_order_id
                });
                let arrIsSelect = [...new Set(isSelect)];
                if (this.is_batch && arrIsSelect.length > 0) { //批量标记而且不是全部匹配成功
                    let brr = this.selects.map(row => {
                        return row.pay_way_code
                    });
                    let flag = false;
                    brr[0].forEach(row => {
                        if (brr.every(item => item.includes(row))) {
                            flag = true
                        }
                    });
                    this.filter_pay();
                    if(!flag){
                        this.$message({type: 'warning', message: '请选择有共有支付方式的采购单'});
                        return;
                    }
                    this.$http(api_purchase_apply_cancel, {snText: arrIsSelect, is_ali: 1, snType: 'purchase_order_id', payment_status: 5}).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.payWayVisable = true;
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    });

                } else if (this.is_batch && arrIsSelect.length === 0) {//批量标记而且全部匹配成功
                    let brr = this.selects.map(row => {
                        return row.pay_way_code
                    });
                    let flag = false;
                    brr[0].forEach(row => {
                        if (brr.every(item => item.includes(row))) {
                            flag = true
                        }
                    });
                    if (!flag) {
                        this.$message({type: 'warning', message: '请选择有共有支付方式的采购单'});
                    } else {
                        this.filter_pay();
                        this.payWayVisable = true;
                    }
                } else {//单个标记付款
                    let single = {
                        purchase_order_id: this.tableData[0].purchase_order_id,
                        external_number: this.tableData[0].external_number
                    };
                    let data1 = {
                        data: [single]
                    };
                    this.get_ali_pay(data1);
                    this.payWayVisable = true;
                }
            },
            submit(form_list) {//-------------选择支付方式确定
                this.$refs[form_list].validate((bool) => {
                    if (bool) {
                        if (this.is_batch === true) {// 批量
                            let arrList = this.selects.map(row => {
                                return {
                                    purchase_order_id: row.purchase_order_id,
                                    account_1688: row.account_1688,
                                }
                            });
                            this.finish_pay(arrList);
                        } else {//单个
                            let arrList = this.checkList.map(row => {
                                return {
                                    purchase_order_id: row.purchase_order_id,
                                    account_1688: row.account_1688,
                                }
                            });
                            this.finish_pay(arrList);
                        }
                    } else {
                        return false
                    }
                });
            },
            finish_pay(arrList) {//完成支付公共
                this.$http(api_purchase_online_payment, {
                    data: arrList,
                    pay_type: this.form_list.pay_way
                }).then(res => {
                    let url = res.payUrl;
                    window.open(url);
                    this.$confirm('是否完成付款?  ', '提示', {
                        cancelButtonText: '未完成',
                        confirmButtonText: '完成',
                        type: 'warning',
                    }).then(() => {
                        this.pay_ment(api_purchase_ali_payment, {
                            data: arrList,
                            pay_type: this.form_list.pay_way
                        });
                    }).catch(() => {
                        this.pay_ment(api_purchase_ali_payment, {
                            data: arrList,
                            pay_type: this.form_list.pay_way
                        });
                    });
                }).catch(code => {
                    this.$message({type: 'warning', message: code.message || code});
                });
            },
            pay_ment(url, data) {//支付成功 失败公共
                this.$http(url, data).then(res => {
                    this.payWayVisable = false;
                    this.show = false;
                    this.$emit('showFalse');
                    this.$message({typ: 'success', message: res.message || res});
                }).catch(code => {
                    this.$message({typ: 'success', message: code.message || code});
                });
            },
            get_ali_pay(data) {//线上阿里支付方式
                this.$http(api_get_ali_pay_type, data).then(res => {
                    this.wayList = res;
                }).catch(code => {
                    console.log(code);
                });
            },
            open() {
                this.form_list.pay_way = '';
                this.selects = '';
                this.reason = '';
                this.showRemark = false;
                this.tableData = this.checkList;
                this.searchData.matching_code = '';
                this.searchData.pay_way_code = '';
                this.searchData.trade_type_desc_code = '';
            },
            selectionChange(val) {
                this.selects = val;
                this.$emit('online-select-change', val);
            },
            cancel_pay_submit() { //取消付款原因提交
                this.reason = this.reason.trim();
                if (this.reason === '') {
                    this.$message({type: 'error', message: '请填写原因'});
                    return;
                } else {
                    this.$emit('cancel_pay_submit', this.mark_detail.data[0].purchase_payment_id, this.reason);
                }
            },
            search() {
                this.tableData = this.checkList;
                for(let key in this.searchData){
                    if(this.searchData[key] !== ''){
                        this.tableData = this.tableData.filter(row => {
                            if(key === 'pay_way_code'){
                                return row[key].includes(this.searchData[key])
                            }else{
                                return row[key] === this.searchData[key]
                            }
                        })
                    }
                }
            },
            look_(info) {//查看采购详情
                this.lookVisable = true;
                this.lookData = {};
                this.$set(this, "listId", info.purchase_order_id);
                this.$set(this.lookData, "shipping_cost", 0);
                this.$http(api_look_detail, info.purchase_order_id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd HH:mm:ss', res.expect_arrive_date);
                    this.lookData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            cancel_pay() {
                this.showRemark = true;
            },
            save_logistics(id) {
                this.$http(api_look_detail, id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd HH:mm:ss', res.expect_arrive_date);
                    this.lookData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
        },
        filters: {
            filtersPay(val) {
                if (val > 0) {
                    return Number(val).toFixed(2);
                } else {
                    return '- -'
                }
            },
            filterStatus(val) {//付款状态
                const statusArr = new Map()
                    .set(0, "待采购审核")
                    .set(1, "采购审核不通过")
                    .set(2, "待财务审核")
                    .set(3, "财务审核不通过")
                    .set(4, "待采购排款")
                    .set(5, "待付款")
                    .set(6, "已付款")
                    .set(7, "取消付款")
                    .set(8, "部分付款")
                    .set(-1, "作废")
                    .set(-4, "采购排款不通过");
                return statusArr.get(val);
            },
            dateFilter(val) {
                if (val > 0) {
                    return datef('YYYY-MM-dd', val);
                } else {
                    return '- -'
                }
            },
            pay_filter(val) {
                if (Number(val) >= 0) {
                    return Number(val).toFixed(2);
                }
            },
            filterCount(val) {
                return val === '' ? '- -' : val;
            },
            filterPay(val) {
                switch(val) {
                    case 1:
                        return '是';
                        break;
                    case 0:
                        return '否';
                        break;
                    default:
                        return '- -';
                }
            }
        },
        props: {
            pay_loading: {required: true, type: Boolean},
            is_batch: {required: true, type: Boolean},
            value: {},
            checkList: {required: true, type: Array,},
            mark_detail: {},
            title: {required: true, type: String,},
            isEdit: {required: true, type: Boolean},
            searchData: {required: true, type: Object},
        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default,
            uiLimitNumber: require('../../../components/ui-limit-number').default,
            requestButton: require('../../../global-components/request-button').default,
            lookList: require('../../procurement/purchase/look-list.vue').default,
            imageUpload: require('./image-upload').default,
            searchCard: require('../../../components/search-card.vue').default,
            labelItem: require('../../../components/label-item.vue').default,

        }
    }
</script>

