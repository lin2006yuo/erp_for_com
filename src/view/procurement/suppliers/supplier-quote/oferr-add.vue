<template>
    <page-dialog @open="open" class="add-offer" :title="title" v-model="addDialog" size="full"
                 :close-on-click-modal="false">
        <div>
            <!--add-->
            <el-select v-model="searchData.snType" style="width: 80px" class="inline">
                <el-option
                    v-for="(item, index) in skuAndSpu"
                    :value="item.value"
                    :key="index"
                    :label="item.label"
                ></el-option>
            </el-select>
            <el-input class="inline" v-model="searchData.snText" @keydown.native.enter="search" @change="skuChange" placeholder="请输入"></el-input>
            <el-button class="inline" type="primary" size="mini" @click="search" :disabled="searchDisabled">搜索
            </el-button>
            <!--end-->
            <label class="ml-sm">供应商：</label>
            <el-select class="inline s-width-large" v-model="selectSupId"
                       :disabled="scrollIsDis"
                       placeholder="请选择"
                       @change="choose">
                <el-option
                    v-for="(item, index) in goodsIdSup"
                    :key="index"
                    :disabled="item.label===''"
                    :label="item.label"
                    :value="item.value">
                </el-option>
                <el-option value="更多">
                    <permission class="ml-sm" tag="ElButton" :route="apis.url_add_supplier_offer" type="text"
                                size="mini" @click="get_supplier">更多供应商
                    </permission>
                </el-option>
            </el-select>
            <el-checkbox class="ml-sm" v-model="is_default">同时设置为默认供应商</el-checkbox>
            <add-supplier v-model="addSupplierValue" :selectList="goodsIdSup" @addSupplier="addSupplier"></add-supplier>
        </div>
        <el-table
            :data="dataList"
            class="mt-xs scroll-bar table-max-height"
            v-loading="isLoading"
            highlight-current-row
            ref="multipleTable"
            @select="selectRow"
            @select-all="selectAll">
            <el-table-column
                type="selection"
                width="35">
            </el-table-column>
            <el-table-column label="图片" inline-template align="center" width="60px">
                <el-popover
                    placement="right"
                    trigger="hover">
                    <img :src="sku_image(row.thumb)" width="200px" height="200px">
                    <span slot="reference" v-if="row.thumb">
                             <img :src="row.thumb" height="60px" width="60px" style="border:none">
                        </span>
                </el-popover>
            </el-table-column>
            <el-table-column label="SKU/别名" inline-template align="center" width="150px" show-overflow-tooltip>
                <div>
                    <div>
                        <ui-tips :content="row.sku" :width="90"></ui-tips>
                    </div>
                    <div>
                        <ui-tips :content="row.sku_alias|filterAlias" :width="90"></ui-tips>
                    </div>
                </div>
            </el-table-column>
            <el-table-column label="链接" inline-template align="left" width="250px" show-overflow-tooltip>
                <div>
                    <el-input placeholder="请输入连接" v-model="row.link" style="display: inline-block;width: 190px;"
                              @focus="synShow(row,'linkSny')"
                              @blur="synHide(row,'linkSny');check_isUrl($event, row.link)"></el-input>
                    <el-button v-show="row.linkSny" type="primary" size="mini"
                               @mousedown.native="synchronization(row.link,'link')">同步
                    </el-button>
                </div>
            </el-table-column>
            <el-table-column label="最小起订量" inline-template align="left" width="130px" show-overflow-tooltip>
                <div>
                    <ui-limit-number
                        v-model="row.min_qty"
                        placeholder="最小起订量"
                        @focus="synShow(row,'minQtySny')"
                        @blur="synHide(row,'minQtySny')"
                        style="width: 60px;"
                        :limit="0"
                        :min="1"
                        class="inline enter-result s-width-default"></ui-limit-number>
                    <el-button class="inline" v-show="row.minQtySny" type="primary" size="mini"
                               @mousedown.native="synchronization(row.min_qty,'min_qty')">同步
                    </el-button>
                </div>
            </el-table-column>
            <el-table-column label="币种" inline-template align="left" width="140px" show-overflow-tooltip>
                <div>
                    <el-select class="inline s-width-default" v-model="row.currency_code"
                               placeholder="请选择币种"
                               style="width:80px;"
                               @visible-change="currency_sny_visible($event,row,'currencySny')"
                               filterable>
                        <el-option
                            v-for="(item, index) in currencyList"
                            :key="index"
                            :label="item.code"
                            :value="item.code">
                        </el-option>
                    </el-select>
                    <el-button class="inline" v-show="row.currencySny" type="primary" size="mini"
                               @mousedown.native="synchronization(row.currency_code,'currency_code')">同步
                    </el-button>
                </div>
            </el-table-column>
            <el-table-column label="最新报价" inline-template align="left" width="110px" show-overflow-tooltip>
                <span>{{row.audited_price}}</span>
            </el-table-column>
            <el-table-column label="本次报价" inline-template align="left" width="130px" show-overflow-tooltip>
                <div>
                    <ui-limit-number
                        v-model="row.price"
                        @focus="synShow(row,'priceSny')"
                        @blur="synHide(row,'priceSny')"
                        style="width: 70px;"
                        :limit="3"
                        :min="0"
                        class="inline enter-result s-width-default"></ui-limit-number>
                    <el-button class="inline" v-show="row.priceSny" type="primary" size="mini"
                               @mousedown.native="synchronization(row.price,'price')">同步
                    </el-button>
                </div>
            </el-table-column>
            <el-table-column label="区间报价" inline-template align="left">
                <div>
                    <el-row class="mt-mini inline" v-for="(item,index) in row.section" :key="index" :gutter="4"
                            style="width: 75%">
                        <el-col :span="14">
                            <input class="el-input__inner inline" placeholder="最小数量" style="width:60px"
                                   @focus="synShow(row,'sectionSny')" @blur="synHide(row,'sectionSny')"
                                   v-model="item.min_quantity" type="number" min="0"
                                   onkeyup="this.value=this.value.replace(/\D/g,'')"
                                   onafterpaste="this.value=this.value.replace(/\D/g,'')"/>~<input class="el-input__inner inline" placeholder="最大数量" style="width:60px"
                                   @focus="synShow(row,'sectionSny')" @blur="synHide(row,'sectionSny')"
                                   v-model="item.max_quantity" type="number" min="0"
                                   onkeyup="this.value=this.value.replace(/\D/g,'')"
                                   onafterpaste="this.value=this.value.replace(/\D/g,'')"/>
                        </el-col>
                        <el-col :span="7">
                            <input class="el-input__inner inline" v-model="item.price"
                                   onkeyup="if(isNaN(value))execCommand('undo')"
                                   @focus="synShow(row,'sectionSny')" @blur="synHide(row,'sectionSny')"
                                   placeholder="报价"
                                   onafterpaste="if(isNaN(value))execCommand('undo')">
                        </el-col>
                        <el-col :span="2" v-if="index===0">
                            <div class="mt-mini ml-sm" @click="add_section(row,index)">
                                <img src="../../../../assets/add2.png">
                            </div>
                        </el-col>
                        <el-col :span="2" v-if="index>0">
                            <div class="mt-mini ml-sm" @click="delete_section(row,index)">
                                <img src="../../../../assets/delete(2).png">
                            </div>
                        </el-col>
                    </el-row>
                    <el-button class="inline" v-show="row.sectionSny" type="primary" size="mini"
                               @mousedown.native="synchronization(row.section,'section')">同步
                    </el-button>
                </div>
            </el-table-column>
            <el-table-column inline-template label="仓库/交货周期" align="left">
                <div>
                    <el-row v-for="(item,index) in row.cycle" :key="index" class="mt-mini inline" style="width: 80%">
                        <el-col :span="16">
                            <el-select v-model="item.warehouse_id" placeholder="请选择仓库">
                                <el-option v-for="(it,index) in warehouseList"
                                           :value="it.value"
                                           :label="it.label"
                                           :key="index"
                                ></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="6">
                            <input class="el-input__inner inline" placeholder="交货周期" v-model="item.delivery_days"
                                   @focus="synShow(row,'cycleSny')" @blur="synHide(row,'cycleSny')"
                                   type="number" min="0"
                                   onkeyup="this.value=this.value.replace(/\D/g,'')"
                                   onafterpaste="this.value=this.value.replace(/\D/g,'')">
                        </el-col>
                        <el-col :span="2" v-if="index===0">
                            <div class="mt-mini" style="margin-left:15px" @click="add_cycle(row)">
                                <img src="../../../../assets/add2.png">
                            </div>
                        </el-col>
                        <el-col :span="2" v-if="index>0">
                            <div class="mt-mini" style="margin-left:15px" @click="delete_cycle(row,index)">
                                <img src="../../../../assets/delete(2).png">
                            </div>
                        </el-col>
                    </el-row>
                    <el-button :span="2" v-show="row.cycleSny" class="inline ml-sm" type="primary" size="mini"
                               @mousedown.native="synchronization(row.cycle,'cycle')">同步
                    </el-button>
                </div>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <el-button type="primary" size="mini" @click="save">确定</el-button>
            <el-button size="mini" @click="cancel">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .add-offer {
        .table-max-height {
            .el-table__body-wrapper {
                max-height: 500px;
                overflow-y: auto;
            }
        }
        .btn-hide {
            display: none;
        }
        .inner {
            > .dialog__body {
                > .el-table {
                    .cell {
                        overflow: hidden !important;
                    }
                }
            }
        }
    }

