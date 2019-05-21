<!--suppress ALL -->
<template>
    <page class="p-allocation-delivery">
        <el-row class="box-yellow">
            <label-item label="拣货单：" class="ml-sm inline"><span
                    class="font-span text-ellipsis">{{packingInfo.number}}</span>
            </label-item>
            <label-item label="调入仓库：" class="inline"><span class="font-span text-ellipsis">{{packingInfo.warehouse_name}}</span>
            </label-item>
            <label-item label="目的地国家：" class="inline"><span
                    class="font-span text-ellipsis">{{packingInfo.country_code}}</span>
            </label-item>
            <label-item label="待装箱数量：" class="inline"><span
                    class="font-span text-ellipsis">{{packingInfo.quantity}}</span>
            </label-item>
            <label-item label="操作员：" class="inline">
                <span class="font-span text-ellipsis">{{packingInfo.operator}}</span>
            </label-item>
            <div class="ml-sm t-center inline">
                <!--<el-button @click="release_box" v-if="turnover_box_id.length>0" class="inline">释放周转箱</el-button>-->
                <permission tag="requestButton" size="mini" class="inline" @click="finish_packing"
                            req-key="api_allocation_packing_finish"
                            :route="apis.url_allocation_packing_finish">包装完成
                </permission>
            </div>
            <div class="ml-sm t-center inline">
                <el-button @click="exit" size="mini" class="inline">退出</el-button>
            </div>
        </el-row>
        <el-row class="mt-sm">
            <el-col :span="14">
                <el-form :model="searchData" label-width="100px">
                    <el-form-item label="SKU标签：">
                        <span slot="label" class="bold-font font-18 t-right">SKU标签：</span>
                        <el-input ref="sku"
                                  class="inline s-width-default"
                                  :disabled="packingData.length === 0"
                                  @keyup.enter.native="submit" v-model="searchData.sku"></el-input>
                        <div class="inline red ml-lg" v-if="error.type === 1">
                            <i class="el-icon-circle-close font-18 inline"
                               style="margin: 0 5px 6px;"></i>
                            <span class="font-16">{{error.message}}</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="数量：">
                        <span slot="label" class="bold-font font-18 t-right">数量：</span>
                        <ui-limit-number v-model="searchData.quantity"
                                         class="inline"
                                         :disabled="packingData.length === 0"
                                         :min="0" @keyup.enter.native="submit"></ui-limit-number>
                        <div class="inline red ml-lg" v-if="error.type === 2">
                            <i class="el-icon-circle-close font-18 inline"
                               style="margin: 0 5px 6px;"></i>
                            <span class="font-16">{{error.message}}</span>
                        </div>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="10">
                <label-item label="箱子尺寸：" class="ml-sm">
                    <el-select v-model="box_size">
                        <el-option v-for="(item,index) in boxSizeList"
                                   :label="item.label" :value="item.value"
                                   :key="index"></el-option>
                    </el-select>
                </label-item>
                <label-item label="" class="ml-sm">
                    <el-button type="primary" size="mini" @click.native="get_details">查看拣货单详情</el-button>
                </label-item>
            </el-col>
        </el-row>
        <div class="mt-xs">
            <el-tag v-for="(item,index) in packingData"
                    class="tag ml-xs mb-xs"
                    :class="{'tagBlue': currentIndex === index}"
                    @click.native.stop="change_box(item, index)"
                    :key="index">
                箱子{{index + 1}}
            </el-tag>
            <el-button type="primary"
                       class="inline ml-xs"
                       size="mini"
                       @click.native.stop.prevent="add_box" icon="plus"></el-button>
        </div>
        <el-row class="mt-xs">
            <el-col :span="18">
                <template v-if="packingData.length !== 0">
                    <el-row class="box-title t-left">
                        <span class="ml-sm">正在进行包装作业</span>
                        <permission tag="ElButton" :route="apis.url_allocation_copy_box" class="inline fr mr-sm"
                                    type="warning" size="mini" @click.native="copy_box">复制箱子</permission>
                    </el-row>
                    <el-table :data="currentBox.detail" border
                              class="scroll-bar"
                              max-height="600"
                              :summary-method="summary_num"
                              show-summary
                              highlight-current-row>
                        <el-table-column label="序号" prop="number"></el-table-column>
                        <el-table-column label="图片" inline-template>
                            <div>
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
                            </div>
                        </el-table-column>
                        <el-table-column label="SKU" inline-template>
                            <div>{{row.sku}}</div>
                        </el-table-column>
                        <el-table-column label="FNSKU" inline-template>
                            <div>{{row.fn_sku}}</div>
                        </el-table-column>
                        <el-table-column label="商品物流属性" inline-template>
                            <div>{{row.transport_property_name}}</div>
                        </el-table-column>
                        <el-table-column label="商品单重(KG)" inline-template>
                            <div>{{row.weight}}</div>
                        </el-table-column>
                        <el-table-column label="商品总重（KG）" prop="gross_weight" inline-template>
                            <div>{{row.gross_weight}}</div>
                        </el-table-column>
                        <el-table-column label="数量" prop="quantity" inline-template>
                            <div>
                                <ui-limit-number v-model.number="row.quantity" :min="1"
                                                 @blur="sku_change(row)"></ui-limit-number>
                            </div>
                        </el-table-column>
                        <el-table-column label="品名" inline-template>
                            <div>{{row.name}}</div>
                        </el-table-column>
                        <el-table-column label="操作" inline-template>
                            <div>
                                <permission tag="ElButton"
                                            type="primary"
                                            @click="delete_sku(row)"
                                            :route="apis.url_allocation_sku_delete"
                                            size="mini">删除
                                </permission>
                            </div>
                        </el-table-column>
                    </el-table>
                    <el-row class="mt-sm fl-clear">
                        <label-item label="箱子总重：" class="ml-sm">
                            <integer-input v-model.number="currentBox.box_weight"
                                           @blur="change_weight"
                                           :min="0"></integer-input>
                            <span>&nbsp;KG</span>
                        </label-item>

                        <label-item label="箱子体积：" class="ml-sm fr mr-sm">
                            <span>长&nbsp;</span>
                            <integer-input v-model.number="currentBox.length"
                                           ref="length"
                                           @focus="focus('length')"
                                           @blur="change_box_size" :min="0"></integer-input>
                            <span>&nbsp;cm</span>
                            <span class="ml-sm">宽&nbsp;</span>
                            <integer-input v-model.number="currentBox.width"
                                           ref="width"
                                           @focus="focus('width')"
                                           @blur="change_box_size" :min="0"></integer-input>
                            <span>&nbsp;cm</span>
                            <span class="ml-sm">高&nbsp;</span>
                            <integer-input v-model.number="currentBox.height"
                                           ref="height"
                                           @focus="focus('height')"
                                           @blur="change_box_size" :min="0"></integer-input>
                            <span>&nbsp;cm</span>
                        </label-item>
                    </el-row>
                </template>
                <div v-else style="height: 1px"></div>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>当前操作日志</span>
                    </div>
                    <div style="overflow-y: auto;" v-resize="{height:25}">
                        <div v-for="(row,index) in logData" :key="index">
                            <span class="ml-sm">{{row}}</span>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <pickings-detail v-model="showDialog"
                         :tableData="detailsData"
                         :total="detailsTotal"
                         :searchData="detailsSearch"
                         :loading="loading"
                         @handle-size-change="handle_details_size_change"
                         @handle-current-change="handle_details_current_change"></pickings-detail>
    </page>
