<template>
    <page-dialog title="选择指定商品"
                 v-model="addGoods"
                 size="full"
                 @open="open"
                 :close-on-click-modal="false">
        <el-row>
            <el-select v-model="snType"
                       class="inline width-xs">
                <el-option :key="item.value"
                           v-for="item in searchList"
                           :value="item.value"
                           :label="item.label">
                </el-option>
            </el-select>
            <order-input v-if="snType==='sku'" v-model="snText" class="inline width-super"
                         @keydown="search"></order-input>
            <el-input v-else class="inline width-super" placeholder="请搜索..." v-model="snText"
                      @keydown.native="search"></el-input>
            <label-item label="供应商：" class="inline ml-sm">
                <supplier v-model="supplier_id"></supplier>
            </label-item>
            <el-button class="inline ml-sm"
                       type="primary"
                       size="mini"
                       @click.native="search">搜索
            </el-button>
            <el-button class="inline ml-sm"
                       size="mini"
                       @click.native="clear">清空
            </el-button>
        </el-row>
        <el-row :gutter="8" class="mt-xs">
            <el-col :span="3">
                <label class="category_title" @click="all">全部分类</label>
                <div class="add-border">
                    <tree :tree="treeData"
                          @node-click="handle_node_click"
                          class="add-goods-tree">
                    </tree>
                </div>
            </el-col>
            <el-col :span="21">
                <el-table
                        ref="table"
                        border
                        :data="goods.dataList"
                        v-loading="isLoading"
                        height="548"
                        @selection-change="select_one"
                        highlight-current-row
                        element-loading-text="玩命加载中...">
                    <el-table-column
                            type="selection"
                            width="35"
                            row-key="id"
                            :selectable="selectable">
                    </el-table-column>
                    <el-table-column
                            label="商品名称"
                            inline-template>
                        <div>
                            {{row.spu_name}}
                        </div>
                    </el-table-column>
                    <template v-for="item in goods.keys">
                        <el-table-column :label="item" :key="item" inline-template>
                            <div>
                                <ui-tip :content="row[item]" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                    </template>
                    <el-table-column
                            label="商品编号"
                            width="120"
                            inline-template>
                        <div>
                            <ui-tip :content="row.goods_id" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="SKU"
                            width="120"
                            inline-template>
                        <div>
                            <ui-tip :content="row.sku" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column label="平均成本(元)" width="120" prop="cost_price"></el-table-column>
                    <el-table-column label="是否已报价" width="120" inline-template>
                        <div>{{row.is_have_price | filterPrice}}</div>
                    </el-table-column>
                    <el-table-column label="操作" inline-template>
                        <div>
                            <span class="operate" v-if="row.is_have_price" @click="check_price(row)">查看报价</span>
                            <span v-else>查看报价</span>
                        </div>
                    </el-table-column>
                </el-table>
                <el-pagination
                        class="fr br"
                        @size-change="size_change"
                        @current-change="current_change"
                        :current-page="goods.page"
                        :page-sizes="[20, 50, 100, 200,500]"
                        :page-size="goods.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="goods.totalSize">
                </el-pagination>
            </el-col>
        </el-row>
        <add-supplier v-model="lookPrice" :supplier-data="supplierData"></add-supplier>
        <div slot="footer">
            <request-button :disabled="isDisabled" :mintime="200" :timeout="5000" req-key="add_goods" @click="add">确定
            </request-button>
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
        &:hover {
            background: rgb(51, 162, 216);
            cursor: pointer;
        }
    }

    .br {
        position: absolute;
        bottom: 0;
        right: 0;
    }
