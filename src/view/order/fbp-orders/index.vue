<template>
    <page>
        <search-card class="mb-sm" @search="goSearch" @enter="goSearch" :params="searchData" :clears="clears">
            <el-row class="mb-mini">
                <label-item label="账号简称：" class="ml-xs">
                    <el-select filterable clearable
                               class="s-width-default"
                               v-sf.account_id
                               v-model="searchData.account_id">
                        <el-option v-for="item in accoutOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="时间粒度：" class="ml-sm inine">
                    <el-radio class="radio" v-model="radio" label="day">日</el-radio>
                    <el-radio class="radio" v-model="radio" label="month">月</el-radio>
                </label-item>
                <label-item label="统计日期：" class="ml-sm inline" v-show="dateVisible">
                    <el-date-picker
                            v-model="searchData.date_b"
                            type="date"
                            placeholder="选择日期"
                            class="inline "
                            v-sf.date_b
                            style="width:120px"
                            :picker-options="inputTimeStart">
                    </el-date-picker>
                    <label>&nbsp;--&nbsp;</label>
                    <el-date-picker
                            v-model="searchData.date_e"
                            type="date"
                            placeholder="选择日期"
                            class="inline"
                            v-sf.date_e
                            style="width:120px"
                            :picker-options="inputTimeEnd">
                    </el-date-picker>
                </label-item>
            </el-row>
            <label-item>
                <el-select class="inline width-xs ml-xs"
                           v-sf.snType
                           v-model="searchData.snType">
                    <el-option v-for="item in connds"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <el-input class="inline ml-sm"
                          v-sf.snText
                          :placeholder="`请输入${changeLabel}...`"
                          v-model="searchData.snText"
                          @keyup.enter.native="keyUp_enter($event)"></el-input>
            </label-item>
            <label-item label="订单金额：" class="ml-sm">
                <el-input
                        v-model="searchData.amount_b"
                        class="inline freight s-width-mini"
                        v-sf.amount_b
                        @keyup.enter.native="keyUp_enter($event)"
                        type="number"></el-input>
                <label>&nbsp;--&nbsp;</label>
                <el-input v-model="searchData.amount_e"
                          class="inline freight s-width-mini mr-sm"
                          v-sf.amount_e
                          @keyup.enter.native="keyUp_enter($event)"
                          type="number"></el-input>
            </label-item>
        </search-card>
        <el-card ref="tableCard"
                 v-loading="loading"
                 element-loading-text="玩命加载中">
            <div class="chart-top" ref="chart-top">
                <permission tag="trendsSelect"
                            class="inline ml-sm p-btn-select"
                            type="primary"
                            :route="apis.url_manual_orders_export"
                            :selects="partAllOptions"
                            @trigger="export_sku">
                </permission>
                <span class="fr">
                    当日销售额：<span class="mr-sm ml-sm">¥</span><span class="redColor">{{report | todaySaleroom}}</span>
                    日均销售额：<span class="mr-sm ml-sm">¥</span><span class="redColor">{{daySale}}</span>
                </span>
            </div>
            <el-row ref="chart">
                <el-col :span="24">
                    <sale :report="report"></sale>
                </el-col>
            </el-row>
            <div class="mt-sm checkAll" ref="checkAll">
                <el-checkbox label="所有页全选" v-model="checkAll"></el-checkbox>
            </div>
            <el-table
                    ref="table"
                    :data="tableData"
                    border
                    class="scroll-bar"
                    v-resize="{height:38}"
                    @selection-change="handle_selection_change"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        :selectable="selectable"
                        width="35">
                </el-table-column>
                <el-table-column
                        min-width="130"
                        inline-template
                        label="订单号">
                    <div>
                        <ui-tip :content="row.order_id" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="买家ID">
                    <div>
                        <ui-tip :content="row.customer_id" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="收货人国家">
                    <div>
                        <ui-tip :content="row.country" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                    inline-template
                    label="产品数量（个）"
                    min-width="60">
                    <div>
                        <ui-tip :width="98" :content="row.number"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="订单金额">
                    <div>
                        <ui-tip :content="`${Number(row.amount).toFixed(2)}`" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        width="100"
                        label="订单费用">
                    <div>
                        <ui-tip :content="Number(row.shipping_cost).toFixed(2)" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        width="110"
                        inline-template
                        label="付款日期">
                    <times :time="row.pay_time"></times>
                </el-table-column>
                <el-table-column
                        min-width="70"
                        label="图片">
                    <template slot-scope="scope">
                        <el-popover
                                placement="right"
                                trigger="hover">
                            <!--<img v-lazy="sku_image(scope.row.sku_thumb)" width="200px" height="200px">-->
                            <!--<span slot="reference">-->
                                    <!--<img v-lazy="scope.row.sku_thumb" v-if="scope.row.sku_thumb" height="60px" width="60px" style="border:none;vertical-align: middle">-->
                                <!--</span>-->
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="120"
                        label="Item Id">
                    <div>
                        <!--<ui-tip :content="row.sku" :width="98"></ui-tip>-->
                    </div>
                </el-table-column>
                <el-table-column
                        min-width="200"
                        label="SKU别名">
                    <template slot-scope="scope">
                        <span>{{scope.row.sku}}</span>
                        <img src="../../../assets/echart.png" class="png fr" @click="sales_chart(scope.row)" style="padding-right: 14px;" width="22" height="22" title="点击可查看图表详情">
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <sales-volume v-model="salesVisible" :sale-volume="saleVolume"></sales-volume>
        <export-field  v-model="exportVisable" :fields="fields"
                       :templates="templates"
                       :param="export_model_type"
                       title="请选择自定义导出字段"
                       :creat-excel="creat_excel"
                       @getTemplate="get_templates">
        </export-field>
        <export-queue-tip v-model="export_visible"></export-queue-tip>
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
    </page>
