<template>
    <page>
        <search-module :search-data="searchData"
                       :clears="clears"
                       :status-btn="statusBtn"
                       @search="search"
                       @enter="search"
                       @select-status="select_status"></search-module>
        <table-module :loading="loading"
                      :first-loading="firstLoading"
                      :total="total"
                      :search-data="searchData"
                      :table-data="tableData"
                      @look="look"
                      @sort-click="sort_click"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      @handle-selection-change="handle_selection_change"></table-module>
        <form-mdf ref="formmdf"
                  :mdfid="mdfid"
                  :title="mdfTitle"
                  :is-edit-issue="isEditIssue"
                  v-model="mdfValue"
                  :is-edit="isEdit"
                  :is-show="isLook"
                  :btn-show="btnShow"
                  :dispute-data="disputeData"></form-mdf>
    </page>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import { api_get_paypal_dispute,
              api_get_paypal_status,
              api_paypal_dispute_update,
              api_paypal_dispute_details,
              api_get_paypal_account } from '@/api/paypal-dispute';
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '张冬冬',
                createdTime: '2018-12-03',
                updateTime: '2018-12-03'
            }
        },
        data(){
            return{
                searchData: {
                    page: 1,
                    pageSize: 20,
                    status: '',
                    snType: 'dispute_id',
                    snText: '',
                    reason: '',
                    accountId: '',
                    startDate: '',
                    endDate: '',
                    sortField: '',
                    sortType: ''
                },
                clears: {
                    snType: 'dispute_id',
                    snText: '',
                    reason: '',
                    startDate: '',
                    endDate: ''
                },
                statusBtn: [],//纠纷状态
                loading: false,
                firstLoading: true,
                tableData: [],
                total: 0,
                //form-mdf数据
                mdfid: 0,
                mdfTitle: '',
                isEditIssue:false,
                mdfValue: false,
                disputeData: {},
                isLook: false,
                isEdit: {edit: false},
                btnShow:false,
            }
        },
        mounted(){
          this.init();
          this.get_status()
        },
        methods:{
            init(){
                let data = clone(this.searchData);
                if (!!data.startDate) {
                    data.startDate = datef('YYYY-MM-dd', data.startDate/1000)
                } else {
                    data.startDate = ''
                }
                if (!!data.endDate) {
                    data.endDate = datef('YYYY-MM-dd', data.endDate/1000)
                } else {
                    data.endDate = ''
                }
                this.loading = true;
                this.$http(api_get_paypal_dispute, data).then(res => {
                    this.tableData = res.data;
                    this.total = +res.count;
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code => {
                    this.$message({type:'error',message: code.message || code})
                })
            },
            search(){
                this.init()
            },
            //点击订单号查看、查看、处理
            look(row,type){
                this.mdfid = row.order_id;
                this.isLook = type !== 'look_order';
                this.disputeData = {};
                this.$http(api_paypal_dispute_details, row.id).then(res => {
                    this.disputeData = res.data;
                    this.$refs.formmdf.require_server(this.mdfid);
                    this.mdfValue = true;
                    this.isEditIssue = type==='edit';
                    this.mdfTitle = type===`look_order`?`查看订单号：${row.order_number} 信息`:`${type==='edit'?'处理':'查看'}订单号：${row.order_number} 纠纷信息`;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                });
            },
            //切换纠纷状态
            select_status(val){
                this.searchData.status = val;
                this.init()
            },
            //获取纠纷状态
            get_status(){
                this.statusBtn = [];
                this.$http(api_get_paypal_status).then(res=>{
                    this.statusBtn = res;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            //排序
            sort_click(val){
                this.searchData.sortField = val.prop;
                this.searchData.sortType = val.order==='ascending'?'asc':'desc'
                this.init();
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
            formMdf: require('./form-mdf').default
        }
    }
</script>