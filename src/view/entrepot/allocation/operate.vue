<template>
    <page-dialog class="p-transfer-plan"
                 :title="action.title" size="large"
                 v-model="visible" @close="close" :close-on-click-modal="false">
        <table class="right-table mb-sm" cellpadding="0" cellspacing="0" v-if="!isAdd">
            <tr>
                <td width="150">出库仓库</td>
                <td width="150">{{editData.out_warehouse}}</td>
                <td width="150">入库仓库</td>
                <td width="150">
                    <!--el-select v-model="editData.in_warehouse_id"
                               v-if="isEdit"
                               class="inline width-sm"
                               filterable clearable>
                        <el-option v-for="item in select_in_warehouse"
                                   :value="item.value"
                                   :key="item.value"
                                   :label="item.label"
                                   :disabled="item.value === editData.out_warehouse_id">
                        </el-option>
                    </el-select>-->
                    <span>{{editData.in_warehouse}}</span>
                </td>
                <td width="150">状态</td>
                <td width="150" style="position: relative">
                    {{editData.status_txt}}
                    <el-tooltip :content="row.reason" placement="right" effect="light" v-if="editData.status === 2">
                        <span class="error-icon"></span>
                    </el-tooltip>
                </td>
            </tr>
            <tr>
                <td width="150">创建人</td>
                <td width="150">{{editData.create}}</td>
                <td width="150">创建时间</td>
                <td width="150">{{editData.create_time | timeFilter}}</td>
                <td width="150">更新人</td>
                <td width="150">{{editData.update}}</td>
            </tr>
            <tr>
                <td width="150">审核人</td>
                <td width="150">{{editData.auditor}}</td>
                <td width="150">审核时间</td>
                <td width="150">{{editData.auditor_time | timeFilter}}</td>
                <td width="150">更新时间</td>
                <td width="150">{{editData.update_time | timeFilter}}</td>
            </tr>
        </table>
        <div>
            <div v-if="isAdd">
                <label-item label="调出仓库：">
                    <el-select v-model="editData.out_warehouse_id"
                               class="inline width-sm"
                               clearable filterable
                               @change="selected_out_warehouse">
                        <el-option v-for="item in select_out_warehouse"
                                   :value="item.value"
                                   :key="item.value"
                                   :label="item.label"
                                   :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="调入仓库：" class="ml-sm">
                    <el-select v-model="editData.in_warehouse_id"
                               class="inline width-sm"
                               clearable filterable
                               @change="selected_in_warehouse">
                        <el-option v-for="item in select_in_warehouse"
                                   :value="item.value"
                                   :key="item.value"
                                   :label="item.label"
                                   :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </label-item>
            </div>
            <div v-if="isAdd || isEdit" style="overflow:hidden;" class="mb-sm mt-sm">
                <div class="fl">
                    <el-button
                            type="primary"
                            :disabled="editData.out_warehouse_id === '' || editData.in_warehouse_id === '' || isEdit"
                            @click="addProduct"
                            size="mini">添加商品
                    </el-button>
                    <permission tag="ElButton" type="primary"
                                :route="apis.url_allocation_import_goods"
                                @click.native="goods_import"
                                :disabled="editData.out_warehouse_id === '' || editData.in_warehouse_id === '' || isEdit"
                                size="mini">导入商品
                    </permission>
                    <permission tag="ElButton" type="primary"
                                :route="apis.url_stock_list_by_code"
                                @click.native="stock_goods_import"
                                :disabled="editData.out_warehouse_id === '' || editData.in_warehouse_id === '' || isEdit"
                                size="mini">从备货计划引入商品
                    </permission>
                    <el-button
                            type="primary"
                            @click="deleteProduct"
                            size="mini">删除
                    </el-button>
                </div>
                <div class="fr blue">
                    小提示：填写调拨数量时按下PageUp或PageDown可以上下切换哟~
                </div>
            </div>
        </div>
        <ui-table v-model="checkAll"
                  element-loading-text="玩命加载中..."
                  :has-data="editData.sku_list.length>0"
                  :body-height="280"
                  :heads="uiHeads"
                  @check="check_all">
            <tbody>
            <template v-for="(row,index) in editData.sku_list">
                <tr @click="add_class(index)"
                    :class="[clickData[index]?'active-color':'']">
                    <!--isCheck-->
                    <td v-if="isAdd || isEdit"
                        :rowspan="row | filterRowspan">
                        <el-checkbox v-model="row.isCheck" @change="check_box"></el-checkbox>
                    </td>
                    <!--图片-->
                    <td :rowspan="row | filterRowspan">
                        <el-popover
                                placement="right"
                                trigger="hover">
                            <img :src="row.thumb | filterImage" width="200px" height="200px">
                            <span slot="reference">
                                    <img :src="row.thumb" v-if="row.thumb"
                                         height="60px" width="60px"
                                         style="border:none;vertical-align: middle">
                                </span>
                        </el-popover>
                    </td>
                    <!--SKU/SKU别名-->
                    <td :rowspan="row | filterRowspan">
                        <div>
                            <div>
                                {{row.sku}}
                            </div>
                            <div v-for="item in row.sku_alias">{{item || `--`}}</div>
                        </div>
                    </td>
                    <!--第三方SKU-->
                    <td v-if="isThirdSku" :rowspan="row | filterRowspan">
                        <div>{{row.third_sku}}</div>
                    </td>
                    <!--产品名称-->
                    <td :rowspan="row | filterRowspan">
                        <div>{{row.goods_name}}</div>
                    </td>
                    <!--产品物流属性-->
                    <td :rowspan="row | filterRowspan">
                        <div>{{row.transport_property}}</div>
                    </td>
                    <!--可用库存-->
                    <td v-if="isAdd || isEdit || isCheckPackage" :rowspan="row | filterRowspan">
                        <ui-tip :content="row.available_quantity" :width="98"></ui-tip>
                    </td>
                    <!--备货计划单号-->
                    <td v-if="isAdd || isEdit || isCheckPackage">
                        {{row.stocking_info[0] ? row.stocking_info[0].stocking_code : '--'}}
                    </td>
                    <!--库存锁定数量-->
                    <td v-if="isAdd || isEdit || isCheckPackage">
                        <div>
                            {{row.stocking_info[0] ? row.stocking_info[0].qty : 0}}
                        </div>
                    </td>
                    <!--调拨数量-->
                    <td :rowspan="row | filterRowspan">
                        <div>
                            <integer-input v-model="row.quantity"
                                           :min="0"
                                           :max="maxQuantity(row)"
                                           ref="quantity"
                                           :class="{warningborder:row.quantity > row.can_use_quantity}"
                                           @key-updown="key_updown($event, index)"
                                           @focus="focus(index)"
                                           v-if="isAdd || isEdit">
                            </integer-input>
                            <span v-if="!isAdd && !isEdit">{{row.quantity}}</span>
                        </div>
                    </td>
                    <!--出库数量-->
                    <td v-if="isLook">
                        <div>{{row.send_qty}}</div>
                    </td>
                    <!--出库货位号-->
                    <td v-if="isLook">
                        <div>{{row.out_cargo_code}}</div>
                    </td>
                    <!--成本-->
                    <td v-if="isLook">
                        <div>{{row.price | filterable}}</div>
                    </td>
                    <!--已入库数量-->
                    <td v-if="isLook">
                        <ui-tip :content="row.in_qty" :width="98"></ui-tip>
                    </td>
                    <!--备货计划单号-->
                    <td v-if="isLook">
                        <div v-for="code in row.stock_code" :key="code">
                            {{code}}
                        </div>
                    </td>
                </tr>
                <tr v-for="(item,itemIndex) in row.stocking_info"
                    :key="item.stocking_id" v-if="itemIndex!==0">
                    <!--备货计划单号-->
                    <td v-if="isAdd || isEdit">
                        {{item.stocking_code}}
                    </td>
                    <!--库存锁定数量-->
                    <td v-if="isAdd || isEdit">
                        <div>
                            {{item.qty}}
                        </div>
                    </td>
                </tr>
            </template>
            </tbody>
        </ui-table>
        <div class="t-right mt-xs mr-sm" v-if="isAdd || isEdit">
            <span class="font-14">sku总数：{{total}}</span>
        </div>
        <div class="mt-xs fr fl-clear" v-if="isEditPackage || isLook">
            <label>运费：</label>
            <ui-limit-number v-if="isEditPackage" v-model="editData.shipping_fee" class="inline"
                             style="width: 50px;"></ui-limit-number>
            <span v-if="isLook">{{editData.shipping_fee}}</span>
            <el-select v-if="isEditPackage" v-model="editData.currency_code" class="inline width-xs"
                       placeholder="请选择币种">
                <el-option v-for="(item, index) in currencyList"
                           :key="index"
                           :label="item.code"
                           :value="item.value">
                </el-option>
            </el-select>
            <span v-if="isLook">{{editData.currency_code}}</span>
            <label class="ml-sm">运单号：</label>
            <el-input v-if="isEditPackage" v-model="editData.tracking_number" class="inline"></el-input>
            <span v-if="isLook">{{editData.tracking_number}}</span>
        </div>
        <div class="mt-xs">
            <label-item label="发货物流方式：">
                <el-radio-group v-model="editData.shipping_type" :disabled="!(isAdd || isEdit)">
                    <el-radio :label="1" class="ml-sm">空运</el-radio>
                    <el-radio :label="2" class="ml-sm">海运</el-radio>
                    <el-radio :label="3" class="ml-sm">其他</el-radio>
                </el-radio-group>
            </label-item>
        </div>
        <el-row class="mt-xs" v-if="isAdd">
            <label-item>
                <span slot="label">上传商品条码附件<span class="red">(记得上传商品条码对应表)</span>：</span>
                <div class="file-btn"
                     v-if="files.length === 0">
                    选择文件
                    <input type="file"
                           ref="file"
                           :multiple="true"
                           @change="file_change">
                </div>
                <div v-else>
                    <el-tag class="mr-xs"
                            type="primary"
                            closable
                            v-for="(item, index) in files"
                            @close="barcode_close(index)"
                            :key="index">{{item.file.name}}
                    </el-tag>
                </div>
            </label-item>
        </el-row>
        <div style="clear: both">
            <span class="mb-sm inline">备注：</span>
            <el-input
                    type="textarea"
                    :disabled="isLook"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="editData.remark">
            </el-input>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="saveAdd" type="primary" :disabled="isDisabled" size="mini" v-if="isAdd">保 存
            </el-button>
            <el-button @click="saveEdit" type="primary" :disabled="isDisabled" size="mini" v-if="isEdit">保 存
            </el-button>
            <el-button @click="saveEditPackage" type="primary" size="mini" v-if="isEditPackage">保 存</el-button>
            <el-button @click="saveCheck" type="primary" size="mini" v-if="isCheckPackage">审核通过</el-button>
            <el-button @click="saveUncheck" type="primary" size="mini" v-if="isCheckPackage">审核不通过</el-button>
            <el-button @click="cancel" size="mini">{{cancelText}}</el-button>
        </div>
        <!--原因-->
        <div v-if="showRemark" class="el_card_remark">
            <div class="remark-sale-look">
                <label class="remark-sale-header">审核不通过的原因: </label>
                <el-form class="remark-sale-body">
                    <el-form-item>
                        <el-input type="textarea" v-model="reason" :maxlength="225"
                                  :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                    </el-form-item>
                </el-form>
                <div class="remark-sale-footer">
                    <div class="fr">
                        <button class="small-button submit" type="button" @click="saveMark">提交</button>
                        <button class="small-button cancel" type="button" @click="showRemark=false">取消</button>
                    </div>
                </div>
            </div>
        </div>
        <add-goods v-model="goodsDialog" @add-goods="goods_submit" :out_warehouse_id="editData.out_warehouse_id"
                   :in_warehouse_id="editData.in_warehouse_id" :is_multi_warehouse="is_multi_warehouse"></add-goods>
        <goods-import v-model="importVisible"
                      :in_warehouse_id="editData.in_warehouse_id"
                      :out_warehouse_id="editData.out_warehouse_id"
                      @files-data="files_data"></goods-import>
        <import-stock-goods v-model="stockImportVisible"
                            @import-stock-goods="import_stock_goods"
                            :warehouse_id="editData.in_warehouse_id"
                            :transit_warehouse_id="editData.out_warehouse_id"></import-stock-goods>
    </page-dialog>
