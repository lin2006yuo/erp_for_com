<template>
    <div class="c-gennerate">
        <mailing-method ref="mailing" @left-show-change="left_show_change">
            <!-- 按钮 -->
            <!-- 头部右侧-->
            <!-- 邮寄方式列表 -->
            <transport :transport-data="treeData"
                       @node-click="click_tree"
                       slot="mailling-tree"
                       :loading="loading"
                       @hidden-left="$refs.mailing.showLeft(true)"
                       @title-click="clear_transport"
                       title-node="运输方式">
            </transport>
            <!-- 表格 -->
            <div class="box"
                 v-resize="{height:40}"
                 slot="goods-tabel">
                <p class="box-title t-left" style="padding-left:8px">你当前筛选的包裹汇总信息</p>
                <table class="right-table" cellpadding="0" cellspacing="0">
                    <tr>
                        <td>包裹数</td>
                        <td>{{tableData.package_quantity}}</td>
                    </tr>
                    <tr>
                        <td>订单数</td>
                        <td>{{tableData.order_quantity}}</td>
                    </tr>
                    <tr>
                        <td>SKU品种数</td>
                        <td>{{tableData.sku_type}}</td>
                    </tr>
                    <tr>
                        <td>商品数量</td>
                        <td>{{tableData.sku_quantity}}</td>
                    </tr>
                    <tr>
                        <td>你每次拣货的最大货品数：</td>
                        <td>
                            <el-input v-model="tableData.max_quantity"
                                      class="width-md ml-sm inline">
                            </el-input>
                            <span class="ml-sm">不能超过100,000</span>
                        </td>
                    </tr>
                    <!--<tr>-->
                    <!--<td>预计生成拣货单数量:</td>-->
                    <!--<td>{{tableData.expect_picking_quantity}}</td>-->
                    <!--</tr>-->
                    <tr>
                        <td>多品多件播种车:</td>
                        <td>
                            <el-select v-model="tableData.sorting_shelf_id"
                                       class="width-sm"
                                       style="margin: 0 auto;"
                                       @change="change_shelf">
                                <el-option v-for="(item, index) in shelfList"
                                           :key="item.name"
                                           :label="item.name"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td>多品多件拣货单最大包裹数：</td>
                        <td>{{tableData.multi_product}}</td>
                    </tr>
                    <tr>
                        <td>操作：</td>
                        <td colspan="3">
                            <el-button type="primary"
                                       size="medium"
                                       @click="generate">生成拣货单
                            </el-button>
                        </td>
                    </tr>
                </table>
            </div>
        </mailing-method>
    </div>
</template>
<style lang="stylus">
    .c-gennerate {
        overflow: hidden;
        .box {
            border: 1px solid #D3DCE6;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
            .box-title {
                border: 1px solid #D3DCE6;
                text-align: center;
                margin: 0;
                background-color: #00a3b7;
                font-size: 1.2rem;
                line-height: 32px;
                height: 32px;
                color: #ffffff;
            }
        }
        /*.el-tree-node__content {
            cursor: auto;
        }*/
        .el-tree-node__label {
            font-size: 12px !important;
        }
        .el-tree {
            border: none !important;
        }
        .right-table {
            font-size: 1.5rem;
            width: 50%;
            td {
                width: 25%;
                height: 45px;
                text-align: center;
                border: 1px solid #d3dce6;
            }
            td:first-child {
                border-left: none;
            }
        }
        .title-checkbox {
            color: #ffffff;
            margin-left: 24px;
        }
        .all {
            margin: 0;
            padding-left: 24px;
            cursor: pointer;
        }
        .tree {
            overflow-y: auto;
        }
    }
