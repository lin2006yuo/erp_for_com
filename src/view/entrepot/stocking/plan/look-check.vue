<template>
    <page class="p-look-check">
        <page-dialog :title="title" v-model="dialog" size="large" @open="open" @close="close"
                     :close-on-click-modal="false">
            <table class="template">
                <tbody>
                <tr>
                    <td width="25%">申请单号</td>
                    <td width="25%">{{detailData.code}}</td>
                    <td width="25%">申请单名称</td>
                    <td width="25%">{{detailData.remark}}</td>
                </tr>
                <tr>
                    <td>备货仓库</td>
                    <td>{{detailData.warehouse}}</td>
                    <td>中转仓库</td>
                    <td>{{detailData.transit_warehouse}}</td>
                </tr>
                <tr>
                    <td>状态</td>
                    <td>{{detailData.status_txt}}</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>提交人</td>
                    <td>{{detailData.submitter}}</td>
                    <td>申请时间</td>
                    <td>{{detailData.create_time | timeFilter}}</td>
                </tr>
                <tr>
                    <td>一级审批人</td>
                    <td>{{detailData.auditor}}</td>
                    <td>一级审批时间</td>
                    <td>{{detailData.audit_time | timeFilter}}</td>
                </tr>
                <tr>
                    <td>二级审批人</td>
                    <td>{{detailData.auditor_2}}</td>
                    <td>二级审批时间</td>
                    <td>{{detailData.audit_time_2 | timeFilter}}</td>
                </tr>
                <tr>
                    <td>三级级审批人</td>
                    <td>{{detailData.auditor_3}}</td>
                    <td>三级审批时间</td>
                    <td>{{detailData.audit_time_3 | timeFilter}}</td>
                </tr>
                </tbody>
            </table>
            <table class="template mt-lg">
                <tr>
                    <th>图片</th>
                    <th>SKU</th>
                    <th>商品名称</th>
                    <th>日均销量</th>
                    <th>平台</th>
                    <th>申请数量</th>
                    <th width="150px;" v-if="!editShow">备货数量</th>
                    <th v-if="!editShow && !checkShow">分配数量</th>
                    <th v-if="editShow">操作</th>
                </tr>
                <tbody class="scroll-table">
                <template v-for="(data,index) in detailData.sku_list">
                    <tr>
                        <td :rowspan="data.channel_list.length + 1">
                            <div>
                                <el-popover
                                        placement="right"
                                        width="200"
                                        trigger="hover">
                                    <img v-lazy="sku_image(data.thumb)" width="200" height="200"/>
                                    <div slot="reference">
                                        <img v-lazy="data.thumb" width="60" height="60"/>
                                    </div>
                                </el-popover>
                            </div>
                        </td>
                        <td :rowspan="data.channel_list.length + 1">{{data.sku}}</td>
                        <td :rowspan="data.channel_list.length + 1">
                            <div>
                                {{data.goods_name}}
                            </div>
                        </td>
                        <td :rowspan="data.channel_list.length + 1">{{data.sku_daily_sales}}</td>
                        <template v-for="(item,itemIndex) in data.channel_list" v-if="itemIndex===0">
                            <td width="60">{{item.channel}}</td>
                            <td>
                                <integer-input v-if="editShow"
                                               class="width-sm inline"
                                               :min="0"
                                               @change="change_apply(data)"
                                               :disabled="item.read === 1"
                                               v-model="item.quantity"></integer-input>
                                <div v-else>{{item.quantity}}</div>
                            </td>
                            <td v-if="!editShow">
                                <integer-input class="width-sm inline" :min="0"
                                               v-if="checkShow"
                                               :disabled="item.read === 1"
                                               @change="change_stock(item)"
                                               v-model="item.in_quantity"></integer-input>
                                <div v-else>{{item.in_quantity}}</div>
                            </td>
                            <td v-if="!editShow && !checkShow">{{item.allocated_qty}}</td>
                        </template>
                        <td :rowspan="data.channel_list.length + 1" width="40" v-if="editShow">
                            <permission tag="span" :route="apis.url_stock_delete_sku" class="operate"
                                        @click="delete_sku(data)">删除
                            </permission>
                        </td>
                    </tr>
                    <tr v-for="(item,itemIndex) in data.channel_list" :key="`${data.sku}-${index}`"
                        v-if="itemIndex!==0">
                        <td width="50">{{item.channel}}</td>
                        <td>
                            <integer-input v-if="editShow"
                                           class="width-sm inline" :min="0"
                                           :disabled="item.read === 1"
                                           @change="change_apply(data)"
                                           v-model="item.quantity"></integer-input>
                        </td>
                        <td v-if="!editShow">
                            <div v-if="checkShow">
                                <integer-input class="width-sm inline" :min="0"
                                               :disabled="item.read === 1"
                                               @change="change_stock(data)"
                                               v-model="item.in_quantity"></integer-input>
                            </div>
                        </td>
                        <td v-if="!editShow && !checkShow">{{item.allocated_qty}}</td>
                    </tr>
                    <tr>
                        <td width="50">合计</td>
                        <td>
                            <div>{{data.quantity}}</div>

                        </td>
                        <td v-if="!editShow">
                            <div>{{data.in_quantity}}</div>
                        </td>
                        <td v-if="!editShow && !checkShow">{{data.allocated_qty}}</td>
                    </tr>
                </template>
                </tbody>
            </table>
            <div slot="footer" class="dialog-footer">
                <permission tag="requestButton" :route="apis.url_stocking_audit" req-key="lookCheck" @click="submit"
                            v-if="checkShow">审核通过
                </permission>
                <permission tag="ElButton" :route="apis.url_delete_stock"
                            @click="check_fail"
                            v-if="checkShow">审核不通过
                </permission>
                <permission tag="requestButton" :route="apis.url_stock_edit" req-key="stockEdit" @click="edit"
                            v-if="editShow">确定
                </permission>
                <el-button size="mini" v-if="!checkShow" @click.native="dialog=false">关闭</el-button>
            </div>
            <check-fail v-model="failVisible" @sure="delete_stock"></check-fail>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .scroll-table {
        max-height: 520px;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
<script>
    import {
        api_stocking_audit,
        api_stock_delete_sku,
        api_stock_edit,
        api_delete_stock,
        url_stocking_audit,
        url_stock_delete_sku,
        url_stock_edit,
        url_delete_stock
    } from '@/api/stocking';

    export default {
        permission: {
            url_stocking_audit,
            url_stock_delete_sku,
            url_stock_edit,
            url_delete_stock,
        },
        data() {
            return {
                dialog: false,
                listData: [],
                failVisible: false,
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            open() {
                if (this.checkShow) {
                    this.detailData.sku_list.forEach(data => {
                        data.channel_list.forEach(item => {
                            if (item.in_quantity === 0) {
                                this.$set(item, 'in_quantity', item.quantity);
                            }
                        });
                    })
                }
            },
            close() {
                this.$emit('close');
            },
            submit() {
                this.$confirm(`确定审核通过备货申请${this.detailData.code}吗?`, '提示', {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let sku_data = [];
                    let data = this.detailData.sku_list;
                    data.forEach(row => {
                        row.channel_list.forEach((item, index) => {
                            let param = {
                                channel_id: item.channel_id,
                                sku_id: row.sku_id,
                                quantity: item.in_quantity,
                            };
                            sku_data.push(param);
                        });
                    });
                    let params = {
                        sku_data: sku_data,
                    }
                    this.$http(api_stocking_audit, this.detailData.id, params).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.$emit('update', this.detailData.id);
                        this.dialog = false;
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey(`lookCheck`, false);
                        }, 200);
                    });
                }).catch(() => {
                    this.$reqKey(`lookCheck`, false);
                    this.$message({
                        type: "info",
                        message: "已取消"
                    });
                })
            },
            check_fail() {//审核不通过
                this.$confirm(`确定审核不通过备货申请${this.detailData.code}吗?`, '提示', {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.failVisible = true;
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    });
                })
            },
            delete_stock(reason) {
                let data = {
                    reason: reason,
                };
                this.$http(api_delete_stock, this.detailData.id, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit('update', this.detailData.id);
                    this.failVisible = false;
                    this.$nextTick(() => {
                        this.dialog = false;
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`deleteCheck`, false);
                    }, 200);
                });

            },
            edit() {
                let sku_data = [];
                let data = this.detailData.sku_list;
                data.forEach(row => {
                    row.channel_list.forEach((item, index) => {
                        let param = {
                            sku_id: row.sku_id,
                            quantity: item.quantity,
                            channel_id: item.channel_id,
                        };
                        sku_data.push(param);
                    });
                });
                let params = {
                    remark: '',
                    sku_data: sku_data,
                }
                this.$http(api_stock_edit, this.detailData.id, params).then(res => {
                    this.dialog = false;
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit('update', this.detailData.id);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`stockEdit`, false);
                    }, 200);
                });

            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.')
                }
                return ""
            },
            delete_sku(data) {
                this.$confirm(`您将删除备货申请单${this.detailData.code}的sku${data.sku},确认此操作吗?`, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_stock_delete_sku, this.detailData.id, data.sku_id).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res,
                        });
                        let index = this.detailData.sku_list.findIndex(row => row === data);
                        this.detailData.sku_list.splice(index, 1);
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
            },
            change_stock(data) {
                this.$nextTick(() => {
                    let sum = 0;
                    data.channel_list.forEach((row, index) => {
                        sum += Number(row.in_quantity);
                    });
                    this.$set(data, 'in_quantity', sum);
                });
            },
            change_apply(data) {
                this.$nextTick(() => {
                    let sum = 0;
                    data.channel_list.forEach((row, index) => {
                        sum += Number(row.quantity);
                    });
                    this.$set(data, 'quantity', sum);
                });
            }
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
        },
        watch: {
            dialog(val) {
                this.$emit('input', val)
            },
            value(val) {
                this.dialog = val;
            },
        },
        computed: {
            isCheck() {
                return this.checkShow || this.editShow;
            },
            isEdit() {
                return this.editShow
            }
        },
        props: {
            value: {},
            title: {},
            detailData: {},
            checkShow: {},
            editShow: {},
        },
        components: {
            requestButton: require('@/global-components/request-button.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            checkFail: require('./check-fail.vue').default,
        }
    }
</script>
