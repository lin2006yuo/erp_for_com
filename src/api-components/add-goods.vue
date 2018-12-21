<template>
    <page-dialog :title="$t('ymx-list.designated')" @open="open" v-model="addGoods" size="full" :close-on-click-modal="false">
        <div>
            <el-select v-model="snType" ref="search" v-mouse-side.mousewheel="()=>{$refs.search.visible=false}"
                       class="inline width-xs">
                <el-option v-for="(item,i) in searchList" :value="item.value" :key="i"
                           :label="item.label"></el-option>
            </el-select>
            <order-input v-if="snType==='sku'||snType==='spu'"
                         class="inline width-super" v-model="snText" @keydown="search"></order-input>
            <el-input class="inline width-super" v-else
                      :placeholder="$t('ymx-detail.psearch')"
                      v-model="snText" @keydown.native="search"></el-input>
            <el-button class="inline ml-sm" type="primary" size="mini" @click.native="search">{{$t('ymx-detail.search')}}</el-button>
            <el-button class="inline ml-sm" size="mini" @click.native="clear">{{$t('ymx-detail.empty')}}</el-button>
        </div>
        <el-row :gutter="8" class="mt-xs">
            <el-col :span="3">
                <label class="category_title" @click="all">{{$t('ymx-list.allCate')}}</label>
                <div class="add-border">
                    <tree :tree="treeData" @node-click="handle_node_click" class="add-goods-tree"></tree>
                </div>
            </el-col>
            <el-col :span="21">
                <el-table
                    @selection-change="select"
                    border
                    height="550"
                    :data="goods.dataList"
                    v-loading="isLoading"
                    highlight-current-row
                    ref="table"
                    @row-click="row_click"
                    :element-loading-text="$t('ymx-list.playLoad')"
                >
                    <el-table-column type="selection" width="35" row-key="id"></el-table-column>
                    <el-table-column :label="$t('ymx-detail.image')" inline-template width="80">
                        <el-popover
                            placement="right"
                            trigger="hover">
                            <img width="200px" height="200px" :src="row.thumb | filterImage ">
                            <span slot="reference">
                              <img height="60px" width="60px" style="border:none" :src="row.thumb">
                        </span>
                        </el-popover>
                    </el-table-column>
                    <el-table-column :label="$t('ymx-detail.goodsName')" inline-template>
                        <ui-tip :content="row.spu_name" :width="98"></ui-tip>
                    </el-table-column>
                    <template v-for="(item,i) in goods.keys">
                        <el-table-column :label="item" :key="i" inline-template>
                            <div>
                                <ui-tip :content="row[item]" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                    </template>
                    <el-table-column :label="$t('ymx-detail.ID')" inline-template>
                        <ui-tip :content="row.goods_id" :width="98"></ui-tip>
                    </el-table-column>
                    <el-table-column label="SKU" inline-template>
                        <ui-tip :content="row.sku" :width="98"></ui-tip>
                    </el-table-column>
                    <el-table-column :label="$t('ymx-detail.aveCost')" inline-template>
                        <ui-tip :content="fixed_price(row.cost_price)" :width="98"></ui-tip>
                    </el-table-column>
                    <el-table-column :label="$t('ymx-detail.proStatus')" inline-template>
                        <ui-tip :content="row.status_txt" :width="98"></ui-tip>
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
            <el-button :disabled="isDisabled" size="mini" type="primary" @click.native="add">{{$t('ymx-detail.confirm')}}</el-button>
            <el-button size="mini" @click.native="cancel">{{$t('ymx-detail.cancel')}}</el-button>
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
    import tree from "../components/tree.vue";
    import pageDialog from '../components/page-dialog.vue';
    import {api_get_categories, api_add_goods} from "../api/supplier-quote";

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
                    {label: this.$t('ymx-detail.proSku'), value: "sku"},
                    {label: this.$t('ymx-detail.proName'), value: "title"},
                    {label: this.$t('ymx-detail.proSpu'), value: "spu"},
                ],
                snType: "sku",
                snText: "",
                category_id: 0,
                isLoading: true,
                addForm: []
            }
        },
        created() {

        },
        filters:{
            filterImage(val){
                return val.replace("_60x60","_200x200");
            },
        },
        mounted() {
            this.addGoods = this.value;
        },
        computed: {
            isDisabled() {
                return this.addForm.length <= 0 ? true : false;
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
        methods: {
            open() {
                this.get_categories();
                this.addForm = [];
                this.snType = "sku";
                this.snText = "";
                this.goods.page = 1;
                this.goods.pageSize = 30;
                this.category_id = 0;
                this.get_goods();
            },
            //单行点击选择
            row_click(row, event, col) {
                this.$refs.table.toggleRowSelection(row);
            },
            fixed_price(val) {
                return parseFloat(val) ? parseFloat(val).toFixed(2) : '0.00';
            },
//          table多选
            select(selection, currow) {
                selection.map(row => {
                    this.$set(row, "selectable", true)
                });
                this.addForm = selection;
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
                };
                this.category_id && (params.category_id = this.category_id);
                if (this.snType && this.snText) {
                    params.snType = this.snType;
                    if(this.snType==='sku'||this.snType==='spu'){
                        let curText = this.snText.replace(new RegExp(' ','gm'),'\n');
                        params.snText = curText.split('\n').filter(row=>!!row).map(row=>row.trim()).join(',');
                    }else{
                        params.snText = this.snText.trim();
                    }
                }
                this.goods.dataList = [];
                return this.$http(api_add_goods, params).then(res => {
                    this.goods.dataList = res.data;
                    this.goods.totalSize = res.count;
                    this.goods.keys = res.keys;
                    this.isLoading = false;
                    return Promise.resolve();
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
                this.$emit("add-goods", this.addForm, this.goods);
            },
            cancel() {
                this.addGoods = false;
            }
        },
        props: {
            value: {}
        },
        components: {
            pageDialog,
            tree,
            uiTip: require('../components/ui-tip.vue').default,
            orderInput: require('../components/order-input.vue').default,

        }
    }
</script>
