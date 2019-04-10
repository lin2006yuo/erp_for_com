<template>
    <page>
        <card-search :form="form" :clears="clears" @search="search">

        </card-search>
        <permission tag="trendsSelect"
                    class="inline ml-sm mr-xs mt-sm"
                    type="primary"
                    :route="apis.url_amazon_orders_exports"
                    :selects="partAllOptions"
                    @trigger="export_yms"></permission>
        <table-list class="mt-sm" 
            @item-click="handle_item_click"
            @select-change="handle_select_change"
        >
        </table-list >
        <el-pagination
                class="page-fixed"
                @size-change="list_size_change"
                @current-change="list_page_change"
                :current-page="page"
                :page-sizes="[20,50,100,200,500]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <detail-model 
            v-model="detail_show"
            :detailData="detailData"
        >

        </detail-model>
        <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates"
                      @getTemplate="get_templates" title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>

<style scoped>

</style>

<script>
    import {downloadFile} from '../../../../lib/http';
    import {api_amazon_orders_list,api_amazon_orders_exports,url_amazon_orders_exports,api_amazon_filed,api_goods_export_template,api_amazon_details} from '@/api/store-captial-accounting'
    export default {
        permission:{
            url_amazon_orders_exports
        },
        page:{
            devinfo:{
                frontEnd:'陆城锫',
                backEnd:'朱达',
                createTime:'2018-12-5',
                updateTime:''
            }
        },
        data() {
            return {
                title:'',
                loading:false,
                firstTime:true,
                form: {
                    site:'全部',
                    account_id:'',
                    seller_id:'',
                    start_time:new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                    end_time:new Date(Date.now())
                },
                export_visible:false,
                table:{
                    list:[],
                },
                detail_table:{
                    list:[],
                    page:1,
                    pageSize:20,
                    total:0
                },
                partAllOptions: [
                    {name: "部分导出", value: 2},
                    {name: "全部导出", value: 1}
                ],
                export_type: '',
                exportVisable:false,
                detail_show:false,
                ids:[],
                export_model_type: {
                    type: 3
                },
                fields: [],
                templates: [],
                clears:{
                    site:'全部',
                    account_id:'',
                    seller_id:'',
                    start_time:new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                    end_time:new Date(Date.now())
                },
                cloneId:'',
                flag:true,
                page:1,
                pageSize:20,
                total:0,


                //我的
                detailData: {}  //弹窗的查询准备数据
            }
        },
        mounted(){
            this.init();
            this.get_fields();
            this.get_templates();
        },
        methods: {
            search(){
                this.init()
            },
            init_params (){
                let data = window.clone(this.form);
                if(!!this.form.start_time){
                    data.start_time = Math.round(new Date(this.form.start_time).getTime()/1000)
                } else {
                    data.start_time=''
                };
                if(!!this.form.end_time){
                    data.end_time = Math.round(new Date(this.form.end_time).getTime()/1000)
                }else {
                    data.end_time = ''
                };
                if(this.form.site==='全部') data.site = '';
                this.page&&(data.page=this.page);
                this.pageSize&&(data.pageSize=this.pageSize);
                return data
            },
            init(){
                this.loading = true;
                let data = this.init_params();
                this.$http(api_amazon_orders_list,data).then(res=>{
                    this.loading = false;

                    this.table.list= res.data;
                    this.total = res.count;
                    this.table.list.forEach(row=>{
                        row.total_amount = row.total_amount+row.currency_code;
                        row.payment_amount = row.payment_amount+row.currency_code;
                        row.fee_amount = row.fee_amount+row.currency_code;
                        row.promotion_return_amount = row.promotion_return_amount+row.currency_code;
                        row.refund_amount = row.refund_amount+row.currency_code;
                        row.other_fee_amount = row.other_fee_amount+row.currency_code;
                        row.previous_reserve_amount = row.previous_reserve_amount+row.currency_code;
                        row.current_reserve_amount = row.current_reserve_amount+row.currency_code;
                        row.refund_commission = row.refund_commission+row.currency_code;
                        row.reserve_amount =row.reserve_amount+row.currency_code
                    });
                }).catch(err=>{
                    console.log(err)
                })
            },

            
            // select_change(val){
            //     this.ids = val;
            // },



            get_fields() {
                this.$http(api_amazon_filed).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 3}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },



            export_yms(val) {
                if (val.value === 2 && this.ids.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },

            creat_excel(param) {
                let field = param.field;
                field.forEach((row,index,arr)=>{
                    arr[index] = {field_key:row}
                });
                let data = '';
                let  all_parmam={};
                let fields ={
                    fields:field
                };
                switch (this.export_type) {
                    case 2://部分
                        data = {
                            ids: this.ids.map(row => {
                                if (typeof row === 'object') {
                                    return row.account_id
                                } else {
                                    return row
                                }
                            }),
                            export_type: this.export_type
                        };
                        all_parmam ={...data,...this.init_params(),...fields};
                        return this.order_export(all_parmam);
                        break;
                    case 1://全部
                        data = this.init_params();
                        this.$set(data, 'export_type', this.export_type);
                        all_parmam ={...data,...fields};
                        return this.order_export(all_parmam);
                        break;
                }
            },

            order_export(params) {
                return this.$http(api_amazon_orders_exports, params).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                            page: this.table.page,
                            pageSize: this.table.pageSize,
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
                })
                return Promise.resolve()
            },
            // detail(val){
            //     let params = this.init_params();
            //     let data = {
            //         account_id:val.account_id,
            //         page:this.detail_table.page,
            //         pageSize:this.detail_table.pageSize
            //     };
            //     this.$set(data,'start_time',params.start_time);
            //     this.$set(data,'end_time',params.end_time);
            //     this.title= `账户${val.account_name}的结算周期报告`;
            //     this.cloneId = val.account_id;
            //     this.detail_show = true;
            //     this.req_detail(data)
            // },
            // req_detail(data){
            //     if(this.flag){
            //         this.flag = false;
            //         this.$http(api_amazon_details,data).then(res=>{
            //             this.flag = true;
            //             this.detail_table.list = res.data;
            //             this.detail_table.page = Number(res.page);
            //             this.detail_table.pageSize = Number(res.pageSize);
            //             this.detail_table.total = res.count;
            //         }).catch(err=>{
            //             this.flag = true;
            //             console.log(err)
            //         });
            //     }
            // },
            list_size_change(val){
              this.pageSize =val;
              this.init()
            },
            list_page_change(val){
                this.page = val;
                this.init()
            },
            // handleSizeChange(val){
            //    this.detail_table.pageSize = val;
            //    let data ={
            //        account_id:this.cloneId,
            //        page:this.detail_table.page,
            //        pageSize:this.detail_table.pageSize
            //    };
            //    this.req_detail(data)
            // },
            // handleCurrentChange(val){
            //   this.detail_table.page = val;
            //     let data ={
            //         account_id:this.cloneId,
            //         page:this.detail_table.page,
            //         pageSize:this.detail_table.pageSize
            //     };
            //     this.req_detail(data)
            // },



            //我的
            handle_item_click(item) {
                //准备数据给弹窗使用
                let params = this.init_params();
                this.detailData = {
                    account_id: item.account_id,
                    title: `账户${item.account_name}的结算周期报告`,
                    start_time: params.start_time,
                    end_time: params.end_time,
                }
                this.detail_show = true;
            },
            //复选框
            handle_select_change(options) {
                this.ids = options
            }
        },
        components:{
            cardSearch:require('./card-search').default,
            tableList:require('./table-list').default,
            detailModel:require('./detail-model').default,
            exportDialog: require('../../../report/export-dialog').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            exportField: require("@/components/export-field").default,
        }
    }
</script>
