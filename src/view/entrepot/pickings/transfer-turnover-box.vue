<template>
    <page-dialog v-model="visible" size="large" @open="open" @close="close" title="转移周转箱">
        <el-row class="mb-xs">
            <label-item class="inline" label="原周转箱：">
                <el-select class="s-width-default"
                           @change="select_from_turnover"
                           v-model="from_turnover_box_id">
                    <el-option v-for="item in fromBoxList"
                               :label="item.label"
                               :value="item.value"
                               :disabled="item.disabled"
                               :key="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item class="inline ml-sm" label="目标周转箱：">
                <el-select class="s-width-default"
                           @change="select_to_turnover"
                           v-model="to_turnover_box_id">
                    <el-option v-for="item in toBoxList"
                               :label="item.label"
                               :value="item.value"
                               :disabled="item.disabled"
                               :key="item.value"></el-option>
                </el-select>
            </label-item>
        </el-row>
        <el-table :data="tableData"
                  ref="table"
                  class="scroll-bar"
                  v-resize="{height: 150}"
                  border
                  v-loading="loading"
                  @selection-change="select"
                  element-loading-text="玩命加载中..."
                  highlight-current-row>
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="SKU/别名" inline-template>
                <div>
                    <div>
                        {{row.sku}}
                    </div>
                    <div v-for="item in row.sku_alias">{{item || `--`}}</div>
                </div>
            </el-table-column>
            <el-table-column label="未包装数" inline-template>
                <div>
                    {{row.waiting_quantity}}
                </div>
            </el-table-column>
            <el-table-column label="转移数量" inline-template align="center">
                <integer-input v-model="row.quantity"
                               class="s-width-default inline"
                               :min="1">
                </integer-input>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <permission tag="requestButton" req-key="api_transfer_turnover" :route="apis.url_transfer_turnover"
                        @click.native="sure">
                保存
            </permission>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_transfer_turnover,
        api_goods_by_turnover,
        url_transfer_turnover,
    } from "@/api/pickings";

    export default {
        permission: {
            url_transfer_turnover,
        },
        data() {
            return {
                visible: false,
                fromBoxList: [],
                toBoxList: [],
                from_turnover_box_id: '',
                to_turnover_box_id: '',
                tableData: [],
                selectData: [],
                loading: false,
            }
        },
        methods: {
            open() {
                let data = clone(this.boxList).map(row => {
                    return {
                        label: row,
                        value: row,
                        disabled: false,
                    }
                });
                this.fromBoxList = clone(data);
                this.toBoxList = clone(data);
            },
            select(selection) {
                this.selectData = selection;
            },
            select_from_turnover() {
                this.to_turnover_box_id && this.get_goods();
                this.toBoxList.forEach(row => {
                    if (row.value === this.from_turnover_box_id) {
                        row.disabled = true;
                    } else {
                        row.disabled = false;
                    }
                })
            },
            select_to_turnover() {
                this.from_turnover_box_id && this.tableData.length === 0 && this.get_goods();
                this.fromBoxList.forEach(row => {
                    if (row.value === this.to_turnover_box_id) {
                        row.disabled = true;
                    } else {
                        row.disabled = false;
                    }
                })
            },
            get_goods() {
                this.tableData = [];
                this.selectData = [];
                this.$http(api_goods_by_turnover, this.transferInfo.id, {
                    turnover_id: this.from_turnover_box_id
                }).then(res => {
                    this.tableData = res.detail;
                    this.tableData.forEach(row => {
                        this.$set(row, 'quantity', Number(row.waiting_quantity));
                        this.$nextTick(() => {
                            this.$refs.table.toggleRowSelection(row, true);
                        });
                    })
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            sure() {
                if (!this.validate()) {
                    this.$reqKey('api_transfer_turnover', false);
                    return;
                }
                let data = {
                    turnover_id: this.from_turnover_box_id,
                    target_turnover_id: this.to_turnover_box_id,
                    detail: this.selectData.map(row => {
                        return {
                            sku_id: row.sku_id,
                            quantity: row.quantity,
                        };
                    }),
                };
                this.$http(api_transfer_turnover, this.transferInfo.id, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_transfer_turnover', false);
                    }, 200);
                })
            },
            validate() {
                if(this.selectData.length === 0) {
                    this.$message({type: 'error', message: '请选择需要转移的商品'});
                    return false;
                }
                if (this.from_turnover_box_id === '') {
                    this.$message({type: 'error', message: '请选择原周转箱'});
                    return false;
                }
                if (this.to_turnover_box_id === '') {
                    this.$message({type: 'error', message: '请选择目标周转箱'});
                    return false;
                }
                return !this.selectData.some(row => {
                    row.quantity = Number(row.quantity);
                    if (isNaN(row.quantity) || row.quantity < 1 || row.quantity > Number(row.waiting_quantity)) {
                        this.$message({type: 'error', message: `SKU:${row.sku}的转移数量为无效输入`});
                        return true;
                    }
                    return false;
                });
            },
            close() {
                this.from_turnover_box_id = '';
                this.to_turnover_box_id = '';
                this.tableData = [];
                this.selectData = [];
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
            transferInfo: {},
            boxList: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
        }
    }
</script>