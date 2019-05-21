<template>
    <page class="words-management">
        <search :search-data="searchData"
                :clears="clears"
                :type-list="typeList"
                :platform-list="platformList"
                :status-list="statusList"
                @select-type="selectType"
                @select-status="selectStatus"
                @select-platform="selectPlatform"
                @search="search">
        </search>
        <el-button class="mt-xs mb-xs ml-xs" size="mini" @click.native="add" type="primary">添加</el-button>
        <data-table :table-data="tableData"
                    @get-form="get_form"
                    :loading="loading"
                    @statusDelete="statusDelete"
                    :first-loading="firstLoading">
        </data-table>
        <operation-dialog v-model="dialogVisiable"
                          :title="title"
                          :addData="addData"
                          :add="isAdd"
                          :view="isView"
                          :type-list="dialogTypeList"
                          :filter-channels="filterChannels"
                          @update-add="update_add">
        </operation-dialog>
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
    </page>
</template>

<script>
    import {
        api_keywords_manage_channel,
        api_keywords_manage_type,
        api_keywords_manage_list,
        url_keywords_manage_list,
        api_keywords_manage_add,
        api_keywords_manage_delete,
        api_keywords_manage_permissioned_chanel
    } from'../../.././../api/keywords-manage';
    export default {
        permission: {
            url_keywords_manage_list,
        },
        refresh() {
            this.init();
        },
        data(){
            return{
                dialogVisiable: false,
                title: '',
                isAdd: false,
                isView: false,
                firstLoading: true,
                loading:true,
                total: 0,
                tableData: [],
                searchData:{
                    page: 1,
                    pageSize: 50,
                    keyword: '',
                    type: '',
                    status: 1,
                    channel_id: '',
                    start_date: '',
                    end_date: '',
                },
                addData: {
                    type: '',
                    keyword: '',
                    status: '',
                    channel_ids: [],
                },
                typeList: [],
                dialogTypeList: [],
                platformList: [],
                filterChannels: [],
                statusList: [
                    {label:'全部', value: ''},
                    {label:'启用',value:1},
                    {label:'停用',value:0}
                ],
                clears:{
                    page: 1,
                    pageSize: 50,
                    start_date: new Date(new Date().toLocaleDateString()).getTime()-14*24*60*60*1000,
                    end_date:Date.now(),
                },
            }
        },
        filters:{},
        mounted(){
            this.init();
            this.searchType();
            this.searchChannel();
            this.filtersChannel();
        },
        methods:{
            update_add() {//添加数据
                let data = this.addData;
                // this.loading = true;
                this.$http(api_keywords_manage_add, data).then(res => {
                    this.init();
                    this.dialogVisiable = false;
                    this.$message({type: 'success', message: res.message || res});
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            search() {
                this.init();
            },
            statusDelete(row){ //更改状态手动删除这条
                if(this.searchData.status ===1){
                    if(this.searchData.status !== row.status){
                        let index = this.tableData.indexOfFun(data => data.id === row.id);
                        this.tableData.splice(index, 1);
                        this.total --;
                    }
                }else if(this.searchData.status ===0){
                    if(this.searchData.status !== row.status){
                        let index = this.tableData.indexOfFun(data => data.id === row.id);
                        this.tableData.splice(index, 1);
                        this.total --;
                    }
                }
            },
            searchType() {//搜索列表类型
                this.$http(api_keywords_manage_type).then(res => {
                    this.typeList = [{label: '全部', value: ''}, ...res];
                    this.dialogTypeList = res;  //弹框类型
                }).catch(err => {
                    console.log(err);
                })
            },
            searchChannel() {//搜索列表平台
                this.$http(api_keywords_manage_channel).then(res => {
                    this.platformList = [{name: '全部', id: ''}, ...res];
                }).catch(err => {
                    console.log(err);
                })
            },
            filtersChannel() {//id为 1, 2, 4 增加对应的平台
                this.$http(api_keywords_manage_permissioned_chanel).then(res => {
                    res.forEach(row => {
                          if(row.id ===1){
                              this.$set(row, 'label', 'ebay');
                          }else if(row.id ===2){
                              this.$set(row, 'label', '亚马逊');
                          }else if(row.id ===4){
                              this.$set(row, 'label', '速卖通');
                          }
                        }
                    );
                    this.filterChannels = res;  //弹框过滤平台
                }).catch(err => {
                    console.log(err);
                });
            },
            selectStatus(item) {//状态
                this.searchData.status = this.statusList[item].value;
                this.init();
            },
            selectPlatform(item) {//平台
                this.searchData.channel_id = this.platformList[item].id;
                if(!this.firstLoading){
                    this.init()
                }
            },
            selectType(item) {//类型
                this.searchData.type = this.typeList[item].value;
                if(!this.firstLoading){//第一次不请求
                    this.init()
                }
            },
            //页面初始化请求列表数据
            init() {
                this.loading = true;
                let params = this.init_params();
                this.$http(api_keywords_manage_list, params).then(res => {
                    this.total = res.count;
                    this.tableData = res.data;
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            init_params() {
                let paramsData = window.clone(this.searchData);
                if (this.searchData.start_date) {
                    paramsData.start_date = datef('YYYY-MM-dd', this.searchData.start_date / 1000);
                } else {
                    paramsData.start_date = '';
                }
                if (this.searchData.end_date) {
                    paramsData.end_date = datef('YYYY-MM-dd', this.searchData.end_date / 1000);
                } else {
                    paramsData.end_date = '';
                }
                return paramsData
            },
            get_form(para) {//获取对话框表格数据
                switch(para.type) {
                    case 'view':
                        this.view(para.row);
                        break;
                    case 'del':
                        this.del(para.row);
                        break;
                }
            },
            add() {//添加对话框
                this.title = "添加关键词";
                this.addData = {
                    type: '',
                    keyword: '',
                    status: 1,
                    channel_ids: [],
                };
                this.isAdd = true;
                this.dialogVisiable = true;
            },
            view(row) {//查看对话框
                this.title = `查看关键词：${row.keyword}的信息`;
                this.addData = JSON.parse(JSON.stringify(row));
                let newChannels = this.addData.channels.split(",");
                let arr = [];
                newChannels.forEach(row => {//把平台转成对应的id 勾选平台查看弹框
                    if(row === 'ebay'){
                        arr.push(1)
                    }else if(row === '亚马逊'){
                        arr.push(2)
                    }else if(row === '速卖通'){
                        arr.push(4)
                    }
                });
                this.addData.channel_ids = arr;
                this.isView = true;
                this.dialogVisiable = true;
            },
            del(row) {//删除对话框
                this.$confirm('您将删除此信息, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_keywords_manage_delete, {id: row.id}).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        let index = this.tableData.indexOfFun(data => data.id === row.id);
                        this.tableData.splice(index, 1);
                        this.total --;
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消删除'})
                })
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
        },
        computed:{},
        watch: {
            dialogVisiable(val) {
                if(!val) {
                    this.isView = false;
                    this.isAdd = false;
                }
            }
        },
        components:{
            search: require('./search').default,
            dataTable: require('../management/data-table').default,
            operationDialog: require('./operation-dialog').default,
        }
    }
</script>

<style lang="stylus">
    .words-management{

    }
</style>
