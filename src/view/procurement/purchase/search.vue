<template>
    <div class="p-search-purchase">
        <search-card @search="search_list" @enter="search_list" :params="params" :clears="clears">
            <label-buttons class="inline btn-ml mr-sm" :buttons="buttons" label="采购状态：" @select="select_status"
                           title="请选择状态"></label-buttons>
            <label-buttons class="inline btn-ml mr-sm" :buttons="audit_status" label="审核状态：" @select="audit_select"
                           v-show="audit_show" title="请选择审核状态"></label-buttons>
            <label-buttons class="inline btn-ml mr-sm" :buttons="applyBtn" label="付款申请状态：" @select="apply_select"
                           title="请选择付款申请状态"></label-buttons>
            <label-buttons class="inline btn-ml" :buttons="paymentBtn" label="付款状态：" @select="payment_select"
                           title="请选择付款状态"></label-buttons>
            <div class="el-row mb-mini">
                <el-select v-sf.snType v-model="params.snType" class="inline s-width-default" @change="change_label">
                    <el-option
                        :key="item.value"
                        v-for="item in selectList1"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <order-input v-if="notIsSPU" v-model="params.snText"
                             class="inline width-super"
                             v-sf.snText
                             @keydown="search_list"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
                <el-input v-else v-sf.snText v-model="params.snText" :placeholder="`请输入${changeLabel}...`"
                          class="inline width-super"></el-input>
                <label class="ml-sm" title="请选择采购员"> 采购员：</label>
                <purchaser class="inline s-width-small" v-sf.purchase_user_id
                           v-model="params.purchase_user_id"></purchaser>
                <label class="ml-sm" title="请选择供应商"> 供应商：</label>
                <supplier v-sf.supplier_id class="inline"
                          :placeHolder="true"
                          v-model="params.supplier_id"></supplier>
                <label class="ml-sm" title="请选择采购仓库"> 采购仓库：</label>
                <el-select v-sf.warehouse_id v-model="params.warehouse_id"
                           placeholder="请选择" filterable class="inline s-width-default">
                    <el-option
                        :key="item.id"
                        v-for="item in depots"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <!--<el-select v-sf.purchaseType v-model="params.purchaseType" placeholder="请选择"-->
                           <!--class="inline ml-md s-width-small" @change="change_select">-->
                    <!--<el-option-->
                        <!--:key="item.value"-->
                        <!--v-for="item in purchaseList"-->
                        <!--:label="item.label"-->
                        <!--:value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
                <label class="ml-sm" title="请选择异常类型">采购异常：</label>
                <el-select v-sf.purchase_execept_type v-model="params.purchase_execept_type" filterable
                           class="inline s-width-small">
                    <el-option
                        :key="item.value"
                        v-for="item in selectList2"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!--<span v-else>-->
                <!--<el-select v-sf.balance_type v-model="params.balance_type" filterable clearable-->
                <!--class="inline s-width-small">-->
                <!--<el-option-->
                <!--:key="item.value"-->
                <!--v-for="item in selectList3"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--</span>-->
                <label class="ml-sm"> 有无运单号：</label>
                <el-select v-sf.has_logistics v-model="params.has_logistics" class="inline s-width-small">
                    <el-option
                        :key="item.value"
                        v-for="item in hasLogistics"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
                <label class="ml-sm"> 是否接收：</label>
                <el-select v-sf.is_received v-model="params.is_received" class="inline s-width-small">
                    <el-option
                        :key="item.value"
                        v-for="item in isReceived"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <label class="inline" title="请选择结算方式">结算方式：</label>
            <el-select class="inline s-width-large" v-sf.balance_type v-model="params.balance_type">
                <el-option
                    v-for="item in balanceList"
                    :key="item.label"
                    :label="item.name"
                    :value="item.label">
                </el-option>
            </el-select>
            <el-select v-sf.dateType v-model="params.dateType" placeholder="请选择" class="inline ml-sm s-width-small">
                <el-option
                    :key="item.value"
                    v-for="item in dataT"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

            <el-date-picker type="date" placeholder="开始时间" v-sf.date_b v-model="params.date_b"
                            :picker-options="pickerstart" class="inline date"></el-date-picker>&nbsp;--&nbsp;
            <el-date-picker type="date" placeholder="结束时间" v-sf.date_e v-model="params.date_e"
                            :picker-options="pickerend" class="inline date mr-sm"></el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .p-search-purchase {
        .el-card {
            overflow: inherit;
            .mar_left {
                margin-left: 20px;
            }
        }
    }
