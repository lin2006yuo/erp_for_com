<template>
    <page class="p-index">
        <search-module :search-data="searchData"
                       :clears="clears"
                       :status-btn="statusBtn"
                       @search="search"
                       @enter="search"
                       @select-type="select_type"
                       @select-status="select_status"></search-module>
        <div class="mt-sm mb-sm">
            <permission class="mr-xs inline"
                        tag="ElButton"
                        type="primary"
                        size="mini"
                        v-if="false"
                        :route="apis.url_shopee_dispute"
                        @click="export_order">导出
            </permission>
            <el-button class="inline"
                       type="primary"
                       size="mini"
                       :disabled="selectList.length === 0"
                       @click="grab">立即抓取
            </el-button>
        </div>
        <table-module :loading="loading"
                      :first-loading="firstLoading"
                      :total="total"
                      :search-data="searchData"
                      :table-data="tableData"
                      @look="look"
                      @look-after-sale="look_after_sale"
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
        <look-edit
                :ap-status="apStatus"
                :re-status="reStatus"
                :is-handle="isHandle"
                :is-edit="saleEdit"
                :btn-show="btnShow"
                v-model="lookEditDialog"
                :is-dispute="true"
                :form="lookEditForm"
                :title="title">
        </look-edit>
    </page>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {api_shopee_dispute,
        api_shopee_look_return,
        api_shopee_look_cancel,
        api_shopee_return_state,
        api_shopee_cancel_state,
        api_shopee_cancel_refresh,
        api_shopee_return_refresh,
        url_shopee_dispute} from '../../../../api/dispute';
    import {
        api_look_over,
    } from '@/api/after-sale';
    import {downloadFile} from '@/lib/http';
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '张伟',
                createdTime: '2018-09-30',
                updateTime: '2018-09-30'
            }
        },
        name: "index",
        permission: {
            url_shopee_dispute
        },
        refresh() {
            this.init();
            this.get_state()
        },
        data() {
          return {
              total: 1,
              loading: false,
              firstLoading: true,
              searchData: {
                  type: 1,
                  status_code: '',
                  ordersn: '',
                  account_id: '',
                  time_start: '',
                  time_end: '',
                  page: 1,
                  page_size: 20,
                  export: '',
                  sort_field: '',
                  sort_by: ''
              },
              clears: {
                  ordersn: '',
                  account_id: '',
                  time_start: '',
                  time_end: '',
                  page: 1,
                  page_size: 20,
                  export: '',
                  sort_field: '',
                  sort_by: ''
              },
              statusBtn: [],
              tableData: [],
              selectList: [],
              mdfid: 0,
              mdfTitle: '',
              isEditIssue:false,
              mdfValue: false,
              disputeData: {},
              isLook: false,
              isEdit: {edit: false},
              saleEdit:false,
              title:'',
              isHandle:false,
              apStatus:0,
              reStatus:0,
              lookEditDialog:false,
              btnShow:false,
              lookEditForm:{},
          }
        },
        mounted() {
            this.init();
            this.get_state()
        },
        methods: {
            search(){
                this.init();
                this.get_state()
            },
            init(){
                let data = clone(this.searchData);
                if (!!data.time_start) {
                    data.time_start = Date.parse(new Date(datef('YYYY-MM-dd', data.time_start/1000)))/1000;
                } else {
                    data.time_start = ''
                }
                if (!!data.time_end) {
                    data.time_end = Date.parse(new Date(datef('YYYY-MM-dd', data.time_end/1000)))/1000;
                } else {
                    data.time_end = ''
                }
                this.loading = true;
                this.$http(api_shopee_dispute,data).then(res => {
                    this.tableData = res.list;
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading  =false
                }).catch(code => {
                    this.$message({type:'error',message: code.message || code})
                })
            },
            //点击订单号查看、查看、处理
            look(row,type){
                this.mdfid = row.order_id;
                this.isLook = type !== 'look_order';
                this.disputeData = {};
                let url = this.searchData.type === 1 ? api_shopee_look_cancel : api_shopee_look_return;
                let data = this.searchData.type === 1 ? row.ordersn : row.returnsn;
                this.$http(url, data).then(res => {
                    this.disputeData = res;
                    this.$refs.formmdf.require_server(this.mdfid);
                    this.mdfValue = true;
                    this.isEditIssue = type==='edit';
                    this.mdfTitle = type===`look_order`?`查看订单号：${row.ordersn} 信息`:`${type==='edit'?'处理':'查看'}订单号：${row.ordersn} 纠纷信息`;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                });
            },
            //查看售后
            look_after_sale(row){
                this.saleEdit = false;
                this.title = `查看售后单：${row.ordersn} 信息`;
                this.isHandle = false;
                this.apStatus = row.approve_status;
                this.reStatus = row.refund_status;
                this.lookEditDialog = true;
                this.btnShow = false;
                this.get_look_over(row.aftersale_id);
            },
            //获取查看状态下的售后数据
            get_look_over(val){
                this.lookEditForm = {};
                this.$http(api_look_over, val).then(res => {
                    this.lookEditForm = res;
                }).catch(code => {
                    console.log(code);
                })
            },
            //切换纠纷类型
            select_type(val){
                this.searchData.type = val;
                if(!this.firstLoading){//页面初始化时只发起一次请求
                    this.init();
                    this.get_state()
                }
            },
            //切换处理状态
            select_status(val){
                this.searchData.status_code = val;
                if(!this.firstLoading){
                    this.init()
                }
            },
            //排序
            sort_click(val){
                this.searchData.sort_field = val.prop;
                this.searchData.sort_by = val.order==='ascending'?1:0
                this.init();
            },
            //导出
            export_order(){
                let data = clone(this.searchData);
                data.export = 1;
                this.$http(api_shopee_dispute,data).then(res => {
                    let params = {
                        file_code: res.file_code
                    };
                    let url = config.apiHost + 'downloadFile/downExportFile';
                    downloadFile({
                        url: url,
                        get: params,
                        fileName: res.file_name,
                        suffix: '.xls',
                    });
                    this.$message({type:'success',message: res.message})
                }).catch(code => {
                    this.$message({type:'error',message: code.message || code})
                })
            },
            //抓取
            grab(){
                let arr;
                if(this.searchData.type === 1){
                    arr = this.selectList.map(row => {
                        return row.ordersn
                    })
                    this.$http(api_shopee_cancel_refresh,{ordersn: arr}).then(res => {
                        this.$message({type:'success',message: res.message})
                    }).catch(code => {
                        this.$message({type:'error', message: code.message||code})
                    })
                }else{
                    arr = this.selectList.map(row => {
                        return row.returnsn
                    })
                    this.$http(api_shopee_return_refresh,{returnsn:arr}).then(res => {
                        this.$message({type:'success',message: res.message})
                    }).catch(code => {
                        this.$message({type:'error', message: code.message||code})
                    })
                }
            },
            //分页器条数切换
            handle_size_change(val){
                this.searchData.page_size = val;
                this.init();
            },
            //分页器页数切换
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            //选择多条数据
            handle_selection_change(val){
                this.selectList = val
            },
            //获取状态列表
            get_state(){
                let url = this.searchData.type === 1 ? api_shopee_cancel_state : api_shopee_return_state;
                this.$http(url).then(res=>{
                    res.forEach(btn=>{
                        this.$set(btn,'value',btn.code);
                    });
                    if(this.statusBtn.length===0){
                        this.statusBtn = res;
                    }else{
                        this.statusBtn.forEach(button=>{
                            let find = res.find(row=>{
                                return Number(button.code)===Number(row.code)
                            });
                            if(find){
                                button.count = find.count;
                            }
                        });
                    }
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            }
        },
        components: {
            searchModule: require('./search-module.vue').default,
            tableModule: require('./table-module.vue').default,
            formMdf: require('./form-mdf.vue').default,
            lookEdit: require('../../../../view/customer-service/after-sale/look-edit').default,
        }
    }
</script>