<template>
    <div class="p-return-shelves">
        <ui-card>
            <div slot="header" class="ui-card-header">
                <div>
                    <span class="title">周转篮列表</span>
                    <el-button @click="delete_order">清空数据</el-button>
                </div>
                <div>
                    <el-button size="mini" :disabled="historyResult.length === 0" @click.native="show_history">拣货单生成历史
                    </el-button>
                    <request-button :disabled="canMake" :request="make_pickings">生成拣货单</request-button>
                    <request-button :disabled="canCreate" :request="create_order">生成上架单</request-button>
                </div>
            </div>
            <el-table
                    :data="curData"
                    v-resize="{height:45}"
                    v-loading="loading"
                    class="scroll-bar"
                    element-loading-text="玩命加载中"
                    highlightCurrentRow>
                <el-table-column
                        min-width="50"
                        inline-template
                        label="周转篮号">
                    <div>
                        <ui-tip :content="row.number" :hiLite="row.quantity_can<Number(row.quantity)"
                                :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        min-width="60"
                        inline-template
                        label="SKU">
                    <div>
                        <ui-tip :content="row.sku" :hiLite="row.quantity_can<Number(row.quantity)" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        min-width="40"
                        inline-template
                        label="数量">
                    <template>
                        <div @dblclick="db_quantity(row)" class="quantity-hover" title="双击可手动更改数量">
                            <span v-if="row.isShow"
                                  :class="{lineColor:row.quantity_can<Number(row.quantity)?true:false}">{{row.quantity}}</span>
                            <integer-input v-if="!row.isShow" v-model="row.quantity" :min="1" class="inline width-mini"
                                           @blur="quantityBlur(row)"></integer-input>
                            <el-button v-if="!row.isShow"
                                       type="primary"
                                       size="mini"
                                       @click.native="sure_quantity(row)"
                                       class="inline">确定
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="50"
                        inline-template
                        label="可上架数">
                    <div>
                        <ui-tip :content="row.quantity_can" :hiLite="row.quantity_can<Number(row.quantity)"
                                :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        min-width="60"
                        inline-template
                        label="拣货单所需数">
                    <div>
                        <ui-tip :content="row.pickings_quantity"
                                :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        min-width="100"
                        inline-template
                        label="名称（规格）">
                    <div :class="{red: row.quantity_can<Number(row.quantity)}">
                        {{row.spu_name}}
                    </div>
                </el-table-column>
                <el-table-column
                        min-width="60"
                        inline-template
                        label="货位号">
                    <div>
                        <ui-tip :content="row.warehouse_cargo_code" :hiLite="row.quantity_can<Number(row.quantity)"
                                :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        min-width="60"
                        inline-template
                        label="分区">
                    <div>
                        <ui-tip :content="row.warehouse_area_type" :hiLite="row.quantity_can<Number(row.quantity)"
                                :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        min-width="50"
                        inline-template
                        label="操作">
                    <div>
                        <span class="operate" @click="delete_item($index)">删除</span>
                    </div>
                </el-table-column>
            </el-table>
            <el-pagination class="t-right mt-sm"
                           @size-change="handle_size_change"
                           @current-change="handle_current_change"
                           :current-page="page"
                           :page-size="pageSize"
                           layout="total, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </ui-card>

        <create-order v-model="createVisible"
                      @close="close"
                      :order-data="orderData">
        </create-order>
        <making-result v-model="makeVisible" :result="result" :title="title"></making-result>
    </div>
</template>
<style lang="stylus">
    .p-return-shelves {
        .quantity-hover:hover {
            cursor: pointer;
        }
        .lineColor {
            color: red !important;
        }
    }
