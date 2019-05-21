<template>
    <page class="p-index-self">
        <search-list  @select="changeSelect"
                     @search_list="search_list"
                     :clears="clears"
                     :search-data="searchData"></search-list>
        <div class="mt-sm mb-sm">
            <permission tag="trendsSelect"
                        class="inline p-btn-select"
                        type="primary"
                        :route="apis.url_fbp_export"
                        :selects="partAllOptions"
                        @trigger="export_sku">
            </permission>
        </div>
        <data-table :data-table="dataTable"
                    :loading="loading"
                    :export_data="export_data"
                    :first-loading="firstLoading"
                    @slect-change="selection_change"
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
        <export-field  v-model="exportVisable" :fields="fields"
                       :templates="templates"
                       :param="export_model_type"
                       title="请选择自定义导出字段"
                       :creat-excel="creat_excel"
                       @getTemplate="get_templates">
        </export-field>
        <export-queue-tip v-model="export_visible"></export-queue-tip>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import searchList from'./searchList.vue';
    import dataTable from'./data-table.vue';
    import {downloadFile} from '@/lib/http';
    import {api_fbp_orders_list,api_fbp_export,api_fbp_field,url_fbp_export} from'../../.././../api/order_paytm';
    import {api_goods_export_field,api_goods_export_template} from "@/api/product-library"
    import {url_manual_orders_export} from '@/api/handwork';
    export default{
        page:{
            devinfo:{
                frontEnd:'付剑明',
                backEnd:'董海波',
                createTime:'2019-3-21',
                updateTime:'2019-5-21'
            }
        },
        permission: {
            url_fbp_export
        },
        refresh(){
            this.init();
        },
        data(){
            return{
                firstLoading: true,
                export_visible:false,
                verificationDialog:false,
                is_batch:"",
                selectList:[],
                dataTable:[],
                templates:[],
                fields:[],
                total:0,
                page:1,
                pageSize:50,
                export_model_type:{
                    type:22
                },
                partAllOptions: [
                    {name: "部分导出", value: 2},
                    {name: "全部导出", value: 1}
                ],
                searchData:{
                    snType:'order_number',
                    snText:'',
                    seller:'',
                    account_id:'',
                    date_b:(Date.now()-(14*24*60*60*1000)),
                    date_e:Date.now(),
                    time_type:'order_time'
                },
                clears:{
                    snType:'order_number',
                    date_b:(Date.now()-(14*24*60*60*1000)),
                    date_e:Date.now(),
                    time_type:'order_time'
                },
                loading:false,
                export_type:'',
                exportVisable:false,
            }
        },
        mounted(){
            this.init();
            this.get_fields();
            this.get_templates();
        },
        methods:{
            selection_change(val){
                this.selectedList = val.map(row => {
                    return row.id;
                });
                this.selectList=val;
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
                if (val.value === 2 && this.selectList.length <= 0) {
                    return this.$message({type: "warning",message: "请先选择需要导出的数据"});
                }else if(val.value ===1 && this.dataTable.length === 0){
                    return this.$message({type: "warning",message: "列表无数据"});
                }else{
                    this.export_type = val.value;
                    this.exportVisable = true;
                }

            },
            creat_excel(param){
                let fields = param.field.map(row=>{return {field_key:row}});
                let data = '';
                switch (this.export_type) {
                    case 2://部分
                        data = {
                            ids: this.selectList.map(row => {
                                return row.id
                            }),
                            fields:fields,
                            export_type: this.export_type
                        };
                        Object.assign(data, this.get_params());
                        return this.order_export(data);
                        break;
                    case 1://全部
                        data = this.get_params();
                        data.fields=fields;
                        this.$set(data, 'export_type', this.export_type);
                        return this.order_export(data);
                        break;
                }
            },
            order_export(params, head) {
                return this.$http(api_fbp_export, params, head).then(res => {
                    if (res.export_type === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let data = {
                            file_code: res.file_code,
                            page: this.page,
                            pageSize: this.pageSize,
                        };
                        downloadFile({
                            url: url,
                            get: data,
                            fileName: res.file_name,
                            suffix: '.csv',
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve()
            },
            get_params() {
                let data = window.clone(this.searchData);
                this.$set(data, 'page', this.page);
                this.$set(data, 'pageSize', this.pageSize);
                let curString = data.snText.trim();
                if (curString.length > 0) {
                    let cur = data.snType==='name'? curString.split('\n').map(row=>row.trim()).filter(row => row !== ''):curString.replace(/\s/g,'\n').split('\n').map(row=>row.trim()).filter(row => row !== '');
                    data.snText = cur.length > 0? cur : '';
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
                this.$http(api_fbp_orders_list,this.get_params()).then(res => {
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
                this.searchData.status = item.status;
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
                this.init();
            },
        },
        computed:{
            export_data(){
                return this.get_params();
            }
        },
        components:{
            searchList,
            dataTable,
            trendsSelect: require('@/components/trends-select.vue').default,
            exportField: require("@/components/export-field").default,
            exportQueueTip:require('@/components/export-queue-tip.vue').default,
        }
    }
</script>
