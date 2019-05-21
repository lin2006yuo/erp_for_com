<template class="p-shipping-address">
    <page>
        <search-module :search-data="searchData"
                       :clears="clears"
                       :type-btn="typeBtn"
                       @search="search"
                       @select-type="select_type"></search-module>
        <el-row class="mt-xs mb-xs ml-sm">
            <el-button type="primary"
                       size="mini"
                       @click.native="add_address">新增</el-button>
        </el-row>
        <table-module :loading="loading"
                      :first-loading="firstLoading"
                      :total="total"
                      :search-data="searchData"
                      :table-data="tableData"
                      @delete-address="delete_address"
                      @look-edit="look_edit"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      @handle-selection-change="handle_selection_change"></table-module>
        <add-edit v-model="showDialog"
                    :form-data="formData"
                    :editable="editable"
                    :action="action"
                    @save="save_address"></add-edit>
    </page>
</template>

<script>
    import {
        api_get_address_list,
        api_post_add_address,
        api_put_modify_address,
        api_get_address_detail,
        api_delete_address
    } from '@/api/shipping-address-setting';
    export default {
        devinfo: {
            frontEnd: '钱宇琨',
            backEnd: '翟雪莉',
            createdTime: '2018-12-24',
            updateTime: '2018-12-24'
        },
        data() {
            return {
                typeBtn: [
                    {label: '全部', value: ''},
                    {label: '寄件人信息', value: 1},
                    {label: '揽收人信息', value: 2},
                    {label: '退货人信息', value: 3}
                ],
                type: '',
                searchData: {
                    address_name: '',
                    create_id: '',
                    date_b: '',
                    date_e: '',
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    page: 1,
                    pageSize: 20
                },
                tableData: [],
                loading: false,
                firstLoading: true,
                total: 0,
                formData: {},
                action: {
                    title: '',
                    operation: ''
                },
                showDialog: false,
                editable: false,
                curId: ''
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            init(){
                this.loading = true;
                let data = this.get_init_params();
                this.$http(api_get_address_list, data).then(res => {
                    this.loading = false;
                    this.firstLoading = false;
                    this.tableData = res.data;
                    this.total = res.count
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            search(){
                this.init()
            },
            get_init_params(){
                let params = clone(this.searchData);
                if(this.searchData.date_b){
                    params.date_b = datef('YYYY-MM-dd', this.searchData.date_b/1000);
                }else {
                    params.date_b = '';
                }
                if(this.searchData.date_e){
                    params.date_e = datef('YYYY-MM-dd', this.searchData.date_e/1000);
                }else {
                    params.date_e = '';
                }
                this.$set(params, 'type', this.type);
                delete params.account_creator_name;
                return params
            },
            //查看 / 修改 地址
            look_edit(row, operation) {
                this.curId = row.id;
                this.$http(api_get_address_detail, this.curId).then(res => {
                    this.formData = res;
                    this.action = {
                        title: (operation === 'look' ? '查看' : '修改') +'信息',
                        operation: operation,
                        type: res.type
                    };
                    this.editable = operation === 'look' ? false : true;
                    this.showDialog = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                });
            },
            //新增地址弹框打开
            add_address(){
                this.showDialog = true;
                this.action = {
                    title: '新增地址',
                    operation: 'add'
                };
                this.editable = true
            },
            //删除地址
            delete_address(row){
                this.$confirm('确定删除该地址吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_address, row.id).then(res => {
                        this.$message({type: 'success', message: res.message});
                        this.init()
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message||code})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //保存修改地址 / 保存新增地址
            save_address(data, type, addressName){
                let params = {};
                data.forEach(row => {
                   this.$set(params, row.name, row.value)
                });
                this.$set(params, 'type', +type);
                this.$set(params, 'address_name', addressName);
                if(this.action.operation === 'add'){
                    this.$http(api_post_add_address, params).then(res => {
                        this.$message({type: 'success', message: res.message});
                        this.showDialog = false;
                        this.init()
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message||code})
                    })
                }else{
                    this.$http(api_put_modify_address, this.curId, params).then(res => {
                        this.$message({type: 'success', message: res.message});
                        this.showDialog = false;
                        this.init()
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message||code})
                    })
                }
            },
            //切换类型
            select_type(index, item){
                this.type = item.value;
                this.init()
            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            handle_selection_change(val){

            }
        },
        components:{
            tableModule: require('./table-module.vue').default,
            searchModule: require('./search-module.vue').default,
            addEdit: require('./add-edit.vue').default
        }
    }
</script>

<style scoped>

</style>