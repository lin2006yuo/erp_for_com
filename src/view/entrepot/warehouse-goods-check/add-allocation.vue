<template>
    <page-dialog :title="addAction.title"
                 size="full"
                 class="p-inventory-check"
                 v-model="visible"
                 :close-on-click-modal="false">
        <div class="print" v-if="isPrint">
            <p class="print-title">
                请使用本界面的打印按钮直接打印，不要用浏览器打印功能
                <el-button @click="print">打印</el-button>
                <span class="fr mr-sm">
                    <span>打印机：</span>
                    <select-printer v-model="printer" class="inline width-lg"></select-printer>
                </span>
            </p>
        </div>
        <table class="right-table mb-sm" cellpadding="0" cellspacing="0" v-if="!isAdd">
            <tr>
                <td width="150">盘点单号</td>
                <td colspan="3">{{tableData.id}}</td>
            </tr>
            <tr>
                <td width="150">盘点类型</td>
                <td width="150">{{tableData.type_name}}</td>
                <td width="150">盘点结果</td>
                <td width="150">{{tableData.status_name}}</td>
            </tr>
            <tr>
                <td width="150">盘点仓库</td>
                <td width="150">{{tableData.warehouse_code}}</td>
                <td width="150">盘点人</td>
                <td width="150">{{tableData.checker_name}}</td>
            </tr>
            <tr>
                <td width="150">创建人</td>
                <td width="150">{{tableData.creator_name}}</td>
                <td width="150">创建时间</td>
                <td width="150">{{tableData.create_time | filterTime}}</td>
            </tr>
            <tr>
                <td width="150">完成人</td>
                <td width="150">{{tableData.update_name}}</td>
                <td width="150">完成时间</td>
                <td width="150">{{tableData.update_time | filterTime}}</td>
            </tr>
        </table>
        <el-card>
            <search-card v-if="!isPrint" :params="searchData" :clears="clears" @search="search_tab"
                         style="overflow: initial;">
                <label-item label="盘点仓库：">
                    <el-select v-model="searchData.warehouse_id" class="width-xs" disabled>
                        <el-option v-for="(item, index) in warehouse"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="" class="inline ml-sm">
                    <el-select
                            v-model="searchData.snType"
                            class="inline width-xs">
                        <el-option
                                v-for="(item, index) in typeList"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <order-input v-sf.snText
                                 v-if="!isAdd"
                                 v-model="searchData.snText"
                                 class="inline width-super ml-mini"
                                 @keydown="search_tab"
                                 placeholder="可批量搜索，Shift+回车换行...">
                    </order-input>
                </label-item>
                <label-item label="" class="inline ml-sm">
                    <el-select v-model="searchData.areaType" class="inline width-xs" @change="changeType">
                        <el-option v-for="(item, index) in areaTypeList"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchData.areaText" clearable class="inline ml-sm width-lg">
                        <el-option v-for="(item, index) in areaList"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>

                <label-item label="盘点结果：" class="ml-sm" v-if="!isAdd">
                    <el-select v-model="searchData.result" class="inline width-xs">
                        <el-option v-for="(item, index) in resultList"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
            </search-card>
            <el-row>
                <el-col :span="24" style="padding-left: 8px;">
                    <div class="inline mt-xs mt-xs" v-if="isEdit && tableData.type !== 2">
                        <el-button type="primary" size="mini" @click="editAllocation" class="mb-mini">添加货位</el-button>
                        <el-button type="primary" size="mini" @click="deleteAllocation"
                                   :disabled="selectData.length <= 0">删除货位
                        </el-button>
                    </div>
                    <div class="fr blue" v-if="!isAdd">
                        小提示：填写盘点数量时按下PageUp或PageDown可以上下切换哟~
                    </div>
                    <el-table
                            v-for="item in list"
                            :key="item"
                            :data="tableData.details"
                            :height="400"
                            v-loading="loading"
                            ref="tableData"
                            class="scroll-bar"
                            element-loading-text="玩命加载中"
                            @selection-change="selected"
                            highlightCurrentRow>
                        <el-table-column
                                type="selection"
                                width="40">
                        </el-table-column>
                        <el-table-column
                                inline-template
                                width="120"
                                label="货位">
                            <div>
                                <ui-tip :content="row.code || row.warehouse_cargo_code" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column
                                inline-template
                                width="100"
                                label="分区功能">
                            <div>
                                <ui-tip :content="row.warehouse_area_type" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column
                                inline-template
                                width="150"
                                label="SKU">
                            <div>
                                <ui-tip :content="row.sku" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column
                                inline-template
                                v-if="!isAdd"
                                label="货位库存数量">
                            <div>
                                <ui-tip :content="row.quantity_cargo" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column
                                v-if="!isAdd"
                                width="200px"
                                label="盘点数量">
                            <template slot-scope="scope">
                                <ui-tip :content="scope.row.quantity_check" :width="98"
                                        v-if="!isEdit || scope.row.status !== 0"></ui-tip>
                                <integer-zero-input v-model="scope.row.quantity_check"
                                                    class="inline mr-xs"
                                                    style="width: 80px"
                                                    ref="quantity"
                                                    @focus="focus(scope.row.number)"
                                                    @keyup.native="key_updown($event, scope.$index)"
                                                    :disabled="!(isEdit && scope.row.status === 0)"
                                                    :class="{warningborder:scope.row.quantity_check === ''}"
                                                    v-show="isEdit && scope.row.status === 0" :min="0">
                                </integer-zero-input>
                                <el-button size="mini"
                                           @click="heavyPlate(scope.row)"
                                           v-if="isEdit && scope.row.status !== 0 && scope.row.plate">重盘
                                </el-button>
                                <el-button size="mini"
                                           @click="save_check(scope.row)"
                                           v-if="isEdit && scope.row.status === 0 && scope.row.save">保存
                                </el-button>
                                <el-button size="mini"
                                           @click="cancel_check(scope.row)"
                                           v-if="isEdit && scope.row.cancel">取消
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                                inline-template
                                v-if="isEdit"
                                label="备注">
                            <div>
                                <ui-tip :content="row.remark" :width="98" v-if="!isEdit || row.status !== 0"></ui-tip>
                                <el-input v-model="row.remark" v-if="isEdit && row.status === 0"
                                          @change="change_remark(row)"></el-input>
                            </div>
                        </el-table-column>
                        <el-table-column
                                inline-template
                                v-if="!isAdd"
                                label="盈亏数量">
                            <div>
                                <ui-tip :content="row.quantity_diff" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column
                                inline-template
                                v-if="!isAdd"
                                label="盘点结果">
                            <div>
                                <span :class="{'red':row.status === 4 || row.status === 6}">
                                    {{row.status_name}}
                                </span>
                            </div>
                        </el-table-column>
                        <el-table-column
                                inline-template
                                v-if="!isAdd"
                                label="盘点人">
                            <div>
                                <ui-tip :content="row.checker_name" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column
                                inline-template
                                v-if="!isAdd"
                                label="盘点时间">
                            <div>
                                <ui-tip :content="row.update_time | filterTime" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column
                                inline-template
                                v-if="!(isAdd || isEdit)"
                                label="备注">
                            <div>
                                <ui-tip :content="row.remark" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            class="fr mt-sm"
                            @size-change="handle_size_change"
                            @current-change="handle_current_change"
                            :current-page="searchData.page"
                            :page-sizes="[20, 50, 100, 200]"
                            :page-size="searchData.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-card>
        <div slot="footer">
            <request-button req-key="finishAdd" @click="finish" v-if="isFinish">完成盘点</request-button>
            <request-button req-key="saveAdd" @click="save" v-if="isEdit" :disabled="newCargo" title="新增新的货位">保存盘点单
            </request-button>
            <request-button req-key="editAdd" @click="edit" v-if="isEdit && tableData.type === 1">批量盘点</request-button>
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-inventory-check {
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
                border-top: 1px solid #d3dce6;
                border-right: 1px solid #d3dce6;
                height: 26px;
            }
            td:nth-child(2n+1) {
                background-color: #f5f7fa;
            }
        }
        .category_title {
            box-sizing: border-box;
            display: block;
            width: 100%;
            height: 30px;
            line-height: 28px;
            padding-left: 10px;
            background: #008BCE;
            border: 1px solid #008BCE;
            color: #fff;
            -moz-user-select: none;
            user-select: none;
            &:hover {
                background: rgb(51, 162, 216);
                cursor: pointer;
            }
        }
        .add-goods-tree {
            max-height: 550px;
            overflow-y: auto;
        }
        .checkAll {
            height: 30px;
            line-height: 30px;
            background-color: #33a2d8;
        }
        .print {
            text-align: center;
            margin-bottom: 10px;
            color: #ff4949;
            height: 40px;
            line-height: 40px;
            .print-title {
                width: 60%;
                border: 3px solid black;
                font-size: 2rem;
                background-color: yellow;
                margin: 0 auto;
            }
        }
        .warningborder {
            input {
                border-color: #ff4949 !important;
            }
        }
        .blue {
            color: #1D8CE0;
            line-height: 26px;
        }
    }
