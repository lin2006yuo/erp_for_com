<template>
    <page class="p-index">
        <search-list :buttons="buttons"
                     @select="changeSelect"
                     @search_list="search_list"
                     :select-list="accountList"
                     :clears="clears"
                     :search-data="searchData">
        </search-list>
        <div class="mt-xs ml-sm mb-xs">
            <!--导出按钮-->
            <permission tag="trendsSelect"
                        class="inline mb-xs mt-xs"
                        type="primary"
                        :route="apis.url_lazada_order_export"
                        :selects="partAllOptions"
                        @trigger="export_table">
            </permission>
            <el-button type="primary" size="mini" class="inline ml-xs"
                       @click.native="verification">手动核查订单</el-button>
            <el-button type="primary" size="mini" class="inline ml-xs"
                       @click.native="export_order_details">导出订单明细</el-button>
            <permission tag="div"
                        :route="apis.url_lazada_orders_getallorder"
                        class="fr">
                <el-date-picker
                    type="datetime"
                    placeholder="开始时间"
                    v-model="stime"
                    format="yyyy-MM-dd HH"
                    class="inline"
                    :picker-options="pickerOptions"
                    style="width:140px">
                </el-date-picker>&nbsp;--
                <el-date-picker
                    type="datetime"
                    placeholder="结束时间"
                    v-model="etime"
                    format="yyyy-MM-dd HH"
                    :picker-options="pickerOptions1"
                    class="inline mr-sm"
                    style="width:140px">
                </el-date-picker>
                <label class="inline">账号简称：</label>
                <super-select
                    storageKey="order_account"
                    v-model="account_id"
                    clearable
                    class="inline mr-sm"
                    style="width: 115px;"
                    :is-paging="true"
                    :options='accountList'
                ></super-select>
                <!--<el-select v-model="account_id"-->
                           <!--clearable-->
                           <!--class="inline mr-sm"-->
                           <!--style="width: 115px;" filterable>-->
                    <!--<el-option-->
                        <!--:key="item.value"-->
                        <!--v-for="item in accountList"-->
                        <!--:label="item.label"-->
                        <!--:value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
                <permission tag="request-button"
                            class="inline mr-sm"
                            :mintime="200"
                            req-key="url_lazada_orders_getallorder"
                            :route="apis.url_lazada_orders_getallorder"
                            @click="once_collar">立即抓取
                </permission>
            </permission>
        </div>
        <data-table :data-table="dataTable"
                    :loading="loading"
                    :export_data="export_data"
                    :first-loading="firstLoading"
                    @sort-click="sort_click"
                    ref="cancelSelect">
        </data-table>
        <!--分页-->
        <div class="block">
            <el-pagination
                    class="page-fixed"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="[20,50,100,200,500]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
        <verification-order v-model="verificationDialog" cur-platform="Lazada"></verification-order>
        <!--导出字段选择-->
        <export-field :param="export_model_type"
                      v-model="exportVisable"
                      :fields="fields" :templates="templates"
                      @getTemplate="get_templates"
                      title="请选择自定义导出字段"
                      :fixparam="fixparam"
                      :creat-excel="creat_excel">
        </export-field>
        <!--导出队列-->
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import searchList from'./searchList.vue';
    import dataTable from'./data-table.vue';
    import {downloadFile} from '../../../../lib/http';
    import {
        api_order_lazada_list,
        api_order_lazada_status,
        api_order_lazada_getAccount,
        url_lazada_orders_getallorder,
        api_lazada_orders_getallorder,
        api_lazada_order_export,
        url_lazada_order_export,
        api_goods_export_template,
        api_lazada_orders_export_fields,
        api_lazada_oversea_export
    } from'../../.././../api/order_lazada';
    export default{
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'蓝术术',
                createTime:'2018-5-24',
                updateTime:'2018-5-24'
            }
        },
        permission:{
            url_lazada_orders_getallorder,
            url_lazada_order_export
        },
        refresh(){
            this.buttons = [];
            this.get_status();
            this.init();
        },
        data(){
            return{
                changeCancel: '',
                export_model_type: {
                    type: 26
                },
                export_visible: false,
                exportVisable: false,
                fields: [],
                templates: [],
                partAllOptions: [
                    {name: '部分导出', value: 2},
                    {name: '全部导出', value: 1}
                ],
                firstLoading:true,
                verificationDialog:false,
                is_batch:"",
                buttons:[],
                dataTable:[],
                total:0,
                page:1,
                pageSize:50,
                searchData:{
                    site:'',
                    snType:'order_id',
                    snText:'',
                    account_id:'',
                    date_b:(Date.now()-(14*24*60*60*1000)),
                    date_e:Date.now(),
                    status:-1,
                    sort_field:'',
                    sort_type:'',
                    shipping_type: ''
                },
                clears:{
                    shipping_type: '',
                    snType:'order_id',
                    date_b:(Date.now()-(14*24*60*60*1000)),
                    date_e:Date.now(),
                },
                loading:false,
                siteSelects:[],
                stime:'',
                etime:'',
                pickerOptions:{
                    disabledDate:(time)=>{
                        if(this.etime){
                            return time.getTime() > this.etime
                        }else {
                            return time.getTime() > new Date()
                        }
                    }
                },
                pickerOptions1:{
                    disabledDate: (time) => {
                        return time.getTime() > new Date().getTime() || time.getTime() < this.stime;
                    }
                },
                accountList:[],
                account_id:''
            }
        },
        mounted(){
            this.get_status();
            this.getAccount();
            this.get_templates();
            this.get_fields();
        },
        methods:{
            creat_excel(param) {
                let data = '';
                switch(this.export_type) {
                    case 2: //部分
                        data = {
                            ids: JSON.stringify(this.selectedList.map(row => {
                                return row.id;
                            })),
                            export_type: this.export_type,
                            fields: param
                        };
                        Object.assign(data, this.get_params());
                        return this.order_export(api_lazada_order_export, data);
                        break;
                    case 1: //全部
                        data = this.get_params();
                        this.$set(data, 'export_type', this.export_type);
                        this.$set(data, 'fields', param);
                        return this.order_export(api_lazada_order_export, data);
                        break;
                }
            },
            order_export(url, params) {//部分 全部导出  导出订单明细
                return this.$http(url, params).then(res => {
                    if(res.join_queue === 1){
                        this.export_visible = true;
                        this.$message({type: 'success', message: res.message || res});
                    }else{
                        let params = {
                            page: this.page,
                            pageSize: this.pageSize,
                            file_code: res.file_code
                        };
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls'
                        });
                        this.$message({type: 'success', message: res.message || res});
                        this.selectedList.map(row => {
                            row.isCheck = false;
                        });
                        this.$refs.cancelSelect.checkAll = false;//导出后取消勾选
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
                return Promise.resolve();
            },
            fixparam(list) {
                return list.map(row => {
                    return {
                        field_name: row.show_field,
                        field_key: row.field
                    }
                })
            },
            get_templates() {//保存模板
                this.$http(api_goods_export_template, {type: 27}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            get_fields() {
                this.$http(api_lazada_orders_export_fields).then(res => {//获取导出字段
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            export_table(val) {
                if(val.value ===2 && this.selectedList.length ===0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },
            getAccount() {
                this.$http(api_order_lazada_getAccount, {channel_id: 6}).then(res => {
                    this.accountList = res.account;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                });
            },
            once_collar(){
                if(!this.stime){
                    this.$reqKey('url_lazada_orders_getallorder',false);
                    this.$message({type:'warning',message:'请先选择需要抓取的开始时间！'});
                    return
                }
                if(!this.etime){
                    this.$reqKey('url_lazada_orders_getallorder',false);
                    this.$message({type:'warning',message:'请先选择需要抓取的结束时间！'});
                    return
                }
                if(!this.account_id){
                    this.$reqKey('url_lazada_orders_getallorder',false);
                    this.$message({type:'warning',message:'请先选择需要抓取的账号！'});
                    return
                }
                this.$http(api_lazada_orders_getallorder,{stime:datef('YYYY-MM-dd HH', this.stime/1000),etime:datef('YYYY-MM-dd HH', this.etime/1000),account_id:this.account_id}).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.buttons = [];
                    this.get_status();
                    this.init();
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_lazada_orders_getallorder',false);
                    },200);
                });
            },
            verification(){
                this.verificationDialog = true;
            },
            export_order_details() {
                let  data
                if (this.selectedList.length > 0) {
                   data = { ids: JSON.stringify(this.selectedList.map(row => {
                        return row.id;
                        })),
                   }
                } else {
                    data = {
                        ids: ''
                    }
                }
                Object.assign(data, this.get_params());
                return this.order_export(api_lazada_oversea_export,data);
            },
            get_status(){
                let data = this.get_params();
                data.status = -1;
                this.$http(api_order_lazada_status,data).then(res=>{
                    res.forEach(btn=>{
                        this.$set(btn,'value',btn.code);
                    });
                    if(this.buttons.length===0){
                        res.forEach(row=>{
                            this.buttons.push({label:row.name,value:row.order_status,count:row.qty})
                        });
                    }else{
                        this.buttons.forEach(button=>{
                            let find = res.find(row => {
                                return button.value === row.order_status
                            });
                            if (find) {
                                button.count = find.qty;
                            }
                        });
                    }
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            get_params() {
                let data = window.clone(this.searchData);
                this.$set(data, 'page', this.page);
                this.$set(data, 'pageSize', this.pageSize);
                let curString = data.snText.trim();
                if (curString.length > 0) {
                    let cur = data.snType === 'itemid' ||'product'? curString.split('\n').map(row => row.trim()).filter(row => row !== '') : curString.replace(/\s/g, '\n').split('\n').map(row => row.trim()).filter(row => row !== '');
                    data.snText = JSON.stringify(cur);
                }else{
                    data.snText = '';
                }
                if (!!data.date_b) {
                    data.date_b = datef('YYYY-MM-dd', data.date_b/1000);
                } else {
                    data.date_b = ''
                }
                if (!!data.date_e) {
                    data.date_e = datef('YYYY-MM-dd', data.date_e/1000);
                } else {
                    data.date_e = ''
                }
                if(data.account_id.length ===0){
                    data.account_id = '';
                }
                return data;
            },
            init(){
                this.loading=true;
                this.dataTable=[];
                this.$http(api_order_lazada_list,this.get_params()).then(res => {
                    this.dataTable=res.data;
                    this.dataTable.forEach((data,i)=>{
                        this.$set(this.dataTable[i], 'show',false);
                        this.$set(this.dataTable[i], 'isCheck',false);
                    });
                    this.total=res.count;
                    this.loading=false;
                    this.firstLoading=false
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        message: code.message || code,
                        type: 'error'
                    });
                    this.loading=false;
                })
            },
            //            表格升降序
            sort_click(val){
                switch (val.label){
                    case "支付总额":
                        this.searchData.sort_field="price";
                        break;
                    case "下单时间":
                        this.searchData.sort_field="created_at";
                        break;
                    case "平台发货状态":
                        this.searchData.sort_field="promised_shipping_time";
                        break;
                    case "最迟发货时间":
                        this.searchData.sort_field="last_time";
                        break;
                }
                this.searchData.sort_type = val.order;
                this.init();
            },
            changeSelect(item){
                this.searchData.status = item.value;
                this.get_status();
                this.init();
            },
            handleSizeChange(val) {//---------------分页每页显示条数
                this.pageSize=val;
                this.init();
            },
            handleCurrentChange(val) {//------------分页当前页
                this.page=val;
                this.init();
            },
            search_list(){
                this.get_status();
                this.init();
            },
        },
        computed:{
            selectedList() {
                return this.dataTable.filter(row => {
                    return row.isCheck === true;
                })
            },
            export_data(){
                return this.get_params();
            },
        },
        components:{
            searchList,
            dataTable,
            verificationOrder:require('../../verification-order.vue').default,
            trendsSelect: require('../../../../components/trends-select').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../../report/export-dialog').default,
        }
    }
</script>
