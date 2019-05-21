<template>
    <div class="c-add-edit">
        <page-dialog v-model="show" :title='title' class="add-classify" size="small" :close-on-click-modal="false"
                     @change="chang_dialog">
            <el-form label-position="right" label-width="150px" :model="warehouseShelfData" :rules="rules"
                     ref="ruleForm">
                <el-form-item label="货架号：" prop="code" required v-if="editShow">
                    <ui-select v-model="warehouseShelfData.code" disabled class="inline w-input">
                        <el-option
                                :key="item.value"
                                v-for="item in warehouses"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </ui-select>
                </el-form-item>
                <el-form-item label="仓库：" prop="warehouse_id" required>
                    <ui-select v-model="warehouseShelfData.warehouse_id" :disabled="true" @change="change_warehouse"
                               class="inline w-input">
                        <el-option
                                :key="item.value"
                                v-for="item in warehouses"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </ui-select>
                </el-form-item>
                <el-form-item label="分区：" prop="warehouse_area_id" required>
                    <ui-select v-model="warehouseShelfData.warehouse_area_id" class="inline w-input"
                               :disabled="!warehouseShelfData.warehouse_id || editShow" placeholder="请先选择仓库"
                               @change="change_warehouse_area">
                        <el-option
                                :key="item.value"
                                v-for="item in warehouseAreaLists"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </ui-select>
                </el-form-item>
                <el-form-item label="是否靠墙：" prop="rely" required>
                    <el-radio-group v-model="warehouseShelfData.rely">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="货位类型：" prop="cargo_class_id" :required="!!warehouseShelfData.is_auto">
                    <ui-select v-model="warehouseShelfData.cargo_class_id"
                               :class="['inline','w-input',error_cargo_class?'error_cargo':'']">
                        <el-option
                                :key="item.value"
                                v-for="item in cargoClassLists"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </ui-select>
                    <div class="el-form-item__error" v-if="error_cargo_class">{{error_cargo_class}}</div>
                </el-form-item>
                <el-form-item label="行数：" prop="row" required v-if="editShow">
                    <div class="inline">
                        <integer-input :disabled="!is_picking" v-model="warehouseShelfData.row" :min="0"
                                       class="inline width-mini"></integer-input>
                        <div class="red inline width-sm">备注：定义货架的层次</div>
                    </div>
                </el-form-item>
                <el-form-item label="对面通道：" prop="face_aisle" v-if="editShow&&is_picking">
                    <div>
                        <el-input v-model="warehouse_shelf_name" disabled class="inline width-mini"></el-input>
                        <integer-zero-input :disabled="!is_picking" v-model="warehouseShelfData.face_aisle" :min="0"
                                            class="inline width-mini"></integer-zero-input>
                    </div>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-radio-group v-model="warehouseShelfData.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="!editShow">
                    <el-tabs v-model="activeName" type="card" style="margin-left: 80px;">
                        <el-tab-pane label="单个货架" name="first">
                            <div style="margin-left: 94px;"><span>分区</span><label
                                    class="red mr-mini ml-lgs">*</label><span>通道</span><label
                                    class="red mr-mini ml-lgs">*</label><span>位置</span></div>
                            <el-form-item label="货架号：" label-width="70px">
                                <el-input v-model="warehouse_shelf_name" disabled class="inline width-mini"></el-input>
                                <integer-zero-input :disabled="!is_picking" :error="!!error_pass_num"
                                                    v-model="warehouseShelfData.pass_num"
                                                    @change="change_pass_num(warehouseShelfData.pass_num)"
                                                    @blur="get_face_aisle(warehouseShelfData.pass_num)"
                                                    class="inline width-mini"></integer-zero-input>
                                -
                                <integer-zero-input :disabled="!is_picking" :error="!!error_seat_num"
                                                    v-model="warehouseShelfData.seat_num"
                                                    @blur="blur_seat_num(warehouseShelfData.seat_num)" :min="1"
                                                    class="inline width-mini"></integer-zero-input>
                                <div style="margin-left: 78px;" class="el-form-item__error" v-if="error_pass_num">
                                    {{error_pass_num}}
                                </div>
                                <div style="margin-left: 150px;" class="el-form-item__error" v-if="error_seat_num">
                                    {{error_seat_num}}
                                </div>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="多个货架" name="second" :disabled="!is_picking">
                            <div style="margin-left: 94px;"><span>分区</span><label
                                    class="red mr-mini ml-lgs">*</label><span>通道</span><label class="red mr-mini"
                                                                                              style="margin-left: 80px;">*</label><span>位置</span>
                            </div>
                            <el-form-item label="货架号：" label-width="70px">
                                <el-input v-model="warehouse_shelf_name" disabled class="inline width-mini"></el-input>
                                <integer-zero-input v-model="warehouseShelfData.pass_num" :error="!!error_pass_num"
                                                    :min="0" @blur="get_face_aisle_more(warehouseShelfData.pass_num)"
                                                    @change="change_pass_num(warehouseShelfData.pass_num)"
                                                    class="inline width-mini"></integer-zero-input>
                                <div class="inline" style="border: 1px solid #D3DCE6; padding:0 2px 2px 2px;">
                                    <integer-zero-input v-model="warehouseShelfData.start_seat_num"
                                                        :error="!!error_start_seat_num" :min="0"
                                                        @blur="blur_start_seat_num(warehouseShelfData.start_seat_num)"
                                                        class="inline width-mini"></integer-zero-input>
                                    至
                                    <integer-zero-input v-model="warehouseShelfData.end_seat_num"
                                                        :error="!!error_end_seat_num" :min="0"
                                                        @blur="blur_end_seat_num(warehouseShelfData.end_seat_num)"
                                                        class="inline width-mini"></integer-zero-input>
                                </div>
                                <div style="margin-left: 78px;" class="el-form-item__error" v-if="error_pass_num">
                                    {{error_pass_num}}
                                </div>
                                <div style="margin-left:150px;" class="el-form-item__error" v-if="error_start_seat_num">
                                    {{error_start_seat_num}}
                                </div>
                                <div style="margin-left: 235px;" class="el-form-item__error" v-if="error_end_seat_num">
                                    {{error_end_seat_num}}
                                </div>
                            </el-form-item>
                        </el-tab-pane>
                    </el-tabs>
                    <el-form-item label="行数：" prop="row" required>
                        <div>
                            <integer-input :disabled="!is_picking" :error="!!row_error" v-model="warehouseShelfData.row"
                                           :min="1" :max="9" class="inline width-mini"></integer-input>
                            <span class="red inline width-sm">备注：定义货架的层次</span>
                        </div>
                        <div class="el-form-item__error" v-if="row_error">{{row_error}}</div>
                    </el-form-item>
                    <el-form-item label="对面通道：" prop="face_aisle" v-if="is_picking">
                        <div>
                            <el-input v-model="warehouse_shelf_name" disabled class="inline width-mini"></el-input>
                            <integer-zero-input v-model="warehouseShelfData.face_aisle" :min="0"
                                                class="inline width-mini"></integer-zero-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="" prop="is_auto">
                        <span class="inline">自动生成货位号</span>
                        <el-checkbox v-model="warehouseShelfData.is_auto" style="margin-left: 10px;"></el-checkbox>
                    </el-form-item>
                    <template v-if="warehouseShelfData.is_auto">
                        <el-form-item label="列数：" prop="column" required class=" width-mini">
                            <integer-input :disabled="!is_picking" :error="!!column_error"
                                           v-model="warehouseShelfData.column" :min="0"
                                           class="width-mini"></integer-input>
                            <div class="el-form-item__error" style="width: 200px" v-if="column_error">{{column_error}}
                            </div>
                        </el-form-item>
                        <el-form-item label="SKU品种数：" prop="sku_num" required>
                            <integer-zero-input :disabled="!is_picking" v-model="warehouseShelfData.sku_num" :min="0"
                                                class="width-mini inline"></integer-zero-input>
                            <span class="red" style="width: 180px;">0表示不限制货位存放SKU品种数量</span>
                        </el-form-item>
                    </template>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <request-button :disabled="addEdit" req-key="add_data1" @click="add_data" :timeout="300">确定
                </request-button>
                <el-button size="mini" @click.native="show = false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .error_cargo {
        .el-input__inner {
            border-color: red;
        }
    }

    .color-red {
        .el-input__inner {
            border-color: red;
        }
    }

    .color.c-integer-input {
        .el-input__inner {
            border-color: red;
        }
    }

    .ml-lgs {
        margin-left: 43px;
    }
