<template>
    <div class="p-search-purchase">
        <search-card @search="search_list" :params="searchData" :clears="clears">
            <el-row>
                <label-buttons class="inline btn-ml mr-sm" :buttons="buttons" label="采购状态：" @select="select_status"
                           title="请选择状态"></label-buttons>
            </el-row>
            <el-row class="mb-mini">
                <label class="inline" title="请选择供应商"> 供应商：</label>
                <el-select class="inline s-width-large" v-sf.virtual_supplier_id v-model="searchData.virtual_supplier_id">
                    <el-option
                        v-for="item in supplierList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <label class="inline ml-sm" title="请选择采购仓库"> 采购仓库：</label>
                <el-select v-sf.warehouse_id v-model="searchData.warehouse_id"
                           placeholder="请选择" filterable class="inline s-width-small">
                    <el-option
                        :key="item.id"
                        v-for="item in depots"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <label class="inline ml-sm" title="请选择结算方式">结算方式：</label>
                <el-select class="inline s-width-default" v-sf.balance_type v-model="searchData.balance_type">
                    <el-option
                        v-for="item in balanceList"
                        :key="item.label"
                        :label="item.name"
                        :value="item.label">
                    </el-option>
                </el-select>
                <label class="inline ml-sm" title="请选择付款状态">付款状态：</label>
                <el-select class="inline s-width-default" v-sf.payment_status v-model="searchData.payment_status">
                    <el-option
                        v-for="item in paymentList"
                        :key="item.label"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
                <label class="inline ml-sm" title="推送">推送：</label>
                <el-select class="inline s-width-default" v-sf.push_status v-model="searchData.push_status">
                    <el-option v-for="item in pushList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <label class="inline ml-sm" title="是否生成虚拟付款申请">是否生成虚拟付款申请：</label>
                <el-select class="inline s-width-default" v-sf.has_virtual_finance v-model="searchData.has_virtual_finance ">
                    <el-option v-for="item in financeList"
                               :key="item.value"
                               :label="item.name"
                               :value="item.value">
                    </el-option>
                </el-select>
            </el-row>
            <el-select v-sf.snType v-model="searchData.bill_type" class="inline s-width-default" @change="change_label">
                <el-option
                    :key="item.value"
                    v-for="item in selectList1"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <order-input v-model="searchData.bill_number"
                         class="inline width-super"
                         v-sf.snText
                         @keydown="search_list"
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <el-select v-sf.dateType v-model="searchData.time_status" placeholder="请选择" class="inline ml-sm s-width-small">
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
    import labelButtons from '@/components/label-all-buttons.vue'
    import {publish_edit_depot} from "@/api/purchase"
    import {api_get_balance} from '@/api/assert-sup';
    import {api_get_supplier_virtual_supplier} from '@/api/virtual-purchase-order';

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
                    {label: "采购时间", value: 0},
                    {label: "预计到货", value: 1},
                    {label: "推送时间", value: 2},
                ],
                depots: [],
                buttons: [
                    {name: "全部", value: 0},
                    {name: "全部到货", value: 1},
                    {name: "部分到货不等待剩余", value: 2}
                ],
                paymentList: [
                    {name: "全部", value: ''},
                    {name: "未付款", value: 7},
                    {name: "已付款", value: 8},
                    {name: "部分付款", value: 9},
                ],
                financeList: [
                {name: "全部", value: 0},
                {name: "已生成", value: 1},
                {name: "未生成", value: 2},
            ],
                pushList:[
                    {label:'请选择',value:''},
                    {label:'已推送',value:'1'},
                    {label:'未推送',value:'0'},
                    {label: "推送失败", value: "-1"},

                ],
                selectList1: [
                    {label: "虚拟采购单号", value: 0},
                    {label: "真实采购单号", value: 1},
                    {label: "SKU", value: 2},
                    {label: "运单号", value: 3},
                ],
                changeLabel: "采购单号",
                balanceList: [],
                clears: {
                    page:1,
                    pageSize:50,
                    status:'',
                    bill_type:0,
                    bill_number:"",
                    date_b:"",
                    date_e:"",
                    virtual_supplier_id:"",
                    time_status:0,
                    warehouse_id:"",
                    balance_type:"",
                    payment_status:'',
                },
                supplierList:[]
            }
        },
        created() {
            this.depot_init();
            this.get_balance();
            this.get_supplier_list();
        },
        methods: {
            get_supplier_list(){
                this.$http(api_get_supplier_virtual_supplier).then(res=>{
                    this.supplierList = [{label:'全部',value:''},...res.map(row=>({label:row.company_name,value:row.id}))];
                }).catch(code=>{
                    console.log(code)
                })
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
            select_status(index) {
                this.$emit("select-status", this.buttons[index].value);
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
            }
        },
        components: {
            labelButtons,
            purchaser: require('../../../api-components/purchaser.vue').default,
            searchCard: require('../../../components/search-card.vue').default,
            orderInput: require('../../../components/order-input').default
        }
    }
</script>
