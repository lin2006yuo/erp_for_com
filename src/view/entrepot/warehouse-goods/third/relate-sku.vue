<template>
    <page-dialog title="选择指定商品" v-model="addGoods" size="full" :close-on-click-modal="false">
        <div>
            <el-select v-model="snType" ref="search" v-mouse-side.mousewheel="()=>{$refs.search.visible=false}"
                       class="inline width-xs">
                <el-option v-for="item in searchList" :value="item.value" :key="item.value"
                           :label="item.label"></el-option>
            </el-select>
            <order-input v-if="snType==='sku'||snType==='spu'" v-model="snText" class="inline width-super"
                         @keydown="search"></order-input>
            <el-input class="inline  width-super" v-else @keydown.native="search"
                      v-model="snText"></el-input>
            <el-button class="inline ml-sm" type="primary" size="mini" @click.native="search">搜索</el-button>
            <el-button class="inline ml-sm" size="mini" @click.native="clear">清空</el-button>
        </div>
        <el-row :gutter="8" class="mt-xs">
            <el-col :span="3">
                <label class="category_title" @click="all">全部分类</label>
                <div class="add-border">
                    <tree :tree="treeData" @node-click="handle_node_click" class="add-goods-tree"></tree>
                </div>
            </el-col>
            <el-col :span="21">
                <el-table
                        @selection-change="select"
                        border
                        height="550"
                        ref="table"
                        @row-click="row_click"
                        :data="goods.dataList"
                        v-loading="isLoading"
                        highlight-current-row
                        element-loading-text="玩命加载中..."
                >
                    <el-table-column type="selection" width="35" row-key="id"></el-table-column>
                    <el-table-column label="图片" inline-template width="80">
                        <el-popover
                                placement="right"
                                trigger="hover">
                            <img width="200px" height="200px" :src="row.thumb | filterImage">
                            <span slot="reference">
                              <img height="60px" width="60px" style="border:none" :src="row.thumb">
                        </span>
                        </el-popover>
                    </el-table-column>
                    <el-table-column label="商品名称" inline-template>
                        <span>{{row.spu_name}}</span>
                    </el-table-column>
                    <template v-for="item in goods.keys">
                        <el-table-column :label="item" :key="item" inline-template>
                            <div>
                                <ui-tip :content="row[item]" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                    </template>
                    <el-table-column label="商品编号" inline-template>
                        <ui-tip :content="row.goods_id" :width="98"></ui-tip>
                    </el-table-column>
                    <el-table-column label="SKU" inline-template>
                        <ui-tip :content="row.sku" :width="98"></ui-tip>
                    </el-table-column>
                    <el-table-column label="平均成本(元)" inline-template>
                        <ui-tip :content="fixed_price(row.cost_price)" :width="98"></ui-tip>
                    </el-table-column>
                </el-table>
                <el-pagination
                        class="fr"
                        @size-change="size_change"
                        @current-change="current_change"
                        :current-page="goods.page"
                        :page-size="goods.pageSize"
                        layout="total,prev, pager, next, jumper"
                        :total="goods.totalSize">
                </el-pagination>
            </el-col>
        </el-row>
        <div slot="footer">
            <el-button :disabled="isDisabled" size="mini" type="primary" @click.native="add">确定</el-button>
            <el-button size="mini" @click.native="cancel">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .add-goods-tree {
        max-height: 550px;
        overflow-y: auto;
    }

    .add-border {
        height: 550px;
        border: 1px solid #ddd;
    }

    .category_title {
        box-sizing: border-box;
        display: block;
        width: 100%;
        height: 30px;
        line-height: 28px;
        padding-left: 10px;
        background: #008BCE;
        border: 1px solid #008BCE;
        color: #fff;
        -moz-user-select: none;
        user-select: none;
        &:hover {
            background: rgb(51, 162, 216);
            cursor: pointer;
        }
    }
