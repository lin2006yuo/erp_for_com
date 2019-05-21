<template>
    <page class="goods-delivery-page">
        <search-list :searchData="searchData"  @change-btn="change_btn" @refresh="init" :btnList="btn_list" :clears="clears" ></search-list>
        <div class="middle-button">
            <div class="inline">
                <permission tag="trendsSelect"
                            class="inline ml-xs mr-xs"
                            type="primary"
                            :route="apis.url_goods_discount_export"
                            :selects="partAllOptions"
                            @trigger="export_excel">
                </permission>
            </div>
            <el-button type="primary" size="mini" @click="syn_classify">同步品类</el-button>
            <el-button type="primary" size="mini" @click="import_excel_add_sku">导入Excel添加SKU</el-button>
            <el-button type="primary" size="mini" @click="push_taste" :disabled="isSuccess" >推送品连</el-button>
        </div>
        <data-table
            :tableData="tableData"
            :firstLoading="firstLoading"
            :loading="loading"
            :total="total"
            :searchData="searchData"
            :value="checkAll"
            @init="init"
            @change-ckeck-all="change_checkAll"
        ></data-table>
        <export-field :param="export_model_type"
                      v-model="exportVisable"
                      :fields="fields" :templates="templates"
                      @getTemplate="get_templates"
                      title="请选择自定义导出字段"
                      :fixparam="fixparam"
                      :creat-excel="creat_excel">
        </export-field>
        <import-file v-model="fileDisplay"
                     :submit-url="api_goods_brand_link_import"
                     :is-multiple="false"
                     @download-file="download_file"
                     @files-data="init"
                     @errmeaage="errmeaage"
        ></import-file>
        <err-table
            v-model="err_display"
            :datavalue="err_data"
        ></err-table>
        <export-dialog v-model="visible"></export-dialog>
    </page>
</template>

<style lang="stylus">
    .goods-delivery-page{
        .middle-button{
            padding:10px;
        }
    }
</style>

