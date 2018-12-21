<template>
    <div class="c-manual-orders-data-list relative">
        <color-tip></color-tip>
        <el-table
            class="scroll-bar"
            highlight-current-row
            :data="tableData.dataList"
            v-resize="{height:38}"
            style="width:100%"
            @selection-change="select_change"
            v-loading="isLoad"
            :row-class-name="row_class_name"
            element-loading-text="玩命加载中..."
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column label="订单号" inline-template :width="comStyle">
                <div class="align-left">
                    <ui-tip :content="row.order_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="平台/站点"
                             min-width="50"
                             inline-template show-overflow-tooltip>
                <div>{{row.channel_name}}/{{row.site}}</div>
            </el-table-column>
            <el-table-column
                min-width="45"
                label="账号简称" inline-template>
                <div>
                    <ui-tip :content="row.channel_account_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="买家ID" min-width="60" inline-template v-if="clientWidth">
                <div>
                    <ui-tip :content="row.buyer" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                min-width="40"
                label="销售员" inline-template>
                <div>
                    <ui-tip :content="row.seller" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="付款状态" min-width="45" inline-template>
                <div>
                    <times v-if="row.pay_status" :time="row.pay_status"></times>
                    <label v-else>未付款</label>
                </div>
            </el-table-column>
            <el-table-column label="交易号" min-width="60" inline-template>
                <div>
                    <ui-tip :content="row.transaction_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="支付总额" min-width="50" show-overflow-tooltip inline-template>
                <div>{{row.currency_code}} {{row.pay_fee | filterPrice}}</div>
            </el-table-column>
            <el-table-column label="运输方式" inline-template>
                <div>
                    <ui-tip :content="row.shipping_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="发货仓库"
                             min-width="50"
                             inline-template>
                <div>
                    <ui-tip :content="row.warehouse_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                min-width="40"
                label="发货状态" inline-template show-overflow-tooltip>
                <div>
                    <times v-if="row.shipping_status" :time="row.shipping_status"></times>
                    <label v-else>未发货</label>
                </div>
            </el-table-column>
            <el-table-column
                min-width="40"
                label="国家" inline-template>
                <div>
                    <ui-tip :content="row.country_cn_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="跟踪单号" min-width="80" inline-template>
                <div>
                    <ui-tip :content="row.shipping_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column min-width="45" label="下单时间" inline-template>
                <times :time="row.create_time"></times>
            </el-table-column>
            <el-table-column label="操作" inline-template width="100px">
               <trends-select class="inline" :selects="m_options(row)"  type="primary" @trigger="cur_operate(row,$event)"></trends-select>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="tableData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="tableData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total">
        </el-pagination>
        <form-mdf
                ref="formmfd"
                v-model="dialog"
                :mdfid="mdfId"
                :title="mdfTitle"
                :is-edit="isEdit"
                :is-hold="isHold"
                :btn-show="btnShow"
                :has-after-remark="hasAfterRemark"
                @click-number="click_number"
                @close-dialog="close_dialog"
                @cur-operate="cur_operate_g"
        ></form-mdf>
        <parcel-information
                v-model="informationVisble"
                :order="orderData"
                @view-order="view_order"
                @close-parcel="close_parcel"
        ></parcel-information>
    </div>
</template>
<style lang="stylus">
    .c-manual-orders-data-list {
        table.template td, .el-table td, table.template th, .el-table th {
            padding: 0;
            height: 26px;
            text-align: center;
            box-sizing: border-box;
            border-right: 1px solid #e0e6ed;
            border-bottom: 1px solid #e0e6ed;
        }
    }
</style>
<script>
    import{api_cancel_invalid} from '../../../api/order-local.js';
    export default{
        data(){
            return {
                dialog:false,
                mdfTitle:"",
                mdfId:0,
                isEdit:{edit:false},
                hasAfterRemark:false,
                isHold:false,
                btnShow:false,
                informationVisble:false,
                orderData:{},
                isShow:false,
            }
        },
        filters:{
            filterPay(val){
                 return val?datef("YYYY-MM-dd HH:mm:ss",val):"未付款";
            },
            filterPrice(val){
                return val?parseFloat(val).toFixed(2):'0:00'
            }
        },
        computed:{
            clientWidth(){
                if(document.body.clientWidth>1366){
                    return true;
                }else{
                    return false;
                }
            },
            comStyle(){
                return this.curWidth?`${this.curWidth}px`:"90px";
            },
            emptyText(){
                return this.isFirst?'等待请求数据中...':'暂无数据'
            }
        },
        methods:{
            click_number(val){
                this.orderData = val.orderData;
                this.informationVisble = val.informationVisble;
            },
            close_dialog(val){
                if(this.isShow) this.informationVisble = true;
            },
            view_order(val){
                this.mdfid = val.mdfid;
                this.dialog = val.mdfValue;
                this.mdfTitle = val.mdfTitle;
                this.isEdit = val.isEdit;
                this.btnShow = val.btnShow;
                this.informationVisble = false;
                this.isShow = true;
                this.$refs.formmfd.require_server(this.mdfid)
            },
            close_parcel(){
                this.isShow = false;
            },
            row_class_name(row,index){
                let cur = "";
                if(row.abnormal){
                    cur = `${cur} problem-color`;
                }
                if(row.status===4294967295){
                    cur = `${cur} cancel-color`;
                }
                return cur
            },
            m_options(row){
                return row.handleList.filter(row=>{
                    return  this.$hasPermission(row.apis)
                })
            },
            cur_operate_g(){
                this.$emit("cur-operate-g");
            },
            select_change(val){
                this.$emit("select-change",val)
            },
            cur_operate(data,options){
                this.mdfId = data.id;
                this.mdfTitle = "";
                this.$refs.formmfd.require_server(this.mdfId);
                switch(options.value){
                    case 1:
                        this.dialog = true;
                        this.isEdit = {edit:false};
                        this.mdfTitle = `查看订单：${data.order_number} 信息`;
                        this.hasAfterRemark = false;
                        this.btnShow = false;
                        this.isHold = false;
                        break;
                    case 2:
                        this.mdfTitle = `处理订单：${data.order_number} 信息`;
                        this.isEdit = {edit:true};
                        this.dialog = true;
                        this.hasAfterRemark = true;
                        this.btnShow = true;
                        this.isHold = true;
                        break;
                    case 3:
                        this.cancel_invalid(data.id);
                }
            },
//            取消作废
            cancel_invalid(id){
                this.$confirm('此操作将取消该订单作废, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_cancel_invalid,id).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.$emit('cancel-invalid');
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message||code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            size_change(size){
                this.$emit("size-change",size);
            },
            current_change(page){
                this.$emit("current-change",page);
            }
        },
        props:{
            tableData:{
                required:true,
                type:Object,
            },
            isLoad:{
                required:true,
                type:Boolean,
            },
            curWidth:{
                type:Number
            },
            isFirst:{
                required: true,
                type: Boolean
            }
        },
        components: {
            trendsSelect:require('../../../components/trends-select.vue').default,
            formMdf:require('./form-mdf.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            colorTip:require('../local/color-tip.vue').default,
            parcelInformation:require('../../entrepot/placeorder/parcel-information.vue').default,
        }
    }
</script>
