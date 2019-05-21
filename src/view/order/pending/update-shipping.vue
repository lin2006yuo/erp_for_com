<template>
    <page-dialog title="更改运输方式" v-model="resultShow" @open="open" width="600px" :close-on-click-modal="false">
        <el-row class="mt-sm ml-lg mb-sm">
            <label-item label="发货仓库：" class="ml-sm mr-sm">
                <super-select
                    style="width:170px"
                    storageKey="order_warehouse"
                    v-model="form.warehouse_id"
                    @change="change_warehouse"
                    :is-paging="true"
                    :options='warehouseList'
                ></super-select>
                <!--<el-select style="width:170px"-->
                           <!--v-model="form.warehouse_id"-->
                           <!--@change="change_warehouse"-->
                           <!--filterable clearable>-->
                    <!--<el-option v-for="item in warehouseList"-->
                               <!--:key="item.value"-->
                               <!--:label="item.label"-->
                               <!--:value="item.value"></el-option>-->
                <!--</el-select>-->
            </label-item>
            <div class="br-show" style="height: 3px;display: none"></div>
            <label-item label="运输方式：">
                <super-select
                    storageKey="order_shipping"
                    class="width-super"
                    v-model="form.shipping_id"
                    :placeholder="shippingPlaceholder"
                    :disabled="shippingList.length<=1"
                    :is-paging="true"
                    :options='shippingList'
                ></super-select>
                <!--<el-select class="width-super"-->
                           <!--v-model="form.shipping_id"-->
                           <!--:placeholder="shippingPlaceholder"-->
                           <!--:disabled="shippingList.length<=1"-->
                           <!--filterable clearable>-->
                    <!--<el-option v-for="item in shippingList"-->
                               <!--:key="item.value"-->
                               <!--:label="item.label"-->
                               <!--:value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            </label-item>
        </el-row>
        <span slot="footer" class="dialog-footer">
                    <el-button size="mini" type="primary" @click="update_shipping">确认</el-button>
                    <el-button size="mini" @click="resultShow = false">关闭</el-button>
            </span>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_shipping} from '@/api/common';
    import {api_update_shipping} from '../../../api/order-local';

    export default {
        name: "update-shipping",
        data() {
            return {
                resultShow: this.value,
                shippingList: []
            }
        },
        methods: {
            open() {

            },
            change_warehouse() {
                this.shipping_remote();
                this.form.shipping_id = '';
            },
            shipping_remote() {
                if (this.form.warehouse_id === "") {
                    this.$reqKey('api_warehouse_remote', false);
                    return this.shippingList = [{label: "", value: ""}];
                }
                this.$http(api_get_shipping, {warehouse_id: this.form.warehouse_id}).then(res => {
                    if (res.length <= 0) return this.shippingList = [{label: "", value: ""}];
                    this.shippingList = res.map(row => {
                        return {
                            label: `${row.carrier_name}>>${row.shortname}`,
                            value: row.shipping_method_id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_warehouse_remote', false)
                    }, 200)
                });
            },
            update_shipping() {
                if (!this.form.warehouse_id) {
                    this.$message({type: 'warning', message: '请选择发货仓库！'});
                    return
                }
                if (!this.form.shipping_id) {
                    this.$message({type: 'warning', message: '请选择运输方式！'});
                    return
                }
                let params = {
                    order_ids: this.ids,
                    shipping_id: this.form.shipping_id,
                    warehouse_id: this.form.warehouse_id
                };
                this.$http(api_update_shipping, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.resultShow = false;
                    this.$emit('update-submit');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
        },
        computed: {
            shippingPlaceholder() {
                if (this.warehouse_id <= 0) {
                    return "请先选择发货仓库";
                } else if (this.warehouse_id > 0 && this.shippingList.length <= 1) {
                    return "该发货仓库下暂无运输方式";
                } else {
                    return "请选择运输方式";
                }
            },
        },
        watch: {
            resultShow(val) {
                this.$emit('input', val)
            },
            value(val) {
                this.resultShow = val;
            }
        },
        props: {
            value: {
                type: Boolean,
                required: true
            },
            warehouseList: {
                type: Array,
                required: true
            },
            form: {
                type: Object,
                required: true
            },
            ids: {
                type: Array,
                required: true
            }
        },
        components: {
            labelItem: require('@/components/label-item').default
        }
    }
</script>