</style>
<script>
    import {entrepot_picking, api_warehous_lists} from '../../../api/entrepot-picking';
    import {warehouse_area_lists, warehouse_shelf, warehouse_area_class_lists} from '../../../api/warehouse-cargo';
    import {api_edit_warehouse_shelf, api_warehouse_shelf_face_aisle} from '../../../api/warehouse-shelf';

    export default {
        data() {
            let plusNumber = (rule, value, callback) => {
                if (value) {
                    if (Number(value) === 0 || Number(value) >= 10) {
                        return callback(new Error("货架行数为大于0小于10的整数"));
                    }
                } else {
                    callback();
                }
            };
            return {
                show: this.value,
                checked: false,
                addEdit: false,
                is_picking: false,
                activeName: 'first',
                warehouses: [],
                warehouseAreaLists: [],
                cargoClassLists: [],
                warehouse_shelf_name: '',
                error_pass_num: '',
                error_seat_num: '',
                row_error: '',
                column_error: '',
                error_cargo_class: '',
                error_end_seat_num: '',
                error_start_seat_num: '',
                rules: {
                    warehouse_area_id: [
                        {required: true, message: '请选择分区', trigger: 'blur', type: "number"}
                    ],
                    warehouse_id: [
                        {required: true, message: '请选择仓库', trigger: 'blur', type: "number"}
                    ],
                }
            }
        },
        mounted() {
            this.warehouses_init();
            this.error_pass_num = '';
            this.error_seat_num = '';
            this.row_error = '';
            this.column_error = '';
            this.error_cargo_class = '';
            this.error_start_seat_num = '';
            this.error_end_seat_num = '';
        },
        methods: {
            chang_dialog() {
                this.is_picking = false;
                if (this.warehouseShelfData.warehouse_area) {
                    this.warehouse_shelf_name = this.warehouseShelfData.warehouse_area;
                    this.warehouseShelfData.face_aisle = this.warehouseShelfData.face_aisle.replace(`${this.warehouse_shelf_name}`, '');
                } else {
                    this.warehouse_shelf_name = '';
                }
                this.cargoClassLists = [];
                if (this.warehouseShelfData.warehouse_id) {
                    this.warehouse_area_list(this.warehouseShelfData.warehouse_id);
                    this.cargo_class_list(this.warehouseShelfData.warehouse_id);
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
                this.warehouseShelfData.warehouse_area_id = '';
                this.warehouseShelfData.cargo_class_id = '';
                if (val) {
                    this.warehouse_shelf_name = '';
                    this.warehouse_area_list(val);
                    this.cargo_class_list(val);
                }
            },
            change_warehouse_area(val) {
                if (val) {
                    this.is_picking = false;
                    let find = this.warehouseAreaLists.find(res => res.value === val);
                    if (!!find) {
                        console.log("find.is_picking", find.is_picking);
                        this.warehouse_shelf_name = find.code;
                        this.is_picking = find.is_picking;
                        if (!this.is_picking) {
                            this.warehouseShelfData.pass_num = '01';
                            this.warehouseShelfData.seat_num = '1';
                            this.warehouseShelfData.row = '1';
                            this.warehouseShelfData.face_aisle = '';
                            this.warehouseShelfData.column = '1';
                            this.warehouseShelfData.sku_num = '0';
                        } else {
                            this.warehouseShelfData.pass_num = '';
                            this.warehouseShelfData.seat_num = '';
                            this.warehouseShelfData.row = '';
                            this.warehouseShelfData.face_aisle = '';
                            this.warehouseShelfData.column = '';
                            this.warehouseShelfData.sku_num = '1';
                        }

                    }
                }
                if (val && this.warehouseShelfData.pass_num && this.is_picking) {
                    let data = {
                        pass_num: this.warehouseShelfData.pass_num,
                        warehouse_area_id: val,
                    };
                    this.$http(api_warehouse_shelf_face_aisle, data).then(res => {
                        this.warehouseShelfData.face_aisle = res.face_aisle;
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    });
                }
            },
            warehouse_area_list(id) {
                let data = {};
                if (this.editShow) {
                    data = {
                        warehouse_id: id,
                        status: 1,
                    };
                } else {
                    data = {
                        warehouse_id: id,
                        status: 1,
                        list_type: 'shelf'
                    };
                }
                this.$http(warehouse_area_lists, data).then(res => {
                    this.warehouseAreaLists = res.map(row => {
                        return {
                            label: row.name,
                            value: row.id,
                            is_picking: row.is_picking,
                            code: row.code
                        }
                    });
                    let find = this.warehouseAreaLists.find(row => {
                        return row.value === this.warehouseShelfData.warehouse_area_id;
                    });
                    if (!!find) {
                        if (find.is_picking) {
                            this.is_picking = true;
                        } else {
                            this.is_picking = false;
                            console.log('编辑', this.is_picking);
                        }
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            cargo_class_list(id) {
                let data = {
                    status: 1,
                    warehouse_id: id,
                };
                this.$http(warehouse_area_class_lists, data).then(res => {
                    this.cargoClassLists = res.map(item => {
                        return {
                            label: item.name,
                            value: item.id,
                        }
                    })
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            change_pass_num(val) {
                if (val.length === 1) {
                    this.warehouseShelfData.pass_num = `0${this.warehouseShelfData.pass_num}`;
                }
            },
            blur_seat_num(val) {
                if (val === "0") {
                    this.error_seat_num = `货架位置不能为0`;
                    return;
                } else {
                    this.error_seat_num = '';
                }
            },
            blur_start_seat_num(val) {
                if (val === "0") {
                    this.error_start_seat_num = `货架位置不能为0`;
                    return;
                } else {
                    this.error_start_seat_num = '';
                }
            },
            blur_end_seat_num(val) {
                if (val === "0") {
                    this.error_end_seat_num = `货架位置不能为0`;
                    return;
                } else {
                    this.error_end_seat_num = '';
                }
            },
            get_face_aisle_more(val) {
                if (val.length > 2) {
                    this.error_pass_num = `货架通道固定为两位数`;
                    return;
                } else {
                    this.error_pass_num = '';
                }
                if (this.is_picking) {
                    this.get_face_aisle(val);
                }
            },
            get_face_aisle(val) {
                if (val.length > 2) {
                    this.error_pass_num = `货架通道固定为两位数`;
                    return;
                } else {
                    this.error_pass_num = '';
                }
                if (!!val && this.warehouseShelfData.warehouse_area_id && this.is_picking) {
                    let data = {
                        warehouse_area_id: this.warehouseShelfData.warehouse_area_id,
                        pass_num: val,
                    };
                    this.$http(api_warehouse_shelf_face_aisle, data).then(res => {
                        if (this.is_picking) {
                            this.warehouseShelfData.face_aisle = res.face_aisle;
                        } else {
                            this.warehouseShelfData.face_aisle = '';
                        }
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    });
                }
            },
            add_data() {
                if (this.editShow) {
                    this.$refs.ruleForm.validate((valid) => {
                        if (valid) {
                            Object.keys(this.warehouseShelfData).forEach(key => {
                                if(typeof this.warehouseShelfData[key] === 'string') {
                                    this.warehouseShelfData[key] = this.warehouseShelfData[key].trim();
                                }
                            });
                            let data = {
                                id: this.warehouseShelfData.id,
                                code: this.warehouseShelfData.code,
                                warehouse_id: this.warehouseShelfData.warehouse_id,
                                warehouse_area_id: this.warehouseShelfData.warehouse_area_id,
                                status: this.warehouseShelfData.status,
                                rely: this.warehouseShelfData.rely,
                                cargo_class_id: this.warehouseShelfData.cargo_class_id,
                                status: this.warehouseShelfData.status,
                                row: this.warehouseShelfData.row,
                                face_aisle: this.warehouseShelfData.face_aisle,
                            };
                            this.addEdit = true;
                            this.$http(api_edit_warehouse_shelf, this.warehouseShelfData.id, data).then(res => {
                                this.$message({type: 'success', message: res.message || res});
                                this.warehouseShelfData.face_aisle = `${this.warehouse_shelf_name}${this.warehouseShelfData.face_aisle}`;
                                let find = this.cargoClassLists.find(res => {
                                    return res.value === this.warehouseShelfData.cargo_class_id;
                                });
                                if (!!find) {
                                    this.warehouseShelfData.cargo_class = find.label;
                                }
                                this.addEdit = true;
                                this.$emit('edit-update', this.warehouseShelfData);
                            }).catch(code => {
                                this.addEdit = false;
                                this.$message({
                                    type: 'error',
                                    message: code.message || code
                                });
                            }).finally(() => {
                                setTimeout(() => {
                                    this.$reqKey(`add_data1`, false);
                                }, 200);
                            });
                        } else {
                            this.$reqKey(`add_data1`, false);
                            return false;
                        }
                    });

                } else {
                    this.$refs.ruleForm.validate((valid) => {
                        if (valid) {
                            if (this.warehouseShelfData.pass_num === '') {
                                this.error_pass_num = `货架通道不能为空`;
                                return;
                            } else {
                                this.error_pass_num = '';
                            }
                            if (this.warehouseShelfData.row === '') {
                                this.row_error = `货架行数不能为空`;
                                return;
                            } else if (Number(this.warehouseShelfData.row) === 0 || Number(this.warehouseShelfData.row) >= 36) {
                                this.row_error = `货架行数为大于0小于36的整数`;
                                return;
                            } else {
                                this.row_error = '';
                            }
                            if (this.warehouseShelfData.is_auto) {
                                if (this.warehouseShelfData.column === '') {
                                    this.column_error = `货架列数不能为空`;
                                    return;
                                } else if (Number(this.warehouseShelfData.column) === 0 || Number(this.warehouseShelfData.column) >= 36) {
                                    this.column_error = `货架列数为大于0小于36的整数`;
                                    return;
                                } else {
                                    this.column_error = '';
                                }
                                if (this.warehouseShelfData.cargo_class_id === '') {
                                    this.error_cargo_class = `货位类型不能为空`;
                                    return;
                                } else {
                                    this.error_cargo_class = '';
                                }
                            }
                            if (this.activeName === 'first') {
                                if (this.warehouseShelfData.seat_num === '') {
                                    this.error_seat_num = `货架位置不能为空`;
                                    return;
                                } else {
                                    this.error_seat_num = '';
                                }
                                this.warehouseShelfData.add_type = 1;
                            } else {
                                this.warehouseShelfData.add_type = 2;
                            }
                            console.log(this.warehouseShelfData);
                            this.addEdit = true;
                            this.$emit('add-data', this.warehouseShelfData);
                            // return Promise.resolve();
                        } else {
                            return false;
                        }
                    });
                }
            }
        },
        watch: {
            value(val) {
                this.show = val;
                this.addEdit = false;
                this.activeName = 'first';
            },
            show(val) {
                this.$emit('input', val);
            }
        },
        filters: {
            statusFilter(val) {
                return val ? `启用` : `禁用`;
            }
        },
        props: {
            value: {},
            editShow: {},
            title: {},
            warehouseShelfData: {},
        },
        components: {
            pageDialog: require("../../../components/page-dialog.vue").default,
            uiLimitNumber: require('../../../components/ui-limit-number.vue').default,
            integerZeroInput: require('../../../components/integer-zero-input.vue').default,
            integerInput: require('../../../components/integer-input.vue').default,
            uiSelect: require('../../../components/ui-select.vue').default,
            requestButton: require('../../../global-components/request-button.vue').default,
        }
    }
</script>