</style>
<script>
    import pageDialog from "../../../../components/page-dialog.vue";
    import addGoods from "../../../../api-components/add-goods.vue";
    import selectQuery from "../../../../components/select-query.vue";
    import {
        api_get_current,
        api_get_warehouse,
        api_add_supplier_offer,
        api_get_goods_sku,
        api_get_goods_supp,
        api_get_sup,
        api_get_currency_select_list,
        url_add_supplier_offer
    } from "../../../../api/supplier-quote";

    export default {
        permission: {
            url_add_supplier_offer
        },
        data() {
            return {
                addSupplierValue: false,
                scrollIsDis: true,
                addDialog: false,
                isLoading: false,
                searchDisabled: true,
                content: "",
                addGoods: false,
                supplierList: [],
                warehouseList: [],
                selectSupplier: [],//选中供应商返回的商品列表
                dataList: [],//所有商品列表
                selectList: [],//选中列表
                quoteList: [],
                supplier_id: "",
                goods_id: "",
                supplierPage: 1,
                supplierCount: 0,
                searchData: {
                    snType: 'sku',
                    snText: ''
                },
                skuAndSpu: [
                    {label: 'SKU', value: 'sku'},
                    {label: 'SPU', value: 'spu'}
                ],
                addSupper: "",
                prevPageBtn: true,
                nextPageBtn: false,
                goodsIdSup: [],
                selectSupId: '',
                is_default:false,
                currencyList:[]
            }
        },
        created() {
            this.api_get_warehouse();
        },
        mounted() {
            this.addDialog = this.value;
            this.supId = this.supplier_id;
            this.get_currency();
        },
        watch: {
            addDialog(val) {
                this.$emit("input", val);
            },
            value(val) {
                this.addDialog = val;
            },
        },
        methods: {
            open() {
                this.scrollIsDis = true;
                this.goods = [];
                this.selectSupplier = [];
                this.dataList = [];
                this.selectList = [];
                this.searchData = {
                    snType: 'sku',
                    snText: ''
                };
                this.supplier_id = '';
                this.addSupper = '';
                this.selectSupId = '';
                this.is_defalut = false;
            },
            get_currency(){
                this.$http(api_get_currency_select_list).then(res=>{
                    this.currencyList = res.data;
                }).catch(code=>{
                    console.log(code
                    )});
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.');
                }
                return ""
            },
            skuChange() {
                let snText = this.searchData.snText.replace(/(^\s*)|(\s*$)/g, "");
                if (snText === '') {
                    this.searchDisabled = true;
                    this.scrollIsDis = true;
                } else {
                    this.searchDisabled = false;
                }
            },
            selectRow(selection, row) {
                this.selectList = selection;
            },
            selectAll(selection) {
                this.selectList = selection;
            },
            choose() {
                if (this.selectSupId === "更多") {
                    this.isLoading = false;
                    return
                }
                this.isLoading = true;
                let opt = this.selectSupId;
                this.dataList.forEach(row => {
                    row.cycle = [{warehouse_id: "", delivery_days: ""}];
                    row.section = [{min_quantity: '', max_quantity: '', price: ""}];
                    row.link = "";
                    row.price = "";
                    row.min_qty = 1;
                });
                this.selectSupplier = [];
                this.$refs.multipleTable.clearSelection();
                this.supplier_id = opt;
                this.$http(api_get_goods_supp, {supplier_id: opt, goods_id: this.goods_id}).then(res => {
                    this.selectSupplier = res.list;
                    this.chekSupplier();
                }).catch(code => {

                });
            },
            //给table勾选上供应商对应的数据
            chekSupplier() {
                let selectArr = [];
                this.dataList.forEach(data => {
                    let find = this.selectSupplier.find(row => row.sku_id === data.sku_id);
                    if (!!find) {
                        this.$set(data,'cycle',find.cycle.length > 0 ? find.cycle : [{warehouse_id: "", delivery_days: ""}]);
                        this.$set(data,'link',find.link);
                        this.$set(data,'currency_code',find.currency_code);
                        this.$set(data,'price',find.price);
                        this.$set(data,'section',find.section.length > 0 ? find.section : [{
                            min_quantity: '',
                            max_quantity: '',
                            price: ""
                        }]);
                        this.$refs.multipleTable.toggleRowSelection(data, true);
                        selectArr.push(data);
                    }
                });
                this.selectList = selectArr;
                this.isLoading = false;
            },
            currency_sny_visible(showSelect,row,key){
                if(showSelect) {
                    let find = this.dataList.find(row => row[key]);
                    find && (find[key] = false);
                    row[key] = true;
                }
            },
            synShow(row, syn) {
                if (this.selectSupId) {
                    row[syn] = true;
                } else {
                    this.$message({type: 'error', message: `请选择供应商再填写!`});
                }
            },
            synHide(row, syn) {
                row[syn] = false;
            },
            synchronization(rowData, words) {
                this.selectList.forEach(data => {
                    this.dataList.forEach(row => {
                        if (row.sku_id === data.sku_id) {
                            let rowData2 = window.clone(rowData);
                            row[words] = rowData2;
                        }
                    })
                });
            },
            search() {
                this.dataList = [];
                this.selectSupId = '';
                this.init();
            },
            init() {
                this.isLoading = true;
                this.$http(api_get_goods_sku, this.searchData).then(res => {
                    if (res.status === 0) {
                        this.$message({
                            type: "error",
                            message: res.message || res
                        });
                        this.isLoading = false;
                        return;
                    }
                    this.scrollIsDis = false;
                    this.goods_id = res.goods_id;
                    this.dataList = res.list.map(row => {
                        return {
                            supplier_id: '',
                            sku_id: row.sku_id,
                            sku: row.sku,
                            cycle: [{warehouse_id: "", delivery_days: ""}],
                            section: [{min_quantity: '', max_quantity: '', price: ""}],
                            link: "",
                            price: "",
                            linkSny: false,
                            priceSny: false,
                            minQtySny:false,
                            currencySny:false,
                            sectionSny: false,
                            cycleSny: false,
                            sku_alias:row.sku_alias
                        }
                    });
                    this.total = res.count;
                    //更新goods_id对应的供应商
                    this.getGoodSupplierList();
                    this.isLoading = false;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })

                })
            },
            replace(val) {
                if (isNaN(val.price)) execCommand('undo')
            },
