<template>
    <page class='p-maintain-information'>
        <search-card class="mb-xs" @search="init" :params="searchData" :clears="clears">
            <label-item label="">
                <el-select v-model="searchData.snType" class="inline ml-sm width-md">
                    <el-option :key="item.value" v-for="item in selectList" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <order-input v-model="searchData.snText" class="inline s-width-large ml-xs" @keydown="init"
                    placeholder="可批量搜索，Shift+回车换行..."></order-input>
            </label-item>
            <label-item label="发货仓库：" class="ml-sm">
                <el-select v-model="searchData.warehouse_id"
                            class="width-xs"
                            v-sf.warehouse_id
                            filterable clearable>
                    <el-option
                            v-for="res in warehouseList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="邮寄方式：" class="ml-sm">
                <el-cascader
                        clearable
                        filterable
                        change-on-select
                        :disabled="shippingList.length<=0"
                        :placeholder="comHolderShipping"
                        class="inline s-width-large"
                        v-model="searchData.shipping_id"
                        v-sf.shipping
                        expand-trigger="hover"
                        :options="shippingList"
                ></el-cascader>
            </label-item>
            <label-item label="" class="ml-sm">
                <el-select v-model="searchData.date_type" class="inline mr-xs width-xs">
                    <el-option :key="item.value" v-for="item in dateType" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker class="inline date s-width-small" v-model="searchData.date_b" v-sf.date_b
                    :picker-options="pickerstart" placeholder="开始时间">
                </el-date-picker><span>&nbsp;--&nbsp;</span>
                <el-date-picker class="inline date mr-sm" v-model="searchData.date_e" v-sf.date_e
                    :picker-options="pickerend" placeholder="结束时间">
                </el-date-picker>
            </label-item>
        </search-card>
        <el-row class="mb-xs">
            <permission class="ml-sm delivery_comfirm_btn" tag="selectDropdown" type="primary" size="mini" keys="value"
                :route="apis.url_confirm_export" :handles="partAllOptions" :action="handle_export_click"
                :change="set_export_type">
            </permission>
            <el-button size="mini" class="ml-sm" type="primary" @click="importPlatVisible = true">导入物流商称重和运费</el-button>
        </el-row>
        <!-- 表格 -->
        <table-module :search-data="searchData" :table-data="tableData" :total="total" :loading="loading" ref="table"
            @size-change="handle_size_change" @current-change="handle_current_change" @selection-change="handle_select">
        </table-module>
        <!-- 1.fields: 字段 2.templates: 模板id数组，用于匹配是否去后台获取相应模板 3. getTemplate 获取模板id-->
        <export-field v-model="exportVisible" :fields="fields" :templates="templates" @getTemplate="get_templates"
            title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
        <import-order v-model="importPlatVisible" @save="save_mport"></import-order>
        <!-- <excel-import v-model="importVisible"></excel-import> -->
        <export-tip v-model="visible"></export-tip>
    </page>
