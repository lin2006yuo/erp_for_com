<template>
    <page class="p-assert-sup">
        <!--<el-row>-->
        <search-card @search="search" @enter="search" :params="params" :clears="clears">
            <div>
                <label-buttons label="状态：" title="请选择状态" :buttons="statusList" @select="select_status"></label-buttons>
            </div>
            <label class="inline" title="请选择结算方式">结算方式：</label>
            <el-select class="inline s-width-default" v-sf.balance_type v-model="params.balance_type">
                <el-option
                    v-for="item in balanceList"
                    :key="item.label"
                    :label="item.name"
                    :value="item.label">
                </el-option>
            </el-select>
            <el-select class="inline ml-lg s-width-small" v-sf.snType v-model="params.snType">
                <el-option v-for="item in searchList" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-input class="inline mr-sm width-super" v-sf.snText :placeholder="`请输入${changeLabel}...`"
                      v-model="params.snText"></el-input>
        </search-card>
        <permission tag="ElButton"
                    :route="apis.url_add_supplier"
                    class="inline mt-sm ml-sm mb-sm"
                    type="primary" size="mini"
                    @click.native="add" title="新增供应商">添加</permission>
        <trends-select class="inline ml-sm mr-sm btn-margin-top"
                       v-if="curStatus>-1"
                       :selects="handleList"
                       type="primary"
                       @trigger="select_handle"></trends-select>
        <permission tag="trendsSelect"
                    class="inline ml-xs mr-mini"
                    type="primary"
                    :route="apis.url_export_supplier"
                    :selects="partAllOptions"
                    @trigger="export_handle"></permission>
        <permission tag="trendsSelect"
                    class="inline ml-xs mr-xs"
                    type="primary"
                    :route="apis.url_supplier_export_fuiou"
                    :selects="exportFuiou"
                    @trigger="export_handle"></permission>
        <!--<permission tag="ElButton"-->
                    <!--:route="apis.url_supplier_change_purchaser"-->
                    <!--class="inline mt-sm ml-mini mb-sm"-->
                    <!--type="primary" size="mini"-->
                    <!--@click.native="modify_purchaser">修改采购员</permission>-->
        <el-table
            class="scroll-bar"
            :data="table.dataList"
            border
            :highlight-current-row="true"
            v-loading="isLoading"
            element-loading-text="玩命加载中..."
            v-resize="{height:41}"
            @selection-change="selection_change"
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="35px"></el-table-column>
            <el-table-column label="序号" type="index" width="40px"></el-table-column>
            <el-table-column label="名称" inline-template row-key="company_name">
                <div>
                    <ui-tip :content="row.company_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="联系人" inline-template width="80px">
                <div>
                    <ui-tip :content="row.contacts" :width="78"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="联系电话" inline-template width="100px">
                <div>
                    <ui-tip :content="row.mobile" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="EMAIL" inline-template width="120px">
                <div>
                    <ui-tip :content="row.email" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="地址" inline-template>
                <div>
                    <ui-tip :content="row.address" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="介绍" inline-template>
                <div>
                    <ui-tip :content="row.introduce" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="来源" inline-template width="60px">
                <div>
                    <ui-tip :content="row.source" :width="58"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="状态" inline-template align="center" width="65px">
                <div>{{row.status | filterStatus}}</div>
            </el-table-column>
            <el-table-column label="创建时间" inline-template align="center" width="86px">
                <times :time="row.create_time"></times>
            </el-table-column>
            <el-table-column label="修改时间" inline-template align="center" width="86px">
                <times :time="row.update_time"></times>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <permission
                        tag="span"
                        :route="apis.url_look_supplier"
                        class="operate"
                        @click="look_over(row)">查看</permission>
                    <permission
                        tag="span"
                        :route="apis.url_edit_supplier"> | </permission>
                    <permission
                        tag="span"
                        :route="apis.url_edit_supplier"
                        class="operate"
                        @click="edit(row)">编辑</permission>
                    <permission
                        tag="span"
                        :route="apis.url_delete_supplier"> | </permission>
                    <permission
                        tag="span"
                        :route="apis.url_delete_supplier"
                        class="operate"
                        @click="cur_delete(row)">删除</permission>
                </div>
            </el-table-column>
        </el-table>
        <edit-lookover
            v-model="dialog"
            :isLook="isLook"
            :remove-file="removeFile"
            :remove-information="removeInformation"
            :look-edit-form="lookEditForm"
            @add-edit="add_edit"
            :title="editLookTitle"
            @select-province="select_province_"
            @select-city="select_city_"
        ></edit-lookover>
        <export-dialog v-model="export_visible"></export-dialog>
        <el-pagination
            class="page-fixed"
            @size-change="size_change"
            @current-change="current_change"
            :current-page="table.page"
            :page-sizes="[20,50,100,200,500]"
            :page-size="table.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="table.totalSize">
        </el-pagination>
        <modify-dialog v-model="modifyDialog" :form="modifyForm" @submit="modify_submit"></modify-dialog>
    </page>