//                添加交货周期
            add_cycle(row) {
                row.cycle.push({warehouse_id: "", delivery_days: ""});
            },
            delete_cycle(row, index) {
                row.cycle.splice(index, 1);
            },
//                添加报价
            add_section(row, index) {
                let curObj = row.section[row.section.length - 1];
                if (curObj.max_quantity) {
                    if (parseInt(curObj.max_quantity) <= parseInt(curObj.min_quantity)) return this.$message({
                        type: "warning",
                        message: `最大数量 不能小于或者等于 最小数量,请更改！`
                    });
                    let nextLineQuantity = parseInt(curObj.max_quantity) + 1;
                    row.section.push({min_quantity: nextLineQuantity, max_quantity: "", price: ""});
                } else {
                    row.section.push({min_quantity: "", max_quantity: "", price: ""});
                }
            },
            delete_section(row, index) {
                row.section.splice(index, 1);
            },
            //验证分段报价
            section_price() {
                let i = 1;
                let message = [];
                let bv = true;
                this.selectList.forEach(row => {
                    let aaa = true;
                    let arr = row.section;
                    if (arr.length === 1) {
                        aaa = false;
                        if (arr[0].max_quantity === '' || arr[0].max_quantity === 0) {
                            if (arr[0].min_quantity === '' && arr[0].price === '') {
                                this.$set(row, 'isEmpty', 1);
                            } else {
                                if (arr[0].min_quantity !== '' && arr[0].price !== '') {

                                } else {
                                    message.push("请将分段价格信息填写完整。");
                                    bv = false;
                                }

                            }
                        } else {
                            message.push("报价信息最后一行，最大订量必须无穷大（置空表示无穷大）。");
                            bv = false;
                        }
                    } else {
                        for (let j = 0; j < arr.length - 1; j++) {
                            if (arr[j].min_quantity !== '' && arr[j].max_quantity !== '' && arr[j].price !== '') {

                            } else {
                                aaa = false;
                            }
                        }
                        if (arr[arr.length - 1].max_quantity === '' || arr[arr.length - 1].max_quantity === 0) {//
                            if (arr[arr.length - 1].min_quantity !== '' && arr[arr.length - 1].price !== '') {

                            } else {
                                aaa = false;
                            }
                        } else {
                            message.push("报价信息最后一行，最大订量必须无穷大（填入0或者置空表示无穷大）。");
                            bv = false;
                        }
                        if (!aaa) {
                            message.push("请将分段价格信息填写完整");
                            bv = false;
                        }
                    }

                    if (aaa) {
                        for (let j = 0; j < arr.length - 1; j++) {
                            if (Number(arr[j].price) < Number(arr[j + 1].price)) {
                                message.push(`第${i}条第${j + 1}与${j + 2}行分段价格应该递减`);
                                bv = false;
                            }
                            if ((arr[j].max_quantity - arr[j + 1].min_quantity) !== -1) {
                                message.push(`第${i}条第${j + 1}与${j + 2}行分段不连续`);
                                bv = false;
                            }
                            if (Number(arr[j].min_quantity) > Number(arr[j].max_quantity)) {
                                message.push(`第${i}条第${j + 1}行分段价格最小价格应小于最大价格`);
                                bv = false;
                            }
                        }
                    }

                    i++;
                });
                if (!bv) {
                    this.$message({
                        type: "warning",
                        message: message[0]
                    })
                }
                return bv;
            },