</template>
<script>

    const EXPORT_ALL = 1
    const EXPORT_BATCH = 0

    import { api_package_carriers, api_get_excel_field, 
            api_export_tempalte, api_export_excel, api_goods_export_template } from '@/api/package-carriers'
    import { api_get_warehouse, api_get_shipping } from '@/api/common.js';
    export default {
        permission: {
            url_confirm_export: '12312'
        },
        data() {
            return {
                searchData: {
                    snType: "order",
                    snText: '',
                    warehouse_id: '',
                    shipping_id: [],
                    date_type: 'shipping_time',
                    date_b: '',
                    date_e: '',
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    snType: 'order',
                    date_type: 'shipping_time',
                    page: 1,
                    pageSize: 20
                },
                tableData: [
                    {
                        id: 1,order_id: 123, order_number: 123, warehouse_id: 12312,
                        shipping_id: 3243,
                        estimated_weight: '1qe',
                        estimated_fee: 'wqeq',
                        package_weight: 'qwe',
                        shipping_fee: 'qwe',
                        providers_weight: 'asdsa',
                    },
                    {
                        id: 2,order_id: 123, order_number: 123, warehouse_id: 12312,
                        shipping_id: 3243,
                        estimated_weight: '1qe',
                        estimated_fee: 'wqeq',
                        package_weight: 'qwe',
                        shipping_fee: 'qwe',
                        providers_weight: 'asdsa',
                    },
                    {
                        id: 3,order_id: 123, order_number: 123, warehouse_id: 12312,
                        shipping_id: 3243,
                        estimated_weight: '1qe',
                        estimated_fee: 'wqeq',
                        package_weight: 'qwe',
                        shipping_fee: 'qwe',
                        providers_weight: 'asdsa',
                    },
                ],
                fields: [],
                warehouseList: [],
                shippingList: [],
                templates: [],
                total: 0,
                selectOptions: [],
                loading: false,
                exportVisible: false,
                importVisible: false,
                importPlatVisible: false,
                exportType: 1,
                visible: '',

                selectList: [
                    { label: '包裹号', value: 'number ' },
                    { label: '订单号', value: 'order' },
                    { label: '物流商订单', value: 'tracking' },
                    { label: '物流商跟踪号', value: 'shipping_number' },
                ],
                partAllOptions: [
                    { label: "部分导出", value: 0 },
                    { label: "全部导出", value: 1 }
                ],
                dateType: [
                    { label: '发货时间', value: 'shipping_time' },
                    { label: '下单时间', value: 'order_time' },
                ],
                pickerstart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e;
                        } else {
                            return time.getTime() > Date.now()
                        }
                    }
                },
                pickerend: {
                    disabledDate: (time) => {
                        if (this.searchData.date_b && time.getTime() < this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b || time.getTime() > Date.now()
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
            }
        },
        mounted() {
            this.get_warehouse()
            this.get_shipping()
            this.get_template_title()
            this.get_templates()
        },
        methods: {
            init() {
                let params = this.get_params()
                if (params.snText.length && params.snText.length > 300) return this.$message({ type: 'warning', message: '批量搜索只支持300条数据！' })
                this.loading = true
                this.$http(api_package_carriers, params).then(res => {
                    this.loading = false
                    this.tableData = res.data
                    this.total = res.count
                })
            },
            creat_excel(param) { 
                let fields = '';
                if(param.field) fields = param.field.join(',');
                const params = {
                    ids: this.ids,
                    export_type: this.exportType
                }
                const header = {
                    'X-Result-Fields': fields,
                    contentType: 'application/x-www-form-urlencoded'
                }
                return this.$http(api_export_excel, params, header).then(res => {
                    this.visible = true
                })
            },
            //获取表头
            get_template_title() {
                this.$http(api_get_excel_field).then(res => {
                    this.fields = res
                }).catch(error => this.$message({type: 'error', message: error}))
            },
            //获取我的模板
            get_templates() { 
                this.$http(api_goods_export_template, {type: 15}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    })
                    this.templates = res;
                }).catch(code => {this.$message({type: "error", message: code.message || code})});
            },
            save_mport() {

            },
            set_export_type(val) {
                this.exportType = val.value
                if (this.exportField === EXPORT_ALL) {
                    this.$refs.table.$children[0].clearSelection()
                }
            },
            handle_export_click() {
                if(this.selectOptions.length <= 0) return this.$message({type: 'warning', message: '请选择要导出的数据'})
                this.exportVisible = true
            },
            handle_size_change(val) {
                this.searchData.pageSize = val
                this.init()
            },
            handle_current_change(val) {
                this.searchData.page = val
                this.init()
            },
            handle_select(val) {
                this.selectOptions = val
            },
            get_shipping(warehouse_id) {
                if (!warehouse_id) return this.shippingList = [];
                this.$http(api_get_shipping, {warehouse_id: warehouse_id}).then(res => {
                    this.shippingList = [];
                    if (res.length <= 0) return;
                    this.generate_shipping_list(res);
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            get_warehouse() {
                this.$http(api_get_warehouse).then(res => {
                    this.warehouseList = [{label: "全部", value: ""}, ...res];
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            generate_shipping_list(res) {
                let shippingList = {}, i = 0;
                res.forEach(row => {
                    if (shippingList.hasOwnProperty(row.carrier_id)) {
                        this.shippingList[shippingList[row.carrier_id]].children.push({
                            value: row.shipping_method_id,
                            label: row.shortname,
                        })
                    } else {
                        shippingList[row.carrier_id] = i++;
                        let shipping = {
                            label: row.carrier_name,
                            value: row.carrier_id,
                        };
                        this.$set(shipping, 'children', [
                            {
                                value: row.shipping_method_id,
                                label: row.shortname,
                            }
                        ]);
                        this.shippingList.push(shipping);
                    }
                });
            },
            get_params() {
                let params = clone(this.searchData)
                Object.keys(params).forEach(key => {
                    if (typeof params[key] === 'string') {
                        params[key] = params[key].trim();
                    }
                });
                if(params.shipping_id.length === 1) params.shipping_id = params.shipping_id[0]
                else params.shipping_id = params.shipping_id[1]
                if (params.date_b) {
                    params.date_b = datef('YYYY-MM-dd', this.searchData.date_b.getTime() / 1000);
                }
                if (params.date_e) {
                    params.date_e = datef('YYYY-MM-dd', this.searchData.date_e.getTime() / 1000);
                }
                if (params.snText !== '') {
                    let snText = params.snText.replace(' ', '\n')
                    params.snText = snText.split('\n').filter(row => !!row).map(row => row.trim());
                }
                return params
            }
        },
        computed: {
            comHolderShipping() {
                if (!this.searchData.warehouse_id) {
                    return "请先选择发货仓库"
                } else if (!!this.searchData.warehouse_id && this.shippingList.length <= 0) {
                    return "该发货仓库下暂无运输方式"
                } else {
                    return "请选择运输方式";
                }
            },
            ids() {
                return this.selectOptions.map(r => Number(r.id))
            }
        },
        watch: {
            'searchData.warehouse_id'(val) {
                this.searchData.shipping_id = [];
                this.get_shipping(val);
            }
        },
        components: {
            labelItem: require('@/components/label-item').default,
            selectRemote: require('@/components/select-remote.vue').default,
            labelButtons: require('@/components/label-all-buttons.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            orderInput: require('@/components/order-input').default,
            selectDropdown: require('@/components/select-dropdown').default,
            tableModule: require('./table-module.vue').default,
            excelImport: require('./excel-import.vue').default,
            exportField: require("@/components/export-field").default,
            importOrder: require('./import-order.vue').default,
            exportTip: require('@/components/export-queue-tip').default,
        }
    }
</script>
<style lang='stylus' scoped>
    .p-maintain-information {
        .el-card {
            overflow: visible;
        }
    }
</style>