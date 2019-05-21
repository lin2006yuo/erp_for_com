<template>
    <page-dialog class="c-import-stock-goods" v-model="visible" @open="open" size="large" @close="close"
                 title="从备货计划引用商品">
        <search-card :params="searchData" @search="search" :clears="clears" class="mt-xs">
            <label-item label="备货计划单号：">
                <order-input v-model="searchData.code"
                             class="inline width-super"
                             v-sf.stock_code
                             @keydown="search"></order-input>
            </label-item>
        </search-card>
        <div class="stock-goods"
             v-if="stockData.length !== 0"
             v-loading="loading">
            <div class="stock-goods-content"
                 v-for="stock in stockData"
                 :key="stock.code">
                <table class="full-width mt-sm stock-detail template" align="center">
                    <tbody>
                    <tr>
                        <td width="20%">备货计划单号</td>
                        <td width="20%">品类数/商品数</td>
                        <td width="20%">备货仓库</td>
                        <td width="20%">中转仓库</td>
                        <td width="20%">状态</td>
                    </tr>
                    <tr>
                        <td>{{stock.code}}</td>
                        <td>{{`${stock.sku_id_count}/${stock.in_quantity_sum}`}}</td>
                        <td>{{stock.warehouse}}</td>
                        <td>{{stock.transit_warehouse}}</td>
                        <td>{{stock.status_txt}}</td>
                    </tr>
                    </tbody>
                </table>
                <el-table class="scroll-bar"
                          max-height="500"
                          highlight-current-row
                          @selection-change="batch_select"
                          @select="save_code(stock.code, stock.id)"
                          @select-all="save_code(stock.code, stock.id)"
                          :data="stock.detail">
                    <el-table-column type="selection" width="35"></el-table-column>
                    <el-table-column label="图片" width="70">
                        <template slot-scope="scope">
                            <el-popover
                                    v-if="scope.row.thumb"
                                    placement="right"
                                    trigger="hover">
                                <img :src="scope.row.thumb | filterImage"
                                     width="200px"
                                     height="200px">
                                <div slot="reference">
                                    <img :src="scope.row.thumb"
                                         @click="search_img(scope.row.thumb)"
                                         height="60px" width="60px"
                                         style="border:none">
                                </div>
                            </el-popover>
                            <img src="/static/error-picture-128.png"
                                 v-else
                                 height="60px" width="60px"
                                 style="border:none">
                        </template>
                    </el-table-column>
                    <el-table-column label="SKU/SKU别名" width="100" inline-template>
                        <div>
                            <div>{{row.sku}}</div>
                            <div v-for="item in row.sku_alias" :key="item">{{item || `--`}}</div>
                        </div>
                    </el-table-column>
                    <el-table-column label="商品名称" min-width="200" inline-template>
                        <span>{{row.sku_name}}</span>
                    </el-table-column>
                    <el-table-column label="库存锁定数量" width="100" inline-template>
                        <span>{{row.allocated_qty}}</span>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div v-else class="stock-goods">
            <div class="empty-text">暂无数据</div>
        </div>
        <div slot="footer">
            <el-button type="primary" size="mini" :disabled="stockData.length === 0" @click.native="sure">确定
            </el-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-import-stock-goods {
        .el-card {
            overflow: visible;
        }
        .stock-goods {
            min-height: 500px;
            .empty-text {
                padding: 80px 0;
                text-align: center;
            }
        }
        .stock-detail {
            background: #F0EDD1;
        }
    }
</style>
<script>
    import {api_stock_list_by_code} from "@/api/stocking";

    export default {
        data() {
            return {
                visible: false,
                searchData: {
                    code: ''
                },
                clears: {},
                stockData: [], //{detail: [], ...}
                loading: false,
                curCode: '',
                curId: '',
                selectData: [], //{list: [], code: ${code}, id: ${id}}
            }
        },
        filters: {
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            },
        },
        methods: {
            open() {

            },
            sure() {
                if (this.selectData.length === 0) {
                    return this.$message({type: 'error', message: '请选择备货单数据'});
                } else {
                    let skuData = [];//{...row, stocking_info:
                    // [{stocking_id: id, stocking_code: code qty: allocated_qty}]}
                    this.selectData.forEach(stock => {
                        stock.list.forEach(row => {
                            let sku = skuData.find(skuInfo => skuInfo.sku === row.sku);
                            if (!!sku) {
                                sku.stocking_info.push({
                                    stocking_code: stock.code,
                                    stocking_id: stock.id,
                                    qty: row.allocated_qty,
                                    apply_id: row.ids,
                                })
                            } else {
                                sku = row;
                                let stocking_info = [{
                                    stocking_code: stock.code,
                                    stocking_id: stock.id,
                                    qty: row.allocated_qty,
                                    apply_id: row.ids,
                                }];
                                this.$set(sku, 'stocking_info', stocking_info);
                                skuData.push(sku);
                            }
                        })
                    });
                    this.$emit('import-stock-goods', skuData);
                    this.visible = false;
                }
            },
            close() {
                Object.keys(this.searchData).forEach(key => {
                    this.searchData[key] = '';
                });
                this.stockData = [];
                this.selectData = [];
                this.curCode = '';
                this.curId = '';
            },
            get_params() {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                let params = clone(this.searchData);
                params.code = params.code.split('\n').filter(row => !!row).map(row => row.trim());
                params.warehouse_id = this.warehouse_id;
                params.transit_warehouse_id = this.transit_warehouse_id;
                return params;
            },
            search() {
                let params = this.get_params();
                console.log(params);
                this.loading = true;
                this.$http(api_stock_list_by_code, params).then(res => {
                    this.stockData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    })
                }).finally(() => {
                    this.loading = false;
                });
            },
            batch_select(selection) {// 筛选选中数据
                this.$nextTick(() => {
                    let select = this.selectData.findIndex(row => row.code === this.curCode);
                    if (select !== -1) {
                        if (selection.length === 0) {
                            this.selectData.slice(select, 1);
                        } else {
                            this.selectData[select].list = selection;
                        }
                    } else {
                        this.selectData.push({
                            code: this.curCode,
                            id: this.curId,
                            list: selection,
                        });
                    }
                });
            },
            save_code(code, id) {
                this.curCode = code;
                this.curId = id;
            },
            search_img(image) {
                this.imgPath = image.replace("_60x60", "_500x500");
                this.imgDialog = true;
            },
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            warehouse_id: {},
            transit_warehouse_id: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            orderInput: require('@/components/order-input.vue').default,
        }
    }
</script>