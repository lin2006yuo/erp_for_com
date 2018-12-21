<template>
    <div>
        <published-draft-search
                @search-list="search_list"
                :searchData="searchData"
                :clearsData="clearsData"
                :accountList="accountList"></published-draft-search>
        <div class="ml-sm mt-sm mb-sm">
            <permission tag="request-button" req-key="batchDelete"
                        :min-time="200"
                        :time-out="3000"
                        @click="batch_delete"
                        :route="apis.url_amazon_draft_delete">{{$t('ymx-list.batchDel')}}</permission>
        </div>
        <published-draft-list :table-data="tableData"
                              :loading="loading"
                              :accountList="accountList"
                              @size-change="size_change"
                              @selection-change="selection_change"
                              @current-change="current_change"></published-draft-list>
    </div>
</template>

<style lang="stylus">

</style>
<script>
    import {api_amazon_draft_delete,url_amazon_draft_delete,api_get_amazon_account,api_amazon_draft_list} from '@/api/amazon-publish-list';
    export default{
        permission:{
            url_amazon_draft_delete
        },
        data(){
            return {
                loading:false,
                tableData:{
                    lists:[],
                    page:1,
                    pageSize:50,
                    total:0
                },
                searchData:{
                    type:'spu',
                    content:'',
                    account_id:'',
                    time_start:'',
                    time_end:'',
                },
                clearsData:{
                    type:'spu'
                },
                accountList:[],
                ids:[],
            }
        },
        mounted(){
            this.init();
            this.get_account();
        },
        methods: {
            selection_change(selection){
                this.ids = selection.map(row=>row.id)
            },
            batch_delete(){
                if(this.ids.length<=0){
                    this.$reqKey('batchDelete',false);
                    return this.$message({type:'warning',message:this.$t('ymx-list.delTip')});
                }
                this.$confirm(this.$t('ymx-list.confirm'),this.$t('ymx-list.tips'),{
                    confirmButtonText: this.$t('common.confirm'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(()=>{
                    let params = {
                        draft_ids:this.ids.join(','),
                    };
                    this.$http(api_amazon_draft_delete,params).then(res => {
                        this.$message({type:'success',message:res.message||res});
                        this.ids.forEach(row=>{
                            let findIndex = this.tableData.lists.findIndex(item=>Number(item.id)===Number(row));
                            if(findIndex>-1)this.tableData.lists.splice(findIndex,1);
                        });
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    }).finally(()=>{
                        this.$reqKey('batchDelete',false);
                    })
                }).catch(code=>{
                    this.$reqKey('batchDelete',false);
                });
            },
            search_list(){
                this.init();
            },
            init(){
                let params = clone(this.searchData);
                params.content = params.content.trim();
                this.loading = true;
                this.$set(params,'page',this.tableData.page);
                this.$set(params,'pageSize',this.tableData.pageSize);
                this.$http(api_amazon_draft_list,params).then(res => {
                    this.tableData.lists = res.lists;
                    this.tableData.total = res.count;
                }).catch(code => {
                    console.log(code);
                }).finally(()=>{
                    this.loading = false;
                })
            },
            size_change(pageSize){
                this.tableData.pageSize = pageSize;
                this.init();
            },
            current_change(page){
                this.tableData.page = page;
                this.init();
            },
            get_account(){
                this.$http(api_get_amazon_account).then(res => {
                    this.accountList = res;
                }).catch(code => {
                    console.log(code,'code');
                })
            },
        },
        props: {},
        components: {
            publishedDraftSearch:require('./published-draft-search').default,
            publishedDraftList:require('./published-draft-list').default,
        }
    }
</script>

