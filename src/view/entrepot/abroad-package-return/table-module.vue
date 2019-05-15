<template>
    <div class="abroad-package-return">
        <el-table
            :data="tableData"
            v-resize="{height:41}"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            ref="tableModule"
            class="scroll-bar"
            @selection-change="handle_selection_change"
            @row-dblclick="handle_row_click"
            highlightCurrentRow>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column label="包裹号" inline-template>
                    <div>
                        <ui-tip :is-operate="true" :content="row.package_number" :width="98"
                                @cur-click="parcel_information(row)"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="跟踪号" inline-template>
                    <div>
                        <ui-tip :is-operate="true" :content="row.package_number" :width="98"
                                @cur-click="parcel_information(row)"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="发货仓库" inline-template>
                    <div>
                        <ui-tip :is-operate="true" :content="row.package_number" :width="98"
                                @cur-click="parcel_information(row)"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="运输方式" inline-template>
                    <div>
                        <ui-tip :is-operate="true" :content="row.package_number" :width="98"
                                @cur-click="parcel_information(row)"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="退回单号" inline-template>
                    <div>
                        <ui-tip :content="row.package_return_number" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column inline-template label="平台/站点">
                    <div>
                        <ui-tip :content="`${row.channel_name}/${row.site_code}`" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="退货类型" inline-template>
                    <div>
                        <ui-tip :content="row.return_type" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="创建时间" inline-template min-width="90">
                    <div>
                        <ui-tip :content="row.create_time | filterTime" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column min-width="60" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   class="operat-color"
                                   size="mini"
                                   @click="look_package(scope.row)">查看
                        </el-button>
                    </template>
                </el-table-column>
        </el-table>
        <!-- 点击查看 -->
        <operating v-model="visible"
                   @parcel-information="parcel_information"
                   @show-order="show_order"
                   @mark-warehouse="storage_package"
                   @mark-reissued="mark_reissued"
                   ref="add_edit"
                   :operating-data="operatingData"
                   :action="action">
        </operating>
        <!-- 包裹信息 -->
        <parcel-information
                @close-parcel="close_parcel"
                v-model="informationVisble"
                @view-order="view_order"
                :order="order" />
        <!-- 订单信息 -->
        <form-mdf ref="formMdf"
                  :mdfid="mdfid"
                  v-model="mdfValue"
                  @close-dialog="close_dialog"
                  @click-number="click_number"
                  :is-edit="{edit:false}"
                  :title="mdfTitle" />
        <el-pagination
            class="page-fixed"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page="searchData.page"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="searchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
    import {

        api_get_detail,

    } from '@/api/package-return'
import {api_get_package, url_package} from '@/api/shipment';
export default {
    data() {
        return {
            emptyText: '暂无数据',
            informationVisble: false,
            order: {},
            isShow: false,
            visible: false,
            //查看
            operatingData: {},
            action: {},
            //订单
            mdfTitle: '',
            mdfid: 0,
            mdfValue: false,
            shippingAction: {},
            shippingVisible: false
        }
    },
    methods: {
        close_parcel() {
            this.isShow = false;
        },
        parcel_information(row) {
            if (this.$hasPermission(this.apis.url_package)) {
                this.$http(api_get_package, row.package_number).then(res => {
                    this.order.id = row.package_number;
                    this.informationVisble = true;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                    this.informationVisble = false;
                });
            } else {
                this.$message({
                    type: 'error',
                    message: '没有查看包裹详情详情的权限'
                });
            }
        },
        view_order(val) {
            this.mdfValue = true;
            this.mdfid = val.mdfid;
            this.mdfTitle = val.mdfTitle;
            this.informationVisble = false;
            this.isShow = true;
            this.$refs.formMdf.require_server(this.mdfid)
        },
        close_dialog(val) {
            if (this.isShow) this.informationVisble = true;
        },
        close_parcel() {
            this.isShow = false;
        },

        // 查看
        look_package(row) {
            this.action = {
                title: `查看包裹退回号 ${row.order_number}`,
                order_number: row.order_number,
                value: 'look',
                id: row.id
            };
            this.$http(api_get_detail, row.id).then(res => {
                this.operatingData = res;
                this.visible = true;
            }).catch(code => {
                this.$message({type: "error", message: code.message || code});
            })
        },
        show_order(row) {
            if (this.$hasPermission(this.apis.url_info)) {
                this.$refs.formMdf.require_server(row.order_id);
                this.mdfTitle = `查看订单号: ${row.order_number} 信息`;
                this.mdfid = row.order_id;
                this.mdfValue = true;
            } else {
                this.$message({
                    type: 'error',
                    message: '没有查看订单号详情的权限'
                });
            }
        },
        storage_package(row, package_number) {
            this.$confirm(`您将包裹${package_number}标记待入库,确认此操作吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http(api_post_waitstorage, row.id).then(res => {
                    let index = this.tableData.findIndex(item => {
                        return row.id === item.id;
                    });
                    if (index !== -1) {
                        this.tableData.splice(index, 1);
                    }
                    this.$message({type: "success", message: res.message || res});
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        mark_reissued(row, val2) {
            this.shippingAction = {
                id: row.id,
                value: 'send',
                shipping_id: val2.shipping_id,
                country_code: val2.country_code,
                number: val2.package_number,
            };
            this.shippingVisible = true;
        },

        //订单
        click_number(val) {
            this.order = val.orderData;
            this.informationVisble = true;
        },



        handle_size_change(val) {
            this.$emit('size-change', val)
        },
        handle_current_change(val) {
            this.$emit('current-change',val)
        },
        handle_selection_change(val) {
            this.$emit('selection-change', val)
        },
        handle_row_click(row) {
            this.$refs.tableModule.toggleRowSelection(row)
        }
    },
    filters: {
        filterTime(val) {
            return datef("YYYY-MM-dd HH:mm:ss", val);
        },
    },
    props: {
        searchData: {
            type: Object,
            require: true
        },
        tableData: {
            type:Array,
            require: true
        },
        loading: {
            default: false
        },
        total: {
            default: 0
        }
    },
    components: {
        parcelInformation: require('../placeorder/parcel-information').default,
        operating: require('../package-return/operating.vue').default,
        formMdf: require("../../order/local/form-mdf.vue").default,
    }
}
</script>
<style lang="stylus">
    .abroad-package-return{
        .el-table__empty-text {
            /*left: 18% !important;*/
            position: fixed;
            top :50%;
            left :50%;
        }
        .scroll-bar > .el-table__body-wrapper {
            overflow-x auto
        }
        .bold{
            font-weight: bold;
        }
    }
</style>
