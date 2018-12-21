<template>
    <el-row class="p-card-search">
        <search-card @search="search"
                     :params="form"
                     :clears="clears"
                     @init-params="init_status_btn">
            <div class="mb-mini">
                <label-buttons
                        v-sf.order_status
                        label="订单状态："
                        :buttons="orderStatus"
                        @select="change_order"
                        class="mr-sm"></label-buttons>
                <label>付款状态：</label>
                <el-select class="inline width-xs"
                           v-sf.payment_status
                           v-model="form.payment_status">
                    <el-option v-for="item in paymentStatus"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
                <label class="ml-sm">发货状态：</label>
                <el-select class="inline width-xs"
                           v-sf.shipped_time
                           v-model="form.shipped_time">
                    <el-option v-for="item in shippedTime"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
                <label class="ml-sm">站点：</label>
                <el-select class="inline width-lg"
                           v-sf.site
                           v-model="form.site"
                           filterable clearable>
                    <el-option v-for="item in siteList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
                <label class="ml-sm">账号简称：</label>
                <el-select class="inline width-lg"
                           :placeholder="comHolder"
                           :disabled="showAccount"
                           v-model="form.account_id"
                           v-sf.account_id
                           filterable clearable>
                    <el-option v-for="item in accountList"
                               :key="item.value"
                               :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
                <label class="ml-sm">是否已放款：</label>
                <el-select class="inline s-width-small"
                           v-model="form.is_transfer_money"
                           v-sf.account_id
                           filterable clearable>
                    <el-option v-for="item in makeLoansList"
                               :key="item.value"
                               :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
            </div>
            <!--<div>-->
            <el-select v-model="form.snType"
                       v-sf.snType
                       class="inline s-width-small">
                <el-option v-for="item in selectList1"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"
                           :disabled="item.disabled"></el-option>
            </el-select>
            <order-input v-model="form.snText"
                         class="inline width-super mr-sm"
                         v-sf.snText
                         @keydown="search"
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <el-select v-model="form.snDate"
                       v-sf.snDate
                       class="inline width-xs">
                <el-option v-for="item in selectList2"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-date-picker
                    v-sf.date_b
                    class="inline date"
                    @keyup.enter.native="search"
                    type="date"
                    placeholder="开始时间"
                    v-model="form.date_b"
                    :picker-options="pickerStart"
            ></el-date-picker>&nbsp;--&nbsp;
            <el-date-picker
                    @keyup.enter.native="search"
                    class="inline date mr-sm"
                    type="date"
                    placeholder="结束时间"
                    v-sf.date_e
                    v-model="form.date_e"
                    :picker-options="pickerEnd"
            ></el-date-picker>
        </search-card>
    </el-row>
</template>
<style lang="stylus" scoped>
    .p-card-search{
        .el-card{
            overflow: inherit;
        }
    }
    .date.el-date-editor {
        width: 120px;
        height: 26px;
        font-size: 1.2rem;
        .el-date-editor__trigger.el-icon {
            top: -7px;
        }
    }
    .date > .el-date-editor__editor {
        height: 26px;
    }
