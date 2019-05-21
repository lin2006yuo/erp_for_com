<template>
    <page class="table-list" style="">
        <mailing-method ref="mailing" @left-show-change="$listeners['left-show-change']">
            <!-- 按钮 -->
            <div slot="button-list">
                <el-checkbox v-model="checkedAll" @change="checked_all" style="margin-top:3px;padding-left:16px;">
                    所有页全选
                </el-checkbox>
                <el-button
                    class="inline ml-sm"
                    size="mini"
                    @click="batch_editing_carrier"
                    type="primary">批量修改Carrier</el-button>
                <permission tag="request-button"
                            class="ml-sm inline"
                            :route="apis.url_batch_virtual_tracking_virtual_number"
                            :mintime="200"
                            @click="batch_generate_tracking_number">批量生成虚拟跟踪号</permission>
            </div>
            <!-- 头部右侧-->
            <div style="line-height:26px;padding-top: 2px;float:right" slot="other">
                <permission v-if="isAliExpress" class="inline" tag="request-button" :route="apis.url_synchronizes_renew"
                            req-key="again_start"
                            @click="again_start">再次同步
                </permission>
                <permission class="inline" tag="request-button" :route="apis.url_overlook"
                            req-key="apis_url_overlook"
                            @click="overlook">忽略标记
                </permission>
                <permission class="inline s-width-middle"
                            tag="ElSelect"
                            :route="apis.url_syn_start"
                            v-model="setListValue">
                    <el-option v-for="(item, index) in setList" :label="item.label" :value="item.value"
                                :key="index"></el-option>
                </permission>
                <permission tag="ElDatePicker" :route="apis.url_syn_start"
                            v-if="setListValue==='synchronize_shipping_time'"
                            type="datetime" v-model="setTime"
                            @change="changeTime" placeholder="请选择"></permission>
                <div style="display: inline-block" v-if="setListValue==='add_time'">
                    <label>增加</label>
                    <permission class="inline" tag="ElSelect" :route="apis.url_syn_start" v-model="addTimes"
                                style="width: 100px;" @change="changeSet">
                        <el-option v-for="(item, index) in hList" :label="item.label" :value="item.value"
                                    :key="index"></el-option>
                    </permission>
                </div>
                <span>(仅适用于eBay)</span>
                <permission tag="request-button" :route="apis.url_syn_start"
                            req-key="apis_url_syn_start"
                            @click="syn_start">开始同步
                </permission>
            </div>
            <transport :transport-data="treeData"
                       @node-click="tree_node_click"
                       :isShowBtn="false"
                       slot="mailling-tree"
                       :loading="shippingLoading"
                       @title-click="$emit('title-clic')"
                       @hidden-left="$refs.mailing.showLeft(true)"
                       title-node="选择邮寄方式">
                <span style="cursor: pointer;font-size: 1.2rem;padding:7px 10px 4px 10px;display:block;" slot="all_data" @click="all_tree">全部({{treeCount}})</span>
            </transport>

            <!-- 表格 -->
            <el-table slot="goods-tabel"
                    v-loading="loading" element-loading-text="玩命加载中..."
                    :data="tableList"
                    @selection-change="handle_selection_change"
                    ref="tableList"
                    border
                    v-resize="{height:41}"
                    :default-sort="{prop: 'uploaded_deadline',order: 'descending'}"
                    highlight-current-row>
                <div slot="empty" class="no-data-reminder">
                    <i></i>
                    {{emptyText}}
                </div>
                <el-table-column
                        show-overflow-tooltip
                        :selectable="selectable"
                        type="selection"
                        width="30">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="最迟发货时间"
                        min-width="65"
                        prop="uploaded_deadline"
                        sortable
                        inline-template>
                    <div :class="{'problem-color':is_overtime(row)}">
                        <ui-tips :content="row | residuetime"></ui-tips>
                    </div>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="订单号"
                        min-width="130"
                        inline-template>
                    <ui-tips :width="98" :content="row.order_number" @click.native="click_order(row)" :is-operate="true"
                            style="cursor:pointer"></ui-tips>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="包裹号"
                        min-width="80"
                        inline-template>
                    <ui-tips :width="98" :content="row.package_number" style="cursor:pointer"
                            @click.native="parcel_information(row.package_number)" :is-operate="true"></ui-tips>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="订单状态"
                        min-width="50"
                        inline-template>
                    <ui-tips :content="row.status"></ui-tips>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="目的地"
                        min-width="55"
                        inline-template>
                    <ui-tips :content="row.country_code"></ui-tips>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="金额"
                        inline-template>
                    <ui-tips :content="row.pay_fee"></ui-tips>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="付款时间"
                        sortable
                        prop="pay_time"
                        inline-template>
                    <times :time="row.pay_time"></times>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="上传carrier"
                        inline-template>
                    <ui-tips :content="row.carrier"></ui-tips>
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        label="跟踪号/物流商单号/截取后的跟踪号"
                        inline-template>
                    <ui-tips class="local-shipping-number-style" :style="row.is_virtual===1?shippingNumberStyle:''" :content="row.shipping_number"></ui-tips>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="发货时间"
                        width="180px"
                        inline-template>
                    <el-date-picker style="width: 165px;" type="datetime"
                                    v-model="row.synchronize_shipping_time"></el-date-picker>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="最后同步时间"
                        inline-template>
                    <ui-tips style="cursor: pointer" :is-link="true" @click.native="viewLog(row)"
                            :content="row.synchronize_latest | isVarchar"></ui-tips>
                </el-table-column>
            </el-table>
        </mailing-method>
        <form-mdf ref="formMdf"
                    :mdfid="mdfid"
                    v-model="mdfValue"
                    :is-edit="false"
                    @close-dialog="close_dialog"
                    @click-number="click_number"
                    :title="mdfTitle"></form-mdf>
        <parcel-information
                @close-parcel="close_parcel"
                v-model="informationVisble"
                @view-order="view_order"
                :order="order"
        ></parcel-information>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page=this.tablePg.page
                :page-sizes="[20, 50,100, 200, 500]"
                :page-size=this.tablePg.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=this.tablePg.count>
        </el-pagination>
        <page-dialog :title="`同步${channelTitle}状态历史`" v-model="viewVisible" :loading="viewLoading" size="large" :close-on-click-modal="false">
            <p>订单号：{{rowNumber}}</p>
            <el-table :data="viewLogRow">
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        label="同步时间"
                        inline-template>
                    <span>{{row.synchronize_time | fdatetime}}</span>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="订单号"
                        inline-template>
                    <ui-tips :content="row.order_number"></ui-tips>
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        label="carrier"
                        inline-template>
                    <span>{{row.carrier}}</span>
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        label="跟踪号"
                        inline-template>
                    <span>{{row.tracking_number}}</span>
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        label="发货时间"
                        width="200px"
                        inline-template>
                    <span>{{row.shipping_time | fdatetime}}</span>
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        align="center"
                        label="同步结果"
                        inline-template>
                    <ui-tips :content="row.synchronize_result"></ui-tips>
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    label="同步日志"
                    inline-template>
                    <ui-tips :content="row.status|filterStatus"></ui-tips>
                </el-table-column>
            </el-table>
        </page-dialog>
        <batch-editing-carrier
            v-model="editingCarrierDialog"
            @submit="submit_editing_carrier">
        </batch-editing-carrier>
        <batch-generate-tracking-number
            ref="shipping-status"
            v-model="brushShipments"
            :channel-id="channelId"
            :form="brushForm"
            :order-id="orderId"
            @save="save_brush"
        ></batch-generate-tracking-number>
    </page>
