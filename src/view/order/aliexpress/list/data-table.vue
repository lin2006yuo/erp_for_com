<template>
    <el-row class="p-ali-order-table">
        <div class="mt-sm mb-sm">
            <el-button class="inline ml-sm" size="mini" type="primary" @click.native="showImport=true">导入</el-button>
            <el-button class="inline" type="primary" size="mini" @click.native="verification">手动核查订单</el-button>
            <permission
                    class="inline"
                    tag="request-button"
                    :mintime="200"
                    req-key="url_post_aliexpress_order_sysc"
                    :route="apis.url_post_aliexpress_order_sysc"
                    :disabled="selecteList.length===0"
                    @click="orders_sysc">同步平台订单
            </permission>
            <permission tag="trendsSelect"
                        class="inline ml-xs"
                        type="primary"
                        :route="apis.url_post_aliexpress_order_export"
                        :selects="partAllOptions"
                        @trigger="export_excel"></permission>

            <permission class="inline"
                        tag="request-button"
                        :mintime="200"
                        req-key="url_aliexpress_order_push_aliorder"
                        :route="apis.url_aliexpress_order_push_aliorder"
                        :disabled="disabledSystem"
                        @click="pull_system_order">推送至系统订单
            </permission>

            <el-button type="primary"
                       size="mini"
                       class="inline ml-sm"
                       @click.native="grab_order">抓取速卖通订单
            </el-button>
        </div>
        <!--数据table-->
        <ui-table  v-loading="isLoading" element-loading-text="玩命加载中..." :first-loading="firstLoading" :has-data="dataTable.lists.length>0" class="ali" v-model="checkAll" @sort-click="sort_click" :body-height="38" @check="checkAllBox"
                   :heads="[
                        {isCheck:true,size:23,},
                        {label:'订单号',width:8},
                        {label:'账号简称',width:3},
                        {label:'订单类型',width:4},
                        {label:'买家ID',width:4},
                        {label:'支付总额',width:3,isSort:true},
                        {label:'目的地',width:3},
                        {label:'平台发货状态',width:4,isSort:true},
                        {label:'付款状态|付款时间',width:3},
                        {label:'订单状态',width:3},
                        {label:'下单时间',width:3,isSort:true},
                        {label:'最迟发货时间',width:4,isSort:true},
                        {label:'放款金额',width:3},
                        {label:'放款时间',width:3},
                        {label:'退款金额',width:3},
                        {label:'操作',width:3},
                      ]"
        >
            <tbody>
            <template v-for="(data, index) in dataTable.lists">
                <tr :class="[clickData[index]?'active-color':'']" @click="addClass(index)">
                    <td>
                        <el-checkbox v-model="data.isCheck" @change="checkBox"></el-checkbox>
                    </td>
                    <!--订单号-->
                    <td style="text-align:left">
                        <plus-minus @show-detail="show_detail(data)" :show="data.show" :title="tipTitle"></plus-minus>
                        <ui-tip :content="data.order_id" :width="58"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="data.account_code" :width="68"></ui-tip>
                    </td>
                    <!--订单类型-->
                    <td>
                        <ui-tip :content="data.biz_type" :width="68"></ui-tip>
                    </td>
                    <!--买家ID-->
                    <td>
                        <ui-tip :content="data.buyer_login_id" :width="68"></ui-tip>
                    </td>
                    <!--支付总额-->
                    <td>{{data.currency_code}}&nbsp;{{data.total_money | filterPrice}}</td>
                    <!--目的地-->
                    <td>
                        <ui-tip :content="data.country_cn_name" :width="78"></ui-tip>
                    </td>
                    <!--发货状态-->
                    <td>
                        <times v-if="data.gmt_send_goods_time" :time="data.gmt_send_goods_time"></times>
                        <span v-else>未发货</span>
                    </td>
                    <!--付款状态-->
                    <td>
                        <div style="line-height: 14px;padding: 2px 0;">
                            <ui-tip :content="data.payStatus" :width="78"></ui-tip>
                            <times :time="data.gmt_pay_time"></times>
                        </div>
                    </td>
                    <td>
                        <ui-tip :content="data.order_status" :width="78"></ui-tip>
                    </td>
                    <!--下单时间-->
                    <td>
                        <times v-if="data.gmt_create" :time="data.gmt_create"></times>
                        <span v-else>未下单</span>
                    </td>
                    <!--最迟发货时间-->
                    <td>
                        <time-out :time="data.latest_ship_time" :cur-status="data.gmt_send_goods_time"></time-out>
                    </td>
                    <!--放款金额-->
                    <td>
                        <div v-if="data.loan_money > 0">{{data.currency_code}}&nbsp;{{data.loan_money | filterPrice}}</div>
                        <div v-else>--</div>
                    </td>
                    <!--放款时间-->
                    <td>
                        <times :time="data.loan_time"></times>
                    </td>
                    <!--退款金额-->
                    <td>
                        <div v-if="data.refund_money > 0">{{data.currency_code}}&nbsp;{{data.refund_money | filterPrice}}</div>
                        <div v-else>--</div>
                    </td>
                    <!--操作-->
                    <td>
                        <permission
                                tag="span"
                                :route="apis.url_aliexpress_check"
                                class="operate" @click="lookOver(data.order_id,data.gmt_create)">查看</permission>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold">
                        <td :rowspan="data.orderProductList.length+1"></td>
                        <td colspan="2">ItemId</td>
                        <td colspan="2">平台SKU</td>
                        <td colspan="6">商品名称</td>
                        <td>数量</td>
                        <td>出售价</td>
                        <td :rowspan="data.orderProductList.length+1"></td>
                    </tr>
                    <tr v-for="good in data.orderProductList">
                        <!--ItemId-->
                        <td colspan="2">
                            <ui-tip :content="good.product_id" :is-link="true" @cur-click="cur_click(good)"></ui-tip>
                            <!--<a class="link" :href="`https://www.aliexpress.com/item/lld/${good.product_id}.html`" target="_blank">{{good.product_id}}</a>-->
                        </td>
                        <!--平台SKU-->
                        <td colspan="2">
                            <ui-tip :content="good.sku_code" :width="78"></ui-tip>
                        </td>
                        <!--SKU-->
                        <!--<td > 暂无字段</td>-->
                        <!--商品名称-->
                        <td colspan="8">
                            <ui-tip :content="good.product_name" :width="78"></ui-tip>
                        </td>
                        <!--数量-->
                        <td>{{good.product_count}}</td>
                        <!--出售价-->
                        <td>{{good.price}}</td>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
        <!--分页-->
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="dataTable.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="dataTable.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="dataTable.totalSize">
        </el-pagination>
        <!--订单弹框-->
        <order-form v-model="orders" :form="form"></order-form>
        <import-excel v-model="showImport" @files-update="files_update"></import-excel>
        <verification-order v-model="verificationDialog" cur-platform="Aliexpress"></verification-order>
        <export-field :param="export_model_type"
                      v-model="exportVisable"
                      :fields="fields" :templates="templates"
                      @getTemplate="get_templates"
                      title="请选择自定义导出字段"
                      :fixparam="fixparam"
                      :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
        <grab-order-dialog v-model="grabDialog"
                           :form="grabOrderForm"
                           @grab="grab_ali_order">
        </grab-order-dialog>
    </el-row>