</template>
<style lang="stylus">
    .p-transfer-plan {
        .font-14 {
            font-size: 1.4rem;
        }
        .border-box {
            border-left: 1px solid #d3dce6;
            border-top: 1px solid #d3dce6;
            border-right: 1px solid #d3dce6;
        }
        .right-table {
            width: 100%;
            border: 1px solid #d3dce6;
            td {
                text-align: center;
                border-bottom: 1px solid #d3dce6;
                border-right: 1px solid #d3dce6;
                height: 33px;
            }
            td:nth-child(2n+1) {
                font-weight: 700;
                background-color: #f5f7fa;
            }
        }
        .error-icon {
            display: inline-block;
            vertical-align: middle;
            width: 16px;
            height: 16px;
            background: url('../../../assets/error-icon2.png') no-repeat center center;
            background-size: cover;
            &:hover {
                box-shadow: 0 0 10px rgba(105, 105, 105, 1);
                border-radius: 50%;
                transform: scale(1.1);
                -ms-transform: scale(1.1); /* IE 9 */
                -moz-transform: scale(1.1); /* Firefox */
                -webkit-transform: scale(1.1); /* Safari 和 Chrome */
                -o-transform: scale(1.1);
            }
        }
        .el_card_remark {
            .remark-sale-look {
                overflow-y: hidden;
                width: 190px;
                height: 140px;
                position: absolute;
                bottom: 50px;
                right: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background: #fff;
                padding: 0 5px;
                z-index: 999;
                .remark-sale-header {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 25px;
                    padding-left: 10px;
                    padding-top: 5px;
                    background-color: #fff;
                }
                .remark-sale-body {
                    overflow-y: auto;
                    position: absolute;
                    top: 30px;
                    left: 0;
                    right: 0;
                    bottom: 30px;
                    padding: 0 5px;
                }
                .remark-sale-footer {
                    position: absolute;
                    height: 25px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    padding-bottom: 5px;
                    padding-right: 5px;
                    background-color: #fff;
                }
            }
        }
        .blue {
            color: #1D8CE0;
            line-height: 26px;
        }
        .warningborder {
            input {
                border-color: #ff4949 !important;
            }
        }
    }