</style>
<script>
    import {api_get_shelves, api_post_shelves, api_return_make_pickings} from '@/api/return-shelves'

    export default {
        data() {
            return {
                loading: false,
                tableData: [],
                cloneTableData: [],
                orderData: [],
                curData: [],
                result: [],
                historyResult: [],
                title: '',
                createVisible: false,
                makeVisible: false,
                page: 1,
                pageSize: 30,
                isPicking: false,
            }
        },
        mounted() {
            this.$nextTick(() => {
                let data = sessionStorage.getItem("tableModule");
                if (!!data) {
                    this.tableData = JSON.parse(data).reverse();
                    this.cloneTableData = clone(this.tableData);
                }
            });
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
        },
        methods: {
            init() {
                this.isPicking = false;
                //去列表里找是否已经扫描过这个sku
                let item = this.tableData.find(row => {
                    return row.sku === this.searchData.search_sku.trim();
                });
                let data = {
                    warehouse_id: this.searchData.warehouse_id,
                    sku: this.searchData.search_sku,
                };
                //如果扫描过则把需要提交的数量+1
                if (!!item) {
                    data.quantity = Number(item.quantity) + 1;
                } else {
                    data.quantity = 1;
                }
                this.$http(api_get_shelves, data).then(res => {
                    this.$set(res.data, 'isShow', true);
                    let index = this.tableData.findIndex(row => {
                        return row.sku_id === res.data.sku_id;
                    });
                    if (index !== -1) {
                        this.tableData[index].quantity++;
                        let row = this.tableData.splice(index, 1);
                        this.tableData.unshift(row[0]);
                        this.$emit('warning-tip', row[0].number, 1);
                    } else {
                        this.$set(res.data, 'warehouse_id', this.searchData.warehouse_id);
                        this.$set(res.data, 'number', this.tableData.length + 1);
                        this.$set(res.data, 'quantity', 1);
                        this.$set(res.data, 'pickings_quantity', 0);
                        this.tableData.unshift(res.data);
                        this.$emit('warning-tip', this.tableData.length, 1);
                    }
                    this.cloneTableData = clone(this.tableData);
                    sessionStorage.setItem('tableModule', JSON.stringify(this.tableData));
                    this.$emit('search', res.data);
                    this.$message({type: "success", message: res.message || res});
                }).catch(code => {
                    this.$emit('search-error');
                    this.$emit('warning-tip', code.message, 0);
                });
            },
            delete_item(index) {
                this.tableData.splice(index, 1);
                sessionStorage.setItem('tableModule', JSON.stringify(this.tableData));
            },
            delete_order() {
                this.tableData = [];
                sessionStorage.setItem('tableModule', JSON.stringify(this.tableData));
            },
            create_order() {
                let quantity_can_count = 0;
                this.tableData.forEach((v) => {
                    quantity_can_count += v.quantity;
                });
                let data = this.tableData.map(row => {
                    return {
                        warehouse_id: row.warehouse_id,
                        sku: row.sku,
                        quantity: Number(row.quantity) - row.pickings_quantity,//实际上架数
                        car_number: row.number,//周转箱号
                        // quantity_real:this.tableData.length,//实物数
                        quantity_can: row.quantity_can,//可上架数
                    }
                });
                let flag = data.findIndex(row => {
                    return Number(row.quantity) - row.pickings_quantity === 0;
                });
                if (flag !== -1) {
                    this.$message({type: "error", message: `第${flag}个周转篮的数量不能为空`});
                    return false;
                }
                return this.$http(api_post_shelves, {data: data}, {
                    contentType: 'application/x-www-form-urlencoded',
                    timeout: INFINITE
                }).then(res => {
                    sessionStorage.removeItem('tableModule');
                    this.orderData = res.data;
                    this.createVisible = true;
                    this.$message({type: "success", message: res.message || res});
                    return Promise.resolve()
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            make_pickings() {
                let quantity_can_count = 0;
                this.tableData.forEach((v) => {
                    quantity_can_count += v.quantity;
                });
                let data = {
                    warehouse_id: this.searchData.warehouse_id || sessionStorage.getItem('return_warehouse_id'),
                    sku_data: this.tableData.map(row => {
                        return {
                            sku: row.sku,
                            sku_id: row.sku_id,
                            quantity: Number(row.quantity) - row.pickings_quantity < Number(row.quantity_can) ? (Number(row.quantity) - row.pickings_quantity) : row.quantity_can,//实际上架数
                            turnover: row.number,//周转箱号
                        }
                    })
                };
                return this.$http(api_return_make_pickings, data, {
                    contentType: 'application/x-www-form-urlencoded',
                    timeout: INFINITE
                }).then(res => {
                    console.log(`make pickings`, res);
                    sessionStorage.removeItem('tableModule');
                    if (res.data.length !== 0) {
                        this.isPicking = true;
                        this.title = '拣货单生成结果';
                        this.result = res.data;
                        this.makeVisible = true;
                        this.update_history(res.data);
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.message || res,
                        });
                    }
                    return Promise.resolve()
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            close() {
                this.tableData = [];
                this.isPicking = false;
                this.historyResult = [];
                this.$emit('search-error');
            },
            db_quantity(row) {
                row.isShow = false;
            },
            async sure_quantity(row) {
                try {
                    let data = {
                        warehouse_id: this.searchData.warehouse_id || sessionStorage.getItem('return_warehouse_id'),
                        sku: row.sku,
                        quantity: row.quantity
                    };
                    let res = await this.$http(api_get_shelves, data);
                    row.isShow = true;
                    this.$message({type: "success", message: res.message || res});
                } catch (code) {
                    this.cloneTableData.forEach(item => {
                        if (item.id === row.id) {
                            row.quantity = item.quantity;
                        }
                    });
                    this.$message({type: "error", message: code.message || code});
                }
            },
            quantityBlur(row) {
                //这里失去焦点时需要把输入框和确定按钮都隐藏，失去焦点时还没有点击确定按钮，就隐藏了，所以需要一个延时器解决
                let timer = setTimeout(() => {
                    row.isShow = true;
                    timer = null;
                }, 100)
            },
            handle_size_change(val) {
                this.pageSize = val;
                let maxPage = Math.ceil(this.packages.length / this.pageSize) - 1;
                this.page = this.page > maxPage ? maxPage : this.page;
                this.paging_handle();
            },
            handle_current_change(val) {
                this.page = val;
                this.paging_handle();
            },
            paging_handle() {
                this.curData = this.pagingData[this.page - 1];
            },
            update_history(res) {//更新历史记录，同时更新拣货单所需数
                console.log(`history data`, res, this.tableData);
                res.map(row => {
                    let history = this.historyResult.find(history => history.turnover === row.turnover);
                    let data = this.tableData.find(sku => sku.number === row.turnover);
                    if (!!history) {
                        history.quantity += Number(row.quantity);
                    } else {
                        history = row;
                        this.historyResult.unshift(history);
                    }
                    this.$set(data, 'pickings_quantity', history.quantity);
                    console.log(`update history`, history, data, history.quantity);
                })
            },
            show_history() {
                this.title = '拣货单生成历史结果';
                this.result = this.historyResult;
                this.makeVisible = true;
            },
        },
        computed: {
            canCreate() {
                return this.tableData.length === 0;
            },
            canMake() {
                return this.tableData.length === 0 || this.isPicking;
            },
            total() {
                return this.tableData.length;
            },
            pagingData() { // 分页
                let pagingData = [];
                if (this.tableData.length === 0) {
                    return pagingData;
                }
                let length = Math.ceil(this.tableData.length / this.pageSize);
                for (let i = 0; i < length; i++) {
                    let start = i * this.pageSize;
                    pagingData.push(this.tableData.slice(start, start + this.pageSize));
                }
                return pagingData;
            },
        },
        watch: {
            pagingData() {
                this.paging_handle();
            },
        },
        props: {
            searchData: {},
        },
        components: {
            uiCard: require('@/components/ui-card.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            integerInput: require('@/components/integer-input').default,
            createOrder: require('./create-order').default,
            makingResult: require('./making-result.vue').default,
        },
    }
</script>
 
