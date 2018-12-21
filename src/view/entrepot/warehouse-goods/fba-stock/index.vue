<template>
    <page class="p-index">
        <label-item label="请选择亚马逊FBA仓：" class="mb-xs mt-sm">
            <el-select v-model="warehouse_id" class="inline" filterable clearable @change="select_warehouse">
                <el-option
                        :key="item.value"
                        v-for="item in warehouses"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <search-card @search="search" @init-params="clear" :params="paramsData" :clears="clears"
                     style="overflow: initial;">
            <div class="mb-xs">
                <label-item label="库存状态：" class="inline">
                    <el-select v-sf.status v-model="paramsData.status" class="inline width-xs">
                        <el-option
                                :key="item.value"
                                v-for="item in repertoryLists"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="产品状态：" class="inline ml-sm">
                    <el-select v-sf.status v-model="paramsData.sku_status" class="inline width-xs">
                        <el-option
                                :key="item.value"
                                v-for="item in sku_status"
                                :label="item.lable"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="分配状态：" class="inline ml-sm">
                    <el-select v-sf.can_allot v-model="paramsData.can_allot" class="inline width-xs">
                        <el-option
                                :key="item.value"
                                v-for="item in allotLists"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>

                <label-item label="" class="inline ml-sm">
                    <el-select v-sf.snType v-model="paramsData.snType" class="inline width-sm">
                        <el-option
                                :key="item.value"
                                v-for="item in typeList"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <order-input v-if="paramsData.snType !== 'goods_name'" v-sf.snText
                                 v-model="paramsData.snText"
                                 class="inline width-super ml-mini reset-padding"
                                 @keydown="search"
                                 placeholder="可批量搜索，Shift+回车换行...">
                    </order-input>
                    <el-input v-else v-sf.snText v-model="paramsData.snText" @keyup.enter.native="search"
                              class="inline ml-mini enter-result"></el-input>
                </label-item>
                <label-item label="库存数量：" class="inline ml-sm">
                    <el-input v-sf.start_quantity type="number" @keyup.enter.native="search"
                              v-model="paramsData.start_quantity" class="width-xs inline enter-result"></el-input>
                    <span>~</span>
                    <el-input v-sf.end_quantity type="number" @keyup.enter.native="search" v-model="paramsData.end_quantity"
                              class="width-xs inline enter-result"></el-input>
                </label-item>
                <label-item label="库龄（天）：" class="inline ml-sm">
                    <el-input v-sf.start_age type="number" @keyup.enter.native="search" v-model="paramsData.start_age"
                              class="width-xs inline enter-result"></el-input>
                    <span>~</span>
                    <el-input v-sf.end_age type="number" @keyup.enter.native="search" v-model="paramsData.end_age"
                              class="width-xs inline mr-sm enter-result"></el-input>
                </label-item>
            </div>
            <label-item label="销售时间：">
                <el-date-picker v-model="paramsData.begin_delivery_time"
                                type="date"
                                placeholder="开始时间"
                                v-sf.begin_delivery_time
                                :picker-options="pickerStart"
                                class="inline date ml-mini"></el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker v-model="paramsData.end_delivery_time"
                                type="date"
                                placeholder="结束时间"
                                v-sf.end_delivery_time
                                :picker-options="pickerEnd"
                                class="inline date mr-sm"></el-date-picker>
            </label-item>
        </search-card>
        <goods-classify ref="classifyPart" :leftControllerTitle="leftControllerTitle">
            <!-- 按钮 -->
            <div slot="button-list">
                <!-- TODO:此处先做$refs处理，后续调整整个页面结构 -->
                <permission :disabled="disabled" tag="ElButton" :route="apis.url_change_alert" size="mini"
                            type="default" @click.native="$refs.fba_table.change_number">修改预警数
                </permission>
                <permission tag="ElButton" :route="apis.url_get_apply" class="ml-sm" size="mini" type="default"
                            @click.native="$refs.fba_table.apply_stock">提交备货申请
                </permission>
            </div>
            <!-- 商品列表树 -->
            <goods-tree slot="goods-tree"
                        @hidden-left="hidden_left"
                        v-resize="{height:75}"
                        @change-category="categories_click"
                        :categoriesTempl="categoriesTempl">
            </goods-tree>
            <!-- 数据表格 -->
            <fba-table ref="fba_table" :warehouse_id="warehouse_id" :tables="tableData.data" v-model="isLoading"
                       @disabled="disabled_change" slot="goods-tabel"></fba-table>
        </goods-classify>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="page_change"
                :current-page="page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </page>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {api_get_sku_status} from '@/api/entrepot-picking';
    import {url_change_alert, url_get_apply, url_get_lend, url_get_logs, url_get_allot} from '@/api/overseas-stock';
    import {url_get_details} from '@/api/entrepot-overseas';

    import {api_warehouse_info, api_stock_list} from '@/api/fba-stock.js';
    import {api_get_categories} from '@/api/categories';

    export default {
        permission: {
            url_change_alert,
            url_get_apply,
            url_get_lend,
            url_get_logs,
            url_get_allot,
            url_get_details
        },
        data() {
            return {
                isLoading: false,
                leftControllerTitle: "显示产品分类检索",
                warehouses: [],
                warehouse_id: '',
                selectCategories: 0,
                searchData: {
                    status: '',
                    can_allot: 0,
                    snType: 'sku',
                    snText: '',
                    start_quantity: '',
                    end_quantity: '',
                    start_age: '',
                    end_age: '',
                    begin_delivery_time: '',
                    end_delivery_time: '',
                    page: 1,
                    pageSize: 50,
                    /**/
                    warehouse_id: '',//亚马逊FBA仓id
                    category_id: 0,//分类id
                },
                paramsData: {
                    status: '',
                    start_quantity: '',
                    end_quantity: '',
                    snText: '',
                    snType: 'sku',
                    begin_delivery_time: '',
                    end_delivery_time: '',
                    start_age: '',
                    end_age: '',
                    can_allot: 0,
                    sku_status: '',
                },
                clears: {
                    can_allot: 0,
                    snType: 'sku',
                },
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.paramsData.end_delivery_time) {
                            return time.getTime() > this.paramsData.end_delivery_time;
                        } else {
                            return false
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.paramsData.begin_delivery_time) {
                            return time.getTime() < this.paramsData.begin_delivery_time;
                        } else {
                            return false
                        }
                    }
                },
                showHiddenClassify: true,
                categoriesTempl: [],
                total: 0,
                page: 1,
                pageSize: 20,
                tableData: [],
                selectedIds: [],
                sku_status: [],
                operateButtons: [
                    {label: '分配', value: 1, apis: url_get_allot},
                    {label: '借调', value: 2, apis: url_get_lend},
                    {label: '提交备货', value: 3, apis: url_get_apply},
                    {label: '修改预警', value: 4, apis: url_change_alert},
                    {label: '出入库日志', value: 5, apis: url_get_details},
                    {label: '操作日志', value: 6, apis: url_get_logs},
                ],
                repertoryLists: [
                    {label: '全部', value: ''},
                    {label: '正常', value: 1},
                    {label: '低库存', value: 2},
                ],
                allotLists: [
                    {label: '全部', value: 0},
                    {label: '可分配', value: 1},
                    {label: '不可分配', value: 2},
                ],
                typeList: [
                    {label: 'SKU', value: 'sku'},
                    {label: 'SKU别名', value: 'sku_alias'},
                    {label: '商品名称', value: 'goods_name'},
                ],
                isCleared: false,
                disabled: true,
            }
        },
        computed: {
            classifyBoxSpan() {
                return this.showHiddenClassify ? 21 : 24;
            },
            showHIddenClassifyName() {
                return this.showHiddenClassify ? "隐藏产品分类检索" : "显示产品分类检索";
            },
        },
        mounted() {
            this.warehouse_info();
            this.categories_init();
            this.get_sku_status();
            this.hidden_left();
        },
        methods: {
            hidden_left() {
                this.$refs.classifyPart.showLeft(true);
            },
            get_sku_status() {//产品筛选状态
                this.$http(api_get_sku_status).then(res => {
                    this.sku_status = res;
                })
            },
            clear() {
                this.isCleared = true;
            },
            init() {//初始化
                this.isLoading = true;
                Object.assign(this.searchData, this.paramsData);
                this.searchData.category_id = this.selectCategories;
                this.searchData.warehouse_id = this.warehouse_id;
                let data = {};

                if (this.isCleared) {
                    this.searchData.page = 1;
                    this.searchData.pageSize = 50;
                    this.isCleared = false;
                }

                if (this.searchData.snType !== 'goods_name') {
                    data = window.clone(this.searchData);
                    let cur = data.snText.split('\n').filter(row => !!row);
                    data.snText = cur.map(row => {
                        return row.trim();
                    });
                } else {
                    data = window.clone(this.searchData);
                }

                data.begin_delivery_time && (data.begin_delivery_time = datef('YYYY-MM-dd', data.begin_delivery_time.getTime()/1000));
                data.end_delivery_time && (data.end_delivery_time = datef('YYYY-MM-dd', data.end_delivery_time.getTime()/1000));

                this.$http(api_stock_list, data).then(res => {
                    res.data.forEach(row => {
                        let buttons = [
                            {label: '提交备货', value: 3, apis: url_get_apply},
                            {label: '修改预警', value: 4, apis: url_change_alert},
                            {label: '出入库日志', value: 5, apis: url_get_details},
                            {label: '操作日志', value: 6, apis: url_get_logs},
                        ];
                        this.$set(row, 'operateButtons', buttons);
                    });
                    this.total = res.count;
                    this.page = Number(res.page);
                    this.pageSize = Number(res.pageSize);
                    this.tableData = res;
                    console.log('test_this.tableData', this.tableData);
                    console.log('fba request data is :', res);
                    this.isLoading = false;
                }).catch(err => {
                    console.error(err)
                })
            },
            search() {//搜索
                this.init()
            },
            warehouse_info() {//request => 亚马逊FBA仓
                this.$http(api_warehouse_info, {type: 5}).then(res => {
                    console.log('api_warehouse_info', res);
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    if (this.warehouses.length > 0) {
                        this.warehouse_id = this.warehouses[0].value;
                        this.init();
                    } else {
                        this.warehouse_id = '';
                    }
                }).catch(err => {
                    console.error(err);
                })
            },
            select_warehouse() {//亚马逊FBA仓选择框
                this.init();
            },
            categories_init() {
                this.$http(api_get_categories, {}).then(res => {
                    this.categoriesTempl = [{label: '全部分类', id: 0, children: []}];
                    for (let i in res) {
                        let treeObj = {};
                        if (res[i].hasOwnProperty("child_ids") && (res[i].child_ids.length > 0)) {
                            treeObj.label = res[i].title;
                            treeObj.id = res[i].id;
                            treeObj.children = res[i].child_ids.map(row => {
                                return {
                                    id: res[row].id,
                                    label: res[row].title
                                }
                            });
                            this.categoriesTempl.push(treeObj);
                        }
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            categories_click(val) {//分类的id
                console.log(val);
                if (val) {
                    this.selectCategories = val;
                    this.init();
                }
            },
            size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            page_change(val) {//换页
                this.searchData.page = val;
                this.init();
            },
            disabled_change(val) {
                this.disabled = val;
            }
        },
        watch: {},
        props: {},
        components: {
            orderInput: require("@/components/order-input.vue").default,
            fbaPage: require('./fba-page.vue').default,
            fbaTable: require('./fba-table.vue').default,
            fbaSearch: require('./fba-search.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            tree: require('@/components/tree.vue').default,
            goodsClassify: require('@/components/goods-classify.vue').default,
            goodsTree: require('@/components/goods-tree.vue').default,
        }
    }
</script>
