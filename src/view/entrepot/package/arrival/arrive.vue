<template>
    <div>
        <el-card class="mb-sm">
            <div class="mb-xs arrive-box">
                <label-item label="拆板卡板号：">
                    <el-input ref="box_arrive"
                              placeholder="请扫描卡板号"
                              v-model="box_id"
                              :disabled="!canArriveBox"
                              @focus="select_box"
                              @keyup.enter.native="box_arrive"
                              class="inline width-super"></el-input>
                    <el-button type="primary"
                               @click.native="change_box"
                               class="ml-sm" size="mini">
                        更换卡板号
                    </el-button>
                    <span v-if="!canArriveBox"
                          class="ml-sm font-18 bold-font operate-color">
                        卡板&nbsp;{{box_id}}&nbsp;拆板拆包中</span>
                </label-item>
            </div>
            <el-radio class="radio"
                      v-model="searchData.s_bill_type"
                      label="2">搜运单号
            </el-radio>
            <el-radio class="radio"
                      v-model="searchData.s_bill_type"
                      label="1">搜采购单ID
            </el-radio>
            <el-input
                    v-model="searchData.s_bill_number"
                    placeholder="请输入内容"
                    class="inline mr-sm width-super ml-sm"
                    @focus="number_focus"
                    @keyup.enter.native="s_bill_enter($event)"
                    autofocus
                    ref="search_input"></el-input>
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
        <div class="mb-sm ml-lg" v-if="submitShow" style="overflow: hidden">
            <div class="fl">
                <el-checkbox v-model="print_all" :disabled="allDisabled">打印所有</el-checkbox>
                <trends-select class="inline"
                               @trigger="p_action($event)"
                               :selects="printallOptions"
                               type="primary">
                </trends-select>
            </div>
            <div class="fr">
                <label>使用打印模板：</label>
                <el-select v-model="default_temp_id"
                           placeholder="请选择"
                           class="mr-sm inline"
                           @change="change_print">
                    <el-option
                            v-for="item in template"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-checkbox v-model="relevance">是否打印关联模板</el-checkbox>
                <span>打印机：</span>
                <select-printer v-model="printer" class="inline width-lg"></select-printer>
            </div>
        </div>
        <el-row class="el-row-reset-card"
                :style="cardStyle">
            <el-form
                    v-loading="loading"
                    element-loading-text="玩命加载中">
                <el-form-item v-for="(list, index) in list2" :key="index">
                    <el-card v-for="(item, index) in list"
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
                        <span class="color-success">{{item.purchaser_user_name_list|purchaserName}}</span>
                        <el-button class="inline ml-sm mb-xs" type="primary" size="mini"
                                   @click="abnormal_feedback(item)">拆包异常反馈
                        </el-button>
                        <el-table
                                :data="item.skus"
                                class="arrival-table scroll-bar"
                                ref="table"
                                @selection-change="handle_selection_change(index, $event, item)"
                                highlightCurrentRow
                                style="width: 100%;">
                            <el-table-column
                                    type="selection"
                                    :selectable="selectable"
                                    width="30">
                            </el-table-column>
                            <el-table-column
                                    min-width="70"
                                    label="图片">
                                <template slot-scope="scope">
                                    <el-popover
                                            placement="right"
                                            trigger="hover">
                                        <img :src="scope.row.thumb | imgSrcFilter"
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
                                    min-width="120"
                                    label="SKU/SKU别名">
                                <template slot-scope="scope">
                                    <el-row>
                                        <ui-tip v-if="$hasPermission(apis.url_sku)"
                                                :content="scope.row.sku"
                                                @cur-click="show_goods_detail(scope.row)"
                                                :is-operate="true"
                                                :width="98">
                                        </ui-tip>
                                        <ui-tip v-else
                                                :content="scope.row.sku"
                                                :width="98"
                                        ></ui-tip>
                                        <el-button v-if="(scope.row.check === 0) && $hasPermission(apis.url_get_sku)"
                                                   type="primary"
                                                   @click="re_check(scope.row)"
                                                   size="mini">复核
                                        </el-button>
                                    </el-row>
                                    <ui-tip :content="`${scope.row.sku_alias || '--'}`"></ui-tip>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    min-width="200"
                                    inline-template
                                    label="名称">
                                <div>
                                    {{row.sku_name}}
                                </div>
                            </el-table-column>
                            <el-table-column
                                    min-width="70"
                                    inline-template
                                    label="货位">
                                <span>{{row.warehouse_cargo_code || `--`}}</span>
                            </el-table-column>
                            <el-table-column
                                    label="缺货数量"
                                    min-width="60"
                                    inline-template>
                                <span>{{row.shortage_quantity}}</span>
                            </el-table-column>
                            <el-table-column
                                    prop="qty"
                                    min-width="60"
                                    label="采购数量">
                            </el-table-column>
                            <el-table-column
                                    inline-template
                                    min-width="60"
                                    label="已接收数">
                                <div>
                                    <ui-tip :content="row.expected_int_qty | isZero" :width="98"></ui-tip>
                                </div>
                            </el-table-column>
                            <el-table-column
                                    label="本次良品" min-width="100" class="t-center input-number required-sign">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.accepted_goods_qty"
                                              :class="{arrival_redborder: scope.row.qty - scope.row.accepted_goods_qty < 0 || scope.row.accepted_goods_qty < 0}"
                                              ref="accept"
                                              :disabled="scope.row.status === 1 || item.is_allow_receipt === 0"
                                              style="width: 100%"
                                              type="number"
                                              @focus="goods_focus(scope.row)"
                                              @keyup.native="key_updown($event, scope.row)">
                                    </el-input>
                                    <span class="arrival-warning-color"
                                          v-if="scope.row.qty - scope.row.accepted_goods_qty < 0 || scope.row.accepted_goods_qty < 0">请输入正确的良品数</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="本次次品" inline-template class="t-center ">
                                <el-input v-model="row.defective_product_qty"
                                          :min="0"
                                          style="width: 100%"
                                          type="number"
                                          :disabled="row.status === 1 || item.is_allow_receipt === 0">
                                </el-input>
                            </el-table-column>
                            <el-table-column
                                    inline-template
                                    label="备注">
                                <div>
                                    <el-input v-model="row.note"
                                              @change="trim_note(row)"
                                              style="width: 100%">
                                    </el-input>
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
                                    min-width="120">
                                <template slot-scope="scope">
                                    <trends-select class="inline"
                                                   @trigger="r_action(scope.row,item,$event)"
                                                   :selects="options(scope.row)"
                                                   type="primary">
                                    </trends-select>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-form-item>
                <div v-if="showSave && submitShow" class="fr">
                    <permission tag="ElButton"
                                :route="apis.url_parcel_receipt"
                                type="primary"
                                class="mr-md"
                                :disabled="btnDisabled"
                                @click.native="form_submit(false)"
                                size="mini">保存
                    </permission>
                    <permission tag="ElButton"
                                :route="apis.url_parcel_receipt"
                                type="primary"
                                class="mr-md"
                                :disabled="btnDisabled"
                                @click.native="form_submit(true)"
                                size="mini">保存并打印
                    </permission>
                </div>

            </el-form>
            <div class="fl arrival-blue" v-if="submitShow">
                小提示：填写本次良品时按下PageUp或PageDown可以上下切换哟~
            </div>
        </el-row>
        <!--</el-card>-->
        <search-dialog v-model="dialogTableVisible"
                       @refresh="search_btn"
                       :purchase-note="purchaseNote">
        </search-dialog>
        <review-dialog v-model="review_visible"
                       :goods_detail="goods_detail"
                       @init="search_again">
        </review-dialog>
        <goods-detail v-model="goods_visible"
                      :goods_detail="goods_detail">
        </goods-detail>
        <preview v-model="printVisible"
                 :table-data="tableData"
                 :print-data="printData"
                 :relevance="relevance"
                 :printer="printer"
                 :preview-show="previewShow"
                 ref="preview">
        </preview>
        <batch_preview v-model="batch_printVisible"
                       :batch-show="batchShow"
                       :relevance="relevance"
                       :printer="printer"
                       :batch-data="batchData"
                       ref="batch_preview">
        </batch_preview>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
        <abnormal-feedback v-model="feedbackVisible"
                           @search="search_btn(searchData)"
                           :feedback-info="feedbackInfo"></abnormal-feedback>
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

    .arrive-box {
        .operate-color {
            color: #1d8ce0;
        }
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
        api_parcel_search,
        api_url_get_sku,
        api_url_sku,
        api_post_auditParcel,
        url_parcel_search,
        url_get_sku,
        url_sku,
        url_parcel_receipt,
        url_lable_data,
        url_print_label,
        api_lable_data,
        api_lable_box_data,
        api_print_label,
        api_print_lable_box,
        api_get_print
    } from "@/api/arrival-parcel.js"
    import {api_box_transfer, api_box_unpacked} from "@/api/purchase-parcels-box";
    import {api_label_type_list, api_label_edit} from "@/api/print"
    import {mapGetters, mapActions} from 'vuex';

    export default {
        activated() {//当切换到当前页面时触发这个回调。
            this.$refs.search_input.$refs.input.focus();
            let component = this;
            document.onkeydown = function (event) {
                let e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode === 113) { // 按 F2
                    component.onkey_f2();
                }
            };
        },
        deactivated() {//当切换到其它页面时触发这个回调。

        },
        page: {},
        refresh() {
            this.submitShow = false;
            this.serverData.list = [];
            this.searchData.s_bill_type = "2";
            this.searchData.s_bill_number = "";
            this.$refs.search_input.$refs.input.focus();
        },
        permission: {
            url_parcel_search,
            url_get_sku,
            url_sku,
            url_parcel_receipt,
            url_lable_data,
            url_print_label,
        },
        data() {
            return {
                cardStyle: {},
                printVisible: false,
                batch_printVisible: false,
                serverData: {list: []}, //获取的表格数据
                modifyData: [],//提交的修改的数据
                submitShow: false,//确定按钮是否显示
                purchase: {
                    purchase_parcel_code: '',
                    purchase_order_id: '',
                    skuInfo: [],
                },//提交的对象
                searchData: {
                    s_bill_type: "2",
                    s_bill_number: "",
                },//搜索栏数据
                purchaseNote: [],//弹框的数据
                submitData: {},//点击确定修改的数据
                dialogTableVisible: false,
                review_visible: false,
                feedbackVisible: false,
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
                tableData: [],
                batchData: [],
                print_all: false,
                select_sku: [],
                select_table: 0,
                list2: [],
                token: '',
                print_width: '',
                print_height: '',
                printer: '',
                relevance: true,
                template: [],
                batchShow: false,
                previewShow: false,
                default_temp_id: '',
                allDisabled: false,
                imgPath: '',
                imgDialog: false,
                btnDisabled: false,
                operateButtons: [
                    {label: '保存并打印', value: 2, apis: url_lable_data, disabled: false},
                    {label: '打印标签', value: 1, apis: url_lable_data, disabled: false},
                ],
                printAllButtons: [
                    {
                        label: '批量打印标签', value: 1, apis: url_print_label,
                        p_action() {
                            let printList = [];
                            console.log(this.select_sku);
                            for (let i = 0; i < this.select_sku.length; i++) {
                                for (let j = 0; j < this.select_sku[i].length; j++) {
                                    let post = {};
                                    post.sku_id = this.select_sku[i][j].sku_id;
                                    post.purchase_order_id = this.select_sku[i][j].purchase_order_id;
                                    post.num = this.select_sku[i][j].accepted_goods_qty;
                                    // if(post.num <= 0){
                                    //     this.$message({type:"error",message:`第${i+1}个采购单的第${j+1}个sku没有输入良品数`});
                                    //     return false;
                                    // }
                                    post.label_type = 1;
                                    post.purchase_parcel_code = this.select_sku[i][j].purchase_parcel_code;
                                    post.shortage_quantity = this.select_sku[i][j].shortage_quantity;
                                    post.note = this.select_sku[i][j].note;
                                    printList.push(post);
                                }
                            }
                            if (!printList.length) {
                                this.$message({type: "warning", message: '请选择要打印的sku'});
                                return false;
                            }
                            console.log('printList', printList);
                            //TODO:批量打印标签报错，功能无法使用
                            this.$http(api_print_label, {json_data: printList}).then(res => {
                                this.batchData = res;
                                this.batchShow = true;
                                this.batch_printVisible = true;
                                this.batchData.default_temp_id = clone(this.default_temp_id);
                                this.$refs.batch_preview.get_template(1, {warehouse_id: this.list2[0][0].warehouse_id});
                                console.log('batchData', this.batchData);
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
                ],
                feedbackInfo: {},
                boxMessage: [
                    '该卡板中没有接受包裹，无法拆板',//新增
                    '卡板未完成打板，不允许拆板！',//接受
                    '',//打板完成
                    '',//拆板
                    '该卡板已拆板完成！',
                ],
                trackingMessage: [
                    '',
                    '卡板未完成打板，不允许拆板！',
                    '请扫描卡板号开始拆板！',
                    '',
                    '卡板已拆板完成！',
                ],
                trackingBoxMessage: [
                    '',
                    '该包裹不属于当前卡板号，不允许执行拆包！请检查包裹真实卡板号的状态！',
                    '该包裹不属于当前卡板号，不允许执行拆包！请检查包裹真实卡板号的状态！',
                    '该包裹不属于当前卡板号，是否执行拆包？',
                    '该包裹不属于当前卡板号，不允许执行拆包！请检查包裹真实卡板号的状态！',
                ],
                box_id: '',
                canArriveBox: true,
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
            // this.get_template(1);
            this.$nextTick(() => {
                let card = document.querySelector('div.el-row-reset-card');
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
            imgSrcFilter(val) {
                return val.replace("_60x60", "_200x200");
            },
            purchaserName(val) {
                return val.join();
            }
        },
        methods: {
            ...mapActions({
                set_printerList: 'api/set_printerList'
            }),
            options(row) {
                return row.operateButtons.filter(row => {
                    return this.$hasPermission(row.apis);
                })
            },
            r_action(data, list, ev) {
                switch (ev.value) {
                    case 1:
                        this.tableData = [];
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
                            this.tableData.push(res);
                            this.printVisible = true;
                            this.previewShow = true;
                            this.printData.default_temp_id = clone(this.default_temp_id);
                            this.$refs.preview.get_template(1, {warehouse_id: list.warehouse_id});
                            if (this.printData.default_temp_id) {
                                this.$nextTick(() => {
                                    this.$refs.preview.print();
                                })
                            }
                        }).catch(code => {
                            this.$message({type: "error", message: code.message || code})
                        });
                        break;
                    case 2:
                        let skus = [];
                        let receiptParcelInfo = [];
                        if (data.accepted_goods_qty && data.defective_product_qty) {
                            this.$message({type: "error", message: ''});
                        }
                        skus.push({
                            id: data.purchase_parcels_records_id,
                            sku_id: data.sku_id,
                            accepted_goods_qty: data.accepted_goods_qty,
                            defective_product_qty: data.defective_product_qty,
                            quality_type: data.quality_type,
                            shortage_quantity: data.shortage_quantity,
                            is_allow_receipt: data.is_allow_receipt,
                            note: data.note
                        });
                        let info = {
                            purchase_parcel_code: list.purchase_parcel_code,
                            purchase_order_id: list.purchase_order,
                            batch_id: list.batch_id,
                            skuInfo: skus,
                        };
                        if (this.box_id && !this.canArriveBox) {
                            info.box_id = this.box_id;
                        }
                        if (info.skuInfo.length > 0) {
                            receiptParcelInfo.push(info);
                        }
                        this.$http(api_parcel_receipt, {receiptParcelInfo}).then(res => {
                            this.loading = false;
                            if (res.status === 1) {
                                this.$message({
                                    showClose: true,
                                    type: "success",
                                    message: '保存成功'
                                });
                                // data = res.data;//前端不刷新替换数据

                                if (res.box_arrived === 1) {
                                    this.$message({type: 'success', message: '当前卡板号拆板完成！'});
                                    this.box_id = '';
                                    this.canArriveBox = true;
                                    this.select_box();
                                }

                                if (this.default_temp_id === '') {
                                    this.$message({type: "error", message: '请选择打印模板'});
                                    return false;
                                }
                                this.tableData = [];
                                let post = {
                                    sku_id: data.sku_id,
                                    purchase_order_id: data.purchase_order_id,
                                    num: data.accepted_goods_qty,
                                    label_type: 1,
                                    purchase_parcel_code: list.purchase_parcel_code,
                                    shortage_quantity: data.shortage_quantity
                                };
                                this.$http(api_lable_data, post).then(res => {
                                    this.$set(this, 'printData', res);
                                    this.tableData.push(res);
                                    this.printVisible = true;
                                    this.previewShow = false;
                                    this.printData.default_temp_id = clone(this.default_temp_id);
                                    this.$refs.preview.get_template(1, {warehouse_id: list.warehouse_id});
                                    this.$nextTick(() => {
                                        this.$refs.preview.print();
                                    });
                                }).catch(code => {
                                    this.$message({type: "error", message: code.message || code})
                                });
                                //TODO:保存成功后需要后端返回保存后的单条数据，前端更新列表

                                if (res.box_arrived === 1) {
                                    this.$message({type: 'success', message: '当前卡板号拆板完成！'});
                                    this.box_id = '';
                                    this.canArriveBox = true;
                                    this.select_box();
                                }
                                // this.search_btn(this.searchData);
                            } else {
                                this.$message({
                                    showClose: true,
                                    type: "warning",
                                    message: res.message || res
                                })
                            }
                        }).catch(code => {
                            this.loading = false;
                            this.$message({type: 'error', message: code.message || code});
                        });
                        break;
                }
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
//                            this.$set(res,"accepted_goods_qty","");
                            this.$set(res, "tag_note", "");
                            this.$set(res, "quality_type", "2");
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
                            console.log('skus', row);
                            this.$set(row, 'operateButtons', clone(this.operateButtons));
                            if (row.status === 1 || ele.is_allow_receipt === 0) {
                                row.operateButtons[0].disabled = true;
                            } else {
                                row.operateButtons[0].disabled = false;
                            }
                            if (row.accepted_goods_qty === 0) {
                                row.accepted_goods_qty = '';
                                row.operateButtons[1].disabled = true;
                            } else {
                                row.operateButtons[1].disabled = false;
                            }
                            if (row.defective_product_qty === 0) {
                                row.defective_product_qty = '';
                            }
                        });
                        return ele;
                    }))
                });
                // this.print_all = true;
                this.list2 = ret;
                this.get_template(1);
            },
            onkey_f2() {
                if (this.searchData.s_bill_type === '1') {
                    this.searchData.s_bill_type = '2';
                } else {
                    this.searchData.s_bill_type = '1';
                }
            },
            form_submit(isPrint) {
                let receiptParcelInfo = [];
                for (let k = 0; k < this.list2.length; k++) {
                    let lis = this.list2[k];
                    console.log(lis);
                    for (let i = 0; i < lis.length; i++) {
                        let row = lis[i];
                        let skus = [];
                        for (let j = 0; j < row.skus.length; j++) {
                            let item = row.skus[j];
                            if (!!Number(item.accepted_goods_qty) || !!Number(item.defective_product_qty)) {
                                skus.push({
                                    id: item.purchase_parcels_records_id,
                                    sku_id: item.sku_id,
                                    accepted_goods_qty: item.accepted_goods_qty,
                                    defective_product_qty: item.defective_product_qty,
                                    quality_type: item.quality_type,
                                    shortage_quantity: item.shortage_quantity,
                                    is_allow_receipt: item.is_allow_receipt,
                                    note: item.note
                                });
                            }
                        }
                        let info = {
                            purchase_parcel_code: row.purchase_parcel_code,
                            purchase_order_id: row.purchase_order,
                            batch_id: row.batch_id,
                            skuInfo: skus,
                        };
                        if (this.box_id && !this.canArriveBox) {
                            info.box_id = this.box_id;
                        }
                        if (info.skuInfo.length > 0) {
                            receiptParcelInfo.push(info);
                        }
                    }
                }
                if (receiptParcelInfo.length === 0) {
                    this.$message({type: "error", message: '没有要提交的数据'});
                    return false;
                }
                this.$confirm('是否保存数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.btnDisabled = true;
                    this.loading = true;
                    this.$http(api_parcel_receipt, {receiptParcelInfo}).then(res => {
                        this.loading = false;
                        this.btnDisabled = false;
                        if (res.status === 1) {
                            this.$message({
                                showClose: true,
                                type: "success",
                                message: '保存成功'
                            });
                            if (res.box_arrived === 1) {
                                this.$message({type: 'success', message: '当前卡板号拆板完成！'});
                                this.box_id = '';
                                this.canArriveBox = true;
                                this.select_box();
                            }
                            if (isPrint) {
                                if (this.default_temp_id === '') {
                                    this.$message({type: "error", message: '请选择打印模板'});
                                    return false;
                                }
                                let printList = [];
                                for (let k = 0; k < this.list2.length; k++) {
                                    let lis = this.list2[k];
                                    for (let i = 0; i < lis.length; i++) {
                                        let row = lis[i];
                                        for (let j = 0; j < row.skus.length; j++) {
                                            let item = row.skus[j];
                                            if (!!Number(item.accepted_goods_qty) || !!Number(item.defective_product_qty)) {
                                                let post = {};
                                                post.sku_id = item.sku_id;
                                                post.purchase_order_id = item.purchase_order_id;
                                                post.num = item.accepted_goods_qty;
                                                post.label_type = 1;
                                                post.purchase_parcel_code = row.purchase_parcel_code;
                                                post.shortage_quantity = item.shortage_quantity;
                                                printList.push(post);
                                            }
                                        }
                                    }
                                }
                                console.log('printList', printList);
                                this.$http(api_print_label, {json_data: printList}).then(res => {
                                    this.batchData = res;
                                    this.batchShow = false;
                                    this.batch_printVisible = true;
                                    this.batchData.default_temp_id = clone(this.default_temp_id);
                                    this.$nextTick(() => {
                                        this.$refs.batch_preview.print();
                                        this.$refs.search_input.inputSelect();
                                    });
                                }).catch(code => {
                                    this.$message({type: "error", message: code.message || code})
                                })
                            }
                            // this.search_btn(this.searchData);
                        } else {
                            this.$message({
                                showClose: true,
                                type: "warning",
                                message: res.message || res
                            })
                        }
                    }).catch(code => {
                        this.loading = false;
                        this.btnDisabled = false;
                        this.$message({type: 'error', message: code.message || code});
                    })
                }).catch((code) => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                    console.error(code);
                });
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
                typeof data.s_bill_number === 'string' && (data.s_bill_number = data.s_bill_number.trim());
                if (data.s_bill_type === 3) {
                    search = data;
                    this.submitData.s_bill_number = data.s_bill_number;
                    this.submitData.s_bill_type = data.s_bill_type;
                } else {
                    search = this.searchData;
                    this.submitData.s_bill_number = data.s_bill_number;
                    this.submitData.s_bill_type = data.s_bill_type;
                }
                if (this.box_id && !this.canArriveBox) {
                    search.box_id = this.box_id;
                }
                this.serverData.list = [];
                this.list2 = [];
                this.$http(api_parcel_search, search).then(res => {
                    this.loading = false;

                    if (res.status === 1) {
                        if (res.parcel_number > 1) {
                            this.purchaseNote = res.parcel_row_list;
                            this.dialogTableVisible = true;
                        } else {
                            if (!this.box_check(res.box_status, res.current_box)) {
                                return;
                            }
                            this.serverData.list = res.list;
                            this.init();
                            this.$nextTick(() => {
                                for (let i = 0; i < this.$refs.accept.length; i++) {
                                    if (!(this.$refs.accept[i].$refs.input.disabled)) {
                                        this.$refs.accept[i].inputSelect();
                                        break;
                                    }
                                }
                            });
                            this.submitShow = true;
                        }
                    } else {
                        this.$refs.search_input.inputSelect();
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
            selectable(row, index) {
                return row.status !== 1 && row.accepted_goods_qty !== '';
            },
            handle_selection_change(index, select, item) {
                this.select_sku[index] = select;
                this.select_sku[index].forEach(row => {
                    this.$set(row, 'purchase_parcel_code', item.purchase_parcel_code);
                });
                console.log('select', this.select_sku);
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
                            this.$refs.accept[i + 1].inputSelect();
                            break;
                        }
                    }
                } else if (ev.keyCode === 33) {
                    for (let i = row.num; i > 0; i--) {
                        if (!this.$refs.accept[i - 1].$refs.input.disabled) {
                            this.$refs.accept[i - 1].inputSelect();
                            break;
                        }
                    }
                }
            },
            number_focus() {
                this.$refs.search_input.inputSelect();
            },
            goods_focus(row) {
                this.$refs.accept[row.num].inputSelect();
            },
            get_template(id) {
                let data = {
                    warehouse_id: this.list2[0][0].warehouse_id,
                };
                this.$http(api_label_type_list, id, data).then(res => {
                    this.template = res;
                    let default_temp = this.template.some(row => {
                        if (row.is_default === 1) {
                            this.default_temp_id = row.id;
                            this.change_print();
                            return true;
                        }
                        return false;
                    });
                    if (!default_temp) {
                        this.default_temp_id = this.template[0].id;
                        this.change_print();
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            change_print() {
                this.batch_printVisible = true;
                this.batchShow = false;
                this.$refs.batch_preview.print_content = '';
                this.$refs.batch_preview.htmlList = [];
                this.$refs.preview.print_content = '';
                this.get_data(this.default_temp_id);
            },
            get_data(id) {
                return this.$http(api_label_edit, id).then(res => {
                    console.log('templateData', res);
                    this.$refs.preview.templateData = res;
                    this.$refs.batch_preview.templateData = res;
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            //查看大图
            search_img(image) {
                this.imgPath = image.replace("_60x60", "_500x500");
                this.imgDialog = true;
            },
            abnormal_feedback(item) {
                this.feedbackVisible = true;
                this.feedbackInfo = item;
            },
            trim_note(row) {
                typeof row.note === 'string' && (row.note = row.note.trim());
            },
            change_box() {//更换卡板号
                this.box_id = '';
                this.canArriveBox = true;
                this.select_box();
            },
            select_box() {//卡板号选中
                this.$refs.box_arrive.inputSelect();
            },
            box_arrive() {//扫描卡板号更改状态
                this.box_id = this.box_id.trim();
                if (this.box_id === '') {
                    this.$message({type: 'error', message: '请输入卡板号'});
                    this.select_box();
                    return;
                }
                this.$http(api_box_transfer, this.box_id).then(res => {
                    switch (res.box_status) {
                        case -1:
                        case -2:
                            let message = res.box_status === -1 ? '请输入正确的卡板号！' : '该卡板中没有包裹！'
                            this.$message({type: 'error', message: message});
                            this.box_id = '';
                            this.select_box();
                            break;
                        case 2:
                        case 3:
                            this.canArriveBox = false;
                            this.number_focus();
                            break;
                        case 1:
                        case 0:
                        case 4:
                            this.$message({type: 'error', message: this.boxMessage[res.box_status]});
                            this.box_id = '';
                            this.select_box();
                            break;
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                    this.box_id = '';
                    this.select_box();
                });
            },
            box_check(box_status, current_box) {//保存时卡板检查
                if (this.box_id === '') {
                    switch (box_status) {
                        case 0:
                            break;
                        case 2:
                            this.$message({type: 'error', message: this.trackingMessage[box_status]});
                            this.searchData.s_bill_number = '';
                            this.select_box();
                            return false;
                        case 3:
                            return true;
                        case 1:
                            this.$message({type: 'error', message: this.trackingMessage[box_status]});
                            this.searchData.s_bill_number = '';
                            this.number_focus();
                            return false;
                        case 4:
                            this.$message({type: 'warning', message: this.trackingMessage[box_status]});
                            return true;
                        default:
                            return true;
                    }
                } else {
                    if (current_box === false) {
                        switch (box_status) {
                            case 0:
                                break;
                            case 3:
                                let result = false;
                                this.$confirm(`${this.trackingBoxMessage[box_status]}`, '提示', {
                                    confirmButtonText: "确定",
                                    cancelButtonText: "取消",
                                    type: "warning"
                                }).then(() => {
                                    result = true;
                                }).catch(() => {
                                    result = false;
                                    this.searchData.s_bill_number = '';
                                    this.number_focus();
                                });
                                return result;
                            case 1:
                            case 2:
                                this.$message({type: 'error', message: this.trackingBoxMessage[box_status]});
                                this.searchData.s_bill_number = '';
                                this.number_focus();
                                return false;
                            case 4:
                                this.$message({type: 'warning', message: this.trackingBoxMessage[box_status]});
                                return true;
                            default:
                                return true;
                        }
                    } else {
                        switch (box_status) {
                            case 0:
                                break;
                            case 2:
                                this.$message({type: 'error', message: this.trackingMessage[box_status]});
                                this.searchData.s_bill_number = '';
                                this.select_box();
                                return false;
                            case 3:
                                return true;
                            case 1:
                                this.$message({type: 'error', message: this.trackingMessage[box_status]});
                                this.searchData.s_bill_number = '';
                                this.number_focus();
                                return false;
                            case 4:
                                this.$message({type: 'warning', message: this.trackingMessage[box_status]});
                                return true;
                            default:
                                return true;
                        }
                    }
                    return true;
                }
            }
        },
        computed: {
            printallOptions() {
                this.allDisabled = !this.showSave;
                return this.printAllButtons.filter(row => {
                    row.disabled = !this.showSave;
                    return this.$hasPermission(row.apis);
                })
            },
            showSave() {
                let flag = false;
                if (this.list2[0]) {
                    for (let i = 0; i < this.list2[0].length; i++) {
                        if (this.list2[0][i].is_allow_receipt !== 0) {
                            flag = true;
                        }
                    }
                }
                return flag;
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
            searchDialog: require('./search-dialog.vue').default,
            reviewDialog: require('./review-dialog.vue').default,
            goodsDetail: require('./goods-detail.vue').default,
            preview: require('./preview.vue').default,
            batch_preview: require('./batch_preview.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            selectPrinter: require('@/components/select-printer.vue').default,
            blowupImage: require("@/components/blowup-image.vue").default,
            trendsSelect: require('@/components/trends-select.vue').default,
            abnormalFeedback: require('./abnormal-feedback.vue').default,
        },
    }
</script>
