<template>
    <div class="c-search-time">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <div class="mb-mini">
                <label-item label="仓库：" label-width="60" text-align="right">
                    <el-select v-model="searchData.warehouse_id"
                               filterable
                               clearable
                               class="s-width-default inline"
                               v-sf.warehouse_id>
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
            <label-item label="付款日期：" label-width="60" text-align="right">
                <el-date-picker
                        v-model="searchData.date_b"
                        v-sf.date_b
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.date_e"
                        v-sf.date_e
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
            <label-item label="币种：" class="ml-sm">
                <el-select v-model="searchData.currency_code"
                           v-sf.currency_code
                           placeholder="请选择币种"
                           filterable
                           clearable
                           class="width-sm mr-sm">
                    <el-option v-for="item in currency_list"
                               :key="item.code"
                               :label="item.code"
                               :value="item.code">
                    </el-option>
                </el-select>
            </label-item>
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
        overflow :auto;
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
    import {api_warehouse_get, api_get_currency} from '../../../api/stock-control'
    export default {
        data(){
            return {
                warehouse_list:[],
                currency_list:[],
                searchData:{
                    warehouse_id:'',
                    currency_code:'CNY',
                    sku_ids:[],
                    goods_list:[],
                    date_b:'',
                    date_e:'',
                    page:1,
                    pageSize:20
                },
                clears:{
                    warehouse_id:'',
                    currency_code:'CNY',
                    sku_ids:[],
                    goods_list:[],
                    date_b:'',
                    date_e:'',
                    page:1,
                    pageSize:20
                },
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_e){
                            return time.getTime() > this.searchData.date_e;
                        }else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_b){
                            return time.getTime() < this.searchData.date_b;
                        }else {
                            return false
                        }
                    }
                },//结束时间
                goodsDialog:false,
            }
        },
        mounted(){
            this.warehouse_init();
            this.currency_init();
            // this.init();
        },
        methods: {
            init(){
                this.$emit('init-data', this.searchData);
            },
            warehouse_init(){
                this.$http(api_warehouse_get).then(res=>{
                    this.warehouse_list = [{label:'全部',value:''}, ...res];
                }).catch(code=>{
                    this.warehouse_list = [{label:'全部',value:''}];
                    console.log(code);
                })
            },
            currency_init(){
                this.$http(api_get_currency).then(res=>{
                    this.currency_list = res;
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                });
            },
            select_goods(){
                this.goodsDialog = true;
            },
            clear_goods(){
                this.searchData.goods_list = [];
                this.searchData.sku_ids = [];
            },
            //子组件添加商品传过来的
            goods_submit(val){
                this.searchData.goods_list = val;
                this.searchData.sku_ids = this.searchData.goods_list.map(row=>{
                    return row.sku_id;
                });
            },
            search(){
                this.init();
            },
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
