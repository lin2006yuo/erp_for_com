<template>
    <div class="p-search-purchase">
        <search-card @search="search_list" :params="searchData" :clears="clears">
            <el-row>
                <label-buttons class="inline btn-ml mr-sm" :buttons="buttons" label="付款状态："
                               @select="select_status"
                           title="请选择状态">
                </label-buttons>
                <label-buttons class="inline btn-ml mr-sm" :buttons="audit" label="审核状态："
                               @select="audit_status"
                               title="请选择状态">
                </label-buttons>
            </el-row>
            <el-row class="mb-mini">
                <label class="inline" title="请选择供应商"> 供应商：</label>
                <el-select class="inline s-width-middle" v-sf.supplier_id v-model="searchData.supplier_id">
                    <el-option
                        v-for="item in supplierList"
                        :key="item.id"
                        :label="item.company_name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <label class="inline ml-sm" title="请选择结算方式">结算方式：</label>
                <el-select class="inline s-width-middle" v-sf.balance_type v-model="searchData.balance_type">
                    <el-option
                        v-for="item in balanceList"
                        :key="item.label"
                        :label="item.name"
                        :value="item.label">
                    </el-option>
                </el-select>
                <label class="inline ml-sm" title="请选择推送">推送：</label>
                <el-select v-sf.time_status v-model="searchData.push_status" placeholder="请选择" class="inline s-width-small">
                    <el-option
                        :key="item.value"
                        v-for="item in push_status"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-row>
            <el-select v-sf.order_type v-model="searchData.order_type" class="inline s-width-default" @change="change_label">
                <el-option
                    :key="item.value"
                    v-for="item in selectList1"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <order-input v-model="searchData.order_number"
                         class="inline width-super"
                         v-sf.snText
                         @keydown="search_list"
                         placeholder="可批量搜索，Shift+回车换行...">
            </order-input>
            <el-select v-sf.time_status v-model="searchData.time_status" placeholder="请选择" class="inline ml-sm s-width-small">
                <el-option
                    :key="item.value"
                    v-for="item in dataT"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-date-picker type="date" placeholder="开始时间" v-sf.date_b v-model="searchData.date_b"
                            :picker-options="pickerstart" class="inline date"></el-date-picker>&nbsp;--&nbsp;
            <el-date-picker type="date" placeholder="结束时间" v-sf.date_e v-model="searchData.date_e"
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
    import {publish_edit_depot,publish_virtual_supplier} from "../../../api/purchase"
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
                dataT: [
                    {label: "申请时间", value: "0"},
                    {label: "付款时间", value: "1"},
                    {label: "推送时间", value: "2"},
                ],
                push_status: [
                    {label: "全部", value: ""},
                    {label: "已推送", value: "1"},
                    {label: "未推送", value: "0"},
                    {label: "推送失败", value: "-1"},

                ],
                depots: [],
                buttons: [
                    {name: "全部", value: ''},
                    {name: "未付款", value: 1},
                    {name: "已付款", value: 2},
                    {name: "拒绝付款", value: 3}
                ],
                selectList1: [
                    {label: "虚拟采购单号", value: "0"},
                    {label: "真实采购单号", value: "1"},
                ],
                changeLabel: "采购单号",
                balanceList: [],
                supplierList:[],
                clears: {
                    page:1,
                    pageSize:50,
                    order_type: "0",
                    time_status: "0",
                    purchaseType: "purchase_execept_type",
                }
            }
        },
        created() {
            this.depot_init();
            this.get_balance();
            this.get_supplier();

        },
        methods: {
            change_label(val) {
                let find = this.selectList1.find(res => {
                    return res.value === val;
                });
                if (!!find) {
                    this.changeLabel = find.label;
                }
            },
            change_select() {
                this.searchData.balance_type = "";
                this.searchData.purchase_execept_type = ""
            },
            get_balance() {
                this.$http(api_get_balance).then(res => {
                    this.balanceList = [{name: "全部", label: ""}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            get_supplier(){
                this.$http(publish_virtual_supplier).then(res => {
                    this.supplierList = [{company_name: "全部", id: ""}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            select_status(index) {
                let val = this.buttons[index].value;
                this.$emit("select-status", val);
            },
            audit_status(index){
                let val = this.audit[index].value;
                this.$emit("audit",val);
            },
            search_list() {
                this.$emit("search");
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
            },
            audit:{
                required: true,
                type: Array
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
