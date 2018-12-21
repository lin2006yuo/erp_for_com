<template>
    <page class="p-index">
        <search :search-data="searchData" :clears="clears" @search="search"></search>
        <div class="ml-sm mt-xs mb-xs">
            <el-button type="primary" @click="batch_delete" :disabled="selectList.length === 0">{{$t('ymx-follow.batch_deleting')}}</el-button>
        </div>
        <table-data :loading="loading"
                    :first-loading="firstLoading"
                    :table-data="tableData"
                    @current-change="current_change"
                    @size-change="size_change"
                    @deal-with="deal_with"
                    @delete-item="delete_item"
                    @handle-selection-change="handle_selection_change"></table-data>
        <deal-with-dialog v-model="dialogShow" @submit="submit"></deal-with-dialog>
    </page>
</template>

<style lang="stylus">

</style>

<script>
    import {api_heel_sale_complain_list, api_heel_sale_complain_deal_with, api_heel_sale_complain_delete} from '@/api/heel-sale-complaint-management'
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '郝龙飞',
                createdTime: '2018-10-27',
                updateTime: '2018-10-27'
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
                  search_type: 1,
                  search_content: '',
                  account_person_type: 1,
                  account_person_content: '',
                  is_heel_sale: 0,
                  status: 0,
                  star_time: '',
                  end_time: '',
                  page: 1,
                  pageSize: 50
              },
              clears: {
                  search_type: 1,
                  account_person_type: 1,
                  status: 0,
              },
              tableData: {
                  lists: [],
                  total: 0,
                  page: 1,
                  pageSize: 50
              },
              selectList: [],
              dialogShow: false,
              curId: ''
          }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                this.loading = true;
                let data = window.clone(this.searchData);
                // if(data.star_time instanceof Date){
                //     data.star_time = datef("YYYY-MM-dd HH:mm:ss", parameter.star_time.getTime()/1000);
                // }
                // if(data.end_time instanceof Date){
                //     data.end_time = datef("YYYY-MM-dd HH:mm:ss", parameter.end_time.getTime()/1000);
                // }
                data.page = this.tableData.page;
                data.pageSize = this.tableData.pageSize;
                let splitText = this.split_search(data.search_content);
                data.search_content = splitText&&splitText.length?splitText.map(row=>row.trim()):'';
                data.account_person_content = data.account_person_content.trim();
                this.$http(api_heel_sale_complain_list, data).then(res => {
                    this.tableData.lists = res.data;
                    this.tableData.page = +res.page;
                    this.tableData.pageSize = +res.pageSize;
                    this.tableData.total = +res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            split_search(data){
                let curString = data.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                return cur
            },
            search(){
                this.init()
            },
            deal_with(row){//打开处理方式弹框
                this.dialogShow = true;
                this.curId = row.id
            },
            submit(type,modify_price,lowest_price){//处理
                let params = {
                    id: this.curId,
                    status: 1,
                    modify_price_type: type,
                    modify_price: modify_price,
                    lowest_price: lowest_price,
                };
                this.$http(api_heel_sale_complain_deal_with,params).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.dialogShow = false;
                    this.init()
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            delete_item(row){//----单个删除
                this.delete_way(row.id)
            },
            batch_delete(){//----批量删除
                let params = this.selectList.map(row => row.id).join(',');
                this.delete_way(params)
            },
            delete_way(val){
                this.$confirm(this.$t('ymx-follow.sure_delete'), this.$t('ymx-detail.tips'), {
                    confirmButtonText: this.$t('ymx-detail.confirm'),
                    cancelButtonText: this.$t('ymx-detail.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.$http(api_heel_sale_complain_delete, {ids: val}).then(res => {
                        this.$message({type: 'success', message: res.message});
                        this.init()
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message||code})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('ymx-follow.cance_delete')
                    });
                });
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
        },
        components: {
            search:require('./search.vue').default,
            tableData:require('./table-data').default,
            dealWithDialog:require('./deal-with-dialog').default
        }
    }
</script>
