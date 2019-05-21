<template>
    <div class="p-search-purchasing">
        <search-card @search="search_list" :params="searchParams" :clears="clears" @init-params="clearsData">
            <el-row>
                <label-buttons label="状态：" :buttons="buttonsData" @select="changeSelect" title="请选择生成状态"></label-buttons>
            </el-row>
            <el-row class="inline mr-sm">
                <label class="inline" title="请选择备货仓库">备货仓库：</label>
                <super-select class="inline s-width-middle"
                              v-model="searchParams.warehouse_id"
                              v-sf.warehouse_id
                              filterable clearable
                              storageKey="virtual_store_stock"
                              :options="entrepot">
                </super-select>
                <label class="ml-sm inline" title="请选择仓库">中转仓：</label>
                <el-select class="inline width-sm" v-sf.transit_warehouse_id v-model="searchParams.transit_warehouse_id"
                           placeholder="请选择">
                    <el-option
                        v-for="item in transitWarehouse"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <label class="inline ml-sm" title="请选择供应商"> 供应商：</label>
                <super-select class="inline s-width-middle"
                              v-sf.supplier_id
                              v-model="searchParams.supplier_id"
                              storageKey="virtual_supplier_packing"
                              :options="supplierList">
                </super-select>
                <el-select v-sf.snType v-model="searchParams.snType" @change="change_snType" class="inline ml-sm s-width-default">
                    <el-option
                        :key="item.value"
                        v-for="item in selectList"
                        :label="item.name"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <order-input v-if="isSKU" class="inline width-super" @keydown='search_list'  v-sf.sku
                             placeholder="可批量搜索，Shift+回车换行..."
                             v-model="sku"></order-input>
                <order-input v-else class="inline width-super" @keydown='search_list'  v-sf.code
                             placeholder="可批量搜索，Shift+回车换行..."
                             v-model="code"></order-input>
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
                <el-select v-sf.userType v-model="searchParams.userType" class="ml-sm s-width-small inline" @change="change_buyer_brand">
                    <el-option v-for="item in buyerBrand" :key="item.value" :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
                <super-select class="inline s-width-default"
                              v-model="searchParams.userText"
                              v-show="searchParams.userType==='purchaser'"
                              v-sf.userText
                              storageKey="virtual_staffs"
                              :options="staffsList">
                </super-select>
                <super-select class="inline s-width-default"
                              v-show="searchParams.userType==='developer'"
                              v-model="searchParams.userText"
                              v-sf.userText
                              storageKey="virtual_develop"
                              :options="developList">
                </super-select>
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
    import {
        api_stocking_advice_status,
        api_goods_sales_status,
        api_stock_in_out_warehouse,
        api_warehous_transit
    } from '../../../api/purchasing';
    import {api_get_currency_select_list} from "../../../api/supplier-quote";
    import {api_pack_getSupplier} from '../../../api/pack';
    import {api_get_publish} from '../../../api/procurement-plan';
    import {api_developer} from "@/api/developer-correspondence-matrix.js"


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
                supplierList: [],
                entrepot:[],
                staffsList: [],
                developList: [],
                supplier:null,
                statusList:[],
                buttonsData:[],
                buyerBrand: [
                    {label: "采购员", value: "purchaser"},
                    {label: "开发员", value: "developer"}
                ],
                selectList:[
                    {name:"备货计划",value:'stock_up_plan'},
                    {name:"SKU",value:'sku'}
                ],
                searchParams:{
                    status:4,
                    page:1,
                    pageSize:20,
                    warehouse_id:'',
                    transit_warehouse_id:'',
                    supplier_id:'',
                    snType:'stock_up_plan',
                    snText:'',
                    sku:'',
                    code:'',
                    sku_status:'',
                    userType:'purchaser',
                    userText:''
                },
                sku:'',
                code:'',
                clears:{
                    warehouse_id:'',
                    transit_warehouse_id:'',
                    supplier_id:'',
                    snType:'stock_up_plan',
                    snText:'',
                    sku:'',
                    code:'',
                    sku_status:'',
                    userType:'purchaser',
                    userText:'',
                },
                currencyList:[],
                transitWarehouse:[],
            }
        },
        created(){
            this.get_sku_status();
            this.get_currency();
            this.get_transit_warehouse();
            this.get_status();
            this.get_packing_supplier();
            this.get_packing_staffs();
            this.get_packing_develop();
        },
        mounted(){
            this.$http(api_stock_in_out_warehouse,{sign:'fba_third'}).then(res=>{
                this.entrepot = [{label: '全部', value: ''}, ...res.map(row => {
                    return {
                        label: row.name,
                        value: row.id
                    }
                })];
            }).catch(code=>{
                this.$message({type:'error',message:code.message||code});
            });
        },
        methods: {
            get_packing_develop() {//开发人
                this.$http(api_developer).then(res=>{
                    this.developList = res.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            get_packing_staffs() {//采购员
                this.$http(api_get_publish).then(res=>{
                    this.staffsList = res.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            get_packing_supplier() {//供应商
                this.$http(api_pack_getSupplier).then(res=>{
                    this.supplierList = [{label: '全部', value: ''}, ...res.map(row => {
                        return {
                            label: row.company_name,
                            value: row.id
                        }
                    })];
                }).catch(code => {
                    console.log(code);
                })
            },
            get_currency(){
                this.$http(api_get_currency_select_list).then(res=>{
                    this.currencyList = res.data;
                }).catch(code=>{
                    console.log(code
                    )});
            },
            change_snType(val){
                if (val==="sku"){
                    this.code='';
                    this.searchParams.code ='';
                }else{
                    this.sku = '';
                    this.searchParams.sku = '';
                }
            },
            get_status(){
                this.$http(api_stocking_advice_status).then(res=>{
                    this.buttonsData=res.map(row=>{  //重新处理状态的值
                        if(row.value===10){
                            row.value=6
                        }
                        if (row.value===0){
                            row.value=13
                        }
                        return row
                    })
                }).catch(code=>{
                    console.error(code);
                });
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
            // 中转仓
            get_transit_warehouse() {
                this.$http(api_warehous_transit).then(res => {
                    this.transitWarehouse = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    this.transitWarehouse = [{label: "全部", value: ""}, ...this.transitWarehouse];
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            development_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },
            change_buyer_brand(){
                //切换采购员/开发员
                this.searchParams.userText = '';
            },
            search_list(){
                this.searchParams.status=this.searchData.status;
                this.searchParams.pageSize=this.searchData.pageSize;
            	Object.assign(this.searchData,this.searchParams);
                this.$emit('search_list');
            },
            clear_list(){
                this.$emit('clear_list');
            },
            changeSelect(select){
                this.searchData.status =this.buttonsData[select].value;
                this.searchParams.status =this.buttonsData[select].value;
                this.$emit('search_list')
            },
            change_warehouse(){
                this.searchData.warehouse_id = this.searchParams.warehouse_id;
            },
            clearsData(){
                this.sku='';
                this.code='';
            },
        },
        watch:{
            sku(val){
                if (val) {
                    let data = val.split("\n");
                    this.searchParams.sku = data
                }else{
                    this.searchParams.sku=''
                }
            },
            code(val){
                if (val){
                    let data=val.split("\n");
                    this.searchParams.code =data
                }else{
                    this.searchParams.code=''
                }
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
            },
            isSKU(){
                return this.searchParams.snType==='sku'
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
            paramAccount: require('@/api-components/param-account.vue').default,
            labelButtons:require('./label-all-buttons.vue').default,
            supplier:require('@/api-components/supplier.vue').default,
            searchCard:require('@/components/search-card.vue').default,
            orderInput:require('@/components/order-input').default,
            uiLimitNumber:require('@/components/ui-limit-number').default,
            purchaser: require('@/api-components/purchaser.vue').default,
        }
    }
</script>