</style>
<script>
    import labelButtons from '../../aliexpress/list/label-buttons.vue';
    import {get_status_count, get_ebaysite, api_account_list} from '../../../../api/ebay-order';
    export default{
        data(){
            return {
                isBatch: false,
                batchText: '',
                snType2: 'order_id',
                showAccount: false,
                orderStatus: [
                    {label: "全部", value: "", count: ""},
                ],
                siteList: [],
                accountList: [],
                paymentStatus: [
                    {label: "全部", value: -1},
                    {label: "已付款", value: 1},
                    {label: "未付款", value: 0},
                ],
                shippedTime: [
                    {label: "全部", value: -1},
                    {label: "已发货", value: 1},
                    {label: "未发货", value: 0},
                ],
                selectList1: [
                    {label: "订单号", value: "order_id"},
                    {label: "订单编号", value: "record_number"},
                    {label: "买家ID", value: "buyer_user_id"},
                    {label: "店铺ID", value: "seller_user_id"},
                    {label: "交易号", value: "transaction_id"},
                    {label: "追踪号", value: "tracking_number"},
                    {label: "目的地", value: "shipping_address_country"},
                    {label: "买家姓名", value: "shipping_address_name"},
                    {label: "买家邮箱", value: "buyer_email"},
                    {label: "ItemId", value: "item_id"},
                    {label: "平台SKU", value: "sku"},
                ],
                selectList2: [
                    {id: 1, label: "下单时间", value: "created_time"},
                    {id: 2, label: "平台标记发货时间", value: "shipped_time"},
                ],
                selectList3: [
                    {label: "订单号", value: "order_id"},
                    {label: "买家ID", value: "buyer_user_id"},
                    {label: "追踪号", value: "tracking_number"},
                    {label: "平台SKU", value: "sku"},
                ],
                makeLoansList:[
                    {label: "全部", value: ''},
                    {label: "是", value: 1},
                    {label: "否", value: 0}
                    ],
                comHolder: "",
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.form.date_e) {
                            return time.getTime() > this.form.date_e;
                        } else {
                            return false;
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.form.date_b) {
                            return time.getTime() < this.form.date_b;
                        } else {
                            return false;
                        }
                    }
                }
            }
        },
        mounted(){
            this.get_ebaysite();
            this.get_statusCount(true);
            this.get_account(this.form.site);
        },
        watch: {
            "form.site"(val){
                this.form.account_id = "";
                this.get_account(val);
            },
        },
        computed: {
            changeLabel(){
                let find = this.selectList1.find(res => {
                    return res.value === this.form.snType;
                });
                if (!!find) {
                    return find.label;
                }
            }
        },
        methods: {
            init_status_btn(){
                let cur = this.orderStatus;
                this.orderStatus = [];
                this.$nextTick(() => {
                    this.orderStatus = cur;
                })
            },
            open_search(){
                this.isBatch = !this.isBatch;
                if (this.isBatch) {
                    this.form.is_batch = 1
                } else {
                    this.form.is_batch = '';
                    this.batchText = "";
                    this.search();
                }
            },
            batch_search(){
                this.form.is_batch = 1;
                this.$emit('batch-search')
            },
            change_order(index,item){
                this.form.order_status = item.value;
                this.$emit("change-order");
            },
            get_ebaysite(){
                this.$http(get_ebaysite).then(res => {
                    if (res.length > 0) {
                        res = res.map(row => {
                            return {
                                label: row.code,
                                value: row.code
                            }
                        })
                        this.siteList = [{label: "全部", value: ""}, ...res]
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
            get_account(val){
                this.accountList = [];
                this.$http(api_account_list, {channel_id: 1, site_code: val}).then(res => {
                    if (res.account.length > 0) {
                        this.showAccount = false;
                        res = res.account;
                        this.comHolder = "请选择账号简称";
                        this.accountList = [{label: "全部", value: ""}, ...res]
                    } else {
                        this.$nextTick(() => {
                            this.comHolder = "该站点下暂无账号简称";
                            this.showAccount = true;
                        })
                        this.$set(this, "accountList", [{label: "", value: ""}])
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
            get_statusCount(val){
                let params = {
                    snType: this.form.snType,
                    snDate: this.form.snDate,
                    site: this.form.site,
                    account_id: this.form.account_id,
                };
                let curString = this.form.snText.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                if(cur&&cur.length>1){
                    params.snText = cur.map(row=>{
                        return row.trim();
                    });
                }else if(cur&&cur.length===1){
                    params.snText =  cur[0];
                }
                this.form.payment_status > -1 && (params.payment_status = this.form.payment_status);
                this.form.shipped_time > -1 && (params.shipped_time = this.form.shipped_time);
                if (!!this.form.date_b) {
                    let date_b = new Date(this.form.date_b);
                    params.date_b = datef("YYYY-MM-dd", date_b / 1000);
                } else {
                    params.date_b = "";
                }
                if (!!this.form.date_e) {
                    let date_e = new Date(this.form.date_e);
                    params.date_e = datef("YYYY-MM-dd", date_e / 1000);
                } else {
                    params.date_e = "";
                }
                this.$http(get_status_count, params).then(res => {
                    let cur = 0;
                    res = res.map(row => {
                        cur += row.qty;
                        return {
                            label: row.order_status,
                            value: row.order_status,
                            count: row.qty,
                        }
                    });
                    if (!val) {
                        this.orderStatus.forEach(row => {
                            let find = res.find(item => {
                                return item.label === row.label
                            })
                            if (!!find) {
                                row.count = find.count;
                            } else {
                                row.count = cur;
                            }
                        })
                    } else {
                        this.orderStatus = [{name: "全部", count: cur, value: ""}, ...res]
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
            search(){
                this.get_statusCount();
                this.$emit("search-data");
            },
            search_clear(){
                this.$emit("search-clear");
            }
        },
        props: {
            form: {
                required: true,
                type: Object
            },
            clears: {
                required: true,
                type: Object
            }
        },
        components: {
            labelButtons,
            countSelect: require("../../../../components/count-select.vue").default,
            searchCard: require('../../../../components/search-card.vue').default,
            orderInput:require('../../../../components/order-input.vue').default,
        }
    }
</script>
