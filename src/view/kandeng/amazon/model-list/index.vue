<template>
    <page class="p-index">
        <search @search-data="search_data" :search-data="searchData" :clears="clears" ></search>
        <div class="mt-sm mb-sm ml-sm">
            <el-button type="primary" size="mini"
                       @click.native='add_model' class="inline">添加范本</el-button>
            <el-button type="primary" size="mini"
                       @click.native='batch_delete' class="inline">批量删除</el-button>
        </div>
        <table-data :table-obj="tableObj"
                    :first-loading="firstLoading"
                    @current-change="current_change"
                    @size-change="size_change"></table-data>
        <add-model v-model="addDialog"></add-model>

    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_publish_amazon_doc,api_publish_amazon_doc_del} from '@/api/product-category-api';
    export default {
        data() {
            return {
                tableObj:{
                    tableData:[],
                    pageSize:50,
                    page:1,
                    total:0,
                    loading:false,
                },
                searchData:{
                    snType:'spu',
                    snText:'',
                    creator_id:'',
                    developer_id:''
                },
                clears:{
                    snType:'spu',
                },
                addDialog:false,
                firstLoading: true
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            search_data(){
                this.init();
            },
            init(){
                let params = {};
                Object.assign(params,this.searchData);
                this.$set(params,'page',this.tableObj.page);
                this.$set(params,'pageSize',this.tableObj.pageSize);
                if(params.snText){
                    let curString = params.snText.replace(new RegExp(' ', 'gm'), '\n');
                    let cur = curString.split('\n').filter(row => !!row);
                    params.snText = cur.map(row => {
                        return row.trim();
                    });
                }
                this.tableObj.loading = true;
                this.$http(api_publish_amazon_doc,params).then(res => {
                    res.data.forEach(row=>{
                        this.$set(row,'isCheck',false);
                        this.$set(row,'isShow',false);
                    });
                    this.tableObj.tableData = res.data;
                    this.tableObj.total = res.count;
                    this.tableObj.loading = false;
                    this.firstLoading = false
                }).catch(code => {
                    this.tableObj.loading = false;
                    this.$message({type:'error',message:code.message||code});
                })
            },
            current_change(page){
                this.tableObj.page = page;
                this.init();
            },
            size_change(size){
                this.tableObj.pageSize = size;
                this.init();
            },
            add_model(){
                this.addDialog = true;
            },
            batch_delete(){
                let ids = this.tableObj.tableData.filter(row=>row.isCheck).map(row=>row.id);
                console.log(ids,'ids');
                if(ids.length<=0)return this.$message({type:'warning',message:'请勾选需要批量删除的数据'});
                this.$confirm(`此操作将删除当前范本，确认此操作吗？`,"提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(()=>{
                    this.$http(api_publish_amazon_doc_del,{ids:ids.join(',')}).then(res => {
                        this.$message({type:'success',message:res.message||res});
                        ids.forEach(row=>{
                            let index = this.tableObj.tableData.findIndex(item=>row===item.id);
                            if(index>-1) this.tableObj.tableData.splice(index,1);
                        });
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code})
                    })
                });
            },
        },
        components: {
            search:require('./search.vue').default,
            tableData:require('./table-data.vue').default,
            addModel:require('./add-model.vue').default,
        }
    }
</script>