</style>
<script>
    import labelButtons from '../../../components/label-all-buttons.vue'
    import {publish_edit_depot, publish_edit_user,} from "../../../api/purchase"
    import {api_get_balance} from '../../../api/assert-sup';

    export default {
        page: {
            devinfo: {
                frontEnd: '张兵根;张明亮;黎宏珍',
                backEnd: '杨伟权;谭斌',
                createTime: '2017-1-10',
                updateTime: '2017-8-22'
            }
        },
        data() {
            return {
                pickerstart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e
                        } else {
                            return false
                        }
                    }
                },
                pickerend: {
                    disabledDate: (time) => {
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b
                        } else {
                            return false
                        }
                    }
                },
                buyers: [],
                suppliers: [],
                dataT: [
                    {label: "采购时间", value: "purchase_time"},
                    {label: "预计到货", value: "expect_arrive_date"},
                    {label: "实际到货", value: "real_arrive_date"},
                ],
                purchaseList: [
                    {label: "采购异常", value: "purchase_execept_type"},
                    {label: "结算方式", value: "balance_type"}
                ],
                depots: [],
                buttons: [
                    {name: "全部", value: ''},
                    {name: "等待下单", value: 0},
                    {name: "等待到货", value: 10},
                    {name: "部分到货等待剩余", value: 11},
                    {name: "不等待剩余待审", value: 15},
                    {name: "部分到货不等待剩余", value: 20},
                    {name: "全部到货", value: 21},
                    {name: "作废待审", value: -11},
                    {name: "已作废", value: -1},
                ],
                audit_status: [
                    {name: '全部', value: ''},
                    {name: '待审批', value: 1},
                    {name: '审批不通过', value: 3}
                ],
                hasLogistics: [
                    {name: '全部', value: ''},
                    {name: '有', value: 1},
                    {name: '无', value: 0}
                ],
                isReceived: [
                    {name: '全部', value: ''},
                    {name: '是', value: 1},
                    {name: '否', value: 0}
                ],
                applyBtn: [
                    {name: "全部", value: ''},
                    {name: "未申请付款", value: 1},
                    {name: "已申请付款", value: 2},
                    {name: "已取消付款", value: 3},
                ],
                paymentBtn: [
                    {name: "全部", value: ''},
                    {name: "未付款", value: 7},
                    {name: "已付款", value: 8},
                    {name: "部分付款", value: 9},
                ],
                selectList1: [
                    {label: "采购单号", value: "purchase_order_code"},
                    {label: "SKU", value: "sku"},
                    {label: "采购计划编号", value: "purchase_plan_number"},
                    {label: "运单号", value: "tracking_number"},
                    {label: "外部流水账号", value: "external_number"},
                    {label: "SPU", value: "spu"},
                ],
                selectList2: [
                    {label: "全部", value: ""},
                    {label: "有不良品", value: "1"},
                    {label: "5天未完结", value: "2"},
                    {label: "10天未完结", value: "3"},
                ],
                selectList3: [
                    {label: "全部", value: ""},
                    {label: "货到付款", value: "1"},
                    {label: "款到发货", value: "2"},
                    {label: "定期结算", value: "3"},
                    {label: "周结", value: "4"},
                    {label: "半月结", value: "5"},
                    {label: "月结", value: "6"},
                ],
                audit_show: false, //审核状态选项
                changeLabel: "采购单号",
                params: {
                    snType: "purchase_order_code",
                    snText: "",
                    date_b: "",
                    date_e: "",
                    purchase_user_id: "",
                    payment_status: "",
                    payment_apply_status: "",
                    supplier_id: "",
                    dateType: "purchase_time",
                    partial_arrival_status: '',
                    warehouse_id: "",
                    purchase_execept_type: "",
                    balance_type: "",
                    has_logistics: "",
                    is_received: "",
                    purchaseType: "purchase_execept_type",
                },
                balanceList: [],
                clears: {
                    snType: "purchase_order_code",
                    dateType: "purchase_time",
                    purchaseType: "purchase_execept_type",
                }
            }
        },
        created() {
            this.purer_init();
            this.depot_init();
            this.get_balance();

        },
        computed: {
            notIsSPU() {
                return this.params.snType.toUpperCase() !== 'SPU'
            }
        },
        methods: {
            init_status_btn() {
                let curBtn = this.buttons;
                let statusesBtn = this.audit_status;
                let applyBtn = this.applyBtn;
                let paymentBtn = this.paymentBtn;
                this.buttons = [];
                this.audit_status = [];
                this.applyBtn = [];
                this.paymentBtn = [];
                this.$nextTick(() => {
                    this.buttons = curBtn;
                    this.audit_status = statusesBtn;
                    this.applyBtn = applyBtn;
                    this.paymentBtn = paymentBtn;
                });
            },
            change_label(val) {
                let find = this.selectList1.find(res => {
                    return res.value === val;
                });
                if (!!find) {
                    this.changeLabel = find.label;
                }
            },
            change_select() {
                this.params.balance_type = "";
                this.params.purchase_execept_type = ""
            },
            get_balance() {
                this.$http(api_get_balance).then(res => {
                    this.balanceList = [{name: "全部", label: ""}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            select_status(index) {
                if (this.buttons[index].value === 11) {
                    this.audit_show = true;
                } else {
                    this.audit_show = false;
                }
                let val = this.buttons[index].value;
                this.$emit("select_status", val);
            },
            apply_select(index) {
                let val = this.applyBtn[index].value;
                this.$emit("apply-select", val);
            },
            payment_select(index) {
                let val = this.paymentBtn[index].value;
                this.$emit("payment-select", val);
            },
            audit_select(index) {
                let val = this.audit_status[index].value;
                this.$emit("audit-select", val);
            },
            search_list() {
                Object.assign(this.searchData, this.params);
                if (this.notIsSPU && this.params.snText) {
                    this.searchData.snText = this.params.snText.replace(new RegExp(' ', 'gm'), '\n').trim().split('\n').map(row => row.trim()).filter(row => row !== '');
                }
                this.$emit("search");
            },
            //  获取所有采购人员
            purer_init() {
                this.buyers = [];
                this.$http(publish_edit_user).then(res => {
                    this.buyers = res;
                    this.buyers.unshift({realname: "全部", id: ""})
                }).catch(code => {
                    console.log(code)
                })
            },

            //获取所有仓库
            depot_init() {
                this.$http(publish_edit_depot).then(res => {
                    this.depots = res;
                    this.depots.unshift({name: "全部", id: ""})
                }).catch(code => {
                    console.log(code)
                })
            },
            clear() {
                this.$emit("clear")
            }

        },
        props: {
            searchData: {
                required: true,
                type: Object
            }
        },
        components: {
            labelButtons,
            supplier: require('../../../api-components/supplier.vue').default,
            purchaser: require('../../../api-components/purchaser.vue').default,
            searchCard: require('../../../components/search-card.vue').default,
            orderInput: require('../../../components/order-input').default
        }
    }
</script>