</template>

<style lang="stylus">
    .table-list {
        padding:0 0 10px 0;        td,th{
            text-align center;
        }        .el-card__header {
            box-sizing: border-box;
            display: inline-block;
            color: #333;
            width: 100%;
            height: 32px;
            /*padding: 0 5px;*/
            line-height: 32px;
            font-size: 1.2rem;
            background: #6495ed;
            border: 1px solid #EFF5FB;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            border-bottom: 1px solid transparent;
        }
        .local-shipping-number-style a :hover{
            color: violet;
        }
        .el-table .el-tooltip.cell {
            min-width: 30px;
        }
        .el-card__body {
        }
        .el-table__body-wrapper {
            overflow-x: hidden;
            td,th {
                padding: 0;
            }
        }

    }
</style>
<script>
    import {
        api_synchronize_list, api_overlook, api_syn_start, api_history,api_synchronizes_renew,
        url_batch_virtual_tracking_virtual_number,
        url_synchronizes_renew,
        url_syn_start,
        url_overlook
    } from '../../../api/shipping-status'
    import parcelInformation from '../../entrepot/placeorder/parcel-information.vue';

    export default {
        permission: {
            url_synchronizes_renew,
            url_batch_virtual_tracking_virtual_number,
            url_syn_start,
            url_overlook
        },
        page: {},
        refresh() {
            this.searchData = {};
            this.init();
        },
        data() {
            return {
                mdfTitle: '',
                mdfid: 0,
                mdfValue: false,
                isOvertime: false,
                viewVisible: false,
                viewLoading:false,
                viewLogRow: [],
                rowNumber: '',
                setList: [
                    {label: "设置统一发货时间", value: 'synchronize_shipping_time'},
                    {label: "实际发货时间", value: 'pay_time'},
                    {label: "实际付款时间", value: 'add_time'}
                ],
                shippingNumberStyle:{
                  color:'violet',
                },
                hList: [
                    {label: '1', value: 1},
                    {label: '2', value: 2},
                    {label: '3', value: 3},
                    {label: '4', value: 4},
                    {label: '5', value: 5},
                    {label: '6', value: 6},
                    {label: '7', value: 7},
                    {label: '8', value: 8},
                    {label: '9', value: 9},
                    {label: '10', value: 10},
                    {label: '11', value: 11},
                    {label: '12', value: 12},
                    {label: '13', value: 13},
                    {label: '14', value: 14},
                    {label: '15', value: 15},
                    {label: '16', value: 16},
                    {label: '17', value: 17},
                    {label: '18', value: 18},
                    {label: '19', value: 19},
                    {label: '20', value: 20},
                    {label: '21', value: 21},
                    {label: '22', value: 22},
                    {label: '23', value: 23},
                    {label: '24', value: 24}
                ],
                setListValue: 'synchronize_shipping_time',
                checkedAll: false,
                synStart: [],
                orderId:[],
                channelId:[],
                addTimes: 0,
                setTime: '',
                informationVisble: false,
                order: {},
                channelTitle: '',
                isShow:false,
                brushShipments:false,
                editingCarrierDialog:false,
                brushForm:{
                    date_s:"",
                    date_e:"",
                    shipping_id:'',
                    warehouse_id:'',
                    channel_id:"",
                }
            }
        },
        filters: {
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            },
            filterStatus(val){
                switch (val) {
                    case 0:
                        return "无";
                    case 1:
                        return "同步成功";
                    case 2:
                        return '同步失败';
                }
            },
            isVarchar(val) {
                if (typeof val === 'string') {
                    return val;
                } else {
                    return datef("YYYY-MM-dd HH:mm:ss", val);
                }
            },
            residuetime(row) {
                let val = row.uploaded_deadline;
                if (row.synchronize_status === 0 || row.synchronize_status === 1 || row.synchronize_status === 2 || row.synchronize_status === 3) {
                    let times = (val * 1000 - new Date().getTime()) / 1000;
                    let day = 0, horus = 0, fen = 0;
                    if (times < 0) {
                        return "已超时"
                    } else {
                        day = Math.floor(times / 60 / 60 / 24);
                        horus = Math.floor((times - day * 60 * 60 * 24) / 60 / 60);
                        fen = Math.floor((times - day * 60 * 60 * 24 - horus * 60 * 60) / 60);
                        return `${day}天${horus}小时${fen}分`;
                    }
                } else if (row.synchronize_status === 4) {
                    return "已忽略"
                } else if (row.synchronize_status === 5) {
                    return "已标记"
                }
            }

        },
        methods: {
            /*批量生成虚拟订单*/
            batch_generate_tracking_number(){
                if(this.curId&&this.curId.length<=0){
                    this.$reqKey('url_batch_virtual_tracking_virtual_number',false);
                    return this.$message({type:"warning",message:"请选择需要批量生成的数据的数据"});
                }
                let channelId=this.synStart.map(row=>row.channel_id);
                if (channelId.every(item=>channelId[0]===item)) {
                    this.$reqKey('url_batch_virtual_tracking_virtual_number',false);
                    this.channelId=channelId[0];
                    this.brushShipments=true
                }else{
                    this.$reqKey('url_batch_virtual_tracking_virtual_number',false);
                    return this.$message({type:"warning",message:"只允许选择同一平台的订单"});
                }
            },
            save_brush(){
                this.$emit('syn_start');
            },
            all_tree(){
                this.$emit('all_tree-click');
            },
            tree_node_click(val){
                this.$emit('node-click', val);
            },
            view_order(val) {
                this.mdfValue = true;
                this.mdfid = val.mdfid;
                this.mdfTitle = val.mdfTitle;
                this.informationVisble = false;
                this.isShow = true;
                this.$refs.formMdf.require_server(this.mdfid)
            },
            click_number(val){
                this.order = val.orderData;
                this.informationVisble = true;
            },
            close_dialog(val){
              if(this.isShow) this.informationVisble = true;
            },
            close_parcel(){
                this.isShow = false;
            },
            click_order(row) {
                this.$refs.formMdf.require_server(row.id);
                this.mdfTitle = `查看订单号: ${row.order_number} 信息`;
                this.mdfid = row.id;
                this.mdfValue = true;
            },
            is_overtime(row) {
                let val = row.uploaded_deadline;
                let now = new Date().getTime() / 1000;
                if (row.synchronize_status !== 4 || row.synchronize_status !== 5) {
                    let times = Math.floor((val - now) / 86400);
                    return times < 1
                } else {
                    return false
                }
            },
            overlook() {
                if (this.synStart.length <= 0) {
                    this.$reqKey('apis_url_overlook',false);
                    this.$message({
                        type: 'error',
                        message: '请选择一条数据'
                    });
                    return false;
                }
                if (!this.checkedAll) {
                    let ids = [];
                    ids = this.synStart.map(row => {
                        return row.id;
                    });
                    this.$http(api_overlook, {order_id: ids}).then(res => {
                        this.$message({
                            showClose: true,
                            type: "success",
                            message: res.message || res
                        });
                        this.$emit('overlook');
                        this.synStart = [];
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('apis_url_overlook',false);
                        },200);
                    });
                } else {
                    this.$http(api_overlook, {where: this.where}).then(res => {
                        this.$message({
                            showClose: true,
                            type: "success",
                            message: res.message || res
                        });
                        this.$emit('overlook');
                        this.checkedAll = false;
                        this.synStart = [];
                    }).catch(code => {
                        this.checkedAll = false;
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('apis_url_overlook',false);
                        },200);
                    });
                }
            },
            syn_start() {
                if (this.synStart.length <= 0) {
                    this.$reqKey('apis_url_syn_start',false);
                    this.$message({
                        type: 'warning',
                        message: '请选择一条数据'
                    });
                    return false;
                }
                if (!this.checkedAll) {
                    let synData = this.synStart.map(row => {
                        return {
                            id: row.id,
                            carrier: row.carrier,
                            shipping_id: row.shipping_id,
                            tracking_number: row.shipping_number,
                            synchronize_shipping_time: Math.floor(row.synchronize_shipping_time / 1000),
                            warehouse_id: row.warehouse_id
                        }
                    });
                    this.$http(api_syn_start, {data: synData}).then(res => {
                        this.$reqKey('apis_url_syn_start',false);
                        this.$message({
                            showClose: true,
                            type: "success",
                            message: res.message || res
                        });
                        this.$emit("syn_start");
                        this.synStart = [];
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        }).finally(()=>{
                            setTimeout(()=>{
                                this.$reqKey('apis_url_syn_start',false);
                            },200);
                        });
                    })
                } else {
                    let synData = this.synStart.map(row => {
                        return {
                            id: row.id,
                            carrier: row.carrier,
                            tracking_number: row.shipping_number,
                            synchronize_shipping_time: Math.floor(row.synchronize_shipping_time / 1000),
                            warehouse_id: row.warehouse_id
                        }
                    });
                    this.$http(api_syn_start, {data: synData, where: this.where}).then(res => {
                        this.$message({
                            showClose: true,
                            type: "success",
                            message: res.message || res
                        });
                        this.$emit("syn_start");
                        this.checkedAll = false;
                        this.synStart = [];
                    }).catch(code => {
                        this.checkedAll = false;
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('apis_url_syn_start',false);
                        },200);
                    });
                }
            },
            /*再次同步*/
            again_start(){
                if (this.synStart.length <= 0) {
                    this.$reqKey('again_start',false);
                    this.$message({
                        type: 'warning',
                        message: '请选择一条数据'
                    });
                    return false;
                }
                let synData = this.synStart.map(row => row.id);
                this.$http(api_synchronizes_renew, {order_ids: synData}).then(res => {
                    this.$reqKey('again_start',false);
                    this.$message({
                        showClose: true,
                        type: "success",
                        message: res.message || res
                    });
                    this.$emit("syn_start");
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('again_start',false);
                        },200);
                    });
                })
            },
            handle_selection_change(selects) {
                this.synStart = selects;
                this.orderId=selects.map(item=>{
                    return item.id;
                })
            },
            handle_size_change(val) {
                this.$emit("size-change", val);
            },
            handle_current_change(val) {
                this.$emit("current-change", val);
            },
            checked_all() {
                this.$emit('checked-all', this.checkedAll)
            },
            set_status(row, status) {
                this.$refs.tableList.toggleRowSelection(row, status);
            },
            changeTime(val) {
                this.tableList.forEach(res => {
                    res.synchronize_shipping_time = val;
                });
            },
            changeSet(val) {
                this.tableList.forEach(res => {
                    res.synchronize_shipping_time = res.synchronize_shipping_time + val * 60 * 60 * 1000;
                });
            },
            //全选时
            selectable(row, index) {
                return !this.checkedAll;
            },
            viewLog(row) {
                this.viewLogRow = [];
                this.viewVisible = true;
                this.viewLoading = true;
                this.rowNumber = row.order_number;
                let index = this.channel.findIndex(res => {
                    return res.value === row.channel_id;
                });
                this.channelTitle = this.channel[index].label;
                this.$http(api_history, {order_id: row.id}).then(res => {
                    this.viewLogRow = res.data;
                    this.viewLoading = false;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                });
            },
            parcel_information(order) {
                this.order.id = order;
                this.informationVisble = true;
            },
            batch_editing_carrier(){
                if(this.synStart.length===0){
                    this.$message({type:'warning',message:'请勾选需要修改的数据！'});
                    return
                }
                this.editingCarrierDialog = true;
            },
            submit_editing_carrier(val){
                this.synStart.forEach(row=>{
                    row.carrier = val;
                });
                this.editingCarrierDialog = false;
            }
        },
        watch: {
            checkedAll(val) {
                if (val) {
                    this.tableList.forEach(row => {
                        this.$refs.tableList.toggleRowSelection(row, true);
                        this.synStart = this.tableList;
                    });
                } else {
                    this.tableList.forEach(row => {
                        this.$refs.tableList.toggleRowSelection(row, false);
                        this.synStart = [];
                    })
                }
            },
            setListValue:{
                immediate:true,
                handler(val){
                    if (val === "synchronize_shipping_time"&&!!this.setTime) {
                        this.tableList.forEach(res => {
                            res.synchronize_shipping_time = this.setTime;
                        });

                    }
                    if (val === 'pay_time') {
                        this.tableList.forEach(res => {
                            res.synchronize_shipping_time = res.shipping_time;
                        });
                    }
                    if (val === 'add_time'&&!!this.addTimes) {
                        this.tableList.forEach(res => {
                            res.synchronize_shipping_time = res.synchronize_shipping_time + this.addTimes * 60 * 60 * 1000;
                        });
                    }
                }
            }
        },
        computed: {
              emptyText(){
                  return this.isFirst?'等待请求数据中...':'暂无数据'
              }
        },
        props: {
            tableList: {
                required: true,
                type: Array
            },
            tablePg: {},
            loading: {},
            where: {},
            channel: {},
            shippingLoading:{
                type:Boolean,
                required:true
            },
            treeData:{
                required: true,
                type: Array
            },
            treeCount:{
                required: true,
                type: Number
            },
            isAliExpress:{},
            isFirst: {
                required: true,
                type: Boolean
            }
        },
        components: {
            parcelInformation,
            pageDialog: require("../../../components/page-dialog.vue").default,
            uiTips: require("../../../components/ui-tip.vue").default,
            formMdf: require("../local/form-mdf.vue").default,
            mailingMethod: require('../../../components/mailing-method.vue').default,
            batchGenerateTrackingNumber:require('./batch-generate-tracking-number.vue').default,
            // transport: require('../../../view/entrepot/delivery/transport.vue').default,
            batchEditingCarrier:require('./batch-editing-carrier').default,
            transport: require('@/components/transport.vue').default,
        }
    }
</script>