</template>

<style lang="stylus">
    .p-allocation-delivery {
        .el-tag {
            background: #cccccc;
            .icon-combination {
                padding: 2px;
                color: #e23f2c;
            }
        }
        .tag {
            height: 30px;
            line-height: 30px;
            cursor: pointer;
        }
        .tag:hover {
            background: #6295e9;
        }
        .tagBlue {
            background: #6295e9;
        }
        .c-label-item {
            height: 30px;
            line-height: 30px;
        }
        .box-yellow {
            height: 60px;
            background-color: #FF9F40;
            color: #fff;
            line-height: 60px;
            font-size: 20px;
            label {
                font-size: 20px;
            }
            .font-span {
                font-size: 20px;
            }
            .text-ellipsis {
                overflow: hidden;
                text-overflow: ellipsis;
                -o-text-overflow: ellipsis;
                white-space: nowrap;
            }
            .c-label-item:nth-child(1) {
                width: 10%;
            }
            .c-label-item:nth-child(2) {
                width: 20%;
            }
            .c-label-item:nth-child(3) {
                width: 30%;
            }
            .c-label-item:nth-child(4) {
                width: 10%;
            }
            .c-label-item:nth-child(5) {
                width: 10%;
            }
            .c-label-item:nth-child(6) {
                width: 10%;
            }
        }
        .box-title {
            border: 1px solid #D3DCE6;
            text-align: center;
            margin: 0;
            background-color: #6495ed;
            font-size: 1.2rem;
            line-height: 32px;
            height: 32px;
            color: #ffffff;
            span {
                font-size: 1.4rem;
            }
        }
        .box {
            border: 1px solid #D3DCE6;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
            .box-title {
                border: 1px solid #D3DCE6;
                text-align: center;
                margin: 0;
                background-color: #6495ed;
                font-size: 1.2rem;
                line-height: 32px;
                height: 32px;
                color: #ffffff;
            }
            .el-table__body-wrapper {
                overflow-x: hidden;
            }
            button {
                span {
                    font-size: 1.2rem;
                }
            }
        }
        .sku-table {
            width: 100%;
            text-align left;
            border-color: #6495ed;
            th {
                padding: 0 5px;
                height: 26px;
                text-align: left;
                box-sizing: border-box;
                background-color: #eff2f7;
                border: 1px solid #e0e6ed;
            }
            tr {
                height: 40px;
                font-size: 16px;
            }
            td {
                padding: 0 5px;
                height: 26px;
                line-height: 26px;
                text-align: left;
                padding-right: 10px;
                padding-left: 10px;
                box-sizing: border-box;
                border-right: 1px solid #e0e6ed;
                border-bottom: 1px solid #e0e6ed;
                span {
                    font-size: 16px;
                }
                button {
                    span {
                        font-size: 1.2rem;
                    }
                }
            }
        }
    }

    .box-card {
        .el-card__header {
            background-color: #6495ed;
            color: #fff;
        }
    }

    @media all and (max-width: 1366px) {
        .p-single-sku {
            .box-yellow {
                .c-label-item:nth-child(1) {
                    width: 20%;
                    .font-span {
                        width: calc(100% - 85px);
                    }
                }
                .c-label-item:nth-child(2) {
                    width: 14%;
                }
                .c-label-item:nth-child(3) {
                    width: 14%;
                    .font-span {
                        width: calc(100% - 105px);
                    }
                }
                .c-label-item:nth-child(4) {
                    width: 13%;
                }
                .c-label-item:nth-child(5) {
                    width: 12%;
                }
                .c-label-item:nth-child(6) {
                    width: 11%;
                    .font-span {
                        width: calc(100% - 85px);
                    }
                }
            }
        }

    }