</style>
<script>
    import {api_get_pickings, api_get_shipping, api_post_pickings, api_get_shelf} from '@/api/generate-order'

    export default {
        data() {
            return {
                treeData: [],
                defaultProps: {
                    children: 'shipping',
                    label: 'name'
                },
                expandTree: [],
                checkedTree: [],
                tableData: {},
                is_init: false,
                switchVisiable: false,
                shelfList: [],
                timer: '',
                transportLabel: '',
                loading: false,
            }
        },
        mounted() {
        },
        methods: {
            init() {
                let data = window.clone(this.searchData);
                if (data.country = ['']) {
                    data.country = [];
                }
                if (data.accounts = ['']) {
                    data.accounts = [];
                }
                if (!data.warehouse_id) {
                    return;
                }
                this.$http(api_get_pickings, data).then(res => {
                    this.tableData = res;
                    this.$parent.$refs.search_module.is_mounted = true;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            init_tree() {
                this.is_init = false;
                this.treeData = [];
                this.searchData.carrier_id = 0;
                this.searchData.shipping_id = [];
                if (this.searchData.warehouse_id) {
                    let data = window.clone(this.searchData);
                    delete data.shipping_id;
                    delete data.carrier_id;
                    if (data.country.length === 1 && data.country[0] === "") {
                        data.country = [];
                    }
                    if (data.accounts.length === 1 && data.accounts[0] === "") {
                        data.accounts = [];
                    }
                    this.loading = true;
                    this.$http(api_get_shipping, data).then(res => {
                        this.treeData = Object.values(res).map(item => {
                            return {
                                id: item.id || 0,
                                label: item.name === "" ? "" : item.name + "(" + item.count + ")",
                                type: 'carrierr',
                                children: item.shipping.map(row => {
                                    return {
                                        id: row.id,
                                        type: 'shipping',
                                        label: `${row.name}(${row.count})`
                                    }
                                })
                            }
                        });
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                        this.loading = false;
                    })
                }
            },
            init_shelf(warehouse_id) {
                let data = {
                    warehouse_id: this.searchData.warehouse_id || warehouse_id
                };
                this.$http(api_get_shelf, data).then(res => {
                    this.shelfList = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            async generate() {
                let data = window.clone(this.searchData);
                if (data.country = ['']) {
                    data.country = [];
                }
                if (data.accounts = ['']) {
                    data.accounts = [];
                }
                // data.shipping_id = this.searchData.shipping_id;
                this.$parent.layer_visiable = true;
                data.max_quantity = this.tableData.max_quantity;
                data.sorting_shelf_id = this.tableData.sorting_shelf_id;
                try {
                    let res = await this.$http(api_post_pickings, data);
                    this.$emit('generate');
                    this.$message({type: "success", message: res.message || res});
                } catch (code) {
                    this.$message({type: "error", message: code.message || code});
                } finally {
                    this.$parent.layer_visiable = false;
                }
            },
            change_shelf() {
                this.shelfList.find(row => {
                    if (row.id === this.tableData.sorting_shelf_id) {
                        this.tableData.multi_product = row.total;
                        this.tableData.sorting_shelf = row.name;
                    }
                });

            },
            clear_transport() {
                this.searchData.carrier_id = 0;
                this.searchData.shipping_id = [];
                console.log(`clear transport`);
                this.init();
            },
            click_tree(node) {
                this.searchData.carrier_id = 0;
                this.searchData.shipping_id = [];
                if (!node.length) {
                    switch (node.type) {
                        case 'carrierr':
                            this.searchData.carrier_id = node.id;
                            break;
                        case 'shipping':
                            this.searchData.shipping_id = [node.id];
                            break;
                        default:
                            break;
                    }
                } else {
                    this.searchData.shipping_id = node;
                }
                console.log(`click tree`);
                this.init();
            },
            left_show_change(val) {
                console.log(`leftShow change`, val);
                this.$emit('left-show-change', val);
                if (!val && this.transportChange) {
                    this.init_tree();
                }
            }
        },
        computed: {},
        watch: {},
        props: {
            searchData: {},
            warehouseName: {},
            transportChange: {},
        },
        components: {
            switchShelf: require('./switch-shelf.vue').default,
            mailingMethod: require('@/components/mailing-method.vue').default,
            transport: require('@/components/transport.vue').default,
        },
    }
</script>
