<template>
    <div class="purchase-plan-edit-table">
        <ui-table
            checkbox
            ref="table"
            :isFix="true"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            :has-data="tableData.goods.length>0"
            v-model="checkAll"
            @check="head_check"
            :heads="headTitles">
            <tbody>
            <template v-for="(row, index) in tableData.goods">
                <tr>
                    <td>
                        <el-checkbox :key="index" v-model="row.isCheck" @change="check_row"></el-checkbox>
                    </td>
                    <!--图片-->
                    <td>
                        <div>
                            <el-popover
                                v-if="row.thumb"
                                placement="right"
                                trigger="hover">
                                <img :src="row.thumb | filterImage"
                                     width="200px"
                                     height="200px">
                                <div slot="reference">
                                    <img :src="row.thumb"
                                         @click="search_img(row.thumb)"
                                         height="60px" width="60px"
                                         style="border:none">
                                </div>
                            </el-popover>
                            <img src="/static/error-picture-128.png"
                                 v-else
                                 height="60px" width="60px"
                                 style="border:none">
                        </div>
                    </td>
                    <!--产品SKU/别名-->
                    <td style="position: relative;line-height: 12px;">
                        <el-popover
                            placement="right-start"
                            width="200"
                            trigger="hover"
                            content="首次采购SKU不按照日均销量公式计算建议采购数量，而是按照订单未配货数量获取建议采购数量">
                            <i slot="reference" class="newly-increased" v-if="row.purchase_times===0"></i>
                        </el-popover>
                        <div>
                            <div>{{row.sku}}</div>
                            <div>{{row.sku_alias|filterAlias}}</div>
                        </div>
                    </td>
                    <!--产品名称-->
                    <td>
                        <div class="product">
                            {{row.sku_name}}
                        </div>
                    </td>
                    <!--日销量-->
                    <td>
                        <div class="inline">
                            <span v-if="row.daily_sale" title="点击可查看图表详情" class="operate" @click="analyze(row)">{{row.daily_sale}}</span>
                            <div class="daily_sale" v-else title="无销售量">{{row.daily_sale}}</div>
                        </div>
                    </td>
                    <!--安全交期-->
                    <td>
                        <div>{{row.delivery_time}}</div>
                    </td>
                    <!--在途库存-->
                    <td>
                        <div>{{row.intransit_stock_qty}}</div>
                    </td>
                    <!--可用库存-->
                    <td>
                        <div>{{row.available_qty}}</div>
                    </td>
                    <!--订单未配货-->
                    <td>
                        <div class="inline daily_sale">
                            {{row.unpicking_goods_qty}}
                        </div>
                    </td>
                    <!--建议采购-->
                    <td>
                        <div class="inline daily_sale">
                            {{row.proposal_qty||0}}
                        </div>
                    </td>
                    <!--最小起订量-->
                    <td>
                        <div>{{row.min_qty}}</div>
                    </td>
                    <!--采购数量-->
                    <td>
                        <div style="padding: 0 5px;">
                            <ui-limit-number v-model="row.purchase_qty"
                                             style="min-width:40px"
                                             :disabled="selectMark === 'stocking'"
                                             :edit="edit"
                                             @blur="blur_purchase_qty(row)"
                                             :limit="0"
                                             :class="`inline ${borderColor(row,'number')}`"
                                             :min="0">
                            </ui-limit-number>
                        </div>
                    </td>
                    <!--采购单价（CNY）-->
                    <td>
                        <div style="padding: 0 5px;">
                            <ui-limit-number v-model="row.purchase_price"
                                             style="min-width: 50px;"
                                             @blur="blur_purchase_price(row)"
                                             :disabled="selectMark==='purchase_order_overcharged'"
                                             :limit="3"
                                             :class="`inline ${borderColor(row,'price')}`"
                                             :min="0">
                            </ui-limit-number>
                        </div>
                    </td>
                    <!--最后一次采购单价(CNY)-->
                    <td>
                        <div>
                            {{row.lastest_purchase_price|filterPrice}}
                        </div>
                    </td>
                    <!--3月内最低报价-->
                    <td>
                        <div>
                            {{row.three_month_price===0?'无':row.three_month_price|filterPrice}}
                        </div>
                    </td>
                    <!--区间报价（CNY）-->
                    <td>
                      <span class="operate"
                            @click="newPrice(row)"
                            v-for="item in row.section" style="display: block">
                        <span>{{item.min_quantity|filterPrice}}</span>-
                        <span>{{item.max_quantity|filterPrice}}</span>/
                        <span>{{item.price|filterPrice}}</span>
                      </span>
                    </td>
                    <!--结算方式-->
                    <td>
                        <div>
                            {{row.balance_type_text}}
                        </div>
                    </td>
                    <!--采购员-->
                    <td>
                        <div>
                            <span>{{row.purchaser}}</span>
                        </div>
                    </td>
                    <!--操作-->
                    <td>
                        <div>
                            <span v-if="!tableData.supplier" title="点击选择供应商" class="operate" @click="modifSupplie(row)">选择供应商</span>
                            <span v-else-if="row.change_supplier===1" title="点击更换供应商" class="operate"
                                  @click="modifSupplie(row)">换供应商</span>
                            <span v-else title="没有可更换的供应商" class="disabled-link">换供应商</span> |
                            <span class="operate" v-if="row.link&&row.link!=='无'">
                                <a class="link" :href="`${row.link}`" target="_blank">下单</a>
                            </span>
                            <span title="无下单链接" class="disabled-link" v-else>下单</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td :colspan="19">
                        <label class="inline">批注：</label>
                        <el-input v-model="row.remark"
                                  class="inline"
                                  style="width:95.7%"
                                  type="text"
                                  :maxlength="100"
                                  placeholder="请填写批注..."
                        ></el-input>
                    </td>
                </tr>
            </template>
            <template>
                <tr style="font-weight:bold" class="table-footer">
                    <td v-if="notAdd" colspan="2">编号</td>
                    <td :colspan="notAdd?2:3">供应商</td>
                    <td colspan="1">采购员</td>
                    <td>总重量(g)</td>
                    <td>品类数</td>
                    <td :colspan="notAdd?4:5">流水号</td>
                    <td>币种</td>
                    <td>运费</td>
                    <td>优惠金额</td>
                    <td colspan="1">商品金额{{currency_code?`(${currency_code})`:''}}</td>
                    <td colspan="1">总金额{{currency_code?`(${currency_code})`:''}}</td>
                    <td colspan="2" v-if="notAdd">采购计划时间</td>
                    <td :colspan="notAdd?1:3">操作</td>
                </tr>
                <tr class="table-footer">
                    <!--编号-->
                    <td v-if="notAdd" colspan="2">
                        <span>{{tableData.purchase_plan_code}}</span>
                    </td>
                    <!--供应商-->
                    <td :colspan="notAdd?2:3">
                        <span v-if="tableData.supplier">{{tableData.supplier }}</span>
                        <span v-else>无供应商</span>
                    </td>
                    <!--采购员-->
                    <td colspan="1">
                        <div v-if="!edit">
                            <span>{{purchaser}}</span>
                        </div>
                        <div v-else>
                            <span v-if="purchaser!==''" @click="change_purchaser" class="operate">
                                <span>{{purchaser}}</span>
                            </span>
                            <span v-else>
                                <purchaser ref="purchaser" @input="input_buyer" class="inline"
                                           v-model="tableData.purchaser_id"></purchaser>
                            </span>
                            <span v-else>无采购员</span>
                        </div>
                    </td>
                    <!--总重量-->
                    <td>{{tableData.goods|filterWeight}}</td>
                    <td>{{tableData.goods.length}}</td>
                    <!--流水号-->
                    <td :colspan="notAdd?4:5">
                        <div style="padding: 0 3px;">
                            <el-input class="inline input-width" v-model="tableData.external_number"></el-input>
                        </div>
                    </td>
                    <!--币种-->
                    <td>
                        <div style="padding: 0 3px;">
                            {{currency_code}}
                        </div>
                    </td>
                    <!--运费-->
                    <td>
                        <div style="padding: 0 3px;">
                            <span v-if="!edit">{{tableData.expenses}}</span>
                            <ui-limit-number v-model="expenses"
                                             style="min-width: 50px;"
                                             v-else
                                             @blur="blur_purchase_expenses(expenses)"
                                             :disabled="selectMark==='purchase_order_overcharged'"
                                             :limit="3"
                                             class="inline"
                                             :min="0">
                            </ui-limit-number>
                        </div>
                    </td>
                    <!--优惠金额-->
                    <td>
                        <div style="padding: 0 3px;">
                            <span v-if="!edit">{{discount}}</span>
                            <ui-limit-number v-model="discount"
                                             style="min-width: 50px;"
                                             v-else
                                             @blur="blur_purchase_discount"
                                             :disabled="selectMark==='purchase_order_overcharged'"
                                             :limit="3"
                                             class="inline"
                                             :min="0">
                            </ui-limit-number>
                        </div>
                    </td>
                    <!--商品金额(￥)-->
                    <td colspan="1">
                        <span>{{supplier_goods_amount(tableData) | filterAmount}}</span>
                    </td>
                    <!--总金额(￥)-->
                    <td colspan="1">
                        <span>{{supplier_goods_tatol(tableData) | filterAmount}}</span>
                    </td>
                    <!--采购计划时间-->
                    <td v-if="notAdd" colspan="2">
                        {{tableData.create_time|dateFilter}}
                    </td>
                    <!--操作-->
                    <td :colspan="notAdd?1:3">
                        <div>
                            <span title="点击添加商品" class="operate" @click="add_goods">添加商品</span>
                            <span v-if="notAdd"> | <span class="operate" @click="log_show">日志</span></span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="19" style="text-align: left;padding: 5px 10px">
                        <!--<el-row v-if="selectMark===`sample`&&tableData.supplier_id!==0">-->
                            <!--<el-form>-->
                                <!--<el-form-item label="上传附件：">-->
                                    <!--<image-upload v-model="attachment"-->
                                                  <!--@remove-img="remove_attachment"-->
                                                  <!--:download-img="downloadImg"-->
                                                  <!--:is-look="!edit"-->
                                                  <!--:show-download="true"-->
                                                  <!--:maximum="5"-->
                                                  <!--:maximize="1048576"-->
                                                  <!--class="inline"-->
                                                  <!--ref="images-file"></image-upload>-->

                                <!--</el-form-item>-->
                            <!--</el-form>-->
                        <!--</el-row>-->
                        <span v-if="!edit">{{tableData.description}}</span>
                        <div v-else>
                            <el-input placeholder="请填写备注..." type="textarea" width="80%" :rows="3"
                                      v-model="tableData.description"></el-input>
                        </div>
                    </td>
                </tr>
            </template>
            </tbody>
        </ui-table>
        <add-goods v-model="showGoods" ref="addGoods" @selected="selected"></add-goods>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus">
    .purchase-plan-edit-table {
        margin-top: 5px;
        table.template td, .el-table td, table.template th, .el-table th {
            padding: 0;
            height: 26px;
            text-align: center;
            box-sizing: border-box;
            border-right: 1px solid #e0e6ed;
            border-bottom: 1px solid #e0e6ed;
        }
        .disabled-link {
            color: #C0CCDA;
        }

        .ui-table-body {
            border-left-width: 0;
        }

        .table-footer {
            background-color: #F0EDD1;
        }

        .ui-table-body {
            table-layout fixed;
        }

        .product {
            .p-ui-tip > a {
                width: 180px !important;
            }
        }

        .supplier {
            .p-ui-tip > a {
                width: 132px !important;
            }
        }

        .input-width {
            width: 100%;
        }

        .daily_sale {
            color: #000;
        }
        .el-select .el-input__inner {
            padding-right 0;
        }
        .el-input__icon + .el-input__inner {
            padding-right 0;
        }
        .border-color-red {
            .el-input__inner {
                border-color red;
            }
        }
        .newly-increased{
            position: absolute;
            top: 0;
            left: 0;
            width: 32px;
            height: 32px;
            background: url(../../../assets/first-purchase.svg) no-repeat center center;
            background-size: contain;
        }
    }