</style>

<script>
    import {
        api_allocation_packing_detail,
        api_allocation_packing_finish,
        url_allocation_packing_finish,
        api_allocation_packing_add,
        api_allocation_packing_insert,
        api_allocation_sku_delete,
        url_allocation_sku_delete,
        api_allocation_box_change,
        api_allocation_packing_change_quantity,
    } from "@/api/allocation-packing";

    import {api_allocation_box_list, api_allocation_copy_box, url_allocation_copy_box} from "@/api/allocation-box";
    import {api_allocation_picking_detail} from "@/api/allocation-picking";

    export default {
        permission: {
            url_allocation_sku_delete,
            url_allocation_packing_finish,
            url_allocation_copy_box
        },
        data() {
            return {
                packingInfo: {},
                searchData: {
                    sku: '',
                    quantity: '',
                },
                boxSizeList: [],
                logData: [],
                packingData: [],
                transportInfo: [],
                currentIndex: 0,
                error: {
                    type: 0,
                    message: '',
                },
                box_size: {
                    length: 0,
                    width: 0,
                    height: 0,
                },
                detailsSearch:{
                    cargo: '',
                    sku: '',
                    quantity_diff: '',
                    page: 1,
                    pageSize: 20
                },
                detailsData: [],
                detailsTotal: 0,
                showDialog: false,
                loading: false
            }
        },
        mounted() {
            if (this.$route.query && !isEmpty(this.$route.query)) {
                this.$http(api_allocation_packing_detail, this.$route.query).then(res => {
                    let log = `扫描拣货单${this.$route.query.number},进入包装作业`;
                    this.logData.push(log);
                    let {box_info, transport_info, ...packingInfo} = res;
                    this.packingInfo = packingInfo;
                    this.transportInfo = transport_info;
                    this.packingData = box_info.map(row => {
                        row.detail.forEach((sku, index) => {
                            this.$set(sku, 'number', index + 1);
                            this.$set(sku, 'waiting_quantity', sku.quantity);
                            this.$set(sku, 'gross_weight', this.to_fix(Number(sku.weight) * Number(sku.quantity)));
                            this.$set(sku, 'transport_property', sku.transport_property === 1 ? 1 : 0);
                            this.$set(sku, 'transport_property_name', sku.transport_property_name);
                        });
                        row.detail.reverse();
                        return row;
                    });
                    this.select_input();
                    this.init_box_list();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            }
        },
        filters: {
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            },
            propertyFilter(val) {
                return val === 1 ? '普货' : '非普货';
            }
        },
        methods: {
            get_details(){
                this.showDialog = true;
                this.loading = true;
                this.$http(api_allocation_picking_detail, this.packingInfo.picking_id, this.detailsSearch).then(res => {
                    this.detailsData = res.data;
                    this.detailsTotal = res.count;
                    this.loading = false
                }).catch(err => {
                    this.$message({type: 'error', message: err.message || err})
                })
            },
            handle_details_size_change(val) {
                this.detailsSearch.pageSize = val;
                this.get_details();
            },
            handle_details_current_change(val) {
                this.detailsSearch.page = val;
                this.get_details();
            },
            copy_box(){
                this.$prompt('复制箱子数量：', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern:  /^[1-9]\d*$/,
                    inputErrorMessage: '数量格式填写不正确'
                }).then(({ value }) => {
                    let boxDetail = this.currentBox.detail.map(row => {
                        return {
                            sku: row.sku,
                            quantity: row.quantity,
                            picking_id: this.packingInfo.picking_id,
                            allocation_id: this.packingInfo.allocation_id
                        }
                    })
                    let data = {
                        box_num: value,
                        box_weight: this.currentBox.box_weight,
                        box_detail: boxDetail,
                        picking_id: this.packingInfo.picking_id,
                        allocation_id: this.packingInfo.allocation_id,
                        length: this.currentBox.length,
                        width: this.currentBox.width,
                        height: this.currentBox.height
                    }
                    this.$http(api_allocation_copy_box, data).then(res => {
                        res.data.map(row => {
                            row.detail.forEach((sku, index) => {
                                this.$set(sku, 'number', index + 1);
                                this.$set(sku, 'waiting_quantity', sku.quantity);
                                this.$set(sku, 'gross_weight', this.to_fix(Number(sku.weight) * Number(sku.quantity)));
                                this.$set(sku, 'transport_property', sku.transport_property === 1 ? 1 : 0);
                                this.$set(sku, 'transport_property_name', sku.transport_property_name);
                            });
                            row.detail.reverse();
                            this.packingData.push(row)
                        });
                        this.packingInfo.quantity = res.waiting_quantity;
                        this.$message({type: 'success', message: res.message})
                    }).catch(err => {
                        this.$message({type: 'error', message: err.message || err})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            init_box_list() {
                this.$http(api_allocation_box_list, {warehouse_id: this.packingInfo.warehouse_id}).then(res => {
                    this.boxSizeList = res.data.filter(row => row.status === 1).map(row => {
                        return {
                            label: `${row.length}*${row.width}*${row.height}`,
                            value: row,
                        }
                    });
                    this.boxSizeList.length === 0 ?
                        this.$message({type: 'warning', message: `请先在仓库管理-->箱子管理页面添加相应仓库的箱子再包装`}) :
                        (this.box_size = this.boxSizeList[0].value);
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            select_input() {
                this.searchData = {
                    sku: '',
                    quantity: '',
                };
                this.$refs.sku.inputSelect();
            },
            /* 合计列 */
            summary_num({columns, data}) {
                let sums = []
                columns.forEach((row, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    if (index === 6 || index === 7) {
                        let values = data.map(item => Number(item[row.property]));
                        sums[index] = this.to_fix(values.reduce((prev, curr) => {
                            let value = Number(curr);
                            return prev + curr;
                        }, 0));
                    } else {
                        sums[index] = '';
                    }
                })
                return sums;
            },
            change_box(val, index) {
                this.currentIndex = index;
            },
            /*change_box_type(val) {
                this.currentBox.length = val.length;
                this.currentBox.width = val.width;
                this.currentBox.height = val.height;
                let log = `选择了箱子${this.currentIndex + 1}的体积：${val.length}*${val.width}*${val.height}`;
                this.logData.unshift(log);
            },*/
            //添加箱子
            add_box() {
                if (this.currentBox) {
                    let weight = this.currentBox.detail.reduce((perv, curr) => {
                        const value = Number(curr.gross_weight);
                        return perv + value;
                    }, 0);
                    if (weight < 10) {
                        this.$confirm(`单箱还不足10KG，是否要新增箱子`, '提示', {
                            type: 'warning',
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        }).then(() => {
                            this.add_box_sure();
                        }).catch(() => {
                            this.$message({type: 'info', message: '已取消'});
                        });
                    } else {
                        this.add_box_sure();
                    }
                } else {
                    this.add_box_sure();
                }
            },
            add_box_sure() {
                let {length, width, height} = this.box_size;
                let data = {
                    picking_id: this.packingInfo.picking_id,
                    allocation_id: this.packingInfo.allocation_id,
                    length,
                    width,
                    height,
                };
                this.$http(api_allocation_packing_add, data).then(res => {
                    let box = Object.assign({}, res, {
                        detail: [],
                    });
                    this.packingData.push(box);
                    this.currentIndex = this.packingData.length - 1;
                    this.select_input();
                    let log = `新增箱子${this.packingData.length}成功`;
                    this.logData.unshift(log);
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            focus(tag) {
                this.$refs[tag].inputSelect();
            },
            change_box_size() {
                this.to_fix(this.currentBox.height, 1);
                this.to_fix(this.currentBox.width, 1);
                this.to_fix(this.currentBox.length, 1);
                let {height, width, length, id} = this.currentBox;
                let data = {
                    height, width, length, id
                };
                if (!this.validate_box(data)) {
                    return;
                }
                let log;
                this.$http(api_allocation_box_change, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    log = `修改了箱子${this.currentIndex + 1}的箱子体积：${length}*${width}*${height}`;
                    this.logData.unshift(log);
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                    log = `修改箱子${this.currentIndex + 1}体积失败`;
                    this.logData.unshift(log);
                })
            },
            validate_box(data) {
                switch (true) {
                    case Number(data.length) < 1 || Number(data.length) > 999:
                        this.box_warning_handle({
                            message: '长度',
                            key: 'length'
                        });
                        return false;
                    case Number(data.width) < 1 || Number(data.width) > 999:
                        this.box_warning_handle({
                            message: '宽度',
                            key: 'width'
                        });
                        return false;
                    case Number(data.height) < 1 || Number(data.height) > 999:
                        this.box_warning_handle({
                            message: '高度',
                            key: 'height'
                        });
                        return false;
                }
            },
            box_warning_handle(type) {
                this.$message({type: 'warning', message: `箱子${type.message}设置错误，请重填!`});
                this.currentBox[type.key] = 1;
                this.$nextTick(() => {
                    this.focus(type.key);
                });
            },
            //扫描sku
            submit() {
                let data = this.get_params();
                if (!data.id) {
                    this.$message({type: 'error', message: '请先添加箱子再扫描sku'});
                    return;
                }

                if (!this.curCanMix && this.currentBox.detail.length !== 0 && this.currentBox.transport_property !== this.transportInfo.find(row => row.sku === data.sku).transport_property) {
                    this.$confirm(`sku物流属性与箱子不一致，是否确认装在同一个箱子？`, '提示', {
                        type: 'warning',
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                    }).then(() => {
                        this.scan_sku(data);
                    }).catch(() => {
                        this.$message({type: 'info', message: '已取消'});
                    })
                } else {
                    this.scan_sku(data);
                }
            },
            scan_sku(data) {
                let log;
                this.$http(api_allocation_packing_insert, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});

                    this.clear_error();
                    let sku = res.data;

                    //箱子的第一个sku确定箱子的物流属性
                    if (this.currentBox.detail.length === 0) {
                        this.currentBox.transport_property = res.transport_property;
                    }

                    //更新待装箱数量并记录日志
                    let curSku = this.currentBox.detail.find(cur_sku => cur_sku.sku === sku.sku);
                    let quantity;
                    if (curSku) {
                        quantity = Number(sku.quantity) - Number(curSku.quantity)
                        this.$set(curSku, 'quantity', Number(sku.quantity));
                        this.$set(curSku, 'waiting_quantity', Number(sku.quantity));
                        this.$set(curSku, 'gross_weight', this.to_fix(Number(curSku.weight) * curSku.quantity));
                    } else {
                        quantity = Number(sku.quantity)
                        this.$set(sku, 'quantity', quantity);
                        this.$set(sku, 'waiting_quantity', quantity);
                        this.$set(sku, 'gross_weight', this.to_fix(Number(sku.weight) * quantity));
                        this.$set(sku, 'number', this.currentBox.detail.length + 1);
                        this.$set(sku, 'transport_property', sku.transport_property === 1 ? 1 : 0);
                        this.currentBox.detail.unshift(sku);
                    }
                    this.packingInfo.quantity -= quantity;
                    log = `扫描SKU：${data.sku},数量${quantity}，装入箱子${this.currentIndex + 1}成功`;
                }).catch(code => {
                    this.set_error(code);
                    this.$message({type: 'error', message: code.message || code});
                    log = `扫描SKU：${data.sku}失败：${code.message || code}`;
                }).finally(() => {
                    this.logData.unshift(log);
                    this.select_input();
                });
            },
            //更改数量
            sku_change(row) {
                if (Number(row.quantity) === Number(row.waiting_quantity)) {
                    return;
                }
                let data = {
                    sku: row.sku,
                    picking_id: this.packingInfo.picking_id,
                    allocation_id: this.packingInfo.allocation_id,
                    id: this.currentBox.id,
                    quantity: row.quantity,
                };
                let log;
                this.$http(api_allocation_packing_change_quantity, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    let diff = Number(row.waiting_quantity) - Number(row.quantity);
                    this.packingInfo.quantity += diff;
                    this.$set(row, 'gross_weight', this.to_fix(Number(row.weight) * Number(row.quantity)));
                    this.$set(row, 'waiting_quantity', row.quantity);
                    log = `修改箱子${this.currentIndex + 1}的sku：${row.sku}的数量为${row.quantity}`;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                    this.$set(row, 'quantity', row.waiting_quantity);
                    log = `修改箱子${this.currentIndex + 1}的sku失败：${code.message || code}`;
                }).finally(() => {
                    this.logData.unshift(log);
                    this.select_input();
                });
            },
            //重量精度为3
            to_fix(number, flag) {
                flag = flag || 3;
                return Number(parseFloat(number).toFixed(flag));
            },
            get_params() {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                let data = clone(this.searchData);
                data.picking_id = this.packingInfo.picking_id;
                data.allocation_id = this.packingInfo.allocation_id;
                data.id = this.currentBox.id || '';
                data.insert_type = 1;
                return data;
            },
            delete_sku(row) {
                this.$confirm(`您将从这个箱子里删除${row.sku}，确认此操作吗？`, '提示', {
                    type: 'warning',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(() => {
                    let detail = this.currentBox.detail;

                    let data = {
                        id: row.id,
                    };
                    if (detail.findIndex(sku => sku.id === row.id) === detail.length - 1) {
                        data.is_first = 1;
                    }
                    this.$http(api_allocation_sku_delete, data).then(res => {
                        this.packingInfo.quantity += Number(row.quantity);
                        this.$message({type: 'success', message: res.message || res});
                        let index = this.currentBox.detail.findIndex(sku => sku.id === data.id);
                        //删除第一个更改箱子物流属性
                        if (index === this.currentBox.detail.length - 1) {
                            this.currentBox.transport_property = res.transport_property;
                        }
                        this.currentBox.detail.splice(index, 1);
                        this.currentBox.detail.forEach((row, curIndex) => {
                            if (curIndex < index) {
                                this.$set(row, 'number', row.number - 1);
                            }
                        });
                        let log = `箱子${this.currentIndex + 1}删除sku${row.sku}成功`;
                        this.logData.unshift(log);
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    });
                }).catch(() => {
                    this.clear_error();

                    this.$message({type: 'info', message: '已取消'});
                })
            },
            //设置报错信息
            set_error({type, message}) {
                this.error = {type, message};
            },
            clear_error() {
                this.error = {
                    type: 0,
                    message: '',
                }
            },
            finish_packing() {
                if (!this.validate()) {
                    this.$reqKey('api_allocation_packing_finish', false);
                    return;
                }
                if (this.packingInfo.quantity > 0) {
                    this.$confirm(`还有未装完的商品，剩下的商品将生成重返上架单，是否确认装箱完毕`, '提示', {
                        type: 'warning',
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                    }).then(() => {
                        this.finish_packing_sure();
                    }).catch(() => {
                        this.$reqKey('api_allocation_packing_finish', false);
                        this.$message({type: 'info', message: '已取消'});
                    });
                } else if (this.packingInfo.quantity === 0) {
                    this.$confirm(`是否确认装箱完毕`, '提示', {
                        type: 'warning',
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                    }).then(() => {
                        this.finish_packing_sure();
                    }).catch(() => {
                        this.$message({type: 'info', message: '已取消'});
                    });
                } else {
                    this.$message({type: 'warning', message: `装箱数量有误，请联系IT解决！`});
                }
            },
            finish_packing_sure() {
                let data = this.get_finish_params();
                this.$http(api_allocation_packing_finish, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$router.push({
                        path: "/packing-manage",
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_allocation_packing_finish', false);
                    }, 200);
                });
            },
            get_finish_params() {
                let boxInfo = clone(this.packingData);
                boxInfo.forEach(box => {
                    box.box_weight = this.to_fix(box.box_weight);
                    box.detail = box.detail.map(row => {
                        return {
                            sku: row.sku,
                            quantity: row.quantity,
                            id: row.id,
                        };
                    });
                });
                let data = {
                    picking_id: this.packingInfo.picking_id,
                    allocation_id: this.packingInfo.allocation_id,
                    boxInfo: boxInfo,
                };
                return data;
            },
            validate() {
                return !this.packingData.some((row, index) => {
                    if (row.detail.length !== 0) {
                        if (Number(row.box_weight) === 0) {
                            this.$message({type: 'error', message: `箱子${index + 1}的称重错误，请检查`});
                            return true;
                        }
                        if (Number(row.length) === 0 || Number(row.width) === 0 || Number(row.height) === 0) {
                            this.$message({type: 'error', message: `箱子${index + 1}的体积错误，请检查`});
                            return true;
                        }
                    }
                    return false;
                });
            },
            /**
             * 箱子尺寸修改
             */
            /*change_box_size() {
                this.currentBox.length = this.currentBox.length.trim();
                this.currentBox.width = this.currentBox.width.trim();
                this.currentBox.height = this.currentBox.height.trim();

            },*/
            // 修改箱子称重重量
            change_weight() {
                this.currentBox.box_weight = this.to_fix(this.currentBox.box_weight);
                let weight = this.currentBox.detail.reduce((prev, curr) => {
                    let value = Number(curr.gross_weight);
                    return prev + value;
                }, 0);
                if (this.currentBox.box_weight < weight) {
                    this.$confirm(`箱子重量小于商品总重量，是否确认重量`, '提示', {
                        type: 'warning',
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                    }).then(() => {
                        let log = `修改了箱子${this.currentIndex + 1}的箱子重量：${this.currentBox.box_weight}KG`;
                        this.logData.unshift(log);
                    }).catch(() => {
                        this.currentBox.box_weight = '';
                        this.$message({type: 'info', message: '已取消，请重新称重或核实商品数量'});
                    });
                } else {
                    let log = `修改了箱子${this.currentIndex + 1}的箱子重量：${this.currentBox.box_weight}KG`;
                    this.logData.unshift(log);
                }
            },
            //退出
            exit() {
                this.$router.push({
                    path: "/packing-manage",
                });
            },
        },
        computed: {
            currentBox() {
                return this.packingData[this.currentIndex];
            },
            curCanMix() {
                return !this.currentBox.detail.every(row => {
                    return row.transport_property === this.currentBox.transport_property;
                })
            }
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            uiLimitNumber: require('@/components/ui-limit-number.vue').default,
            pickingsDetail: require('./pickings-detail').default
        }
    }
</script>
