<template>
    <div class="p-search-purchasing">
        <search-card @search="search_list" :params="searchParams" :clears="clears">
            <el-row>
                <label-buttons label="状态：" :buttons="buttonsData" @select="changeSelect" title="请选择生成状态"></label-buttons>
            </el-row>
            <el-row class="inline mr-sm">
                <label class="inline" title="请选择仓库">备货仓库：</label>
                <el-select v-model="searchParams.warehouse_id"
                           v-sf.warehouse_id
                           @change="change_warehouse"
                           class="inline s-width-default"
                           filterable>
                    <el-option
                            :key="item.id"
                            v-for="item in entrepot"
                            :label="item.name"
                            :value="item.id"
                    ></el-option>
                </el-select>
                <label class="inline" title="请选择仓库">中转仓：</label>
                <el-select v-model="searchParams.warehouse_id"
                           v-sf.warehouse_id
                           @change="change_warehouse"
                           class="inline s-width-default"
                           filterable>
                    <el-option
                        :key="item.id"
                        v-for="item in entrepot"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <label class="inline ml-sm" title="请选择供应商">供应商：</label>
                <supplier class="inline" v-sf.supplier_id v-model="searchParams.supplier_id" :placeHolder="true"></supplier>
                <el-select v-sf.snType v-model="searchParams.snType" class="inline ml-sm s-width-default">
                    <el-option
                        :key="item.value"
                        v-for="item in selectList"
                        :label="item.name"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <order-input v-model="searchParams.batchText"
                             class="inline width-super ma-sm"
                             v-sf.batchText
                             @keydown="search_list"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
                <label class="inline ml-sm" title="请选择货品状态">sku状态：</label>
                <el-select v-model="searchParams.sku_status"
                           v-sf.sku_status
                           class="inline s-width-default"
                           clearable
                           filterable>
                    <el-option
                        :key="item.value"
                        v-for="item in statusList"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <label class="inline ml-sm" title="请选择采购员">采购员：</label>
                <purchaser class="inline s-width-small" v-sf.purchaser_id
                           v-model="searchParams.purchaser_id"></purchaser>
            </el-row>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .p-search-purchasing{
        .el-card{
            overflow: visible;
        }
        .el-select__tags{
            height: 30px!important;
            width: 208px;
            overflow-y: auto;
            >span{
                white-space: inherit;
            }
        }
    }
</style>
<script>
    import {getWarehouseChannel,api_goods_sales_status} from '../../../api/purchasing';
    import {api_get_currency_select_list} from "../../../api/supplier-quote";
    export default{
        page:{
            devinfo:{
                frontEnd:'徐梦娇;黎宏珍',
                backEnd:'杨伟权;谭斌',
                createTime:'2017-1-12',
                updateTime:'2017-8-22'
            }
        },
        data(){
            return {
                createrList:[],
                entrepot:[],
                supplier:null,
                statusList:[],
                buttonsData:[
                    {name:"待开发处理",value:0},
                    {name:"待采购处理",value:1},
                    {name:"已生成",value:2},
                    {name:"开发驳回",value:3},
                    {name:"采购驳回",value:4}
                ],
                selectList:[
                    {name:"备货计划",value:'stock_up_plan'},
                    {name:"SKU",value:'SKU'}
                ],
                searchParams:{
                    daily_sale_start:'',
                    daily_sale_end:'',
                    purchase_price_start:'',
                    purchase_price_end:'',
                    snType:'SKU',
                    snText:'',
                    batchText:'',
                    warehouse_id:'',
                    supplier_id:"",
                    purchaser_id:'',
                    sku_status:'',
                    po_create_uid:"",
                    sort_field:'',
                    sort_type:'',
                    currency_code:''
                },
                clears:{
                    snType:'SKU',
                    purchaser_id:'',
                    sku:[],
                    daily_sale_start:'',
                    daily_sale_end:'',
                    purchase_price_start:'',
                    purchase_price_end:'',
                    snText:'',
                    batchText:'',
                    warehouse_id:'',
                    supplier_id:"",
                    sku_status:'',
                    po_create_uid:"",
                    sort_field:'',
                    sort_type:'',
                    currency_code:''
                },
                currencyList:[]
            }
        },
        created(){
            this.get_sku_status();
            this.get_currency()
        },
        mounted(){
            this.$http(getWarehouseChannel).then(res=>{
                this.entrepot=res;
                this.entrepot.unshift({name:'全部',id:''})
            }).catch(code=>{
                this.$message({type:'error',message:code.message||code});
            });
        },
        methods: {
            get_currency(){
                this.$http(api_get_currency_select_list).then(res=>{
                    this.currencyList = res.data;
                }).catch(code=>{
                    console.log(code
                    )});
            },
            get_sku_status(){
                this.$http(api_goods_sales_status).then(res=>{
                    this.statusList = res.map(row=>({
                        label: row.name,
                        value: row.id
                    }));
                }).catch(code=>{
                    console.error(code);
                });
            },
            search_list(){
            	Object.assign(this.searchData,this.searchParams);
                this.$emit('search_list');
            },
            clear_list(){
                this.$emit('clear_list');
            },
            changeSelect(select){
                this.searchData.status =this.buttonsData[select].value;
                this.$emit('search_list');
            },
            change_warehouse(){
                this.searchData.warehouse_id = this.searchParams.warehouse_id;
            }
        },
        computed: {
            changeLabel(){
            	let find = this.selectList.find(row=>{
            		return row.value === this.searchParams.snType;
                });
            	if(!!find){
            		return find.name;
                }
            }
        },
        props: {
            searchData:{
                required:true,
                type:Object
            }
        },
        components: {
            scroll:require('@/components/scroll.vue').default,
            labelButtons:require('./label-all-buttons.vue').default,
            supplier:require('@/api-components/supplier.vue').default,
            searchCard:require('@/components/search-card.vue').default,
            orderInput:require('@/components/order-input').default,
            uiLimitNumber:require('@/components/ui-limit-number').default,
            purchaser: require('@/api-components/purchaser.vue').default,
        }
    }
</script>