</style>
<script>
    import {print} from "./preview"
    import {
        api_get_categories, api_get_cargo, api_get_area_type, api_get_area_lists, api_finish_detail,
        api_save_check, api_save_batch_check, api_update_check, api_delete_details,
        api_recheck_details
    } from '../../../api/warehouse-goods-check'

    export default {
        data() {
            return {
                list: [1],
                visible: false,
                loading: false,
                searchData: {
                    warehouse_id: '',
                    snType: 'shelf',
                    areaType: 'id',
                    result: '',
                    areaText: '',
                    snText: '',
                    category_id: '',
                    page: 1,
                    pageSize: 20,
                },
                clears: {
                    warehouse_id: 2,
                    snType: 'shelf',
                    areaType: 'id',
                    page: 1,
                    pageSize: 20
                },
                typeList: [
                    {label: '货架', value: 'shelf'},
                    {label: '货位', value: 'code'},
                    {label: 'SKU', value: 'sku'},
                    //{label:'商品名称',value:'goods_name'}
                ],
                areaTypeList: [
                    {label: '分区', value: 'id'},
                    {label: '分区功能', value: 'type'}
                ],
                resultList: [
                    {label: '全部', value: ''},
                    {label: '初始', value: 0},
                    {label: '盘盈', value: 4},
                    {label: '盘亏', value: 6},
                    {label: '正常', value: 8},
                ],
                areaList: [],
                treeData: [],
                addList: [],
                total: 0,
                totalData: [], //全部全选的数据
                arr: [], //分页显示的数据
                copyData: [], //拷贝获取的所有数据
                print_html: '',
                print_number: 1,
                print_list: [],
                printContent: '',
                printer: '',
                token: '',
                numberList: [],
                rawData: {},//编辑获取到的数据的id和数量，
                compareData: {},//获取到的新的货位的货位+sku
                selectData: [],
            }
        },
        mounted() {
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        methods: {
            //重盘
            heavyPlate(row) {
                this.$http(api_recheck_details, row.id).then(res => {
                    row.initial = clone(row.quantity_check);
                    row.cancel = true;
                    row.plate = false;
                    row.save = true;
                    row.status = 0;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            //保存单个
            save_check(row) {
                row.save = false;
                row.plate = true;
                row.cancel = false;
                let data = {
                    warehouse_goods_check_id: this.tableData.id,
                    warehouse_cargo_code: row.warehouse_cargo_code,
                    sku: row.sku,
                    quantity_check: row.quantity_check,
                    remark: row.remark,
                };
                this.$http(api_save_check, data).then(res => {
                    let index = this.tableData.details.findIndex(item => {
                        return res.data.id === item.id;
                    });
                    console.log('index', index);
                    Object.assign(this.tableData.details[index], res.data);
                    // this.tableData.details.splice(index, 1, res.data)

                    this.$message({type: "success", message: res.message || res});
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })

            },
            //取消
            cancel_check(row) {
                row.quantity_check = clone(row.initial);
                row.cancel = false;
                row.plate = true;
                row.status = 1;
            },
            //完成盘点
            finish() {
                this.$confirm(`您将完成盘点单${this.tableData.id},确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_finish_detail, this.tableData.id).then(res => {
                        this.$emit('delete-table', this.tableData.id);
                        this.$message({type: "success", message: res.message || res});
                        this.visible = false;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`finishAdd`, false);
                    }, 200);
                });
            },
            //编辑保存
            edit() {
                let data = [];
                this.copyData.forEach(row => {
                    if (this.rawData[row.id] !== row.quantity_check || row.status === 0) {
                        let item = {
                            warehouse_goods_check_id: this.tableData.id,
                            warehouse_cargo_code: row.warehouse_cargo_code,
                            sku: row.sku,
                            quantity_check: row.quantity_check,
                            remark: row.remark
                        };
                        data.push(item);
                    }
                });
                if (data.length <= 0) {
                    this.$message({type: "error", message: `货位的盘点数没有改变`});
                    this.$reqKey(`editAdd`, false);
                    return false;
                }
                this.$http(api_save_batch_check, {data: data}).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`editAdd`, false);
                    }, 200);
                });
            },
            save() {
                let details = [];
                this.copyData.forEach(row => {
                    if (!row.id) {
                        let item = {
                            warehouse_cargo_id: row.warehouse_cargo_id,
                            warehouse_cargo_code: row.code || row.warehouse_cargo_code,
                            warehouse_area_id: row.warehouse_area_id,
                            warehouse_area_code: row.warehouse_area || row.warehouse_area_code,
                            warehouse_area_type: row.warehouse_area_type_value || row.warehouse_area_type,
                            sku_id: row.sku_id,
                            sku: row.sku
                        };
                        details.unshift(item);
                    }
                });
                let data = {
                    id: this.tableData.id,
                    details: details
                };
                this.$http(api_update_check, data).then(res => {
                    this.editList.length = 0;
                    this.$emit('new-data', res.data);
                    this.$message({type: "success", message: res.message || res});
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`saveAdd`, false);
                    }, 200);
                });
            },
            //分页器
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.search_tab();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.search_tab();
            },
            changeType(val) {
                this.searchData.areaText = '';
                switch (val) {
                    case 'id':
                        this.$http(api_get_area_lists, {warehouse_id: this.searchData.warehouse_id}).then(res => {
                            this.areaList = res.map(row => {
                                return {label: row.name, value: row.id}
                            });
                        }).catch(code => {
                            this.$message({type: "error", message: code.message || code});
                        });
                        break;
                    case 'type':
                        this.$http(api_get_area_type).then(res => {
                            this.areaList = res;
                        }).catch(code => {
                            this.$message({type: "error", message: code.message || code});
                        });
                        break;
                }
            },
            //前端分页
            tabData() {
                this.arr = [];
                this.rawData = {};
                this.compareData = {};
                this.tableData.details = [];
                this.copyData.forEach((row, index) => {
                    let key = row.id;
                    let code = row.warehouse_cargo_code;
                    this.rawData[key] = row.quantity_check;
                    this.compareData[code] = row.sku_id;
                    if (index < this.searchData.page * this.searchData.pageSize && index >= (this.searchData.page - 1) * this.searchData.pageSize) {
                        this.arr.push(row);
                    }
                });
                this.tableData.details = this.arr.map((row, index) => {
                    this.$set(row, 'number', index);
                    return row;
                });
            },
            //打印
            print() {
                if (this.printer === '') {
                    this.$message({type: "error", message: '当前PC未启动打印服务'});
                    return false;
                }
                let pageSize = 30;//打印的每页的数量
                let flag = false;//是否发送表单确定打印
                this.print_html = '';//打印的内容
                this.print_number = 1;//打印的页码
                //循环打印的页数
                for (let i = 0; i < Math.ceil(this.copyData.length / pageSize); i++) {
                    this.print_list = [];
                    //循环的次数为最后一页时可以进行打印
                    if (i === Math.ceil(this.copyData.length / pageSize) - 1) {
                        flag = true;
                    }
                    //判断打印的页码是否为1，为1则带表头
                    if (this.print_number === 1) {
                        this.copyData.forEach((row, index) => {
                            if (index < this.print_number * pageSize && index >= (this.print_number - 1) * pageSize) {
                                this.print_list.push(row);
                            }
                        });
                    } else {
                        this.copyData.forEach((row, index) => {
                            if (index < this.print_number * pageSize && index >= (this.print_number - 1) * pageSize) {
                                this.print_list.push(row);
                            }
                        });
                    }
                    print.call(this, true, flag);
                    this.print_number++;
                }
            },
            search_tab() {
                this.arr = [];
                this.rawData = {};
                this.compareData = {};
                this.tableData.details = [];
                let searchList = [];
                let snType = '';
                switch (this.searchData.snType) {
                    case 'shelf':
                        snType = 'shelf_code';
                        break;
                    case 'code':
                        snType = 'warehouse_cargo_code';
                        break;
                    case 'sku':
                        snType = 'sku';
                        break;
                }

                let areaType = '';
                switch (this.searchData.areaType) {
                    case 'id':
                        areaType = 'warehouse_area_id';
                        break;
                    case 'type':
                        areaType = 'warehouse_area_type_value';
                        break;
                }
                let cur = this.searchData.snText.split('\n').filter(row => !!row);

                let snText = cur.map(row => {
                    return row.trim();
                });
                console.log('search batch', cur, snText, this.searchData.snText);
                this.copyData.forEach(row => {
                    if (snText.find(res => res === row[snType]) || snText.length === 0) {
                        if ((row[areaType] === this.searchData.areaText || !this.searchData.areaText)) {
                            if (this.searchData.result === '') {
                                searchList.push(row);
                            } else if (row.status === this.searchData.result) {
                                searchList.push(row);
                            }
                        }
                    }
                });
                console.log('searchList', searchList);
                this.total = searchList.length;
                searchList.forEach((row, index) => {
                    let key = row.id;
                    let code = row.warehouse_cargo_code;
                    this.rawData[key] = row.quantity_check;
                    this.compareData[code] = row.sku_id;
                    if (index < this.searchData.page * this.searchData.pageSize && index >= (this.searchData.page - 1) * this.searchData.pageSize) {
                        this.arr.push(row);
                    }
                });
                this.tableData.details = this.arr.map((row, index) => {
                    this.$set(row, 'number', index);
                    return row;
                });
            },
            focus(index) {
                console.log('index', index);
                this.$refs.quantity[index].$refs.input.select();
            },
            key_updown(ev, index) {
                if (ev.keyCode === 34) {
                    for (let i = index; i < this.$refs.quantity.length - 1; i++) {
                        if (!this.$refs.quantity[i + 1].disabled) {
                            this.$refs.quantity[i + 1].$refs.input.select();
                            break;
                        }
                    }
                } else if (ev.keyCode === 33) {
                    for (let i = index; i > 0; i--) {
                        if (!this.$refs.quantity[i - 1].disabled) {
                            this.$refs.quantity[i - 1].$refs.input.select();
                            break;
                        }
                    }
                }
            },
            editAllocation() {
                this.$emit('add-allocation', 'edit');
            },
            selected(selection) {
                this.selectData = selection;
            },
            deleteAllocation() {
                let data = [];
                this.selectData.forEach(row => {
                    if (!!row.id) {
                        data.push(row.id);
                    }
                });
                this.$http(api_delete_details, {ids: data}).then(res => {
                    this.selectData.forEach(row => {
                        let flag = this.copyData.findIndex(item => {
                            return item.id === row.id || (row.code === item.code && row.sku === item.sku);
                        });
                        if (flag !== -1) {
                            this.copyData.splice(flag, 1);
                        }
                    });
                    this.tabData();
                    this.total = this.copyData.length;
                    this.$message({type: "success", message: res.message || res});
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            change_remark(row) {//输入去空格
                typeof row.remark === 'string' && (row.remark = row.remark.trim());
            },
        },
        computed: {
            isAdd() {
                return this.addAction.value === 'add';
            },
            isLook() {
                return this.addAction.value === 'look';
            },
            isFinish() {
                return this.addAction.value === 'finish';
            },
            isEdit() {
                return this.addAction.value === 'edit';
            },
            isPrint() {
                return this.addAction.value === 'print';
            },
            newCargo() {
                let flag = true;
                this.copyData.forEach(row => {
                    if (!row.id) {
                        flag = false;
                    }
                });
                return flag;
            },
            PrintName() {
                if (this.printer) {
                    let printer = JSON.parse(this.printer);
                    return printer.name;
                } else {
                    return '';
                }
            }
        },
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                if (val) {
                    this.changeType('id');
                } else {
                    this.searchData = {
                        warehouse_id: 2,
                        snType: 'shelf',
                        areaType: 'id',
                        areaText: '',
                        snText: '',
                        category_id: '',
                        result: '',
                        page: 1,
                        pageSize: 20
                    };
                }
                if (this.isAdd) {

                } else {
                    this.copyData = clone(this.tableData.details);
                    this.copyData.forEach(row => {
                        if (row.checker_id === 0) {
                            if (this.isEdit) {
                                row.quantity_check = row.quantity_cargo;
                            } else {
                                row.quantity_check = '';
                            }
                        }
                        if (row.status === 0) {
                            this.$set(row, 'plate', false);
                            this.$set(row, 'save', true);
                        } else {
                            this.$set(row, 'plate', true);
                            this.$set(row, 'save', false);
                        }
                        this.$set(row, 'cancel', false);
                    });
                    this.total = this.copyData.length;
                    this.tabData();
                }
                this.visible = val;
                console.log(this.searchData);
            },
            editList(val) {
                console.log('editList', val);
                console.log('compareData', this.compareData);
                val.forEach(row => {
                    if (!(this.compareData.hasOwnProperty(row.code) && this.compareData[row.code] === row.sku_id)) {
                        let item = {
                            warehouse_cargo_id: row.warehouse_cargo_id,
                            shelf_code: row.code,
                            warehouse_cargo_code: row.code || row.warehouse_cargo_code,
                            warehouse_area_id: row.warehouse_area_id,
                            warehouse_area_code: row.warehouse_area || row.warehouse_area_code,
                            warehouse_area_type_value: row.warehouse_area_type_value,
                            warehouse_area_type: row.warehouse_area_type_value || row.warehouse_area_type,
                            sku_id: row.sku_id,
                            sku: row.sku
                        };
                        this.copyData.unshift(item);
                    }
                });
                console.log('copyData', this.copyData);
                this.total = this.copyData.length;
                this.tabData();
            }
        },
        props: {
            value: {},
            addAction: {},
            warehouse: {},
            tableData: {},
            editList: {}
        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default,
            labelItem: require('../../../components/label-item.vue').default,
            uiTip: require('../../../components/ui-tip.vue').default,
            tree: require('../../../components/tree.vue').default,
            integerZeroInput: require('../../../components/integer-zero-input.vue').default,
            selectPrinter: require('../../../components/select-printer.vue').default,
            searchCard: require('../../../components/search-card.vue').default,
            orderInput: require("../../../components/order-input.vue").default
        },
    }
</script>
