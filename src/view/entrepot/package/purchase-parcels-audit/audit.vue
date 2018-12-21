<template>
    <div ref="page" style="height: 100%">
        <el-card class="mb-xs">
            <el-select v-model="searchData.s_bill_type" class="inline width-sm">
                <el-option v-for="(item, index) in typeList"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <el-input
                    v-model="searchData.s_bill_number"
                    placeholder="请输入内容"
                    class="inline mr-sm width-super ml-sm"
                    @keyup.enter.native="s_bill_enter($event)"
                    autofocus
                    ref="search_input">
            </el-input>
            <permission
                    tag="ElButton"
                    class="inline"
                    :route="apis.url_parcel_search"
                    type="primary"
                    @click.native="search_btn(searchData)"
                    size="mini">查询
            </permission>
            <span class="arrival-blue ml-sm">按下F2切换搜索方式</span>
        </el-card>
        <div class="mb-xs mt-xs ml-sm" v-if="submitShow" style="overflow: hidden">
            <div class="fl" v-show="submitShow">
                <el-checkbox v-model="print_all">全选所有</el-checkbox>
                <trends-select class="inline"
                               @trigger="p_action($event)"
                               :selects="printAllOptions"
                               type="primary">
                </trends-select>
            </div>
            <div class="fr arrival-blue">
                小提示：填写本次良品时按下PageUp或PageDown可以上下切换哟~
            </div>
        </div>
        <el-form class="el-row-reset-card"
                 :style="cardStyle"
                 v-loading="loading"
                 element-loading-text="玩命加载中">
            <el-form-item v-for="(list, index) in list2" :key="index">
                <el-card v-for="(item, listIndex) in list"
                         @click.native.prevent="check_package($event, index, listIndex)"
                         class="mb-xs"
                         :key="item.purchase_order">
                    <span class="mr-lg bold-font font-18 red">{{item.warehouse_name}}</span>
                    <span class="bold-font">采购单ID：</span>
                    <span class="mr-sm color-success">{{item.purchase_order}}</span>
                    <span class="bold-font">采购单号：</span>
                    <span class="mr-sm color-success">{{item.purchase_parcel}}</span>
                    <span v-if="item.is_allow_receipt === 0"
                          class="arrival-warning-color mr-sm">{{item.status_text}}</span>
                    <span class="bold-font">运单号：</span>
                    <span class="color-success mr-sm">{{item.tracking_number}}</span>
                    <span class="bold-font">采购员：</span>
                    <span class="color-success">{{item.purchaser_user_name_list | purchaserName}}</span>
                    <el-table
                            :data="item.skus"
                            class="arrival-table scroll-bar"
                            max-height="580"
                            ref="table"
                            @selection-change="handle_selection_change(listIndex, $event, item)"
                            highlightCurrentRow>
                        <el-table-column
                                type="selection"
                                :selectable="selectable"
                                width="30">
                        </el-table-column>
                        <el-table-column
                                width="80"
                                label="图片">
                            <template slot-scope="scope">
                                <el-popover
                                        placement="right"
                                        trigger="hover">
                                    <img :src="scope.row.thumb | filterImage"
                                         width="200px"
                                         height="200px">
                                    <span slot="reference">
                                        <img :src="scope.row.thumb"
                                             @click="search_img(scope.row.thumb)"
                                             v-if="scope.row.thumb"
                                             height="60px" width="60px"
                                             style="border:none">
                                        </span>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column
                                min-width="100"
                                label="SKU/SKU别名">
                            <template slot-scope="scope">
                                <permission tag="uiTip"
                                            :route="apis.url_sku"
                                            :is-operate="true"
                                            :content="scope.row.sku"
                                            :width="98"
                                            @cur-click="show_goods_detail(scope.row)">
                                </permission>
                                <permission tag="ElButton"
                                            :route="apis.url_get_sku"
                                            type="primary"
                                            @click="re_check(scope.row)"
                                            v-if="scope.row.check === 0"
                                            size="mini"
                                            class="mb-sm">复核
                                </permission>
                                <div>{{scope.row.sku_alias || `--`}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                min-width="250"
                                inline-template
                                label="名称">
                            <div>
                                {{row.sku_name}}
                            </div>
                        </el-table-column>
                        <el-table-column
                                label="缺货数量"
                                inline-template>
                            <span>{{row.shortage_quantity}}</span>
                        </el-table-column>
                        <el-table-column
                                prop="qty"
                                label="采购数量">
                        </el-table-column>
                        <el-table-column
                                inline-template
                                label="已接收数">
                            <div>
                                <ui-tip :content="row.expected_int_qty | isZero" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column
                                label="本次良品" min-width="100" class="t-center input-number">
                            <template slot-scope="scope" class="required-sign">
                                <el-input v-model="scope.row.accepted_goods_qty"
                                          :class="{arrival_redborder: scope.row.qty - scope.row.accepted_goods_qty < 0 || scope.row.accepted_goods_qty < 0}"
                                          ref="accept"
                                          :disabled="scope.row.status === 1 || item.is_allow_receipt === 0"
                                          style="width: 100%"
                                          type="number"
                                          @keyup.native="key_updown($event, scope.row)">
                                </el-input>
                                <span class="arrival-warning-color"
                                      v-if="scope.row.qty - scope.row.accepted_goods_qty < 0 || scope.row.accepted_goods_qty < 0">请输入正确的良品数</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="本次次品" inline-template class="t-center">
                            <el-input v-model="row.defective_product_qty"
                                      :min="0"
                                      style="width: 100%"
                                      type="number"
                                      :disabled="row.status === 1 || item.is_allow_receipt === 0">
                            </el-input>
                        </el-table-column>
                        <el-table-column
                                inline-template
                                :render-header="is_require">
                            <div>
                                <el-input v-model="row.label_id" @change="trim_label_id(row)"></el-input>
                            </div>
                        </el-table-column>
                        <el-table-column
                                label="质检类型">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.quality_type">
                                    <el-option label="全检" value="1">
                                    </el-option>
                                    <el-option label="抽检" value="2">
                                    </el-option>
                                    <el-option label="免检" value="3">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                width="120">
                            <template slot-scope="scope">
                                <trends-select class="inline"
                                               @trigger="action(scope.row,$event,item)"
                                               :selects="options"
                                               type="primary">
                                </trends-select>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-form-item>
        </el-form>
        <!--</el-card>-->
        <search-dialog v-model="dialogTableVisible"
                       @refresh="search_btn"
                       :purchaseNote="purchaseNote"></search-dialog>
        <review-dialog v-model="review_visible"
                       :goods_detail="goods_detail"
                       @init="search_again"></review-dialog>
        <goods-detail v-model="goods_visible"
                      :goods_detail="goods_detail"></goods-detail>
        <preview v-model="printVisible"
                 :print-data="printData"
                 ref="preview"></preview>
        <batch_preview v-model="batch_printVisible"
                       :batch-data="batchData"
                       ref="batch_preview"></batch_preview>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus">
    .el-row-reset-card {
        overflow-x: hidden;
        overflow-y: auto;
        border-radius: 4px;
        border: 1px solid #d3dce6;
        padding: 4px;
        padding-bottom: 10px;
    }

    .input-number {
        line-height: 30px;
    }

    .input-number input {
        width: 100%;
    }

    .arrival-table td {
        vertical-align: middle;
    }

    .sku_name {
        cursor: pointer;
        color: #69f;
    }

    .arrival-blue {
        color: #1D8CE0;
    }

    .arrival-warning-color {
        color: #FF4949;
    }

    .arrival_redborder input {
        border: 1px solid #FF4949;
    }
</style>
<script>
    import {
        api_parcel_receipt,
        api_parcel_get,
        api_url_get_sku,
        api_url_sku,
        api_post_auditParcel,
        url_parcel_search,
        url_get_sku,
        url_sku,
        url_parcel_receipt,
        url_post_auditParcel,
        url_lable_data,
        url_lable_box_data,
        url_print_label,
        url_print_lable_box,
        api_lable_data,
        api_lable_box_data,
        api_print_label,
        api_print_lable_box,
        api_get_print
    } from "@/api/arrival-parcel.js"
    import {api_get_audit, api_post_audit} from "@/api/purchase-parcels-audit";

    export default {
        page: {},
        refresh() {
            this.submitShow = false;
            this.serverData.list = [];
            this.searchData.s_bill_type = 2;
            this.searchData.s_bill_number = "";
            this.$refs.search_input.$refs.input.focus();
        },
        permission: {
            url_parcel_search,
            url_get_sku,
            url_sku,
            url_parcel_receipt,
            url_post_auditParcel,
            url_lable_data,
            url_lable_box_data,
            url_print_label,
            url_print_lable_box
        },
        data() {
            return {
                cardStyle: {},
                printVisible: false,
                batch_printVisible: false,
                isChangeLabelId: false,
                serverData: {list: []}, //获取的表格数据
                modifyData: [],//提交的修改的数据
                submitShow: false,//确定按钮是否显示
                purchase: {
                    purchase_parcel_code: '',
                    purchase_order_id: '',
                    skuInfo: [],
                },//提交的对象
                searchData: {
                    s_bill_type: 2,
                    s_bill_number: "",
                },//搜索栏数据
                typeList: [
                    {label: '搜采购单ID', value: 1},
                    {label: '搜运单号', value: 2},
                    {label: '搜拆包明细', value: 4},
                    {label: '搜SKU', value: 5}
                ],
                purchaseNote: [],//弹框的数据
                submitData: {},//点击确定修改的数据
                dialogTableVisible: false,
                review_visible: false,
                loading: false,
                re_check_show: true,//复核按钮
                goods_visible: false,//商品详情显示
                goods_detail: {
                    sku_id: '',
                    sku: '',
                    form: {
                        pictures: []
                    },
                },//SKU商品详情
                printData: {},
                batchData: [],
                print_all: false,
                select_sku: [],
                select_table: 0,
                list2: [],
                checkedPackage: [],
                batch_id: 0,
                imgPath: '',
                imgDialog: false,
                operateButtons: [
                    {
                        label: '审核', value: 'audit', apis: url_post_auditParcel,
                        action(data, list) {
                            console.log('list', list);
                            this.$confirm('确认审核?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.loading = true;
                                let ids = [];
                                ids.push(data.purchase_parcels_records_id);
                                let receiptParcelInfo = [];
                                let skus = [];
                                if (!data.label_id) {
                                    this.$message({type: "error", message: '请填写贴标工号'});
                                    this.loading = false;
                                    return false;
                                }
                                skus.push({
                                    id: data.purchase_parcels_records_id,
                                    sku_id: data.sku_id,
                                    accepted_goods_qty: data.accepted_goods_qty,
                                    defective_product_qty: data.defective_product_qty,
                                    quality_type: data.quality_type,
                                    shortage_quantity: data.shortage_quantity,
                                    is_allow_receipt: data.is_allow_receipt,
                                    label_id: data.label_id
                                });
                                let info = {
                                    purchase_parcel_code: list.purchase_parcel_code,
                                    purchase_order_id: list.purchase_order,
                                    batch_id: list.batch_id,
                                    skuInfo: skus,
                                };
                                receiptParcelInfo.push(info);
                                if (!data.accepted_goods_qty) {
                                    this.$message({type: "error", message: `本次良品不能为空`});
                                    this.loading = false;
                                    return false;
                                }
                                let post = {
                                    receiptParcelInfo: receiptParcelInfo,
                                    ids: ids
                                };
                                this.$http(api_post_audit, post).then(res => {
                                    this.loading = false;
                                    let index = list.skus.findIndex(row => {
                                        return row.id === data.id;
                                    });
                                    if (index !== -1) {
                                        list.skus.splice(index, 1);
                                    }
                                    this.$refs.search_input.$refs.input.select();
                                    this.$message({type: "success", message: res.message || res});
                                }).catch(code => {
                                    this.loading = false;
                                    this.$message({type: 'error', message: code.message || code});
                                })
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '已取消'
                                });
                            });
                        }
                    },
                    {
                        label: '打印标签', value: 1, apis: url_lable_data,
                        action(data, list) {
                            let post = {
                                sku_id: data.sku_id,
                                purchase_order_id: data.purchase_order_id,
                                num: data.accepted_goods_qty,
                                label_type: 1,
                                purchase_parcel_code: list.purchase_parcel_code,
                                shortage_quantity: data.shortage_quantity
                            };
                            // if(post.num <= 0){
                            //     this.$message({type:"error",message:'请输入良品数'});
                            //     return false;
                            // }
                            this.$http(api_lable_data, post).then(res => {
                                this.$set(this, 'printData', res);
                                this.printVisible = true;
                                this.$refs.preview.get_template(1, {warehouse_id: list.warehouse_id});
                                this.printData.print_num = 1;
                                if (this.printData.default_temp_id) {
                                    this.$nextTick(() => {
                                        this.$refs.preview.change_print();
                                    })
                                }
                            }).catch(code => {
                                this.$message({type: "error", message: code.message || code})
                            })
                        }
                    },
                    {
                        label: '打印箱唛', value: 2, apis: url_lable_box_data,
                        action(data, list) {
                            let post = {
                                sku_id: data.sku_id,
                                purchase_order_id: data.purchase_order_id,
                                num: data.accepted_goods_qty,
                                label_type: 2,
                                purchase_parcel_code: list.purchase_parcel_code,
                            };
                            // if(post.num <= 0){
                            //     this.$message({type:"error",message:'请输入良品数'});
                            //     return false;
                            // }
                            this.$http(api_lable_box_data, post).then(res => {
                                this.$set(this, 'printData', res);
                                this.printVisible = true;
                                this.printData.print_num = 1;
                                this.$refs.preview.get_template(2, {warehouse_id: list.warehouse_id});
                                if (this.printData.default_temp_id) {
                                    this.$nextTick(() => {
                                        this.$refs.preview.change_print();
                                    })
                                }
                            }).catch(code => {
                                this.$message({type: "error", message: code.message || code})
                            })
                        }
                    }
                ],
                printAllButtons: [
                    {
                        label: '批量审核', value: 'audit', apis: url_post_auditParcel,
                        p_action(data, list) {
                            let receiptParcelInfo = [];
                            if (!this.select_sku.length) {
                                this.$message({type: "warning", message: '请选择要审核的sku'});
                                return false;
                            }
                            this.$confirm(`确认审核?`, '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.loading = true;
                                let ids = [];
                                for (let i = 0; i < this.select_sku.length; i++) {
                                    let skus = [];
                                    if(this.select_sku[i]) {
                                        for (let j = 0; j < this.select_sku[i].length; j++) {
                                            if (!this.select_sku[i][j].accepted_goods_qty) {
                                                this.$message({
                                                    type: "error",
                                                    message: `第${i + 1}个采购单的第${j + 1}个sku的良品数未填写!`
                                                });
                                                this.loading = false;
                                                return false;
                                            }
                                            ids.push(this.select_sku[i][j].purchase_parcels_records_id);
                                            if (!this.select_sku[i][j].label_id) {
                                                this.$message({type: "error", message: '请填写贴标工号'});
                                                this.loading = false;
                                                return false;
                                            }
                                            skus.push({
                                                id: this.select_sku[i][j].purchase_parcels_records_id,
                                                sku_id: this.select_sku[i][j].sku_id,
                                                accepted_goods_qty: this.select_sku[i][j].accepted_goods_qty,
                                                defective_product_qty: this.select_sku[i][j].defective_product_qty,
                                                quality_type: this.select_sku[i][j].quality_type,
                                                shortage_quantity: this.select_sku[i][j].shortage_quantity,
                                                is_allow_receipt: this.select_sku[i][j].is_allow_receipt,
                                                label_id: this.select_sku[i][j].label_id
                                            });
                                        }
                                    }
                                    if (skus.length !== 0) {
                                        let info = {
                                            purchase_parcel_code: this.list2[0][i].purchase_parcel_code,
                                            purchase_order_id: this.list2[0][i].purchase_order,
                                            batch_id: this.list2[0][i].batch_id,
                                            skuInfo: skus
                                        };
                                        receiptParcelInfo.push(info);
                                    }
                                }
                                let post = {
                                    receiptParcelInfo: receiptParcelInfo,
                                    ids: ids
                                };
                                this.$http(api_post_audit, post).then(res => {
                                    this.loading = false;
                                    this.$message({
                                        showClose: true,
                                        type: "success",
                                        message: '审核成功'
                                    });
                                    this.search_btn(this.searchData);
                                }).catch(code => {
                                    this.loading = false;
                                    this.$message({type: 'error', message: code.message || code});
                                })
                            }).catch((code) => {
                                console.log(code);
                                this.$message({
                                    type: 'info',
                                    message: '已取消'
                                });
                            });
                        }
                    },
                    {
                        label: '批量打印标签', value: 1, apis: url_print_label,
                        p_action() {
                            let printList = [];
                            console.log(this.select_sku)
                            for (let i = 0; i < this.select_sku.length; i++) {
                                for (let j = 0; j < this.select_sku[i].length; j++) {
                                    let post = {};
                                    post.sku_id = this.select_sku[i][j].sku_id;
                                    post.purchase_order_id = this.select_sku[i][j].purchase_order_id;
                                    post.num = this.select_sku[i][j].accepted_goods_qty;
                                    if (post.num <= 0) {
                                        this.$message({type: "error", message: `第${i + 1}个采购单的第${j + 1}个sku没有输入良品数`});
                                        return false;
                                    }
                                    post.label_type = 1;
                                    post.purchase_parcel_code = this.select_sku[i][j].purchase_parcel_code;
                                    post.shortage_quantity = this.select_sku[i][j].shortage_quantity;
                                    printList.push(post);
                                }
                            }
                            if (!printList.length) {
                                this.$message({type: "warning", message: '请选择要打印的sku'});
                                return false;
                            }
                            console.log('printList', printList);
                            this.$http(api_print_label, {json_data: printList}).then(res => {
                                this.batchData = res;
                                this.batchData.data = this.batchData.data.map(row => {
                                    row.print_num = 1;
                                    return row;
                                });
                                this.batch_printVisible = true;
                                this.$refs.batch_preview.get_template(1, {warehouse_id: list.warehouse_id});
                                if (this.batchData.default_temp_id) {
                                    this.$nextTick(() => {
                                        this.$refs.batch_preview.change_print();
                                    })
                                }
                            }).catch(code => {
                                this.$message({type: "error", message: code.message || code})
                            })
                        }
                    },
                    {
                        label: '批量打印箱唛', value: 2, apis: url_print_lable_box,
                        p_action() {
                            let printList = [];
                            console.log(this.select_sku)
                            for (let i = 0; i < this.select_sku.length; i++) {
                                for (let j = 0; j < this.select_sku[i].length; j++) {
                                    let post = {};
                                    post.sku_id = this.select_sku[i][j].sku_id;
                                    post.purchase_order_id = this.select_sku[i][j].purchase_order_id;
                                    post.num = this.select_sku[i][j].accepted_goods_qty;
                                    if (post.num <= 0) {
                                        this.$message({type: "error", message: `第${i + 1}个采购单的第${j + 1}个sku没有输入良品数`});
                                        return false;
                                    }
                                    post.label_type = 2;
                                    post.purchase_parcel_code = this.select_sku[i][j].purchase_parcel_code;
                                    printList.push(post);
                                }
                            }
                            if (!printList.length) {
                                this.$message({type: "warning", message: '请选择要打印的sku'});
                                return false;
                            }
                            this.$http(api_print_label, {json_data: printList}).then(res => {
                                this.batchData = res;
                                this.batch_printVisible = true;
                                this.$refs.batch_preview.get_template(2, {warehouse_id: list.warehouse_id});
                                if (this.batchData.default_temp_id) {
                                    this.$nextTick(() => {
                                        this.$refs.batch_preview.change_print();
                                    })
                                }
                            }).catch(code => {
                                this.$message({type: "error", message: code.message || code})
                            })
                        }
                    }
                ]
            }
        },
        created() {
            let component = this;
            document.onkeydown = function (event) {
                let e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode === 113) { // 按 F2
                    component.onkey_f2();
                }
            };
        },
        mounted() {
            this.$refs.search_input.$refs.input.select();
            this.$nextTick(() => {
                let card = document.querySelector('form.el-row-reset-card');
                let cardY = (card.getBoundingClientRect().y || card.getBoundingClientRect().top) + 60 + 'px';
                this.cardStyle = {
                    height: `calc(100vh - ${cardY})`
                };
            });
        },
        filters: {
            isZero(val) {
                if (val === 0) {
                    return '';
                } else {
                    return val;
                }
            },
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            },
            purchaserName(val) {
                return val.join();
            }
        },
        methods: {
            is_require(h, {column, $index}) {
                console.log('is_require return', this.create_change_label_id(h), arguments);
                return h(
                    'div',
                    [

                        this.create_change_label_id(h),

                    ]
                );
            },
            create_change_label_id(h) {
                if (this.isChangeLabelId) {
                    return [
                        h('input', {class: 'inline', style: {width: '80%'}, on: {change: this.batch_change_lable_id}}),
                        h('i', {
                            class: 'el-icon-close inline',
                            style: {
                                marginLeft: '3px',
                                border: '1px solid #ccc',
                                height: '20px',
                                lineHeight: '20px'
                            },
                            attrs: {
                                title: '取消'
                            },
                            on: {click: this.change_label_id}
                        })];
                } else {
                    return [
                        h('span', {class: 'arrival-warning-color'}, '*'),
                        h('span', {}, '贴标工号',), h('i', {
                            class: 'el-icon-document',
                            style: {color: 'red'},
                            attrs: {
                                title: '批量设置'
                            },
                            on: {click: this.change_label_id}
                        })];
                }
            },
            batch_change_lable_id(event) {
                console.log('input change', event.target.value, this.list2[this.checkedPackage]);
                typeof event.target.value === 'string' && (event.target.value = event.target.value.trim());
                let value = event.target.value.trim();
                if (!value) return;
                this.checkedPackage.forEach(res => res.label_id = value);
                event.target.value = '';
                return;

            },
            change_label_id() {
                this.isChangeLabelId = !this.isChangeLabelId;
            },
            init() {
                let ret = [];
                let i = 0;
                this.serverData.list.forEach(row => {
                    const ids = row.purchase_order_ids.split(",");
                    const codes = row.purchase_order_codes.split(",");
                    const users = row.purchaser_user_ids.split(",");
                    ret.push(ids.map((id, index) => {
                        row[`skus-${id}`].forEach(res => {
                            this.$set(res, "tag_note", "");
                            this.$set(res, "quality_type", "2");
                            this.$set(res, 'label_id');
                            this.$set(res, "num", i);
                            i++;
                        });
                        const ele = {
                            id: row.id,
                            tracking_number: row.tracking_number,
                            purchase_parcel_code: row.purchase_parcel_code,
                            purchase_order: id,
                            purchase_parcel: 'PO' + id,
                            update_user_id: row.update_user_id,
                            create_time: row.create_time,
                            update_time: row.update_time,
                            purchaser_user_name_list: row.purchaser_user_name_list,
                            purchase_parcel_weight: row.purchase_parcel_weight,
                            purchaser_user_ids: users[index],
                            warehouse_id: row.warehouse_id,
                            warehouse_name: row.warehouse_name,
                            batch_id: row[`batch_id${id}`],
                            skus: row[`skus-${id}`],
                            is_allow_receipt: row[`is_allow_receipt_${id}`],
                            status_text: row[`status_text${id}`]
                        };
                        ele.skus.find(row => {
                            if (row.defective_product_qty === 0) {
                                row.defective_product_qty = '';
                            }
                        });
                        return ele;
                    }))
                });
                this.list2 = ret;
            },
            onkey_f2() {
                switch (this.searchData.s_bill_type) {
                    case 1:
                        this.searchData.s_bill_type = 2;
                        break;
                    case 2:
                        this.searchData.s_bill_type = 4;
                        break;
                    case 4:
                        this.searchData.s_bill_type = 5;
                        break;
                    case 5:
                        this.searchData.s_bill_type = 1;
                        break;
                }
                this.$refs.search_input.$refs.input.select();
            },
            s_bill_enter(ev) {
                this.searchData.s_bill_number = this.searchData.s_bill_number.trim();
                if (ev.keyCode === 13) {
                    this.search_btn(this.searchData);
                }
            },
            //搜索
            search_btn(data) {
                this.loading = true;
                let search = {};
                this.print_all = false;
                this.select_sku = [];
                if (data.s_bill_type === 3) {
                    search = data;
                    this.submitData.s_bill_number = data.s_bill_number;
                    this.submitData.s_bill_type = data.s_bill_type;
                } else {
                    search = this.searchData;
                    this.submitData.s_bill_number = data.s_bill_number;
                    this.submitData.s_bill_type = data.s_bill_type;
                }
                this.serverData.list = [];
                this.list2 = [];
                this.$http(api_get_audit, search).then(res => {
                    this.loading = false;
                    if (res.status === 1) {
                        if (res.parcel_number > 1) {
                            this.purchaseNote = res.parcel_row_list;
                            this.dialogTableVisible = true;
                        } else {
                            this.serverData.list = res.list;
                            this.init();
                            this.$nextTick(() => {
                                console.log(this.$refs.accept)
                                if (!!this.$refs.accept) {
                                    for (let i = 0; i < this.$refs.accept.length; i++) {
                                        if (!(this.$refs.accept[i].$refs.input.disabled)) {
                                            this.$refs.accept[i].$refs.input.select();
                                            break;
                                        }
                                    }
                                }
                            });
                            this.submitShow = true;
                        }
                    } else {
                        this.$refs.search_input.$refs.input.select();
                        this.$message({
                            showClose: true,
                            type: "warning",
                            message: res.message || res
                        });
                        this.submitShow = false;
                    }
                }).catch(code => {
                    this.loading = false;
                    this.$message({message: code.message || code, type: 'error'});
                });
            },
            search_again() {
                this.search_btn(this.submitData);
            },
            //商品详情
            show_goods_detail(row) {
                this.$http(api_url_sku, row.sku_id).then(res => {
                    this.goods_detail.sku = row.sku;
                    this.goods_detail.form = res;
                    this.goods_visible = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            //复核
            re_check(row) {
                this.$http(api_url_get_sku, row.sku_id).then(res => {
                    this.goods_detail.sku_id = row.sku_id;
                    this.goods_detail.form.length = res.length;
                    this.goods_detail.form.weight = res.weight;
                    this.goods_detail.form.height = res.height;
                    this.goods_detail.form.width = res.width;
                    this.review_visible = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            //全选时下面所有的选择框的状态
            selectable() {
                return !this.print_all;
            },
            handle_selection_change(index, select, item) {
                this.select_sku[index] = select;
                this.select_sku[index].forEach(row => {
                    this.$set(row, 'purchase_parcel_code', item.purchase_parcel_code);
                });
                console.log(this.select_sku);
            },
            //点击查看 编辑等
            action(row, act, list) {
                console.log('row', row);
                console.log('act', act);
                this.listId = row.id;
                act.action.call(this, row, list);
            },
            //批量打印
            p_action(act) {
                act.p_action.call(this);
            },
            key_updown(ev, row) {
                if (ev.keyCode === 34) {
                    for (let i = row.num; i < this.$refs.accept.length - 1; i++) {
                        if (!this.$refs.accept[i + 1].$refs.input.disabled) {
                            this.$refs.accept[i + 1].$refs.input.select();
                            break;
                        }
                    }
                } else if (ev.keyCode === 33) {
                    for (let i = row.num; i > 0; i--) {
                        if (!this.$refs.accept[i - 1].$refs.input.disabled) {
                            this.$refs.accept[i - 1].$refs.input.select();
                            break;
                        }
                    }
                }
            },
            //查看大图
            search_img(image) {
                this.imgPath = image.replace("_60x60", "_500x500");
                this.imgDialog = true;
            },
            check_package(e, index, listIndex) { // 确定当前操作的包裹
                this.checkedPackage = this.list2[index][listIndex].skus;
            },
            trim_label_id(row) {
                typeof row.label_id === 'string' && (row.label_id = row.label_id.trim())
            }
        },
        computed: {
            options() {
                return this.operateButtons.filter(row => {
                    return this.$hasPermission(row.apis);
                })
            },
            printAllOptions() {
                return this.printAllButtons.filter(row => {
                    return this.$hasPermission(row.apis);
                })
            }
        },
        watch: {
            print_all(val) {
                this.$nextTick(() => {
                    if (this.list2.length) {
                        for (let i = 0; i < this.list2[0].length; i++) {
                            this.list2[0][i].skus.forEach(row => {
                                this.$refs.table[i].toggleRowSelection(row, val);
                            })
                        }
                    }
                });
            },
        },
        props: {},
        components: {
            searchDialog: require('../arrival/search-dialog.vue').default,
            reviewDialog: require('../arrival/review-dialog.vue').default,
            goodsDetail: require('../arrival/goods-detail.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            preview: require('./preview.vue').default,
            batch_preview: require('./batch_preview.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            blowupImage: require("@/components/blowup-image.vue").default,
        },
    }
</script>
