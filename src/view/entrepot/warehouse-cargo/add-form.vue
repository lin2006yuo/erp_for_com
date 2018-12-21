<template>
    <div class="c-add-form">
        <page-dialog v-model="show" :title='title' class="add-classify" size="large" :close-on-click-modal="false"
                     @change="chang_dialog">
            <el-form label-position="right" label-width="200px" :model="warehouseCargoData" :rules="rules"
                     ref="ruleForm">
                <el-form-item label="仓库：" prop="warehouse_id" required>
                    <el-select v-model="warehouseCargoData.warehouse_id" :disabled="true" @change="change_warehouse"
                               class="inline">
                        <el-option
                                :key="item.value"
                                v-for="item in warehouses"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分区：" prop="warehouse_area_id" required>
                    <ui-select v-model="warehouseCargoData.warehouse_area_id" class="inline"
                               :disabled="!warehouseCargoData.warehouse_id || this.warehouseCargoData.edit"
                               @change="change_warehouse_area">
                        <el-option
                                :key="item.value"
                                v-for="item in warehouseAreaLists"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </ui-select>
                </el-form-item>
                <el-form-item label="货架号：" prop="warehouse_shelf_id" required>
                    <ui-select v-model="warehouseCargoData.warehouse_shelf_id"
                               :disabled="!warehouseCargoData.warehouse_area_id || this.warehouseCargoData.edit"
                               @change="change_warehouse_shelf" placeholder="请先选择分区" class="inline">
                        <el-option
                                :key="item.value"
                                v-for="item in warehouseShelfLists"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </ui-select>
                </el-form-item>
                <el-form-item label="货位类型：" prop="cargo_class_id" required>
                    <ui-select v-model="warehouseCargoData.cargo_class_id" :disabled="!warehouseCargoData.warehouse_id"
                               class="inline">
                        <el-option
                                :key="item.value"
                                v-for="item in cargoClassLists"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </ui-select>
                </el-form-item>
                <el-form-item label="SKU品种数：" prop="sku_num" required>
                    <integer-zero-input :min="0" :disabled="!is_picking" v-model="warehouseCargoData.sku_num"
                                        class="width-mini inline"></integer-zero-input>
                    <span class="red width-super">0表示不限制货位存放SKU品种数量</span>
                </el-form-item>
                <template>
                    <el-tabs v-model="activeName" type="card" style="margin-left: 130px;">
                        <el-tab-pane label="单个货位" name="first">
                            <el-form-item label="货位号：" prop="cargo_num" label-width="70px">
                                <el-input v-model="warehouse_shelf_name" disabled class="inline width-mini"></el-input>
                                -
                                <div v-if="this.warehouseCargoData.edit" class="inline">
                                    <el-input disabled class="inline width-mini" v-model="warehouseCargoData.cargo_num"></el-input>
                                </div>
                                <div v-else class="inline">
                                    <integer-input :disabled="!is_picking"
                                                   v-model="cargo_num_row"
                                                   @blur="cargo_num_row_check(cargo_num_row)"
                                                   :min="1" :max="99"
                                                   class="inline width-mini"></integer-input>
                                    <integer-input :disabled="!is_picking"
                                                   v-model="cargo_num_column"
                                                   @blur="cargo_num_column_check(cargo_num_column)"
                                                   :min="1" :max="99"
                                                   class="inline width-mini ml-xs"></integer-input>
                                </div>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="多个货位" name="second" :disabled="!is_picking || this.warehouseCargoData.edit">
                            <el-form-item label="货位行：" required label-width="70px">
                                <integer-input v-model="warehouseCargoData.row_start"
                                               @blur="row_start_check(warehouseCargoData.row_start)" :min="1" :max="9"
                                               class="inline width-mini"></integer-input>&nbsp;至&nbsp;
                                <integer-input v-model="warehouseCargoData.row_end"
                                               @blur="row_end_check(warehouseCargoData.row_end)" :min="1" :max="9"
                                               class="inline width-mini"></integer-input>
                                <span class="red">备注：货位所在货架的层次</span>
                            </el-form-item>
                            <el-form-item label="货位列：" required label-width="70px">
                                <integer-input v-model="warehouseCargoData.column_start"
                                               @blur="column_start_check(warehouseCargoData.column_start)" :min="1"
                                               :max="9" class="inline width-mini"></integer-input>&nbsp;至&nbsp;
                                <integer-input v-model="warehouseCargoData.column_end"
                                               @blur="column_end_check(warehouseCargoData.column_end)" :min="1" :max="9"
                                               class="inline width-mini"></integer-input>
                            </el-form-item>
                            <el-form-item label="货位号："
                                          label-width="70px"
                                          v-if="rowNumber&&columnNumber">
                                <div>
                                    <table class="template ui-table-head">
                                        <tr v-for="(row,index) in rowNumber" :key="row"
                                            :class="[index%2===0 ? 'row_color' : '']">
                                            <td v-for="(column,index) in columnNumber" :key="index">
                                                <span>{{warehouse_shelf_name}}-{{row | cargoFilter}}{{column | cargoFilter}}</span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </el-form-item>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <request-button :disabled="addShow"
                                req-key="apiAddForm"
                                @click="add_data">确定</request-button>
                <el-button size="mini" @click.native="show = false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .ui-table-head {
        .row_color {
            background-color: #EFF2F7;
        }
    }