</template>
<style lang="stylus">
    .box-label {
        box-sizing: border-box;
        width: 100%;
        color: #5e6d82;
        font-size: 1.25rem;
        padding: 0 21px 10px;
        display: inline-block;
        border-bottom: 2px solid #dee5ee;
        margin-bottom: 20px;
    }

    .el-card {
        overflow: visible;
    }

    .btn-margin-top {
        margin-top: 1px;
        margin-left: 5px;
        margin-right: 6px;
    }
</style>
<script>
    import {downloadFile} from '../../../../lib/http';
    import {
        api_supplier,
        api_export_supplier,
        api_supplier_export_fuiou,
        api_add_supplier,
        api_delete_supplier,
        api_look_supplier,
        api_get_balance,
        api_edit_supplier,
        api_update_supplier,
        api_change_states,
        api_supplier_change_purchaser,
        url_supplier_change_purchaser,
        url_add_supplier,
        url_look_supplier,
        url_edit_supplier,
        url_delete_supplier,
        url_export_supplier,
        url_supplier_export_fuiou
    } from '../../../../api/assert-sup';

    export default {
        permission: {
            url_add_supplier,
            url_look_supplier,
            url_edit_supplier,
            url_delete_supplier,
            url_export_supplier,
            url_supplier_export_fuiou,
            url_supplier_change_purchaser
        },
        page: {
            devinfo: {
                frontEnd: '王月如;黎宏珍',
                backEnd: '谭斌',
                createTime: '2017-1-9',
                updateTime: '2017-9-26'
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
                firstLoading: true,
                supplier_id: "",
                url_supplier: config.apiHost + 'supplier-offer/supplier',
                isLoading: true,
                dialog: false,
                curStatus: -1,
                selectId: [],
                title: "",
                statusList: [
                    {name: "全部", status: -1},
                    {name: "待审核", status: 0},
                    {name: "已审核", status: 1},
                    {name: "停用", status: 2},
                ],
                balanceList: [],
                handleList: [],
                searchList: [
                    {label: "名称", value: "company_name"},
                    {label: "联系人", value: "contacts"},
                    {label: "联系电话", value: "tel"},
                    {label: "EMAIL", value: "email"},
                    {label: "地址", value: "address"},
                ],
                params: {
                    balance_type: "",
                    snType: "company_name",
                    snText: "",
                },
                clears: {
                    snType: "company_name",
                },
                table: {
                    page: 0,
                    pageSize: 50,
                    totalSize: 0,
                    dataList: []
                },
                lookEditForm: {},
                isLook: true,
                editLookTitle: "",
                fileCode: "",
                partAllOptions: [
                    {
                        name: "部分导出", value: 2, action: function () {
                            if (this.selectId.length <= 0) return this.$message({
                                type: "warning",
                                message: "请先选择需要导出的数据"
                            });
                            let params = {
                                supplier_ids: this.selectId,
                                export_type: 2,
                            };
                            Object.assign(params, this.init_params);
                            this.order_export(params);
                        }
                    },
                    {
                        name: "全部导出", value: 1, action: function () {
                            let params = this.init_params();
                            this.order_export(params);
                        }
                    },
                ],
                exportFuiou:[
                    {
                        name: "部分导出至富友", value: 2, action: function () {
                            if (this.selectId.length <= 0) return this.$message({
                                type: "warning",
                                message: "请先选择需要导出的数据"
                            });
                            let params = {
                                supplier_ids: this.selectId,
                                export_type: 2,
                            };
                            Object.assign(params, this.init_params);
                            this.fuiou_export(params);
                        }
                    },
                    {
                        name: "全部导出至富友", value: 1, action: function () {
                            let params = this.init_params();
                            this.fuiou_export(params);
                        }
                    },
                ],
                export_visible: false,
                removeFile:[],
                removeInformation:[],
                modifyDialog:false,
                modifyForm:{
                    old_purchaser_id:'',
                    purchaser_id:'',
                    is_sync:false,
                    type:0
                }
            }
        },
        created() {
            this.get_balance();
        },
        filters: {
            filterTime(val) {
                if (val) return datef('YYYY-MM-dd HH:mm:ss', val);
            },
            filterStatus(val) {
                switch (val) {
                    case 0:
                        return "待审核";
                        break;
                    case 1:
                        return "已审核";
                        break;
                    case 2:
                        return "停用";
                        break;
                }
            }
        },
        watch: {
            curStatus(val) {
                if (val === 0) {
                    this.handleList = [
                        {label: "审核通过", value: 1},
                        {label: "停用", value: 2},
                    ]
                } else if (val === 1) {
                    this.handleList = [
                        {label: "停用", value: 2},
                    ]
                } else if (val === 2) {
                    this.handleList = [
                        {label: "审核通过", value: 1},
                    ]
                }
            }
        },
        computed: {
            changeLabel() {
                let find = this.searchList.find(res => {
                    return res.value === this.params.snType;
                });
                if (!!find) {
                    return find.label;
                }
            },
            emptyText() {
                return this.firstLoading ? '等待请求数据中...' : '暂无数据'
            }
        },
        methods: {
            fuiou_export(params) {
                return this.$http(api_supplier_export_fuiou, params).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                    } else {
                        let params = {
                            page: this.table.page,
                            pageSize: this.table.pageSize,
                            file_code: res.file_code
                        };
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        })
                    }
                    this.$message({type: "success", message: res.message || res});
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve();
            },
            order_export(params) {
                return this.$http(api_export_supplier, params).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                    } else {
                        let params = {
                            page: this.table.page,
                            pageSize: this.table.pageSize,
                            file_code: res.file_code
                        };
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        })
                    }
                    this.$message({type: "success", message: res.message || res});
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve();
            },
            export_handle(val) {
                val.action.call(this, val);
            },
            modify_purchaser(){
                this.modifyForm.type = this.selectId.length === 0?2:1;
                this.modifyForm.old_purchaser_id = '';
                this.modifyForm.purchaser_id = '';
                this.modifyForm.is_sync = false;
                this.modifyDialog = true;
            },
            modify_submit(){
                let data = window.clone(this.modifyForm);
                if(data.type===1){
                    data.supplier_ids = this.selectId;
                    delete data.old_purchaser_id;
                }
                this.$http(api_supplier_change_purchaser,data).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.modifyDialog = false;
                    this.init();
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                    this.modifyDialog = false;
                })
            },
            init_params() {
                let paramsData = {};
                paramsData = {
                    supplier_ids: "",
                    export_type: 1,
                    snType: this.params.snType,
                    balance_type: this.params.balance_type,
//                    status:this.curStatus,  全部导出的时候不需要这个字段
                    snText: this.params.snText.trim()
                };
                return paramsData
            },
            init_status_btn() {
                let curBtn = this.statusList;
                this.statusList = [];
                this.$nextTick(() => {
                    this.statusList = curBtn;
                });
            },
            init() {
                this.isLoading = true;
                let params = {
                    page: this.table.page,
                    pageSize: this.table.pageSize,
                    snType: this.params.snType,
                    balance_type: this.params.balance_type
                };
                this.curStatus > -1 && (params.status = this.curStatus);
                this.params.snText && (params.snText = this.params.snText.trim());
                this.$http(api_supplier, params).then(res => {
                    this.table.dataList = res.data;
                    this.selectId = [];
                    this.table.totalSize = res.count;
                    setTimeout(() => {
                        this.isLoading = false;
                        this.firstLoading = false
                    }, 1000);
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                });
            },
