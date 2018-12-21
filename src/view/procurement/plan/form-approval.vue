<template>
    <page-dialog size="full" v-model="show" @open="open" title="采购计划审核" class="p-form-approval" @change="change_dialog" :close-on-click-modal="false" width="90%" left="10%">
        <label-item label="供应商：" class="ml-lg">
            <el-select v-model="supplier"
                       ref="supplier"
                       v-mouse-side.mousewheel="()=>{$refs.supplier.visible=false}">
                <el-option :key="supplier.value" v-for="supplier in supplierLists"
                           :label="supplier.label"
                           :value="supplier.value"></el-option>
            </el-select>
        </label-item>
        <label-item label="采购仓库：" class="ml-lg">
            <el-select v-model="warehouse_id"
                       ref="warehouse_id"
                       v-mouse-side.mousewheel="()=>{$refs.warehouse_id.visible=false}">
                <el-option :key="warehouse.value" v-for="warehouse in warehousesLists"
                           :label="warehouse.label"
                           :value="warehouse.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="采购员：" class="ml-lg">
            <el-select v-model="purchase"
                       ref="purchase"
                       v-mouse-side.mousewheel="()=>{$refs.purchase.visible=false}">
                <el-option :key="purchase.value" v-for="purchase in purchaseLists"
                           :label="purchase.label"
                           :value="purchase.value"></el-option>
            </el-select>
        </label-item>
        <div style="margin-top:5px">
            <el-table :data="filterGoodsLists"
                      @selection-change="(sels)=>{goodsListSelect=sels;}"
                      :max-height="495"
                      v-loading="loading"
                      element-loading-text="玩命加载中..."
                      style="min-height: 225px;">
                <el-table-column label="图片" inline-template>
                    <div>
                        <el-popover
                            placement="right"
                            width="200"
                            trigger="hover">
                            <img v-lazy="sku_image(row.thumb)" width="200" height="200">
                            <span slot="reference">
                      <img v-lazy="row.thumb" width="60" height="60">
                   </span>
                        </el-popover>
                    </div>
                </el-table-column>
                <el-table-column label="产品SKU" width="120" inline-template>
                    <div>
                        <ui-tip :content="row.sku" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="SKU别名" width="120" inline-template>
                    <div>
                        <ui-tip :content="row.sku_alias" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="产品名称" width="150">
                    <template slot-scope="scope" class="fl">
                        <div>
                            <ui-tip :content="scope.row.sku_name" :width="80" class="fl"></ui-tip>
                        </div>
                        <img src="../../../assets/echart.png"
                             class="png inline fr"
                             @click="analyze(scope.row)"
                             width="20" height="20" title="点击可查看图表详情">
                    </template>
                </el-table-column>
                <el-table-column label="日销量" width="50" inline-template>
                    <div>
                        <ui-tip :content="row.daily_sale" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="安全交期" width="50" inline-template>
                    <div>
                        <ui-tip :content="row.delivery_time" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="在途库存" width="50" inline-template>
                    <div>
                        <ui-tip :content="row.intransit_stock_qty" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="可用库存" width="50" inline-template>
                    <div>
                        <ui-tip :content="row.available_qty" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="订单未配货" width="60" inline-template>
                    <div>
                        <ui-tip :content="row.unpicking_goods_qty" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="采购数量" inline-template>
                    <div>
                        <ui-tip :content="row.purchase_qty" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="采购单价（CNY）" inline-template>
                    <div>
                        <ui-tip :content="row.purchase_price" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="最后一次采购单价(CNY)" inline-template>
                    <div>
                        <ui-tip :content="row.lastest_purchase_price" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="3月内最低报价" inline-template width="60">
                    <div>
                        <ui-tip :content="row.three_month_price" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="供应商" inline-template>
                    <div>
                        <ui-tip :content="row.supplier" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="区间报价（CNY）" inline-template>
                          <span class="operate"
                                @click="newPrice(row)"
                                v-for="item in row.section" style="display: block">
                            <span>{{item.min_quantity}}</span>-
                            <span>{{item.max_quantity}}</span>/
                            <span>{{item.price}}</span>
                          </span>
                </el-table-column>
                <el-table-column label="结算方式" width="50" inline-template>
                    <div>
                        <ui-tip :content="row.balance_type_text" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="采购员" inline-template width="100">
                    <div>
                        <ui-tip :content="row.purchaser" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="操作" inline-template>
                        <span class="operate" v-if="row.link">
                            <a class="link" :href="`${row.link}`" target="_blank">下单</a>
                        </span>
                    <span class="operate" v-else @click="order_none">下单</span>
                </el-table-column>
            </el-table>
            <el-pagination
                style="text-align: right;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[20,50,100,200,500]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="this.count">
            </el-pagination>
        </div>
        <div>
            <el-table
                :data="filterSupplierBuyers"
                :max-height="200">
                <el-table-column label="审核状态" inline-template width="120">
                    <div>
                        <el-select v-model="row.analyze_status">
                            <el-option :key="item.value" v-for="item in analyzeList"
                                       :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                    </div>
                </el-table-column>
                <el-table-column label="编号" inline-template>
                    <span>{{ row.purchase_plan_code }}</span>
                </el-table-column>
                <el-table-column label="供应商" inline-template>
                    <span v-if="row.supplier">{{ row.supplier }}</span>
                    <span v-else>无供应商</span>
                </el-table-column>
                <el-table-column label="采购仓库" inline-template width="110">
                    <div>
                        <span>{{row.warehouse}}</span>
                    </div>
                </el-table-column>
                <el-table-column label="采购员" inline-template width="110">
                    <div>
                        <span>{{row.purchaser}}</span>
                    </div>
                </el-table-column>
                <el-table-column label="运费" inline-template width="110">
                    <span>{{row.expenses}}</span>
                </el-table-column>
                <el-table-column label="运单号"
                                 inline-template
                                 v-if="selectMark==='other'">
                    <span>{{row.tracking_number}}</span>
                </el-table-column>
                <el-table-column label="优惠金额" inline-template width="110">
                    <span>{{row.discount}}</span>
                </el-table-column>
                <el-table-column label="商品金额（CNY）" inline-template width="120">
                    <span>{{supplier_goods_amount(row) | filterAmount}}</span>
                </el-table-column>
                <el-table-column label="总金额（CNY）" inline-template width="110">
                    <span>{{supplier_goods_tatol(row) | filterAmount}}</span>
                </el-table-column>
                <el-table-column label="审核备注" inline-template>
                    <div>
                        <el-input v-model="row.remark" @blur="add_remark(row)" :class="[row.colorShow?'color':'']"></el-input>
                    </div>
                </el-table-column>
                <el-table-column label="操作" inline-template>
                    <span class="operate" @click="log_show(row)">日志</span>
                </el-table-column>
            </el-table>
        </div>
        <div class="clear" style="font-weight: bold;margin-bottom: 10px;">
            <label-item label="货品种类数：">
                <span>{{count}}</span>
            </label-item>
            <label-item label="货品总数量：">
                <span>{{purchase_sum}}</span>
            </label-item>
        </div>
        <div slot="footer">
            <request-button :disabled="passDisabled" :mintime="200" req-key="save_approval" :request="approval">确定</request-button>
            <el-button size="mini" class="mr-sm" @click.native="show_false">关闭</el-button>
        </div>
        <analyze v-model="analyzeDialog" :form="analyzeData"></analyze>
        <action-log v-model="logDialog" :action-log="actionLog"></action-log>
    </page-dialog>
