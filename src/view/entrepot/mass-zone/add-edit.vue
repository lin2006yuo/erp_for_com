<template>
    <page-dialog :title="action.title"
                 size="small"
                 v-model="visible"
                 :close-on-click-modal="false">
        <el-form :model="editData" :rules="rules" ref="editForm" label-width="200px">
            <el-form-item label="仓库：" required prop="warehouse_id">
                <el-select v-model="editData.warehouse_id" class="width-lg" disabled>
                    <el-option v-for="item in warehouses"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="集结区号：" required>
                <el-col :span="6">
                    <el-form-item prop="start_num">
                        <integer-input type="text"
                                       :min="0"
                                       v-model="editData.start_num"
                                       class="width-mini inline">
                        </integer-input>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="2"> 至</el-col>
                <el-col :span="11">
                    <el-form-item prop="end_num">
                        <el-input type="text"
                                  v-model="editData.end_num"
                                  class="width-mini inline">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <request-button @click="save" req-key="apiAddEdit2">确定</request-button>
            <el-button @click.native="visible = false" size="mini">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {entrepot_picking} from '../../../api/turnover-box'
    import {api_add_mass} from '../../../api/mass-zone'

    export default {
        data() {
            return {
                warehouses: [],
                rules: {
                    warehouse_id: [
                        {required: true, message: '请选择仓库', trigger: 'change', type: 'number'}
                    ],
                    start_num: [
                        {required: true, message: '请选择输入周转箱号起始值', trigger: 'blur', type: 'string'}
                    ],
                    end_num: [
                        {required: true, message: '请选择输入周转箱号结束值', trigger: 'blur', type: 'string'}
                    ],
                },
                visible: false,
                newData: {}
            }
        },
        mounted() {
            this.init_warehouse();
        },
        methods: {
            init_warehouse() {
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            save() {
                return this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        let data = window.clone(this.editData);
                        if (this.action.value === 'add') {
                            this.$http(api_add_mass, data).then(res => {
                                this.newData = res.data;
                                this.$emit('newData', this.newData);
                                this.$message({type: "success", message: res.message || res});
                                this.visible = false;
                            }).catch(code => {
                                this.$message({type: "error", message: code.message || code});
                            }).finally(() => {
                                setTimeout(() => {
                                    this.$reqKey(`apiAddEdit2`, false);
                                }, 200);
                            });
                        }
                    } else {
                        this.$message({type: "error", message: "信息未填写完整！"});
                        this.$reqKey(`apiAddEdit2`, false);
                        return false;
                    }
                });
            }
        },
        computed: {},
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value: {},
            action: {},
            editData: {},
            searchData: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
        },
    }
</script>
