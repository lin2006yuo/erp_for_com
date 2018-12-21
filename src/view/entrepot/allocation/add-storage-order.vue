<template>
    <page-dialog :title="storageAction.title"
                 size="large"
                 v-model="visible"
                 class="p-transfer-plan"
                 :close-on-click-modal="false">
        <label-item label="仓库：">
            <el-select v-model="storageData.warehouse_id" class="width-sm" disabled>
                <el-option v-for="(item, index) in warehouse"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item :label="`${storageAction.mean}库类型：`" class="ml-sm">
            <el-select v-model="storageData.warehouse_type" class="width-sm" disabled>
                <el-option v-for="(item, index) in typeList"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="来源单据：" class="ml-sm">
            <el-input v-model="storageData.order_code" disabled></el-input>
        </label-item>
        <div class="fr blue">
            小提示：填写{{storageAction.mean}}库时按下PageUp或PageDown可以上下切换哟~
        </div>
        <el-table :data="storageData.sku_list"
                  height="400"
                  v-for="item in list"
                  :key="item"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  class="scroll-bar mt-sm mb-sm"
                  highlight-current-row>
            <el-table-column
                    inline-template
                    label="SKU">
                <div>
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    v-if="storageData.is_third"
                    inline-template
                    label="第三方SKU">
                <div>
                    <ui-tip :content="row.third_sku" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="商品名称">
                <div>
                    {{row.goods_name}}
                </div>
            </el-table-column>
            <el-table-column
                    width="50"
                    label="图片">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            trigger="hover">
                        <img :src="scope.row.thumb" width="150px" height="150px">
                        <span slot="reference">
                                    <img :src="scope.row.thumb" v-if="scope.row.thumb" height="26px" width="26px"
                                         style="border:none;vertical-align: middle">
                                </span>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="单价">
                <div>
                    <ui-tip :content="row.packing_time" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    v-if="isSend"
                    label="总数量">
                <div>
                    <ui-tip :content="row.quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    v-if="!isSend"
                    label="待入库数量">
                <div>
                    <ui-tip :content="row.wait_in_qty" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="120"
                    :label="`${storageAction.mean}库数量`">
                <div>
                    <integer-input v-model="row.number"
                                   :min="0"
                                   ref="quantity"
                                   @key-updown="key_updown($event, $index)"
                                   @focus="focus($index)"
                                   class="width-xs"
                                   :class="iswarningborder(row)">
                    </integer-input>
                </div>
            </el-table-column>
        </el-table>
        <span class="inline mb-sm">备注：</span>
        <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="storageData.remark">
        </el-input>
        <div slot="footer" class="dialog-footer">
            <el-button @click="saveAdd" type="primary" size="mini">保 存</el-button>
            <el-button @click="visible = false" size="mini">取 消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-transfer-plan {
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
    import {api_warehouse_get, api_post_deliver, api_post_entry} from '@/api/transfer-plan'

    export default {
        data() {
            return {
                list: [1],
                warehouse: [],
                typeList: [
                    {label: '调拨入库', value: 1},
                    {label: '调拨出库', value: 2}
                ],
                visible: false,
                loading: false
            }
        },
        mounted() {
            this.init_warehouse();
        },
        methods: {
            init_warehouse() {
                this.$http(api_warehouse_get).then(res => {
                    this.warehouse = res;
                    this.select_out_warehouse = clone(this.warehouse);
                    this.select_in_warehouse = clone(this.warehouse);
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        type: "warning",
                        message: code.message || code
                    });
                })
            },
            saveAdd() {
                this.$confirm(`您将生成${this.storageAction.mean}库单,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (this.isSend) {
                        let data = this.storageData.sku_list.map(row => {
                            return {id: row.id, send_qty: row.number}
                        });
                        this.$http(api_post_deliver, this.storageAction.id, {sku_list: data}).then(res => {
                            this.$emit('storage', this.storageAction);
                            this.$message({type: "success", message: res.message || res});
                            this.visible = false;
                        }).catch(code => {
                            this.$message({type: "error", message: code.message || code});
                        })
                    } else {
                        let data = this.storageData.sku_list.map(row => {
                            return {id: row.id, in_qty: row.number}
                        });
                        this.$http(api_post_entry, this.storageAction.id, {sku_list: data}).then(res => {
                            this.$emit('storage', this.storageAction);
                            this.$message({type: "success", message: res.message || res});
                            this.visible = false;
                        }).catch(code => {
                            this.$message({type: "error", message: code.message || code});
                        })
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            iswarningborder(row) {
                if (this.isSend) {
                    return {'warningborder': row.number > row.quantity}

                } else {
                    return {'warningborder': row.number > row.send_qty}
                }
            },
            focus(index) {
                this.$refs.quantity[index].$refs.input.select();
            },
            key_updown(ev, index) {
                if (ev.keyCode === 34) {
                    if (!!this.$refs.quantity[index + 1]) {
                        this.$refs.quantity[index + 1].$refs.input.select();
                    }
                } else if (ev.keyCode === 33) {
                    if (!!this.$refs.quantity[index - 1]) {
                        this.$refs.quantity[index - 1].$refs.input.select();
                    }
                }
            }
        },
        computed: {
            isSend() {
                return this.storageAction.mean === '出';
            },
            isLook() {
                return this.storageAction.value = 'look';
            }
        },
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
            storageData: {},
            storageAction: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
        },
    }
</script>
