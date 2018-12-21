<template>
    <page>
        <card-search :form="form" :clears="clears" @search="search"></card-search>
        <table-list class="mt-sm" :table="table" :first-time="firstTime" :loading="loading"></table-list>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page=table.page
                :page-sizes="[20,50,100,200,500]"
                :page-size=table.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total='table.total'>
        </el-pagination>
    </page>
</template>

<style scoped>

</style>

<script>
    import {api_server_network} from  '@/api/server-usage-record'
    export default {
        page:{
            devinfo:{
                frontEnd:'陆城锫',
                backEnd:'翟雪丽',
                createTime:'2018-11-30',
                updateTime:''
            }
        },
        data() {
            return {
                form: {
                    snText:'',
                    snType:'name'
                },
                loading:false,
                firstTime:true,
                table:{
                    list:[],
                    page:null,
                    pageSize:null,
                    total:0
                },
                page:1,
                pageSize:20,
                clears:{
                    snText:'',
                    snType:'name'
                }
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            search() {
                this.init()
            },
            init(){
                this.loading= true;
                let data = window.clone(this.form);
                this.$set(data,'page',this.page);
                this.$set(data,'pageSize',this.pageSize);
                this.$http(api_server_network,data).then(res=>{
                    this.loading = false;
                    this.firstTime= false;
                    this.table.list= res.data.reverse();
                    this.table.page = Number(res.page);
                    this.table.pageSize = Number(res.pageSize);
                    this.table.total = res.count;
                }).catch(err=>{
                    console.log(err)
                })
            },
            handleCurrentChange(val){
                this.page = val;
                this.init()
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.init()
            },
        },
        components:{
            cardSearch:require('./card-search').default,
            tableList:require('./table-list').default
        }
    }
</script>

