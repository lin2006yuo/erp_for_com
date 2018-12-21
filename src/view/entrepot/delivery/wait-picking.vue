<template>
    <el-row class="p-table-list">
        <mailing-method ref="mailing" @left-show-change="$listeners['left-show-change']">
            <!-- 按钮 -->
            <div slot="button-list" class="ml-sm relative" style="height:28px;">
                <el-checkbox v-model="checkedall">所有页全选
                </el-checkbox>
                <permission tag="ElButton"
                            type="primary"
                            @click="distribution"
                            class="ml-sm"
                            size="mini" :route="apis.url_entrepot_select"> 分配库存
                </permission>
                <permission tag="ElButton" type="primary"
                            size="mini" @click.native="back_rule_before" :route="apis.url_back_rule">退回至自动规则执行前
                </permission>
                <el-button size="mini" @click.native="$emit('reload')" type="primary">刷新</el-button>
            </div>
            <!-- 头部右侧-->
            <div style="line-height:26px;float:right" slot="other">
                <color-tip></color-tip>
                <permission tag="ElSelect" v-model="warehouse_id" class="inline" @change="change_todepot"
                            :route="apis.url_entrepot_depot">
                    <el-option
                            :key="item.value"
                            v-for="item in changeWarehouses"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </permission>
                <template v-if="selectChange.length > 0">
                    <permission tag="ElButton" type="primary "
                                class="ml-xs  inline" size="mini"
                                @click="depot_change" :route="apis.url_entrepot_depot">
                        确认更改（{{selectChange.length}}）
                    </permission>
                    <permission tag="ElButton" type="warning"
                                class="ml-xs  inline" size="mini" @click="cancel"
                                :route="apis.url_entrepot_depot"> 取消
                    </permission>
                </template>
            </div>
            <!-- 邮寄方式列表 -->
            <transport :transport-data="transportData"
                       @node-click="click_tree"
                       :loading="transportLoading"
                       slot="mailling-tree"
                       @hidden-left="$refs.mailing.showLeft(true)"
                       @title-click="clearTransport"
                       :title-node="`运输方式--${dataLength}`">
            </transport>
            <!-- 表格 -->
            <el-table
                    slot="goods-tabel"
                    class="delivery-table"
                    ref="tableData"
                    :data="tableData"
                    border
                    highlight-current-row
                    v-loading="loading" element-loading-text="玩命加载中..."
                    style="width: 100% ;text-align: center;"
                    v-resize="{height:40}"
                    @selection-change="handle_selection_change"
                    :row-style="rowStyle">
                <el-table-column
                        :selectable="selectable"
                        type="selection"
                        align="center"
                        width="30px">
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="80"
                        label="包裹号">
                    <div>
                        <ui-tip :is-operate="true" :content="row.number" :width="98"
                                @cur-click="parcel_information(row.number)"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="订单号"
                        min-width="100"
                        inline-template>
                    <div>
                        <ui-tip :is-operate="true" :content="row.order_number" :width="98"
                                @cur-click="show_order(row)"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="包裹类型"
                        min-width="50" inline-template>
                    <div>
                        <ui-tip :content="row.type | package_type" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="买家"
                        min-width="80"
                        inline-template>
                    <div>
                        <ui-tip :content="row.buyer" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="发货仓库"
                        min-width="50"
                        inline-template>
                    <div>
                        <span :class="row.showRed?'color-red':''"> {{row.ware_house_name2 || row.ware_house_name }}</span>
                    </div>
                </el-table-column>
                <el-table-column
                        align="center"
                        min-width="150"
                        inline-template
                        label="邮寄方式">
                    <div>
                        <ui-tip :content="row.shipping_name2 || row.shipping_name" :width="98"
                                :class="row.showRed?'color-red':''"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        prop="country_code"
                        label="目的地"
                        min-width="40">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="花费金额（币种）"
                        min-width="70"
                        inline-template
                ><span>
                    {{row.order_amount | accountFilter}}({{row.currency_code}})
                </span>
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        inline-template
                        align="center"
                        label="最迟发货时间 "
                        min-width="80">
                    <div>
                        <time-out :time="row.uploaded_deadline" :cur-status="row.synchronize"></time-out>
                    </div>
                </el-table-column>
            </el-table>
        </mailing-method>
        <el-pagination
                class="all-right mt-xs"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page=this.tablepargm.page
                :page-sizes="[20, 50,100, 200]"
                :page-size=this.tablepargm.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=this.tablepargm.count>
        </el-pagination>
        <form-mdf ref="formMdf"
                  :mdfid="mdfid"
                  v-model="mdfValue"
                  :is-edit="false"
                  @close-dialog='close_dialog'
                  @click-number="click_number"
                  :title="mdfTitle"></form-mdf>
        <parcel-information
                v-model="informationVisble"
                :order="order"
                @view-order="view_order"
                @close-parcel='close_parcel'
        ></parcel-information>
    </el-row>
