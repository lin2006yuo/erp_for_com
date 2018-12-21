<template>
    <page-dialog size="full"
                 @open="open"
                 v-model="show"
                 :title="titles"
                 class="p-form-add"
                 :min-height="300"
                 :loading="loading"
                 @change="change_dialog"
                 :close-on-click-modal="false"
                 width="90%" left="10%">
        <el-form>
            <el-row>
                <el-col :span="10" v-if="selectMark==='purchase_order_overcharged'">
                    <el-form-item label="请选择采购单：">
                        <el-input v-model="snText"
                                  class="ml-sm"
                                  style="display: inline-block;"
                                  @input="textInput"></el-input>
                        <el-button type="primary"
                                   size="mini" @click.native="see_purchase">查询采购单
                        </el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="采购仓库：" required>
                        <el-select placeholder="请选择需操作仓库"
                                   v-model="warehouse_id"
                                   ref="warehouse_id"
                                   v-mouse-side.mousewheel="()=>{$refs.warehouse_id.visible=false}"
                                   class="inline"
                                   :disabled="searchShow || selectMark === 'stocking'">
                            <el-option :key="warehouse.value"
                                       v-for="warehouse in warehouses"
                                       :label="warehouse.label"
                                       :value="warehouse.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="供应商：">
                        <el-select v-model="supplier"
                                   class="inline"
                                   ref="supplier"
                                   v-mouse-side.mousewheel="()=>{$refs.supplier.visible=false}"
                                   :disabled="searchShow || selectMark === 'stocking'">
                            <el-option :key="supplier.value"
                                       v-for="supplier in supplierLists"
                                       :label="supplier.label"
                                       :value="supplier.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-row>
            <el-button type="primary"
                       size="mini"
                       @click.native="add_goods"
                       :disabled="!warehouse_id || selectMark==='stocking'">添加商品
            </el-button>
            <el-button type="primary" size="mini"
                       :disabled="!warehouse_id || selectMark==='stocking'"
                       @click.native="showImport=true">EXCEL导入
            </el-button>
            <el-button type="danger" size="mini"
                       @click.native="delete2"
                       :disabled="goodsListSelect.length===0 || selectMark==='stocking'">
                {{deleteLabel}}
            </el-button>
            <label-item class="fr"
                        label="统一分配采购员："
                        v-if="!searchShow">
                <purchaser class="inline"
                           ref="purchaser"
                           v-model="purchaser_id"
                           @input="change_buyers"></purchaser>
            </label-item>
        </el-row>
        <page class="p-form-edit-table">
            <form-edit-table
                ref="editModule"
                v-for="(data,index) in filterLists"
                :key="index"
                :table-data="data"
                :is-check-all="checkAll"
                :edit="edit"
                :select-mark="selectMark"
                :warehouse_id="warehouse_id"
                :attachment-obj="attachmentObj"
                @row_add_goods="row_add_goods"
                @selected="selected"
                @analyze="analyze"
                @modif-supplie="modifSupplie"
                @newPrice="newPrice"
                @selection-change="selection_row"
                @input-purchaser="input_purchaser"
                @head_check="head_check"
                @log_show="log_show">
            </form-edit-table>
            <div class="p-add-message" v-if="filterSupplierBuyers.length===0">
                {{warehouse_id?'请添加商品！':'请选择操作仓库！'}}
            </div>
        </page>
        <div class="inline mr-sm p-form-edit-count">{{`共${count}条采购计划`}}</div>
        <span slot="footer">
            <div class="inline" v-if="stockingShow">
               <permission tag="request-button" :route="apis.url_add_plan_stocking" :mintime="200"
                           req-key="url_add_plan_stocking" :request="add_save"
                           :disabled="count==0">确定</permission>
            <permission tag="request-button" :route="apis.url_add_plan_stocking" :mintime="200"
                        req-key="url_add_plan_stocking" :request="submit"
                        :disabled="count==0">提交审批</permission>
           <el-button size="mini" class="mr-sm" @click.native="show=false">关闭</el-button>
            </div>
            <div class="inline" v-else>
               <permission tag="request-button" :route="apis.url_add_plan" :mintime="200"
                           req-key="url_add_plan_stocking" :request="add_save"
                           :disabled="count==0">确定</permission>
            <permission tag="request-button" :route="apis.url_add_plan" :mintime="200" req-key="url_add_plan_stocking"
                        :request="submit"
                        :disabled="count==0">提交审批</permission>
                <el-button size="mini" class="mr-sm" @click.native="show=false">关闭</el-button>
            </div>
        </span>
        <add-goods v-model="showGoods" ref="addGoods" @selected="selected"></add-goods>
        <add-supplier v-model="showDialog" :supplier-data="supplierData"
                      @update_supplier="update_supplier"></add-supplier>
        <analyze v-model="analyzeDialog" :form="analyzeData"></analyze>
        <add-price v-model="showPrice" :supplierData="newPriceData" @confirm="updata_price"></add-price>
        <import-excel v-model="showImport" :warehouseId="warehouse_id" @files-data="files_data"></import-excel>
    </page-dialog>
