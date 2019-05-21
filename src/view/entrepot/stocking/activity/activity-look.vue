<template>
    <page-dialog v-model="visible" size="large" @open="open" @close="close" :title="trendAction.title">
        <table class="template">
            <tr>
                <td width="15%">申请单号</td>
                <td width="35%">{{editData.number}}</td>
                <td width="15%">状态</td>
                <td width="35%">{{editData.status_name}}</td>
            </tr>
            <tr>
                <td>备货仓</td>
                <td>{{editData.warehouse}}</td>
                <td>备货平台</td>
                <td>{{editData.channel}}</td>
            </tr>
            <tr>
                <td>发起人</td>
                <td>{{editData.creator}}</td>
                <td>发起时间</td>
                <td>{{editData.submit_time | timeFilter}}</td>
            </tr>
            <tr>
                <td>一级审核人</td>
                <td>{{editData.auditor}}</td>
                <td>一级审核时间</td>
                <td>{{editData.audit_time | timeFilter}}</td>
            </tr>
            <tr>
                <td>二级审核人</td>
                <td>{{editData.auditor_2}}</td>
                <td>二级审核时间</td>
                <td>{{editData.audit_time_2 | timeFilter}}</td>
            </tr>
            <tr>
                <td>三级审核人</td>
                <td>{{editData.auditor_3}}</td>
                <td>三级审核时间</td>
                <td>{{editData.audit_time_3 | timeFilter}}</td>
            </tr>
            <tr>
                <td>活动起止时间</td>
                <td>{{editData.start_time | dateFilter}}--{{editData.end_time | dateFilter}}</td>
                <td>备注</td>
                <td>{{editData.not_passed_reason}}</td>
            </tr>
        </table>
        <ui-table :has-data="editData.sku_list.length > 0"
                  :heads="uiHeads"
                  :body-height="150">
            <tbody>
            <template v-for="(row,index) in editData.sku_list">
                <tr @click="add_class(index)"
                    :class="[clickData[index]?'active-color':'']">
                    <!--图片-->
                    <td>
                        <plus-minus @show-detail="show(index, row)"
                                    class="inline"
                                    :show="row.show"
                                    v-if="!checkShow && row.type === 1"
                                    :title="tipTitle">
                        </plus-minus>
                        <el-popover
                                class="inline"
                                placement="right"
                                trigger="hover">
                            <img v-lazy="sku_image(row.thumb)" width="200px" height="200px">
                            <div slot="reference">
                                <img v-lazy="row.thumb" height="60px" width="60px" style="border:none">
                            </div>
                        </el-popover>
                    </td>
                    <!-- SKU/SKU别名 -->
                    <td>
                        <div>
                            {{row.sku}}
                        </div>
                        <div v-for="item in row.sku_alias">{{item || `--`}}</div>
                    </td>
                    <!-- 商品名称 -->
                    <td>
                        <div>{{row.goods_name}}</div>
                    </td>
                    <!-- 申请数量 -->
                    <td>
                        <div>{{row.submit_quantity}}</div>
                    </td>
                    <!-- 备货数量 -->
                    <td>
                        <ui-limit-number class="width-xs inline" :min="0"
                                         v-if="checkShow"
                                         v-model.number="row.quantity"></ui-limit-number>
                        <div v-else>{{row.quantity}}</div>
                    </td>
                    <!-- 类型 -->
                    <td>
                        <div>{{row.type_txt}}</div>
                    </td>
                    <!-- 活动开始时数量 -->
                    <td v-if="!checkShow">
                        <div>{{row.start_quantity}}</div>
                    </td>
                    <!-- 活动实际销售数量 -->
                    <td v-if="!checkShow">
                        <div>{{row.end_sale_quantity}}</div>
                    </td>
                </tr>
                <template v-if="row.show">
                    <tr style="font-weight:bold">
                        <td colspan="3">采购员</td>
                        <td colspan="2">采购单号</td>
                        <td colspan="3">已锁定数量</td>
                    </tr>
                    <tr v-for="(item,index) in row.purchase_details" :key="index">
                        <td colspan="3">{{item.purchaser}}</td>
                        <td colspan="2">{{item.purchase_code}}</td>
                        <td colspan="3">{{item.qty}}</td>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
        <!--<el-table class="scroll-bar mt-sm"
                  border
                  highlight-current-row
                  v-resize="{height: 150}"
                  :data="editData.sku_list">
            <el-table-column label="图片" inline-template width="80">
                <el-popover
                        placement="right"
                        width="200"
                        trigger="hover">
                    <img v-lazy="sku_image(row.thumb)" width="200" height="200"/>
                    <div slot="reference">
                        <img v-lazy="row.thumb" width="60" height="60"/>
                    </div>
                </el-popover>
            </el-table-column>
            <el-table-column lebel="SKU/SKU别名" inline-template width="100">
                <div>
                    <div>
                        {{row.sku}}
                    </div>
                    <div v-for="item in row.sku_alias">{{item || `&#45;&#45;`}}</div>
                </div>
            </el-table-column>
            <el-table-column lable="商品名称" inline-template>
                <div>{{row.goods_name}}</div>
            </el-table-column>
            <el-table-column label="申请数量" inline-template>
                <div>{{row.submit_quantity}}</div>
            </el-table-column>
            <el-table-column label="备货数量" inline-template>
                <div>
                    <integer-input class="width-sm inline" :min="0"
                                   v-if="checkShow"
                                   v-model="row.quantity"></integer-input>
                    <div v-else>{{row.quantity}}</div>
                </div>
            </el-table-column>
            <el-table-column label="类型" inline-template>
                <div>{{row.type}}</div>
            </el-table-column>
            <el-table-column label="活动开始时数量" v-if="!checkShow" inline-template>
                <div>{{row.start_quantity}}</div>
            </el-table-column>
            <el-table-column label="活动实际销售数量" v-if="!checkShow" inline-template>
                <div>{{row.end_sale_quantity}}</div>
            </el-table-column>
        </el-table>-->
        <div slot="footer">
            <div v-if="checkShow">
                <permission tag="requestButton"
                            type="primary"
                            req-key="activity_apply"
                            @click="sure"
                            :route="apis.url_local_stocking_adopt">
                    审核通过
                </permission>
                <permission tag="ElButton"
                            type="default"
                            @click="cancel"
                            :route="apis.url_local_stocking_adopt">
                    审核不通过
                </permission>
            </div>
            <el-button v-else size="mini" @click.native="visible = false">关闭</el-button>
        </div>
        <reason v-model="reasonVisible" @fail="apply_fail"></reason>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_local_stocking_adopt, url_local_stocking_adopt} from "@/api/local-stocking";

    export default {
        permission: {
            url_local_stocking_adopt
        },
        data() {
            return {
                visible: false,
                reasonVisible: false,
                clickData: [],
                tipTitle: '点击查看备货详情'
            }
        },
        filters: {
            dateFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd', val);
                } else {
                    return "--";
                }
            },
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
            filterType(val) {
                switch (val) {
                    case 1:
                        return '到货锁定';
                    case 2:
                        return '边卖边采';
                    default:
                        return '';
                }
            },
        },
        methods: {
            open() {
            },
            sure() {
                let details = [];
                if (this.editData.sku_list.some(row => {
                    details.push({
                        sku_id: row.sku_id,
                        quantity: row.quantity,
                    });
                    return Number(row.quantity) < 1;
                })) {
                    return this.$message({type: 'error', message: '请输入有效的备货数量'});
                }
                let data = {
                    id: this.editData.id,
                    status: 2,
                    details: details,
                };
                this.$confirm(`确定审核通过备货申请${this.editData.number}吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$http(api_local_stocking_adopt, this.trendAction.id, data).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.$emit('search');
                        this.visible = false;
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('activity_apply', false);
                        }, 200);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消',
                    });
                    this.$reqKey('activity_apply', false);
                })
            },
            cancel() {
                this.$confirm(`确定审核不通过备货申请${this.editData.number}吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.reasonVisible = true;
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消',
                    });
                })
            },
            apply_fail(reason) {
                let data = {
                    status: 3,
                    not_passed_reason: reason,
                };
                this.$http(api_local_stocking_adopt, this.trendAction.id, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit('search');
                    this.reasonVisible = false;
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('activityStockFail', false);
                    }, 200)
                });
            },
            // 当前行高亮
            add_class(index) {
                this.clickData = this.clickData.map(() => {
                    return false;
                });
                this.clickData[index] = true;
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.');
                }
                return "";
            },
            // 详情显示切换
            show(index, row) {
                this.$set(row, 'show', !row.show);
            },
            close() {
            }
        },
        computed: {
            uiHeads() {
                switch (true) {
                    case !this.checkShow:
                        return [
                            {label: '图片', width: 10},
                            {label: 'SKU/SKU别名', width: 10},
                            {label: '商品名称', width: 10},
                            {label: '申请数量', width: 10},
                            {label: '备货数量', width: 10},
                            {label: '类型', width: 10},
                            {label: '活动开始时数量', width: 10},
                            {label: '活动实际销售数量', width: 10},
                        ];
                    default:
                        return [
                            {label: '图片', width: 10},
                            {label: 'SKU/SKU别名', width: 10},
                            {label: '商品名称', width: 50},
                            {label: '申请数量', width: 10},
                            {label: '备货数量', width: 10},
                            {label: '类型', width: 10},
                        ]
                }
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
            editData: {},
            checkShow: {},
            trendAction: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            uiLimitNumber: require('@/components/ui-limit-number.vue').default,
            reason: require('./reason.vue').default,
            plusMinus: require('@/components/plus-minus.vue').default,
        }
    }
</script>