</template>
<style lang="stylus">
    .p-form-approval {
        .el-card {
            overflow: initial;
        }
        .body {
            z-index: 999;
        }
        .el-pagination {
            padding: 5px;
        }
        .color{
            input.el-input__inner{
                border: 1px solid red;
            }
        }
    }

</style>
<script>
    import {api_purchase_plan_changeStatus,add_look_sku,add_look_log} from '../../../api/procurement-plan';
    import {publish_edit_supplier} from '../../../api/purchase';
    import analyze from '../purchasing/add-analyze.vue'
    export default{
        page:{
            devinfo:{
                frontEnd:'黎宏珍',
                backEnd:'刘志勇',
                createTime:'2017-10-12',
                updateTime:'2017-10-12'
            }
        },
        data(){
            return{
                loading:true,
                cancelPur:false,
                passDisabled:false,
                logDialog:false,
                show:this.value,
                form:{
                    id:111
                },
                purchaser_id:'',
                goodsList:[],
                goodsListSelect:[],
                suppliers:[],
                supplier_id:'',
                page:1,
                pageSize:20,
                total:0,
                supplier:-1,
                purchase:-1,
                warehouse_id:-1,
                actionLog:[],
                supplierData:[],
                supplierId:0,
                analyzeDialog:false,
                analyzeData:{},
                analyzeList:[
                    {value:2,label:'审核不通过'},
                    {value:4,label:'审核通过'}
                ]
            }
        },
        mounted(){
            this.init_publish_edit_supplier();
        },
        methods:{
            open(){
                this.goodsListSelect = [];
                this.passDisabled = false;
                this.supplier = -1;
                this.purchase = -1;
                this.warehouse_id = -1;
                this.page = 1;
                this.pageSize = 20;
            },
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.')
                }
                return ""
            },
            add_remark(row){
                if(row.analyze_status === 2){
                    if(row.remark === ''){
                        row.colorShow = true;
                    }else{
                        row.colorShow = false;
                    }
                }
            },
            log_show(row){
                this.logDialog = true;
                this.lookList.forEach(item=>{
                    if(item.supplier_id === row.supplier_id){
                        row.id = item.id;
                    }
                });
                this.log_init(row.id);
            },
            order_none(){
                return this.$message({type:"error",message:`无下单链接,无法下单!`});
            },
            show_false(){
                this.show=false;
            },
            supplier_goods_amount(row){
                let ret = 0;
                this.goodsList.forEach(goods=>{
                    if((goods.purchaser_id === row.purchaser_id) && (goods.supplier_id === row.supplier_id)){
                        const price = goods.purchase_price || 0;
                        const count = goods.purchase_qty || 0;
                        ret += Number(price) * Number(count);
                    }
                });
                return ret;
            },
            supplier_goods_tatol(row){
                return this.supplier_goods_amount(row) + parseFloat(row.expenses) - parseFloat(row.discount) || 0;
            },
            analyze(data){
                this.analyzeData = {sku:data.sku, sku_id:data.sku_id,warehouse_id:data.warehouse_id};
                this.analyzeDialog = true;
            },
            handleSizeChange(pageSize){
                this.pageSize = pageSize;
            },
            handleCurrentChange(page){
                this.page = page;
            },
            init_publish_edit_supplier(){
                this.$http(publish_edit_supplier).then(res=>{
                    this.suppliers = res;
                })
            },
            approval(){
                let plans = [];
                this.filterSupplierBuyers.forEach(row=>{
                    if(row.analyze_status === 2 && row.remark === ''){
                        row.colorShow = true;
                    }else{
                        row.colorShow = false;
                    }
                    let data ={
                        id:row.id,
                        status:row.analyze_status,
                        remark:row.remark,
                    };
                    plans.push(data);
                });
                let find = this.filterSupplierBuyers.find(item=>{
                    return item.colorShow === true;
                });
                if(!find){
                    return this.$http(api_purchase_plan_changeStatus,{plans:plans}).then(res=>{
                        this.$message({
                            type:'success',
                            message:res.message || res
                        });
                        this.passDisabled = true;
                        this.show = false;
                        this.$emit("edit-update",this.id,0,3);
                        return Promise.resolve()
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('save_approval',false);
                        },200);
                    });
                }
            },
            cancel(){
                this.show = false;
            },
            log_init(id){
                this.$http(add_look_log,{purchase_plan_id:id}).then(res=>{
                    this.actionLog = res.data;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            //查看  获取sku信息
            look_sku(){
                this.loading = true;
                this.id.forEach(row=>{
                    let data={
                        purchase_plan_id:row,
                        page:1,
                        pageSize:200
                    };
                    this.$http(add_look_sku,data).then(res=>{
//                    	this.$set(res.data,'purchase_plan_id',row);
                        this.goodsList = this.goodsList.concat(res.data);
                        this.total += res.count;
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    });
                    this.loading = false;
                });
            },
            change_dialog(val){
                if (val) {
                    this.goodsList = [];
                    this.look_sku();
                }
            }
        },
        computed:{
            count(){
                return this.goodsList.length;
            },
            purchase_sum(){
                let sum = 0;
                this.goodsList.forEach(num => {
                    sum += Number(num.purchase_qty)
                });
                return sum;
            },
            filterSupplierBuyers(){
                let shipFee = [];
                this.lookList.forEach(row=>{
                	let data = {
                		list:row.ship_fee_discount_json,
                        purchase_plan_code:row.purchase_plan_code,
                        purchase_plan_id:row.id
                    };
                    shipFee.push(data || {});
                });
                let ret = {};
                this.goodsList.forEach(goods=>{
                    const key = `${goods.supplier_id}-${goods.warehouse}-${goods.purchase_plan_id}`;
                    let ship = shipFee.find(row=>{
                        return row.list.purchaser_id === goods.purchaser_id && row.list.supplier_id === goods.supplier_id && row.purchase_plan_id === goods.purchase_plan_id;
                    });
                    if(!ship){
                        ship = {
                        	list:{
                                expenses:0,
                                tracking_number:"",
                                discount:0,
                                analyze_status:4,
                                colorShow:false,
                                remark:"",
                            },
                            purchase_plan_code:'',
                            purchase_plan_id:''
                        };
                    }
                    ret[key] = ret[key] || {
                            supplier:goods.supplier,
                            supplier_id:goods.supplier_id,
                            purchaser:goods.purchaser,
                            purchaser_id:goods.purchaser_id,
                            warehouse:goods.warehouse,
                            purchase_plan_code:ship.purchase_plan_code,
                            id:goods.purchase_plan_id,
                            expenses:ship.list.expenses,
                            tracking_number:ship.list.tracking_number,
                            discount:ship.list.discount,
                            analyze_status:4,
                            colorShow:false,
                            remark:"",
                            goods:[]
                        };
                    ret[key].goods.push(goods);
                });
                return Object.values(ret);
            },
            filterSupplierGoodsLists(){
                let data = this.supplier;
                switch (data){
                    case -1:
                        if(this.purchase === -1){
                            if(this.warehouse_id === -1){
                                return this.goodsList;
                            }else{
                                return this.goodsList.filter(row=>{
                                    return row.warehouse_id === this.warehouse_id;
                                });
                            }
                        }else{
                            if(this.warehouse_id === -1){
                                return this.goodsList.filter(row=>{
                                    return row.purchaser_id === this.purchase;
                                });
                            }else{
                                return this.goodsList.filter(row=>{
                                    return row.warehouse_id === this.warehouse_id && row.purchaser_id === this.purchase;
                                });
                            }
                        }
                    default:
                        if(this.purchase === -1){
                            if(this.warehouse_id === -1){
                                return this.goodsList.filter(row=>{
                                    return row.supplier_id === this.supplier;
                                });
                            }else{
                                return this.goodsList.filter(row=>{
                                    return row.warehouse_id === this.warehouse_id && row.supplier_id === this.supplier;
                                });
                            }
                        }else{
                            if(this.warehouse_id === -1){
                                return this.goodsList.filter(row=>{
                                    return row.supplier_id === this.supplier && row.purchaser_id === this.purchase;
                                });
                            }else{
                                return this.goodsList.filter(row=>{
                                    return row.warehouse_id === this.warehouse_id && row.purchaser_id === this.purchase && row.supplier_id === this.supplier;
                                });
                            }
                        }

                }
            },
            filterGoodsLists(){
                let ret = [];
                let index = (this.page - 1) * this.pageSize;
                let j = this.pageSize;
                for (let i = index; i < this.filterSupplierGoodsLists.length && j > 0; i++) {
                    let row = this.filterSupplierGoodsLists[i];
                    ret.push(row);
                    j = j - 1;
                }
                return ret;
            },
            supplierLists(){
                let ret = [{label:'全部',value:-1}];
                this.goodsList.forEach(row=>{
                    if(row.supplier_id && (ret.indexOfFun(r=>r.value === row.supplier_id) <= -1)){
                        ret.push({
                            label:row.supplier,
                            value:row.supplier_id
                        })
                    }
                });
                return ret;
            },
            purchaseLists(){
                let ret = [{label:'全部',value:-1}];
                this.goodsList.forEach(row=>{
                    if(row.purchaser_id && (ret.indexOfFun(r=>r.value === row.purchaser_id) <= -1)){
                        ret.push({
                            label:row.purchaser,
                            value:row.purchaser_id
                        })
                    }
                });
                return ret;
            },
            warehousesLists(){
                let ret = [{label:'全部',value:-1}];
                this.goodsList.forEach(row=>{
                    if(row.warehouse_id && (ret.indexOfFun(r=>r.value === row.warehouse_id) <= -1)){
                        ret.push({
                            label:row.warehouse,
                            value:row.warehouse_id
                        })
                    }
                });
                return ret;
            }
        },
        filters:{
            filterAmount(val){
                return !!val&&!isNaN(Number(val))?Number(val).toFixed(3):val;
            }
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input', val);
            },
        },
        props:{
            value:{},
            lookList:{
                required:true,
                type:Array,
            },
            id:{},
            selectMark:{},
        },
        components:{
            analyze,
            pageDialog:require('../../../components/page-dialog.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            actionLog:require('./action-log.vue').default,
        }
    }
</script>