<script>
    import {
        url_goods_discount_export,
    } from '../../../api/subsidized-list.js';
    import {api_goods_export_template} from "@/api/product-library";
    import {downloadFile} from '../../../lib/http';
    import {api_goods_brand_link,api_goods_brand_link_category_sync,api_goods_brand_link_push,api_goods_brand_link_export,api_goods_brand_link_import,api_goods_brand_link_import_downfile,api_goods_brand_link_export_fields} from '../../../api/goods-delivery';
    export default {
        permission:{
            url_goods_discount_export
        },
        data(){
            return {
                api_goods_brand_link_import:api_goods_brand_link_import,
                searchData:{
                    push_status:0,
                    snType:'sku',
                    snText:'',
                    time_type:1,
                    start_time:new Date(new Date().getTime() - 3600 * 1000 * 24 * 15),
                    end_time:new Date(),
                    activeButton:1,
                    page:1,
                    pageSize:50,
                },
                clears:{
                    push_status:0,
                    snType:'sku',
                    snText:'',
                    time_type:1,
                    start_time:new Date(new Date().getTime() - 3600 * 1000 * 24 * 15),
                    end_time:new Date(),
                    activeButton:1,
                    page:1,
                    pageSize:50,
                },
                btn_list:[
                    {label:"全部",type:1,status:0,action:function(){
                            this.$set(this.searchData,'push_status',0);
                        }},
                    {label:"未推送",type:2,status:1,action:function(){
                            this.$set(this.searchData,'push_status',1);
                        }},
                    {label:"成功",type:3,status:2,action:function(){
                            this.$set(this.searchData,'push_status',2);
                        }},
                    {label:"失败",type:4,status:3,action:function(){
                            this.$set(this.searchData,'push_status',3);
                        }},
                    {label:"更新失败",type:5,status:4,action:function(){
                            this.$set(this.searchData,'push_status',4);
                        }},
                ],
                tableData:[],
                exportVisable: false,
                export_model_type: {
                    type: 255
                },
                fields: [
                    // {title:'更新时间',key:'update_time',},
                    // {title:'SKU',key:'sku'},
                    // {title:"产品中文名称",key:'goods_name'},
                    // {title:"SKU状态",key:'status'},
                    // {title:"分类",key:'goods_category'},
                    // {title:"推送结果",key:'push_status'},
                    // {title:"日志",key:'log'},
                    // {title:'操作人',key:'creator'},
                    // {title:"执行时间",key:'push_time'},
                ],
                templates: [],
                partAllOptions: [
                    {name: "部分导出", value: 2},
                    {name: "全部导出", value: 1}
                ],
                export_type: '',
                loading:false,
                firstLoading:false,
                total:0,
                checkAll:false,
                fileDisplay:false,
                err_data:[],
                err_display:false,
                visible:false,
            }
        },
        mounted(){
            this.get_export_field();
            this.get_templates();
            this.init();
        },
        methods:{
            init(){
                let obj = clone(this.searchData);
                delete obj.activeButton;
                let parameter = clone(obj);
                if(parameter.start_time instanceof Date){
                    parameter.start_time = datef("YYYY-MM-dd HH:mm:ss", parameter.start_time.getTime()/1000);
                }
                if(parameter.end_time instanceof Date){
                    parameter.end_time = datef("YYYY-MM-dd HH:mm:ss", parameter.end_time.getTime()/1000);
                }
                if(parameter.snType!=='goods_name'){
                    let splitText = this.split_search(parameter.snText);
                    parameter.snText = splitText&&splitText.length?splitText.map(row=>row.trim()):'';
                }
                this.loading = true;
                this.firstLoading = false;
                this.$http(api_goods_brand_link,parameter)
                    .then(res=>{
                        console.log(res);
                        this.tableData = [...res.data];
                        this.total = res.count;
                        this.searchData.page = Number(res.page);
                        this.searchData.pageSize = Number(res.pageSize);
                        this.loading = false;
                        this.tableData.forEach(item=>{
                            this.$set(item,'check',false);
                        })
                    })
                    .catch(err=>{
                        this.$message({
                            type:'error',
                            message: err.message || err
                        })
                    })
            },
            get_export_field(){
              this.$http(api_goods_brand_link_export_fields)
                  .then(res=>{
                      this.fields = res.data.map(item=>{
                          return {title:item.field_name,key:item.field_key};
                      });
                  })
                  .catch(err=>{
                      this.$message({
                          type:'error',
                          message:err.message || err
                      })
                  })
            },
            change_btn(item){
                this.searchData.activeButton = item.type;
                item.action.call(this);
                this.init();
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 255}).then(res => {
                    console.log(res);
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            fixparam(list) {
                return list.map(row => {
                    return {
                        field_name: row.show_field,
                        field_key: row.field
                    }
                });
            },
            creat_excel(param) {
                let message = param.map(item=>{
                    return item.field_key;
                });
                let data = '';
                switch (this.export_type) {
                    case 2://部分
                        data = {
                            ids: this.selectList.map(row => {
                                if (typeof row === 'object') {
                                    return row.sku_id
                                } else {
                                    return row
                                }
                            }),
                            field: message
                        };
                        Object.assign(data,this.init_params());
                        return this.order_export(data);
                        break;
                    case 1://全部
                        data = this.init_params();
                        this.$set(data, 'field', message);
                        this.visible = true;
                        return this.order_export(data);
                        break;
                }
            },
            init_params(){
                let params = {
                   push_status:this.searchData.push_status,
                    snType:this.searchData.snType,
                    snText:this.searchData.snText,
                    time_type:this.searchData.time_type,
                    start_time:this.searchData.start_time,
                    end_time:this.searchData.end_time
                };
                let curString = this.searchData.snText.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                if(cur&&cur.length>1){
                    params.snText = cur.map(row=>{
                        return row.trim();
                    });
                }else if(cur&&cur.length===1){
                    params.snText =  cur[0];
                }

                // this.sort_field && (params.sort_field = this.sort_field);
                // this.sort_by !== '' && (params.sort_by = this.sort_by);
                // this.searchData.payment_status > -1 && (params.payment_status = this.searchData.payment_status);
                // this.searchData.shipped_time > -1 && (params.shipped_time = this.searchData.shipped_time);
                if (!!this.searchData.start_time) {
                    let date_b = new Date(this.searchData.start_time);
                    params.start_time = datef("YYYY-MM-dd", date_b / 1000);
                } else {
                    params.start_time = "";
                }
                if (!!this.searchData.end_time) {
                    let date_e = new Date(this.searchData.end_time);
                    params.end_time = datef("YYYY-MM-dd", date_e / 1000);
                } else {
                    params.end_time = "";
                }
                return params
            },
            order_export(params) {
                return this.$http(api_goods_brand_link_export, params).then(res => {
                    switch (res.status) {
                        case 0:
                            throw new Error(res.message||res);
                            break;
                        case 2:
                            this.export_visible = true;
                            this.$message({type: "success", message: res.message || res});
                            break;
                        default:
                            if(this.export_type === 2 ){
                                let url = config.apiHost + 'downloadFile/downExportFile';
                                let params = {
                                    file_code: res.file_code,
                                };
                                downloadFile({
                                    url: url,
                                    get: params,
                                    fileName: res.file_name,
                                    suffix: '.csv',
                                });
                                this.$message({type: "success", message: '导出成功' || res});
                            }else{
                                this.$message({
                                    type:'success',
                                    message:res.message || '添加到队列成功!'
                                })
                            }
                            this.checkAll = false;
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve();
            },
            export_excel(val) {
                if (val.value === 2 && this.selectList.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                console.log('选择了导出按钮',val);
                this.exportVisable = true;
            },
            //同步分类
            syn_classify(){
                this.$http(api_goods_brand_link_category_sync)
                    .then(res=>{
                        this.$message({
                            type:'success',
                            message:res.message
                        })
                    })
                    .catch(err=>{
                        this.$message({
                            type:'error',
                            message:err.message || err
                        })
                    })
            },
            //导入excel添加SKU
            import_excel_add_sku(){
                this.fileDisplay = true;
            },
            //推送品连
            push_taste(){
                if(this.selectList.length){
                    let params = this.selectList.map(item=>{
                        return item.sku_id;
                    })
                    this.$http(api_goods_brand_link_push,{ids:params})
                        .then(res=>{
                            this.$message({
                                type:'success',
                                message:res.message || '添加队列成功'
                            });
                            this.tableData.forEach(item=>{
                                item.check = false;
                            });
                            // this.init();
                            this.checkAll = false;
                        })
                        .catch(err=>{
                            this.$message({
                                type:'error',
                                message:err.message || err
                            })
                        })
                }else{
                    this.$message({
                        type:'info',
                        message:'请先选择要推送的商品!'
                    })
                }
            },
            split_search(data){
                let curString = data.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                return cur
            },
            change_checkAll(val){
                this.checkAll =val;
            },
            download_file(){
                let url=config.apiHost+'downfile?code=sku_brand_link';
                downloadFile({
                    url:url,
                    fileName:'商品推送模版',
                    suffix:'.xls'
                })
            },
            errmeaage(val){

                if(val.result !== 1){
                    this.err_data=val.message;
                    this.err_display=true;
                }else{
                    this.$message({type:'success',message:'导入成功'});
                    this.fileDisplay=false;
                }
            },
        },
        computed:{
            selectList(){
                return this.tableData.filter(row=>row.check);
            },
            isSuccess(){
               let flag = this.selectList.filter(row=>{
                    return row.push_status === '成功';
                }).length;
               return  flag ? true:false;
            }
        },
        components:{
            "search-list":require('./search-list.vue').default,
            exportField: require("@/components/export-field").default,
            trendsSelect:require('@/components/trends-select').default,
            dataTable:require('./data-table.vue').default,
            importFile:require("@/components/import-file.vue").default,
            errTable:require('../infringement/err-table.vue').default,
            exportDialog:require('../../report/export-dialog.vue').default,
        }
    }
</script>


