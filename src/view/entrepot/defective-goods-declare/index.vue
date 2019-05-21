<template>
    <page>
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-sm">
                <super-select v-model="warehouse_id"
                              @change="change_warehouse"
                              class="inline s-width-default"
                              :options="warehouses"
                              storageKey="localTransitWarehouse"></super-select>
                <!--<el-select v-model="warehouse_id"-->
                           <!--@change="change_warehouse"-->
                           <!--class="inline s-width-default">-->
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
                       @search="search"
                       @select-type="select_type"
                       @select-status="select_status"></search-module>
        <el-row class="ml-sm mb-xs mt-xs">
            <el-button type="primary" size="mini" @click.native="open_declare">次品申报</el-button>
        </el-row>
        <table-module :loading="loading"
                      :first-loading="firstLoading"
                      :total="total"
                      :search-data="searchData"
                      :table-data="tableData"
                      @look-audit="look_audit"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      @handle-selection-change="handle_selection_change"></table-module>
        <!--次品申报框 / 审核框-->
        <declare-dialog v-model="declareDialog"
                        ref="declare_dialog"
                        :action="action"
                        :warehouse="warehouses"
                        :warehouse-id="warehouse_id"
                        :cur-status="curStatus"
                        @single-audit="single_audit"
                        @submit-declare="submit_declare"></declare-dialog>
    </page>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {
        api_get_declare_list,
        api_get_declare_details,
        api_get_warehous_local,
        api_post_add_declare,
        api_post_audit_declare
    } from '@/api/defective-goods-declaration-management';
    import {api_get_warehouse_default} from "@/api/default-warehouse-show";
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '蓝术术',
                createdTime: '2019-01-08',
                updateTime: '2019-01-08'
            }
        },
        data(){
            return{
                warehouse_id: '',
                status: '',//状态
                declare_type: '',
                searchData: {
                    snType: 'sku',//搜索类型
                    snText: '',//搜索内容
                    auditor_id: '',//审核人id
                    creator_id: '',//申报人
                    time_type: 1,//时间类型
                    create_time_form: (Date.now()-(30*24*60*60*1000)),//开始时间
                    create_time_to: Date.now(),//结束时间
                    page: 1,
                    pageSize: 50,
                },
                clears: {
                    snType: 'sku',//搜索类型
                    time_type: 1,
                    page: 1,
                    pageSize: 50,
                },
                warehouses: [],//仓库列表
                checkData: [],//列表选中数据
                loading: false,
                firstLoading: true,
                tableData: [],
                total: 0,
                showDialog: false,
                action: {
                    title: '',
                    operation: ''
                },
                declareDialog: false,
                curId: '',
                curStatus: '',
                curNumber: ''
            }
        },
        mounted(){
            this.get_warehouse();
        },
        methods:{
            init(){
                let params = this.get_init_params();
                this.loading = true;
                this.$http(api_get_declare_list, params).then(res => {
                    this.loading = false;
                    this.firstLoading = false;
                    this.tableData = res.data;
                    this.total = res.count;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            get_init_params(){
                let data = clone(this.searchData);
                if(this.searchData.create_time_form){
                    data.create_time_form=datef('YYYY-MM-dd', this.searchData.create_time_form/1000);
                }else {
                    data.create_time_form='';
                }
                if(this.searchData.create_time_to){
                    data.create_time_to=datef('YYYY-MM-dd', this.searchData.create_time_to/1000);
                }else {
                    data.create_time_to='';
                }
                if(this.searchData.snText) {
                    data.snText = this.searchData.snText.split('\n').filter(row => !!row).map(row => row.trim());
                }
                this.$set(data, 'status', this.status);
                this.$set(data, 'declare_type', this.declare_type);
                this.$set(data, 'warehouse_id', this.warehouse_id);
                return data
            },
            search(){
                this.init();
            },
            //切换仓库
            change_warehouse(val){
                this.warehouse_id = val;
                this.init()
            },
            //打开次品申报弹框
            open_declare(){
                this.declareDialog = true;
                this.action = {
                    title: '提交次品申报',
                    operation: 'declare'
                }
            },
            //打开审核弹框
            look_audit(row, type){
                this.$http(api_get_declare_details, row.id).then(res => {
                    this.action = {
                        title: type === 'audit' ? '审核次品申报' : '查看次品申报',
                        operation: type
                    };
                    this.declareDialog = true;
                    this.curId = row.id;
                    this.curStatus = row.status;
                    this.curNumber = row.number;
                    this.$refs.declare_dialog.addList = res
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            //审核通过/不通过
            single_audit(type){
                let params = {
                    defective_goods_declare_id: this.curId,
                    type: type === '通过' ? 'ok' : 'no'
                };
                this.$confirm(`确定审核` + type + '申报次品' + this.curNumber + '吗?','提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=>{
                    this.$http(api_post_audit_declare, params).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                        this.declareDialog = false;
                        this.init();
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message:code.message||code
                        })
                    })
                }).catch(()=>{
                    this.$message({
                        type:"info",
                        message:"已取消"
                    })
                })
            },
            //提交申报
            submit_declare(details){
                let params = {
                    warehouse_id: this.warehouse_id,
                    details: details
                };
                this.$http(api_post_add_declare, params).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.declareDialog = false;
                    this.init()
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            //获取仓库列表
            get_warehouse(){
                let params = {
                    sign: 'local_transit'
                };
                this.$http(api_get_warehouse_default, params).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    this.warehouse_id = this.warehouses[0].value;
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                })
            },
            //切换状态
            select_status(index, item){
                this.status = item.value;
                if(!this.firstLoading){
                    this.init()
                }
            },
            select_type(index, item){
                this.declare_type = item.value;
                if(!this.firstLoading){
                    this.init()
                }
            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            handle_selection_change(){

            }
        },
        components: {
            searchModule: require('./search-module.vue').default,
            tableModule: require('./table-module.vue').default,
            declareDialog: require('./declare-dialog.vue').default,
            labelItem:require('@/components/label-item.vue').default
        }
    }
</script>