//                保存
            save() {
                if (this.selectList.length <= 0) {
                    this.$message({
                        type: "warning",
                        message: "请选择一个商品！"
                    });
                    return false;
                }
                let hasMinQty = this.selectList.find(row=>Number(row.min_qty)<=0);
                if(!!hasMinQty){
                    this.$message({
                        type: "warning",
                        message: "最小起订量必须大于等于1！"
                    });
                    return false;
                }
                let findMinQty = this.selectList.find(row=>{
                    if(row.section.length===1&&row.section.find(row=>row.min_quantity===''&&row.max_quantity===''&&row.price==='')){
                        console.log(row,'row1');
                        return false
                    }
                    return Number(row.min_qty)>Math.min.apply(null,row.section.map(item=>item.min_quantity))
                });
                if(!!findMinQty){
                    this.$message({
                        type: "warning",
                        message: "区间报价中的最小数量必须大于或等于最小起订量！"
                    });
                    return false;
                }
                this.selectList.forEach(data => {
                    data.supplier_id = this.supplier_id;
                });
                let find = this.selectList.findIndex(row => {
                    return row.supplier_id === ''
                });
                if (find !== -1) {
                    this.$message({
                        type: "warning",
                        message: `第${find + 1}条没有选择供应商`
                    });
                    return
                }
                if (!this.section_price()) {
                    return;
                }
                this.$http(api_add_supplier_offer, {
                    goods: this.selectList,
                    supplier_id: this.supplier_id,
                    is_defalut:this.is_defalut
                }).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message || res
                    });
                    this.addDialog = false;
                    this.$emit("save-offer");
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });

                });
            },
