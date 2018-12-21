<template>
    <page class="p-allocation-dialog">
        <page-dialog :title="title" v-model="dialog" size="large" :close-on-click-modal="false" @change="change_dialog">
            <p class="bold-font font-18">待分配平台库存：<span class="font-18">{{canAllotQuantity}}</span></p>
            <el-table :data="allotData.channel_data" class="mt-lg">
                <el-table-column label="平台" prop="channel_name"></el-table-column>
                <el-table-column label="可用库存" prop="available_quantity"></el-table-column>
                <el-table-column label="待发库存" prop="waiting_shipping_quantity"></el-table-column>
                <el-table-column label="调拨在途" prop="allocation_quantity"></el-table-column>
                <el-table-column label="采购在途" prop="instransit_quantity"></el-table-column>
                <el-table-column label="缺货数" prop="oos_quantity"></el-table-column>
                <el-table-column label="分配数量" inline-template>
                    <integer-input v-model="row.allot_quantity" :min="0"></integer-input>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <permission tag="ElButton" :route="apis.url_save_allot" size="mini" type="primary"
                            @click.native="submit">确认分配
                </permission>
                <el-button size="mini" @click.native="dialog=false">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_save_allot, url_save_allot} from '@/api/overseas-stock';

    export default {
        permission: {
            url_save_allot
        },
        data() {
            return {
                dialog: false,
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            submit() {
                if (!this.validate()) {
                    return false;
                }
                let details = this.allotData.channel_data.map(row => {
                    return {
                        channel_id: row.channel_id,
                        allot_quantity: row.allot_quantity,
                    }
                });
                let params = {
                    details: details
                };

                this.$http(api_save_allot, this.allotData.id, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.dialog = false;
                    this.$emit('update-list', this.allotData.id, details);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            change_dialog(val) {

            },
            validate() {
                if (this.canAllotQuantity < 0) {
                    this.$message({type: 'error', message: '分配的平台库存总数不能超过待分配平台库存数！'});
                    return false;
                }
                return true;
            }
        },
        filters: {},
        watch: {
            dialog(val) {
                this.$emit('input', val)
            },
            value(val) {
                this.dialog = val;
            },
        },
        computed: {
            canAllotQuantity() {
                let sum = 0;
                if (!isEmpty(this.allotData)) {
                    sum = this.allotData.can_allot_quantity;
                    this.allotData.channel_data.forEach(row => {
                        sum -= Number(row.allot_quantity);
                    });
                }
                return sum;
            }
        },
        props: {
            value: {},
            title: {},
            allotData: {},
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
        }
    }
</script>