</template>

<style lang="stylus">
    .redColor {
        color: #e4393c;
    }
    .checkAll{
        padding: 5px;
        border: 1px solid #e0e6ed;
        background-color: rgb(239, 242, 247);
    }
    .chart-top{
        line-height: 26px;
    }
</style>

<script>
    import labelItem from '../../../components/label-item.vue';
    import labelItems from '../../../components/label-items.vue';
    import salesVolume from './sales-volume.vue';
    import {downloadFile} from '../../../lib/http';
    import {api_goods_export_field,api_goods_export_template} from "@/api/product-library"
    import {api_fbp_orders_list, api_fba_orders_detail, api_fbp_orders_report, api_account_list,
        api_fba_chart_data,api_fbp_export,api_fbp_field} from '../../../api/fbp-orders';
    import {
        url_manual_orders_export,
    } from '../../../api/handwork';
    import {api_export_title,} from '../../../api/after-sale';
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'张文宇',
                createTime:'2017-7-14',
                updateTime:'2017-8-16'
            }
        },
        permission: {
            url_manual_orders_export
        },
        refresh(){
            this.init();
        },
        data(){
            return {
                selectList:[],
                export_type:'',
                export_model_type:{
                    type:22
                },
                partAllOptions: [
                    {name: "部分导出", value: 0},
                    {name: "全部导出", value: 1}
                ],
                export_visible:false,
                fields:[],
                templates:[],
                loading:false,
                siteOptions:[],
                accoutOptions:[],
                exportFlag:false,
                selects:[],
                radio:'day',
                tableHeight:'',
                exportVisable:false,
                searchData:{
                    account_id:'',
                    snType:'sku',
                    snText:'',
                    amount_b:'',
                    amount_e:'',
                    page:1,
                    pageSize:20,
                    date_b:(Date.now()-(7*24*60*60*1000)),
                    date_e:Date.now(),
                },
                clears:{
                    account_id:'',
                    snType:'sku',
                    snText:'',
                    amount_b:'',
                    amount_e:'',
                    page:1,
                    pageSize:20,
                    date_b:(Date.now()-(7*24*60*60*1000)),
                    date_e:Date.now(),
                },
                connds:[
                    {label:'SKU',value:'sku'},
                    {label:'产品名称',value:'sku_title'},
                    {label:'订单号',value:'order_number'},
                ],
                tableData:[],
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_e){
                            return time.getTime() > this.searchData.date_e||time.getTime() <this.searchData.date_e-180*24*60*60*1000;
                        }else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_b){
                            return time.getTime() < this.searchData.date_b||time.getTime() > this.searchData.date_b+180*24*60*60*1000
                        }else {
                            return false
                        }
                    }
                },//结束时间
                salesVisible:false,//商品销售情况表是否可见
                dateVisible:true,//统计日期是否可见
                checkAll:false,
                orderVisible:false,//订单号详情是否可见
                total:0,
                //销售额
                report:[],
                loadingChart:false,//加载echart
                daySale: 0,//每天的销售额
                saleVolume:{
                    channel_id:'',
                    sku_id:'',
                    warehouse_id:''
                },//某个商品的销售
                orderDetail:{
                    order_number:'',
                    list:[]
                },//订单号详情
            }
        },
        mounted(){
            this.init();
            this.get_report();
            this.get_fields();
            this.get_templates();
            this.get_accountOptions();
        },
        filters:{
            todaySaleroom(val){
                if(val.length > 0){
                    return (val[val.length-1].amount).toFixed(2);
                }
            }
        },
        methods: {
            creat_excel(param){
                let fields = param.field.join(',');
                let data = '';
                switch (this.export_type) {
                    case 0://部分
                        data = {
                            ids: this.selectList.map(row => {
                                return row.id
                            }),
                            export_type: this.export_type
                        };
                        Object.assign(data, this.init_params());
                        return this.order_export(data, {
                            'X-Result-Fields': fields,
                            contentType: 'application/x-www-form-urlencoded'
                        });
                        break;
                    case 1://全部
                        data = this.init_params();
                        this.$set(data, 'export_type', this.export_type);
                        return this.order_export(data, {
                            'X-Result-Fields': fields,
                            contentType: 'application/x-www-form-urlencoded'
                        });
                        break;
                }
            },
            order_export(params, head) {
                return this.$http(api_fbp_export, params, head).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                            page: this.tableData.page,
                            pageSize: this.tableData.pageSize,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve()
            },
            get_templates(){
                this.$http(api_goods_export_template,{type:22}).then(res=>{
                    res.forEach(row=>{
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type:"error",message:code.message||code})
                });
            },
            get_fields(){
                this.$http(api_fbp_field).then(res=>{
                    this.fields=res
                }).catch(code => {
                    this.$message({type:"error",message:code.message||code})
                });
            },
            export_sku(val) {
                if (val.value === 0 && this.selectList.length <= 0) {
                    this.$message({
                        type: "warning",
                        message: "请先选择需要导出的数据"
                    });
                }else if(val.value ===1 && this.tableData.length === 0){
                    this.$message({
                        type: "warning",
                        message: "列表无数据"
                    });
                }else{
                    this.export_type = val.value;
                    this.exportVisable = true;
                }

            },
            handle_selection_change(val){
                this.selectList = val;
            },
            init_params(){
                let data=clone(this.searchData);
                //去掉搜索信息前后的空格
                data.snText = data.snText.replace(/(^\s*)|(\s*$)/g, "");
                if(this.radio === 'day'){
                    //处理年月日 YYYY-MM-dd
                    if(this.searchData.date_b){
                        data.date_b=datef('YYYY-MM-dd', this.searchData.date_b/1000);
                    }else {
                        data.date_b='';
                    }
                    if(this.searchData.date_e){
                        data.date_e=datef('YYYY-MM-dd', this.searchData.date_e/1000);
                    }else {
                        data.date_e='';
                    }
                } else {
                    let myDate = new Date();
                    data.date_b = `${myDate.getFullYear()}-${myDate.getMonth()-2}-01`;
                    data.date_e = `${myDate.getFullYear()}-${myDate.getMonth()+1}-01`;
                }
                return data;
            },
            get_report(){
                let report = this.init_params();
                if(!this.searchData.date_b||!this.searchData.date_e){
                    return this.$message({type:"info",message:'统计开始时间与结束时间必选'})
                }
                if(this.searchData.amount_b > this.searchData.amount_e){
                    return this.$message({type:"info",message:'初始金额不能大于结束金额'})
                }
                this.loading = true;
                this.$http(api_fbp_orders_report, report).then(res=>{
                    this.loading = false;
                    this.report = res;
                    let total = 0;
                    for(let i = 0; i<res.length; i++){
                        total += res[i].amount;
                    }
                    this.daySale = (total / res.length).toFixed(2);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            init(){
                this.loading = true;
                //TODO: 这个表格的最大高度只能是从大变小不能从小变大 还不能自适应有待解决
                this.tableHeight = this.$refs.tableCard.$el.offsetHeight - this.$refs.checkAll.offsetHeight - this.$refs.chart.$el.offsetHeight;
                let data = this.init_params();
                this.$http(api_fbp_orders_list, data).then(res=>{
                    this.loading = false;
                    this.total = res.count;
                    this.tableData = res.data;
                    if (this.checkAll) {
                        this.$nextTick(() => {
                            this.tableData.map(row => {
                                this.$refs.table.toggleRowSelection(row, true);
                            })
                        })
                    }
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.');
                }
                return ""
            },
            goSearch(){
                this.init();
                this.get_report();
            },
            clearSearch(){
                Object.keys(this.searchData).forEach(key=>{
                    this.searchData[key] = "";
                });
                this.searchData.snType = 'sku';
                this.searchData.page = 1;
                this.searchData.pageSize = 20;
                this.searchData.date_b = (Date.now()-(7*24*60*60*1000));
                this.searchData.date_e = Date.now();
                this.init();
            },
            //查看每一个货物的销售情况
            sales_chart(row){
                this.salesVisible = true;
                this.saleVolume = {
                    sku: row.item.sku,
                    channel_id: row.channel_id,
                    sku_id: row.item.sku_id,
                    warehouse_id: row.warehouse_id
                };
            },
            //获取账号信息
            get_accountOptions(){
                this.searchData.account_id = '';
                this.$http(api_account_list,{channel_id:22}).then(res=>{
                    if(res.account.length>0){
                        res = res.account;
                        this.accoutOptions = [{label:"全部",value:""},...res];
                    }else{
                        this.accoutOptions = [];
                    }
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.goSearch()
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.goSearch();
            },
            selectable(){
                return !this.checkAll;
            },
            //按下回车搜索
            keyUp_enter(ev) {
                if(ev.keyCode===13){
                    this.goSearch();
                }
            },
        },
        watch: {
            radio(val){
                if(val === "day"){
                    this.dateVisible = true;
                } else {
                    this.dateVisible = false;
                }
            },
            checkAll(val){
                this.tableData.map(row => {
                    this.$refs.table.toggleRowSelection(row, val);
                })
            },
        },
        computed:{
            changeLabel(){
                let find = this.connds.find(res=>{
                    return res.value === this.searchData.snType;
                });
                if(!!find){
                    return find.label;
                }
            }
        },
        props: {},
        components: {
            labelItems,labelItem,
            sale:require('./sale.vue').default,
            salesVolume:require('./sales-volume.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            exportQueueTip:require('@/components/export-queue-tip.vue').default,
            trendsSelect: require('../../../components/trends-select.vue').default,
            exportField: require("@/components/export-field").default,
        },
    }
</script>
