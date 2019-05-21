<template>
    <page-dialog size="full"
                 v-model="show"
                 title="采购计划编辑"
                 class="p-form-edit"
                 @change="change_dialog"
                 :close-on-click-modal="false"
                 :loading="loading"
                 :min-height="400"
                 @open="open"
                 width="90%"
                 left="10%">
        <label-item label="采购仓库：">
            <span>{{warehouse}}</span>
        </label-item>
        <label-item label="供应商：" class="ml-lg" v-if="edit">
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
                <el-option v-for="purchase in purchaseLists"
                           :label="purchase.label"
                           :key="purchase.value"
                           :value="purchase.value"></el-option>
            </el-select>
        </label-item>
        <div v-if="edit" style="margin-top:5px">
            <el-button type="primary"
                       class="ml-sm"
                       @click.native="check_all"
                       size="mini">一键全选
            </el-button>
            <el-button type="warning" size="mini" @click.native="delete2">{{deleteLabel}}</el-button>
            <el-button type="primary"
                       class="ml-sm"
                       :disabled="goodsList.length===0"
                       @click.native="batch_remark"
                       size="mini">批量设置批注
            </el-button>
            <label-item class="fr" label="统一分配采购员：" filterable>
                <purchaser ref="purchaser" class="inline" :disabled="selectMark==='purchase_order_overcharged'" v-model="purchaser_id"
                           @input="change_buyers"></purchaser>
            </label-item>
        </div>
        <page class="p-form-edit-table">
            <form-edit-table
                :bordColor="bordColor"
                ref="editModule"
                v-for="data in filterLists"
                :has-max-height="filterLists.length===1"
                :key="data.supplier_id"
                :table-data="data"
                :select-mark="data.purchase_plan_type"
                :edit="edit"
                :goods-list="goodsList"
                :look-list="lookList"
                :warehouse_id="warehouse_id"
                :is-check-all="checkAll"
                @row_add_goods="row_add_goods"
                @selected="selected"
                @analyze="analyze"
                @modif-supplie="modifSupplie"
                @new-price="newPrice"
                @selection-change="selection_row"
                @input-purchaser="input_purchaser"
                @head_check="head_check"
                @update-remark="update_remark"
                @log_show="log_show"
                :new_currency="new_currency">
            </form-edit-table>
        </page>
        <!--常用备注   一直存在页面-->
        <div class="inline mr-sm p-form-edit-count">{{`共${count}条采购计划`}}</div>
        <div slot="footer">
            <request-button req-key="save_purchaser_edit" :mintime="200" :request="save" v-if="edit||dispose">保存
            </request-button>
            <request-button req-key="submit_purchaser_edit" :mintime="200" @click="submit" v-if="edit||dispose">提交审批
            </request-button>
            <el-button size="mini" class="mr-sm" @click.native="cancel">关闭</el-button>
        </div>
        <action-log v-model="logDialog" :action-log="actionLog"></action-log>
        <add-supplier v-model="showSupplier" :supplier-data="supplierData"
                      @update_supplier="update_supplier"></add-supplier>
        <analyze v-model="analyzeDialog" :form="analyzeData"></analyze>
        <price-change v-model="priceDialog" :price-change-data="priceChangeData"></price-change>
        <add-price v-model="showPrice" :supplierData="newPriceData" @confirm="updata_price"></add-price>
        <batch-remark
            v-model="remarkDialog"
            :title="`批量设置批注`"
            :api="''"
            :action="''"
            :required="false"
            @submit="submit_remark">
        </batch-remark>
    </page-dialog>
</template>
<style lang="stylus">
    .p-form-edit{
        .p-form-edit-table{
            max-height 500px;
            overflow-y scroll;
            margin-top:10px;
        }
        .dialog__body {
            overflow-y: hidden !important;
        }
        .p-form-edit-count{
            color: #475669;
            position absolute;
            bottom 15px;
        }
    }
