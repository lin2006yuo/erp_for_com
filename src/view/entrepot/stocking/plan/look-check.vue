<template>
    <page class="p-look-check">
        <page-dialog :title="title" v-model="dialog" size="full" @open="open" @close="close"
                     :close-on-click-modal="false">
            <div v-loading="dataLoading" element-loading-text="玩命加载中...">
                <table class="template">
                    <tbody>
                    <tr>
                        <td class="deepBg" width="25%">申请单号</td>
                        <td width="25%">{{detailData.code}}</td>
                        <td class="deepBg" width="25%">申请单名称</td>
                        <td width="25%">{{detailData.remark}}</td>
                    </tr>
                    <tr>
                        <td class="deepBg">备货仓库</td>
                        <td>{{detailData.warehouse}}</td>
                        <td class="deepBg">中转仓库</td>
                        <td>{{detailData.transit_warehouse}}</td>
                    </tr>
                    <tr>
                        <td class="deepBg">状态</td>
                        <td>{{detailData.status_txt}}</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="deepBg">提交人</td>
                        <td>{{detailData.submitter}}</td>
                        <td class="deepBg">申请时间</td>
                        <td>{{detailData.create_time | timeFilter}}</td>
                    </tr>
                    <tr>
                        <td class="deepBg">一级审批人</td>
                        <td>{{detailData.auditor}}</td>
                        <td class="deepBg">一级审批时间</td>
                        <td>{{detailData.audit_time | timeFilter}}</td>
                    </tr>
                    <tr>
                        <td class="deepBg">二级审批人</td>
                        <td>{{detailData.auditor_2}}</td>
                        <td class="deepBg">二级审批时间</td>
                        <td>{{detailData.audit_time_2 | timeFilter}}</td>
                    </tr>
                    <tr>
                        <td class="deepBg">三级级审批人</td>
                        <td>{{detailData.auditor_3}}</td>
                        <td class="deepBg">三级审批时间</td>
                        <td>{{detailData.audit_time_3 | timeFilter}}</td>
                    </tr>
                    </tbody>
                </table>
                <el-row class="mt-xs">
                    <el-button type="primary" @click.native="batch_release_inventory(false)" size="mini" v-if="releaseShow">批量释放库存</el-button>
                </el-row>
                <table class="template mt-xs">
                    <tr>
                        <th v-if="releaseShow">
                            <el-checkbox v-model="checkedAll"></el-checkbox>
                        </th>
                        <th>图片</th>
                        <th>SKU</th>
                        <th width="200px">商品名称</th>
                        <th>日均销量</th>
                        <th>平台</th>
                        <th>申请数量</th>
                        <th width="150px;" v-if="!editShow">备货数量</th>
                        <th v-if="!editShow && !checkShow">分配数量</th>
                        <th>释放数量</th>
                        <th>备货建议</th>
                        <th>开发员</th>
                        <th>采购员</th>
                        <th>状态</th>
                        <th v-if="editShow || releaseShow">操作</th>
                    </tr>
                    <tbody class="scroll-table">
                    <template v-for="(data,index) in detailData.sku_list">
                        <tr>
                            <td v-if="releaseShow">
                                <el-checkbox v-model="data.checked" v-if="data.allocated_qty > 0"></el-checkbox>
                            </td>
                            <td>
                                <plus-minus @show-detail="show_detail(data)" :show="data.show" title="点击可查看更多" v-if="!editShow && !checkShow"></plus-minus>
                                <div class="inline">
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
                            <td>{{data.sku}}</td>
                            <td>
                                <div>{{data.goods_name}}</div>
                            </td>
                            <td>{{data.sku_daily_sales}}</td>
                            <template v-for="(item,itemIndex) in data.channel_list" v-if="itemIndex===0">
                                <td>
                                    <ui-tip :content="item.channel"></ui-tip>
                                </td>
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
                            <td>{{data.invalid_qty}}</td>
                            <td>{{data.ready_advice_qty}}</td>
                            <td>{{data.developer}}</td>
                            <td>{{data.purchaser}}</td>
                            <td>{{get_status_name(data.status_name)}}</td>
                            <td v-if="editShow || releaseShow">
                                <permission tag="span" :route="apis.url_stock_release_inventory" class="operate"
                                            @click="batch_release_inventory(data)" v-if="data.allocated_qty > 0 && releaseShow">释放库存
                                </permission>
                                <permission tag="span" v-if="editShow" :route="apis.url_stock_delete_sku" class="operate"
                                            @click="delete_sku(data)">删除
                                </permission>
                            </td>
                        </tr>
                        <tr v-for="(item,itemIndex) in data.channel_list" :key="`${data.sku}-${index}`"
                            v-if="itemIndex!==0">
                            <td>{{item.channel}}</td>
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
                        <template v-if="data.show">
                            <tr style="font-weight:bold;background-color: #f5f7fa">
                                <td :colspan="3">采购计划单号/采购单号/采购数量</td>
                                <td :colspan="5">调拨单号/调拨数量</td>
                                <td :colspan="5">锁定公用库存</td>
                            </tr>
                            <tr>
                                <td :colspan="3">
                                    <div v-for="(row, index) in data.apply_purchase.filter(it => it.type === 1)" :key="index">{{row.purchase_plan_number | dataFilter}}/{{row.purchase_order_number | dataFilter}}/{{row.handle_qty | dataFilter}}</div>
                                </td>
                                <td :colspan="5">
                                    <div v-for="(row, index) in data.apply_purchase.filter(it => it.type === 3)" :key="index">{{row.allocation_code | dataFilter}}/{{row.handle_qty | dataFilter}}</div>
                                </td>
                                <td :colspan="5">
                                    <div v-for="(row, index) in data.apply_purchase.filter(it => it.type === 2)" :key="index">{{row.handle_qty | dataFilter}}</div>
                                </td>
                            </tr>
                        </template>
                    </template>
                    </tbody>
                </table>
            </div>
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
            <release-inventory v-model="releaseDialog" :check-list="checkList" ref="release_dialog" @confirm-release="confirm_release"></release-inventory>
        </page-dialog>
    </page>