</template>
<style lang="stylus">
    .p-form-add {
        .p-form-edit-table {
            max-height 500px;
            overflow-y scroll;
            margin-top: 10px;
            .p-add-message {
                text-align center;
                margin-top 30px;
            }
        }
        .dialog__body {
            overflow-y: hidden !important;
        }
        .el-card {
            overflow: initial;
        }
        .body {
            z-index: 999;
        }
        .el-pagination {
            padding: 5px;
        }
        .png:hover {
            cursor: pointer;
        }
        .p-form-edit-count {
            color: #475669;
            position absolute;
            bottom 15px;
        }
    }
</style>
<script>

    import {
        api_warehouses, api_add_sku, getUser, add_plan, api_import_sku,
        add_plan_stocking, url_add_plan, url_add_plan_stocking
    } from '@/api/procurement-plan';
    import {api_get_goods_supp} from "@/api/supplier-quote";
    import {
        publish_edit_supplier,
        api_getSupplier,
        api_publish_edit_carrier,
        api_look_detail,
        api_publish_look_sku,
        api_get_sku
    } from '@/api/purchase';
    import {api_get_warehouse} from "@/api/report-channel.js";
    import analyze from '../purchasing/add-analyze.vue'

    export default {
        permission: {
            url_add_plan,
            url_add_plan_stocking
        },
        page: {
            devinfo: {
                frontEnd: '徐梦娇;黎宏珍',
                backEnd: '杨伟权;谭斌',
                createTime: '2017-4-22',
                updateTime: '2017-8-22'
            }
        },
        data() {
            return {
                snText: '',
                warehouse_id: "",
                showGoods: false,
                showDialog: false,
                showPrice: false,
                searchShow: false,
                showImport: false,
                show: this.value,
                purchaser_id: '',
                goodsList: [],
                goodsListSelect: [],
                buyers: [],
                warehouses: [],
                suppliers: [],
                supplier_id: '',
                ship_fee: 0,
                discount_amout: 0,
                description: '',
                page: 1,
                pageSize: 20,
                supplier: -1,
                selectes: [],
                supplierData: [],
                supplierId: 0,
                analyzeDialog: false,
                analyzeData: {},
                newPriceData: [],
                purchase_qtys: {},
                purchase_prices: {},
                supplierBuyers: [],
                trackingNumber: 0,
                stockingShow: false,
                edit: true,
                loading: false,
                attachmentObj:{}
            }
        },
        mounted() {
            this.init_warehouses();
            this.init_publish_edit_supplier();
            this.$http(getUser).then(res => {
                this.buyers = res;
            }).catch(code => {
                this.$message({message: code.message || code, type: 'error'});
            })
        },
        methods: {
            open() {
                this.attachmentObj = {};
                this.init_warehouses();
                this.goodsListSelect = [];
                this.description = '';
                this.searchShow = false;
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
            change_purchaser(row) {
                row.purchaser_id = "";
                row.purchaser = "";
            },
            add_goods() {
                this.showGoods = true;
                this.$refs.addGoods.snText = "";
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
                    let find = option.goods.find(item => item.sku === row.sku);
                    if (!!find) {
                        this.$set(row, 'purchaser_id', option.purchaser_id);
                        this.$set(row, 'purchaser', option.purchaser);
                    }
                });
            },
            purchase_qty(row) {
                return this.purchase_qtys[row.sku_id] || 0;
            },
            blur_purchase_qty(row) {
                if (this.purchase_qtys[row.sku_id] < 0) {
                    this.purchase_qtys[row.sku_id] = 0;
                    this.$message({type: "error", message: `请输入正整数!`});
                }
                this.purchase_qtys[row.sku_id] = Number(this.purchase_qtys[row.sku_id]).toFixed(0);
            },
            blur_purchase_price(row) {
                if (Number(this.purchase_prices[row.sku_id]) < 0) {
                    this.purchase_prices[row.sku_id] = 0;
                    this.$message({type: "error", message: `请输入三位小数的正数!`});
                }
                this.purchase_prices[row.sku_id] = Number(this.purchase_prices[row.sku_id]).toFixed(3);
            },
            purchase_price(row) {
                return this.purchase_prices[row.sku_id] || 0;
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
                    skuList.currency_code = 'cny';
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
            textInput() {
                this.snText = this.snText.replace(/\s*/g, '');
            },
            supplier_goods_amount(row) {
                let ret = 0;
                row.goods.forEach(goods => {
                    const price = this.purchase_prices[goods.sku_id] || 0;
                    const count = this.purchase_qtys[goods.sku_id] || 0;
                    ret += Number(price) * Number(count);
                });
                return ret;
            },
            supplier_goods_tatol(row) {
                return this.supplier_goods_amount(row) + parseFloat(row.expenses) - parseFloat(row.discount);
            },
            files_data(val) {
                val.forEach(row => {
                    if (this.selectes.indexOf(row.sku_id) === -1) {
                        this.selectes.push(row.sku_id);
                        row.id = row.sku_id;
                        this.purchase_prices[row.sku_id] = row.supplier_price;
                        this.purchase_qtys[row.sku_id] = row.purchase_qty;
                        row.link = row.link;
                        if (!row.purchase_price) {
                            row.purchase_price = row.supplier_price || 0;
                        }
                        this.goodsList.push(row);
                    } else {
                        this.$message(`SKU为：${row.sku} 已存在`);
                    }
                });
            },
            //查询采购单新增功能
            see_purchase() {
                this.goodsList = [];
                this.$http(api_publish_edit_carrier, {
                    snType: 'purchase_order_code',
                    snText: [this.snText]
                }).then(res => {
                    if (!this.snText) {
                        this.warehouse_id = '';
                        this.supplier = -1;
                        this.searchShow = false;
                    } else {
                        if (res.count === 0) {
                            this.$message({type: 'warning', message: `没有数据，请核查单号是否错误!`});
                        } else {
                            res.data.length > 0 && this.look_order(res.data[0].id);
                            this.searchShow = true;
                            this.trackingNumber = res.data[0].tracking_number;
                        }
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            //查看采购单详情
            look_order(data) {
                this.$http(api_look_detail, data).then(res => {
                    this.warehouse_id = res.warehouse_id;
                    this.get_sku(res.id, res.supplier, res.supplier_id, res.purchase_user_id, res.purchaser)
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            //获取sku数据
            get_sku(data, supplier, supplier_id, purchase_user_id, purchaser) {
                this.goodsList = [];
                this.$http(api_publish_look_sku, {purchase_order_id: data}).then(res => {
                    //插入 供应商 供应商id 采购员和采购员id
                    let list = Object.keys(res.data);
                    for (let index = 0; index <= list.length; index++) {
                        res.data[index].supplier = supplier;
                        res.data[index].supplier_id = supplier_id;
                        res.data[index].purchaser_id = purchase_user_id;
                        res.data[index].purchaser = purchaser;
                        res.data[index].id = res.data[index].sku_id;
                        this.supplier = supplier_id;
                        this.selectes.push(res.data[index].sku_id);
                        this.goodsList.push(res.data[index]);
                        if (this.searchShow) {
                            this.purchase_prices[res.data[index].sku_id] = 0;
                        } else {
                            this.purchase_prices[res.data[index].sku_id] = res.data[index].supplier_price;
                        }
                    }
                }).catch(code => {
                    console.log(code);
                })
            },

            //数据分析（更改的需求）
            analyze(data) {
                this.analyzeData = {sku: data.sku, sku_id: data.sku_id, warehouse_id: data.warehouse_id};
                this.analyzeDialog = true;
            },
            //判断是否是 数组
            polyType(data) {
                return data instanceof Array;
            },
            /*修改供应商*/
            modifSupplie(data, row) {
                this.supplierId = row.id;
                let skuId = {
                    sku_id: row.sku_id
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
                        let sameCurrencyList = res.message.filter(row => row.currency_code === data.currency_code);
                        if (sameCurrencyList.length >= 1) {
                            this.showDialog = true;
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
                        let sameCurrencyList = res.message.filter(row => row.currency_code === data.currency_code);
                        if (sameCurrencyList.length >= 1) {
                            this.showDialog = true;
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
            updata_price(checkSupplier) {
                this.goodsList.forEach(data => {
                    if (this.supplierId === data.id) {
                        data.section = checkSupplier.section;
                    }
                })
            },
            update_supplier(checkSupplier) {
                this.goodsList.forEach(data => {
                    if (this.supplierId === data.id) {
                        data.supplier = checkSupplier[0].company_name;
                        data.supplier_id = checkSupplier[0].supplier_id;
                        data.section = checkSupplier[0].section;
                        data.balance_type_text = checkSupplier[0].balance_type_text;
                        this.purchase_prices[data.sku_id] = checkSupplier[0].price;
                    }
                })
            },
            /*---------end*/
            //更改采购员
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
                this.goodsListSelect.forEach(item => {
                    this.goodsList.forEach((data, index) => {
                        if (data.id === item.id) {
                            let i = this.selectes.indexOf(data.sku_id);
                            this.selectes.splice(i, 1);
                            this.goodsList.splice(index, 1);
                        }
                    });
                });
                this.goodsListSelect = this.goodsList.filter(row => {
                    return row.isCheck === true
                });
            },
            //修改分页
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
            },
            handleCurrentChange(page) {
                this.page = page;
            },
            //初始化仓库
            init_warehouses() {
                if (this.selectMark === 'stocking') {
                    this.$http(api_get_warehouse, {type: [6]}).then(res => {
                        this.warehouses = res.map(warehouse => {
                            return {
                                value: warehouse.id,
                                label: warehouse.name
                            }
                        });
                    });
                    return;
                }
                this.$http(api_warehouses).then(res => {
                    this.warehouses = res;
                })
            },
            //初始化供应商
            init_publish_edit_supplier() {
                this.$http(publish_edit_supplier).then(res => {
                    this.suppliers = res;
                })
            },
            //输入触发公司
            fix_params({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    snText: keyword,
                    snType: 'company_name'
                };
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
            //保存
            add_save() {
                return this.save(false)
            },
            save(isApproval) {
                if (!this.warehouse_id) {
                    this.$reqKey('url_add_plan_stocking', false);
                    this.$message({type: 'warning', message: '请选择采购仓库'});
                    return;
                }
                let add = {};
                let find_qty = this.goodsList.find(row => Number(row.purchase_qty) === 0);
                if (!!find_qty) {
                    this.$reqKey('url_add_plan_stocking', false);
                    this.$message({type: 'warning', message: `SKU:${find_qty.sku}的采购数量必须大于0！`});
                    return;
                }
                let min_qty = this.goodsList.find(row => row.purchase_qty < row.min_qty);
                if (!!min_qty) {
                    this.$reqKey('url_add_plan_stocking', false);
                    this.$message({type: 'warning', message: `SKU:${min_qty.sku}的采购数量必须大于等于它的最小起订量！`});
                    return;
                }
                let greater_proposal = this.goodsList.find(row=>{
                    if(row.proposal_qty) {
                        return Number(row.purchase_qty) > Number(row.proposal_qty)
                    }
                    return Number(row.purchase_qty)!==0
                });
                if(!!greater_proposal&&!greater_proposal.remark){
                    this.$reqKey('url_add_plan_stocking',false);
                    this.$message({type:'warning',message:`SKU:${greater_proposal.sku}采购数量与建议采购不一致，请填写批注！`});
                    return;
                }
                this.goodsList.forEach(row => {
                    add[row.id] = {
                        purchaser_id: row.purchaser_id,
                        purchase_price: row.purchase_price,
                        purchase_qty: row.purchase_qty,
                        supplier_id: row.supplier_id,
                        currency_code: row.currency_code,
                        remark: row.remark ? row.remark : ''
                    };
                    if (this.stockingShow) { //TODO:添加备货申请id
                        row.apply_ids && (add[row.id].apply_ids = row.apply_ids);
                    }
                });
                let summary = this.$refs.editModule.map(row => {
                    return {
                        expenses:row.tableData.expenses,
                        discount:row.tableData.discount,
                        external_number:row.tableData.external_number,
                        description:row.tableData.description,
                        tracking_number:row.tableData.tracking_number,
                        currency_code:row.tableData.currency_code,
                        supplier_id:row.tableData.goods.find(item=>item.supplier_id).supplier_id,
                        purchaser_id:row.tableData.goods.find(item=>item.purchaser_id).purchaser_id,
                    }
                });
                let saveData = {
                    warehouse_id: this.warehouse_id,
                    sku_json: {add: add},
                    summary: summary,
                    purchase_plan_type: this.selectMark,
                    purchase_order_code: this.selectMark === 'purchase_order_overcharged' ? this.snText : ''
                };
                if(this.selectMark==='sample'){
                    let attachment = {};
                    Object.keys(this.attachmentObj).forEach(key=>{
                        attachment[key] = this.attachmentObj[key].map(atta=>{
                            return !!atta.path?atta.path:atta.file.image
                        })
                    });
                    saveData.attachment = attachment;
                }
                isApproval&&(saveData.apply = 1);
                if (this.stockingShow) {
                    saveData.ids = this.planData.ids;
                    saveData.purchase_plan_type = 'ready_purchasing';
                    return this.$http(add_plan_stocking, saveData).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        this.show = false;
                        this.$emit("add-update", res.id, isApproval);
                        return Promise.resolve();
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('url_add_plan_stocking', false);
                        }, 200);
                    });
                } else {
                    return this.$http(add_plan, saveData).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        this.show = false;
                        this.$emit("add-update", res.id, isApproval);
                        return Promise.resolve();
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('url_add_plan_stocking', false);
                        }, 200);
                    });
                }
            },
            submit() {
                return this.save(true);
            },
            //获取sku信息
            add_sku(data) {
                this.$http(api_add_sku, data).then(res => {
                    res.forEach(row => {
                        !row.purchaser_id && (this.$set(row, 'purchaser_id', ''));
                        !row.purchase_qty && (row.purchase_qty = 0);
                        row.id = row.sku_id;
                        if (this.selectMark === 'purchase_order_overcharged' && this.searchShow) {
                            let skuId = {
                                sku_id: row.sku_id
                            };
                            this.$http(api_getSupplier, skuId).then(res => {
                                if (res.message) {
                                    let find = res.message.find(item => {
                                        return item.supplier_id === this.supplier;
                                    });
                                    if (!!find) {
                                        row.supplier = find.company_name;
                                        row.supplier_id = find.supplier_id;
                                        row.section = find.section;
                                        row.balance_type_text = find.balance_type_text;
                                    } else {
                                        this.$message({type: 'warning', message: `请选择当前供应商的商品!`});
                                    }
                                }
                            }).catch(code => {
                                this.$message({type: "error", message: code.message || code});
                            }).finally(() => {
                                setTimeout(() => {
                                    this.$reqKey('add_goods', false);
                                }, 200);
                            });
                            this.purchase_prices[row.sku_id] = 0;
                            this.goodsList.push(row);
                        } else {
                            this.$reqKey('add_goods', false);
                            if (!row.purchase_price) {
                                row.purchase_price = row.supplier_price || 0;
                            }
                            this.purchase_prices[row.sku_id] = row.supplier_price;
                            this.goodsList.push(row);
                        }
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                }).finally(() => {
                    this.loading = false;
                    setTimeout(() => {
                        this.$reqKey('add_goods', false);
                    }, 200);
                });
            },
            selected(sels) {
                if (!this.warehouse_id) {
                    this.$reqKey('add_goods', false);
                    this.$message({type: "error", message: `请选择仓库`});
                    return false
                }
                let filterArr = [];
                sels.forEach(data => {
                    data.forEach(row => {
                        if (this.selectes.indexOf(row.sku_id) === -1) {
                            this.selectes.push(row.sku_id);
                            filterArr.push(row.sku_id);
                        } else {
                            this.$reqKey('add_goods', false);
                            this.$message(`SKU为：${row.sku} 已存在`);
                        }
                    });
                });
                if (filterArr.length > 0) {
                    this.loading = true
                    this.add_sku({
                        sku_ids: filterArr,
                        warehouse_id: this.warehouse_id
                    })
                }
            },
            change_dialog(val) {
                if (val) {
                    this.selectes = [];
                    this.goodsList = [];
                    this.goodsListSelect = [];
                    this.ship_fee = 0;
                    this.discount_amout = 0;
                    this.warehouse_id = "";
                    this.supplier = -1;
                    this.purchaser_id = '';
                    this.snText = '';
                }
            }
        },
        computed: {
            checkAll() {
                return this.goodsList.every(row => row.isCheck === true);
            },
            titles() {
                switch (this.selectMark) {
                    case 'purchase_order_overcharged':
                        return "新建采购计划(供应商多送)";
                    case 'stocking':
                        return "新建采购计划(备货采购)";
                    case 'sample':
                        return "新建采购计划(样品)";
                    default:
                        return "新建采购计划(正常采购)";
                }
            },
            count() {
                return this.filterSupplierBuyers.length;
            },
            purchase_sum() {
                let sum = 0;
                this.goodsList.forEach(num => {
                    const purchase_qty = this.purchase_qtys[num.sku_id] || 0;
                    sum += Number(purchase_qty);
                });
                return sum;
            },
            filterSupplierBuyers() {
                let ret = {};
                this.goodsList.forEach(goods => {
                    if (goods.isCheck === undefined) {
                        this.$set(goods, 'isCheck', false);
                    }
                    if (goods.hasSupplier === undefined) {
                        this.$set(goods, 'hasSupplier', true);
                    }
                    if (goods.purchase_price === undefined) {
                        if (goods.lastest_purchase_price === '无' || goods.lastest_purchase_price === '') {
                            this.$set(goods, 'purchase_price', 0);
                        } else {
                            this.$set(goods, 'purchase_price', goods.lastest_purchase_price);
                        }
                    }
                    const key = `${goods.supplier_id}`;
                    ret[key] = ret[key] || {
                        supplier: goods.supplier,
                        supplier_id: goods.supplier_id,
                        purchaser: goods.purchaser,
                        purchaser_id: goods.purchaser_id,
                        expenses: 0,
                        tracking_number: this.trackingNumber,
                        discount: 0,
                        external_number: '',
                        description: '',
                        goods: [],
                        attachment: []
                    };
                    this.$set(ret[key], 'currency_code', ret[key].currency_code || goods.currency_code || 'CNY');
                    ret[key].goods.push(goods);
                });

                if (this.selectMark === 'stocking') {
                    Object.keys(ret).forEach(key => {
                        let description = {};
                        ret[key].goods.forEach(row => {
                            let plans = row.ready_inventory_ids.split(',');
                            plans.forEach(row => {
                                if (!description.hasOwnProperty(row)) {
                                    description[row] = this.stockDescription[row];
                                }
                            });
                        });
                        Object.values(description).forEach(row => {
                            ret[key].description += ` 备货申请单号：${row.code}，申请人：${row.creator}\n`;
                        });
                    });
                }
                return Object.values(ret);
            },
            filterSupplierGoodsLists() {
                switch (this.supplier) {
                    case -1:
                        return this.goodsList;
                    default:
                        return this.goodsList.filter(row => {
                            return row.supplier_id === this.supplier;
                        });
                }
            },
            filterGoodsLists() {
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
            filterSupplierBuyersLists() {
                switch (this.supplier) {
                    case -1:
                        return this.filterSupplierBuyers;
                    default:
                        return this.filterSupplierBuyers.filter(row => {
                            return row.supplier_id === this.supplier;
                        });
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
                return !!val && !isNaN(Number(val)) ? Number(val).toFixed(3) : val;
            }
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.$emit('input', val);
            },
            planData(val) {
                if (val && this.selectMark === 'stocking') {
                    this.stockingShow = true;
                    val.list.forEach(res => {
                        this.$set(res, 'id', res.sku_id);
                    });
                    this.$nextTick(() => {
                        this.goodsList = val.list;
                        this.warehouse_id = val.warehouse_id;
                    });
                } else {
                    this.stockingShow = false;
                }
            }
        },
        props: {
            value: {},
            selectMark: {},
            planData: {},
            stockDescription: {}
        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default,
            labelItem: require('../../../components/label-item.vue').default,
            labelPanel: require('../../../components/label-panel.vue').default,
            addGoods: require('./add-goods.vue').default,
            scrollSelect: require('../../../components/scroll-select.vue').default,
            addSupplier: require('./add-supplier.vue').default,
            uiTips: require('../../../components/ui-tips.vue').default,
            virtualSelect: require('../../../components/virtual-select.vue').default,
            uiLimitNumber: require("../../../components/ui-limit-number.vue").default,
            addPrice: require('./add-price.vue').default,
            purchaser: require('../../../api-components/purchaser.vue').default,
            uiTip: require('../../../components/ui-tip.vue').default,
            analyze,
            importExcel: require('./import-excel.vue').default,
            formEditTable: require('./form-edit-table').default
        }
    }
</script>
