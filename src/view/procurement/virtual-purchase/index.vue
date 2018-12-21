<template>
    <page class="p-index">
        <search
            ref="search"
            :searchData="searchData"
            @select-status="select_status"
            @search="search"
            @clear="clear">
        </search>
        <el-row class="mt-sm ml-sm">
            <el-checkbox v-model="checkedall" @change = "check_all">所有页全选
            </el-checkbox>
            <permission tag="request-button"
                        :route="apis.url_post_virtual_purchase_order_create_finance"
                        class="inline ml-sm"
                        :mintime="200"
                        req-key="url_post_virtual_purchase_order_create_finance"
                        @click="virtual_pay_apply">生成虚拟付款申请
            </permission>
            <permission tag="request-button"
                        :route="apis.url_post_virtual_purchase_order_push_yks"
                        class="inline ml-sm"
                        :mintime="200"
                        :disabled="selectList.length === 0"
                        req-key="url_post_virtual_purchase_order_push_yks"
                        @click="push_yks">推送给有棵树
            </permission>
            <permission tag="trendsSelect"
                        class="inline ml-sm mr-xs"
                        type="primary"
                        :route="apis.url_order_export"
                        :selects="partAllOptions"
                        @trigger="export_sku">
            </permission>
            <div class="fr mt-sm red bold-font">
                <div><span>应付款：</span>CNY {{pay.apply  | pay_filter}}<span class="ml-md">已付款：</span>CNY {{pay.payment | pay_filter}}</div>
            </div>
        </el-row>
        <table-list :loading="loading"
                    class="mt-sm"
                    :tableData="tableData"
                    :checkedall="checkedall"
                    @update="update"
                    :first-loading="firstLoading"
                    @selection-change="selectionChange">
        </table-list>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchData.page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="searchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates"
                      @getTemplate="get_templates" title="请选择自定义导出字段" :creat-excel="creat_excel">
        </export-field>
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>
<style lang="stylus">
    .p-index {
        .el-dropdown .el-button-group {
            display: inline-block;
            position: relative;
            top: -1px;
        }
        .el-message-box__status {
            top: 27% !important;
        }
        .btn {
            margin: 5px 0;
            border: 0;
        }
    }