</style>
<script>
    import {api_get_categories} from "../../../../api/supplier-quote";
    import {api_get_goods} from '../../../../api/warehouse-goods-forecast.js'

    export default {
        data() {
            return {
                addGoods: false,
                treeData: [],
                goods: {
                    keys: [],
                    dataList: [],
                    page: 1,
                    pageSize: 30,
                    totalSize: 0,
                },
                searchList: [
                    {label: "产品sku", value: "sku"},
                    {label: "产品名称", value: "title"},
                    {label: "产品spu", value: "spu"},
                ],
                snType: "sku",
                snText: "",
                category_id: 0,
                isLoading: true,
                addForm: []
            }
        },
        created() {
            this.get_categories();
        },
        filters: {
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            }
        },
        mounted() {
            this.addGoods = this.value;
        },
        computed: {
            isDisabled() {
                return this.addForm.length <= 0;
            }
        },
        methods: {
            //单行点击选择
            row_click(row) {
                this.addForm = [row];
                console.log('row click', row, this.addForm);
                this.$refs.table.toggleRowSelection(row);
            },
            fixed_price(val) {
                return parseFloat(val) ? parseFloat(val).toFixed(2) : '0.00';
            },
//          table多选
            select(selection) {
                if (selection.length > 1) {
                    let index = this.goods.dataList.indexOf(this.addForm[0]);
                    this.$refs.table.clearSelection();
                    console.log('select more', selection, index, this.addForm, this.goods.dataList);
                    this.row_click(this.goods.dataList[index]);
                    setTimeout(() => {
                        console.log('select again');
                    }, 300);
                } else if (selection.length === 0) {
                    this.addForm = [];
                } else {
                    this.addForm = selection;
                }
            },
//                搜索
            search() {
                this.get_goods();
            },
//              清空
            clear() {
                this.snType = "sku";
                this.snText = "";
                this.get_goods();
            },
//              获取分类列表
            get_categories() {
                this.treeData = [];
                this.$http(api_get_categories).then(res => {
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
                            })
                            this.treeData.push(treeObj);
                        }
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
//                获取商品
            get_goods() {
                this.isLoading = true;
                let params = {
                    page: this.goods.page,
                    pageSize: this.goods.pageSize,
                    out_warehouse_id: this.warehouse,
                    is_multi_warehouse: this.is_multi_warehouse,
                };
                this.category_id && (params.category_id = this.category_id);
                if (this.snType && this.snText) {
                    params.snType = this.snType;
                    if (this.snType === 'sku' || this.snType === 'spu') {
                        let curText = this.snText.replace(new RegExp(' ', 'gm'), '\n');
                        params.snText = curText.split('\n').filter(row => !!row).map(row => row.trim()).join(',');
                    } else {
                        params.snText = this.snText.trim();
                    }
                }
                this.goods.dataList = [];
                this.$http(api_get_goods, params).then(res => {
                    this.goods.dataList = res.data;
                    this.goods.totalSize = res.count;
                    this.goods.keys = res.keys;
                    this.isLoading = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
//                点击节点
            handle_node_click(data) {
                this.category_id = data.id;
                this.get_goods();
            },
//                点击全部分类
            all() {
                this.category_id = 0;
                this.get_goods();
            },
//                分页
            size_change(size) {
                this.goods.pageSize = size;
                this.get_goods();
            },
            current_change(page) {
                this.goods.page = page;
                this.get_goods();
            },
//                保存
            add() {
                let relateData = {};
                relateData.third_sku = this.thirdSku;
                relateData.warehouse_id = this.warehouse;
                relateData.local_sku = {
                    sku_id: this.addForm[0].sku_id,
                    sku: this.addForm[0].sku,
                    goods_id: this.addForm[0].goods_id
                };
                this.$emit("relate", relateData);
            },
            cancel() {
                this.addGoods = false;
            }
        },
        watch: {
            addGoods(val) {
                this.$emit("input", val);
            },
            value(val) {
                this.addGoods = val;
                this.addForm = [];
                if (val) {
                    this.snType = "sku";
                    this.snText = "";
                    this.goods.page = 1;
                    this.goods.pageSize = 30;
                    this.category_id = 0;
                    this.get_goods()
                }
            }
        },
        props: {
            value: {},
            warehouse: {},
            is_multi_warehouse: {},
            thirdSku: {}
        },
        components: {
            pageDialog: require('../../../../components/page-dialog.vue').default,
            tree: require('../../../../components/tree.vue').default,
            uiTip: require('../../../../components/ui-tip.vue').default,
            orderInput: require('../../../../components/order-input.vue').default,
        }
    }
</script>
