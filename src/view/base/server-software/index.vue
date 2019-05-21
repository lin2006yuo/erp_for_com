<template>
    <page>
        <search :search-data="searchData"
                :clears="clears"
                @select-type="select_type"
                @select-level="select_level"
                @search="init">
        </search>
        <table-list :loading="loading"
                    :table-data="tableData"
                    @refresh="init"
                    @page="change_page"
                    @size="change_size">
        </table-list>
    </page>
</template>

<style lang="stylus">

</style>

<script>
    import {api_get_server_software_list} from '@/api/server-software';
    import datef from 'datef'
    export default {
        name: "index",
        data() {
            return {
                searchData:{
                    software_type:'',
                    status:'',
                    name:'',
                    time_start:(Date.now() - (15 * 24 * 60 * 60 * 1000)),
                    time_end:Date.now(),

                },
                clears:{
                    software_type:'',
                    status:'',
                    name:'',
                    time_start:(Date.now() - (15 * 24 * 60 * 60 * 1000)),
                    time_end:Date.now(),
                },
                loading:false,
                tableData:{
                    data:[],
                    count:0,
                    page:1,
                    pageSize:50
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            select_type(type){
                this.searchData.software_type=type.value;
                this.init();
            },
            select_level(level){
                this.searchData.status=level.value;
                this.init();
            },
            init(){
                this.loading=true;
                let data=window.clone(this.searchData);
                this.searchData.time_start&&(data.time_start=datef('YYYY-MM-dd',this.searchData.time_start));
                this.searchData.time_end&&(data.time_end=datef('YYYY-MM-dd',this.searchData.time_end));
                if(this.searchData.software_type===''){
                    delete data.software_type;
                }
                if(this.searchData.status===''){
                    delete data.status;
                }
                this.$set(data,'page',this.tableData.page);
                this.$set(data,'pageSize',this.tableData.pageSize);
                this.$http(api_get_server_software_list,data).then(res=>{
                    res.data.forEach(row=>{
                        let type;
                        switch (row.software_type){
                            case '':
                                type='--';
                                break;
                            case 0:
                                type='账号app';
                                break;
                            case 1:
                                type='打印软件';
                                break;
                            case 2:
                                type='服务软件';
                                break;
                        }
                        this.$set(row,'software_type',type);
                    });
                    res.page=Number(res.page);
                    res.pageSize=Number(res.pageSize);
                    this.tableData=JSON.parse(JSON.stringify(res));
                    this.loading=false;
                }).catch( error =>{
                    this.loading=false;
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            change_page(page){
                this.$set(this.tableData,'page',page);
                this.init();
            },
            change_size(size){
                this.$set(this.tableData,'pageSize',size);
                this.init();
            }
        },
        components: {
            search:require('./search').default,
            tableList:require('./table-list').default
        },
    }
</script>

