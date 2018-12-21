<template>
    <page class="p-index">
        <search :search-data="searchData" :clears="clears" @search="search"></search>
        <div class="mt-xs mb-xs ml-sm">
            <el-button type="primary"
                       size="mini"
                       class="inline"
                       @click.native="add_rules">{{$t('ymx-up-lower-rule.addBtn')}}</el-button>
            <el-button type="primary"
                       size="mini"
                       class="inline ml-sm"
                       @click.native="delete_rules"
                       :disabled="selectList.length === 0">{{$t('ymx-up-lower-rule.batchDeleteBtn')}}</el-button>
        </div>
        <table-data :loading="loading"
                    :first-loading="firstLoading"
                    :table-data="tableData"
                    @current-change="current_change"
                    @size-change="size_change"
                    @handle-selection-change="handle_selection_change"
                    @edit="edit_rules"
                    @delete-rule="delete_rule"
                    @change-status="change_status"></table-data>
        <add-edit v-model="add_edit_visiable"
                  :action="action"
                  @update="update"></add-edit>
    </page>
</template>

<style lang="stylus">

</style>

<script>
    import {api_up_lower_rule_list, api_delete_up_lower_rules, api_up_lower_rule_status} from '@/api/up-lower-rule-list'
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '郝龙飞',
                createdTime: '2018-10-26',
                updateTime: '2018-10-26'
            }
        },
        refresh(){
            this.init();
        },
        data(){
            return{
                loading: false,
                firstLoading: true,
                searchData: {
                    rule_name: '',
                    page: 1,
                    pageSize: 50
                },
                clears: {},
                tableData: {
                    lists: [],
                    total: 0,
                    page: 1,
                    pageSize: 50
                },
                selectList: [],
                add_edit_visiable: false,
                action:{
                    title:'',
                    type:'',
                    id: ''
                }
        }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                this.loading = true;
                let data = window.clone(this.searchData);
                data.page = this.tableData.page;
                data.pageSize = this.tableData.pageSize;
                this.$http(api_up_lower_rule_list, data).then(res => {
                    this.tableData.lists = res.data;
                    this.tableData.page = +res.page;
                    this.tableData.pageSize = +res.pageSize;
                    this.tableData.total = +res.count;
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code => {
                    console.log(code);
                })
            },
            add_rules(){//-----添加规则按钮
                this.add_edit_visiable = true;
                this.action.title = this.$t('ymx-up-lower-rule.addTitle');
                this.action.type = 'add';
            },
            delete_rules(){//------批量删除规则按钮
                let params = this.selectList.map(row => row.id).join(',');
                this.delete_way(params)
            },
            delete_rule(row){//------单个/批量删除规则
                this.delete_way(row.id)
            },
            delete_way(val){
                this.$confirm(this.$t('ymx-up-lower-rule.deleteMsg'), this.$t('ymx-up-lower-rule.prompt'), {
                    confirmButtonText: this.$t('ymx-up-lower-rule.confirmBtn'),
                    cancelButtonText: this.$t('ymx-up-lower-rule.cancelBtn'),
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_up_lower_rules, {ids: val}).then(res => {
                        this.$message({type: 'success', message: res.message});
                        this.init()
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message||code})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('ymx-up-lower-rule.cancelMsg')
                    });
                });
            },
            edit_rules(row){//-----编辑规则
                this.add_edit_visiable = true;
                this.action.title = this.$t('ymx-up-lower-rule.editTitle');
                this.action.type = 'edit';
                this.action.id = row.id;
            },
            change_status(row){//----修改状态
                this.$confirm(this.$t('ymx-up-lower-rule.modifyMsg'),this.$t('ymx-up-lower-rule.prompt'), {
                    confirmButtonText: this.$t('ymx-up-lower-rule.confirmBtn'),
                    cancelButtonText: this.$t('ymx-up-lower-rule.cancelBtn'),
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    let status = row.status ? 0 : 1;
                    let params = {
                        id: row.id,
                        status: status
                    };
                    this.$http(api_up_lower_rule_status, params).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        this.init()
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code,
                        });
                    })
                }).catch((code) => {
                    this.$message({
                        type: 'info',
                        message: this.$t('ymx-up-lower-rule.cancelMsg')
                    });
                });
            },
            update(){//------确定添加/确定编辑
                this.init()
            },
            current_change(page){
                this.tableData.page = page;
                this.init()
            },
            size_change(size){
                this.tableData.pageSize = size;
                this.init()
            },
            handle_selection_change(val){//------多选列表选中按钮变成可点击
                this.selectList = val
            },
            search(){
                this.init()
            }
        },
        components: {
            search:require('./search.vue').default,
            tableData:require('./table-data').default,
            addEdit:require('./add-edit').default
        }
    }
</script>