</style>
<script>
    import {entrepot_picking, api_warehous_lists} from '../../../api/entrepot-picking';
    import {
        warehouse_area_lists,
        warehouse_shelf,
        warehouse_area_class_lists,
        api_edit_warehouse_cargo
    } from '../../../api/warehouse-cargo';
    const CASE = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    export default {
        data() {
            return {
                show: this.value,
                addShow: false,
                is_picking: true,
                activeName: 'first',
                warehouses: [],
                cargo_num_row: '',
                cargo_num_column: '',
                warehouseAreaLists: [],
                warehouseShelfLists: [],
                cargoClassLists: [],
                warehouse_shelf_name: '',
                rules: {
                    warehouse_area_id: [
                        {required: true, message: '请选择分区', trigger: 'blur', type: "number"}
                    ],
                    warehouse_id: [
                        {required: true, message: '请选择仓库', trigger: 'blur', type: "number"}
                    ],
                    warehouse_shelf_id: [
                        {required: true, message: '请选择货架号', trigger: 'blur', type: "number"}
                    ],
                    cargo_class_id: [
                        {required: true, message: '请选择货位类型', trigger: 'blur', type: "number"}
                    ],
                },
                title: '添加货位'
            }
        },
        mounted() {
            this.warehouses_init();
            this.is_picking = true;
        },
        methods: {
            close() {
                this.warehouse_shelf_name = '';
            },
            chang_dialog() {
                if (!this.warehouseCargoData.edit) {
                    this.warehouse_shelf_name = '';
                    this.cargo_num_row = '';
                    this.cargo_num_column = '';
                }
            },
            row_start_check(val) {
                if (Number(val) > 35) {
                    this.warehouseCargoData.row_start = 35;
                }
            },
            row_end_check(val) {
                if (Number(val) > 35) {
                    this.warehouseCargoData.row_end = 35;
                }
            },
            column_start_check(val) {
                if (Number(val) > 35) {
                    this.warehouseCargoData.column_start = 35;
                }
            },
            column_end_check(val) {
                if (Number(val) > 35) {
                    this.warehouseCargoData.column_end = 35;
                }
            },
            cargo_num_row_check(val) {
                if (Number(val) > 35) {
                    this.cargo_num_row = 35;
                }
            },
            cargo_num_column_check(val) {
                if (Number(val) > 35) {
                    this.cargo_num_column = 35;
                }
            },
            warehouses_init() {
                this.$http(api_warehous_lists).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            change_warehouse(val) {
                this.warehouseCargoData.warehouse_area_id = '';
                if (val) {
                    this.warehouse_area_list(val);
                    this.cargo_class_list(val);
                }
            },
            change_warehouse_area(val) {
                this.warehouseCargoData.warehouse_shelf_id = '';
                if (val) {
                    this.warehouse_shelf_list(val);
                }
                let find = this.warehouseAreaLists.find(row => {
                    return row.value === this.warehouseCargoData.warehouse_area_id;
                });
                if (!!find) {
                    this.is_picking = find.is_picking;
                }
                if (!this.is_picking) {
                    this.warehouseCargoData.sku_num = 0;
                    this.cargo_num_row = '1';
                    this.cargo_num_column = '1';
                    this.warehouseCargoData.cargo_num = '11';
                } else {
                    this.warehouseCargoData.sku_num = 1;
                    this.warehouseCargoData.cargo_num = '';
                    this.cargo_num_row = '';
                    this.cargo_num_column = '';
                }
            },
            change_warehouse_shelf(val) {
                let find = this.warehouseShelfLists.find(res => res.value === val);
                if (!!find) {
                    this.warehouse_shelf_name = find.label;
                    this.warehouseCargoData.cargo_class_id = find.cargo_class_id;
                }
            },
            warehouse_area_list(id) {
                let data = {
                    status: 1,
                    warehouse_id: id,
                    list_type: 'cargo',
                };
                this.$http(warehouse_area_lists, data).then(res => {
                    this.warehouseAreaLists = res.map(row => {
                        return {
                            label: row.name,
                            value: row.id,
                            is_picking: row.is_picking
                        }
                    })
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            warehouse_shelf_list(id) {
                let data = {
                    warehouse_id: this.warehouseCargoData.warehouse_id,
                    warehouse_area_id: id,
                    status: 1
                };
                this.$http(warehouse_shelf, data).then(res => {
                    this.warehouseShelfLists = res.map(row => {
                        return {
                            label: row.code,
                            value: row.id
                        }
                    })
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            cargo_class_list(val) {
                let data = {
                    warehouse_id: val,
                    status: 1
                };
                this.$http(warehouse_area_class_lists, data).then(res => {
                    this.cargoClassLists = res.map(item => {
                        return {
                            label: item.name,
                            value: item.id,
                        }
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            add_data() {
                if (this.warehouseCargoData.edit) {
                    let data = {
                        sku_num: this.warehouseCargoData.sku_num,
                        cargo_class_id: this.warehouseCargoData.cargo_class_id,
                    };
                    this.$http(api_edit_warehouse_cargo, this.warehouseCargoData.id, data).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        let find = this.cargoClassLists.find(res => {
                            return res.value === this.warehouseCargoData.cargo_class_id;
                        });
                        if (!!find) {
                            this.warehouseCargoData.cargo_class = find.label;
                        }
                        this.$emit('update-edit', this.warehouseCargoData);
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('apiAddForm', false);
                        }, 200);
                    });
                } else {
                    this.$refs.ruleForm.validate((valid) => {
                        if (valid) {
                            if (this.activeName === 'first') {
                                this.warehouseCargoData.add_type = 1;
                                this.warehouseCargoData.cargo_num = this.get_cargo_num();
                            } else {
                                this.warehouseCargoData.add_type = 2;
                            }
                            this.addShow = true;
                            this.$emit('add-data', this.warehouseCargoData);
                        } else {
                            return false;
                        }
                    });
                }

            },
            get_cargo_num() {
                this.cargo_num_row = Number(this.cargo_num_row);
                this.cargo_num_column = Number(this.cargo_num_column);
                return `${this.cargo_num_row > 10 ? CASE[this.cargo_num_row-10] : this.cargo_num_row}${this.cargo_num_column > 10 ? CASE[this.cargo_num_column-10] : this.cargo_num_column}`
            }
        },
        computed: {
            rowNumber() {
                if (this.warehouseCargoData.row_start && this.warehouseCargoData.row_end) {
                    let i = this.warehouseCargoData.row_start;
                    let j = this.warehouseCargoData.row_end;
                    let row = [];
                    for (let k = i; k <= j; k++) {
                        row.push(k);
                    }
                    return row;
                }
            },
            columnNumber() {
                if (this.warehouseCargoData.column_start && this.warehouseCargoData.column_end) {
                    let i = this.warehouseCargoData.column_start;
                    let j = this.warehouseCargoData.column_end;
                    let column = [];
                    for (let k = i; k <= j; k++) {
                        column.push(k);
                    }
                    return column;
                }
            }
        },
        watch: {
            value(val) {
                this.show = val;
                this.addShow = false;
                this.activeName = 'first';
                if (this.warehouseCargoData.warehouse_id) {
                    this.warehouse_area_list(this.warehouseCargoData.warehouse_id);
                    this.cargo_class_list(this.warehouseCargoData.warehouse_id);
                }
                if (this.warehouseCargoData.edit) {
                    this.warehouse_shelf_name = this.warehouseCargoData.warehouse_shelf_code;
                    this.warehouse_shelf_list(this.warehouseCargoData.warehouse_area_id);
                    this.title = `编辑货位：${this.warehouseCargoData.code} 信息`
                }
            },
            show(val) {
                this.$emit('input', val);
            }
        },
        filters: {
            statusFilter(val) {
                return val ? `启用` : `禁用`;
            },
            cargoFilter(val) {
                val = Number(val);
                return val < 10 ? val : CASE[val-10];
            }
        },
        props: {
            value: {},
            warehouseCargoData: {},
        },
        components: {
            pageDialog: require("@/components/page-dialog.vue").default,
            uiLimitNumber: require('@/components/ui-limit-number.vue').default,
            uiSelect: require('@/components/ui-select.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            integerZeroInput: require('@/components/integer-zero-input.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
        }
    }
</script>