</template>
<style lang="stylus" scoped>
    .scroll-table {
        max-height: 520px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .deepBg{
        background-color: aliceblue
    }
</style>
<script>
    import {
        api_stocking_audit,
        api_stock_delete_sku,
        api_stock_edit,
        api_delete_stock,
        api_stock_release_inventory,
        url_stock_release_inventory,
        url_stocking_audit,
        url_stock_delete_sku,
        url_stock_edit,
        url_delete_stock
    } from '@/api/stocking';

    export default {
        permission: {
            url_stock_release_inventory,
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
                checkedAll: false,
                releaseDialog: false,
                checkList: []
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
            batch_release_inventory(data){
                if(data){
                    this.$refs.release_dialog.releaseList = [
                        {id: data.channel_list[0].id,sku: data.sku, allocated_qty: data.allocated_qty, available_qty: data.allocated_qty-data.occupy_qty, release_qty: 0}
                    ];
                    this.releaseDialog = true;
                }else{
                    this.checkList = this.detailData.sku_list.filter(row => row.allocated_qty > 0 && row.checked);
                    if(this.checkList.length === 0){
                        this.$message({type: 'warning', message: '请选择需要释放库存的sku'});
                        return
                    }else{
                        this.$refs.release_dialog.releaseList = this.checkList.map(row => {
                            return {
                                id: row.channel_list[0].id,
                                sku: row.sku,
                                allocated_qty: row.allocated_qty,
                                available_qty: row.allocated_qty-row.occupy_qty,
                                release_qty: 0
                            }
                        });
                        this.releaseDialog = true;
                    }
                }

            },
            //确定释放库存
            confirm_release(arr){
                let releaseList = arr.map(row => {
                    return {
                        id: row.id,
                        quantity: row.release_qty
                    }
                });
                this.$http(api_stock_release_inventory, {releaseList: releaseList}).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.releaseDialog = false
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            show_detail(data) {
                data.show = !data.show;
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
                    };
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
            },
            get_status_name(val){
                if(this.detailData.status_txt === '待审核' || this.detailData.status_txt === '未提交'){
                    return this.detailData.status_txt
                }else{
                    return val
                }
            }
        },
        filters: {
            dataFilter(val){
                if(val === '' || val === null){
                    return '--'
                }else{
                    return val
                }
            },
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            }
        },
        watch: {
            dialog(val) {
                this.$emit('input', val)
            },
            value(val) {
                this.dialog = val;
            },
            checkedAll(val){
                let checkedArr = this.detailData.sku_list.filter(row => row.allocated_qty > 0);
                checkedArr.forEach(item => {
                    this.$set(item, 'checked', val)
                })
                // if(val){
                //     checkList.forEach(item => {
                //         this.$set(item, 'checked', true)
                //     })
                // }else{
                //     checkList.forEach(item => {
                //         this.$set(item, 'checked', false)
                //     })
                // }
            }
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
            dataLoading: {},
            value: {},
            title: {},
            detailData: {},
            checkShow: {},
            editShow: {},
            releaseShow: {}
        },
        components: {
            requestButton: require('@/global-components/request-button.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            checkFail: require('./check-fail.vue').default,
            plusMinus: require('@/components/plus-minus.vue').default,
            releaseInventory: require('./release-inventory').default
        }
    }
</script>