</template>
<style lang="stylus">
    .p-ali-order-table {
        .el-dropdown .el-button-group {
            display: inline-block;
            position: relative;
            top: 1px;
        }
        .ali {
            a:hover {
                font-size: 12px;
            }
            .ui-table-body {
                .template.secTable {
                    table-layout: fixed;
                    td {
                        .ali-hidden-id {
                            vertical-align: middle;
                            margin: 0 0;
                            display: inline-block;
                            width: 120px;
                            text-overflow: ellipsis;
                            word-break: keep-all;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                        .ali-hidden {
                            vertical-align: middle;
                            margin: 0 0;
                            display: inline-block;
                            width: 110px;
                            padding: 0 5px;
                            text-overflow: ellipsis;
                            word-break: keep-all;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                        .ali-hidden-xs {
                            vertical-align: middle;
                            margin: 0 0;
                            display: inline-block;
                            width: 80px;
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
    }

</style>
<script>
    import {downloadFile} from '../../../../lib/http';
    import orderForm from './order-form.vue';
    import {
        aliexpress_check,
        url_aliexpress_check,
        url_post_aliexpress_order_sysc,
        api_post_aliexpress_order_sysc,
        url_post_aliexpress_order_export,
        api_post_aliexpress_order_export,
        api_get_aliexpress_order_export_fields,
        url_aliexpress_order_push_aliorder,
        api_aliexpress_order_push_system_order,
        api_grab_aliexpress_order
    } from '../../../../api/aliexpress-order';
    import {api_goods_export_template} from "@/api/product-library";
    import grabOrderDialog from './grab-order-dialog'
    export default{
        permission:{
            url_aliexpress_check,
            url_post_aliexpress_order_sysc,
            url_post_aliexpress_order_export,
            url_aliexpress_order_push_aliorder
        },
        data(){
            return {
                verificationDialog:false,
                showImport:false,
                value1:"",
                shows:{},
                orders:false,
                form:{
                    logistics_amount:{},
                    order_id:0,
                    biz_type:"",
                    buyer_login_id:"",
                    receipt_address:[],
                    pay_amount:[],
                    payment_type:"",
                    gmt_pay_time:0,
                    orderProductList:[{
                        send_goods_time:"",
                    }],
                    content:[]
                },
                checkAll:false,
                clickData:[],
                tipTitle:"点击可查看 ItemId，平台SKU，商品名称，数量，出售价 等信息",
                partAllOptions: [
                    {name: "部分导出", value: 2},
                    {name: "全部导出", value: 1}
                ],
                exportVisable: false,
                export_model_type: {
                    type: 9
                },
                fields: [],
                templates: [],
                export_visible: false,
                export_type: '',
                grabDialog:false,
                grabOrderForm:{
                    account_id:'',
                    order_id:'',
                }
            }
        },
        filters:{
            filterSendTime(val){
                return datef('YYYY-MM-dd HH:mm:ss',val);
            },
            filterStatus(val){
                return val>0? datef('YYYY-MM-dd HH:mm:ss',val):"未发货"
            },
            filterPayment(val){
                return val ? datef('YYYY-MM-dd HH:mm:ss',val):"未付款"
            },
            filterPrice(val){
                return parseFloat(val).toFixed(2);
            },
            filterVal(val) {
                return val > 0 ? val : "--"
            },
        },
        mounted(){
            this.fix_list();
            for(let i=0;i<this.dataTable.lists.length;i++){
                this.clickData.push(false)
            }
            this.get_fields();
            this.get_templates();
        },
        computed:{
            selecteList(){
                return this.dataTable.lists.filter(data=>data.isCheck)
            },
            disabledSystem(){
                console.log(this.searchForm,'disabled');
                if((this.searchForm.orderStatus===3||this.searchForm.orderStatus===5)&&this.selecteList.length){
                    return false;
                }else {
                    return true;
                }
            }
        },
        methods:{
            fixparam(list) {
                return list.map(row => {
                    return {
                        field_name: row.show_field,
                        field_key: row.field
                    }
                });
            },
            order_export(params) {
                return this.$http(api_post_aliexpress_order_export, params).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                            page: this.dataTable.page,
                            pageSize: this.dataTable.pageSize,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.csv',
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve();
            },
            get_fields() {
                this.$http(api_get_aliexpress_order_export_fields).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 9}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_excel(val) {
                if (val.value === 2 && this.selecteList.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },
            creat_excel(param) {
                let data = '';
                switch (this.export_type) {
                    case 2://部分
                        data = {
                            ids: JSON.stringify(this.selecteList.map(row => {
                                if (typeof row === 'object') {
                                    return row.order_id
                                } else {
                                    return row
                                }
                            })),
                            export_type: this.export_type,
                            fields: param
                        };
                        Object.assign(data,this.getParams());
                        return this.order_export(data);
                        break;
                    case 1://全部
                        data = this.getParams();
                        this.$set(data, 'export_type', this.export_type);
                        this.$set(data, 'fields', param);
                        return this.order_export(data);
                        break;
                }
            },
            orders_sysc() {
                let data = this.selecteList.map(row => {
                    return {
                        account: row.account_id,
                        order_id: row.order_id
                    }
                });
                this.$http(api_post_aliexpress_order_sysc, {data: JSON.stringify(data)}).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit('sysc-success');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_post_aliexpress_order_sysc', false);
                    }, 200);
                });
            },
            verification(){
                this.verificationDialog = true;
            },
            files_update(){
                this.$emit('files-update');
            },
//            升降排序
            sort_click(val){
                this.$emit("sort-click",val);
            },
            cur_click(val){
                window.open(`https://www.aliexpress.com/item/lld/${val.product_id}.html`);
            },
//            -------------------------------------------------------订单页面 子列表
            fix_list(){
                this.dataTable.lists.forEach((data,i)=>{
                    this.$set(this.dataTable.lists[i], 'show',false);
                });
            },
            show_detail(data){
                data.show = data.show ? false : true;
            },
//           ------------------------------------------------------------分页改变
            handleSizeChange(size){
                this.$emit('size-change',size);
            },
            handleCurrentChange(page){
                this.$emit("page-change",page);
            },
//            ---------------------------------------------------------查看订单详情
            lookOver(order_id,time){
                let params = {
                    gmt_create:time,
                }
                this.$http(aliexpress_check,order_id,params).then(data=>{
                    this.form=data;
                });
                this.orders=true;
            },
//            -------------------------------------------------------- checkbox
            checkAllBox(val){
                this.dataTable.lists.forEach(row=>{
                    row.isCheck = val;
                });
            },
            checkBox(){
                this.checkAll =  this.dataTable.lists.every(row => row.isCheck === true);
            },
//            -------------------------------------------------------  添加class
            addClass(index){
                this.clickData=this.clickData.map(()=>{
                    return  false
                })
                this.clickData[index]=true
            },

            pull_system_order(){
                this.$confirm('将已勾选的订单推送至系统订单，确定进行此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = this.selecteList.map(row => {
                        return {order_id: row.order_id}
                    });
                    this.$http(api_aliexpress_order_push_system_order,{data: JSON.stringify(data)}).then(res=>{
                        this.$message({type: 'success', message: res.message || res});
                        this.$emit('sysc-success');
                    }).catch(code =>{
                        this.$message({message: code.message || code,type: 'error'});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('url_aliexpress_order_push_aliorder', false);
                        }, 200);
                    });
                }).catch(() => {
                    this.$message({type: 'info',message: '已取消推送'});
                });
            },
            grab_order(){
                this.grabDialog = true;
                this.grabOrderForm = {
                    account_id:'',
                    order_id:'',
                }
            },
            grab_ali_order(){
                let data = window.clone(this.grabOrderForm);
                let curString = this.grabOrderForm.order_id.replace(new RegExp(' ', 'gm'), '\n');
                let cur = curString.split('\n').filter(row => !!row);
                data.order_id = cur && cur.length > 1 ? cur.map(row => row.trim()) : cur.map(row => row.trim());
                this.$http(api_grab_aliexpress_order,data).then(res=>{
                    this.grabDialog = false;
                    this.$message({type: 'success',message: res.message});
                }).catch(code=>{
                    this.$message({message: code.message || code,type: 'error'});
                }).finally(() =>{
                    setTimeout(() =>{
                        this.$reqKey('aliexpressGrabDialog', false);
                    }, 200)
                })
            }
        },
        watch:{
            'dataTable.lists'(val) {
                if (val.length > 0) {
                    this.checkAll =  this.dataTable.lists.every(row => row.isCheck === true);
                } else {
                    this.checkAll = false;
                }
            }
        },
        props:{
            dataTable:{
                required:true,
                type:Object
            },
            isLoading:{
                required:true,
                type:Boolean
            },
            firstLoading:{
                required: true,
                type: Boolean
            },
            getParams:{},
            searchForm:{}
        },
        components: {
            orderForm,
            uiTable:require('../../../../components/ui-table.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            plusMinus:require('../../../../components/plus-minus.vue').default,
            timeOut:require('../../local/time-out.vue').default,
            importExcel: require('./import-excel.vue').default,
            verificationOrder:require('../../verification-order.vue').default,
            trendsSelect: require('@/components/trends-select').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../../report/export-dialog').default,
            grabOrderDialog
        }
    }
</script>
