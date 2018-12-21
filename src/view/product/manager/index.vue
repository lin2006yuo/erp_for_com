<template>
    <page class="p-index">
        <search-time ref="search"
                     :searchData="searchData"
                     @submit="submit"
                     @change-sale="change_sale"
                     @clear="clear_all"></search-time><!--搜索商品和出售时间部分-->
        <goods-classify ref="classifyPart">
            <!-- 按钮 -->
            <btnlist-middle @add="addproduct"
                            @export-goods="export_goods"
                            @export-sku="export_sku"
                            @platform-format-export="platform_format_export"
                            @set-buyer="set_buyer"
                            @confirm-repetition="confirm_repetition"
                            @distribution-push="distribution_push"
                            :ids="ids"
                            v-model="isHidden"
                             class="ml-sm"
                            slot="button-list"></btnlist-middle><!--中间按钮组-->
            <!-- 商品列表树 -->
            <goods-tree slot="goods-tree"
                        @hidden-left="$refs.classifyPart.showLeft(true)"
                        @change-category="change_category"></goods-tree>
            <!-- 数据表格 -->
            <tabledata-list class="card"
                            ref="tabledata"
                            :table-obj="tableObj"
                            :is-loading="loading"
                            @change-data="change_data"
                            @hidden-tree="$refs.classifyPart.showLeft()"
                            @size-change="size_change"
                            @current-change="current_change"
                            v-resize="{height:75}"
                            slot="goods-tabel"></tabledata-list>
        </goods-classify>
        <export-field v-model="exportVisable" :fields="fields"
                      :templates="templates"  @getTemplate="get_templates"
                      title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
        <export-queue-tip v-model="queueTipDialog"></export-queue-tip>
        <set-buyer v-model="editDialog"
                      :title="title"
                      @submit="submit_edit">
        </set-buyer>
    </page>