</style>
<script>
    import {downloadFile} from '../../../lib/http';
    import {
        api_get_virtual_purchase_order,
        api_post_virtual_purchase_order_create_finance,
        url_post_virtual_purchase_order_create_finance,
        url_post_virtual_purchase_order_push_yks,
        api_post_virtual_purchase_order_push_yks,
        api_order_export,
        api_goods_export_template,
        url_order_export,
        api_export_fields,
        api_total_amount
    } from '@/api/virtual-purchase-order';

    export default {
        permission: {
            url_post_virtual_purchase_order_create_finance,
            url_post_virtual_purchase_order_push_yks,
            url_order_export
        },
        page: {
            devinfo: {
                frontEnd: '覃宏峰',
                backEnd: '黄伟杰',
                createTime: '2017-9-20',
                updateTime: '2017-9-25'
            },
            beforeClose() {
                return true;
            }
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                flag: false,
                pay:{
                    apply: 0,
                    payment: 0
                },
                checkedall: false,
                firstLoading: true,
                loading: false,
                total: 0,
                selectList: [],
                export_type: '',
                templates:[],
                exportVisable:false,
                export_visible:false,
                export_model_type: {
                    type: 19
                },
                fields: [],
                tableData: [],
                partAllOptions: [
                    {name: "部分导出", value: 2},
                    {name: "全部导出", value: 1}
                ],
                searchData: {
                    page: 1,
                    pageSize: 50,
                    order_status: '',
                    bill_type: 0,
                    bill_number: "",
                    date_b: "",
                    date_e: "",
                    virtual_supplier_id: "",
                    time_status: 0,
                    warehouse_id: "",
                    balance_type: "",
                    payment_status: '',
                    push_status:'',
                    has_virtual_finance: 0
                },
            }
        },
        mounted() {
            this.init();
            this.get_fields();
            this.get_templates();
        },
        filters:{
            pay_filter(val) {
                return val === 0 ? Number(val).toFixed(4) : val
            }
        },
        methods: {
            export_sku(val) {
                if (val.value === 2 && this.selectList.length === 0) {
                    this.$message({
                        type: "warning",
                        message: "请先选择需要导出的数据"
                    });
                }else {
                    this.export_type = val.value;
                    this.exportVisable = true;
                }
            },
            get_fields() {
                this.$http(api_export_fields).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 19}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            creat_excel(param,list) {
                let fields = param.field.join(',');
                let data = '';
                switch (this.export_type) {
                    case 2://部分
                        let reqData = [];
                        let ids = [];
                        this.selectList.forEach(row=>{
                            ids.push(`${row.id}`)
                        });
                        list.forEach(row=>{
                            reqData.push({field_name:row.show_field,field_key:row.field})
                        });
                        let obj={
                            export_type : this.export_type,
                            fields:reqData,
                            ids:ids,
                        };
                        Object.assign(obj,this.init_params());
                        return this.order_export(obj, {
                            'X-Result-Fields': fields,
                            contentType: 'application/x-www-form-urlencoded'
                        });
                        break;
                    case 1://全部
                        let allData = [];
                        list.forEach(row=>{
                            allData.push({field_name:row.show_field,field_key:row.field})
                        });
                        let req={
                            export_type : this.export_type,
                            fields:allData,
                        };
                        Object.assign(req,this.init_params());
                        this.$delete(req,'page');
                        this.$delete(req,'pageSize');
                        return this.order_export(req, {
                            'X-Result-Fields': fields,
                            contentType: 'application/x-www-form-urlencoded'
                        });
                        break;
                }
            },
            order_export(params, head) {
                return this.$http(api_order_export, params, head).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                            page: this.searchData.page,
                            pageSize: this.searchData.pageSize,
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
            init_params() {
                let paramsData = window.clone(this.searchData);
                if (this.searchData.date_b) {
                    paramsData.date_b = datef('YYYY-MM-dd', this.searchData.date_b / 1000);
                } else {
                    paramsData.date_b = '';
                }
                if (this.searchData.date_e) {
                    paramsData.date_e = datef('YYYY-MM-dd', this.searchData.date_e / 1000);
                } else {
                    paramsData.date_e = '';
                }
                if (this.searchData.bill_number.trim()) {
                    paramsData.bill_number = this.searchData.bill_number.replace(new RegExp(' ', 'gm'), '\n').trim().split('\n').map(row => row.trim()).filter(row => row !== '');
                } else {
                    paramsData.bill_number = '';
                }
                return paramsData
            },
            //页面初始化请求列表数据
            init() {
                let params = this.init_params();
                this.tableData = [];
                this.loading = true;
                this.$http(api_get_virtual_purchase_order, params).then(res => {
                    this.total = res.count;
                    this.tableData = res.data;
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            select_status(val) {
                this.searchData.order_status = val;
                this.init();
            },
            //点击搜索按钮  搜索
            search() {
                this.init();
            },
            //清空
            clear() {
                Object.keys(this.searchData).forEach(key => {
                    this.searchData[key] = '';
                });
                this.searchData = {
                    page: 1,
                    pageSize: 50,
                    snType: "purchase_order_code",
                    dateType: "purchase_time",
                };
                this.init();
            },
            //更改页面条数
            handleSizeChange(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            //跳转页数
            handleCurrentChange(val) {
                this.searchData.page = val;
                this.init();
            },
            //添加成功 更新
            update() {
                this.searchData.purchase_user_id = "";
                this.init()
            },
            //选中
            selectionChange(val) {
                this.selectList = val;
                if(this.selectList.length === 0){
                    this.flag = false;
                }
                if(!this.checkedall && !this.flag){
                    let data = this.init_params();
                    let arr = this.selectList.map(row => row.id);
                    let arr1 = this.selectList.length === 0 ? '' : arr.map(String);
                    this.$http(api_total_amount, {ids: arr1,...data}).then(res => {
                        this.pay = res;
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                }else if(this.flag){
                    this.pay.apply = 0;
                    this.pay.payment = 0;
                }
            },
            check_all(){
                let data = this.init_params();
                if(this.checkedall){
                    this.$http(api_total_amount, {select: 1,...data}).then(res => {
                        this.pay = res;
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                }else{
                    this.flag = true;
                }
            },
            refresh() {
                this.init();
            },
            virtual_pay_apply() {
                if (this.selectList.length === 0) {
                    this.$reqKey('url_post_virtual_purchase_order_create_finance', false);
                    this.$message({type: 'warning', message: '请选择需要操作的数据！'});
                    return
                }
                let data = this.init_params();
                if(this.checkedall){
                    this.$http(api_post_virtual_purchase_order_create_finance, {select: 1, ...data}).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.init();
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('url_post_virtual_purchase_order_create_finance', false);
                        }, 200);
                    })
                }else(
                    this.$http(api_post_virtual_purchase_order_create_finance, {ids: JSON.stringify(this.selectList.map(row => row.virtual_order_id))}).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.init();
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('url_post_virtual_purchase_order_create_finance', false);
                        }, 200);
                    })
                )
            },
            push_yks() {
                this.$confirm(`您将已勾选的虚拟采购单推送给有棵树，确定进行此操作?`, '提示', {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let data = this.init_params();
                    if(this.checkedall){
                        this.$http(api_post_virtual_purchase_order_push_yks, {select : 1,...data}).then(res => {
                            this.$message({type: 'success', message: res.message || res});
                            this.init();
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('url_post_virtual_purchase_order_push_yks', false);
                            }, 200);
                        })
                    }else {
                        this.$http(api_post_virtual_purchase_order_push_yks, {ids: JSON.stringify(this.selectList.map(row => row.id))}).then(res => {
                            this.$message({type: 'success', message: res.message || res});
                            this.init();
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('url_post_virtual_purchase_order_push_yks', false);
                            }, 200);
                        })
                    }
                }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消"
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_post_virtual_purchase_order_push_yks', false);
                    }, 200);
                });
            }
        },
        components: {
            search: require('./search').default,
            tableList: require('./table-list').default,
            exportField: require("@/components/export-field").default,
            trendsSelect: require('@/components/trends-select.vue').default,
            exportDialog: require('../../report/export-dialog').default,
        }
    }
</script>
