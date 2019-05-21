<template>
    <page-dialog v-model="visible" class="c-allocation-deliver" size="large" @open="open" @close="close"
                 :title="action.title">
        <table class="right-table mb-sm" cellpadding="0" cellspacing="0">
            <tr>
                <td width="150">调出仓库</td>
                <td width="150">{{editData.out_warehouse}}</td>
                <td width="150">调入仓库</td>
                <td width="150">
                    <span>{{editData.in_warehouse}}</span>
                </td>
                <td width="150">状态</td>
                <td width="150" style="position: relative">
                    {{editData.status_txt}}
                    <el-tooltip :content="row.reason" placement="right" effect="light"
                                v-if="editData.status === 2">
                        <span class="error-icon"></span>
                    </el-tooltip>
                </td>
                <td width="150">总箱数</td>
                <td width="150">
                    <span>{{editData.box_list.length}}</span>
                </td>
            </tr>
            <tr>
                <td width="150">创建人</td>
                <td width="150">{{editData.create}}</td>
                <td width="150">创建时间</td>
                <td width="150">{{editData.create_time || '--'}}</td>
                <td width="150">交接人</td>
                <td width="150">{{editData.deliver_user}}</td>
                <td width="150">交接时间</td>
                <td width="150">{{editData.deliver_time || '--'}}</td>
            </tr>
        </table>
        <el-row class="mt-xs mb-xs">
            <permission tag="requestButton"
                        req-key="api_allocation_shipping_deliver"
                        @click="batch_deliver"
                        :disabled="this.selectData.length === 0"
                        size="mini"
                        :route="apis.url_allocation_shipping_deliver">
                批量交货
            </permission>
        </el-row>
        <el-table :data="editData.box_list"
                  @selection-change="select_change"
                  class="scroll-bar"
                  v-resize="{height: 200}"
                  border
                  highlight-current-row>
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="箱子号" type="index">
            </el-table-column>
            <el-table-column label="箱唛" inline-template>
                <div>{{row.shipping_mark}}</div>
            </el-table-column>
            <el-table-column label="箱子重量（KG）" inline-template>
                <div>{{row.box_weight}}</div>
            </el-table-column>
            <el-table-column label="箱子体积" inline-template>
                <div>{{`${row.length}*${row.width}*${row.height}`}}</div>
            </el-table-column>
            <el-table-column label="状态" inline-template>
                <div>{{row.status_txt}}</div>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <permission tag="requestButton"
                                req-key="api_allocation_shipping_deliver"
                                @click="batch_deliver(row)"
                                class="mt-xs mb-xs"
                                :disabled="row.status !== 2"
                                size="mini"
                                :route="apis.url_allocation_shipping_deliver">
                        交货
                    </permission>
                </div>
            </el-table-column>
        </el-table>
        <div class="mt-xs">
            <label-item label="发货物流方式：" class="inline">
                <el-radio-group v-model="editData.shipping_type" :disabled="true">
                    <el-radio :label="1" class="ml-sm">空运</el-radio>
                    <el-radio :label="2" class="ml-sm">海运</el-radio>
                    <el-radio :label="4" class="ml-sm">快递</el-radio>
                    <el-radio :label="5" class="ml-sm">专线</el-radio>
                    <el-radio :label="3" class="ml-sm">其他</el-radio>
                </el-radio-group>
            </label-item>
            <label-item label="ReferenceID：" class="inline ml-sm">
                <span>{{editData.reference_id}}</span>
            </label-item>
            <div>
                <label-item label="物流渠道：" class="inline">
                    <span>{{editData.shipping_method}}</span>
                </label-item>

                <label-item label="运单号：" class="inline ml-sm">
                    <span>{{editData.tracking_number}}</span>
                </label-item>
            </div>
        </div>
        <div class="fl-clear">
            <span class="mb-sm inline">备注：</span>
            <el-input
                    type="textarea"
                    :rows="2"
                    :disabled="true"
                    placeholder="请输入内容"
                    v-model="editData.remark">
            </el-input>
        </div>
        <div slot="footer">
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-allocation-deliver {
        .right-table {
            width: 100%;
            border: 1px solid #d3dce6;
            td {
                text-align: center;
                border-bottom: 1px solid #d3dce6;
                border-right: 1px solid #d3dce6;
                height: 33px;
            }
            td:nth-child(2n+1) {
                font-weight: 700;
                background-color: #f5f7fa;
            }
        }
        .error-icon {
            display: inline-block;
            vertical-align: middle;
            width: 16px;
            height: 16px;
            background: url('../../../../assets/error-icon2.png') no-repeat center center;
            background-size: cover;
            &:hover {
                box-shadow: 0 0 10px rgba(105, 105, 105, 1);
                border-radius: 50%;
                transform: scale(1.1);
                -ms-transform: scale(1.1); /* IE 9 */
                -moz-transform: scale(1.1); /* Firefox */
                -webkit-transform: scale(1.1); /* Safari 和 Chrome */
                -o-transform: scale(1.1);
            }
        }
    }
</style>
<script>
    import {
        api_allocation_shipping_deliver,
        url_allocation_shipping_deliver,
    } from "@/api/allocation-shipping";
    import {api_allocation_detail} from "@/api/allocation-logistics";

    export default {
        permission: {
            url_allocation_shipping_deliver,
        },
        data() {
            return {
                visible: this.value,
                selectData: [],
            }
        },
        methods: {
            open() {

            },
            close() {
                this.selectData = [];
            },
            init() {
                this.$http(api_allocation_detail, {allocation_id: this.action.id}).then(res => {
                    this.editData = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            select_change(selection) {
                this.selectData = selection.filter(row => row.status === 2);
            },
            batch_deliver(row) {
                if(row) {
                    this.$confirm(`您将交接箱唛${row.shipping_mark},确认此操作吗？`, '提示', {
                      type: 'warning',
                      confirmButtonText: '确认',
                      cancelButtonText: '取消',
                    }).then(() => {
                        let data = {
                            allocation_id: this.action.id,
                            allocation_box_ids: [row.id],
                        };
                        this.deliver(data);
                    }).catch(()=> {
                      this.$message({type: 'info', message: '已取消'});
                    });
                } else {
                    this.$confirm(`您将交接选中的箱子,确认此操作吗？`, '提示', {
                        type: 'warning',
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                    }).then(() => {
                        let data = {
                            allocation_id: this.action.id,
                            allocation_box_ids: this.selectData.map(row => row.id),
                        };
                        this.deliver(data);
                    }).catch(()=> {
                        this.$message({type: 'info', message: '已取消'});
                    });
                }
            },
            deliver(data) {
                this.$http(api_allocation_shipping_deliver, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.init();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_allocation_shipping_deliver', false)
                    });
                })
            }
        },
        computed: {
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
            action: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
        }
    }
</script>