</style>
<script>
    import {
        api_warehouse_get,
        api_post_allocation,
        api_put_waybill,
        api_put_audit,
        api_put_allocation,
        api_in_warehouse_get,
        url_allocation_import_goods,
    } from "@/api/transfer-plan.js"
    import {url_stock_list_by_code} from "@/api/stocking";

    export default {
        permission: {
            url_allocation_import_goods,
            url_stock_list_by_code
        },
        data() {
            return {
                list: [1],
                goodsDialog: false,
                importVisible: false,
                stockImportVisible: false,
                visible: this.value,
                cancelText: '',
                insert: [],//新增的数据
                delete: [],//删除的后台返回的数据
                update: [],//修改的数据
                totalData: [],//后台返回总数量
                clickData: [],
                select_out_warehouse: [],
                select_in_warehouse: [],
                showRemark: false,
                reason: '',
                files: [],
                is_multi_warehouse: 1,
                checkAll: false,
            }
        },
        mounted() {
            this.init();
            this.init_in_warehouse();
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            },
            filterLockQty(stocking_info) {
                let lock_qty = 0;
                stocking_info.forEach(row => {
                    lock_qty += Number(row.qty);
                });
                return lock_qty || '--';
            },
            filterRowspan(row) {
                if (!row.stocking_info) {
                    return 1;
                } else {
                    return row.stocking_info.length > 1 ? row.stocking_info.length : 1;
                }
            },
            filterable(val) {
                if (val) return parseFloat(val).toFixed(2);
            }
        },
        methods: {
            close() {
                this.reason = '';
                this.files = [];
            },
            init() {
                let params = {
                    need_fba: true,
                };
                this.$http(api_warehouse_get, params).then(res => {
                    this.select_out_warehouse = res.map(row => {
                        this.$set(row, 'disabled', false);
                        return row;
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            init_in_warehouse() {
                this.$http(api_in_warehouse_get).then(res => {
                    this.select_in_warehouse = res.map(row => {
                        this.$set(row, 'disabled', false);
                        return row;
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            file_change() {//附件选择
                const files = this.$refs.file.files;
                this.files = [];
                Object.keys(files).forEach(key => {
                    let file = files[key];
                    this.files.push({file: file, result: '', errors: []});
                    /*if ((/\.(?!(pdf$))/.test(file.name))) {
                        this.$message({
                            type: "error",
                            message: "文件类型错误，请选择PDF文件上传！"
                        });
                    } else {
                        this.$set(this.files, 0, {file: file, result: '', errors: []});
                    }*/
                });
                //手动清掉input value
                this.$refs.file.value = '';
            },
            //添加产品
            addProduct() {
                this.goodsDialog = true;
            },
            //子组件添加商品传过来的
            goods_submit(val) {
                val.forEach(row => {
                    this.$set(row, "quantity", '');
                    this.$set(row, "id", '');
                    this.$set(row, 'stocking_info', []);
                    row.goods_name = row.spu_name;
                    let flag = this.editData.sku_list.findIndex(item => {
                        return item.sku_id === row.sku_id;
                    });
                    if (flag === -1) {
                        this.$set(row, 'isCheck', false);
                        this.editData.sku_list.push(row);
                    } else {
                        this.$message({type: "error", message: `SKU${row.sku}已存在`});
                    }
                });
            },
            //导入商品传过来的
            files_data(val) {
                let addList = [];
                val.forEach(row => {
                    row.goods_name = row.spu_name;
                    this.$set(row, 'stocking_info', []);
                    let flag = this.editData.sku_list.findIndex(item => {
                        return item.sku_id === row.sku_id;
                    });
                    if (flag === -1) {
                        this.$set(row, 'isCheck', false);
                        addList.push(row);
                    } else {
                        this.$message({type: "error", message: `SKU${row.sku}已存在,导入失败`});
                        return;
                    }
                });
                this.editData.sku_list = this.editData.sku_list.concat(addList);
            },
            //从备货计划导入商品,相同叠加
            // val:{...row, stocking_info: [{stocking_id: id, stocking_code: code qty: in_quantity}]}
            import_stock_goods(val) {
                let addList = [];
                val.forEach(row => {
                    row.goods_name = row.sku_name;
                    let flag = this.editData.sku_list.findIndex(item => {
                        return item.sku_id === row.sku_id;
                    });
                    if (flag === -1) {
                        this.$set(row, 'isCheck', false);
                        row.quantity = 0;
                        row.stocking_info.forEach(stock => {
                                row.quantity += Number(stock.qty);
                            }
                        );
                        addList.push(row);
                    } else {
                        flag.quantity = Number(flag.quantity);
                        row.stocking_info.forEach(stock => {
                                flag.quantity += Number(stock.qty);
                            }
                        );
                        this.$set(flag, 'quantity', flag.quantity);
                        this.$set(flag, 'stocking_info', row.stocking_info);
                    }
                });
                this.editData.sku_list = this.editData.sku_list.concat(addList);
            },
            //删除产品
            deleteProduct() {
                this.selectAdd.forEach(item => {
                    this.editData.sku_list.forEach((row, index) => {
                        if (item.sku_id === row.sku_id) {
                            this.editData.sku_list.splice(index, 1);
                        }
                    });
                    if (this.editData.sku_list.length === 0) {
                        this.checkAll = false;
                    }
                })
            },
            //点击一个单选框
            selected(selection, row) {
                this.selectAdd = selection;
            },
            selectedAll(selection) {
                this.selectAdd = selection;
            },
            //保存
            saveAdd() {
                if (!this.validate()) {
                    return;
                }
                let list = this.editData.sku_list.map(row => {
                    let sku_info = {
                        goods_id: row.goods_id,
                        sku_id: row.sku_id,
                        goods_name: row.goods_name,
                        thumb: row.thumb,
                        sku: row.sku,
                        quantity: row.quantity,
                    };
                    row.stocking_info && (sku_info.stocking_info = row.stocking_info);
                    return sku_info;
                });
                let data = {
                    out_warehouse_id: this.editData.out_warehouse_id,
                    in_warehouse_id: this.editData.in_warehouse_id,
                    shipping_type: this.editData.shipping_type,
                    remark: this.editData.remark,
                    sku_list: list
                };
                let attachment = [];
                if (this.files.length === 0) {
                    this.add(data);
                } else {
                    this.files.forEach(({file}, index) => {
                        let barcode = {
                            content: '',
                            name: file.name
                        };
                        let reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = (e) => {
                            barcode.content = e.target.result;
                            attachment.push(barcode);
                            if (attachment.length === this.files.length) {
                                data.attachment = attachment;
                                this.add(data);
                            }
                        };
                    });
                }
            },
            add(data) {
                this.$http(api_post_allocation, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.visible = false;
                    this.$emit('new-data');
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                });
            },
            //编辑保存
            saveEdit() {
                if (!this.validate()) {
                    return;
                }
                this.delete = clone(this.totalData.sku_list).map(row => {
                    return row.id;
                });
                this.insert = [];
                this.update = [];
                this.editData.sku_list.forEach(item => {
                    if (!!item.id) {
                        this.totalData.sku_list.forEach((row, index) => {
                            if (row.id === item.id) {
                                if (Number(row.quantity) !== Number(item.quantity)) {
                                    this.update.push({
                                        id: item.id,
                                        quantity: item.quantity
                                    });
                                }
                            }
                        });
                        this.delete.forEach((row, index) => {
                            if (row === item.id) {
                                this.delete.splice(index, 1);
                            }
                        });
                    } else {
                        this.insert.push({
                            goods_id: item.goods_id,
                            sku_id: item.sku_id,
                            sku: item.sku,
                            thumb: item.thumb,
                            quantity: item.quantity
                        });
                    }
                });
                let data = {
                    in_warehouse_id: this.editData.in_warehouse_id,
                    remark: this.editData.remark,
                    shipping_type: this.editData.shipping_type,
                    update: this.update,
                    insert: this.insert,
                    delete: this.delete
                };
                this.$http(api_put_allocation, this.action.id, data).then(res => {
                    this.$emit('edit', this.action);
                    this.$message({type: "success", message: res.message || res});
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            validate() {
                this.trim_edit();
                /*if(this.isAdd && this.files.length === 0) {
                    this.$message({type: 'error', message: '请选择上传的商品条形码'});
                    return false;
                }*/
                if (!!this.editData.sku_list.find(row => row.quantity === '' || Number(row.quantity) === 0)) {
                    this.$message({type: 'error', message: '请输入正确的数量'});
                    return false;
                }
                if (this.editData.shipping_type === 0) {
                    this.$message({type: 'error', message: '请选择物流发货方式'});
                    return false;
                }
                return true;
            },
            saveEditPackage() {
                this.trim_edit();
                let data = {
                    shipping_fee: this.editData.shipping_fee,
                    currency_code: this.editData.currency_code,
                    tracking_number: this.editData.tracking_number
                };
                this.$http(api_put_waybill, this.action.id, data).then(res => {
                    this.$emit('edit', this.action);
                    this.$message({type: "success", message: res.message || res});
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            saveCheck() {
                let data = {
                    status: 1,
                    reason: ''
                };
                this.$http(api_put_audit, this.action.id, data).then(res => {
                    this.$emit('operate-achieve', this.action);
                    this.$message({type: "success", message: res.message || res});
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            saveUncheck() {
                this.showRemark = true;
            },
            saveMark() {
                typeof this.reason === 'string' && (this.reason = this.reason.trim());
                let data = {
                    status: 2,
                    reason: this.reason
                };
                this.$http(api_put_audit, this.action.id, data).then(res => {
                    this.$emit('operate-achieve', this.action);
                    this.$message({type: "success", message: res.message || res});
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            //点击选择出货仓库
            selected_out_warehouse() {
                this.select_in_warehouse.forEach(row => {
                    if (row.value === this.editData.out_warehouse_id) {
                        row.disabled = true;
                    } else {
                        row.disabled = false;
                    }
                    return row;
                })
            },
            //点击选择入货仓库
            selected_in_warehouse() {
                this.select_out_warehouse.forEach(row => {
                    if (row.value === this.editData.in_warehouse_id) {
                        row.disabled = true;
                    } else {
                        row.disabled = false;
                    }
                    return row;
                })
            },
            cancel() {
                this.visible = false;
            },
            focus(index) {
                this.$refs.quantity[index].$refs.input.select();
            },
            key_updown(ev, index) {
                if (ev.keyCode === 34) {
                    if (!!this.$refs.quantity[index + 1]) {
                        this.$refs.quantity[index + 1].$refs.input.select();
                    }
                } else if (ev.keyCode === 33) {
                    if (!!this.$refs.quantity[index - 1]) {
                        this.$refs.quantity[index - 1].$refs.input.select();
                    }
                }
            },
            trim_edit() {
                Object.keys(this.editData).forEach(key => {
                    if (typeof this.editData[key] === 'string') {
                        this.editData[key] = this.editData[key].trim();
                    }
                })
            },
            goods_import() {
                this.importVisible = true;
            },
            stock_goods_import() {
                this.stockImportVisible = true;
            },
            check_all(val) {
                this.editData.sku_list.forEach(row => {
                    row.isCheck = val;
                })
            },
            check_box() {
                let isCheckAll = !this.editData.sku_list.find(row => !row.isCheck);
                this.checkAll = isCheckAll;
            },
            add_class(index) {
                this.clickData = this.clickData.map(() => {
                    return false;
                });
                this.clickData[index] = true;
            },
            maxQuantity(row) {
                let lock_qty = 0;
                row.stocking_info && row.stocking_info.forEach(row => {
                    lock_qty += Number(row.qty);
                });
                return Number(row.can_use_quantity) + lock_qty;
            },
            barcode_close(index) {// 商品条码删除
                this.files.splice(index, 1);
            }
        },
        computed: {
            total() {
                if (!isEmpty(this.editData)) {
                    return this.editData.sku_list.length;
                }
                return 0;
            },
            isAdd() {
                if (this.action.value === 'add') {
                    this.cancelText = '取 消';
                } else {
                    this.cancelText = '关 闭';
                }
                return this.action.value === 'add';
            },
            isEdit() {
                return this.action.value === 'edit';
            },
            isEditPackage() {
                return this.action.value === 'editPackage';
            },
            isLook() {
                return this.action.value === 'look';
            },
            isCheckPackage() {
                return this.action.value === 'checkPackage';
            },
            isDisabled() {
                if (this.editData) {
                    if (this.editData.sku_list.length === 0) {
                        return true;
                    }
                    if (!this.editData.out_warehouse_id) {
                        return true;
                    }
                    if (!this.editData.in_warehouse_id) {
                        return true;
                    }
                    return false;
                    return !!this.editData.sku_list.find(row => row.quantity === '' || Number(row.quantity) === 0);
                }
            },
            isThirdSku() {
                if (this.isAdd) {
                    return this.editData.in_warehouse_id && (this.select_in_warehouse.find(row => row.value === this.editData.in_warehouse_id).is_third === 1);
                } else {
                    return this.editData.is_third;
                }
            },
            uiHeads() {
                switch (true) {
                    case this.isAdd:
                    case this.isEdit:
                        return this.isThirdSku ? [
                            {isCheck: true, width: 4},// add edit
                            {label: '图片', width: 8},
                            {label: 'SKU/SKU别名', width: 9},
                            {label: '第三方SKU', width: 9},//isthird
                            {label: '产品名称', width: 28},
                            {label: '产品物流属性', width: 8},//add
                            {label: '可用库存', width: 8},//add
                            {label: '备货计划单号', width: 9},//add edit
                            {label: '库存锁定数量', width: 9},// add|edit
                            {label: '调拨数量', width: 8},
                        ] : [
                            {isCheck: true, width: 4},// add edit
                            {label: '图片', width: 10},
                            {label: 'SKU/SKU别名', width: 10},
                            {label: '产品名称', width: 30},
                            {label: '产品物流属性', width: 9},//add
                            {label: '可用库存', width: 9},//add
                            {label: '备货计划单号', width: 10},
                            {label: '库存锁定数量', width: 9},// add|edit
                            {label: '调拨数量', width: 9},
                        ]
                    case this.isCheckPackage:
                        return this.isThirdSku ? [
                            {label: '图片', width: 10},
                            {label: 'SKU/SKU别名', width: 10},
                            {label: '第三方SKU', width: 9},//isthird
                            {label: '产品名称', width: 28},
                            {label: '产品物流属性', width: 8},//add
                            {label: '可用库存', width: 8},//add
                            {label: '备货计划单号', width: 10},//add edit
                            {label: '库存锁定数量', width: 9},// add|edit
                            {label: '调拨数量', width: 8},
                        ] : [
                            {label: '图片', width: 10},
                            {label: 'SKU/SKU别名', width: 10},
                            {label: '产品名称', width: 34},
                            {label: '产品物流属性', width: 9},//add
                            {label: '可用库存', width: 9},//add
                            {label: '备货计划单号', width: 10},
                            {label: '库存锁定数量', width: 9},// add|edit
                            {label: '调拨数量', width: 9},
                        ]
                    case this.isLook:
                        return this.isThirdSku ? [
                            {label: '图片', width: 8},
                            {label: 'SKU/SKU别名', width: 9},
                            {label: '第三方SKU', width: 9},//isthird
                            {label: '产品名称', width: 26},
                            {label: '产品物流属性', width: 4},//add
                            {label: '调拨数量', width: 4},
                            {label: '出库数量', width: 4},//Lock
                            {label: '出库货位号', width: 8},//Lock
                            {label: '成本', width: 6},//Lock
                            {label: '已入库数量', width: 6},//Lock
                            {label: '备货计划单号', width: 8}//Lock
                        ] : [
                            {label: '图片', width: 10},
                            {label: 'SKU/SKU别名', width: 10},
                            {label: '产品名称', width: 30},
                            {label: '产品物流属性', width: 6},//add
                            {label: '调拨数量', width: 6},
                            {label: '出库数量', width: 6},//Lock
                            {label: '出库货位号', width: 8},//Lock
                            {label: '成本', width: 6},//Lock
                            {label: '已入库数量', width: 8},//Lock
                            {label: '备货计划单号', width: 10}//Lock
                        ]
                    case this.isEditPackage:
                        return this.isThirdSku ? [
                            {label: '图片', width: 10},
                            {label: 'SKU/SKU别名', width: 14},
                            {label: '第三方SKU', width: 14},//isthird
                            {label: '产品名称', width: 38},
                            {label: '产品物流属性', width: 10},//add
                            {label: '调拨数量', width: 13},
                        ] : [
                            {label: '图片', width: 10},
                            {label: 'SKU/SKU别名', width: 15},
                            {label: '产品名称', width: 50},
                            {label: '产品物流属性', width: 10},//add
                            {label: '调拨数量', width: 15},
                        ]
                }
            },
            selectAdd() {
                return this.editData.sku_list.filter(row => !!row.isCheck);
            }
        },
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
                if (val) {
                    this.totalData = clone(this.editData);
                    this.showRemark = false;
                    this.reason = '';
                    // this.init();
                }
            },
        },
        props: {
            value: {},
            action: {},
            editData: {},
            currencyList: {}
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            addGoods: require('./add-goods.vue').default,
            goodsImport: require('./goods-import.vue').default,
            importStockGoods: require('./import-stock-goods.vue').default,
            pageDialog: require("@/components/page-dialog.vue").default,
            uiTip: require('@/components/ui-tip.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            uiLimitNumber: require('@/components/ui-limit-number.vue').default,
            uiTable: require('@/components/ui-table.vue').default,
            plusMinus: require('@/components/plus-minus.vue').default,
            blowupImage: require("@/components/blowup-image.vue").default,
        },
    }
</script>
