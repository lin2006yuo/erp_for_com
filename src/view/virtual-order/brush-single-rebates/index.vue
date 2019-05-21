<template>
    <page class="p-index">
        <search :searchData="searchData"
                :clears="clears"
                :channel-list="channelList"
                :refund-status-buttons="refundStatusButtons"
                :review-status-buttons="reviewStatusButtons"
                @change-status="change_status"
                @search="search"></search>
        <div class="mt-xs mb-xs ml-sm">
            <permission tag="trendsSelect"
                        class="ml-sm inline"
                        type="primary"
                        :route="apis.url_export_title"
                        :selects="partAllOptions"
                        @trigger="export_excel"></permission>
            <permission tag="ElButton"
                        :route="apis.url_post_batch_approval_refund"
                        type="primary"
                        v-if="searchData.status === 0"
                        :disabled="selectList.length === 0"
                        @click.native="batch_audit"
                        size="mini">批量审核通过
            </permission>
            <permission tag="ElButton"
                        :route="apis.url_post_batch_refund_status"
                        type="primary"
                        @click.native="batch_operation(1)"
                        v-if="searchData.status === 1&&searchData.refund_status !== 1"
                        :disabled="selectList.length === 0"
                        size="mini">批量标记已返款
            </permission>
            <permission tag="ElButton"
                        :route="apis.url_post_batch_refund_status"
                        type="primary"
                        @click.native="batch_operation(2)"
                        v-if="searchData.status === 1&&searchData.refund_status !== 2"
                        :disabled="selectList.length === 0"
                        size="mini">批量标记返款异常
            </permission>
            <permission tag="ElButton"
                        :route="apis.url_post_batch_refund_status"
                        type="primary"
                        @click.native="batch_operation(3)"
                        v-if="searchData.status === 1&&searchData.refund_status !== 3"
                        :disabled="selectList.length === 0"
                        size="mini">批量标记取消返款
            </permission>
        </div>
        <table-data :table-data="tableData"
                    :loading="loading"
                    :first-loading="firstLoading"
                    :operation-list="comSelect"
                    @trigger-select="trigger_select"
                    @handle-selection-change="handle_selection_change"
                    @current-change="current_change"
                    @size-change="size_change"></table-data>
        <!--审核查看框-->
        <look-up-review v-model="showDialog" :cur-id="curId" :handle-type="handleType" @audit-single="audit_single"></look-up-review>
        <!--重新提交返款申请框-->
        <apply-for-refund-dialog v-model="refundDialog" :refund-data="refundData" :handleType="handleType" @update="update"></apply-for-refund-dialog>
        <!--导出框-->
        <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates"
                      @getTemplate="get_templates" title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {downloadFile} from '@/lib/http';
    import {api_get_channel,url_post_add_refund} from '@/api/click-farm-mission';
    import {api_get_virtual_refund_list,
        api_post_single_approval_refund,
        api_get_virtual_refund_form,
        api_post_batch_refund_status,
        api_post_batch_approval_refund,
        api_get_title,
        api_export_title,
        api_goods_export_template,
        url_get_virtual_refund_form,
        url_post_batch_refund_status,
        url_post_single_approval_refund,
        url_post_batch_approval_refund,
        url_export_title,} from '@/api/virtual-refund';
    export default{
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '李佰敏',
                createdTime: '2018-11-10',
                updateTime: '2018-11-13'
            }
        },
        permission:{
            url_get_virtual_refund_form,
            url_post_add_refund,
            url_post_single_approval_refund,
            url_post_batch_approval_refund,
            url_post_batch_refund_status,
            url_export_title,
        },
        refresh(){
            this.init();
            this.get_channel();
        },
        data(){
            return{
                searchData:{
                    status: '',//审核状态
                    refund_status: '',//返款状态
                    refund_type: '',//返款方式
                    shipping_type: '',//运单类型
                    snType: 'task_number',//搜索类型
                    snText: '',//搜索内容
                    channel:'',//平台ID
                    account_id:'',//账号ID
                    seller_id:'',//销售员ID
                    functionary_id: '',//负责人ID
                    date_type: 1,//时间类型
                    date_start:'',//开始时间
                    date_end:'',//结束时间
                },
                status: '',//审核状态，用于解决清空条件后的搜索出现的状态和列表对应不上问题
                refund_status: '',//返款状态，用于解决清空条件后的搜索出现的状态和列表对应不上问题
                clears:{
                    refund_type: '',//返款方式
                    shipping_type: '',//运单类型
                    snType: 'task_number',//搜索类型
                    snText: '',//搜索内容
                    channel:'',//平台ID
                    account_id:'',//账号ID
                    seller_id:'',//销售员ID
                    functionary_id: '',//负责人ID
                    date_type: 1,//时间类型
                    date_start:'',//开始时间
                    date_end:'',//结束时间
                },
                reviewStatusButtons: [//审核状态按钮组
                    {label: '全部', value: ''},
                    {label: '待审核', value: 0},
                    {label: '审核通过', value: 1},
                    {label: '审核不通过', value: 2}
                ],
                refundStatusButtons: [//返款状态按钮组
                    {label: '全部', value: ''},
                    {label: '未返款', value: 0},
                    {label: '已返款', value: 1},
                    {label: '返款异常', value: 2},
                    {label: '取消返款', value: 3}
                ],
                loading: false,
                firstLoading: true,
                selectList: [],
                channelList: [],
                tableData:{
                    lists:[],
                    total:0,
                    page:1,
                    pageSize:20
                },
                showDialog: false,
                curId: '',
                refundDialog: false,
                handleType: '',
                refundData: {},
                operationList: [
                    {label:"查看",value:1,api:url_get_virtual_refund_form,action:function(val){
                        this.showDialog = true;
                        this.curId = val.id;
                        this.handleType = 'lookup'
                    }},
                    {label:"审核",value:2,api:url_post_single_approval_refund,action:function(val){
                        this.showDialog = true;
                        this.curId = val.id;
                        this.handleType = 'audit'
                    }},
                    {label:"重新提交",value:3,api:url_post_add_refund,action:function(val){
                        this.$http(api_get_virtual_refund_form, val.id).then(res => {
                            console.log(res);
                            this.refundData = res;
                            this.refundDialog = true;
                            this.handleType = 'resubmit';
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message||code})
                        })
                    }},
                ],
                partAllOptions: [
                    {name: "部分导出", value: 0},
                    {name: "全部导出", value: 1}
                ],
                fields: [],
                templates: [],
                export_type: '',
                export_model_type: {
                    type: 21
                },
                export_visible: false,
                exportVisable: false,
            }
        },
        computed:{
            comSelect(){
                return this.operationList.filter(res=>{
                    return this.$hasPermission(res.api);
                })
            }
        },
        created(){
            this.init();
            this.get_channel();
        },
        mounted(){
            this.get_fields();
            this.get_templates();
        },
        methods:{
            search(){
                this.init();
            },
            get_fields() {//获取导出字段
                this.$http(api_get_title).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {//获取导出模板
                this.$http(api_goods_export_template, {type: 21}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_excel(val) {
                if (val.value === 0 && this.selectList.length <= 0) return this.$message({
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
                            ids: this.selectList.map(row => {
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
                return this.$http(api_export_title, params, head).then(res => {
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
            init(){
                this.loading = true;
                let params = this.init_params();
                this.$http(api_get_virtual_refund_list, params).then(res => {
                    this.tableData.lists = res.data;
                    this.tableData.page = +res.page;
                    this.tableData.pageSize = +res.pageSize;
                    this.tableData.total = +res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            init_params(){//初始化参数
                let data = window.clone(this.searchData);
                this.$set(data, 'page', this.tableData.page);
                this.$set(data, 'pageSize', this.tableData.pageSize);
                data.status = this.status;
                data.refund_status = this.refund_status;
                if(data.status === '') delete data.status;
                if(data.refund_status === '') delete data.refund_status;
                if(this.searchData.refund_type === '') delete data.refund_type;
                if(this.searchData.shipping_type === '') delete data.shipping_type;
                if(!!this.searchData.date_start){
                    let s = new Date(this.searchData.date_start);
                    data.date_start = datef('YYYY-MM-dd',s.getTime()/1000);
                }
                if(!!this.searchData.date_end){
                    let e = new Date(this.searchData.date_end);
                    data.date_end = datef('YYYY-MM-dd',e.getTime()/1000);
                }
                let splitText = this.split_search(data.snText);
                data.snText = splitText&&splitText.length?splitText.map(row=>row.trim()):'';
                return data
            },
            split_search(data){
                let curString = data.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                return cur
            },
            trigger_select(val,action){
                action.action.call(this,val);
            },
            update(){
                this.init()
            },
            audit_single(id, status, postil){//---单个审核--审核通过/审核不通过
                let data = {
                    id: id,
                    status: status,
                    postil: postil
                };
                this.$http(api_post_single_approval_refund, data).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.showDialog = false;
                    this.init()
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            batch_audit(){//----批量审核通过
                this.$confirm('此操作为批量审核通过已勾选的数据，确认此操作吗？','批量审核通过',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        ids: '',
                        status: 1,
                        postil: ''
                    };
                    data.ids = this.selectList.map(row => row.id);
                    this.$http(api_post_batch_approval_refund, data).then(res => {
                        this.$message({type: 'success', message: res.message});
                        this.init()
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message||code})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                })
            },
            batch_operation(val){//批量标记操作
                let txt;
                switch(val){
                    case 1:
                        txt = '已返款';
                        break;
                    case 2:
                        txt = '返款异常';
                        break;
                    case 3:
                        txt = '取消返款';
                        break;
                }
                this.$confirm('将所勾选单号，返款状态标记为'+'‘'+txt+'’'+'，确认此操作吗？','批量标记'+txt,{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        ids: '',
                        refund_status: val
                    };
                    data.ids = this.selectList.map(row => row.id);
                    this.$http(api_post_batch_refund_status,data).then(res => {
                        this.$message({type: 'success', message: res.message});
                        this.init()
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message||code})
                    })
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消'})
                })
            },
            change_status(index,val){//----审核/返款状态改变
                if(val === 'review'){
                    this.searchData.status = this.reviewStatusButtons[index].value;
                    this.status = this.reviewStatusButtons[index].value
                }else{
                    this.searchData.refund_status = this.refundStatusButtons[index].value;
                    this.refund_status = this.refundStatusButtons[index].value
                }
                this.init()
            },
            handle_selection_change(val){//----多选列表选中按钮变成可点击
                this.selectList = val
            },
            current_change(page){
                this.tableData.page = page;
                this.init()
            },
            size_change(size){
                this.tableData.pageSize = size;
                this.init()
            },
            // ----------------------------------接口数据
            get_channel(){//获取渠道平台
                this.$http(api_get_channel,{}).then(res=>{
                    this.channelList = [{label:"全部",value:''},...res];
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        components:{
            search:require('./search.vue').default,
            tableData:require('./table-data').default,
            lookUpReview:require('./look-up-review').default,
            applyForRefundDialog:require('../click-farm-mission/apply-for-refund-dialog').default,
            trendsSelect: require('@/components/trends-select').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../report/export-dialog').default,
        }
    }
</script>
