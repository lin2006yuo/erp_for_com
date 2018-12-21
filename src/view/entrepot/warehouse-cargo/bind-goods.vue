<template>
    <page-dialog class="p-bind-goods" @close="close" title="绑定货位" v-model="visible" size="small"
                 :close-on-click-modal="false">
        <div class="mb-sm">
            <label-item label="仓库：" label-width="200">
                <el-select v-model="warehouse" class="inline width-sm" disabled>
                    <el-option
                            :key="item.value"
                            v-for="item in warehouses"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </div>
        <div class="mb-sm">
            <label-item label="分区功能：" label-width="200">
                <el-select v-model="warehouse_area_type" filterable class="inline width-sm" @change="changeType">
                    <el-option
                            :key="item.value"
                            v-for="item in appTypeList"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </div>
        <div class="mb-sm">
            <label-item label="需要绑定的sku：" label-width="200">
                <order-input v-model="sku"
                             class="inline width-super"
                             @keydown="query"
                             placeholder="可批量搜索，Shift+回车换行...">
                </order-input>
            </label-item>
        </div>
        <div class="mb-sm">
            <label-item label=" " label-width="200" v-if="!isManual">
                <request-button req-key="manual_bind" @click="manual_bind">手动绑定</request-button>
                <request-button req-key='auto_bind' @click="auto_bind">自动绑定</request-button>
            </label-item>
            <label-item label="货位：" label-width="200" v-else>
                <ui-autocomplete
                        class="inline mb-mini"
                        v-model="cargo"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入内容"
                ></ui-autocomplete>
            </label-item>
        </div>
        <div class="mb-sm">
            <label-item label=" " label-width="200" v-if="isManual">
                <el-button type="primary" size="mini" @click="query">确定</el-button>
                <el-button type="primary" size="mini" @click="cancel">取消</el-button>
            </label-item>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" class="mr-sm" @click.native="visible=false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-bind-goods {
        .dialog__body {
            min-height: 200px;
        }
    }
</style>
<script>
    import {api_warehous_lists} from '@/api/entrepot-picking';
    import {
        api_get_cargo,
        api_warehouse_area_app_types,
        api_bind_cargo,
        api_post_cargo
    } from '@/api/warehouse-cargo';

    export default {
        data() {
            return {
                sku: '',
                cargo: '',
                cargoList: [],
                visible: this.value,
                isManual: false,
                warehouses: [],
                appTypeList: [],
                warehouse_area_type: 11
            }
        },
        mounted() {
            this.warehouses_init();
            this.warehouse_area_app_types();
        },
        methods: {
            close() {
                this.isManual = false;
                this.warehouse_area_type = 11;
                this.cargo = '';
                this.sku = '';
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
            warehouse_area_app_types() {
                this.appTypeList = [];
                this.$http(api_warehouse_area_app_types).then(res => {
                    res.forEach(row => {
                        if (row.value !== 0) {
                            this.appTypeList.push(row);
                        }
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            changeType() {
                if (this.isManual) {
                    this.manual_bind();
                }
            },
            manual_bind() {
                let cur = this.sku.split('\n').filter(row => !!row);
                let skuList = cur.map(row => {
                    return row.trim();
                });
                if (skuList.length <= 0 || this.warehouse_area_type === '') {
                    this.$message({type: "warning", message: '请输入sku并选择分区功能'});
                    this.$reqKey(`manual_bind`, false);
                    return false;
                }
                let data = {
                    warehouse_id: this.warehouse,
                    sku: skuList,
                    warehouse_area_type: this.warehouse_area_type,
                    appoint_cargo_ids: this.selectIds,
                };
                this.$http(api_get_cargo, data).then(res => {
                    this.isManual = true;
                    if(res.length === 0) {
                        this.$message({type: 'error', message: '需要绑定的sku不符合所选货位'});
                    }
                    this.cargoList = res.map(row => {
                        return {label: row, value: row};
                    });
                    if(this.selectIds.length !== 0) {
                        this.cargo = this.cargoList[0].value;
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`manual_bind`, false);
                    }, 200);
                });
                console.log('skuList', skuList);
            },
            auto_bind() {
                let cur = this.sku.split('\n').filter(row => !!row);
                let skuList = cur.map(row => {
                    return row.trim();
                });
                if (skuList.length <= 0 || this.warehouse_area_type === '') {
                    this.$message({type: "error", message: '请输入sku并选择分区功能'});
                    this.$reqKey(`auto_bind`, false);
                    return false;
                }
                let data = {
                    warehouse_id: this.warehouse,
                    sku: skuList,
                    warehouse_area_type: this.warehouse_area_type
                };
                this.$http(api_bind_cargo, data).then(res => {
                    if (res.fail_num > 0) {
                        this.$message({type: "error", message: res.message || res});
                    } else {
                        this.$message({type: "success", message: res.message || res});
                        this.visible = false;
                        this.isManual = false;
                        this.sku = '';
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`auto_bind`, false);
                    }, 200);
                });
            },
            query() {
                let skuList = this.sku.split('\n').filter(row => !!row).map(row => row.trim());
                if (skuList.length <= 0 || this.warehouse_area_type === '') {
                    this.$message({type: "error", message: '请输入sku并选择分区功能'});
                    return false;
                }
                typeof this.cargo === 'string' && (this.cargo = this.cargo.trim());
                let data = {
                    warehouse_id: this.warehouse,
                    sku: skuList,
                    warehouse_area_type: this.warehouse_area_type,
                    warehouse_cargo_code: this.cargo
                };
                this.$http(api_post_cargo, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.visible = false;
                    this.isManual = false;
                    this.sku = '';
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            cancel() {
                this.isManual = false;
                this.warehouse_area_type = 11;
                this.cargo = '';
            },
            querySearch(queryString, cb) {
                let cargoList = this.cargoList;
                let results = queryString ? cargoList.filter(this.createFilter(queryString)) : cargoList;
                cb(results);
            },
            createFilter(queryString) {
                return (item) => {
                    return (item.value.indexOf((queryString.toUpperCase())) === 0);
                }
            },
        },
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
            }
        },
        props: {
            warehouse: {},
            value: {
                default() {
                    return false;
                },
            },
            selectIds: {
                type: Array,
                default() {
                    return [];
                },
            },
        },
        components: {
            labelItem: require('@/components/label-item').default,
            orderInput: require("@/components/order-input.vue").default,
            pageDialog: require('@/components/page-dialog.vue').default,
            uiAutocomplete: require('@/components/ui-autocomplete').default,
            requestButton: require('@/global-components/request-button.vue').default,
        }
    }
</script>