</style>
<script>
    import {downloadFile} from '@/lib/http';
    import analyze from '../purchasing/add-analyze.vue';
    import {api_add_sku} from '../../../api/procurement-plan';
    import {api_getSupplier} from '../../../api/purchase';
    import {api_get_currency_select_list} from '../../../api/supplier-quote';

    export default {
        page: {
            devinfo: {
                frontEnd: '黎宏珍',
                backEnd: '刘志勇',
                createTime: '2017-10-19',
                updateTime: '2017-10-19'
            }
        },
        data() {
            return {
                expenses: 0,
                discount: 0,
                showGoods: false,
                imgPath: '',
                imgDialog: false,
                currencyList: [],
                currency_code: this.tableData.currency_code,
                purchaser: this.tableData.purchaser,
                purchaser_id: this.tableData.purchaser_id
            }
        },
        created() {
            let expenses = this.tableData.expenses || 0;
            let discount = this.tableData.discount || 0;
            this.expenses = Number(expenses).toFixed(3);
            this.discount = Number(discount).toFixed(3);
            this.currency_code = this.tableData.currency_code;
        },
        mounted() {
            this.get_currency_list();
        },
        methods: {
            remove_attachment(arr){
                this.removeInformation.push(...arr);
            },
            downloadImg(file){
                downloadFile({
                    url:`${config.apiHost}supplier/download-image`,
                    get: {file: file},
                    fileName: file.slice(file.lastIndexOf('/') - 1, file.lastIndexOf('.')),
                    suffix: file.slice(file.lastIndexOf('.'))
                });
            },
            borderColor(row,type) {
                switch (type){
                    case 'number':
                        return Number(row.purchase_qty)>Number(row.proposal_qty||0)?'border-color-red':'';
                        break
                    case 'price':
                        return !!row.lastest_purchase_price && row.lastest_purchase_price !== '无' && Number(row.purchase_price) !== Number(row.lastest_purchase_price) ? 'border-color-red' : '';
                        break
                    default:
                        return ''
                }
            },
            get_currency_list() {
                this.$http(api_get_currency_select_list).then(res => {
                    this.currencyList = res.data;
                }).catch(code => {
                    console.log(code);
                })
            },
            add_goods() {
                this.showGoods = true;
                this.$refs.addGoods.snText = "";
            },
            selected(sels) {
                sels.forEach(data => {
                    data.forEach(row => {
                        let find_sku = this.tableData.goods.find(item => {
                            return item.sku_id === row.sku_id;
                        });
                        if (!find_sku) {
                            let skuId = {
                                sku_id: row.sku_id
                            };
                            this.$http(api_getSupplier, skuId).then(res => {
                                let find_supplier = res.message.find(row => {
                                    return row.supplier_id === this.tableData.supplier_id
                                });
                                if (!find_supplier) {
                                    this.$confirm('该采购计划所指定的供应商没有需要添加的商品, 确认要新建采购计划吗?', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(() => {
                                        this.$emit('selected', sels);
                                    }).catch(code => {
                                        this.$message({message: `已取消操作!` || code, type: 'info'})
                                    });
                                } else {
                                    let sameCurrencyList = res.message.filter(row => row.currency_code === this.tableData.currency_code);
                                    if (sameCurrencyList.length === 0) {
                                        this.$message({type: 'warning', message: '请选择相同“报价币种”的SKU！'});
                                        return
                                    }
                                    this.add_sku({
                                        sku_id: row.id,
                                        warehouse_id: this.warehouse_id
                                    })
                                }
                            }).catch(code => {
                                this.$message({type: "error", message: code.message || code});
                            }).finally(() => {
                                setTimeout(() => {
                                    this.$reqKey('add_goods', false);
                                }, 200);
                            });
                        } else {
                            this.$reqKey('add_goods', false);
                            this.$message({type: 'warning', message: `SKU为：${row.sku} 已存在`});
                        }
                    });
                })

            },
            //添加  获取sku信息 在同一个采购计划中添加
            add_sku(data) {
                this.$http(api_add_sku, data).then(res => {
                    let add_data = {
                        purchaser_id: res.purchaser_id,
                        id: data.sku_id,
                        purchase_price: res.supplier_price,
                        supplier_price: res.supplier_price,//---修改过
                        purchase_qty: 0,
                        is_replace: 0,
                        in_qty: "",
                        arrival_qty: 0,
                        action: "add",
                        isCheck: false,
                        hasSupplier: true,
                        supplier: this.tableData.supplier,
                        supplier_id: this.tableData.supplier_id,
                        purchaser: this.tableData.purchaser,
                        warehouse: this.tableData.warehouse,
                        purchase_plan_id: this.tableData.goods[0].purchase_plan_id
                    };
                    res = Object.assign(res, add_data);
                    this.$emit('row_add_goods', res);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            input_buyer() {
                let option = this.$refs.purchaser.options.find(item => {
                    return this.tableData.purchaser_id === item.id
                });
                if (!!option) {
                    this.tableData.purchaser = option.realname;
                    this.tableData.purchaser_id = option.id;
                    let row_purchase = {
                        goods: this.tableData.goods,
                        purchaser_id: option.id,
                        purchaser: option.realname
                    };
                    this.$emit('input-purchaser', row_purchase);
                }
            },
            log_show() {
                this.$emit('log_show', this.tableData);
            },
            change_purchaser() {
                this.purchaser = '';
                this.purchaser_id = ''
            },
            newPrice(row) {
                this.$emit('new-price', row);
            },
            /*修改供应商*/
            modifSupplie(row) {
                this.$emit('modif-supplie', this.tableData, row);
            },
            blur_purchase_qty(row) {
                if (row.purchase_qty < 0) {
                    row.purchase_qty = 0;
                }
                row.purchase_qty = Number(row.purchase_qty).toFixed(0);
            },
            blur_purchase_price(row) {
                if (row.purchase_price < 0) {
                    row.purchase_price = 0;
                }
                row.purchase_price = (Math.round(Number(row.purchase_price) * 1000) / 1000).toFixed(3);
            },
            blur_purchase_expenses() {
                if (this.expenses < 0) {
                    this.expenses = 0;
                }
                this.expenses = (Math.round(Number(this.expenses) * 1000) / 1000).toFixed(3);
            },
            blur_purchase_discount() {
                if (this.discount < 0) {
                    this.discount = 0;
                }
                this.discount = (Math.round(Number(this.discount) * 1000) / 1000).toFixed(3);
            },
            //计算商品金额
            supplier_goods_amount() {
                let ret = 0;
                this.tableData.goods.forEach(goods => {
                    const price = goods.purchase_price || 0;
                    const count = goods.purchase_qty || 0;
                    ret += Number(price) * Number(count);
                });
                return ret;
            },
            supplier_goods_tatol() {
                let ret = 0;
                this.tableData.goods.forEach(goods => {
                    const price = goods.purchase_price || 0;
                    const count = goods.purchase_qty || 0;
                    ret += Number(price) * Number(count);
                });
                return ret + parseFloat(this.expenses) - parseFloat(this.discount) || 0;
            },
            analyze(data) {
                this.$emit('analyze', data);
            },
            search_img(image) {
                this.imgPath = image.replace("_60x60", "_500x500");
                this.imgDialog = true;
            },
            check_row() {
                this.$emit('selection-change');
            },
            head_check(val) {
                this.tableData.goods.forEach(row => {
                    // row.isCheck=val;
                    this.$set(row, 'isCheck', val);
                });
                this.$emit('head_check', this.tableData.goods);
            },
        },
        computed: {
            attachment:{
                get(){
                    if(this.tableData.supplier_id){
                        return this.attachmentObj[this.tableData.supplier_id]||[];
                    }
                    return []
                },
                set(val){
                    this.attachmentObj[this.tableData.supplier_id] = val;
                }
            },
            notAdd() {
                return this.tableData.purchase_plan_code || this.tableData.create_time
            },
            checkAll: {
                get() {
                    return this.tableData.goods.every(row => row.isCheck === true);
                },
                set(val) {
                    this.tableData.goods.forEach(row => row.checked = val)
                }
            },
            headTitles() {
                return [
                    {isCheck: true, size: 20},
                    {label: '图片', size: 62},
                    {label: '产品SKU/别名', size: 56},
                    {label: '产品名称', size: 92},
                    {label: '日销量', size: 40},
                    {label: '安全交期', size: 36},
                    {label: '在途库存', size: 36},
                    {label: '可用库存', size: 36},
                    {label: '订单未配货', size: 40},
                    {label: '建议采购', size: 40},
                    {label: '最小起订数', size: 42},
                    {label: '采购数量', size: 60},
                    {label: `采购单价${this.currency_code ? `(${this.currency_code})` : ''}`, size: 65},
                    {label: `最后一次采购单价${this.currency_code ? `(${this.currency_code}` : ''})`, size: 60},
                    {label: '3月内最低报价', size: 46},
                    {label: `区间报价${this.currency_code ? `(${this.currency_code})` : ''}`, size: 56},
                    {label: '结算方式', size: 50},
                    {label: '采购员', size: 45},
                    {label: '操作', size: 60}
                ]
            }
        },
        filters: {
            filterAlias(val) {
                return Array.isArray(val) ? val.join(',') : val
            },
            supFilter(row) {
                if (row.supplier_id === 0) {
                    return "未指定供应商"
                } else {
                    return row.supplier || "未指定供应商";
                }
            },
            filterAmount(val) {
                return !!val && !isNaN(Number(val)) ? Number(val).toFixed(3) : val;
            },
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            },
            dateFilter(val) {
                return datef('YYYY-MM-dd hh:mm:ss', val);
            },
            filterWeight(goods) {
                return goods.map(row => row.weight).reduce((total, weight) => total += weight);
            },
            filterPrice(val) {
                if (!isNaN(Number(val)) && Number(val) > 0) {
                    return Number(val).toFixed(3);
                } else {
                    return val;
                }
            }
        },
        watch: {
            'expenses'(val) {
                this.tableData.expenses = val;
            },
            'discount'(val) {
                this.tableData.discount = val;
            },
            'tableData.purchaser'(val) {
                this.purchaser = val;
            },
            'tableData.purchaser_id'(val) {
                this.purchaser_id = val;
            },
            'isCheckAll'(val) {
                if (val) {
                    this.checkAll = val;
                }
            }
        },
        props: {
            selectMark: {},
            edit: {
                required: true,
                type: Boolean,
            },
            firstLoading: {
                type: Boolean,
                default: true
            },
            loading: {
                type: Boolean,
                default: false
            },
            tableData: {
                type: Object
            },
            warehouse_id: {
                required: true
            },
            isCheckAll: {
                type: Boolean,
                default: false
            },
            attachmentObj:{
                type:Object,
                default(){
                    return {}
                }
            }
        },
        components: {
            uiTable: require("../../../components/ui-table.vue").default,
            uiTips: require('../../../components/ui-tips.vue').default,
            uiTip: require('../../../components/ui-tip.vue').default,
            uiInput: require('../../../components/ui-input.vue').default,
            requestButton: require('../../../global-components/request-button.vue').default,
            purchaser: require('../../../api-components/purchaser.vue').default,
            uiLimitNumber: require("../../../components/ui-limit-number.vue").default,
            addGoods: require('./add-goods.vue').default,
            blowupImage: require("@/components/blowup-image.vue").default,
            imageUpload:require('../../procurement/suppliers/assert-sup/image-upload').default,
        }
    }
</script>