</style>
<script>
    import card from "../../../components/card.vue"
    import {
        api_add_sku,
        add_look_sku,
        add_look_log,
        api_updata_plan,
        api_post_purchase_plan_cancel,
    } from '../../../api/procurement-plan';
    import {api_getSupplier} from '../../../api/purchase';
    import {api_get_goods_supp} from "../../../api/supplier-quote";
    import analyze from '../purchasing/add-analyze.vue'

    export default {
        page: {
            devinfo: {
                frontEnd: '覃宏峰',
                backEnd: '刘志勇',
                createTime: '2018-4-18',
                updateTime: '2017-4-21'
            }
        },
        data() {
            return {
                new_currency: '',
                bordColor: false,
                mark: '',
                loading: true,
                showSupplier: false,
                showRemark: false,
                cancelPur: false,
                showImport: false,
                passDisabled: false,
                logDialog: false,
                show: this.value,
                form: {
                    id: 111
                },
                purchaser_id: '',
                goodsList: [],
                goodsListOld: [],
                goodsListSelect: [],
                warehouses: [],
                supplier_id: '',
                warehouse_id: '',
                warehouse: '',
                page: 1,
                pageSize: 50,
                supplier: -1,
                purchase: -1,
                selectes: [],
                delSkuid: [],
                addSkuid: [],
                actionLog: [],
                loghidden: false,
                supplierData: [],
                supplierId: 0,
                analyzeDialog: false,
                analyzeData: {},
                priceChangeData: [],
                newPriceData: [],
                priceDialog: false,
                showPrice: false,
                supplierClasses: [],
                remarkDialog:false
            }
        },
        methods: {
            batch_remark(){
                this.remarkDialog = true;
            },
            submit_remark(remark){
                if(this.goodsList.every(row=>!row.isCheck)){
                    this.update_remark(remark)
                }else{
                    this.goodsList.forEach(row=>{
                        console.log(row,'row');
                        row.isCheck&&(this.$set(row,'remark',remark));
                    })
                }
                this.remarkDialog = false;
            },
            update_remark(remark){
                this.goodsList.forEach(row=>{
                    this.$set(row,'remark',remark);
                })
            },
            check_all() {
                this.goodsList.forEach(row => {
                    this.$set(row, 'isCheck', true);
                });
                this.goodsListSelect = this.goodsList.filter(row => {
                    return row.isCheck === true
                });
            },
            open() {
                this.goodsListSelect = [];
                this.showRemark = false;
                this.passDisabled = false;
                this.bordColor = false;
                if (this.cancelPurchase) {
                    this.cancelPur = true;
                } else {
                    this.cancelPur = false;
                }
                this.page = 1;
                this.pageSize = 50;
                this.purchase = -1;
                this.supplier = -1;
                this.purchaser_id = '';
            },
            row_add_goods(res) {
                this.goodsList.push(res);
            },
            head_check(data) {
                this.goodsList.forEach(row => {
                    data.forEach(item => {
                        if (row.sku === item.sku && row.supplier_id === item.supplier_id && row.purchase_plan_id === item.purchase_plan_id) {
                            this.$set(row, 'isCheck', item.isCheck);
                        }
                    })
                });
                this.goodsListSelect = this.goodsList.filter(row => {
                    return row.isCheck === true
                });
            },
            selection_row() {
                this.goodsListSelect = this.goodsList.filter(row => {
                    return row.isCheck === true
                });
            },
            input_purchaser(option) {
                this.goodsList.forEach(row => {
                    let find = option.goods.find(item=>item.sku===row.sku);
                    if (!!find) {
                        this.$set(row, 'purchaser_id', option.purchaser_id);
                        this.$set(row, 'purchaser', option.purchaser);
                    }
                });
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.')
                }
                return ""
            },
            order_none() {
                return this.$message({type: "error", message: `无下单链接,无法下单!`});
            },
            show_false() {
                this.show = false;
                this.showRemark = false;
            },
            //数据分析（更改的需求）
            analyze(data) {
                this.analyzeData = {sku: data.sku, sku_id: data.sku_id, warehouse_id: data.warehouse_id};
                this.analyzeDialog = true;
            },
            //判断是否是 数组
            polyType(data) {
                return data instanceof Array
            },
            /*修改供应商*/
            modifSupplie(data, row) {
                this.supplierId = row.id;
                let skuId = {
                    sku_id: row.sku_id,
                    plan_id: row.purchase_plan_id, //备货建议生成的采购计划不能更换供应商,
                    purchase_plan_type: this.selectMark === 'purchase_order_overcharged' ? 2 : 1
                };
                this.$http(api_getSupplier, skuId).then(res => {
                    if (res.message && res.message.length === 0) {
                        this.goodsList.forEach(item => {
                            if (row.sku_id === item.sku_id) {
                                item.hasSupplier = false;
                            }
                        });
                        this.$message({type: 'warning', message: '没有可以指定的供应商！'});
                        return
                    }
                    if (!data.supplier) {
                        // let sameCurrencyList = res.message.filter(row => row.currency_code === data.currency_code);
                        let sameCurrencyList = res.message;
                        if (sameCurrencyList.length >= 1) {
                            this.showSupplier = true;
                            this.supplierData = sameCurrencyList;
                        } else {
                            this.goodsList.forEach(item => {
                                if (row.sku_id === item.sku_id) {
                                    item.hasSupplier = false;
                                }
                            });
                            this.$message({type: 'warning', message: '当前没有相同“报价币种”的供应商！'});
                        }
                    }
                    if (!!data.supplier && res.message && res.message.length > 1) {
                        let sameCurrencyList = res.message;
                        if(sameCurrencyList.length>=1){
                            this.showSupplier = true;
                            this.supplierData = sameCurrencyList;
                        }else{
                            this.goodsList.forEach(item => {
                                if (row.sku_id === item.sku_id) {
                                    item.hasSupplier = false;
                                }
                            });
                            this.$message({type: 'warning', message: '当前没有相同“报价币种”的供应商！'});
                        }
                    }
                    if (!!data.supplier && res.message && res.message.length === 1) {
                        this.goodsList.forEach(item => {
                            if (row.sku_id === item.sku_id) {
                                item.hasSupplier = false;
                            }
                        });
                        this.$message({type: 'warning', message: '暂时没有可更换的供应商'});
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            update_supplier(checkSupplier) {
                this.lookList.forEach(data=>{
                    data.label_deck = checkSupplier[0].label_deck;
                    data.return_goods = checkSupplier[0].return_goods;
                    data.return_goods_data = checkSupplier[0].return_goods_data;
                });
                this.goodsList.forEach(data => {
                    if (this.supplierId === data.id) {
                        if (data.supplier === checkSupplier[0].company_name) {
                            this.$message({type: 'warning', message: '不能选择同一家供应商进行更换！'});
                        } else {
                            data.invoice = checkSupplier[0].invoice;
                            data.supply_chain_finance = checkSupplier[0].supply_chain_finance;
                            data.tax_rate = checkSupplier[0].tax_rate;
                            data.select_option = checkSupplier[0].select_option;
                            data.supplier = checkSupplier[0].company_name;
                            data.supplier_id = checkSupplier[0].supplier_id;
                            data.section = checkSupplier[0].section;
                            data.balance_type_text = checkSupplier[0].balance_type_text;
                            data.purchase_price = checkSupplier[0].audited_price;
                            data.currency_code=checkSupplier[0].audited_currency_code;
                            data.label_deck = checkSupplier[0].label_deck;
                            data.return_goods = checkSupplier[0].return_goods;
                            data.return_goods_data = checkSupplier[0].return_goods_data;
                            data.purchase_plan_id = -1;
                            data.min_qty = checkSupplier[0].min_qty;
                            this.new_currency = checkSupplier[0].audited_currency_code;
                        }
                    }
                })
            },
            //修改最新报价
            newPrice(row) {
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
                this.$http(api_get_goods_supp, skuId).then(res => {
                    skuList.sku = row.sku;
                    skuList.sku_id = row.sku_id;
                    skuList.name = row.sku_name;
                    skuList.supplier = row.supplier;
                    skuList.supplier_id = row.supplier_id;
                    skuList.currency_code =row.currency_code || 'CNY';
                    res.list.forEach(row => {
                        skuList.cycle = row.cycle.length > 0 ? row.cycle : [{warehouse_id: "", delivery_days: ""}];
                        skuList.link = row.link;
                        skuList.price = row.price;
                        skuList.section = row.section.length > 0 ? row.section : [{
                            min_quantity: '1',
                            max_quantity: '',
                            price: ""
                        }];
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                this.newPriceData = [skuList];
                this.showPrice = true;
            },
            updata_price(checkSupplier) {
                this.goodsList.forEach(data => {
                    if (this.supplierId === data.id) {
                        data.section = checkSupplier.section;
                    }
                })
            },
            /*-----------end*/
            //修改采购员
            change_buyers(pid) {
                let option = this.$refs.purchaser.options.find(item => {
                    return pid === item.id
                });
                this.goodsList.forEach((goods, index) => {
                    this.$set(goods, 'purchaser', option ? option.realname : '');
                    this.$set(goods, 'purchaser_id', pid);
                    this.goodsList.splice(index, 1, goods);
                });
            },
            /*删除*/
            delete2() {
                this.goodsListSelect.forEach(data => {
                    this.goodsList.forEach((item, index) => {
                        if (data.sku_id === item.sku_id && data.sku === item.sku && data.supplier_id === item.supplier_id && data.purchase_plan_id === item.purchase_plan_id) {
                            if (this.addSkuid.indexOf(item.sku_id) === -1) {
                                this.delSkuid.push(item.sku_id)
                            }
                            let i = this.selectes.indexOf(data.sku_id);
                            this.selectes.splice(i, 1);
                            this.goodsList.splice(index, 1);
                        }
                    })
                });
                this.goodsListSelect = this.goodsList.filter(row => {
                    return row.isCheck === true
                });
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
            },
            handleCurrentChange(page) {
                this.page = page;
            },
            files_data(val) {
                val.forEach(row => {
                    if (this.selectes.indexOf(row.id) === -1) {
                        this.selectes.push(row.id);
                        row.id = row.sku_id;
                        row.purchase_price = row.supplier_price;
                        this.goodsList.push(row);
                    } else {
                        this.$message(`SKU为：${row.sku} 已存在`);
                    }
                });
            },
            cancel() {
                this.show = false;
            },
            audit_init(ids) {
                let plans = ids || [];
                if (plans.length === 0) {
                    this.filterSupplierBuyersLists.forEach(row => {
                        let data = {
                            id: row.id,
                            status: 1,
                            remark: row.description,
                        };
                        plans.push(data);
                    });
                }
                this.$http(api_post_purchase_plan_cancel, {plans: plans}).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.show = false;
                    if (Array.isArray(this.id) && this.id.length === 1) {
                        this.$emit("edit-update", this.id[0], 1, 3);
                    } else {
                        this.$emit("edit-update", this.id, 1, 3);
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            save() {
                for(let i = 0; i < this.filterLists.length; i++){
                    if(!!this.filterLists[i].external_number.length && this.filterLists[i].external_number.length <18){
                        this.$message({type: 'warning', message: '外部流水号为18位数值'});
                        this.bordColor = true;
                        this.$reqKey('save_purchaser_edit', false);
                        return;
                    }
                }
                let id = '';
                let saveDataList = [];
                let tableGoodsData = [];
                let editSupplierBuyers = this.$refs.editModule.map(row => {
                    row.tableData.tax_rate = row.tax_rate;
                    return row.tableData;
                });
                editSupplierBuyers.forEach(row => {
                    tableGoodsData.push(...row.goods);
                });
                let find_qty = tableGoodsData.find(row=>Number(row.purchase_qty)===0);
                if(!!find_qty){
                    this.$reqKey('url_add_plan_stocking',false);
                    this.$message({type:'warning',message:`SKU:${find_qty.sku}的采购数量必须大于0！`});
                    return;
                }
                let min_qty = tableGoodsData.find(row=>Number(row.purchase_qty)<Number(row.min_qty));
                if(!!min_qty && this.warehouse !== '深圳发货仓'){
                    this.$reqKey('url_add_plan_stocking',false);
                    this.$message({type:'warning',message:`SKU:${min_qty.sku}的采购数量必须大于等于它的最小起订量！`});
                    return;
                }
                editSupplierBuyers.forEach(row => {
                    let saveData = {};
                    let add = {};
                    let edit = {};
                    let summary = [];
                    let amout = {};
                    amout.expenses = row.expenses;
                    amout.invoice = row.invoice;
                    amout.supply_chain_finance = row.supply_chain_finance;
                    amout.tax_rate = row.tax_rate;
                    amout.external_number = row.external_number;
                    amout.discount = row.discount;
                    amout.description = row.description;
                    amout.currency_code = row.currency_code;
                    amout.tracking_number = row.purchase_plan_type === 'purchase_order_overcharged' ? row.tracking_number : '';
                    row.goods.forEach(goods => {
                        amout.supplier_id = goods.supplier_id;
                        amout.purchaser_id = goods.purchaser_id;
                    });
                    summary.push(amout);
                    tableGoodsData.forEach(item => {
                        if (item.supplier_id === row.supplier_id && item.purchase_plan_id === row.id) {
                            edit[item.sku_id] = {
                                purchaser_id: item.purchaser_id,
                                purchase_price: item.purchase_price,
                                purchase_qty: item.purchase_qty,
                                supplier_id: item.supplier_id,
                                currency_code:item.currency_code,
                                remark:item.remark?item.remark:''
                            };
                        } else {
                            add[item.sku_id] = {
                                purchaser_id: item.purchaser_id,
                                purchase_price: item.purchase_price,
                                purchase_qty: item.purchase_qty,
                                supplier_id: item.supplier_id,
                                currency_code:item.currency_code,
                                remark:item.remark?item.remark:''
                            };
                        }
                    });
                    let addedit = '';
                    if (edit) {
                        addedit = JSON.stringify({add: edit});
                        id = row.id; //<0?0:row.id;
                    } else {
                        addedit = JSON.stringify({add: add});
                        id = '';
                    }
                    saveData = {
                        id: id === -1 ? 0 : id,
                        warehouse_id: this.warehouse_id,
                        supplier_id: row.supplier_id,
                        currency_code:row.currency_code,
                        sku_json: addedit,
                        summary: JSON.stringify(summary),
                        status: 0,
                        purchase_plan_type: row.purchase_plan_type,
                        purchase_order_code: row.purchase_order_code,
                    };
                    saveDataList.push(saveData);
                });
                let deleteIds = [];
                let editId = [];
                editSupplierBuyers.forEach(item => {
                    editId.push(item.id);
                });
                this.id.forEach(params => {
                    if (editId.indexOf(params) === -1) {
                        deleteIds.push(params);
                    }
                });
                let data = {};
                if (deleteIds.length >= 1) {
                    data = {
                        deleteIds: deleteIds,
                        saveDataList: JSON.stringify(saveDataList)
                    };
                } else {
                    data = {
                        saveDataList: JSON.stringify(saveDataList)
                    };
                }
                if (id === undefined || id === -1) {
                    id = 0;
                }
                this.filterLists.forEach(row => {
                    let ret = 0;
                    row.goods.forEach(goods => {
                        const price = goods.purchase_price || 0;
                        const count = goods.purchase_qty || 0;
                        ret += Number(price) * Number(count);
                    });
                    this.$set(row, 'total', ret);
                });
                let codeArr = this.filterLists.filter(row => {
                    if(row.currency_code === 'USD' && row.goods[0].purchase_times !==0){
                        return row.total < 2
                    }else if(row.currency_code === 'CNY' && row.goods[0].purchase_times !==0){
                        return row.total < 15
                    }else {
                        return ''
                    }
                }).map(item => {
                    return item.purchase_plan_code
                });
                let isZero = false;
                let skuArr = [];
                this.filterLists.forEach(row => {
                    if(row.purchase_plan_type === 'normal_purchasing'){
                        if(row.goods.some(item =>Number(item.purchase_price) ===0)){
                            isZero = true
                        }
                    }else if(row.purchase_plan_type === 'purchase_order_overcharged'){
                        let arr = row.goods.filter(item =>Number(item.purchase_price) ===0).map(sku => sku.sku);
                        skuArr = skuArr.concat(arr)
                    }
                });
                if(isZero){
                    this.$message({type: 'warning', message: '采购单价不能为0'});
                    this.$reqKey('save_purchaser_edit', false);
                    return
                }
                if(skuArr.length > 0) {
                    let str = skuArr.join(',');
                    this.$confirm(`${str} 采购单价为0，是否确认为供应商多送？`, '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        if(codeArr.length > 0){
                            let str = codeArr.join(',');
                            this.$confirm(`${str} 采购总成本小于15元或者2美金, 是否继续采购 ?`, '提示', {
                                confirmButtonText: '继续采购',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.submit_filter(id, data);
                                this.$reqKey('save_purchaser_edit', false);
                            }).catch(() => {
                                this.$message({type: 'info', message: '已取消'});
                                this.$reqKey('save_purchaser_edit', false);
                            });
                        }else {
                            this.submit_filter(id, data);
                            this.$reqKey('save_purchaser_edit', false);
                        }
                    }).catch(() => {
                        this.$message({type: 'info', message: '已取消'});
                        this.$reqKey('save_purchaser_edit', false);
                    });
                }else {
                    if(codeArr.length > 0){
                        let str = codeArr.join(',');
                        this.$confirm(`${str} 采购总成本小于15元或者2美金, 是否继续采购 ?`, '提示', {
                            confirmButtonText: '继续采购',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.submit_filter(id, data);
                            this.$reqKey('save_purchaser_edit', false);
                        }).catch(() => {
                            this.$message({type: 'info', message: '已取消'});
                            this.$reqKey('save_purchaser_edit', false);
                        });
                    }else {
                        this.submit_filter(id, data);
                        this.$reqKey('save_purchaser_edit', false);
                    }
                }
            },
            submit() {
                for(let i = 0; i < this.filterLists.length; i++){
                    if(!!this.filterLists[i].external_number.length && this.filterLists[i].external_number.length <18){
                        this.$message({type: 'warning', message: '外部流水号为18位数值'});
                        this.bordColor = true;
                        this.$reqKey('submit_purchaser_edit', false);
                        return;
                    }
                }
                let id = '';
                let saveDataList = [];
                let tableGoodsData = [];
                let editSupplierBuyers = this.$refs.editModule.map(row => {
                    row.tableData.tax_rate = row.tax_rate;
                    return row.tableData;
                });
                editSupplierBuyers.forEach(row => {
                    tableGoodsData.push(...row.goods);
                });
                let find_qty = tableGoodsData.find(row=>Number(row.purchase_qty)===0);
                if(!!find_qty){
                    this.$reqKey('submit_purchaser_edit',false);
                    this.$message({type:'warning',message:`SKU:${find_qty.sku}的采购数量必须大于0！`});
                    return;
                }
                let min_qty = tableGoodsData.find(row=>row.purchase_qty<row.min_qty);
                if(!!min_qty && this.warehouse !== '深圳发货仓'){
                    this.$reqKey('submit_purchaser_edit',false);
                    this.$message({type:'warning',message:`SKU:${min_qty.sku}的采购数量必须大于等于它的最小起订量！`});
                    return;
                }
                editSupplierBuyers.forEach(row => {
                    let saveData = {};
                    let add = {};
                    let edit = {};
                    let summary = [];
                    let amout = {};
                    amout.invoice = row.invoice;
                    amout.supply_chain_finance = row.supply_chain_finance;
                    amout.tax_rate = row.tax_rate;
                    amout.expenses = row.expenses;
                    amout.external_number = row.external_number;
                    amout.discount = row.discount;
                    amout.description = row.description;
                    amout.currency_code = row.currency_code;
                    amout.tracking_number = row.purchase_plan_type === 'purchase_order_overcharged' ? row.tracking_number : '';
                    row.goods.forEach(goods => {
                        amout.supplier_id = goods.supplier_id;
                        amout.purchaser_id = goods.purchaser_id;
                    });
                    summary.push(amout);
                    tableGoodsData.forEach(item => {
                        if (item.supplier_id === row.supplier_id && item.purchase_plan_id === row.id) {
                            edit[item.sku_id] = {
                                purchaser_id: item.purchaser_id,
                                purchase_price: item.purchase_price,
                                purchase_qty: item.purchase_qty,
                                supplier_id: item.supplier_id,
                                currency_code:item.currency_code,
                                remark:item.remark?item.remark:''
                            };
                        } else {
                            add[item.sku_id] = {
                                purchaser_id: item.purchaser_id,
                                purchase_price: item.purchase_price,
                                purchase_qty: item.purchase_qty,
                                supplier_id: item.supplier_id,
                                currency_code:item.currency_code,
                                remark:item.remark?item.remark:''
                            };
                        }
                    });
                    let addedit = '';
                    if (edit) {
                        addedit = JSON.stringify({add: edit});
                        id = row.id;
                    } else {
                        addedit = JSON.stringify({add: add});
                        id = '';
                    }
                    saveData = {
                        id: id === -1 ? 0 : id,
                        warehouse_id: this.warehouse_id,
                        supplier_id: row.supplier_id,
                        currency_code:row.currency_code,
                        sku_json: addedit,
                        summary: JSON.stringify(summary),
                        status: 1,
                        purchase_plan_type: row.purchase_plan_type,
                        purchase_order_code: row.purchase_order_code,
                        is_audit:1
                    };
                    saveDataList.push(saveData);
                });
                let deleteIds = [];
                let editId = [];
                this.filterSupplierBuyers.forEach(item => {
                    editId.push(item.id);
                });
                this.id.forEach(params => {
                    if (editId.indexOf(params) === -1) {
                        deleteIds.push(params);
                    }
                });
                let data = {};
                if (deleteIds.length >= 1) {
                    data = {
                        deleteIds: deleteIds,
                        saveDataList: JSON.stringify(saveDataList)
                    };
                } else {
                    data = {
                        saveDataList: JSON.stringify(saveDataList)
                    };
                }
                if (id === undefined || id === -1) {
                    id = 0;
                }
                this.filterLists.forEach(row => {
                    let ret = 0;
                    row.goods.forEach(goods => {
                        const price = goods.purchase_price || 0;
                        const count = goods.purchase_qty || 0;
                        ret += Number(price) * Number(count);
                    });
                    this.$set(row, 'total', ret);
                });
                let codeArr = this.filterLists.filter(row => {
                    if(row.currency_code === 'USD' && row.goods[0].purchase_times !==0){
                        return row.total < 2
                    }else if(row.currency_code === 'CNY' && row.goods[0].purchase_times !==0){
                        return row.total < 15
                    }else {
                        return ''
                    }
                }).map(item => {
                    return item.purchase_plan_code
                });
                let isZero = false;
                let skuArr = [];
                this.filterLists.forEach(row => {
                    if(row.purchase_plan_type === 'normal_purchasing'){
                        if(row.goods.some(item =>Number(item.purchase_price) ===0)){
                            isZero = true
                        }
                    }else if(row.purchase_plan_type === 'purchase_order_overcharged'){
                        let arr = row.goods.filter(item =>Number(item.purchase_price) ===0).map(sku => sku.sku);
                        skuArr = skuArr.concat(arr)
                    }
                });
                if(isZero){
                    this.$message({type: 'warning', message: '采购单价不能为0'});
                    this.$reqKey('submit_purchaser_edit', false);
                    return
                }
                if(skuArr.length > 0) {
                    let str = skuArr.join(',');
                    this.$confirm(`${str} 采购单价为0，是否确认为供应商多送？`, '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        if(codeArr.length > 0){
                            let str = codeArr.join(',');
                            this.$confirm(`${str} 采购总成本小于15元或者2美金, 是否继续采购 ?`, '提示', {
                                confirmButtonText: '继续采购',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.submit_filter(id, data);
                                this.$reqKey('submit_purchaser_edit', false);
                            }).catch(() => {
                                this.$message({type: 'info', message: '已取消'});
                                this.$reqKey('submit_purchaser_edit', false);
                            });
                        }else {
                            this.submit_filter(id, data);
                            this.$reqKey('submit_purchaser_edit', false);
                        }
                    }).catch(() => {
                        this.$message({type: 'info', message: '已取消'});
                        this.$reqKey('submit_purchaser_edit', false);
                    });
                }else {
                    if(codeArr.length > 0){
                        let str = codeArr.join(',');
                        this.$confirm(`${str} 采购总成本小于15元或者2美金, 是否继续采购 ?`, '提示', {
                            confirmButtonText: '继续采购',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.submit_filter(id, data);
                            this.$reqKey('submit_purchaser_edit', false);
                        }).catch(() => {
                            this.$message({type: 'info', message: '已取消'});
                            this.$reqKey('submit_purchaser_edit', false);
                        });
                    }else {
                        this.submit_filter(id, data);
                        this.$reqKey('submit_purchaser_edit', false);
                    }
                }
            },
            submit_filter(id, data) {//更新请求
                this.$http(api_updata_plan, id, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: `操作成功!`
                    });
                    this.show = false;
                    this.id.forEach(row => {
                        this.$emit("edit-update", row, res.new_ids, 0);
                    });
                }).catch(code => {
                    this.bordColor = true;
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            log_show(row) {
                this.logDialog = true;
                this.lookList.forEach(item => {
                    if (item.supplier_id === row.supplier_id) {
                        row.id = item.id;
                    }
                });
                this.log_init(row.id);
            },
            log_init(id) {
                this.$http(add_look_log, {purchase_plan_id: id}).then(res => {
                    this.actionLog = res.data;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })

            },
            //添加  获取sku信息
            add_sku(data) {
                this.$http(api_add_sku, data).then(res => {
                    res.id = data.sku_id;
                    res.purchase_price = res.supplier_price;
                    res.purchase_qty = 0;
                    res.is_replace = 0;
                    res.in_qty = "";
                    res.arrival_qty = 0;
                    res.action = "add";
                    this.goodsList.push(res);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            selected(sels) {
                sels.forEach(data => {
                    data.forEach(row => {
                        if (this.selectes.indexOf(row.id) === -1) {
                            this.addSkuid.push(row.id);
                            this.selectes.push(row.id);
                            this.add_sku({
                                sku_id: row.id,
                                warehouse_id: this.warehouse_id,
                                purchase_plan_type: this.selectMark === 'purchase_order_overcharged' ? 2 : 1
                            })
                        } else {
                            this.$message(`SKU为：${row.sku} 已存在`);
                        }
                    });
                });
                this.$reqKey('add_goods', false);
            },
            //查看  获取sku信息
            look_sku() {
                this.loading = true;
                this.supplierClasses = [];
                this.id.forEach(row => {
                    let data = {
                        purchase_plan_id: row,
                        page:1,
                        pageSize:200
                    };
                    this.$http(add_look_sku, data).then(res => {
                        res.data.forEach(row => {
                            row.purchase_plan_id_old = row.purchase_plan_id;
                            row.supplier_old = row.supplier;
                            this.selectes.push(row.sku_id);
                        });
                        this.goodsList = [...this.goodsList,...res.data];
                        this.goodsListOld = [...this.goodsListOld,...res.data];
                        this.loading = false;
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'})
                    });
                });
            },
            change_dialog(val) {
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
        computed: {
            checkAll() {
                return this.goodsList.every(row => row.isCheck === true);
            },
            count() {
                return this.lookList.length;
            },
            purchase_sum() {
                let sum = 0;
                this.goodsList.forEach(num => {
                    sum += Number(num.purchase_qty)
                });
                return sum;
            },
            filterSupplierBuyers() {
                let shipFee = [];
                this.lookList.forEach(row => {
                    let data = {
                        list: row.ship_fee_discount_json,
                        purchase_plan_type:row.purchase_plan_type,
                        purchase_order_code:row.purchase_order_code,
                        purchase_plan_code: row.purchase_plan_code,
                        purchase_plan_id: row.id,
                        currency_code:row.currency_code,
                        description: row.description,
                        select_option: row.select_option || {},
                        invoice: row.invoice,
                        supply_chain_finance: row.supply_chain_finance,
                        tax_rate: row.tax_rate,
                    };
                    shipFee.push(data || {});
                });
                let ret = {};
                this.goodsList.forEach(goods => {
                    const key = `${goods.supplier_id}-${goods.warehouse}-${goods.purchase_plan_id}`;
                    let ship = shipFee.find(row => {
                        return row.list.supplier_id === goods.supplier_id && row.purchase_plan_id === goods.purchase_plan_id;
                    });
                    if (!ship) {
                        ship = {
                            list: {
                                expenses: 0,
                                tracking_number: "",
                                external_number: "",
                                discount: 0,
                                description: "",
                            },
                            purchase_plan_type:'normal_purchasing',
                            purchase_order_code:'',
                            purchase_plan_code: '',
                            purchase_plan_id: '',
                            currency_code:''
                        };
                    }
                    if(undefined === ret[key]){
                        this.$set(ret, key, {
                            supplier: goods.supplier,
                            supplier_id: goods.supplier_id,
                            purchaser: goods.purchaser,
                            purchaser_id: goods.purchaser_id,
                            warehouse: goods.warehouse,
                            purchase_plan_code: ship.purchase_plan_code || goods.purchase_plan_code,
                            id: goods.purchase_plan_id,
                            expenses: ship.list.expenses,
                            invoice: goods.invoice || ship.invoice,
                            supply_chain_finance:goods.supply_chain_finance ||ship.supply_chain_finance,
                            select_option: goods.select_option || ship.select_option,
                            tax_rate: goods.tax_rate || ship.tax_rate,
                            tracking_number: ship.list.tracking_number,
                            discount: ship.list.discount,
                            external_number: ship.list.external_number,
                            description: ship.description,
                            goods: [],
                            create_time:goods.create_time,
                            purchase_order_code:ship.purchase_order_code,
                            purchase_plan_type:this.selectMark,
                        });
                    }
                    this.$set(ret[key],'currency_code',ship.currency_code||goods.currency_code);
                    ret[key].goods.push(goods);
                    ret[key].totalWeight = ret[key].goods.map(row => row.weight).reduce((total, weight) => total += weight);
                });
                return Object.values(ret);
            },
            filterSupplierBuyersLists() {
                switch (this.supplier) {
                    case -1:
                        if (this.purchase === -1) {
                            return this.filterSupplierBuyers;
                        } else {
                            return this.filterSupplierBuyers.filter(row => {
                                return row.purchaser_id === this.purchase;
                            });
                        }
                    default:
                        if (this.purchase === -1) {
                            return this.filterSupplierBuyers.filter(row => {
                                return row.supplier_id === this.supplier;
                            });
                        } else {
                            return this.filterSupplierBuyers.filter(row => {
                                return row.purchaser_id === this.purchase && row.supplier_id === this.supplier;
                            });
                        }
                }
            },
            filterSupplierGoodsLists() {
                switch (this.supplier) {
                    case -1:
                        if (this.purchase === -1) {
                            return this.goodsList;
                        } else {
                            return this.goodsList.filter(row => {
                                return row.purchaser_id === this.purchase;
                            });
                        }
                    default:
                        if (this.purchase === -1) {
                            return this.goodsList.filter(row => {
                                return row.supplier_id === this.supplier;
                            });
                        } else {
                            return this.goodsList.filter(row => {
                                return row.purchaser_id === this.purchase && row.supplier_id === this.supplier;
                            });
                        }
                }
            },
            filterLists() {
                let lists = [];
                this.filterSupplierBuyersLists.forEach(row => {
                    row.goods.forEach(item => {
                        if (item.isCheck === undefined) {
                            this.$set(item, 'isCheck', false);
                        }
                        if (item.hasSupplier === undefined) {
                            this.$set(item, 'hasSupplier', true);
                        }
                    });
                    if (row.external_number === undefined) {
                        this.$set(row, 'external_number', '');
                    }
                    lists.push(row);
                });
                return lists
            },
            deleteLabel() {
                let len = this.goodsListSelect.length;
                if (len > 0) {
                    return `删除(${len})`;
                } else {
                    return `请选择删除商品`
                }
            },
            supplierLists() {
                let ret = [{label: '全部', value: -1}];
                this.goodsList.forEach(row => {
                    if (row.supplier_id && (ret.indexOfFun(r => r.value === row.supplier_id) <= -1)) {
                        if (!row.supplier) {
                            ret.push({
                                label: '未指定供应商',
                                value: row.supplier_id
                            })
                        } else {
                            ret.push({
                                label: row.supplier,
                                value: row.supplier_id
                            })
                        }
                    }
                });
                return ret;
            },
            purchaseLists() {
                let ret = [{label: '全部', value: -1}];
                this.goodsList.forEach(row => {
                    if (row.purchaser_id && (ret.indexOfFun(r => r.value === row.purchaser_id) <= -1)) {
                        ret.push({
                            label: row.purchaser,
                            value: row.purchaser_id
                        })
                    }
                });
                return ret;
            },
        },
        filters: {
            supFilter(row) {
                if (row.supplier_id === 0) {
                    return "未指定供应商"
                } else {
                    return row.supplier || "没有名字的供应商";
                }
            },
            filterAmount(val) {
                return !!val&&!isNaN(Number(val))?Number(val).toFixed(3):val;
            }
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.$emit('input', val);
            },
            'lookList'(val) {
                if (val) {
                    this.lookList.forEach(row => {
                        this.warehouse_id = row.warehouse_id;
                        this.warehouse = row.warehouse;
                    });
                }
            }
        },
        props: {
            value: {},
            edit: {
                required: true,
                type: Boolean,
            },
            dispose: {
                type: Boolean,
            },
            lookList: {
                required: true,
                type: Array,
            },
            lookData: {
                required: true,
                type: Object,
            },
            id: {},
            selectMark: {},
            cancelPurchase: {}
        },
        components: {
            card,
            analyze,
            pageDialog: require('../../../components/page-dialog.vue').default,
            labelItem: require('../../../components/label-item.vue').default,
            labelPanel: require('../../../components/label-panel.vue').default,
            addGoods: require('./add-goods.vue').default,
            scrollSelect: require('../../../components/scroll-select.vue').default,
            addSupplier: require('./add-supplier.vue').default,
            priceChange: require('./price-change.vue').default,
            addPrice: require('./add-price.vue').default,
            uiInput: require('../../../components/ui-input.vue').default,
            selectText: require('../../../components/select-text.vue').default,
            uiTips: require('../../../components/ui-tips.vue').default,
            virtualSelect: require('../../../components/virtual-select.vue').default,
            uiLimitNumber: require("../../../components/ui-limit-number.vue").default,
            purchaser: require('../../../api-components/purchaser.vue').default,
            uiTip: require('../../../components/ui-tip.vue').default,
            importExcel: require('./import-excel.vue').default,
            actionLog: require('./action-log.vue').default,
            formEditTable: require('./form-edit-table').default,
            batchRemark:require('../../order/local/batch-remark').default
        }
    }
</script>
