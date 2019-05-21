<template>
    <page>
        <search-module :search-data="searchData"
                       :clears="clears"
                       :status-btn="statusBtn"
                       @search="search"
                       @select-status="select_status"></search-module>
        <table-module :loading="loading"
                      :first-loading="firstLoading"
                      :total="total"
                      :search-data="searchData"
                      :table-data="tableData"
                      @look="look"
                      @update="update"
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
    import {
        api_get_paypal_dispute,
        api_get_paypal_status,
        api__paypal_dispute_update,
        api_paypal_dispute_details,
        api_get_paypal_account
    } from '@/api/paypal-dispute';
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
                status: '',
                searchData: {
                    page: 1,
                    pageSize: 20,
                    snType: 'dispute_id',
                    snText: '',
                    reason: '',
                    accountId: '',
                    startDate: (Date.now()-(30*24*60*60*1000)),
                    endDate: Date.now(),
                    sortField: '',
                    sortType: ''
                },
                clears: {
                    snType: 'dispute_id',
                    page: 1,
                    pageSize: 20
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
                let params = this.get_init_params();
                this.loading = true;
                this.$http(api_get_paypal_dispute, params).then(res => {
                    this.tableData = res.data;
                    this.total = +res.count;
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code => {
                    this.$message({type:'error',message: code.message || code})
                })
            },
            get_init_params(){
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
                this.$set(data, 'status', this.status);
                return data
            },
            search(){
                this.init();
                this.get_status()
            },
            //点击订单号查看、查看、处理
            look(row,type){
                this.mdfid = row.local_order_id;
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
            //更新
            update(row){
                this.$http(api__paypal_dispute_update, row.id).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.init();
                    this.get_status()
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            //切换纠纷状态
            select_status(index, item){
                this.status = item.code;
                this.init()
            },
            //获取纠纷状态
            get_status(){
                this.$http(api_get_paypal_status).then(res=>{
                   if(this.statusBtn.length === 0){
                       this.statusBtn = res.map(row => {
                           return {
                               count: row.total,
                               label: row.label,
                               code: row.value
                           }
                       })
                   }else{
                       this.statusBtn.forEach(button => {
                           let find = res.find(row => {
                               return button.code === row.value
                           });
                           if(find){
                               button.count = find.total;
                           }
                       })
                   }
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
            handle_selection_change(val){

            }
        },
        components: {
            searchModule: require('./search-module.vue').default,
            tableModule: require('./table-module.vue').default,
            formMdf: require('./form-mdf').default
        }
    }
</script>