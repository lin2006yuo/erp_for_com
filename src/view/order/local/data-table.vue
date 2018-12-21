<template>
    <div class="relative">
        <color-tip></color-tip>
        <el-row>
            <ui-table v-loading="isLoad"
                      element-loading-text="玩命加载中..."
                      :has-data="tables.lists.length>0"
                      class="local"
                      v-model="checkAll"
                      @check="change_all"
                      @sort-click="sort_click"
                      :body-height="38"
                :heads="[
                    {isCheck:true,width:2},
                    {label:'订单号',width:15},
                    {label:'平台/站点',width:6},
                    {label:'账号简称',width:5},
                    {label:'买家ID',width:8},
                    {label:'销售员',width:4},
                    {label:'付款状态',width:6,isSort:true,type:'desc'},
                    {label:'支付总额',width:6,isSort:true,type:'desc'},
                    {label:'运输方式',width:7},
                    {label:'发货仓库',width:6},
                    {label:'发货状态',width:6},
                    {label:'目的地',width:6,isSort:true,type:'desc'},
                    {label:'跟踪单号',width:6},
                    {label:'最迟发货时间',width:9,isSort:true,type:'desc'},
                    {label:'操作',width:8}
                ]"
            >
                <tbody>
                    <template v-for="(order,index) in tables.lists">
                        <tr  :key="`${order.order_number}${index}${order.id}`" :class="[order.show ? 'active' : '',
                                        clickData[index]?'active-color':'',
                                        order.abnormal?'problem-color':'',
                                        order.status===4294967295?'cancel-color':'','left']"
                                        @click="addClass(index)">
                            <td>
                                <el-checkbox v-model="order.isCheck"></el-checkbox>
                            </td>
                                <!--订单号-->
                            <td class="align-left" nowrap="nowrap">
                                <plus-minus @show-detail="show(index, order)" :show="order.show" :title="tipTitle"></plus-minus>
                                <ui-tip :content="order.order_number" :width="80"></ui-tip>
                            </td>
                            <!--平台/站点-->
                            <td>
                                <ui-tip :content="orderfilter(order)" :width="98"></ui-tip>
                            </td>
                            <!--店铺ID-->
                            <td>
                                <ui-tip :content="order.channel_account_id" :width="98"></ui-tip>
                            </td>
                            <!--买家ID-->
                            <td>
                                <ui-tip :content="order.buyer" :width="98"></ui-tip>
                            </td>
                            <!--销售员-->
                            <td>
                                <ui-tip :content="order.seller" :width="98"></ui-tip>
                            </td>
                            <!--付款状态-->
                            <td>
                                <times :time="order.pay_status" v-if="order.pay_status"></times>
                                <label v-else>未付款</label>
                            </td>
                            <!--支付总额-->
                            <td>{{order.currency_code}} {{order.pay_fee | filterPrice}}</td>
                            <!--运输方式-->
                            <td>
                                <div class="p-table-list-td-text" :title="order.shipping_name">{{order.shipping_name}}</div>
                            </td>
                            <!--发货仓库-->
                            <td>
                                <ui-tip :content="order.warehouse_name" :width="98"></ui-tip>
                            </td>
                            <!--发货状态-->
                            <td>
                                <span v-if="order.delivery_type===2" :style="`color: ${isHighlight?`#FF00FF`:''};`">部分发货</span>
                                <times v-else-if="order.shipping_status" :time="order.shipping_status"></times>
                                <span v-else>未发货</span>
                            </td>
                            <!--目的地-->
                            <td>
                                <ui-tip :content="order.country_cn_name" :width="98"></ui-tip>
                            </td>
                            <!--下单时间-->
                            <td>
                                {{order.shipping_number}}
                            </td>
                            <td>
                                <!--最迟下单时间-->
                                <time-out :time="order.uploaded_deadline" :cur-status="order.shipping_status"></time-out>
                                <span v-if="order.delay_time>0">{{`(已延迟${order.delay_time}天)`}}</span>
                            </td>
                            <td>
                                <trends-select class="inline" @trigger="action(order,$event)" :selects="m_option(order)" type="primary"></trends-select>
                            </td>
                        </tr>
                        <template v-if="order.show">
                            <tr>
                                <th colspan="1" :rowspan="order_product(order).length + 1"></th>
                                <th>SKU图片</th>
                                <th>商品属性</th>
                                <th>商品状态</th>
                                <th>物流属性</th>
                                <th colspan="2">平台SKU</th>
                                <th colspan="2">SKU</th>
                                <th colspan="3">商品名称</th>
                                <th>ItemID</th>
                                <th>数量</th>
                                <th>出售价</th>
                            </tr>
                            <tr v-for="product in order_product(order)">
                                <!--sku图片-->
                                <td>
                                    <el-popover
                                            placement="right"
                                            trigger="hover">
                                        <img v-lazy="sku_image(product.sku_thumb)" width="200px" height="200px">
                                        <span slot="reference">
                                            <img v-lazy="product.sku_thumb" style="vertical-align:middle;height:60px;width:60px;border:none">
                                        </span>
                                    </el-popover>
                                </td>
                                <!--商品属性-->
                                <td>
                                    <ui-tip :content="product.attributes" :width="98"></ui-tip>
                                </td>
                                <!--商品状态-->
                                <td>{{product.status}}</td>
                                <!--物流属性-->
                                <td>{{product.properties}}</td>
                                <!--平台SKU-->
                                <td colspan="2">
                                    <ui-tip :content="product.channel_sku" :width="98"></ui-tip>
                                </td>
                                <!--SKU-->
                                <td colspan="2">
                                    <ui-tip :content="product.sku" :width="98"></ui-tip>
                                </td>
                                <!--商品名称-->
                                <td colspan="3">
                                    <ui-tip :content="product.sku_title" :width="98"></ui-tip>
                                </td>
                                <!--ItemID-->
                                <td>
                                    <ui-tip :content="product.channel_item_id" :is-link="true" @cur-click="cur_click(product)" :width="98"></ui-tip>
                                </td>
                                <!--数量-->
                                <td>{{product.sku_quantity}}</td>
                                <!--出售价-->
                                <td>
                                    <span v-if="product.sku_price">{{order.currency_code}} {{product.sku_price | filterPrice}}</span>
                                </td>
                            </tr>
                        </template>
                    </template>
                </tbody>
            </ui-table>
            <form-mdf
                    ref="formmfd"
                    :queue="[]"
                    :mdfid="mdfid"
                    :order_id="order_id"
                    v-model="mdfValue"
                    :is-edit="isEdit"
                    :has-after-remark="hasAfterRemark"
                    :title="mdfTitle"
                    @click-number="click_number"
                    @message-detail="message_detail"
                    :btn-show="btnShow"
                    :is-hold = "isHold"
                    @close-dialog="close_dialog"
                    @cur-operate="cur_operate"
            ></form-mdf>
            <parcel-information
                    v-model="informationVisble"
                    :order="orderData"
                    @view-order="view_order"
                    @close-parcel="close_parcel"
            ></parcel-information>

            <el-pagination
                    class="page-fixed"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="tables.page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size="tables.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tables.totalSize">
            </el-pagination>
        </el-row>
    </div>
