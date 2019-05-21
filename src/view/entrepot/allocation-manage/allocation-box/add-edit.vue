<!--suppress ALL -->
<template>
    <page-dialog class="c-allocation-box-add" v-model="visible" @open="open" @close="close" :title="trendAction.title">
        <el-form :model="editData" :rules="rules" ref="editForm" label-width="200px">
            <el-form-item label="长：" prop="length" required>
                <integer-input v-model.number="editData.length" :limit="0" :min="0"
                               class="inline w-input"></integer-input>
                <span>cm</span>
            </el-form-item>
            <el-form-item label="宽：" prop="width" required>
                <integer-input v-model.number="editData.width" :min="0"
                               class="inline w-input"></integer-input>
                <span>cm</span>
            </el-form-item>
            <el-form-item label="高：" prop="height" required>
                <integer-input v-model.number="editData.height" :min="0"
                               class="inline w-input"></integer-input>
                <span>cm</span>
            </el-form-item>
            <el-form-item label="仓库：" prop="warehouse_id" required>
                <el-select v-model="editData.warehouse_id" disabled class="inline w-input">
                    <el-option
                            :key="item.value"
                            v-for="item in warehouseList"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态：" prop="status">
                <el-radio-group v-model="editData.status">
                    <el-radio :label="0">禁用</el-radio>
                    <el-radio :label="1">启用</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <permission tag="requestButton" size="mini"
                        v-if="trendAction.type === 'add'"
                        req-key="api_allocation_box_add"
                        @click="sure"
                        :route="apis.url_allocation_box_add">确定
            </permission>
            <permission tag="requestButton" size="mini"
                        v-if="trendAction.type === 'edit'"
                        req-key="api_allocation_box_add"
                        @click="sure"
                        :route="apis.url_allocation_box_edit">确定
            </permission>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-allocation-box-add {
        .w-input {
            width: 152px;
        }
    }
</style>
<script>
    import {
        api_allocation_box_add,
        url_allocation_box_add,
        api_allocation_box_edit,
        url_allocation_box_edit
    } from "@/api/allocation-box";

    export default {
        permission: {
            url_allocation_box_add,
            url_allocation_box_edit
        },
        data() {
            return {
                visible: this.value,
                rules: {
                    warehouse_id: [
                        {required: true, message: '请选择仓库', trigger: 'change', type: 'number'}
                    ],
                    status: [
                        {
                            required: true, message: '请选择箱子状态',
                            trigger: 'change', type: 'number'
                        }
                    ],
                    length: [
                        {
                            required: true, message: '请输入箱子长度',
                            min: 0, max: 999,
                            trigger: 'blur', type: 'number'
                        }
                    ],
                    width: [
                        {
                            required: true, message: '请输入箱子宽度',
                            min: 0, max: 999,
                            trigger: 'blur', type: 'number'
                        }
                    ],
                    height: [
                        {
                            required: true, message: '请输入箱子高度',
                            min: 0, max: 999,
                            trigger: 'blur', type: 'number'
                        }
                    ],
                },
            }
        },
        methods: {
            open() {

            },
            sure() {
                Object.keys(this.editData).forEach(key => {
                    if (typeof this.editData[key] === 'string') {
                        this.editData[key] = this.editData[key].trim();
                    }
                });
                return this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.editData.length = parseInt(this.editData.length);
                        this.editData.width = parseInt(this.editData.width);
                        this.editData.height = parseInt(this.editData.height);
                        if (this.trendAction.type === 'add') {
                            this.add();
                        } else {
                            this.edit();
                        }
                    } else {
                        this.$reqKey('api_allocation_box_add', false);
                        return false;
                    }
                });
            },
            add() {
                this.$http(api_allocation_box_add, this.editData).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit('search');
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.$reqKey('api_allocation_box_add', false);
                });
            },
            edit() {
                this.$http(api_allocation_box_edit, this.trendAction.id, this.editData).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit('search');
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.$reqKey('api_allocation_box_add', false);
                });
            },
            close() {
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
            trendAction: {},
            editData: {},
            warehouseList: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
        }
    }
</script>