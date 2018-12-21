<template>
    <div class="c-add-edit">
        <page-dialog v-model="show" :title="title" size="small" :close-on-click-modal="false">
            <el-form label-position="right" label-width="180px" :model="warehouseData" :rules="rules" ref="ruleForm">
                <el-form-item label="仓库：" prop="warehouse_id" required>
                    <span v-if="!edit">{{warehouseData.warehouse}}</span>
                    <span v-else>
                            <el-select v-model="warehouseData.warehouse_id" disabled class="inline" style="width: 152px;">
                            <el-option
                                    :key="item.value"
                                    v-for="item in warehouses"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </span>
                </el-form-item>
                <el-form-item label="分区code：" prop="code">
                    <span v-if="!edit">{{warehouseData.code}}</span>
                    <span v-else>
                        <el-input :disabled="!!editId" v-model="warehouseData.code" class="inline"></el-input>
                    </span>
                </el-form-item>
                <el-form-item label="分区名称：" prop="name" required>
                    <span v-if="!edit">{{warehouseData.name}}</span>
                    <span v-else>
                        <el-input v-model="warehouseData.name" class="inline"></el-input>
                    </span>
                </el-form-item>
                <el-form-item label="分区功能：" prop="warehouse_area_type" required>
                    <span v-if="!edit">{{warehouseData.type_text}}</span>
                    <span v-else>
                           <el-select v-model="warehouseData.warehouse_area_type" :disabled="!!editId" class="inline"
                                      style="width: 152px;">
                            <el-option
                                    :key="item.value"
                                    v-for="item in appTypeData"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </span>
                </el-form-item>
                <el-form-item label="分区排序：" prop="sort">
                    <span v-if="!edit">{{warehouseData.sort}}</span>
                    <span v-else>
                           <integer-input v-model="warehouseData.sort" :min="0" class="inline"></integer-input>
                    </span>
                </el-form-item>
                <el-form-item label="楼层：" prop="floor_id">
                    <span v-if="!edit">{{warehouseData.floor_id}}</span>
                    <span v-else>
                          <integer-input v-model="warehouseData.floor_id" :min="0" class="inline"></integer-input>
                    </span>
                </el-form-item>
                <el-form-item label="描述：" prop="description">
                    <span v-if="!edit">{{warehouseData.description}}</span>
                    <span v-else>
                        <el-input type="textarea" placeholder="请输入内容" :autosize="{ minRows: 4, maxRows: 4}"
                                  v-model="warehouseData.description" class="inline width-super"></el-input>
                    </span>
                </el-form-item>
                <el-form-item label="管理员：" prop="description">
                    <span v-if="!edit">{{warehouseData.operator}}</span>
                    <span v-else>
                         <el-select class="inline mr-sm width-super"
                                    v-model="warehouseData.operator_ids"
                                    multiple
                                    filterable
                                    :class="[warehouseData.operator_ids.length > 0 ? input_nomargin : '']"
                                    placeholder="请选择">
                            <el-option
                                    v-for="item in warehouseStaffs"
                                    :key="item.id"
                                    :label="item.realname"
                                    :value="item.id">
                            </el-option>
                         </el-select>
                    </span>
                </el-form-item>
                <el-form-item label="绑定分类：">
                    <el-button v-if="edit" type="primary" size="mini" class="inline" @click="category_show">选择分类
                    </el-button>
                    <span class="nodes">
                        <span v-for="item in warehouseData.category_lists" :key="item">
                           <span class="block-type">{{item}}</span>
                        </span>
                    </span>
                </el-form-item>
                <el-form-item label="分区状态：" prop="status">
                    <span v-if="!edit">{{warehouseData.status | statusFilter}}</span>
                    <span v-else>
                           <el-radio-group v-model="warehouseData.status">
                            <el-radio :label="0">禁用</el-radio>
                            <el-radio :label="1">启用</el-radio>
                        </el-radio-group>
                    </span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div v-if="!edit">
                    <el-button size="mini" @click.native="show = false">关闭</el-button>
                </div>
                <div v-else>
                    <request-button :request="add_data">确定</request-button>
                    <el-button size="mini" @click.native="show = false">取消</el-button>
                </div>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .nodes {
        width: 200px;
        max-height: 210px;
        display: block;
        overflow-y: auto;
        margin-top: 10px;
    }

    .c-add-edit {
        .el-select__tags {
            height: 30px !important;
            max-width: 168.5px !important;
            width: 208px;
            overflow-y: auto;
            > span {
                white-space: inherit;
            }
        }
    }

    .input-nomargin {
        .el-select__input {
            width: 1px !important;
            margin-left: 0 !important;
        }
    }

   
</style>
<script>
    import {api_warehouse_staffs} from '../../../api/warehouse-cargo';

    export default {
        data() {
            let checkcode = (rule, value, callback) => {
                let check = /^[a-zA-Z\d]+$/;
                setTimeout(() => {
                    if (check.test(value)) {
                        callback();
                    } else {
                        callback(new Error('请输入英文或数字！'));
                    }
                });
            };
            return {
                show: this.value,
                rules: {
                    code: [
                        {required: true, message: '请输入分区编码', trigger: 'blur'},
                        {validator: checkcode, trigger: 'blur'}
                    ],
                    warehouse_id: [
                        {required: true, message: '请输入分区仓库', trigger: 'blur', type: "number"}
                    ],
                    warehouse_area_type: [
                        {required: true, message: '请输入分区类型', trigger: 'blur', type: "number"}
                    ],
                    name: [
                        {required: true, message: '请输入分区名称', trigger: 'blur'}
                    ],
                },
                warehouseStaffs: [],
                input_nomargin: "input-nomargin",
            }
        },
        created() {
            this.$http(api_warehouse_staffs).then(res => {
                this.warehouseStaffs = res;
            }).catch(code => {
                this.$message({type: 'error', message: code.message || code});
            })
        },
        methods: {
            category_show() {
                if (this.editId) {
                    this.$emit('category-show', this.warehouseData.category_ids);
                } else {
                    this.$emit('category-show', '');
                }
            },
            add_data() {
                return this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        Object.keys(this.warehouseData).forEach(key => {
                            if(typeof this.warehouseData[key] === 'string') {
                                this.warehouseData[key] = this.warehouseData[key].trim();
                            }
                        });
                        if (this.editId) {
                            this.$emit('update-data', this.warehouseData, this.editId);
                        } else {
                            this.$emit('add-data', this.warehouseData);
                        }
                    } else {
                        return false;
                    }
                });
            },

        },
        filters: {
            statusFilter(val) {
                return val ? `启用` : `禁用`;
            },
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.$emit("input", val);
            },
        },
        props: {
            value: {},
            title: {},
            edit: {},
            editId: {},
            warehouseData: {},
            appTypeData: {},
            warehouses: {},
        },
        components: {
            pageDialog: require("../../../components/page-dialog.vue").default,
            integerInput: require('../../../components/integer-input.vue').default,
            warehouseStaffs: require('../../../api-components/warehouse-staffs.vue').default,
            requestButton: require('../../../global-components/request-button.vue').default,
        }
    }
</script>

