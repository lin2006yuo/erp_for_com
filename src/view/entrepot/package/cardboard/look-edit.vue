<template>
    <page-dialog v-model="visible" @open="open" class="c-cardboard-look" size="large" @close="close"
                 :title="`查看卡板（${cardboardInfo.id}）`">
        <div>
            <table class="template">
                <tr>
                    <th>卡板号</th>
                    <th>状态</th>
                    <th>接收（创建）人</th>
                    <th>开始打板时间</th>
                    <th>完成打板时间</th>
                    <th>拆包（拆板）人</th>
                    <th>开始拆板时间</th>
                    <th>完成拆板时间</th>
                </tr>
                <tr>
                    <td>{{cardboardInfo.id}}</td>
                    <td>{{cardboardInfo.status | filterStatus}}</td>
                    <td>{{cardboardInfo.create_id}}</td>
                    <td>{{cardboardInfo.create_time || '--'}}</td>
                    <td>{{cardboardInfo.recieve_end_time || '--'}}</td>
                    <td>{{cardboardInfo.unpacking_id}}</td>
                    <td>{{cardboardInfo.unpacking_start_time || '--'}}</td>
                    <td>{{cardboardInfo.unpacking_end_time || '--'}}</td>
                </tr>
            </table>
            <el-table :data="cardboardInfo.parcels_detail"
                      v-resize="{height: 150}"
                      class="scroll-bar mt-md">
                <el-table-column label="运单号" min-width="55" inline-template>
                    <div>
                        {{row.tracking_number}}
                    </div>
                </el-table-column>
                <el-table-column label="采购单号" min-width="55" inline-template>
                    <div>
                        {{row.purchase_order_ids | filterOrder}}
                    </div>
                </el-table-column>
                <el-table-column label="重量（g）" min-width="55" inline-template>
                    <div>
                        {{row.purchase_parcel_weight}}
                    </div>
                </el-table-column>
                <el-table-column label="供应商" min-width="100" inline-template>
                    <div>
                        {{row.supplier_name}}
                    </div>
                </el-table-column>
                <el-table-column label="采购员" min-width="55" inline-template>
                    <div>
                        {{row.purchaser_user_names.join()}}
                    </div>
                </el-table-column>
                <el-table-column label="是否拆分" min-width="55" inline-template>
                    <div :class="{red: row.is_use === 0}">
                        {{row.is_use===0 ? '未拆' : '已拆'}}
                    </div>
                </el-table-column>
                <el-table-column label="包裹状态" min-width="55" inline-template>
                    <div :class="{red: row.delete_time > 0}">
                        {{row.delete_time > 0 ? '已删除' : '正常'}}
                    </div>
                </el-table-column>
            </el-table>
        </div>
        <div slot="footer">
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                visible: false,
            }
        },
        filters: {
            filterStatus(val) {
                switch (val) {
                    case 0:
                        return '新增';
                    case 1:
                        return '接收打板中';
                    case 2:
                        return '打板完成';
                    case 3:
                        return '拆板拆包中';
                    case 4:
                        return '拆板完成';
                    case 5:
                        return '拆板强制完成';
                    case 6:
                        return '已作废';
                }
            },
            filterOrder(val) {
                if (val !== '') {
                    let orders = val.split(',');
                    return orders.map(row => `PO${row}`).join();
                }
                return '';
            }
        },
        methods: {
            open() {

            },
            sure() {

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
            cardboardInfo: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>