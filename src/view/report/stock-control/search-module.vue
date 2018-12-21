<template>
    <div class="c-search-time">
        <search-card :params="searchData" @search="search" ref="search_card" :clears="clears" @click.native="resetChange" @init-params="initData">
            <div class="mb-mini">
                <label-item label="仓库：" label-width="60" text-align="right">
                    <el-select v-model="searchData.warehouse_id"
                               filterable clearable
                               v-sf.warehouse_id
                               class="width-xs inline">
                        <el-option v-for="item in warehouse_list"
                                   :value="item.value"
                                   :key="item.value"
                                   :label="item.label">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="货品：" class="ml-sm">
                    <div class="inline list-position">
                        <span v-for="(item, index) in searchData.goods_list">
                            <span v-if="index < 2">
                                <span>{{item.spu_name}}</span>
                                <span v-if="index < 1 && searchData.goods_list.length > 1">,</span>
                            </span>
                        </span>
                        <span v-if="searchData.goods_list.length >= 2">
                                ...
                        </span>
                        <div class="list-child">
                            <span class="child-name" v-for="item in searchData.goods_list">
                                <span>{{item.spu_name}}</span>
                            </span>
                        </div>
                    </div>
                    <span class="operate ml-sm" @click="select_goods">选择货品</span>
                    <span class="operate ml-mini" @click="clear_goods">清空货品</span>
                </label-item>
            </div>
            <label-item label="商品分类：" label-width="60" text-align="right" class="mr-sm">
                <el-cascader :options="options"
                             v-model="searchData.category_id"
                             class="width-xs"
                             v-sf.category_id
                             placeholder="可以输入搜索"
                             size="small"
                             filterable
                             change-on-select
                             expand-trigger="hover">
                </el-cascader>
            </label-item>
            <!--<label-item label="币种：" class="ml-sm mr-sm">-->
                <!--<el-select v-model="searchData.currency"-->
                           <!--placeholder="请选择币种"-->
                           <!--v-sf.currency-->
                           <!--filterable-->
                           <!--clearable-->
                           <!--class="width-sm">-->
                    <!--<el-option v-for="item in currency_list"-->
                               <!--:key="item.code"-->
                               <!--:label="item.code"-->
                               <!--:value="item.code">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            <!--</label-item>-->
        </search-card>
        <add-goods v-model="goodsDialog" @add-goods="goods_submit"></add-goods>
    </div>
</template>
<style lang="stylus" scoped>
    .list-position{
        position :relative;
        cursor:default
        .list-child{
            padding :3px 4px;
            position :absolute;
            background :#fff;
            border :1px solid #c6c6c6;
            border-radius:3px;
            z-index :55;
            display :none;
            height :300px;
            overflow:auto
            .child-name{
                display :flex;
                flex-direction :column;
                align-items :stretch;
                word-break: keep-all;
                white-space:nowrap;
            }
        }
    }
    .list-position:hover .list-child{
        display :block;
    }
    .c-search-time{
        .el-card{
            overflow: inherit;
        }
    }
</style>
<script>
    import {api_warehouse_get, api_get_currency, api_get_categories} from '../../../api/stock-control'
    export default {
        data(){
            return {
                warehouse_list:[],
                // currency_list:[],
                searchData:{
                    warehouse_id:'',
                    // currency:'CNY',
                    sku_ids:[],
                    category_id:[""],
                    page:1,
                    pageSize:20,
                    goods_list:[]
                },
                clears:{
                    warehouse_id:'',
                    // currency:'CNY',
                    sku_ids:[],
                    category_id:[""],
                    page:1,
                    pageSize:20,
                    goods_list:[]
                },
                oldData:{},
                options: [],
                goodsDialog:false,

            }
        },
        mounted(){
            this.warehouse_init();
            // this.currency_init();
            this.categories_init();
            // this.init();
        },
        methods: {
            init(){
                this.$emit('init-data', this.searchData);
            },
            warehouse_init(){
                this.$http(api_warehouse_get).then(res=>{
                    this.warehouse_list = [{label:'全部',value:''},...res];
                }).catch(code=>{
                    this.warehouse_list = [{label:'全部',value:''}];
                    console.log(code);
                })
            },
            // currency_init(){
            //     this.$http(api_get_currency).then(res=>{
            //         this.currency_list = res;
            //     }).catch(code => {
            //         this.$message({type:"error",message:code.message || code});
            //     });
            // },
            categories_init(){
                this.$http(api_get_categories).then(res=>{
                    this.options = res.map(row=>{
                        return {
                            value:row.id,
                            label:row.title,
                            children:row.childs.map(ch=>{
                                return {
                                    value:ch.id,
                                    label:ch.title,
                                }
                            })
                        }
                    });
                    let cur = {label:"全部",value:""};
                    this.options.unshift(cur);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            select_goods(){
                this.goodsDialog = true;
            },
            clear_goods(){
                if(this.searchData.sku_ids.length>0){
                    this.oldData = clone(this.searchData);
                    this.searchData.sku_ids = [];
                    this.searchData.goods_list = [];
                    this.search();
                }
            },
            //子组件添加商品传过来的
            goods_submit(val){
                this.searchData.goods_list = val;
                this.searchData.sku_ids = this.searchData.goods_list.map(row=>{
                    return row.sku_id;
                });
                this.search();
            },
            search(){
                this.init();
            },
            initData(){
                this.oldData = clone(this.searchData);
                this.searchData.goods_list=[];
                this.init();
            },
            resetChange(e){
                console.log(e.target.innerHTML);
                if(e.target.innerHTML=='还原修改'){
                    console.log(this.oldData);
                    this.searchData = clone(this.oldData);
                    this.$refs.search_card.resetChange(this.oldData);
                }
                console.log('resetChange',this.$refs.search_card.resetChange);
            }
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            labelItem:require('../../../components/label-item.vue').default,
            addGoods:require('../../../api-components/add-goods.vue').default,
            searchCard:require('../../../components/search-card.vue').default
        },
    }
</script>
