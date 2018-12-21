<template>
    <div class="c-look-over">
        <page-dialog :title="title" v-model="lookDialog" size="large" :close-on-click-modal="false">
            <card label="基本信息">
                <el-row>
                    <el-col :span="12"><span class="inline width-xs t-right">仓库</span>：{{warehouse}}<span></span>
                    </el-col>
                    <el-col :span="12"><span
                            class="inline width-xs t-right">状态</span>：{{data.status|status}}<span></span></el-col>
                </el-row>

                <el-row>
                    <el-col :span="12"><span class="inline width-xs t-right">出库类型</span>：{{data.type}}<span></span>
                    </el-col>
                    <el-col :span="12"><span
                            class="inline width-xs t-right">来源单号</span>：{{data.original_code}}<span></span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="12"><span class="inline width-xs t-right">创建人</span>：{{data.creator}}<span></span>
                    </el-col>
                    <el-col :span="12"><span class="inline width-xs t-right">创建时间</span>：{{data.create_time|fmsdatetime}}<span></span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12"><span class="inline width-xs t-right">审核人</span>：{{data.auditor}}<span></span>
                    </el-col>
                    <el-col :span="12"><span class="inline width-xs t-right">审核时间</span>：{{data.create_time|fmsdatetime}}<span></span>
                    </el-col>
                </el-row>
                <el-row>
                    <span class="inline width-xs t-right">备注</span>：<span></span>
                </el-row>
            </card>
            <card label="产品信息">
                <el-table
                        border
                        :data="data.details"
                >
                    <el-table-column label="SKU" prop="sku"></el-table-column>
                    <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                    <el-table-column label="出库数量" inline-template>
                        <div>
                            <integer-input v-model="row.quantity" :min="1" v-if="edit"></integer-input>
                            <span v-else>{{row.quantity}} </span>
                        </div>
                    </el-table-column>
                    <el-table-column label="单价" prop="price"></el-table-column>
                    <el-table-column inline-template label="备注">
                        <div>
                            <el-input v-model="row.remark" v-if="edit"></el-input>
                        </div>
                    </el-table-column>
                </el-table>
            </card>
            <div slot="footer">
                <request-button req-key="updateAdd" @click="update" v-if="edit">审核</request-button>
                <el-button size="mini" @click.native="close">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    import {mapGetters} from 'vuex';
    import {stock_lookup, stock_audit} from '@/api/stock-out';

    export default {
        data() {
            return {
                lookDialog: false,
                data: {},
            }
        },
        mounted() {
            this.lookDialog = this.value;
        },
        filters: {
            filerTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            filterPrice(val) {
                return parseFloat(val).toFixed(2);
            },
            status(val) {
                switch (val) {//0 草稿，1 已审 ，2 ，已入库，3，部份入库
                    case 1:
                        return "已审";
                    case 2:
                        return "已出库";
                    case 3:
                        return "部份出库";
                    case 0:
                        return "草稿";
                }
            },
            type(val) {
                switch (val) {
                    case 21:
                        return '订单出库';
                    case 22:
                        return '调拨出库';
                    default:
                        return '未定义'
                }
            },
        },
        watch: {
            lookDialog(val) {
                this.$emit("input", val);
            },
            value(val) {
                this.lookDialog = val;
            }
        },
        methods: {
            close() {
                this.lookDialog = false;
            },
            update() {
                let detail = this.data.details.map(row => {
                    Object.keys(row).forEach(key => {
                        if (typeof row[key] === 'string') {
                            row[key] = row[key].trim();
                        }
                    });
                    return {
                        sku_id: row.sku_id,
                        quantity: row.quantity,
                        remark: row.remark,
                    }
                })
                let params = {
                    id: this.data.id,
                    details: detail
                };
                this.$http(stock_audit, params).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.lookDialog = false;
                    this.$emit('update');
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`updateAdd`, false);
                    }, 200);
                });
            },
            request_look(id) {
                this.$http(stock_lookup, id).then(res => {
                    this.data = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            }
        },
        computed: {
            ...mapGetters({warehouses: 'api/warehouses'}),
            warehouse() {
                const warehouse = this.warehouses.find(row => row.value === this.data.warehouse_id);
                if (warehouse) {
                    return warehouse.label;
                } else {
                    return ``
                }
            },
            title() {
                return `查看出库单号：${this.data.code}信息` || "";
            },
            create() {
                return 'create'
            },
        },
        props: {
            value: {},
            edit: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            card: require('@/components/card.vue').default,
            integerInput: require('@/components/integer-input.vue').default
        }
    }
</script>
