<template>
    <div class="p-search-purchasing">
        <search-card @search="search_list" :params="searchParams" :clears="clears">
            <el-row>
                <label-buttons label="生成采购计划状态：" :buttons="buttonsData" @select="changeSelect" title="请选择生成状态"></label-buttons>
            </el-row>
            <div>
                <label class="inline" title="请选择仓库">仓库：</label>
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
                        v-for="item in selectList1"
                        :label="item.name"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <order-input v-if="isSKU" v-model="searchParams.batchText"
                             class="inline width-super ma-sm"
                             v-sf.snText
                             @keydown="search_list"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
                <el-input v-else v-model="searchParams.snText"
                          v-sf.snText
                          @keyup.enter.native="search_list"
                          :placeholder="`请输入${changeLabel}...`"
                          class="inline enter-result"
                          style="width:200px"></el-input>
                <label class="inline ml-sm" title="请选择货品状态">sku状态：</label>
                <el-select class="inline" v-sf.status
                           :class="[searchParams.sku_status.length > 0 ? input_nomargin : '']"
                           v-model="searchParams.sku_status" multiple filterable @change="change_status"
                           style="width:14%;" placeholder="请选择">
                    <el-option
                            :key="item.value"
                            v-for="item in status"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
                <label class="inline ml-sm" title="请选择采购员">采购员：</label>
                <el-select class="inline" v-sf.purchaser_id
                           :class="[searchParams.purchaser_id.length > 0 ? input_nomargin : '']"
                           :value="searchParams.purchaser_id" multiple filterable @change="change_buyer"
                           @remove-tag="remove_tag" style="width:14%;" placeholder="请选择">
                    <el-option
                            v-for="item in buyer"
                            :key="item.id"
                            @click.native="purchaser_click(item)"
                            :label="item.realname"
                            :disabled="item.disabled"
                            :value="item.id">{{item.realname}}&nbsp&nbsp<div class="inline" style="color: red;float: right;margin-right: 35px;">{{item|filterTime}}</div>
                    </el-option>
                </el-select>
            </div>
            <div class="mt-mini inline">
                <label class="inline" title="请输入日均销量区间">日均销量：</label>
                <el-input
                    type="number"
                    v-sf.daily_sale_start
                    v-model="searchParams.daily_sale_start"
                    placeholder="销量最小值"
                    @keyup.enter.native="search_list"
                    min="0"
                    @change="sale_start_change"
                    class="inline enter-result s-width-small"></el-input>&nbsp;--
                <el-input
                    type="number"
                    v-sf.daily_sale_end
                    placeholder="销量最大值"
                    v-model="searchParams.daily_sale_end"
                    @keyup.enter.native="search_list"
                    min="0"
                    @change="sale_end_change"
                    class="inline enter-result s-width-small"></el-input>
                <label class="inline ml-sm" title="请输入采购价格区间">采购价格：</label>
                <ui-limit-number
                    v-sf.purchase_price_start
                    v-model="searchParams.purchase_price_start"
                    placeholder="价格最小值"
                    @keyup.enter.native="search_list"
                    :limit="3"
                    :min="0"
                    class="inline enter-result s-width-small"></ui-limit-number>&nbsp;--
                <ui-limit-number
                    v-sf.purchase_price_end
                    v-model="searchParams.purchase_price_end"
                    placeholder="价格最大值"
                    @keyup.enter.native="search_list"
                    :limit="3"
                    :min="searchParams.purchase_price_start"
                    class="inline enter-result s-width-small"></ui-limit-number>
                <label class="ml-sm">币种：</label>
                <el-select class="inline s-width-small" v-sf.currency_code v-model="searchParams.currency_code">
                    <el-option
                        v-for="cur in currencyList"
                        :key="cur.id"
                        :value="cur.code"
                        :label="cur.code">
                    </el-option>
                </el-select>
                <label class="inline ml-sm" title="请输入缺货区间">缺货数量：</label>
                <ui-limit-number
                    v-sf.due_quantity_start
                    v-model="searchParams.due_quantity_start"
                    placeholder="缺货最小值"
                    @keyup.enter.native="search_list"
                    :limit="0"
                    :min="0"
                    class="inline enter-result s-width-small"></ui-limit-number>&nbsp;--
                <ui-limit-number
                    v-sf.due_quantity_end
                    v-model="searchParams.due_quantity_end"
                    placeholder="缺货最大值"
                    @keyup.enter.native="search_list"
                    :limit="0"
                    :min="searchParams.due_quantity_start||0"
                    class="inline enter-result s-width-small mr-sm"></ui-limit-number>
            </div>
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
    .input-nomargin {
        .el-select__input {
            width: 1px !important;
            margin-left: 0 !important;
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
                status:[],
                buttonsData:[
                    {name:"未生成",value:0},
                    {name:"已生成",value:1}
                ],
                selectList1:[
                    {name:"SKU",value:'SKU'},
                    {name:"SPU",value:'spu'}
                ],
                input_nomargin: "input-nomargin",
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
                    purchaser_id:[],
                    sku_status:[],
                    po_create_uid:"",
                    sort_field:'',
                    sort_type:'',
                    currency_code:'',
                    due_quantity_start:'',
                    due_quantity_end:''
                },
                clears:{
                    daily_sale_start:'',
                    daily_sale_end:'',
                    purchase_price_start:'',
                    purchase_price_end:'',
                    snType:'SKU',
                    snText:'',
                    batchText:'',
                    warehouse_id:'',
                    supplier_id:"",
                    purchaser_id:[],
                    sku_status:[],
                    po_create_uid:"",
                    sort_field:'',
                    sort_type:'',
                    currency_code:'',
                    due_quantity_start:'',
                    due_quantity_end:''
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
                    res.forEach(row=>{
                        let item = {};
                        item.label = row.name;
                        item.value = row.id;
                        this.status.push(item);
                    });
                }).catch(code=>{
                    console.error(code);
                });
            },
            init_status_btn(){
                let curBtn = this.buttonsData;
                this.buttonsData = [];
                this.$nextTick(()=>{
                    this.buttonsData = curBtn;
                });
            },
            fix_params({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    content:keyword,
                };
            },
            change_buyer(){
                this.$emit("change-buyer");
            },
            purchaser_click(item){
                if(item.id===''&&!item.isCheckAll){
                    item.isCheckAll = true;
                    item.realname = '清空选择';
                    this.searchParams.purchaser_id = this.buyer.filter(row=>row.id!=='').map(row=>row.id);
                }else if(item.id===''&&item.isCheckAll){
                    item.isCheckAll = false;
                    item.realname = '选择全部';
                    this.searchParams.purchaser_id = [];
                }else{
                    let index = this.searchParams.purchaser_id.findIndex(row=>row===item.id);
                    if(index>=0){
                        this.searchParams.purchaser_id.splice(index,1);
                    }else{
                        this.searchParams.purchaser_id.push(item.id);
                    }
                }
            },
            remove_tag(item) {
                let index = this.searchParams.purchaser_id.findIndex(row => row === item.value);
                if (index >= 0) {
                    this.searchParams.purchaser_id.splice(index, 1);
                }

            },
            change_status(val){
                this.$emit("change_status");
            },
            search_list(){
            	Object.assign(this.searchData,this.searchParams);
                this.$emit('search_list');
            },
            clear_list(){
                this.$emit('clear_list');
            },
            changeSelect(select){
                this.searchData.created_plan_status =this.buttonsData[select].value;
                this.$emit('search_list');
            },
            change_warehouse(){
                this.searchData.warehouse_id = this.searchParams.warehouse_id;
            },
            sale_start_change(val){
                if(this.searchParams.daily_sale_start<0){
                    this.searchParams.daily_sale_start = -val;
                }
            },
            sale_end_change(val){
                if(this.searchParams.daily_sale_start===''){
                    if(this.searchParams.daily_sale_end<0){
                        this.searchParams.daily_sale_end = -val;
                    }
                }else{
                    if(this.searchParams.daily_sale_end<this.searchParams.daily_sale_start){
                        this.searchParams.daily_sale_end = this.searchParams.daily_sale_start;
                    }
                }
            },
        },
        filters:{
            filterTime(item){
                if(item.realname==='选择全部'||item.realname==='清空选择'){
                    return '';
                }else{
                    return `${item.time?datef("YYYY-MM-dd HH:mm:ss", item.time):''}`
                }
            }
        },
        watch: {
        	'searchParams.purchaser_id'(val){
        	    if(val.length===this.buyer.length-1){
        	        let find = this.buyer.find(row=>row.id==='');
        	        if(!!find){
        	            find.isCheckAll = true;
        	            find.realname = '清空选择';
                    }
                }else{
                    let find = this.buyer.find(row=>row.id==='');
                    if(!!find){
                        find.isCheckAll = false;
                        find.realname = '选择全部';
                    }
                }
        		if(val){
        			this.searchData.purchaser_id = val;
                }
            },
            'searchParams.snType'(now,old) {
        	    if(now==='spu'){
                    this.searchParams.snText = this.searchParams.batchText;
                }else if(old==='spu'){
                    this.searchParams.batchText = this.searchParams.snText;
                }
            },
            'searchParams.daily_sale_start'(val){

            }
        },
        computed: {
            changeLabel(){
            	let find = this.selectList1.find(row=>{
            		return row.value === this.searchParams.snType;
                });
            	if(!!find){
            		return find.name;
                }
            },
            isSKU(){
                return this.searchParams.snType.toUpperCase()==='SKU'
            }
        },
        props: {
            searchData:{
                required:true,
                type:Object
            },
            buyer:{
                required:true,
                type:Array
            },
        },
        components: {
            scroll:require('../../../components/scroll.vue').default,
            labelButtons:require('./label-all-buttons.vue').default,
            supplier:require('../../../api-components/supplier.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            orderInput:require('../../../components/order-input').default,
            uiLimitNumber:require('../../../components/ui-limit-number').default
        }
    }
</script>