//            ---------------------------------   table多选
            selection_change(val) {
                this.selectId = val.map(row => {
                    return row.id;
                })
            },
            /*结算方式*/
            get_balance() {
                this.$http(api_get_balance).then(res => {
                    this.balanceList = [{name: "全部", label: ""}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            fix_params({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    content: keyword

                };
            },
            select_handle(val) {
                if (this.selectId.length === 0) {
                    this.$message({type: "warning", message: `请选择审批项后，再进行相应操作`});
                } else {
                    this.$confirm(`您将更改所选供应商状态，确认此操作吗？`, "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params = {
                            id: this.selectId
                        }
                        val.value > -1 && (params.status = val.value);
                        this.api_change_states(params);
                    }).catch(() => {
                        this.$message({type: "info", message: `已取消操作`})
                    });
                }
            },
            delete_supplier(id) {
                this.$http(api_delete_supplier, id).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message || res
                    });
                    let index = this.table.dataList.indexOfFun(id, function (old, id) {
                        return old.id === id;
                    });
                    this.table.dataList.splice(index, 1);
                    this.$set(this.table, 'totalSize', this.table.totalSize - 1)
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            look_supplier(id) {
                this.$http(api_look_supplier, id).then(res => {
                    this.dialog = true;
                    this.$set(res, 'payment_effective_time', res.payment_effective_time * 1000);
                    this.lookEditForm = res;
                    this.$nextTick(() => {
                        this.lookEditForm.city_id = res.city_id;
                        this.lookEditForm.area_id = res.area_id;
                    })
                }).catch(code => {
                    console.log(code);
                });
            },
//            ---------------------------------  编辑Api
            edit_supplier(id) {
                this.$http(api_edit_supplier, id).then(res => {
                    this.dialog = true;
                    res.file.forEach(row => {
                        row.file === undefined && (row.file = {});
                    });
                    if (res.payment_information) {
                        res.payment_information.forEach(row => {
                            if (row.file === undefined) {
                                row.file = {};
                            }
                        });
                    }
                    res.payment_effective_time = res.payment_effective_time?res.payment_effective_time*1000:'';
                    this.lookEditForm = res;
                    let Object = {city_id: res.city_id, area_id: res.area_id};
                    this.$nextTick(() => {
                        this.lookEditForm.city_id = Object.city_id;
                        this.$nextTick(() => {
                            this.lookEditForm.area_id = Object.area_id;
                        })
                    })
                }).catch(code => {
                    console.log(code);
                });
            },
//            ---------------------------------  启用停用Api
            api_change_status(data, row) {
                this.$http(api_change_status, data).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message || res
                    });
                    row.status = !row.status;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