</template>
<style lang="stylus">
    .p-table-list {
        .el-card__header {
            box-sizing: border-box;
            display: inline-block;
            color: #fff;
            width: 100%;
            height: 32px;
            padding: 0 5px;
            line-height: 32px;
            font-size: 1.2rem;
            background: #6495ED;
            border: 1px solid #ddd;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            border-bottom: 1px solid transparent;
        }
        .el-table__body-wrapper {
            overflow-x: hidden;
        }
        .all-right {
            text-align: right;
        }
        .color-red a {
            color: red;
        }
        .delivery-table {
            .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
                background-color: #008BCE;
            }
        }
    }
</style>
<script>
    import {url_entrepot_select, url_back_rule, url_entrepot_depot} from "../../../api/entrepot-picking"
    import {url_package} from "../../../api/shipment"
    import parcelInformation from '../placeorder/parcel-information.vue';
    import {url_info} from '../../../api/order-local'

    export default {
        permission: {
            url_entrepot_select, url_back_rule, url_entrepot_depot, url_package, url_info
        },
        data() {
            return {
                //leftSpan: 4,
                checkedall: false,
                warehouse_id: "change",
                selecteds: [],
                options: [],
                mdfTitle: "",
                mdfid: 0,
                mdfValue: false,
                informationVisble: false,
                order: {},
            }
        },
        computed: {
            changeWarehouses() {
                return [{label: "改变仓库", value: "change"}, ...this.warehouses];
            },
            now() {
                return Math.ceil(new Date().getTime() / 1000);
            }
        },
        filters: {
            accountFilter(val) {
                return parseFloat(val).toFixed(2)
            },
            countFilter(val) {
                if (val === 0) {
                    return ""
                } else {
                    return "(" + val + ")"
                }
            },
            timedown(sec) {
                sec = Math.max(sec, 0);
                let d = Math.floor(sec / 86400);
                let h = Math.floor((sec - (d * 86400)) / 3600);
                let m = Math.floor((sec - (d * 86400) - (h * 3600)) / 60);
                return `还剩下：${d}天${h}时${m}分`;
            },
            package_type(type) {
                switch (type) {
                    case 1:
                        return '单品单件';
                    case 2:
                        return '单品多件';
                    case 4:
                        return '多品多件';
                    case 8:
                        return '含货品备注';
                }
            },
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            }
        },
        methods: {
            click_tree(data) {
                this.$emit('node-click', data);
            },
            clearTransport() {
                this.$emit('title-click');
            },
            view_order(val) {
                this.mdfValue = true;
                this.mdfid = val.mdfid;
                this.mdfTitle = val.mdfTitle;
                this.isShow = true;
                this.informationVisble = false;
                this.$refs.formMdf.require_server(this.mdfid)
            },
            click_number(val) {
                this.order = val.orderData;
                this.informationVisble = true;
            },
            close_dialog(val) {
                if (this.isShow) this.informationVisble = true;
            },
            close_parcel() {
                this.isShow = false;
            },
            // leftSpanSet() {
            //     if (this.leftSpan) {
            //         this.leftSpan = 0;
            //     } else {
            //         this.leftSpan = 4;
            //     }
            //     this.$emit('left-span', this.leftSpan);
            // },
            //改变选中
            handle_selection_change(selects) {
                this.selecteds = selects;
            },
            //分配
            distribution() {
                if (this.checkedall) {
                    this.$emit("distribution", "all")
                } else {
                    this.$emit("distribution", this.selecteds.map(val => val.id).join(","))
                }

            },
            rowStyle(row, index) {
                return (row.ready_allocation ? {
                    backgroundColor: '#ffa130'
                } : {});
            },
            //更改页条数
            handle_size_change(val) {
                this.$emit("size-change", val);
                console.log(`每页 ${val} 条`);
            },
            //更改当前页
            handle_current_change(val) {
                this.$emit("current-change", val);
                console.log(`当前页: ${val}`);
            },
            change_select() {

            },
            //全选时
            selectable(row, index) {
                if (row.ready_allocation) {
                    return false;
                }
                return !this.checkedall;
            },
            //更改仓库下拉框时
            change_todepot(select) {
                if (select !== "change" && this.selecteds.length > 0) {
                    let warehouse = this.changeWarehouses.find(opt => {
                        return opt.value === select
                    });
                    this.selecteds.forEach(item => {
                        let obj = {
                            id: item.id,
                            label: warehouse.label,
                            value: warehouse.value,
                        };
                        if (warehouse.value === item.warehouse_id) {
                            let index = this.selectChange.indexOfFun((val) => {
                                return val.id === item.id;
                            });
                            index >= 0 && this.selectChange.splice(index, 1);
                            return;
                        }
                        let indexOf = this.selectChange.findRetInd((change) => {
                            if (change.id === item.id) {
                                if (warehouse.value === item.value) {
                                    return 1;
                                } else {
                                    return 2;
                                }
                            } else {
                                return false;
                            }
                        });
                        if (indexOf) {
                            if (indexOf.result === 1) {
                                this.selectChange.splice(indexOf.index, 1);
                            } else {
                                this.selectChange.splice(indexOf.index, 1, obj);
                            }
                        } else {
                            this.selectChange.push(obj);
                        }
                    });
                    this.$emit("change-todepot", this.selectChange);
                    this.$nextTick(() => {
                        this.warehouse_id = "change";
                    })
                } else if (select !== "change" && this.selecteds.length === 0) {
                    this.$message('请选择数据');
                    this.$nextTick(() => {
                        this.warehouse_id = "change";
                    })
                } else {

                }
            },

            back_rule_before() {
                if (this.checkedall) {
                    this.$emit("back-rule-before", "all");
                } else {
                    this.$emit("back-rule-before", this.selecteds.map(val => val.id).join(","));
                }
            },
            //取消
            cancel() {
                this.$emit("cancel");
            },
            //点击更改仓库时
            depot_change() {
                this.$emit("depot-change");
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
            //点击包裹号
            parcel_information(order) {
                if (this.$hasPermission(this.apis.url_package)) {
                    this.order.id = order;
                    this.informationVisble = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看包裹详情详情的权限'
                    });
                }

            }
        },
        watch: {
            checkedall(val) {
                if (val) {
                    this.tableData.forEach(row => {
                        if (row.ready_allocation) return;
                        this.$refs.tableData.toggleRowSelection(row, true);
                    })
                } else {
                    this.tableData.forEach(row => {
                        if (row.ready_allocation) return;
                        this.$refs.tableData.toggleRowSelection(row, false);
                    })
                }
            },
            tableData(val) {
                if (this.checkedall) {
                    this.tableData.forEach(row => {
                        this.$nextTick(() => {
                            this.$refs.tableData.toggleRowSelection(row, true);
                        })
                    })
                } else {
                    this.tableData.forEach(row => {
                        this.$refs.tableData.toggleRowSelection(row, false);
                    })
                }
            },
            tableDepot(val) {
                this.$nextTick(() => {
                    this.options = [{"label": "更改发货仓库", value: "change"}];
                    this.options = this.options.concat(this.tableDepot);
                })
            },
        },
        props: {
            tableData: {
                required: true,
                type: Array
            },
            tablepargm: {
                required: true,
                type: Object
            },
            tableDepot: {
                required: true,
                type: Array
            },
            selectChange: {
                required: true,
                type: Array
            },
            loading: {
                required: true,
                type: Boolean
            },
            warehouses: {
                required: true,
                type: Array
            },
            transportData: {
                required: true,
                type: Array
            },
            dataLength: {
                require: true
            },
            transportLoading: {},
        },
        components: {
            formMdf: require("../../order/local/form-mdf.vue").default,
            uiTip: require('@/components/ui-tip.vue').default,
            parcelInformation,
            timeOut: require('../../order/local/time-out.vue').default,
            transport: require('@/components/transport.vue').default,
            mailingMethod: require('@/components/mailing-method.vue').default,
            colorTip: require('./color-tip.vue').default
        }
    }
</script>
