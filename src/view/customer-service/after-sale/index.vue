<template>
    <page class="p-index-order-sales">
        <card-search ref="cardSearch"
                     :form="form"
                     :approval-list="approvalList"
                     @change-date="change_date"
                     @select-type="select_type"
                     @select-appro="select_appro"
                     @select-execute="select_execute"
                     @select-channel="select_channel"
                     @search="search"
                     @clear-search="clear_search">
        </card-search>
        <div class="mt-xs">
            <permission tag="ElButton" :route="apis.url_add_order"
                        class="ml-sm inline" size="mini"
                        @click.native="add" type="primary">新建售后单</permission>
            <permission class="inline ml-xs"
                        tag="trendsSelect"
                        type="primary"
                        size="mini"
                        :route="apis.url_sales_export"
                        :selects="partAllOexport"
                        @trigger="export_excel">
            </permission>
            <permission tag="ElButton"
                        v-if="isOrder"
                        :route="apis.url_batch_submit"
                        class="ml-xs inline"
                        size="mini"
                        @click.native="add_audit"
                        type="primary">提交审核</permission>
            <permission tag="trendsSelect"
                        v-if="isDisabled"
                        class="inline ml-xs"
                        type="primary"
                        size="mini"
                        :route="apis.url_batch_adopt"
                        :selects="partAllOptions"
                        @trigger="approval_change">
            </permission>
        </div>
        <data-table
                :data-table="dataTable"
                :is-loading="loading"
                @size-change="size_change"
                @current-change="current_change"
                @look-over="look_over"
                @edit="edit"
                @handle="handle"
                @cur-delete="cur_delete"
                @cur-click="cur_click"
                @sort-change="sort_change"
                @data-change="data_change">
        </data-table>
        <add v-model="addDialog" @save="save" @submit="submit"></add>
        <order-detail
                v-model="showdetail"
                :btn-show="btnShow"
                :order-number="orderNumber">
        </order-detail>
        <look-edit
                :ap-status="apStatus"
                :re-status="reStatus"
                :is-handle="isHandle"
                :is-edit="isEdit"
                :btn-show="btnShow"
                v-model="lookEditDialog"
                :form="lookEditForm"
                :title="title"
                :is-dispute="isDispute"
                @submit="submit"
                @adopt-status="adopt_status"
                @submit-retreat-status="submit_retreat_status"
                @complete-status="complete_status"
                @again-status="again_status"
                @save="save"
                @open-aftersale="open_aftersale">
        </look-edit>
        <local-form-mdf
                ref="formmfd"
                :mdfid="localMdfId"
                :order_id="localOrderId"
                v-model="mdfValue"
                :is-edit="mdfEdit"
                :has-after-remark="false"
                :title="mdfTitle"
                :btn-show="false">
        </local-form-mdf>
        <title-table v-model="exportTable"
                     title="选择需要导出的项目"
                     :title_data="title_data"
                     @export-title="export_title"
        >
        </title-table>
        <export-dialog v-model="visible"></export-dialog>
        <add-remark v-model="remarkEdit" :remark-data="remarkData" @keep="keep"></add-remark>
    </page>
</template>
<style lang="stylus">
    .p-index-order-sales{
        .el-dropdown .el-button-group {
            display: inline-block;
            position: relative;
            top: 1px;
        }
    }
