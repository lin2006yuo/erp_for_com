<template>
    <page class="p-index">
        <search :searchData="searchData"
                :clears="clears"
                :site-list="siteList"
                @search="search"></search>
        <div class="mt-xs mb-xs ml-sm">
            <el-button type="primary" size="mini" class="inline" @click.native="add">{{$t('ymx-heel-sale-list.addBtn')}}</el-button>
        </div>
        <table-data :table-data="tableData"
                    :loading="loading"
                    :first-loading="firstLoading"
                    @current-change="current_change"
                    @size-change="size_change"></table-data>
        <batch-heel-sale v-model="dialogShow" @close="close"></batch-heel-sale>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_heel_sale_list} from '@/api/heel-sale-list';
    import {api_get_amazon_site} from '../../../../api/product-category-api';
    export default{
        page: {
              devinfo: {
                  frontEnd: '钱宇琨',
                  backEnd: '郝龙飞',
                  createdTime: '2018-10-12',
                  updateTime: '2018-10-12'
              }
        },
        refresh(){
            this.init();
        },
        data(){
            return{
                searchData:{
                    search_type:1,
                    search_content:'',
                    site:'',
                    account_id:'',
                    status:'',
                    star_time:'',
                    end_time:'',
                    page: 1,
                    pageSize: 50
                },
                clears:{},
                siteList:[{label:this.$t('ymx-heel-sale-list.all'), value: ''}],
                loading: false,
                firstLoading: true,
                tableData:{
                    lists:[],
                    total:0,
                    page:1,
                    pageSize:50
                },
                dialogShow:false
            }
        },
        mounted(){
            this.init();
            this.get_site()
        },
        methods:{
            search(){
                this.init();
            },
            add(){
                this.dialogShow = true
            },
            close(){
                this.init()
            },
            init(){
                this.loading = true;
                let data = clone(this.searchData);
                let splitText = this.split_search(data.search_content);
                data.search_content = splitText&&splitText.length?splitText.map(row=>row.trim()):'';
                data.page = this.tableData.page;
                data.pageSize = this.tableData.pageSize;
                this.$http(api_heel_sale_list,data).then(res => {
                    this.tableData.lists = res.data;
                    this.tableData.total = res.count;
                    this.tableData.page = Number(res.page);
                    this.tableData.pageSize = Number(res.pageSize);
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code => {
                    console.log(code);
                })
            },
            split_search(data){
                let curString = data.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                return cur
            },
            //获取站点数据
            get_site(){
                this.$http(api_get_amazon_site).then(res => {
                    this.siteList = [{label: this.$t('ymx-heel-sale-list.all'), value: ""}, ...res.site];
                }).catch(code => {
                    console.log(code);
                })
            },
            current_change(page){
                this.tableData.page = page;
                this.init()
            },
            size_change(size){
                this.tableData.pageSize = size;
                this.init()
            },
        },
        components:{
            search:require('./search.vue').default,
            tableData:require('./table-data').default,
            batchHeelSale:require('./batch-heel-sale').default
        }
    }
</script>