</template>
<style lang="stylus">
</style>
<script>
    import searchTime from "./search-time.vue";
    import btnlistMiddle from "./btnlist-middle.vue";
    import tabledataList from "./tabledata-list.vue";
    import goodsClassify from "../../../components/goods-classify.vue";
    import goodsTree from "../../../components/goods-tree.vue";
    import {downloadFile} from '../../../lib/http';
    import {publish_product,api_export,api_export_sku,api_goods_set_purchaser,api_download_shopee,
        api_goods_export_field,api_goods_export_template,api_download_discount,api_download_walmart,
        api_download_lazada,api_export_noon,api_distribution_push} from  "../../../api/product-library";
    export default{
        page: {
            multiple: true,
            param(get_, old_){
                setTimeout(()=>{
                    let length=objlength(get_);
                    if(length>0){
                        this.searchData.snType = get_.key;
                        this.searchData.snText = get_.value;
                        this.init()
                    }
                },300)
            },
            devinfo:{
                frontEnd:'张兵根',
                backEnd:'翟斌',
                createTime:'2017-2-27',
                updateTime:'2017-9-26'
            },
            beforeClose(){
                return true;
            },
        },
        refresh(){
            if(this.searchData.hasOwnProperty('phash')){
                delete this.searchData.phash
            }
            this.init();
        },
        data(){
            return{
                queueTipDialog:false,
                searchData:{
                    snType:"sku",
                    snText:"",
                    supplier_id:'',
                    purchaser_id:'',
                    developer_id:'',
                    category_id:'',
                    dateType:"sellTime",
                    date_start:"",
                    date_end:"",
                    status:0,
                    without_img:0,
                },
                exportVisable:false,
                tabledata:[],
                tableObj:{
                    lists:[],
                    page:1,
                    pageSize:50,
                    total:0,
                },
                total:0,
                loading:true,
                isHidden:false,
                editDialog:false,
                title:'批量修改采购员',
                fields:[],
                templates:[]
            }
        },
        methods:{
            get_fields(){
                this.$http(api_goods_export_field).then(res=>{
                    this.fields=res;
                }).catch(code => {
                    this.$message({type:"error",message:code.message||code})
                });
            },
            get_templates(){
                this.$http(api_goods_export_template,{type:1}).then(res=>{
                    res.forEach(row=>{
                        row.value=row.name;
                    })
                    this.templates=res;
                }).catch(code => {
                    this.$message({type:"error",message:code.message||code})
                });
            },
            submit_edit(val,buyer){
                let data = {
                    id:this.ids,
                    purchaser_id:val
                };
                this.$http(api_goods_set_purchaser,data).then(res=>{
                    this.editDialog = false;
                    this.tableObj.lists.forEach(row=>{
                        this.ids.forEach(item=>{
                            if(row.id === item){
                                row.purchaser = buyer;
                                row.isCheck = false;
                            }
                        });
                    });
                    this.$message({type:'success',message:res.message||res});
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('set_buyer',false)
                    },200);
                });
            },
            set_buyer(){
                this.editDialog = true;
            },
            confirm_repetition(val){
                this.searchData = {
                    snType:"sku",
                    snText:"",
                    supplier_id:'',
                    purchaser_id:'',
                    developer_id:'',
                    category_id:'',
                    dateType:"sellTime",
                    date_start:"",
                    date_end:"",
                    status:0,
                    without_img:0,
                };
                this.$set(this.searchData,'phash',val);
                this.init();
            },
            distribution_push(){
                if(this.ids.length<=0) return this.$message({type:'warning',message:'请先选择要推送的数据'});
                this.$http(api_distribution_push,{goods_id:this.ids}).then(res => {
                    this.$message({type:'success',message:'已添加推送队列'});
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            export_goods(){
                let ids = this.$refs.tabledata.idsData;
                if(ids.length<=0){
                    this.$reqKey('urlExport',false);
                    return this.$message({type:"warning",message:"请先选择要导出的数据"});
                }
                let params = {
                    ids:ids
                };
                this.order_export(params);
            },
            export_sku(){
                this.exportVisable=true;
            },
            platform_format_export(val){
                switch(val.value){
                    case 'shopee':
                        this.shopee_export();
                        break;
                    case 'cdiscount':
                        this.cdiscount_export();
                        break;
                    case'walmart':
                        this.walmart_export();
                        break;
                    case 'lazada':
                        this.lazada_export();
                        break;
                    case 'noon':
                        this.export_noon();
                }
            },
            export_noon(){
                let ids = this.$refs.tabledata.idsData;
                if(ids.length<=0){
                    return this.$message({type:"warning",message:"请先选择要导出的数据"});
                }
                let params = {
                    ids:ids
                };
                this.$http(api_export_noon,params).then(res => {
                    if(res.status===0)return this.$message({type:'warning',message:res.message||res});
                    let url = config.apiHost+'downloadFile/downExportFile';
                    let params = {
                        file_code:res.file_code,
                    };
                    downloadFile({
                        url:url,
                        get:params,
                        fileName:res.file_name,
                        suffix:res.type||'.xls',
                    });
                }).catch(code => {
                    console.log(code,'code');
                })
            },
            shopee_export(){
                let ids = this.$refs.tabledata.idsData;
                if(ids.length<=0){
                    return this.$message({type:"warning",message:"请先选择要导出的数据"});
                }
                let params = {
                    ids:ids.join(',')
                };
                this.$http(api_download_shopee,params).then(res=>{
                    let url = config.apiHost+'downloadFile/downExportFile';
                    let params = {
                        file_code:res.file_code,
                    };
                    downloadFile({
                        url:url,
                        get:params,
                        fileName:res.file_name,
                        suffix:res.type||'.xls',
                    });
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
            cdiscount_export(){
                let ids = this.$refs.tabledata.idsData;
                if(ids.length<=0){
                    return this.$message({type:"warning",message:"请先选择要导出的数据"});
                }
                let params = {
                    ids:ids.join(',')
                };
                this.$http(api_download_discount,params).then(res=>{
                    let url = config.apiHost+'downloadFile/downExportFile';
                    let params = {
                        file_code:res.file_code,
                    };
                    downloadFile({
                        url:url,
                        get:params,
                        fileName:res.file_name,
                        suffix:res.type||'.xls',
                    });
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('cdiscountExport',false);
                    },300);
                });
            },
            walmart_export(){
                let ids = this.$refs.tabledata.idsData;
                if(ids.length<=0){
                    this.$reqKey('walmartExport',false);
                    return this.$message({type:"warning",message:"请先选择要导出的数据"});
                }
                let params = {
                    ids:ids.join(',')
                };
                this.$http(api_download_walmart,params).then(res=>{
                    let url = config.apiHost+'downloadFile/downExportFile';
                    let params = {
                        file_code:res.file_code,
                    };
                    downloadFile({
                        url:url,
                        get:params,
                        fileName:res.file_name,
                        suffix:res.type||'.xls',
                    });
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('walmartExport',false);
                    },300);
                });
            },
            lazada_export(){
                let ids = this.$refs.tabledata.idsData;
                if(ids.length<=0){
                    this.$reqKey('lazadaExport',false);
                    return this.$message({type:"warning",message:"请先选择要导出的数据"});
                }
                let params = {
                    ids:ids.join(',')
                };
                this.$http(api_download_lazada,params).then(res=>{
                    let url = config.apiHost+'downloadFile/downExportFile';
                    let params = {
                        file_code:res.file_code,
                    };
                    downloadFile({
                        url:url,
                        get:params,
                        fileName:res.file_name,
                        suffix:res.type||'.xls',
                    });
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('lazadaExport',false);
                    },300);
                });
            },
            creat_excel(param){
                let data = this.get_params();
                let ids = this.$refs.tabledata.idsData;
                this.$set(data,'ids',ids);
                Object.assign(data,param);
                if(ids.length<=0){
                    this.$confirm('点击"确定"将导出全部数据,若需要部分导出请点击"取消"，勾选想要导出的数据后再重复此操作', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        closeOnClickModal: false,
                    }).then(() => {
                        this.export_goods_sku(data);
                    })
                }else{
                    this.export_goods_sku(data);
                }
            },
            export_goods_sku(data){
                this.$http(api_export_sku,data).then(res=>{
                    if(res.status===0){
                        this.queueTipDialog = true;
                    }
                    let url = config.apiHost+'downloadFile/downExportFile';
                    let params = {
                        file_code:res.file_code,
                    };
                    downloadFile({
                        url:url,
                        get:params,
                        fileName:res.file_name,
                        suffix:res.type,
                    });
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('exportSku',false);
                    },300);
                });
            },
            order_export(params){
                this.$http(api_export,params).then(res=>{
                    let url = config.apiHost+'downloadFile/downExportFile';
                    let params = {
                        file_code:res.file_code,
                    };
                    downloadFile({
                        url:url,
                        get:params,
                        fileName:res.file_name,
                        suffix:'.csv',
                    });
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                }).finally(()=>{
                    this.$reqKey('urlExport',false);
                })
            },
            change_category(val){
                this.searchData.category_id=val;
                this.init();
            },
            change_data(val){
                let find = this.tableObj.lists.find(row=>{
                    return row.id===val.id;
                })
                if(!!find){
                    Object.assign(find,val)
                }
            },
            get_params(){
                let data=clone(this.searchData);
                this.$set(data,'page',this.tableObj.page);
                this.$set(data,'pageSize',this.tableObj.pageSize);
                if(data.date_start){
                    data.date_start=datef('YYYY-MM-dd', data.date_start/1000);
                }else {
                    data.date_start='';
                }
                if(data.date_end){
                    data.date_end=datef('YYYY-MM-dd', data.date_end/1000);
                }else {
                    data.date_end='';
                }
                if(data.snType==='sku'||data.snType==='spu'){
                    data.snText = data.snText.split('\n').map(row=>row.trim()).filter(row=>!!row);
                }else{
                    data.snText=this.searchData.snText.trim();
                }
                return data;
            },
            //初始化
            init(){
                let data = this.get_params();
                this.loading=true;
                this.tableObj.lists=[];
                this.$http(publish_product,data).then(res=>{
                    this.tableObj.lists=res.data.map(row=>{
                        row.show=false;
                        row.isCheck=false;
                        row.heighLight=false;
                        return row;
                    });
                    this.loading=false;
                    this.tableObj.total=res.count
                }).catch(code=>{
                    console.log(code)
                })
            },
            //更改当前页的条数
            size_change(val) {
                this.tableObj.pageSize=val
                this.init()
            },
            //更改当前页
            current_change(val) {
                this.tableObj.page= val;
                this.init()
            },
            //点击搜索
            submit(){
                if(this.searchData.hasOwnProperty('phash')){
                    delete this.searchData.phash
                }
                this.init()
            },
            //点击搜索状态时
            change_sale(val){
                this.searchData.status=val;
                this.init();
            },
            addproduct(){
//                console.log("添加商品")
            },
            clear_all(){
                let status=this.searchData.status;
                this.searchData={
                    snType:"sku",
                    snText:"",
                    supplier_id:'',
                    purchaser_id:'',
                    developer_id:'',
                    category_id:'',
                    dateType:"sellTime",
                    date_start:"",
                    date_end:"",
                    status:0,
                    without_img:0,
                }
                this.searchData.status=status;
                this.init()
            }

        },
        mounted(){
            this.init();
            this.get_fields();
            this.get_templates();
        },
        computed:{
            ids(){
                let cur = [];
                this.tableObj.lists.forEach(row=>{
                    if(row.isCheck){
                        cur.push(row.id)
                    }
                });
                return cur;
            },
        },
        components:{
            searchTime,
            btnlistMiddle,
            tabledataList,
            goodsClassify,
            goodsTree,
            setBuyer:require('./set-buyer').default,
            exportField:require("@/components/export-field").default,
            exportQueueTip:require('../../../components/export-queue-tip.vue').default,
        }
    }
</script>
