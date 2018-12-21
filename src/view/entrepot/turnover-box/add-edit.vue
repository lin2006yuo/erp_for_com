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
            <el-form-item label="类型：" required prop="type">
                <el-radio v-model="editData.type" :label="1">单品</el-radio>
                <el-radio v-model="editData.type" :label="2">多品</el-radio>
                <el-radio v-model="editData.type" :label="3">上架</el-radio>
            </el-form-item>
            <el-form-item label="数量：" required>
                <integer-input type="text"
                               v-model="editData.num"
                               class="width-mini inline">
                </integer-input>
            </el-form-item>
            <el-form-item label="颜色：" required prop="color">
                <el-input type="text" v-model="editData.color" class="width-lg"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <request-button req-key="apiAddEdit3" @click="save">确定</request-button>
            <el-button @click.native="visible = false" size="mini">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_add_turnover, entrepot_picking} from '@/api/turnover-box'

    export default {
        data() {
            return {
                warehouses: [],
                rules: {
                    warehouse_id: [
                        {required: true, message: '请选择仓库', trigger: 'change', type: 'number'}
                    ],
                    type: [
                        {required: true, message: '请选择箱号类型', trigger: 'change', type: 'number'}
                    ],
                    start_num: [
                        {required: true, message: '请选择输入周转箱号起始值', trigger: 'blur', type: 'string'}
                    ],
                    end_num: [
                        {required: true, message: '请选择输入周转箱号结束值', trigger: 'blur', type: 'string'}
                    ],
                    color: [
                        {required: true, message: '请选择输入周转箱箱子颜色', trigger: 'blur', type: 'string'}
                    ],
                    status: [
                        {required: true, message: '请选择周转箱状态', trigger: 'change', type: 'number'}
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
                        typeof this.editData.color === 'string' && (this.editData.color = this.editData.color.trim());
                        let data = window.clone(this.editData);
                        if (this.action.value === 'add') {
                            this.$http(api_add_turnover, data).then(res => {
                                this.newData = res.data;
                                this.$emit('newData', this.newData);
                                this.$message({type: "success", message: res.message || res});
                                this.visible = false;
                            }).catch(code => {
                                this.$message({type: "error", message: code.message || code});
                            }).finally(() => {
                                setTimeout(() => {
                                    this.$reqKey(`apiAddEdit3`, false);
                                }, 200);
                            });
                        }
                    } else {
                        this.$message({type: "error", message: "信息未填写完整！"});
                        this.$reqKey(`apiAddEdit3`, false);
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