</template>
<style lang="stylus">
    .local{
        .p-table-list-td-text{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .ui-table-body {
            .template.secTable {
                table-layout: fixed;

                td {
                    .local-hidden-id {
                        vertical-align: middle;
                        margin: 0 0;
                        display: inline-block;
                        width:130px;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .local-hidden {
                        vertical-align: middle;
                        margin: 0 0;
                        display: inline-block;
                        width:110px;
                        padding: 0 5px;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .local-hidden-xs{
                        vertical-align: middle;
                        margin: 0 0;
                        display: inline-block;
                        width:73px;
                        padding: 0 5px;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
            }
        }
    }

</style>
<script>
    import formMdf from './form-mdf.vue';
    import selectButtons from '../../../components/select-buttons.vue';
    import {api_order_product,api_get_speed,api_cancel_invalid} from '../../../api/order-local';
    export default{
        data(){
            return{
                detailAttrList:[],
                mdfid:0,
                order_id:0,
                mdfValue:false,
                checkAll:false,
                clickData:[],
                isEdit:{edit:false},
                hasAfterRemark:false,
                mdfTitle:"",
                btnShow:false,
                orderData:{},
                warning_pic:"../../assets/warning.png",
                tipTitle:"点击可查看 平台SKU，SKU，商品名称，ItemID，数量，出售价 等信息",
                isHold:"",
                informationVisble:false,
                isShow:false,
            }
        },
        mounted(){
            for(let i=0;i<this.tables.lists.length;i++){
                this.clickData.push(false)
            }
        },
        methods:{
            view_order(val){
                this.mdfid = val.mdfid;
                this.mdfValue = val.mdfValue;
                this.mdfTitle = val.mdfTitle;
                this.isEdit = val.isEdit;
                this.btnShow = val.btnShow;
                this.isShow = true;
                this.$refs.formmfd.require_server(this.mdfid)
            },
            click_number(val){
                this.orderData = val.orderData;
                this.informationVisble = val.informationVisble;
            },
            close_dialog(val){
                if(this.isShow) this.informationVisble = true;
            },
            close_parcel(){
                this.isShow = false;
            },
            message_detail(val){
                if(val.showBtn){
                    this.mdfid = val.mdfid;
                    this.order_id = val.order_id;
                    this.mdfValue = true;
                    this.mdfTitle = val.mdfTitle;
                    this.isEdit = {
                        edit:true
                    };
                    this.btnShow = true;
                    this.$refs.formmfd.require_server(this.mdfid);
                }else{
                    this.mdfid = val.mdfid;
                    this.order_id = val.order_id;
                    this.mdfValue = true;
                    this.mdfTitle = val.mdfTitle;
                    this.isEdit = {
                        edit:false
                    };
                    this.btnShow = false;
                    this.$refs.formmfd.require_server(this.mdfid);
                }
            },
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.');
                }
                return ""
            },
            m_option(row){
                return row.operateButtons.filter(res=>{
                    return this.$hasPermission(res.apis);
                })
            },
            orderfilter(order){
                return order.channel_name+"/"+order.site
            },
            cur_click(val){
                window.open(`${val.sku_url}`)
            },
            cur_operate(){
                this.$emit("cur-operate");
            },
            handleSizeChange(size){
                this.$emit("size-change",size);
            },
            handleCurrentChange(page){
                this.$emit("page-change",page);
            },

            action(data,options){
                this.mdfid = data.id;
                this.order_id = data.order_id;
                this.$refs.formmfd.require_server(this.mdfid);
                switch(options.value){
                    case 1:
                        this.mdfTitle = `查看订单：${data.order_number} 信息`;
                        this.isEdit = {edit:false};
                        this.mdfValue = true;
                        this.btnShow = false;
                        this.hasAfterRemark=false;
                        this.isHold = false;
                        break;
                    case 2:
                        this.mdfTitle = `处理订单： ${data.order_number} 信息`;
                        this.isEdit = {edit:true};
                        this.mdfValue = true;
                        this.btnShow = true;
                        this.hasAfterRemark=true;
                        this.isHold = true;
                        break;
                    case 4:
                        this.cancel_invalid(this.mdfid);
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
            change_all(val){
                this.tables.lists.forEach(row=>{
                    row.isCheck = val;
                });
                // this.$emit("check-box-change",this.activeData);
            },
//            表格升降序
            sort_click(val){
                this.$emit("sort-click",val);
            },
            show(index, order){
                order.show = !order.show;
                if(order.show&&(!order.product_list ||order.product_list.length<=0)){
                        this.$http(api_order_product, order.id).then(res=>{
                            this.$set(order,'product_list', res);
                        })
                }
            },
            order_product(order){
                return order.product_list || [];
            },
            addClass(index){
                this.clickData=this.clickData.map(()=>{
                        return  false
                    });
                this.clickData[index]=true
            },
        },
        filters:{
            dateFilter(val){
                return datef("YYYY-MM-dd HH:mm:ss",val);
            },
            filterStatus(val){
                return val===0?"未付款":datef("YYYY-MM-dd HH:mm:ss",val);
            },
            filterShipping(val){
                return val===0?"未发货":datef("YYYY-MM-dd HH:mm:ss",val);
            },
            filterTime(val){
                return datef("YYYY-MM-dd HH:mm:ss",val);
            },
            filterPrice(val){
                if(val){
                    return parseFloat(val).toFixed(2);
                }else{
                    return "";
                }
            },
        },
        computed:{
            activeData(){
                return(this.tables.lists&&this.tables.lists.length>0)? this.tables.lists.filter(row=>row.isCheck===true):[]
            },
        },
        watch:{
            activeData(val){
                val.length===0&&(this.checkAll = false);
                this.tables.lists.length>0&&val.length===this.tables.lists.length&&(this.checkAll = true);
                this.$emit("check-box-change",val);
            }
        },
        props:{
            tables:{
                required:true,
                type:Object
            },
            isLoad:{
                required:true,
                type:Boolean
            },
            isHighlight:{
                required:true,
                type:Boolean
            }
        },
        components:{
            selectButtons,
            formMdf,
            uiTable:require("../../../components/ui-table.vue").default,
            trendsSelect:require('../../../components/trends-select.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            plusMinus:require('../../../components/plus-minus.vue').default,
            colorTip:require('./color-tip.vue').default,
            timeOut:require('./time-out.vue').default,
            parcelInformation:require('../../entrepot/placeorder/parcel-information.vue').default,
        }
    }
</script>
