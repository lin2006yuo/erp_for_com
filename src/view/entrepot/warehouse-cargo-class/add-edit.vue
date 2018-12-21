<template>
    <div class="c-add-edit">
        <page-dialog v-model="show" :title='title' class="add-classify" size="small" :close-on-click-modal="false">
            <el-form label-position="right" label-width="200px" :model="warehouseCargoClassData" :rules="rules"
                     ref="ruleForm">
                <el-form-item label="货位类型名称：" prop="name" required>
                    <span v-if="!edit">{{warehouseCargoClassData.name}}</span>
                    <span v-else>
                        <el-input v-model="warehouseCargoClassData.name" class="inline"></el-input>
                    </span>
                </el-form-item>
                <el-form-item label="货位类型编码：" prop="code" required>
                    <span v-if="!edit">{{warehouseCargoClassData.code}}</span>
                    <span v-else>
                        <el-input v-model="warehouseCargoClassData.code" class="inline"></el-input>
                    </span>
                </el-form-item>
                <el-form-item label="仓库：" prop="warehouse_id" required>
                    <span v-if="!edit">{{warehouseCargoClassData.warehouse}}</span>
                    <span v-else>
                            <el-select v-model="warehouseCargoClassData.warehouse_id" disabled class="inline w-input">
                            <el-option
                                    :key="item.value"
                                    v-for="item in warehouses"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </span>
                </el-form-item>
                <el-form-item label="长：" prop="length" required>
                    <span v-if="!edit">{{warehouseCargoClassData.length}}</span>
                    <span v-else>
                        <integer-input v-model="warehouseCargoClassData.length" :limit="0" :min="0"
                                       class="inline w-input"></integer-input>
                    </span>
                    <span>cm</span>
                </el-form-item>
                <el-form-item label="宽：" prop="width" required>
                    <span v-if="!edit">{{warehouseCargoClassData.width}}</span>
                    <span v-else>
                        <integer-input v-model="warehouseCargoClassData.width" :min="0"
                                       class="inline w-input"></integer-input>
                    </span>
                    <span>cm</span>
                </el-form-item>
                <el-form-item label="高：" prop="height" required>
                    <span v-if="!edit">{{warehouseCargoClassData.height}}</span>
                    <span v-else>
                        <integer-input v-model="warehouseCargoClassData.height" :min="0"
                                       class="inline w-input"></integer-input>
                    </span>
                    <span>cm</span>
                </el-form-item>
                <el-form-item label="存放单品最大体积：" prop="max_volume" required>
                    <span v-if="!edit">{{warehouseCargoClassData.max_volume}}</span>
                    <span v-else>
                        <integer-input v-model="warehouseCargoClassData.max_volume" :max="maxVolume" :min="0"
                                       class="inline w-input"></integer-input>
                    </span>
                    <span>cm3</span>
                </el-form-item>
                <el-form-item label="体积利用率：" prop="rate" required>
                    <span v-if="!edit">{{warehouseCargoClassData.rate}}</span>
                    <span v-else>
                        <integer-input v-model="warehouseCargoClassData.rate" :limit="2" :min="0" :max="1"
                                       class="inline w-input"></integer-input>
                    </span>
                    <span class="red">备注:默认为1，表示利用率100%</span>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <span v-if="!edit">{{warehouseCargoClassData.status | statusFilter}}</span>
                    <span v-else>
                           <el-radio-group v-model="warehouseCargoClassData.status">
                            <el-radio :label="0">禁用</el-radio>
                            <el-radio :label="1">启用</el-radio>
                        </el-radio-group>
                    </span>
                </el-form-item>
                <el-form-item label="描述：" prop="description">
                    <span v-if="!edit">{{warehouseCargoClassData.description}}</span>
                    <span v-else>
                           <el-input style="width: 152px;" type="textarea" placeholder="请输入内容"
                                     :autosize="{ minRows: 2, maxRows: 4}" v-model="warehouseCargoClassData.description"
                                     class="inline"></el-input>
                    </span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div v-if="!edit">
                    <el-button size="mini" @click.native="show = false">关闭</el-button>
                </div>
                <div v-else>
                    <request-button :request="add_data">保存</request-button>
                    <el-button size="mini" @click.native="show = false">取消</el-button>
                </div>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .w-input {
        width: 152px;
    }
</style>
<script>

    export default {
        data() {
            let checkcode = (rule, value, callback) => {
                let check = /^[a-zA-Z\d_-]+$/;
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
                        {required: true, message: '请输入货位类型编码', trigger: 'blur'},
                        {validator: checkcode, trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入货位类型名称', trigger: 'blur'}
                    ],
                    length: [
                        {required: true, message: '请输入长', trigger: 'blur'}
                    ],
                    width: [
                        {required: true, message: '请输入宽', trigger: 'blur'}
                    ],
                    height: [
                        {required: true, message: '请输入高', trigger: 'blur'}
                    ],
                    max_volume: [
                        {required: true, message: '允许存放最大体积', trigger: 'blur'}
                    ],
                    rate: [
                        {required: true, message: '体积利用率', trigger: 'blur'}
                    ],
                    warehouse_id: [
                        {required: true, message: '请输入仓库', trigger: 'blur', type: "number"}
                    ],
                }
            }
        },
        methods: {
            add_data() {
                if (!!this.warehouseCargoClassData.max_volume) {
                    let num = this.warehouseCargoClassData.length * this.warehouseCargoClassData.width * this.warehouseCargoClassData.height;
                    if (this.warehouseCargoClassData.max_volume > num) {
                        this.warehouseCargoClassData.max_volume = num;
                    }
                }
                return this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        Object.keys(this.warehouseCargoClassData).forEach(key => {
                            if (typeof this.warehouseCargoClassData[key] === 'string') {
                                this.warehouseCargoClassData[key] = this.warehouseCargoClassData[key].trim();
                            }
                        });
                        if (this.editId) {
                            this.$emit('update-data', this.warehouseCargoClassData, this.editId);
                        } else {
                            this.$emit('add-data', this.warehouseCargoClassData);
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.$emit('input', val);
            }
        },
        computed: {
            maxVolume() {
                let data = this.warehouseCargoClassData;
                if (data.length && data.width && data.height) {
                    return data.length * data.width * data.height;
                } else {
                    return 0;
                }
            }
        },
        filters: {
            statusFilter(val) {
                return val ? `启用` : `禁用`;
            }
        },
        props: {
            value: {},
            title: {},
            warehouseCargoClassData: {},
            edit: {},
            editId: {},
            warehouses: {},
        },
        components: {
            pageDialog: require("../../../components/page-dialog.vue").default,
            integerInput: require('../../../components/integer-input.vue').default,
            requestButton: require('../../../global-components/request-button.vue').default,
        }
    }
</script>

