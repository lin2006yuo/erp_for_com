<template>
    <div class="purchase-plan">
        <search-card @search="search_list" :params="searchParams" :clears="clears">
            <div class="el-row">
                <label-buttons label="仓库类型："
                               :buttons="warehouses"
                               class="inline"
                               @select="change_depot"
                               title="请选择仓库类型">
                </label-buttons>
                <label-buttons label="状态："
                               class="inline ml-sm"
                               :buttons="statuses"
                               @select="change_status"
                               title="请选择状态">
                </label-buttons>
            </div>
            <div class="el-row mb-mini">
                <label class="inline" title="请选择供应商"> 供应商：</label>
                <super-select class="inline s-width-large"
                              v-sf.supplier_id
                              v-model="searchParams.supplier_id"
                              storageKey="virtual_supplier_packing"
                              :options="supplierList">
                </super-select>
                <el-select v-model="searchParams.shType"
                           class="inline s-width-small ml-sm"
                           v-sf.shType
                           @change="change_select">
                    <el-option :key="item.value"
                               v-for="item in selectList2"
                               :label="item.label"
                               :value="item.value"
                    ></el-option>
                </el-select>
                <!--审核人的搜索-->
                <span v-if="searchParams.shType === 'approve_user_id'">
                   <super-select class="inline s-width-default"
                                 v-model="searchParams.approve_user_id"
                                 v-sf.approve_user_id
                                 storageKey="virtual_staffs"
                                 :options="staffsList"></super-select>
                </span>
                <!--创建人的搜索-->
                <span v-else="searchParams.shType === 'create_user_id'">
                     <super-select class="inline s-width-default"
                                   v-model="searchParams.create_user_id"
                                   v-sf.create_user_id
                                   storageKey="virtual_all_name"
                                   :options="userList"></super-select>
                </span>
                <label class="inline ml-sm" title="请选择采购员">采购员：</label>
                <super-select class="inline s-width-default"
                              v-model="searchParams.purchase_user_id"
                              v-sf.purchase_user_id
                              storageKey="virtual_staffs"
                              :options="staffsList">
                </super-select>
                <div class="br-show" style="display: none;height: 3px;"></div>
                <label class="inline ml-sm" title="请选择采购仓库">采购仓库：</label>
                <super-select class="inline s-width-default"
                              v-model="searchParams.warehouse_id"
                              v-sf.warehouse_id
                              filterable clearable
                              storageKey="virtual_store"
                              :options="depots">
                </super-select>
                <label class="ml-sm" title="请选择采购类型"> 采购类型：</label>
                <el-select v-model="searchParams.purchase_plan_type"
                           v-sf.purchase_plan_type
                           placeholder="请选择"
                           filterable
                           class="inline s-width-default">
                    <el-option :key="item.value"
                               v-for="item in purchaseTypes"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <label class="ml-sm" title="是否贴标/套袋"> 是否贴标/套袋：</label>
                <el-select v-model="searchParams.label_deck"
                           v-sf.label_deck
                           placeholder="请选择"
                           filterable
                           class="inline s-width-middle">
                    <el-option :key="item.value"
                               v-for="item in labelDeck"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <label class="ml-sm" title="是否是能退货"> 是否能退货：</label>
                <el-select v-model="searchParams.return_goods"
                           v-sf.return_goods
                           placeholder="请选择"
                           filterable
                           class="inline s-width-small">
                    <el-option :key="item.value"
                               v-for="item in returnGoods"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <label class="inline ml-sm" title="请选择是否空卖">是否空卖：</label>
                <el-select class="s-width-small inline" v-sf.pre_sale   v-model="searchParams.pre_sale">
                    <el-option
                        v-for="item in sellingList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-select v-sf.snType v-model="searchParams.snType"
                       class="inline s-width-default" @change="change_label">
                <el-option
                    :key="item.value"
                    v-for="item in selectList1"
                    :label="item.label"
                    :value="item.value"></el-option>
            </el-select>
            <order-input v-if="notIsSPU" v-model="searchParams.snText"
                         class="inline s-width-large ml-xs"
                         v-sf.snText
                         @keydown="search_list"
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <el-input v-else v-model="searchParams.snText"
                      v-sf.snText
                      :placeholder="`请输入${changeLabel}...`"
                      class="inline s-width-large"></el-input>
            <label class="inline ml-sm" title="请选择结算方式">结算方式：</label>
            <super-select class="inline s-width-middle"
                          v-sf.balance_type
                          v-model="searchParams.balance_type"
                          filterable clearable
                          storageKey="virtual_balance_type"
                          :options="balanceList">
            </super-select>
            <label class="inline ml-sm">备注：</label>
            <order-input v-model="searchParams.remark"
                         class="inline s-width-large"
                         v-sf.remark
                         @keydown="search_list"
                         placeholder="请输入备注..."></order-input>
            <el-select v-model="searchParams.dateType"
                       placeholder="请选择"
                       filterable
                       class="inline s-width-small ml-sm">
                <el-option :key="item.value"
                           v-for="item in timeTypeList"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <el-date-picker type="date"
                            placeholder="开始时间"
                            v-sf.date_b
                            v-model="searchParams.date_b"
                            :picker-options="pickerstart"
                            class="inline date">
            </el-date-picker>&nbsp;--&nbsp;
            <el-date-picker type="date"
                            placeholder="结束时间"
                            v-sf.date_e
                            v-model="searchParams.date_e"
                            :picker-options="pickerend"
                            class="inline date mr-sm">
            </el-date-picker>
        </search-card>

    </div>
