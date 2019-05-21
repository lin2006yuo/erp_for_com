<template>
    <page-dialog v-model="visible"
                 class="c-add-allocation-plan"
                 @open="open"
                 :close-on-click-modal="false"
                 size="large" @close="close" :title="action.title">
        <table class="right-table mb-sm" cellpadding="0" cellspacing="0" v-if="!isAdd">
            <tr>
                <td width="150">出库仓库</td>
                <td width="150">{{editData.out_warehouse}}</td>
                <td width="150">入库仓库</td>
                <td width="150">
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
            <label-item label="账号：" class="ml-sm">
                <el-radio-group v-model="editData.tax" :disabled="isAudit">
                    <el-radio :label="1" class="ml-sm">正规</el-radio>
                    <el-radio :label="0" class="ml-sm">不正规</el-radio>
                </el-radio-group>
            </label-item>
        </div>
        <div class="mb-xs mt-xs fl-clear" v-if="!isAudit">
            <div class="fl">
                <el-button
                        type="primary"
                        :disabled="editData.out_warehouse_id === '' || editData.in_warehouse_id === ''"
                        @click="add_goods"
                        size="mini">添加商品
                </el-button>
                <permission tag="ElButton" type="primary"
                            :route="apis.url_allocation_import_goods"
                            @click.native="goods_import"
                            :disabled="editData.out_warehouse_id === '' || editData.in_warehouse_id === ''"
                            size="mini">导入商品
                </permission>
                <permission tag="ElButton" type="primary"
                            :route="apis.url_stock_list_by_code"
                            @click.native="stock_goods_import"
                            :disabled="editData.out_warehouse_id === '' || editData.in_warehouse_id === ''"
                            size="mini">从备货计划引入商品
                </permission>
                <el-button
                        type="primary"
                        @click="delete_goods"
                        size="mini">删除
                </el-button>
            </div>
            <div class="fr blue">
                小提示：填写调拨数量时按下PageUp或PageDown可以上下切换哟~
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
                    <td :rowspan="row | filterRowspan">
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
                    <!-- FNSKU -->
                    <td v-if="isFBA" :rowspan="row | filterRowspan">
                        <div>
                            <span v-if="row.fn_sku">{{row.fn_sku}}</span>
                            <div v-else>
                                <el-input class="inline width-mini" v-model="row.old_fn_sku"></el-input>
                                <el-button class="inline" type="primary" size="mini" @click.native="check_fn_sku(row)">
                                    校验
                                </el-button>
                            </div>
                        </div>
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
                    <td :rowspan="row | filterRowspan">
                        <div>{{row.available_quantity}}</div>
                        <!--<ui-tip :content="row.available_quantity" :width="98"></ui-tip>-->
                    </td>
                    <!--备货计划单号-->
                    <td>
                        {{row.stocking_info[0] ? row.stocking_info[0].code : '--'}}
                    </td>
                    <!--库存锁定数量-->
                    <td>
                        <div>
                            {{row.stocking_info[0] ? row.stocking_info[0].usable_allocated_qty : 0}}
                        </div>
                    </td>
                    <!--调拨数量-->
                    <td :rowspan="row | filterRowspan">
                        <div>
                            <span v-if="isAudit">{{row.quantity}}</span>
                            <integer-input v-model="row.quantity"
                                           v-else
                                           :min="0"
                                           :max="max_quantity(row)"
                                           ref="quantity"
                                           :class="{warningborder:row.quantity > row.can_use_quantity}"
                                           @key-updown="key_updown($event, index)"
                                           @focus="focus(index)">
                            </integer-input>
                        </div>
                    </td>
                </tr>
                <tr v-for="(item,itemIndex) in row.stocking_info"
                    :key="item.stocking_id" v-if="itemIndex!==0">
                    <!--备货计划单号-->
                    <td>
                        {{item.code}}
                    </td>
                    <!--库存锁定数量-->
                    <td>
                        <div>
                            {{item.usable_allocated_qty}}
                        </div>
                    </td>
                </tr>
            </template>
            </tbody>
        </ui-table>
        <div class="t-right mt-xs mr-sm">
            <span class="font-14">sku总数：{{total}}</span>
        </div>
        <div class="mt-xs">
            <label-item label="发货物流方式：">
                <el-radio-group v-model="editData.shipping_type" :disabled="isAudit">
                    <el-radio :label="1" class="ml-sm">空运</el-radio>
                    <el-radio :label="2" class="ml-sm">海运</el-radio>
                    <el-radio :label="4" class="ml-sm">快递</el-radio>
                    <el-radio :label="5" class="ml-sm">专线</el-radio>
                    <el-radio :label="3" class="ml-sm">其他</el-radio>
                </el-radio-group>
            </label-item>
        </div>
        <el-row v-if="isAdd" class="mt-xs">
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
        <div class="fl-clear">
            <span class="mb-sm inline">备注：</span>
            <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="editData.remark">
            </el-input>
        </div>
        <div slot="footer">
            <request-button req-key="api_post_allocation"
                            v-if="isAdd"
                            type="primary" size="mini"
                            :disabled="isDisabled" @click.native="save_add">确定
            </request-button>

            <request-button req-key="api_put_allocation"
                            v-if="action.value === 'edit'"
                            type="primary" size="mini"
                            :disabled="isDisabled" @click.native="save_edit">确定
            </request-button>
            <template v-if="isAudit">
                <request-button req-key="api_put_audit"
                                type="primary" size="mini"
                                :disabled="isDisabled" @click.native="save_audit">审核通过
                </request-button>
                <permission tag="ElButton" :route="apis.url_put_audit"
                            type="primary" size="mini" :disabled="isDisabled"
                            @click.native="save_un_audit">审核不通过
                </permission>
            </template>
            <el-button size="mini" @click.native="visible = false">{{cancelText}}</el-button>
        </div>
        <!-- 审核不通过的原因 -->
        <div v-if="showRemark" class="el_card_remark">
            <div class="remark-sale-look">
                <label class="remark-sale-header">审核不通过的原因: </label>
                <el-form class="remark-sale-body">
                    <el-form-item>
                        <el-input type="textarea" v-model="reason" :maxlength="225"
                                  :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                    </el-form-item>
                </el-form>
                <div class="remark-sale-footer fl-clear">
                    <div class="fr">
                        <request-button req-key="api_put_un_audit" class="small-button submit" type="button"
                                        @click="save_mark">提交
                        </request-button>
                        <button class="small-button cancel" type="button" @click="showRemark=false">取消</button>
                    </div>
                </div>
            </div>
        </div>
        <add-goods v-model="goodsVisible" @add-goods="goods_submit" :out_warehouse_id="editData.out_warehouse_id"
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
    .c-add-allocation-plan {
        .font-14 {
            font-size: 1.4rem;
        }
        .blue {
            color: #1D8CE0;
            line-height: 26px;
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
        .warningborder {
            input {
                border-color: #ff4949 !important;
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
    }
</style>
<script>
    import {
        api_warehouse_get,
        api_post_allocation,
        api_put_waybill,
        api_put_audit,
        url_put_audit,
        api_put_allocation,
        api_in_warehouse_get,
        api_verify_fn_sku,
        url_allocation_import_goods,
    } from "@/api/transfer-plan.js"
    import {api_warehous_local} from "@/api/entrepot-picking";
    import {url_stock_list_by_code} from "@/api/stocking";

    export default {
        permission: {
            url_allocation_import_goods,
            url_stock_list_by_code,
            url_put_audit,
        },
        data() {
            return {
                visible: this.value,
                select_out_warehouse: [],
                select_in_warehouse: [],
                files: [],
                // 修改数据缓存
                update: [],
                insert: [],
                delete: [],
                totalData: [],//editData缓存
                clickData: [],//当前行样式
                checkAll: false,
                is_multi_warehouse: 1,
                goodsVisible: false,
                importVisible: false,
                stockImportVisible: false,
                showRemark: false,
                reason: '', //审核不通过原因
            }
        },
        mounted() {
            this.init_in_warehouse();
            this.init_out_warehouse();
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
            filterRowspan(row) {
                if (!row.stocking_info) {
                    return 1;
                } else {
                    return row.stocking_info.length > 1 ? row.stocking_info.length : 1;
                }
            },
            filterable(val) {
                if (val) return parseFloat(val).toFixed(3);
            }
        },
        methods: {
            open() {
                this.totalData = clone(this.editData);
            },
            close() {
                this.files = [];
                this.update = [];
                this.insert = [];
                this.delete = [];
                this.showRemark = false;
                this.reason = '';
            },
            init_out_warehouse() {
                this.$http(api_warehouse_get, {need_fba: false}).then(res => {
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
            //点击选择出货仓库
            selected_out_warehouse() {
                this.select_in_warehouse.forEach(row => {
                    if (row.value === this.editData.out_warehouse_id) {
                        row.disabled = true;
                    } else {
                        row.disabled = false;
                    }
                });
            },
            //点击选择入货仓库
            selected_in_warehouse() {
                this.select_out_warehouse.forEach(row => {
                    if (row.value === this.editData.in_warehouse_id) {
                        row.disabled = true;
                    } else {
                        row.disabled = false;
                    }
                });
            },
            file_change() {//附件选择
                const files = this.$refs.file.files;
                this.files = [];
                Object.keys(files).forEach(key => {
                    let file = files[key];
                    this.files.push({file: file, result: '', errors: []});
                });
                //手动清掉input value
                this.$refs.file.value = '';
            },
            //TODO: 商品添加重复如何处理
            //添加产品
            //子组件添加商品传过来的
            add_goods() {
                this.goodsVisible = true;
            },
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
                        if (this.isFBA) {
                            this.$set(row, 'old_fn_sku', row.fn_sku);
                        }
                        this.$set(row, 'isCheck', false);
                        this.editData.sku_list.push(row);
                    } else {
                        this.$message({type: "error", message: `SKU${row.sku}已存在`});
                    }
                });
            },
            //导入商品传过来的
            goods_import() {
                this.importVisible = true;
            },
            files_data(val) {
                let addList = [];
                val.forEach(row => {
                    row.goods_name = row.spu_name;
                    this.$set(row, 'stocking_info', []);
                    let flag = this.editData.sku_list.findIndex(item => {
                        return item.sku_id === row.sku_id;
                    });
                    if (flag === -1) {
                        if (this.isFBA) {
                            this.$set(row, 'old_fn_sku', row.fn_sku);
                        }
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
            stock_goods_import() {
                this.stockImportVisible = true;
            },
            import_stock_goods(val) {
                let addList = [];
                val.forEach(row => {
                    row.goods_name = row.sku_name;
                    let flag = this.editData.sku_list.find(item => {
                        return item.sku_id === row.sku_id;
                    });
                    if (!flag) {
                        if (this.isFBA) {
                            this.$set(row, 'old_fn_sku', row.fn_sku);
                        }
                        this.$set(row, 'isCheck', false);
                        row.quantity = 0;
                        row.stocking_info.forEach(stock => {
                                row.quantity = Number(row.quantity);
                                row.quantity += Number(stock.usable_allocated_qty);
                                row.available_quantity = Number(row.available_quantity);
                                row.available_quantity += Number(stock.usable_allocated_qty);
                            }
                        );
                        addList.push(row);
                    } else {
                        flag.quantity = Number(flag.quantity);
                        row.stocking_info.forEach(stock => {
                                flag.quantity = Number(flag.quantity);
                                flag.available_quantity = Number(flag.available_quantity);
                                flag.quantity += stock.usable_allocated_qty;
                                flag.available_quantity += stock.usable_allocated_qty;
                                // 存在备货计划单则合并备货信息
                                if (flag.stocking_info) {
                                    let index = flag.stocking_info.find(oldStock => oldStock.stocking_code === stock.stocking_code);
                                    if (index) {
                                        index.usable_allocated_qty += stock.usable_allocated_qty;
                                    } else {
                                        flag.stocking_info.push(stock);
                                    }
                                } else {
                                    flag.stocking_info = [stock];
                                }
                            }
                        );
                        this.$set(flag, 'quantity', flag.quantity);
                        this.$set(flag, 'stocking_info', flag.stocking_info);
                        this.$set(flag, 'available_quantity', flag.available_quantity);
                    }
                });
                this.editData.sku_list = this.editData.sku_list.concat(addList);
            },
            //删除产品
            delete_goods() {
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
            // 添加调拨单
            save_add() {
                if (!this.validate()) {
                    return this.$reqKey('api_post_allocation', false);
                }
                let list = this.editData.sku_list.map(row => {
                    let sku_info = {
                        goods_id: row.goods_id,
                        sku_id: row.sku_id,
                        goods_name: row.goods_name,
                        thumb: row.thumb,
                        sku: row.sku,
                        in_sku: row.fn_sku ? row.fn_sku : row.third_sku,
                        quantity: row.quantity,
                        channel_id: row.channel_id,
                    };
                    row.stocking_info && (sku_info.stocking_info = row.stocking_info);
                    return sku_info;
                });
                let data = {
                    tax: this.editData.tax,
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
            add(data) {//新建调拨单
                this.$http(api_post_allocation, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_post_allocation', false);
                    }, 200);
                });
            },
            // 修改调拨单
            save_edit() {
                if (!this.validate()) {
                    this.$reqKey('api_put_allocation', false);
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
                    this.$message({type: "success", message: res.message || res});
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_put_allocation', false);
                    }, 200);
                });
            },
            // 审核通过
            save_audit() {
                let data = {
                    status: 1,
                    reason: '',
                    remark: this.editData.remark,
                };
                this.$http(api_put_audit, this.action.id, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_put_audit', false);
                    }, 200);
                });
            },
            //审核不通过
            save_un_audit() {
                this.showRemark = true;
            },
            save_mark() {
                typeof this.reason === 'string' && (this.reason = this.reason.trim());
                if (this.reason === '') {
                    this.$message({type: 'error', message: '请填写审核不通过原因'});
                    return this.$reqKey('api_put_un_audit', false);
                }
                let data = {
                    status: 2,
                    reason: this.reason
                };
                this.$http(api_put_audit, this.action.id, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_put_un_audit', false);
                    }, 200);
                });
            },
            validate() {
                this.trim_edit();
                if (this.editData.tax === '') {
                    this.$message({type: 'error', message: '请选择账号是否正规'});
                    return false;
                }
                if (!!this.editData.sku_list.find(row => row.quantity === '' || Number(row.quantity) === 0)) {
                    this.$message({type: 'error', message: '请输入正确的数量'});
                    return false;
                }
                if (this.isFBA && this.editData.sku_list.some(row => row.fn_sku.trim() === '')) {
                    this.$message({type: 'error', message: '请校验FNSKU'});
                    return false;
                }
                if (this.editData.shipping_type === 0) {
                    this.$message({type: 'error', message: '请选择物流发货方式'});
                    return false;
                }
                return true;
            },
            trim_edit() {
                Object.keys(this.editData).forEach(key => {
                    if (typeof this.editData[key] === 'string') {
                        this.editData[key] = this.editData[key].trim();
                    }
                })
            },
            //表格选中
            //点击一个单选框
            check_all(val) {
                this.editData.sku_list.forEach(row => {
                    row.isCheck = val;
                });
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
            focus(index) {//点击选中
                this.$refs.quantity[index].$refs.input.select();
            },
            //调拨数量快捷键
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
            //调拨数量
            max_quantity(row) {
                let lock_qty = 0;
                row.stocking_info && row.stocking_info.forEach(row => {
                    lock_qty += Number(row.qty);
                });
                return Number(row.available_quantity);
            },
            barcode_close(index) {// 商品条码删除
                this.files.splice(index, 1);
            },
            /**
             * 校验FNSKU
             * @param {Object} row
             */
            check_fn_sku(row) {
                row.old_fn_sku = row.old_fn_sku.trim();
                if (row.old_fn_sku === '') {
                    this.$message({type: 'error', message: `请输入该sku对应的FNSKU`});
                    return;
                }
                let data = {
                    in_warehouse_id: this.editData.in_warehouse_id,
                    sku_id: row.sku_id,
                    fn_sku: row.old_fn_sku,
                }
                this.$http(api_verify_fn_sku, data).then(res => {
                    this.$set(row, 'fn_sku', data.fn_sku);
                    this.$message({type: 'success', message: res.message || res});
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
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
            isAudit() {
                return this.action.value === 'audit';
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
            isFBA() {
                if (this.isAdd) {
                    return this.editData.in_warehouse_id && (this.select_in_warehouse.find(row => row.value === this.editData.in_warehouse_id).is_fba === true);
                } else {
                    return this.editData.is_fba;
                }
            },
            uiHeads() {
                switch (true) {
                    case this.isThirdSku:
                        return [
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
                        ];
                    case this.isFBA:
                        return [
                            {isCheck: true, width: 4},// add edit
                            {label: '图片', width: 8},
                            {label: 'SKU/SKU别名', width: 9},
                            {label: 'FNSKU', width: 9},//isthird
                            {label: '产品名称', width: 28},
                            {label: '产品物流属性', width: 8},//add
                            {label: '可用库存', width: 8},//add
                            {label: '备货计划单号', width: 9},//add edit
                            {label: '库存锁定数量', width: 9},// add|edit
                            {label: '调拨数量', width: 8},
                        ];
                    default:
                        return [
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
                }
            },
            selectAdd() {
                return this.editData.sku_list.filter(row => !!row.isCheck);
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            editData: {},
            action: {},
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
        }
    }
</script>