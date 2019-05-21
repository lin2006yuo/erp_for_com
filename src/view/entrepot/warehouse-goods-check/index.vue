<template>
    <page>
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-sm">
                <super-select v-model="warehouse_id"
                              @change="change_depot"
                              class="inline width-xs"
                              :options="warehouses"
                              storageKey="globalWarehouse"></super-select>
                <!--<el-select v-model="warehouse_id" @change="change_depot" class="inline width-xs">-->
                    <!--<el-option-->
                            <!--:key="item.value"-->
                            <!--v-for="item in warehouses"-->
                            <!--:label="item.label"-->
                            <!--:value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            </label-item>
        </div>
        <search-module :search-data="searchData"
                       :clears="clears"
                       :type-list="typeList"
                       :status-list="statusList"
                       @change-status="change_status"
                       @change-type="change_type"
                       @init-status-btn="init_status_btn"
                       @search="init"
                       ref="search_module">
        </search-module>
        <el-button type="primary"
                   size="mini"
                   @click="add"
                   class="inline mt-xs ml-sm">添加盘点单
        </el-button>
        <permission tag="trendsSelect"
                    class="inline ml-sm mt-xs"
                    type="primary"
                    :route="apis.url_post_export"
                    :selects="partAllOptions"
                    @trigger="export_data"></permission>
        <permission tag="trendsSelect"
                    class="inline ml-sm mt-xs"
                    type="primary"
                    :route="apis.url_post_abnormal_export"
                    :selects="abnormalOptions"
                    @trigger="export_abnormal"></permission>
        <table-module :search-data="searchData"
                      :table-data="tableData"
                      :loading="loading"
                      :total="total"
                      :first-loading="firstLoading"
                      @look="look"
                      @edit="edit"
                      @finish="finish"
                      @print="print"
                      @init="init"
                      @handle-selection-change="handle_selection_change"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      style="margin-top: 5px"
                      ref="table_module">
        </table-module>
        <add-list v-model="visible"
                  :action="action"
                  :add-list="addList"
                  @new-data="init"
                  @add-allocation="addAllocation"
                  ref="add_list"
                  :warehouse="warehouses">
        </add-list>
        <add-allocation v-model="addVisible"
                        :add-action="addAction"
                        :edit-list="editList"
                        ref="add_allocation"
                        @init="init"
                        @add-goods="addGoods"
                        @add-allocation="addAllocation"
                        :warehouse="warehouses"
                        :table-data="formData">
        </add-allocation>
        <edit-check-orders v-model="editVisible"
                           ref="check_orders"
                           :add-action="addAction"
                           @add-goods="addGoods"
                           @edit-goods="editGoods"
                           :warehouse="warehouses">
        </edit-check-orders>
        <export-field  :param="export_model_type"
                    v-model="exportVisible"
                    :fields="fields"
                    :templates="templates"
                    @getTemplate="get_templates"
                    title="请选择自定义导出字段"
                    :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_warehouse_get, api_get_detail, api_warehouse_goods_check, api_get_export_title, api_post_export, api_goods_export_template, url_post_export, api_post_abnormal_export, url_post_abnormal_export} from '@/api/warehouse-goods-check'
    import {api_get_warehouse_default} from "@/api/default-warehouse-show";
    import {api_get_status} from '@/api/warehouse-goods-check';
    import {downloadFile} from '@/lib/http';
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'刘志勇',
                createTime:'2017-12-04',
                updateTime:'2017-12-13'
            },
        },
        permission: {
            url_post_export,
            url_post_abnormal_export
        },
        refresh(){
            this.init()
        },
        data(){
            return {
                loading:false,
                tableData:[],
                total:0,
                firstLoading: true,
                warehouse_id: '',
                warehouses: [],
                statusList: [],
                typeList: [
                    {label: '全部', value: ''},
                    {label: '动态盘点', value: 0},
                    {label: '静态盘点', value: 1},
                    {label: '拣货异常', value: 2}
                ],
                searchData: {
                    type: '',
                    status: '',
                    id: '',
                    operator_type: 'checker_id',
                    operator_id: '',
                    create_time_from: '',
                    create_time_to: '',
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    operator_type: 'checker_id',
                    page: 1,
                    pageSize: 20
                },
                formData:[],
                visible:false,
                action:{},
                addVisible:false,
                addAction:{},
                addList:[],
                editList:[],
                editVisible:false,
                checkList: [],
                partAllOptions: [
                    {name: "部分导出", value: 2},
                    {name: "全部导出", value: 1}
                ],
                abnormalOptions: [
                    {name: "异常SKU部分导出", value: 2},
                    {name: "异常SKU全部导出", value: 1}
                ],
                fields: [],
                templates: [],
                export_type: '',
                export_model_type: {
                    type: 36
                },
                export_visible: false,
                exportVisible: false
            }
        },
        mounted(){
            this.init_warehouse();
            this.init_status();
            this.get_fields();
            this.get_templates();
        },
        methods: {
            get_fields() {
                this.$http(api_get_export_title).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 36}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_data(val) {
                if (val.value === 2 && this.checkList.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisible = true;
            },
            export_abnormal(val) {
                if (val.value === 2 && this.checkList.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                let data = {};
                if(val.value === 2){
                    data = {
                        ids: this.checkList.map(row => {
                            return row.id
                        })
                    }
                }else{
                    data = this.init_params()
                }
                this.$http(api_post_abnormal_export, data).then(res => {
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
            },
            creat_excel(param) {
                let fields = param.field.join(',');
                let data = '';
                switch (this.export_type) {
                    case 2://部分
                        data = {
                            ids: this.checkList.map(row => {
                                return row.id
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
                return this.$http(api_post_export, params, head).then(res => {
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
            init(){
                this.loading = true;
                let params = this.init_params();
                this.$http(api_warehouse_goods_check, params).then(res=>{
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code=>{
                    this.loading = false;
                    this.$message({type:"error",message:code.message || code});
                })
            },
            init_params(){
                typeof this.searchData.id === 'string' && (this.searchData.id = this.searchData.id.trim());
                let data = clone(this.searchData);
                if(this.searchData.create_time_from){
                    data.create_time_from = datef('YYYY-MM-dd', this.searchData.create_time_from/1000);
                }else {
                    data.create_time_from = '';
                }
                if(this.searchData.create_time_to){
                    data.create_time_to = datef('YYYY-MM-dd', this.searchData.create_time_to/1000);
                }else {
                    data.create_time_to = '';
                }
                this.$set(data, 'warehouse_id', this.warehouse_id);
                return data
            },
            init_warehouse() {
                let params = {
                    sign: 'global'
                };
                this.$http(api_get_warehouse_default, params).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    this.$nextTick(() => {
                        this.warehouse_id = this.warehouses[0].value
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            init_status() {
                this.$http(api_get_status).then(res => {
                    this.statusList = [{label: '全部', value: ''}, ...res];
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            init_status_btn() {
                let cur = this.typeList;
                let cur2 = this.statusList;
                this.typeList = [];
                this.statusList = [];
                this.$nextTick(() => {
                    this.typeList = cur;
                    this.statusList = cur2;
                })
            },
            change_depot() {
                this.init();
            },
            change_status(select, item) {
                this.searchData.status = item.value;
                if(!this.firstLoading){
                    this.init();
                }
            },
            change_type(select, item) {
                this.searchData.type = item.value;
                if(!this.firstLoading){
                    this.init();
                }
            },
            handle_selection_change(val){
                this.checkList = val
            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            add(){
                this.action = {title:'添加盘点单', value:'add'};
                this.$refs.add_list.addData.warehouse_id = this.warehouse_id;
                this.visible = true;
            },
            look(row){
                this.addAction = {title:`查看盘点单${row.id}`, value:'look'};
                this.$refs.add_allocation.searchData.warehouse_id = this.warehouse_id;
                this.$http(api_get_detail, row.id).then(res=>{
                    this.formData = res;
                    this.addVisible = true;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            edit(row){
                this.addAction = {title:`编辑盘点单${row.id}`, value:'edit'};
                this.$refs.add_allocation.searchData.warehouse_id = this.warehouse_id;
                this.$http(api_get_detail, row.id).then(res=>{
                    this.formData = res;
                    this.formData.details = this.formData.details.map(row=>{
                        if(!row.remark){
                            row.remark = '';
                        }
                        return row;
                    });
                    this.addVisible = true;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            finish(row){
                this.addAction = {title:`完成盘点单${row.id}`, value:'finish'};
                this.$refs.add_allocation.searchData.warehouse_id = this.warehouse_id;
                this.$http(api_get_detail, row.id).then(res=>{
                    this.formData = res;
                    this.addVisible = true;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            addAllocation(val){
                this.addAction = {title:'添加货位', value:val};
                this.$refs.check_orders.searchData.warehouse_id = this.warehouse_id;
                this.editVisible = true;
            },
            addGoods(data){
                this.addList = data;
            },
            editGoods(data){
                this.editList = data;
            },
            print(row){
                this.addAction = {title:`打印盘点单${row.id}`, value:'print'};
                this.$refs.add_allocation.searchData.warehouse_id = this.warehouse_id;
                this.$http(api_get_detail, row.id).then(res=>{
                    this.formData = res;
                    this.addVisible = true;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            }
        },
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            addList:require('./add-list.vue').default,
            addAllocation:require('./add-allocation.vue').default,
            editCheckOrders:require('./edit-check-orders.vue').default,
            trendsSelect:require('@/components/trends-select').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../report/export-dialog').default,
            labelItem: require('@/components/label-item.vue').default
        },
    }
</script>