</template>

<script>
    import {
        api_warehouse_type,
        api_get_publish,
        api_get_username_list
    } from '../../../api/procurement-plan';
    import {publish_edit_depot} from "../../../api/purchase";
    import {api_pack_getSupplier} from '../../../api/pack';
    import {api_get_balance} from '@/api/assert-sup';
    export default {
        data() {
            return {
                pickerstart: {
                    disabledDate: (time) => {
                        if (this.searchParams.date_e) {
                            return time.getTime() > this.searchParams.date_e.getTime()
                        } else {
                            return false
                        }
                    }
                },
                pickerend: {
                    disabledDate: (time) => {
                        if (this.searchParams.date_b) {
                            return time.getTime() < this.searchParams.date_b.getTime()
                        } else {
                            return false
                        }
                    }
                },
                warehouses: [],
                depots: [],
                supplierList: [],
                statuses: [//0 未提交，1 已提交，等待审批，2 审核未通过， 返回修改，3取消采购计划，4 已下单
                    {name: '全部', value: -1},
                    {name: '未提交', value: 0},
                    {name: '一级审批', value: 11},
                    {name: '二级审批', value: 12},
                    {name: '审核未通过', value: 2},
                    {name: '取消采购', value: 3},
                    {name: '已生成采购单', value: 4},
                    {name: '禁用', value: 5},
                ],
                staffsList: [],
                userList: [],
                selectList2: [
                    {label: "创建人", value: "create_user_id"},
                    {label: "审核人", value: "approve_user_id"},
                ],
                purchaseTypes:[
                    {label:'全部',value:""},
                    {label:'正常采购',value:'normal_purchasing'},
                    {label:'供应商多送',value:'purchase_order_overcharged'}
                ],
                selectList1: [
                    {label: "编号", value: "purchase_plan_number"},
                    {label: "SKU", value: "SKU"},
                    {label: "SPU", value: "spu"},
                    {label: "备货计划单号", value: "ready_plan_order"},
                ],
                labelDeck:[
                    {label:'全部',value:''},
                    {label:'仅贴标',value:1},
                    {label:'仅套袋',value:2},
                    {label:'贴标和套袋',value:3},
                    {label:'都不支持',value:4},
                ],
                returnGoods:[
                    {label:'请选择',value:''},
                    {label:'是',value:1},
                    {label:'否',value:2},
                ],
                sellingList: [
                    {label: "全部", value: ""},
                    {label: "是", value: 1},
                    {label: "否", value: 0},
                ],
                changeLabel: "SKU",
                balanceList:[],
                timeTypeList:[
                    {label: "提交时间", value: "commit_date"},
                    {label: "审核时间", value: "approve_time"},
                    {label: "取消时间", value: "cancel_time"},
                ],
            }
        },
        created() {
            this.init_warehouses();
        },
        mounted() {
            this.get_packing_supplier();
            this.get_packing_staffs();
            this.get_all_name();
            this.depot_init();
            this.get_balance();

        },
        methods: {
            get_balance() { //结算方式
                this.$http(api_get_balance).then(res => {
                    this.balanceList = res.map(row => {
                        return {
                            label: row.name,
                            value: row.label
                        }
                    });
                    this.batchPayWay = res.map(row => {
                        return {
                            label: row.name,
                            value: row.label
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            change_label(val) {
                if (val === "SKU") {
                    this.changeLabel = `SKU`;
                } else if (val === "spu") {
                    this.changeLabel = `SPU`;
                } else {
                    this.changeLabel = `编号`;
                }
            },
            depot_init() {//获取所有仓库
                this.$http(publish_edit_depot).then(res => {
                    this.depots =  res.map(row => {
                        return {
                            label: row.name,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    console.log(code)
                })
            },
            get_packing_staffs() {//采购员
                this.$http(api_get_publish).then(res=>{
                    this.staffsList = res.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            get_all_name() {//公司在职人员
                this.$http(api_get_username_list, {status: 1, on_job: 1, page: 1, pageSize: 5000}).then(res=>{
                    this.userList = res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            get_packing_supplier() {
                this.$http(api_pack_getSupplier).then(res=>{
                    this.supplierList = res.map(row => {
                        return {
                            label: row.company_name,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            init_warehouses() {
                this.$http(api_warehouse_type).then(res => {
                    this.warehouses = res.map(row => {
                        return {
                            name: row.name,
                            value: row.code
                        };
                    });
                    this.warehouses.unshift({name: "全部", value: ""})
                })
            },
            change_depot(index, item) { //仓库类型
                this.$emit('change_depot', index, item);
            },
            change_status(index, item) { //状态
                this.$emit('change_status', index, item);
            },
            search_list() {
                this.$emit("search");
            },
            change_select(val) {
                if(val === 'create_user_id'){
                    this.searchParams.approve_user_id = ''
                }else {
                    this.searchParams.create_user_id = ''
                }
                this.$emit('change_select');
            },
        },
        computed: {
            notIsSPU() {
                return this.searchParams.snType.toUpperCase() !== 'SPU'
            },
        },
        props: {
            searchParams: {required: true, type: Object},
            clears:{required: true, type:Object},
        },
        components: {
            searchCard: require('../../../components/search-card.vue').default,
            orderInput: require('../../../components/order-input').default,
            labelButtons: require('../../../components/label-buttons.vue').default,
        }
    }
</script>

<style lang="stylus">
    .purchase-plan {
        .el-card{
            overflow: visible;
        }
    }
</style>
