<template>
    <page>
        <search-module :search-data="searchData"
                       :clears="clears"
                       :status-btn="statusBtn"
                       :type-btn="typeBtn"
                       @search="search"
                       @enter="search"
                       @select-type="select_type"
                       @select-status="select_status"></search-module>
        <div class="mb-xs mt-xs ml-sm">
            <el-button type="primary" @click.native="addDialog = true" size="mini">添加</el-button>
        </div>
        <table-module :loading="loading"
                      :first-loading="firstLoading"
                      :total="total"
                      :search-data="searchData"
                      :table-data="tableData"
                      @delete-item="delete_item"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      @handle-selection-change="handle_selection_change"></table-module>
        <add-module v-model="addDialog" @add="add"></add-module>
    </page>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {api_get_software_list,api_get_software_type,api_post_add_form,api_post_delete,api_post_modify_status} from '@/api/software-management';
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '李佰敏',
                createdTime: '2018-12-14',
                updateTime: '2018-12-14'
            }
        },
        data(){
            return{
                searchData: {
                    page: 1,
                    pageSize: 20,
                },
                software_type: '',
                status: '',
                clears: {},
                statusBtn: [//状态
                    {label: '全部', value: ''},
                    {label: '启用', value: 0},
                    {label: '停用', value: 1},
                ],
                typeBtn:[],
                loading: false,
                firstLoading: true,
                tableData: [],
                total: 0,
                addDialog: false
            }
        },
        mounted(){
            this.init();
            this.get_type()
        },
        methods:{
            init(){
                this.loading = true;
                let data = clone(this.searchData);
                if(this.status !== ''){
                    this.$set(data,'status',this.status)
                }
                if(this.software_type !== ''){
                    this.$set(data,'software_type',this.software_type)
                }
                this.$http(api_get_software_list,data).then(res => {
                    this.loading = false;
                    this.firstLoading = false;
                    this.tableData = res.data;
                    this.tableData.map(row => {
                       return row.status = row.status === 0 ? true : false
                    });
                    this.total = res.count;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            search(){
                this.init();
            },
            //添加
            add(row){
                this.$http(api_post_add_form,row).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.addDialog = false;
                    this.init()
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            //删除
            delete_item(row){
                this.$confirm('确定删除该选项?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_post_delete,row.id).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message
                        });
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
            //切换状态
            select_status(val){
                this.status = val;
                this.init()
            },
            //切换类型
            select_type(val){
                this.software_type = val;
                this.init()
            },
            //获取类型
            get_type(){
                this.$http(api_get_software_type).then(res => {
                    this.typeBtn = [{label:'全部',value: ''},...res]
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
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
            addModule: require('./add-module').default
        }
    }
</script>