//            ---------------------------------  审核供应商Api
            api_change_states(data) {
                this.$http(api_change_states, data).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message || res
                    });
                    data.id.forEach(item => {
                        let index = this.table.dataList.indexOfFun(res => res.id === item);
                        this.table.dataList.splice(index, 1);
                    })
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
//            ---------------------------------   分页
            size_change(size) {
                this.table.pageSize = size;
                this.init();
            },
            current_change(page) {
                this.table.page = page;
                this.init();
            },
//            ---------------------------------   搜索不同的状态
            select_status(val) {
                this.curStatus = this.statusList[val].status;
                this.init();
            },
//            ---------------------------------   搜索
            search() {
                this.init();
            },
//            ---------------------------------   清空搜索
            clear_search() {
                this.snType = "company_name";
                this.snText = "";
                this.balance_type = '';
                this.init();
            },
//            ---------------------------------   添加
            add() {
                this.removeFile = [];
                this.removeInformation = [];
                this.lookEditForm = {
                    id: '',
                    company_name: '',
                    code: '',
                    level: '',
                    type: 0,
                    invoice: '',
                    legal: '',
                    business_license: '',
                    file: [],
                    online_shop_name: '',
                    link: '',
                    purchaser_id: '',
                    categorys: [],
                    new_reason: '',
                    transaction_type: '',
                    pay_type: '',
                    public_accounts: '',
                    public_accounts_name: '',
                    public_accounts_bank: '',
                    public_bank_city: '',
                    public_bank_retained_contact_way: '',
                    private_accounts: '',
                    private_accounts_name: '',
                    private_accounts_bank: '',
                    opening_bank_city: '',
                    opening_id_card: '',
                    bank_retained_contact_way: '',
                    payment_information: [],
                    balance_type: '',
                    payment_effective_time: '',
                    payment_communicator: '',
                    payment_communicator_name: '',
                    contacts: "",
                    contacts_job: "",
                    mobile: "",
                    qq: '',
                    contacts2: "",
                    contacts2_job: "",
                    mobile2: "",
                    qq2: "",
                    province_id: "",
                    city_id: "",
                    area_id: '',
                    address: '',
                    remark: ''
                };
                this.editLookTitle = '新增供应商';
                this.isLook = false;
                this.dialog = true;
            },
            select_province_() {
                this.lookEditForm.city_id = "";
                this.lookEditForm.area_id = "";
            },
            select_city_() {
                this.lookEditForm.area_id = "";
            },
