<template>
    <page class="p-index">
        <card-search :search-data="searchData"
                     :clears="clears"
                     :msg-type="msgType"
                     :platformList="platformList"
                     :account-list="accountList"
                     @search="search"
                     @reflash="search"
                     @select-type="select_type"
                     @select-channel="selectChannel">
        </card-search>
        <data-table :table-data="tableData"
                    @get-form="get_form"
                    :first-loading="firstLoading"
                    :loading="loading"
                    class="mt-sm">
        </data-table>
        <look-dialog :title="title"
                     v-model="lookVisable"
                     :form="form">
        </look-dialog>
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
        api_keywords_record_list,
        api_keywords_list_view,
        api_keywords_ebay_account,
        api_keywords_amazon_account,
        api_keywords_aliexpress_account,
    } from'../../.././../api/keywords-manage';
    export default {
        permission:{
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                title: '',
                form:{},
                firstLoading: true,
                loading:true,
                platformList: [],
                accountList:[],
                lookVisable: false,
                searchData: {
                    page: 1,
                    pageSize: 50,
                    account_id: '',//账号id
                    keyword: '', //关键词
                    channel_id: '', //平台
                    type: '', //类型
                    // start_date:(Date.now()-(14*24*60*60*1000)),
                    start_date: new Date(new Date().toLocaleDateString()).getTime()-14*24*60*60*1000,
                    end_date:Date.now(),
                },
                total: 0,
                clears:{
                    page: 1,
                    pageSize: 50,
                    start_date: new Date(new Date().toLocaleDateString()).getTime()-14*24*60*60*1000,
                    end_date:Date.now(),
                },
                msgType:[],
                tableData: [],
            }
        },
        mounted(){
            this.searchType();
            this.searchChannel();
            this.init();
        },
        watch: {
            lookVisable(val) {
                if(!val){
                    this.form = {};
                }
            }
        },
        methods: {
            //获取ebay账号简称数据
            get_account(){
                let url;
                if(this.searchData.channel_id ===1){
                    url = api_keywords_ebay_account
                }else if(this.searchData.channel_id ===2){
                    url = api_keywords_amazon_account
                }else if(this.searchData.channel_id ===4){
                    url = api_keywords_aliexpress_account
                }else{
                    return;
                }
                this.$http(url).then(res=>{
                    let newArr = res.map(row => ({
                        label: row.code,
                        value: row.id
                    }));
                    this.accountList = newArr;
                    this.accountList.forEach((row, index) => {
                        if (index < 10) {
                            this.$set(row, 'showSearch', true);
                        } else {
                            this.$set(row, 'showSearch', false);
                        }
                        this.$set(row, 'showDialog', true);
                    });
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            searchChannel() {//搜索平台展示
                this.$http(api_keywords_manage_channel).then(res => {
                    this.platformList = [{name: '全部', id: ''}, ...res];
                }).catch(err => {
                    console.log(err);
                })
            },
            searchType() {//搜索类型
                this.$http(api_keywords_manage_type).then(res => {
                    this.msgType = [{label: '全部', value: ''}, ...res];
                }).catch(err => {
                    console.log(err);
                })
            },
            search() {
                this.init();
            },
            selectChannel(item) {//---平台
                this.searchData.channel_id = this.platformList[item].id;
                this.searchData.account_id = '';
                if(!this.firstLoading){//第一次不请求
                    this.init();
                    this.get_account();
                }
            },
            select_type(item) {//---类型
                this.searchData.type = this.msgType[item].value;
                if(!this.firstLoading){
                    this.init();
                }
            },
            get_form(row) {//查看按钮
                this.title = `查看关键词：${row.keyword}匹配的站内信/邮件`;
                this.$http(api_keywords_list_view,{id: row.id}).then(res => {
                    this.form = res.data;
                    this.lookVisable = true;
                }).catch(code => {
                    console.log(code);
                });
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
            //页面初始化请求列表数据
            init() {
                this.loading = true;
                let params = this.init_params();
                this.$http(api_keywords_record_list, params).then(res => {
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
        },
        props: {},
        components: {
            cardSearch: require("./card-search").default,
            dataTable: require("./data-table").default,
            lookDialog: require("./look-dialog").default,
        },
    }
</script>

<style scoped>

</style>
