<template>
    <page class="p-index">
        <search-list :buttons="buttons"
                     @select="changeSelect"
                     @search_list="search_list"
                     :clears="clears"
                     :search-data="searchData"></search-list>
        <!--全部导出和部分导出-->
        <div class="mt-xs ml-sm mb-xs">
            <permission tag="trendsSelect"
                        class="inline mb-xs mt-xs"
                        type="primary"
                        :route="apis.url_joom_orders_export"
                        :selects="partAllOptions"
                        @trigger="export_excel">
            </permission>
            <el-button type="primary" size="mini" class="inline ml-xs"
                       @click.native="verification">手动核查订单</el-button>
        </div>
        <data-table :data-table="dataTable"
                    :loading="loading"
                    :first-loading="firstLoading"
                     class="mt-xs"
                    :export_data="export_data"
                    @sort-click="sort_click"></data-table>
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
        <verification-order v-model="verificationDialog" cur-platform="Joom"></verification-order>
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import searchList from'./searchList.vue';
    import dataTable from'./data-table.vue';
    import {downloadFile} from '../../../../lib/http';
    import {api_order_joom_list,
            api_order_joom_status,
            url_api_order_joom_status,
            api_joom_orders_export,
            url_joom_orders_export,
            api_get_joom_orders_export
    } from'../../.././../api/order_joom';
    import {api_goods_export_template} from "../../../../api/product-library";
    export default{
        permission:{
            url_joom_orders_export,
            url_api_order_joom_status,

        },
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'李佰敏',
                createTime:'2018-5-20',
                updateTime:'2018-5-21'
            }
        },
        refresh(){
            this.buttons = [];
            this.get_status();
            this.init();
        },
        data(){
            return{
                firstLoading:true,
                verificationDialog:false,
                export_visible:false,
                is_batch:"",
                buttons:[],
                dataTable:[],
                total:0,
                page:1,
                pageSize:50,
                export_model_type:{
                    type:35
                },
                exportVisable: false,
                fields:[],
                templates:[],
                partAllOptions:[
                    { name:'部分导出',value: 0 },
                    { name:'全部导出',value: 1 }
                ],
                searchData:{
                    snType:'order_id',
                    snText:'',
                    account_id: '',
                    merchant_id:'',
                    date_b:(Date.now()-(14*24*60*60*1000)),
                    date_e:Date.now(),
                    status:-1,
                    sort_type:'',
                    sort_val:'',
                },
                clears:{
                    snType:'order_id',
                    date_b:(Date.now()-(14*24*60*60*1000)),
                    date_e:Date.now(),
                },
                loading:false
            }
        },
        mounted(){
            this.get_status();
        },
        methods:{
            export_excel(row) {//部分 全部导出
                if(row.value ===0 && this.selectedList.length ===0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                let params = this.get_params();
                params.export_all = row.value;
                row.value===0&&(params.ids = this.selectedList.map(row=>row.order_id));
                delete params.page;
                delete params.pageSize;
                this.$http(api_joom_orders_export, params).then(res => {
                    if(!!res.file_code){
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
                            suffix: '.csv'
                        });
                        this.$message({type: 'success', message: res.message || res});
                    }else{
                        this.export_visible = true;
                        this.$message({type: 'success', message: res.message || res});
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            verification(){
                this.verificationDialog = true;
            },
            get_status(){
                let data = this.get_params();
                data.status = -1;
                this.$http(api_order_joom_status,data).then(res=>{
                    res.forEach(btn=>{
                        this.$set(btn,'value',btn.code);
                    });
                    if(this.buttons.length===0){
                        this.buttons = res;
                    }else{
                        this.buttons.forEach(button=>{
                            let find = res.find(row=>{
                                return button.code===row.code
                            });
                            if(find){
                                button.count = find.count;
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
                    let cur = data.snType === 'product_id' ? curString.split('\n').map(row => row.trim()).filter(row => row !== '') : curString.replace(/\s/g, '\n').split('\n').map(row => row.trim()).filter(row => row !== '');
                    data.snText = cur.length > 1 ? JSON.stringify(cur) : curString;
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
                return data;
            },
            init(){
                this.loading=true;
                this.dataTable=[];
                this.$http(api_order_joom_list,this.get_params()).then(res => {
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
                        this.searchData.sort_type="cost";
                        break;
                    case "付款时间":
                        this.searchData.sort_type="order_time";
                        break;
                    case "平台发货状态":
                        this.searchData.sort_type="shipping_time";
                        break;
                    case "下单时间":
                        this.searchData.sort_type="order_time";
                        break;
                    case "最迟发货时间":
                        this.searchData.sort_type="latest_shipped_time";
                        break;
                }
                this.searchData.sort_val = val.order==='asc'?1:2;
                this.init();
            },
            changeSelect(item){
                this.searchData.status = item.code;
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
            search_list(){//----------搜索
                this.get_status();
                this.init();
            },
        },
        computed:{
            export_data(){
                return this.get_params();
            },
            selectedList() {
                return this.dataTable.filter(row => {
                    return row.isCheck === true;
                })
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