</style>
<script>
    import {downloadFile} from '../../../lib/http';
    import {
        after_sale,
        api_look_over,
        api_get_edit,
        api_delete,
        approval_status,
        adopt_status,
        url_add_order,
        url_adopt_status,
        api_export_title,
        url_sales_export,
        api_sales_export,
        api_batch_adopt,
        url_batch_adopt,
        api_retreat_status,
        url_batch_submit,
        api_batch_submit,
    } from '../../../api/after-sale';
    export default{
        permission:{
            url_add_order,
            url_adopt_status,
            url_sales_export,
            url_batch_adopt,
            url_batch_submit,

        },
        page: {},
        refresh(){
            this.init_approval_btn();
            this.init();
        },
        data(){
            return {
                localMdfId:"",
                localOrderId:"",
                mdfValue:false,
                mdfEdit:{
                    edit:false,
                },
                mdfTitle:"",
                showdetail:false,
                orderNumber:"",
                mdfForms:{},
                orderId:"",
                title:"",
                form: {
                    source:'',
                    approve: 0,
                    status: 0,
                    channel_id: 0,
                    snType: "order_num",
                    snText: "",
                    submitter: "",
                    snDate: "submit_time",
                    date_b: "",
                    date_e: "",
                },
                lookEditForm: {
                    id: "",
                    order_id: "",
                    order_number: "",
                    reason: "",
                    remark: "",
                    approve_status: 0,
                    type: [],
                    refund: {},
                    delivery: {
                        goods: [],
                        address: {},
                        new_warehouse_id: "",
                        shipping_method_id: "",
                    },
                    problem: {
                        goods: []
                    },
                },
                apStatus: 0,
                reStatus: 0,
                dataTable: {
                    lists: [],
                    page: 1,
                    pageSize: 50,
                    total: 0
                },
                loading: false,
                addDialog: false,
                lookEditDialog: false,
                isEdit: false,
                isHandle: false,
                approvalList: [],
                sort_field: "",
                sort_type: "",
                btnShow:false,
                selectVal:[],
                partAllOptions:[
                    {name:"审核通过",value:1},
                    {name:"返回修改",value:2},
                ],
                partAllOexport:[
                    {name:"部分导出",value:0,action:function(val){
                            if (this.selectVal <= 0) return this.$message({type: "warning", message: "请先选择需要导出的数据"});
                            this.export_type = 0;
                            this.get_title();
                        }
                    },
                    {name:"全部导出",value:1,action:function(val){
                            this.export_type = 1;
                            this.get_title();
                        }
                    },
                ],
                export_type: '',
                title_data:[],
                title_checked_list: [],
                exportTable:false,
                visible:false,
                remarkEdit:false,
                remarkData:{
                    ids:'',
                    remark:'',
                },
                isDispute:false,
                initCount:0
            }
        },
        created(){
            this.init_status();
            this.init();
        },
        methods: {
            data_change(val){
                this.selectVal=val;
            },
            approval_change(val){
                if(val.value === 1){
                    if (this.selectVal <= 0) return this.$message({type: "warning", message: "请先选择需要审核的数据"});
                    let ids = this.selectVal.map(res=>res.id);
                    this.$http(api_batch_adopt,{ids:ids}).then(res=>{
                        let newDatas = [];
                        const h = this.$createElement;
                        Object.keys(res).forEach(key=>{
                            newDatas.push(h('p',null,key+'：'+res[key].message));
                                this.dataTable.lists.filter(row=>{
                                    let find = res[key].data.find(row2=>{
                                        return row.id === row2.id
                                    });
                                    if(!!find) Object.assign(row,find);
                                });
                                this.init_status();
                                this.init();
                        });
                        this.$msgbox({
                            title:'审核提示',
                            type:'success',message:h('div',{style:{width:'300px'}}, newDatas) || res,
                            showCancelButton: false,
                            showConfirmButton:false
                        });
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    })
                }else{
                    if (this.selectVal <= 0) return this.$message({type: "warning", message: "请先选择需要返回修改的数据"});
                    this.remarkEdit = true;
                    let ids = this.selectVal.map(res=>res.id);
                    ids = [...ids]
                    this.remarkData = {
                        ids:ids,
                        remark:'',
                    }
                }
            },
            keep(){
                let parmes = window.clone(this.remarkData)
                this.$http(api_retreat_status,parmes).then(res=>{
                    this.remarkEdit = false;
                    let newDatas = [];
                    const h = this.$createElement;
                    Object.keys(res).forEach(key=>{
                        newDatas.push(h('p',null,key+'：'+res[key].message));
                            this.dataTable.lists.forEach(row=>{
                                let find = res[key].data.find(row2=>{
                                    return row.id === row2.id
                                });
                                if(!!find) Object.assign(row,find);
                            });
                            this.init_status();
                            this.init();
                    });
                    this.$msgbox({
                        title:'返回提示',
                        type:'success',
                        message:h('div', {style:{width:'300px'}}, newDatas) || res,
                        showCancelButton: false,
                        showConfirmButton:false
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            add_audit(){
                if (this.selectVal <= 0) return this.$message({type: "warning", message: "请先选择需要提交审核的数据"});
                let ids = this.selectVal.map(res=>res.id);
                ids = [...ids]
                this.$http(api_batch_submit,{ids:ids}).then(res=>{
                    this.$message({type: "success", message: res.message})
                    this.init_status();
                    this.init_approval_btn();
                    this.init();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            init_approval_btn(){
                let approvalBtn = this.approvalList;
                this.approvalList = [];
                this.$nextTick(()=>{
                    this.approvalList = approvalBtn;
                });
            },
            open_aftersale(val){
                this.localMdfId = val.localMdfId;
                this.localOrderId = val.localOrderId;
                this.mdfValue = val.mdfValue;
                this.mdfTitle = val.mdfTitle;
                this.$refs.formmfd.require_server(this.localMdfId);
            },
            init_status(){
                /*审批状态*/
                this.$http(approval_status).then(res => {
                    if(this.approvalList.length===0){
                        this.approvalList = res.map(row => {
                            return {
                                label: row.remark,
                                value: row.code,
                                count: row.number
                            }
                        });
                    }else{
                        this.approvalList.forEach(button=>{
                            let find = res.find(row=>{
                                return button.value===row.code;
                            });
                            if(!!find){
                                button.count = find.number;
                            }
                        });
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
            init(){
                let params = this.data_params();
                this.loading = true;
                this.$http(after_sale, params).then(res => {
                    this.loading = false;
                    this.dataTable.lists = res.data;
                    this.dataTable.total = res.count;
                }).catch(code => {
                    console.log(code);
                })
            },
            data_params(){
                let params = {
                    page: this.dataTable.page,
                    pageSize: this.dataTable.pageSize,
                    snType: this.form.snType,
                    snDate: this.form.snDate,
                    source:this.form.source
                };
                this.sort_field && (params.sort_field = this.sort_field);
                this.sort_type && (params.sort_type = this.sort_type);
                this.form.approve && (params.approve = this.form.approve);
                this.form.status && (params.status = this.form.status);
                this.form.channel_id && (params.channel_id = this.form.channel_id);
                this.form.snText && (params.snText = this.form.snText);
                this.form.submitter && (params.submitter = this.form.submitter);
                if (this.form.date_b) {
                    let b = new Date(this.form.date_b);
                    params.date_b = datef("YYYY-MM-dd", b / 1000);
                }
                if (this.form.date_e) {
                    let e = new Date(this.form.date_e);
                    params.date_e = datef("YYYY-MM-dd", e / 1000);
                };
                return params;
            },

//              选择销售日期
            change_date(val){
                this.init();
            },
//             审批状态/执行状态/销售渠道
            select_type(){
                this.initCount++;
                if(this.initCount>4) {
                    this.init();
                }
            },
            select_appro(index){
                this.form.approve = this.approvalList[index].value;
                this.initCount++;
                if(this.initCount>4) {
                    this.init();
                }
            },
            select_execute(val){
                this.form.status = val;
                this.initCount++;
                if(this.initCount>4) {
                    this.init();
                }
            },
            select_channel(val){
                this.form.channel_id = val;
                this.initCount++;
                if(this.initCount>4) {
                    this.init();
                }
            },
//            搜索/清空
            search(){
                this.init();
            },
            clear_search(){
                this.form.snType = "order_num";
                this.form.snText = "";
                this.form.submitter = "";
                this.form.snDate = "submit_time";
                this.form.date_b = "";
                this.form.date_e = "";
                this.init();
            },
//            添加按钮/导出Excel
            add(){
                this.addDialog = true;
            },
            export_excel(val){ //导出
                val.action.call(this, val);
            },
            get_title(){
                return this.$http(api_export_title).then(res=>{
                    this.title_data = res;
                    this.exportTable = true;
                })
            },
            export_title() {
                this.exportTable = false;
                let data = {
                    export_type: this.export_type,
                };
                if (this.export_type === 1) {
                    this.visible = true;
                    Object.assign(data, this.data_params());
                } else {
                    Object.assign(data, this.data_params(), {ids: this.selectVal.map(item => item.id)});
                }
                this.$http(api_sales_export, data, {
                    'X-Result-Fields': this.title_checked_list.map(item => item.key).join(','),
                    contentType: 'application/x-www-form-urlencoded'
                }).then(res => {
                    let url = config.apiHost + 'downloadFile/downExportFile';
                    let data = {
                        file_code: res.file_code,
                    };
                    downloadFile({
                        url: url,
                        get: data,
                        fileName: res.file_name,
                        suffix: '.xls',
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
//          表格  翻页
            size_change(size){
                this.dataTable.pageSize = size;
                this.init();
            },
            current_change(page){
                this.dataTable.page = page;
                this.init();
            },
//          查看
            look_over(row){
                console.log(row,'row');
                this.isEdit = false;
                this.title = `查看售后单：${row.order_number} 信息`;
                this.isHandle = false;
                this.apStatus = row.approve_status;
                this.reStatus = row.refund_status;
                this.lookEditDialog = true;
                this.btnShow = false;
                this.isDispute = row.source_type===1;
                this.get_lookover(row.id);
            },
//          编辑
            edit(row){
                this.isEdit = true;
                this.title = `编辑售后单：${row.order_number} 信息`;
                this.isHandle = false;
                this.apStatus = row.approve_status;
                this.reStatus = row.refund_status;
                this.lookEditDialog = true;
                this.isDispute = row.source_type===1;
                this.btnShow = false;
                this.get_edit(row.id);
            },
//          处理
            handle(row){
                this.title = `处理售后单：${row.order_number} 信息`;
                this.apStatus = row.approve_status;
                this.reStatus = row.refund_status;
                this.isEdit = false;
                this.isHandle = true;
                this.btnShow = true;
                this.lookEditDialog = true;
                this.isDispute = row.source_type===1;
                this.get_lookover(row.id);
            },
//            点击单号，查看详情
            cur_click(val){
                this.orderNumber = val.order_number;
                this.showdetail = true;
            },
            submit_note(){},
            delete_note(){},

//          删除
            cur_delete(row){
                this.$confirm(`您将删除 ${row.order_number} 售后单信息 ,确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$http(api_delete, row.id).then(res => {
                        this.$message({type: "success", message: res.message || res})
                        let i = this.dataTable.lists.indexOfFun(old=> {
                            return old.id===row.id
                        });
                        this.dataTable.lists.splice(i,1)
                        this.dataTable.total-=1;
                        this.init_status();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    })
                }).catch(() => {
                    this.$message({type: "info", message: "取消成功"})
                })
            },
//            表格排序
            sort_change(val){
                if (val.column instanceof Object) {
                    let sort_label = val.column.label;
                    switch (sort_label) {
                        case "跟踪单号":
                            this.sort_field = "buyer_return_tracking_num";
                            break;
                        case "提交人":
                            this.sort_field = "submitter";
                            break;
                        case "创建时间":
                            this.sort_field = "create_time";
                            break;
                        case "提交时间":
                            this.sort_field = "submit_time";
                            break;
                        case "审批时间":
                            this.sort_field = "approve_time";
                            break;
                    }
                    this.sort_type = val.order === "descending" ? "desc" : "asc";
                    this.init();
                }
            },
//          新建售后订单
            save(val){
                if(val instanceof Array) {
                    val.forEach(row => {
                        let find = this.dataTable.lists.find(inner => inner.id === row.id);
                        if (!find) {
                            this.dataTable.lists.unshift(row);
                        }
                    })
                }
                this.init_status();
            },
            submit(val){
                if(this.form.approve===0){
                    this.init();
                }else {
                    if (val instanceof Array) {
                        val.forEach(row => {
                            let find = this.dataTable.lists.find(inner => {
                                return inner.id === row.id
                            });
                            if (!!find) {
                                Object.assign(find, row);
                            } else {
                                this.dataTable.lists.unshift(row);
                            }
                        })
                    } else {
                        if(val){
                            let findIndex = this.dataTable.lists.findIndex(inner => {
                                return inner.id === val
                            });
                            if (findIndex >= 0) {
                                this.dataTable.lists.splice(findIndex, 1);
                                this.dataTable.total -= 1;
                            }
                        }else{
                            this.init();
                        }
                    }
                }
                this.init_status();
            },
//            审批通过
            adopt_status(val){
                this.submit(val);
            },
//            退回修改
            submit_retreat_status(val){
                this.submit(val);
            },
//          标记为退款完成
            complete_status(val){
                this.submit(val);
            },
//            退款重新执行
            again_status(val){
                this.submit(val);
            },
//          获取编辑状态下的数据
            get_edit(val){
                this.lookEditForm = {};
                this.$http(api_get_edit, val).then(res => {
                    this.lookEditForm = res;
                }).catch(code => {
                    console.log(code);
                });
            },
//            获取查看状态下的数据
            get_lookover(val){
                this.lookEditForm = {};
                this.$http(api_look_over, val).then(res => {
                    this.lookEditForm = res;
                }).catch(code => {
                    console.log(code);
                })
            }
        },
        computed:{
            isDisabled(){
                if(this.form.approve === 2){
                    return true;
                }else {
                    return false;
                }
            },
            isOrder(){
                if(this.form.approve === 1){
                    return true;
                }else {
                    return false;
                }
            }
        },
        components: {
            cardSearch: require("./card-search.vue").default,
            dataTable: require('./data-table.vue').default,
            add: require('./add.vue').default,
            lookEdit: require('./look-edit.vue').default,
            orderDetail:require('./order-detail.vue').default,
            localFormMdf:require('../../order/local/form-mdf.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            titleTable: require('./title-table.vue').default,
            exportDialog:require('./export-dialog.vue').default,
            addRemark:require('./add-remark.vue').default,
        }
    }
</script>
