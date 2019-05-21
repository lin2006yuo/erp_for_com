<template>
    <div class="c-activity-stock-table">
        <permission tag="ElButton"
                    type="primary"
                    size="mini"
                    :route="apis.url_local_stocking_create"
                    class="mt-xs mb-xs ml-sm"
                    @click.native="apply_stock">提交备货申请
        </permission>
        <el-table :data="tableData"
                  class="scroll-bar"
                  v-resize="{height: 41}"
                  border
                  @selection-change="select"
                  highlight-current-row
                  v-loading="loading">
            <el-table-column
                    align="center"
                    type="selection"
                    min-width="30">
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="申请单号">
                <div>
                    <ui-tip :content="row.number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="100"
                    inline-template
                    label="品类数/商品数">
                <div>{{row.sku_count}}/{{row.submit_quantity}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="60"
                    label="备货仓库">
                <div>{{row.warehouse}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="60"
                    label="备货平台">
                <div>{{row.channel}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="120"
                    label="活动时间">
                <div>{{row.start_time | dateFilter}}至{{row.end_time | dateFilter}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="60"
                    label="发起人">
                <div>{{row.creator}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="120"
                    label="发起时间">
                <div>{{row.submit_time | timeFilter}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="70"
                    label="待审核人">
                <div>{{row.valid_auditor}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="一级/二级/三级审核人">
                <div>
                    <div>{{row.auditor}}</div>
                    <div>{{row.auditor_2 || "--"}}</div>
                    <div>{{row.auditor_3 || "--"}}</div>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="130"
                    label="一级/二级/三级审核时间">
                <div>
                    <div>{{row.audit_time | timeFilter}}</div>
                    <div>{{row.audit_time_2 | timeFilter}}</div>
                    <div>{{row.audit_time_3 | timeFilter}}</div>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="110"
                    label="状态">
                <div style="position: relative">
                    <ui-tip :content="row.status_name" :width="98"></ui-tip>
                    <el-tooltip :content="row.not_passed_reason" placement="right" effect="light" v-if="row.status === 3">
                        <span class="error-icon"></span>
                    </el-tooltip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="操作" min-width="60">
                <div>
                    <permission tag="span" :route="apis.url_local_stocking_detail" class="operate" @click="get_look(row)">
                        查看
                    </permission>
                    <permission tag="span" :route="apis.url_local_stocking_adopt" v-if="row.status===1">|</permission>
                    <permission tag="span" :route="apis.url_local_stocking_adopt" class="operate" v-if="row.status===1"
                                @click="get_check(row)">审核
                    </permission>
                    <!--<permission tag="span" :route="apis.url_audit_log">|</permission>
                    <permission tag="span" :route="apis.url_audit_log" class="operate"
                                @click="look_log(row)">日志
                    </permission>-->
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="t-right"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <apply-stock v-model="applyVisible" @search="$listeners['search']"></apply-stock>
        <activity-look v-model="lookVisible"
                       @search="$listeners['search']"
                       :edit-data="editData"
                       :check-show="checkShow"
                       :trend-action="trendAction"></activity-look>
    </div>
</template>

<style lang="stylus">
    .c-activity-stock-table {
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
        api_local_stocking_adopt,
        api_local_stocking_detail,
        api_local_stocking_create,
        url_local_stocking_adopt,
        url_local_stocking_detail,
        url_local_stocking_create,
    } from "@/api/local-stocking";

    export default {
        permission: {
            url_local_stocking_adopt,
            url_local_stocking_detail,
            url_local_stocking_create,
        },
        data() {
            return {
                applyVisible: false,
                lookVisible: false,
                selectData: [],
                trendAction: {},
                editData: {
                    sku_list: [],
                },
                checkShow: false,
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
        },
        methods: {
            apply_stock() {
                this.applyVisible = true;
            },
            select(selection) {
                this.selectData = selection;
            },
            get_look(row) {
                this.trendAction = {
                    id: row.id,
                    title: `查看活动备货申请单：${row.number}`
                };
                this.$http(api_local_stocking_detail, row.id).then(res => {
                    res.sku_list.forEach(row => {
                        this.$set(row, 'show', false);
                        return row;
                    });
                    this.editData = res;
                    this.checkShow = false;
                    this.lookVisible = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            get_check(row) {
                this.trendAction = {
                    id: row.id,
                    title: `审核活动备货申请单：${row.number}`
                };
                this.$http(api_local_stocking_detail, row.id).then(res => {
                    this.editData = res;
                    this.editData.sku_list.forEach(row => {
                        row.quantity = row.quantity || row.submit_quantity;
                    });
                    this.checkShow = true;
                    this.lookVisible = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            }
        },
        props: {
            tableData: {},
            total: {},
            loading: {},
            searchData: {},
        },
        components: {
            applyStock: require('./apply-stock.vue').default,
            activityLook: require('./activity-look.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
        }
    }
</script>