//                取消
            cancel() {
                this.addDialog = false;
            },
            getGoodSupplierList() {
                this.$http(api_get_sup, {goods_id: this.goods_id}).then(res => {
                    this.goodsIdSup = res.list.map(row => {
                        return {
                            value: row.supplier_id,
                            label: row.company_name
                        }
                    });
                    this.goodsIdSup.forEach(data => {
                        if (!!data.value && data.label !== '') {
                            this.selectSupId = data.value;
                            this.choose();
                        }
                    });

                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                })
            },
            /*更多供应商*/
            get_supplier() {
                this.addSupplierValue = true;
                this.selectSupId = '';
            },
            addSupplier(data) {
                let supArr = [];
                supArr = data.map(row => {
                    return {
                        value: row.id,
                        label: row.company_name
                    }
                });
                this.goodsIdSup = this.goodsIdSup.concat(supArr);
            },

            //end
            /*获取仓库*/
            api_get_warehouse() {
                this.$http(api_get_warehouse).then(res => {
                    this.warehouseList = res.map(row => {
                        return {
                            label: row.name,
                            value: Number(row.id),
                        }
                    });
                });
            },
            /*获取当前报价*/
            api_get_current(sku_id, supplier_id) {
                let cur = {
                    sku_id: sku_id,
                    supplier_id: supplier_id
                }
                this.$http(api_get_current, cur).then(res => {
                    this.quoteList = res;
                }).catch(code => {
                })
            },
            //检查是否是正确的URL
            check_isUrl(event, val) {
            }
        },
        filters:{
            filterAlias(val){
                return Array.isArray(val)?val.join(','):val
            },
        },
        props: {
            value: {},
            goodsForm: {
                type: Object
            },
            title: {
                require: true,
                type: String
            },
            edit: {
                require: true,
                type: Boolean
            },
            companyN: {}
        },
        components: {
            selectQuery,
            pageDialog,
            addGoods,
            scroll: require('./scroll-add.vue').default,
            uiTips: require('@/components/ui-tip.vue').default,
            addSupplier: require('./add-supplier.vue').default,
            uiLimitNumber:require('@/components/ui-limit-number').default,
        }
    }
</script>
