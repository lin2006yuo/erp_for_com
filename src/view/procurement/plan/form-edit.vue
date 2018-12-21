<template>
    <page-dialog size="full" v-model="show" title="采购计划编辑" class="p-form-edit" @change="change_dialog" :close-on-click-modal="false" width="90%" left="10%">
            <label-item label="采购仓库：">
                <span>{{warehouse}}</span>
            </label-item>
            <label-item label="供应商：" class="ml-lg"  v-if="edit">
                <el-select v-model="supplier"
                           ref="supplier"
                           v-mouse-side.mousewheel="()=>{$refs.supplier.visible=false}">
                    <el-option :key="supplier.value" v-for="supplier in supplierLists"
                               :label="supplier.label"
                               :value="supplier.value"></el-option>
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
            <div v-if="edit" style="margin-top:5px">
                <el-button type="primary" size="mini" @click.native="add_goods()">添加商品</el-button>
                <el-button type="primary" size="mini" @click.native="showImport=true;">EXCEL导入</el-button>
                <el-button type="warning" size="mini" @click.native="delete2">{{deleteLabel}}</el-button>
                <label-item class="fr" label="统一分配采购员：" filterable>
                    <purchaser class="inline" :disabled="selectMark==='other'" v-model="purchaser_id" @input="change_buyers"></purchaser>
                </label-item>
            </div>
            <div style="margin-top:5px">
                <el-table :data="filterGoodsLists"
                          @selection-change="(sels)=>{goodsListSelect=sels;}"
                          :max-height="490"
                          v-loading="loading"
                          element-loading-text="玩命加载中..."
                          style="min-height: 225px;">
                    <el-table-column type="selection" width="35" v-if="lookData.status!==1"></el-table-column>
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
                        <ui-input type="number"
                                  v-model="row.purchase_qty"
                                  :edit="edit"
                                  @input="chang_(row)"
                                  @blur="blur_purchase_qty(row)"></ui-input>
                    </el-table-column>
                    <el-table-column label="采购单价（CNY）" inline-template>
                        <ui-input v-model="row.purchase_price"
                                  :edit="edit"
                                  :disabled="selectMark==='other'"
                                  @input="chang_(row)"
                                  @blur="blur_purchase_price(row)"></ui-input>
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
                            <ui-tip v-if="!edit || selectMark==='other'" :content="row|supFilter" :width="98"></ui-tip>
                            <ui-tip v-else :is-operate="true" :content="row|supFilter" :width="98" @cur-click="modifSupplie(row)"></ui-tip>
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
                        <div v-if="!edit || selectMark==='other'">
                            <span>{{row.purchaser}}</span>
                        </div>
                        <div v-else>
                              <span v-if="row.purchaser" class="operate">
                                 <span @click="change_purchaser(row)">{{row.purchaser}}</span>
                              </span>
                              <span v-else>
                                 <purchaser class="inline" v-model="row.purchaser_id"></purchaser>
                              </span>
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
                    <el-table-column label="编号" inline-template>
                        <span>{{ row.purchase_plan_code }}</span>
                    </el-table-column>
                    <el-table-column label="供应商" inline-template>
                        <span v-if="row.supplier">{{ row.supplier }}</span>
                        <span v-else>无供应商</span>
                    </el-table-column>
                    <el-table-column label="采购员" inline-template>
                        <div v-if="!edit || selectMark==='other'">
                            <span>{{row.purchaser}}</span>
                        </div>
                        <div v-else>
                            <span v-if="row.purchaser">
                                <span>{{row.purchaser}}</span>
                            </span>
                            <span v-else-if="row.purchaser_id">
                                <purchaser class="inline" v-model="row.purchaser_id" :disabled="true"></purchaser>
                            </span>
                            <span v-else>无采购员</span>
                        </div>
                    </el-table-column>
                    <el-table-column label="运费"  inline-template>
                        <span v-if="!edit">{{row.expenses}}</span>
                        <ui-limit-number v-else
                                         class="inline"
                                         v-model="row.expenses"
                                         :disabled="selectMark==='other'"
                                         :limit="2"></ui-limit-number>
                    </el-table-column>
                    <el-table-column label="运单号"
                                     inline-template
                                     v-if="selectMark==='other'">
                        <span v-if="!edit">{{row.tracking_number}}</span>
                        <span v-else>
                            <el-input class="inline" v-model="row.tracking_number"></el-input>
                        </span>
                    </el-table-column>
                    <el-table-column label="流水号"  inline-template>
                        <el-input class="inline" v-model="row.external_number"></el-input>
                    </el-table-column>
                    <el-table-column label="优惠金额" inline-template>
                        <span v-if="!edit">{{row.discount}}</span>
                        <ui-limit-number v-else
                                         class="inline"
                                         v-model="row.discount"
                                         :disabled="selectMark==='other'"
                                         :limit="2"></ui-limit-number>
                    </el-table-column>
                    <el-table-column label="商品金额（CNY）" inline-template>
                        <span>{{supplier_goods_amount(row) | filterAmount}}</span>
                    </el-table-column>
                    <el-table-column label="总金额（CNY）" inline-template>
                        <span>{{supplier_goods_tatol(row) | filterAmount}}</span>
                    </el-table-column>
                    <el-table-column label="备注" inline-template>
                        <span v-if="!edit">{{row.description}}</span>
                        <span v-else><el-input v-model="row.description"></el-input></span>
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

        <!--常用备注   一直存在页面-->
        <div slot="footer">
            <request-button :request="save" v-if="edit||dispose">保存</request-button>
            <request-button :request="submit" v-if="edit||dispose">提交审批</request-button>
            <el-button size="mini" class="mr-sm" @click.native="cancel">关闭</el-button>
        </div>
        <action-log v-model="logDialog" :action-log="actionLog"></action-log>
        <add-goods v-model="showGoods" ref="addGoods" @selected="selected"></add-goods>
        <add-supplier v-model="showSupplier" :supplier-data="supplierData" @update_supplier="update_supplier"></add-supplier>
        <analyze v-model="analyzeDialog" :form="analyzeData"></analyze>
        <price-change v-model="priceDialog" :price-change-data="priceChangeData"></price-change>
        <add-price v-model="showPrice" :supplierData="newPriceData" @confirm="updata_price"></add-price>
        <import-excel v-model="showImport" :warehouseId="this.warehouse_id" @files-data="files_data"></import-excel>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import card from "../../../components/card.vue"
    import {api_add_sku,add_look_sku,add_look_log,api_updata_plan,api_post_purchase_plan_cancel,api_get_price_change} from '../../../api/procurement-plan';
    import {api_getSupplier} from '../../../api/purchase';
    import {api_get_goods_supp} from "../../../api/supplier-quote";
    import analyze from '../purchasing/add-analyze.vue'
    export default{
        page:{
            devinfo:{
                frontEnd:'黎宏珍',
                backEnd:'刘志勇',
                createTime:'2017-10-19',
                updateTime:'2017-10-19'
            }
        },
        data(){
            return{
                mark:'',
                loading:true,
                showGoods:false,
                showSupplier:false,
                showRemark:false,
                cancelPur:false,
                showImport:false,
                passDisabled:false,
                logDialog:false,
                show:this.value,
                form:{
                    id:111
                },
                purchaser_id:'',
                goodsList:[],
                goodsListOld:[],
                goodsListSelect:[],
                warehouses:[],
                supplier_id:'',
                warehouse_id:'',
                warehouse:'',
                page:1,
                pageSize:20,
                total:0,
                supplier:-1,
                purchase:-1,
                selectes:[],
                delSkuid:[],
                addSkuid:[],
                actionLog:[],
                loghidden:false,
                supplierData:[],
                supplierId:0,
                analyzeDialog:false,
                analyzeData:{},
                priceChangeData:[],
                newPriceData:[],
                priceDialog:false,
                showPrice:false,
            }
        },
        methods:{
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.')
                }
                return ""
            },
            order_none(){
                return this.$message({type:"error",message:`无下单链接,无法下单!`});
            },
            change_purchaser(row){
                row.purchaser_id="";
                row.purchaser="";
            },
            add_goods(){
                this.showGoods = true;
                this.$refs.addGoods.snText = "";
            },
            show_false(){
                this.show=false;
                this.showRemark=false;
            },
            blur_purchase_qty(row){
                if(row.purchase_qty < 0){
                    row.purchase_qty = 0
                }
                row.purchase_qty = Number(row.purchase_qty).toFixed(0);
            },
            blur_purchase_price(row){
                if(row.purchase_price < 0){
                    row.purchase_price = 0
                }
                row.purchase_price = Number(row.purchase_price).toFixed(2);
            },
            //计算商品金额
            supplier_goods_amount(row){
                let ret = 0;
                this.goodsList.forEach(goods=>{
                    if((goods.supplier_id === row.supplier_id) && (goods.purchase_plan_id === row.id)){
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
            //数据分析（更改的需求）
            analyze(data){
                this.analyzeData = {sku:data.sku, sku_id:data.sku_id,warehouse_id:warehouse_id};
                this.analyzeDialog = true;
            },
            //判断是否是 数组
            polyType(data){
                return data instanceof Array
            },
            /*修改供应商*/
            modifSupplie(row){
                this.supplierId = row.id;
                this.showSupplier = true;
                let skuId={
                    sku_id:row.sku_id
                };
                this.$http(api_getSupplier, skuId).then(res => {
                    if (res.message) {
                        this.supplierData = res.message;
                    }
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                })
            },
            update_supplier(checkSupplier){
            	console.log("this.goodsListOld",this.goodsListOld);
            	let find =  this.goodsListOld.find(row=>{
            		return row.supplier_old === checkSupplier[0].company_name;
                });
                this.goodsList.forEach(data => {
                    if (this.supplierId === data.id){
                        data.supplier = checkSupplier[0].company_name;
                        data.supplier_id = checkSupplier[0].supplier_id;
                        data.section = checkSupplier[0].section;
                        data.balance_type_text = checkSupplier[0].balance_type_text;
                        data.purchase_price = checkSupplier[0].price;
                        if(!!find){
                            data.purchase_plan_id = find.purchase_plan_id_old;
                        }else{
                            data.purchase_plan_id = -1;
                        }
                    }

                })
            },
            //修改最新报价
            newPrice(row){
                let skuList = {
                    sku: '',
                    name: "",
                    cycle: [{warehouse_id: "", delivery_days: ""}],
                    section: [{min_quantity: '1', max_quantity: '', price: ""}],
                    link: "",
                    price: "",
                };
                let skuId = {
                    supplier_id: row.supplier_id,
                    sku_id: row.sku_id
                };
                this.$http(api_get_goods_supp,skuId).then(res=>{
                    skuList.sku = row.sku;
                    skuList.sku_id = row.sku_id;
                    skuList.name = row.sku_name;
                    skuList.supplier = row.supplier;
                    skuList.supplier_id = row.supplier_id;
                    skuList.currency_code = 'cny';
                    res.list.forEach(row =>{
                        skuList.cycle = row.cycle.length>0?row.cycle:[{warehouse_id: "", delivery_days: ""}];
                        skuList.link = row.link;
                        skuList.price = row.price;
                        skuList.section = row.section.length>0?row.section:[{min_quantity: '1', max_quantity: '', price: ""}];
                    });
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                });
                this.newPriceData = [skuList];
                this.showPrice = true;
            },
            updata_price(checkSupplier){
                this.goodsList.forEach(data => {
                    if (this.supplierId === data.id) {
                        data.section = checkSupplier.section;
                    }
                })
            },
            /*-----------end*/
            //修改采购员
            change_buyers(pid){
                this.goodsList.forEach((goods,index)=>{
                    this.$set(goods, 'purchaser', '');
                    this.$set(goods, 'purchaser_id', pid);
                    this.goodsList.splice(index, 1, goods);
                });
            },
            /*删除*/
            delete2(){
                this.goodsListSelect.forEach(data=>{
                    this.goodsList.forEach((item,index)=>{
                        if (data.sku_id === item.sku_id) {
                            if (this.addSkuid.indexOf(item.sku_id) === -1) {
                                this.delSkuid.push(item.sku_id)
                            }
                            let i = this.selectes.indexOf(data.sku_id);
                            this.selectes.splice(i,1);
                            this.goodsList.splice(index, 1);
                        }
                    })
                })
            },
            handleSizeChange(pageSize){
                this.pageSize = pageSize;
            },
            handleCurrentChange(page){
                this.page = page;
            },
            files_data(val){
                val.forEach(row=>{
                    if (this.selectes.indexOf(row.id) === -1) {
                        this.selectes.push(row.id);
                        row.id = row.sku_id;
                        row.purchase_price = row.supplier_price;
                        row.purchase_qty = row.purchase_qty;
                        row.link = row.link;
                        this.goodsList.push(row);
                    } else {
                        this.$message(`SKU为：${row.sku} 已存在`);
                    }
                });
            },
            cancel(){
                this.show = false;
            },
            audit_init(){
                let plans = [];
                this.filterSupplierBuyers.forEach(row=>{
                    let data ={
                        id:row.id,
                        status:1,
                        remark:row.description,
                    };
                    plans.push(data);
                });
                this.$http(api_post_purchase_plan_cancel,{plans:plans}).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message || res
                    });
                    this.show = false;
                    this.$emit("edit-update",this.id,0,3);
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                });
            },
            save(){
                let id = '';
                let saveDataList = [];
                this.filterSupplierBuyers.forEach(row =>{
                    let saveData = {};
                    let add = {};
                    let edit = {};
                    let summary = [];
                    let amout = {};
                    amout.expenses = row.expenses;
                    amout.external_number = row.external_number;
                    amout.discount = row.discount;
                    amout.description = row.description;
                    amout.tracking_number = this.selectMark === 'other' ? row.tracking_number : '';
                    row.goods.forEach(goods =>{
                        amout.supplier_id = goods.supplier_id;
                        amout.purchaser_id = goods.purchaser_id;
                    });
                    summary.push(amout);
                    this.goodsList.forEach(item => {
                		if(item.supplier_id === row.supplier_id && item.purchase_plan_id === row.id){
                            edit[item.sku_id] = {
                                purchaser_id: item.purchaser_id,
                                purchase_price:item.purchase_price,
                                purchase_qty:item.purchase_qty,
                                supplier_id: item.supplier_id,
                            };
                        }else{
                            add[item.sku_id] = {
                                purchaser_id: item.purchaser_id,
                                purchase_price:item.purchase_price,
                                purchase_qty:item.purchase_qty,
                                supplier_id: item.supplier_id,
                            };

                        }
                    });
                    let addedit ='';
                    if(edit){
                    	addedit = JSON.stringify({add: edit});
                        id = row.id;
                    }else{
                        addedit = JSON.stringify({add: add});
                        id = '';
                    }
                    saveData = {
                        id:id,
                        warehouse_id: this.warehouse_id,
                        supplier_id: row.supplier_id,
                        sku_json: addedit,
                        summary:JSON.stringify(summary),
                        status :0,
                        purchase_plan_type:this.selectMark=== 'other' ? 'purchase_order_overcharged' : 'normal_purchasing',
                        purchase_order_code:this.selectMark === 'other' ? this.snText : ''
                    };
                    saveDataList.push(saveData);
                });
                console.log(saveDataList);
                let deleteIds = [];
                let editId = [];
                this.filterSupplierBuyers.forEach(item=>{
                    editId.push(item.id);
                });
                this.id.forEach(params=>{
                        if(editId.indexOf(params) === -1){
                            deleteIds.push(params);
                        }
                    });
                let data = {};
                if(deleteIds.length>=1){
                	data ={
                        deleteIds:deleteIds,
                        saveDataList:JSON.stringify(saveDataList)
                    };
                }else{
                    data ={
                        saveDataList:JSON.stringify(saveDataList)
                    };
                }
                return this.$http(api_updata_plan,id,data).then(res => {
                    this.$message({
                        type: 'success',
                        message: `操作成功!`
                    });
                    this.show = false;
                    this.id.forEach(row=>{
                        this.$emit("edit-update",row,res.id,0);
                    });
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            submit(){
                let id = '';
                let saveDataList = [];
                this.filterSupplierBuyers.forEach(row =>{
                    let saveData = {};
                    let add = {};
                    let edit = {};
                    let summary = [];
                    let amout = {};
                    amout.expenses = row.expenses;
                    amout.external_number = row.external_number;
                    amout.discount = row.discount;
                    amout.description = row.description;
                    amout.tracking_number = this.selectMark === 'other' ? row.tracking_number : '';
                    row.goods.forEach(goods =>{
                        amout.supplier_id = goods.supplier_id;
                        amout.purchaser_id = goods.purchaser_id;
                    });
                    summary.push(amout);
                    this.goodsList.forEach(item => {
                        if(item.supplier_id === row.supplier_id && item.purchase_plan_id === row.id){
                            edit[item.sku_id] = {
                                purchaser_id: item.purchaser_id,
                                purchase_price:item.purchase_price,
                                purchase_qty:item.purchase_qty,
                                supplier_id: item.supplier_id,
                            };
                        }else{
                            add[item.sku_id] = {
                                purchaser_id: item.purchaser_id,
                                purchase_price:item.purchase_price,
                                purchase_qty:item.purchase_qty,
                                supplier_id: item.supplier_id,
                            };

                        }
                    });
                    let addedit ='';
                    if(edit){
                        addedit = JSON.stringify({add: edit});
                        id = row.id;
                    }else{
                        addedit = JSON.stringify({add: add});
                        id = '';
                    }
                    saveData = {
                        id:id,
                        warehouse_id: this.warehouse_id,
                        supplier_id: row.supplier_id,
                        sku_json: addedit,
                        summary:JSON.stringify(summary),
                        status :1,
                        purchase_plan_type:this.selectMark=== 'other' ? 'purchase_order_overcharged' : 'normal_purchasing',
                        purchase_order_code:this.selectMark === 'other' ? this.snText : ''
                    };
                    saveDataList.push(saveData);
                });
                console.log(saveDataList);
                let deleteIds = [];
                let editId = [];
                this.filterSupplierBuyers.forEach(item=>{
                    editId.push(item.id);
                });
                this.id.forEach(params=>{
                    if(editId.indexOf(params) === -1){
                        deleteIds.push(params);
                    }
                });
                let data = {};
                if(deleteIds.length>=1){
                    data ={
                        deleteIds:deleteIds,
                        saveDataList:JSON.stringify(saveDataList)
                    };
                }else{
                    data ={
                        saveDataList:JSON.stringify(saveDataList)
                    };
                }
                this.$http(api_updata_plan,id,data).then(res => {
                   return this.$confirm('此操作提交审批, 确认此操作吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                    	if(res.id.length>=1){
                    		res.id.forEach(item=>{
                                this.id.push(item);
                            });
                            this.audit_init();
                        }else{
                    		/*Todo 有删除的情况未考虑*/
                            this.audit_init();
                        }
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({message:`已取消操作!`||code,type:'error'})
                    })
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
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
            chang_(row){
                let index = this.goodsList.indexOfFun(item=>{
                    return  item.sku_id === row.sku_id
                });
                if (!this.goodsList[index].action) {
                    this.goodsList[index].action="mod"
                }
            },
            //添加  获取sku信息
            add_sku(data){
                this.$http(api_add_sku,data).then(res=>{
                    res.purchaser_id = res.purchaser_id;
                    res.id = data.sku_id;
                    res.purchase_price = res.supplier_price;
                    res.supplier_price = res.supplier_price;//---修改过
                    res.purchase_qty = 0;
                    res.is_replace = 0;
                    res.in_qty = "";
                    res.arrival_qty = 0;
                    res.action = "add";
                    this.goodsList.push(res);
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            selected(sels){
                sels.forEach(data => {
                    data.forEach(row =>{
                        if (this.selectes.indexOf(row.id) === -1) {
                            this.addSkuid.push(row.id);
                            this.selectes.push(row.id);
                            this.add_sku({
                                sku_id:row.id,
                                warehouse_id:this.warehouse_id
                            })
                        } else {
                            this.$message(`SKU为：${row.sku} 已存在`);
                        }
                    });
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
                    	console.log(res.data);
                    	res.data.forEach(row=>{
                    		row.purchase_plan_id_old = row.purchase_plan_id;
                    		row.supplier_old = row.supplier;
                            this.selectes.push(row.sku_id);
                        });
                        this.goodsList = this.goodsList.concat(res.data);
                        this.goodsListOld = this.goodsListOld.concat(res.data);
                        this.total += res.count;
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    });
                });
                this.loading = false;
            },
            change_dialog(val){
                if (val) {
                    this.mark = "";
                    this.selectes = [];
                    this.goodsList = [];
                    this.addSkuid = [];
                    this.delSkuid = [];
                    this.look_sku();
                    this.loghidden = false;
                }
            }
        },
        computed:{
            count(){
                if(this.edit){
                    return this.goodsList.length;
                }else{
                    return this.total;
                }
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
                                    external_number:"",
                                    discount:0,
                                    description:"",
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
                                external_number:ship.list.external_number,
                                description:ship.list.description,
                                goods:[]
                            };
                        ret[key].goods.push(goods);
                });
                return Object.values(ret);
            },
            filterSupplierGoodsLists(){
                switch (this.supplier){
                    case -1:
                        if(this.purchase === -1){
                            return this.goodsList;
                        }else{
                            return this.goodsList.filter(row=>{
                                return row.purchaser_id === this.purchase;
                            });
                        }
                    default:
                            if(this.purchase === -1){
                                return this.goodsList.filter(row=>{
                                    return row.supplier_id === this.supplier;
                                });
                            }else{
                                return this.goodsList.filter(row=>{
                                    return row.purchaser_id === this.purchase && row.supplier_id === this.supplier;
                                });
                            }
                }
            },
            filterGoodsLists(){
            	if(this.edit){
                    let ret = [];
                    let index = (this.page - 1) * this.pageSize;
                    let j = this.pageSize;
                    for (let i = index; i < this.filterSupplierGoodsLists.length && j > 0; i++) {
                        let row = this.filterSupplierGoodsLists[i];
                        ret.push(row);
                        j = j - 1;
                    }
                    return ret;
                }else{
            		return this.filterSupplierGoodsLists;
                }
            },
            deleteLabel(){
                let len = this.goodsListSelect.length;
                if(len > 0){
                    return `删除(${len})`;
                }else{
                    return `请选择删除商品`
                }
            },
            supplierLists(){
                let ret = [{label:'全部',value:-1},{label:'未指定供应商',value:0}];
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
        },
        filters:{
            supFilter(row){
                if(row.supplier_id === 0){
                    return "未指定供应商"
                }else {
                    return row.supplier || "没有名字的供应商";
                }
            },
            filterAmount(val){
                return !!val&&!isNaN(Number(val))?Number(val).toFixed(3):val;
            }
        },
        watch:{
            value(val){
                this.show = val;
                this.goodsListSelect = [];
                this.showRemark = false;
                this.passDisabled = false;
                if(this.cancelPurchase){
                    this.cancelPur = true;
                }else{
                    this.cancelPur = false;
                }
                this.page = 1;
                this.pageSize = 20;
                this.purchase = -1;
                this.supplier = -1;
            },
            show(val){
                this.$emit('input', val);
            },
            'lookList'(val){
            	if(val){
                    this.lookList.forEach(row=>{
                        this.warehouse_id = row.warehouse_id;
                        this.warehouse = row.warehouse;
                    });
                }
            }
        },
        props:{
            value:{},
            edit:{
                required:true,
                type:Boolean,
            },
            dispose:{
                type:Boolean,
            },
            lookList:{
                required:true,
                type:Array,
            },
            lookData:{
                required:true,
                type:Object,
            },
            id:{},
            selectMark:{},
            cancelPurchase:{}
        },
        components:{
            card,
            analyze,
            pageDialog:require('../../../components/page-dialog.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            labelPanel:require('../../../components/label-panel.vue').default,
            addGoods:require('./add-goods.vue').default,
            scrollSelect:require('../../../components/scroll-select.vue').default,
            addSupplier:require('./add-supplier.vue').default,
            priceChange:require('./price-change.vue').default,
            addPrice:require('./add-price.vue').default,
            uiInput:require('../../../components/ui-input.vue').default,
            selectText:require('../../../components/select-text.vue').default,
            uiTips:require('../../../components/ui-tips.vue').default,
            virtualSelect:require('../../../components/virtual-select.vue').default,
            uiLimitNumber:require("../../../components/ui-limit-number.vue").default,
            purchaser:require('../../../api-components/purchaser.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            importExcel: require('./import-excel.vue').default,
            actionLog:require('./action-log.vue').default,
            requestButton:require('../../../global-components/request-button.vue').default,
        }
    }
</script>