//            ---------------------------------   查看
            look_over(row) {
                this.isLook = true;
                this.editLookTitle = `查看供应商：${row.company_name} 信息`;
                this.look_supplier(row.id);
            },
//            ---------------------------------   编辑
            edit(row) {
                this.isLook = false;
                this.editLookTitle = `编辑供应商：${row.company_name} 信息`;
                this.removeFile = [];
                this.removeInformation = [];
                this.edit_supplier(row.id)
            },
            add_edit(id, categorys) {
                let updateData = window.clone(this.lookEditForm);
                delete updateData.payment_communicator_name;
                updateData.update_time = datef('YYYY-MM-dd HH:mm:ss', new Date() / 1000);
                updateData.payment_effective_time = !!updateData.payment_effective_time ? datef('YYYY-MM-dd', updateData.payment_effective_time / 1000) : '';
                updateData.categorys = categorys;
                updateData.file = updateData.file.map(row => {
                    return {
                        name: row.file.name,
                        size: row.file.size,
                        is_delete: row.path === '' && !!row.id,
                        id: row.id || '',
                        image: row.file.image
                    }
                });
                if (updateData.pay_type !== 2) {
                    delete updateData.public_accounts;
                    delete updateData.public_accounts_name;
                    delete updateData.public_accounts_bank;
                    delete updateData.public_bank_city;
                    delete updateData.public_bank_retained_contact_way;
                    delete updateData.private_accounts;
                    delete updateData.private_accounts_name;
                    delete updateData.private_accounts_bank;
                    delete updateData.opening_bank_city;
                    delete updateData.opening_id_card;
                    delete updateData.bank_retained_contact_way;
                    delete updateData.payment_information;
                }
                if (!!updateData.payment_information) {
                    updateData.payment_information = updateData.payment_information.map(row => {
                        return {
                            name: row.file.name,
                            size: row.file.size,
                            is_delete: row.path === '' && !!row.id,
                            id: row.id || '',
                            image: row.file.image
                        }
                    });
                    let removeInformation = this.removeInformation.filter(row=>!!row.id);
                    if(removeInformation.length>0){
                        updateData.file.push(...removeInformation.map(row=>({id:row.id,is_delete:true})));
                    }
                }
                let removeFile = this.removeFile.filter(row=>!!row.id);
                if(removeFile.length>0){
                    updateData.file.push(...removeFile.map(row=>({id:row.id,is_delete:true})));
                }
                if (!!id) {
                    this.edit_update(id, updateData);
                } else {
                    this.add_update(updateData);
                }
            },
            add_update(data) {
                this.$http(api_add_supplier, data).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message
                    });
                    let param = res.data;
                    this.$set(param, 'mobile', data.mobile);
                    this.$set(param, 'source', '采购');
                    this.$set(param, 'status', 0);
                    this.table.dataList.unshift(param);
                    this.table.totalSize += 1;
                    this.dialog = false;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('update_look_edit_form',false);
                    },300);
                });
            },
            edit_update(id, data) {
                this.$http(api_update_supplier, id, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.dialog = false;
                    let find = this.table.dataList.find(res => res.id === id);
                    if(!!find){
                        Object.assign(find, data);
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('update_look_edit_form', false);
                    }, 200);
                });
            },
//            ---------------------------------   删除
            cur_delete(row) {
                this.$confirm(`您将删除 ${row.company_name} 供货商，确认此操作吗？`, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delete_supplier(row.id);
                }).catch(() => {
                    this.$message({type: "info", message: `已取消删除`});
                });
            }
        },
        components: {
            labelButtons:require('@/components/label-buttons').default,
            editLookover:require('./edit-lookover').default,
            trendsSelect: require('@/components/trends-select').default,
            scroll: require('@/components/scroll').default,
            uiTip: require('@/components/ui-tip').default,
            searchCard: require('@/components/search-card').default,
            exportDialog: require('../../../report/export-dialog').default,
            modifyDialog:require('./modify-dialog').default
        }
    }
</script>