</style>
<script>
    import tree from "../../../components/tree.vue";
    import pageDialog from '../../../components/page-dialog.vue';
    import {api_get_categories, api_add_goods} from "../../../api/supplier-quote";
    import {api_getSupplier} from '../../../api/purchase';

    export default {
        page: {
            devinfo: {
                frontEnd: '王月如;黎宏珍',
                backEnd: '谭斌',
                createTime: '2017-1-14',
                updateTime: '2017-8-22'
            }
        },
        data() {
            return {
                supplierData: [],
                addGoods: false,
                lookPrice: false,
                treeData: [],
                goods: {
                    keys: [],
                    dataList: [],
                    page: 1,
                    pageSize: 20,
                    totalSize: 0,
                },
                searchList: [
                    {label: "产品sku", value: "sku"},
                    {label: "产品名称", value: "title"},
                    {label: "产品spu", value: "spu"},
                ],
                snType: "sku",
                category_id: 0,
                isLoading: true,
                addForm: [],
                snText: "",
                supplier_id: '',
            }
        },
        created() {
            this.get_categories();
        },
        mounted() {
            this.addGoods = this.value;
        },
        filters: {
            filterPrice(val) {
                return val ? "是" : "否"
            }
        },
        methods: {
            open() {
                this.get_goods();
                this.addForm = [];
            },
            //全选时
            selectable(row, index) {
                return row.is_have_price;
            },
//                table翻页多选
            //初始化设置对应关系
            refresh_rows() {
                this.$nextTick(() => {
                    this.goods.dataList.forEach(row => {
                        let selected = !!this.addForm.find(obj => obj.id === row.id);
                        this.$refs.table.toggleRowSelection(row, selected)
                    });
                })
            },
//             查看报价
            check_price(row) {
                this.lookPrice = true;
                this.$nextTick(() => {
                    this.$http(api_getSupplier, {sku_id: row.sku_id}).then(res => {
                        if (res.message) {
                            this.supplierData = res.message;
                            console.log(this.supplierData)
                        } else {
                            this.supplierData = [];
                        }
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                })
            },
//             勾选一行数据
            select_one(row) {
                let curIndex = -1;
                if (row) {
                    this.addForm = [row];
                } else {
                    curIndex = this.addForm.findIndex(obj => {
                        return obj.id === row.id
                    });
                    if (curIndex !== -1) this.addForm.splice(curIndex, 1);
                }
            },
            //勾选全部数据
            select_all(selection) {
                let tampArr = [];
                this.addForm.forEach(id => {
                    tampArr.push(id.id)
                });
                if (selection.length > 0) {
                    selection.forEach(item => {
                        if (tampArr.indexOf(item.id) === -1) {
                            this.addForm.push(item)
                        }
                    })
                } else {
                    this.goods.dataList.forEach(row => {
                        this.addForm.forEach((data, index) => {
                            if (row.id === data.id) {
                                this.addForm.splice(index, 1);
                            }
                        })
                    })
                }
            },
//---------------------table 多选end
//                搜索
            search() {
                this.get_goods();
            },
//              清空
            clear() {
                this.snType = 'sku';
                this.snText = '';
                this.get_goods();
            },
//              获取分类列表
            get_categories() {
                this.treeData = [];
                this.$http(api_get_categories).then(res => {
                    for (var i in res) {
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
                            this.treeData.push(treeObj);
                        }
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
//                获取商品
            get_goods() {
                this.isLoading = true;
                let params = {
                    page: this.goods.page,
                    pageSize: this.goods.pageSize,
                    is_display_price: 1,
                    supplier_id: this.supplier_id,
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
                this.$http(api_add_goods, params).then(res => {
                    this.goods.dataList = res.data;
                    this.goods.keys = res.keys;
                    this.goods.dataList.forEach((row) => {
                        this.$set(row, 'select', false);
                    });
                    this.refresh_rows();
                    this.goods.totalSize = res.count;
                    this.isLoading = false;
                }).catch(code => {
                    console.log(code);
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
                this.addGoods = false;
                this.snText = "";
                this.$emit('selected', this.addForm);
                setTimeout(() => {
                    this.$reqKey('add_goods', false);
                }, 3000);
            },
            cancel() {
                this.addGoods = false;
                this.snText = "";
            },
//                处理数据扁平化
            polyType(data) {
                if (data.condition instanceof Array) {
                    return true
                } else {
                    return false
                }
            },
        },
        computed: {
            isDisabled() {
                return this.addForm.length <= 0;
            }
        },
        watch: {
            addGoods(val) {
                this.$emit("input", val);
            },
            value(val) {
                this.addGoods = val;
            }
        },
        props: {
            value: {},
        },
        components: {
            pageDialog,
            tree,
            addSupplier: require('../add-supplier-look.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            orderInput: require('@/components/order-input.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            supplier: require('@/api-components/supplier.vue').default,
        }
    }
</script>
