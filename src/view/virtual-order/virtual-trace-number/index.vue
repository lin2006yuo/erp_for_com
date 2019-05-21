<template>
    <page class="p-index">
        <search-list :form="form"
                     :clears="clears"
                     @search="init"></search-list>
        <div class="mb-sm mt-sm ">
            <permission tag="trendsSelect"
                        class="inline ml-sm mr-xs"
                        type="primary"
                        :route="apis.url_export_virtual_tracking"
                        :selects="partAllOptions"
                        @trigger="export_sku"></permission>
            <permission tag="ElButton"
                        :route="apis.url_batch_dispose"
                        size="mini"
                        type="primary"
                        @click="batch_dispose">标记处理
            </permission>

        </div>
        <tabel-list
            @select="select"
            :data-list="dataList"
            @size-change="size_change"
            @page-change="page_change"
            :tables="tables"
            :is-loading="loading"
        ></tabel-list>
        <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates"
                      @getTemplate="get_templates" title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_get_virtual_tracking,
        api_export_virtual_tracking,
        api_get_virtual_tracking_title,
        api_goods_export_template,
        api_batch_dispose,
        url_batch_dispose,
        url_export_virtual_tracking,
    } from '../../../api/virtual-trace-number';
    import {downloadFile} from '../../../lib/http';
    export default{
        permission: {
            url_export_virtual_tracking,
            url_batch_dispose
        },
        page: {
            multiple: true,
        },
        data(){
            return{
                dataList:[],
                selectData:[],
                fields: [],
                templates: [],
                ids:[],
                export_model_type: {
                    type: 3
                },
                loading:true,
                exportVisable:false,
                export_visible:false,
                export_type:'',
                form:{
                    channel_id:'',
                    site:"",
                    account_id:'',
                    search_type:"order_number",
                    search_value:'',
                    handle_time:'',
                    shipping_time:''
                },
                clears:{
                    channel_id:'',
                    site:"",
                    account_id:'',
                    search_type:"order_number",
                    search_value:"",
                    handle_time:'',
                    shipping_time:''
                },
                tables: {
                    page: 1,
                    pageSize: 50,
                    totalSize: 0,
                },
                partAllOptions: [
                    {name: "部分导出", value: 0},
                    {name: "全部导出", value: 1}
                ],

            }
        },
        mounted() {
            this.get_fields();
            this.get_templates();
        },
        methods:{
            init(){
                let data=this.init_params();
                this.$http(api_get_virtual_tracking, data).then(res => {
                    this.loading=false;
                    this.tables.totalSize = res.count;
                    this.dataList=res.data;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            init_params(){
                let params = {
                    page: this.tables.page,
                    pageSize: this.tables.pageSize,
                    handle_time:this.form.handle_time,
                    shipping_time:this.form.shipping_time,
                    search_type:this.form.search_type,
                    channel_id:this.form.channel_id,
                    account_id:this.form.account_id,
                    site:this.form.site,
                    search_value:'',
                };
                let curString = '';
                if (this.form.search_type === 'order_number' || this.form.search_type === 'channel_number'||this.form.search_type === 'package_true'||this.form.search_type === 'channel_number'||this.form.search_type === 'shipping_number_true'||this.form.search_type === 'shipping_number') {
                    curString = this.form.search_value.replace(new RegExp('\n', 'gm'), '\n');
                } else {
                    curString = this.form.search_value.replace(new RegExp(' ', 'gm'), '\n');
                }
                let cur = curString.split('\n').filter(row => !!row);
                // console.log(cur,'cur');
                if (cur && cur.length > 1) {
                    params.search_value = cur.map(row => {
                        return row.trim();
                    });
                } else if (cur && cur.length === 1) {
                    params.search_value = [this.form.search_value.trim()];
                }
                return params;
            },
            select(val){
                this.selectData=val;
                this.ids=val.map(row=>row.id);
            },
            size_change(size) {
                this.tables.pageSize = size;
                this.init();
            },
            page_change(page) {
                this.tables.page = page;
                this.init();
            },
            /*获取导出文件title*/
            get_fields() {
                this.$http(api_get_virtual_tracking_title).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            /*获取导出模板*/
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
            /*导出操作*/
            export_sku(val){
                if (val.value === 0 && this.ids.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },
            creat_excel(param) {
                let fields = param.field.join(',');
                let data = '';
                switch (this.export_type) {
                    case 0://部分
                        data = {
                            ids: this.ids.map(row => {
                                if (typeof row === 'object') {
                                    return row.id
                                } else {
                                    return row
                                }
                            }),
                            export_type: this.export_type
                        };
                        Object.assign(data,this.init_params());
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
                return this.$http(api_export_virtual_tracking, params, head).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                            page: this.tables.page,
                            pageSize: this.tables.pageSize,
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
            /*标记处理*/
            batch_dispose(){
                if (this.ids.length <= 0) {
                    return this.$message({type: "warning", message: "请先勾选需要批量备注的订单"});
                }
                this.$http(api_batch_dispose, {ids:this.ids}).then(res => {
                    this.$message({type:'success',message:res[0].message||"处理成功"});
                    this.init();
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            }
        },
        components:{
            searchList:require("./search-list.vue" ).default,
            tabelList:require("./tabel-list.vue" ).default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../report/export-dialog').default,
            trendsSelect: require('@/components/trends-select.vue').default,
        }
    }
</script>
